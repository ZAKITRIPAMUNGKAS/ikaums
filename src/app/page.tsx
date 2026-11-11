'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { getAlumniList, getKegiatanList } from '@/data/simulasi';
import { WILAYAH_JABODETABEK, normalizeIndonesianWhatsApp } from '@/data/ums-prodi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Share2,
  ChevronDown,
} from 'lucide-react';

const HARI_COCOK_OPTIONS = [
  'Sabtu pagi (09.00–12.00 WIB)',
  'Sabtu sore (15.00–18.00 WIB)',
  'Minggu pagi (09.00–12.00 WIB)',
  'Hari kerja malam (19.00+ WIB)',
];

const KOPDAR_INTEREST_KEY = 'ikaums_kopdar_interest';

export default function HomePage() {
  const demoMentors = getAlumniList().filter((a) => a.bersediaMentoring).slice(0, 3);
  const demoEvents = getKegiatanList();

  // Form minat kopdar pertama
  const [kopdarForm, setKopdarForm] = useState({
    nama: '',
    wilayah: 'Jakarta Selatan',
    hariCocok: HARI_COCOK_OPTIONS[0],
    whatsapp: '',
    website: '', // honeypot
  });
  const [kopdarErrors, setKopdarErrors] = useState<{
    nama?: string;
    whatsapp?: string;
    form?: string;
  }>({});
  const [kopdarSubmitting, setKopdarSubmitting] = useState(false);
  const [kopdarSuccessWa, setKopdarSuccessWa] = useState('');
  const [kopdarSubmitted, setKopdarSubmitted] = useState(false);
  const submittingRef = useRef(false);

  const handleKopdarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    if (kopdarForm.website.trim().length > 0) {
      setKopdarErrors({ form: 'Permintaan tidak dapat diproses. Muat ulang halaman lalu coba lagi.' });
      return;
    }

    const errors: { nama?: string; whatsapp?: string } = {};
    if (kopdarForm.nama.trim().length < 3) {
      errors.nama = 'Tuliskan nama lengkapmu minimal 3 huruf.';
    }
    const validWa = normalizeIndonesianWhatsApp(kopdarForm.whatsapp);
    if (!validWa) {
      errors.whatsapp = 'Masukkan nomor WhatsApp yang valid, misalnya 081234567890.';
    }

    if (Object.keys(errors).length > 0) {
      setKopdarErrors(errors);
      return;
    }

    submittingRef.current = true;
    setKopdarSubmitting(true);
    setKopdarErrors({});

    setTimeout(() => {
      try {
        const raw = localStorage.getItem(KOPDAR_INTEREST_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.push({
          nama: kopdarForm.nama.trim(),
          wilayah: kopdarForm.wilayah,
          hariCocok: kopdarForm.hariCocok,
          whatsapp: validWa,
        });
        localStorage.setItem(KOPDAR_INTEREST_KEY, JSON.stringify(list));
      } catch {
        // Abaikan error penyimpanan lokal
      }

      setKopdarSuccessWa(validWa!);
      setKopdarSubmitting(false);
      submittingRef.current = false;
      setKopdarSubmitted(true);
    }, 220);
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Rekan alumni UMS di Jabodetabek, pendataan awal anggota & usulan jadwal kopdar pertama IKA UMS Wilayah Jabodetabek sudah dibuka: https://ikaums.vercel.app/gabung`
  )}`;

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* 1. HERO — Janji jelas, SATU CTA utama, foto dokumentasi tunggal */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold text-[#92400E] bg-[#FEF3C7]/75 border border-[#B45309]/20 px-3 py-1 rounded-full">
                <span>Pendataan Awal · IKA UMS Wilayah Jabodetabek</span>
                {IS_DEMO_MODE && <span className="underline">({DEMO_BADGE_LABEL})</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-[#0C2340] leading-[1.12]">
                Jaringan Alumni UMS di Wilayah Jabodetabek
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl">
                Temukan sesama lulusan Universitas Muhammadiyah Surakarta yang tinggal atau bekerja
                di sekitarmu. Mulai dari kopdar wilayah, ulas CV dan persiapan kerja, hingga info
                lowongan antaralumni.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pt-1">
                <Link
                  href="/gabung"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#0C2340] hover:bg-[#16325C] text-white text-sm sm:text-base font-semibold transition-colors shadow-xs"
                >
                  <span>Daftar jadi anggota</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </Link>
                <Link
                  href="/masuk"
                  className="inline-flex items-center justify-center sm:justify-start min-h-[44px] px-2 text-sm font-semibold text-[#0C2340] hover:text-[#B45309] underline underline-offset-4 transition-colors"
                >
                  Sudah terdaftar? Masuk
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-[#475569] pt-1">
                Status pendataan saat ini:{' '}
                <span className="font-semibold text-[#0C2340]">
                  {COMMUNITY_PLACEHOLDERS.coordinatorCount}
                </span>
              </p>
            </div>

            <div className="lg:col-span-6">
              <figure className="bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden shadow-xs">
                <div className="aspect-[16/10] w-full bg-[#F3F1EA] relative overflow-hidden">
                  <Image
                    src="/images/alumni-gathering-4.jpg"
                    alt="Pertemuan alumni Universitas Muhammadiyah Surakarta di Jabodetabek"
                    width={1200}
                    height={750}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs sm:text-sm text-[#475569] border-t border-[#0C2340]/10 leading-relaxed">
                  {COMMUNITY_PLACEHOLDERS.documentationCaption}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 2. APA YANG KAMU DAPAT — Tata letak garis editorial tanpa kartu berat */}
        <section
          aria-labelledby="manfaat-heading"
          className="border-t border-[#0C2340]/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="mb-8 sm:mb-10 max-w-xl">
            <h2 id="manfaat-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2340]">
              Apa yang Kamu Dapatkan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="pt-4 border-t-2 border-[#0C2340] space-y-2">
              <h3 className="text-lg font-bold text-[#0C2340]">
                Kenalan Satu Wilayah
              </h3>
              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                Temukan alumni lintas fakultas dan angkatan di sekitar wilayah tinggal atau
                kantormu di Jakarta, Bogor, Depok, Tangerang, maupun Bekasi.
              </p>
            </div>

            <div className="pt-4 border-t-2 border-[#B45309] space-y-2">
              <h3 className="text-lg font-bold text-[#0C2340]">
                Mentoring CV &amp; Interview
              </h3>
              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                Jadwalkan diskusi singkat dengan senior yang bekerja di bidang sejenis untuk
                membahas portofolio, pindah industri, atau persiapan wawancara kerja.
              </p>
            </div>

            <div className="pt-4 border-t-2 border-[#0C2340]/40 space-y-2">
              <h3 className="text-lg font-bold text-[#0C2340]">
                Info Kerja &amp; Usaha Antaralumni
              </h3>
              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                Akses informasi kebutuhan tim, lowongan internal perusahaan alumni, serta peluang
                kerja sama usaha yang dibagikan secara langsung.
              </p>
            </div>
          </div>
        </section>

        {/* 3. CARA KERJANYA — Strip datar berlatar krem hangat */}
        <section
          aria-labelledby="cara-kerja-heading"
          className="bg-[#F3F1EA] border-y border-[#0C2340]/10 py-12 sm:py-14"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="cara-kerja-heading" className="text-2xl font-bold tracking-tight text-[#0C2340] mb-8">
              Cara Kerjanya
            </h2>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <li className="space-y-1.5">
                <p className="text-xs font-bold text-[#92400E] tracking-wider uppercase">
                  Langkah 01
                </p>
                <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                  Isi Pendaftaran Singkat
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Masukkan nama lengkap, tahun masuk, prodi UMS, wilayah Jabodetabek, dan nomor WhatsApp aktif.
                </p>
              </li>

              <li className="space-y-1.5">
                <p className="text-xs font-bold text-[#92400E] tracking-wider uppercase">
                  Langkah 02
                </p>
                <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                  Verifikasi &amp; Pilih Wilayah
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Pengurus mencocokkan data alumnimu dan mencatat wilayah domisili tanpa memajang kontak pribadimu ke publik.
                </p>
              </li>

              <li className="space-y-1.5">
                <p className="text-xs font-bold text-[#92400E] tracking-wider uppercase">
                  Langkah 03
                </p>
                <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                  Terima Kabar Kopdar Pertama
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Begitu jadwal pertemuan di wilayahmu ditetapkan, pengurus mengirimkan undangan lokasi lewat WhatsApp.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* 4. KOPDAR PERTAMA — Form minat wilayah + hari yang cocok (menggantikan 9 kartu panjang) */}
        <section
          id="kopdar"
          aria-labelledby="kopdar-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 id="kopdar-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2340]">
                Usulkan Minat Kopdar Pertama
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Jadwal kopdar perdana tiap wilayah disusun berdasarkan domisili dan waktu luang terbanyak dari pendaftar awal. Pilih wilayah dan hari yang paling cocok buat kamu.
              </p>

              <div className="bg-white border border-[#0C2340]/12 rounded-xl p-4 sm:p-5 space-y-2 text-sm">
                <p className="font-bold text-[#0C2340] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span>Jadwal &amp; Lokasi Terdekat</span>
                </p>
                <p className="text-[#475569]">
                  Tanggal: <strong className="text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.firstKopdarDate}</strong>
                </p>
                <p className="text-[#475569] flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                  <span>{COMMUNITY_PLACEHOLDERS.firstKopdarLocation}</span>
                </p>
              </div>

              {IS_DEMO_MODE && demoEvents.length > 0 && (
                <div className="bg-[#F3F1EA] border border-[#0C2340]/12 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0C2340]">Pratinjau Jadwal</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-[11px] font-semibold">
                      {DEMO_BADGE_LABEL}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#0C2340]">{demoEvents[0].judul}</p>
                  <p className="text-xs text-[#475569]">{demoEvents[0].tanggalWIB} · {demoEvents[0].wilayah}</p>
                </div>
              )}

              <div>
                <Link
                  href="/kegiatan"
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0C2340] hover:text-[#B45309] transition-colors"
                >
                  Lihat halaman Jadwal Kopdar
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
              {!kopdarSubmitted ? (
                <form onSubmit={handleKopdarSubmit} className="space-y-4" noValidate>
                  {/* Honeypot */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="kopdar-website">Kosongkan kolom ini</label>
                    <input
                      id="kopdar-website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={kopdarForm.website}
                      onChange={(e) => setKopdarForm({ ...kopdarForm, website: e.target.value })}
                    />
                  </div>

                  {kopdarErrors.form && (
                    <div
                      role="alert"
                      className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{kopdarErrors.form}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="kopdar-wilayah" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                        Wilayah Domisili
                      </label>
                      <select
                        id="kopdar-wilayah"
                        value={kopdarForm.wilayah}
                        onChange={(e) => setKopdarForm({ ...kopdarForm, wilayah: e.target.value })}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] text-sm text-[#0C2340]"
                      >
                        {WILAYAH_JABODETABEK.map((reg) => (
                          <option key={reg.id} value={reg.nama}>
                            {reg.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="kopdar-hari" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                        Hari &amp; Waktu yang Cocok
                      </label>
                      <select
                        id="kopdar-hari"
                        value={kopdarForm.hariCocok}
                        onChange={(e) => setKopdarForm({ ...kopdarForm, hariCocok: e.target.value })}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] text-sm text-[#0C2340]"
                      >
                        {HARI_COCOK_OPTIONS.map((hari) => (
                          <option key={hari} value={hari}>
                            {hari}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="kopdar-nama" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                        Nama Lengkap <span className="text-[#B45309]">*</span>
                      </label>
                      <input
                        id="kopdar-nama"
                        type="text"
                        autoComplete="name"
                        required
                        aria-invalid={Boolean(kopdarErrors.nama)}
                        placeholder="Nama panggilan atau lengkap"
                        value={kopdarForm.nama}
                        onChange={(e) => {
                          setKopdarForm({ ...kopdarForm, nama: e.target.value });
                          if (kopdarErrors.nama) setKopdarErrors((prev) => ({ ...prev, nama: undefined }));
                        }}
                        className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#FDFCF7] border text-sm text-[#0C2340] ${
                          kopdarErrors.nama ? 'border-red-500' : 'border-[#0C2340]/20 focus:border-[#0C2340]'
                        }`}
                      />
                      {kopdarErrors.nama && (
                        <p className="mt-1 text-xs text-red-700 font-medium">{kopdarErrors.nama}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="kopdar-wa" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                        Nomor WhatsApp <span className="text-[#B45309]">*</span>
                      </label>
                      <input
                        id="kopdar-wa"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        aria-invalid={Boolean(kopdarErrors.whatsapp)}
                        placeholder="081234567890"
                        value={kopdarForm.whatsapp}
                        onChange={(e) => {
                          setKopdarForm({ ...kopdarForm, whatsapp: e.target.value });
                          if (kopdarErrors.whatsapp) setKopdarErrors((prev) => ({ ...prev, whatsapp: undefined }));
                        }}
                        className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#FDFCF7] border text-sm text-[#0C2340] ${
                          kopdarErrors.whatsapp ? 'border-red-500' : 'border-[#0C2340]/20 focus:border-[#0C2340]'
                        }`}
                      />
                      {kopdarErrors.whatsapp && (
                        <p className="mt-1 text-xs text-red-700 font-medium">{kopdarErrors.whatsapp}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-[#475569]">
                      Nomor WhatsApp hanya dipakai pengurus untuk mengabari jadwal kopdar wilayah ini.
                    </p>
                    <button
                      type="submit"
                      disabled={kopdarSubmitting}
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#16325C] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      <span>{kopdarSubmitting ? 'Mencatat minat...' : 'Kirim minat kopdar'}</span>
                      <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#0C2340]">
                      Minat Kopdar {kopdarForm.wilayah} Tercatat
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed max-w-md mx-auto">
                      Terima kasih, {kopdarForm.nama}. Preferensi waktumu ({kopdarForm.hariCocok}) telah
                      dicatat. Pengurus wilayah akan mengabari WhatsApp <strong>{kopdarSuccessWa}</strong> saat
                      lokasi dan tanggal kopdar ditetapkan.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-1">
                    <a
                      href={whatsappShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] text-white text-xs sm:text-sm font-semibold"
                    >
                      <Share2 className="w-4 h-4 text-[#F59E0B]" />
                      Ajak alumni lewat WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setKopdarSubmitted(false)}
                      className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-xs sm:text-sm font-semibold cursor-pointer"
                    >
                      Ubah pilihan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. DOKUMENTASI PERTEMUAN */}
        <section
          aria-labelledby="dokumentasi-heading"
          className="border-t border-[#0C2340]/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#F3F1EA] border border-[#0C2340]/12 relative">
                <Image
                  src="/images/hero-kumpul-bolo-pisah.jpg"
                  alt="Dokumentasi kumpul alumni Universitas Muhammadiyah Surakarta"
                  width={1200}
                  height={675}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <h2 id="dokumentasi-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2340]">
                Dokumentasi Pertemuan Alumni
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                {COMMUNITY_PLACEHOLDERS.documentationCaption}
              </p>
              <p className="text-sm text-[#475569] leading-relaxed">
                Foto kegiatan tiap wilayah akan terus dilengkapi seiring bergulirnya kopdar pertama
                di sembilan wilayah Jabodetabek.
              </p>
              <Link
                href="/peta"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0C2340] hover:text-[#B45309] transition-colors"
              >
                Lihat cakupan 9 wilayah Jabodetabek
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. MENTORING ALUMNI — Dua tombol jelas (Cari Mentor & Daftar Jadi Mentor) */}
        <section
          aria-labelledby="mentoring-heading"
          className="bg-[#F3F1EA] border-y border-[#0C2340]/10 py-14"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2.5">
                <h2 id="mentoring-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2340]">
                  Mentoring Alumni
                </h2>
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  Lulusan baru bisa meminta masukan CV dan persiapan wawancara, sementara alumni
                  berpengalaman bisa mendaftarkan diri sebagai mentor sukarela di bidang masing-masing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/peluang#mentoring"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
                >
                  Cari Mentor
                </Link>
                <Link
                  href="/gabung?mentor=ya"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-white border border-[#0C2340]/20 hover:border-[#0C2340]/45 text-[#0C2340] text-sm font-semibold transition-colors"
                >
                  Daftar Jadi Mentor
                </Link>
              </div>
            </div>

            {IS_DEMO_MODE && demoMentors.length > 0 && (
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-xs font-semibold">
                  {DEMO_BADGE_LABEL}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {demoMentors.map((m) => (
                    <div key={m.id} className="bg-white border border-[#0C2340]/12 rounded-xl p-5 space-y-1.5">
                      <h3 className="text-base font-bold text-[#0C2340]">{m.nama}</h3>
                      <p className="text-xs text-[#475569]">
                        {m.prodi} &apos;{String(m.angkatan).slice(-2)} · {m.wilayah}
                      </p>
                      <p className="text-sm text-[#0C2340] font-medium pt-1">
                        {m.mentoringFokus || m.pekerjaan}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 7. FAQ PENDEK — Pertanyaan yang sering diajukan alumni sebelum mendaftar */}
        <section
          aria-labelledby="faq-heading"
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
        >
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2340] mb-6">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="divide-y divide-[#0C2340]/12 border-y border-[#0C2340]/12">
            <details className="group py-2">
              <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-sm sm:text-base text-[#0C2340] cursor-pointer">
                <span>Apakah bergabung di IKA UMS Jabodetabek berbayar?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm text-[#475569] leading-relaxed">
                Gratis. Pendaftaran keanggotaan dan partisipasi awal komunitas tidak memungut iuran wajib.
              </p>
            </details>

            <details className="group py-2">
              <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-sm sm:text-base text-[#0C2340] cursor-pointer">
                <span>Apakah nomor WhatsApp dan email saya ditampilkan terbuka?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm text-[#475569] leading-relaxed">
                Tidak. Nomor WhatsApp dan email disimpan tertutup untuk verifikasi pengurus serta info
                kopdar. Saat mendaftar, pilihan tampil di Daftar Anggota juga bawaan Tidak aktif
                kecuali kamu menyetujuinya sendiri. Selengkapnya di{' '}
                <Link href="/privasi" className="font-semibold text-[#0C2340] underline underline-offset-4">
                  Kebijakan Privasi
                </Link>.
              </p>
            </details>

            <details className="group py-2">
              <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-sm sm:text-base text-[#0C2340] cursor-pointer">
                <span>Siapa yang mengelola komunitas ini?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm text-[#475569] leading-relaxed">
                Komunitas dikelola oleh tim pengurus wilayah dan koordinator dari 9 kota/kabupaten di
                Jabodetabek. Susunan jabatan dan kontak resmi tersedia di halaman{' '}
                <Link href="/kepengurusan" className="font-semibold text-[#0C2340] underline underline-offset-4">
                  Pengurus &amp; Kontak
                </Link>.
              </p>
            </details>

            <details className="group py-2">
              <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-sm sm:text-base text-[#0C2340] cursor-pointer">
                <span>Bagaimana hubungannya dengan IKA UMS Pusat?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm text-[#475569] leading-relaxed">
                Jaringan ini ditujukan sebagai simpul wilayah Jakarta, Bogor, Depok, Tangerang, dan
                Bekasi bagi alumni Universitas Muhammadiyah Surakarta ({COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}).
                Informasi lanjut mengenai koordinasi resmi tersedia di halaman{' '}
                <Link href="/tentang" className="font-semibold text-[#0C2340] underline underline-offset-4">
                  Tentang Komunitas
                </Link>.
              </p>
            </details>
          </div>
        </section>

        {/* 8. CTA PENUTUP */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="bg-[#0C2340] text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ikut Mendata Dirimu di Wilayah Jabodetabek
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Semakin lengkap data awal tiap kota dan kabupaten, semakin cepat jadwal kopdar
                perdana dan grup wilayah dapat disusun bersama.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/gabung"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0C2340] text-sm font-bold transition-colors"
              >
                Daftar jadi anggota
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kepengurusan"
                className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 rounded-xl border border-white/25 hover:bg-white/10 text-white text-sm font-semibold transition-colors"
              >
                Hubungi pengurus
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

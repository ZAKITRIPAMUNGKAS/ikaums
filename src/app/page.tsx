'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { getAlumniList, getKegiatanList } from '@/data/simulasi';
import { WILAYAH_JABODETABEK, normalizeIndonesianWhatsApp } from '@/data/ums-prodi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { PatternSection, PatternDivider } from '@/components/PatternSection';
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

      <main className="flex-grow page-grain-base">
        {/* 1. HERO - pattern-batik memudar ke sisi kanan, area teks kiri bersih, SATU CTA utama */}
        <PatternSection
          variant="batik"
          tone="light"
          fade="right-focus"
          patternOpacity={0.075}
          patternSize="64px"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-10 lg:pt-16 lg:pb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <span className="inline-block text-sm font-semibold tracking-wide text-[#92400E]">
                Pendataan Awal · IKA UMS Wilayah Jabodetabek
                {IS_DEMO_MODE && ` (${DEMO_BADGE_LABEL})`}
              </span>

              <h1 className="text-[clamp(1.875rem,1.35rem+2.2vw,2.75rem)] font-extrabold tracking-[-0.025em] text-[#0C2340] leading-[1.12]">
                Jaringan Alumni UMS di Wilayah Jabodetabek
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-[1.6] max-w-[42ch] sm:max-w-xl">
                Temukan sesama lulusan Universitas Muhammadiyah Surakarta yang tinggal atau bekerja
                di sekitarmu. Mulai dari kopdar wilayah, ulas CV dan persiapan kerja, hingga info
                lowongan antaralumni.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pt-1">
                <Link
                  href="/gabung"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] text-white text-base font-semibold transition-all duration-150 shadow-xs"
                >
                  <span>Daftar jadi anggota</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </Link>
                <Link
                  href="/masuk"
                  className="inline-flex items-center justify-center sm:justify-start min-h-[44px] px-3 text-base font-semibold text-[#0C2340] hover:text-[#92400E] underline underline-offset-4 transition-colors"
                >
                  Sudah terdaftar? Masuk
                </Link>
              </div>

              <p className="text-base text-[#475569] leading-[1.6] pt-1 max-w-[42ch] sm:max-w-none">
                Status pendataan saat ini:{' '}
                <span className="font-semibold text-[#0C2340]">
                  {COMMUNITY_PLACEHOLDERS.coordinatorCount}
                </span>
              </p>
            </div>

            <div className="lg:col-span-6">
              <figure className="surface-card rounded-xl overflow-hidden">
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
                <figcaption className="px-4 py-3 text-sm text-[#475569] border-t border-[#0C2340]/10 leading-relaxed bg-[#FDFCF7]">
                  {COMMUNITY_PLACEHOLDERS.documentationCaption}
                </figcaption>
              </figure>
            </div>
          </div>
        </PatternSection>

        <PatternDivider variant="curve" fromColor="#FDFCF7" toColor="#F3F1EA" />

        {/* 2. APA YANG KAMU DAPAT - tata letak split editorial dengan daftar bertipografi bersih */}
        <PatternSection
          aria-labelledby="manfaat-heading"
          variant="dots"
          tone="tint"
          fade="soft-edges"
          patternOpacity={0.06}
          patternSize="24px"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 space-y-3">
              <h2 id="manfaat-heading" className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]">
                Apa yang Kamu Dapatkan
              </h2>
              <p className="text-base text-[#475569] leading-[1.6] max-w-[40ch]">
                Tiga kebutuhan utama yang disiapkan agar jaringan alumni di perantauan mudah diakses sehari-hari.
              </p>
            </div>

            <dl className="lg:col-span-8 divide-y divide-[#0C2340]/15 border-y border-[#0C2340]/15">
              <div className="py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline">
                <dt className="sm:col-span-4 text-lg font-bold text-[#0C2340]">
                  Kenalan Satu Wilayah
                </dt>
                <dd className="sm:col-span-8 text-base text-[#475569] leading-[1.6] max-w-[52ch]">
                  Temukan alumni lintas fakultas dan angkatan di sekitar wilayah tinggal atau
                  kantormu di Jakarta, Bogor, Depok, Tangerang, maupun Bekasi.
                </dd>
              </div>

              <div className="py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline">
                <dt className="sm:col-span-4 text-lg font-bold text-[#0C2340]">
                  Mentoring CV &amp; Interview
                </dt>
                <dd className="sm:col-span-8 text-base text-[#475569] leading-[1.6] max-w-[52ch]">
                  Jadwalkan diskusi singkat dengan senior yang bekerja di bidang sejenis untuk
                  membahas portofolio, pindah industri, atau persiapan wawancara kerja.
                </dd>
              </div>

              <div className="py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline">
                <dt className="sm:col-span-4 text-lg font-bold text-[#0C2340]">
                  Info Kerja &amp; Usaha Antaralumni
                </dt>
                <dd className="sm:col-span-8 text-base text-[#475569] leading-[1.6] max-w-[52ch]">
                  Akses informasi kebutuhan tim, lowongan internal perusahaan alumni, serta peluang
                  kerja sama usaha yang dibagikan secara langsung.
                </dd>
              </div>
            </dl>
          </div>
        </PatternSection>

        <PatternDivider variant="curve" fromColor="#F3F1EA" toColor="#FDFCF7" />

        {/* 3. CARA KERJANYA - langkah bernomor editorial bergaris atas tipis (tanpa kotak kartu berulang) */}
        <section
          aria-labelledby="cara-kerja-heading"
          className="py-12 sm:py-16 relative z-[1]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="cara-kerja-heading" className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340] mb-8">
              Cara Kerjanya
            </h2>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              <li className="border-t-2 border-[#0C2340] pt-4 space-y-2">
                <span className="block text-sm font-bold text-[#92400E] tracking-wider uppercase">
                  01 · Data Awal
                </span>
                <h3 className="text-xl font-bold text-[#0C2340]">
                  Isi Pendaftaran Singkat
                </h3>
                <p className="text-base text-[#475569] leading-[1.6] max-w-[42ch]">
                  Masukkan nama lengkap, tahun masuk, prodi UMS, wilayah Jabodetabek, dan nomor WhatsApp aktif.
                </p>
              </li>

              <li className="border-t-2 border-[#92400E] pt-4 space-y-2">
                <span className="block text-sm font-bold text-[#92400E] tracking-wider uppercase">
                  02 · Verifikasi Pengurus
                </span>
                <h3 className="text-xl font-bold text-[#0C2340]">
                  Cocokkan Data &amp; Wilayah
                </h3>
                <p className="text-base text-[#475569] leading-[1.6] max-w-[42ch]">
                  Pengurus mencocokkan data alumnimu dan mencatat wilayah domisili tanpa memajang kontak pribadimu ke publik.
                </p>
              </li>

              <li className="border-t-2 border-[#0C2340]/45 pt-4 space-y-2">
                <span className="block text-sm font-bold text-[#92400E] tracking-wider uppercase">
                  03 · Pertemuan Perdana
                </span>
                <h3 className="text-xl font-bold text-[#0C2340]">
                  Terima Kabar Kopdar Pertama
                </h3>
                <p className="text-base text-[#475569] leading-[1.6] max-w-[42ch]">
                  Begitu jadwal pertemuan di wilayahmu ditetapkan, pengurus mengirimkan undangan lokasi lewat WhatsApp.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <PatternDivider variant="curve" fromColor="#FDFCF7" toColor="#F3F1EA" />

        {/* 4. KOPDAR PERTAMA & PEMILIH WILAYAH - pattern-contour memudar dari kanan atas */}
        <PatternSection
          id="kopdar"
          aria-labelledby="kopdar-heading"
          variant="contour"
          tone="tint"
          fade="top-right"
          patternOpacity={0.085}
          patternSize="180px"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 id="kopdar-heading" className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]">
                Usulkan Minat Kopdar Pertama
              </h2>
              <p className="text-base text-[#475569] leading-[1.6] max-w-[42ch]">
                Jadwal kopdar perdana tiap wilayah disusun berdasarkan domisili dan waktu luang terbanyak dari pendaftar awal. Pilih wilayah dan hari yang paling cocok buat kamu.
              </p>

              <div className="surface-card rounded-xl p-5 space-y-2.5">
                <p className="text-base font-bold text-[#0C2340] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#92400E] shrink-0" />
                  <span>Jadwal &amp; Lokasi Terdekat</span>
                </p>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Tanggal: <strong className="text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.firstKopdarDate}</strong>
                </p>
                <p className="text-base text-[#475569] leading-[1.6] flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#92400E] shrink-0 mt-1" />
                  <span>{COMMUNITY_PLACEHOLDERS.firstKopdarLocation}</span>
                </p>
              </div>

              {IS_DEMO_MODE && demoEvents.length > 0 && (
                <div className="surface-card-soft rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#0C2340]">Pratinjau Jadwal</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-[#92400E] text-xs font-semibold">
                      {DEMO_BADGE_LABEL}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-[#0C2340]">{demoEvents[0].judul}</p>
                  <p className="text-base text-[#475569]">{demoEvents[0].tanggalWIB} · {demoEvents[0].wilayah}</p>
                </div>
              )}

              <div>
                <Link
                  href="/kegiatan"
                  className="inline-flex items-center gap-2 min-h-[44px] px-1 text-base font-semibold text-[#0C2340] hover:text-[#92400E] transition-colors"
                >
                  Lihat halaman Jadwal Kopdar
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 surface-card rounded-2xl p-6 sm:p-8">
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
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] text-base text-[#0C2340]"
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
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] text-base text-[#0C2340]"
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
                        Nama Lengkap <span className="text-[#92400E]">*</span>
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
                        className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#FDFCF7] border text-base text-[#0C2340] ${
                          kopdarErrors.nama ? 'border-red-500' : 'border-[#0C2340]/20 focus:border-[#0C2340]'
                        }`}
                      />
                      {kopdarErrors.nama && (
                        <p className="mt-1.5 text-sm text-red-700 font-medium">{kopdarErrors.nama}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="kopdar-wa" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                        Nomor WhatsApp <span className="text-[#92400E]">*</span>
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
                        className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#FDFCF7] border text-base text-[#0C2340] ${
                          kopdarErrors.whatsapp ? 'border-red-500' : 'border-[#0C2340]/20 focus:border-[#0C2340]'
                        }`}
                      />
                      {kopdarErrors.whatsapp && (
                        <p className="mt-1.5 text-sm text-red-700 font-medium">{kopdarErrors.whatsapp}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-base text-[#475569] leading-[1.5]">
                      Nomor WhatsApp hanya dipakai pengurus untuk mengabari jadwal kopdar wilayah ini.
                    </p>
                    <button
                      type="submit"
                      disabled={kopdarSubmitting}
                      className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] disabled:opacity-60 text-white text-base font-semibold transition-all duration-150 cursor-pointer shrink-0"
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
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0C2340]">
                      Minat Kopdar {kopdarForm.wilayah} Tercatat
                    </h3>
                    <p className="text-base text-[#475569] leading-[1.6] max-w-md mx-auto">
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
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg bg-[#0C2340] text-white text-sm font-semibold"
                    >
                      <Share2 className="w-4 h-4 text-[#F59E0B]" />
                      Ajak alumni lewat WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setKopdarSubmitted(false)}
                      className="inline-flex items-center min-h-[44px] px-4 py-2.5 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-sm font-semibold cursor-pointer"
                    >
                      Ubah pilihan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PatternSection>

        <PatternDivider variant="curve" fromColor="#F3F1EA" toColor="#FDFCF7" />

        {/* 5. DOKUMENTASI PERTEMUAN - Tetap bersih (latar putih krem + grain kertas dasar) */}
        <section
          aria-labelledby="dokumentasi-heading"
          className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#F3F1EA] surface-card relative">
                <Image
                  src="/images/hero-kumpul-bolo-pisah.jpg"
                  alt="Dokumentasi kumpul alumni Universitas Muhammadiyah Surakarta"
                  width={1200}
                  height={675}
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <h2 id="dokumentasi-heading" className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]">
                Dokumentasi Pertemuan Alumni
              </h2>
              <p className="text-base text-[#475569] leading-[1.6] max-w-[42ch]">
                {COMMUNITY_PLACEHOLDERS.documentationCaption}
              </p>
              <p className="text-base text-[#475569] leading-[1.6] max-w-[42ch]">
                Foto kegiatan tiap wilayah akan terus dilengkapi seiring bergulirnya kopdar pertama
                di sembilan wilayah Jabodetabek.
              </p>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2 min-h-[44px] px-1 text-base font-semibold text-[#0C2340] hover:text-[#92400E] transition-colors"
              >
                Lihat cakupan 9 wilayah Jabodetabek
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <PatternDivider variant="gradient" />

        {/* 6. MENTORING ALUMNI - Bersih tanpa pola geometris */}
        <PatternSection
          aria-labelledby="mentoring-heading"
          variant="grain"
          tone="tint"
          fade="none"
          patternOpacity={0.03}
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <h2 id="mentoring-heading" className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]">
                Mentoring Alumni
              </h2>
              <p className="text-base text-[#475569] leading-[1.6] max-w-[48ch]">
                Lulusan baru bisa meminta masukan CV dan persiapan wawancara, sementara alumni
                berpengalaman bisa mendaftarkan diri sebagai mentor sukarela di bidang masing-masing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/peluang#mentoring"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] text-white text-base font-semibold transition-all duration-150 shadow-xs"
              >
                Cari Mentor
              </Link>
              <Link
                href="/gabung?mentor=ya"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-white border border-[#0C2340]/20 hover:border-[#0C2340]/45 active:scale-[0.99] text-[#0C2340] text-base font-semibold transition-all duration-150 shadow-2xs"
              >
                Daftar Jadi Mentor
              </Link>
            </div>
          </div>

          {IS_DEMO_MODE && demoMentors.length > 0 && (
            <div className="space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-[#92400E] text-xs font-semibold">
                {DEMO_BADGE_LABEL}
              </span>
              <div className="space-y-3 max-w-3xl">
                {demoMentors.map((m) => (
                  <div key={m.id} className="surface-card rounded-xl p-5 space-y-1.5">
                    <h3 className="text-lg font-bold text-[#0C2340]">{m.nama}</h3>
                    <p className="text-base text-[#475569]">
                      {m.prodi} &apos;{String(m.angkatan).slice(-2)} · {m.wilayah}
                    </p>
                    <p className="text-base text-[#0C2340] font-medium pt-0.5">
                      {m.mentoringFokus || m.pekerjaan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </PatternSection>

        <PatternDivider variant="curve" fromColor="#F3F1EA" toColor="#FDFCF7" />

        {/* 7. FAQ PENDEK - Benar-benar polos agar teks mudah dibaca */}
        <section
          aria-labelledby="faq-heading"
          className="bg-[#FDFCF7] relative z-[1] py-14"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="faq-heading" className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340] mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>

            <div className="divide-y divide-[#0C2340]/12 border-y border-[#0C2340]/12">
              <details className="group py-2">
                <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-base text-[#0C2340] cursor-pointer">
                  <span>Apakah mendaftar di IKA UMS Jabodetabek berbayar?</span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" />
                </summary>
                <p className="pb-4 text-base text-[#475569] leading-[1.6] max-w-[60ch]">
                  Gratis. Pendaftaran keanggotaan dan partisipasi awal komunitas tidak memungut iuran wajib.
                </p>
              </details>

              <details className="group py-2">
                <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-base text-[#0C2340] cursor-pointer">
                  <span>Apakah nomor WhatsApp dan email saya ditampilkan terbuka?</span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" />
                </summary>
                <div className="pb-4 space-y-2">
                  <p className="text-base text-[#475569] leading-[1.6] max-w-[60ch]">
                    Tidak. Nomor WhatsApp dan email disimpan tertutup untuk verifikasi pengurus serta info
                    kopdar. Saat mendaftar, pilihan tampil di Daftar Anggota juga bawaan Tidak aktif
                    kecuali kamu menyetujuinya sendiri.
                  </p>
                  <Link
                    href="/privasi"
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-1 font-semibold text-base text-[#0C2340] hover:text-[#92400E] underline underline-offset-4"
                  >
                    <span>Baca Kebijakan Privasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </details>

              <details className="group py-2">
                <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-base text-[#0C2340] cursor-pointer">
                  <span>Siapa yang mengelola komunitas ini?</span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" />
                </summary>
                <div className="pb-4 space-y-2">
                  <p className="text-base text-[#475569] leading-[1.6] max-w-[60ch]">
                    Komunitas dikelola oleh tim pengurus wilayah dan koordinator dari 9 kota/kabupaten di
                    Jabodetabek. Susunan jabatan dan kontak resmi dapat dilihat langsung.
                  </p>
                  <Link
                    href="/kepengurusan"
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-1 font-semibold text-base text-[#0C2340] hover:text-[#92400E] underline underline-offset-4"
                  >
                    <span>Lihat Pengurus &amp; Kontak</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </details>

              <details className="group py-2">
                <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-base text-[#0C2340] cursor-pointer">
                  <span>Bagaimana hubungannya dengan IKA UMS Pusat?</span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" />
                </summary>
                <div className="pb-4 space-y-2">
                  <p className="text-base text-[#475569] leading-[1.6] max-w-[60ch]">
                    Jaringan ini ditujukan sebagai simpul wilayah Jakarta, Bogor, Depok, Tangerang, dan
                    Bekasi bagi alumni Universitas Muhammadiyah Surakarta ({COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}).
                  </p>
                  <Link
                    href="/tentang"
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-1 font-semibold text-base text-[#0C2340] hover:text-[#92400E] underline underline-offset-4"
                  >
                    <span>Baca Tentang Komunitas</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* 8. CTA PENUTUP - Tone brand tua (#0C2340) + pattern-batik terang memudar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 relative z-[1]">
          <PatternSection
            as="div"
            variant="batik"
            tone="brand"
            fade="radial-soft"
            patternOpacity={0.08}
            patternSize="68px"
            className="rounded-2xl p-6 sm:p-10 border border-[#0C2340] shadow-[0_14px_34px_-12px_rgba(12,35,64,0.28)]"
            contentClassName="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2.5 max-w-xl">
              <h2 className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em]">
                Ikut Mendata Dirimu di Wilayah Jabodetabek
              </h2>
              <p className="text-base text-white/90 leading-[1.6]">
                Semakin lengkap data awal tiap kota dan kabupaten, semakin cepat jadwal kopdar
                perdana dan grup wilayah dapat disusun bersama.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/gabung"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] active:scale-[0.99] text-[#0C2340] text-base font-bold transition-all duration-150"
              >
                Daftar jadi anggota
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kepengurusan"
                className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 rounded-lg border border-white/25 hover:bg-white/10 active:scale-[0.99] text-white text-base font-semibold transition-all duration-150"
              >
                Hubungi pengurus
              </Link>
            </div>
          </PatternSection>
        </section>
      </main>

      <Footer />
    </div>
  );
}

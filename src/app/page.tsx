'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { getAlumniList, getKegiatanList } from '@/data/simulasi';
import { WILAYAH_JABODETABEK, normalizeIndonesianWhatsApp } from '@/data/ums-prodi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { PatternSection } from '@/components/PatternSection';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Share2,
  ChevronDown,
  Loader2,
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
        {/* 1. HERO - pembuka editorial asimetris + foto pertemuan di De Terras */}
        <PatternSection
          variant="batik"
          tone="light"
          fade="right-focus"
          patternOpacity={0.06}
          patternSize="64px"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 lg:pt-14 lg:pb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-block text-sm font-semibold text-[#92400E]">
                IKA UMS Wilayah Jabodetabek{IS_DEMO_MODE ? ` (${DEMO_BADGE_LABEL})` : ' · Pendataan Awal'}
              </span>

              <h1 className="text-[clamp(1.875rem,1.35rem+2.2vw,2.75rem)] font-extrabold tracking-[-0.025em] text-[#0C2340] leading-[1.12]">
                Jaringan Alumni UMS di Jabodetabek
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-[1.65] max-w-[44ch] sm:max-w-xl">
                Banyak lulusan Universitas Muhammadiyah Surakarta bekerja dan tinggal di Jakarta,
                Bogor, Depok, Tangerang, dan Bekasi, namun komunikasinya masih tersebar di grup
                jurusan dan angkatan masing-masing. Situs ini mengumpulkan data domisili supaya
                pertemuan wilayah, mentoring karier, dan info lowongan kerja mudah diakses sesama alumni.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pt-1">
                <Link
                  href="/gabung"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] text-white text-base font-semibold transition-all duration-150"
                >
                  <span>Daftar jadi anggota</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </Link>
                <Link
                  href="/masuk"
                  className="inline-flex items-center justify-center sm:justify-start min-h-[44px] px-2 text-base font-semibold text-[#0C2340] hover:text-[#92400E] underline underline-offset-4 transition-colors"
                >
                  Sudah mendaftar? Masuk
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <figure className="space-y-2.5">
                <div className="aspect-[16/10] w-full rounded-lg border border-[#0C2340]/12 bg-[#F3F1EA] relative overflow-hidden">
                  <Image
                    src="/images/alumni-gathering-4.jpg"
                    alt="Alumni Universitas Muhammadiyah Surakarta berjabat tangan di meja registrasi De Terras"
                    width={1200}
                    height={750}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm text-[#475569] leading-relaxed">
                  {COMMUNITY_PLACEHOLDERS.heroPhotoCaption}
                </figcaption>
              </figure>
            </div>
          </div>
        </PatternSection>

        {/* 2. LATAR PENDATAAN & PERAN PENGURUS - batas datar editorial tanpa gelombang SVG */}
        <PatternSection
          aria-labelledby="pendataan-heading"
          variant="dots"
          tone="tint"
          fade="soft-edges"
          patternOpacity={0.055}
          patternSize="24px"
          className="border-y border-[#0C2340]/10"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-3">
              <h2
                id="pendataan-heading"
                className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
              >
                Kenapa Didata Terlebih Dulu?
              </h2>
              <p className="text-base text-[#475569] leading-[1.65] max-w-[44ch]">
                Sebelum membuka daftar anggota terbuka atau memasang angka perkiraan, pengurus lebih
                dulu menghimpun pendaftar awal per kota agar jadwal kopdar pertama benar-benar sesuai
                tempat tinggal dan waktu luang alumni di lapangan.
              </p>
            </div>

            <dl className="lg:col-span-7 divide-y divide-[#0C2340]/12 border-y border-[#0C2340]/12">
              <div className="py-5 sm:py-6 space-y-1.5">
                <dt className="text-lg font-bold text-[#0C2340]">
                  Kenalan Sewilayah &amp; Kopdar Kota
                </dt>
                <dd className="text-base text-[#475569] leading-[1.6] max-w-[56ch]">
                  Pengurus mengelompokkan domisili kerja dan tempat tinggal ke sembilan wilayah Jabodetabek
                  supaya pertemuan perdana tidak terpusat di satu titik saja.
                </dd>
              </div>

              <div className="py-5 sm:py-6 space-y-1.5">
                <dt className="text-lg font-bold text-[#0C2340]">
                  Mentoring CV &amp; Persiapan Wawancara
                </dt>
                <dd className="text-base text-[#475569] leading-[1.6] max-w-[56ch]">
                  Alumni yang sudah lebih lama bekerja dapat mencantumkan kesediaan membantu lulusan baru
                  atau rekan yang sedang pindah bidang industri. Kontak hanya diteruskan jika disetujui.
                </dd>
              </div>

              <div className="py-5 sm:py-6 space-y-1.5">
                <dt className="text-lg font-bold text-[#0C2340]">
                  Verifikasi Manual &amp; Daftar Anggota Tertutup
                </dt>
                <dd className="text-base text-[#475569] leading-[1.6] max-w-[56ch]">
                  Setiap isian dicocokkan nama, prodi, dan tahun masuk UMS oleh pengurus wilayah. Nomor
                  WhatsApp maupun email tidak pernah dibuka ke halaman publik.
                </dd>
              </div>
            </dl>
          </div>
        </PatternSection>

        {/* 3. DOKUMENTASI "KUMPUL BOLO PISAH" & CAKUPAN 9 WILAYAH */}
        <section
          id="wilayah"
          aria-labelledby="dokumentasi-heading"
          className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <figure className="space-y-2.5">
                <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-[#0C2340]/12 bg-[#F3F1EA] relative">
                  <Image
                    src="/images/hero-kumpul-bolo-pisah.jpg"
                    alt="Foto bersama alumni Universitas Muhammadiyah Surakarta di aula Kumpul Bolo Pisah"
                    width={1200}
                    height={675}
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm text-[#475569] leading-relaxed">
                  {COMMUNITY_PLACEHOLDERS.documentationCaption}
                </figcaption>
              </figure>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <h2
                id="dokumentasi-heading"
                className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
              >
                Sembilan Wilayah Pendataan
              </h2>
              <p className="text-base text-[#475569] leading-[1.6]">
                Pendataan membagi jangkauan komunitas ke sembilan kota dan kabupaten agar koordinasi
                kopdar lebih dekat dari rumah atau kantormu:
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-base text-[#0C2340] font-medium pt-1">
                {WILAYAH_JABODETABEK.map((reg) => (
                  <li key={reg.id} className="py-0.5 border-b border-[#0C2340]/8">
                    {reg.nama}
                  </li>
                ))}
              </ul>
              <div className="pt-1">
                <Link
                  href="/peta"
                  className="inline-flex items-center gap-2 min-h-[44px] px-1 text-base font-semibold text-[#0C2340] hover:text-[#92400E] underline underline-offset-4 transition-colors"
                >
                  <span>Lihat peta cakupan wilayah</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. USULAN JADWAL KOPDAR PERTAMA & MENTORING - latar contour ringan */}
        <PatternSection
          id="kopdar"
          aria-labelledby="kopdar-heading"
          variant="contour"
          tone="tint"
          fade="top-right"
          patternOpacity={0.075}
          patternSize="180px"
          className="border-y border-[#0C2340]/10"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-3">
                <h2
                  id="kopdar-heading"
                  className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
                >
                  Usulkan Minat Kopdar Pertama
                </h2>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Tanggal dan lokasi pertemuan perdana memang belum dikunci. Pengurus memilih hari
                  serta titik kumpul paling masuk akal setelah suara wilayah dari pendaftar awal masuk.
                </p>
                <Link
                  href="/kegiatan"
                  className="inline-flex items-center gap-2 min-h-[44px] px-1 text-base font-semibold text-[#0C2340] hover:text-[#92400E] underline underline-offset-4 transition-colors"
                >
                  <span>Lihat status jadwal kopdar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {IS_DEMO_MODE && demoEvents.length > 0 && (
                <div className="bg-white border border-[#0C2340]/12 rounded-xl p-4 space-y-1.5">
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

              <div className="pt-5 border-t border-[#0C2340]/12 space-y-3">
                <h3 className="text-lg font-bold text-[#0C2340]">
                  Mentoring CV &amp; Berbagi Lowongan
                </h3>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Butuh teman diskusi sebelum melamar kerja, atau bersedia meluangkan waktu untuk
                  mengulas CV adik tingkat?
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/peluang#mentoring"
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-base font-semibold transition-colors"
                  >
                    Cari mentor
                  </Link>
                  <Link
                    href="/gabung?mentor=ya"
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg bg-white border border-[#0C2340]/20 hover:border-[#0C2340]/45 text-[#0C2340] text-base font-semibold transition-colors"
                  >
                    Daftar jadi mentor
                  </Link>
                </div>
              </div>

              {IS_DEMO_MODE && demoMentors.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-[#92400E] text-xs font-semibold">
                    {DEMO_BADGE_LABEL}
                  </span>
                  <div className="space-y-2.5">
                    {demoMentors.map((m) => (
                      <div key={m.id} className="bg-white border border-[#0C2340]/12 rounded-xl p-4 space-y-1">
                        <h4 className="text-base font-bold text-[#0C2340]">{m.nama}</h4>
                        <p className="text-base text-[#475569]">
                          {m.prodi} &apos;{String(m.angkatan).slice(-2)} · {m.wilayah}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 bg-white border border-[#0C2340]/12 rounded-xl p-6 sm:p-8 shadow-2xs">
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
                      className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2"
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
                        aria-describedby={kopdarErrors.nama ? 'err-kopdar-nama' : undefined}
                        placeholder="Nama panggilan atau lengkap"
                        value={kopdarForm.nama}
                        onChange={(e) => {
                          setKopdarForm({ ...kopdarForm, nama: e.target.value });
                          if (kopdarErrors.nama) setKopdarErrors((prev) => ({ ...prev, nama: undefined }));
                        }}
                        className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#FDFCF7] border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                          kopdarErrors.nama
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-[#0C2340]/20 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                        }`}
                      />
                      {kopdarErrors.nama && (
                        <p id="err-kopdar-nama" className="mt-1.5 text-sm text-red-700 font-medium">
                          {kopdarErrors.nama}
                        </p>
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
                        aria-describedby={kopdarErrors.whatsapp ? 'err-kopdar-wa' : undefined}
                        placeholder="081234567890"
                        value={kopdarForm.whatsapp}
                        onChange={(e) => {
                          setKopdarForm({ ...kopdarForm, whatsapp: e.target.value });
                          if (kopdarErrors.whatsapp) setKopdarErrors((prev) => ({ ...prev, whatsapp: undefined }));
                        }}
                        className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#FDFCF7] border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                          kopdarErrors.whatsapp
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-[#0C2340]/20 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                        }`}
                      />
                      {kopdarErrors.whatsapp && (
                        <p id="err-kopdar-wa" className="mt-1.5 text-sm text-red-700 font-medium">
                          {kopdarErrors.whatsapp}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-sm sm:text-base text-[#475569] leading-[1.5]">
                      Nomor WhatsApp hanya dipakai pengurus untuk mengabari jadwal kopdar wilayah ini.
                    </p>
                    <button
                      type="submit"
                      disabled={kopdarSubmitting}
                      className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] disabled:opacity-60 text-white text-base font-semibold transition-all duration-150 cursor-pointer shrink-0"
                    >
                      {kopdarSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                          <span>Mencatat minat...</span>
                        </>
                      ) : (
                        <>
                          <span>Kirim minat kopdar</span>
                          <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                        </>
                      )}
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

        {/* 5. TANYA JAWAB & PENUTUP RINGKAS DI ATAS KERTAS KREM (tanpa kotak dark CTA di atas footer) */}
        <section
          id="tanya-jawab"
          aria-labelledby="faq-heading"
          className="bg-[#FDFCF7] relative z-[1] py-12 sm:py-16"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div>
              <h2
                id="faq-heading"
                className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340] mb-6"
              >
                Soal Pendaftaran &amp; Data Kamu
              </h2>

              <div className="divide-y divide-[#0C2340]/12 border-y border-[#0C2340]/12">
                <details className="group py-2">
                  <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-base text-[#0C2340] cursor-pointer">
                    <span>Apakah mendaftar di IKA UMS Jabodetabek berbayar?</span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" />
                  </summary>
                  <p className="pb-4 text-base text-[#475569] leading-[1.6] max-w-[60ch]">
                    Tidak ada iuran wajib atau biaya pendaftaran.
                  </p>
                </details>

                <details className="group py-2">
                  <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-base text-[#0C2340] cursor-pointer">
                    <span>Apakah nomor WhatsApp dan email saya ditampilkan terbuka?</span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" />
                  </summary>
                  <div className="pb-4 space-y-2">
                    <p className="text-base text-[#475569] leading-[1.6] max-w-[60ch]">
                      Tidak. Kontak dipakai pengurus untuk mencocokkan latar alumni dan mengirim info
                      kopdar. Pilihan tampil di Daftar Anggota juga bawaan Tidak aktif sampai kamu menyetujuinya sendiri.
                    </p>
                    <Link
                      href="/privasi"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-1 font-semibold text-base text-[#0C2340] hover:text-[#92400E] underline underline-offset-4"
                    >
                      <span>Kebijakan Privasi</span>
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
                      Pengurus wilayah Jabodetabek bersama perwakilan koordinator sembilan kota dan kabupaten.
                    </p>
                    <Link
                      href="/kepengurusan"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-1 font-semibold text-base text-[#0C2340] hover:text-[#92400E] underline underline-offset-4"
                    >
                      <span>Susunan Pengurus &amp; Korwil</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </details>

                <details className="group py-2">
                  <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] py-2 font-semibold text-base text-[#0C2340] cursor-pointer">
                    <span>Bagaimana hubungannya dengan PP IKA UMS Pusat?</span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" />
                  </summary>
                  <div className="pb-4 space-y-2">
                    <p className="text-base text-[#475569] leading-[1.6] max-w-[60ch]">
                      Jaringan wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi disiapkan sebagai
                      simpul daerah alumni Universitas Muhammadiyah Surakarta ({COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}).
                    </p>
                    <Link
                      href="/tentang"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-1 font-semibold text-base text-[#0C2340] hover:text-[#92400E] underline underline-offset-4"
                    >
                      <span>Tentang Komunitas</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </details>
              </div>
            </div>

            <div className="pt-8 border-t border-[#0C2340]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1 max-w-lg">
                <h2 className="text-xl font-bold text-[#0C2340]">
                  Catat Data Alumnimu di Wilayah Jabodetabek
                </h2>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Isi data singkat agar pengurus bisa menghubungi domisili wilayahmu saat kopdar perdana dijadwalkan.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/gabung"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] text-white text-base font-semibold transition-all duration-150"
                >
                  <span>Daftar jadi anggota</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </Link>
                <Link
                  href="/kepengurusan"
                  className="inline-flex items-center justify-center min-h-[48px] px-4 py-3 text-base font-semibold text-[#0C2340] hover:text-[#92400E] underline underline-offset-4 transition-colors"
                >
                  Pengurus &amp; kontak
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { KopdarInterestForm } from '@/components/home/KopdarInterestForm';
import { TrustPanel } from '@/components/home/TrustPanel';
import { MobileKopdarCta } from '@/components/home/MobileKopdarCta';
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  Rocket,
  Building2,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';

const KOTA_STATS = [
  { nama: 'Jakarta', count: '1.248', slug: 'Jakarta' },
  { nama: 'Bogor', count: '286', slug: 'Bogor' },
  { nama: 'Depok', count: '231', slug: 'Depok' },
  { nama: 'Tangerang', count: '317', slug: 'Tangerang' },
  { nama: 'Bekasi', count: '302', slug: 'Bekasi' },
];

const PROGRAM_ITEMS = [
  {
    id: 'kopdar',
    judul: 'Kopdar & Silaturahmi',
    deskripsi: 'Temu alumni di berbagai wilayah Jabodetabek.',
    icon: Calendar,
    active: true,
    href: '#kopdar-section',
  },
  {
    id: 'mentoring',
    judul: 'Mentoring Karier',
    deskripsi: 'Diskusi, bimbingan, dan berbagi pengalaman kerja.',
    icon: Briefcase,
    active: false,
    href: '/peluang#mentoring',
  },
  {
    id: 'peluang',
    judul: 'Peluang & Kolaborasi',
    deskripsi: 'Info karier, proyek, dan kolaborasi lintas alumni.',
    icon: Rocket,
    active: false,
    href: '/peluang#loker',
  },
  {
    id: 'komunitas',
    judul: 'Komunitas Minat',
    deskripsi: 'Ruang berkumpul sesuai minat dan bidang keahlian.',
    icon: Users,
    active: false,
    href: '/direktori',
  },
];

const CERITA_ITEMS = [
  {
    id: 1,
    judul: 'Kopdar Alumni UMS Jakarta',
    kategori: 'Kopdar',
    tanggal: '16 Okt 2026',
    gambar: '/images/cerita-kopdar-jakarta.png',
    href: '/kegiatan',
  },
  {
    id: 2,
    judul: 'Sarasehan Karier Alumni',
    kategori: 'Diskusi',
    tanggal: '28 Sep 2026',
    gambar: '/images/cerita-sarasehan-karier.png',
    href: '/kegiatan',
  },
  {
    id: 3,
    judul: 'Aksi Sosial Alumni',
    kategori: 'Kegiatan',
    tanggal: '10 Sep 2026',
    gambar: '/images/cerita-aksi-sosial.png',
    href: '/kegiatan',
  },
];

export default function HomePage() {
  const [selectedWilayah, setSelectedWilayah] = useState('Jakarta Selatan');
  const [showFormModal, setShowFormModal] = useState(false);

  const handleOpenKopdar = (wilayahTarget?: string) => {
    if (wilayahTarget) setSelectedWilayah(wilayahTarget);
    setShowFormModal(true);
    const target = document.getElementById('kopdar-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 selection:bg-[#0C2340] selection:text-white pb-20 lg:pb-0">
      <Navbar />

      <main className="flex-grow space-y-16 sm:space-y-20 lg:space-y-24">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Persis Desain Referensi)                                 */}
        {/* ========================================================================= */}
        <section className="bg-white overflow-hidden pt-6 pb-4 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
              {/* Kolom Kiri: Teks & Aksi */}
              <div className="space-y-6 lg:col-span-6 z-10">
                {/* Eyebrow / Kicker */}
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-[2.5px] bg-[#C07A28] rounded-full" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309]">
                    Ikatan Keluarga Alumni UMS
                  </span>
                </div>

                {/* Headline Utama */}
                <h1 className="text-[clamp(2.25rem,1.75rem+2.6vw,3.75rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#0C2340]">
                  Jauh dari kampus,
                  <br />
                  dekat sebagai{' '}
                  <span className="text-[#C07A28]">keluarga.</span>
                </h1>

                {/* Subtitle / Deskripsi */}
                <p className="max-w-[46ch] text-base sm:text-lg leading-[1.65] text-slate-600 sm:max-w-xl">
                  Temukan kembali teman, bangun koneksi, dan bertumbuh bersama alumni Universitas Muhammadiyah Surakarta di Jabodetabek.
                </p>

                {/* Dua Tombol Aksi */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenKopdar()}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-6 py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-[#08182E] shadow-sm active:scale-[0.99] cursor-pointer"
                  >
                    Ikut kopdar terdekat
                    <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  </button>
                  <Link
                    href="/direktori"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm sm:text-base font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 shadow-2xs"
                  >
                    Jelajahi jaringan
                    <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </Link>
                </div>

                {/* Footer Wilayah */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-500 pt-3">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <span className="hover:text-slate-700 transition-colors">Jakarta</span>
                  <span className="text-slate-300">·</span>
                  <span className="hover:text-slate-700 transition-colors">Bogor</span>
                  <span className="text-slate-300">·</span>
                  <span className="hover:text-slate-700 transition-colors">Depok</span>
                  <span className="text-slate-300">·</span>
                  <span className="hover:text-slate-700 transition-colors">Tangerang</span>
                  <span className="text-slate-300">·</span>
                  <span className="hover:text-slate-700 transition-colors">Bekasi</span>
                </div>
              </div>

              {/* Kolom Kanan: Visual Showcase Foto Real & Floating Badge */}
              <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end pt-2 pb-6 lg:py-0">
                <div className="relative w-full max-w-[560px] lg:max-w-none">
                  {/* Aksen Shape Background Krem Hangat */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bottom-3 left-4 sm:left-8 bg-[#F6EFE4] rounded-tr-[52px] rounded-bl-[36px] rounded-tl-[20px] rounded-br-[60px] pointer-events-none"
                  />

                  {/* Frame Foto Real Dokumentasi Alumni UMS */}
                  <div className="relative z-10 w-full overflow-hidden rounded-[24px] sm:rounded-[34px] border border-white/80 bg-slate-100 shadow-lg aspect-[16/11]">
                    <Image
                      src="/images/alumni-gathering-4.jpg"
                      alt="Silaturahmi alumni Universitas Muhammadiyah Surakarta di Jabodetabek"
                      width={1200}
                      height={825}
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 48vw"
                      className="h-full w-full object-cover"
                    />

                    {/* Gradient halus di bawah */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none"
                    />
                  </div>

                  {/* Floating Badge Navy Institusional */}
                  <div className="relative sm:absolute sm:-bottom-5 sm:right-4 lg:-bottom-6 lg:-right-4 z-20 mt-3 sm:mt-0 max-w-full sm:max-w-md rounded-2xl bg-[#0C2340] p-4 sm:p-5 text-white shadow-xl border border-white/10 flex items-center justify-between gap-4">
                    <div className="border-l-2 border-[#D97706] pl-3.5 space-y-0.5">
                      <p className="text-sm sm:text-base font-bold text-white tracking-tight">
                        Satu almamater. Banyak cerita.
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Keluarga besar UMS di perantauan.
                      </p>
                    </div>

                    {/* Siluet Gedung Siti Walidah */}
                    <div className="relative h-11 w-24 sm:w-28 shrink-0 overflow-hidden opacity-90">
                      <Image
                        src="/images/campus-blueprint-transparent.png"
                        alt="Siluet Arsitektur Kampus UMS"
                        fill
                        sizes="112px"
                        className="object-contain object-right"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. STRIP 3 NILAI UTAMA (Value Proposition Strip)                          */}
        {/* ========================================================================= */}
        <section aria-label="Keunggulan Komunitas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Item 1 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#C07A28] border border-amber-200/60">
                <Users className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                  Perluas Jaringan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Terhubung kembali dengan sesama alumni UMS.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#C07A28] border border-amber-200/60">
                <Briefcase className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                  Dukung Karier
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Mentoring, berbagi peluang, dan kolaborasi profesi.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#C07A28] border border-amber-200/60">
                <Calendar className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                  Ruang Bertemu
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Kopdar, diskusi, dan berbagai kegiatan bermanfaat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SEBARAN WILAYAH: Satu Jaringan. Lima Kota.                              */}
        {/* ========================================================================= */}
        <section aria-labelledby="sebaran-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/80 bg-[#F8FAFC] p-6 sm:p-10 lg:p-12 shadow-xs">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
              {/* Sisi Kiri: Teks & CTA */}
              <div className="space-y-4 lg:col-span-4">
                <h2
                  id="sebaran-heading"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340] leading-tight"
                >
                  Satu Jaringan.
                  <br />
                  Lima Kota.
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  Sebaran alumni UMS di wilayah Jabodetabek yang terus bertumbuh. Mari lengkapi datamu, agar jejaring kita semakin kuat.
                </p>
                <div className="pt-2">
                  <Link
                    href="/peta"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#08182E] shadow-xs"
                  >
                    Lihat sebaran alumni
                    <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Sisi Tengah: Ilustrasi Peta Vektor Jabodetabek */}
              <div className="lg:col-span-4 flex items-center justify-center py-4 lg:py-0">
                <div className="relative w-full max-w-[280px] aspect-[4/3] flex items-center justify-center">
                  <Image
                    src="/images/map-jabodetabek-graphic.png"
                    alt="Peta Sebaran Alumni UMS di Jabodetabek"
                    width={280}
                    height={180}
                    className="w-full h-auto object-contain opacity-90 drop-shadow-xs"
                  />
                </div>
              </div>

              {/* Sisi Kanan: Daftar 5 Kota / Counter */}
              <div className="space-y-2 lg:col-span-4">
                {KOTA_STATS.map((kota) => (
                  <Link
                    key={kota.nama}
                    href={`/peta?wilayah=${encodeURIComponent(kota.slug)}`}
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 group-hover:text-[#0C2340] group-hover:bg-slate-100 transition-colors">
                        <Building2 className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-bold text-[#0C2340]">
                        {kota.nama}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 group-hover:text-[#0C2340]">
                      <span>{kota.count} alumni</span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PROGRAM UNTUK ALUMNI UMS                                               */}
        {/* ========================================================================= */}
        <section aria-labelledby="program-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#C07A28] rounded-full" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309]">
                  Lebih dari Sekadar Kopdar
                </span>
              </div>
              <h2
                id="program-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]"
              >
                Program untuk Alumni UMS
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              Berbagai inisiatif untuk saling terhubung, berbagi pengalaman, dan tumbuh bersama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROGRAM_ITEMS.map((item) => {
              const Icon = item.icon;
              const isDark = item.active;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 min-h-[220px] ${
                    isDark
                      ? 'bg-[#0C2340] text-white shadow-md'
                      : 'bg-white border border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isDark
                          ? 'bg-white/10 text-white'
                          : 'bg-amber-50 text-[#C07A28] border border-amber-200/60'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold leading-snug">
                        {item.judul}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-1 ${
                        isDark
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BANNER KOPDAR PERTAMA: Mulai dari Kotamu                                */}
        {/* ========================================================================= */}
        <section
          id="kopdar-section"
          aria-labelledby="banner-kopdar-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8"
        >
          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 items-center lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Sisi Kiri: Foto Real Alumni UMS */}
              <div className="lg:col-span-5 h-64 sm:h-72 lg:h-full relative overflow-hidden bg-slate-100">
                <Image
                  src="/images/banner-mulai-dari-kotamu.png"
                  alt="Alumni UMS berkumpul dalam kegiatan silaturahmi"
                  width={385}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Sisi Tengah: Teks & Tombol */}
              <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309]">
                  Kopdar Pertama
                </span>
                <h2
                  id="banner-kopdar-heading"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]"
                >
                  Mulai dari Kotamu
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  Kami sedang memetakan minat kopdar pertama di tiap wilayah. Isi formulir singkat berikut agar kamu bisa kami kabari lebih dulu.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(!showFormModal)}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-6 py-2.5 text-sm sm:text-base font-semibold text-white transition-all hover:bg-[#08182E] shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    <span>{showFormModal ? 'Tutup formulir minat' : 'Isi minat kopdar sekarang'}</span>
                    <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Sisi Kanan: Line-art Arsitektur Gedung Siti Walidah */}
              <div className="hidden lg:flex lg:col-span-2 items-center justify-end pr-8 opacity-75">
                <div className="relative h-28 w-28">
                  <Image
                    src="/images/campus-blueprint-transparent.png"
                    alt="Blueprint Arsitektur UMS"
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Minat Kopdar & Trust Panel yang Dapat Dibuka Mulus */}
          <div
            id="form-kopdar-container"
            className={`transition-all duration-300 ${
              showFormModal ? 'block' : 'hidden'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-slate-200">
              <div className="lg:col-span-5">
                <TrustPanel />
              </div>
              <div className="lg:col-span-7">
                <KopdarInterestForm
                  wilayah={selectedWilayah}
                  onWilayahChange={setSelectedWilayah}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CERITA DARI KELUARGA UMS (Kegiatan Terkini)                             */}
        {/* ========================================================================= */}
        <section aria-labelledby="cerita-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="cerita-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0C2340]"
            >
              Cerita dari Keluarga UMS
            </h2>
            <Link
              href="/kegiatan"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0C2340] hover:text-[#C07A28] transition-colors"
            >
              <span>Lihat semua kegiatan</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {CERITA_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={item.gambar}
                    alt={item.judul}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-block rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-xs font-bold text-[#0C2340] shadow-2xs">
                      {item.kategori}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3">
                  <h3 className="text-base font-bold text-[#0C2340] group-hover:text-[#C07A28] transition-colors leading-snug">
                    {item.judul}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <span>{item.tanggal}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div className="mt-16 sm:mt-24">
        <Footer />
      </div>
      <MobileKopdarCta />
    </div>
  );
}

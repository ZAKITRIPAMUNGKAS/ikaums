'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Navbar, Footer } from '@/components/Navigation';
import { KopdarInterestForm } from '@/components/home/KopdarInterestForm';
import { TrustPanel } from '@/components/home/TrustPanel';
import { MobileKopdarCta } from '@/components/home/MobileKopdarCta';
import MapLoadingSkeleton from '@/components/peta/MapLoadingSkeleton';
import type { LandingContent } from '@/lib/cms-store';
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Briefcase,
  Calendar,
  Rocket,
  CalendarDays,
} from 'lucide-react';

const HomeMapWidget = dynamic(
  () => import('@/components/home/HomeMapWidget'),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
);

const KAWASAN_LIST = [
  {
    nama: 'Jakarta',
    sublabel: 'Tebet · Blok M · Rawamangun',
    count: 589,
    slug: 'Jakarta',
  },
  {
    nama: 'Tangerang',
    sublabel: 'BSD City · Bintaro · Serpong',
    count: 126,
    slug: 'Tangerang',
  },
  {
    nama: 'Bekasi',
    sublabel: 'Summarecon & Harapan Indah',
    count: 117,
    slug: 'Bekasi',
  },
  {
    nama: 'Depok',
    sublabel: 'Margonda & Cinere',
    count: 93,
    slug: 'Depok',
  },
  {
    nama: 'Bogor',
    sublabel: 'Pajajaran & Sentul City',
    count: 86,
    slug: 'Bogor',
  },
];

const HERO_ALUMNI_AVATARS = [
  { src: '/images/avatar-aditya.jpg', alt: 'Alumni UMS' },
  { src: '/images/avatar-amalia.jpg', alt: 'Alumni UMS' },
  { src: '/images/avatar-dian.jpg', alt: 'Alumni UMS' },
  { src: '/images/avatar-nurul.jpg', alt: 'Alumni UMS' },
];

const PROGRAM_ICONS = [Calendar, Briefcase, Rocket, Users];

export interface HomeCeritaItem {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  gambar: string;
  href: string;
}

interface HomePageClientProps {
  landing: LandingContent;
  cerita: HomeCeritaItem[];
}

export function HomePageClient({ landing, cerita }: HomePageClientProps) {
  const [selectedWilayah, setSelectedWilayah] = useState('Jakarta Selatan');
  const [selectedKawasan, setSelectedKawasan] = useState('Jakarta');
  const [showFormModal, setShowFormModal] = useState(false);

  const handleOpenKopdar = (wilayahTarget?: string) => {
    if (wilayahTarget) setSelectedWilayah(wilayahTarget);
    setShowFormModal(true);
    const target = document.getElementById('kopdar-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const values = landing.values.slice(0, 3);
  const programs = landing.programs.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 selection:bg-[#0C2340] selection:text-white pb-20 lg:pb-0">
      <Navbar />

      <main className="flex-grow space-y-16 sm:space-y-20 lg:space-y-24">
        {/* 1. HERO */}
        <section className="bg-white overflow-hidden pt-6 pb-4 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="space-y-4 sm:space-y-6 lg:col-span-6 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-[#C07A28] rounded-full" aria-hidden="true" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#B45309]">
                    {landing.heroEyebrow}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.18] sm:leading-[1.12] tracking-[-0.02em] text-[#0C2340]">
                  {landing.heroTitle}{' '}
                  <span className="text-[#C07A28]">{landing.heroHighlight}</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 max-w-xl">
                  {landing.heroSubtitle}
                </p>

                <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenKopdar()}
                    className="inline-flex min-h-[44px] sm:min-h-[48px] items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#0C2340] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-base font-semibold text-white transition-all hover:bg-[#08182E] shadow-sm active:scale-[0.99] cursor-pointer"
                  >
                    <span>{landing.heroPrimaryCta}</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F59E0B]" aria-hidden="true" />
                  </button>
                  <Link
                    href="/direktori"
                    className="inline-flex min-h-[44px] sm:min-h-[48px] items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-300 bg-white px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-base font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 shadow-2xs"
                  >
                    <span>{landing.heroSecondaryCta}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" aria-hidden="true" />
                  </Link>
                </div>

                {/* Social Proof: Lingkaran Profil Alumni + Counter */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center -space-x-2 overflow-hidden shrink-0">
                    {HERO_ALUMNI_AVATARS.map((avatar, idx) => (
                      <div
                        key={idx}
                        className="relative inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white overflow-hidden shadow-2xs shrink-0"
                      >
                        <Image
                          src={avatar.src}
                          alt={avatar.alt}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#0C2340] text-white text-[10px] sm:text-[11px] font-bold ring-2 ring-white shadow-2xs shrink-0">
                      +500
                    </div>
                  </div>

                  <div className="text-xs leading-tight">
                    <p className="font-bold text-[#0C2340]">
                      +500 alumni terhubung
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                      di Jakarta, Bogor, Depok, Tangerang &amp; Bekasi
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end pt-2 pb-6 lg:py-0">
                <div className="relative w-full max-w-[560px] lg:max-w-none">
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bottom-3 left-4 sm:left-8 bg-[#F6EFE4] rounded-tr-[52px] rounded-bl-[36px] rounded-tl-[20px] rounded-br-[60px] pointer-events-none"
                  />

                  <div className="relative z-10 w-full overflow-hidden rounded-2xl sm:rounded-[34px] border border-white/80 bg-slate-100 shadow-md sm:shadow-lg aspect-[16/11]">
                    <Image
                      src="/images/hero-kumpul-bolo-pisah.jpg"
                      alt="Foto bersama keluarga besar alumni Universitas Muhammadiyah Surakarta di Jabodetabek"
                      width={1200}
                      height={825}
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 48vw"
                      className="h-full w-full object-cover"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none"
                    />
                  </div>

                  <div className="relative sm:absolute sm:-bottom-5 sm:right-4 lg:-bottom-6 lg:-right-4 z-20 mt-2 sm:mt-0 max-w-full sm:max-w-md rounded-xl sm:rounded-2xl bg-[#0C2340] p-3 sm:p-5 text-white shadow-lg border border-white/10 flex items-center justify-between gap-3 sm:gap-4">
                    <div className="border-l-2 border-[#D97706] pl-3 space-y-0.5">
                      <p className="text-xs sm:text-base font-bold text-white tracking-tight">
                        {landing.heroBadgeTitle}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-300">
                        {landing.heroBadgeSubtitle}
                      </p>
                    </div>

                    <div className="relative h-9 w-20 sm:h-11 sm:w-28 shrink-0 overflow-hidden opacity-90">
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

        {/* 2. STRIP 3 NILAI UTAMA - Simple Bento */}
        <section aria-label="Keunggulan Komunitas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5">
            {values.map((item, index) => {
              const Icon = [Users, Briefcase, Calendar][index] ?? Users;
              return (
                <div
                  key={`${item.judul}-${index}`}
                  className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#C07A28] border border-amber-200/60">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-sm font-bold text-[#0C2340] truncate">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-slate-500 leading-snug line-clamp-1 sm:line-clamp-2">
                      {item.isi}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. SEBARAN WILAYAH: Simple Integrated Bento Map */}
        <section aria-labelledby="sebaran-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-[#F8FAFC] p-4 sm:p-8 lg:p-10 shadow-xs space-y-4">
            {/* Header Bento */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0C2340] text-[11px] sm:text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
                  <span>Cakupan 9 Wilayah Jabodetabek</span>
                </div>
                <h2
                  id="sebaran-heading"
                  className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#0C2340]"
                >
                  Satu Jaringan. 1.011 Alumni.
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/peta"
                  className="inline-flex min-h-[38px] sm:min-h-[42px] items-center gap-1.5 rounded-xl bg-[#0C2340] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#08182E] shadow-2xs cursor-pointer"
                >
                  <span>Buka Peta Lengkap</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />
                </Link>
                <Link
                  href="/gabung"
                  className="inline-flex min-h-[38px] sm:min-h-[42px] items-center gap-1 rounded-xl bg-white border border-slate-300 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <span>Daftar</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Filter Pills Interaktif (Simple Bento Chips) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
              {KAWASAN_LIST.map((kawasan) => {
                const isSelected = selectedKawasan === kawasan.nama;
                return (
                  <button
                    key={kawasan.nama}
                    type="button"
                    onClick={() => setSelectedKawasan(kawasan.nama)}
                    title={`Lihat sebaran di ${kawasan.nama}`}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0C2340] text-white shadow-xs ring-2 ring-[#0C2340]/20'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{kawasan.nama}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isSelected
                          ? 'bg-[#D97706] text-white'
                          : 'bg-amber-50 text-[#B45309] border border-amber-200/60'
                      }`}
                    >
                      {kawasan.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Peta Kartografi Nyata & Seamless */}
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-white">
              <HomeMapWidget
                selectedKawasan={selectedKawasan}
                onSelectKawasan={(k) => setSelectedKawasan(k)}
              />
            </div>

            {/* Transparansi Data */}
            <div className="pt-1 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Data direktori resmi alumni UMS di 5 kawasan
              </span>
              <span className="text-[#0C2340] font-medium hidden sm:inline">
                Pilih wilayah untuk menyorot peta
              </span>
            </div>
          </div>
        </section>

        {/* 4. PROGRAM */}
        <section aria-labelledby="program-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#C07A28] rounded-full" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309]">
                  {landing.programEyebrow}
                </span>
              </div>
              <h2
                id="program-heading"
                className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]"
              >
                {landing.programTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              {landing.programDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {programs.map((item, index) => {
              const Icon = PROGRAM_ICONS[index] ?? Calendar;
              const isDark = index === 0;

              return (
                <Link
                  key={`${item.judul}-${index}`}
                  href={item.href || '#kopdar-section'}
                  className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-3.5 sm:p-6 transition-all duration-200 min-h-[145px] sm:min-h-[220px] ${
                    isDark
                      ? 'bg-[#0C2340] text-white shadow-md'
                      : 'bg-white border border-slate-200/90 text-slate-900 shadow-2xs hover:shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2.5 sm:space-y-4">
                    <div
                      className={`flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl ${
                        isDark
                          ? 'bg-white/10 text-white'
                          : 'bg-amber-50 text-[#C07A28] border border-amber-200/60'
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                      <h3 className="text-xs sm:text-base lg:text-lg font-bold leading-snug line-clamp-2">{item.judul}</h3>
                      <p
                        className={`text-[11px] sm:text-xs lg:text-sm leading-snug sm:leading-relaxed line-clamp-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 sm:pt-4">
                    <div
                      className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-1 ${
                        isDark ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 5. BANNER KOPDAR PERTAMA */}
        <section
          id="kopdar-section"
          aria-labelledby="banner-kopdar-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6 sm:space-y-8"
        >
          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 items-center lg:grid-cols-12 gap-0 lg:gap-8">
              <div className="lg:col-span-5 h-48 sm:h-72 lg:h-full min-h-[200px] sm:min-h-[260px] relative overflow-hidden bg-slate-100">
                <Image
                  src="/images/event-kopdar.jpg"
                  alt="Pertemuan alumni Universitas Muhammadiyah Surakarta di Jabodetabek"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 p-5 sm:p-8 space-y-3 sm:space-y-4">
                <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309]">
                  {landing.kopdarEyebrow}
                </span>
                <h2
                  id="banner-kopdar-heading"
                  className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]"
                >
                  {landing.kopdarTitle}
                </h2>
                <p className="text-xs sm:text-base leading-relaxed text-slate-600">
                  {landing.kopdarDescription}
                </p>
                <div className="pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(!showFormModal)}
                    className="inline-flex min-h-[44px] sm:min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-5 sm:px-6 py-2.5 text-xs sm:text-base font-semibold text-white transition-all hover:bg-[#08182E] shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    <span>{showFormModal ? 'Tutup formulir minat' : landing.kopdarCta}</span>
                    <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  </button>
                </div>
              </div>

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

          <div
            id="form-kopdar-container"
            className={`transition-all duration-300 ${showFormModal ? 'block' : 'hidden'}`}
          >
            <div className="grid grid-cols-1 items-start gap-8 border-t border-slate-200 pt-6 lg:grid-cols-12">
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

        {/* 6. CERITA DARI KELUARGA UMS */}
        <section aria-labelledby="cerita-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="cerita-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0C2340]"
            >
              {landing.ceritaTitle}
            </h2>
            <Link
              href="/kegiatan"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0C2340] hover:text-[#C07A28] transition-colors"
            >
              <span>Lihat semua kegiatan</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {cerita.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              Belum ada kegiatan yang dijadwalkan. Jadwal kopdar akan muncul di sini setelah
              pengurus menambahkannya.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {cerita.map((item) => (
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
          )}
        </section>
      </main>

      <div className="mt-16 sm:mt-24">
        <Footer />
      </div>
      <MobileKopdarCta onOpenForm={() => handleOpenKopdar()} />
    </div>
  );
}

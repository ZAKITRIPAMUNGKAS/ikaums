'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { KopdarInterestForm } from '@/components/home/KopdarInterestForm';
import { TrustPanel } from '@/components/home/TrustPanel';
import { MobileKopdarCta } from '@/components/home/MobileKopdarCta';
import { useKopdarInterestCounts } from '@/lib/kopdar-interest';
import type { LandingContent } from '@/lib/cms-store';
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

const KAWASAN_DETAILS: Record<string, { sublabel: string; regions: string[]; defaultWilayah: string }> = {
  Jakarta: {
    sublabel: 'Pusat, Selatan, Barat, Timur, Utara',
    regions: ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'],
    defaultWilayah: 'Jakarta Selatan',
  },
  Bogor: {
    sublabel: 'Kota & Kab. Bogor',
    regions: ['Bogor'],
    defaultWilayah: 'Bogor',
  },
  Depok: {
    sublabel: 'Kota Depok',
    regions: ['Depok'],
    defaultWilayah: 'Depok',
  },
  Tangerang: {
    sublabel: 'Kota, Tangsel, & Kab. Tangerang',
    regions: ['Tangerang Raya', 'Tangerang'],
    defaultWilayah: 'Tangerang Raya',
  },
  Bekasi: {
    sublabel: 'Kota & Kab. Bekasi',
    regions: ['Bekasi'],
    defaultWilayah: 'Bekasi',
  },
};

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
  const [showFormModal, setShowFormModal] = useState(false);
  const kopdarCounts = useKopdarInterestCounts();

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
  const cities = landing.cities.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 selection:bg-[#0C2340] selection:text-white pb-20 lg:pb-0">
      <Navbar />

      <main className="flex-grow space-y-16 sm:space-y-20 lg:space-y-24">
        {/* 1. HERO */}
        <section className="bg-white overflow-hidden pt-6 pb-4 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="space-y-6 lg:col-span-6 z-10">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-[2.5px] bg-[#C07A28] rounded-full" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309]">
                    {landing.heroEyebrow}
                  </span>
                </div>

                <h1 className="text-[clamp(2.25rem,1.75rem+2.6vw,3.75rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#0C2340]">
                  {landing.heroTitle}{' '}
                  <span className="text-[#C07A28]">{landing.heroHighlight}</span>
                </h1>

                <p className="max-w-[46ch] text-base sm:text-lg leading-[1.65] text-slate-600 sm:max-w-xl">
                  {landing.heroSubtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenKopdar()}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-6 py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-[#08182E] shadow-sm active:scale-[0.99] cursor-pointer"
                  >
                    {landing.heroPrimaryCta}
                    <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  </button>
                  <Link
                    href="/direktori"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm sm:text-base font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 shadow-2xs"
                  >
                    {landing.heroSecondaryCta}
                    <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-500 pt-3">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                  {cities.map((kota, index) => (
                    <span key={kota.nama} className="flex items-center gap-2 sm:gap-2.5">
                      {index > 0 && <span className="text-slate-300">·</span>}
                      <span className="hover:text-slate-700 transition-colors">{kota.nama}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end pt-2 pb-6 lg:py-0">
                <div className="relative w-full max-w-[560px] lg:max-w-none">
                  <div
                    aria-hidden="true"
                    className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bottom-3 left-4 sm:left-8 bg-[#F6EFE4] rounded-tr-[52px] rounded-bl-[36px] rounded-tl-[20px] rounded-br-[60px] pointer-events-none"
                  />

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

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none"
                    />
                  </div>

                  <div className="relative sm:absolute sm:-bottom-5 sm:right-4 lg:-bottom-6 lg:-right-4 z-20 mt-3 sm:mt-0 max-w-full sm:max-w-md rounded-2xl bg-[#0C2340] p-4 sm:p-5 text-white shadow-xl border border-white/10 flex items-center justify-between gap-4">
                    <div className="border-l-2 border-[#D97706] pl-3.5 space-y-0.5">
                      <p className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {landing.heroBadgeTitle}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {landing.heroBadgeSubtitle}
                      </p>
                    </div>

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

        {/* 2. STRIP 3 NILAI UTAMA */}
        <section aria-label="Keunggulan Komunitas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {values.map((item, index) => {
              const Icon = [Users, Briefcase, Calendar][index] ?? Users;
              return (
                <div
                  key={`${item.judul}-${index}`}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#C07A28] border border-amber-200/60">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                      {item.judul}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.isi}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. SEBARAN WILAYAH (Status Riil Prapeluncuran & Live Counter) */}
        <section aria-labelledby="sebaran-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/80 bg-[#F8FAFC] p-6 sm:p-10 lg:p-12 shadow-xs">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
              {/* Sisi Kiri: Teks & Status Pra-peluncuran */}
              <div className="space-y-4 lg:col-span-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#92400E] text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" aria-hidden="true" />
                  <span>Tahap Pra-peluncuran</span>
                </div>

                <h2
                  id="sebaran-heading"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340] leading-tight"
                >
                  {landing.sebaranTitle}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  {landing.sebaranDescription}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenKopdar()}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#08182E] shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    <span>Titip Minat Kopdar</span>
                    <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  </button>
                  <Link
                    href="/peta"
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <span>{landing.sebaranCta}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Sisi Tengah: Ilustrasi Peta Jangkauan Jabodetabek */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center py-4 lg:py-0">
                <div className="relative w-full max-w-[280px] aspect-[4/3] flex items-center justify-center">
                  <Image
                    src="/images/map-jabodetabek-graphic.png"
                    alt="Peta Jangkauan 9 Wilayah Alumni UMS di Jabodetabek"
                    width={280}
                    height={180}
                    className="w-full h-auto object-contain opacity-95 drop-shadow-xs"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-2 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
                  Cakupan 9 Kota &amp; Kabupaten
                </span>
              </div>

              {/* Sisi Kanan: Daftar 5 Kawasan Terpadu (Status Riil & Live Counter) */}
              <div className="space-y-2 lg:col-span-4">
                {cities.map((kota) => {
                  const details = KAWASAN_DETAILS[kota.nama];
                  const totalMinat = details
                    ? details.regions.reduce((acc, r) => acc + (kopdarCounts[r] || 0), 0)
                    : (kopdarCounts[kota.nama] || 0);

                  const isCustom = Boolean(kota.jumlah && kota.jumlah.trim());
                  const isCollected = isCustom || totalMinat > 0;
                  const statusText = isCustom
                    ? `${kota.jumlah} alumni`
                    : totalMinat > 0
                      ? `${totalMinat} peminat`
                      : 'Tahap pendataan';

                  return (
                    <div
                      key={kota.nama}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenKopdar(details?.defaultWilayah || kota.nama)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenKopdar(details?.defaultWilayah || kota.nama);
                        }
                      }}
                      title={`Klik untuk mengisi minat kopdar di kawasan ${kota.nama}`}
                      className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#0C2340]/40 hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:text-white group-hover:bg-[#0C2340] transition-colors shrink-0">
                          <Building2 className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-[#0C2340] block group-hover:text-[#C07A28] transition-colors">
                            {kota.nama}
                          </span>
                          <span className="text-[11px] text-slate-500 block leading-tight">
                            {details?.sublabel || 'Wilayah Jabodetabek'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                            isCollected
                              ? 'bg-amber-50 text-[#B45309] border border-amber-200/80'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {statusText}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#0C2340] transition-transform" />
                      </div>
                    </div>
                  );
                })}

                {/* Transparansi Data */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    Data riil minat &amp; pendataan awal
                  </span>
                  <Link href="/peta" className="text-[#0C2340] font-semibold hover:underline">
                    Buka Peta Wilayah &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PROGRAM */}
        <section aria-labelledby="program-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#C07A28] rounded-full" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309]">
                  {landing.programEyebrow}
                </span>
              </div>
              <h2
                id="program-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]"
              >
                {landing.programTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              {landing.programDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {programs.map((item, index) => {
              const Icon = PROGRAM_ICONS[index] ?? Calendar;
              const isDark = index === 0;

              return (
                <Link
                  key={`${item.judul}-${index}`}
                  href={item.href || '#kopdar-section'}
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
                      <h3 className="text-base sm:text-lg font-bold leading-snug">{item.judul}</h3>
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
                        isDark ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
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

        {/* 5. BANNER KOPDAR PERTAMA */}
        <section
          id="kopdar-section"
          aria-labelledby="banner-kopdar-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8"
        >
          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 items-center lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-5 h-64 sm:h-72 lg:h-full relative overflow-hidden bg-slate-100">
                <Image
                  src="/images/banner-mulai-dari-kotamu.png"
                  alt="Alumni UMS berkumpul dalam kegiatan silaturahmi"
                  width={385}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309]">
                  {landing.kopdarEyebrow}
                </span>
                <h2
                  id="banner-kopdar-heading"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]"
                >
                  {landing.kopdarTitle}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  {landing.kopdarDescription}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(!showFormModal)}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-6 py-2.5 text-sm sm:text-base font-semibold text-white transition-all hover:bg-[#08182E] shadow-xs cursor-pointer active:scale-[0.99]"
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
      <MobileKopdarCta />
    </div>
  );
}

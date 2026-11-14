'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { RegionPicker } from '@/components/home/RegionPicker';
import { RegionInterestBoard } from '@/components/home/RegionInterestBoard';
import { KopdarInterestForm } from '@/components/home/KopdarInterestForm';
import { TrustPanel } from '@/components/home/TrustPanel';
import { InfoKerjaTeaser } from '@/components/home/InfoKerjaTeaser';
import { MobileKopdarCta } from '@/components/home/MobileKopdarCta';
import { COMMUNITY_PLACEHOLDERS } from '@/lib/config';
import { useKopdarInterestCounts } from '@/lib/kopdar-interest';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  MapPin,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react';

const ALASAN = [
  {
    icon: MapPin,
    judul: 'Kopdar dekat rumah',
    isi: 'Domisili dikelompokkan ke sembilan wilayah supaya pertemuan tidak menumpuk di satu titik.',
  },
  {
    icon: MessagesSquare,
    judul: 'Mentoring CV',
    isi: 'Alumni senior bisa membantu ulasan CV dan persiapan wawancara, kontaknya hanya diteruskan dengan izin.',
  },
  {
    icon: ShieldCheck,
    judul: 'Data tidak dipublikasikan',
    isi: 'Nomor WhatsApp dan email hanya dipakai pengurus untuk verifikasi dan info kopdar.',
  },
];

export default function HomePage() {
  const [selectedWilayah, setSelectedWilayah] = useState('');
  const counts = useKopdarInterestCounts();

  const handleSelectRegion = (wilayah: string) => {
    setSelectedWilayah(wilayah);
    const target = document.getElementById('kopdar');
    if (!target) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-24 font-sans text-slate-900 selection:bg-[#0C2340] selection:text-white lg:pb-0">
      <Navbar />

      <main className="flex-grow">
        {/* 1. HERO SECTION PERSIS SEPERTI DESAIN REFERENSI */}
        <section className="bg-white border-b border-slate-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 lg:pt-16 lg:pb-16">
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
                  <a
                    href="#kopdar"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-6 py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-[#08182E] shadow-sm active:scale-[0.99]"
                  >
                    Ikut kopdar terdekat
                    <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  </a>
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

              {/* Kolom Kanan: Visual Showcase Sesuai Desain Referensi */}
              <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[580px] lg:max-w-none">
                  <Image
                    src="/images/hero-illustration-banner.png"
                    alt="Alumni Universitas Muhammadiyah Surakarta berkumpul dan berdiskusi di Jabodetabek"
                    width={980}
                    height={660}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="w-full h-auto object-contain drop-shadow-sm select-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ALASAN: tiga kartu ikon, bersih dan terukur */}
        <section
          aria-labelledby="alasan-heading"
          className="border-b border-slate-200 bg-slate-50 py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2
                id="alasan-heading"
                className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-slate-900"
              >
                Kenapa Didata Terlebih Dulu?
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-[1.6] text-slate-600">
                Supaya jadwal dan lokasi kopdar pertama benar-benar cocok dengan tempat tinggal
                alumni, bukan tebakan pengurus.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {ALASAN.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.judul} className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-[#B45309] border border-amber-200/60">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900">{item.judul}</h3>
                    <p className="mt-1.5 text-sm sm:text-base leading-[1.6] text-slate-600">{item.isi}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. WILAYAH: foto dokumentasi, pemilih wilayah interaktif, papan minat */}
        <section
          id="wilayah"
          aria-labelledby="wilayah-heading"
          className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <figure className="space-y-2.5">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs">
                  <Image
                    src="/images/hero-kumpul-bolo-pisah.jpg"
                    alt="Foto bersama alumni Universitas Muhammadiyah Surakarta di aula Kumpul Bolo Pisah"
                    width={1200}
                    height={675}
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="text-xs sm:text-sm leading-relaxed text-slate-500">
                  {COMMUNITY_PLACEHOLDERS.documentationCaption}
                </figcaption>
              </figure>
            </div>

            <div className="space-y-3 lg:col-span-5">
              <span className="inline-block text-xs sm:text-sm font-semibold text-[#B45309]">
                Sembilan wilayah
              </span>
              <h2
                id="wilayah-heading"
                className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-slate-900"
              >
                Pilih wilayahmu, buka kopdar di kotamu
              </h2>
              <p className="text-sm sm:text-base leading-[1.6] text-slate-600">
                Klik kota atau kabupaten tempatmu tinggal. Form minat kopdar akan langsung
                terisi dan papan minat di bawah ikut diperbarui.
              </p>
              <Link
                href="/peta"
                className="inline-flex min-h-[44px] items-center gap-2 text-sm sm:text-base font-semibold text-[#0C2340] underline decoration-[#D97706] underline-offset-4 transition-colors hover:text-[#D97706]"
              >
                Lihat peta cakupan wilayah
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <RegionPicker selected={selectedWilayah} onSelect={handleSelectRegion} />
          </div>
          <div className="mt-6">
            <RegionInterestBoard counts={counts} />
          </div>
        </section>

        {/* 4. FORM MINAT KOPDAR: section khusus, dekat status pengurus */}
        <section
          id="kopdar"
          aria-labelledby="kopdar-heading"
          className="scroll-mt-20 border-y border-slate-200 bg-white py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="order-2 space-y-5 lg:order-1 lg:col-span-5">
                <div className="space-y-2">
                  <span className="inline-block text-xs sm:text-sm font-semibold text-[#B45309]">
                    Kopdar pertama
                  </span>
                  <h2
                    id="kopdar-heading"
                    className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-slate-900"
                  >
                    Isi minat kopdar di wilayahmu
                  </h2>
                  <p className="text-sm sm:text-base leading-[1.6] text-slate-600">
                    Tanggal dan lokasi belum ditetapkan. Pengurus memilih hari dan titik kumpul
                    dari isian yang masuk, dimulai dari wilayah yang paling banyak peminatnya.
                  </p>
                </div>

                <TrustPanel />
              </div>

              <div className="order-1 lg:order-2 lg:col-span-7">
                <KopdarInterestForm
                  wilayah={selectedWilayah}
                  onWilayahChange={setSelectedWilayah}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. MENTORING: tanpa form, tautan ke /peluang */}
        <section aria-labelledby="mentoring-heading" className="bg-slate-50 border-b border-slate-200">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
            <div className="lg:col-span-7">
              <span className="inline-block text-xs sm:text-sm font-semibold text-[#B45309]">
                Mentoring Alumni
              </span>
              <h2
                id="mentoring-heading"
                className="mt-2 text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-slate-900"
              >
                Mentoring CV &amp; Berbagi Lowongan
              </h2>
              <p className="mt-2 max-w-[60ch] text-sm sm:text-base leading-[1.6] text-slate-600">
                Butuh teman diskusi sebelum melamar kerja, atau bersedia meluangkan waktu
                untuk mengulas CV adik tingkat? Mulai dari halaman Mentoring &amp; Kerja.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
              <Link
                href="/peluang#mentoring"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-5 py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-[#08182E] shadow-xs"
              >
                Cari mentor
                <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
              </Link>
              <Link
                href="/gabung?mentor=ya"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm sm:text-base font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 shadow-2xs"
              >
                Daftar jadi mentor
              </Link>
            </div>
          </div>
        </section>

        {/* 6. INFO KERJA & USAHA */}
        <InfoKerjaTeaser />

        {/* 7. FAQ & PENUTUP */}
        <section
          id="tanya-jawab"
          aria-labelledby="faq-heading"
          className="bg-white py-12 sm:py-16"
        >
          <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6 lg:px-8">
            <div>
              <h2
                id="faq-heading"
                className="mb-6 text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-slate-900"
              >
                Soal Pendataan &amp; Data Kamu
              </h2>

              <div className="divide-y divide-slate-200 border-y border-slate-200">
                <details className="group py-3">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm sm:text-base font-semibold text-slate-900 hover:text-[#0C2340]">
                    <span>Apakah mengirim minat kopdar sama dengan mendaftar anggota?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="max-w-[60ch] pb-3 text-sm sm:text-base leading-[1.6] text-slate-600">
                    Belum. Isian minat kopdar hanya berisi wilayah, waktu, nama, dan nomor
                    WhatsApp untuk kabar jadwal. Pendaftaran anggota penuh dengan data prodi
                    dan angkatan dilakukan terpisah lewat tombol Daftar jadi anggota.
                  </p>
                </details>

                <details className="group py-3">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm sm:text-base font-semibold text-slate-900 hover:text-[#0C2340]">
                    <span>Apakah nomor WhatsApp saya ditampilkan terbuka?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="space-y-2 pb-3">
                    <p className="max-w-[60ch] text-sm sm:text-base leading-[1.6] text-slate-600">
                      Tidak. Nomor hanya dipakai pengurus untuk mengabari jadwal kopdar
                      wilayahmu. Nomor dan email tidak pernah ditampilkan di halaman publik.
                    </p>
                    <Link
                      href="/privasi"
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0C2340] underline decoration-[#D97706] underline-offset-4 hover:text-[#D97706]"
                    >
                      Baca Kebijakan Privasi
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </details>

                <details className="group py-3">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm sm:text-base font-semibold text-slate-900 hover:text-[#0C2340]">
                    <span>Kapan saya dihubungi pengurus?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="max-w-[60ch] pb-3 text-sm sm:text-base leading-[1.6] text-slate-600">
                    Setelah isian dicocokkan, pengurus menghubungi lewat WhatsApp{' '}
                    {COMMUNITY_PLACEHOLDERS.verificationSla}. Tanggal dan lokasi kopdar
                    ditetapkan setelah suara wilayah terkumpul.
                  </p>
                </details>

                <details className="group py-3">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm sm:text-base font-semibold text-slate-900 hover:text-[#0C2340]">
                    <span>Bagaimana hubungannya dengan PP IKA UMS Pusat?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="space-y-2 pb-3">
                    <p className="max-w-[60ch] text-sm sm:text-base leading-[1.6] text-slate-600">
                      Jaringan wilayah ini disiapkan sebagai simpul daerah alumni
                      Universitas Muhammadiyah Surakarta. Status koordinasinya:{' '}
                      {COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}.
                    </p>
                    <Link
                      href="/tentang"
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0C2340] underline decoration-[#D97706] underline-offset-4 hover:text-[#D97706]"
                    >
                      Baca Tentang Komunitas
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </details>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 border-t border-slate-200 pt-8 sm:flex-row sm:items-center">
              <div className="max-w-lg space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Siap ikut kopdar pertama?
                </h2>
                <p className="text-sm sm:text-base leading-[1.6] text-slate-600">
                  Pilih wilayahmu dan tinggalkan kontak. Pengurus yang mengurus jadwalnya.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#kopdar"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-6 py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-[#08182E] active:scale-[0.99] shadow-xs"
                >
                  Kirim minat kopdar
                  <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                </a>
                <Link
                  href="/gabung"
                  className="inline-flex min-h-[44px] items-center justify-center px-4 py-3 text-sm sm:text-base font-semibold text-[#0C2340] underline decoration-[#D97706] underline-offset-4 transition-colors hover:text-[#D97706]"
                >
                  Daftar jadi anggota
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileKopdarCta />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { PatternSection } from '@/components/PatternSection';
import { RegionPicker } from '@/components/home/RegionPicker';
import { RegionInterestBoard } from '@/components/home/RegionInterestBoard';
import { KopdarInterestForm } from '@/components/home/KopdarInterestForm';
import { TrustPanel } from '@/components/home/TrustPanel';
import { InfoKerjaTeaser } from '@/components/home/InfoKerjaTeaser';
import { MobileKopdarCta } from '@/components/home/MobileKopdarCta';
import { COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL, IS_DEMO_MODE } from '@/lib/config';
import { useKopdarInterestCounts } from '@/lib/kopdar-interest';
import {
  ArrowRight,
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
    <div className="flex min-h-screen flex-col bg-[#FDFCF7] pb-24 font-sans text-[#0C2340] selection:bg-[#0C2340] selection:text-white lg:pb-0">
      <Navbar />

      <main className="flex-grow page-grain-base">
        {/* 1. HERO: badge status, satu aksi utama, foto dokumentasi */}
        <PatternSection
          variant="batik"
          tone="light"
          fade="right-focus"
          patternOpacity={0.06}
          patternSize="64px"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 lg:pt-14 lg:pb-16"
        >
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="space-y-5 lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#92400E]/30 bg-[#FFF7ED] px-3 py-1 text-sm font-semibold text-[#92400E]">
                  <span className="h-2 w-2 rounded-full bg-[#92400E]" aria-hidden="true" />
                  Tahap pendataan awal
                </span>
                {IS_DEMO_MODE && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-semibold text-[#92400E]">
                    {DEMO_BADGE_LABEL}
                  </span>
                )}
              </div>

              <h1 className="text-[clamp(1.875rem,1.35rem+2.2vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.025em] text-[#0C2340]">
                Jaringan Alumni UMS di Jabodetabek
              </h1>

              <p className="max-w-[46ch] text-lg leading-[1.6] text-[#475569] sm:max-w-xl">
                Tempat alumni Universitas Muhammadiyah Surakarta di Jakarta, Bogor, Depok,
                Tangerang, dan Bekasi saling kenal lagi.
              </p>
              <p className="max-w-[46ch] text-base leading-[1.65] text-[#475569] sm:max-w-xl">
                Kami sedang mendata domisili untuk menentukan kopdar pertama per wilayah.
                Isi minatmu dulu, tanpa perlu membuat akun.
              </p>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href="#kopdar"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#08182E] active:scale-[0.99]"
                >
                  Kirim minat kopdar
                  <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                </a>
                <Link
                  href="/gabung"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-[#0C2340]/25 bg-white px-5 py-3 text-base font-semibold text-[#0C2340] transition-colors hover:border-[#0C2340]/50 hover:bg-[#FDFCF7]"
                >
                  Daftar jadi anggota
                </Link>
              </div>
              <p className="text-sm text-[#475569]">
                Form minat ± 1 menit. Sudah mendaftar?{' '}
                <Link
                  href="/masuk"
                  className="inline-flex min-h-[44px] items-center font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 hover:text-[#92400E]"
                >
                  Masuk di sini
                </Link>
                .
              </p>
            </div>

            <div className="lg:col-span-6">
              <figure className="space-y-2.5">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#0C2340]/12 bg-[#F3F1EA]">
                  <Image
                    src="/images/alumni-gathering-4.jpg"
                    alt="Alumni Universitas Muhammadiyah Surakarta berjabat tangan di meja registrasi De Terras"
                    width={1200}
                    height={750}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="text-sm leading-relaxed text-[#475569]">
                  {COMMUNITY_PLACEHOLDERS.heroPhotoCaption}
                </figcaption>
              </figure>
            </div>
          </div>
        </PatternSection>

        {/* 2. ALASAN: tiga kartu ikon, satu kalimat per poin */}
        <PatternSection
          aria-labelledby="alasan-heading"
          variant="dots"
          tone="tint"
          fade="soft-edges"
          patternOpacity={0.055}
          patternSize="24px"
          className="border-y border-[#0C2340]/10"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="max-w-2xl">
            <h2
              id="alasan-heading"
              className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
            >
              Kenapa Didata Terlebih Dulu?
            </h2>
            <p className="mt-2 text-base leading-[1.6] text-[#475569]">
              Supaya jadwal dan lokasi kopdar pertama benar-benar cocok dengan tempat tinggal
              alumni, bukan tebakan pengurus.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ALASAN.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.judul} className="surface-card rounded-xl p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3F1EA] text-[#92400E]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-[#0C2340]">{item.judul}</h3>
                  <p className="mt-1 text-base leading-[1.6] text-[#475569]">{item.isi}</p>
                </div>
              );
            })}
          </div>
        </PatternSection>

        {/* 3. WILAYAH: foto dokumentasi, pemilih wilayah interaktif, papan minat */}
        <section
          id="wilayah"
          aria-labelledby="wilayah-heading"
          className="relative z-[1] mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <figure className="space-y-2.5">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[#0C2340]/12 bg-[#F3F1EA]">
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
                <figcaption className="text-sm leading-relaxed text-[#475569]">
                  {COMMUNITY_PLACEHOLDERS.documentationCaption}
                </figcaption>
              </figure>
            </div>

            <div className="space-y-3 lg:col-span-5">
              <span className="inline-block text-sm font-semibold text-[#92400E]">
                Sembilan wilayah
              </span>
              <h2
                id="wilayah-heading"
                className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
              >
                Pilih wilayahmu, buka kopdar di kotamu
              </h2>
              <p className="text-base leading-[1.6] text-[#475569]">
                Klik kota atau kabupaten tempatmu tinggal. Form minat kopdar akan langsung
                terisi dan papan minat di bawah ikut diperbarui.
              </p>
              <Link
                href="/peta"
                className="inline-flex min-h-[44px] items-center gap-2 px-1 text-base font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 transition-colors hover:text-[#92400E]"
              >
                Lihat peta cakupan wilayah
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <RegionPicker selected={selectedWilayah} onSelect={handleSelectRegion} />
          </div>
          <div className="mt-5">
            <RegionInterestBoard counts={counts} />
          </div>
        </section>

        {/* 4. FORM MINAT KOPDAR: section sendiri, dekat status pengurus */}
        <PatternSection
          id="kopdar"
          aria-labelledby="kopdar-heading"
          variant="contour"
          tone="tint"
          fade="top-right"
          patternOpacity={0.075}
          patternSize="180px"
          className="scroll-mt-20 border-y border-[#0C2340]/10"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="order-2 space-y-5 lg:order-1 lg:col-span-5">
              <div className="space-y-3">
                <span className="inline-block text-sm font-semibold text-[#92400E]">
                  Kopdar pertama
                </span>
                <h2
                  id="kopdar-heading"
                  className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
                >
                  Isi minat kopdar di wilayahmu
                </h2>
                <p className="text-base leading-[1.6] text-[#475569]">
                  Tanggal dan lokasi belum ditetapkan. Pengurus memilih hari dan titik kumpul
                  dari isian yang masuk, dimulai dari wilayah yang paling banyak peminatnya.
                </p>
              </div>

              <div className="rounded-lg border border-[#92400E]/25 bg-[#FFF7ED] p-4">
                <p className="text-base font-bold text-[#0C2340]">
                  Dalam koordinasi dengan PP IKA UMS Pusat
                </p>
                <p className="mt-1 text-base leading-[1.6] text-[#475569]">
                  Status resmi pengurus wilayah masih dalam penetapan. Nomor WhatsApp hanya
                  dipakai pengurus untuk verifikasi dan info kopdar.
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
        </PatternSection>

        {/* 5. MENTORING: tanpa form, tautan ke /peluang */}
        <section aria-labelledby="mentoring-heading" className="bg-[#FDFCF7]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
            <div className="lg:col-span-7">
              <span className="inline-block text-sm font-semibold text-[#92400E]">
                Mentoring Alumni
              </span>
              <h2
                id="mentoring-heading"
                className="mt-2 text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
              >
                Mentoring CV &amp; Berbagi Lowongan
              </h2>
              <p className="mt-2 max-w-[60ch] text-base leading-[1.6] text-[#475569]">
                Butuh teman diskusi sebelum melamar kerja, atau bersedia meluangkan waktu
                untuk mengulas CV adik tingkat? Mulai dari halaman Mentoring &amp; Kerja.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
              <Link
                href="/peluang#mentoring"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#08182E]"
              >
                Cari mentor
                <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
              </Link>
              <Link
                href="/gabung?mentor=ya"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-[#0C2340]/25 bg-white px-5 py-3 text-base font-semibold text-[#0C2340] transition-colors hover:border-[#0C2340]/50"
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
          className="relative z-[1] bg-[#FDFCF7] py-12 sm:py-16"
        >
          <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6 lg:px-8">
            <div>
              <h2
                id="faq-heading"
                className="mb-6 text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
              >
                Soal Pendataan &amp; Data Kamu
              </h2>

              <div className="divide-y divide-[#0C2340]/12 border-y border-[#0C2340]/12">
                <details className="group py-2">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-base font-semibold text-[#0C2340]">
                    <span>Apakah mengirim minat kopdar sama dengan mendaftar anggota?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="max-w-[60ch] pb-4 text-base leading-[1.6] text-[#475569]">
                    Belum. Isian minat kopdar hanya berisi wilayah, waktu, nama, dan nomor
                    WhatsApp untuk kabar jadwal. Pendaftaran anggota penuh dengan data prodi
                    dan angkatan dilakukan terpisah lewat tombol Daftar jadi anggota.
                  </p>
                </details>

                <details className="group py-2">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-base font-semibold text-[#0C2340]">
                    <span>Apakah nomor WhatsApp saya ditampilkan terbuka?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="space-y-2 pb-4">
                    <p className="max-w-[60ch] text-base leading-[1.6] text-[#475569]">
                      Tidak. Nomor hanya dipakai pengurus untuk mengabari jadwal kopdar
                      wilayahmu. Nomor dan email tidak pernah ditampilkan di halaman publik.
                    </p>
                    <Link
                      href="/privasi"
                      className="inline-flex min-h-[44px] items-center gap-1.5 px-1 text-base font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 hover:text-[#92400E]"
                    >
                      Baca Kebijakan Privasi
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </details>

                <details className="group py-2">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-base font-semibold text-[#0C2340]">
                    <span>Kapan saya dihubungi pengurus?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="max-w-[60ch] pb-4 text-base leading-[1.6] text-[#475569]">
                    Setelah isian dicocokkan, pengurus menghubungi lewat WhatsApp{' '}
                    {COMMUNITY_PLACEHOLDERS.verificationSla}. Tanggal dan lokasi kopdar
                    ditetapkan setelah suara wilayah terkumpul.
                  </p>
                </details>

                <details className="group py-2">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-base font-semibold text-[#0C2340]">
                    <span>Bagaimana hubungannya dengan PP IKA UMS Pusat?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#475569] transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="space-y-2 pb-4">
                    <p className="max-w-[60ch] text-base leading-[1.6] text-[#475569]">
                      Jaringan wilayah ini disiapkan sebagai simpul daerah alumni
                      Universitas Muhammadiyah Surakarta. Status koordinasinya:{' '}
                      {COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}.
                    </p>
                    <Link
                      href="/tentang"
                      className="inline-flex min-h-[44px] items-center gap-1.5 px-1 text-base font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 hover:text-[#92400E]"
                    >
                      Baca Tentang Komunitas
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </details>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 border-t border-[#0C2340]/12 pt-8 sm:flex-row sm:items-center">
              <div className="max-w-lg space-y-1">
                <h2 className="text-xl font-bold text-[#0C2340]">
                  Siap ikut kopdar pertama?
                </h2>
                <p className="text-base leading-[1.6] text-[#475569]">
                  Pilih wilayahmu dan tinggalkan kontak. Pengurus yang mengurus jadwalnya.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#kopdar"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#08182E] active:scale-[0.99]"
                >
                  Kirim minat kopdar
                  <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                </a>
                <Link
                  href="/gabung"
                  className="inline-flex min-h-[44px] items-center justify-center px-4 py-3 text-base font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 transition-colors hover:text-[#92400E]"
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

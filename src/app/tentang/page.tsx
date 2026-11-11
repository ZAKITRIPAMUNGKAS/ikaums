import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { COMMUNITY_PLACEHOLDERS } from '@/lib/config';
import { ShieldCheck, Users, Compass, ArrowRight, ExternalLink, Landmark } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Komunitas — IKA UMS Wilayah Jabodetabek',
  description:
    'Tujuan pembentukan jaringan alumni Universitas Muhammadiyah Surakarta di Jabodetabek, cara pengelolaannya, serta koordinasi dengan IKA UMS pusat.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-[#475569] mb-6 flex items-center gap-2">
          <Link
            href="/"
            className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]"
          >
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0C2340] font-medium">Tentang Komunitas</span>
        </nav>

        {/* Hero Editorial Asimetris */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-12 border-b border-[#0C2340]/10">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-sm font-semibold text-[#B45309]">
              IKA UMS Wilayah Jabodetabek
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#0C2340] leading-[1.15]">
              Menghubungkan Alumni Universitas Muhammadiyah Surakarta di Jabodetabek
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              Selama ini, komunikasi alumni UMS di Jakarta, Bogor, Depok, Tangerang, dan Bekasi banyak
              tersebar di grup WhatsApp jurusan atau angkatan masing-masing. Situs ini disiapkan sebagai
              titik temu lintas angkatan agar alumni lebih mudah saling kenal berdasarkan domisili,
              menggelar kopdar wilayah, dan berbagi pengalaman kerja.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/gabung"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
              >
                Daftar jadi anggota
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kepengurusan"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Lihat Pengurus &amp; Kontak
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs">
              <div className="aspect-[4/3] w-full bg-[#F3F1EA] relative overflow-hidden">
                <Image
                  src="/images/hero-kumpul-bolo-pisah.jpg"
                  alt="Dokumentasi pertemuan alumni Universitas Muhammadiyah Surakarta"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4 text-sm text-[#475569] leading-relaxed border-t border-[#0C2340]/10">
                <strong className="text-[#0C2340] font-semibold">Dokumentasi Pertemuan Alumni.</strong>{' '}
                {COMMUNITY_PLACEHOLDERS.documentationCaption}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Tiga Prinsip Komunitas */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 border-b border-[#0C2340]/10">
          <article className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F3F1EA] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340]">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#0C2340]">
              Fokus pada Kebutuhan Sehari-hari
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              Kegiatan difokuskan pada hal praktis: saling kenal sesama alumni yang tinggal atau berkantor di wilayah yang sama, mentoring karier untuk lulusan baru, serta berbagi info kerja dan usaha.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F3F1EA] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340]">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#0C2340]">
              Verifikasi Manual Pengurus
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              Setiap pendaftaran ditinjau pengurus dengan mencocokkan nama, program studi, dan tahun masuk UMS agar ruang diskusi tetap nyaman dan bebas dari akun promosi komersial.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F3F1EA] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#0C2340]">
              Privasi dengan Persetujuan Eksplisit
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              Nomor WhatsApp dan email hanya untuk verifikasi dan informasi dari pengurus. Profil hanya muncul di Daftar Anggota bagi anggota yang sudah masuk jika kamu memilih setuju tampil.
            </p>
          </article>
        </section>

        {/* Hubungan dengan IKA UMS Pusat & Dokumen */}
        <section className="py-12 space-y-6">
          <div className="bg-[#F3F1EA] border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0C2340]">
                <Landmark className="w-4 h-4 text-[#B45309] shrink-0" />
                <span>Kedudukan &amp; Koordinasi IKA UMS Pusat</span>
              </div>
              <h2 className="text-xl font-bold text-[#0C2340]">
                Hubungan dengan PP IKA UMS &amp; Kampus
              </h2>
              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                Status koordinasi resmi: <span className="font-semibold text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}</span>.
                Penggunaan nama dan logo IKA UMS ditujukan untuk menghimpun alumni Universitas Muhammadiyah Surakarta wilayah Jabodetabek dalam koridor kepengurusan resmi.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
                <a
                  href={COMMUNITY_PLACEHOLDERS.ppIkaUmsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[44px] font-semibold text-[#0C2340] hover:text-[#B45309] underline underline-offset-4"
                >
                  Situs Resmi UMS
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-[#475569]">
                  Kanal PP IKA UMS: <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.ppIkaUmsChannelLabel}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/privasi"
                className="inline-flex items-center min-h-[44px] px-4 py-2.5 rounded-lg bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/syarat"
                className="inline-flex items-center min-h-[44px] px-4 py-2.5 rounded-lg bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Ketentuan Komunitas
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

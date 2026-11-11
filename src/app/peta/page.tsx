import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { MapInteractiveSection } from '@/components/MapInteractiveSection';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { STATS_JABODETABEK } from '@/data/simulasi';
import { ShieldCheck, Users, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sebaran Wilayah Jabodetabek — IKA UMS Wilayah Jabodetabek',
  description:
    'Cakupan 9 wilayah kota dan kabupaten Ikatan Alumni Universitas Muhammadiyah Surakarta di Jabodetabek untuk koordinasi kopdar terdekat.',
};

export default function PetaPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-2 text-xs text-[#475569] mb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-semibold">Sebaran Wilayah</span>
          </div>
          {IS_DEMO_MODE && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] font-semibold">
              {DEMO_BADGE_LABEL}
            </span>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-7 pb-5 border-b border-[#0C2340]/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#B45309] mb-1.5">
            Cakupan Wilayah Jabodetabek
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
                Sebaran 9 Wilayah Jabodetabek
              </h1>
              <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
                {IS_DEMO_MODE
                  ? 'Contoh tampilan peta sebaran alumni dan mentor di sembilan kota dan kabupaten Jabodetabek.'
                  : 'Pilih kota atau kabupaten di peta untuk melihat cakupan area dan mendaftarkan domisilimu guna persiapan kopdar pertama.'}
              </p>
            </div>

            {IS_DEMO_MODE ? (
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] shrink-0">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-[#0C2340]" />
                  <span>
                    <strong className="text-[#0C2340]">{STATS_JABODETABEK.totalAlumni.toLocaleString('id-ID')}</strong> ({DEMO_BADGE_LABEL})
                  </span>
                </div>
                <span className="text-[#CBD5E1]">·</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-[#B45309]" />
                  <span>
                    <strong className="text-[#0C2340]">{STATS_JABODETABEK.totalMentor}</strong> mentor ({DEMO_BADGE_LABEL})
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <span className="text-xs text-[#475569]">
                  Pendaftar terdata: <strong className="text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.coordinatorCount}</strong>
                </span>
                <Link
                  href="/gabung"
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  Daftar jadi anggota
                  <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Map & Regional Panel */}
        <MapInteractiveSection />

        {/* Catatan Sumber & Privasi Ringkas */}
        <section className="mt-10 bg-white border border-[#0C2340]/12 rounded-xl p-5 sm:p-6 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-[#0C2340]">
                Tentang Data Wilayah &amp; Perlindungan Privasi
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Batas administrasi kota dan kabupaten merujuk data Badan Pusat Statistik (BPS) melalui
                geoBoundaries (lisensi CC BY 3.0 IGO). Setelah pendaftaran berjalan penuh, angka yang
                ditampilkan hanyalah total agregat tingkat kota/kabupaten; alamat rumah anggota tidak pernah dipublikasikan.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { Navbar, Footer } from '@/components/Navigation';
import { PatternSection } from '@/components/PatternSection';
import { MapInteractiveSection } from '@/components/MapInteractiveSection';
import { IS_DEMO_MODE, DEMO_BADGE_LABEL } from '@/lib/config';
import { getCommunityStats } from '@/lib/community-stats';
import { ShieldCheck, Users, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sebaran Wilayah Jabodetabek | IKA UMS Wilayah Jabodetabek',
  description:
    'Cakupan 9 wilayah kota dan kabupaten Ikatan Alumni Universitas Muhammadiyah Surakarta di Jabodetabek untuk koordinasi kopdar terdekat.',
};

async function PetaContent() {
  await connection();
  const stats = await getCommunityStats();

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full">
        {/* Header Wilayah — pattern-contour topografi Jabodetabek */}
        <PatternSection
          as="section"
          variant="contour"
          tone="tint"
          fade="top-right"
          patternOpacity={0.095}
          patternSize="180px"
          className="border-b border-slate-200"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-8 md:pb-10"
        >
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
          <div>
            <span className="inline-block text-sm font-semibold text-[#92400E] mb-1.5">
              Cakupan Wilayah Jabodetabek
            </span>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h1 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-extrabold tracking-[-0.02em] text-[#0C2340]">
                  Sebaran 9 Wilayah Jabodetabek
                </h1>
                <p className="text-base text-[#475569] mt-2 max-w-[48ch] sm:max-w-2xl leading-[1.6]">
                  Pilih kota atau kabupaten di peta untuk melihat cakupan area dan mendaftarkan domisilimu guna persiapan kopdar pertama.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] shrink-0">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-[#0C2340]" />
                  <span>
                    <strong className="text-[#0C2340]">{stats.totalAlumni.toLocaleString('id-ID')}</strong> alumni terdata
                  </span>
                </div>
                <span className="text-[#CBD5E1]">·</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-[#92400E]" />
                  <span>
                    <strong className="text-[#0C2340]">{stats.totalMentor}</strong> mentor
                  </span>
                </div>
                <Link
                  href="/gabung"
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors ml-2"
                >
                  Daftar jadi anggota
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </Link>
              </div>
            </div>
          </div>
        </PatternSection>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full relative z-[1]">
          {/* Map & Regional Panel */}
          <MapInteractiveSection stats={stats} />

          {/* Catatan Sumber & Privasi Ringkas */}
          <section className="mt-10 surface-card rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#0C2340]">
                  Tentang Data Wilayah &amp; Perlindungan Privasi
                </h2>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Batas administrasi kota dan kabupaten merujuk data Badan Pusat Statistik (BPS) melalui
                  geoBoundaries (lisensi CC BY 3.0 IGO). Setelah pendaftaran berjalan penuh, angka yang
                  ditampilkan hanyalah total agregat tingkat kota/kabupaten; alamat rumah anggota tidak pernah dipublikasikan.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PetaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-hidden="true" />}>
      <PetaContent />
    </Suspense>
  );
}

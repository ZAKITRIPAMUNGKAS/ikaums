import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { MapInteractiveSection } from '@/components/MapInteractiveSection';
import { ShieldCheck, MapPin, Database, Award, Users } from 'lucide-react';

export const metadata = {
  title: 'Peta Sebaran Alumni | IKA UMS Jabodetabek',
  description: 'Eksplorasi spasial persebaran alumni Universitas Muhammadiyah Surakarta di wilayah metropolitan Jabodetabek berbasis batas administrasi resmi BPS.'
};

export default function PetaPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0C1222] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#71717A] mb-4">
          <Link href="/" className="hover:text-[#101F5B] transition-colors">Beranda</Link>
          <span className="text-[#A1A1AA]">&gt;</span>
          <span className="text-[#101F5B] font-semibold">Peta Sebaran Wilayah</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DFD8] text-xs font-semibold text-[#101F5B] mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Eksplorasi Spasial 9 Sentra Wilayah</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B1536]">
            Peta Sebaran Alumni Jabodetabek
          </h1>
          <p className="text-sm sm:text-base text-[#52525B] mt-2 max-w-3xl leading-relaxed">
            Pemetaan kartografi berbasis batas wilayah resmi Badan Pusat Statistik (BPS). Membantu alumni UMS menemukan jejaring terdekat, mentor profesional di domisili yang sama, dan titik temu silaturahmi berkala.
          </p>

          {/* Key Facts Strip */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#EAE7DF] text-xs text-[#52525B]">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-[#101F5B]" />
              <span><strong className="text-[#0B1536] font-mono">1.248</strong> Alumni Terdata</span>
            </div>
            <span className="text-[#CBD5E1]">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Award className="w-4 h-4 text-[#D97706]" />
              <span><strong className="text-[#0B1536] font-mono">210</strong> Mentor Siap Berbagi</span>
            </div>
            <span className="text-[#CBD5E1]">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Sumber Geometri: BPS / geoBoundaries IDN-ADM2</span>
            </div>
            <span className="text-[#CBD5E1]">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kepatuhan Privasi UU PDP (k ≥ 5)</span>
            </div>
          </div>
        </div>

        {/* Interactive Map & Contextual Workspace */}
        <MapInteractiveSection />

        {/* Privacy & Governance Note */}
        <div className="mt-12 bg-white border border-[#E2DFD8] rounded-xl p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#FAF9F5] border border-[#E2DFD8] flex items-center justify-center shrink-0 text-[#101F5B]">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1536] mb-1">
                Transparansi Tata Kelola Data & Privasi Spasial Alumni
              </h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Peta ini menggunakan geometri batas wilayah administrasi resmi tingkat Kabupaten/Kota (ADM2) dari Badan Pusat Statistik (BPS) yang dilisensikan melalui CC BY 3.0 IGO. Seluruh angka persebaran alumni disajikan dalam bentuk agregat statistik dengan protokol supresi kelompok kecil (k-anonymity, k ≥ 5). Platform ini tidak pernah mencatat, menyimpan, atau menampilkan titik koordinat hunian privat maupun alamat presisi alumni ke publik tanpa izin tertulis sesuai mandat UU No. 27/2022 tentang Perlindungan Data Pribadi (UU PDP).
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

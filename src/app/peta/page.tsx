import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { MapInteractiveSection } from '@/components/MapInteractiveSection';
import { ShieldCheck, Users, Award } from 'lucide-react';

export const metadata = {
  title: 'Peta Sebaran Alumni | IKA UMS Jabodetabek',
  description: 'Lihat sebaran alumni Universitas Muhammadiyah Surakarta di Jabodetabek berdasarkan kota/kabupaten untuk menemukan teman satu wilayah dan titik kumpul terdekat.'
};

export default function PetaPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#0C2340] font-semibold">Peta Wilayah</span>
        </nav>

        {/* Page Header */}
        <div className="mb-7 pb-5 border-b border-[#0C2340]/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1.5">
            Sebaran Alumni Perantauan
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
                Peta Sebaran Alumni Jabodetabek
              </h1>
              <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
                Klik wilayah di peta atau pilih kota di bawah untuk melihat perkiraan jumlah rekan alumni, mentor terdekat, dan tempat kumpul komunitas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] shrink-0">
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-[#0C2340]" />
                <span><strong className="text-[#0C2340]">1.248</strong> alumni terdata</span>
              </div>
              <span className="text-[#CBD5E1]">·</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-[#D97706]" />
                <span><strong className="text-[#0C2340]">210</strong> mentor aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map & Contextual Workspace */}
        <MapInteractiveSection />

        {/* Catatan Sumber & Privasi Ringkas */}
        <div className="mt-10 bg-white border border-[#0C2340]/12 rounded-xl p-5 sm:p-6 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#0C2340]">
                Tentang Data Wilayah &amp; Perlindungan Privasi
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Peta ini memakai batas administrasi Kabupaten/Kota resmi dari Badan Pusat Statistik (BPS) melalui geoBoundaries (lisensi CC BY 3.0 IGO). Seluruh angka merupakan contoh data agregat komunitas pada tingkat kota; alamat rumah atau lokasi presisi anggota tidak pernah dipublikasikan demi keamanan bersama.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

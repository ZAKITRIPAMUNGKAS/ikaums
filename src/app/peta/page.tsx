import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { MapInteractiveSection } from '@/components/MapInteractiveSection';

export default function PetaPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5F6678] mb-4">
          <Link href="/" className="hover:text-[#101F5B]">Beranda</Link>
          <span>&gt;</span>
          <span className="text-[#101F5B] font-semibold">Peta Alumni</span>
        </nav>

        {/* Page Title & Subtitle */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B]">
            Peta Sebaran Alumni
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6678] mt-1.5 max-w-2xl leading-relaxed">
            Jelajahi persebaran alumni UMS di Jabodetabek dan temukan koneksi berdasarkan wilayah, profesi, atau minat.
          </p>
        </div>

        {/* Interactive Map & Filter Section */}
        <MapInteractiveSection />
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { DEMO_BADGE_LABEL } from '@/lib/config';
import {
  CheckCircle2,
  MapPin,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

export default function ProfilSayaPage() {
  const [tampilDiDirektori, setTampilDiDirektori] = useState(false);
  const [terbukaMentoring, setTerbukaMentoring] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow page-grain-base max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm text-[#475569] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-medium">Profil Saya</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-xs font-semibold">
            {DEMO_BADGE_LABEL}
          </span>
        </nav>

        <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-[#0C2340]/15 shrink-0 relative bg-[#F3F1EA]">
              <Image
                src="/images/avatar-rizal.jpg"
                alt="Foto contoh profil alumni"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0C2340]">
                  Rizal Hakim ({DEMO_BADGE_LABEL})
                </h1>
              </div>
              <div className="text-sm text-[#475569] flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#92400E]" />
                  Engineering Manager · Teknik Informatika &apos;11
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#475569]" />
                  Jakarta Selatan
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/direktori"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors shrink-0"
          >
            Lihat Daftar Anggota
          </Link>
        </section>

        {savedNotice && (
          <div role="status" className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#92400E]" />
            <h2 className="text-lg font-bold text-[#0C2340]">Pengaturan Privasi Tampilan ({DEMO_BADGE_LABEL})</h2>
          </div>

          <div className="space-y-4 divide-y divide-[#0C2340]/10">
            <label htmlFor="pref-direktori" className="flex items-start justify-between gap-4 pt-2 cursor-pointer">
              <div>
                <span className="block text-base font-semibold text-[#0C2340]">Tampilkan di Daftar Anggota</span>
                <span className="block text-sm text-[#475569]">
                  Default adalah Tidak. Hanya anggota yang masuk yang bisa melihat bila diaktifkan.
                </span>
              </div>
              <input
                id="pref-direktori"
                type="checkbox"
                checked={tampilDiDirektori}
                onChange={(e) => {
                  setTampilDiDirektori(e.target.checked);
                  setSavedNotice('Preferensi tampilan Daftar Anggota diperbarui (simulasi).');
                }}
                className="w-5 h-5 mt-0.5 accent-[#0C2340]"
              />
            </label>

            <label htmlFor="pref-mentoring" className="flex items-start justify-between gap-4 pt-4 cursor-pointer">
              <div>
                <span className="block text-base font-semibold text-[#0C2340]">Bersedia Jadi Mentor Alumni</span>
                <span className="block text-sm text-[#475569]">
                  Menampilkan kesiapan berbagi pengalaman karier untuk alumni UMS lainnya.
                </span>
              </div>
              <input
                id="pref-mentoring"
                type="checkbox"
                checked={terbukaMentoring}
                onChange={(e) => {
                  setTerbukaMentoring(e.target.checked);
                  setSavedNotice('Preferensi kesediaan mentoring diperbarui (simulasi).');
                }}
                className="w-5 h-5 mt-0.5 accent-[#0C2340]"
              />
            </label>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

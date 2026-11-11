'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import {
  CheckCircle2,
  MapPin,
  Briefcase,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function ProfilSayaPage() {
  const [tampilDiDirektori, setTampilDiDirektori] = useState(false);
  const [terbukaMentoring, setTerbukaMentoring] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  if (!IS_DEMO_MODE) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
        <Navbar />
        <main className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
          <div className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="w-11 h-11 rounded-xl bg-[#F3F1EA] border border-[#0C2340]/12 flex items-center justify-center text-[#0C2340]">
              <Lock className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                Profil Saya
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
                Masuk Diperlukan untuk Mengakses Profil Saya
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Halaman pengaturan profil, perubahan domisili, dan kontrol persetujuan tampil di
                Daftar Anggota akan aktif setelah fitur masuk anggota dibuka di peluncuran penuh.
              </p>
            </div>

            <div className="bg-[#F3F1EA] border border-[#0C2340]/10 rounded-xl p-4 text-sm text-[#475569] space-y-1.5">
              <p className="font-semibold text-[#0C2340]">Ingin memperbarui atau menghapus data pra-launch?</p>
              <p>
                Hubungi sekretariat pengurus melalui{' '}
                <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactEmail}</span>{' '}
                atau WhatsApp{' '}
                <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactWhatsapp}</span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/masuk"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
              >
                Masuk ke akun
              </Link>
              <Link
                href="/gabung"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Daftar jadi anggota
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
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
              <p className="text-sm text-[#475569] flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#B45309]" />
                  Engineering Manager · Teknik Informatika &apos;11
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#475569]" />
                  Jakarta Selatan
                </span>
              </p>
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
            <ShieldCheck className="w-5 h-5 text-[#B45309]" />
            <h2 className="text-lg font-bold text-[#0C2340]">Pengaturan Privasi Tampilan ({DEMO_BADGE_LABEL})</h2>
          </div>

          <div className="space-y-4 divide-y divide-[#0C2340]/10">
            <label htmlFor="pref-direktori" className="flex items-start justify-between gap-4 pt-2 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#0C2340]">Tampilkan di Daftar Anggota</p>
                <p className="text-xs text-[#475569]">
                  Default adalah Tidak. Hanya anggota yang masuk yang bisa melihat bila diaktifkan.
                </p>
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
                <p className="text-sm font-semibold text-[#0C2340]">Bersedia Jadi Mentor Alumni</p>
                <p className="text-xs text-[#475569]">
                  Menampilkan kesiapan berbagi pengalaman karier untuk alumni UMS lainnya.
                </p>
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

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { getCeritaList } from '@/data/simulasi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { CeritaDampak } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function CeritaPage() {
  const [selectedStory, setSelectedStory] = useState<CeritaDampak | null>(null);
  const stories = useMemo(() => getCeritaList(), []);

  if (!IS_DEMO_MODE || stories.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
        <Navbar />

        <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full space-y-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#475569]">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-semibold">Cerita Alumni</span>
          </nav>

          <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-10 shadow-xs space-y-5">
            <div className="w-11 h-11 rounded-xl bg-[#F3F1EA] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                Segera Hadir
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C2340]">
                Cerita Alumni Belum Diterbitkan
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Halaman ini disiapkan untuk mendokumentasikan kisah nyata sesama alumni UMS di
                Jabodetabek setelah kegiatan wilayah dan wawancara narasumber berjalan. Jika kamu
                ingin berbagi cerita setelah kopdar, kabari pengurus di{' '}
                <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactEmail}</span>.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/gabung"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
              >
                Daftar jadi anggota
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-lg bg-white border border-[#0C2340]/20 hover:border-[#0C2340]/40 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const featured = stories[0];
  const secondaryStories = stories.slice(1);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-2 text-xs text-[#475569] mb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-semibold">Cerita Alumni</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] font-semibold">
            {DEMO_BADGE_LABEL}
          </span>
        </nav>

        <div className="mb-10 border-b border-[#0C2340]/10 pb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#B45309] mb-1.5">
            Catatan Komunitas ({DEMO_BADGE_LABEL})
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
            Cerita Sesama Alumni UMS
          </h1>
          <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
            Perjalanan karier, merintis usaha, dan pertemuan alumni UMS di Jabodetabek.
          </p>
        </div>

        <article className="bg-white border border-[#0C2340]/15 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 mb-10">
          <div className="lg:col-span-6 aspect-[16/10] lg:aspect-auto relative bg-[#0C2340] overflow-hidden min-h-[260px]">
            <Image
              src={featured.gambar || '/images/hero-kumpul-bolo-pisah.jpg'}
              alt={featured.judul}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-[#FEF3C7] text-[#92400E] font-semibold px-2.5 py-0.5 rounded">
                  {featured.kategori}
                </span>
                <span className="text-[#475569]">{featured.jurusanAngkatan}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C2340] leading-tight">
                {featured.judul}
              </h2>

              <blockquote className="pl-4 border-l-2 border-[#B45309] text-sm text-[#475569] italic leading-relaxed py-0.5">
                &ldquo;{featured.kutipan}&rdquo;
              </blockquote>

              <p className="text-sm text-[#334155] leading-relaxed">{featured.ringkasan}</p>
            </div>

            <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-between gap-4 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-[#0C2340]">{featured.tokoh}</p>
                <p className="text-xs text-[#475569]">{featured.prodiAngkatan}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStory(featured)}
                className="inline-flex items-center gap-1 min-h-[44px] font-semibold text-[#0C2340] hover:text-[#B45309] cursor-pointer"
              >
                <span>Baca Kisah Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondaryStories.map((cerita) => (
            <article
              key={cerita.id}
              className="bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="aspect-[16/10] relative bg-[#F3F1EA] overflow-hidden">
                  <Image
                    src={cerita.gambar || '/images/alumni-gathering-4.jpg'}
                    alt={cerita.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-2.5">
                  <span className="inline-block bg-[#F3F1EA] text-[#0C2340] text-xs font-semibold px-2.5 py-0.5 rounded">
                    {cerita.kategori}
                  </span>
                  <h3 className="text-xl font-bold text-[#0C2340]">{cerita.judul}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{cerita.ringkasan}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#0C2340]/8">
                <div className="text-xs">
                  <p className="font-bold text-[#0C2340]">{cerita.tokoh}</p>
                  <p className="text-[#475569]">{cerita.prodiAngkatan}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStory(cerita)}
                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-semibold text-[#0C2340] hover:text-[#B45309] cursor-pointer"
                >
                  <span>Baca</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
          {selectedStory && (
            <DialogContent className="bg-white border border-[#0C2340]/15 rounded-2xl max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#0C2340]">
                  {selectedStory.judul}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#475569]">
                  {selectedStory.tokoh} · {selectedStory.prodiAngkatan} ({DEMO_BADGE_LABEL})
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
                <p>{selectedStory.dampak || selectedStory.ringkasan}</p>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { DATA_CERITA_SIMULASI } from '@/data/simulasi';
import { CeritaDampak } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';

export default function CeritaPage() {
  const [selectedStory, setSelectedStory] = useState<CeritaDampak | null>(null);

  const featured = DATA_CERITA_SIMULASI[0];
  const secondaryStories = DATA_CERITA_SIMULASI.slice(1);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#0C2340] font-semibold">Cerita Alumni</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 border-b border-[#0C2340]/10 pb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1.5">
            Catatan Perantauan
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
            Cerita Sesama Alumni UMS
          </h1>
          <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
            Kisah perjalanan karier, merintis usaha, dan bagaimana pertemuan sesama alumni di Jabodetabek saling membuka jalan baru.
          </p>
        </div>

        {/* Kisah Utama (Layout Editorial Asimetris) */}
        <article
          onClick={() => setSelectedStory(featured)}
          className="bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/40 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 mb-10 cursor-pointer transition-colors group"
        >
          <div className="lg:col-span-6 aspect-[16/10] lg:aspect-auto bg-[#0C2340] overflow-hidden">
            <img
              src={featured.gambar}
              alt={featured.judul}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-[#FEF3C7] text-[#92400E] font-semibold px-2.5 py-0.5 rounded">
                  {featured.kategori}
                </span>
                <span className="text-[#64748B]">{featured.jurusanAngkatan}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C2340] leading-tight group-hover:text-[#1D4ED8] transition-colors">
                {featured.judul}
              </h2>

              <blockquote className="pl-4 border-l-2 border-[#D97706] text-sm text-[#475569] italic leading-relaxed py-0.5">
                &ldquo;{featured.kutipan}&rdquo;
              </blockquote>

              <p className="text-sm text-[#334155] leading-relaxed">
                {featured.ringkasan}
              </p>
            </div>

            <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-between text-xs sm:text-sm">
              <div>
                <p className="font-bold text-[#0C2340]">{featured.tokoh}</p>
                <p className="text-xs text-[#64748B]">{featured.prodiAngkatan}</p>
              </div>
              <span className="font-semibold text-[#0C2340] group-hover:text-[#D97706] inline-flex items-center gap-1 transition-colors">
                <span>Baca Kisah Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>

        {/* Kisah Lainnya (2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondaryStories.map((cerita) => (
            <article
              key={cerita.id}
              onClick={() => setSelectedStory(cerita)}
              className="bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/40 rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="aspect-[16/9] w-full bg-[#0C2340] overflow-hidden">
                  <img
                    src={cerita.gambar}
                    alt={cerita.judul}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="bg-[#F3F1EA] text-[#0C2340] font-semibold px-2.5 py-0.5 rounded">
                      {cerita.kategori}
                    </span>
                    <span className="text-[#64748B]">{cerita.jurusanAngkatan}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0C2340] group-hover:text-[#1D4ED8] transition-colors leading-snug">
                    {cerita.judul}
                  </h3>

                  <p className="text-sm text-[#475569] leading-relaxed">
                    {cerita.ringkasan}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-[#0C2340]/8 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-[#0C2340] block">{cerita.tokoh}</span>
                  <span className="text-xs text-[#64748B]">{cerita.prodiAngkatan}</span>
                </div>
                <span className="text-[#0C2340] font-semibold group-hover:text-[#D97706] inline-flex items-center gap-1 transition-colors">
                  <span>Baca</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Modal Baca Kisah Lengkap */}
        <Dialog
          open={!!selectedStory}
          onOpenChange={(open) => !open && setSelectedStory(null)}
        >
          {selectedStory && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
              <div className="aspect-[16/8] w-full bg-[#0C2340] overflow-hidden">
                <img
                  src={selectedStory.gambar}
                  alt={selectedStory.judul}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <DialogHeader className="text-left space-y-2">
                  <span className="inline-block w-fit bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-2.5 py-0.5 rounded">
                    {selectedStory.kategori}
                  </span>
                  <DialogTitle className="text-2xl font-extrabold text-[#0C2340] leading-snug">
                    {selectedStory.judul}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#64748B]">
                    {selectedStory.tokoh} · {selectedStory.prodiAngkatan}
                  </DialogDescription>
                </DialogHeader>

                <blockquote className="pl-4 border-l-3 border-[#D97706] bg-[#FDFCF7] p-4 rounded-r-lg text-sm text-[#0C2340] italic leading-relaxed">
                  &ldquo;{selectedStory.kutipan}&rdquo;
                </blockquote>

                <div className="space-y-3 text-sm text-[#334155] leading-relaxed">
                  <p>{selectedStory.ringkasan}</p>
                  <p>{selectedStory.dampak}</p>
                  <p>
                    Cerita seperti ini menjadi pengingat bahwa jaringan alumni tidak selalu dimulai dari acara formal berskala besar, melainkan dari kesediaan saling menyapa, memberi informasi lowongan, atau berbagi pengalaman sederhana saat rekan satu almamater baru menapaki dunia kerja di ibu kota.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#0C2340]/10 flex items-center justify-between">
                  <Link
                    href="/gabung"
                    className="text-xs font-semibold text-[#0C2340] hover:text-[#D97706] inline-flex items-center gap-1"
                  >
                    <span>Punya cerita inspiratif dari wilayahmu? Bagikan di sini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedStory(null)}
                    className="px-4 py-2 rounded-lg bg-[#0C2340] text-white text-xs font-semibold cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}

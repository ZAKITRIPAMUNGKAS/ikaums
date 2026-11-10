import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { DATA_CERITA_SIMULASI } from '@/data/simulasi';
import { BookOpen, Sparkles, Quote, ArrowRight, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export default function CeritaPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5F6678] mb-4 font-mono">
          <Link href="/" className="hover:text-[#101F5B]">BERANDA</Link>
          <span>/</span>
          <span className="text-[#101F5B] font-bold">CERITA ALUMNI</span>
        </nav>

        {/* Title */}
        <div className="mb-10 border-b border-[#18213D]/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-1">
                JEJAK INSPIRASI & DAMPAK NYATA
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B]">
                Cerita Sinergi Alumni UMS
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6678] mt-1.5 max-w-2xl leading-relaxed">
                Bukti nyata bagaimana silaturahmi perantau bertransformasi menjadi kemandirian ekonomi, rujukan kerja pertama, dan pembinaan profesional di Jabodetabek.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#EDF1FA] border border-[#101F5B]/15 px-3 py-2 rounded-lg text-xs font-mono text-[#101F5B]">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span>35+ Lapangan Kerja Diciptakan</span>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {DATA_CERITA_SIMULASI.map((cerita) => (
            <article
              key={cerita.id}
              className="bg-white border border-[#E5E8EF] hover:border-[#101F5B]/30 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Cover */}
                <div className="aspect-[16/10] w-full bg-[#101F5B] overflow-hidden relative">
                  <img
                    src={cerita.gambar}
                    alt={cerita.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#101F5B] text-[#F4C542] text-[10px] font-mono px-2.5 py-0.5 font-bold uppercase tracking-wider">
                    {cerita.kategori}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <span className="text-[11px] font-mono text-[#5F6678] block">
                    {cerita.jurusanAngkatan}
                  </span>

                  <h3 className="font-serif text-xl font-bold text-[#101F5B] group-hover:text-[#18213D] transition-colors leading-snug">
                    {cerita.judul}
                  </h3>

                  <blockquote className="pl-3.5 border-l-2 border-[#F4C542] text-xs text-[#5F6678] italic leading-relaxed py-1">
                    "{cerita.kutipan}"
                  </blockquote>

                  <p className="text-xs text-[#334155] leading-relaxed pt-1">
                    {cerita.ringkasan}
                  </p>
                </div>
              </div>

              {/* Impact Footer */}
              <div className="px-6 pb-6 pt-3 border-t border-[#F0F2F6] space-y-3">
                <div className="bg-[#FAFAF8] border border-[#E5E8EF] p-3 rounded-lg text-xs space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#101F5B] block">
                    Bukti Dampak Terukur:
                  </span>
                  <p className="text-[#22775A] font-semibold text-[11px]">
                    {cerita.dampak}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#5F6678] pt-1">
                  <span className="font-bold text-[#18213D]">{cerita.tokoh}</span>
                  <span className="text-[#101F5B] font-bold group-hover:underline flex items-center gap-1">
                    <span>Baca Kisah</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

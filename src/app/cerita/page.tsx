import React from 'react';
import { Navbar, Footer } from '@/components/Navigation';
import { DATA_CERITA_SIMULASI } from '@/data/simulasi';
import { BookOpen, Sparkles, Quote } from 'lucide-react';

export default function CeritaPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#101F5B] bg-[#EDF1FA] px-3 py-1 rounded-full">
            Inspirasi & Bukti Dampak
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B] mt-2">
            Cerita Kolaborasi Alumni
          </h1>
          <p className="text-sm text-[#5F6678] mt-1 max-w-2xl leading-relaxed">
            Kisah nyata bagaimana silaturahmi alumni UMS bermetamorfosis menjadi peluang kerja nyata, bimbingan perantau, dan kemitraan strategis di tanah rantau.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DATA_CERITA_SIMULASI.map((cerita) => (
            <div key={cerita.id} className="bg-white border border-[#E5E8EF] rounded-2xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold bg-[#EDF1FA] text-[#101F5B] px-3 py-1 rounded-full">
                  Kategori: {cerita.kategori}
                </span>

                <h3 className="font-serif text-2xl font-bold text-[#101F5B] mt-4 leading-snug">
                  {cerita.judul}
                </h3>

                <blockquote className="mt-4 pl-4 border-l-2 border-[#F4C542] text-sm text-[#5F6678] italic leading-relaxed">
                  "{cerita.kutipan}"
                </blockquote>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E5E8EF] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#18213D]">{cerita.tokoh}</div>
                  <div className="text-xs text-[#5F6678]">{cerita.prodiAngkatan}</div>
                </div>
                <span className="text-xs font-semibold text-[#101F5B] bg-[#F4C542]/20 px-3 py-1 rounded">
                  Simulasi Kisah
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

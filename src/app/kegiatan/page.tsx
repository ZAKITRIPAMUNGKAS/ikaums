'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { DATA_KEGIATAN_SIMULASI } from '@/data/simulasi';
import { Calendar, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function KegiatanPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [rsvpDone, setRsvpDone] = useState<Record<string, boolean>>({});

  const categories = ['Semua', 'Kopdar', 'Diskusi', 'Mentoring', 'Sosial'];

  const filteredKegiatan = DATA_KEGIATAN_SIMULASI.filter(k => {
    if (activeCategory === 'Semua') return true;
    return k.jenis.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const toggleRsvp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRsvpDone(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5F6678] mb-4">
          <Link href="/" className="hover:text-[#101F5B]">Beranda</Link>
          <span>&gt;</span>
          <span className="text-[#101F5B] font-semibold">Kegiatan</span>
        </nav>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B]">
            Kegiatan & Event
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6678] mt-1.5 max-w-2xl leading-relaxed">
            Ikuti berbagai kegiatan alumni, mulai dari kopdar, diskusi, mentoring, hingga aksi sosial.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#101F5B] text-white shadow-xs'
                  : 'bg-white text-[#5F6678] border border-[#D1D5DB] hover:text-[#101F5B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event List Items */}
        <div className="space-y-4 max-w-4xl">
          {filteredKegiatan.map((item, idx) => {
            const isRegistered = rsvpDone[item.id];
            // Split date to get day and month
            const dayMonth = idx === 0 ? { day: '28', month: 'Nov' } : { day: '06', month: 'Des' };

            return (
              <div
                key={item.id}
                className="bg-white border border-[#E5E8EF] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs hover:border-[#101F5B]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  {/* Left Date Block */}
                  <div className="w-14 h-16 rounded-xl bg-[#EDF1FA] border border-[#101F5B]/15 flex flex-col items-center justify-center shrink-0 text-[#101F5B]">
                    <span className="font-serif font-extrabold text-xl leading-none">{dayMonth.day}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{dayMonth.month}</span>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {item.jenis}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#101F5B] leading-snug">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-[#5F6678] line-clamp-1">
                      {item.deskripsi}
                    </p>
                    <p className="text-[11px] text-[#5F6678] flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3 h-3 text-[#101F5B]" />
                      <span>{item.wilayah} • {item.jamWIB}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#F0F2F6]">
                  <button
                    type="button"
                    onClick={(e) => toggleRsvp(item.id, e)}
                    className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                      isRegistered
                        ? 'bg-[#22775A]/10 text-[#22775A] border border-[#22775A]/20 flex items-center gap-1.5'
                        : 'bg-[#101F5B] hover:bg-[#18213D] text-white shadow-xs'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>RSVP Terkonfirmasi</span>
                      </>
                    ) : (
                      'Daftar RSVP'
                    )}
                  </button>
                  <ChevronRight className="w-5 h-5 text-[#5F6678] hidden sm:block" />
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}

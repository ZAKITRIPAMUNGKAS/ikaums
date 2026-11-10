'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { DATA_KEGIATAN_SIMULASI } from '@/data/simulasi';
import { Calendar, MapPin, ChevronRight, CheckCircle2, Users, Clock, Share2, Sparkles, Building2 } from 'lucide-react';

export default function KegiatanPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [rsvpDone, setRsvpDone] = useState<Record<string, boolean>>({});

  const categories = ['Semua', 'Kopdar Rutin', 'Eksplorasi Karir', 'Bisnis Alumni'];

  const filteredKegiatan = DATA_KEGIATAN_SIMULASI.filter(k => {
    if (activeCategory === 'Semua') return true;
    return k.jenis.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const toggleRsvp = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRsvpDone(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const featuredEvent = DATA_KEGIATAN_SIMULASI[0];
  const isFeaturedRsvp = rsvpDone[featuredEvent.id];
  const featuredRegistered = featuredEvent.terdaftarCount + (isFeaturedRsvp ? 1 : 0);
  const featuredPct = Math.round((featuredRegistered / featuredEvent.kapasitas) * 100);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5F6678] mb-4 font-mono">
          <Link href="/" className="hover:text-[#101F5B]">BERANDA</Link>
          <span>/</span>
          <span className="text-[#101F5B] font-bold">AGENDA & EVENT</span>
        </nav>

        {/* Title & Precision Lead */}
        <div className="mb-8 border-b border-[#18213D]/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-1">
                INISIATIF KOMUNITAS • JABODETABEK 2026
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B]">
                Agenda Pertemuan & Kolaborasi
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6678] mt-1.5 max-w-2xl leading-relaxed">
                Dari temu kangen santai hingga diskusi karir strategis dan sarasehan bisnis. Daftarkan kehadiran Anda untuk membangun sinergi nyata di tanah rantau.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#EDF1FA] border border-[#101F5B]/15 px-3 py-2 rounded-lg text-xs font-mono text-[#101F5B]">
              <Users className="w-4 h-4 text-[#101F5B]" />
              <span><strong>185+</strong> Alumni Hadir Bulan Ini</span>
            </div>
          </div>
        </div>

        {/* LUMA-INSPIRED FEATURED EVENT HERO CARD */}
        <section className="mb-12">
          <div className="bg-white border border-[#18213D]/15 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Cover (Authentic Photography) */}
            <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[420px] bg-[#101F5B] overflow-hidden">
              <img
                src={featuredEvent.gambar}
                alt={featuredEvent.judul}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101F5B]/80 via-transparent to-black/20 lg:hidden"></div>
              <div className="absolute top-4 left-4 bg-[#101F5B] text-[#F4C542] text-[10px] font-mono px-3 py-1 font-bold uppercase tracking-wider shadow-xs">
                AGENDA UTAMA TERDEKAT
              </div>
            </div>

            {/* Event Details & RSVP Telemetry */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#FEF3C7] text-[#92400E] text-[11px] font-mono font-bold px-3 py-1 rounded">
                    {featuredEvent.jenis}
                  </span>
                  <span className="text-xs font-mono text-[#5F6678] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#101F5B]" />
                    {featuredEvent.jamWIB}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101F5B] leading-tight">
                  {featuredEvent.judul}
                </h2>

                <p className="text-xs sm:text-sm text-[#5F6678] leading-relaxed">
                  {featuredEvent.deskripsi}
                </p>

                <div className="pt-2 space-y-2 text-xs border-y border-[#18213D]/10 py-3">
                  <div className="flex items-start gap-2 text-[#18213D]">
                    <Calendar className="w-4 h-4 text-[#101F5B] shrink-0 mt-0.5" />
                    <span className="font-semibold">{featuredEvent.tanggalWIB}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#5F6678]">
                    <MapPin className="w-4 h-4 text-[#101F5B] shrink-0 mt-0.5" />
                    <span>{featuredEvent.lokasiSpesifik}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#5F6678]">
                    <Building2 className="w-4 h-4 text-[#101F5B] shrink-0 mt-0.5" />
                    <span>Penyelenggara: {featuredEvent.penanggungJawab}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#5F6678]">Kapasitas Kursi</span>
                    <span className="font-bold text-[#101F5B]">
                      {featuredRegistered} / {featuredEvent.kapasitas} ({featuredPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E8EF] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#101F5B] h-full transition-all duration-300"
                      style={{ width: `${Math.min(featuredPct, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* RSVP Action */}
              <div className="pt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleRsvp(featuredEvent.id)}
                  className={`flex-1 py-3 px-5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 ${
                    isFeaturedRsvp
                      ? 'bg-[#22775A] text-white hover:bg-[#1a5d46]'
                      : 'bg-[#101F5B] text-white hover:bg-[#18213D]'
                  }`}
                >
                  {isFeaturedRsvp ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#F4C542]" />
                      <span>RSVP Terdaftar (Hadir)</span>
                    </>
                  ) : (
                    <span>Konfirmasi Kehadiran (RSVP)</span>
                  )}
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* COMPACT EVENT ROWS WITH CATEGORY FILTER */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#18213D]/10 pb-4">
            <h3 className="font-serif text-2xl font-bold text-[#101F5B]">
              Daftar Seluruh Agenda Mendatang
            </h3>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-mono uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? 'bg-[#101F5B] text-white font-bold shadow-xs'
                      : 'bg-white text-[#5F6678] border border-[#D1D5DB] hover:text-[#101F5B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Event List Items */}
          <div className="space-y-4">
            {filteredKegiatan.map((item, idx) => {
              const isRegistered = rsvpDone[item.id];
              const dateParts = item.tanggalWIB.split(',')[1]?.trim().split(' ') || ['28', 'Nov', '2026'];
              const day = dateParts[0] || '28';
              const month = dateParts[1] || 'Nov';

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#E5E8EF] hover:border-[#101F5B]/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs transition-all"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    {/* Date Stamp */}
                    <div className="w-14 h-16 rounded-lg bg-[#EDF1FA] border border-[#101F5B]/15 flex flex-col items-center justify-center shrink-0 text-[#101F5B]">
                      <span className="font-serif font-extrabold text-2xl leading-none">{day}</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider mt-0.5">{month}</span>
                    </div>

                    {/* Thumbnail Image */}
                    <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 hidden md:block border border-[#18213D]/10 bg-[#E8ECF2]">
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {item.jenis}
                        </span>
                        <span className="text-[11px] font-mono text-[#5F6678]">
                          {item.jamWIB}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#101F5B] leading-snug">
                        {item.judul}
                      </h4>
                      <p className="text-xs text-[#5F6678] line-clamp-1 max-w-xl">
                        {item.deskripsi}
                      </p>
                      <p className="text-[11px] text-[#5F6678] flex items-center gap-1.5 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#101F5B]" />
                        <span>{item.lokasiSpesifik}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#F0F2F6]">
                    <div className="text-right hidden lg:block pr-2">
                      <span className="text-[10px] font-mono text-[#5F6678] block">Kapasitas</span>
                      <span className="text-xs font-mono font-bold text-[#101F5B]">
                        {item.terdaftarCount + (isRegistered ? 1 : 0)} / {item.kapasitas} Kursi
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleRsvp(item.id, e)}
                      className={`text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all ${
                        isRegistered
                          ? 'bg-[#22775A]/10 text-[#22775A] border border-[#22775A]/30 flex items-center gap-1.5'
                          : 'bg-[#101F5B] hover:bg-[#18213D] text-white shadow-xs'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hadir</span>
                        </>
                      ) : (
                        'Daftar RSVP'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

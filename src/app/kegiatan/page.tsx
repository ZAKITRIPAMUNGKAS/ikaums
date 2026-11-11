'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Navbar, Footer } from '@/components/Navigation';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { DATA_KEGIATAN_SIMULASI } from '@/data/simulasi';
import { Calendar, MapPin, CheckCircle2, Clock, Building2 } from 'lucide-react';

const STORAGE_KEY_RSVP = 'ikaums_persisted_rsvp';

export default function KegiatanPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [rsvpDone, setRsvpDone] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const categories = [
    { id: 'Semua', label: 'Semua Agenda' },
    { id: 'Kopdar Rutin', label: 'Kopdar Rutin' },
    { id: 'Berbagi Pengalaman', label: 'Berbagi Pengalaman' },
    { id: 'Kumpul Wirausaha', label: 'Kumpul Wirausaha' }
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RSVP);
      if (saved) setRsvpDone(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleRsvp = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRsvpDone(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_RSVP, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const filteredKegiatan = DATA_KEGIATAN_SIMULASI.filter(k => {
    if (activeCategory === 'Semua') return true;
    return k.jenis.toLowerCase() === activeCategory.toLowerCase();
  });

  const featuredEvent = DATA_KEGIATAN_SIMULASI[0];
  const isFeaturedRsvp = rsvpDone[featuredEvent.id];
  const featuredRegistered = featuredEvent.terdaftarCount + (isFeaturedRsvp ? 1 : 0);
  const featuredPct = Math.round((featuredRegistered / featuredEvent.kapasitas) * 100);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#0C2340] font-semibold">Agenda Kumpul</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 border-b border-[#0C2340]/10 pb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1.5">
            Jadwal Pertemuan Komunitas
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
            Agenda Kumpul &amp; Silaturahmi Alumni
          </h1>
          <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
            Dari kopdar ngopi per wilayah sampai sesi berbagi pengalaman kerja. Tandai kehadiranmu supaya panitia mudah menyiapkan tempat.
          </p>
        </div>

        {/* Highlight Acara Terdekat */}
        <section className="mb-12">
          <div className="bg-white border border-[#0C2340]/15 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-7 relative min-h-[260px] lg:min-h-[400px] bg-[#0C2340] overflow-hidden">
              <img
                src={featuredEvent.gambar}
                alt={featuredEvent.judul}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-3 py-1 rounded">
                    Agenda Terdekat · {featuredEvent.jenis}
                  </span>
                  <span className="text-xs text-[#64748B] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#0C2340]" />
                    {featuredEvent.jamWIB}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340] leading-tight">
                  {featuredEvent.judul}
                </h2>

                <p className="text-sm text-[#475569] leading-relaxed">
                  {featuredEvent.deskripsi}
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm border-y border-[#0C2340]/10 py-3.5">
                  <div className="flex items-start gap-2 text-[#0C2340]">
                    <Calendar className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <span className="font-semibold">{featuredEvent.tanggalWIB}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#475569]">
                    <MapPin className="w-4 h-4 text-[#0C2340] shrink-0 mt-0.5" />
                    <span>{featuredEvent.lokasiSpesifik}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#475569]">
                    <Building2 className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                    <span>Penyelenggara: {featuredEvent.penanggungJawab}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#64748B]">Perkiraan peserta hadir</span>
                    <span className="font-bold text-[#0C2340]">
                      {featuredRegistered} / {featuredEvent.kapasitas} kursi
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F1EA] h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={shouldReduceMotion ? false : { width: 0 }}
                      animate={{ width: `${Math.min(featuredPct, 100)}%` }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-[#0C2340] h-full rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => toggleRsvp(featuredEvent.id)}
                  className={`w-full py-3 px-5 rounded-lg text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                    isFeaturedRsvp
                      ? 'bg-[#15803D] text-white hover:bg-[#166534]'
                      : 'bg-[#0C2340] text-white hover:bg-[#16325C]'
                  }`}
                >
                  {isFeaturedRsvp ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#FDE047]" />
                      <span>Terdaftar Hadir (Batalkan jika berhalangan)</span>
                    </>
                  ) : (
                    <span>Konfirmasi Kehadiran (RSVP)</span>
                  )}
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Daftar Agenda Lainnya */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0C2340]/10 pb-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0C2340]">
              Jadwal Kegiatan Jabodetabek
            </h2>

            <AnimatedTabs
              tabs={categories}
              activeTab={activeCategory}
              onChange={setActiveCategory}
              layoutId="kegiatanCategoryTabs"
            />
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredKegiatan.map((item, idx) => {
                const isRegistered = rsvpDone[item.id];
                const dateParts = item.tanggalWIB.split(',')[1]?.trim().split(' ') || ['28', 'Nov', '2026'];
                const day = dateParts[0] || '28';
                const month = dateParts[1] || 'Nov';

                return (
                  <motion.div
                    key={item.id}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-[#0C2340]/12 hover:border-[#0C2340]/35 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full md:w-auto">
                      {/* Kotak Tanggal */}
                      <div className="w-16 h-18 rounded-lg bg-[#0C2340] text-white flex flex-col items-center justify-center shrink-0">
                        <span className="font-extrabold text-2xl leading-none">{day}</span>
                        <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider mt-1">
                          {month}
                        </span>
                      </div>

                      {/* Foto Kegiatan */}
                      <div className="w-24 h-18 rounded-lg overflow-hidden shrink-0 hidden sm:block border border-[#0C2340]/10 bg-[#F3F1EA]">
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-[#F3F1EA] text-[#0C2340] text-xs font-semibold px-2.5 py-0.5 rounded">
                            {item.jenis}
                          </span>
                          <span className="text-xs text-[#64748B]">
                            {item.jamWIB}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0C2340] leading-snug">
                          {item.judul}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#475569] line-clamp-2 max-w-2xl">
                          {item.deskripsi}
                        </p>
                        <p className="text-xs text-[#475569] flex items-center gap-1.5 pt-0.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                          <span>{item.lokasiSpesifik}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-[#0C2340]/10 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-[#64748B] block">Peserta</span>
                        <span className="text-xs font-bold text-[#0C2340]">
                          {item.terdaftarCount + (isRegistered ? 1 : 0)} / {item.kapasitas} kursi
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleRsvp(item.id, e)}
                        className={`text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isRegistered
                            ? 'bg-[#F0FDF4] text-[#15803D] border border-[#16A34A]/30'
                            : 'bg-[#0C2340] hover:bg-[#16325C] text-white shadow-xs'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hadir</span>
                          </>
                        ) : (
                          'Daftar Hadir'
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

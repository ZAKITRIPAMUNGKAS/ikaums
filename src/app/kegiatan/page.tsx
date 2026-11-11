'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Navbar, Footer } from '@/components/Navigation';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { getKegiatanList } from '@/data/simulasi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { Calendar, MapPin, CheckCircle2, Clock, Building2, ArrowRight } from 'lucide-react';

const STORAGE_KEY_RSVP = 'ikaums_persisted_rsvp';

export default function KegiatanPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [rsvpDone, setRsvpDone] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const kegiatanList = useMemo(() => getKegiatanList(), []);

  const categories = [
    { id: 'Semua', label: 'Semua Kopdar' },
    { id: 'Kopdar Rutin', label: 'Kopdar Wilayah' },
    { id: 'Berbagi Pengalaman', label: 'Berbagi Pengalaman' },
    { id: 'Kumpul Wirausaha', label: 'Temu Wirausaha' },
  ];

  useEffect(() => {
    if (!IS_DEMO_MODE) return;
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_RSVP);
        if (saved) setRsvpDone(JSON.parse(saved));
      } catch {
        // abaikan error penyimpanan lokal
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleRsvp = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRsvpDone((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_RSVP, JSON.stringify(updated));
      } catch {
        // abaikan error penyimpanan lokal
      }
      return updated;
    });
  };

  if (!IS_DEMO_MODE || kegiatanList.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
        <Navbar />

        <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#475569]">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-semibold">Jadwal Kopdar</span>
          </nav>

          <header className="border-b border-[#0C2340]/10 pb-6 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
              Tahap Pra-Launch
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
              Jadwal Kopdar IKA UMS Jabodetabek
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Belum ada jadwal kopdar terbuka yang ditetapkan karena kami sedang menghimpun minat hari dan domisili dari pendaftar awal.
            </p>
          </header>

          <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0C2340]">
                Rencana Kopdar Pertama Wilayah Jabodetabek
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                Lokasi dan tanggal pasti akan diumumkan lewat WhatsApp kepada anggota yang sudah terdaftar.
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-[#F3F1EA] rounded-xl p-4 space-y-1">
                <dt className="text-xs font-semibold text-[#475569] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#B45309]" />
                  <span>Tanggal &amp; Jam</span>
                </dt>
                <dd className="font-semibold text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.firstKopdarDate}</dd>
              </div>
              <div className="bg-[#F3F1EA] rounded-xl p-4 space-y-1">
                <dt className="text-xs font-semibold text-[#475569] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#B45309]" />
                  <span>Lokasi Pertemuan</span>
                </dt>
                <dd className="font-semibold text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.firstKopdarLocation}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/#kopdar"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
              >
                Usulkan hari &amp; wilayah kopdar
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </Link>
              <Link
                href="/gabung"
                className="inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-lg bg-white border border-[#0C2340]/20 hover:border-[#0C2340]/45 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Daftar jadi anggota
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const filteredKegiatan = kegiatanList.filter((k) => {
    if (activeCategory === 'Semua') return true;
    return k.jenis.toLowerCase() === activeCategory.toLowerCase();
  });

  const featuredEvent = kegiatanList[0];
  const isFeaturedRsvp = rsvpDone[featuredEvent.id];

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
            <span className="text-[#0C2340] font-semibold">Jadwal Kopdar</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] font-semibold">
            {DEMO_BADGE_LABEL}
          </span>
        </nav>

        <div className="mb-8 border-b border-[#0C2340]/10 pb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#B45309] mb-1.5">
            Jadwal Pertemuan ({DEMO_BADGE_LABEL})
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
            Jadwal Kopdar Alumni Jabodetabek
          </h1>
          <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
            Dari kopdar per wilayah hingga sesi berbagi pengalaman kerja. Tandai kehadiranmu agar koordinator mudah memperkirakan tempat.
          </p>
        </div>

        {/* Highlight Acara */}
        <section className="mb-12">
          <div className="bg-white border border-[#0C2340]/15 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative min-h-[260px] lg:min-h-[380px] bg-[#0C2340] overflow-hidden">
              <Image
                src={featuredEvent.gambar || '/images/hero-kumpul-bolo-pisah.jpg'}
                alt={featuredEvent.judul}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-3 py-1 rounded">
                    {featuredEvent.jenis}
                  </span>
                  <span className="text-xs text-[#475569] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#0C2340]" />
                    {featuredEvent.jamWIB}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-[#0C2340] leading-snug">
                  {featuredEvent.judul}
                </h2>

                <div className="space-y-2 text-xs text-[#475569]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B45309] shrink-0" />
                    <span className="font-semibold text-[#0C2340]">{featuredEvent.tanggalWIB}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#B45309] shrink-0" />
                    <span>{featuredEvent.lokasi || featuredEvent.lokasiSpesifik} · {featuredEvent.wilayah}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#475569] shrink-0" />
                    <span>Koordinator: {featuredEvent.penanggungJawab || featuredEvent.penyelenggara || 'Pengurus Wilayah'}</span>
                  </div>
                </div>

                <p className="text-sm text-[#475569] leading-relaxed">{featuredEvent.deskripsi}</p>
              </div>

              <button
                type="button"
                onClick={(e) => toggleRsvp(featuredEvent.id, e)}
                className={`w-full min-h-[44px] py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isFeaturedRsvp
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-[#0C2340] text-white hover:bg-[#16325C]'
                }`}
              >
                {isFeaturedRsvp ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hadir (Simulasi)</span>
                  </>
                ) : (
                  <span>Daftar Hadir ({DEMO_BADGE_LABEL})</span>
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <AnimatedTabs
            tabs={categories}
            activeTab={activeCategory}
            onChange={setActiveCategory}
            layoutId="kegiatanCategoryTabs"
          />
          <span className="text-xs text-[#475569]">
            Menampilkan <strong>{filteredKegiatan.length}</strong> contoh jadwal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredKegiatan.map((item) => {
              const isRsvped = rsvpDone[item.id];
              return (
                <motion.article
                  key={item.id}
                  layout={!shouldReduceMotion}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#F3F1EA] relative overflow-hidden">
                      <Image
                        src={item.gambar || '/images/alumni-gathering-4.jpg'}
                        alt={item.judul}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="inline-block bg-[#F3F1EA] text-[#0C2340] text-[11px] font-semibold px-2.5 py-0.5 rounded">
                        {item.jenis}
                      </span>
                      <h3 className="text-base font-bold text-[#0C2340] leading-snug">{item.judul}</h3>
                      <p className="text-xs text-[#475569]">{item.tanggalWIB} · {item.wilayah}</p>
                      <p className="text-xs text-[#475569]">{item.deskripsi}</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <button
                      type="button"
                      onClick={(e) => toggleRsvp(item.id, e)}
                      className={`w-full min-h-[44px] rounded-lg text-xs font-semibold cursor-pointer ${
                        isRsvped
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-[#F3F1EA] text-[#0C2340] hover:bg-[#0C2340] hover:text-white'
                      }`}
                    >
                      {isRsvped ? 'Tercatat Hadir' : 'Tandai Berminat Hadir'}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

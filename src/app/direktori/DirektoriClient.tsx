'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Navbar, Footer } from '@/components/Navigation';
import { PatternSection } from '@/components/PatternSection';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getAlumniList } from '@/data/simulasi';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { IS_DEMO_MODE, DEMO_BADGE_LABEL } from '@/lib/config';
import { AlumniProfile } from '@/types';
import {
  Search,
  MapPin,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Briefcase,
  Sparkles,
  Users,
  X,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY_CONNECTIONS = 'ikaums_persisted_connections';
const STORAGE_KEY_MESSAGES = 'ikaums_persisted_messages';

export default function DirektoriPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
  const [mentorOnly, setMentorOnly] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [connectionRequested, setConnectionRequested] = useState<Record<string, boolean>>({});
  const [messagesSent, setMessagesSent] = useState<Record<string, boolean>>({});
  const [activeProfileTab, setActiveProfileTab] = useState('tentang');
  const [visibleCount, setVisibleCount] = useState(6);
  const shouldReduceMotion = useReducedMotion();

  const [alumniList, setAlumniList] = useState<AlumniProfile[]>(() => getAlumniList());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/alumni')
      .then((res) => (res.ok ? res.json() : []))
      .then((realData: AlumniProfile[]) => {
        if (!isMounted) return;
        if (Array.isArray(realData)) {
          if (IS_DEMO_MODE) {
            setAlumniList([...realData, ...getAlumniList()]);
          } else {
            setAlumniList(realData);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const regions = useMemo(
    () => ['Semua Wilayah', ...WILAYAH_JABODETABEK.map((w) => w.nama)],
    []
  );

  const profileTabs = [
    { id: 'tentang', label: 'Tentang' },
    { id: 'pengalaman', label: 'Pekerjaan' },
    { id: 'keahlian', label: 'Keahlian' },
    { id: 'kontribusi', label: 'Mentoring' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedConn = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
        if (savedConn) setConnectionRequested(JSON.parse(savedConn));
        const savedMsg = localStorage.getItem(STORAGE_KEY_MESSAGES);
        if (savedMsg) setMessagesSent(JSON.parse(savedMsg));
      } catch {
        // abaikan error penyimpanan lokal
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const paramWilayah = params.get('wilayah');
        if (paramWilayah) {
          const decoded = decodeURIComponent(paramWilayah).toLowerCase();
          const match = regions.find(
            (r) =>
              r.toLowerCase() === decoded ||
              decoded.includes(r.toLowerCase()) ||
              r.toLowerCase().includes(decoded)
          );
          if (match) {
            setSelectedRegion(match);
          }
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [regions]);

  const toggleConnection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setConnectionRequested((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(updated));
      } catch {
        // abaikan error
      }
      return updated;
    });
  };

  const handleSendMessage = (id: string) => {
    setMessagesSent((prev) => {
      const updated = { ...prev, [id]: true };
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
      } catch {
        // abaikan error
      }
      return updated;
    });
  };

  const filteredAlumni = useMemo(() => {
    return alumniList.filter((alumni) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        alumni.nama.toLowerCase().includes(q) ||
        alumni.prodi.toLowerCase().includes(q) ||
        (alumni.perusahaan && alumni.perusahaan.toLowerCase().includes(q)) ||
        alumni.pekerjaan.toLowerCase().includes(q) ||
        alumni.industri.toLowerCase().includes(q);

      const matchesRegion =
        selectedRegion === 'Semua Wilayah' ||
        alumni.wilayah.toLowerCase().includes(selectedRegion.toLowerCase()) ||
        selectedRegion.toLowerCase().includes(alumni.wilayah.toLowerCase());

      const matchesMentor = !mentorOnly || alumni.bersediaMentoring;

      return matchesSearch && matchesRegion && matchesMentor;
    });
  }, [alumniList, searchTerm, selectedRegion, mentorOnly]);

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full">
        {/* Hero Section Header */}
        <PatternSection
          as="section"
          variant="dots"
          tone="tint"
          fade="right-focus"
          patternOpacity={0.055}
          patternSize="24px"
          className="border-b border-slate-200/80 bg-linear-to-b from-white via-slate-50/60 to-slate-50"
          contentClassName="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 md:pb-12"
        >
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-2 text-xs text-[#475569] mb-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
                Beranda
              </Link>
              <span aria-hidden="true" className="text-slate-400">/</span>
              <span className="text-[#0C2340] font-semibold">Daftar Anggota</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/peta"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0C2340] hover:text-[#92400E] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#92400E]" />
                <span>Peta Sebaran</span>
              </Link>
              {IS_DEMO_MODE && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] font-semibold">
                  {DEMO_BADGE_LABEL}
                </span>
              )}
            </div>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#92400E] text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>Direktori Resmi Alumni Jabodetabek &amp; Karawang</span>
              </div>
              <h1 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-extrabold tracking-[-0.02em] text-[#0C2340]">
                Daftar Anggota IKA UMS
              </h1>
              <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
                Cari rekan satu jurusan, teman sewilayah domisili, atau senior yang bersedia berbagi pengalaman kerja dan peluang karier.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/peta"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] text-xs sm:text-sm font-semibold text-[#0C2340] hover:text-[#08182E] border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all shadow-2xs"
              >
                <MapPin className="w-4 h-4 text-[#92400E]" />
                <span>Lihat Sebaran Wilayah</span>
              </Link>
            </div>
          </div>
        </PatternSection>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full relative z-[1]">
          {/* Search & Filter Toolbar */}
          <div className="surface-card rounded-2xl p-4 sm:p-6 mb-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  aria-label="Cari nama, program studi, profesi, atau bidang industri"
                  placeholder="Cari nama, program studi, profesi, instansi, atau industri..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setVisibleCount(6);
                  }}
                  className="w-full min-h-[46px] pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm sm:text-base text-[#0C2340] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    aria-label="Hapus kata kunci pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap items-center gap-2.5 sm:gap-3">
                <div className="relative min-w-[180px] flex-1 sm:flex-initial">
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setVisibleCount(6);
                    }}
                    aria-label="Filter wilayah Jabodetabek & Karawang"
                    className="w-full min-h-[46px] bg-white border border-slate-300 text-sm sm:text-base text-[#0C2340] font-medium px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 transition-all cursor-pointer"
                  >
                    {regions.map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMentorOnly(!mentorOnly);
                    setVisibleCount(6);
                  }}
                  className={`min-h-[46px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 border cursor-pointer select-none ${
                    mentorOnly
                      ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${mentorOnly ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                  <span>Siap Mentoring</span>
                </button>
              </div>
            </div>

            {/* Filter Status Summary & Reset */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#475569] pt-3 border-t border-slate-200">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  Menampilkan <strong className="text-[#0C2340]">{Math.min(visibleCount, filteredAlumni.length)}</strong> dari{' '}
                  <strong className="text-[#0C2340]">{filteredAlumni.length}</strong> profil alumni terverifikasi
                  {selectedRegion !== 'Semua Wilayah' ? ` di ${selectedRegion}` : ''}
                  {mentorOnly ? ' · siap mentoring' : ''}
                </span>
              </span>
              {(searchTerm || selectedRegion !== 'Semua Wilayah' || mentorOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRegion('Semua Wilayah');
                    setMentorOnly(false);
                    setVisibleCount(6);
                  }}
                  className="text-xs font-semibold text-[#92400E] hover:underline cursor-pointer inline-flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset filter
                </button>
              )}
            </div>
          </div>

          {/* Alumni Grid List (2-Column Responsive Bento Layout) */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 animate-pulse shadow-2xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-20" />
                    </div>
                  </div>
                  <div className="h-12 bg-slate-100 rounded-xl" />
                  <div className="h-8 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 sm:p-14 text-center space-y-3.5 max-w-xl mx-auto shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                <Users className="w-6 h-6 text-[#92400E]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                {alumniList.length === 0
                  ? 'Belum ada profil anggota lain yang disetujui tampil di direktori.'
                  : 'Belum ada profil yang cocok dengan pencarian Anda.'}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                {alumniList.length === 0
                  ? 'Data alumni akan muncul otomatis di sini begitu pengurus memverifikasi pendaftar baru yang menyetujui opsi tampil di direktori.'
                  : 'Coba ubah kata kunci pencarian, pilih wilayah lain, atau nonaktifkan filter mentoring.'}
              </p>
              {alumniList.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRegion('Semua Wilayah');
                    setMentorOnly(false);
                    setVisibleCount(6);
                  }}
                  className="mt-3 inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#08182E] text-white text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  Tampilkan Semua Alumni
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredAlumni.slice(0, visibleCount).map((alumni) => (
                    <motion.article
                      key={alumni.id}
                      layout={!shouldReduceMotion}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-slate-200/90 hover:border-[#0C2340]/45 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group"
                    >
                      <div>
                        {/* Header Kartu: Avatar + Nama + Wilayah */}
                        <div className="flex items-start gap-3.5 sm:gap-4 mb-3.5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative shadow-2xs">
                            {alumni.avatarUrl ? (
                              <Image
                                src={alumni.avatarUrl}
                                alt={`Foto profil ${alumni.nama}`}
                                fill
                                loading="lazy"
                                sizes="56px"
                                unoptimized={alumni.avatarUrl.startsWith('data:')}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-base">
                                {alumni.avatarInitials}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h2 className="text-base sm:text-lg font-bold text-[#0C2340] truncate group-hover:text-[#92400E] transition-colors leading-snug">
                                {alumni.nama}
                              </h2>
                              {alumni.bersediaMentoring && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold shrink-0">
                                  <Sparkles className="w-3 h-3 text-emerald-600" />
                                  <span>Mentor</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
                              {alumni.prodi} · &apos;{String(alumni.angkatan).slice(-2)}
                            </p>

                            <div className="inline-flex items-center gap-1 text-xs text-[#92400E] font-semibold bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span>{alumni.wilayah}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pekerjaan / Instansi */}
                        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 mb-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Profesi &amp; Bidang Kerja</span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-[#0C2340] line-clamp-2 leading-snug">
                            {alumni.pekerjaan}
                            {alumni.perusahaan ? ` di ${alumni.perusahaan}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Footer Kartu: Verifikasi & Aksi */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Terverifikasi</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveProfileTab('tentang');
                            setSelectedAlumni(alumni);
                          }}
                          className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#0C2340] text-[#0C2340] hover:text-white text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer shadow-2xs group-hover:bg-[#0C2340] group-hover:text-white"
                        >
                          <span>Lihat profil</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {filteredAlumni.length > visibleCount && (
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-[#0C2340] text-sm sm:text-base font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    Tampilkan profil lainnya ({filteredAlumni.length - visibleCount} lagi)
                  </button>
                </div>
              )}
            </div>
          )}

        {/* Profile Detail Modal */}
        <Dialog open={!!selectedAlumni} onOpenChange={(open) => !open && setSelectedAlumni(null)}>
          {selectedAlumni && (
            <DialogContent className="max-w-xl bg-white border border-slate-200 rounded-2xl p-0 overflow-hidden shadow-2xl">
              <div className="bg-[#0C2340] h-20 relative" />

              <div className="px-6 sm:px-8 pb-8 -mt-10 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-sm relative shrink-0">
                    {selectedAlumni.avatarUrl ? (
                      <Image
                        src={selectedAlumni.avatarUrl}
                        alt={`Foto ${selectedAlumni.nama}`}
                        fill
                        sizes="80px"
                        unoptimized={selectedAlumni.avatarUrl.startsWith('data:')}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-2xl">
                        {selectedAlumni.avatarInitials}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleConnection(selectedAlumni.id)}
                      className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        connectionRequested[selectedAlumni.id]
                          ? 'bg-[#0C2340]/10 text-[#0C2340] border border-slate-300'
                          : 'bg-[#0C2340] hover:bg-[#16325C] text-white shadow-xs'
                      }`}
                    >
                      {connectionRequested[selectedAlumni.id] ? 'Permintaan Terkirim' : 'Ajak Berkenalan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage(selectedAlumni.id)}
                      className="min-h-[44px] text-xs font-semibold text-[#0C2340] border border-slate-300 px-3.5 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{messagesSent[selectedAlumni.id] ? 'Sapaan Terkirim' : 'Kirim Pesan'}</span>
                    </button>
                  </div>
                </div>

                <DialogHeader className="text-left space-y-1">
                  <DialogTitle className="text-xl font-extrabold text-[#0C2340] flex items-center gap-2">
                    <span>{selectedAlumni.nama}</span>
                  </DialogTitle>
                  <DialogDescription className="text-sm text-[#475569]">
                    {selectedAlumni.prodi} · Angkatan {selectedAlumni.angkatan}
                    {IS_DEMO_MODE ? ` (${DEMO_BADGE_LABEL})` : ''}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-1 text-base text-[#0C2340]">
                  <p className="font-semibold">
                    {selectedAlumni.pekerjaan}
                    {selectedAlumni.perusahaan ? ` · ${selectedAlumni.perusahaan}` : ''}
                  </p>
                  <span className="text-sm text-[#475569] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#92400E]" />
                    <span>{selectedAlumni.wilayah} · {selectedAlumni.industri}</span>
                  </span>
                </div>

                {messagesSent[selectedAlumni.id] && (
                  <div className="mt-4 bg-[#F0FDF4] border border-[#16A34A]/25 p-3 rounded-lg text-sm text-[#15803D] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Pesan perkenalanmu dicatat dalam mode simulasi.</span>
                  </div>
                )}

                <div className="mt-5 mb-4">
                  <AnimatedTabs
                    tabs={profileTabs}
                    activeTab={activeProfileTab}
                    onChange={setActiveProfileTab}
                    layoutId="profileModalTabs"
                  />
                </div>

                <div className="pt-1 text-base text-[#475569] leading-relaxed">
                  {activeProfileTab === 'tentang' && (
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-[#0C2340] text-base">Sekilas Profil</h3>
                      <p>{selectedAlumni.bio}</p>
                    </div>
                  )}
                  {activeProfileTab === 'pengalaman' && (
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
                      <p className="font-bold text-[#0C2340]">{selectedAlumni.pekerjaan}</p>
                      <span className="block text-sm text-[#475569]">
                        {selectedAlumni.perusahaan || 'Praktisi Independen'} · Domisili {selectedAlumni.wilayah}
                      </span>
                      <span className="block text-sm text-[#475569] pt-1">
                        Bidang industri: {selectedAlumni.industri}.
                      </span>
                    </div>
                  )}
                  {activeProfileTab === 'keahlian' && (
                    <div className="flex flex-wrap gap-2">
                      {selectedAlumni.keahlian.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-[#0C2340] px-3 py-1 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {activeProfileTab === 'kontribusi' && (
                    <p>
                      {selectedAlumni.bersediaMentoring
                        ? `Bersedia menjadi mentor untuk ulas CV dan diskusi karier (${selectedAlumni.mentoringFokus || selectedAlumni.industri}).`
                        : 'Terbuka untuk berkenalan dengan alumni satu wilayah dan berbagi informasi kegiatan.'}
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}

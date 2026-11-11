'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Navbar, Footer } from '@/components/Navigation';
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
  Building2,
  UserPlus,
  HeartHandshake,
  Lock,
  ArrowRight,
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
  const shouldReduceMotion = useReducedMotion();

  const alumniList = useMemo(() => getAlumniList(), []);

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
    if (!IS_DEMO_MODE) return;

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

  if (!IS_DEMO_MODE) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
        <Navbar />

        <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full space-y-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#475569]">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-semibold">Daftar Anggota</span>
          </nav>

          <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="w-12 h-12 rounded-xl bg-[#F3F1EA] border border-[#0C2340]/12 flex items-center justify-center text-[#0C2340]">
              <Lock className="w-5 h-5" />
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                Khusus Anggota Terdaftar
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                Daftar Anggota Tidak Ditampilkan untuk Umum
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Untuk menjaga privasi alumni, nama, pekerjaan, dan domisili hanya dapat dilihat oleh
                anggota terverifikasi yang sudah masuk, dan hanya menampilkan rekan yang memberi izin
                secara eksplisit saat mendaftar.
              </p>
            </div>

            <div className="bg-[#F3F1EA] border border-[#0C2340]/10 rounded-xl p-4 sm:p-5 text-sm text-[#475569] space-y-2">
              <p className="font-semibold text-[#0C2340]">Status Tahap Pra-Launch</p>
              <p>
                Saat ini kami sedang mengumpulkan pendaftaran awal anggota lintas wilayah Jabodetabek.
                Daftar sekarang agar kamu mendapat kabar ketika Daftar Anggota dan jadwal kopdar pertama dibuka.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/gabung"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
              >
                Daftar jadi anggota
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </Link>
              <Link
                href="/masuk"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Masuk ke akun
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

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
            <span className="text-[#0C2340] font-semibold">Daftar Anggota</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] font-semibold">
            {DEMO_BADGE_LABEL}
          </span>
        </nav>

        <div className="mb-8 border-b border-[#0C2340]/10 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#B45309] mb-1.5">
              Jaringan Alumni Jabodetabek ({DEMO_BADGE_LABEL})
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
              Daftar Anggota IKA UMS
            </h1>
            <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
              Cari teman satu jurusan, rekan sewilayah domisili, atau senior yang bersedia berbagi pengalaman kerja.
            </p>
          </div>

          <Link
            href="/peta"
            className="inline-flex items-center justify-center min-h-[44px] text-xs sm:text-sm font-semibold text-[#0C2340] hover:text-[#B45309] border border-[#0C2340]/20 bg-white px-4 py-2.5 rounded-lg self-start lg:self-auto transition-colors shrink-0"
          >
            Lihat Sebaran Wilayah
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#0C2340]/12 rounded-xl p-4 sm:p-5 mb-8 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Cari nama, program studi, profesi, atau bidang industri"
                placeholder="Cari nama, program studi, profesi, atau bidang industri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FDFCF7] border border-[#0C2340]/15 rounded-lg text-sm text-[#0C2340] placeholder:text-[#64748B] focus:outline-none focus:border-[#0C2340]"
              />
            </div>

            <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-2.5 sm:gap-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                aria-label="Filter wilayah Jabodetabek"
                className="w-full md:w-auto min-h-[44px] bg-[#FDFCF7] border border-[#0C2340]/15 text-xs sm:text-sm text-[#0C2340] font-medium px-3 sm:px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#0C2340]"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>

              <label className="w-full md:w-auto min-h-[44px] inline-flex items-center justify-center md:justify-start gap-2 px-3 sm:px-3.5 py-2.5 rounded-lg border border-[#0C2340]/15 bg-[#FDFCF7] text-xs sm:text-sm font-medium text-[#0C2340] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mentorOnly}
                  onChange={(e) => setMentorOnly(e.target.checked)}
                  className="rounded text-[#0C2340] focus:ring-[#0C2340]"
                />
                <span>Siap mentoring</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#475569] pt-1 border-t border-[#0C2340]/8">
            <span>
              Menampilkan <strong className="text-[#0C2340]">{filteredAlumni.length}</strong> profil ({DEMO_BADGE_LABEL})
              {selectedRegion !== 'Semua Wilayah' ? ` di ${selectedRegion}` : ''}
            </span>
            {(searchTerm || selectedRegion !== 'Semua Wilayah' || mentorOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('Semua Wilayah');
                  setMentorOnly(false);
                }}
                className="min-h-[44px] px-2 text-[#0C2340] font-semibold hover:underline cursor-pointer"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>

        {/* Alumni Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="bg-white border border-dashed border-[#0C2340]/20 rounded-xl p-12 text-center space-y-3">
            <p className="text-base font-semibold text-[#0C2340]">
              Belum ada profil yang cocok dengan filter saat ini.
            </p>
            <p className="text-sm text-[#475569]">
              Coba pilih wilayah lain atau hapus kata kunci pencarian.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('Semua Wilayah');
                setMentorOnly(false);
              }}
              className="mt-2 inline-flex items-center min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] text-white text-xs font-semibold cursor-pointer"
            >
              Tampilkan Semua Alumni
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredAlumni.map((alumni) => {
                const isRequested = connectionRequested[alumni.id];
                return (
                  <motion.article
                    key={alumni.id}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-[#0C2340]/12 hover:border-[#0C2340]/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveProfileTab('tentang');
                        setSelectedAlumni(alumni);
                      }}
                      className="text-left w-full space-y-3 cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#0C2340]/10 bg-[#F3F1EA] shrink-0 relative">
                          {alumni.avatarUrl ? (
                            <Image
                              src={alumni.avatarUrl}
                              alt={`Foto profil ${alumni.nama}`}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-sm">
                              {alumni.avatarInitials}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h2 className="text-base font-bold text-[#0C2340] truncate max-w-full">
                              {alumni.nama}
                            </h2>
                            {alumni.bersediaMentoring && (
                              <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] text-[11px] px-2 py-0.5 rounded font-semibold">
                                <HeartHandshake className="w-3 h-3" />
                                Mentor
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#475569] truncate">
                            {alumni.prodi} · &apos;{String(alumni.angkatan).slice(-2)}
                          </p>
                          <p className="text-xs text-[#0C2340] font-medium flex items-center gap-1 pt-0.5 truncate">
                            <Building2 className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                            <span className="truncate">{alumni.pekerjaan}</span>
                          </p>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#0C2340]/10 text-xs">
                      <span className="inline-flex items-center gap-1 text-[#475569] truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                        <span className="truncate">{alumni.wilayah}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => toggleConnection(alumni.id, e)}
                        className={`inline-flex items-center gap-1 min-h-[44px] px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                          isRequested
                            ? 'bg-[#0C2340]/10 text-[#0C2340]'
                            : 'bg-[#F3F1EA] hover:bg-[#0C2340] text-[#0C2340] hover:text-white'
                        }`}
                      >
                        {isRequested ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Diminta</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Sapa Rekan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Profile Detail Modal */}
        <Dialog open={!!selectedAlumni} onOpenChange={(open) => !open && setSelectedAlumni(null)}>
          {selectedAlumni && (
            <DialogContent className="max-w-xl bg-white border border-[#0C2340]/15 rounded-2xl p-0 overflow-hidden shadow-2xl">
              <div className="bg-[#0C2340] h-20 relative" />

              <div className="px-6 sm:px-8 pb-8 -mt-10 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-[#F3F1EA] shadow-sm relative shrink-0">
                    {selectedAlumni.avatarUrl ? (
                      <Image
                        src={selectedAlumni.avatarUrl}
                        alt={`Foto ${selectedAlumni.nama}`}
                        fill
                        sizes="80px"
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
                          ? 'bg-[#0C2340]/10 text-[#0C2340] border border-[#0C2340]/20'
                          : 'bg-[#0C2340] hover:bg-[#16325C] text-white shadow-xs'
                      }`}
                    >
                      {connectionRequested[selectedAlumni.id] ? 'Permintaan Terkirim' : 'Ajak Berkenalan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage(selectedAlumni.id)}
                      className="min-h-[44px] text-xs font-semibold text-[#0C2340] border border-[#0C2340]/20 px-3.5 py-2 rounded-lg hover:bg-[#FDFCF7] transition-colors flex items-center gap-1.5 cursor-pointer"
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
                  <DialogDescription className="text-xs text-[#475569]">
                    {selectedAlumni.prodi} · Angkatan {selectedAlumni.angkatan} ({DEMO_BADGE_LABEL})
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-1 text-sm text-[#0C2340]">
                  <p className="font-semibold">
                    {selectedAlumni.pekerjaan}
                    {selectedAlumni.perusahaan ? ` · ${selectedAlumni.perusahaan}` : ''}
                  </p>
                  <p className="text-xs text-[#475569] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>{selectedAlumni.wilayah} · {selectedAlumni.industri}</span>
                  </p>
                </div>

                {messagesSent[selectedAlumni.id] && (
                  <div className="mt-4 bg-[#F0FDF4] border border-[#16A34A]/25 p-3 rounded-lg text-xs text-[#15803D] flex items-center gap-2">
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

                <div className="pt-1 text-sm text-[#475569] leading-relaxed">
                  {activeProfileTab === 'tentang' && (
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-[#0C2340] text-sm">Sekilas Profil</h3>
                      <p>{selectedAlumni.bio}</p>
                    </div>
                  )}
                  {activeProfileTab === 'pengalaman' && (
                    <div className="bg-[#FDFCF7] p-4 rounded-lg border border-[#0C2340]/10 space-y-1">
                      <p className="font-bold text-[#0C2340]">{selectedAlumni.pekerjaan}</p>
                      <p className="text-xs text-[#475569]">
                        {selectedAlumni.perusahaan || 'Praktisi Independen'} · Domisili {selectedAlumni.wilayah}
                      </p>
                      <p className="text-xs text-[#475569] pt-1">
                        Bidang industri: {selectedAlumni.industri}.
                      </p>
                    </div>
                  )}
                  {activeProfileTab === 'keahlian' && (
                    <div className="flex flex-wrap gap-2">
                      {selectedAlumni.keahlian.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-[#F3F1EA] text-[#0C2340] px-3 py-1 rounded-md text-xs font-medium"
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
      </main>

      <Footer />
    </div>
  );
}

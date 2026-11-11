'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
import { DATA_ALUMNI_SIMULASI } from '@/data/simulasi';
import { AlumniProfile } from '@/types';
import {
  Search,
  MapPin,
  CheckCircle2,
  MessageSquare,
  Building2,
  UserPlus,
  HeartHandshake
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

  const regions = [
    'Semua Wilayah',
    'Jakarta Selatan',
    'Jakarta Pusat',
    'Jakarta Barat',
    'Jakarta Timur',
    'Jakarta Utara',
    'Tangerang Raya',
    'Bekasi',
    'Depok',
    'Bogor'
  ];

  const profileTabs = [
    { id: 'tentang', label: 'Tentang' },
    { id: 'pengalaman', label: 'Pekerjaan' },
    { id: 'keahlian', label: 'Bidang Keahlian' },
    { id: 'kontribusi', label: 'Kesediaan Bantu' }
  ];

  useEffect(() => {
    try {
      const savedConn = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
      if (savedConn) setConnectionRequested(JSON.parse(savedConn));
      const savedMsg = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMsg) setMessagesSent(JSON.parse(savedMsg));
    } catch {}

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramWilayah = params.get('wilayah');
      if (paramWilayah) {
        const decoded = decodeURIComponent(paramWilayah).toLowerCase();
        const match = regions.find(
          r =>
            r.toLowerCase() === decoded ||
            decoded.includes(r.toLowerCase()) ||
            r.toLowerCase().includes(decoded)
        );
        if (match) {
          setSelectedRegion(match);
        }
      }
    }
  }, []);

  const toggleConnection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setConnectionRequested(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSendMessage = (id: string) => {
    setMessagesSent(prev => {
      const updated = { ...prev, [id]: true };
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const filteredAlumni = useMemo(() => {
    return DATA_ALUMNI_SIMULASI.filter(alumni => {
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
  }, [searchTerm, selectedRegion, mentorOnly]);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#0C2340] font-semibold">Direktori Alumni</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 border-b border-[#0C2340]/10 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1.5">
              Jejaring Perantauan Jabodetabek
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
              Direktori Alumni UMS
            </h1>
            <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
              Cari teman satu jurusan, kenalan satu domisili, atau senior yang bersedia berbagi pengalaman kerja di Jabodetabek.
            </p>
          </div>

          <Link
            href="/peta"
            className="text-xs sm:text-sm font-semibold text-[#0C2340] hover:text-[#D97706] border border-[#0C2340]/20 bg-white px-4 py-2.5 rounded-lg self-start lg:self-auto transition-colors shrink-0"
          >
            Lihat Sebaran di Peta Wilayah
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#0C2340]/12 rounded-xl p-4 sm:p-5 mb-8 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, program studi, profesi, atau bidang industri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDFCF7] border border-[#0C2340]/15 rounded-lg text-sm text-[#0C2340] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0C2340]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                aria-label="Filter wilayah Jabodetabek"
                className="bg-[#FDFCF7] border border-[#0C2340]/15 text-sm text-[#0C2340] font-medium px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#0C2340]"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>

              <label className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#0C2340]/15 bg-[#FDFCF7] text-xs sm:text-sm font-medium text-[#0C2340] cursor-pointer select-none">
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

          <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 border-t border-[#0C2340]/8">
            <span>
              Menampilkan <strong className="text-[#0C2340]">{filteredAlumni.length}</strong> profil alumni contoh
              {selectedRegion !== 'Semua Wilayah' ? ` di wilayah ${selectedRegion}` : ''}
            </span>
            {(searchTerm || selectedRegion !== 'Semua Wilayah' || mentorOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('Semua Wilayah');
                  setMentorOnly(false);
                }}
                className="text-[#0C2340] font-semibold hover:underline cursor-pointer"
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
            <p className="text-sm text-[#64748B]">
              Coba pilih wilayah lain atau hapus kata kunci pencarian.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('Semua Wilayah');
                setMentorOnly(false);
              }}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-[#0C2340] text-white text-xs font-semibold cursor-pointer"
            >
              Tampilkan Semua Alumni
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredAlumni.map((alumni) => {
                const isRequested = connectionRequested[alumni.id];
                return (
                  <motion.div
                    key={alumni.id}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      setActiveProfileTab('tentang');
                      setSelectedAlumni(alumni);
                    }}
                    className="bg-white border border-[#0C2340]/12 hover:border-[#0C2340]/40 rounded-xl p-5 flex flex-col justify-between gap-4 shadow-2xs hover:shadow-sm cursor-pointer transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#0C2340]/10 bg-[#F3F1EA]">
                        {alumni.avatarUrl ? (
                          <img
                            src={alumni.avatarUrl}
                            alt={alumni.nama}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-base">
                            {alumni.avatarInitials}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-[#0C2340] group-hover:text-[#16325C] transition-colors">
                            {alumni.nama}
                          </h3>
                          {alumni.bersediaMentoring && (
                            <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] text-[11px] px-2 py-0.5 rounded font-semibold">
                              <HeartHandshake className="w-3 h-3" />
                              Siap Mentoring
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#64748B]">
                          {alumni.prodi} · Angkatan {alumni.angkatan}
                        </p>

                        <p className="text-sm font-semibold text-[#0C2340] pt-0.5">
                          {alumni.pekerjaan}
                        </p>

                        {alumni.perusahaan && (
                          <p className="text-xs text-[#475569] flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                            <span className="truncate">{alumni.perusahaan}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#0C2340]/8">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[#475569] flex items-center gap-1 mr-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                          {alumni.wilayah}
                        </span>
                        {alumni.keahlian.slice(0, 2).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-[#F3F1EA] text-[#0C2340] text-[11px] px-2 py-0.5 rounded font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleConnection(alumni.id, e)}
                        className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          isRequested
                            ? 'bg-[#F3F1EA] text-[#0C2340] border border-[#0C2340]/20'
                            : 'bg-[#0C2340] hover:bg-[#16325C] text-white'
                        }`}
                      >
                        {isRequested ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                            <span>Permintaan Terkirim</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>Ajak Terhubung</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Modal Detail Profil Alumni */}
        <Dialog
          open={!!selectedAlumni}
          onOpenChange={(open) => !open && setSelectedAlumni(null)}
        >
          {selectedAlumni && (
            <DialogContent className="p-0 overflow-hidden max-w-xl max-h-[92vh]">
              <div className="h-28 bg-[#0C2340] relative overflow-hidden">
                <img
                  src="/images/alumni-gathering-4.jpg"
                  alt="Kegiatan alumni UMS"
                  className="w-full h-full object-cover opacity-35"
                />
              </div>

              <div className="px-6 pb-6 pt-0 relative overflow-y-auto max-h-[calc(92vh-7rem)]">
                <div className="-mt-10 mb-4 flex justify-between items-end gap-3">
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white shrink-0">
                    {selectedAlumni.avatarUrl ? (
                      <img
                        src={selectedAlumni.avatarUrl}
                        alt={selectedAlumni.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-lg">
                        {selectedAlumni.avatarInitials}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button
                      type="button"
                      onClick={() => toggleConnection(selectedAlumni.id)}
                      className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        connectionRequested[selectedAlumni.id]
                          ? 'bg-[#F3F1EA] text-[#0C2340] border border-[#0C2340]/20'
                          : 'bg-[#0C2340] hover:bg-[#16325C] text-white shadow-xs'
                      }`}
                    >
                      {connectionRequested[selectedAlumni.id] ? 'Permintaan Terkirim' : 'Ajak Terhubung'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage(selectedAlumni.id)}
                      className="text-xs font-semibold text-[#0C2340] border border-[#0C2340]/20 px-3.5 py-2 rounded-lg hover:bg-[#FDFCF7] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{messagesSent[selectedAlumni.id] ? 'Sapaan Terkirim' : 'Kirim Sapaan'}</span>
                    </button>
                  </div>
                </div>

                <DialogHeader className="text-left space-y-1">
                  <DialogTitle className="text-xl font-extrabold text-[#0C2340] flex items-center gap-2">
                    <span>{selectedAlumni.nama}</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#64748B]">
                    {selectedAlumni.prodi} · Angkatan {selectedAlumni.angkatan}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-1 text-sm text-[#0C2340]">
                  <p className="font-semibold">
                    {selectedAlumni.pekerjaan}
                    {selectedAlumni.perusahaan ? ` · ${selectedAlumni.perusahaan}` : ''}
                  </p>
                  <p className="text-xs text-[#475569] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{selectedAlumni.wilayah} · {selectedAlumni.industri}</span>
                  </p>
                </div>

                {messagesSent[selectedAlumni.id] && (
                  <div className="mt-4 bg-[#F0FDF4] border border-[#16A34A]/25 p-3 rounded-lg text-xs text-[#15803D] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Pesan perkenalanmu sudah diteruskan ke kontak terdaftar anggota ini.</span>
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
                      <h4 className="font-bold text-[#0C2340] text-sm">Sekilas Tentang</h4>
                      <p>{selectedAlumni.bio}</p>
                    </div>
                  )}
                  {activeProfileTab === 'pengalaman' && (
                    <div className="bg-[#FDFCF7] p-4 rounded-lg border border-[#0C2340]/10 space-y-1">
                      <p className="font-bold text-[#0C2340]">{selectedAlumni.pekerjaan}</p>
                      <p className="text-xs text-[#64748B]">
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
                        ? 'Bersedia meluangkan waktu untuk review CV, tanya jawab dunia kerja di Jabodetabek, atau ngobrol santai bersama adik tingkat UMS.'
                        : 'Terbuka untuk silaturahmi sesama alumni, berbagi info lapangan kerja, atau kolaborasi usaha sewilayah.'}
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

'use client';

import React, { useState, useEffect } from 'react';
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
  Briefcase, 
  CheckCircle2, 
  X, 
  MessageSquare, 
  ShieldCheck,
  Building2,
  UserPlus
} from 'lucide-react';

const STORAGE_KEY_CONNECTIONS = 'ikaums_persisted_connections';
const STORAGE_KEY_MESSAGES = 'ikaums_persisted_messages';

export default function DirektoriPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
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
    'Tangerang',
    'Bekasi',
    'Depok',
    'Bogor'
  ];

  const profileTabs = [
    { id: 'tentang', label: 'Tentang' },
    { id: 'pengalaman', label: 'Pengalaman' },
    { id: 'keahlian', label: 'Keahlian' },
    { id: 'kontribusi', label: 'Kontribusi' }
  ];

  // Client-side persistence for connections and messages
  useEffect(() => {
    try {
      const savedConn = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
      if (savedConn) setConnectionRequested(JSON.parse(savedConn));
      const savedMsg = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMsg) setMessagesSent(JSON.parse(savedMsg));
    } catch (e) {}

    // Synchronize filter from URL query param ?wilayah=...
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramWilayah = params.get('wilayah');
      if (paramWilayah) {
        const decoded = decodeURIComponent(paramWilayah).toLowerCase();
        const match = regions.find(
          r => r.toLowerCase() === decoded || decoded.includes(r.toLowerCase()) || r.toLowerCase().includes(decoded)
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
      } catch (err) {}
      return updated;
    });
  };

  const handleSendMessage = (id: string) => {
    setMessagesSent(prev => {
      const updated = { ...prev, [id]: true };
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const filteredAlumni = DATA_ALUMNI_SIMULASI.filter(alumni => {
    const matchesSearch = 
      alumni.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.prodi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alumni.perusahaan && alumni.perusahaan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      alumni.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = 
      selectedRegion === 'Semua Wilayah' || alumni.wilayah.toLowerCase().includes(selectedRegion.toLowerCase());

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5F6678] mb-4 font-mono">
          <Link href="/" className="hover:text-[#101F5B]">BERANDA</Link>
          <span>/</span>
          <span className="text-[#101F5B] font-bold">DIREKTORI ALUMNI</span>
        </nav>

        {/* Title */}
        <div className="mb-8 border-b border-[#18213D]/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-1">
                JEJARING PROFESIONAL TERVERIFIKASI
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1536]">
                Direktori Alumni Jabodetabek
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6678] mt-1.5 max-w-2xl leading-relaxed">
                Temukan alumni UMS berdasarkan wilayah perantauan, spesialisasi industri, atau kesediaan berbagi bimbingan karier di ibu kota.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#EDF1FA] border border-[#101F5B]/15 px-3 py-2 rounded-lg text-xs font-mono text-[#101F5B]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Privasi Opt-In UU PDP Terjamin</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#E5E8EF] rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#5F6678] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama, profesi, perusahaan, atau prodi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAFAF8] border border-[#D1D5DB] rounded-lg text-xs text-[#18213D] focus:outline-none focus:border-[#101F5B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#FAFAF8] border border-[#D1D5DB] text-xs font-mono text-[#18213D] px-3 py-2 rounded-lg focus:outline-none focus:border-[#101F5B]"
            >
              {regions.map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>

            <span className="text-xs font-mono text-[#5F6678]">
              {filteredAlumni.length} Profil Ditemukan
            </span>
          </div>
        </div>

        {/* Alumni List Items with AnimatePresence */}
        <div className="space-y-3.5 max-w-5xl">
          <AnimatePresence mode="popLayout">
            {filteredAlumni.map((alumni) => {
              const isRequested = connectionRequested[alumni.id];
              return (
                <motion.div
                  key={alumni.id}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelectedAlumni(alumni)}
                  className="bg-white border border-[#E5E8EF] hover:border-[#101F5B]/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs bg-[#E8ECF2]">
                      {alumni.avatarUrl ? (
                        <img
                          src={alumni.avatarUrl}
                          alt={alumni.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#101F5B] text-[#F4C542] font-mono font-bold text-base">
                          {alumni.avatarInitials}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#0B1536] group-hover:text-[#18213D] transition-colors leading-tight">
                          {alumni.nama}
                        </h3>
                        {alumni.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        )}
                        {alumni.bersediaMentoring && (
                          <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-mono px-2 py-0.2 rounded font-semibold hidden md:inline">
                            Siap Mentoring
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5F6678] font-mono">
                        {alumni.prodi} • Angkatan {alumni.angkatan}
                      </p>
                      <p className="text-xs font-semibold text-[#18213D] pt-0.5">
                        {alumni.perusahaan ? `${alumni.pekerjaan} — ${alumni.perusahaan}` : alumni.pekerjaan}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#5F6678] font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#101F5B]" />
                          {alumni.wilayah}
                        </span>
                        <span>•</span>
                        <span>{alumni.industri}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-[#F0F2F6]">
                    <motion.button
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      type="button"
                      onClick={(e) => toggleConnection(alumni.id, e)}
                      className={`text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all shadow-xs flex items-center gap-1.5 ${
                        isRequested
                          ? 'bg-[#EDF1FA] text-[#101F5B] border border-[#101F5B]/20'
                          : 'bg-[#101F5B] hover:bg-[#18213D] text-white'
                      }`}
                    >
                      {isRequested ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>Terkirim</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5 text-[#F4C542]" />
                          <span>Koneksi</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ACCESSIBLE SHADCN/UI DIALOG FOR ALUMNI PROFILE */}
        <Dialog
          open={!!selectedAlumni}
          onOpenChange={(open) => !open && setSelectedAlumni(null)}
        >
          {selectedAlumni && (
            <DialogContent className="p-0 overflow-hidden max-w-xl max-h-[92vh]">
              {/* Header Cover Photo */}
              <div className="h-32 bg-[#101F5B] relative overflow-hidden">
                <img
                  src="/images/alumni-gathering-4.jpg"
                  alt="Cover Acara Alumni"
                  className="w-full h-full object-cover opacity-40 filter contrast-125"
                />
              </div>

              {/* Profile Details Container */}
              <div className="px-6 pb-6 pt-0 relative overflow-y-auto max-h-[calc(92vh-8rem)]">
                {/* Round Avatar overlapping cover */}
                <div className="-mt-12 mb-3 flex justify-between items-end">
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                    {selectedAlumni.avatarUrl ? (
                      <img
                        src={selectedAlumni.avatarUrl}
                        alt={selectedAlumni.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#101F5B] text-[#F4C542] font-mono font-bold text-lg">
                        {selectedAlumni.avatarInitials}
                      </div>
                    )}
                  </div>

                  {/* Actions: Koneksi & Hubungi */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      type="button"
                      onClick={() => toggleConnection(selectedAlumni.id)}
                      className={`text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
                        connectionRequested[selectedAlumni.id]
                          ? 'bg-[#EDF1FA] text-[#101F5B] border border-[#101F5B]/30'
                          : 'bg-[#101F5B] hover:bg-[#18213D] text-white shadow-xs'
                      }`}
                    >
                      {connectionRequested[selectedAlumni.id] ? 'Terhubung' : 'Koneksi'}
                    </motion.button>
                    <motion.button
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      type="button"
                      onClick={() => handleSendMessage(selectedAlumni.id)}
                      className="text-xs font-mono font-semibold text-[#101F5B] border border-[#D1D5DB] px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{messagesSent[selectedAlumni.id] ? 'Pesan Terkirim' : 'Kirim Pesan'}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Identity */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold tracking-tight text-[#0B1536]">
                      {selectedAlumni.nama}
                    </h3>
                    {selectedAlumni.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    )}
                  </div>
                  <p className="text-xs text-[#5F6678] font-mono">
                    Alumni {selectedAlumni.prodi} • Angkatan {selectedAlumni.angkatan}
                  </p>
                  <p className="text-xs font-medium text-[#18213D]">
                    {selectedAlumni.pekerjaan} di {selectedAlumni.perusahaan}
                  </p>
                  <p className="text-xs text-[#5F6678] flex items-center gap-1 font-mono pt-0.5">
                    <MapPin className="w-3 h-3 text-[#101F5B]" />
                    <span>{selectedAlumni.wilayah} • {selectedAlumni.industri}</span>
                  </p>
                </div>

                {messagesSent[selectedAlumni.id] && (
                  <div className="mt-3 bg-[#22775A]/10 border border-[#22775A]/20 p-3 rounded-lg text-xs text-[#22775A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Pesan pengantar berhasil diteruskan via jalur terproteksi IKA UMS.</span>
                  </div>
                )}

                {/* 21st.dev Animated Tabs for Profile Navigation */}
                <div className="mt-5 mb-4">
                  <AnimatedTabs
                    tabs={profileTabs}
                    activeTab={activeProfileTab}
                    onChange={setActiveProfileTab}
                    layoutId="profileModalTabs"
                  />
                </div>

                {/* Tab Content */}
                <div className="pt-2 text-xs text-[#5F6678] leading-relaxed">
                  {activeProfileTab === 'tentang' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#0B1536] text-sm">Biografi Singkat</h4>
                      <p>{selectedAlumni.bio}</p>
                    </div>
                  )}
                  {activeProfileTab === 'pengalaman' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#0B1536] text-sm">Jejak Karier & Institusi</h4>
                      <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E5E8EF] space-y-1">
                        <p className="font-bold text-[#18213D] text-xs">{selectedAlumni.pekerjaan}</p>
                        <p className="text-[11px] text-[#5F6678] font-mono">{selectedAlumni.perusahaan} • 2021 - Sekarang</p>
                        <p className="text-[11px] text-[#5F6678] pt-1">
                          Bertanggung jawab pada inisiatif strategis, kolaborasi lintas divisi, dan inovasi operasional di wilayah Jabodetabek.
                        </p>
                      </div>
                    </div>
                  )}
                  {activeProfileTab === 'keahlian' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#0B1536] text-sm">Keahlian & Domain Spesialisasi</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAlumni.keahlian.map((skill, idx) => (
                          <span key={idx} className="bg-[#EDF1FA] text-[#101F5B] px-3 py-1 rounded-md text-[11px] font-mono font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeProfileTab === 'kontribusi' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#0B1536] text-sm">Dukungan Untuk Komunitas Alumni</h4>
                      <p>
                        {selectedAlumni.bersediaMentoring 
                          ? 'Bersedia meluangkan waktu untuk konsultasi karir, review portofolio, dan bimbingan adaptasi perantauan bagi fresh graduates UMS.'
                          : 'Terbuka untuk diskusi proyek kemitraan korporasi, riset bersama, dan jejaring wirausaha.'
                        }
                      </p>
                    </div>
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

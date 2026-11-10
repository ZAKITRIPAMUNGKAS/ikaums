'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { DATA_ALUMNI_SIMULASI } from '@/data/simulasi';
import { AlumniProfile } from '@/types';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  MessageSquare, 
  MoreHorizontal, 
  Share2,
  ShieldCheck,
  Building2,
  Mail,
  Send,
  UserPlus
} from 'lucide-react';

export default function DirektoriPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [connectionRequested, setConnectionRequested] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'tentang' | 'pengalaman' | 'keahlian' | 'kontribusi'>('tentang');
  const [messageSent, setMessageSent] = useState(false);

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

  const toggleConnection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setConnectionRequested(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B]">
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
            {/* Region select dropdown */}
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

        {/* Alumni List Items (Contra/ADPList Style) */}
        <div className="space-y-3.5 max-w-5xl">
          {filteredAlumni.map((alumni) => {
            const isRequested = connectionRequested[alumni.id];
            return (
              <div
                key={alumni.id}
                onClick={() => {
                  setSelectedAlumni(alumni);
                  setMessageSent(false);
                }}
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
                      <h3 className="font-serif text-base font-bold text-[#101F5B] group-hover:text-[#18213D] transition-colors leading-tight">
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
                  <button
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
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ALUMNI DETAIL MODAL WITH 4 CONTRA TABS */}
        {selectedAlumni && (
          <div className="fixed inset-0 bg-[#101F5B]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E5E8EF] animate-in fade-in zoom-in-95 duration-150">
              
              {/* Header Cover Photo */}
              <div className="h-32 bg-[#101F5B] relative overflow-hidden">
                <img
                  src="/images/alumni-gathering-4.jpg"
                  alt="Cover Acara Alumni"
                  className="w-full h-full object-cover opacity-40 filter contrast-125"
                />
                <button
                  type="button"
                  onClick={() => setSelectedAlumni(null)}
                  className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Details Container */}
              <div className="px-6 pb-6 pt-0 relative">
                
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
                    <button
                      type="button"
                      onClick={() => toggleConnection(selectedAlumni.id)}
                      className={`text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
                        connectionRequested[selectedAlumni.id]
                          ? 'bg-[#EDF1FA] text-[#101F5B] border border-[#101F5B]/30'
                          : 'bg-[#101F5B] hover:bg-[#18213D] text-white shadow-xs'
                      }`}
                    >
                      {connectionRequested[selectedAlumni.id] ? 'Terhubung' : 'Koneksi'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageSent(!messageSent)}
                      className="text-xs font-mono font-semibold text-[#101F5B] border border-[#D1D5DB] px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Kirim Pesan</span>
                    </button>
                  </div>
                </div>

                {/* Identity */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-[#101F5B]">
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

                {messageSent && (
                  <div className="mt-3 bg-[#22775A]/10 border border-[#22775A]/20 p-3 rounded-lg text-xs text-[#22775A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Pesan pengantar perkenalan berhasil diteruskan via jalur terproteksi IKA UMS.</span>
                  </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex border-b border-[#E5E8EF] mt-5 gap-6 text-xs font-mono uppercase tracking-wider font-semibold">
                  {(['tentang', 'pengalaman', 'keahlian', 'kontribusi'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2.5 transition-colors ${
                        activeTab === tab
                          ? 'text-[#101F5B] border-b-2 border-[#101F5B] font-bold'
                          : 'text-[#5F6678] hover:text-[#18213D]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="pt-4 text-xs text-[#5F6678] leading-relaxed">
                  {activeTab === 'tentang' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#101F5B] font-serif text-sm">Biografi Singkat</h4>
                      <p>{selectedAlumni.bio}</p>
                    </div>
                  )}
                  {activeTab === 'pengalaman' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#101F5B] font-serif text-sm">Jejak Karier & Institusi</h4>
                      <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E5E8EF] space-y-1">
                        <p className="font-bold text-[#18213D] text-xs">{selectedAlumni.pekerjaan}</p>
                        <p className="text-[11px] text-[#5F6678] font-mono">{selectedAlumni.perusahaan} • 2021 - Sekarang</p>
                        <p className="text-[11px] text-[#5F6678] pt-1">
                          Bertanggung jawab pada inisiatif strategis, kolaborasi lintas divisi, dan inovasi operasional di wilayah Jabodetabek.
                        </p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'keahlian' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#101F5B] font-serif text-sm">Keahlian & Domain Spesialisasi</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAlumni.keahlian.map((skill, idx) => (
                          <span key={idx} className="bg-[#EDF1FA] text-[#101F5B] px-3 py-1 rounded-md text-[11px] font-mono font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === 'kontribusi' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#101F5B] font-serif text-sm">Dukungan Untuk Komunitas Alumni</h4>
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
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

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
  Share2 
} from 'lucide-react';

export default function DirektoriPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [connectionRequested, setConnectionRequested] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'tentang' | 'pengalaman' | 'keahlian' | 'kontribusi'>('tentang');

  const filteredAlumni = DATA_ALUMNI_SIMULASI.filter(alumni => {
    return alumni.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.prodi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alumni.perusahaan && alumni.perusahaan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      alumni.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleConnection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectionRequested(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5F6678] mb-4">
          <Link href="/" className="hover:text-[#101F5B]">Beranda</Link>
          <span>&gt;</span>
          <span className="text-[#101F5B] font-semibold">Direktori</span>
        </nav>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B]">
            Direktori Alumni
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6678] mt-1.5 max-w-2xl leading-relaxed">
            Temukan alumni UMS berdasarkan wilayah, profesi, angkatan, atau minat kolaborasi.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#E5E8EF] rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#5F6678] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama, profesi, atau perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAFAF8] border border-[#D1D5DB] rounded-lg text-xs text-[#18213D] focus:outline-none focus:border-[#101F5B]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#101F5B] bg-[#FAFAF8] border border-[#D1D5DB] px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter (3)</span>
            </button>

            <div className="flex items-center bg-[#FAFAF8] border border-[#D1D5DB] rounded-lg p-0.5">
              <button type="button" className="p-1.5 rounded text-[#5F6678] hover:text-[#101F5B]" aria-label="Grid view">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button type="button" className="p-1.5 rounded bg-white text-[#101F5B] shadow-xs" aria-label="List view">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Counter Info */}
        <div className="text-xs text-[#5F6678] mb-4 font-medium">
          Menampilkan {filteredAlumni.length} dari 1.248 alumni
        </div>

        {/* Alumni List Items */}
        <div className="space-y-3.5">
          {filteredAlumni.map((alumni) => {
            const isRequested = connectionRequested[alumni.id];
            return (
              <div
                key={alumni.id}
                onClick={() => setSelectedAlumni(alumni)}
                className="bg-white border border-[#E5E8EF] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#101F5B]/30 hover:shadow-sm cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-[#FAFAF8] shadow-xs">
                    <img
                      src={alumni.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={alumni.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold text-[#101F5B] leading-tight flex items-center gap-1.5">
                      <span>{alumni.nama}</span>
                      {alumni.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22775A]" />
                      )}
                    </h3>
                    <p className="text-xs text-[#5F6678] mt-0.5">
                      Angkatan {alumni.angkatan} • {alumni.prodi}
                    </p>
                    <p className="text-xs font-semibold text-[#18213D] mt-0.5">
                      {alumni.perusahaan ? `${alumni.pekerjaan} di ${alumni.perusahaan}` : alumni.pekerjaan}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[#F0F2F6]">
                  <span className="text-xs text-[#5F6678] sm:hidden flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#101F5B]" />
                    {alumni.wilayah}
                  </span>
                  
                  <button
                    type="button"
                    onClick={(e) => toggleConnection(alumni.id, e)}
                    className={`text-xs font-semibold px-5 py-2.5 rounded-lg transition-all ${
                      isRequested
                        ? 'bg-[#EDF1FA] text-[#101F5B] border border-[#101F5B]/20'
                        : 'bg-[#101F5B] hover:bg-[#18213D] text-white shadow-xs'
                    }`}
                  >
                    {isRequested ? 'Permintaan Terkirim' : 'Koneksi'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ALUMNI DETAIL MODAL (Matching Aditya R. Pratama profile in mockup) */}
        {selectedAlumni && (
          <div className="fixed inset-0 bg-[#101F5B]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E5E8EF] animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header Cover Photo */}
              <div className="h-32 bg-gradient-to-r from-[#101F5B] to-[#18213D] relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80"
                  alt="Cover"
                  className="w-full h-full object-cover opacity-30"
                />
                <button
                  type="button"
                  onClick={() => setSelectedAlumni(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Details Container */}
              <div className="px-6 pb-6 pt-0 relative">
                
                {/* Round Avatar overlapping cover */}
                <div className="-mt-12 mb-3 flex justify-between items-end">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                    <img
                      src={selectedAlumni.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                      alt={selectedAlumni.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Actions: Koneksi, Pesan, More */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleConnection(selectedAlumni.id, e)}
                      className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                        connectionRequested[selectedAlumni.id]
                          ? 'bg-[#EDF1FA] text-[#101F5B]'
                          : 'bg-[#101F5B] hover:bg-[#18213D] text-white shadow-xs'
                      }`}
                    >
                      {connectionRequested[selectedAlumni.id] ? 'Terhubung' : 'Koneksi'}
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#101F5B] border border-[#D1D5DB] px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Pesan
                    </button>
                    <button
                      type="button"
                      className="text-[#5F6678] border border-[#D1D5DB] p-2 rounded-lg hover:bg-slate-50"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Identity */}
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#101F5B]">
                    {selectedAlumni.nama}
                  </h3>
                  <p className="text-xs text-[#5F6678]">
                    Alumni {selectedAlumni.prodi} • Angkatan {selectedAlumni.angkatan}
                  </p>
                  <p className="text-xs text-[#5F6678] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#101F5B]" />
                    <span>{selectedAlumni.wilayah}</span>
                  </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-[#E5E8EF] mt-5 gap-6 text-xs font-semibold">
                  {(['tentang', 'pengalaman', 'keahlian', 'kontribusi'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2.5 capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-[#101F5B] border-b-2 border-[#F4C542] font-bold'
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
                      <h4 className="font-bold text-[#101F5B]">Tentang</h4>
                      <p>{selectedAlumni.bio}</p>
                    </div>
                  )}
                  {activeTab === 'pengalaman' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#101F5B]">Perjalanan Karir</h4>
                      <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E5E8EF]">
                        <p className="font-bold text-[#18213D]">{selectedAlumni.pekerjaan}</p>
                        <p className="text-[11px] text-[#5F6678]">{selectedAlumni.perusahaan} • 2021 - Sekarang</p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'keahlian' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#101F5B]">Keahlian Utama</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAlumni.keahlian.map((skill, idx) => (
                          <span key={idx} className="bg-[#EDF1FA] text-[#101F5B] px-2.5 py-1 rounded-md text-[11px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === 'kontribusi' && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#101F5B]">Kontribusi Komunitas</h4>
                      <p>Bersedia memberikan mentoring karir untuk fresh graduate UMS yang merantau ke wilayah Jabodetabek.</p>
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

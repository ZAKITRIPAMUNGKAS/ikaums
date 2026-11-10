'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { AccurateJabodetabekMap } from '@/components/AccurateJabodetabekMap';
import { 
  DATA_ALUMNI_SIMULASI, 
  DATA_KEGIATAN_SIMULASI, 
  DATA_CERITA_SIMULASI, 
  STATS_JABODETABEK 
} from '@/data/simulasi';
import { AlumniProfile, EventKegiatan } from '@/types';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Search,
  Users,
  Briefcase,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  MessageSquare,
  Check,
  Building,
  GraduationCap
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const DOMAIN_FILTERS = [
  { id: 'all', label: 'Semua Bidang' },
  { id: 'tech', label: 'Teknologi & Digital', match: 'Teknologi' },
  { id: 'fintech', label: 'Perbankan & Fintech', match: 'Perbankan' },
  { id: 'legal', label: 'Hukum & Korporasi', match: 'Legal' },
  { id: 'health', label: 'Kesehatan & Medis', match: 'Kesehatan' },
  { id: 'esg', label: 'Lingkungan & ESG', match: 'Lingkungan' },
  { id: 'design', label: 'Arsitektur & Desain', match: 'Arsitektur' },
  { id: 'tax', label: 'Akuntansi & Pajak', match: 'Akuntansi' },
];

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedProfile, setSelectedProfile] = useState<AlumniProfile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventKegiatan | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);

  // Form states
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpProdi, setRsvpProdi] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [isRsvpDone, setIsRsvpDone] = useState(false);

  const [mentorTopic, setMentorTopic] = useState('Review CV & Portofolio');
  const [mentorNote, setMentorNote] = useState('');
  const [isBookingDone, setIsBookingDone] = useState(false);

  // Filtered alumni logic (Curations Supply style)
  const filteredAlumni = useMemo(() => {
    return DATA_ALUMNI_SIMULASI.filter((alumni) => {
      const activeFilter = DOMAIN_FILTERS.find((d) => d.id === selectedDomain);
      const matchesDomain = 
        selectedDomain === 'all' || 
        (activeFilter?.match && alumni.industri.toLowerCase().includes(activeFilter.match.toLowerCase()));

      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        !query ||
        alumni.nama.toLowerCase().includes(query) ||
        alumni.pekerjaan.toLowerCase().includes(query) ||
        (alumni.perusahaan && alumni.perusahaan.toLowerCase().includes(query)) ||
        alumni.wilayah.toLowerCase().includes(query) ||
        alumni.keahlian.some((k) => k.toLowerCase().includes(query));

      return matchesDomain && matchesQuery;
    });
  }, [selectedDomain, searchQuery]);

  // Featured mentors for ADPList section
  const featuredMentors = useMemo(() => {
    return DATA_ALUMNI_SIMULASI.filter((a) => a.bersediaMentoring).slice(0, 3);
  }, []);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpPhone) return;
    setIsRsvpDone(true);
    setTimeout(() => {
      setIsRsvpDone(false);
      setSelectedEvent(null);
      setRsvpName('');
      setRsvpProdi('');
      setRsvpPhone('');
    }, 2000);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingDone(true);
    setTimeout(() => {
      setIsBookingDone(false);
      setSelectedMentor(null);
      setMentorNote('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0C1222] flex flex-col font-sans selection:bg-[#0B1536] selection:text-white">
      <Navbar />

      <main className="flex-grow">

        {/* 1. EDITORIAL MASTHEAD & HERO (THE INDEX REFERENCE) */}
        <section className="border-b border-[#0C1222]/10 bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
            
            {/* Top Publication Issue Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#0C1222]/10 pb-3 mb-10 text-[11px] font-mono uppercase tracking-wider text-[#525866] gap-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#0B1536]">EDISI 2026 · VOL. IV</span>
                <span className="h-3 w-[1px] bg-[#0C1222]/20"></span>
                <span>JEJARING RESMI ALUMNI UNIVERSITAS MUHAMMADIYAH SURAKARTA</span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span>WILAYAH METROPOLITAN JABODETABEK</span>
                <span>•</span>
                <span className="text-[#0F766E] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  KONSEN OPT-IN UU PDP
                </span>
              </div>
            </div>

            {/* Asymmetrical Magazine Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left: Confident Editorial Typography */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#0B1536]/5 text-[#0B1536] px-3 py-1 text-xs font-mono tracking-wider uppercase border border-[#0B1536]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span>Ruang Kolaborasi Lintas Angkatan</span>
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B1536] leading-[1.02]">
                  Dari Temu Kangen, <br />
                  <span className="italic font-normal text-[#1E293B]">menjadi Temu Peluang.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#334155] max-w-xl leading-relaxed">
                  Sebuah inisiatif mandiri berbasis gotong royong yang mempertemukan lebih dari 1.200 alumni UMS lintas 12 fakultas di kawasan Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Mentransformasi silaturahmi perantauan menjadi jejaring rujukan karier, pendampingan profesi, dan kemitraan usaha strategis.
                </p>

                {/* Editorial Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <a
                    href="#direktori-terkurasi"
                    className="bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-mono font-semibold uppercase tracking-wider px-6 py-3.5 flex items-center gap-2 transition-all shadow-xs group"
                  >
                    <span>Jelajahi Direktori Alumni</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F4C542] group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="#peta-spasial"
                    className="border border-[#0C1222]/25 hover:border-[#0B1536] hover:bg-white text-[#0B1536] text-xs font-mono font-semibold uppercase tracking-wider px-6 py-3.5 transition-colors"
                  >
                    Peta Sebaran (9 Wilayah)
                  </a>
                </div>
              </div>

              {/* Right: Curated Documentary Photo */}
              <div className="lg:col-span-5 space-y-3">
                <div className="aspect-[4/3] w-full overflow-hidden border border-[#0C1222]/15 bg-[#E8ECF2] relative shadow-sm">
                  <img
                    src="/images/hero-kumpul-bolo-pisah.jpg"
                    alt="Dokumentasi Silaturahmi Akbar Alumni UMS Jabodetabek"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B1536]/90 backdrop-blur-xs text-[#FAFAF8] text-[10px] font-mono px-2.5 py-1 tracking-wider uppercase">
                    Silaturahmi Akbar Jabodetabek
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#0B1536] text-[10px] font-mono px-2.5 py-1 tracking-wider border border-[#0C1222]/10">
                    DOKUMENTASI RESMI IKA UMS
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#525866] pt-1">
                  <span>AULA PERTEMUAN JAKARTA SELATAN</span>
                  <span>100+ PERWAKILAN ANGKATAN</span>
                </div>
              </div>

            </div>

            {/* 3-Column Metric Rule Bar (The Index Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#0C1222]/10 mt-14 divide-y sm:divide-y-0 sm:divide-x divide-[#0C1222]/10">
              <div className="py-5 sm:pr-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#525866] block mb-1">
                  ALUMNI TERVERIFIKASI
                </span>
                <span className="font-serif text-3xl font-bold text-[#0B1536] block">
                  1.248 Anggota
                </span>
                <span className="text-xs text-[#525866] mt-1 block leading-relaxed">
                  Terdaftar melalui verifikasi mandiri opt-in UU PDP lintas 12 fakultas.
                </span>
              </div>

              <div className="py-5 sm:px-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#525866] block mb-1">
                  DISTRIBUSI METROPOLITAN
                </span>
                <span className="font-serif text-3xl font-bold text-[#0B1536] block">
                  9 Sentra Wilayah
                </span>
                <span className="text-xs text-[#525866] mt-1 block leading-relaxed">
                  Tersebar merata di DKI Jakarta, Tangerang Raya, Bekasi, Depok, dan Bogor.
                </span>
              </div>

              <div className="py-5 sm:pl-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#525866] block mb-1">
                  BIMBINGAN & KOLABORASI
                </span>
                <span className="font-serif text-3xl font-bold text-[#0B1536] block">
                  326 Profesional Aktif
                </span>
                <span className="text-xs text-[#525866] mt-1 block leading-relaxed">
                  Menyediakan bimbingan karier 1-on-1 sukarela dan rujukan proyek kerja.
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. CURATED DIRECTORY & TALENT DISCOVERY (CURATIONS SUPPLY + CONTRA) */}
        <section id="direktori-terkurasi" className="py-16 border-b border-[#0C1222]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-[#0C1222]/10 pb-6 mb-8 gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0B1536] font-bold block mb-1.5">
                  DIREKTORI & TALENTA ALUMNI (CONTRA MODEL)
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1536]">
                  Jelajahi Profil Profesional Terverifikasi
                </h2>
                <p className="text-xs sm:text-sm text-[#525866] max-w-xl mt-1.5">
                  Temukan rekan se-almamater berdasarkan industri keahlian, bidang profesi, dan domisili perantauan di Jabodetabek.
                </p>
              </div>

              {/* Search Bar (Curations Supply Style) */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-[#525866] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, keahlian, institusi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs text-[#0C1222] pl-9 pr-3 py-2.5 rounded-none font-sans focus:outline-none focus:border-[#0B1536]"
                />
              </div>
            </div>

            {/* Curations Supply Category Pill Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {DOMAIN_FILTERS.map((domain) => {
                const isActive = selectedDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    type="button"
                    className={`px-3.5 py-1.5 text-xs font-mono whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-[#0B1536] text-white border-[#0B1536] font-bold shadow-xs'
                        : 'bg-[#FAF9F5] hover:bg-[#F1EFEA] text-[#525866] border-[#0C1222]/15 hover:text-[#0B1536]'
                    }`}
                  >
                    {domain.label}
                  </button>
                );
              })}
            </div>

            {/* Contra-Style Talent Discovery Cards */}
            {filteredAlumni.length === 0 ? (
              <div className="border border-dashed border-[#0C1222]/20 p-12 text-center bg-[#FAF9F5]">
                <p className="text-sm font-serif text-[#0B1536] font-bold">
                  Tidak ditemukan profil yang sesuai kriteria filter.
                </p>
                <p className="text-xs text-[#525866] mt-1 font-mono">
                  Coba ubah kata kunci pencarian atau pilih kategori &quot;Semua Bidang&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alumni) => (
                  <div
                    key={alumni.id}
                    className="bg-[#FAF9F5] border border-[#0C1222]/15 p-6 flex flex-col justify-between hover:border-[#0B1536] hover:shadow-md transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Top: Avatar, Name & Verification */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#0C1222]/15 bg-white">
                          {alumni.avatarUrl ? (
                            <img
                              src={alumni.avatarUrl}
                              alt={alumni.nama}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0B1536] text-[#F4C542] font-mono font-bold text-sm">
                              {alumni.avatarInitials}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-serif font-bold text-base text-[#0B1536] leading-tight">
                              {alumni.nama}
                            </h3>
                            {alumni.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-[#525866] mt-0.5">
                            {alumni.prodi} · Angkatan {alumni.angkatan}
                          </p>
                        </div>
                      </div>

                      {/* Role & Company */}
                      <div>
                        <p className="text-xs font-bold text-[#0B1536] leading-snug">
                          {alumni.pekerjaan}
                        </p>
                        {alumni.perusahaan && (
                          <p className="text-xs text-[#525866] flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-[#0C1222]/40" />
                            <span>{alumni.perusahaan}</span>
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#525866] mt-1.5">
                          <MapPin className="w-3 h-3 text-[#0B1536]" />
                          <span>{alumni.wilayah}</span>
                        </div>
                      </div>

                      {/* Bio Excerpt */}
                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                        {alumni.bio}
                      </p>

                      {/* Skill Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {alumni.keahlian.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="bg-white text-[#0B1536] text-[10px] font-mono px-2 py-0.5 border border-[#0C1222]/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Availability Pill */}
                      {alumni.bersediaMentoring ? (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#0F766E] bg-[#CCFBF1]/50 border border-[#99F6E4] px-2 py-0.5 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse"></span>
                          <span>Terbuka Mentoring 1-on-1</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#525866] bg-white border border-[#0C1222]/10 px-2 py-0.5">
                          <span>Terbuka Diskusi Profesional</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 mt-5 border-t border-[#0C1222]/10 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedProfile(alumni)}
                        className="text-xs font-mono font-bold text-[#0B1536] hover:text-[#D97706] flex items-center gap-1"
                      >
                        <span>Lihat Profil Penuh</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {alumni.bersediaMentoring ? (
                        <button
                          type="button"
                          onClick={() => setSelectedMentor(alumni)}
                          className="text-[10px] font-mono uppercase tracking-wider bg-[#0B1536] text-white px-3 py-1 hover:bg-[#16234D] transition-colors"
                        >
                          Booking Mentor
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedProfile(alumni)}
                          className="text-[10px] font-mono uppercase tracking-wider border border-[#0C1222]/20 px-3 py-1 hover:bg-[#0B1536] hover:text-white transition-colors"
                        >
                          Koneksi
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Direct Link to Full Directory */}
            <div className="mt-10 pt-6 border-t border-[#0C1222]/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono text-[#525866]">
                Menampilkan {filteredAlumni.length} dari 1.248 profil alumni terdaftar di Jabodetabek.
              </span>
              <Link
                href="/direktori"
                className="text-xs font-mono uppercase font-bold text-[#0B1536] hover:text-[#D97706] flex items-center gap-1.5"
              >
                <span>Buka Seluruh Direktori Alumni (1.248 Anggota)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>

        {/* 3. MENTORING 1-ON-1 SHOWCASE (ADPLIST REFERENCE) */}
        <section className="py-16 border-b border-[#0C1222]/10 bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-[#0C1222]/10 pb-6 mb-10 gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0B1536] font-bold block mb-1.5">
                  PROGRAM BIMBINGAN GOTONG ROYONG (ADPLIST MODEL)
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1536]">
                  Mentoring 1-on-1 dari Alumni Senior
                </h2>
                <p className="text-xs sm:text-sm text-[#525866] max-w-xl mt-1.5">
                  Inisiatif sukarela tanpa biaya. Bimbingan kurasi portofolio, persiapan wawancara kerja di ibu kota, atau konsultasi kepatuhan hukum awal bagi sesama lulusan UMS.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#0F766E] bg-[#CCFBF1]/50 border border-[#99F6E4] px-3.5 py-2">
                <Sparkles className="w-4 h-4 text-[#0F766E]" />
                <span>100% Bebas Biaya · Komitmen Gotong Royong</span>
              </div>
            </div>

            {/* ADPList 3-Column Mentor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white border border-[#0C1222]/15 p-6 flex flex-col justify-between hover:border-[#0B1536] hover:shadow-md transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header: Mentor Info */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-13 h-13 rounded-full overflow-hidden shrink-0 border border-[#0C1222]/15">
                        <img
                          src={mentor.avatarUrl || '/images/avatar-aditya.jpg'}
                          alt={mentor.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif font-bold text-base text-[#0B1536] leading-tight">
                          {mentor.nama}
                        </h3>
                        <p className="text-xs text-[#0B1536] font-semibold mt-0.5 truncate">
                          {mentor.pekerjaan}
                        </p>
                        <p className="text-[11px] font-mono text-[#525866]">
                          {mentor.perusahaan}
                        </p>
                      </div>
                    </div>

                    {/* Response Badge */}
                    <div className="flex items-center justify-between text-[10px] font-mono border-y border-[#0C1222]/10 py-2 text-[#525866]">
                      <span className="flex items-center gap-1 text-[#0F766E] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse"></span>
                        2 Slot Terbuka Minggu Ini
                      </span>
                      <span>Respon &lt; 24 jam</span>
                    </div>

                    {/* Mentoring Topics */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#525866] block">
                        FOKUS SESI BIMBINGAN:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#334155]">
                        {mentor.keahlian.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Booking Trigger Button */}
                  <div className="pt-5 mt-4 border-t border-[#0C1222]/10">
                    <button
                      type="button"
                      onClick={() => setSelectedMentor(mentor)}
                      className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-mono font-semibold uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#F4C542]" />
                      <span>Jadwalkan Sesi Bimbingan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. SPATIAL EXPLORATION (FELT GIS REFERENCE) */}
        <section id="peta-spasial" className="py-16 border-b border-[#0C1222]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C1222]/10 pb-4 mb-8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0B1536] font-bold block mb-1">
                  EKSPLORASI SPASIAL (FELT GIS MODEL)
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#0B1536]">
                  Peta Sebaran Alumni di Jabodetabek
                </h2>
                <p className="text-xs sm:text-sm text-[#525866] max-w-lg mt-1">
                  Batas administratif 9 wilayah resmi BPS / BIG terkalibrasi. Temukan sentra komunitas dan mentor terdekat dari domisili Anda.
                </p>
              </div>

              <Link
                href="/peta"
                className="text-xs font-mono uppercase tracking-wider text-[#0B1536] hover:text-[#D97706] flex items-center gap-1 font-bold mt-2 sm:mt-0"
              >
                <span>Buka Peta Layar Penuh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Precision Map Component with Felt Pill Markers & Telemetry */}
            <AccurateJabodetabekMap />

          </div>
        </section>

        {/* 5. COMMUNITY ACTIVITIES & RSVP FLOW (LUMA REFERENCE) */}
        <section className="py-16 border-b border-[#0C1222]/10 bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C1222]/10 pb-4 mb-8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0B1536] font-bold block mb-1">
                  AGENDA & TEMU JEJARING (LUMA MODEL)
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1536]">
                  Kegiatan Terdekat Komunitas Jabodetabek
                </h2>
                <p className="text-xs sm:text-sm text-[#525866] max-w-lg mt-1">
                  Dari silaturahmi berkala di sentra co-working hingga forum kurasi bisnis dan klinik karir.
                </p>
              </div>

              <Link
                href="/kegiatan"
                className="text-xs font-mono uppercase tracking-wider text-[#0B1536] hover:text-[#D97706] flex items-center gap-1 font-bold mt-2 sm:mt-0"
              >
                <span>Lihat Semua Agenda (3 Kegiatan)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Luma Event Discovery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DATA_KEGIATAN_SIMULASI.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="bg-white border border-[#0C1222]/15 flex flex-col justify-between overflow-hidden hover:border-[#0B1536] hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Event Cover Image with Floating Date Chip */}
                    <div className="aspect-[16/9] w-full relative overflow-hidden bg-[#E8ECF2]">
                      <img
                        src={ev.gambar || '/images/event-kopdar.jpg'}
                        alt={ev.judul}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      
                      {/* Floating Date Badge (Luma style) */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#0B1536] font-mono p-1.5 text-center min-w-[48px] border border-[#0C1222]/15 shadow-sm">
                        <span className="text-base font-bold block leading-none">
                          {idx === 0 ? '28' : idx === 1 ? '06' : '19'}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-[#D97706] block mt-0.5">
                          {idx === 0 ? 'NOV' : 'DES'}
                        </span>
                      </div>

                      {/* Event Category Tag */}
                      <div className="absolute bottom-3 right-3 bg-[#0B1536]/90 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider">
                        {ev.jenis}
                      </div>
                    </div>

                    {/* Event Metadata & Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#525866]">
                        <Clock className="w-3.5 h-3.5 text-[#0B1536]" />
                        <span>{ev.tanggalWIB} · {ev.jamWIB}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#0B1536] leading-snug group-hover:text-[#16234D]">
                        {ev.judul}
                      </h3>

                      <p className="text-xs text-[#525866] leading-relaxed line-clamp-2">
                        {ev.deskripsi}
                      </p>

                      <div className="flex items-start gap-1.5 text-xs text-[#525866] pt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0B1536] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{ev.lokasiSpesifik || ev.wilayah}</span>
                      </div>

                      {/* Attendee Progress Bar (Luma Social Proof) */}
                      <div className="pt-2 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono text-[#525866]">
                          <span>{ev.terdaftarCount} alumni bergabung</span>
                          <span className="font-bold text-[#0B1536]">
                            Sisa {ev.kapasitas - ev.terdaftarCount} kursi
                          </span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0B1536] h-full rounded-full transition-all"
                            style={{ width: `${(ev.terdaftarCount / ev.kapasitas) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick RSVP Trigger Button */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-mono font-semibold uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <span>RSVP Cepat (Konfirmasi Langsung)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F4C542]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 6. IMPACT JOURNAL & ALUMNI STORIES (THE INDEX EDITORIAL) */}
        <section className="py-16 border-b border-[#0C1222]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C1222]/10 pb-4 mb-8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0B1536] font-bold block mb-1">
                  JURNAL & KISAH PERANTAU (THE INDEX JOURNAL)
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1536]">
                  Rekam Jejak & Dampak Sinergi Alumni
                </h2>
              </div>

              <Link
                href="/cerita"
                className="text-xs font-mono uppercase tracking-wider text-[#0B1536] hover:text-[#D97706] flex items-center gap-1 font-bold mt-2 sm:mt-0"
              >
                <span>Baca Semua Jurnal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Asymmetrical Editorial Story Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left: Featured Cover Story with Pull Quote */}
              <div className="lg:col-span-7 bg-[#FAF9F5] border border-[#0C1222]/15 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="aspect-[16/10] w-full overflow-hidden border border-[#0C1222]/15 bg-[#E2E8F0]">
                    <img
                      src="/images/cerita-startup.jpg"
                      alt="Kisah Hendra Setiawan Alumni UMS"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#D97706] font-bold uppercase tracking-wider">
                    <span>WIRAUSAHA & EDUKASI</span>
                    <span>•</span>
                    <span className="text-[#525866]">5 MENIT BACA</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1536] leading-tight">
                    Dari Kampus Pabelan ke Sentra Startup Jakarta: Hendra Membuka Pintu bagi Ratusan Lulusan Baru
                  </h3>

                  <blockquote className="border-l-2 border-[#D97706] pl-4 py-1 italic font-serif text-base text-[#334155] leading-relaxed">
                    &quot;Modal terbesar anak rantau Solo bukan cuma ijazah, tapi rasa saling percaya. Saat pertama ke Jakarta, alumni senior yang memberi tumpangan dan rujukan kerja pertama.&quot;
                  </blockquote>

                  <p className="text-xs sm:text-sm text-[#525866] leading-relaxed">
                    Perjalanan Hendra Setiawan (Informatika 2016) mendirikan platform edukasi digital di Jakarta Selatan, yang kini membuka lebih dari 35 lowongan dan pendampingan karier gratis bagi sesama lulusan baru Solo Raya.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/cerita"
                    className="text-xs font-mono font-bold text-[#0B1536] hover:text-[#D97706] uppercase tracking-wider inline-flex items-center gap-1.5"
                  >
                    <span>Baca Laporan Wawancara Lengkap</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right: 2 Companion Journal Articles */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                {DATA_CERITA_SIMULASI.slice(1, 3).map((story) => (
                  <div
                    key={story.id}
                    className="bg-[#FAF9F5] border border-[#0C1222]/15 p-6 flex flex-col justify-between space-y-3 flex-1 hover:border-[#0B1536] transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">
                        {story.kategori}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#0B1536] leading-snug">
                        {story.judul}
                      </h4>
                      <p className="text-xs text-[#525866] leading-relaxed line-clamp-3">
                        {story.ringkasan}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#0C1222]/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#525866]">
                        {story.jurusanAngkatan}
                      </span>
                      <Link
                        href="/cerita"
                        className="text-xs font-mono font-bold text-[#0B1536] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Baca</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* 7. INSTITUTIONAL STATEMENT (THE INDEX LUXURY FINISH) */}
        <section className="py-16 bg-[#0B1536] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-white/20 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-[#0C1222]/60">
              
              <div className="space-y-3 max-w-2xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#F4C542] font-bold block">
                  KOMITMEN KESETARAAN & GOTONG ROYONG
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                  Mempertemukan Potensi, Memajukan Almamater di Perantauan.
                </h3>
                <p className="text-xs sm:text-sm text-[#EDF1FA]/80 leading-relaxed">
                  Semua data profil tersimpan dengan persetujuan mandiri di bawah perlindungan UU PDP No. 27/2022. Tidak ada data yang dibagikan ke pihak ketiga komersial tanpa persetujuan eksplisit.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <Link
                  href="/gabung"
                  className="w-full sm:w-auto bg-[#F4C542] hover:bg-[#e8b935] text-[#0B1536] text-xs font-mono font-bold uppercase tracking-wider px-6 py-3.5 text-center transition-colors shadow-xs"
                >
                  Daftar Sebagai Alumni
                </Link>
                <Link
                  href="/tentang"
                  className="w-full sm:w-auto border border-white/30 hover:border-white text-white text-xs font-mono uppercase tracking-wider px-6 py-3.5 text-center transition-colors"
                >
                  Tata Kelola Data
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* CONTRA PROFILE QUICKVIEW DIALOG */}
      <Dialog open={!!selectedProfile} onOpenChange={(open) => !open && setSelectedProfile(null)}>
        <DialogContent className="sm:max-w-xl bg-white border border-[#0C1222]/20 p-0 overflow-hidden">
          {selectedProfile && (
            <div>
              {/* Header Banner */}
              <div className="bg-[#0B1536] p-6 text-white relative">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F4C542] shrink-0 bg-white">
                    <img
                      src={selectedProfile.avatarUrl || '/images/avatar-aditya.jpg'}
                      alt={selectedProfile.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-serif text-xl font-bold">
                        {selectedProfile.nama}
                      </h3>
                      {selectedProfile.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      )}
                    </div>
                    <p className="text-xs font-mono text-[#EDF1FA]/80 mt-0.5">
                      {selectedProfile.prodi} · Angkatan {selectedProfile.angkatan}
                    </p>
                    <p className="text-xs text-[#F4C542] font-semibold mt-1">
                      {selectedProfile.pekerjaan} {selectedProfile.perusahaan ? `· ${selectedProfile.perusahaan}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#525866] block mb-1">
                    DOMISILI PERANTAUAN
                  </span>
                  <p className="text-xs font-semibold text-[#0B1536] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B1536]" />
                    <span>{selectedProfile.wilayah}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#525866] block mb-1">
                    TENTANG & REKAM JEJAK
                  </span>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    {selectedProfile.bio}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#525866] block mb-2">
                    KEAHLIAN & SPESIALISASI
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.keahlian.map((skill) => (
                      <span
                        key={skill}
                        className="bg-[#FAF9F5] text-[#0B1536] text-[10px] font-mono px-2.5 py-1 border border-[#0C1222]/15"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProfile.bersediaMentoring && (
                  <div className="bg-[#FAF9F5] border border-[#0F766E]/30 p-3.5 text-xs text-[#0F766E] flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Mentor Terbuka untuk Sesi 1-on-1</p>
                      <p className="text-[11px] text-[#525866] mt-0.5">
                        Alumni ini bersedia memberikan bimbingan dan review karier sukarela bagi lulusan baru UMS di Jabodetabek.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="bg-[#FAF9F5] border-t border-[#0C1222]/10 p-4 px-6 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#525866]">
                  Data resmi terverifikasi IKA UMS
                </span>
                <div className="flex items-center gap-2">
                  {selectedProfile.bersediaMentoring ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMentor(selectedProfile);
                        setSelectedProfile(null);
                      }}
                      className="bg-[#0B1536] text-white text-xs font-mono font-bold uppercase px-4 py-2 hover:bg-[#16234D] transition-colors"
                    >
                      Jadwalkan Mentoring
                    </button>
                  ) : (
                    <Link
                      href="/direktori"
                      className="bg-[#0B1536] text-white text-xs font-mono font-bold uppercase px-4 py-2 hover:bg-[#16234D] transition-colors"
                    >
                      Buka Direktori Lengkap
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* LUMA QUICK RSVP DIALOG */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md bg-white border border-[#0C1222]/20 p-6">
          {selectedEvent && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#D97706] font-bold uppercase">
                  <span>RSVP KEGIATAN KOMUNITAS</span>
                  <span>•</span>
                  <span>{selectedEvent.jenis}</span>
                </div>
                <DialogTitle className="font-serif text-xl font-bold text-[#0B1536] text-left pt-1">
                  {selectedEvent.judul}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#525866] text-left">
                  {selectedEvent.tanggalWIB} · {selectedEvent.jamWIB}
                  <br />
                  {selectedEvent.lokasiSpesifik}
                </DialogDescription>
              </DialogHeader>

              {isRsvpDone ? (
                <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                  <h4 className="font-serif font-bold text-base text-[#065F46]">
                    RSVP Berhasil Terkonfirmasi!
                  </h4>
                  <p className="text-xs text-[#047857]">
                    Detail agenda dan e-tiket telah disiapkan. Sampai jumpa di lokasi acara!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#525866] block mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="contoh: Muhammad Farhan"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-2.5 focus:outline-none focus:border-[#0B1536]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-[#525866] block mb-1">
                        Fakultas / Angkatan
                      </label>
                      <input
                        type="text"
                        placeholder="contoh: FT / 2018"
                        value={rsvpProdi}
                        onChange={(e) => setRsvpProdi(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-2.5 focus:outline-none focus:border-[#0B1536]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-[#525866] block mb-1">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0812xxxxxxx"
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-2.5 focus:outline-none focus:border-[#0B1536]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-mono font-bold uppercase py-3 px-4 flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5 text-[#F4C542]" />
                      <span>Konfirmasi Kehadiran (Gratis)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ADPLIST MENTORING BOOKING DIALOG */}
      <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
        <DialogContent className="sm:max-w-md bg-white border border-[#0C1222]/20 p-6">
          {selectedMentor && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#0F766E] font-bold uppercase">
                  <span>BOOKING SESI MENTORING 1-ON-1 (GRATIS)</span>
                </div>
                <DialogTitle className="font-serif text-xl font-bold text-[#0B1536] text-left pt-1">
                  Bimbingan bersama {selectedMentor.nama}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#525866] text-left">
                  {selectedMentor.pekerjaan} · {selectedMentor.perusahaan}
                </DialogDescription>
              </DialogHeader>

              {isBookingDone ? (
                <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                  <h4 className="font-serif font-bold text-base text-[#065F46]">
                    Permintaan Sesi Terkirim!
                  </h4>
                  <p className="text-xs text-[#047857]">
                    Mentor akan mengonfirmasi slot waktu melalui kontak Anda dalam 24 jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#525866] block mb-1">
                      Pilih Topik Diskusi
                    </label>
                    <select
                      value={mentorTopic}
                      onChange={(e) => setMentorTopic(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-2.5 focus:outline-none focus:border-[#0B1536]"
                    >
                      <option value="Review CV & Portofolio">Review CV & Portofolio Kerja</option>
                      <option value="Persiapan Wawancara Karir">Persiapan Wawancara di Ibu Kota</option>
                      <option value="Konsultasi Regulasi / Legal">Konsultasi Bisnis & Legalitas</option>
                      <option value="Diskusi Transisi Industri">Diskusi Jalur Karier & Transisi</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#525866] block mb-1">
                      Catatan Tambahan untuk Mentor (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan secara ringkas pertanyaan atau tantangan yang ingin Anda diskusikan..."
                      value={mentorNote}
                      onChange={(e) => setMentorNote(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-2.5 focus:outline-none focus:border-[#0B1536]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-mono font-bold uppercase py-3 px-4 flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#F4C542]" />
                      <span>Kirim Permintaan Bimbingan</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

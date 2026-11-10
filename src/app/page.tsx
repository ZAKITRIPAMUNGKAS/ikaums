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
  Check,
  Building,
  Send
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
  { id: 'health', label: 'Kesehatan & Farmasi', match: 'Kesehatan' },
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

        {/* 1. HERO SECTION (THE INDEX × CURATIONS SUPPLY) */}
        <section className="border-b border-[#0C1222]/8 bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 md:pt-12 md:pb-18 lg:pt-16 lg:pb-20">
            
            {/* 2-Column Responsive Layout - Always Side-by-Side on md/lg/xl */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Bold Editorial Typography */}
              <div className="md:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#0B1536]/5 text-[#0B1536] px-3 py-1 rounded-full text-xs font-medium border border-[#0B1536]/10">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span>Jejaring Resmi Alumni UMS Jabodetabek</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#0B1536] leading-[1.05]">
                  Dari Temu Kangen, <br />
                  <span className="italic font-normal text-[#B45309]">menjadi Temu Peluang.</span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-[#475569] max-w-xl leading-relaxed">
                  Ekosistem mandiri yang menghubungkan lebih dari 1.200 alumni Universitas Muhammadiyah Surakarta di perantauan ibu kota. Dapatkan rujukan karier terpercaya, bimbingan langsung dari alumni senior, dan peluang kolaborasi usaha bersama.
                </p>

                {/* Direct Action Pills */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#direktori"
                    className="bg-[#0B1536] hover:bg-[#16234D] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-sm group"
                  >
                    <span>Jelajahi Direktori Alumni</span>
                    <ArrowRight className="w-4 h-4 text-[#F4C542] group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="#peta"
                    className="border border-[#0C1222]/20 hover:border-[#0B1536] hover:bg-white text-[#0B1536] text-xs sm:text-sm font-semibold px-5 py-3 rounded-full transition-all"
                  >
                    Peta Sebaran (9 Wilayah)
                  </a>
                </div>

                {/* Social Proof Counter */}
                <div className="flex items-center gap-3 pt-3 text-xs text-[#64748B]">
                  <div className="flex -space-x-2">
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="/images/avatar-aditya.jpg" alt="Alumni" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="/images/avatar-amalia.jpg" alt="Alumni" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="/images/avatar-dian.jpg" alt="Alumni" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="/images/avatar-bambang.jpg" alt="Alumni" />
                  </div>
                  <span><strong>1.248 alumni</strong> telah terverifikasi di Jabodetabek</span>
                </div>
              </div>

              {/* Right Column: Hero Visual with Rounded Framing */}
              <div className="md:col-span-5">
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#0C1222]/10 bg-white shadow-xl group">
                  <div className="aspect-[4/3] w-full">
                    <img
                      src="/images/hero-kumpul-bolo-pisah.jpg"
                      alt="Dokumentasi Silaturahmi Akbar Alumni UMS se-Jabodetabek"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Floating Caption Overlay */}
                  <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-[#0C1222]/10 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#0B1536]">Temu Akbar Alumni Jabodetabek</p>
                      <p className="text-[11px] text-[#64748B]">Aula Pertemuan Jakarta Selatan · 100+ Perwakilan Angkatan</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#0B1536]/5 text-[#0B1536] px-2 py-1 rounded">
                      DOKUMENTASI RESMI
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 3-Column Metric Rule Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#0C1222]/10 mt-12 pt-8 divide-y sm:divide-y-0 sm:divide-x divide-[#0C1222]/10">
              <div className="py-3 sm:pr-8">
                <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block mb-1">
                  ALUMNI TERVERIFIKASI
                </span>
                <span className="font-serif text-3xl font-bold text-[#0B1536] block">
                  1.248 Anggota
                </span>
                <span className="text-xs text-[#64748B] mt-1 block">
                  Terdaftar aktif dari angkatan 1985 hingga 2025 lintas 12 fakultas.
                </span>
              </div>

              <div className="py-3 sm:px-8">
                <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block mb-1">
                  DISTRIBUSI METROPOLITAN
                </span>
                <span className="font-serif text-3xl font-bold text-[#0B1536] block">
                  9 Sentra Wilayah
                </span>
                <span className="text-xs text-[#64748B] mt-1 block">
                  Tersebar di DKI Jakarta, Tangerang Raya, Bekasi, Depok, dan Bogor.
                </span>
              </div>

              <div className="py-3 sm:pl-8">
                <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block mb-1">
                  BIMBINGAN & MENTORING
                </span>
                <span className="font-serif text-3xl font-bold text-[#0B1536] block">
                  326 Mentor Aktif
                </span>
                <span className="text-xs text-[#64748B] mt-1 block">
                  Alumni senior yang bersedia membimbing karier dan membuka rujukan loker.
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. DIREKTORI ALUMNI TERKURASI (CURATIONS SUPPLY + CONTRA) */}
        <section id="direktori" className="py-16 border-b border-[#0C1222]/8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header + Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-[#0C1222]/10 pb-6 mb-6 gap-4">
              <div>
                <span className="text-xs font-semibold text-[#B45309] uppercase tracking-wider block mb-1">
                  DIREKTORI & TALENTA
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1536]">
                  Jelajahi Profil Profesional Terverifikasi
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mt-1">
                  Temukan sesama lulusan UMS berdasarkan industri keahlian, bidang profesi, dan domisili perantauan di Jabodetabek.
                </p>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, keahlian, kantor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs sm:text-sm text-[#0C1222] pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:border-[#0B1536] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Curations Supply-Style Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {DOMAIN_FILTERS.map((domain) => {
                const isActive = selectedDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    type="button"
                    className={`px-4 py-2 text-xs rounded-full whitespace-nowrap transition-all font-medium ${
                      isActive
                        ? 'bg-[#0B1536] text-white shadow-sm font-semibold'
                        : 'bg-[#FAF9F5] hover:bg-[#F1EFEA] text-[#64748B] hover:text-[#0B1536] border border-[#0C1222]/10'
                    }`}
                  >
                    {domain.label}
                  </button>
                );
              })}
            </div>

            {/* Contra-Style Talent Cards Grid */}
            {filteredAlumni.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#0C1222]/20 p-12 text-center bg-[#FAF9F5]">
                <p className="text-base font-serif text-[#0B1536] font-bold">
                  Tidak ditemukan profil yang sesuai kriteria pencarian.
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  Coba gunakan kata kunci lain atau pilih tab &quot;Semua Bidang&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alumni) => (
                  <div
                    key={alumni.id}
                    className="bg-[#FAF9F5] border border-[#0C1222]/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#0B1536]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      {/* Avatar, Name & Verification */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#0C1222]/10 bg-white shadow-sm">
                          {alumni.avatarUrl ? (
                            <img
                              src={alumni.avatarUrl}
                              alt={alumni.nama}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0B1536] text-[#F4C542] font-bold text-sm">
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
                              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                            )}
                          </div>
                          <span className="inline-block text-[11px] font-medium text-[#64748B] mt-0.5">
                            {alumni.prodi} · &apos;{String(alumni.angkatan).slice(-2)}
                          </span>
                        </div>
                      </div>

                      {/* Position & Organization */}
                      <div>
                        <p className="text-xs font-bold text-[#0B1536] leading-snug">
                          {alumni.pekerjaan}
                        </p>
                        {alumni.perusahaan && (
                          <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                            <Building className="w-3.5 h-3.5 text-[#64748B]/70" />
                            <span>{alumni.perusahaan}</span>
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-[#64748B] mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0B1536]" />
                          <span>{alumni.wilayah}</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                        {alumni.bio}
                      </p>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {alumni.keahlian.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="bg-white text-[#334155] text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#0C1222]/8"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Status Pill */}
                      {alumni.bersediaMentoring ? (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#0F766E] bg-[#CCFBF1]/60 px-3 py-1 rounded-full border border-[#99F6E4]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse"></span>
                          <span>Terbuka Mentoring 1-on-1</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#64748B] bg-white px-3 py-1 rounded-full border border-[#0C1222]/8">
                          <span>Terbuka Diskusi Karier</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 mt-5 border-t border-[#0C1222]/8 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedProfile(alumni)}
                        className="text-xs font-semibold text-[#0B1536] hover:text-[#B45309] flex items-center gap-1"
                      >
                        <span>Lihat Profil</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {alumni.bersediaMentoring ? (
                        <button
                          type="button"
                          onClick={() => setSelectedMentor(alumni)}
                          className="text-xs font-semibold bg-[#0B1536] hover:bg-[#16234D] text-white px-3.5 py-1.5 rounded-full transition-all shadow-xs"
                        >
                          Booking Mentor
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedProfile(alumni)}
                          className="text-xs font-semibold border border-[#0C1222]/20 hover:border-[#0B1536] text-[#0B1536] px-3.5 py-1.5 rounded-full transition-all"
                        >
                          Koneksi
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Link to Full Directory */}
            <div className="mt-10 pt-6 border-t border-[#0C1222]/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
              <span>Menampilkan {filteredAlumni.length} profil alumni terverifikasi di Jabodetabek.</span>
              <Link
                href="/direktori"
                className="text-xs font-bold text-[#0B1536] hover:text-[#B45309] flex items-center gap-1.5"
              >
                <span>Buka Seluruh Direktori Alumni (1.248 Anggota)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>

        {/* 3. MENTORING 1-ON-1 (ADPLIST MODEL) */}
        <section className="py-16 border-b border-[#0C1222]/8 bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-[#0C1222]/10 pb-6 mb-10 gap-4">
              <div>
                <span className="text-xs font-semibold text-[#B45309] uppercase tracking-wider block mb-1">
                  BIMBINGAN 1-ON-1
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1536]">
                  Mentoring Langsung dari Alumni Senior
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mt-1">
                  Inisiatif sukarela tanpa biaya. Bimbingan kurasi portofolio, persiapan wawancara kerja di ibu kota, atau konsultasi kepatuhan hukum awal bagi sesama lulusan UMS.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#0F766E] bg-[#CCFBF1]/60 border border-[#99F6E4] px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-[#0F766E]" />
                <span>100% Bebas Biaya · Komitmen Gotong Royong</span>
              </div>
            </div>

            {/* Mentor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white border border-[#0C1222]/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#0B1536]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Mentor Header */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-13 h-13 rounded-full overflow-hidden shrink-0 border border-[#0C1222]/10">
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
                        <p className="text-[11px] text-[#64748B]">
                          {mentor.perusahaan}
                        </p>
                      </div>
                    </div>

                    {/* Response Badge */}
                    <div className="flex items-center justify-between text-xs border-y border-[#0C1222]/8 py-2.5 text-[#64748B]">
                      <span className="flex items-center gap-1.5 text-[#0F766E] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse"></span>
                        2 Slot Terbuka Minggu Ini
                      </span>
                      <span>Respon &lt; 24 jam</span>
                    </div>

                    {/* Mentoring Topics */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                        Fokus Bimbingan:
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
                  <div className="pt-5 mt-4 border-t border-[#0C1222]/8">
                    <button
                      type="button"
                      onClick={() => setSelectedMentor(mentor)}
                      className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-semibold py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm"
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

        {/* 4. PETA SEBARAN SPASIAL (FELT GIS) */}
        <section id="peta" className="py-16 border-b border-[#0C1222]/8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C1222]/10 pb-4 mb-8">
              <div>
                <span className="text-xs font-semibold text-[#B45309] uppercase tracking-wider block mb-1">
                  SEBARAN GEOGRAFIS
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#0B1536]">
                  Peta Sebaran Alumni di Jabodetabek
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mt-1">
                  Batas administratif 9 wilayah resmi BPS / BIG terkalibrasi. Temukan sentra komunitas dan mentor terdekat dari domisili Anda.
                </p>
              </div>

              <Link
                href="/peta"
                className="text-xs font-semibold text-[#0B1536] hover:text-[#B45309] flex items-center gap-1 mt-2 sm:mt-0"
              >
                <span>Buka Peta Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Precision Map Component with Felt Pill Markers & Telemetry */}
            <AccurateJabodetabekMap />

          </div>
        </section>

        {/* 5. AGENDA & KEGIATAN KOMUNITAS (LUMA MODEL) */}
        <section className="py-16 border-b border-[#0C1222]/8 bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C1222]/10 pb-4 mb-8">
              <div>
                <span className="text-xs font-semibold text-[#B45309] uppercase tracking-wider block mb-1">
                  KEGIATAN & EVENT
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1536]">
                  Agenda Terdekat Komunitas Jabodetabek
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mt-1">
                  Dari silaturahmi berkala di sentra co-working hingga forum kurasi bisnis dan klinik karir.
                </p>
              </div>

              <Link
                href="/kegiatan"
                className="text-xs font-semibold text-[#0B1536] hover:text-[#B45309] flex items-center gap-1 mt-2 sm:mt-0"
              >
                <span>Lihat Semua Agenda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Luma Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DATA_KEGIATAN_SIMULASI.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="bg-white border border-[#0C1222]/10 rounded-2xl flex flex-col justify-between overflow-hidden hover:border-[#0B1536]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div>
                    {/* Cover Photo with Floating Date Chip */}
                    <div className="aspect-[16/9] w-full relative overflow-hidden bg-[#E8ECF2]">
                      <img
                        src={ev.gambar || '/images/event-kopdar.jpg'}
                        alt={ev.judul}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      
                      {/* Floating Date Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#0B1536] rounded-xl p-2 text-center min-w-[50px] border border-[#0C1222]/10 shadow-sm">
                        <span className="text-base font-bold block leading-none">
                          {idx === 0 ? '28' : idx === 1 ? '06' : '19'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#B45309] block mt-0.5">
                          {idx === 0 ? 'NOV' : 'DES'}
                        </span>
                      </div>

                      {/* Event Tag */}
                      <div className="absolute bottom-3 right-3 bg-[#0B1536]/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                        {ev.jenis}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[#64748B]">
                        <Clock className="w-3.5 h-3.5 text-[#0B1536]" />
                        <span>{ev.tanggalWIB} · {ev.jamWIB}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#0B1536] leading-snug group-hover:text-[#16234D]">
                        {ev.judul}
                      </h3>

                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                        {ev.deskripsi}
                      </p>

                      <div className="flex items-start gap-1.5 text-xs text-[#64748B] pt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0B1536] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{ev.lokasiSpesifik || ev.wilayah}</span>
                      </div>

                      {/* Attendee Progress Bar */}
                      <div className="pt-2 space-y-1.5">
                        <div className="flex justify-between text-xs text-[#64748B]">
                          <span>{ev.terdaftarCount} alumni hadir</span>
                          <span className="font-semibold text-[#0B1536]">
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

                  {/* RSVP Button */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-semibold py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>RSVP Cepat</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F4C542]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 6. CERITA & JURNAL ALUMNI (THE INDEX JOURNAL) */}
        <section className="py-16 border-b border-[#0C1222]/8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C1222]/10 pb-4 mb-8">
              <div>
                <span className="text-xs font-semibold text-[#B45309] uppercase tracking-wider block mb-1">
                  KABAR DARI IBU KOTA
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1536]">
                  Rekam Jejak & Dampak Sinergi Alumni
                </h2>
              </div>

              <Link
                href="/cerita"
                className="text-xs font-semibold text-[#0B1536] hover:text-[#B45309] flex items-center gap-1 mt-2 sm:mt-0"
              >
                <span>Baca Semua Cerita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Asymmetrical Story Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Featured Cover Story */}
              <div className="lg:col-span-7 bg-[#FAF9F5] border border-[#0C1222]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#0C1222]/10 bg-[#E2E8F0]">
                    <img
                      src="/images/cerita-startup.jpg"
                      alt="Kisah Hendra Setiawan Alumni UMS"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#B45309] font-semibold uppercase tracking-wider">
                    <span>WIRAUSAHA & EDUKASI</span>
                    <span>•</span>
                    <span className="text-[#64748B]">5 MENIT BACA</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1536] leading-tight">
                    Dari Kampus Pabelan ke Sentra Startup Jakarta: Hendra Membuka Pintu bagi Ratusan Lulusan Baru
                  </h3>

                  <blockquote className="border-l-2 border-[#B45309] pl-4 py-1 italic font-serif text-base text-[#334155] leading-relaxed">
                    &quot;Modal terbesar anak rantau Solo bukan cuma ijazah, tapi rasa saling percaya. Saat pertama ke Jakarta, alumni senior yang memberi tumpangan dan rujukan kerja pertama.&quot;
                  </blockquote>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    Perjalanan Hendra Setiawan (Informatika 2016) mendirikan platform edukasi digital di Jakarta Selatan, yang kini membuka lebih dari 35 lowongan dan pendampingan karier gratis bagi sesama lulusan baru Solo Raya.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/cerita"
                    className="text-xs font-semibold text-[#0B1536] hover:text-[#B45309] uppercase tracking-wider inline-flex items-center gap-1.5"
                  >
                    <span>Baca Laporan Wawancara Lengkap</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 2 Companion Articles */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                {DATA_CERITA_SIMULASI.slice(1, 3).map((story) => (
                  <div
                    key={story.id}
                    className="bg-[#FAF9F5] border border-[#0C1222]/10 rounded-2xl p-6 flex flex-col justify-between space-y-3 flex-1 hover:border-[#0B1536]/30 transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-xs text-[#B45309] font-semibold uppercase tracking-wider block">
                        {story.kategori}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#0B1536] leading-snug">
                        {story.judul}
                      </h4>
                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                        {story.ringkasan}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#0C1222]/8 flex items-center justify-between">
                      <span className="text-xs text-[#64748B]">
                        {story.jurusanAngkatan}
                      </span>
                      <Link
                        href="/cerita"
                        className="text-xs font-bold text-[#0B1536] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Baca</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* 7. INSTITUTIONAL STATEMENT (THE INDEX FINISH) */}
        <section className="py-16 bg-[#0B1536] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/20 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-[#0C1222]/50">
              
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs uppercase tracking-widest text-[#F4C542] font-bold block">
                  KOMITMEN KESETARAAN & GOTONG ROYONG
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                  Mempertemukan Potensi, Memajukan Almamater di Perantauan.
                </h3>
                <p className="text-xs sm:text-sm text-[#EDF1FA]/80 leading-relaxed">
                  Semua data profil tersimpan dengan persetujuan mandiri di bawah perlindungan UU PDP No. 27/2022. Tidak ada data yang dibagikan ke pihak ketiga tanpa izin pengguna.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <Link
                  href="/gabung"
                  className="w-full sm:w-auto bg-[#F4C542] hover:bg-[#e8b935] text-[#0B1536] text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full text-center transition-all shadow-sm"
                >
                  Daftar Sebagai Alumni
                </Link>
                <Link
                  href="/tentang"
                  className="w-full sm:w-auto border border-white/30 hover:border-white text-white text-xs uppercase tracking-wider px-6 py-3.5 rounded-full text-center transition-all"
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
        <DialogContent className="sm:max-w-xl bg-white border border-[#0C1222]/15 p-0 overflow-hidden rounded-2xl">
          {selectedProfile && (
            <div>
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
                    <p className="text-xs text-[#EDF1FA]/80 mt-0.5">
                      {selectedProfile.prodi} · Angkatan {selectedProfile.angkatan}
                    </p>
                    <p className="text-xs text-[#F4C542] font-semibold mt-1">
                      {selectedProfile.pekerjaan} {selectedProfile.perusahaan ? `· ${selectedProfile.perusahaan}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase block mb-1">
                    DOMISILI PERANTAUAN
                  </span>
                  <p className="text-xs font-semibold text-[#0B1536] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B1536]" />
                    <span>{selectedProfile.wilayah}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase block mb-1">
                    TENTANG & REKAM JEJAK
                  </span>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    {selectedProfile.bio}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase block mb-2">
                    KEAHLIAN & SPESIALISASI
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.keahlian.map((skill) => (
                      <span
                        key={skill}
                        className="bg-[#FAF9F5] text-[#0B1536] text-xs px-3 py-1 rounded-full border border-[#0C1222]/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProfile.bersediaMentoring && (
                  <div className="bg-[#FAF9F5] border border-[#0F766E]/30 p-4 rounded-xl text-xs text-[#0F766E] flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Mentor Terbuka untuk Sesi 1-on-1</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Alumni ini bersedia memberikan bimbingan dan review karier sukarela bagi lulusan baru UMS di Jabodetabek.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#FAF9F5] border-t border-[#0C1222]/8 p-4 px-6 flex items-center justify-between">
                <span className="text-xs text-[#64748B]">
                  Terverifikasi resmi IKA UMS
                </span>
                <div className="flex items-center gap-2">
                  {selectedProfile.bersediaMentoring ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMentor(selectedProfile);
                        setSelectedProfile(null);
                      }}
                      className="bg-[#0B1536] text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#16234D] transition-colors"
                    >
                      Jadwalkan Mentoring
                    </button>
                  ) : (
                    <Link
                      href="/direktori"
                      className="bg-[#0B1536] text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#16234D] transition-colors"
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
        <DialogContent className="sm:max-w-md bg-white border border-[#0C1222]/15 p-6 rounded-2xl">
          {selectedEvent && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase">
                  <span>RSVP KEGIATAN KOMUNITAS</span>
                  <span>•</span>
                  <span>{selectedEvent.jenis}</span>
                </div>
                <DialogTitle className="font-serif text-xl font-bold text-[#0B1536] text-left pt-1">
                  {selectedEvent.judul}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#64748B] text-left">
                  {selectedEvent.tanggalWIB} · {selectedEvent.jamWIB}
                  <br />
                  {selectedEvent.lokasiSpesifik}
                </DialogDescription>
              </DialogHeader>

              {isRsvpDone ? (
                <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-6 rounded-xl text-center space-y-2">
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
                    <label className="text-xs font-medium text-[#64748B] block mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="contoh: Muhammad Farhan"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-3 rounded-xl focus:outline-none focus:border-[#0B1536]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#64748B] block mb-1">
                        Fakultas / Angkatan
                      </label>
                      <input
                        type="text"
                        placeholder="contoh: FT / 2018"
                        value={rsvpProdi}
                        onChange={(e) => setRsvpProdi(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-3 rounded-xl focus:outline-none focus:border-[#0B1536]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#64748B] block mb-1">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0812xxxxxxx"
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-3 rounded-xl focus:outline-none focus:border-[#0B1536]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm"
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
        <DialogContent className="sm:max-w-md bg-white border border-[#0C1222]/15 p-6 rounded-2xl">
          {selectedMentor && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase">
                  <span>BOOKING SESI MENTORING 1-ON-1 (GRATIS)</span>
                </div>
                <DialogTitle className="font-serif text-xl font-bold text-[#0B1536] text-left pt-1">
                  Bimbingan bersama {selectedMentor.nama}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#64748B] text-left">
                  {selectedMentor.pekerjaan} · {selectedMentor.perusahaan}
                </DialogDescription>
              </DialogHeader>

              {isBookingDone ? (
                <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-6 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                  <h4 className="font-serif font-bold text-base text-[#065F46]">
                    Permintaan Sesi Terkirim!
                  </h4>
                  <p className="text-xs text-[#047857]">
                    Mentor akan mengonfirmasi jadwal bimbingan melalui kontak WhatsApp Anda dalam 24 jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-medium text-[#64748B] block mb-1">
                      Pilih Topik Diskusi
                    </label>
                    <select
                      value={mentorTopic}
                      onChange={(e) => setMentorTopic(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-3 rounded-xl focus:outline-none focus:border-[#0B1536]"
                    >
                      <option value="Review CV & Portofolio">Review CV & Portofolio Kerja</option>
                      <option value="Persiapan Wawancara Karir">Persiapan Wawancara di Ibu Kota</option>
                      <option value="Konsultasi Regulasi / Legal">Konsultasi Bisnis & Legalitas</option>
                      <option value="Diskusi Transisi Industri">Diskusi Jalur Karier & Transisi</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#64748B] block mb-1">
                      Catatan Tambahan untuk Mentor (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan secara ringkas pertanyaan atau tantangan yang ingin Anda diskusikan..."
                      value={mentorNote}
                      onChange={(e) => setMentorNote(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#0C1222]/15 text-xs p-3 rounded-xl focus:outline-none focus:border-[#0B1536]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white text-xs font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm"
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

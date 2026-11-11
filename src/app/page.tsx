'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { 
  DATA_ALUMNI_SIMULASI, 
  DATA_KEGIATAN_SIMULASI, 
  DATA_WILAYAH_SIMULASI 
} from '@/data/simulasi';
import { AlumniProfile, EventKegiatan, WilayahStatistik } from '@/types';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Search,
  Users,
  MessageCircle,
  Building2,
  Clock,
  Sparkles,
  Check,
  Send,
  Coffee,
  HeartHandshake
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
  { id: 'eng', label: 'Teknik & Lingkungan', match: 'Teknik' },
  { id: 'biz', label: 'Manajemen & Bisnis', match: 'Bisnis' },
  { id: 'health', label: 'Kesehatan & Farmasi', match: 'Farmasi' },
  { id: 'legal', label: 'Hukum & Korporasi', match: 'Hukum' },
  { id: 'tax', label: 'Keuangan & Pajak', match: 'Pajak' },
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

  // Filtered alumni logic
  const filteredAlumni = useMemo(() => {
    return DATA_ALUMNI_SIMULASI.filter((alumni) => {
      const activeFilter = DOMAIN_FILTERS.find((d) => d.id === selectedDomain);
      const matchesDomain = 
        selectedDomain === 'all' || 
        (activeFilter?.match && (alumni.industri.toLowerCase().includes(activeFilter.match.toLowerCase()) || alumni.prodi.toLowerCase().includes(activeFilter.match.toLowerCase())));

      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        !query ||
        alumni.nama.toLowerCase().includes(query) ||
        alumni.prodi.toLowerCase().includes(query) ||
        alumni.pekerjaan.toLowerCase().includes(query) ||
        (alumni.perusahaan && alumni.perusahaan.toLowerCase().includes(query)) ||
        alumni.wilayah.toLowerCase().includes(query);

      return matchesDomain && matchesQuery;
    });
  }, [selectedDomain, searchQuery]);

  // Mentors curated list with specific help topics
  const mentorList = useMemo(() => {
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
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow">

        {/* 1. HERO SECTION: HANGAT, MANUSIAWI, BENTO RINGKAS DI MOBILE */}
        <section className="border-b border-[#0C2340]/10 bg-[#FDFCF7] pt-6 pb-10 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-14 items-center">
              
              {/* Kolom Teks */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-[#D97706]">
                  Komunitas Alumni Universitas Muhammadiyah Surakarta · Jabodetabek
                </p>

                <h1 className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] text-[#0C2340] leading-[1.15]">
                  Tempat kumpul dan saling bantu sesama alumni UMS di Jabodetabek.
                </h1>

                <p className="text-sm sm:text-lg text-[#475569] max-w-2xl leading-relaxed">
                  Biar di perantauan tidak jalan sendirian. Di sini kamu bisa cari teman satu almamater, minta saran dunia kerja dari alumni yang lebih dulu di Jakarta, atau sekadar janjian ngopi bareng di kotamu.
                </p>

                {/* Tombol Aksi Nyata — 2 kolom sejajar rapi di mobile */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-4 pt-1">
                  <a
                    href="#direktori"
                    className="bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-sm sm:text-base font-semibold px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-sm"
                  >
                    <span>Cari Rekan</span>
                    <span className="hidden sm:inline">Alumni</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  </a>
                  <a
                    href="#agenda"
                    className="bg-white border border-[#0C2340]/25 hover:border-[#0C2340] text-[#0C2340] text-sm sm:text-base font-semibold px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-center transition-colors"
                  >
                    Agenda Kumpul
                  </a>
                </div>

                {/* Mini Bento Stat Strip — 3 kotak rapi sejajar */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#0C2340]/10">
                  <div className="bg-[#F3F1EA]/85 border border-[#0C2340]/10 rounded-xl p-2.5 sm:p-3.5">
                    <div className="flex items-center gap-1.5 text-[#0C2340]">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="text-sm sm:text-base font-extrabold leading-none">1.200+</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#475569] mt-1 leading-tight">
                      Alumni terhubung
                    </p>
                  </div>
                  <div className="bg-[#F3F1EA]/85 border border-[#0C2340]/10 rounded-xl p-2.5 sm:p-3.5">
                    <div className="flex items-center gap-1.5 text-[#0C2340]">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D97706] shrink-0" />
                      <span className="text-sm sm:text-base font-extrabold leading-none">9 Kota</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#475569] mt-1 leading-tight">
                      Sentra kumpul
                    </p>
                  </div>
                  <div className="bg-[#F3F1EA]/85 border border-[#0C2340]/10 rounded-xl p-2.5 sm:p-3.5">
                    <div className="flex items-center gap-1.5 text-[#0C2340]">
                      <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
                      <span className="text-sm sm:text-base font-extrabold leading-none">Gratis</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#475569] mt-1 leading-tight">
                      Mentoring alumni
                    </p>
                  </div>
                </div>
              </div>

              {/* Kolom Visual: Foto Nyata Kopdar Alumni */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-[#0C2340]/15 bg-white shadow-md">
                  <div className="aspect-[16/10] sm:aspect-[4/3] w-full bg-[#E2E8F0] relative">
                    <img
                      src="/images/alumni-gathering-4.jpg"
                      alt="Alumni UMS saling menyapa hangat saat kopdar di Museum Mandiri Kota Tua"
                      className="w-full h-full object-cover object-[50%_25%]"
                    />
                  </div>
                  <div className="p-3.5 sm:p-4 bg-white border-t border-[#0C2340]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#475569]">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span className="font-medium text-[#0C2340]">Kopdar Santai Alumni UMS · Museum Mandiri Kota Tua</span>
                    </div>
                    <span className="self-start sm:self-auto text-[11px] font-semibold text-[#0C2340] bg-[#F3F1EA] px-2.5 py-0.5 rounded whitespace-nowrap shrink-0">
                      Dokumentasi Temu Alumni
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. SECTION FULL-BLEED: FOTO BESAR TEMU AKBAR "KUMPUL BOLO PISAH" */}
        <section className="relative w-full h-[320px] sm:h-[440px] md:h-[520px] bg-[#0C2340] overflow-hidden">
          <img
            src="/images/hero-kumpul-bolo-pisah.jpg"
            alt="Silaturahmi Akbar Kumpul Bolo Pisah Alumni UMS se-Jabodetabek"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340] via-[#0C2340]/45 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-10 md:p-12 text-white">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block bg-[#F59E0B] text-[#0C2340] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-sm mb-2 sm:mb-3">
                Kumpul Bolo Pisah UMS Jabodetabek
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
                Dari Kampus Pabelan dan Gonilan sampai ke sudut-sudut ibu kota.
              </h2>
              <p className="text-xs sm:text-base text-white/90 max-w-2xl mt-1.5 sm:mt-2 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Pertemuan silaturahmi akbar lintas angkatan dan fakultas. Bertemu kawan lama masa kuliah, berkenalan dengan senior dan adik tingkat, serta saling membuka jalan rujukan karier di Jabodetabek.
              </p>
            </div>
          </div>
        </section>

        {/* 3. AGENDA KEGIATAN MENDATANG: BENTO GRID 1 + 2 */}
        <section id="agenda" className="py-12 sm:py-16 border-b border-[#0C2340]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C2340]/10 pb-4 sm:pb-5 mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                  AGENDA KOMUNITAS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                  Kegiatan dan Tempat Kumpul Terdekat
                </h2>
                <p className="text-sm sm:text-base text-[#475569] mt-1 max-w-xl">
                  Datang dan gabung langsung. Semua kegiatan terbuka untuk seluruh alumni UMS tanpa memandang angkatan atau jurusan.
                </p>
              </div>

              <Link
                href="/kegiatan"
                className="text-sm font-semibold text-[#0C2340] hover:text-[#1D4ED8] flex items-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <span>Lihat semua jadwal agenda</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Bento Agenda Grid: 1 Featured Row + 2 Side-by-Side Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5">
              {DATA_KEGIATAN_SIMULASI.map((item, idx) => {
                const isFeatured = idx === 0;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-4 sm:p-6 border transition-colors flex flex-col justify-between gap-4 ${
                      isFeatured
                        ? 'md:col-span-2 lg:col-span-12 bg-[#F3F1EA]/70 border-[#0C2340]/20 hover:border-[#0C2340] lg:flex-row lg:items-center lg:gap-6'
                        : 'md:col-span-1 lg:col-span-6 bg-[#FDFCF7] border-[#0C2340]/15 hover:border-[#0C2340]'
                    }`}
                  >
                    <div className={`flex flex-col ${isFeatured ? 'sm:flex-row sm:items-center' : ''} gap-3.5 sm:gap-5`}>
                      {/* Baris Atas Mobile / Kotak Tanggal Desktop */}
                      <div className="flex items-center justify-between sm:block shrink-0">
                        <div className="px-3 py-2 sm:w-20 sm:h-20 bg-[#0C2340] text-white rounded-xl flex sm:flex-col items-baseline sm:items-center justify-center gap-1.5 sm:gap-0 text-center shadow-xs">
                          <span className="text-lg sm:text-2xl font-extrabold leading-none">
                            {idx === 0 ? '28' : idx === 1 ? '06' : '19'}
                          </span>
                          <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider sm:mt-1">
                            {idx === 0 ? 'NOV 2026' : 'DES 2026'}
                          </span>
                        </div>

                        <div className="flex sm:hidden items-center gap-2">
                          <span className="text-[11px] font-semibold bg-[#0C2340]/8 text-[#0C2340] px-2.5 py-0.5 rounded-md">
                            {item.jenis}
                          </span>
                          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.jamWIB}</span>
                          </span>
                        </div>
                      </div>

                      {/* Rincian Kegiatan */}
                      <div className="space-y-1.5">
                        <div className="hidden sm:flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold bg-[#0C2340]/8 text-[#0C2340] px-2.5 py-0.5 rounded">
                            {item.jenis}
                          </span>
                          <span className="text-xs text-[#64748B] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.jamWIB}</span>
                          </span>
                        </div>

                        <h3 className="text-base sm:text-xl font-bold text-[#0C2340] leading-snug">
                          {item.judul}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
                          {item.deskripsi}
                        </p>

                        <div className="flex items-start sm:items-center gap-1.5 text-xs text-[#64748B] pt-0.5">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D97706] shrink-0 mt-0.5 sm:mt-0" />
                          <span className="font-medium text-[#0C2340]">{item.lokasiSpesifik || item.wilayah}</span>
                        </div>
                      </div>
                    </div>

                    {/* Kuota & Aksi */}
                    <div
                      className={`shrink-0 flex items-center justify-between gap-3 border-t border-[#0C2340]/10 pt-3 ${
                        isFeatured ? 'lg:border-t-0 lg:pt-0 lg:flex-col lg:items-end lg:text-right' : 'mt-auto'
                      }`}
                    >
                      <div className="text-xs text-[#475569]">
                        <span className="font-semibold text-[#0C2340]">{item.terdaftarCount}</span> / {item.kapasitas} kursi
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(item)}
                        className="bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
                      >
                        Daftar (RSVP)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 4. DIREKTORI ALUMNI: BENTO 2-KOLOM DI MOBILE, 3-KOLOM DI DESKTOP */}
        <section id="direktori" className="py-12 sm:py-16 border-b border-[#0C2340]/10 bg-[#FDFCF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="border-b border-[#0C2340]/10 pb-4 sm:pb-5 mb-6 sm:mb-8">
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                DIREKTORI PERANTAUAN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                Temukan Rekan Alumni Berdasarkan Bidang
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-1 max-w-2xl">
                Cari rekan satu jurusan atau alumni UMS yang bekerja di industri yang sedang kamu minati di wilayah Jabodetabek.
              </p>
            </div>

            {/* Toolbar Pencarian & Filter Bidang */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="relative max-w-xl">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, jurusan, atau pekerjaan..."
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-[#0C2340]/20 rounded-xl text-sm sm:text-base text-[#0C2340] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0C2340] focus:border-[#0C2340]"
                />
              </div>

              {/* Filter Tabs Sederhana */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                {DOMAIN_FILTERS.map((tab) => {
                  const isActive = selectedDomain === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedDomain(tab.id)}
                      className={`text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#0C2340] text-white font-semibold shadow-xs'
                          : 'bg-white border border-[#0C2340]/15 text-[#475569] hover:text-[#0C2340] hover:border-[#0C2340]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bento Grid Alumni: 2 kolom rapi di mobile, 3 kolom di desktop */}
            {filteredAlumni.length === 0 ? (
              <div className="bg-white border border-dashed border-[#0C2340]/20 rounded-2xl p-8 sm:p-10 text-center">
                <p className="text-base font-semibold text-[#0C2340]">
                  Belum ada alumni yang cocok dengan pencarian &quot;{searchQuery}&quot;.
                </p>
                <p className="text-sm text-[#64748B] mt-1">
                  Coba pilih tab &quot;Semua Bidang&quot; atau ketik kata kunci yang lebih umum.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
                {filteredAlumni.slice(0, 6).map((alumni) => (
                  <div
                    key={alumni.id}
                    className="bg-white border border-[#0C2340]/15 rounded-2xl p-3 sm:p-5 flex flex-col justify-between hover:border-[#0C2340] transition-colors shadow-2xs"
                  >
                    <div className="space-y-2.5 sm:space-y-3.5">
                      {/* Header Bento Card: Stacked di <sm agar teks leluasa, sejajar di sm+ */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3.5">
                        <div className="flex items-center justify-between sm:block shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#0C2340]/10 bg-[#E2E8F0]">
                            {alumni.avatarUrl ? (
                              <img
                                src={alumni.avatarUrl}
                                alt={alumni.nama}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-xs sm:text-sm">
                                {alumni.avatarInitials}
                              </div>
                            )}
                          </div>
                          <span className="sm:hidden text-[11px] font-semibold text-[#0C2340] bg-[#F3F1EA] px-2 py-0.5 rounded-md">
                            &apos;{String(alumni.angkatan).slice(-2)}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-[13px] sm:text-base font-bold text-[#0C2340] truncate">
                            {alumni.nama}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-[#64748B] truncate">
                            {alumni.prodi}
                            <span className="hidden sm:inline"> · Angkatan {alumni.angkatan}</span>
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-[#0C2340] mt-0.5 truncate">
                            {alumni.pekerjaan}
                          </p>
                        </div>
                      </div>

                      {/* Lokasi & Perusahaan */}
                      <div className="text-[11px] sm:text-xs text-[#475569] space-y-1">
                        <div className="hidden sm:flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                          <span className="truncate">{alumni.perusahaan || 'Profesional Independen'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#64748B]">
                          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D97706] shrink-0" />
                          <span className="truncate">{alumni.wilayah}</span>
                        </div>
                      </div>

                      {/* Maksimal 2 Chip Keahlian (1 di layar sangat kecil agar seragam) */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {alumni.keahlian.slice(0, 2).map((skill, idx) => (
                          <span
                            key={idx}
                            className={`bg-[#F3F1EA] text-[#0C2340] text-[11px] sm:text-xs px-2 py-0.5 rounded-md font-medium truncate max-w-full ${
                              idx === 1 ? 'hidden sm:inline-block' : ''
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Aksi Tunggal */}
                    <div className="pt-2.5 sm:pt-4 mt-3 sm:mt-4 border-t border-[#0C2340]/10">
                      <button
                        type="button"
                        onClick={() => setSelectedProfile(alumni)}
                        className="w-full bg-white hover:bg-[#0C2340] hover:text-white text-[#0C2340] border border-[#0C2340]/25 hover:border-[#0C2340] text-xs sm:text-sm font-semibold py-2 px-2.5 sm:px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Lihat Profil</span>
                        <span className="hidden sm:inline">&amp; Kontak</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center pt-7 sm:pt-8">
              <Link
                href="/direktori"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#0C2340] hover:text-[#1D4ED8]"
              >
                <span>Buka seluruh direktori alumni di Jabodetabek</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* 5. MENTORING KARIR: BENTO ASIMETRIS */}
        <section id="mentoring" className="py-12 sm:py-16 border-b border-[#0C2340]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              
              {/* Kolom Kiri: Alur Pendampingan Bento */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                    BIMBINGAN SESAMA ALUMNI
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                    Ngobrol Santai dan Minta Saran ke Alumni Senior
                  </h2>
                  <p className="text-sm sm:text-base text-[#475569] mt-2 leading-relaxed">
                    Baru wisuda atau baru pindah ke Jabodetabek? Jangan sungkan. Ada alumni senior yang siap meluangkan waktu untuk bantu review berkas lamaran atau berbagi tips bekerja di ibu kota.
                  </p>
                </div>

                {/* 3 Langkah Nyata dalam Bento Mini */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3 pt-1">
                  <div className="bg-[#FDFCF7] border border-[#0C2340]/12 rounded-xl p-3.5 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#0C2340] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0C2340]">Pilih topik bahasan</h4>
                      <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 leading-snug">Review CV, persiapan wawancara, atau tanya karier industri.</p>
                    </div>
                  </div>

                  <div className="bg-[#FDFCF7] border border-[#0C2340]/12 rounded-xl p-3.5 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#0C2340] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0C2340]">Kirim pesan singkat</h4>
                      <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 leading-snug">Tuliskan prodi serta pertanyaan yang ingin didiskusikan.</p>
                    </div>
                  </div>

                  <div className="bg-[#FDFCF7] border border-[#0C2340]/12 rounded-xl p-3.5 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#0C2340] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0C2340]">Janjian online atau kopi</h4>
                      <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 leading-snug">Mentor menghubungi via WhatsApp untuk menyepakati jadwal.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#F3F1EA] border border-[#0C2340]/10 rounded-xl text-xs text-[#475569] leading-relaxed">
                  <strong className="text-[#0C2340]">Prinsip gotong royong:</strong> Program ini 100% sukarela dan gratis antaralumni UMS.
                </div>
              </div>

              {/* Kolom Kanan: Kartu Spesifik Mentor */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#64748B]">
                  Alumni yang sedang membuka waktu bimbingan:
                </h3>

                {mentorList.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="border border-[#0C2340]/15 rounded-2xl p-4 sm:p-5 bg-[#FDFCF7] hover:border-[#0C2340] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden shrink-0 border border-[#0C2340]/15 bg-white">
                        <img
                          src={mentor.avatarUrl || '/images/avatar-aditya.jpg'}
                          alt={mentor.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5 sm:space-y-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <h4 className="text-sm sm:text-base font-bold text-[#0C2340]">{mentor.nama}</h4>
                          <span className="text-[11px] sm:text-xs text-[#64748B]">({mentor.prodi} &apos;{String(mentor.angkatan).slice(-2)})</span>
                        </div>
                        <p className="text-xs text-[#0C2340] font-semibold">{mentor.pekerjaan}</p>
                        <p className="text-xs text-[#475569] leading-relaxed">
                          <strong>Fokus bimbingan:</strong> {mentor.id === 'alm-aditya' ? 'Review CV/Portofolio IT & Tips Interview' : mentor.id === 'alm-amalia' ? 'Karier Konsultan Lingkungan & Sertifikasi AMDAL' : 'Konsultasi Legalitas Usaha & Hak Kontrak Kerja'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedMentor(mentor)}
                      className="bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0 w-full sm:w-auto text-center cursor-pointer"
                    >
                      Ajak Ngobrol
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* 6. SECTION REHAT VISUAL: SATU KUTIPAN JUJUR ALUMNI (FULL WIDTH NAVY) */}
        <section className="py-14 sm:py-20 bg-[#0C2340] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] block">
              PENGALAMAN MERANTAU
            </span>

            <blockquote className="text-lg sm:text-2xl md:text-3xl font-medium leading-relaxed text-[#FDFCF7]">
              &ldquo;Waktu pertama kali menginjakkan kaki di Jakarta cuma bawa ijazah dari Kampus Pabelan dan belum punya banyak kenalan. Yang pertama nampung dan ngasih rujukan wawancara ya mas-mas alumni UMS angkatan atas. Di perantauan, rasa sekampus itu beneran kerasa.&rdquo;
            </blockquote>

            <div className="pt-1 sm:pt-2">
              <p className="text-base font-bold text-white">Hendra Setiawan</p>
              <p className="text-xs text-white/75 mt-0.5">Alumni Informatika 2016 · Tinggal di Jakarta Selatan</p>
            </div>
          </div>
        </section>

        {/* 7. SENTRA WILAYAH: BENTO 1 + 8 (ZERO ORPHAN SLOT DI MOBILE) */}
        <section id="wilayah" className="py-12 sm:py-16 border-b border-[#0C2340]/10 bg-[#FDFCF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C2340]/10 pb-4 sm:pb-5 mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                  SEBARAN &amp; SENTRA KUMPUL
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                  Sentra Temu di 9 Wilayah Jabodetabek
                </h2>
                <p className="text-sm sm:text-base text-[#475569] mt-1 max-w-2xl">
                  Temukan perkiraan sebaran alumni dan titik kumpul favorit di sekitar tempat tinggal atau kantormu.
                </p>
              </div>

              <Link
                href="/peta"
                className="text-sm font-semibold text-[#0C2340] hover:text-[#D97706] flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-colors"
              >
                <span>Buka Peta Sebaran Interaktif</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Bento 9 Wilayah: 1 featured col-span-2 + 8 (2x4) di mobile, 3x3 di desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
              {DATA_WILAYAH_SIMULASI.map((reg, idx) => {
                const isLead = idx === 0;
                return (
                  <div
                    key={reg.id}
                    className={`rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between transition-colors shadow-2xs border ${
                      isLead
                        ? 'col-span-2 lg:col-span-1 bg-[#F3F1EA] sm:bg-white border-[#0C2340]/20 hover:border-[#0C2340]'
                        : 'col-span-1 bg-white border-[#0C2340]/15 hover:border-[#0C2340]'
                    }`}
                  >
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                        <h3 className="text-sm sm:text-lg font-bold text-[#0C2340] leading-snug">
                          {reg.nama}
                        </h3>
                        <span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold text-[#475569] bg-white sm:bg-[#F3F1EA] border border-[#0C2340]/10 sm:border-transparent px-2 sm:px-2.5 py-0.5 rounded-md whitespace-nowrap">
                          ~{reg.jumlahAlumni} alumni
                        </span>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-[#475569]">
                        <div>
                          <span className="font-semibold text-[#64748B] block">Titik Kumpul:</span>
                          <p className="font-medium text-[#0C2340] mt-0.5 line-clamp-2 sm:line-clamp-none">
                            {reg.titikKumpul || 'Disepakati per jadwal kopdar'}
                          </p>
                        </div>

                        <div className={isLead ? 'block' : 'hidden sm:block'}>
                          <span className="font-semibold text-[#64748B] block">Agenda Terdekat:</span>
                          <p className="text-[#475569] mt-0.5">
                            {reg.agendaTerdekat || 'Kopdar berkala sesama alumni'}
                          </p>
                        </div>

                        <div className={isLead ? 'block' : 'hidden sm:block'}>
                          <span className="font-semibold text-[#64748B] block">Koordinator:</span>
                          <p className="text-[#475569] mt-0.5">
                            {reg.koordinator || 'Tim Pengurus Wilayah'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#0C2340]/10">
                      <Link
                        href={`/direktori?wilayah=${encodeURIComponent(reg.nama)}`}
                        className={`w-full inline-flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold text-[#0C2340] hover:text-[#1D4ED8] py-2 px-2 rounded-xl transition-colors ${
                          isLead ? 'bg-white sm:bg-[#0C2340]/5 hover:bg-white/90' : 'bg-[#F3F1EA]/70 sm:bg-[#0C2340]/5 hover:bg-[#0C2340]/10'
                        }`}
                      >
                        <span className="sm:hidden">{isLead ? `Lihat Alumni ${reg.nama}` : 'Lihat Alumni'}</span>
                        <span className="hidden sm:inline">Lihat Alumni di {reg.nama}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 8. AJAKAN BERGABUNG: RAMAH, TANPA JARGON BOMBATIS */}
        <section className="py-12 sm:py-16 bg-[#0C2340] text-white border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Belum tercatat di database alumni UMS Jabodetabek?
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
              Cukup luangkan waktu 2 menit untuk mengisi formulir keanggotaan. Datamu dikelola dengan aman oleh pengurus dan hanya digunakan untuk saling menghubungkan sesama keluarga besar UMS di perantauan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href="/gabung"
                className="w-full sm:w-auto bg-[#F59E0B] hover:bg-[#D97706] text-[#0C2340] text-sm sm:text-base font-bold px-6 sm:px-8 py-3.5 rounded-xl transition-colors shadow-sm"
              >
                Daftar ke Direktori Alumni
              </Link>
              <Link
                href="/tentang"
                className="w-full sm:w-auto bg-transparent border border-white/30 hover:border-white text-white text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                Pelajari Tata Kelola Komunitas
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* MODAL PROFIL DETAIL ALUMNI */}
      <Dialog open={!!selectedProfile} onOpenChange={(open) => !open && setSelectedProfile(null)}>
        <DialogContent className="sm:max-w-lg bg-white border border-[#0C2340]/20 p-0 overflow-hidden rounded-xl">
          {selectedProfile && (
            <div>
              <div className="bg-[#0C2340] p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F59E0B] shrink-0 bg-white">
                    <img
                      src={selectedProfile.avatarUrl || '/images/avatar-aditya.jpg'}
                      alt={selectedProfile.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedProfile.nama}
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5">
                      {selectedProfile.prodi} · Angkatan {selectedProfile.angkatan}
                    </p>
                    <p className="text-xs text-[#F59E0B] font-semibold mt-1">
                      {selectedProfile.pekerjaan} {selectedProfile.perusahaan ? `· ${selectedProfile.perusahaan}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-sm text-[#0C2340]">
                <div>
                  <span className="text-xs font-bold text-[#64748B] uppercase block mb-1">Domisili</span>
                  <p className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-[#D97706]" />
                    <span>{selectedProfile.wilayah}</span>
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#64748B] uppercase block mb-1">Sekilas Profil</span>
                  <p className="text-[#475569] leading-relaxed">
                    {selectedProfile.bio}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#64748B] uppercase block mb-2">Bidang Keahlian</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.keahlian.map((skill) => (
                      <span
                        key={skill}
                        className="bg-[#0C2340]/5 text-[#0C2340] text-xs px-2.5 py-1 rounded font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProfile.bersediaMentoring && (
                  <div className="bg-[#FDFCF7] border border-[#16A34A]/30 p-3.5 rounded-lg text-xs text-[#16A34A]">
                    <strong className="block font-semibold">Siap Berbagi Pengalaman</strong>
                    <span>Alumni ini bersedia meluangkan waktu untuk konsultasi karier dan tanya jawab sesama lulusan UMS.</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#F8FAFC] border-t border-[#0C2340]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0C2340]"
                >
                  Tutup
                </button>
                <Link
                  href="/masuk"
                  className="bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Hubungi Rekan Alumni
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL RSVP EVENT */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md bg-white border border-[#0C2340]/20 p-6 rounded-xl">
          {selectedEvent && (
            <div className="space-y-4">
              <DialogHeader>
                <span className="text-xs font-bold text-[#D97706] uppercase">
                  PENDAFTARAN HADIR KEGIATAN
                </span>
                <DialogTitle className="text-xl font-bold text-[#0C2340] text-left pt-1">
                  {selectedEvent.judul}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#64748B] text-left">
                  {selectedEvent.tanggalWIB} · {selectedEvent.jamWIB}
                  <br />
                  {selectedEvent.lokasiSpesifik}
                </DialogDescription>
              </DialogHeader>

              {isRsvpDone ? (
                <div className="bg-[#F0FDF4] border border-[#16A34A]/30 p-6 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto" />
                  <h4 className="font-bold text-base text-[#16A34A]">
                    Pendaftaran Berhasil Diterima!
                  </h4>
                  <p className="text-xs text-[#475569]">
                    Terima kasih, konfirmasi kehadiranmu sudah tercatat. Sampai jumpa di lokasi acara!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0C2340]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                      Program Studi & Angkatan
                    </label>
                    <input
                      type="text"
                      value={rsvpProdi}
                      onChange={(e) => setRsvpProdi(e.target.value)}
                      placeholder="Contoh: Teknik Mesin 2017"
                      className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0C2340]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0C2340]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                    >
                      Konfirmasi Kehadiran
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL AJAK NGOBROL MENTOR */}
      <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
        <DialogContent className="sm:max-w-md bg-white border border-[#0C2340]/20 p-6 rounded-xl">
          {selectedMentor && (
            <div className="space-y-4">
              <DialogHeader>
                <span className="text-xs font-bold text-[#D97706] uppercase">
                  AJAK NGOBROL ALUMNI SENIOR
                </span>
                <DialogTitle className="text-xl font-bold text-[#0C2340] text-left pt-1">
                  Bimbingan bersama {selectedMentor.nama}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#64748B] text-left">
                  {selectedMentor.pekerjaan} · Alumni {selectedMentor.prodi} &apos;{String(selectedMentor.angkatan).slice(-2)}
                </DialogDescription>
              </DialogHeader>

              {isBookingDone ? (
                <div className="bg-[#F0FDF4] border border-[#16A34A]/30 p-6 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto" />
                  <h4 className="font-bold text-base text-[#16A34A]">
                    Permintaan Berhasil Terkirim!
                  </h4>
                  <p className="text-xs text-[#475569]">
                    Mentor akan mengonfirmasi jadwal bimbingan via WhatsApp dalam waktu 1-2 hari.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                      Topik yang Ingin Ditanyakan
                    </label>
                    <select
                      value={mentorTopic}
                      onChange={(e) => setMentorTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0C2340] bg-white"
                    >
                      <option>Review CV & Portofolio</option>
                      <option>Tanya Jawab Dunia Kerja di Jakarta</option>
                      <option>Persiapan Wawancara Kerja</option>
                      <option>Konsultasi Legalitas & Bisnis</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                      Catatan Singkat / Latar Belakangmu
                    </label>
                    <textarea
                      rows={3}
                      value={mentorNote}
                      onChange={(e) => setMentorNote(e.target.value)}
                      placeholder="Ceritakan sedikit tentang dirimu dan apa yang ingin kamu konsultasikan..."
                      className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0C2340]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                    >
                      Kirim Permintaan Ngobrol
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

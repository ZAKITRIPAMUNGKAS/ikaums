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

        {/* 1. HERO SECTION: HANGAT, MANUSIAWI, TIDAK KAKU */}
        <section className="border-b border-[#0C2340]/10 bg-[#FDFCF7] pt-10 pb-16 md:pt-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Kolom Teks */}
              <div className="lg:col-span-7 space-y-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#D97706]">
                  Komunitas Alumni Universitas Muhammadiyah Surakarta · Jabodetabek
                </p>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] text-[#0C2340] leading-[1.15]">
                  Tempat kumpul dan saling bantu sesama alumni UMS di Jabodetabek.
                </h1>

                <p className="text-base sm:text-lg text-[#475569] max-w-2xl leading-relaxed">
                  Biar di perantauan tidak jalan sendirian. Di sini kamu bisa cari teman satu almamater, minta saran dunia kerja dari alumni yang lebih dulu di Jakarta, atau sekadar janjian ngopi bareng di kotamu.
                </p>

                {/* Tombol Aksi Nyata */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#direktori"
                    className="bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-base font-semibold px-6 py-3.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Cari Rekan Alumni</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </a>
                  <a
                    href="#agenda"
                    className="bg-white border border-[#0C2340]/25 hover:border-[#0C2340] text-[#0C2340] text-base font-semibold px-6 py-3.5 rounded-lg transition-colors"
                  >
                    Lihat Agenda Kumpul
                  </a>
                </div>

                {/* Angka & Bukti Komunitas Sederhana */}
                <div className="pt-4 border-t border-[#0C2340]/10 flex flex-wrap items-center gap-6 text-sm text-[#475569]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0C2340]" />
                    <span><strong>1.200+</strong> alumni terhubung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D97706]" />
                    <span>9 sentra kumpul wilayah</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-[#16A34A]" />
                    <span>Mentoring sesama alumni</span>
                  </div>
                </div>
              </div>

              {/* Kolom Visual: Foto Nyata Kopdar Alumni */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-[#0C2340]/15 bg-white shadow-md">
                  <div className="aspect-[4/3] w-full bg-[#E2E8F0] relative">
                    <img
                      src="/images/event-kopdar.jpg"
                      alt="Suasana temu alumni UMS di Jakarta"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-white border-t border-[#0C2340]/10 flex items-center justify-between text-xs text-[#475569]">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-[#D97706]" />
                      <span className="font-medium text-[#0C2340]">Kopdar Santai Alumni UMS · Museum Mandiri Kota Tua</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0C2340] bg-[#0C2340]/5 px-2 py-0.5 rounded">
                      Dokumentasi Temu Alumni
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. SECTION FULL-BLEED: FOTO BESAR TEMU AKBAR "KUMPUL BOLO PISAH" */}
        <section className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] bg-[#0C2340] overflow-hidden">
          <img
            src="/images/hero-kumpul-bolo-pisah.jpg"
            alt="Silaturahmi Akbar Kumpul Bolo Pisah Alumni UMS se-Jabodetabek"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340] via-[#0C2340]/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-12 text-white">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block bg-[#F59E0B] text-[#0C2340] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm mb-3">
                Kumpul Bolo Pisah UMS Jabodetabek
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
                Dari Kampus Pabelan dan Gonilan sampai ke sudut-sudut ibu kota.
              </h2>
              <p className="text-sm sm:text-base text-white/90 max-w-2xl mt-2 leading-relaxed">
                Pertemuan silaturahmi akbar lintas angkatan dan fakultas. Bertemu kawan lama masa kuliah, berkenalan dengan senior dan adik tingkat, serta saling membuka jalan rujukan karier di Jabodetabek.
              </p>
            </div>
          </div>
        </section>

        {/* 3. AGENDA KEGIATAN MENDATANG: FORMAT BARIS JADWAL (BUKAN KARTU 3-KOLOM GENERIK) */}
        <section id="agenda" className="py-16 border-b border-[#0C2340]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C2340]/10 pb-5 mb-8 gap-4">
              <div>
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                  AGENDA KOMUNITAS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                  Kegiatan dan Tempat Kumpul Terdekat
                </h2>
                <p className="text-base text-[#475569] mt-1 max-w-xl">
                  Datang dan gabung langsung. Semua kegiatan terbuka untuk seluruh alumni UMS tanpa memandang angkatan atau jurusan.
                </p>
              </div>

              <Link
                href="/kegiatan"
                className="text-sm font-semibold text-[#0C2340] hover:text-[#1D4ED8] flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Lihat semua jadwal agenda</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* List Row Kegiatan */}
            <div className="space-y-4">
              {DATA_KEGIATAN_SIMULASI.map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-[#0C2340]/15 rounded-xl p-5 sm:p-6 bg-[#FDFCF7] hover:border-[#0C2340] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start sm:items-center gap-5">
                    {/* Kotak Tanggal Tegas */}
                    <div className="w-16 h-18 sm:w-20 sm:h-20 bg-[#0C2340] text-white rounded-lg flex flex-col items-center justify-center shrink-0 p-2 text-center shadow-xs">
                      <span className="text-xl sm:text-2xl font-extrabold leading-none">
                        {idx === 0 ? '28' : idx === 1 ? '06' : '19'}
                      </span>
                      <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider mt-1">
                        {idx === 0 ? 'NOV 2026' : 'DES 2026'}
                      </span>
                    </div>

                    {/* Rincian Kegiatan */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold bg-[#0C2340]/8 text-[#0C2340] px-2.5 py-0.5 rounded">
                          {item.jenis}
                        </span>
                        <span className="text-xs text-[#64748B] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.jamWIB}</span>
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[#0C2340]">
                        {item.judul}
                      </h3>

                      <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">
                        {item.deskripsi}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-[#64748B] pt-1">
                        <MapPin className="w-4 h-4 text-[#D97706] shrink-0" />
                        <span className="font-medium text-[#0C2340]">{item.lokasiSpesifik || item.wilayah}</span>
                      </div>
                    </div>
                  </div>

                  {/* Kuota & Aksi */}
                  <div className="lg:text-right shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#0C2340]/10">
                    <div className="text-xs text-[#475569]">
                      <span className="font-semibold text-[#0C2340]">{item.terdaftarCount} terdaftar</span> dari kuota {item.kapasitas} orang
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(item)}
                      className="bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
                    >
                      Daftar Hadir (RSVP)
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. DIREKTORI ALUMNI: MAKSIMAL 2 CHIP, SATU AKSI TUNGGAL */}
        <section id="direktori" className="py-16 border-b border-[#0C2340]/10 bg-[#FDFCF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="border-b border-[#0C2340]/10 pb-5 mb-8">
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                DIREKTORI PERANTAUAN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                Temukan Rekan Alumni Berdasarkan Bidang
              </h2>
              <p className="text-base text-[#475569] mt-1 max-w-2xl">
                Cari rekan satu jurusan atau alumni UMS yang bekerja di industri yang sedang kamu minati di wilayah Jabodetabek.
              </p>
            </div>

            {/* Toolbar Pencarian & Filter Bidang */}
            <div className="space-y-4 mb-8">
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, jurusan, atau bidang pekerjaan..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#0C2340]/20 rounded-lg text-base text-[#0C2340] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0C2340] focus:border-[#0C2340]"
                />
              </div>

              {/* Filter Tabs Sederhana */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {DOMAIN_FILTERS.map((tab) => {
                  const isActive = selectedDomain === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedDomain(tab.id)}
                      className={`text-sm px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
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

            {/* Grid Alumni: Bersih, Maksimal 2 Chip per Kartu */}
            {filteredAlumni.length === 0 ? (
              <div className="bg-white border border-dashed border-[#0C2340]/20 rounded-xl p-10 text-center">
                <p className="text-base font-semibold text-[#0C2340]">
                  Belum ada alumni yang cocok dengan pencarian &quot;{searchQuery}&quot;.
                </p>
                <p className="text-sm text-[#64748B] mt-1">
                  Coba pilih tab &quot;Semua Bidang&quot; atau ketik kata kunci yang lebih umum.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.slice(0, 6).map((alumni) => (
                  <div
                    key={alumni.id}
                    className="bg-white border border-[#0C2340]/15 rounded-xl p-5 flex flex-col justify-between hover:border-[#0C2340] transition-colors shadow-2xs"
                  >
                    <div className="space-y-3.5">
                      {/* Avatar & Data Pokok */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#0C2340]/10 bg-[#E2E8F0]">
                          {alumni.avatarUrl ? (
                            <img
                              src={alumni.avatarUrl}
                              alt={alumni.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-sm">
                              {alumni.avatarInitials}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-[#0C2340] truncate">
                            {alumni.nama}
                          </h3>
                          <p className="text-xs text-[#64748B]">
                            {alumni.prodi} · Angkatan {alumni.angkatan}
                          </p>
                          <p className="text-sm font-medium text-[#0C2340] mt-0.5 truncate">
                            {alumni.pekerjaan}
                          </p>
                        </div>
                      </div>

                      {/* Lokasi & Perusahaan Singkat */}
                      <div className="text-xs text-[#475569] space-y-1 pt-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                          <span className="truncate">{alumni.perusahaan || 'Profesional Independen'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#64748B]">
                          <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                          <span>Domisili: {alumni.wilayah}</span>
                        </div>
                      </div>

                      {/* Maksimal 2 Chip Keahlian */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {alumni.keahlian.slice(0, 2).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-[#0C2340]/5 text-[#0C2340] text-xs px-2.5 py-0.5 rounded font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Satu Tombol Aksi Tunggal */}
                    <div className="pt-4 mt-4 border-t border-[#0C2340]/10">
                      <button
                        type="button"
                        onClick={() => setSelectedProfile(alumni)}
                        className="w-full bg-white hover:bg-[#0C2340] hover:text-white text-[#0C2340] border border-[#0C2340]/25 hover:border-[#0C2340] text-sm font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Lihat Profil & Kontak</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center pt-8">
              <Link
                href="/direktori"
                className="inline-flex items-center gap-2 text-base font-semibold text-[#0C2340] hover:text-[#1D4ED8]"
              >
                <span>Buka seluruh direktori alumni di Jabodetabek</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* 5. MENTORING KARIR: LAYOUT ASIMETRIS (BUKAN PENGULANGAN DIREKTORI) */}
        <section id="mentoring" className="py-16 border-b border-[#0C2340]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              
              {/* Kolom Kiri (Asimetris 40%): Alur Pendampingan Hangat */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                    BIMBINGAN SESAMA ALUMNI
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                    Ngobrol Santai dan Minta Saran ke Alumni Senior
                  </h2>
                  <p className="text-base text-[#475569] mt-2 leading-relaxed">
                    Baru wisuda atau baru pindah ke Jabodetabek? Jangan sungkan. Ada alumni senior yang siap meluangkan waktu untuk bantu review berkas lamaran atau sekadar berbagi tips bertahan hidup di ibu kota.
                  </p>
                </div>

                {/* 3 Langkah Nyata */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#0C2340] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0C2340]">Pilih topik yang sedang kamu butuhkan</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">Review CV/portofolio, persiapan interview kerja, atau tanya jalur karier industri.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#0C2340] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0C2340]">Kirim permintaan bimbingan singkat</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">Tuliskan latar belakang prodi dan apa yang ingin kamu tanyakan ke mentor.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#0C2340] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0C2340]">Janjian sesi online atau ngopi bareng</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">Mentor akan menghubungi via kontak WhatsApp untuk menyepakati waktu luang.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FDFCF7] border border-[#0C2340]/15 rounded-lg text-xs text-[#475569] leading-relaxed">
                  <strong className="text-[#0C2340]">Prinsip gotong royong:</strong> Program ini 100% sukarela dan gratis. Tidak ada pungutan biaya apa pun antaralumni UMS.
                </div>
              </div>

              {/* Kolom Kanan (Asimetris 60%): Kartu Spesifik Mentor */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Alumni yang sedang membuka waktu bimbingan:
                </h3>

                {mentorList.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="border border-[#0C2340]/15 rounded-xl p-5 bg-[#FDFCF7] hover:border-[#0C2340] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-13 h-13 rounded-full overflow-hidden shrink-0 border border-[#0C2340]/15 bg-white">
                        <img
                          src={mentor.avatarUrl || '/images/avatar-aditya.jpg'}
                          alt={mentor.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-[#0C2340]">{mentor.nama}</h4>
                          <span className="text-xs text-[#64748B]">({mentor.prodi} &apos;{String(mentor.angkatan).slice(-2)})</span>
                        </div>
                        <p className="text-xs text-[#0C2340] font-semibold">{mentor.pekerjaan}</p>
                        <p className="text-xs text-[#475569]">
                          <strong>Fokus bimbingan:</strong> {mentor.id === 'alm-aditya' ? 'Review CV/Portofolio IT & Tips Interview' : mentor.id === 'alm-amalia' ? 'Karier Konsultan Lingkungan & Sertifikasi AMDAL' : 'Konsultasi Legalitas Usaha & Hak Kontrak Kerja'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedMentor(mentor)}
                      className="bg-[#0C2340] hover:bg-[#1E3A8A] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0 w-full sm:w-auto text-center"
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
        <section className="py-20 bg-[#0C2340] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] block">
              PENGALAMAN MERANTAU
            </span>

            <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed text-[#FDFCF7]">
              &ldquo;Waktu pertama kali menginjakkan kaki di Jakarta cuma bawa ijazah dari Kampus Pabelan dan belum punya banyak kenalan. Yang pertama nampung dan ngasih rujukan wawancara ya mas-mas alumni UMS angkatan atas. Di perantauan, rasa sekampus itu beneran kerasa.&rdquo;
            </blockquote>

            <div className="pt-2">
              <p className="text-base font-bold text-white">Hendra Setiawan</p>
              <p className="text-xs text-white/75 mt-0.5">Alumni Informatika 2016 · Tinggal di Jakarta Selatan</p>
            </div>
          </div>
        </section>

        {/* 7. SENTRA WILAYAH: MENGGANTIKAN PETA SKEMATIK DENGAN DAFTAR KONKRET 9 KOTA */}
        <section id="wilayah" className="py-16 border-b border-[#0C2340]/10 bg-[#FDFCF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#0C2340]/10 pb-5 mb-8 gap-4">
              <div>
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                  SEBARAN & SENTRA KUMPUL
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
                  Sentra Temu di 9 Wilayah Jabodetabek
                </h2>
                <p className="text-base text-[#475569] mt-1 max-w-2xl">
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

            {/* Grid 9 Wilayah Administratif Nyata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DATA_WILAYAH_SIMULASI.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-white border border-[#0C2340]/15 rounded-xl p-5 flex flex-col justify-between hover:border-[#0C2340] transition-colors shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#0C2340]">{reg.nama}</h3>
                      <span className="text-xs font-semibold text-[#475569] bg-[#F3F1EA] px-2.5 py-0.5 rounded">
                        ~{reg.jumlahAlumni} alumni
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-[#475569] pt-1">
                      <div>
                        <span className="text-[11px] font-semibold text-[#64748B] block">Titik Kumpul Favorit:</span>
                        <p className="font-medium text-[#0C2340] mt-0.5">{reg.titikKumpul || 'Disepakati per jadwal kopdar'}</p>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-[#64748B] block">Kegiatan Terdekat:</span>
                        <p className="text-[#475569] mt-0.5">{reg.agendaTerdekat || 'Kopdar berkala sesama alumni'}</p>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-[#64748B] block">Koordinator Wilayah:</span>
                        <p className="text-[#475569] mt-0.5">{reg.koordinator || 'Tim Pengurus Wilayah'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#0C2340]/10">
                    <Link
                      href={`/direktori?wilayah=${encodeURIComponent(reg.nama)}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#0C2340] hover:text-[#1D4ED8] bg-[#0C2340]/5 hover:bg-[#0C2340]/10 py-2 rounded-lg transition-colors"
                    >
                      <span>Lihat Alumni di {reg.nama}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 8. AJAKAN BERGABUNG: RAMAH, TANPA JARGON BOMBATIS */}
        <section className="py-16 bg-[#0C2340] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Belum tercatat di database alumni UMS Jabodetabek?
            </h2>
            <p className="text-base text-white/80 max-w-xl mx-auto leading-relaxed">
              Cukup luangkan waktu 2 menit untuk mengisi formulir keanggotaan. Datamu dikelola dengan aman oleh pengurus dan hanya digunakan untuk saling menghubungkan sesama keluarga besar UMS di perantauan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/gabung"
                className="w-full sm:w-auto bg-[#F59E0B] hover:bg-[#D97706] text-[#0C2340] text-base font-bold px-8 py-3.5 rounded-lg transition-colors shadow-sm"
              >
                Daftar ke Direktori Alumni
              </Link>
              <Link
                href="/tentang"
                className="w-full sm:w-auto bg-transparent border border-white/30 hover:border-white text-white text-base font-semibold px-6 py-3.5 rounded-lg transition-colors"
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

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { PatternSection } from '@/components/PatternSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getAlumniList } from '@/data/simulasi';
import {
  ANGKATAN_OPTIONS,
  FAKULTAS_PRODI_UMS,
  WILAYAH_JABODETABEK,
  normalizeIndonesianWhatsApp,
} from '@/data/ums-prodi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { AlumniProfile } from '@/types';
import {
  type LokerItem,
} from '@/data/loker';
import {
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  Briefcase,
  Loader2,
  Search,
  Building2,
  Clock,
  Send,
  Plus,
  ExternalLink,
  Copy,
  Check,
  UserCheck,
  Filter,
} from 'lucide-react';

interface MentorFieldErrors {
  nama?: string;
  whatsapp?: string;
  mentorContactConsent?: string;
  form?: string;
}

interface LokerFormErrors {
  posisi?: string;
  perusahaan?: string;
  wilayah?: string;
  kontakLamar?: string;
  deskripsi?: string;
  kualifikasi?: string;
  alumniRujukan?: string;
  form?: string;
}

export default function PeluangPage() {
  const mentors = useMemo(
    () => getAlumniList().filter((a) => a.bersediaMentoring).slice(0, 4),
    []
  );

  // 1. Mentoring State
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);
  const [requestForm, setRequestForm] = useState({
    nama: '',
    prodi: '',
    angkatan: '',
    whatsapp: '',
    topik: 'Ulas CV & Portofolio',
    catatan: '',
    mentorContactConsent: false,
    website: '', // honeypot anti-spam
  });
  const [fieldErrors, setFieldErrors] = useState<MentorFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  // 2. Info Loker State
  const [lokerList, setLokerList] = useState<LokerItem[]>([]);
  const [lokerSearch, setLokerSearch] = useState('');
  const [filterWilayah, setFilterWilayah] = useState('semua');
  const [filterIndustri, setFilterIndustri] = useState('semua');
  const [filterSistem, setFilterSistem] = useState('semua');

  // Modal Detail Loker
  const [detailLokerOpen, setDetailLokerOpen] = useState(false);
  const [selectedLoker, setSelectedLoker] = useState<LokerItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Modal Bagikan Info Loker
  const [shareLokerOpen, setShareLokerOpen] = useState(false);
  const [shareSubmitting, setShareSubmitting] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  const [lokerFormErrors, setLokerFormErrors] = useState<LokerFormErrors>({});
  const [lokerForm, setLokerForm] = useState<{
    posisi: string;
    perusahaan: string;
    industri: string;
    wilayah: string;
    tipeKerja: LokerItem['tipeKerja'];
    sistemKerja: LokerItem['sistemKerja'];
    gajiPerkiraan: string;
    alumniRujukan: string;
    kualifikasi: string;
    deskripsi: string;
    kontakLamar: string;
    linkLamar: string;
    website: string;
  }>({
    posisi: '',
    perusahaan: '',
    industri: 'Teknologi Informasi & Software',
    wilayah: 'Jakarta Selatan',
    tipeKerja: 'Penuh Waktu',
    sistemKerja: 'Hybrid',
    gajiPerkiraan: '',
    alumniRujukan: '',
    kualifikasi: '',
    deskripsi: '',
    kontakLamar: '',
    linkLamar: '',
    website: '', // honeypot
  });

  // Muat data loker dari CMS/Supabase jika ada
  useEffect(() => {
    let isSubscribed = true;
    const fetchLokers = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) return;
        const data = await res.json();
        if (isSubscribed && data && Array.isArray(data.lokers)) {
          setLokerList(data.lokers);
        }
      } catch {
        // Fallback default kosong
      }
    };
    void fetchLokers();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Mentoring Handlers
  const clearMentorError = (field: keyof MentorFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field] && !prev.form) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  };

  const handleOpenBooking = (mentor: AlumniProfile | null) => {
    setSelectedMentor(mentor);
    setFieldErrors({});
    setIsSubmitting(false);
    setBookingDone(false);
    setMentorModalOpen(true);
  };

  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (requestForm.website.trim().length > 0) {
      setFieldErrors({
        form: 'Permintaan tidak dapat diproses. Silakan muat ulang halaman lalu coba lagi.',
      });
      return;
    }

    const errors: MentorFieldErrors = {};
    if (requestForm.nama.trim().length < 3) {
      errors.nama = 'Tuliskan nama lengkapmu minimal 3 huruf.';
    }
    const validWa = normalizeIndonesianWhatsApp(requestForm.whatsapp);
    if (!validWa) {
      errors.whatsapp = 'Masukkan nomor WhatsApp Indonesia yang valid (misalnya 081234567890).';
    }
    if (!requestForm.mentorContactConsent) {
      errors.mentorContactConsent =
        'Centang izin penerusan nomor WhatsApp agar pengurus dapat menghubungkanmu dengan mentor.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstId = errors.nama
        ? 'mentor-req-nama'
        : errors.whatsapp
        ? 'mentor-req-wa'
        : 'mentor-req-consent';
      setTimeout(() => document.getElementById(firstId)?.focus(), 0);
      return;
    }

    setIsSubmitting(true);
    setRequestForm((prev) => ({ ...prev, whatsapp: validWa! }));
    setFieldErrors({});
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingDone(true);
    }, 180);
  };

  // Loker Filter Logic
  const filteredLokers = useMemo(() => {
    return lokerList.filter((item) => {
      if (filterWilayah !== 'semua' && item.wilayah !== filterWilayah) return false;
      if (filterIndustri !== 'semua' && item.industri !== filterIndustri) return false;
      if (filterSistem !== 'semua' && item.sistemKerja !== filterSistem) return false;

      if (lokerSearch.trim()) {
        const q = lokerSearch.toLowerCase();
        const matchPosisi = item.posisi.toLowerCase().includes(q);
        const matchPerusahaan = item.perusahaan.toLowerCase().includes(q);
        const matchWilayah = item.wilayah.toLowerCase().includes(q);
        const matchIndustri = item.industri.toLowerCase().includes(q);
        const matchDeskripsi = item.deskripsi.toLowerCase().includes(q);
        const matchKualifikasi = item.kualifikasi.some((k) => k.toLowerCase().includes(q));
        const matchAlumni = item.alumniRujukan?.toLowerCase().includes(q);
        return (
          matchPosisi ||
          matchPerusahaan ||
          matchWilayah ||
          matchIndustri ||
          matchDeskripsi ||
          matchKualifikasi ||
          matchAlumni
        );
      }
      return true;
    });
  }, [lokerList, lokerSearch, filterWilayah, filterIndustri, filterSistem]);

  // Daftar Industri Unik dari Data
  const industryOptions = useMemo(() => {
    const set = new Set<string>();
    lokerList.forEach((item) => set.add(item.industri));
    return Array.from(set);
  }, [lokerList]);

  // Handle Detail Loker
  const handleOpenDetailLoker = (loker: LokerItem) => {
    setSelectedLoker(loker);
    setIsCopied(false);
    setDetailLokerOpen(true);
  };

  const handleCopyContact = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Handle Share Loker Submit
  const handleShareLokerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shareSubmitting) return;

    if (lokerForm.website.trim().length > 0) {
      return;
    }

    const errors: LokerFormErrors = {};
    if (lokerForm.posisi.trim().length < 3) {
      errors.posisi = 'Tuliskan nama posisi pekerjaan.';
    }
    if (lokerForm.perusahaan.trim().length < 2) {
      errors.perusahaan = 'Tuliskan nama perusahaan atau tempat kerja.';
    }
    if (!lokerForm.kontakLamar.trim()) {
      errors.kontakLamar = 'Sertakan email atau kontak resmi untuk mengirim lamaran.';
    }
    if (lokerForm.deskripsi.trim().length < 20) {
      errors.deskripsi = 'Tuliskan deskripsi pekerjaan minimal 20 karakter.';
    }
    if (lokerForm.kualifikasi.trim().length < 10) {
      errors.kualifikasi = 'Tuliskan minimal beberapa poin kualifikasi (pisahkan per baris).';
    }
    if (lokerForm.alumniRujukan.trim().length < 3) {
      errors.alumniRujukan = 'Tuliskan nama & jurusan/angkatanmu sebagai alumni perujuk info ini.';
    }

    if (Object.keys(errors).length > 0) {
      setLokerFormErrors(errors);
      return;
    }

    setShareSubmitting(true);
    setLokerFormErrors({});

    const kualifikasiArray = lokerForm.kualifikasi
      .split('\n')
      .map((k) => k.replace(/^[•\-\s]+/, '').trim())
      .filter(Boolean);

    const newLokerItem: Omit<LokerItem, 'id' | 'createdAt'> = {
      posisi: lokerForm.posisi.trim(),
      perusahaan: lokerForm.perusahaan.trim(),
      industri: lokerForm.industri,
      wilayah: lokerForm.wilayah,
      tipeKerja: lokerForm.tipeKerja,
      sistemKerja: lokerForm.sistemKerja,
      gajiPerkiraan: lokerForm.gajiPerkiraan.trim() || undefined,
      alumniRujukan: lokerForm.alumniRujukan.trim() || undefined,
      kualifikasi: kualifikasiArray.length > 0 ? kualifikasiArray : ['Kualifikasi relevan dari alumni'],
      deskripsi: lokerForm.deskripsi.trim(),
      kontakLamar: lokerForm.kontakLamar.trim(),
      linkLamar: lokerForm.linkLamar.trim() || undefined,
      status: 'Aktif',
    };

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'loker', data: newLokerItem }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.item) {
          setLokerList((prev) => [json.item, ...prev]);
        }
      } else {
        // Fallback optimis jika API butuh login pengurus: masukkan ke list lokal
        const fallbackItem: LokerItem = {
          ...newLokerItem,
          id: `loker-local-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setLokerList((prev) => [fallbackItem, ...prev]);
      }
      setShareDone(true);
    } catch {
      const fallbackItem: LokerItem = {
        ...newLokerItem,
        id: `loker-local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setLokerList((prev) => [fallbackItem, ...prev]);
      setShareDone(true);
    } finally {
      setShareSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full">
        <PatternSection
          as="section"
          variant="dots"
          tone="tint"
          fade="right-focus"
          patternOpacity={0.055}
          patternSize="24px"
          className="border-b border-slate-200"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-8 md:pb-10"
        >
          <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-2 text-xs text-[#475569] mb-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
                Beranda
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#0C2340] font-semibold">Mentoring &amp; Kerja</span>
            </div>
            {IS_DEMO_MODE && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] font-semibold">
                {DEMO_BADGE_LABEL}
              </span>
            )}
          </nav>

          <header className="space-y-2.5">
            <span className="inline-block text-sm font-semibold text-[#92400E]">
              Pengembangan Karier &amp; Jejaring Bisnis Alumni
            </span>
            <h1 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-extrabold tracking-[-0.02em] text-[#0C2340]">
              Mentoring Alumni serta Info Kerja &amp; Usaha
            </h1>
            <p className="text-base text-[#475569] max-w-[48ch] sm:max-w-3xl leading-[1.6]">
              Ruang bersama untuk mencocokkan kebutuhan bimbingan karier lulusan baru dengan praktisi
              alumni senior UMS, serta pusat berbagi informasi lowongan kerja, kemitraan proyek, dan peluang usaha terpercaya se-Jabodetabek.
            </p>
          </header>
        </PatternSection>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full space-y-16 relative z-[1]">
          {/* ========================================================================= */}
          {/* Bagian 1: Mentoring Alumni                                                */}
          {/* ========================================================================= */}
          <section id="mentoring" aria-labelledby="heading-mentoring" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-[#92400E]" />
                  <span>Program Bimbingan Karier</span>
                </div>
                <h2 id="heading-mentoring" className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  Mentoring Alumni
                </h2>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Sesi bimbingan 1-on-1 bersama kakak tingkat untuk bedah CV, persiapan wawancara kerja,
                  atau konsultasi arah karier di industri Jabodetabek.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenBooking(null)}
                  className="inline-flex items-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] text-white text-base font-semibold transition-all duration-150 cursor-pointer shadow-xs"
                >
                  Cari Mentor
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </button>
                <Link
                  href="/gabung?mentor=ya"
                  className="inline-flex items-center min-h-[48px] px-5 py-3 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-[#0C2340] text-base font-semibold transition-colors"
                >
                  Daftar Jadi Mentor
                </Link>
              </div>
            </div>

            {!IS_DEMO_MODE ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#92400E]">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Pencocokan Mentor Prapeluncuran</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0C2340]">
                    Daftar Mentor Sedang Dihimpun dari Pendaftar Awal
                  </h3>
                  <p className="text-base text-[#475569] leading-[1.6]">
                    Untuk menjaga privasi nama dan tempat kerja alumni, profil mentor baru ditampilkan
                    setelah pendaftar memverifikasi data dan menyetujui pencantuman dirinya. Sementara
                    itu, kamu tetap bisa mengirim permintaan butuh mentor melalui tombol Cari Mentor di
                    atas agar pengurus membantu mencocokkan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenBooking(null)}
                  className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 rounded-lg bg-slate-100 hover:bg-[#E7E3D7] text-[#0C2340] text-base font-semibold transition-colors shrink-0 cursor-pointer"
                >
                  Ajukan Topik Mentoring
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mentors.map((m) => (
                  <article
                    key={m.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xs hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 relative shrink-0">
                          {m.avatarUrl ? (
                            <Image
                              src={m.avatarUrl}
                              alt={`Foto ${m.nama}`}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-sm">
                              {m.avatarInitials}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-[#0C2340] truncate">{m.nama}</h3>
                          <span className="block text-sm text-[#475569] truncate">
                            {m.prodi} &apos;{String(m.angkatan).slice(-2)}
                          </span>
                        </div>
                      </div>
                      <p className="text-base font-semibold text-[#0C2340] leading-[1.5]">
                        {m.mentoringFokus || m.pekerjaan}
                      </p>
                      <span className="text-sm text-[#475569] flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#92400E] shrink-0" />
                        {m.wilayah}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(m)}
                      className="w-full min-h-[44px] rounded-lg bg-slate-100 hover:bg-[#0C2340] text-[#0C2340] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Ajukan Sesi ({DEMO_BADGE_LABEL})
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ========================================================================= */}
          {/* Bagian 2: Info Kerja & Peluang Karier Alumni                              */}
          {/* ========================================================================= */}
          <section id="loker" aria-labelledby="heading-info-kerja" className="pt-10 border-t border-slate-200 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-[#92400E]" />
                  <span>Portal Lowongan &amp; Kemitraan Alumni</span>
                </div>
                <h2 id="heading-info-kerja" className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
                  Info Lowongan Kerja &amp; Peluang Bisnis
                </h2>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Papan lowongan kerja terkurasi dari kantor dan usaha sesama alumni UMS di wilayah Jabodetabek. Membuka jalur rekomendasi internal dan kolaborasi profesional.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShareDone(false);
                    setLokerFormErrors({});
                    setShareLokerOpen(true);
                  }}
                  className="inline-flex items-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-base font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-[#F59E0B]" />
                  <span>Bagikan Info Loker</span>
                </button>
                <Link
                  href="/kepengurusan"
                  className="inline-flex items-center min-h-[48px] px-5 py-3 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-[#0C2340] text-base font-semibold transition-colors"
                >
                  Kontak Pengurus
                </Link>
              </div>
            </div>

            {/* Filter Bar & Pencarian Lowongan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
                {/* Kolom Pencarian */}
                <div className="md:col-span-5 relative">
                  <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={lokerSearch}
                    onChange={(e) => setLokerSearch(e.target.value)}
                    placeholder="Cari posisi, perusahaan, atau keahlian..."
                    className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] placeholder:text-[#475569]/70 focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/15"
                  />
                </div>

                {/* Filter Wilayah */}
                <div className="md:col-span-3">
                  <select
                    value={filterWilayah}
                    onChange={(e) => setFilterWilayah(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 cursor-pointer font-medium"
                  >
                    <option value="semua">Semua Wilayah Jabodetabek</option>
                    {WILAYAH_JABODETABEK.map((w) => (
                      <option key={w.id} value={w.nama}>
                        {w.nama}
                      </option>
                    ))}
                    <option value="Jabodetabek / Remote">Jabodetabek / Remote</option>
                  </select>
                </div>

                {/* Filter Industri */}
                <div className="md:col-span-4">
                  <select
                    value={filterIndustri}
                    onChange={(e) => setFilterIndustri(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 cursor-pointer font-medium"
                  >
                    <option value="semua">Semua Bidang Industri</option>
                    {industryOptions.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pill Filter Sistem Kerja */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[#475569] mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    Sistem:
                  </span>
                  {(['semua', 'Hybrid', 'On-site', 'Remote'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFilterSistem(mode)}
                      className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        filterSistem === mode
                          ? 'bg-[#0C2340] text-white shadow-xs'
                          : 'bg-slate-100 text-[#475569] hover:bg-[#E7E3D7] hover:text-[#0C2340]'
                      }`}
                    >
                      {mode === 'semua' ? 'Semua Sistem' : mode}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-[#475569] font-medium">
                  Menampilkan <strong>{filteredLokers.length}</strong> dari {lokerList.length} info lowongan aktif
                </div>
              </div>
            </div>

            {/* Grid Kartu Lowongan Kerja */}
            {filteredLokers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-12 text-center space-y-4">
                <Briefcase className="w-12 h-12 text-[#475569]/50 mx-auto" />
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-[#0C2340]">Tidak Ada Lowongan yang Cocok</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Tidak ditemukan info kerja untuk kriteria pencarian saat ini. Kamu dapat mereset filter atau menjadi alumni pertama yang membagikan info lowongan baru.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLokerSearch('');
                      setFilterWilayah('semua');
                      setFilterIndustri('semua');
                      setFilterSistem('semua');
                    }}
                    className="min-h-[42px] px-4 py-2 rounded-lg bg-slate-100 hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Reset Filter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShareDone(false);
                      setLokerFormErrors({});
                      setShareLokerOpen(true);
                    }}
                    className="min-h-[42px] px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#08182E] transition-colors cursor-pointer"
                  >
                    + Bagikan Lowongan Baru
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLokers.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group"
                  >
                    <div className="space-y-3.5">
                      {/* Badge Atas */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Clock className="w-3 h-3" />
                          {item.tipeKerja}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.sistemKerja === 'Remote'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : item.sistemKerja === 'Hybrid'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.sistemKerja}
                        </span>
                      </div>

                      {/* Judul Posisi & Perusahaan */}
                      <div>
                        <h3 className="text-lg font-bold text-[#0C2340] group-hover:text-[#92400E] transition-colors line-clamp-2">
                          {item.posisi}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#475569] mt-1">
                          <Building2 className="w-4 h-4 text-[#92400E] shrink-0" />
                          <span className="truncate">{item.perusahaan}</span>
                        </div>
                      </div>

                      {/* Lokasi & Industri */}
                      <div className="space-y-1 text-xs text-[#475569] pt-1 border-t border-[#0C2340]/8">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#92400E] shrink-0" />
                          <span>{item.wilayah}</span>
                        </div>
                        <div className="text-[11px] text-[#475569]/80 truncate">
                          Bidang: {item.industri}
                        </div>
                      </div>

                      {/* Rujukan Alumni UMS */}
                      {item.alumniRujukan && (
                        <div className="bg-slate-100/80 rounded-lg p-2.5 flex items-start gap-2 border border-[#0C2340]/8">
                          <UserCheck className="w-4 h-4 text-[#0C2340] shrink-0 mt-0.5" />
                          <div className="min-w-0 text-xs">
                            <span className="font-semibold text-[#0C2340] block">Rujukan Alumni UMS:</span>
                            <span className="text-[#475569] truncate block">{item.alumniRujukan}</span>
                          </div>
                        </div>
                      )}

                      {/* Cuplikan Kualifikasi */}
                      <div className="space-y-1 pt-1">
                        <span className="text-xs font-semibold text-[#0C2340]">Kualifikasi Kunci:</span>
                        <ul className="text-xs text-[#475569] space-y-1 list-disc list-inside">
                          {item.kualifikasi.slice(0, 3).map((kual, idx) => (
                            <li key={idx} className="line-clamp-1">
                              {kual}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Tombol Aksi Bawah */}
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                      {item.gajiPerkiraan ? (
                        <div className="text-xs text-[#0C2340] font-bold">
                          {item.gajiPerkiraan}
                        </div>
                      ) : (
                        <span className="text-xs text-[#475569]">Kompetitif</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenDetailLoker(item)}
                        className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* DIALOG 1: AJUKAN MENTORING                                                */}
      {/* ========================================================================= */}
      <Dialog open={mentorModalOpen} onOpenChange={setMentorModalOpen}>
        <DialogContent className="bg-white border border-slate-200 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0C2340]">
              {selectedMentor ? `Ajukan Mentoring ke ${selectedMentor.nama}` : 'Cari Mentor Alumni UMS'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#475569]">
              {selectedMentor
                ? `Fokus: ${selectedMentor.mentoringFokus || selectedMentor.pekerjaan} (${DEMO_BADGE_LABEL})`
                : 'Isikan data singkat di bawah agar pengurus membantu mencocokkanmu dengan mentor di bidang terkait.'}
            </DialogDescription>
          </DialogHeader>

          {!bookingDone ? (
            <form onSubmit={handleMentorSubmit} className="space-y-4 mt-2" noValidate>
              {/* Honeypot anti-spam */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="mentor-req-website">Kosongkan kolom ini</label>
                <input
                  id="mentor-req-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={requestForm.website}
                  onChange={(e) => setRequestForm({ ...requestForm, website: e.target.value })}
                />
              </div>

              {fieldErrors.form && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{fieldErrors.form}</span>
                </div>
              )}

              <div>
                <label htmlFor="mentor-req-nama" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Nama Lengkap <span className="text-[#92400E]">*</span>
                </label>
                <input
                  id="mentor-req-nama"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={fieldErrors.nama ? 'true' : undefined}
                  aria-describedby={fieldErrors.nama ? 'err-mentor-nama' : undefined}
                  placeholder="Nama lengkap kamu"
                  value={requestForm.nama}
                  onChange={(e) => {
                    setRequestForm({ ...requestForm, nama: e.target.value });
                    clearMentorError('nama');
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-white border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                    fieldErrors.nama
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                  }`}
                />
                {fieldErrors.nama && (
                  <p id="err-mentor-nama" className="mt-1 text-sm text-red-700 font-medium">
                    {fieldErrors.nama}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="mentor-req-prodi" className="block text-sm font-semibold text-[#0C2340] mb-1">
                    Program Studi UMS
                  </label>
                  <select
                    id="mentor-req-prodi"
                    value={requestForm.prodi}
                    onChange={(e) => setRequestForm({ ...requestForm, prodi: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-white border border-slate-300 text-base text-[#0C2340]"
                  >
                    <option value="">Pilih Prodi (Opsional)</option>
                    {FAKULTAS_PRODI_UMS.map((group) => (
                      <optgroup key={group.fakultas} label={group.fakultas}>
                        {group.prodi.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="mentor-req-angkatan" className="block text-sm font-semibold text-[#0C2340] mb-1">
                    Tahun Angkatan
                  </label>
                  <select
                    id="mentor-req-angkatan"
                    value={requestForm.angkatan}
                    onChange={(e) => setRequestForm({ ...requestForm, angkatan: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-white border border-slate-300 text-base text-[#0C2340]"
                  >
                    <option value="">Pilih Angkatan (Opsional)</option>
                    {ANGKATAN_OPTIONS.map((tahun) => (
                      <option key={tahun} value={tahun}>
                        Angkatan {tahun}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="mentor-req-wa" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Nomor WhatsApp <span className="text-[#92400E]">*</span>
                </label>
                <input
                  id="mentor-req-wa"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  aria-invalid={fieldErrors.whatsapp ? 'true' : undefined}
                  aria-describedby={fieldErrors.whatsapp ? 'hint-mentor-wa err-mentor-wa' : 'hint-mentor-wa'}
                  placeholder="081234567890"
                  value={requestForm.whatsapp}
                  onChange={(e) => {
                    setRequestForm({ ...requestForm, whatsapp: e.target.value });
                    clearMentorError('whatsapp');
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-white border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                    fieldErrors.whatsapp
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                  }`}
                />
                <p id="hint-mentor-wa" className="mt-1 text-sm text-[#475569]">
                  Tidak ditampilkan publik; hanya diteruskan jika kamu menyetujui izin di bawah.
                </p>
                {fieldErrors.whatsapp && (
                  <p id="err-mentor-wa" className="mt-1 text-sm text-red-700 font-medium">
                    {fieldErrors.whatsapp}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="mentor-req-topik" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Topik Mentoring
                </label>
                <select
                  id="mentor-req-topik"
                  value={requestForm.topik}
                  onChange={(e) => setRequestForm({ ...requestForm, topik: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-base text-[#0C2340]"
                >
                  <option value="Ulas CV & Portofolio">Ulas CV &amp; Portofolio</option>
                  <option value="Persiapan Wawancara Kerja">Persiapan Wawancara Kerja</option>
                  <option value="Diskusi Bidang Industri / Karier">Diskusi Bidang Industri / Karier</option>
                  <option value="Merintis Usaha Kecil / UMKM">Merintis Usaha Kecil / UMKM</option>
                </select>
              </div>

              <div>
                <label htmlFor="mentor-req-catatan" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Pertanyaan atau Tujuan Singkat
                </label>
                <textarea
                  id="mentor-req-catatan"
                  rows={3}
                  placeholder="Ceritakan singkat bidang yang sedang kamu tuju..."
                  value={requestForm.catatan}
                  onChange={(e) => setRequestForm({ ...requestForm, catatan: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-base text-[#0C2340]"
                />
              </div>

              <div className="bg-slate-100/75 border border-slate-200 rounded-xl p-3.5">
                <label
                  htmlFor="mentor-req-consent"
                  className="flex items-start gap-2.5 min-h-[44px] cursor-pointer text-base text-[#0C2340] leading-[1.5]"
                >
                  <input
                    id="mentor-req-consent"
                    type="checkbox"
                    aria-invalid={fieldErrors.mentorContactConsent ? 'true' : undefined}
                    aria-describedby={fieldErrors.mentorContactConsent ? 'err-mentor-consent' : undefined}
                    checked={requestForm.mentorContactConsent}
                    onChange={(e) => {
                      setRequestForm({ ...requestForm, mentorContactConsent: e.target.checked });
                      clearMentorError('mentorContactConsent');
                    }}
                    className="mt-1.5 w-4 h-4 rounded border-[#0C2340]/30 accent-[#0C2340] shrink-0"
                  />
                  <span>
                    Saya mengizinkan pengurus meneruskan nomor WhatsApp ini kepada mentor yang cocok agar dapat menghubungi saya.{' '}
                    <span className="text-[#92400E] font-semibold">*</span>
                  </span>
                </label>
                {fieldErrors.mentorContactConsent && (
                  <p id="err-mentor-consent" className="mt-1 pl-6 text-sm text-red-700 font-medium">
                    {fieldErrors.mentorContactConsent}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setMentorModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-slate-100 text-[#0C2340] text-base font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#0C2340] text-white text-base font-semibold hover:bg-[#08182E] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim permintaan mentoring</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-4 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#0C2340]">
                  Permintaan Mentoring Dicatat
                </h3>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Terima kasih, {requestForm.nama}. Permintaan topik <strong>{requestForm.topik}</strong> sudah
                  dicatat dan akan ditindaklanjuti ke WhatsApp <strong>{requestForm.whatsapp}</strong> (
                  {COMMUNITY_PLACEHOLDERS.verificationSla}).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMentorModalOpen(false)}
                className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0C2340] text-white text-base font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 2: DETAIL LOWONGAN KERJA & CARA MELAMAR                           */}
      {/* ========================================================================= */}
      <Dialog open={detailLokerOpen} onOpenChange={setDetailLokerOpen}>
        <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedLoker && (
            <div className="space-y-6">
              <DialogHeader className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {selectedLoker.tipeKerja}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {selectedLoker.sistemKerja}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-[#475569]">
                    {selectedLoker.industri}
                  </span>
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-[#0C2340]">
                  {selectedLoker.posisi}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#475569]">
                  <span className="font-semibold text-[#0C2340] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#92400E]" />
                    {selectedLoker.perusahaan}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#92400E]" />
                    {selectedLoker.wilayah}
                  </span>
                </div>
              </DialogHeader>

              {/* Rujukan & Gaji */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {selectedLoker.alumniRujukan && (
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                    <span className="text-xs font-semibold text-[#475569] block">Rujukan Alumni UMS:</span>
                    <span className="text-sm font-bold text-[#0C2340] mt-0.5 block">
                      {selectedLoker.alumniRujukan}
                    </span>
                  </div>
                )}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                  <span className="text-xs font-semibold text-[#475569] block">Estimasi Gaji / Kompensasi:</span>
                  <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                    {selectedLoker.gajiPerkiraan || 'Sesuai Pengalaman (Diskusikan saat Wawancara)'}
                  </span>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#0C2340]">
                  Deskripsi Pekerjaan
                </h4>
                <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line bg-white border border-slate-200 rounded-xl p-4">
                  {selectedLoker.deskripsi}
                </p>
              </div>

              {/* Kualifikasi */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#0C2340]">
                  Kualifikasi &amp; Persyaratan
                </h4>
                <ul className="text-sm text-[#475569] space-y-2 bg-white border border-slate-200 rounded-xl p-4 list-disc list-inside">
                  {selectedLoker.kualifikasi.map((kual, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {kual}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Saluran Pengiriman Lamaran */}
              <div className="bg-[#0C2340] text-white rounded-xl p-5 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#F59E0B] uppercase tracking-wider">
                    Cara Melamar
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Kirim berkas CV / Portofolio ke kontak resmi di bawah. Sebutkan bahwa kamu adalah alumni UMS (beserta prodi &amp; angkatan) untuk prioritas peninjauan:
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 bg-white/10 p-3 rounded-lg">
                  <span className="text-sm font-mono font-medium truncate max-w-xs sm:max-w-md">
                    {selectedLoker.kontakLamar}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyContact(selectedLoker.kontakLamar)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-[#0C2340] hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kontak</span>
                      </>
                    )}
                  </button>
                </div>

                {selectedLoker.linkLamar && (
                  <div className="pt-2">
                    <a
                      href={selectedLoker.linkLamar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#F59E0B] hover:underline font-semibold"
                    >
                      <span>Buka Tautan Karir Eksternal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setDetailLokerOpen(false)}
                  className="min-h-[44px] px-5 py-2 rounded-lg bg-slate-100 hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 3: BAGIKAN INFO LOWONGAN KERJA BARU                                */}
      {/* ========================================================================= */}
      <Dialog open={shareLokerOpen} onOpenChange={setShareLokerOpen}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1.5 border-b border-slate-200 pb-4">
            <DialogTitle className="text-xl font-bold text-[#0C2340]">
              Bagikan Info Lowongan Kerja
            </DialogTitle>
            <DialogDescription className="text-xs text-[#475569]">
              Bantu sesama alumni UMS dengan membagikan lowongan terbuka di kantor, bisnis, atau proyekmu di Jabodetabek.
            </DialogDescription>
          </DialogHeader>

          {!shareDone ? (
            <form onSubmit={handleShareLokerSubmit} className="space-y-4 pt-3" noValidate>
              {/* Honeypot */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="share-loker-website">Kosongkan kolom ini</label>
                <input
                  id="share-loker-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={lokerForm.website}
                  onChange={(e) => setLokerForm({ ...lokerForm, website: e.target.value })}
                />
              </div>

              {/* Posisi & Perusahaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Posisi Pekerjaan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Digital Marketing Specialist"
                    value={lokerForm.posisi}
                    onChange={(e) => setLokerForm({ ...lokerForm, posisi: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  />
                  {lokerFormErrors.posisi && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{lokerFormErrors.posisi}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Nama Perusahaan / Usaha *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Kreasi Digital Nusantara"
                    value={lokerForm.perusahaan}
                    onChange={(e) => setLokerForm({ ...lokerForm, perusahaan: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  />
                  {lokerFormErrors.perusahaan && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{lokerFormErrors.perusahaan}</p>
                  )}
                </div>
              </div>

              {/* Industri & Wilayah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Bidang Industri *
                  </label>
                  <select
                    value={lokerForm.industri}
                    onChange={(e) => setLokerForm({ ...lokerForm, industri: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  >
                    <option value="Teknologi Informasi & Software">Teknologi Informasi &amp; Software</option>
                    <option value="Konstruksi & Rekayasa Bangunan">Konstruksi &amp; Rekayasa</option>
                    <option value="Kesehatan, Farmasi & Klinik">Kesehatan &amp; Farmasi</option>
                    <option value="Keuangan, Pajak & Perbankan">Keuangan, Pajak &amp; Perbankan</option>
                    <option value="Sumber Daya Manusia & Rekrutmen">SDM &amp; Manajemen</option>
                    <option value="Hukum, Regulasi & Notaris">Hukum &amp; Legal</option>
                    <option value="Pendidikan, Riset & Bimbel">Pendidikan &amp; Bimbel</option>
                    <option value="Kreatif, Media & Komunikasi">Media &amp; Desain Kreatif</option>
                    <option value="Logistik, Ekspor & Perdagangan">Logistik &amp; Perdagangan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Wilayah Penempatan *
                  </label>
                  <select
                    value={lokerForm.wilayah}
                    onChange={(e) => setLokerForm({ ...lokerForm, wilayah: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  >
                    {WILAYAH_JABODETABEK.map((w) => (
                      <option key={w.id} value={w.nama}>
                        {w.nama}
                      </option>
                    ))}
                    <option value="Jabodetabek / Remote">Jabodetabek / Remote</option>
                  </select>
                </div>
              </div>

              {/* Tipe Kerja & Sistem Kerja */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Tipe Pekerjaan *
                  </label>
                  <select
                    value={lokerForm.tipeKerja}
                    onChange={(e) =>
                      setLokerForm({
                        ...lokerForm,
                        tipeKerja: e.target.value as 'Penuh Waktu' | 'Paruh Waktu' | 'Magang' | 'Kontrak',
                      })
                    }
                    className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  >
                    <option value="Penuh Waktu">Penuh Waktu (Full-time)</option>
                    <option value="Paruh Waktu">Paruh Waktu (Part-time)</option>
                    <option value="Magang">Magang (Internship)</option>
                    <option value="Kontrak">Kontrak Proyek (Contract)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Sistem Kerja *
                  </label>
                  <select
                    value={lokerForm.sistemKerja}
                    onChange={(e) =>
                      setLokerForm({
                        ...lokerForm,
                        sistemKerja: e.target.value as 'On-site' | 'Hybrid' | 'Remote',
                      })
                    }
                    className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  >
                    <option value="Hybrid">Hybrid (Sebagian Kantor / Rumah)</option>
                    <option value="On-site">On-site (Wajib di Kantor/Lokasi)</option>
                    <option value="Remote">Remote (Dari Mana Saja)</option>
                  </select>
                </div>
              </div>

              {/* Rentang Gaji & Alumni Rujukan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Perkiraan Gaji (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 6.000.000 - Rp 9.000.000"
                    value={lokerForm.gajiPerkiraan}
                    onChange={(e) => setLokerForm({ ...lokerForm, gajiPerkiraan: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Nama Alumni UMS &amp; Prodi/Angkatan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Andi Wijaya (Informatika '18)"
                    value={lokerForm.alumniRujukan}
                    onChange={(e) => setLokerForm({ ...lokerForm, alumniRujukan: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  />
                  {lokerFormErrors.alumniRujukan && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{lokerFormErrors.alumniRujukan}</p>
                  )}
                </div>
              </div>

              {/* Kualifikasi */}
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Kualifikasi Utama (Pisahkan per baris) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={"Contoh:\n- Pendidikan minimal D3/S1\n- Menguasai tools relevan\n- Komunikatif & teliti"}
                  value={lokerForm.kualifikasi}
                  onChange={(e) => setLokerForm({ ...lokerForm, kualifikasi: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
                {lokerFormErrors.kualifikasi && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{lokerFormErrors.kualifikasi}</p>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Ringkasan Tanggung Jawab / Deskripsi Kerja *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan peran harian, ruang lingkup proyek, atau benefit yang didapatkan..."
                  value={lokerForm.deskripsi}
                  onChange={(e) => setLokerForm({ ...lokerForm, deskripsi: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
                {lokerFormErrors.deskripsi && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{lokerFormErrors.deskripsi}</p>
                )}
              </div>

              {/* Kontak Pengiriman Lamaran & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Email / WhatsApp Lamaran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="recruitment@kantor.com atau WA 0812..."
                    value={lokerForm.kontakLamar}
                    onChange={(e) => setLokerForm({ ...lokerForm, kontakLamar: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  />
                  {lokerFormErrors.kontakLamar && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{lokerFormErrors.kontakLamar}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                    Tautan Karir Web (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://perusahaan.com/karir"
                    value={lokerForm.linkLamar}
                    onChange={(e) => setLokerForm({ ...lokerForm, linkLamar: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShareLokerOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-slate-100 text-[#0C2340] text-sm font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={shareSubmitting}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {shareSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#F59E0B]" />
                      <span>Terbitkan Lowongan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-[#0C2340]">Info Lowongan Berhasil Diterbitkan!</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Terima kasih banyak atas kontribusinya. Lowongan <strong>{lokerForm.posisi}</strong> di <strong>{lokerForm.perusahaan}</strong> sudah langsung aktif di papan info lowongan alumni IKA UMS Jabodetabek.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareLokerOpen(false)}
                className="min-h-[44px] px-6 py-2.5 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#08182E] transition-colors cursor-pointer"
              >
                Selesai &amp; Lihat Papan Loker
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

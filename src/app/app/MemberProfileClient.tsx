'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/components/Navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  FAKULTAS_PRODI_UMS,
  ANGKATAN_OPTIONS,
  WILAYAH_JABODETABEK,
  normalizeIndonesianWhatsApp,
  isValidEmail,
} from '@/data/ums-prodi';
import type { AgendaItem } from '@/lib/cms-store';
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  GraduationCap,
  LogOut,
  MapPin,
  Pencil,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

interface UserProfileData {
  nama?: string;
  prodi?: string;
  angkatan?: string | number;
  wilayah?: string;
  pekerjaan?: string;
  perusahaan?: string;
  fotoUrl?: string;
  whatsapp?: string;
  email?: string;
  tampilDiDirektori?: boolean;
  siapMentoring?: boolean;
  idAnggota?: string;
}

const activityItems = [
  {
    title: 'Profil anggota siap digunakan',
    detail: 'Informasi identitas, program studi, dan domisili aktif tersimpan.',
    icon: CheckCircle2,
    badge: 'Lengkap',
  },
  {
    title: 'Direktori anggota menanti persetujuanmu',
    detail: 'Sesuaikan pengaturan agar rekan satu angkatan mudah menemukanmu.',
    icon: Users,
    badge: 'Terkendali',
  },
  {
    title: 'Jaringan korwil Jabodetabek',
    detail: 'Terhubung dengan perwakilan alumni di wilayah tempat tinggalmu.',
    icon: MapPin,
    badge: 'Aktif',
  },
];

interface MemberProfileClientProps {
  initialAgendas?: AgendaItem[];
}

function parseDateBadge(dateStr?: string): { month: string; day: string } {
  if (!dateStr) return { month: 'TEMU', day: '--' };
  const dayMatch = dateStr.match(/\b([0-3]?[0-9])\b/);
  const day = dayMatch ? dayMatch[1].padStart(2, '0') : '--';

  const monthsMap: Record<string, string> = {
    jan: 'JAN',
    feb: 'FEB',
    mar: 'MAR',
    apr: 'APR',
    mei: 'MEI',
    may: 'MEI',
    jun: 'JUN',
    jul: 'JUL',
    agu: 'AGU',
    aug: 'AGU',
    sep: 'SEP',
    okt: 'OKT',
    oct: 'OKT',
    nov: 'NOV',
    des: 'DES',
    dec: 'DES',
  };
  const lower = dateStr.toLowerCase();
  let month = 'KPD';
  for (const [key, val] of Object.entries(monthsMap)) {
    if (lower.includes(key)) {
      month = val;
      break;
    }
  }
  return { month, day };
}

export default function MemberProfileClient({
  initialAgendas = [],
}: MemberProfileClientProps = {}) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [agendas, setAgendas] = useState<AgendaItem[]>(initialAgendas);
  const [tampilDiDirektori, setTampilDiDirektori] = useState(true);
  const [terbukaMentoring, setTerbukaMentoring] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Modal Edit Profil State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nama: '',
    prodi: 'Teknik Informatika',
    angkatan: '2015',
    wilayah: 'Jakarta Selatan',
    pekerjaan: '',
    perusahaan: '',
    whatsapp: '',
    email: '',
    fotoUrl: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Muat profil akun yang sedang login dari server
  useEffect(() => {
    let isSubscribed = true;
    fetch('/api/auth')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isSubscribed) return;
        if (data?.authenticated && data?.profile) {
          setUserProfile(data.profile);
          if (typeof data.profile.tampilDiDirektori === 'boolean') {
            setTampilDiDirektori(data.profile.tampilDiDirektori);
          }
          if (typeof data.profile.siapMentoring === 'boolean') {
            setTerbukaMentoring(data.profile.siapMentoring);
          }
          try {
            localStorage.setItem('ikaums_current_user_profile', JSON.stringify(data.profile));
          } catch {}
        } else {
          // Fallback lokal jika sesi belum menyediakan profile penuh
          try {
            const stored = localStorage.getItem('ikaums_current_user_profile');
            if (stored) {
              const parsed = JSON.parse(stored) as UserProfileData;
              setUserProfile(parsed);
              if (typeof parsed.tampilDiDirektori === 'boolean') {
                setTampilDiDirektori(parsed.tampilDiDirektori);
              }
              if (typeof parsed.siapMentoring === 'boolean') {
                setTerbukaMentoring(parsed.siapMentoring);
              }
            }
          } catch {}
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem('ikaums_current_user_profile');
          if (stored) {
            const parsed = JSON.parse(stored) as UserProfileData;
            setUserProfile(parsed);
          }
        } catch {}
      })
      .finally(() => {
        if (isSubscribed) setIsLoadingProfile(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Auto-dismiss notice after 4 seconds
  useEffect(() => {
    if (!savedNotice) return;
    const timeout = setTimeout(() => {
      setSavedNotice(null);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [savedNotice]);

  // Sync agendas from CMS API
  useEffect(() => {
    let isSubscribed = true;
    fetch('/api/admin/content')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isSubscribed && data && Array.isArray(data.agendas)) {
          setAgendas(data.agendas);
        }
      })
      .catch(() => {});
    return () => {
      isSubscribed = false;
    };
  }, []);

  const displayName = userProfile?.nama || (isLoadingProfile ? 'Memuat profil...' : 'Alumni UMS');
  const firstName = displayName.split(' ')[0] || 'Alumni';
  const displayAngkatan = userProfile?.angkatan ? String(userProfile.angkatan) : '';
  const displayProdi = userProfile?.prodi || (isLoadingProfile ? '...' : 'Alumni UMS');
  const displayProdiAngkatan = displayAngkatan
    ? `${displayProdi} ’${displayAngkatan.slice(-2)}`
    : displayProdi;
  const displayPekerjaan = userProfile?.pekerjaan
    ? `${userProfile.pekerjaan}${userProfile.perusahaan ? ` di ${userProfile.perusahaan}` : ''}`
    : userProfile?.perusahaan
    ? `Profesional di ${userProfile.perusahaan}`
    : isLoadingProfile
    ? 'Memuat...'
    : 'Alumni Profesional';
  const displayWilayah = userProfile?.wilayah || (isLoadingProfile ? '...' : 'Jabodetabek');
  const displayFoto = userProfile?.fotoUrl;
  const isCustomFoto = Boolean(displayFoto?.startsWith('data:'));

  const nameParts = displayName.trim().split(/\s+/).filter(Boolean);
  const avatarInitials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.slice(0, 2) || 'AL').toUpperCase();

  const memberId =
    userProfile?.idAnggota ||
    (displayAngkatan
      ? `UMS-JBD-${displayAngkatan.slice(-2)}${Math.abs(
          (displayName.length * 37 + (Number(displayAngkatan) || 0) * 13) % 900 + 100
        )}`
      : 'UMS-JBD-ALUMNI');

  const handleToggleDirektori = async () => {
    const nextVal = !tampilDiDirektori;
    setTampilDiDirektori(nextVal);
    const updated = { ...(userProfile || {}), tampilDiDirektori: nextVal };
    setUserProfile(updated);
    try {
      localStorage.setItem('ikaums_current_user_profile', JSON.stringify(updated));
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          profile: { tampilDiDirektori: nextVal },
        }),
      });
    } catch {
      // Abaikan bila storage/jaringan gagal
    }
    setSavedNotice(
      nextVal
        ? 'Preferensi disimpan: Profil kini dapat dicari di Direktori Anggota.'
        : 'Preferensi disimpan: Profil kini disembunyikan dari Direktori Anggota.'
    );
  };

  const handleToggleMentoring = async () => {
    const nextVal = !terbukaMentoring;
    setTerbukaMentoring(nextVal);
    const updated = { ...(userProfile || {}), siapMentoring: nextVal };
    setUserProfile(updated);
    try {
      localStorage.setItem('ikaums_current_user_profile', JSON.stringify(updated));
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          profile: { siapMentoring: nextVal },
        }),
      });
    } catch {
      // Abaikan bila storage/jaringan gagal
    }
    setSavedNotice(
      nextVal
        ? 'Preferensi disimpan: Status kesediaan mentoring alumni diaktifkan.'
        : 'Preferensi disimpan: Status kesediaan mentoring alumni dinonaktifkan.'
    );
  };

  const handleCopyMemberId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(memberId).then(() => {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
        setSavedNotice(`ID Anggota ${memberId} berhasil disalin ke papan klip.`);
      });
    }
  };

  const handleOpenEditModal = () => {
    setEditForm({
      nama: userProfile?.nama || (displayName !== 'Alumni UMS' ? displayName : ''),
      prodi: userProfile?.prodi || (displayProdi !== 'Alumni UMS' ? displayProdi : 'Teknik Informatika'),
      angkatan: String(userProfile?.angkatan || displayAngkatan || '2015'),
      wilayah: userProfile?.wilayah || (displayWilayah !== 'Jabodetabek' ? displayWilayah : 'Jakarta Selatan'),
      pekerjaan: userProfile?.pekerjaan || '',
      perusahaan: userProfile?.perusahaan || '',
      whatsapp: userProfile?.whatsapp || '',
      email: userProfile?.email || '',
      fotoUrl: userProfile?.fotoUrl || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!editForm.nama.trim()) {
      errors.nama = 'Nama lengkap wajib diisi.';
    }

    if (editForm.whatsapp.trim()) {
      const validWa = normalizeIndonesianWhatsApp(editForm.whatsapp);
      if (!validWa) {
        errors.whatsapp = 'Format nomor WhatsApp tidak valid. Masukkan nomor dengan awalan 08 atau +62.';
      }
    }

    if (editForm.email.trim() && !isValidEmail(editForm.email)) {
      errors.email = 'Format alamat email tidak valid.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const updated: UserProfileData = {
        ...(userProfile || {}),
        nama: editForm.nama.trim(),
        prodi: editForm.prodi,
        angkatan: editForm.angkatan,
        wilayah: editForm.wilayah,
        pekerjaan: editForm.pekerjaan.trim() || undefined,
        perusahaan: editForm.perusahaan.trim() || undefined,
        whatsapp: editForm.whatsapp.trim() ? normalizeIndonesianWhatsApp(editForm.whatsapp)! : undefined,
        email: editForm.email.trim() || undefined,
        fotoUrl: editForm.fotoUrl.trim() || undefined,
        tampilDiDirektori,
        siapMentoring: terbukaMentoring,
      };

      setUserProfile(updated);
      try {
        localStorage.setItem('ikaums_current_user_profile', JSON.stringify(updated));
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_profile',
            profile: updated,
          }),
        });
      } catch {}

      setIsEditModalOpen(false);
      setSavedNotice('Profil anggota berhasil diperbarui.');
    } catch {
      setFormErrors({ general: 'Gagal menyimpan perubahan ke memori peramban.' });
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      try {
        localStorage.removeItem('ikaums_current_user_profile');
      } catch {}
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/masuk');
    } catch {
      router.push('/masuk');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow w-full">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9 lg:py-10 space-y-6 sm:space-y-8">
          
          {/* Header Panel Bento */}
          <section
            aria-labelledby="member-dashboard-title"
            className="relative overflow-hidden rounded-2xl bg-[#0C2340] text-white shadow-[0_18px_45px_-30px_rgba(12,35,64,0.8)]"
          >
            {/* Watermark siluet kampus UMS */}
            <Image
              src="/images/ums-campus-silhouette.png"
              alt=""
              aria-hidden="true"
              width={2200}
              height={760}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="pointer-events-none absolute -bottom-24 right-[-15%] w-[780px] max-w-none opacity-[0.11] sm:right-[-5%] sm:opacity-[0.14]"
            />
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10 bg-white/[0.03]"
            />
            <div
              aria-hidden="true"
              className="absolute right-20 top-10 h-20 w-20 rounded-full border border-[#F59E0B]/25"
            />

            <div className="relative p-5 sm:p-7 lg:p-8 space-y-4 sm:space-y-6">
              {/* Top Navigation & Status Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/15 pb-4">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <Link
                    href="/"
                    className="inline-flex min-h-[36px] items-center hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Beranda
                  </Link>
                  <span aria-hidden="true" className="text-slate-500">/</span>
                  <span className="font-semibold text-white">Ruang Anggota</span>
                </nav>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                    Anggota Terverifikasi
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    <MapPin className="h-3 w-3 text-[#F59E0B]" aria-hidden="true" />
                    <span>{displayWilayah}</span>
                  </span>
                </div>
              </div>

              {/* Welcome Headline & Quick CTAs */}
              <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-end">
                <div className="max-w-2xl">
                  <p className="text-[#FDE5B2] text-xs sm:text-sm font-bold uppercase tracking-wider">
                    Selamat datang kembali, {firstName}
                  </p>
                  <h1
                    id="member-dashboard-title"
                    className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white"
                  >
                    Jaringan alumni, lebih dekat dengan langkahmu.
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm lg:text-base leading-relaxed text-slate-300">
                    Kelola kehadiran kopdar, perluas jejaring profesional, dan buka ruang berbagi pengalaman bersama alumni UMS di Jabodetabek.
                  </p>
                </div>

                {/* Hero Action Buttons */}
                <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 pt-1 sm:pt-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] px-4 py-2 text-xs sm:text-sm font-bold text-[#0C2340] shadow-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    <span>Edit Profil</span>
                  </button>

                  <Link
                    href="/direktori"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Search className="h-4 w-4 text-[#FDE5B2]" aria-hidden="true" />
                    <span>Cari Alumni</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="col-span-2 sm:col-span-1 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 text-xs sm:text-sm font-semibold text-rose-200 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    title="Keluar dari sesi akun"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Toast Notification Alert */}
          {savedNotice && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-xs animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                <span className="font-medium">{savedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setSavedNotice(null)}
                className="p-1 text-emerald-700 hover:text-emerald-900 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Card 1: Kartu Tanda Anggota (KTA) Digital (Col 7) */}
            <section
              aria-labelledby="summary-title"
              className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-amber-200/90 bg-white shadow-xs overflow-hidden"
            >
              {/* Kartu Header Navy Strip */}
              <div className="relative bg-[#0C2340] px-5 py-3.5 sm:px-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B]" aria-hidden="true" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FDE5B2]">
                    KARTU TANDA ANGGOTA DIGITAL
                  </span>
                </div>
                <span className="text-xs font-bold text-[#FDE5B2] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  Profil Saya
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 lg:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#D97706]/60 bg-slate-100 shadow-sm">
                      {displayFoto ? (
                        <Image
                          src={displayFoto}
                          alt={`Foto profil ${displayName}`}
                          fill
                          unoptimized={isCustomFoto}
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-extrabold text-xl sm:text-2xl bg-gradient-to-br from-[#0C2340] to-[#1E3A8A] text-white select-none">
                          {avatarInitials}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 id="summary-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[#0C2340]">
                          {displayName}
                        </h2>
                        <span
                          className="inline-flex items-center text-emerald-600"
                          title="Anggota Terverifikasi"
                        >
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#92400E]">
                        Alumni Universitas Muhammadiyah Surakarta
                      </p>
                    </div>
                  </div>

                  {/* Member ID Badge */}
                  <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-2.5 sm:p-0 rounded-xl bg-slate-50 sm:bg-transparent border sm:border-0 border-slate-200">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                      ID Anggota
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMemberId}
                      className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-[#0C2340] bg-white sm:bg-slate-100 border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Klik untuk menyalin ID Anggota"
                    >
                      <span>{memberId}</span>
                      {copiedId ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Info Attributes Grid - Bento 2x2 Mobile & Desktop */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 rounded-xl bg-slate-50 border border-slate-200/90 p-3 sm:p-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-2.5 text-[#334155] min-w-0">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[#92400E]">
                      <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Prodi &amp; Angkatan</span>
                      <span className="block font-bold text-xs sm:text-sm text-[#0C2340] truncate">{displayProdiAngkatan}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5 text-[#334155] min-w-0">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[#92400E]">
                      <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Pekerjaan &amp; Instansi</span>
                      <span className="block font-bold text-xs sm:text-sm text-[#0C2340] truncate">{displayPekerjaan}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5 text-[#334155] min-w-0">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[#92400E]">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Wilayah Domisili</span>
                      <span className="block font-bold text-xs sm:text-sm text-[#0C2340] truncate">{displayWilayah}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5 text-[#334155] min-w-0">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[#92400E]">
                      <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Status Keanggotaan</span>
                      <span className="block font-bold text-xs sm:text-sm text-emerald-700 truncate">Aktif Terdaftar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="border-t border-slate-200/90 bg-slate-50/70 px-5 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0C2340] hover:text-[#92400E] transition-colors cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span>Ubah Data Profil</span>
                </button>

                <Link
                  href="/direktori"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0C2340] underline decoration-[#F59E0B] decoration-2 underline-offset-4 hover:text-[#92400E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0C2340]"
                >
                  <span>Lihat profil publik</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>

            {/* Card 2: Agenda Terdekat (Col 5) */}
            <section
              aria-labelledby="agenda-terdekat-title"
              className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0C2340] text-white">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                        Agenda terdekat
                      </p>
                      <h2 id="agenda-terdekat-title" className="text-lg font-bold text-[#0C2340]">
                        {agendas.length > 0 ? (agendas[0].jenis || 'Kopdar Wilayah') : 'Kopdar Jabodetabek'}
                      </h2>
                    </div>
                  </div>
                  {agendas.length > 0 ? (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      Buka
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                      Segera Hadir
                    </span>
                  )}
                </div>

                {/* Event Detail Box / Empty State */}
                {agendas.length > 0 ? (
                  (() => {
                    const agenda = agendas[0];
                    const { month, day } = parseDateBadge(agenda.tanggalWIB);
                    return (
                      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                        <div className="flex items-start gap-3.5">
                          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F59E0B] text-[#0C2340] font-bold shadow-xs">
                            <span className="text-[10px] leading-none uppercase">{month}</span>
                            <span className="mt-0.5 text-lg font-extrabold leading-none">{day}</span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-[#0C2340] leading-snug">
                              {agenda.judul}
                            </h3>
                            <p className="mt-1 text-xs text-[#475569] leading-relaxed">
                              {agenda.tanggalWIB} {agenda.jamWIB ? `· ${agenda.jamWIB}` : ''} {agenda.wilayah ? `· ${agenda.wilayah}` : ''}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                          Lokasi: {agenda.lokasi}.
                          {agenda.kapasitas ? ` Kapasitas: ${agenda.kapasitas} orang.` : ''}
                          {agenda.penanggungJawab ? ` Koordinator: ${agenda.penanggungJawab}.` : ''}
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5">
                      <CalendarDays className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-sm text-[#0C2340]">
                      Belum Ada Jadwal Kopdar Baru
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Kopdar perdana telah terlaksana. Jadwal pertemuan berikutnya sedang disusun oleh koordinator wilayah.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                <Link
                  href="/kegiatan"
                  className="inline-flex min-h-[40px] items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0C2340] hover:text-[#92400E] transition-colors"
                >
                  <span>{agendas.length > 0 ? 'Lihat detail agenda' : 'Lihat liputan kegiatan'}</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                {agendas.length > 0 ? (
                  <Link
                    href="/kegiatan"
                    className="inline-flex min-h-[36px] items-center justify-center rounded-lg bg-[#0C2340] hover:bg-[#16325C] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors"
                  >
                    Konfirmasi Kehadiran
                  </Link>
                ) : (
                  <Link
                    href="/kegiatan"
                    className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Cek Liputan
                  </Link>
                )}
              </div>
            </section>

            {/* Card 3: Pengaturan Privasi Tampilan (Col 7) */}
            <section
              aria-labelledby="privacy-title"
              className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDE5B2] text-[#92400E]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                    Pengaturan Privasi Tampilan
                  </p>
                  <h2 id="privacy-title" className="text-lg sm:text-xl font-bold tracking-tight text-[#0C2340]">
                    Atur visibilitasmu
                  </h2>
                </div>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-[#475569] leading-relaxed">
                Tentukan bagaimana identitas dan keahlianmu dapat ditemukan oleh sesama alumni di portal IKA UMS.
              </p>

              <div className="mt-6 space-y-4">
                {/* Switch 1: Tampilkan di Daftar Anggota */}
                <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="block text-sm font-bold text-[#0C2340]">
                        Tampilkan di Daftar Anggota
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tampilDiDirektori
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tampilDiDirektori ? 'Publik' : 'Disembunyikan'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#475569] leading-relaxed">
                      Hanya anggota yang masuk dapat melihat profilmu. Kontak pribadi (WhatsApp/Email) tetap aman terlindungi.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={tampilDiDirektori}
                    onClick={handleToggleDirektori}
                    id="pref-direktori"
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                      tampilDiDirektori ? 'bg-[#0C2340]' : 'bg-slate-300'
                    }`}
                  >
                    <span className="sr-only">Toggle Tampilkan di Daftar Anggota</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        tampilDiDirektori ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 2: Bersedia Jadi Mentor Alumni */}
                <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="block text-sm font-bold text-[#0C2340]">
                        Bersedia Jadi Mentor Alumni
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          terbukaMentoring
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {terbukaMentoring ? 'Siap Berbagi' : 'Belum Aktif'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#475569] leading-relaxed">
                      Tandai kesiapanmu berbagi pengalaman karier, konsultasi kerja, atau bimbingan alumni muda UMS di Jabodetabek.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={terbukaMentoring}
                    onClick={handleToggleMentoring}
                    id="pref-mentoring"
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                      terbukaMentoring ? 'bg-[#F59E0B]' : 'bg-slate-300'
                    }`}
                  >
                    <span className="sr-only">Toggle Bersedia Jadi Mentor Alumni</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        terbukaMentoring ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Card 4: Pintasan Akses Cepat (Col 5) */}
            <section
              aria-labelledby="quick-access-title"
              className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0C2340] text-white">
                    <Sparkles className="h-5 w-5 text-[#F59E0B]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                      Mulai dari sini
                    </p>
                    <h2 id="quick-access-title" className="text-lg sm:text-xl font-bold tracking-tight text-[#0C2340]">
                      Akses cepat
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                  <Link
                    href="/kegiatan"
                    className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-3.5 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]"
                  >
                    <span className="block text-xs sm:text-sm font-bold text-[#0C2340] leading-tight">Jadwal kopdar</span>
                    <span className="mt-1 block text-[11px] sm:text-xs text-[#475569] leading-tight line-clamp-2">Temukan pertemuan terdekat.</span>
                    <ArrowRight className="mt-2 h-3.5 w-3.5 text-[#92400E] transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/peluang"
                    className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-3.5 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]"
                  >
                    <span className="block text-xs sm:text-sm font-bold text-[#0C2340] leading-tight">Mentoring &amp; kerja</span>
                    <span className="mt-1 block text-[11px] sm:text-xs text-[#475569] leading-tight line-clamp-2">Bagikan atau cari peluang.</span>
                    <ArrowRight className="mt-2 h-3.5 w-3.5 text-[#92400E] transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/direktori"
                    className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-3.5 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]"
                  >
                    <span className="block text-xs sm:text-sm font-bold text-[#0C2340] leading-tight">Cari Teman Kampus</span>
                    <span className="mt-1 block text-[11px] sm:text-xs text-[#475569] leading-tight line-clamp-2">Jelajahi kawan satu prodi.</span>
                    <ArrowRight className="mt-2 h-3.5 w-3.5 text-[#92400E] transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/peta"
                    className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-3.5 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]"
                  >
                    <span className="block text-xs sm:text-sm font-bold text-[#0C2340] leading-tight">Peta 9 Korwil</span>
                    <span className="mt-1 block text-[11px] sm:text-xs text-[#475569] leading-tight line-clamp-2">Sebaran alumni Jabodetabek.</span>
                    <ArrowRight className="mt-2 h-3.5 w-3.5 text-[#92400E] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Card 5: Rekomendasi & Aktivitas Personal (Col 12) */}
            <section
              aria-labelledby="activity-title"
              className="lg:col-span-12 rounded-2xl border border-slate-200 bg-slate-100/80 p-5 sm:p-6 lg:p-7 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#92400E] shadow-xs">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                      Untuk kamu
                    </p>
                    <h2 id="activity-title" className="text-lg sm:text-xl font-bold tracking-tight text-[#0C2340]">
                      Aktivitas kamu
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Kesiapan Akun:</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    <Check className="h-3 w-3" /> 100% Siap
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {activityItems.map(({ title, detail, icon: Icon, badge }) => (
                  <div
                    key={title}
                    className="flex flex-col justify-between rounded-xl bg-white p-4 border border-slate-200/80 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <Icon className="h-5 w-5 text-[#92400E]" aria-hidden="true" />
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {badge}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xs sm:text-sm font-bold text-[#0C2340] leading-snug">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                        {detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Modal Dialog: Edit Profil Anggota */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0C2340] flex items-center gap-2">
              <Pencil className="h-5 w-5 text-[#F59E0B]" />
              <span>Edit Profil Anggota</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-[#475569]">
              Perbarui data pribadi dan pekerjaanmu untuk memperkuat jaringan sesama alumni UMS di Jabodetabek.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            {formErrors.general && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {formErrors.general}
              </div>
            )}

            {/* Nama Lengkap */}
            <div>
              <label htmlFor="edit-nama" className="block text-xs font-bold text-[#0C2340] uppercase mb-1">
                Nama Lengkap *
              </label>
              <input
                id="edit-nama"
                type="text"
                value={editForm.nama}
                onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden"
                placeholder="Nama lengkap &amp; gelar (jika ada)"
                required
              />
              {formErrors.nama && (
                <p className="mt-1 text-xs text-rose-600">{formErrors.nama}</p>
              )}
            </div>

            {/* Prodi & Angkatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-prodi" className="block text-xs font-bold text-[#0C2340] uppercase mb-1">
                  Program Studi
                </label>
                <select
                  id="edit-prodi"
                  value={editForm.prodi}
                  onChange={(e) => setEditForm({ ...editForm, prodi: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden"
                >
                  {FAKULTAS_PRODI_UMS.flatMap((f) => f.prodi).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="edit-angkatan" className="block text-xs font-bold text-[#0C2340] uppercase mb-1">
                  Angkatan Masuk
                </label>
                <select
                  id="edit-angkatan"
                  value={editForm.angkatan}
                  onChange={(e) => setEditForm({ ...editForm, angkatan: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden"
                >
                  {ANGKATAN_OPTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Wilayah Domisili */}
            <div>
              <label htmlFor="edit-wilayah" className="block text-xs font-bold text-[#0C2340] uppercase mb-1">
                Wilayah Domisili di Jabodetabek
              </label>
              <select
                id="edit-wilayah"
                value={editForm.wilayah}
                onChange={(e) => setEditForm({ ...editForm, wilayah: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden"
              >
                {WILAYAH_JABODETABEK.map((w) => (
                  <option key={w.id} value={w.nama}>
                    {w.nama} ({w.provinsi})
                  </option>
                ))}
              </select>
            </div>

            {/* Pekerjaan & Perusahaan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-pekerjaan" className="block text-xs font-bold text-[#0C2340] uppercase mb-1">
                  Pekerjaan / Jabatan
                </label>
                <input
                  id="edit-pekerjaan"
                  type="text"
                  value={editForm.pekerjaan}
                  onChange={(e) => setEditForm({ ...editForm, pekerjaan: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden"
                  placeholder="Jabatan atau profesi aktif saat ini"
                />
              </div>

              <div>
                <label htmlFor="edit-perusahaan" className="block text-xs font-bold text-[#0C2340] uppercase mb-1">
                  Instansi / Perusahaan
                </label>
                <input
                  id="edit-perusahaan"
                  type="text"
                  value={editForm.perusahaan}
                  onChange={(e) => setEditForm({ ...editForm, perusahaan: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden"
                  placeholder="Nama instansi, institusi, atau bidang usaha"
                />
              </div>
            </div>

            {/* WhatsApp & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-wa" className="block text-xs font-bold text-[#0C2340] uppercase mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  id="edit-wa"
                  type="tel"
                  value={editForm.whatsapp}
                  onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden"
                  placeholder="081234567890"
                />
                {formErrors.whatsapp && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.whatsapp}</p>
                )}
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-xs font-bold text-[#0C2340] uppercase mb-1">
                  Alamat Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden"
                  placeholder="nama@email.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] hover:bg-[#16325C] px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors cursor-pointer"
              >
                <Check className="h-4 w-4 text-[#F59E0B]" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

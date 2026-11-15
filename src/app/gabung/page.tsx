'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import {
  WILAYAH_JABODETABEK,
  FAKULTAS_PRODI_UMS,
  ANGKATAN_OPTIONS,
  normalizeIndonesianWhatsApp,
  isValidEmail,
} from '@/data/ums-prodi';
import { COMMUNITY_PLACEHOLDERS, IS_DEMO_MODE, DEMO_BADGE_LABEL } from '@/lib/config';
import { formatIndonesianName } from '@/lib/name-format';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Share2,
  ChevronDown,
  Loader2,
  ExternalLink,
  Camera,
  Upload,
  X,
  Sparkles,
  Edit3,
  Home,
  Clock,
} from 'lucide-react';

const SUBMISSIONS_KEY = 'ikaums_prelaunch_submissions';

interface FieldErrors {
  namaLengkap?: string;
  angkatan?: string;
  prodi?: string;
  wilayah?: string;
  whatsapp?: string;
  email?: string;
  mentorContactConsent?: string;
  agreeConsent?: string;
  form?: string;
}

interface StoredSubmission {
  whatsapp: string;
  email?: string;
  nama: string;
  wilayah: string;
}

export default function GabungPage() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    angkatan: '',
    prodi: '',
    wilayah: 'Jakarta Selatan',
    whatsapp: '',
    email: '',
    pekerjaan: '',
    perusahaan: '',
    siapMentoring: false,
    mentorContactConsent: false,
    tampilDiDirektori: false,
    agreeConsent: false,
    website: '', // honeypot anti-spam
  });

  const [showOptional, setShowOptional] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [normalizedWa, setNormalizedWa] = useState('');
  const [nameSuggestion, setNameSuggestion] = useState<string | null>(null);
  const submittingRef = useRef(false);

  // Upload foto profil akun
  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [fotoProfilName, setFotoProfilName] = useState<string | null>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestNameFormat = () => {
    const formatted = formatIndonesianName(formData.namaLengkap);
    setNameSuggestion(formatted && formatted !== formData.namaLengkap.trim() ? formatted : null);
  };

  const applyNameSuggestion = () => {
    if (!nameSuggestion) return;
    setFormData({ ...formData, namaLengkap: nameSuggestion });
    setNameSuggestion(null);
    clearError('namaLengkap');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFotoError('Format berkas harus JPG, PNG, atau WebP.');
      return;
    }

    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFotoError('Ukuran berkas melebihi 3 MB. Pilih foto dengan ukuran lebih kecil.');
      return;
    }

    setFotoError(null);
    setFotoProfilName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFotoProfil(reader.result);
      }
    };
    reader.onerror = () => {
      setFotoError('Gagal membaca berkas gambar. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFoto = () => {
    setFotoProfil(null);
    setFotoProfilName(null);
    setFotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mentorParam = params.get('mentor');
    const wilayahParam = params.get('wilayah');

    const wantsMentor = mentorParam?.toLowerCase() === 'ya';
    const cleanWilayahParam = wilayahParam?.trim().toLowerCase();
    const matchedWilayah = cleanWilayahParam
      ? WILAYAH_JABODETABEK.find(
          (item) =>
            item.nama.toLowerCase() === cleanWilayahParam ||
            item.id.toLowerCase() === cleanWilayahParam ||
            item.nama.toLowerCase().includes(cleanWilayahParam)
        )
      : undefined;

    if (!wantsMentor && !matchedWilayah) return;

    const timer = setTimeout(() => {
      if (wantsMentor) {
        setShowOptional(true);
      }
      setFormData((prev) => ({
        ...prev,
        ...(wantsMentor ? { siapMentoring: true } : {}),
        ...(matchedWilayah ? { wilayah: matchedWilayah.nama } : {}),
      }));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const clearError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field] && !prev.form) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    // Honeypot check: bot mengisi kolom tersembunyi
    if (formData.website.trim().length > 0) {
      setFieldErrors({
        form: 'Permintaan tidak dapat diproses. Silakan muat ulang halaman lalu coba lagi.',
      });
      return;
    }

    const errors: FieldErrors = {};

    const cleanName = formData.namaLengkap.trim();
    if (cleanName.length < 3) {
      errors.namaLengkap = 'Tuliskan nama lengkapmu minimal 3 huruf (boleh disertai gelar).';
    }

    if (!formData.angkatan) {
      errors.angkatan = 'Pilih tahun masuk UMS dari daftar yang tersedia.';
    }

    if (!formData.prodi) {
      errors.prodi = 'Pilih program studi kamu saat kuliah di UMS.';
    }

    if (!formData.wilayah) {
      errors.wilayah = 'Pilih wilayah domisili di Jabodetabek.';
    }

    const validWa = normalizeIndonesianWhatsApp(formData.whatsapp);
    if (!validWa) {
      errors.whatsapp =
        'Masukkan nomor WhatsApp Indonesia yang valid (misalnya 081234567890 atau +6281234567890).';
    }

    const cleanEmail = formData.email.trim().toLowerCase();
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      errors.email = 'Format alamat email belum benar, misalnya nama@domain.com.';
    }

    if (formData.siapMentoring && !formData.mentorContactConsent) {
      errors.mentorContactConsent =
        'Centang izin penerusan kontak mentor kepada pemohon mentoring terverifikasi, atau matikan opsi menjadi mentor.';
    }

    if (!formData.agreeConsent) {
      errors.agreeConsent =
        'Centang persetujuan pemrosesan data dan Kebijakan Privasi sebelum mengirim pendaftaran.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.mentorContactConsent) {
        setShowOptional(true);
      }
      const order: Array<[keyof FieldErrors, string]> = [
        ['namaLengkap', 'namaLengkap'],
        ['angkatan', 'angkatan'],
        ['prodi', 'prodi'],
        ['wilayah', 'wilayah'],
        ['whatsapp', 'whatsapp'],
        ['email', 'email'],
        ['mentorContactConsent', 'mentorContactConsent'],
        ['agreeConsent', 'agreeConsent'],
      ];
      const firstTarget = order.find(([key]) => Boolean(errors[key]))?.[1];
      if (firstTarget) {
        setTimeout(() => document.getElementById(firstTarget)?.focus(), 0);
      }
      return;
    }

    // Duplicate guard pada perangkat yang sama
    try {
      const existingRaw = localStorage.getItem(SUBMISSIONS_KEY);
      const existing: StoredSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
      const dupWa = existing.some((item) => item.whatsapp === validWa);
      const dupEmail = cleanEmail ? existing.some((item) => item.email === cleanEmail) : false;

      if (dupWa) {
        setFieldErrors({
          whatsapp:
            'Nomor WhatsApp ini sudah tercatat mendaftar dari peramban ini. Jika ingin mengubah data, hubungi pengurus.',
        });
        return;
      }
      if (dupEmail) {
        setFieldErrors({
          email:
            'Alamat email ini sudah tercatat mendaftar dari peramban ini. Gunakan menu Masuk atau hubungi pengurus.',
        });
        return;
      }
    } catch {
      // Abaikan error penyimpanan lokal jika diblokir browser
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const response = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaLengkap: cleanName,
          whatsapp: validWa,
          email: cleanEmail || undefined,
          fotoUrl: fotoProfil || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors({
          form: data.error || 'Terjadi kendala saat menyimpan pendaftaran. Silakan coba lagi.',
        });
        setIsSubmitting(false);
        submittingRef.current = false;
        return;
      }

      // Simpan juga ke localStorage sebagai bukti/riwayat lokal di peramban
      try {
        const existingRaw = localStorage.getItem(SUBMISSIONS_KEY);
        const existing: StoredSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push({
          whatsapp: validWa!,
          email: cleanEmail || undefined,
          nama: cleanName,
          wilayah: formData.wilayah,
        });
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(existing));

        // Simpan profil pengguna aktif lokal untuk ruang anggota
        const userProfile = {
          nama: cleanName,
          angkatan: formData.angkatan,
          prodi: formData.prodi,
          wilayah: formData.wilayah,
          whatsapp: validWa,
          email: cleanEmail || undefined,
          pekerjaan: formData.pekerjaan || undefined,
          perusahaan: formData.perusahaan || undefined,
          fotoUrl: fotoProfil || undefined,
          tampilDiDirektori: formData.tampilDiDirektori,
          siapMentoring: formData.siapMentoring,
        };
        localStorage.setItem('ikaums_current_user_profile', JSON.stringify(userProfile));
      } catch {
        // Abaikan error penyimpanan lokal
      }

      setNormalizedWa(validWa!);
      setIsSubmitting(false);
      submittingRef.current = false;
      setSubmitted(true);
    } catch {
      setFieldErrors({
        form: 'Gagal terhubung ke server pendaftaran. Pastikan jaringan internet aktif lalu coba lagi.',
      });
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const shareText = encodeURIComponent(
    `Assalamualaikum rekan alumni UMS di Jabodetabek, pendataan awal anggota & pemetaan kopdar pertama IKA UMS Wilayah Jabodetabek sudah dibuka. Silakan daftar lewat tautan ini: https://ikaums.vercel.app/gabung`
  );
  const whatsappShareUrl = `https://wa.me/?text=${shareText}`;

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow  w-full">
        {!submitted ? (
          <>
            <section className="bg-slate-50 border-b border-slate-200">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-7 sm:pt-8 sm:pb-8">
                <nav aria-label="Breadcrumb" className="text-sm text-[#475569] mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
                      Beranda
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-[#0C2340] font-medium">Daftar</span>
                  </div>
                  {IS_DEMO_MODE && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-xs font-semibold">
                      {DEMO_BADGE_LABEL}
                    </span>
                  )}
                </nav>

                <header className="space-y-1.5 sm:space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340] leading-tight">
                    Daftar Anggota
                  </h1>
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl">
                    Pendataan awal alumni UMS di Jabodetabek untuk silaturahmi &amp; info kopdar.
                  </p>
                </header>
              </div>
            </section>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full relative z-[1]">
            <form
              onSubmit={handleSubmit}
              className="surface-card rounded-2xl p-6 sm:p-8 space-y-6"
              noValidate
            >
              {/* Honeypot anti-spam */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website-field">Kosongkan kolom ini</label>
                <input
                  id="website-field"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              {fieldErrors.form && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                  <span>{fieldErrors.form}</span>
                </div>
              )}

              {/* Langkah 1: Data Inti */}
              <fieldset className="space-y-6">
                <legend className="text-base sm:text-lg font-bold text-[#0C2340] pb-2.5 border-b border-slate-200 w-full flex items-center justify-between">
                  <span>Data Anggota</span>
                  <span className="text-xs font-semibold text-[#92400E] bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                    Wajib
                  </span>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* Unggah Foto Profil Akun - Cozy Card */}
                  <div className="sm:col-span-2 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-slate-50/80 p-4 sm:p-5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                      <div className="relative shrink-0">
                        {fotoProfil ? (
                          <div className="relative h-20 w-20 sm:h-22 sm:w-22 overflow-hidden rounded-full ring-4 ring-amber-100 border-2 border-[#D97706] shadow-sm">
                            <Image
                              src={fotoProfil}
                              alt="Pratinjau foto profil alumni"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                fileInputRef.current?.click();
                              }
                            }}
                            className="flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-full ring-4 ring-slate-100 border-2 border-dashed border-amber-300/80 bg-white text-slate-400 hover:border-[#D97706] hover:text-[#D97706] transition-all cursor-pointer group"
                            aria-label="Sentuh untuk memilih foto profil"
                          >
                            <Camera className="h-7 w-7 sm:h-8 sm:w-8 text-amber-600/70 group-hover:scale-110 transition-transform" aria-hidden="true" />
                          </div>
                        )}
                        {fotoProfil && (
                          <button
                            type="button"
                            onClick={handleRemoveFoto}
                            className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
                            aria-label="Hapus foto profil"
                            title="Hapus foto profil"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <label htmlFor="foto-profil-input" className="text-sm sm:text-base font-bold text-[#0C2340] cursor-pointer">
                            Foto Profil
                          </label>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100/80 text-[#92400E] font-semibold">
                            Opsional
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Untuk kartu anggota digital &amp; direktori (JPG, PNG, WebP maks. 3 MB).
                        </p>

                        <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <input
                            ref={fileInputRef}
                            id="foto-profil-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex min-h-[44px] items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#0C2340] hover:bg-slate-50 text-xs sm:text-sm font-semibold text-[#0C2340] transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                          >
                            <Upload className="h-3.5 w-3.5 text-[#D97706]" />
                            <span>{fotoProfil ? 'Ganti Foto' : 'Pilih Foto dari HP'}</span>
                          </button>

                          {fotoProfil && (
                            <button
                              type="button"
                              onClick={handleRemoveFoto}
                              className="inline-flex min-h-[44px] items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            >
                              Hapus
                            </button>
                          )}

                          {fotoProfilName && (
                            <span className="text-xs text-slate-500 truncate max-w-[170px] self-center">
                              ✓ {fotoProfilName}
                            </span>
                          )}
                        </div>

                        {fotoError && (
                          <p className="text-xs text-red-600 font-medium pt-0.5">
                            {fotoError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="namaLengkap" className="block text-sm sm:text-base font-bold text-[#0C2340]">
                      Nama Lengkap <span className="text-[#92400E]">*</span>
                    </label>
                    <input
                      id="namaLengkap"
                      type="text"
                      required
                      autoComplete="name"
                      aria-invalid={fieldErrors.namaLengkap ? 'true' : undefined}
                      aria-describedby={fieldErrors.namaLengkap ? 'hint-nama err-nama' : 'hint-nama'}
                      placeholder="Contoh: Ir. Bagus Prasetyo, S.T., M.T."
                      value={formData.namaLengkap}
                      onChange={(e) => {
                        setFormData({ ...formData, namaLengkap: e.target.value });
                        setNameSuggestion(null);
                        clearError('namaLengkap');
                      }}
                      onBlur={suggestNameFormat}
                      className={`w-full min-h-[50px] sm:min-h-[52px] px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] placeholder:text-slate-400 border transition-all shadow-2xs focus:bg-white focus:outline-hidden focus:ring-4 ${
                        fieldErrors.namaLengkap
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-slate-300/80 focus:border-[#0C2340] focus:ring-amber-500/15'
                      }`}
                    />
                    <p id="hint-nama" className="text-xs text-[#475569]">
                      Sertakan gelar akademik atau profesi bila ada. Kami dapat membantu merapikan formatnya.
                    </p>
                    {nameSuggestion && (
                      <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-[#713F12]">
                        <span className="inline-flex items-center gap-2 min-w-0">
                          <Sparkles className="h-4 w-4 shrink-0 text-[#92400E]" aria-hidden="true" />
                          <span className="break-words">Saran format: <strong>{nameSuggestion}</strong></span>
                        </span>
                        <button type="button" onClick={applyNameSuggestion} className="min-h-[36px] shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0C2340] ring-1 ring-[#0C2340]/15 transition-colors hover:bg-[#FDFCF7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]">
                          Gunakan
                        </button>
                      </div>
                    )}
                    {fieldErrors.namaLengkap && (
                      <p id="err-nama" className="text-xs sm:text-sm text-red-700 font-medium pt-0.5">
                        {fieldErrors.namaLengkap}
                      </p>
                    )}
                  </div>

                  {/* Tahun Angkatan */}
                  <div className="space-y-1.5">
                    <label htmlFor="angkatan" className="block text-sm sm:text-base font-bold text-[#0C2340]">
                      Tahun Angkatan Masuk UMS <span className="text-[#92400E]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="angkatan"
                        required
                        aria-invalid={fieldErrors.angkatan ? 'true' : undefined}
                        aria-describedby={fieldErrors.angkatan ? 'err-angkatan' : undefined}
                        value={formData.angkatan}
                        onChange={(e) => {
                          setFormData({ ...formData, angkatan: e.target.value });
                          clearError('angkatan');
                        }}
                        className={`w-full min-h-[50px] sm:min-h-[52px] appearance-none pl-4 pr-11 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] border transition-all shadow-2xs focus:bg-white focus:outline-hidden focus:ring-4 ${
                          fieldErrors.angkatan
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-slate-300/80 focus:border-[#0C2340] focus:ring-amber-500/15'
                        }`}
                      >
                        <option value="">Pilih Tahun Angkatan</option>
                        {ANGKATAN_OPTIONS.map((tahun) => (
                          <option key={tahun} value={tahun}>
                            Angkatan {tahun}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {fieldErrors.angkatan && (
                      <p id="err-angkatan" className="text-xs sm:text-sm text-red-700 font-medium pt-0.5">
                        {fieldErrors.angkatan}
                      </p>
                    )}
                  </div>

                  {/* Program Studi */}
                  <div className="space-y-1.5">
                    <label htmlFor="prodi" className="block text-sm sm:text-base font-bold text-[#0C2340]">
                      Program Studi di UMS <span className="text-[#92400E]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="prodi"
                        required
                        aria-invalid={fieldErrors.prodi ? 'true' : undefined}
                        aria-describedby={fieldErrors.prodi ? 'err-prodi' : undefined}
                        value={formData.prodi}
                        onChange={(e) => {
                          setFormData({ ...formData, prodi: e.target.value });
                          clearError('prodi');
                        }}
                        className={`w-full min-h-[50px] sm:min-h-[52px] appearance-none pl-4 pr-11 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] border transition-all shadow-2xs focus:bg-white focus:outline-hidden focus:ring-4 ${
                          fieldErrors.prodi
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-slate-300/80 focus:border-[#0C2340] focus:ring-amber-500/15'
                        }`}
                      >
                        <option value="">Pilih Program Studi</option>
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
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {fieldErrors.prodi && (
                      <p id="err-prodi" className="text-xs sm:text-sm text-red-700 font-medium pt-0.5">
                        {fieldErrors.prodi}
                      </p>
                    )}
                  </div>

                  {/* Wilayah Domisili */}
                  <div className="space-y-1.5">
                    <label htmlFor="wilayah" className="block text-sm sm:text-base font-bold text-[#0C2340]">
                      Wilayah Domisili Jabodetabek <span className="text-[#92400E]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="wilayah"
                        required
                        aria-invalid={fieldErrors.wilayah ? 'true' : undefined}
                        value={formData.wilayah}
                        onChange={(e) => {
                          setFormData({ ...formData, wilayah: e.target.value });
                          clearError('wilayah');
                        }}
                        className="w-full min-h-[50px] sm:min-h-[52px] appearance-none pl-4 pr-11 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] border border-slate-300/80 transition-all shadow-2xs focus:bg-white focus:border-[#0C2340] focus:outline-hidden focus:ring-4 focus:ring-amber-500/15"
                      >
                        {WILAYAH_JABODETABEK.map((reg) => (
                          <option key={reg.id} value={reg.nama}>
                            {reg.nama}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Nomor WhatsApp */}
                  <div className="space-y-1.5">
                    <label htmlFor="whatsapp" className="block text-sm sm:text-base font-bold text-[#0C2340]">
                      Nomor WhatsApp Aktif <span className="text-[#92400E]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 min-h-[50px] sm:min-h-[52px] bg-slate-100 border border-r-0 border-slate-300/80 rounded-l-xl sm:rounded-l-2xl text-sm sm:text-base font-bold text-[#0C2340] select-none shrink-0">
                        🇮🇩 +62
                      </span>
                      <input
                        id="whatsapp"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        aria-invalid={fieldErrors.whatsapp ? 'true' : undefined}
                        aria-describedby={fieldErrors.whatsapp ? 'hint-wa err-wa' : 'hint-wa'}
                        placeholder="812-3456-7890"
                        value={formData.whatsapp}
                        onChange={(e) => {
                          setFormData({ ...formData, whatsapp: e.target.value });
                          clearError('whatsapp');
                        }}
                        className={`w-full min-h-[50px] sm:min-h-[52px] px-4 py-3 rounded-r-xl sm:rounded-r-2xl rounded-l-none bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] placeholder:text-slate-400 border transition-all shadow-2xs focus:bg-white focus:outline-hidden focus:ring-4 ${
                          fieldErrors.whatsapp
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-slate-300/80 focus:border-[#0C2340] focus:ring-amber-500/15'
                        }`}
                      />
                    </div>
                    <p id="hint-wa" className="text-xs text-[#475569]">
                      Untuk verifikasi &amp; info kopdar (tidak tampil ke publik).
                    </p>
                    {fieldErrors.whatsapp && (
                      <p id="err-wa" className="text-xs sm:text-sm text-red-700 font-medium pt-0.5">
                        {fieldErrors.whatsapp}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="email" className="block text-sm sm:text-base font-bold text-[#0C2340]">
                      Alamat Email <span className="text-sm font-normal text-[#475569]">(Opsional)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={fieldErrors.email ? 'true' : undefined}
                      aria-describedby={fieldErrors.email ? 'hint-email err-email' : 'hint-email'}
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        clearError('email');
                      }}
                      className={`w-full min-h-[50px] sm:min-h-[52px] px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] placeholder:text-slate-400 border transition-all shadow-2xs focus:bg-white focus:outline-hidden focus:ring-4 ${
                        fieldErrors.email
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-slate-300/80 focus:border-[#0C2340] focus:ring-amber-500/15'
                      }`}
                    />
                    <p id="hint-email" className="text-xs text-[#475569]">
                      Untuk opsi masuk akun tanpa kata sandi.
                    </p>
                    {fieldErrors.email && (
                      <p id="err-email" className="text-xs sm:text-sm text-red-700 font-medium pt-0.5">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Langkah 2 (Opsional & Dapat Dilewati) */}
              <div className="border-t border-slate-200/90 pt-5">
                <button
                  type="button"
                  onClick={() => setShowOptional((v) => !v)}
                  aria-expanded={showOptional}
                  className="w-full min-h-[48px] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#0C2340] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>Pekerjaan &amp; Mentoring</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                      Opsional
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-slate-500 transition-transform ${showOptional ? 'rotate-180' : ''}`}
                  />
                </button>

                {showOptional && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                    <div className="space-y-1.5">
                      <label htmlFor="pekerjaan" className="block text-sm sm:text-base font-bold text-[#0C2340]">
                        Profesi / Bidang Kerja
                      </label>
                      <input
                        id="pekerjaan"
                        type="text"
                        autoComplete="organization-title"
                        placeholder="Contoh: Software Engineer, Wirausaha, Dokter"
                        value={formData.pekerjaan}
                        onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                        className="w-full min-h-[50px] sm:min-h-[52px] px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] placeholder:text-slate-400 border border-slate-300/80 transition-all shadow-2xs focus:bg-white focus:border-[#0C2340] focus:outline-hidden focus:ring-4 focus:ring-amber-500/15"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="perusahaan" className="block text-sm sm:text-base font-bold text-[#0C2340]">
                        Instansi / Tempat Usaha
                      </label>
                      <input
                        id="perusahaan"
                        type="text"
                        autoComplete="organization"
                        placeholder="Nama kantor atau brand usaha sendiri"
                        value={formData.perusahaan}
                        onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                        className="w-full min-h-[50px] sm:min-h-[52px] px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] placeholder:text-slate-400 border border-slate-300/80 transition-all shadow-2xs focus:bg-white focus:border-[#0C2340] focus:outline-hidden focus:ring-4 focus:ring-amber-500/15"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-3 pt-1">
                      <label
                        htmlFor="siapMentoring"
                        className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                          formData.siapMentoring
                            ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20 shadow-2xs'
                            : 'bg-white border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <input
                          id="siapMentoring"
                          type="checkbox"
                          checked={formData.siapMentoring}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData({
                              ...formData,
                              siapMentoring: checked,
                              mentorContactConsent: checked ? formData.mentorContactConsent : false,
                            });
                            if (!checked) clearError('mentorContactConsent');
                          }}
                          className="mt-1 w-5 h-5 rounded-md border-slate-300 text-[#0C2340] accent-[#0C2340] shrink-0"
                        />
                        <div className="space-y-0.5 text-sm sm:text-base leading-relaxed">
                          <span className="font-bold text-[#0C2340] block">
                            Bersedia Menjadi Mentor Alumni
                          </span>
                          <span className="text-[#475569] block text-xs sm:text-sm">
                            Berbagi pengalaman karier &amp; diskusi profesi dengan sesama alumni UMS.
                          </span>
                        </div>
                      </label>

                      {formData.siapMentoring && (
                        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-1">
                          <label
                            htmlFor="mentorContactConsent"
                            className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-[#0C2340] leading-relaxed"
                          >
                            <input
                              id="mentorContactConsent"
                              type="checkbox"
                              aria-invalid={fieldErrors.mentorContactConsent ? 'true' : undefined}
                              aria-describedby={
                                fieldErrors.mentorContactConsent ? 'err-mentor-contact' : undefined
                              }
                              checked={formData.mentorContactConsent}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  mentorContactConsent: e.target.checked,
                                });
                                clearError('mentorContactConsent');
                              }}
                              className="mt-0.5 w-4.5 h-4.5 rounded-md border-slate-300 text-[#0C2340] accent-[#0C2340] shrink-0"
                            />
                            <span>
                              Izinkan pengurus menghubungkan kontak dengan pemohon mentoring terverifikasi.{' '}
                              <span className="text-[#92400E] font-semibold">*</span>
                            </span>
                          </label>
                          {fieldErrors.mentorContactConsent && (
                            <p id="err-mentor-contact" className="pl-8 text-xs sm:text-sm text-red-700 font-medium pt-1">
                              {fieldErrors.mentorContactConsent}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Izin Penggunaan Data & Persetujuan - Cozy Card */}
              <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#92400E]">
                  Persetujuan Privasi
                </span>

                <label
                  htmlFor="agreeConsent"
                  className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.agreeConsent
                      ? 'bg-white border-[#0C2340]/30 shadow-2xs'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    id="agreeConsent"
                    type="checkbox"
                    aria-invalid={fieldErrors.agreeConsent ? 'true' : undefined}
                    aria-describedby={fieldErrors.agreeConsent ? 'err-consent' : undefined}
                    checked={formData.agreeConsent}
                    onChange={(e) => {
                      setFormData({ ...formData, agreeConsent: e.target.checked });
                      clearError('agreeConsent');
                    }}
                    className="mt-0.5 w-4.5 h-4.5 rounded-md border-slate-300 text-[#0C2340] accent-[#0C2340] shrink-0"
                  />
                  <div className="space-y-0.5 text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-[#0C2340] block">
                      Persetujuan Privasi &amp; Verifikasi <span className="text-[#92400E]">*</span>
                    </span>
                    <span className="text-[#475569] block">
                      Saya menyetujui Kebijakan Privasi &amp; Ketentuan Komunitas IKA UMS untuk verifikasi data alumni.
                    </span>
                  </div>
                </label>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-1">
                  <Link
                    href="/privasi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 min-h-[40px] text-xs font-semibold text-[#0C2340] hover:text-[#92400E] underline underline-offset-2"
                  >
                    <span>Kebijakan Privasi</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <Link
                    href="/syarat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 min-h-[40px] text-xs font-semibold text-[#0C2340] hover:text-[#92400E] underline underline-offset-2"
                  >
                    <span>Ketentuan Komunitas</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {fieldErrors.agreeConsent && (
                  <p id="err-consent" className="text-xs text-red-700 font-medium pl-1">
                    {fieldErrors.agreeConsent}
                  </p>
                )}

                <div className="pt-2.5 border-t border-slate-200">
                  <label
                    htmlFor="tampilDiDirektori"
                    className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                      formData.tampilDiDirektori
                        ? 'bg-white border-[#0C2340]/30 shadow-2xs'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      id="tampilDiDirektori"
                      type="checkbox"
                      checked={formData.tampilDiDirektori}
                      onChange={(e) => setFormData({ ...formData, tampilDiDirektori: e.target.checked })}
                      className="mt-0.5 w-4.5 h-4.5 rounded-md border-slate-300 text-[#0C2340] accent-[#0C2340] shrink-0"
                    />
                    <div className="space-y-0.5 text-xs sm:text-sm leading-relaxed text-[#475569]">
                      <span className="font-bold text-[#0C2340] block">
                        Tampilkan Profil di Direktori
                      </span>
                      <span>
                        WhatsApp &amp; email dirahasiakan; hanya nama, prodi, angkatan &amp; kota yang terlihat sesama anggota.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA Bottom */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <span className="text-xs text-[#475569]">
                  Verifikasi cepat {COMMUNITY_PLACEHOLDERS.verificationSla}.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[52px] px-8 py-3.5 rounded-xl sm:rounded-2xl bg-[#0C2340] hover:bg-[#16325C] active:scale-[0.98] disabled:opacity-60 text-white text-base font-bold transition-all duration-150 cursor-pointer shadow-md shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#F59E0B]" />
                      <span>Mengirim pendaftaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Jadi Anggota</span>
                      <ArrowRight className="w-5 h-5 text-[#F59E0B]" />
                    </>
                  )}
                </button>
              </div>
            </form>
            </div>
          </>
        ) : (
          <div className="pattern-surface pattern-dots pattern-tone-light pattern-fade-soft-edges py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto relative z-[1]">
              <section className="surface-card rounded-2xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-6">
            <div className="relative mx-auto">
              {fotoProfil ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#D97706] shadow-md mx-auto">
                  <Image
                    src={fotoProfil}
                    alt={formData.namaLengkap}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <p className="text-base font-semibold text-[#92400E]">
                Pendaftaran Tercatat
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
                Terima kasih, {formData.namaLengkap}
              </h1>
              <p className="text-base text-[#475569] leading-[1.6]">
                Data kamu ({formData.prodi}, Angkatan {formData.angkatan}, domisili{' '}
                <strong className="text-[#0C2340]">{formData.wilayah}</strong>) telah dicatat dengan
                nomor WhatsApp <strong className="text-[#0C2340]">{normalizedWa}</strong>.
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-left space-y-4 shadow-2xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/70">
                <div className="w-7 h-7 rounded-lg bg-[#0C2340]/5 text-[#D97706] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="font-bold text-[#0C2340] text-base">Apa langkah selanjutnya?</p>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-[#475569] leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-[#92400E] font-bold text-xs flex items-center justify-center mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#0C2340] font-semibold">Verifikasi Pengurus: </strong>
                    Data alumni kamu akan divalidasi oleh pengurus wilayah secara bertahap.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-[#92400E] font-bold text-xs flex items-center justify-center mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#0C2340] font-semibold">Undangan Kopdar: </strong>
                    Kamu akan dihubungi via WhatsApp ketika jadwal temu alumni di{' '}
                    <strong className="text-[#0C2340]">{formData.wilayah}</strong> diagendakan.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-[#92400E] font-bold text-xs flex items-center justify-center mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#0C2340] font-semibold">Izin Direktori: </strong>
                    Status:{' '}
                    <span className="font-semibold text-[#0C2340]">
                      {formData.tampilDiDirektori
                        ? 'Boleh tampil di direktori (setelah diverifikasi)'
                        : 'Privat (tidak ditampilkan publik)'}
                    </span>.
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-xs sm:text-sm text-slate-500">
                  Jika perlu memperbarui atau menghapus data, hubungi sekretariat di{' '}
                  <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactWhatsapp}</span>.
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3 w-full">
              {/* Tombol Aksi Utama (2 Kolom Lebar & Proporsional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:scale-[0.99] text-white text-sm sm:text-base font-bold transition-all shadow-sm"
                >
                  <span>Buka Ruang Anggota</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-[#0C2340] hover:bg-[#16325C] active:scale-[0.99] text-white text-sm sm:text-base font-semibold transition-all shadow-sm"
                >
                  <Share2 className="w-4 h-4 text-[#F59E0B]" />
                  <span>Bagikan ke Grup Alumni</span>
                </a>
              </div>

              {/* Tombol Aksi Sekunder (Elegan, Tenang, Rapi) */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ubah data formulir</span>
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kembali ke Beranda</span>
                </Link>
              </div>
            </div>
          </section>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

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
  const submittingRef = useRef(false);

  // Upload foto profil akun
  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [fotoProfilName, setFotoProfilName] = useState<string | null>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                    <span className="text-[#0C2340] font-medium">Daftar Jadi Anggota</span>
                  </div>
                  {IS_DEMO_MODE && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-xs font-semibold">
                      {DEMO_BADGE_LABEL}
                    </span>
                  )}
                </nav>

                <header className="space-y-2.5">
                  <h1 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.375rem)] font-bold tracking-[-0.02em] text-[#0C2340] leading-[1.15]">
                    Daftar Jadi Anggota IKA UMS Jabodetabek
                  </h1>
                  <p className="text-base text-[#475569] leading-[1.6] max-w-[44ch] sm:max-w-2xl">
                    Isi 5 data dasar di bawah agar pengurus bisa mencocokkan latar kuliahmu di UMS dan
                    mengabari jadwal kopdar wilayahmu lewat WhatsApp. Gratis dan tanpa kata sandi.
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
              <fieldset className="space-y-5">
                <legend className="text-base font-bold text-[#0C2340] pb-2 border-b border-slate-200 w-full">
                  Data Dasar Alumni (Wajib)
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Unggah Foto Profil Akun */}
                  <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 mx-auto sm:mx-0">
                        {fotoProfil ? (
                          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#D97706] shadow-xs">
                            <Image
                              src={fotoProfil}
                              alt="Pratinjau foto profil alumni"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-slate-400">
                            <Camera className="h-8 w-8 text-slate-400" aria-hidden="true" />
                          </div>
                        )}
                        {fotoProfil && (
                          <button
                            type="button"
                            onClick={handleRemoveFoto}
                            className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-xs hover:bg-red-700 transition-colors cursor-pointer"
                            aria-label="Hapus foto profil"
                            title="Hapus foto profil"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <label htmlFor="foto-profil-input" className="text-sm font-bold text-[#0C2340] cursor-pointer">
                            Foto Profil Akun
                          </label>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-medium">
                            Opsional
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Foto ini digunakan pada kartu anggota digital dan ruang akun IKA UMS. Format JPG, PNG, atau WebP (maks. 3 MB).
                        </p>

                        <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
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
                            className="inline-flex min-h-[44px] items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:border-[#0C2340] hover:bg-slate-50 text-xs sm:text-sm font-semibold text-[#0C2340] transition-colors shadow-2xs cursor-pointer"
                          >
                            <Upload className="h-4 w-4 text-[#D97706]" />
                            <span>{fotoProfil ? 'Ganti Foto' : 'Unggah Foto Profil'}</span>
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
                            <span className="text-xs text-slate-500 truncate max-w-[180px]">
                              {fotoProfilName}
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

                  <div className="sm:col-span-2">
                    <label htmlFor="namaLengkap" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                      Nama Lengkap dengan Gelar <span className="text-[#92400E]">*</span>
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
                        clearError('namaLengkap');
                      }}
                      className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-white border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                        fieldErrors.namaLengkap
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                      }`}
                    />
                    <p id="hint-nama" className="mt-1.5 text-base text-[#475569] leading-[1.5]">
                      Boleh cantumkan gelar akademik atau profesi sesuai penulisan resmi.
                    </p>
                    {fieldErrors.namaLengkap && (
                      <p id="err-nama" className="mt-1 text-sm text-red-700 font-medium">
                        {fieldErrors.namaLengkap}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="angkatan" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                      Tahun Angkatan Masuk UMS <span className="text-[#92400E]">*</span>
                    </label>
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
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                        fieldErrors.angkatan
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                      }`}
                    >
                      <option value="">Pilih Tahun Angkatan</option>
                      {ANGKATAN_OPTIONS.map((tahun) => (
                        <option key={tahun} value={tahun}>
                          Angkatan {tahun}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.angkatan && (
                      <p id="err-angkatan" className="mt-1.5 text-sm text-red-700 font-medium">
                        {fieldErrors.angkatan}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="prodi" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                      Program Studi di UMS <span className="text-[#92400E]">*</span>
                    </label>
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
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                        fieldErrors.prodi
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
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
                    {fieldErrors.prodi && (
                      <p id="err-prodi" className="mt-1.5 text-sm text-red-700 font-medium">
                        {fieldErrors.prodi}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="wilayah" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                      Wilayah Domisili Jabodetabek <span className="text-[#92400E]">*</span>
                    </label>
                    <select
                      id="wilayah"
                      required
                      aria-invalid={fieldErrors.wilayah ? 'true' : undefined}
                      value={formData.wilayah}
                      onChange={(e) => {
                        setFormData({ ...formData, wilayah: e.target.value });
                        clearError('wilayah');
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-base text-[#0C2340]"
                    >
                      {WILAYAH_JABODETABEK.map((reg) => (
                        <option key={reg.id} value={reg.nama}>
                          {reg.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                      Nomor WhatsApp Aktif <span className="text-[#92400E]">*</span>
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      aria-invalid={fieldErrors.whatsapp ? 'true' : undefined}
                      aria-describedby={fieldErrors.whatsapp ? 'hint-wa err-wa' : 'hint-wa'}
                      placeholder="Contoh: 081234567890 atau +62812..."
                      value={formData.whatsapp}
                      onChange={(e) => {
                        setFormData({ ...formData, whatsapp: e.target.value });
                        clearError('whatsapp');
                      }}
                      className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-white border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                        fieldErrors.whatsapp
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                      }`}
                    />
                    <p id="hint-wa" className="mt-1.5 text-base text-[#475569] leading-[1.5]">
                      Hanya untuk verifikasi dan undangan kopdar wilayah. Tidak tampil ke publik.
                    </p>
                    {fieldErrors.whatsapp && (
                      <p id="err-wa" className="mt-1 text-sm text-red-700 font-medium">
                        {fieldErrors.whatsapp}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
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
                      className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-white border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                        fieldErrors.email
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                      }`}
                    />
                    <p id="hint-email" className="mt-1.5 text-base text-[#475569] leading-[1.5]">
                      Disiapkan jika nanti ingin masuk akun lewat tautan email.
                    </p>
                    {fieldErrors.email && (
                      <p id="err-email" className="mt-1 text-sm text-red-700 font-medium">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Langkah 2 (Opsional & Dapat Dilewati) */}
              <div className="border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowOptional((v) => !v)}
                  aria-expanded={showOptional}
                  className="w-full min-h-[44px] flex items-center justify-between text-left text-base font-bold text-[#0C2340] hover:text-[#92400E] transition-colors cursor-pointer"
                >
                  <span>Pekerjaan &amp; Kesediaan Mentoring (Opsional, bisa diisi nanti)</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${showOptional ? 'rotate-180' : ''}`}
                  />
                </button>

                {showOptional && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                    <div>
                      <label htmlFor="pekerjaan" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                        Profesi / Bidang Kerja
                      </label>
                      <input
                        id="pekerjaan"
                        type="text"
                        autoComplete="organization-title"
                        placeholder="Misalnya: Analis Keuangan, Wirausaha, Guru"
                        value={formData.pekerjaan}
                        onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-white border border-slate-300 focus:border-[#0C2340] focus:outline-hidden text-base text-[#0C2340]"
                      />
                    </div>
                    <div>
                      <label htmlFor="perusahaan" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                        Instansi / Usaha
                      </label>
                      <input
                        id="perusahaan"
                        type="text"
                        autoComplete="organization"
                        placeholder="Nama perusahaan atau usaha sendiri"
                        value={formData.perusahaan}
                        onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-white border border-slate-300 focus:border-[#0C2340] focus:outline-hidden text-base text-[#0C2340]"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label htmlFor="siapMentoring" className="flex items-start gap-3 min-h-[44px] py-2 cursor-pointer text-base text-[#334155] leading-[1.5]">
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
                          className="mt-1.5 w-4 h-4 rounded border-slate-300 accent-[#0C2340]"
                        />
                        <span>
                          Saya bersedia menjadi mentor sukarela (ulas CV, persiapan wawancara, atau diskusi bidang kerja) untuk sesama alumni UMS.
                        </span>
                      </label>

                      {formData.siapMentoring && (
                        <div className="ml-0 sm:ml-7 bg-slate-100 border border-slate-200 rounded-xl p-3.5">
                          <label
                            htmlFor="mentorContactConsent"
                            className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer text-base text-[#0C2340] leading-[1.5]"
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
                              className="mt-1.5 w-4 h-4 rounded border-slate-300 accent-[#0C2340]"
                            />
                            <span>
                              Saya mengizinkan pengurus meneruskan nomor WhatsApp atau email saya kepada pemohon mentoring terverifikasi saat dijadwalkan.{' '}
                              <span className="text-[#92400E] font-semibold">*</span>
                            </span>
                          </label>
                          {fieldErrors.mentorContactConsent && (
                            <p id="err-mentor-contact" className="mt-1 pl-7 text-sm text-red-700 font-medium">
                              {fieldErrors.mentorContactConsent}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Persetujuan Terpisah */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
                <span className="block text-sm font-bold uppercase tracking-wider text-[#0C2340]">
                  Izin Penggunaan Data
                </span>

                <label htmlFor="agreeConsent" className="flex items-start gap-3 min-h-[44px] py-1.5 cursor-pointer text-base text-[#0C2340] font-medium leading-[1.5]">
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
                    className="mt-1.5 w-4 h-4 rounded border-slate-300 accent-[#0C2340] shrink-0"
                  />
                  <span>
                    Saya menyetujui Kebijakan Privasi dan Ketentuan Komunitas agar data ini dicatat pengurus untuk verifikasi alumni dan kabar kopdar.{' '}
                    <span className="text-[#92400E]">*</span>
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-7">
                  <Link
                    href="/privasi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 min-h-[44px] px-1 text-sm sm:text-base font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 hover:text-[#92400E]"
                  >
                    <span>Kebijakan Privasi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/syarat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 min-h-[44px] px-1 text-sm sm:text-base font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 hover:text-[#92400E]"
                  >
                    <span>Ketentuan Komunitas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {fieldErrors.agreeConsent && (
                  <p id="err-consent" className="text-sm text-red-700 font-medium pl-7">
                    {fieldErrors.agreeConsent}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-200">
                  <label htmlFor="tampilDiDirektori" className="flex items-start gap-3 min-h-[44px] py-1.5 cursor-pointer text-base text-[#475569] leading-[1.5]">
                    <input
                      id="tampilDiDirektori"
                      type="checkbox"
                      checked={formData.tampilDiDirektori}
                      onChange={(e) => setFormData({ ...formData, tampilDiDirektori: e.target.checked })}
                      className="mt-1.5 w-4 h-4 rounded border-slate-300 accent-[#0C2340] shrink-0"
                    />
                    <span>
                      Saya mengizinkan nama, prodi, angkatan, dan wilayah domisili saya tampil di Daftar Anggota khusus anggota terdaftar.{' '}
                      <strong className="font-semibold text-[#0C2340]">(Opsional: bawaan Tidak tampil. WhatsApp dan email tidak pernah ditampilkan.)</strong>
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-sm sm:text-base text-[#475569] leading-[1.5]">
                  Pemeriksaan data dilakukan {COMMUNITY_PLACEHOLDERS.verificationSla}.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] disabled:opacity-60 text-white text-base font-semibold transition-all duration-150 cursor-pointer shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                      <span>Mengirim pendaftaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar jadi anggota</span>
                      <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
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

            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 sm:p-5 text-left text-base text-[#334155] space-y-2 leading-[1.6]">
              <p className="font-bold text-[#0C2340]">Apa langkah selanjutnya?</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
                <li>
                  Pengurus wilayah akan memeriksa kesesuaian data alumni {COMMUNITY_PLACEHOLDERS.verificationSla}.
                </li>
                <li>
                  Setelah terdata, kamu akan dihubungi lewat WhatsApp ketika jadwal kopdar pertama di{' '}
                  <strong className="text-[#0C2340]">{formData.wilayah}</strong> ditetapkan.
                </li>
                <li>
                  Status izin Daftar Anggota kamu:{' '}
                  <strong className="text-[#0C2340]">
                    {formData.tampilDiDirektori ? 'Boleh tampil (setelah anggota masuk)' : 'Tidak ditampilkan'}
                  </strong>.
                </li>
                <li>
                  Jika perlu memperbarui atau menghapus data, hubungi pengurus di{' '}
                  <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactWhatsapp}</span>.
                </li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold transition-colors shadow-2xs"
              >
                <span>Buka Ruang Anggota</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#F59E0B]" />
                Bagikan ke grup WhatsApp alumni
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0C2340] text-sm font-semibold transition-colors cursor-pointer"
              >
                Ubah data formulir
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Kembali ke Beranda
              </Link>
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

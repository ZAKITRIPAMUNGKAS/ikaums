'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  MapPin,
  Phone,
  ExternalLink,
} from 'lucide-react';
import {
  WILAYAH_JABODETABEK,
  FAKULTAS_PRODI_UMS,
  ANGKATAN_OPTIONS,
  normalizeIndonesianWhatsApp,
} from '@/data/ums-prodi';
import { formatIndonesianName } from '@/lib/name-format';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWilayah?: string;
}

export function RegisterModal({ isOpen, onClose, defaultWilayah }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    angkatan: '',
    prodi: '',
    wilayah: defaultWilayah || 'Jakarta Selatan',
    pekerjaan: '',
    whatsapp: '',
    tampilDiDirektori: true,
    agreeConsent: true,
    website: '', // honeypot anti spam
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [normalizedWa, setNormalizedWa] = useState('');
  const [formattedNameSuggestion, setFormattedNameSuggestion] = useState<string | null>(null);

  const [prevDefaultWilayah, setPrevDefaultWilayah] = useState(defaultWilayah);
  if (defaultWilayah && defaultWilayah !== prevDefaultWilayah) {
    setPrevDefaultWilayah(defaultWilayah);
    setFormData((prev) => ({ ...prev, wilayah: defaultWilayah }));
  }

  // Lock body scroll saat modal aktif
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNamaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, namaLengkap: value }));
    if (value.trim().length >= 3) {
      const formatted = formatIndonesianName(value);
      if (formatted !== value.trim()) {
        setFormattedNameSuggestion(formatted);
      } else {
        setFormattedNameSuggestion(null);
      }
    } else {
      setFormattedNameSuggestion(null);
    }
    if (errors.namaLengkap) {
      setErrors((prev) => ({ ...prev, namaLengkap: '' }));
    }
  };

  const applyNameSuggestion = () => {
    if (formattedNameSuggestion) {
      setFormData((prev) => ({ ...prev, namaLengkap: formattedNameSuggestion }));
      setFormattedNameSuggestion(null);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.namaLengkap.trim() || formData.namaLengkap.trim().length < 3) {
      errs.namaLengkap = 'Nama lengkap minimal 3 karakter.';
    }

    if (!formData.angkatan) {
      errs.angkatan = 'Pilih tahun angkatan masuk UMS.';
    }

    if (!formData.prodi) {
      errs.prodi = 'Pilih program studi Anda di UMS.';
    }

    if (!formData.wilayah) {
      errs.wilayah = 'Pilih wilayah domisili Jabodetabek.';
    }

    if (!formData.pekerjaan.trim()) {
      errs.pekerjaan = 'Pekerjaan atau profesi saat ini wajib diisi.';
    }

    const validWa = normalizeIndonesianWhatsApp(formData.whatsapp);
    if (!validWa) {
      errs.whatsapp = 'Nomor WhatsApp tidak valid (contoh: 08123456789 atau +628123456789).';
    }

    if (!formData.agreeConsent) {
      errs.agreeConsent = 'Centang persetujuan untuk melanjutkan pendaftaran.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const validWa = normalizeIndonesianWhatsApp(formData.whatsapp);

    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaLengkap: formData.namaLengkap.trim(),
          angkatan: Number(formData.angkatan),
          prodi: formData.prodi,
          wilayah: formData.wilayah,
          pekerjaan: formData.pekerjaan.trim(),
          whatsapp: validWa,
          tampilDiDirektori: formData.tampilDiDirektori,
          agreeConsent: formData.agreeConsent,
          website: formData.website,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors({ form: data.error || 'Terjadi kesalahan saat menyimpan pendaftaran.' });
        setIsSubmitting(false);
        return;
      }

      setNormalizedWa(validWa || formData.whatsapp);
      setIsSubmitted(true);
    } catch {
      setErrors({ form: 'Koneksi gagal. Silakan periksa jaringan dan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setFormData({
      namaLengkap: '',
      angkatan: '',
      prodi: '',
      wilayah: defaultWilayah || 'Jakarta Selatan',
      pekerjaan: '',
      whatsapp: '',
      tampilDiDirektori: true,
      agreeConsent: true,
      website: '',
    });
    setErrors({});
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pendaftaran-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup formulir pendaftaran"
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* TAMPILAN SUKSES PENDAFTARAN */
          <div className="p-5 sm:p-7 text-center space-y-5 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
                Pendaftaran Berhasil Dicatat
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0C2340]">
                Terima kasih, {formData.namaLengkap}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                Data kamu telah tercatat di basis data alumni IKA UMS Jabodetabek dan siap diverifikasi pengurus.
              </p>
            </div>

            {/* Badges Ringkasan */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-[#0C2340]" />
                <span>{formData.prodi} • {formData.angkatan}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{formData.wilayah}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{normalizedWa}</span>
              </span>
            </div>

            {/* Langkah Selanjutnya */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-[#0C2340]">
                <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                <span>Apa langkah berikutnya?</span>
              </div>
              <p>
                1. <strong>Verifikasi Pengurus:</strong> Data alumni divalidasi berkala oleh pengurus wilayah.
              </p>
              <p>
                2. <strong>Undangan Temu:</strong> Kamu akan dihubungi via WA saat jadwal temu di {formData.wilayah} diagendakan.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="space-y-2 pt-1">
              <Link
                href="/app"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-all shadow-xs"
              >
                <span>Buka Ruang Anggota</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </Link>
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Daftarkan Alumni Lain
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        ) : (
          /* FORMULIR PENDAFTARAN ANGGOTA */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/70 border border-amber-200/80 text-amber-900 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                Pendataan Alumni Jabodetabek
              </span>
              <h2
                id="modal-pendaftaran-heading"
                className="text-lg sm:text-xl font-extrabold text-[#0C2340] mt-1"
              >
                Daftar Jadi Anggota IKA UMS
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Gratis dan tanpa kata sandi. Isi 5 data dasar untuk terhubung dengan keluarga besar alumni UMS.
              </p>
            </div>

            {/* Form Body (Scrollable) */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              {errors.form && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="sr-only"
                aria-hidden="true"
              />

              {/* 1. Nama Lengkap */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-bold text-[#0C2340]">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Ihsan, S.T."
                  value={formData.namaLengkap}
                  onChange={(e) => handleNamaChange(e.target.value)}
                  className={`w-full min-h-[44px] rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white px-3.5 py-2 text-xs sm:text-sm transition-all focus:outline-hidden focus:ring-3 ${
                    errors.namaLengkap
                      ? 'border-red-400 focus:border-red-600 focus:ring-red-100'
                      : 'border-slate-300 focus:border-[#0C2340] focus:ring-amber-500/15'
                  }`}
                />
                {formattedNameSuggestion && (
                  <button
                    type="button"
                    onClick={applyNameSuggestion}
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#B45309] hover:underline pt-0.5 text-left cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>Rapikan kapitalisasi: <strong>{formattedNameSuggestion}</strong></span>
                  </button>
                )}
                {errors.namaLengkap && (
                  <p className="text-[11px] text-red-600">{errors.namaLengkap}</p>
                )}
              </div>

              {/* 2. Prodi & Angkatan (Grid 2 Kolom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-bold text-[#0C2340]">
                    Program Studi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.prodi}
                    onChange={(e) => {
                      setFormData({ ...formData, prodi: e.target.value });
                      if (errors.prodi) setErrors({ ...errors, prodi: '' });
                    }}
                    className={`w-full min-h-[44px] rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white px-3 py-2 text-xs transition-all focus:outline-hidden focus:ring-3 ${
                      errors.prodi
                        ? 'border-red-400 focus:border-red-600 focus:ring-red-100'
                        : 'border-slate-300 focus:border-[#0C2340] focus:ring-amber-500/15'
                    }`}
                  >
                    <option value="">Pilih Program Studi UMS</option>
                    {FAKULTAS_PRODI_UMS.map((item) => (
                      <optgroup key={item.fakultas} label={item.fakultas}>
                        {item.prodi.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.prodi && (
                    <p className="text-[11px] text-red-600">{errors.prodi}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-bold text-[#0C2340]">
                    Tahun Angkatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.angkatan}
                    onChange={(e) => {
                      setFormData({ ...formData, angkatan: e.target.value });
                      if (errors.angkatan) setErrors({ ...errors, angkatan: '' });
                    }}
                    className={`w-full min-h-[44px] rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white px-3 py-2 text-xs transition-all focus:outline-hidden focus:ring-3 ${
                      errors.angkatan
                        ? 'border-red-400 focus:border-red-600 focus:ring-red-100'
                        : 'border-slate-300 focus:border-[#0C2340] focus:ring-amber-500/15'
                    }`}
                  >
                    <option value="">Pilih Tahun Masuk</option>
                    {ANGKATAN_OPTIONS.map((th) => (
                      <option key={th} value={th}>
                        Angkatan {th}
                      </option>
                    ))}
                  </select>
                  {errors.angkatan && (
                    <p className="text-[11px] text-red-600">{errors.angkatan}</p>
                  )}
                </div>
              </div>

              {/* 3. Wilayah Domisili Jabodetabek */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-bold text-[#0C2340]">
                  Domisili Wilayah Jabodetabek <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.wilayah}
                  onChange={(e) => {
                    setFormData({ ...formData, wilayah: e.target.value });
                    if (errors.wilayah) setErrors({ ...errors, wilayah: '' });
                  }}
                  className={`w-full min-h-[44px] rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white px-3 py-2 text-xs sm:text-sm transition-all focus:outline-hidden focus:ring-3 ${
                    errors.wilayah
                      ? 'border-red-400 focus:border-red-600 focus:ring-red-100'
                      : 'border-slate-300 focus:border-[#0C2340] focus:ring-amber-500/15'
                  }`}
                >
                  {WILAYAH_JABODETABEK.map((w) => (
                    <option key={w.id} value={w.nama}>
                      {w.nama} — {w.cakupan}
                    </option>
                  ))}
                </select>
                {errors.wilayah && (
                  <p className="text-[11px] text-red-600">{errors.wilayah}</p>
                )}
              </div>

              {/* 4. Pekerjaan / Profesi Saat Ini */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-bold text-[#0C2340]">
                  Pekerjaan / Profesi Saat Ini <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Software Engineer, Guru, Wirausaha, Dokter, dll."
                  value={formData.pekerjaan}
                  onChange={(e) => {
                    setFormData({ ...formData, pekerjaan: e.target.value });
                    if (errors.pekerjaan) setErrors({ ...errors, pekerjaan: '' });
                  }}
                  className={`w-full min-h-[44px] rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white px-3.5 py-2 text-xs sm:text-sm transition-all focus:outline-hidden focus:ring-3 ${
                    errors.pekerjaan
                      ? 'border-red-400 focus:border-red-600 focus:ring-red-100'
                      : 'border-slate-300 focus:border-[#0C2340] focus:ring-amber-500/15'
                  }`}
                />
                {errors.pekerjaan && (
                  <p className="text-[11px] text-red-600">{errors.pekerjaan}</p>
                )}
              </div>

              {/* 5. Nomor WhatsApp */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-bold text-[#0C2340]">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.whatsapp}
                    onChange={(e) => {
                      setFormData({ ...formData, whatsapp: e.target.value });
                      if (errors.whatsapp) setErrors({ ...errors, whatsapp: '' });
                    }}
                    className={`w-full min-h-[44px] rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white px-3.5 py-2 text-xs sm:text-sm transition-all focus:outline-hidden focus:ring-3 ${
                      errors.whatsapp
                        ? 'border-red-400 focus:border-red-600 focus:ring-red-100'
                        : 'border-slate-300 focus:border-[#0C2340] focus:ring-amber-500/15'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Untuk konfirmasi validasi dan undangan jadwal temu alumni terdekat.
                </p>
                {errors.whatsapp && (
                  <p className="text-[11px] text-red-600">{errors.whatsapp}</p>
                )}
              </div>

              {/* 5. Checkbox Izin & Persetujuan */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.tampilDiDirektori}
                    onChange={(e) =>
                      setFormData({ ...formData, tampilDiDirektori: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0C2340] focus:ring-amber-500"
                  />
                  <span>Tampilkan nama & prodi saya di direktori publik alumni (nomor HP tetap aman & privat).</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.agreeConsent}
                    onChange={(e) => {
                      setFormData({ ...formData, agreeConsent: e.target.checked });
                      if (errors.agreeConsent) setErrors({ ...errors, agreeConsent: '' });
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0C2340] focus:ring-amber-500"
                  />
                  <span>
                    Saya menyatakan data ini benar alumni UMS dan menyetujui pendataan IKA UMS Jabodetabek. <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.agreeConsent && (
                  <p className="text-[11px] text-red-600">{errors.agreeConsent}</p>
                )}
              </div>

              {/* Tombol Submit & Tautan Formulir Penuh */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] hover:bg-[#16325C] active:scale-[0.99] text-white text-sm font-bold transition-all shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                      <span>Menyimpan pendaftaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Jadi Anggota Sekarang</span>
                      <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <Link
                    href="/gabung"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0C2340] hover:text-[#D97706] font-medium hover:underline transition-colors"
                  >
                    <span>Ingin upload foto profil? Buka formulir lengkap di /gabung</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

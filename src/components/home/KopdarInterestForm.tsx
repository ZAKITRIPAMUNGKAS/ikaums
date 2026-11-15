'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Share2,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Clock,
  User,
  Phone,
  Calendar,
} from 'lucide-react';
import { normalizeIndonesianWhatsApp, WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { COMMUNITY_PLACEHOLDERS } from '@/lib/config';
import { saveKopdarInterestEntry } from '@/lib/kopdar-interest';
import { cn } from '@/lib/utils';

const WAKTU_OPTIONS = [
  'Sabtu pagi (09.00–12.00 WIB)',
  'Sabtu sore (15.00–18.00 WIB)',
  'Minggu pagi (09.00–12.00 WIB)',
  'Hari kerja malam (19.00+ WIB)',
];

const QUICK_REGIONS = [
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Tangerang',
  'Bekasi',
  'Depok',
  'Bogor',
];

const STEPS = [
  { id: 1, label: 'Wilayah' },
  { id: 2, label: 'Waktu' },
  { id: 3, label: 'Kontak' },
] as const;

type Step = (typeof STEPS)[number]['id'];

interface FormErrors {
  wilayah?: string;
  waktu?: string;
  nama?: string;
  whatsapp?: string;
  form?: string;
}

interface KopdarInterestFormProps {
  wilayah: string;
  onWilayahChange: (wilayah: string) => void;
}

export function KopdarInterestForm({ wilayah, onWilayahChange }: KopdarInterestFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [waktu, setWaktu] = useState<string[]>([]);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [successWa, setSuccessWa] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const submittingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const toggleWaktu = (option: string) => {
    setWaktu((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
    if (errors.waktu) setErrors((current) => ({ ...current, waktu: undefined }));
  };

  const validateStep = (target: Step): boolean => {
    const next: FormErrors = {};

    if (target === 1 && !wilayah) {
      next.wilayah = 'Pilih wilayah domisili terlebih dahulu agar pengurus tahu kota kopdarmu.';
    }

    if (target === 2 && waktu.length === 0) {
      next.waktu = 'Pilih minimal satu pilihan hari & waktu yang biasanya kamu luang.';
    }

    if (target === 3) {
      if (nama.trim().length < 3) {
        next.nama = 'Tuliskan nama lengkap minimal 3 karakter.';
      }
      if (!normalizeIndonesianWhatsApp(whatsapp)) {
        next.whatsapp =
          'Masukkan nomor WhatsApp Indonesia yang valid (contoh: 081234567890).';
      }
    }

    setErrors(next);
    if (Object.keys(next).length === 0) return true;

    const firstField =
      (next.wilayah && 'kopdar-wilayah') ||
      (next.waktu && 'kopdar-waktu-0') ||
      (next.nama && 'kopdar-nama') ||
      (next.whatsapp && 'kopdar-wa');
    if (firstField) {
      setTimeout(() => document.getElementById(firstField)?.focus(), 0);
    }
    return false;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((current) => (current < 3 ? ((current + 1) as Step) : current));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    if (website.trim().length > 0) {
      setErrors({ form: 'Permintaan tidak dapat diproses. Muat ulang halaman lalu coba lagi.' });
      return;
    }

    const next: FormErrors = {};
    if (!wilayah) {
      next.wilayah = 'Pilih wilayah domisili terlebih dahulu.';
    }
    if (waktu.length === 0) {
      next.waktu = 'Pilih minimal satu hari dan waktu luang.';
    }
    if (nama.trim().length < 3) {
      next.nama = 'Tuliskan nama lengkap minimal 3 karakter.';
    }
    const validWa = normalizeIndonesianWhatsApp(whatsapp);
    if (!validWa) {
      next.whatsapp = 'Masukkan nomor WhatsApp Indonesia yang valid.';
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      if (next.wilayah) setStep(1);
      else if (next.waktu) setStep(2);
      else setStep(3);
      return;
    }

    submittingRef.current = true;
    setErrors({});

    saveKopdarInterestEntry({
      nama: nama.trim(),
      whatsapp: validWa!,
      wilayah,
      waktu,
    });

    setSuccessWa(validWa!);
    setShareUrl(
      `https://wa.me/?text=${encodeURIComponent(
        `Aku sudah isi usulan jadwal kopdar IKA UMS Jabodetabek wilayah ${wilayah}. Yuk ikutan usul di ${window.location.origin}/#kopdar-section`
      )}`
    );
    submittingRef.current = false;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 text-center shadow-xs space-y-4"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/70 shadow-2xs">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0C2340]">
            Minat Kopdar {wilayah} Berhasil Dicatat!
          </h3>
          <p className="mx-auto max-w-md text-sm text-slate-600 leading-relaxed">
            Terima kasih, <strong>{nama}</strong>. Pengurus akan menghubungi WhatsApp{' '}
            <strong className="text-[#0C2340]">{successWa}</strong> saat tanggal &amp; tempat kumpul di {wilayah} siap digelar.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#08182E] shadow-2xs"
          >
            <Share2 className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
            <span>Ajak Alumni Lewat WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            Ubah Pilihan
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-5"
    >
      {/* Honeypot anti-spam */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="kopdar-website">Website</label>
        <input
          id="kopdar-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="sr-only"
        />
      </div>

      {/* Stepper Header */}
      <div className="space-y-3 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-[#C07A28]">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0C2340]">
              Form Minat &amp; Jadwal Kopdar
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Langkah {step} dari 3
          </span>
        </div>

        {/* 3 Step Progress Bar */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {STEPS.map((s) => {
            const isCurrent = step === s.id;
            const isPassed = step > s.id;
            return (
              <div key={s.id} className="space-y-1.5">
                <div
                  className={cn(
                    'h-1.5 w-full rounded-full transition-all duration-300',
                    isCurrent || isPassed ? 'bg-[#0C2340]' : 'bg-slate-200'
                  )}
                />
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'text-[11px] sm:text-xs font-semibold',
                      isCurrent
                        ? 'text-[#0C2340] font-bold'
                        : isPassed
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    )}
                  >
                    {isPassed ? `✓ ${s.label}` : `${s.id}. ${s.label}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Error Global */}
      {errors.form && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* STEP 1: PILIH WILAYAH */}
      {step === 1 && (
        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-base sm:text-lg font-bold text-[#0C2340] focus:outline-hidden"
            >
              Di kota mana kamu berdomisili atau beraktivitas?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih wilayah Jabodetabek terdekat agar kami bisa mengelompokkan titik kumpul kopdar.
            </p>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <select
                id="kopdar-wilayah"
                value={wilayah}
                onChange={(e) => {
                  onWilayahChange(e.target.value);
                  if (errors.wilayah) setErrors((prev) => ({ ...prev, wilayah: undefined }));
                }}
                className={cn(
                  'w-full min-h-[48px] sm:min-h-[50px] appearance-none rounded-xl border bg-slate-50/50 hover:bg-white pl-11 pr-10 py-2.5 text-sm sm:text-base font-medium text-slate-900 transition-all cursor-pointer shadow-2xs',
                  'focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0C2340] focus:border-[#0C2340]',
                  errors.wilayah ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300'
                )}
              >
                <option value="">-- Pilih Kota atau Kabupaten --</option>
                {WILAYAH_JABODETABEK.map((r) => (
                  <option key={r.id} value={r.nama}>
                    {r.nama}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>

            {errors.wilayah && (
              <p className="text-xs text-red-600 font-medium">{errors.wilayah}</p>
            )}

            {/* Quick-choice chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Pilihan cepat:</span>
              {QUICK_REGIONS.map((region) => {
                const isSelected = wilayah.toLowerCase().includes(region.toLowerCase());
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => {
                      onWilayahChange(region);
                      if (errors.wilayah) setErrors((prev) => ({ ...prev, wilayah: undefined }));
                    }}
                    className={cn(
                      'text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium',
                      isSelected
                        ? 'bg-[#0C2340] text-white border-[#0C2340] font-bold shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    )}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PILIH WAKTU */}
      {step === 2 && (
        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-base sm:text-lg font-bold text-[#0C2340] focus:outline-hidden"
            >
              Kapan waktu yang paling pas untukmu?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Boleh memilih lebih dari satu waktu di mana kamu biasanya luang.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {WAKTU_OPTIONS.map((option, idx) => {
              const isChecked = waktu.includes(option);
              return (
                <label
                  key={option}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none text-xs sm:text-sm',
                    isChecked
                      ? 'border-[#D97706] bg-amber-50/70 text-[#0C2340] font-bold ring-2 ring-amber-400/20 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  )}
                >
                  <input
                    id={`kopdar-waktu-${idx}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleWaktu(option)}
                    className="h-4 w-4 shrink-0 rounded text-[#0C2340] accent-[#0C2340] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>

          {errors.waktu && (
            <p className="text-xs text-red-600 font-medium">{errors.waktu}</p>
          )}
        </div>
      )}

      {/* STEP 3: KONTAK */}
      {step === 3 && (
        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-base sm:text-lg font-bold text-[#0C2340] focus:outline-hidden"
            >
              Kontak konfirmasi jadwal temu
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Pengurus wilayah akan menghubungi saat tanggal dan titik temu di {wilayah} telah siap.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="kopdar-nama" className="block text-xs sm:text-sm font-bold text-slate-700">
                Nama Lengkap <span className="text-[#B45309]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="kopdar-nama"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Contoh: Muhammad Ilham"
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                    if (errors.nama) setErrors((prev) => ({ ...prev, nama: undefined }));
                  }}
                  className={cn(
                    'w-full min-h-[46px] rounded-xl border bg-slate-50/50 hover:bg-white pl-10 pr-4 py-2 text-sm text-slate-900 transition-all shadow-2xs',
                    'focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0C2340] focus:border-[#0C2340]',
                    errors.nama ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300'
                  )}
                />
              </div>
              {errors.nama && (
                <p className="text-xs text-red-600 font-medium">{errors.nama}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="kopdar-wa" className="block text-xs sm:text-sm font-bold text-slate-700">
                Nomor WhatsApp <span className="text-[#B45309]">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="kopdar-wa"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="081234567890"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
                  }}
                  className={cn(
                    'w-full min-h-[46px] rounded-xl border bg-slate-50/50 hover:bg-white pl-10 pr-4 py-2 text-sm text-slate-900 transition-all shadow-2xs',
                    'focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0C2340] focus:border-[#0C2340]',
                    errors.whatsapp ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300'
                  )}
                />
              </div>
              {errors.whatsapp ? (
                <p className="text-xs text-red-600 font-medium">{errors.whatsapp}</p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Format 08xx atau +62. Nomor ini tidak pernah dibagikan ke publik.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali</span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        <button
          type={step < 3 ? 'button' : 'submit'}
          onClick={step < 3 ? goNext : undefined}
          className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#08182E] active:scale-[0.99] shadow-xs cursor-pointer"
        >
          <span>{step === 1 ? 'Lanjut Pilih Waktu' : step === 2 ? 'Lanjut Isi Kontak' : 'Kirim Minat Kopdar'}</span>
          <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
        </button>
      </div>

      {/* Privacy note */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] sm:text-xs text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>Data aman &amp; hanya dipakai pengurus untuk koordinasi jadwal kopdar.</span>
      </div>
    </form>
  );
}

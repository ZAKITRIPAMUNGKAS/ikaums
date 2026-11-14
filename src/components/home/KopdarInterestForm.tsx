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

const inputClass = (invalid: boolean) =>
  cn(
    'w-full min-h-[44px] rounded-lg border bg-[#FDFCF7] px-3.5 py-2.5 text-base text-[#0C2340]',
    'focus:outline-hidden focus:ring-2',
    invalid
      ? 'border-red-500 focus:border-red-600 focus:ring-red-200'
      : 'border-[#0C2340]/20 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
  );

export function KopdarInterestForm({ wilayah, onWilayahChange }: KopdarInterestFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [waktu, setWaktu] = useState<string[]>([]);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [successWa, setSuccessWa] = useState('');
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
      next.wilayah = 'Pilih wilayah domisili dulu supaya pengurus tahu kopdar mana yang kamu tunggu.';
    }

    if (target === 2 && waktu.length === 0) {
      next.waktu = 'Pilih minimal satu hari dan waktu yang biasanya kamu kosong.';
    }

    if (target === 3) {
      if (nama.trim().length < 3) {
        next.nama = 'Tuliskan nama lengkap minimal 3 huruf.';
      }
      if (!normalizeIndonesianWhatsApp(whatsapp)) {
        next.whatsapp =
          'Masukkan nomor WhatsApp Indonesia yang valid, misalnya 081234567890 atau +6281234567890.';
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
      next.wilayah = 'Pilih wilayah domisili dulu supaya pengurus tahu kopdar mana yang kamu tunggu.';
    }
    if (waktu.length === 0) {
      next.waktu = 'Pilih minimal satu hari dan waktu yang biasanya kamu kosong.';
    }
    if (nama.trim().length < 3) {
      next.nama = 'Tuliskan nama lengkap minimal 3 huruf.';
    }
    const validWa = normalizeIndonesianWhatsApp(whatsapp);
    if (!validWa) {
      next.whatsapp =
        'Masukkan nomor WhatsApp Indonesia yang valid, misalnya 081234567890 atau +6281234567890.';
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      if (next.wilayah) setStep(1);
      else if (next.waktu) setStep(2);
      else setStep(3);

      const firstField =
        (next.wilayah && 'kopdar-wilayah') ||
        (next.waktu && 'kopdar-waktu-0') ||
        (next.nama && 'kopdar-nama') ||
        (next.whatsapp && 'kopdar-wa');
      if (firstField) {
        setTimeout(() => document.getElementById(firstField)?.focus(), 0);
      }
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
    submittingRef.current = false;
    setSubmitted(true);
  };

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Aku sudah kirim minat kopdar IKA UMS Jabodetabek wilayah ${wilayah}. Yuk isi juga di https://ikaums.vercel.app/#kopdar`
  )}`;

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-[#0C2340]/12 bg-white p-6 text-center shadow-2xs sm:p-8"
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-[#0C2340]">
          Minat kopdar {wilayah} tercatat
        </h3>
        <p className="mx-auto mt-2 max-w-md text-base leading-[1.6] text-[#475569]">
          Terima kasih, {nama}. Pengurus akan menghubungi WhatsApp{' '}
          <strong className="text-[#0C2340]">{successWa}</strong> saat jadwal dan lokasi
          kopdar {wilayah} sudah ditetapkan.
        </p>
        <p className="mx-auto mt-2 max-w-md text-base leading-[1.6] text-[#475569]">
          Waktu verifikasi: {COMMUNITY_PLACEHOLDERS.verificationSla}. Nomor WhatsApp tidak
          ditampilkan di halaman publik.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#08182E]"
          >
            <Share2 className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
            Ajak alumni lewat WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-lg bg-[#F3F1EA] px-5 py-3 text-base font-semibold text-[#0C2340] transition-colors hover:bg-[#E7E3D7]"
          >
            Ubah pilihan
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative rounded-xl border border-[#0C2340]/12 bg-white p-5 shadow-2xs sm:p-7"
    >
      {/* Honeypot: tidak terlihat, tidak terbaca screen reader, tidak bisa di-tab */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="kopdar-website">Website</label>
        <input
          id="kopdar-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[#92400E]">Form minat kopdar</p>
        <p className="text-sm text-[#475569]">Langkah {step} dari 3</p>
      </div>

      <ol className="mt-3 grid grid-cols-3 gap-2" aria-label="Langkah formulir minat kopdar">
        {STEPS.map((item) => {
          const current = step === item.id;
          const done = step > item.id;
          return (
            <li key={item.id} aria-current={current ? 'step' : undefined} className="space-y-1.5">
              <span
                className={cn(
                  'block h-1 rounded-full transition-colors',
                  current || done ? 'bg-[#0C2340]' : 'bg-[#0C2340]/15'
                )}
              />
              <span
                className={cn(
                  'block text-sm',
                  current ? 'font-bold text-[#0C2340]' : 'font-medium text-[#475569]'
                )}
              >
                {item.id}. {item.label}
              </span>
            </li>
          );
        })}
      </ol>

      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-5 text-lg font-bold text-[#0C2340] focus:outline-none"
      >
        {step === 1 && 'Pilih wilayah domisilimu'}
        {step === 2 && 'Kapan biasanya kamu kosong?'}
        {step === 3 && 'Terakhir, kontak yang bisa dihubungi'}
      </h3>

      {errors.form && (
        <div
          role="alert"
          className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>{errors.form}</span>
        </div>
      )}

      {step === 1 && (
        <div className="mt-4 space-y-2">
          <label htmlFor="kopdar-wilayah" className="block text-base font-semibold text-[#0C2340]">
            Wilayah domisili <span className="text-[#92400E]">*</span>
          </label>
          <select
            id="kopdar-wilayah"
            value={wilayah}
            onChange={(event) => {
              onWilayahChange(event.target.value);
              if (errors.wilayah) setErrors((current) => ({ ...current, wilayah: undefined }));
            }}
            aria-invalid={Boolean(errors.wilayah)}
            aria-describedby={errors.wilayah ? 'err-kopdar-wilayah' : undefined}
            className={inputClass(Boolean(errors.wilayah))}
          >
            <option value="">Pilih kota atau kabupaten</option>
            {WILAYAH_JABODETABEK.map((region) => (
              <option key={region.id} value={region.nama}>
                {region.nama}
              </option>
            ))}
          </select>
          {errors.wilayah ? (
            <p id="err-kopdar-wilayah" className="text-sm font-medium text-red-700">
              {errors.wilayah}
            </p>
          ) : (
            <p className="text-sm text-[#475569]">
              Pilih yang paling dekat dengan rumah atau kantormu.
            </p>
          )}
        </div>
      )}

      {step === 2 && (
        <fieldset
          className="mt-4"
          aria-describedby={errors.waktu ? 'err-kopdar-waktu' : undefined}
        >
          <legend className="text-base font-semibold text-[#0C2340]">
            Hari &amp; waktu yang cocok <span className="text-[#92400E]">*</span>
          </legend>
          <p className="mt-1 text-sm text-[#475569]">Boleh pilih lebih dari satu.</p>
          <div className="mt-3 grid gap-2">
            {WAKTU_OPTIONS.map((option, index) => {
              const checked = waktu.includes(option);
              return (
                <label
                  key={option}
                  className={cn(
                    'flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-base transition-colors',
                    checked
                      ? 'border-[#0C2340] bg-[#F3F1EA] text-[#0C2340]'
                      : 'border-[#0C2340]/15 bg-[#FDFCF7] text-[#0C2340] hover:border-[#0C2340]/35'
                  )}
                >
                  <input
                    id={`kopdar-waktu-${index}`}
                    type="checkbox"
                    className="h-5 w-5 shrink-0 accent-[#0C2340]"
                    checked={checked}
                    onChange={() => toggleWaktu(option)}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
          {errors.waktu && (
            <p id="err-kopdar-waktu" className="mt-2 text-sm font-medium text-red-700">
              {errors.waktu}
            </p>
          )}
        </fieldset>
      )}

      {step === 3 && (
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="kopdar-nama" className="block text-base font-semibold text-[#0C2340]">
              Nama lengkap <span className="text-[#92400E]">*</span>
            </label>
            <input
              id="kopdar-nama"
              type="text"
              autoComplete="name"
              required
              placeholder="Nama panggilan atau lengkap"
              value={nama}
              onChange={(event) => {
                setNama(event.target.value);
                if (errors.nama) setErrors((current) => ({ ...current, nama: undefined }));
              }}
              aria-invalid={Boolean(errors.nama)}
              aria-describedby={errors.nama ? 'err-kopdar-nama' : undefined}
              className={inputClass(Boolean(errors.nama))}
            />
            {errors.nama && (
              <p id="err-kopdar-nama" className="text-sm font-medium text-red-700">
                {errors.nama}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="kopdar-wa" className="block text-base font-semibold text-[#0C2340]">
              Nomor WhatsApp <span className="text-[#92400E]">*</span>
            </label>
            <input
              id="kopdar-wa"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="081234567890"
              value={whatsapp}
              onChange={(event) => {
                setWhatsapp(event.target.value);
                if (errors.whatsapp) setErrors((current) => ({ ...current, whatsapp: undefined }));
              }}
              aria-invalid={Boolean(errors.whatsapp)}
              aria-describedby={errors.whatsapp ? 'err-kopdar-wa' : 'hint-kopdar-wa'}
              className={inputClass(Boolean(errors.whatsapp))}
            />
            {errors.whatsapp ? (
              <p id="err-kopdar-wa" className="text-sm font-medium text-red-700">
                {errors.whatsapp}
              </p>
            ) : (
              <p id="hint-kopdar-wa" className="text-sm text-[#475569]">
                Format 08xx atau +62. Hanya pengurus yang bisa melihat nomor ini.
              </p>
            )}
          </div>

          <p className="text-base leading-[1.6] text-[#475569]">
            Dengan mengirim, kamu setuju nomor WhatsApp dipakai pengurus IKA UMS Jabodetabek
            untuk info kopdar wilayahmu. Baca{' '}
            <Link
              href="/privasi"
              className="font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 hover:text-[#92400E]"
            >
              Kebijakan Privasi
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#08182E] active:scale-[0.99]"
          >
            {step === 1 ? 'Lanjut pilih waktu' : 'Lanjut isi kontak'}
            <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#08182E] active:scale-[0.99]"
          >
            Kirim minat kopdar
            <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
          </button>
        )}

        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold text-[#0C2340] transition-colors hover:bg-[#F3F1EA]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali
          </button>
        )}
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm leading-[1.6] text-[#475569]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
        Nomor WhatsApp dan email tidak pernah ditampilkan di halaman publik.
      </p>
    </form>
  );
}

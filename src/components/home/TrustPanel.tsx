import Link from 'next/link';
import { ArrowRight, Image as ImageIcon, ShieldCheck, UserRound } from 'lucide-react';
import { COMMUNITY_PLACEHOLDERS } from '@/lib/config';

const PENGURUS_SLOTS = [
  { peran: 'Ketua Wilayah', catatan: 'Memimpin koordinasi lintas kota' },
  { peran: 'Sekretaris', catatan: 'Mencatat pendaftar dan jadwal' },
  { peran: 'Koordinator Kopdar', catatan: 'Menyiapkan pertemuan per wilayah' },
  { peran: 'Koordinator Karier & Usaha', catatan: 'Mengelola mentoring dan info kerja' },
];

export function TrustPanel() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6 shadow-xs">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0C2340] text-white">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="pengurus-heading" className="text-base sm:text-lg font-bold text-slate-900">
            Pengurus Wilayah
          </h2>
          <p className="mt-1 text-sm sm:text-base leading-[1.6] text-slate-600">
            Empat peran inti masih dalam penetapan musyawarah. Foto dan nama resmi dipasang
            di sini setelah dikonfirmasi.
          </p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {PENGURUS_SLOTS.map((slot) => (
          <li key={slot.peran} className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div
              className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-400"
              role="img"
              aria-label={`Ruang foto pengurus: ${slot.peran}`}
            >
              <UserRound className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mt-2 text-xs sm:text-sm font-bold leading-snug text-slate-900">{slot.peran}</p>
            <p className="mt-0.5 text-xs leading-snug text-slate-500">Foto &amp; nama menyusul</p>
            <p className="mt-1 text-xs leading-snug text-slate-600">{slot.catatan}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/70 p-4">
        <p className="text-sm sm:text-base font-bold text-slate-900">
          Dalam koordinasi dengan PP IKA UMS Pusat
        </p>
        <p className="mt-1 text-xs sm:text-sm leading-[1.6] text-slate-700">
          Struktur pengurus wilayah belum ber-SK. Situs ini menampilkan status apa adanya
          sampai koordinasi selesai.
        </p>

        <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-amber-300 bg-white p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500">
            <ImageIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">Ruang SK Pengurus</p>
            <p className="text-xs text-slate-500">{COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
        <Link
          href="/kepengurusan"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0C2340] underline decoration-[#D97706] underline-offset-4 hover:text-[#D97706] transition-colors"
        >
          Lihat struktur lengkap
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <Link
          href="/tentang"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Tentang komunitas
        </Link>
      </div>
    </div>
  );
}

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
    <aside
      aria-labelledby="pengurus-heading"
      className="rounded-xl border border-[#0C2340]/12 bg-[#F3F1EA] p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0C2340] text-white">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="pengurus-heading" className="text-lg font-bold text-[#0C2340]">
            Pengurus Wilayah
          </h2>
          <p className="mt-1 text-base leading-[1.6] text-[#475569]">
            Empat peran inti masih dalam penetapan musyawarah. Foto dan nama resmi dipasang
            di sini setelah dikonfirmasi.
          </p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {PENGURUS_SLOTS.map((slot) => (
          <li key={slot.peran} className="rounded-lg border border-[#0C2340]/12 bg-[#FDFCF7] p-3">
            <div
              className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed border-[#0C2340]/25 bg-white text-[#475569]"
              role="img"
              aria-label={`Ruang foto pengurus: ${slot.peran}`}
            >
              <UserRound className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mt-2 text-sm font-bold leading-snug text-[#0C2340]">{slot.peran}</p>
            <p className="mt-0.5 text-sm leading-snug text-[#475569]">Foto &amp; nama menyusul</p>
            <p className="mt-1 text-sm leading-snug text-[#475569]">{slot.catatan}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-[#92400E]/25 bg-[#FFF7ED] p-4">
        <p className="text-base font-bold text-[#0C2340]">
          Dalam koordinasi dengan PP IKA UMS Pusat
        </p>
        <p className="mt-1 text-base leading-[1.6] text-[#475569]">
          Struktur pengurus wilayah belum ber-SK. Situs ini menampilkan status apa adanya
          sampai koordinasi selesai.
        </p>

        <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-[#92400E]/35 bg-white p-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[#0C2340]/15 bg-[#FDFCF7] text-[#475569]">
            <ImageIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-snug text-[#0C2340]">
              Ruang logo resmi PP IKA UMS Pusat
            </p>
            <p className="text-sm leading-snug text-[#475569]">
              Dipasang setelah izin penggunaan logo dikonfirmasi.
            </p>
          </div>
        </div>

        <Link
          href="/tentang"
          className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-base font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 hover:text-[#92400E]"
        >
          Baca status hubungan organisasi
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-4 text-sm leading-[1.6] text-[#475569]">
        {COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}.
      </p>
    </aside>
  );
}

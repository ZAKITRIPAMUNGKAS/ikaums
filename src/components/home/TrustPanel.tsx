import Link from 'next/link';
import { ArrowRight, ShieldCheck, Users, Briefcase, Calendar, FileText } from 'lucide-react';
import { COMMUNITY_PLACEHOLDERS } from '@/lib/config';

const PENGURUS_ROLES = [
  {
    peran: 'Ketua Wilayah',
    tugas: 'Koordinasi lintas 9 kota/kabupaten & perwakilan organisasi',
    icon: Users,
  },
  {
    peran: 'Sekretaris Wilayah',
    tugas: 'Administrasi pendataan alumni, jadwal, & kesekretariatan',
    icon: FileText,
  },
  {
    peran: 'Koordinator Kopdar',
    tugas: 'Penetapan titik temu & teknis pertemuan per wilayah',
    icon: Calendar,
  },
  {
    peran: 'Koordinator Karier & Usaha',
    tugas: 'Pengelolaan mentoring CV, portofolio, & jejaring loker alumni',
    icon: Briefcase,
  },
];

export function TrustPanel() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header Panel */}
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0C2340] text-white">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="pengurus-heading" className="text-base sm:text-lg font-bold text-slate-900">
            Pengurus Wilayah Jabodetabek
          </h2>
          <p className="mt-1 text-xs sm:text-sm leading-[1.6] text-slate-600">
            Penetapan formatur pengurus harian dan koordinator sembilan wilayah berjalan melalui proses
            musyawarah terbuka bersama alumni.
          </p>
        </div>
      </div>

      {/* 4 Peran Inti dalam format terstruktur */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          4 Peran Inti Koordinasi
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PENGURUS_ROLES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.peran}
                className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 flex flex-col justify-between transition-colors hover:bg-slate-50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                      <Icon className="h-3.5 w-3.5 text-[#0C2340] shrink-0" aria-hidden="true" />
                      {item.peran}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                      Formatur
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {item.tugas}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Hubungan Resmi dengan Kampus & PP IKA UMS */}
      <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#D97706]" aria-hidden="true" />
          <p className="text-xs sm:text-sm font-bold text-slate-900">
            Koordinasi Resmi PP IKA UMS Pusat
          </p>
        </div>
        <p className="text-xs sm:text-sm leading-[1.6] text-slate-700">
          Inisiatif ini disiapkan sebagai simpul daerah resmi alumni Universitas Muhammadiyah Surakarta di Jabodetabek.
          Penomoran SK dan pengukuhan kepengurusan diselaraskan dengan agenda musyawarah wilayah.
        </p>
        <p className="text-[11px] text-[#B45309] font-medium pt-0.5">
          Status: {COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}
        </p>
      </div>

      {/* Tautan Navigasi */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <Link
          href="/kepengurusan"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0C2340] underline decoration-[#D97706] underline-offset-4 hover:text-[#D97706] transition-colors"
        >
          Lihat struktur &amp; 9 korwil lengkap
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

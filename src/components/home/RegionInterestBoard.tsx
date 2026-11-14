import { Users } from 'lucide-react';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import {
  KOPDAR_MIN_VISIBLE,
  KOPDAR_TARGET_PER_REGION,
} from '@/lib/kopdar-interest';

interface RegionInterestBoardProps {
  counts: Record<string, number>;
  target?: number;
  minVisible?: number;
}

export function RegionInterestBoard({
  counts,
  target = KOPDAR_TARGET_PER_REGION,
  minVisible = KOPDAR_MIN_VISIBLE,
}: RegionInterestBoardProps) {
  const reachedRegions = WILAYAH_JABODETABEK.filter(
    (region) => (counts[region.nama] ?? 0) >= minVisible
  ).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0C2340] text-white">
            <Users className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Papan Minat per Wilayah</h3>
            <p className="mt-1 max-w-[58ch] text-sm sm:text-base leading-[1.6] text-slate-600">
              Target awal {target} peminat per wilayah. Angka baru ditampilkan setelah minimal{' '}
              {minVisible} isian terkumpul supaya tidak menyesatkan.
            </p>
          </div>
        </div>
        <span className="rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs sm:text-sm font-semibold text-[#B45309]">
          {reachedRegions} dari {WILAYAH_JABODETABEK.length} wilayah tercapai
        </span>
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 sm:grid-cols-3">
        {WILAYAH_JABODETABEK.map((region) => {
          const count = counts[region.nama] ?? 0;
          const reached = count >= minVisible;
          const status = reached
            ? `${count} / ${target} peminat`
            : count > 0
              ? 'Sedang terkumpul'
              : 'Menunggu isian';
          const percentage = reached ? Math.min(100, Math.round((count / target) * 100)) : 0;

          return (
            <li
              key={region.id}
              aria-label={`${region.nama}: ${status}`}
              className="min-h-[68px] rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900">{region.nama}</span>
                <span
                  className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
                    reached ? 'text-[#B45309]' : 'text-slate-500'
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-[#D97706] transition-[width] duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs sm:text-sm leading-[1.6] text-slate-500">
        Papan ini menghitung isian yang tersimpan di peramban ini. Rekap gabungan baru
        tersedia setelah pendataan tersambung ke pengurus.
      </p>
    </div>
  );
}

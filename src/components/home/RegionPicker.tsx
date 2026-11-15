'use client';

import { Check, MapPin } from 'lucide-react';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { cn } from '@/lib/utils';

interface RegionPickerProps {
  selected: string;
  onSelect: (wilayah: string) => void;
}

export function RegionPicker({ selected, onSelect }: RegionPickerProps) {
  return (
    <div>
      <div
        role="group"
        aria-label="Pilih wilayah domisili"
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
      >
        {WILAYAH_JABODETABEK.map((region) => {
          const active = selected === region.nama;

          return (
            <button
              key={region.id}
              type="button"
              aria-pressed={active}
              aria-label={`${region.nama} — ${region.cakupan}`}
              onClick={() => onSelect(region.nama)}
              className={cn(
                'relative flex min-h-[68px] flex-col justify-center rounded-xl border px-3.5 py-3 text-left transition-all duration-150 cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]',
                active
                  ? 'border-[#0C2340] bg-[#0C2340] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
              )}
            >
              <span className="flex items-center gap-1.5 pr-5 text-sm font-bold sm:text-base">
                <MapPin
                  className={cn('h-4 w-4 shrink-0', active ? 'text-[#F59E0B]' : 'text-[#D97706]')}
                  aria-hidden="true"
                />
                {region.nama}
              </span>
              <span
                className={cn(
                  'mt-1 line-clamp-2 text-xs leading-snug sm:text-sm',
                  active ? 'text-slate-200' : 'text-slate-600'
                )}
              >
                {region.cakupan}
              </span>
              {active && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-[#0C2340]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm sm:text-base leading-[1.6] text-slate-600">
        Klik wilayahmu untuk memilih domisili dan langsung mendaftar jadi anggota.
      </p>
    </div>
  );
}

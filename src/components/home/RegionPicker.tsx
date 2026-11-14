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
                'relative flex min-h-[68px] flex-col justify-center rounded-lg border px-3.5 py-3 text-left transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]',
                active
                  ? 'border-[#0C2340] bg-[#0C2340] text-white'
                  : 'border-[#0C2340]/15 bg-white text-[#0C2340] hover:border-[#0C2340]/40 hover:bg-[#FDFCF7]'
              )}
            >
              <span className="flex items-center gap-1.5 pr-5 text-sm font-bold sm:text-base">
                <MapPin
                  className={cn('h-4 w-4 shrink-0', active ? 'text-[#F59E0B]' : 'text-[#92400E]')}
                  aria-hidden="true"
                />
                {region.nama}
              </span>
              <span
                className={cn(
                  'mt-1 line-clamp-2 text-xs leading-snug sm:text-sm',
                  active ? 'text-white/80' : 'text-[#475569]'
                )}
              >
                {region.cakupan}
              </span>
              {active && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-[#0C2340]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-base leading-[1.6] text-[#475569]">
        Klik wilayahmu untuk langsung mengisi form minat kopdar di bawah.
      </p>
    </div>
  );
}

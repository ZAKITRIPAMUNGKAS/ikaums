'use client';

import React from 'react';
import { REGIONS_METADATA } from '@/data/jabodetabek-geo-meta';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { IS_DEMO_MODE, DEMO_BADGE_LABEL } from '@/lib/config';
import { ChevronRight, MapPin } from 'lucide-react';

interface MobileRegionListProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export default function MobileRegionList({
  selectedRegionId,
  onSelectRegion,
}: MobileRegionListProps) {
  return (
    <div className="bg-white border border-[#0C2340]/15 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#0C2340]/10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0C2340] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
          Daftar 9 Wilayah Jabodetabek
        </h2>
        {IS_DEMO_MODE && (
          <span className="text-[11px] font-semibold text-[#92400E] bg-amber-100 px-2 py-0.5 rounded">
            {DEMO_BADGE_LABEL}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#0C2340]/10">
        {REGIONS_METADATA.map((r) => {
          const isSelected = r.regionId === selectedRegionId;
          const master = WILAYAH_JABODETABEK.find((w) => w.nama === r.regionName);

          return (
            <button
              key={r.regionId}
              type="button"
              onClick={() => onSelectRegion(r.regionId)}
              className={`w-full min-h-[44px] py-2.5 px-2.5 flex items-center justify-between text-left transition-colors rounded-lg cursor-pointer ${
                isSelected
                  ? 'bg-[#FDFCF7] font-semibold text-[#0C2340]'
                  : 'hover:bg-[#FDFCF7] text-[#334155]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isSelected ? 'bg-[#B45309]' : 'bg-[#CBD5E1]'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#0C2340]">{r.regionName}</div>
                  <div className="text-xs text-[#475569] truncate">
                    {IS_DEMO_MODE
                      ? `${r.mentorCount} mentor · ${r.activePercent} aktif kopdar`
                      : master?.cakupan || 'Wilayah Jabodetabek'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {IS_DEMO_MODE && (
                  <span className="text-xs font-semibold text-[#0C2340] bg-[#F3F1EA] px-2.5 py-0.5 rounded">
                    {r.count}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-[#475569]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

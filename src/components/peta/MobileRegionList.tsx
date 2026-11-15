'use client';

import React from 'react';
import { REGIONS_METADATA } from '@/data/jabodetabek-geo-meta';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { ChevronRight, MapPin } from 'lucide-react';

interface MobileRegionListProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
  regionCounts?: Record<string, number>;
}

export default function MobileRegionList({
  selectedRegionId,
  onSelectRegion,
  regionCounts = {},
}: MobileRegionListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
        <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#92400E]" />
          Daftar 9 Wilayah Jabodetabek
        </h2>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#0C2340]/10">
        {REGIONS_METADATA.map((r) => {
          const isSelected = r.regionId === selectedRegionId;
          const master = WILAYAH_JABODETABEK.find((w) => w.nama === r.regionName);
          const count = regionCounts[r.regionId] ?? 0;

          return (
            <button
              key={r.regionId}
              type="button"
              onClick={() => onSelectRegion(r.regionId)}
              className={`w-full min-h-[44px] py-2.5 px-2.5 flex items-center justify-between text-left transition-colors rounded-lg cursor-pointer ${
                isSelected
                  ? 'bg-slate-50 font-semibold text-[#0C2340]'
                  : 'hover:bg-slate-50 text-[#334155]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isSelected ? 'bg-[#92400E]' : 'bg-[#CBD5E1]'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-base font-semibold text-[#0C2340]">{r.regionName}</div>
                  <div className="text-sm text-[#475569] truncate">
                    {count > 0
                      ? `${count} alumni terdata`
                      : master?.cakupan || 'Wilayah Jabodetabek'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-[#0C2340] bg-slate-100 px-2.5 py-0.5 rounded">
                  {count}
                </span>
                <ChevronRight className="w-4 h-4 text-[#475569]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

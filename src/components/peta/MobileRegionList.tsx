'use client';

import React from 'react';
import { REGIONS_METADATA } from '@/data/jabodetabek-geo-meta';
import { ChevronRight, MapPin } from 'lucide-react';

interface MobileRegionListProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export default function MobileRegionList({
  selectedRegionId,
  onSelectRegion
}: MobileRegionListProps) {
  return (
    <div className="bg-white border border-[#0C2340]/15 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#0C2340]/10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0C2340] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
          Daftar 9 Wilayah Jabodetabek
        </h3>
        <span className="text-xs font-medium text-[#64748B]">
          1.248 alumni
        </span>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#0C2340]/10">
        {REGIONS_METADATA.map((r) => {
          const isSelected = r.regionId === selectedRegionId;
          return (
            <button
              key={r.regionId}
              type="button"
              onClick={() => onSelectRegion(r.regionId)}
              className={`w-full py-2.5 px-2.5 flex items-center justify-between text-left transition-colors rounded-lg cursor-pointer ${
                isSelected
                  ? 'bg-[#FDFCF7] font-semibold text-[#0C2340]'
                  : 'hover:bg-[#FDFCF7] text-[#334155]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-[#D97706]' : 'bg-[#CBD5E1]'
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold text-[#0C2340]">
                    {r.regionName}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    {r.mentorCount} mentor · {r.activePercent} aktif kopdar
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#0C2340] bg-[#F3F1EA] px-2.5 py-0.5 rounded">
                  {r.count}
                </span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

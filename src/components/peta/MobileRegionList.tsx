'use client';

import React from 'react';
import { REGIONS_METADATA, RegionMetadata } from '@/data/jabodetabek-geo-meta';
import { ChevronRight, MapPin, Users } from 'lucide-react';

interface MobileRegionListProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export default function MobileRegionList({
  selectedRegionId,
  onSelectRegion
}: MobileRegionListProps) {
  return (
    <div className="bg-white border border-[#E2DFD8] rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1EFEA]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1536] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
          Daftar 9 Sentra Wilayah
        </h3>
        <span className="text-[11px] font-mono text-[#71717A]">
          1.248 Alumni
        </span>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#F1EFEA]">
        {REGIONS_METADATA.map((r) => {
          const isSelected = r.regionId === selectedRegionId;
          return (
            <button
              key={r.regionId}
              onClick={() => onSelectRegion(r.regionId)}
              className={`w-full py-2.5 px-2 flex items-center justify-between text-left transition-colors rounded-lg ${
                isSelected
                  ? 'bg-[#FAF9F5] font-semibold text-[#0B1536]'
                  : 'hover:bg-[#FAF9F5]/60 text-[#3F3F46]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-[#D97706]' : 'bg-[#CBD5E1]'
                  }`}
                />
                <div>
                  <div className="text-xs font-medium text-[#0B1536]">
                    {r.regionName}
                  </div>
                  <div className="text-[10px] text-[#71717A]">
                    {r.mentorCount} mentor aktif • {r.activePercent} keaktifan
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#101F5B] bg-[#F4F3EE] px-2 py-0.5 rounded">
                  {r.count}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

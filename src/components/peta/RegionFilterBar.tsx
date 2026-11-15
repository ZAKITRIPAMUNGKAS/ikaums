'use client';

import React from 'react';
import { REGIONS_METADATA } from '@/data/jabodetabek-geo-meta';

interface RegionFilterBarProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
  regionCounts?: Record<string, number>;
}

export default function RegionFilterBar({
  selectedRegionId,
  onSelectRegion,
  regionCounts = {},
}: RegionFilterBarProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#475569] mr-1 hidden md:inline">
          Wilayah:
        </span>

        {REGIONS_METADATA.map((r) => {
          const isSelected = r.regionId === selectedRegionId;
          const count = regionCounts[r.regionId] ?? 0;
          return (
            <button
              key={r.regionId}
              type="button"
              onClick={() => onSelectRegion(r.regionId)}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-[#0C2340] text-white border-[#0C2340] shadow-xs font-semibold'
                  : 'bg-white text-[#334155] border-slate-200 hover:bg-slate-50 hover:border-slate-400 hover:text-[#0C2340] font-medium'
              }`}
            >
              <span>{r.regionName}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded font-semibold leading-none ${
                  isSelected ? 'bg-white/15 text-[#F59E0B]' : 'bg-slate-100 text-[#475569]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

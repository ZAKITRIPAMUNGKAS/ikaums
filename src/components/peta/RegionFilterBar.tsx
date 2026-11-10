'use client';

import React from 'react';
import { REGIONS_METADATA, RegionMetadata } from '@/data/jabodetabek-geo-meta';

interface RegionFilterBarProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export default function RegionFilterBar({
  selectedRegionId,
  onSelectRegion
}: RegionFilterBarProps) {
  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max">
        <span className="text-xs font-semibold text-[#52525B] mr-1 hidden sm:inline">
          Pilih Wilayah:
        </span>

        {REGIONS_METADATA.map((r) => {
          const isSelected = r.regionId === selectedRegionId;
          return (
            <button
              key={r.regionId}
              onClick={() => onSelectRegion(r.regionId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-[#0B1536] text-white border-[#0B1536] shadow-xs font-bold'
                  : 'bg-white text-[#3F3F46] border-[#E2DFD8] hover:bg-[#FAF9F5] hover:text-[#0B1536]'
              }`}
            >
              <span>{r.regionName}</span>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.2 rounded ${
                  isSelected
                    ? 'bg-[#101F5B] text-[#D97706]'
                    : 'bg-[#F4F3EE] text-[#71717A]'
                }`}
              >
                {r.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

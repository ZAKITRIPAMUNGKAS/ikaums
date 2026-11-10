'use client';

import React from 'react';

export default function MapLoadingSkeleton() {
  return (
    <div className="relative w-full h-full min-h-[420px] md:min-h-[560px] bg-[#F6F5F0] rounded-xl border border-[#E2DFD8] flex flex-col items-center justify-center p-6 animate-pulse">
      <div className="w-10 h-10 border-3 border-[#CBD5E1] border-t-[#101F5B] rounded-full animate-spin mb-4" />
      <div className="text-xs font-semibold text-[#0B1536] tracking-tight">
        Memuat Kartografi Jabodetabek...
      </div>
      <div className="text-[11px] text-[#71717A] mt-1 font-mono">
        Batas Wilayah BPS ADM2
      </div>
    </div>
  );
}

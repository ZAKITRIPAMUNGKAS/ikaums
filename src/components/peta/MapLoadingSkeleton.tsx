'use client';

import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export default function MapLoadingSkeleton() {
  return (
    <div className="relative w-full h-full min-h-[420px] md:min-h-[560px] bg-[#F6F5F0] rounded-xl border border-[#0C2340]/15 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-white border border-[#0C2340]/12 flex items-center justify-center text-[#0C2340] mb-3 shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#92400E]" />
      </div>
      <div className="text-sm font-bold text-[#0C2340]">
        Memuat Peta Kartografi 9 Wilayah Jabodetabek
      </div>
      <p className="text-xs text-[#475569] mt-1 max-w-sm">
        Batas administrasi resmi BPS &middot; geoBoundaries (CC BY 3.0 IGO). Sambil menunggu, Anda dapat memilih wilayah pada tombol di atas.
      </p>
      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0C2340]/5 text-[#0C2340] text-xs font-medium">
        <MapPin className="w-3.5 h-3.5 text-[#92400E]" />
        <span>DKI Jakarta, Jawa Barat, &amp; Banten</span>
      </div>
    </div>
  );
}

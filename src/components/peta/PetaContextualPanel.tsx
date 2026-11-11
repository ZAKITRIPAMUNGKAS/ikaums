'use client';

import React from 'react';
import Link from 'next/link';
import { RegionMetadata } from '@/data/jabodetabek-geo-meta';
import {
  MapPin,
  Briefcase,
  Calendar,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PetaContextualPanelProps {
  region: RegionMetadata;
  allRegions?: RegionMetadata[];
  onSelectRegion?: (regionId: string) => void;
}

const REGION_PROVINCE: Record<string, string> = {
  'jkt-selatan': 'DKI Jakarta',
  'jkt-pusat': 'DKI Jakarta',
  'jkt-barat': 'DKI Jakarta',
  'jkt-timur': 'DKI Jakarta',
  'jkt-utara': 'DKI Jakarta',
  'tangerang': 'Banten · Kota Tangerang, Tangsel, & Kab. Tangerang',
  'bekasi': 'Jawa Barat · Kota & Kabupaten Bekasi',
  'depok': 'Jawa Barat · Kota Depok',
  'bogor': 'Jawa Barat · Kota & Kabupaten Bogor',
};

export default function PetaContextualPanel({
  region
}: PetaContextualPanelProps) {
  const scopeLabel = REGION_PROVINCE[region.regionId] || 'Wilayah Jabodetabek';

  return (
    <aside className="bg-white border border-[#0C2340]/15 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] mb-1">
          {scopeLabel}
        </p>

        <h2 className="text-2xl font-extrabold text-[#0C2340] tracking-tight mb-4">
          {region.regionName}
        </h2>

        {/* Angka Ringkas Komunitas */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#64748B] mb-1">
              Alumni
            </div>
            <div className="text-xl font-extrabold text-[#0C2340]">
              {region.count}
            </div>
            <div className="text-[11px] text-[#64748B]">
              tercatat
            </div>
          </div>

          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#64748B] mb-1">
              Mentor
            </div>
            <div className="text-xl font-extrabold text-[#0C2340]">
              {region.mentorCount}
            </div>
            <div className="text-[11px] text-[#64748B]">
              siap bantu
            </div>
          </div>

          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#64748B] mb-1">
              Partisipasi
            </div>
            <div className="text-xl font-extrabold text-[#0C2340]">
              {region.activePercent}
            </div>
            <div className="text-[11px] text-[#64748B]">
              aktif kopdar
            </div>
          </div>
        </div>

        {/* Bidang Profesi Banyak Dijumpai */}
        <div className="mb-5">
          <div className="text-xs font-bold text-[#0C2340] mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Bidang Profesi Dominan</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {region.industri.map((item, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 rounded-md bg-[#F3F1EA] text-xs font-medium text-[#0C2340]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Titik Kumpul & Agenda */}
        <div className="space-y-3 mb-6">
          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3.5">
            <div className="text-xs font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Titik Kumpul Favorit</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              {region.titikKumpul}
            </p>
          </div>

          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3.5">
            <div className="text-xs font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0C2340]" />
              <span>Agenda Kumpul Terdekat</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              {region.agenda}
            </p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/direktori?wilayah=${encodeURIComponent(region.regionName)}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs group"
          >
            <span>Lihat Alumni di {region.regionName}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#F59E0B]" />
          </Link>

          <Link
            href="/kegiatan"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-[#FDFCF7] border border-[#0C2340]/20 text-xs font-semibold text-[#0C2340] transition-colors"
          >
            <span>Lihat Jadwal Kumpul</span>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-[#0C2340]/10 flex items-start gap-2 text-[11px] text-[#64748B] leading-snug">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
          <span>
            Data ditampilkan sebagai angka gabungan per kota/kabupaten untuk menjaga privasi alamat rumah anggota.
          </span>
        </div>
      </div>
    </aside>
  );
}

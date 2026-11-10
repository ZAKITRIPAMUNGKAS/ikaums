'use client';

import React from 'react';
import Link from 'next/link';
import { RegionMetadata } from '@/data/jabodetabek-geo-meta';
import { 
  Users, 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  Calendar, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface PetaContextualPanelProps {
  region: RegionMetadata;
  allRegions: RegionMetadata[];
  onSelectRegion: (regionId: string) => void;
}

export default function PetaContextualPanel({
  region,
  allRegions,
  onSelectRegion
}: PetaContextualPanelProps) {
  // Find top region for comparative context
  const isTopRegion = region.regionId === 'jkt-selatan';

  return (
    <div className="bg-white border border-[#E2DFD8] rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header Tag & Region Title */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E2DFD8] text-[11px] font-semibold text-[#101F5B]">
            <MapPin className="w-3 h-3 text-[#D97706]" />
            <span>Sentra Wilayah Terpilih</span>
          </div>

          {isTopRegion && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">
              <Sparkles className="w-3 h-3" />
              Populasi Terbesar
            </span>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1536] tracking-tight mb-1">
          {region.regionName}
        </h2>
        <p className="text-xs text-[#52525B] leading-relaxed mb-5">
          Cakupan wilayah administrasi rujukan Badan Pusat Statistik (BPS) untuk konsentrasi aktivitas alumni UMS.
        </p>

        {/* Primary Metrics Strip */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="bg-[#FAF9F5] border border-[#EAE7DF] rounded-lg p-3">
            <div className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-[#101F5B]" />
              Alumni
            </div>
            <div className="text-xl md:text-2xl font-black text-[#0B1536] font-mono">
              {region.count}
            </div>
            <div className="text-[10px] text-[#52525B] mt-0.5">
              terdaftar (k ≥ 5)
            </div>
          </div>

          <div className="bg-[#FAF9F5] border border-[#EAE7DF] rounded-lg p-3">
            <div className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-[#D97706]" />
              Mentor
            </div>
            <div className="text-xl md:text-2xl font-black text-[#0B1536] font-mono">
              {region.mentorCount}
            </div>
            <div className="text-[10px] text-[#52525B] mt-0.5">
              siap membimbing
            </div>
          </div>

          <div className="bg-[#FAF9F5] border border-[#EAE7DF] rounded-lg p-3">
            <div className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              Keaktifan
            </div>
            <div className="text-xl md:text-2xl font-black text-[#0B1536] font-mono">
              {region.activePercent}
            </div>
            <div className="text-[10px] text-[#52525B] mt-0.5">
              partisipasi rujukan
            </div>
          </div>
        </div>

        {/* Industry Clusters */}
        <div className="mb-5">
          <div className="text-xs font-bold text-[#0B1536] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#101F5B]" />
            Kluster Industri Dominan
          </div>
          <div className="flex flex-wrap gap-1.5">
            {region.industri.map((item, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 rounded bg-[#F4F3EE] border border-[#E2DFD8] text-xs font-medium text-[#18213D]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Gathering Point / Sentra Kumpul */}
        <div className="mb-5 bg-[#FAF9F5] border border-[#EAE7DF] rounded-lg p-3.5">
          <div className="text-xs font-bold text-[#0B1536] mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            Sentra Temu Silaturahmi
          </div>
          <p className="text-xs text-[#3F3F46] leading-relaxed">
            {region.titikKumpul}
          </p>
        </div>

        {/* Upcoming Agenda */}
        <div className="mb-6 bg-[#FAF9F5] border border-[#EAE7DF] rounded-lg p-3.5">
          <div className="text-xs font-bold text-[#0B1536] mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#101F5B]" />
            Agenda Terdekat
          </div>
          <p className="text-xs text-[#3F3F46] leading-relaxed">
            {region.agenda}
          </p>
        </div>
      </div>

      {/* Action Buttons & Privacy Note */}
      <div>
        <div className="flex flex-col gap-2.5">
          <Link
            href={`/direktori?wilayah=${encodeURIComponent(region.regionName)}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0B1536] hover:bg-[#101F5B] text-white text-xs font-bold tracking-wide transition-colors shadow-xs group"
          >
            <span>Lihat Alumni di {region.regionName}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#D97706]" />
          </Link>

          <Link
            href="/kegiatan"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F1EFEA] border border-[#D5D2C9] text-xs font-semibold text-[#18213D] transition-colors"
          >
            <span>Jadwal Kegiatan & RSVP</span>
          </Link>
        </div>

        {/* Compliance Footer */}
        <div className="mt-4 pt-3 border-t border-[#F1EFEA] flex items-center gap-2 text-[10px] text-[#71717A] leading-tight">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Data agregat terverifikasi dengan supresi kelompok kecil (k ≥ 5) sesuai kepatuhan UU PDP No. 27/2022.
          </span>
        </div>
      </div>
    </div>
  );
}

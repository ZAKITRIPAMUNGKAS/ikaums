'use client';

import React from 'react';
import Link from 'next/link';
import { RegionMetadata } from '@/data/jabodetabek-geo-meta';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import {
  MapPin,
  Briefcase,
  Calendar,
  ArrowRight,
  ShieldCheck,
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

export default function PetaContextualPanel({ region }: PetaContextualPanelProps) {
  const scopeLabel = REGION_PROVINCE[region.regionId] || 'Wilayah Jabodetabek';
  const master = WILAYAH_JABODETABEK.find((w) => w.nama === region.regionName);

  if (!IS_DEMO_MODE) {
    return (
      <aside className="bg-white border border-[#0C2340]/15 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between h-full">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#B45309] mb-1">
            {scopeLabel}
          </p>

          <h2 className="text-2xl font-extrabold text-[#0C2340] tracking-tight mb-4">
            {region.regionName}
          </h2>

          <div className="space-y-3 mb-6">
            <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3.5">
              <div className="text-xs font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Cakupan Area</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {master?.cakupan || region.regionName}
              </p>
            </div>

            <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3.5">
              <div className="text-xs font-bold text-[#0C2340] mb-1">
                Jumlah Alumni Terdata
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {COMMUNITY_PLACEHOLDERS.coordinatorCount} — angka resmi per kota akan ditampilkan setelah verifikasi pendaftar awal berjalan.
              </p>
            </div>

            <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3.5">
              <div className="text-xs font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0C2340]" />
                <span>Rencana Kopdar Pertama</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                [ISI: rencana jadwal dan titik temu kopdar wilayah {region.regionName}]
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <Link
              href="/gabung"
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs group"
            >
              <span>Daftar jadi anggota ({region.shortName})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#F59E0B]" />
            </Link>

            <Link
              href="/kepengurusan"
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-[#FDFCF7] border border-[#0C2340]/20 text-xs font-semibold text-[#0C2340] transition-colors"
            >
              <span>Lihat Pengurus &amp; Korwil</span>
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-[#0C2340]/10 flex items-start gap-2 text-[11px] text-[#475569] leading-snug">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
            <span>
              Situs tidak menyimpan atau memetakan alamat rumah maupun titik GPS anggota.
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white border border-[#0C2340]/15 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
            {scopeLabel}
          </p>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-[#92400E] text-[10px] font-semibold">
            {DEMO_BADGE_LABEL}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#0C2340] tracking-tight mb-4">
          {region.regionName}
        </h2>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#475569] mb-1">Alumni</div>
            <div className="text-xl font-extrabold text-[#0C2340]">{region.count}</div>
            <div className="text-[11px] text-[#475569]">contoh</div>
          </div>

          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#475569] mb-1">Mentor</div>
            <div className="text-xl font-extrabold text-[#0C2340]">{region.mentorCount}</div>
            <div className="text-[11px] text-[#475569]">contoh</div>
          </div>

          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#475569] mb-1">Partisipasi</div>
            <div className="text-xl font-extrabold text-[#0C2340]">{region.activePercent}</div>
            <div className="text-[11px] text-[#475569]">contoh</div>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-xs font-bold text-[#0C2340] mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#475569]" />
            <span>Bidang Profesi Dominan ({DEMO_BADGE_LABEL})</span>
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

        <div className="space-y-3 mb-6">
          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3.5">
            <div className="text-xs font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Titik Kumpul</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">{region.titikKumpul}</p>
          </div>

          <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-lg p-3.5">
            <div className="text-xs font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0C2340]" />
              <span>Contoh Jadwal Kopdar</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">{region.agenda}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/direktori?wilayah=${encodeURIComponent(region.regionName)}`}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs group"
          >
            <span>Lihat Daftar Anggota ({region.shortName})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#F59E0B]" />
          </Link>

          <Link
            href="/kegiatan"
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-[#FDFCF7] border border-[#0C2340]/20 text-xs font-semibold text-[#0C2340] transition-colors"
          >
            <span>Lihat Jadwal Kopdar</span>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-[#0C2340]/10 flex items-start gap-2 text-[11px] text-[#475569] leading-snug">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
          <span>Data ditampilkan sebagai agregat tingkat kota untuk menjaga privasi.</span>
        </div>
      </div>
    </aside>
  );
}

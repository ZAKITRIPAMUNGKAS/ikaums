'use client';

import React from 'react';
import Link from 'next/link';
import { RegionMetadata } from '@/data/jabodetabek-geo-meta';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { IS_DEMO_MODE, DEMO_BADGE_LABEL } from '@/lib/config';
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
  count?: number;
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
  'karawang': 'Jawa Barat · Kabupaten Karawang',
};

export default function PetaContextualPanel({ region, count = 0 }: PetaContextualPanelProps) {
  const scopeLabel = REGION_PROVINCE[region.regionId] || 'Wilayah Jabodetabek';
  const master = WILAYAH_JABODETABEK.find((w) => w.nama === region.regionName);

  if (!IS_DEMO_MODE) {
    return (
      <aside className="surface-card rounded-xl p-5 md:p-6 flex flex-col justify-between h-full">
        <div>
          <span className="inline-block text-xs font-semibold text-[#92400E] mb-1">
            {scopeLabel}
          </span>

          <h2 className="text-2xl font-extrabold text-[#0C2340] tracking-tight mb-4">
            {region.regionName}
          </h2>

          <div className="space-y-3 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-sm font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#92400E]" />
                <span>Cakupan Area</span>
              </div>
              <p className="text-base text-[#475569] leading-[1.6]">
                {master?.cakupan || region.regionName}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-sm font-bold text-[#0C2340] mb-1">
                Jumlah Alumni Terdata
              </div>
              <p className="text-base text-[#475569] leading-[1.6]">
                {count > 0
                  ? `${count} alumni telah terverifikasi di ${region.regionName}.`
                  : `0 alumni terdata di ${region.regionName}. Jadilah yang pertama mendaftar di wilayah ini!`}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-sm font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0C2340]" />
                <span>Kegiatan &amp; Kopdar Wilayah</span>
              </div>
              <p className="text-base text-[#475569] leading-[1.6]">
                Kopdar perdana telah terlaksana. Informasi jadwal silaturahmi berkala di wilayah {region.shortName} dikabarkan melalui koordinator wilayah dan grup resmi alumni.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <Link
              href={`/gabung?wilayah=${encodeURIComponent(region.regionName)}`}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors shadow-xs group"
            >
              <span>Daftar jadi anggota ({region.shortName})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#F59E0B]" />
            </Link>

            <Link
              href="/kepengurusan"
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-sm font-semibold text-[#0C2340] transition-colors"
            >
              <span>Lihat Pengurus &amp; Korwil</span>
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-start gap-2 text-xs text-[#475569] leading-snug">
            <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <span>
              Situs tidak menyimpan atau memetakan alamat rumah maupun titik GPS anggota.
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="surface-card rounded-xl p-5 md:p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-[#92400E]">
            {scopeLabel}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-[#92400E] text-xs font-semibold">
            {DEMO_BADGE_LABEL}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#0C2340] tracking-tight mb-4">
          {region.regionName}
        </h2>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-medium text-[#475569] mb-1">Alumni</div>
            <div className="text-xl font-extrabold text-[#0C2340]">{region.count}</div>
            <div className="text-xs text-[#475569]">contoh</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-medium text-[#475569] mb-1">Mentor</div>
            <div className="text-xl font-extrabold text-[#0C2340]">{region.mentorCount}</div>
            <div className="text-xs text-[#475569]">contoh</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-medium text-[#475569] mb-1">Partisipasi</div>
            <div className="text-xl font-extrabold text-[#0C2340]">{region.activePercent}</div>
            <div className="text-xs text-[#475569]">contoh</div>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-sm font-bold text-[#0C2340] mb-2 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#475569]" />
            <span>Bidang Profesi Dominan ({DEMO_BADGE_LABEL})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {region.industri.map((item, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-[#0C2340]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div className="text-sm font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#92400E]" />
              <span>Titik Kumpul</span>
            </div>
            <p className="text-base text-[#475569] leading-[1.6]">{region.titikKumpul}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div className="text-sm font-bold text-[#0C2340] mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0C2340]" />
              <span>Contoh Jadwal Kopdar</span>
            </div>
            <p className="text-base text-[#475569] leading-[1.6]">{region.agenda}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/direktori?wilayah=${encodeURIComponent(region.regionName)}`}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors shadow-xs group"
          >
            <span>Lihat Daftar Anggota ({region.shortName})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#F59E0B]" />
          </Link>

          <Link
            href="/kegiatan"
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-sm font-semibold text-[#0C2340] transition-colors"
          >
            <span>Lihat Jadwal Kopdar</span>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 flex items-start gap-2 text-[11px] text-[#475569] leading-snug">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
          <span>Data ditampilkan sebagai agregat tingkat kota untuk menjaga privasi.</span>
        </div>
      </div>
    </aside>
  );
}

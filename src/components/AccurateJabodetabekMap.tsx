'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DATA_WILAYAH_SIMULASI } from '../data/simulasi';
import { ArrowRight, MapPin, ShieldCheck, Users, Briefcase } from 'lucide-react';

// Geographically accurate simplified boundary paths for Jabodetabek:
// Projection: Longitude 106.3 to 107.3 -> X 0 to 600, Latitude -6.0 to -6.8 -> Y 0 to 450
const REGIONS_GEO = [
  {
    id: 'tangerang',
    name: 'Tangerang',
    count: 126,
    activePercent: '38%',
    d: 'M 40,90 L 120,70 L 160,110 L 155,180 L 110,210 L 60,195 L 35,140 Z',
    labelX: 95,
    labelY: 135
  },
  {
    id: 'jkt-barat',
    name: 'Jakarta Barat',
    count: 118,
    activePercent: '42%',
    d: 'M 160,110 L 210,100 L 225,145 L 185,165 L 155,145 Z',
    labelX: 188,
    labelY: 132
  },
  {
    id: 'jkt-utara',
    name: 'Jakarta Utara',
    count: 72,
    activePercent: '31%',
    d: 'M 210,100 L 320,105 L 305,138 L 225,145 Z',
    labelX: 265,
    labelY: 122
  },
  {
    id: 'jkt-pusat',
    name: 'Jakarta Pusat',
    count: 94,
    activePercent: '54%',
    d: 'M 225,145 L 285,140 L 280,180 L 220,185 Z',
    labelX: 252,
    labelY: 162
  },
  {
    id: 'jkt-selatan',
    name: 'Jakarta Selatan',
    count: 184,
    activePercent: '61%',
    d: 'M 185,185 L 275,180 L 280,240 L 205,255 L 180,215 Z',
    labelX: 232,
    labelY: 215
  },
  {
    id: 'jkt-timur',
    name: 'Jakarta Timur',
    count: 121,
    activePercent: '46%',
    d: 'M 285,140 L 340,135 L 350,230 L 280,240 L 275,180 Z',
    labelX: 312,
    labelY: 185
  },
  {
    id: 'bekasi',
    name: 'Bekasi',
    count: 117,
    activePercent: '39%',
    d: 'M 340,135 L 490,140 L 460,250 L 375,270 L 350,230 Z',
    labelX: 415,
    labelY: 195
  },
  {
    id: 'depok',
    name: 'Depok',
    count: 93,
    activePercent: '48%',
    d: 'M 195,255 L 285,240 L 290,295 L 205,305 Z',
    labelX: 245,
    labelY: 275
  },
  {
    id: 'bogor',
    name: 'Bogor',
    count: 86,
    activePercent: '35%',
    d: 'M 180,305 L 320,295 L 360,410 L 190,415 L 160,340 Z',
    labelX: 255,
    labelY: 355
  }
];

export function AccurateJabodetabekMap() {
  const [selectedId, setSelectedId] = useState('jkt-selatan');
  const selectedRegion = REGIONS_GEO.find(r => r.id === selectedId) || REGIONS_GEO[4];

  return (
    <div className="border border-[#18213D]/15 bg-white rounded-none">
      {/* Header bar inspired by Linear / Swiss precision */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#18213D]/10 px-6 py-4 bg-[#FAFAF8]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#101F5B] font-bold">
            03 / DISTRIBUSI GEOGRAFIS
          </span>
          <span className="h-3 w-[1px] bg-[#18213D]/20"></span>
          <span className="text-xs text-[#5F6678]">
            9 Wilayah Administratif Jabodetabek
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#5F6678]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#101F5B]" />
          <span>Privasi k-anonymity (k &ge; 5)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#18213D]/10">
        
        {/* Map Vector Stage */}
        <div className="lg:col-span-8 p-6 lg:p-8 bg-[#F4F5F8]/40 flex flex-col justify-between relative">
          <div className="text-[11px] text-[#5F6678] font-mono uppercase tracking-wider mb-2">
            Peta Sebaran Alumni Terverifikasi (Opt-In)
          </div>

          <div className="relative w-full aspect-[4/3] max-w-xl mx-auto flex items-center justify-center">
            <svg
              viewBox="0 0 520 440"
              className="w-full h-full drop-shadow-xs"
              style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}
            >
              {/* Coastline indication subtle water tint at top */}
              <path
                d="M 30,80 Q 200,60 500,120"
                fill="none"
                stroke="#101F5B"
                strokeWidth="0.8"
                strokeDasharray="3 3"
                opacity="0.3"
              />
              <text x="440" y="90" fontSize="10" fill="#5F6678" fontFamily="monospace" opacity="0.6">
                LAUT JAWA
              </text>

              {REGIONS_GEO.map((r) => {
                const isSelected = r.id === selectedId;
                return (
                  <g key={r.id} className="cursor-pointer group" onClick={() => setSelectedId(r.id)}>
                    <path
                      d={r.d}
                      fill={isSelected ? '#101F5B' : '#E8ECF2'}
                      stroke={isSelected ? '#101F5B' : '#C7D0DE'}
                      strokeWidth={isSelected ? '2' : '1.2'}
                      className="transition-colors duration-150 hover:fill-[#D8E1EE]"
                    />
                    {/* Region Label and Count Pin */}
                    <circle
                      cx={r.labelX}
                      cy={r.labelY - 5}
                      r="10"
                      fill={isSelected ? '#F4C542' : '#FFFFFF'}
                      stroke="#101F5B"
                      strokeWidth="1.2"
                    />
                    <text
                      x={r.labelX}
                      y={r.labelY - 1.5}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#101F5B"
                      fontFamily="monospace"
                    >
                      {r.count}
                    </text>
                    <text
                      x={r.labelX}
                      y={r.labelY + 14}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight={isSelected ? 'bold' : '500'}
                      fill={isSelected ? '#101F5B' : '#334155'}
                      className="select-none"
                    >
                      {r.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5F6678] font-mono pt-4 border-t border-[#18213D]/10">
            <span>KLIK POLIGON WILAYAH UNTUK INSPEKSI DETAIL</span>
            <span>TOTAL: 1.248 ALUMNI</span>
          </div>
        </div>

        {/* Precision Region Telemetry Sidebar (Swiss Table) */}
        <div className="lg:col-span-4 p-6 lg:p-8 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            <div className="border-b border-[#18213D]/10 pb-4">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold block mb-1">
                TERPILIH
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#101F5B]">
                {selectedRegion.name}
              </h3>
              <p className="text-xs text-[#5F6678] mt-1">
                Wilayah domisili & konsentrasi aktivitas alumni aktif.
              </p>
            </div>

            {/* Swiss Data Table */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-[#18213D]/10">
                <span className="text-[#5F6678]">Jumlah Terdata</span>
                <span className="font-bold text-[#101F5B]">{selectedRegion.count} Alumni</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#18213D]/10">
                <span className="text-[#5F6678]">Rasio Aktif Kolaborasi</span>
                <span className="font-bold text-[#101F5B]">{selectedRegion.activePercent}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#18213D]/10">
                <span className="text-[#5F6678]">Status Validasi</span>
                <span className="font-bold text-[#22775A]">Lolos Verifikasi IKA</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#18213D]/10">
                <span className="text-[#5F6678]">Fokus Terbanyak</span>
                <span className="font-bold text-[#101F5B]">Fintech, Tech & B2B</span>
              </div>
            </div>

            <div className="bg-[#FAFAF8] border border-[#18213D]/10 p-4 text-xs space-y-2">
              <span className="text-[10px] font-mono text-[#5F6678] uppercase block">
                AGENDA KOPDAR WILAYAH INI
              </span>
              <p className="font-serif font-bold text-[#101F5B] text-sm">
                Sarasehan Jejaring {selectedRegion.name}
              </p>
              <p className="text-[#5F6678] text-[11px] leading-relaxed">
                Pertemuan berkala alumni di sentra co-working untuk pertukaran peluang kerja dan rujukan bisnis.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href={`/direktori?wilayah=${encodeURIComponent(selectedRegion.name)}`}
              className="w-full bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-semibold py-3 px-4 flex items-center justify-between transition-colors"
            >
              <span>Eksplorasi Alumni {selectedRegion.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4C542]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DATA_WILAYAH_SIMULASI } from '../data/simulasi';
import { WilayahStatistik } from '../types';
import { Filter, Plus, Minus, RotateCcw, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface RegionGeoData {
  id: string;
  name: string;
  short: string;
  count: number;
  mentorCount: number;
  activePercent: string;
  industri: string[];
  agenda: string;
  d: string;
  labelX: number;
  labelY: number;
  pillWidth: number;
}

const REGIONS_GEO: RegionGeoData[] = [
  {
    id: 'tangerang',
    name: 'Tangerang Raya',
    short: 'Tangerang',
    count: 126,
    mentorCount: 24,
    activePercent: '38%',
    industri: ['Teknologi & Digital', 'Manufaktur & Logistik', 'Properti'],
    agenda: 'Bincang Bisnis & Kolaborasi BSD',
    d: 'M 50,120 L 150,105 L 225,115 L 225,170 L 235,240 L 275,280 L 265,320 L 180,325 L 110,290 L 50,220 Z',
    labelX: 140,
    labelY: 205,
    pillWidth: 104
  },
  {
    id: 'jkt-utara',
    name: 'Jakarta Utara',
    short: 'Jakut',
    count: 72,
    mentorCount: 14,
    activePercent: '31%',
    industri: ['Logistik & Pelabuhan', 'Maritim', 'Perdagangan Besar'],
    agenda: 'Temu Profesional Logistik Tanjung Priok',
    d: 'M 225,115 L 330,105 L 435,115 L 440,165 L 365,165 L 300,165 L 225,170 Z',
    labelX: 330,
    labelY: 135,
    pillWidth: 78
  },
  {
    id: 'jkt-barat',
    name: 'Jakarta Barat',
    short: 'Jakbar',
    count: 118,
    mentorCount: 22,
    activePercent: '42%',
    industri: ['Media & Periklanan', 'F&B Retail', 'Distribusi'],
    agenda: 'Kopdar Santai Tomang & Grogol',
    d: 'M 225,170 L 300,165 L 305,235 L 275,245 L 235,240 Z',
    labelX: 265,
    labelY: 200,
    pillWidth: 80
  },
  {
    id: 'jkt-pusat',
    name: 'Jakarta Pusat',
    short: 'Jakpus',
    count: 94,
    mentorCount: 28,
    activePercent: '54%',
    industri: ['Kementerian & Lembaga', 'BUMN & Korporat', 'Konsultan ESG'],
    agenda: 'Diskusi Karier Menteng & Thamrin',
    d: 'M 300,165 L 365,165 L 375,230 L 305,235 Z',
    labelX: 338,
    labelY: 198,
    pillWidth: 82
  },
  {
    id: 'jkt-selatan',
    name: 'Jakarta Selatan',
    short: 'Jaksel',
    count: 184,
    mentorCount: 42,
    activePercent: '61%',
    industri: ['Perbankan & Fintech', 'Legal & Advokasi', 'Software Tech'],
    agenda: 'Sarasehan Akbar Kuningan & SCBD',
    d: 'M 275,245 L 305,235 L 375,230 L 370,315 L 295,325 L 275,280 Z',
    labelX: 322,
    labelY: 275,
    pillWidth: 82
  },
  {
    id: 'jkt-timur',
    name: 'Jakarta Timur',
    short: 'Jaktim',
    count: 121,
    mentorCount: 26,
    activePercent: '46%',
    industri: ['Telekomunikasi', 'Transportasi', 'Manufaktur Ringan'],
    agenda: 'Sharing Session Rawamangun',
    d: 'M 365,165 L 440,165 L 445,260 L 415,315 L 370,315 L 375,230 Z',
    labelX: 410,
    labelY: 235,
    pillWidth: 82
  },
  {
    id: 'bekasi',
    name: 'Bekasi Raya',
    short: 'Bekasi',
    count: 117,
    mentorCount: 18,
    activePercent: '39%',
    industri: ['Kawasan Industri Otomotif', 'Supply Chain', 'Kesehatan'],
    agenda: 'Forum Silaturahmi Cikarang & Summarecon',
    d: 'M 435,115 L 560,125 L 610,180 L 590,300 L 490,335 L 445,260 L 440,165 Z',
    labelX: 520,
    labelY: 220,
    pillWidth: 84
  },
  {
    id: 'depok',
    name: 'Kota Depok',
    short: 'Depok',
    count: 93,
    mentorCount: 20,
    activePercent: '48%',
    industri: ['EdTech & Pendidikan', 'Teknologi Informasi', 'Kreatif'],
    agenda: 'Ngopi Teknologi Margonda',
    d: 'M 295,325 L 370,315 L 415,315 L 410,375 L 305,380 L 265,320 L 295,325 Z',
    labelX: 350,
    labelY: 348,
    pillWidth: 80
  },
  {
    id: 'bogor',
    name: 'Bogor Raya',
    short: 'Bogor',
    count: 86,
    mentorCount: 16,
    activePercent: '35%',
    industri: ['Agrikultur & Kehutanan', 'Pariwisata', 'Pendidikan'],
    agenda: 'Kopdar Santai Sentul & Baranangsiang',
    d: 'M 265,320 L 305,380 L 410,375 L 450,385 L 480,465 L 340,480 L 210,440 L 180,325 L 265,320 Z',
    labelX: 350,
    labelY: 425,
    pillWidth: 80
  }
];

export function MapInteractiveSection() {
  const [selectedId, setSelectedId] = useState('jkt-selatan');
  const [fakultas, setFakultas] = useState('Semua Fakultas');
  const [industri, setIndustri] = useState('Semua Industri');
  const [angkatan, setAngkatan] = useState('Semua Angkatan');
  const [readyToContact, setReadyToContact] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedRegion = REGIONS_GEO.find(r => r.id === selectedId) || REGIONS_GEO[4];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Sidebar: Filter Alumni Card */}
      <div className="lg:col-span-4 bg-white border border-[#E5E8EF] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E8EF]">
          <Filter className="w-4 h-4 text-[#101F5B]" />
          <h3 className="font-serif text-lg font-bold text-[#101F5B]">
            Filter Alumni
          </h3>
        </div>

        {/* Form controls */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#18213D] block mb-1.5">
              Fakultas / Prodi
            </label>
            <select
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value)}
              className="w-full bg-[#FAFAF8] border border-[#D1D5DB] rounded-lg px-3.5 py-2.5 text-xs text-[#18213D] focus:outline-none focus:border-[#101F5B]"
            >
              <option>Semua Fakultas</option>
              <option>Fakultas Komunikasi & Informatika</option>
              <option>Fakultas Teknik</option>
              <option>Fakultas Ekonomi & Bisnis</option>
              <option>Fakultas Farmasi</option>
              <option>Fakultas Hukum</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#18213D] block mb-1.5">
              Profesi / Industri
            </label>
            <select
              value={industri}
              onChange={(e) => setIndustri(e.target.value)}
              className="w-full bg-[#FAFAF8] border border-[#D1D5DB] rounded-lg px-3.5 py-2.5 text-xs text-[#18213D] focus:outline-none focus:border-[#101F5B]"
            >
              <option>Semua Industri</option>
              <option>Teknologi & Produk Digital</option>
              <option>Perbankan & Finansial</option>
              <option>Teknik & Konstruksi</option>
              <option>Kesehatan & Farmasi</option>
              <option>Konsultan & Legal</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#18213D] block mb-1.5">
              Angkatan
            </label>
            <select
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              className="w-full bg-[#FAFAF8] border border-[#D1D5DB] rounded-lg px-3.5 py-2.5 text-xs text-[#18213D] focus:outline-none focus:border-[#101F5B]"
            >
              <option>Semua Angkatan</option>
              <option>2020 - Sekarang</option>
              <option>2015 - 2019</option>
              <option>2010 - 2014</option>
              <option>Sebelum 2010</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-[#18213D]">
              Hanya yang siap dikontak
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={readyToContact}
                onChange={(e) => setReadyToContact(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#101F5B]"></div>
            </label>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-semibold py-3 rounded-lg transition-colors mt-2"
        >
          Terapkan Filter
        </button>

        <div className="pt-3 border-t border-[#E5E8EF] flex items-center gap-1.5 text-[11px] text-[#5F6678]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Privasi k-anonymity: Wilayah &lt;5 disamarkan</span>
        </div>
      </div>

      {/* Right Area: Interactive Calibrated Spatial Map (Felt GIS Inspired) */}
      <div className="lg:col-span-8 bg-[#F8FAFC] border border-[#18213D]/15 rounded-3xl p-6 sm:p-8 relative min-h-[520px] flex flex-col justify-between overflow-hidden shadow-xs">
        
        {/* Top Controls: Zoom + and - */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-[#5F6678] font-mono uppercase tracking-wider">
            Distribusi Spasial 9 Wilayah Administratif
          </span>
          <div className="flex items-center gap-1 bg-white border border-[#18213D]/15 rounded-md p-0.5 shadow-xs z-20">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.3))}
              className="p-1 hover:bg-[#F1F5F9] text-[#101F5B] transition-colors rounded-xs"
              title="Perbesar"
              aria-label="Perbesar peta"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-[1px] bg-[#18213D]/15"></div>
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.9))}
              className="p-1 hover:bg-[#F1F5F9] text-[#101F5B] transition-colors rounded-xs"
              title="Perkecil"
              aria-label="Perkecil peta"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-[1px] bg-[#18213D]/15"></div>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-[#F1F5F9] text-[#101F5B] transition-colors rounded-xs"
              title="Reset"
              aria-label="Reset ukuran peta"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Map Vector Graphic with Calibrated Geographic Polygons */}
        <div 
          className="relative w-full max-w-xl mx-auto aspect-[4/3] flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg className="w-full h-full select-none" viewBox="0 0 660 500">
            <defs>
              <linearGradient id="seaGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="660" height="115" fill="url(#seaGrad2)" />
            <path
              d="M 20,105 Q 220,85 640,120"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <text x="560" y="95" fontSize="10" fill="#64748B" fontFamily="monospace" fontWeight="600" letterSpacing="1">
              LAUT JAWA
            </text>

            {/* Calibrated 9 Polygons */}
            {REGIONS_GEO.map((reg) => {
              const isSelected = selectedId === reg.id;
              return (
                <path
                  key={`poly-${reg.id}`}
                  d={reg.d}
                  onClick={() => setSelectedId(reg.id)}
                  className={`cursor-pointer transition-all duration-200 stroke-1 ${
                    isSelected
                      ? 'fill-[#101F5B] stroke-[#F4C542] stroke-[2.5] filter drop-shadow-md'
                      : 'fill-[#E8EEF8] stroke-[#CBD5E1] hover:fill-[#D8E3F5]'
                  }`}
                />
              );
            })}

            {/* Calibrated Geographic Badges */}
            {REGIONS_GEO.map((reg) => {
              const isSelected = selectedId === reg.id;
              const halfW = reg.pillWidth / 2;
              return (
                <g
                  key={`pill-${reg.id}`}
                  transform={`translate(${reg.labelX}, ${reg.labelY})`}
                  onClick={() => setSelectedId(reg.id)}
                  className="cursor-pointer select-none transition-transform duration-150 hover:scale-105"
                >
                  <rect
                    x={-halfW}
                    y="-12"
                    width={reg.pillWidth}
                    height="24"
                    rx="12"
                    fill={isSelected ? '#F4C542' : '#FFFFFF'}
                    stroke={isSelected ? '#101F5B' : '#CBD5E1'}
                    strokeWidth={isSelected ? '2' : '1'}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}
                  />
                  <circle
                    cx={-halfW + 12}
                    cy="0"
                    r="7.5"
                    fill={isSelected ? '#101F5B' : '#EDF2F9'}
                  />
                  <text
                    x={-halfW + 12}
                    y="3"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                    fill={isSelected ? '#F4C542' : '#101F5B'}
                  >
                    {reg.count}
                  </text>
                  <text
                    x={6}
                    y="3.5"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight={isSelected ? 'bold' : '600'}
                    fontFamily="monospace"
                    fill={isSelected ? '#101F5B' : '#1E293B'}
                  >
                    {reg.short}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Area Card Popup (Bottom Right) */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-6 sm:right-6 bg-white border border-[#E5E8EF] rounded-2xl p-4 shadow-lg w-full sm:w-76 z-20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E5E8EF]">
              <img
                src="/images/hero-alumni.jpg"
                alt="Wilayah"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#101F5B]">
                {selectedRegion.name}
              </h4>
              <span className="text-xs font-bold text-[#D97706]">
                {selectedRegion.count} Alumni Terdaftar
              </span>
            </div>
          </div>

          {/* Mini metrics: Mentor, Profesional, Pelaku Usaha */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E5E8EF] text-center">
            <div>
              <span className="font-bold text-xs text-[#101F5B] block">{selectedRegion.mentorCount}</span>
              <span className="text-[10px] text-[#5F6678]">Mentor</span>
            </div>
            <div>
              <span className="font-bold text-xs text-[#101F5B] block">{Math.round(selectedRegion.count * 0.45)}</span>
              <span className="text-[10px] text-[#5F6678]">Profesional</span>
            </div>
            <div>
              <span className="font-bold text-xs text-[#101F5B] block">{Math.round(selectedRegion.count * 0.14)}</span>
              <span className="text-[10px] text-[#5F6678]">Usaha</span>
            </div>
          </div>

          <Link
            href={`/direktori?wilayah=${encodeURIComponent(selectedRegion.name)}`}
            className="w-full bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Lihat Direktori {selectedRegion.short}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}

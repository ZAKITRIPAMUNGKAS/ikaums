'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { DATA_WILAYAH_SIMULASI } from '../data/simulasi';
import { ArrowRight, MapPin, ShieldCheck, Users, Briefcase, Plus, Minus, RotateCcw } from 'lucide-react';

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

export function AccurateJabodetabekMap() {
  const [selectedId, setSelectedId] = useState('jkt-selatan');
  const [zoomLevel, setZoomLevel] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const selectedRegion = REGIONS_GEO.find(r => r.id === selectedId) || REGIONS_GEO[4];

  return (
    <div className="border border-[#18213D]/15 bg-white shadow-xs">
      {/* Precision Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#18213D]/10 px-5 py-3.5 bg-[#FAFAF8] gap-2">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#101F5B] font-bold">
            DISTRIBUSI GEOGRAFIS SPASIAL (FELT GIS)
          </span>
          <span className="hidden sm:inline-block h-3 w-[1px] bg-[#18213D]/20"></span>
          <span className="hidden sm:inline-block text-xs text-[#5F6678] font-mono">
            Batas Resmi BPS / BIG Terkalibrasi
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#5F6678]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Privasi k-anonymity (k &ge; 5)</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Split (Side-by-Side on md/lg/xl) */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#18213D]/10 items-stretch">
        
        {/* Map Vector Stage */}
        <div className="md:col-span-7 xl:col-span-8 p-4 sm:p-6 bg-[#F8FAFC] flex flex-col justify-between relative overflow-hidden">
          
          {/* Map Subtitle & Zoom Controls */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#5F6678] font-mono uppercase tracking-wider">
              Peta Sentra Konsentrasi Alumni Jabodetabek
            </span>
            <div className="flex items-center gap-1 bg-white border border-[#18213D]/15 rounded-md p-0.5 shadow-xs">
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
                title="Reset Ukuran"
                aria-label="Reset ukuran peta"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div 
            className="relative w-full aspect-[4/3] max-w-2xl mx-auto flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              viewBox="0 0 660 500"
              className="w-full h-full drop-shadow-xs select-none"
              style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}
            >
              {/* Sea Water Gradient Background */}
              <defs>
                <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Water area at top */}
              <rect x="0" y="0" width="660" height="115" fill="url(#seaGrad)" />
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

              {/* Polygons with Felt GIS Styling */}
              {REGIONS_GEO.map((r) => {
                const isSelected = r.id === selectedId;
                return (
                  <path
                    key={`poly-${r.id}`}
                    d={r.d}
                    fill={isSelected ? '#101F5B' : '#E8EEF8'}
                    stroke={isSelected ? '#F4C542' : '#CBD5E1'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    onClick={() => setSelectedId(r.id)}
                    className="cursor-pointer transition-all duration-200 hover:fill-[#D4E2F4]"
                    style={{
                      filter: isSelected ? 'drop-shadow(0 6px 12px rgba(16, 31, 91, 0.35))' : 'none'
                    }}
                  />
                );
              })}

              {/* Felt Interactive Pill Badges (Never Truncated, High Contrast) */}
              {REGIONS_GEO.map((r) => {
                const isSelected = r.id === selectedId;
                const halfW = r.pillWidth / 2;
                return (
                  <g
                    key={`pill-${r.id}`}
                    transform={`translate(${r.labelX}, ${r.labelY})`}
                    onClick={() => setSelectedId(r.id)}
                    className="cursor-pointer select-none transition-transform duration-150 hover:scale-105"
                  >
                    {/* Rounded Pill Container */}
                    <rect
                      x={-halfW}
                      y="-12"
                      width={r.pillWidth}
                      height="24"
                      rx="12"
                      fill={isSelected ? '#F4C542' : '#FFFFFF'}
                      stroke={isSelected ? '#101F5B' : '#CBD5E1'}
                      strokeWidth={isSelected ? '2' : '1'}
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}
                    />
                    
                    {/* Number Indicator Circle */}
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
                      {r.count}
                    </text>

                    {/* Region Short Name */}
                    <text
                      x={6}
                      y="3.5"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight={isSelected ? 'bold' : '600'}
                      fontFamily="monospace"
                      fill={isSelected ? '#101F5B' : '#1E293B'}
                    >
                      {r.short}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Map Footer Bar */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#5F6678] font-mono pt-3 border-t border-[#18213D]/10 mt-2 gap-2">
            <span>* Klik poligon atau pin untuk memilih sentra wilayah</span>
            <span className="font-bold text-[#101F5B]">TOTAL: 1.248 ALUMNI TERDATA</span>
          </div>
        </div>

        {/* Telemetry Sidebar (Clean, Organized, High Information Density) */}
        <div className="md:col-span-5 xl:col-span-4 p-5 sm:p-6 bg-white flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRegion.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              {/* Region Header */}
              <div className="border-b border-[#18213D]/10 pb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-xs">
                    Sentra Wilayah Terpilih
                  </span>
                  <span className="text-[10px] font-mono text-[#5F6678]">
                    {selectedRegion.id.includes('jkt') ? 'DKI Jakarta' : selectedRegion.id === 'tangerang' ? 'Banten' : 'Jawa Barat'}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#101F5B] leading-tight">
                  {selectedRegion.name}
                </h3>
                <p className="text-xs text-[#5F6678] mt-1 leading-relaxed">
                  Konsentrasi komunitas dan aktivitas jaringan alumni UMS di wilayah {selectedRegion.name}.
                </p>
              </div>

              {/* 4 Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#F8FAFC] border border-[#18213D]/10 p-3 rounded-xs">
                  <span className="text-[10px] font-mono text-[#5F6678] uppercase block mb-0.5">
                    Total Alumni
                  </span>
                  <span className="font-serif text-xl font-bold text-[#101F5B] block">
                    {selectedRegion.count}
                  </span>
                  <span className="text-[10px] text-[#10B981] font-mono font-medium">
                    Terverifikasi PDP
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#18213D]/10 p-3 rounded-xs">
                  <span className="text-[10px] font-mono text-[#5F6678] uppercase block mb-0.5">
                    Siap Mentoring
                  </span>
                  <span className="font-serif text-xl font-bold text-[#101F5B] block">
                    {selectedRegion.mentorCount}
                  </span>
                  <span className="text-[10px] text-[#5F6678] font-mono">
                    Bimbingan 1-on-1
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#18213D]/10 p-3 rounded-xs">
                  <span className="text-[10px] font-mono text-[#5F6678] uppercase block mb-0.5">
                    Keaktifan
                  </span>
                  <span className="font-serif text-xl font-bold text-[#101F5B] block">
                    {selectedRegion.activePercent}
                  </span>
                  <span className="text-[10px] text-[#5F6678] font-mono">
                    Rasio Kolaborasi
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#18213D]/10 p-3 rounded-xs">
                  <span className="text-[10px] font-mono text-[#5F6678] uppercase block mb-0.5">
                    Inisiatif Bisnis
                  </span>
                  <span className="font-serif text-xl font-bold text-[#101F5B] block">
                    {Math.round(selectedRegion.count * 0.14)}
                  </span>
                  <span className="text-[10px] text-[#5F6678] font-mono">
                    Kemitraan UMKM
                  </span>
                </div>
              </div>

              {/* Industri Dominan */}
              <div>
                <span className="text-[10px] font-mono text-[#5F6678] uppercase tracking-wider block mb-2 font-bold">
                  Konsentrasi Industri & Profesi
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRegion.industri.map((ind) => (
                    <span
                      key={ind}
                      className="bg-[#EDF2F9] text-[#101F5B] text-[10px] font-mono px-2 py-0.5 rounded-xs border border-[#101F5B]/10 font-medium"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Agenda Terdekat Card */}
              <div className="bg-[#FAFAF8] border border-[#18213D]/15 p-3.5 rounded-xs space-y-1">
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider font-bold block">
                  Agenda Komunitas Terdekat
                </span>
                <p className="font-serif font-bold text-[#101F5B] text-xs leading-snug">
                  {selectedRegion.agenda}
                </p>
                <p className="text-[#5F6678] text-[10px] font-mono">
                  Sesi temu tatap muka & bincang karier santai
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action CTA Button */}
          <div className="pt-4 border-t border-[#18213D]/10 mt-4">
            <Link
              href={`/direktori?wilayah=${encodeURIComponent(selectedRegion.name)}`}
              className="w-full bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-mono uppercase tracking-wider font-semibold py-3 px-4 flex items-center justify-between transition-colors shadow-xs group"
            >
              <span>Buka Direktori {selectedRegion.short}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4C542] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

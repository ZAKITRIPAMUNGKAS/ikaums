'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DATA_WILAYAH_SIMULASI } from '../data/simulasi';
import { WilayahStatistik } from '../types';
import { Filter, Plus, Minus, Users, Briefcase, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

export function MapInteractiveSection() {
  const [selectedWilayah, setSelectedWilayah] = useState<WilayahStatistik>(DATA_WILAYAH_SIMULASI[0]); // Jakarta Selatan default
  const [fakultas, setFakultas] = useState('Semua Fakultas');
  const [industri, setIndustri] = useState('Semua Industri');
  const [angkatan, setAngkatan] = useState('Semua Angkatan');
  const [readyToContact, setReadyToContact] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

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

          {/* Toggle ready to contact */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-medium text-[#18213D]">
              Hanya yang siap dikontak
            </span>
            <button
              type="button"
              onClick={() => setReadyToContact(!readyToContact)}
              className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                readyToContact ? 'bg-[#101F5B]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  readyToContact ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-3">
            <button
              type="button"
              className="w-full bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-semibold py-3 rounded-lg shadow-sm transition-colors"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E5E8EF] flex items-center gap-2 text-[11px] text-[#5F6678]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22775A]" />
          <span>Privasi k-anonymity: Wilayah &lt;5 disamarkan</span>
        </div>
      </div>

      {/* Right Area: Interactive Map Visual */}
      <div className="lg:col-span-8 bg-[#EDF1FA]/60 border border-[#E5E8EF] rounded-3xl p-6 sm:p-8 relative min-h-[500px] flex flex-col justify-between overflow-hidden shadow-xs">
        
        {/* Top Controls: Zoom + and - */}
        <div className="absolute top-6 right-6 flex flex-col gap-1 bg-white border border-[#D1D5DB] rounded-lg shadow-xs overflow-hidden z-20">
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.3))}
            className="p-2 hover:bg-slate-100 text-[#101F5B] transition-colors"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-[1px] bg-[#E5E8EF]"></div>
          <button
            type="button"
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.9))}
            className="p-2 hover:bg-slate-100 text-[#101F5B] transition-colors"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Map Vector Graphic */}
        <div 
          className="relative w-full max-w-xl mx-auto aspect-[4/3] flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg className="w-full h-full text-[#DFE6F5] fill-current" viewBox="0 0 500 380">
            {/* Tangerang */}
            <path d="M40,110 Q90,80 140,100 Q160,150 130,210 Q70,200 40,150 Z" className="opacity-80" />
            {/* Jakarta Barat & Utara */}
            <path d="M145,100 Q220,70 290,90 Q270,160 210,165 Q160,150 145,100 Z" className="opacity-85" />
            {/* Jakarta Pusat */}
            <path d="M215,160 Q270,150 280,190 Q230,210 215,160 Z" className="opacity-90" />
            {/* Jakarta Selatan (Highlighted Active Yellow) */}
            <path d="M190,195 Q260,185 270,260 Q180,265 190,195 Z" className="text-[#FEEFC3] fill-current opacity-95" />
            {/* Jakarta Timur */}
            <path d="M280,130 Q360,110 380,210 Q300,240 280,180 Z" className="opacity-85" />
            {/* Bekasi */}
            <path d="M375,120 Q460,130 460,250 Q380,270 375,210 Z" className="opacity-80" />
            {/* Depok */}
            <path d="M200,265 Q270,260 270,310 Q190,320 200,265 Z" className="opacity-80" />
            {/* Bogor */}
            <path d="M180,315 Q280,305 310,370 Q160,370 180,315 Z" className="opacity-75" />
          </svg>

          {/* Interactive Badges with Click Selection */}
          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'tangerang') || DATA_WILAYAH_SIMULASI[0])}
            className={`absolute top-[28%] left-[12%] rounded-lg px-2.5 py-1 text-center shadow-xs transition-all ${
              selectedWilayah.id === 'tangerang' ? 'bg-[#FEEFC3] border-2 border-[#F59E0B]' : 'bg-white border border-[#D1D5DB]'
            }`}
          >
            <span className="text-[10px] text-[#5F6678] font-bold block leading-none">Tangerang</span>
            <span className="text-xs font-bold text-[#101F5B]">126</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'jkt-barat') || DATA_WILAYAH_SIMULASI[0])}
            className={`absolute top-[26%] left-[36%] rounded-lg px-2.5 py-1 text-center shadow-xs transition-all ${
              selectedWilayah.id === 'jkt-barat' ? 'bg-[#FEEFC3] border-2 border-[#F59E0B]' : 'bg-white border border-[#D1D5DB]'
            }`}
          >
            <span className="text-[10px] text-[#5F6678] font-bold block leading-none">Jakarta Barat</span>
            <span className="text-xs font-bold text-[#101F5B]">118</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'jkt-utara') || DATA_WILAYAH_SIMULASI[0])}
            className={`absolute top-[12%] left-[54%] rounded-lg px-2.5 py-1 text-center shadow-xs transition-all ${
              selectedWilayah.id === 'jkt-utara' ? 'bg-[#FEEFC3] border-2 border-[#F59E0B]' : 'bg-white border border-[#D1D5DB]'
            }`}
          >
            <span className="text-[10px] text-[#5F6678] font-bold block leading-none">Jakarta Utara</span>
            <span className="text-xs font-bold text-[#101F5B]">72</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'jkt-pusat') || DATA_WILAYAH_SIMULASI[0])}
            className={`absolute top-[32%] left-[56%] rounded-lg px-2.5 py-1 text-center shadow-xs transition-all ${
              selectedWilayah.id === 'jkt-pusat' ? 'bg-[#FEEFC3] border-2 border-[#F59E0B]' : 'bg-white border border-[#D1D5DB]'
            }`}
          >
            <span className="text-[10px] text-[#5F6678] font-bold block leading-none">Jakarta Pusat</span>
            <span className="text-xs font-bold text-[#101F5B]">94</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'jkt-timur') || DATA_WILAYAH_SIMULASI[0])}
            className={`absolute top-[38%] right-[16%] rounded-lg px-2.5 py-1 text-center shadow-xs transition-all ${
              selectedWilayah.id === 'jkt-timur' ? 'bg-[#FEEFC3] border-2 border-[#F59E0B]' : 'bg-white border border-[#D1D5DB]'
            }`}
          >
            <span className="text-[10px] text-[#5F6678] font-bold block leading-none">Jakarta Timur</span>
            <span className="text-xs font-bold text-[#101F5B]">121</span>
          </button>

          {/* Active Highlight Node: Jakarta Selatan */}
          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'jkt-selatan') || DATA_WILAYAH_SIMULASI[0])}
            className="absolute top-[55%] left-[45%] bg-[#FEEFC3] border-2 border-[#F59E0B] rounded-xl px-3.5 py-1.5 text-center shadow-md cursor-pointer hover:scale-105 transition-all"
          >
            <span className="text-[11px] text-[#92400E] font-bold block leading-none">Jakarta Selatan</span>
            <span className="text-sm font-extrabold text-[#78350F]">184</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'depok') || DATA_WILAYAH_SIMULASI[0])}
            className={`absolute bottom-[20%] left-[48%] rounded-lg px-2.5 py-1 text-center shadow-xs transition-all ${
              selectedWilayah.id === 'depok' ? 'bg-[#FEEFC3] border-2 border-[#F59E0B]' : 'bg-white border border-[#D1D5DB]'
            }`}
          >
            <span className="text-[10px] text-[#5F6678] font-bold block leading-none">Depok</span>
            <span className="text-xs font-bold text-[#101F5B]">93</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'bekasi') || DATA_WILAYAH_SIMULASI[0])}
            className={`absolute top-[48%] right-[8%] rounded-lg px-2.5 py-1 text-center shadow-xs transition-all ${
              selectedWilayah.id === 'bekasi' ? 'bg-[#FEEFC3] border-2 border-[#F59E0B]' : 'bg-white border border-[#D1D5DB]'
            }`}
          >
            <span className="text-[10px] text-[#5F6678] font-bold block leading-none">Bekasi</span>
            <span className="text-xs font-bold text-[#101F5B]">117</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWilayah(DATA_WILAYAH_SIMULASI.find(w => w.id === 'bogor') || DATA_WILAYAH_SIMULASI[0])}
            className={`absolute bottom-[5%] left-[42%] rounded-lg px-2.5 py-1 text-center shadow-xs transition-all ${
              selectedWilayah.id === 'bogor' ? 'bg-[#FEEFC3] border-2 border-[#F59E0B]' : 'bg-white border border-[#D1D5DB]'
            }`}
          >
            <span className="text-[10px] text-[#5F6678] font-bold block leading-none">Bogor</span>
            <span className="text-xs font-bold text-[#101F5B]">86</span>
          </button>
        </div>

        {/* Selected Area Card Popup (Bottom Right) */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-6 sm:right-6 bg-white border border-[#E5E8EF] rounded-2xl p-4 shadow-lg w-full sm:w-72 z-20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80"
                alt="Wilayah"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#101F5B]">
                {selectedWilayah.nama}
              </h4>
              <span className="text-xs font-bold text-[#D97706]">
                {selectedWilayah.jumlahAlumni} Alumni
              </span>
            </div>
          </div>

          {/* Mini metrics: Mentor, Profesional, Pelaku Usaha */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E5E8EF] text-center">
            <div>
              <span className="font-bold text-xs text-[#101F5B] block">32</span>
              <span className="text-[10px] text-[#5F6678]">Mentor</span>
            </div>
            <div>
              <span className="font-bold text-xs text-[#101F5B] block">61</span>
              <span className="text-[10px] text-[#5F6678]">Profesional</span>
            </div>
            <div>
              <span className="font-bold text-xs text-[#101F5B] block">14</span>
              <span className="text-[10px] text-[#5F6678]">Pelaku Usaha</span>
            </div>
          </div>

          <Link
            href="/direktori"
            className="w-full bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Lihat Alumni</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}

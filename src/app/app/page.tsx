'use client';

import React, { useState } from 'react';
import { Navbar, Footer } from '@/components/Navigation';
import Link from 'next/link';
import { User, Users, Calendar, HeartHandshake, Shield, CheckCircle2, Settings, ArrowRight, Bell } from 'lucide-react';

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'koneksi' | 'bantuan' | 'pengaturan'>('ringkasan');
  const [optInDirectory, setOptInDirectory] = useState(true);
  const [optInMap, setOptInMap] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* User Greeting Header */}
        <div className="bg-white border border-[#E5E8EF] rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0B1536] text-[#F4C542] font-mono font-bold text-2xl flex items-center justify-center">
              MZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#0B1536]">
                  Muhammad Zaki, S.Kom.
                </h1>
                <span className="bg-[#22775A]/10 text-[#22775A] text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Alumni Terverifikasi</span>
                </span>
              </div>
              <p className="text-xs text-[#5F6678] mt-0.5">
                Teknik Informatika · Angkatan 2020 · Domisili: Jakarta Selatan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs bg-[#EDF1FA] hover:bg-[#101F5B] hover:text-white text-[#101F5B] font-semibold px-3 py-2 rounded-lg transition-colors border border-[#E5E8EF]"
            >
              Mode Dashboard Pengurus
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E8EF] pb-3 mb-8 overflow-x-auto">
          {[
            { id: 'ringkasan', label: 'Ringkasan & Rekomendasi' },
            { id: 'koneksi', label: 'Permintaan Koneksi (2)' },
            { id: 'bantuan', label: 'Modul Bantuan Alumni' },
            { id: 'pengaturan', label: 'Kontrol Privasi & Akun' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#101F5B] text-white shadow-sm'
                  : 'text-[#5F6678] hover:text-[#18213D] hover:bg-[#EDF1FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Ringkasan */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm">
                <span className="text-xs font-bold text-[#5F6678] uppercase tracking-wider">
                  Koneksi Terkonfirmasi
                </span>
                <div className="text-3xl font-extrabold text-[#0B1536] font-mono mt-2">12</div>
                <p className="text-xs text-[#5F6678] mt-1">Alumni saling terhubung aktif</p>
              </div>

              <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm">
                <span className="text-xs font-bold text-[#5F6678] uppercase tracking-wider">
                  Agenda Diikuti
                </span>
                <div className="text-3xl font-extrabold text-[#0B1536] font-mono mt-2">2</div>
                <p className="text-xs text-[#5F6678] mt-1">RSVP Temu Kangen & Workshop</p>
              </div>

              <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm">
                <span className="text-xs font-bold text-[#5F6678] uppercase tracking-wider">
                  Status Bantuan
                </span>
                <div className="text-3xl font-extrabold text-[#0F766E] font-mono mt-2">1 Aktif</div>
                <p className="text-xs text-[#5F6678] mt-1">Tawaran Mentoring Freshgrad</p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0B1536] mb-4">
                Rekomendasi Alumni Satu Wilayah (Jakarta Selatan)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-[#E5E8EF] rounded-lg bg-[#FAFAF8] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#18213D]">Rizky Pratama</h4>
                    <p className="text-xs text-[#5F6678]">Teknik Informatika 2016 · Lead Software Engineer</p>
                  </div>
                  <Link href="/direktori" className="text-xs font-semibold text-[#101F5B] underline">
                    Lihat Profil
                  </Link>
                </div>
                <div className="p-4 border border-[#E5E8EF] rounded-lg bg-[#FAFAF8] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#18213D]">Dian Anggraini</h4>
                    <p className="text-xs text-[#5F6678]">Farmasi 2019 · Regulatory Affairs</p>
                  </div>
                  <Link href="/direktori" className="text-xs font-semibold text-[#101F5B] underline">
                    Lihat Profil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Permintaan Koneksi */}
        {activeTab === 'koneksi' && (
          <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0B1536] mb-2">
              Permintaan Koneksi Masuk
            </h3>
            <p className="text-xs text-[#5F6678] mb-4">
              Menyetujui permintaan akan membagikan kontak profesional Anda melalui kanal yang aman.
            </p>

            <div className="border border-[#E5E8EF] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#101F5B]">Bambang Triyono</span>
                <span className="text-xs text-[#5F6678]"> · Teknik Sipil 2012 (Kota Bekasi)</span>
                <p className="text-xs text-[#18213D] mt-1 bg-[#EDF1FA] p-2.5 rounded-lg">
                  "Salam mas Zaki, saya ingin berdiskusi seputar peluang integrasi sistem manajemen proyek sipil untuk proyek di Bekasi."
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="text-xs font-semibold text-[#5F6678] hover:text-red-600 px-3 py-1.5 rounded border border-[#E5E8EF]">
                  Tolak
                </button>
                <button className="text-xs font-semibold bg-[#101F5B] text-white px-4 py-1.5 rounded hover:bg-[#18213D]">
                  Setujui Koneksi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bantuan Alumni */}
        {activeTab === 'bantuan' && (
          <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0B1536]">
                  Saya Bisa Bantu / Saya Butuh Bantuan
                </h3>
                <p className="text-xs text-[#5F6678]">
                  Fasilitasi pertukaran bantuan terstruktur yang dimoderasi oleh pengurus.
                </p>
              </div>
              <button className="text-xs font-semibold bg-[#F4C542] text-[#101F5B] px-3 py-2 rounded-lg">
                + Buat Postingan Bantuan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-[#22775A]/30 bg-[#22775A]/5 rounded-xl">
                <span className="text-[10px] font-bold text-[#22775A] uppercase tracking-wider block">
                  Saya Bisa Bantu (Tawaran Aktif Anda)
                </span>
                <h4 className="font-semibold text-sm text-[#18213D] mt-1">
                  Mentoring Mock Interview & Review Portofolio IT
                </h4>
                <p className="text-xs text-[#5F6678] mt-1">
                  Terbuka untuk 2 adik tingkat alumni UMS yang sedang melamar pekerjaan pertama di Jakarta.
                </p>
                <span className="inline-block mt-3 text-[10px] bg-white border border-[#22775A]/30 text-[#22775A] font-semibold px-2 py-0.5 rounded">
                  Status: Terbit & Terverifikasi
                </span>
              </div>

              <div className="p-4 border border-[#E5E8EF] bg-[#FAFAF8] rounded-xl">
                <span className="text-[10px] font-bold text-[#101F5B] uppercase tracking-wider block">
                  Permintaan Terbuka Komunitas
                </span>
                <h4 className="font-semibold text-sm text-[#18213D] mt-1">
                  Rujukan Kos / Tempat Tinggal Aman di Sekitar Kuningan
                </h4>
                <p className="text-xs text-[#5F6678] mt-1">
                  Diajukan oleh Alumnus Farmasi 2023 yang baru mulai magang di RS Jakarta Selatan.
                </p>
                <button className="mt-3 text-xs font-semibold text-[#101F5B] underline">
                  Tanggapi Bantuan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Kontrol Privasi & Akun */}
        {activeTab === 'pengaturan' && (
          <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#0B1536]">
                Pengaturan Privasi & Persetujuan (UU PDP)
              </h3>
              <p className="text-xs text-[#5F6678] mt-1">
                Kendalikan secara transparan bagaimana data profil Anda ditampilkan di platform.
              </p>
            </div>

            <div className="space-y-4 border-t border-[#E5E8EF] pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#18213D]">Keterlihatan di Direktori Alumni</h4>
                  <p className="text-[11px] text-[#5F6678]">Izinkan profil profesional Anda ditemukan oleh sesama alumni terdaftar.</p>
                </div>
                <input
                  type="checkbox"
                  checked={optInDirectory}
                  onChange={(e) => setOptInDirectory(e.target.checked)}
                  className="w-4 h-4 text-[#101F5B] rounded"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#E5E8EF] pt-4">
                <div>
                  <h4 className="text-xs font-bold text-[#18213D]">Kontribusi ke Peta Sebaran Wilayah</h4>
                  <p className="text-[11px] text-[#5F6678]">Sertakan data domisili tingkat kota Anda dalam angka agregat peta.</p>
                </div>
                <input
                  type="checkbox"
                  checked={optInMap}
                  onChange={(e) => setOptInMap(e.target.checked)}
                  className="w-4 h-4 text-[#101F5B] rounded"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E8EF] flex items-center justify-between">
              <button
                onClick={handleSaveSettings}
                className="bg-[#101F5B] hover:bg-[#18213D] text-[#FAFAF8] text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {savedSettings ? 'Pengaturan Tersimpan ✓' : 'Simpan Perubahan Privasi'}
              </button>

              <button className="text-xs text-red-600 hover:underline">
                Minta Ekspor atau Hapus Akun
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

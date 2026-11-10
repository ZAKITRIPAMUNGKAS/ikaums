'use client';

import React, { useState } from 'react';
import { Navbar, Footer } from '@/components/Navigation';
import Link from 'next/link';
import { Shield, Users, Calendar, CheckCircle2, XCircle, AlertCircle, FileText, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'verifikasi' | 'kegiatan' | 'moderasi' | 'analitik'>('verifikasi');
  const [approvedList, setApprovedList] = useState<string[]>([]);

  const pendingMembers = [
    { id: 'p1', nama: 'Fajar Nugroho, S.T.', prodi: 'Teknik Elektro', angkatan: 2017, wilayah: 'Jakarta Timur', bukti: 'Ijazah / LinkedIn terlampir' },
    { id: 'p2', nama: 'Annisa Rahmawati, S.Psi.', prodi: 'Psikologi', angkatan: 2019, wilayah: 'Kota Tangerang', bukti: 'Rujukan Alumni Terverifikasi' },
    { id: 'p3', nama: 'Hendri Kurniawan, S.E.', prodi: 'Ekonomi Pembangunan', angkatan: 2014, wilayah: 'Kota Bogor', bukti: 'Kartu Tanda Alumni' },
  ];

  const handleApprove = (id: string) => {
    setApprovedList([...approvedList, id]);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-[#101F5B] text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded text-xs text-[#F4C542] font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Otoritas Pengurus IKA UMS Jabodetabek</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard Pengurus Wilayah
            </h1>
            <p className="text-xs text-[#EDF1FA]/80 mt-1 max-w-xl">
              Pusat kendali verifikasi keanggotaan, manajemen acara, moderasi konten, dan evaluasi dampak komunitas berbasis data aman.
            </p>
          </div>

          <Link
            href="/app"
            className="text-xs font-semibold bg-white text-[#101F5B] px-4 py-2 rounded-lg hover:bg-[#EDF1FA] transition-colors"
          >
            Kembali ke Dashboard Member
          </Link>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E8EF] pb-3 mb-8 overflow-x-auto">
          {[
            { id: 'verifikasi', label: 'Verifikasi Anggota (3 Menunggu)' },
            { id: 'kegiatan', label: 'Manajemen Acara & Presensi' },
            { id: 'moderasi', label: 'Moderasi Bantuan & Koneksi' },
            { id: 'analitik', label: 'Analitik Dampak Komunitas' },
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

        {/* Tab 1: Verifikasi Anggota */}
        {activeTab === 'verifikasi' && (
          <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0B1536]">
              Daftar Permohonan Registrasi Sukarela
            </h3>
            <p className="text-xs text-[#5F6678] mb-4">
              Pengurus memastikan alumni benar merupakan lulusan UMS dan menjaga keabsahan data sebelum profil dibuka ke direktori.
            </p>

            <div className="divide-y divide-[#E5E8EF]">
              {pendingMembers.map((member) => {
                const isApproved = approvedList.includes(member.id);
                return (
                  <div key={member.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#18213D]">{member.nama}</span>
                        <span className="text-xs text-[#5F6678]">({member.prodi} {member.angkatan})</span>
                      </div>
                      <p className="text-xs text-[#5F6678] mt-0.5">
                        Wilayah: <strong>{member.wilayah}</strong> · Bukti: {member.bukti}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isApproved ? (
                        <span className="text-xs bg-[#22775A]/10 text-[#22775A] font-semibold px-3 py-1.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Telah Diverifikasi</span>
                        </span>
                      ) : (
                        <>
                          <button className="text-xs font-semibold text-red-600 px-3 py-1.5 border border-[#E5E8EF] rounded hover:bg-red-50">
                            Tolak
                          </button>
                          <button
                            onClick={() => handleApprove(member.id)}
                            className="text-xs font-semibold bg-[#22775A] text-white px-3 py-1.5 rounded hover:bg-[#1a5f48]"
                          >
                            Setujui Akun
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Manajemen Acara */}
        {activeTab === 'kegiatan' && (
          <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0B1536]">
                Agenda Temu Kangen & Workshop Aktif
              </h3>
              <button className="text-xs font-semibold bg-[#101F5B] text-white px-3 py-2 rounded-lg">
                + Tambah Kegiatan Baru
              </button>
            </div>
            <div className="p-4 border border-[#E5E8EF] rounded-lg bg-[#FAFAF8] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#18213D]">Temu Kangen & Kolaborasi Alumni UMS Jabodetabek 2026</h4>
                <p className="text-xs text-[#5F6678]">12 Des 2026 · Menteng · 78 Peserta Terdaftar (Kapasitas: 120)</p>
              </div>
              <button className="text-xs font-semibold text-[#101F5B] underline">
                Kelola Presensi QR
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Moderasi */}
        {activeTab === 'moderasi' && (
          <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0B1536]">
              Moderasi Konten & Laporan Komunitas
            </h3>
            <p className="text-xs text-[#5F6678]">
              Tidak ada laporan pelanggaran privasi atau penyalahgunaan kontak saat ini. Semua interaksi berjalan sesuai etika komunitas.
            </p>
          </div>
        )}

        {/* Tab 4: Analitik Dampak */}
        {activeTab === 'analitik' && (
          <div className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#0B1536]">
              Metrik Dampak Nyata Komunitas (Pilot Phase)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-[#E5E8EF] rounded-lg bg-[#FAFAF8]">
                <span className="text-xs text-[#5F6678]">Target Pendaftaran Sukarela (90 Hari)</span>
                <div className="text-2xl font-bold text-[#101F5B] mt-1">100 Target</div>
                <div className="text-xs text-[#22775A] font-semibold mt-1">218 Terdaftar (Simulasi)</div>
              </div>
              <div className="p-4 border border-[#E5E8EF] rounded-lg bg-[#FAFAF8]">
                <span className="text-xs text-[#5F6678]">Koneksi Dua Pihak Terkonfirmasi</span>
                <div className="text-2xl font-bold text-[#101F5B] mt-1">10 Target</div>
                <div className="text-xs text-[#22775A] font-semibold mt-1">14 Terkonfirmasi (Simulasi)</div>
              </div>
              <div className="p-4 border border-[#E5E8EF] rounded-lg bg-[#FAFAF8]">
                <span className="text-xs text-[#5F6678]">Insiden Privasi / Kebocoran Data</span>
                <div className="text-2xl font-bold text-[#22775A] mt-1">0 Insiden</div>
                <div className="text-xs text-[#22775A] font-semibold mt-1">Lulus Uji RLS & PDP</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

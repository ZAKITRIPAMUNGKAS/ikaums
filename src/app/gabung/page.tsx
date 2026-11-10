'use client';

import React, { useState } from 'react';
import { Navbar, Footer } from '@/components/Navigation';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export default function GabungPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    fakultas: 'Teknik',
    prodi: 'Teknik Informatika',
    angkatan: '2020',
    wilayah: 'Jakarta Selatan',
    industri: 'Teknologi Informasi',
    pekerjaan: '',
    optInDirectory: true,
    optInMap: true,
    agreeConsent: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeConsent) {
      alert('Mohon setujui ketentuan privasi data opt-in untuk melanjutkan.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0C1222] flex flex-col font-sans selection:bg-[#0B1536] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Editorial Page Header */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-[#0B1536]/5 text-[#0B1536] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-[#0B1536]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Registrasi Sukarela Anggota</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#0B1536] tracking-tight leading-[1.08]">
            Bergabung dengan IKA UMS Connect
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-xl leading-relaxed">
            Pendaftaran alumni UMS di wilayah Jabodetabek. Data profil Anda dikelola dengan transparansi penuh berlandaskan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022).
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-[#10B981]/30 rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-4">
            <div className="w-16 h-16 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="font-serif text-3xl font-normal text-[#0B1536]">
              Pendaftaran Berhasil Diajukan
            </h2>
            <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
              Terima kasih telah bergabung. Data Anda kini berada dalam status <strong className="text-[#0B1536]">Menunggu Verifikasi Pengurus</strong>. Tim kami akan melakukan validasi cepat terhadap data ijazah / angkatan Anda.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/"
                className="bg-[#0B1536] hover:bg-[#16234D] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-sm"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[#0C1222]/10 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#0B1536] mb-1.5">
                  Nama Lengkap Sesuai Ijazah / Dokumen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Zaki Tri Pamungkas"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#0C1222]/15 rounded-xl text-sm text-[#0C1222] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0B1536] focus:bg-white focus:ring-2 focus:ring-[#0B1536]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1536] mb-1.5">
                  Email Aktif *
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#0C1222]/15 rounded-xl text-sm text-[#0C1222] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0B1536] focus:bg-white focus:ring-2 focus:ring-[#0B1536]/10 transition-all"
                />
                <span className="text-[11px] text-[#64748B] mt-1 block">Privat. Tidak ditampilkan di direktori publik.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1536] mb-1.5">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#0C1222]/15 rounded-xl text-sm text-[#0C1222] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0B1536] focus:bg-white focus:ring-2 focus:ring-[#0B1536]/10 transition-all"
                />
                <span className="text-[11px] text-[#64748B] mt-1 block">Hanya dibagikan atas persetujuan kedua pihak.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1536] mb-1.5">
                  Program Studi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Teknik Informatika, Manajemen, Hukum, dll"
                  value={formData.prodi}
                  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#0C1222]/15 rounded-xl text-sm text-[#0C1222] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0B1536] focus:bg-white focus:ring-2 focus:ring-[#0B1536]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1536] mb-1.5">
                  Tahun Angkatan *
                </label>
                <input
                  type="number"
                  required
                  min={1970}
                  max={2026}
                  value={formData.angkatan}
                  onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#0C1222]/15 rounded-xl text-sm text-[#0C1222] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0B1536] focus:bg-white focus:ring-2 focus:ring-[#0B1536]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1536] mb-1.5">
                  Wilayah Domisili / Aktivitas di Jabodetabek *
                </label>
                <select
                  value={formData.wilayah}
                  onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#0C1222]/15 rounded-xl text-sm text-[#0C1222] focus:outline-none focus:border-[#0B1536] focus:bg-white focus:ring-2 focus:ring-[#0B1536]/10 transition-all"
                >
                  <option value="Jakarta Pusat">Jakarta Pusat</option>
                  <option value="Jakarta Selatan">Jakarta Selatan</option>
                  <option value="Jakarta Timur">Jakarta Timur</option>
                  <option value="Jakarta Barat">Jakarta Barat</option>
                  <option value="Jakarta Utara">Jakarta Utara</option>
                  <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                  <option value="Kota Bogor">Kota Bogor</option>
                  <option value="Kabupaten Bogor">Kabupaten Bogor</option>
                  <option value="Kota Depok">Kota Depok</option>
                  <option value="Kota Tangerang">Kota Tangerang</option>
                  <option value="Kabupaten Tangerang">Kabupaten Tangerang</option>
                  <option value="Kota Tangerang Selatan">Kota Tangerang Selatan</option>
                  <option value="Kota Bekasi">Kota Bekasi</option>
                  <option value="Kabupaten Bekasi">Kabupaten Bekasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1536] mb-1.5">
                  Bidang Industri / Pekerjaan Saat Ini *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Teknologi, Finansial, BUMN, Wirausaha, dll"
                  value={formData.industri}
                  onChange={(e) => setFormData({ ...formData, industri: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#0C1222]/15 rounded-xl text-sm text-[#0C1222] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0B1536] focus:bg-white focus:ring-2 focus:ring-[#0B1536]/10 transition-all"
                />
              </div>

            </div>

            {/* PRIVACY CONSENT SECTION (UU PDP) */}
            <div className="border-t border-[#0C1222]/10 pt-6 space-y-3.5 bg-[#FAF9F5] p-5 rounded-2xl border border-[#0C1222]/5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1536] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Persetujuan & Kendali Privasi Mandiri (Opt-in)</span>
              </div>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-[#475569]">
                <input
                  type="checkbox"
                  checked={formData.optInDirectory}
                  onChange={(e) => setFormData({ ...formData, optInDirectory: e.target.checked })}
                  className="mt-0.5 rounded text-[#0B1536] focus:ring-[#0B1536]"
                />
                <span>Tampilkan profil profesional saya di Direktori Alumni yang dapat diakses oleh sesama anggota terdaftar.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-[#475569]">
                <input
                  type="checkbox"
                  checked={formData.optInMap}
                  onChange={(e) => setFormData({ ...formData, optInMap: e.target.checked })}
                  className="mt-0.5 rounded text-[#0B1536] focus:ring-[#0B1536]"
                />
                <span>Sertakan domisili tingkat kota/kabupaten saya dalam agregasi statistik spasial Peta Sebaran Wilayah.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-[#0B1536] font-medium pt-2 border-t border-[#0C1222]/10">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeConsent}
                  onChange={(e) => setFormData({ ...formData, agreeConsent: e.target.checked })}
                  className="mt-0.5 rounded text-[#0B1536] focus:ring-[#0B1536]"
                />
                <span>Saya menyatakan data yang saya masukkan adalah benar, dan saya memberikan persetujuan eksplisit sesuai ketentuan UU PDP No. 27/2022.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0B1536] hover:bg-[#16234D] text-white font-semibold text-sm py-3.5 px-6 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Kirim Formulir Pendaftaran</span>
              <ArrowRight className="w-4 h-4 text-[#F4C542] group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

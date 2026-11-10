'use client';

import React, { useState } from 'react';
import { Navbar, Footer } from '@/components/Navigation';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#101F5B] bg-[#EDF1FA] px-3 py-1 rounded-full">
            Registrasi Sukarela
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B] mt-2">
            Bergabung dengan IKA UMS Connect
          </h1>
          <p className="text-sm text-[#5F6678] mt-1 leading-relaxed">
            Pendaftaran alumni UMS di wilayah Jabodetabek. Data Anda dikelola dengan transparansi penuh sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP).
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-[#22775A]/30 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#22775A]/10 text-[#22775A] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#101F5B]">
              Pendaftaran Sukarela Berhasil Diajukan
            </h2>
            <p className="text-sm text-[#5F6678] max-w-md mx-auto mt-2 leading-relaxed">
              Terima kasih telah bergabung. Data Anda kini berada dalam status <strong className="text-[#101F5B]">Menunggu Verifikasi Pengurus</strong>. Anda dapat masuk untuk melengkapi preferensi profil dan pengaturan privasi.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/app"
                className="bg-[#101F5B] hover:bg-[#18213D] text-[#FAFAF8] text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Buka Dashboard Member
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[#E5E8EF] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#18213D] mb-1">
                  Nama Lengkap Sesuai Ijazah / Dokumen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Zaki"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E8EF] rounded-lg text-sm text-[#18213D] focus:outline-none focus:border-[#101F5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18213D] mb-1">
                  Email Aktif *
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E8EF] rounded-lg text-sm text-[#18213D] focus:outline-none focus:border-[#101F5B]"
                />
                <span className="text-[10px] text-[#5F6678]">Privat. Tidak akan ditampilkan di direktori.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18213D] mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E8EF] rounded-lg text-sm text-[#18213D] focus:outline-none focus:border-[#101F5B]"
                />
                <span className="text-[10px] text-[#5F6678]">Hanya dibagikan atas persetujuan kedua pihak.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18213D] mb-1">
                  Program Studi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Informatika, Manajemen, Hukum, dll"
                  value={formData.prodi}
                  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E8EF] rounded-lg text-sm text-[#18213D] focus:outline-none focus:border-[#101F5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18213D] mb-1">
                  Tahun Angkatan *
                </label>
                <input
                  type="number"
                  required
                  min={1970}
                  max={2026}
                  value={formData.angkatan}
                  onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E8EF] rounded-lg text-sm text-[#18213D] focus:outline-none focus:border-[#101F5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18213D] mb-1">
                  Wilayah Domisili / Aktivitas di Jabodetabek *
                </label>
                <select
                  value={formData.wilayah}
                  onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E8EF] rounded-lg text-sm text-[#18213D] focus:outline-none focus:border-[#101F5B]"
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
                <label className="block text-xs font-semibold text-[#18213D] mb-1">
                  Bidang Industri / Pekerjaan Saat Ini *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Teknologi, Finansial, BUMN, Wirausaha, dll"
                  value={formData.industri}
                  onChange={(e) => setFormData({ ...formData, industri: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E8EF] rounded-lg text-sm text-[#18213D] focus:outline-none focus:border-[#101F5B]"
                />
              </div>
            </div>

            {/* PRIVACY CONSENT SECTION (UU PDP) */}
            <div className="border-t border-[#E5E8EF] pt-6 space-y-3">
              <h3 className="text-xs font-bold text-[#101F5B] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#22775A]" />
                <span>Persetujuan & Kendali Privasi (Opt-in)</span>
              </h3>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#5F6678]">
                <input
                  type="checkbox"
                  checked={formData.optInDirectory}
                  onChange={(e) => setFormData({ ...formData, optInDirectory: e.target.checked })}
                  className="mt-0.5 rounded text-[#101F5B]"
                />
                <span>Tampilkan profil profesional saya di Direktori Alumni yang dapat diakses oleh sesama anggota.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#5F6678]">
                <input
                  type="checkbox"
                  checked={formData.optInMap}
                  onChange={(e) => setFormData({ ...formData, optInMap: e.target.checked })}
                  className="mt-0.5 rounded text-[#101F5B]"
                />
                <span>Sertakan domisili tingkat kota saya dalam penghitungan agregat Peta Sebaran Wilayah.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#18213D] font-medium pt-2 border-t border-[#E5E8EF]">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeConsent}
                  onChange={(e) => setFormData({ ...formData, agreeConsent: e.target.checked })}
                  className="mt-0.5 rounded text-[#101F5B]"
                />
                <span>Saya menyatakan data yang saya masukkan adalah sukarela dan benar, serta menyetujui ketentuan privasi data IKA UMS Connect.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#101F5B] hover:bg-[#18213D] text-[#FAFAF8] font-semibold text-sm py-3 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Kirim Formulir Pendaftaran</span>
              <ArrowRight className="w-4 h-4 text-[#F4C542]" />
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

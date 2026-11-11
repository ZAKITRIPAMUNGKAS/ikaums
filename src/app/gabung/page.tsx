'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const WILAYAH_OPTIONS = [
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Jakarta Barat',
  'Jakarta Timur',
  'Jakarta Utara',
  'Tangerang Raya',
  'Bekasi',
  'Depok',
  'Bogor',
];

const FAKULTAS_PRODI_UMS: { fakultas: string; prodi: string[] }[] = [
  {
    fakultas: 'Fakultas Teknik',
    prodi: [
      'Teknik Sipil',
      'Teknik Mesin',
      'Teknik Elektro',
      'Teknik Kimia',
      'Teknik Industri',
      'Arsitektur',
    ],
  },
  {
    fakultas: 'Fakultas Ekonomi dan Bisnis',
    prodi: ['Manajemen', 'Akuntansi', 'Ekonomi Pembangunan', 'Bisnis Digital'],
  },
  {
    fakultas: 'Fakultas Komunikasi dan Informatika',
    prodi: ['Teknik Informatika', 'Sistem Informasi', 'Ilmu Komunikasi', 'Kecerdasan Buatan'],
  },
  {
    fakultas: 'Fakultas Hukum dan Ilmu Politik',
    prodi: ['Ilmu Hukum', 'Hubungan Internasional', 'Administrasi Publik'],
  },
  {
    fakultas: 'Fakultas Keguruan dan Ilmu Pendidikan',
    prodi: [
      'Pendidikan Matematika',
      'Pendidikan Bahasa Inggris',
      'Pendidikan Bahasa dan Sastra Indonesia',
      'Pendidikan Akuntansi',
      'Pendidikan PPKn',
      'Pendidikan Biologi',
      'Pendidikan Geografi',
      'PGSD',
      'PG-PAUD',
      'Pendidikan Teknik Informatika',
      'Pendidikan Olahraga',
    ],
  },
  {
    fakultas: 'Fakultas Psikologi',
    prodi: ['Psikologi'],
  },
  {
    fakultas: 'Fakultas Ilmu Kesehatan',
    prodi: ['Keperawatan', 'Ilmu Gizi', 'Kesehatan Masyarakat', 'Fisioterapi'],
  },
  {
    fakultas: 'Fakultas Farmasi',
    prodi: ['Farmasi'],
  },
  {
    fakultas: 'Fakultas Kedokteran & Kedokteran Gigi',
    prodi: ['Kedokteran', 'Pendidikan Dokter Gigi'],
  },
  {
    fakultas: 'Fakultas Geografi',
    prodi: ['Geografi', 'Sains Informasi Geografi'],
  },
  {
    fakultas: 'Fakultas Agama Islam',
    prodi: ['Pendidikan Agama Islam', 'Hukum Ekonomi Syariah', "Ilmu Al-Qur'an dan Tafsir"],
  },
  {
    fakultas: 'Pascasarjana, Profesi & Lainnya',
    prodi: ['Magister (S2) UMS', 'Doktor (S3) UMS', 'Program Profesi (Dokter / Apoteker / Ners / PPG)', 'Program Studi Lainnya'],
  },
];

const ANGKATAN_OPTIONS = Array.from({ length: 2026 - 1975 + 1 }, (_, idx) => String(2026 - idx));

export default function GabungPage() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    whatsapp: '',
    prodi: '',
    angkatan: '',
    wilayah: 'Jakarta Selatan',
    pekerjaan: '',
    perusahaan: '',
    siapMentoring: false,
    tampilDiDirektori: true,
    tampilDiPeta: true,
    agreeConsent: false,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap.trim() || !formData.email.trim() || !formData.prodi.trim() || !formData.angkatan.trim()) {
      setErrorMsg('Mohon lengkapi seluruh kolom wajib bertanda bintang (*).');
      return;
    }
    if (!formData.agreeConsent) {
      setErrorMsg('Mohon centang persetujuan pengelolaan data pribadi sebelum mengirim pendaftaran.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748B] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0C2340] font-medium">Pendaftaran Anggota</span>
        </nav>

        {!submitted ? (
          <>
            <header className="mb-8 sm:mb-10 max-w-2xl space-y-3">
              <p className="text-sm font-semibold text-[#D97706]">
                Registrasi Sukarela Alumni
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C2340] leading-tight">
                Bergabung dengan Jaringan Alumni IKA UMS Jabodetabek
              </h1>
              <p className="text-base text-[#475569] leading-relaxed">
                Lengkapi data dasar Anda agar koordinator wilayah dapat menghubungkan Anda dengan rekan seangkatan, komunitas domisili terdekat, serta kegiatan kopdar resmi.
              </p>
            </header>

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
              noValidate
            >
              {errorMsg && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="namaLengkap" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                    Nama Lengkap dengan Gelar <span className="text-[#D97706]">*</span>
                  </label>
                  <input
                    id="namaLengkap"
                    type="text"
                    required
                    placeholder="Contoh: Ir. Bagus Prasetyo, S.T., M.T."
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm text-[#0C2340]"
                  />
                  <p className="mt-1 text-xs text-[#64748B]">
                    Cantumkan gelar akademik atau profesi di depan/belakang nama sesuai penulisan resmi Anda.
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                    Email Aktif <span className="text-[#D97706]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm text-[#0C2340]"
                  />
                  <p className="mt-1 text-xs text-[#64748B]">Tidak dipublikasikan ke halaman umum.</p>
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                    Nomor WhatsApp <span className="text-[#D97706]">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm text-[#0C2340]"
                  />
                  <p className="mt-1 text-xs text-[#64748B]">Untuk undangan grup wilayah dan konfirmasi.</p>
                </div>

                <div>
                  <label htmlFor="prodi" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                    Program Studi di UMS <span className="text-[#D97706]">*</span>
                  </label>
                  <select
                    id="prodi"
                    required
                    value={formData.prodi}
                    onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm ${
                      formData.prodi ? 'text-[#0C2340]' : 'text-[#64748B]'
                    }`}
                  >
                    <option value="">Pilih program studi...</option>
                    {FAKULTAS_PRODI_UMS.map((grup) => (
                      <optgroup key={grup.fakultas} label={grup.fakultas}>
                        {grup.prodi.map((item) => (
                          <option key={item} value={item} className="text-[#0C2340]">
                            {item}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="angkatan" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                    Tahun Angkatan Masuk <span className="text-[#D97706]">*</span>
                  </label>
                  <select
                    id="angkatan"
                    required
                    value={formData.angkatan}
                    onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm ${
                      formData.angkatan ? 'text-[#0C2340]' : 'text-[#64748B]'
                    }`}
                  >
                    <option value="">Pilih tahun angkatan...</option>
                    {ANGKATAN_OPTIONS.map((tahun) => (
                      <option key={tahun} value={tahun} className="text-[#0C2340]">
                        {tahun}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="wilayah" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                    Domisili / Area Aktivitas <span className="text-[#D97706]">*</span>
                  </label>
                  <select
                    id="wilayah"
                    value={formData.wilayah}
                    onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm text-[#0C2340]"
                  >
                    {WILAYAH_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pekerjaan" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                    Peran / Bidang Pekerjaan
                  </label>
                  <input
                    id="pekerjaan"
                    type="text"
                    placeholder="Contoh: Product Manager / Wirausaha"
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm text-[#0C2340]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="perusahaan" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                    Instansi, Perusahaan, atau Usaha (Opsional)
                  </label>
                  <input
                    id="perusahaan"
                    type="text"
                    placeholder="Contoh: Konsultan Konstruksi Mandiri"
                    value={formData.perusahaan}
                    onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm text-[#0C2340]"
                  />
                </div>
              </div>

              {/* Preferensi Partisipasi & Privasi */}
              <div className="bg-[#FDFCF7] border border-[#0C2340]/10 rounded-xl p-5 space-y-3.5">
                <h2 className="text-sm font-bold text-[#0C2340]">
                  Preferensi Tampilan & Privasi
                </h2>

                <label className="flex items-start gap-3 cursor-pointer text-sm text-[#475569]">
                  <input
                    type="checkbox"
                    checked={formData.tampilDiDirektori}
                    onChange={(e) => setFormData({ ...formData, tampilDiDirektori: e.target.checked })}
                    className="mt-0.5 rounded border-[#0C2340]/30 text-[#0C2340] focus:ring-[#0C2340]"
                  />
                  <span>Tampilkan nama, angkatan, dan peran profesional saya di Direktori Alumni (tanpa email dan nomor WhatsApp).</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-sm text-[#475569]">
                  <input
                    type="checkbox"
                    checked={formData.tampilDiPeta}
                    onChange={(e) => setFormData({ ...formData, tampilDiPeta: e.target.checked })}
                    className="mt-0.5 rounded border-[#0C2340]/30 text-[#0C2340] focus:ring-[#0C2340]"
                  />
                  <span>Sertakan domisili kota/kabupaten saya dalam penghitungan jumlah wilayah di Peta Sebaran.</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-sm text-[#475569]">
                  <input
                    type="checkbox"
                    checked={formData.siapMentoring}
                    onChange={(e) => setFormData({ ...formData, siapMentoring: e.target.checked })}
                    className="mt-0.5 rounded border-[#0C2340]/30 text-[#0C2340] focus:ring-[#0C2340]"
                  />
                  <span>Saya terbuka dihubungi adik tingkat atau sesama alumni untuk sesi berbagi pengalaman (mentoring).</span>
                </label>

                <div className="pt-2 border-t border-[#0C2340]/10">
                  <label className="flex items-start gap-3 cursor-pointer text-sm text-[#0C2340] font-medium">
                    <input
                      type="checkbox"
                      checked={formData.agreeConsent}
                      onChange={(e) => setFormData({ ...formData, agreeConsent: e.target.checked })}
                      className="mt-0.5 rounded border-[#0C2340]/30 text-[#0C2340] focus:ring-[#0C2340]"
                    />
                    <span>
                      Saya menyetujui{' '}
                      <Link href="/privasi" className="underline decoration-[#D97706] underline-offset-4 hover:text-[#D97706]">
                        Kebijakan Privasi
                      </Link>{' '}
                      dan{' '}
                      <Link href="/syarat" className="underline decoration-[#D97706] underline-offset-4 hover:text-[#D97706]">
                        Ketentuan Komunitas
                      </Link>{' '}
                      IKA UMS Jabodetabek.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[#64748B]">
                  Mode pratinjau: pengiriman formulir tidak menyimpan data ke peladen publik.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Kirim Pendaftaran Alumni
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-xs space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#D97706]">
                Pendaftaran Simulasi Diterima
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0C2340]">
                Terima kasih, {formData.namaLengkap}
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Data pratinjau untuk angkatan <strong>{formData.angkatan}</strong> ({formData.prodi}) wilayah{' '}
                <strong>{formData.wilayah}</strong> telah dicatat dalam sesi ini. Pada operasional penuh, koordinator wilayah akan mengirimkan konfirmasi ke <strong>{formData.email}</strong>.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/direktori"
                className="px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
              >
                Jelajahi Direktori Alumni
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors cursor-pointer"
              >
                Ubah Data Formulir
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

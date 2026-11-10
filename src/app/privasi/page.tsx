import React from 'react';
import { Navbar, Footer } from '@/components/Navigation';
import { Shield, Lock, FileCheck, CheckCircle2 } from 'lucide-react';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8 border-b border-[#E5E8EF] pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#101F5B] bg-[#EDF1FA] px-3 py-1 rounded-full">
            Inisiatif & Kebijakan
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B] mt-3">
            Tentang IKA UMS Connect & Tata Kelola Privasi
          </h1>
          <p className="text-sm text-[#5F6678] mt-2 leading-relaxed">
            Panduan transparansi inisiatif komunitas, pengelolaan data sukarela, dan kepatuhan terhadap Undang-Undang Perlindungan Data Pribadi (UU PDP).
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-[#18213D]">
          <section className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#101F5B] mb-3">
              1. Latar Belakang & Status Inisiatif
            </h2>
            <p className="text-[#5F6678]">
              IKA UMS Connect digagas dari semangat kebersamaan acara temu kangen alumni Universitas Muhammadiyah Surakarta di wilayah Jabodetabek. Platform ini hadir sebagai usulan inisiatif digital (pilot project) untuk menghubungkan silaturahmi menjadi jejaring peluang karir, bisnis, dan pendampingan perantau baru.
            </p>
            <div className="mt-4 p-3 bg-[#EDF1FA] rounded-lg text-xs text-[#101F5B] font-medium">
              Catatan: Status saat ini adalah prototipe konsep/pilot komunitas. Platform tidak mengklaim integrasi resmi atau penggunaan aset kampus tanpa persetujuan sah dari pengurus wilayah.
            </div>
          </section>

          <section className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#22775A]" />
              <h2 className="font-serif text-xl font-bold text-[#101F5B]">
                2. Prinsip Perlindungan Data Pribadi (UU PDP)
              </h2>
            </div>
            <ul className="space-y-3 text-[#5F6678]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22775A] shrink-0 mt-0.5" />
                <span><strong>Sepenuhnya Opt-In:</strong> Keanggotaan grup WhatsApp atau presensi acara temu kangen TIDAK diimpor secara sepihak atau dianggap sebagai izin publikasi data.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22775A] shrink-0 mt-0.5" />
                <span><strong>Privasi Kontak:</strong> Nomor telepon dan email pribadi tidak pernah dipajang secara bebas di web. Saling tukar kontak hanya dapat terjadi setelah permintaan koneksi disetujui kedua belah pihak.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22775A] shrink-0 mt-0.5" />
                <span><strong>Agregasi Peta Berstandar K-Anonymity:</strong> Peta wilayah hanya menampilkan statistik agregat. Wilayah dengan jumlah alumni terdaftar di bawah 5 disembunyikan untuk mencegah identifikasi individu.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22775A] shrink-0 mt-0.5" />
                <span><strong>Hak Pemilik Data:</strong> Setiap alumni berhak mengubah izin keterlihatan profil, mengunduh salinan data pribadi, maupun mengajukan penghapusan akun sewaktu-waktu.</span>
              </li>
            </ul>
          </section>

          <section className="bg-white border border-[#E5E8EF] rounded-xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#101F5B] mb-3">
              3. Verifikasi & Integritas Keanggotaan
            </h2>
            <p className="text-[#5F6678]">
              Untuk menjaga rasa aman di dalam komunitas, status alumni diverifikasi secara bertahap melalui konfirmasi data angkatan/program studi dan verifikasi peer-to-peer antaralumni sesama fakultas.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

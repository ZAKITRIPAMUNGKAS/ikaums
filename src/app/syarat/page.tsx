import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { COMMUNITY_PLACEHOLDERS } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Ketentuan Komunitas — IKA UMS Wilayah Jabodetabek',
  description:
    'Aturan sederhana penggunaan situs, etika berinteraksi, dan batasan penggunaan data anggota IKA UMS Wilayah Jabodetabek.',
};

export default function SyaratPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <nav aria-label="Breadcrumb" className="text-sm text-[#475569] mb-6 flex items-center gap-2">
          <Link
            href="/"
            className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]"
          >
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0C2340] font-medium">Ketentuan Komunitas</span>
        </nav>

        <header className="pb-8 border-b border-[#0C2340]/12 space-y-3">
          <p className="text-sm font-semibold text-[#B45309]">
            Aturan Bersama
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C2340]">
            Ketentuan &amp; Etika Komunitas IKA UMS Jabodetabek
          </h1>
          <p className="text-base text-[#475569] leading-relaxed">
            Kesepakatan dasar agar Daftar Anggota, jadwal kopdar, Mentoring Alumni, serta Info Kerja &amp;
            Usaha tetap nyaman dan saling menghormati bagi seluruh alumni Universitas Muhammadiyah Surakarta.
          </p>
          <p className="text-sm text-[#475569]">
            Status organisasi: {COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}
          </p>
        </header>

        <div className="py-8 space-y-8 text-[15px] sm:text-base text-[#334155] leading-relaxed">
          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              1. Siapa yang Dapat Bergabung
            </h2>
            <p>
              Komunitas ini ditujukan bagi lulusan maupun alumni Universitas Muhammadiyah Surakarta
              (diploma, sarjana, profesi, maupun pascasarjana) yang saat ini berdomisili, bekerja, atau
              banyak beraktivitas di Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              2. Etika Komunikasi &amp; Info Kerja
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-[#475569]">
              <li>Gunakan bahasa yang sopan dan menghargai rekan lintas fakultas maupun angkatan.</li>
              <li>Jangan mengirimkan pesan berantai, promosi komersial tanpa izin, tawaran investasi mencurigakan, atau spam lowongan yang tidak jelas sumbernya.</li>
              <li>Info Kerja &amp; Usaha yang dibagikan antaranggota harus menyebut peran, lokasi, atau kontak resmi perusahaan/usaha dengan jelas.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              3. Larangan Pengumpulan Data Anggota
            </h2>
            <p>
              Informasi rekan alumni di Daftar Anggota hanya ditujukan untuk saling mengenal antaralumni,
              mencari teman satu wilayah, dan kebutuhan mentoring atau kerja sama profesional yang wajar.
              Pengguna dilarang menyalin, mengumpulkan secara otomatis (scraping), atau memindahkan daftar
              anggota ke luar komunitas untuk kepentingan pemasaran massal.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              4. Kesepakatan Sesi Mentoring Alumni
            </h2>
            <p>
              Alumni yang bersedia menjadi mentor meluangkan waktu secara sukarela di sela kesibukan kerja.
              Pemohon bimbingan diharapkan menyiapkan pertanyaan spesifik sejak awal (misalnya ulas CV atau
              persiapan wawancara), menghormati jadwal yang disepakati, dan tidak memaksa di luar kesediaan mentor.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              5. Moderasi &amp; Penghapusan Akses
            </h2>
            <p>
              Pengurus wilayah berhak memeriksa kesesuaian data alumni saat pendaftaran serta menonaktifkan
              atau menghapus profil yang melanggar etika komunitas, menyalahgunakan data anggota lain, atau
              terbukti memalsukan identitas alumni UMS. Pertanyaan atau laporan pelanggaran dapat disampaikan
              ke <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactEmail}</span>.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/privasi"
            className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#0C2340] hover:text-[#B45309] transition-colors"
          >
            &larr; Baca Kebijakan Privasi
          </Link>
          <Link
            href="/gabung"
            className="inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
          >
            Setuju &amp; daftar jadi anggota
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';

export default function SyaratPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748B] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0C2340] font-medium">Ketentuan & Etika Komunitas</span>
        </nav>

        <header className="pb-8 border-b border-[#0C2340]/12 space-y-3">
          <p className="text-sm font-semibold text-[#D97706]">
            Pedoman Bersama
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C2340]">
            Ketentuan Penggunaan & Etika Komunitas IKA UMS Jabodetabek
          </h1>
          <p className="text-base text-[#475569] leading-relaxed">
            Aturan sederhana agar ruang silaturahmi, direktori profesi, dan kegiatan mentoring tetap nyaman, saling menghormati, dan bermanfaat bagi seluruh alumni Universitas Muhammadiyah Surakarta.
          </p>
          <p className="text-sm text-[#64748B]">
            Berlaku untuk seluruh anggota terdaftar dan pengakses portal komunitas
          </p>
        </header>

        <div className="py-8 space-y-8 text-[15px] sm:text-base text-[#334155] leading-relaxed">
          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              1. Keanggotaan Alumni
            </h2>
            <p>
              Direktori anggota dan fitur mentoring diperuntukkan bagi lulusan maupun mantan mahasiswa Universitas Muhammadiyah Surakarta (program diploma, sarjana, maupun pascasarjana) yang berdomisili, bekerja, atau beraktivitas rutin di wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              2. Etika Berinteraksi & Saling Menjaga
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-[#475569]">
              <li>Menghargai sesama alumni lintas fakultas dan angkatan dengan komunikasi yang sopan serta profesional.</li>
              <li>Tidak memanfaatkan forum mentoring atau papan rujukan untuk menyebarkan pesan spam, penawaran investasi mencurigakan, atau promosi berulang di luar konteks.</li>
              <li>Menghindari konten provokatif, ujaran kebencian, maupun informasi palsu yang merugikan nama baik individu ataupun almamater.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              3. Larangan Pengambilan Data Massal
            </h2>
            <p>
              Informasi profil rekan alumni di direktori hanya boleh digunakan untuk keperluan silaturahmi, rujukan kerja yang wajar, dan kolaborasi komunitas. Anggota dilarang keras menyalin, melakukan pengumpulan otomatis (scraping), atau meneruskan daftar anggota ke pihak luar untuk keperluan pemasaran komersial.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              4. Kesepakatan Sesi Mentoring
            </h2>
            <p>
              Alumni yang terdaftar sebagai mentor meluangkan waktu secara sukarela di luar jam kerja utama mereka. Peserta bimbingan diharapkan menyampaikan latar belakang pertanyaan secara ringkas sejak awal, hadir tepat waktu pada sesi yang disepakati, serta menjaga kerahasiaan diskusi internal kantor masing-masing.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              5. Moderasi Pengurus
            </h2>
            <p>
              Pengurus wilayah bersama admin portal berhak meninjau laporan pelanggaran, menonaktifkan sementara akses profil, atau mencabut status keanggotaan apabila terbukti terjadi pelanggaran berat terhadap etika komunitas maupun penyalahgunaan data pribadi anggota lain.
            </p>
          </section>
        </div>

        <footer className="pt-6 border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/privasi" className="text-sm font-semibold text-[#0C2340] hover:text-[#D97706] transition-colors">
            &larr; Baca Kebijakan Privasi
          </Link>
          <Link
            href="/gabung"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
          >
            Setuju & Daftar Anggota
          </Link>
        </footer>
      </main>

      <Footer />
    </div>
  );
}

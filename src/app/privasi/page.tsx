import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { COMMUNITY_PLACEHOLDERS } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — IKA UMS Wilayah Jabodetabek',
  description:
    'Penjelasan terbuka mengenai cara pengumpulan, penyimpanan, dan perlindungan data pribadi pendaftar IKA UMS Wilayah Jabodetabek.',
};

export default function PrivasiPage() {
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
          <span className="text-[#0C2340] font-medium">Kebijakan Privasi</span>
        </nav>

        <header className="pb-8 border-b border-[#0C2340]/12 space-y-3">
          <p className="text-sm font-semibold text-[#B45309]">
            Privasi &amp; Data Pendaftar
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C2340]">
            Kebijakan Privasi IKA UMS Wilayah Jabodetabek
          </h1>
          <p className="text-base text-[#475569] leading-relaxed">
            Dokumen ini menjelaskan secara apa adanya data apa yang kami minta saat kamu mendaftar,
            bagaimana data itu digunakan pengurus, dan hak kamu untuk mengubah atau menghapusnya.
          </p>
          <p className="text-sm text-[#475569]">
            Pembaruan terakhir: November 2026 (Tahap Prapeluncuran)
          </p>
        </header>

        <div className="py-8 space-y-8 text-[15px] sm:text-base text-[#334155] leading-relaxed">
          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              1. Data yang Kamu Isikan Sendiri
            </h2>
            <p>
              Pada tahap pendaftaran awal, kami hanya meminta informasi yang memang dibutuhkan untuk
              memverifikasi latar alumni UMS dan mengabari kegiatan di wilayahmu: nama lengkap
              (beserta gelar bila diisi), tahun masuk, program studi di UMS, wilayah domisili di
              Jabodetabek, dan nomor WhatsApp aktif. Alamat email, pekerjaan, serta kesediaan
              mentoring bersifat opsional.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0C2340]">
              2. Pemisahan Profil Anggota dan Kontak Pribadi
            </h2>
            <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 my-3">
              <div>
                <h3 className="font-bold text-[#0C2340] mb-2 text-sm">
                  Boleh Tampil di Daftar Anggota (Hanya Jika Kamu Pilih)
                </h3>
                <ul className="space-y-1.5 text-sm text-[#475569] list-disc pl-4">
                  <li>Nama lengkap serta program studi &amp; angkatan UMS</li>
                  <li>Wilayah domisili tingkat kota/kabupaten di Jabodetabek</li>
                  <li>Profesi atau bidang kerja (jika kamu isi)</li>
                  <li>Status kesediaan mentoring alumni</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#0C2340] mb-2 text-sm">
                  Selalu Tertutup untuk Umum
                </h3>
                <ul className="space-y-1.5 text-sm text-[#475569] list-disc pl-4">
                  <li>Nomor WhatsApp dan alamat email pribadi</li>
                  <li>Catatan verifikasi pengurus</li>
                  <li>Alasan atau pesan pribadi saat mengajukan mentoring</li>
                  <li>Lokasi tempat tinggal spesifik (tidak pernah diminta)</li>
                </ul>
              </div>
            </div>
            <p>
              Secara bawaan (<em>default</em>), pilihan untuk tampil di Daftar Anggota berstatus{' '}
              <strong className="text-[#0C2340]">Tidak</strong>. Profilmu hanya akan terlihat oleh
              sesama anggota yang sudah masuk apabila kamu memberi izin secara eksplisit. Nomor
              WhatsApp dan email tidak pernah dipajang di halaman terbuka.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              3. Penggunaan Data Saat Tahap Prapeluncuran
            </h2>
            <p>
              Saat ini situs masih dalam tahap prapeluncuran dan belum terhubung ke sistem masuk akun
              otomatis. Data pendaftaran yang dikirim digunakan pengurus Jabodetabek untuk mencatat
              sebaran minat per wilayah dan menghubungi pendaftar saat jadwal kopdar pertama maupun
              pembukaan akun anggota siap dijalankan. Kami tidak menjual, menyewakan, atau
              membagikan data pendaftar kepada pihak komersial di luar komunitas.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              4. Penghitungan Sebaran Wilayah
            </h2>
            <p>
              Jika fitur rekap sebaran wilayah diaktifkan setelah data asli terkumpul, angka yang
              tampil hanyalah jumlah pendaftar secara agregat pada level 9 kota/kabupaten Jabodetabek
              (Jakarta Selatan, Jakarta Pusat, Jakarta Barat, Jakarta Timur, Jakarta Utara,
              Tangerang Raya, Bekasi, Depok, dan Bogor). Situs ini tidak melacak koordinat GPS.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              5. Cara Memperbarui atau Menghapus Data
            </h2>
            <p>
              Kamu dapat meminta perbaikan data, menarik izin tampil di Daftar Anggota, atau meminta
              penghapusan penuh data pendaftaranmu kapan saja dengan menghubungi pengurus melalui
              email <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactEmail}</span>{' '}
              atau WhatsApp{' '}
              <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactWhatsapp}</span>.
              Setelah halaman akun anggota aktif di peluncuran penuh, pengaturan ini juga dapat
              diubah langsung melalui halaman{' '}
              <Link
                href="/app"
                className="text-[#0C2340] font-semibold underline decoration-[#B45309] underline-offset-4"
              >
                Profil Saya
              </Link>
              .
            </p>
          </section>

          <section className="bg-[#F3F1EA] border border-[#0C2340]/12 rounded-xl p-5 text-sm text-[#475569] leading-relaxed">
            <h2 className="text-base font-bold text-[#0C2340] mb-1.5">
              Keterbukaan Pengelolaan Situs
            </h2>
            <p>
              Situs ini dikelola oleh tim inisiatif dan pengurus IKA UMS Wilayah Jabodetabek ({COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}). Seluruh perubahan kebijakan akan diperbarui di halaman ini dengan tanggal terbaru.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/syarat"
            className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#0C2340] hover:text-[#B45309] transition-colors"
          >
            Baca Ketentuan Komunitas &rarr;
          </Link>
          <Link
            href="/gabung"
            className="inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
          >
            Daftar jadi anggota
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

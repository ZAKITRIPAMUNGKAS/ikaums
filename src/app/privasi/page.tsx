import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748B] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0C2340] font-medium">Kebijakan Privasi</span>
        </nav>

        <header className="pb-8 border-b border-[#0C2340]/12 space-y-3">
          <p className="text-sm font-semibold text-[#D97706]">
            Perlindungan Data Pribadi
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C2340]">
            Kebijakan Privasi Anggota IKA UMS Jabodetabek
          </h1>
          <p className="text-base text-[#475569] leading-relaxed">
            Komitmen pengurus dalam menjaga kerahasiaan data pribadi alumni secara bertanggung jawab sesuai Undang-Undang Perlindungan Data Pribadi (UU No. 27 Tahun 2022).
          </p>
          <p className="text-sm text-[#64748B]">
            Pembaruan terakhir: November 2026
          </p>
        </header>

        <div className="py-8 space-y-8 text-[15px] sm:text-base text-[#334155] leading-relaxed">
          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              1. Data yang Dikumpulkan Secara Sukarela
            </h2>
            <p>
              Seluruh informasi anggota masuk melalui pendaftaran mandiri. Data yang diminta meliputi nama lengkap, program studi dan tahun angkatan di Universitas Muhammadiyah Surakarta, wilayah domisili tingkat kota atau kabupaten di Jabodetabek, bidang pekerjaan saat ini, serta alamat email dan nomor WhatsApp untuk verifikasi pengurus.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              2. Pemisahan Informasi Publik dan Kontak Pribadi
            </h2>
            <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 my-3">
              <div>
                <h3 className="font-bold text-[#0C2340] mb-2 text-sm">
                  Dapat Tampil di Direktori (Jika Diizinkan)
                </h3>
                <ul className="space-y-1.5 text-sm text-[#475569] list-disc pl-4">
                  <li>Nama lengkap dan ringkasan peran profesional</li>
                  <li>Program studi serta tahun masuk/lulus UMS</li>
                  <li>Wilayah domisili tingkat kota/kabupaten</li>
                  <li>Ketersediaan untuk sesi mentoring sukarela</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#0C2340] mb-2 text-sm">
                  Selalu Disimpan Tertutup
                </h3>
                <ul className="space-y-1.5 text-sm text-[#475569] list-disc pl-4">
                  <li>Nomor WhatsApp dan alamat email pribadi</li>
                  <li>Alamat rumah atau titik lokasi spesifik</li>
                  <li>Catatan verifikasi internal antar-pengurus</li>
                  <li>Data komunikasi permintaan mentoring personal</li>
                </ul>
              </div>
            </div>
            <p>
              Permintaan perkenalan atau penjadwalan mentoring diteruskan oleh sistem atau koordinator wilayah tanpa memajang nomor kontak langsung ke publik.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              3. Penghitungan Peta Sebaran Wilayah
            </h2>
            <p>
              Halaman Peta Sebaran hanya menghitung total alumni secara agregat pada level 9 wilayah administrasi Jabodetabek (Jakarta Selatan, Jakarta Pusat, Jakarta Barat, Jakarta Timur, Jakarta Utara, Tangerang Raya, Bekasi, Depok, dan Bogor). Portal ini tidak melacak koordinat GPS pengguna maupun memetakan titik tempat tinggal individu. Sumber batas wilayah merujuk pada rujukan BPS dan geoBoundaries IDN-ADM2 berlisensi CC BY 3.0 IGO.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#0C2340]">
              4. Hak Pembaruan, Ekspor, dan Penghapusan Data
            </h2>
            <p>
              Setiap anggota berhak meminta perbaikan profil, menarik persetujuan tampil di direktori, mengunduh salinan data pribadinya, atau meminta penghapusan akun secara permanen melalui menu{' '}
              <Link href="/app" className="text-[#0C2340] font-semibold underline decoration-[#D97706] underline-offset-4">
                Portal Anggota
              </Link>{' '}
              atau menghubungi sekretariat pengurus Jabodetabek.
            </p>
          </section>

          <section className="bg-[#F3F1EA] border border-[#0C2340]/10 rounded-xl p-5 text-sm text-[#475569] leading-relaxed">
            <strong className="text-[#0C2340]">Keterbukaan Pratinjau:</strong> Pada versi pratinjau lokal saat ini, profil alumni di direktori, jadwal acara, serta sebaran angka per wilayah masih menggunakan data contoh simulasi untuk uji tampilan sebelum diintegrasikan dengan basis data pendaftaran resmi.
          </section>
        </div>

        <footer className="pt-6 border-t border-[#0C2340]/10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/syarat" className="text-sm font-semibold text-[#0C2340] hover:text-[#D97706] transition-colors">
            Baca Ketentuan & Etika Komunitas &rarr;
          </Link>
          <Link href="/tentang" className="text-sm text-[#64748B] hover:text-[#0C2340] transition-colors">
            Kembali ke Tentang Komunitas
          </Link>
        </footer>
      </main>

      <Footer />
    </div>
  );
}

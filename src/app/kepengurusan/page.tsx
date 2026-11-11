import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { DATA_WILAYAH_SIMULASI } from '@/data/simulasi';
import { ArrowRight, MapPin, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Struktur Kepengurusan — IKA UMS Jabodetabek',
  description:
    'Susunan pengurus harian, bidang program kerja, dan koordinator 9 wilayah Ikatan Alumni Universitas Muhammadiyah Surakarta (IKA UMS) wilayah Jabodetabek.',
};

interface PengurusIntiItem {
  kode: string;
  jabatan: string;
  placeholderNama: string;
  amanah: string;
}

interface BidangKerjaItem {
  nomor: string;
  jabatan: string;
  placeholderNama: string;
  amanah: string;
}

const PENGURUS_INTI: PengurusIntiItem[] = [
  {
    kode: 'DP',
    jabatan: 'Dewan Pembina & Penasihat',
    placeholderNama: '[ISI — Nama Tokoh Senior Alumni & Angkatan]',
    amanah:
      'Memberikan arahan strategis serta menjaga kesinambungan hubungan dengan PP IKA UMS dan pihak kampus di Surakarta.',
  },
  {
    kode: 'KU',
    jabatan: 'Ketua Umum Wilayah Jabodetabek',
    placeholderNama: '[ISI — Nama Ketua Umum, Prodi & Angkatan]',
    amanah:
      'Memimpin koordinasi program kerja lintas wilayah serta mewakili IKA UMS Jabodetabek di forum eksternal dan kemasyarakatan.',
  },
  {
    kode: 'WK',
    jabatan: 'Wakil Ketua Umum',
    placeholderNama: '[ISI — Nama Wakil Ketua, Prodi & Angkatan]',
    amanah:
      'Mendampingi pelaksanaan agenda strategis serta membina koordinasi antar-koordinator wilayah di DKI Jakarta, Banten, dan Jawa Barat.',
  },
  {
    kode: 'SK',
    jabatan: 'Sekretaris Umum',
    placeholderNama: '[ISI — Nama Sekretaris Umum, Prodi & Angkatan]',
    amanah:
      'Mengelola administrasi kesekretariatan, notulensi rapat pengurus, persuratan resmi, dan tata kelola pendataan anggota.',
  },
  {
    kode: 'BN',
    jabatan: 'Bendahara Umum',
    placeholderNama: '[ISI — Nama Bendahara Umum, Prodi & Angkatan]',
    amanah:
      'Mengatur pengelolaan kas komunitas, pencatatan donasi kegiatan, serta laporan keuangan berkala kepada anggota.',
  },
];

const BIDANG_KERJA: BidangKerjaItem[] = [
  {
    nomor: '01',
    jabatan: 'Bidang Karier, Mentoring & Dunia Kerja',
    placeholderNama: '[ISI — Nama Koordinator Bidang Karier]',
    amanah:
      'Menghubungkan praktisi senior dengan lulusan baru melalui sesi mentoring karier, diskusi industri, dan informasi lowongan kerja.',
  },
  {
    nomor: '02',
    jabatan: 'Bidang Wirausaha & Kolaborasi Bisnis',
    placeholderNama: '[ISI — Nama Koordinator Bidang Usaha]',
    amanah:
      'Menyelenggarakan temu pelaku usaha alumni serta membuka ruang promosi dan kemitraan usaha antar-anggota di Jabodetabek.',
  },
  {
    nomor: '03',
    jabatan: 'Bidang Silaturahmi, Olahraga & Sosial',
    placeholderNama: '[ISI — Nama Koordinator Bidang Kegiatan]',
    amanah:
      'Mengorganisasi agenda kopdar lintas angkatan, halalbihalal, olahraga bersama, dan aksi tanggap sosial kemasyarakatan.',
  },
  {
    nomor: '04',
    jabatan: 'Bidang Humas, Media & Informasi',
    placeholderNama: '[ISI — Nama Koordinator Bidang Humas]',
    amanah:
      'Mendokumentasikan kegiatan wilayah, merawat kanal komunikasi resmi, serta menyusun kabar alumni secara berkala.',
  },
];

export default function KepengurusanPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tentang" className="hover:text-[#0C2340] transition-colors">
            Tentang
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0C2340] font-semibold">Kepengurusan</span>
        </nav>

        {/* Page Header (selaras dengan Direktori, Cerita, Peluang) */}
        <header className="mb-10 border-b border-[#0C2340]/10 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              Tata Kelola &amp; Organisasi
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340] leading-[1.15]">
              Struktur Kepengurusan &amp; Koordinator Wilayah
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              IKA UMS Jabodetabek dijalankan secara gotong royong oleh pengurus harian, bidang kerja,
              dan perwakilan di sembilan wilayah domisili agar komunikasi antar-alumni tetap dekat.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/tentang"
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-xs sm:text-sm font-semibold text-center transition-colors"
            >
              Prinsip Pengelolaan
            </Link>
            <Link
              href="/gabung"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#16325C] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>Daftar Relawan</span>
              <span className="hidden sm:inline">Pengurus</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B] shrink-0" />
            </Link>
          </div>
        </header>

        {/* Section 1: Pengurus Harian (Layout Asimetris 4/8) */}
        <section
          className="pb-14 border-b border-[#0C2340]/10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          aria-labelledby="heading-inti"
        >
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-2">
              <h2 id="heading-inti" className="text-2xl font-bold tracking-tight text-[#0C2340]">
                Pengurus Harian
              </h2>
              <p className="text-[15px] text-[#475569] leading-relaxed">
                Jajaran inti yang mengoordinasikan arah program lintas wilayah, kesekretariatan, serta pengelolaan kas komunitas.
              </p>
            </div>

            <div className="bg-[#F3F1EA] border border-[#0C2340]/10 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0C2340]">
                <Info className="w-4 h-4 text-[#D97706] shrink-0" />
                <span>Catatan Pemutakhiran SK</span>
              </div>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                Baris bertanda <strong className="font-semibold text-[#0C2340]">[ISI]</strong> disiapkan
                untuk diisi nama resmi sesuai SK Kepengurusan periode berjalan oleh tim sekretariat.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white border border-[#0C2340]/12 rounded-2xl divide-y divide-[#0C2340]/10 overflow-hidden shadow-xs">
            {PENGURUS_INTI.map((item) => (
              <div
                key={item.jabatan}
                className="p-5 sm:px-7 sm:py-6 flex items-start gap-4 sm:gap-5 hover:bg-[#FDFCF7]/80 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl bg-[#F3F1EA] border border-[#0C2340]/10 flex items-center justify-center text-xs font-extrabold text-[#0C2340] shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {item.kode}
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <h3 className="text-base font-bold text-[#0C2340]">
                      {item.jabatan}
                    </h3>
                    <span className="text-sm font-medium text-[#92400E] shrink-0">
                      {item.placeholderNama}
                    </span>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {item.amanah}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Bidang Program Kerja (2x2 Architectural Sheet) */}
        <section className="py-14 border-b border-[#0C2340]/10" aria-labelledby="heading-bidang">
          <div className="max-w-2xl mb-8 space-y-2">
            <h2 id="heading-bidang" className="text-2xl font-bold tracking-tight text-[#0C2340]">
              Bidang Program Kerja
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              Empat divisi fungsional yang menjalankan agenda rutin sesuai kebutuhan alumni UMS di perantauan.
            </p>
          </div>

          <div className="bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2">
            {BIDANG_KERJA.map((bidang, idx) => {
              const isRightCol = idx % 2 === 1;
              const isTopRow = idx < 2;
              return (
                <article
                  key={bidang.jabatan}
                  className={`p-6 sm:p-8 flex flex-col justify-between gap-5 ${
                    !isRightCol ? 'md:border-r md:border-[#0C2340]/10' : ''
                  } ${
                    isTopRow
                      ? 'border-b border-[#0C2340]/10'
                      : idx === 2
                        ? 'border-b md:border-b-0 border-[#0C2340]/10'
                        : ''
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold text-[#D97706]">
                        {bidang.nomor}
                      </span>
                      <span className="h-px w-5 bg-[#0C2340]/15" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0C2340] leading-snug">
                      {bidang.jabatan}
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {bidang.amanah}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#0C2340]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Koordinator Bidang
                    </span>
                    <span className="font-medium text-[#92400E]">
                      {bidang.placeholderNama}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section 3: Koordinator 9 Wilayah Jabodetabek */}
        <section className="py-14" aria-labelledby="heading-korwil">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="space-y-2 max-w-2xl">
              <h2 id="heading-korwil" className="text-2xl font-bold tracking-tight text-[#0C2340]">
                Koordinator 9 Wilayah Jabodetabek
              </h2>
              <p className="text-[15px] text-[#475569] leading-relaxed">
                Penghubung alumni di tingkat kota dan kabupaten untuk agenda kopdar rutin, penyambutan anggota baru, serta verifikasi domisili.
              </p>
            </div>
            <Link
              href="/peta"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C2340] hover:text-[#D97706] transition-colors shrink-0"
            >
              <MapPin className="w-4 h-4 text-[#D97706]" />
              Buka Peta Sebaran Wilayah
            </Link>
          </div>

          <div className="mb-5 px-4 py-3 rounded-xl bg-[#F3F1EA] border border-[#0C2340]/10 text-xs sm:text-sm text-[#475569] leading-relaxed">
            <strong className="font-semibold text-[#0C2340]">Data Simulasi Purwarupa:</strong>{' '}
            Nama koordinator dan kanal grup WhatsApp pada daftar ini merupakan contoh simulasi untuk
            menggambarkan struktur koordinator wilayah dan perlu disesuaikan dengan pengurus resmi sebelum rilis.
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F3F1EA] border-b border-[#0C2340]/12 text-xs font-bold text-[#0C2340]">
                  <th className="py-3.5 px-6 whitespace-nowrap w-[19%]">Wilayah</th>
                  <th className="py-3.5 px-5 w-[27%]">Titik Kumpul Umum</th>
                  <th className="py-3.5 px-5 w-[26%]">Koordinator (Simulasi)</th>
                  <th className="py-3.5 px-5 w-[18%]">Kanal Koordinasi</th>
                  <th className="py-3.5 px-6 text-right whitespace-nowrap w-[10%]">Direktori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0C2340]/10 text-sm">
                {DATA_WILAYAH_SIMULASI.map((w) => (
                  <tr key={w.id} className="hover:bg-[#FDFCF7] transition-colors">
                    <td className="py-4 px-6 align-top">
                      <p className="font-bold text-[#0C2340] whitespace-nowrap">{w.nama}</p>
                      <p className="text-xs text-[#64748B] whitespace-nowrap mt-0.5">{w.provinsi}</p>
                    </td>
                    <td className="py-4 px-5 text-[#475569] align-top">
                      {w.titikKumpul}
                    </td>
                    <td className="py-4 px-5 font-medium text-[#0C2340] align-top">
                      {w.koordinator}
                    </td>
                    <td className="py-4 px-5 text-[#475569] align-top">
                      {w.kontakWa}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap align-top">
                      <Link
                        href={`/direktori?wilayah=${w.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0C2340] hover:text-[#D97706] transition-colors"
                      >
                        Lihat Alumni
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Bento 1 + 8 */}
          <div className="md:hidden grid grid-cols-2 gap-2.5">
            {DATA_WILAYAH_SIMULASI.map((w, idx) => {
              const isLead = idx === 0;
              return (
                <article
                  key={w.id}
                  className={`rounded-2xl p-3.5 flex flex-col justify-between gap-2.5 border ${
                    isLead
                      ? 'col-span-2 bg-[#F3F1EA]/85 border-[#0C2340]/20 p-4'
                      : 'col-span-1 bg-white border-[#0C2340]/12'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#0C2340] leading-snug">{w.nama}</h3>
                      <p className="text-[11px] text-[#64748B] truncate">{w.provinsi}</p>
                    </div>
                    <Link
                      href={`/direktori?wilayah=${w.id}`}
                      className="text-[11px] font-semibold text-[#0C2340] hover:text-[#D97706] inline-flex items-center gap-0.5 shrink-0 pt-0.5"
                    >
                      <span>Alumni</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="text-[11px] space-y-1 pt-2 border-t border-[#0C2340]/8">
                    <p className="text-[#475569] leading-snug">
                      <span className="font-semibold text-[#0C2340]">Korwil:</span>{' '}
                      {w.koordinator}
                    </p>
                    <p className={`text-[#475569] leading-snug ${isLead ? '' : 'line-clamp-2'}`}>
                      <span className="font-semibold text-[#0C2340]">Titik kumpul:</span>{' '}
                      {w.titikKumpul}
                    </p>
                    {isLead && (
                      <p className="text-[11px] text-[#64748B]">{w.kontakWa}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Banner Ajakan Partisipasi Pengurus */}
        <section className="bg-[#0C2340] text-white rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ingin Bantu Menggerakkan Wilayahmu?
            </h2>
            <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed">
              Setiap wilayah selalu terbuka bagi alumni yang bersedia menjadi penghubung kopdar,
              mentor adik tingkat, atau sukarelawan kegiatan kemasyarakatan.
            </p>
          </div>
          <Link
            href="/gabung"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#D97706] hover:bg-[#F59E0B] text-white font-semibold text-sm transition-colors shrink-0"
          >
            Gabung &amp; Nyatakan Minat
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

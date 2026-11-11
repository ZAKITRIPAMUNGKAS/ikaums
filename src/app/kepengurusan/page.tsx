import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { DATA_WILAYAH_SIMULASI } from '@/data/simulasi';
import { ArrowRight, MapPin, Users, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Struktur Kepengurusan — IKA UMS Jabodetabek',
  description:
    'Susunan pengurus harian, bidang kerja, dan koordinator 9 wilayah Ikatan Alumni Universitas Muhammadiyah Surakarta (IKA UMS) wilayah Jabodetabek.',
};

interface PengurusSlot {
  jabatan: string;
  placeholderNama: string;
  amanah: string;
}

const PENGURUS_INTI: PengurusSlot[] = [
  {
    jabatan: 'Dewan Pembina & Penasihat',
    placeholderNama: '[ISI — Nama Tokoh Senior Alumni & Angkatan]',
    amanah: 'Memberikan arahan strategis serta menjaga kesinambungan hubungan dengan PP IKA UMS dan pihak kampus di Surakarta.',
  },
  {
    jabatan: 'Ketua Umum Wilayah Jabodetabek',
    placeholderNama: '[ISI — Nama Ketua Umum, Prodi & Angkatan]',
    amanah: 'Memimpin koordinasi program kerja lintas wilayah serta mewakili IKA UMS Jabodetabek di forum eksternal dan kemasyarakatan.',
  },
  {
    jabatan: 'Wakil Ketua Umum',
    placeholderNama: '[ISI — Nama Wakil Ketua, Prodi & Angkatan]',
    amanah: 'Mendampingi pelaksanaan agenda strategis serta membina koordinasi antar-koordinator wilayah di DKI, Banten, dan Jawa Barat.',
  },
  {
    jabatan: 'Sekretaris Umum',
    placeholderNama: '[ISI — Nama Sekretaris Umum, Prodi & Angkatan]',
    amanah: 'Mengelola administrasi kesekretariatan, notulensi rapat pengurus, persuratan resmi, dan tata kelola database anggota.',
  },
  {
    jabatan: 'Bendahara Umum',
    placeholderNama: '[ISI — Nama Bendahara Umum, Prodi & Angkatan]',
    amanah: 'Mengatur pengelolaan kas komunitas, pencatatan iuran atau donasi kegiatan, serta pelaporan keuangan berkala kepada anggota.',
  },
];

const BIDANG_KERJA: PengurusSlot[] = [
  {
    jabatan: 'Bidang Karier, Mentoring & Dunia Kerja',
    placeholderNama: '[ISI — Nama Koordinator Bidang Karier]',
    amanah: 'Menghubungkan alumni senior dan praktisi industri dengan lulusan baru melalui sesi mentoring, review CV, dan informasi rekrutmen.',
  },
  {
    jabatan: 'Bidang Wirausaha & Kolaborasi Bisnis',
    placeholderNama: '[ISI — Nama Koordinator Bidang Usaha]',
    amanah: 'Menyelenggarakan temu pelaku usaha alumni serta membuka ruang promosi dan kemitraan jasa antar-anggota di Jabodetabek.',
  },
  {
    jabatan: 'Bidang Silaturahmi, Olahraga & Sosial',
    placeholderNama: '[ISI — Nama Koordinator Bidang Kegiatan]',
    amanah: 'Mengorganisasi agenda kumpul lintas angkatan, halalbihalal, kegiatan olahraga rutin, dan tanggap kepedulian sosial.',
  },
  {
    jabatan: 'Bidang Humas, Media & Informasi',
    placeholderNama: '[ISI — Nama Koordinator Bidang Humas]',
    amanah: 'Mendokumentasikan kegiatan wilayah, merawat kanal komunikasi resmi, serta menyusun rilis kabar alumni.',
  },
];

export default function KepengurusanPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748B] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0C2340] transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tentang" className="hover:text-[#0C2340] transition-colors">
            Tentang
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0C2340] font-medium">Kepengurusan</span>
        </nav>

        {/* Header Editorial Asimetris */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-[#0C2340]/12 items-start">
          <div className="lg:col-span-8 space-y-4">
            <p className="text-sm font-semibold text-[#D97706]">
              Tata Kelola &amp; Organisasi
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-[#0C2340] leading-[1.15]">
              Susunan Pengurus &amp; Koordinator Wilayah Jabodetabek
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl">
              IKA UMS Jabodetabek digerakkan secara gotong royong oleh perwakilan alumni lintas fakultas
              dan angkatan. Struktur ini membagi fokus kerja antara pengurus inti, bidang program, dan
              koordinator di sembilan wilayah domisili agar komunikasi tetap dekat dan mudah dijangkau.
            </p>
          </div>

          <aside className="lg:col-span-4 bg-[#F3F1EA] border border-[#0C2340]/12 rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h2 className="text-sm font-bold text-[#0C2340]">
                  Status Pemutakhiran Data
                </h2>
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  Slot bertanda <span className="font-semibold text-[#0C2340]">[ISI]</span> disediakan
                  untuk diisi nama resmi sesuai SK Kepengurusan periode berjalan oleh tim sekretariat.
                </p>
              </div>
            </div>
            <div className="pt-1 border-t border-[#0C2340]/10 flex flex-wrap gap-3 text-xs font-semibold">
              <Link href="/gabung" className="text-[#0C2340] hover:text-[#D97706] inline-flex items-center gap-1 transition-colors">
                Daftar relawan pengurus
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/tentang" className="text-[#64748B] hover:text-[#0C2340] transition-colors">
                Prinsip pengelolaan
              </Link>
            </div>
          </aside>
        </section>

        {/* Pengurus Inti */}
        <section className="py-12 border-b border-[#0C2340]/12" aria-labelledby="heading-inti">
          <div className="max-w-2xl mb-8 space-y-2">
            <h2 id="heading-inti" className="text-2xl font-bold text-[#0C2340]">
              Pengurus Harian
            </h2>
            <p className="text-[15px] text-[#475569]">
              Jajaran inti yang bertanggung jawab atas arah organisasi, koordinasi lintas wilayah, administrasi, dan transparansi kas komunitas.
            </p>
          </div>

          <div className="divide-y divide-[#0C2340]/10 border-t border-b border-[#0C2340]/12 bg-white rounded-xl overflow-hidden border-x">
            {PENGURUS_INTI.map((item) => (
              <div
                key={item.jabatan}
                className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-start hover:bg-[#FDFCF7]/80 transition-colors"
              >
                <div className="md:col-span-4">
                  <h3 className="text-base font-bold text-[#0C2340]">
                    {item.jabatan}
                  </h3>
                </div>
                <div className="md:col-span-4">
                  <p className="inline-block text-sm font-semibold text-[#92400E] bg-[#FEF3C7]/70 border border-[#D97706]/25 px-3 py-1 rounded-md">
                    {item.placeholderNama}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {item.amanah}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bidang Kerja */}
        <section className="py-12 border-b border-[#0C2340]/12" aria-labelledby="heading-bidang">
          <div className="max-w-2xl mb-8 space-y-2">
            <h2 id="heading-bidang" className="text-2xl font-bold text-[#0C2340]">
              Bidang Program Kerja
            </h2>
            <p className="text-[15px] text-[#475569]">
              Empat divisi fungsional yang menjalankan kegiatan rutin sesuai kebutuhan alumni UMS di perantauan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BIDANG_KERJA.map((bidang) => (
              <article
                key={bidang.jabatan}
                className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <h3 className="text-lg font-bold text-[#0C2340]">
                    {bidang.jabatan}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {bidang.amanah}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0C2340]/8">
                  <p className="text-xs text-[#64748B] mb-1 font-medium">Koordinator Bidang</p>
                  <p className="text-sm font-semibold text-[#92400E]">
                    {bidang.placeholderNama}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Koordinator Wilayah (9 Area Jabodetabek) */}
        <section className="py-12" aria-labelledby="heading-korwil">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="space-y-2 max-w-2xl">
              <h2 id="heading-korwil" className="text-2xl font-bold text-[#0C2340]">
                Koordinator 9 Wilayah Jabodetabek
              </h2>
              <p className="text-[15px] text-[#475569]">
                Titik kontak terdekat untuk mengoordinasikan kopdar lokal, penyambutan alumni baru pindahan, serta verifikasi anggota di masing-masing kota/kabupaten.
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

          <div className="mb-5 px-4 py-3 rounded-xl bg-[#F3F1EA] border border-[#0C2340]/12 text-xs sm:text-sm text-[#475569] flex items-start gap-2.5">
            <Users className="w-4 h-4 text-[#0C2340] shrink-0 mt-0.5" />
            <span>
              <strong className="font-semibold text-[#0C2340]">Catatan Purwarupa:</strong>{' '}
              Nama koordinator dan kanal WhatsApp di tabel ini merupakan <strong>contoh data simulasi</strong> untuk
              menggambarkan struktur korwil aktif per wilayah dan perlu disesuaikan dengan pengurus resmi sebelum rilis.
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F3F1EA] border-b border-[#0C2340]/12 text-xs font-bold text-[#0C2340] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Wilayah</th>
                  <th className="py-3.5 px-5">Titik Kumpul Umum</th>
                  <th className="py-3.5 px-5">Koordinator (Simulasi)</th>
                  <th className="py-3.5 px-5">Kanal Koordinasi</th>
                  <th className="py-3.5 px-5 text-right">Direktori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0C2340]/10 text-sm">
                {DATA_WILAYAH_SIMULASI.map((w) => (
                  <tr key={w.id} className="hover:bg-[#FDFCF7] transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-[#0C2340]">{w.nama}</p>
                      <p className="text-xs text-[#64748B]">{w.provinsi}</p>
                    </td>
                    <td className="py-4 px-5 text-[#475569]">
                      {w.titikKumpul}
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-medium text-[#0C2340]">{w.koordinator}</span>
                    </td>
                    <td className="py-4 px-5 text-[#475569]">
                      {w.kontakWa}
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
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

          {/* Mobile List */}
          <div className="md:hidden space-y-3">
            {DATA_WILAYAH_SIMULASI.map((w) => (
              <article
                key={w.id}
                className="bg-white border border-[#0C2340]/12 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#0C2340]">{w.nama}</h3>
                    <p className="text-xs text-[#64748B]">{w.provinsi}</p>
                  </div>
                  <Link
                    href={`/direktori?wilayah=${w.id}`}
                    className="text-xs font-semibold text-[#0C2340] hover:text-[#D97706] inline-flex items-center gap-1 shrink-0"
                  >
                    Alumni
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="text-sm space-y-1 pt-2 border-t border-[#0C2340]/8">
                  <p className="text-[#475569]">
                    <span className="font-semibold text-[#0C2340]">Koordinator (Simulasi):</span>{' '}
                    {w.koordinator}
                  </p>
                  <p className="text-[#475569]">
                    <span className="font-semibold text-[#0C2340]">Titik kumpul:</span>{' '}
                    {w.titikKumpul}
                  </p>
                  <p className="text-xs text-[#64748B]">{w.kontakWa}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Ajakan Partisipasi Pengurus */}
        <section className="bg-[#0C2340] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold">
              Ingin Bantu Menggerakkan Wilayahmu?
            </h2>
            <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed">
              Setiap cabang wilayah selalu terbuka bagi alumni yang bersedia menjadi penghubung kopdar,
              mentor adik tingkat, atau sukarelawan kegiatan kemasyarakatan.
            </p>
          </div>
          <Link
            href="/gabung"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#D97706] hover:bg-[#F59E0B] text-white font-semibold text-sm transition-colors shrink-0"
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

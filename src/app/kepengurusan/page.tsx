import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { getWilayahDemoList } from '@/data/simulasi';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { ArrowRight, MapPin, Info, PhoneCall, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pengurus & Kontak — IKA UMS Wilayah Jabodetabek',
  description:
    'Susunan pengurus harian, bidang kerja, kontak sekretariat, serta koordinator 9 wilayah IKA UMS Wilayah Jabodetabek.',
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
    placeholderNama: '[ISI: Nama Tokoh Senior Alumni & Angkatan]',
    amanah:
      'Memberikan arahan strategis serta menjaga koordinasi dengan PP IKA UMS Pusat dan kampus di Surakarta.',
  },
  {
    kode: 'KU',
    jabatan: 'Ketua Wilayah Jabodetabek',
    placeholderNama: COMMUNITY_PLACEHOLDERS.chairpersonName,
    amanah:
      'Memimpin koordinasi program lintas wilayah serta mewakili IKA UMS Wilayah Jabodetabek di forum eksternal.',
  },
  {
    kode: 'WK',
    jabatan: 'Wakil Ketua',
    placeholderNama: '[ISI: Nama Wakil Ketua, Prodi & Angkatan]',
    amanah:
      'Mendampingi pelaksanaan program kerja dan koordinasi antar-koordinator wilayah DKI Jakarta, Banten, dan Jawa Barat.',
  },
  {
    kode: 'SK',
    jabatan: 'Sekretaris',
    placeholderNama: '[ISI: Nama Sekretaris, Prodi & Angkatan]',
    amanah:
      'Mengelola administrasi kesekretariatan, pencatatan pendaftar alumni, serta dokumentasi pertemuan pengurus.',
  },
  {
    kode: 'BN',
    jabatan: 'Bendahara',
    placeholderNama: '[ISI: Nama Bendahara, Prodi & Angkatan]',
    amanah:
      'Mengatur pencatatan kas kegiatan komunitas, donasi sukarela, serta laporan keuangan terbuka kepada anggota.',
  },
];

const BIDANG_KERJA: BidangKerjaItem[] = [
  {
    nomor: '01',
    jabatan: 'Bidang Karier & Mentoring Alumni',
    placeholderNama: '[ISI: Nama Koordinator Bidang Karier]',
    amanah:
      'Menghubungkan praktisi senior dengan lulusan baru melalui Mentoring Alumni, ulas CV, dan berbagi Info Kerja & Usaha.',
  },
  {
    nomor: '02',
    jabatan: 'Bidang Wirausaha & Kemitraan',
    placeholderNama: '[ISI: Nama Koordinator Bidang Usaha]',
    amanah:
      'Menghimpun pelaku usaha alumni di Jabodetabek untuk saling berbagi peluang kerja sama dan informasi pasar.',
  },
  {
    nomor: '03',
    jabatan: 'Bidang Kopdar & Kegiatan Sosial',
    placeholderNama: '[ISI: Nama Koordinator Bidang Kegiatan]',
    amanah:
      'Mengatur agenda Kopdar lintas angkatan, halalbihalal, olahraga bersama, dan kegiatan sosial antaralumni.',
  },
  {
    nomor: '04',
    jabatan: 'Bidang Humas & Informasi',
    placeholderNama: '[ISI: Nama Koordinator Bidang Humas]',
    amanah:
      'Mendokumentasikan pertemuan resmi serta menyampaikan kabar kegiatan melalui kanal komunikasi komunitas.',
  },
];

export default function KepengurusanPage() {
  const demoWilayah = getWilayahDemoList();

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#475569] mb-4">
          <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tentang" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
            Tentang
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0C2340] font-semibold">Pengurus &amp; Kontak</span>
        </nav>

        {/* Page Header */}
        <header className="mb-10 border-b border-[#0C2340]/10 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
              Struktur &amp; Kontak Resmi
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340] leading-[1.15]">
              Pengurus &amp; Koordinator Wilayah
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              IKA UMS Wilayah Jabodetabek dijalankan secara gotong royong oleh pengurus harian,
              bidang kerja, dan perwakilan di sembilan wilayah domisili agar koordinasi kopdar tetap dekat.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/tentang"
              className="inline-flex items-center justify-center min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-xl bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-xs sm:text-sm font-semibold text-center transition-colors"
            >
              Tentang Komunitas
            </Link>
            <Link
              href="/gabung"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#16325C] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>Daftar jadi anggota</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B] shrink-0" />
            </Link>
          </div>
        </header>

        {/* Kontak Sekretariat & Hubungan PP IKA UMS */}
        <section
          aria-labelledby="heading-kontak-resmi"
          className="mb-12 bg-[#F3F1EA] border border-[#0C2340]/12 rounded-2xl p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          <div className="lg:col-span-5 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#92400E]">
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Sekretariat &amp; Izin Organisasi</span>
            </div>
            <h2 id="heading-kontak-resmi" className="text-xl font-bold text-[#0C2340]">
              Kontak Pengurus &amp; Status IKA UMS Pusat
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Hubungi sekretariat untuk pertanyaan keanggotaan, pembaruan atau penghapusan data pribadi,
              serta konfirmasi kerja sama kegiatan wilayah.
            </p>
          </div>

          <dl className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-xl p-4 border border-[#0C2340]/10 space-y-1">
              <dt className="text-xs font-semibold text-[#475569]">Email Sekretariat</dt>
              <dd className="font-semibold text-[#0C2340] break-words">
                {COMMUNITY_PLACEHOLDERS.contactEmail}
              </dd>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#0C2340]/10 space-y-1">
              <dt className="text-xs font-semibold text-[#475569]">WhatsApp Pengurus</dt>
              <dd className="font-semibold text-[#0C2340] break-words">
                {COMMUNITY_PLACEHOLDERS.contactWhatsapp}
              </dd>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#0C2340]/10 sm:col-span-2 space-y-1.5">
              <dt className="text-xs font-semibold text-[#475569]">Koordinasi dengan PP IKA UMS Pusat</dt>
              <dd className="font-medium text-[#0C2340] leading-relaxed">
                {COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}
              </dd>
              <div className="pt-1 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={COMMUNITY_PLACEHOLDERS.ppIkaUmsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 min-h-[44px] font-semibold text-[#0C2340] hover:text-[#B45309] underline underline-offset-4"
                >
                  Situs Resmi UMS (ums.ac.id)
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-[#475569]">{COMMUNITY_PLACEHOLDERS.ppIkaUmsChannelLabel}</span>
              </div>
            </div>
          </dl>
        </section>

        {/* Section 1: Pengurus Harian */}
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
                Jajaran inti yang mengoordinasikan kegiatan lintas wilayah, pencatatan anggota, serta kas kegiatan.
              </p>
            </div>

            <div className="bg-[#F3F1EA] border border-[#0C2340]/10 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0C2340]">
                <Info className="w-4 h-4 text-[#B45309] shrink-0" />
                <span>Catatan Data Pra-Launch</span>
              </div>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                Penanda <strong className="font-semibold text-[#0C2340]">[ISI: ...]</strong> sengaja dibiarkan kosong agar hanya nama pengurus resmi hasil musyawarah yang ditampilkan saat rilis.
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

        {/* Section 2: Bidang Program Kerja */}
        <section className="py-14 border-b border-[#0C2340]/10" aria-labelledby="heading-bidang">
          <div className="max-w-2xl mb-8 space-y-2">
            <h2 id="heading-bidang" className="text-2xl font-bold tracking-tight text-[#0C2340]">
              Bidang Program Kerja
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              Empat bidang kerja yang menangani mentoring, wirausaha, kopdar wilayah, dan publikasi informasi alumni.
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
                      <span className="text-xs font-extrabold text-[#B45309]">
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
                    <span className="text-xs font-semibold text-[#475569]">
                      Penanggung Jawab
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
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="heading-korwil" className="text-2xl font-bold tracking-tight text-[#0C2340]">
                  Koordinator 9 Wilayah Jabodetabek
                </h2>
                {IS_DEMO_MODE && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-xs font-semibold">
                    {DEMO_BADGE_LABEL}
                  </span>
                )}
              </div>
              <p className="text-[15px] text-[#475569] leading-relaxed">
                Penghubung alumni di tingkat kota dan kabupaten untuk mengoordinasikan kopdar pertama di wilayah masing-masing.
              </p>
            </div>
            <Link
              href="/peta"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#0C2340] hover:text-[#B45309] transition-colors shrink-0"
            >
              <MapPin className="w-4 h-4 text-[#B45309]" />
              Lihat Sebaran Wilayah
            </Link>
          </div>

          {!IS_DEMO_MODE ? (
            <>
              <div className="hidden md:block bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F3F1EA] border-b border-[#0C2340]/12 text-xs font-bold text-[#0C2340]">
                      <th className="py-3.5 px-6 whitespace-nowrap w-[22%]">Wilayah</th>
                      <th className="py-3.5 px-5 w-[28%]">Cakupan Area</th>
                      <th className="py-3.5 px-5 w-[28%]">Koordinator Wilayah</th>
                      <th className="py-3.5 px-6 w-[22%]">Kontak / Jadwal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0C2340]/10 text-sm">
                    {WILAYAH_JABODETABEK.map((w) => (
                      <tr key={w.id} className="hover:bg-[#FDFCF7] transition-colors">
                        <td className="py-4 px-6 align-top">
                          <p className="font-bold text-[#0C2340] whitespace-nowrap">{w.nama}</p>
                          <p className="text-xs text-[#475569] whitespace-nowrap mt-0.5">{w.provinsi}</p>
                        </td>
                        <td className="py-4 px-5 text-[#475569] align-top">
                          {w.cakupan}
                        </td>
                        <td className="py-4 px-5 font-medium text-[#92400E] align-top">
                          [ISI: Nama Koordinator {w.shortName}]
                        </td>
                        <td className="py-4 px-6 text-[#475569] align-top">
                          [ISI: Kontak WA / rencana lokasi]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Bento 1 + 8 (Pre-launch honest placeholders) */}
              <div className="md:hidden grid grid-cols-2 gap-2.5">
                {WILAYAH_JABODETABEK.map((w, idx) => {
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
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#0C2340] leading-snug">{w.nama}</h3>
                        <p className="text-[11px] text-[#475569] truncate">{w.provinsi}</p>
                      </div>
                      <div className="text-[11px] space-y-1 pt-2 border-t border-[#0C2340]/8">
                        <p className="text-[#92400E] font-medium leading-snug">
                          [ISI: Koordinator {w.shortName}]
                        </p>
                        <p className="text-[#475569] leading-snug line-clamp-2">
                          {w.cakupan}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F3F1EA] border-b border-[#0C2340]/12 text-xs font-bold text-[#0C2340]">
                    <th className="py-3.5 px-6 whitespace-nowrap">Wilayah</th>
                    <th className="py-3.5 px-5">Titik Kumpul</th>
                    <th className="py-3.5 px-5">Koordinator ({DEMO_BADGE_LABEL})</th>
                    <th className="py-3.5 px-6 text-right">Daftar Anggota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0C2340]/10 text-sm">
                  {demoWilayah.map((w) => (
                    <tr key={w.id} className="hover:bg-[#FDFCF7] transition-colors">
                      <td className="py-4 px-6 align-top">
                        <p className="font-bold text-[#0C2340]">{w.nama}</p>
                        <p className="text-xs text-[#475569]">{w.provinsi}</p>
                      </td>
                      <td className="py-4 px-5 text-[#475569] align-top">{w.titikKumpul}</td>
                      <td className="py-4 px-5 font-medium text-[#0C2340] align-top">{w.koordinator}</td>
                      <td className="py-4 px-6 text-right align-top">
                        <Link
                          href={`/direktori?wilayah=${w.id}`}
                          className="inline-flex items-center gap-1 min-h-[44px] text-xs font-semibold text-[#0C2340] hover:text-[#B45309]"
                        >
                          Lihat Anggota
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Banner Ajakan Partisipasi Pengurus */}
        <section className="bg-[#0C2340] text-white rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Bersedia Jadi Penghubung Wilayahmu?
            </h2>
            <p className="text-sm sm:text-[15px] text-white/85 leading-relaxed">
              Setiap kota dan kabupaten terbuka bagi alumni yang bersedia membantu verifikasi
              pendaftar atau menjadi koordinator kopdar pertama di wilayahnya.
            </p>
          </div>
          <Link
            href="/gabung"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0C2340] font-bold text-sm transition-colors shrink-0"
          >
            Daftar jadi anggota
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

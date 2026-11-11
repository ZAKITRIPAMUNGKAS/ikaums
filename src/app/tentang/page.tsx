import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { ShieldCheck, Users, Compass, ArrowRight } from 'lucide-react';

export default function TentangPage() {
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
          <span className="text-[#0C2340] font-medium">Tentang Komunitas</span>
        </nav>

        {/* Hero Editorial Asimetris */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-12 border-b border-[#0C2340]/10">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-sm font-semibold text-[#D97706]">
              IKA UMS Wilayah Jabodetabek
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#0C2340] leading-[1.15]">
              Menyambung Silaturahmi Alumni Universitas Muhammadiyah Surakarta di Perantauan
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              Selama ini, obrolan dan jaringan alumni UMS di Jakarta, Bogor, Depok, Tangerang, dan Bekasi
              sering tersebar di grup WhatsApp masing-masing angkatan atau jurusan. Portal ini hadir sebagai
              titik kumpul bersama agar alumni lintas generasi—mulai angkatan 1980-an hingga lulusan baru—lebih
              mudah saling mengenal, berbagi kabar kopdar, dan membantu adik tingkat meniti karier.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/gabung"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
              >
                Daftarkan Profil Alumni
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/direktori"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Lihat Direktori Anggota
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="bg-white border border-[#0C2340]/10 rounded-2xl overflow-hidden shadow-xs">
              <div className="aspect-[4/3] w-full bg-[#F3F1EA] overflow-hidden">
                <img
                  src="/images/hero-kumpul-bolo-pisah.jpg"
                  alt="Suasana kumpul alumni Universitas Muhammadiyah Surakarta wilayah Jabodetabek"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-4 text-sm text-[#475569] leading-relaxed border-t border-[#0C2340]/10">
                <strong className="text-[#0C2340] font-semibold">Kumpul Bolo Jabodetabek.</strong>{' '}
                Pertemuan rutin lintas angkatan yang menjadi cikal bakal inisiatif direktori dan mentoring alumni wilayah metropolitan.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Tiga Pilar Pengelolaan */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <article className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F3F1EA] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340]">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#0C2340]">
              Fokus pada Manfaat Nyata
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              Setiap fitur diarahkan pada kebutuhan sehari-hari alumni di perantauan: mencari teman satu domisili saat baru pindah kerja, berdiskusi dengan senior sebidang, hingga meramaikan agenda kumpul wilayah.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F3F1EA] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340]">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#0C2340]">
              Verifikasi Sesama Alumni
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              Pendaftaran anggota baru dicek kesesuaian program studi dan tahun angkatannya bersama koordinator wilayah agar direktori tetap nyaman, relevan, dan bebas dari akun spam komersial.
            </p>
          </article>

          <article className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F3F1EA] border border-[#0C2340]/10 flex items-center justify-center text-[#0C2340]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#0C2340]">
              Privasi Terjaga Sejak Awal
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              Partisipasi bersifat sukarela. Nomor WhatsApp dan alamat email tidak ditampilkan terbuka di direktori, sementara peta sebaran hanya menampilkan jumlah total di tingkat kota atau kabupaten.
            </p>
          </article>
        </section>

        {/* Catatan Transparansi & Tautan Tata Kelola */}
        <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl font-bold text-[#0C2340]">
              Tata Kelola & Dokumen Komunitas
            </h2>
            <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
              Inisiatif ini dikelola secara gotong royong oleh pengurus dan relawan alumni IKA UMS Jabodetabek. Pelajari rincian pengelolaan data pribadi dan etika berjejaring sebelum berpartisipasi.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/privasi"
              className="px-4 py-2.5 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/syarat"
              className="px-4 py-2.5 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors"
            >
              Ketentuan Komunitas
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

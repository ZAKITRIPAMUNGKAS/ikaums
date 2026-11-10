import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { AccurateJabodetabekMap } from '@/components/AccurateJabodetabekMap';
import { DATA_ALUMNI_SIMULASI, DATA_KEGIATAN_SIMULASI, DATA_CERITA_SIMULASI, STATS_JABODETABEK } from '@/data/simulasi';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight,
  Shield,
  Layers,
  Search,
  Building,
  UserCheck
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#18213D] flex flex-col font-sans selection:bg-[#101F5B] selection:text-white">
      <Navbar />

      <main className="flex-grow">
        
        {/* EDITORIAL HERO SECTION - SWISS GRID DISCIPLINE */}
        <section className="border-b border-[#18213D]/15 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
            
            {/* Top Precision Meta Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#18213D]/10 pb-4 mb-10 text-xs font-mono uppercase tracking-wider text-[#5F6678]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#101F5B]">IKA UMS CONNECT</span>
                <span className="h-3 w-[1px] bg-[#18213D]/20"></span>
                <span>PLATFORM ALUMNI WILAYAH JABODETABEK</span>
              </div>
              <div className="flex items-center gap-4">
                <span>VOL. 2026</span>
                <span>KONSEN OPT-IN UU PDP</span>
              </div>
            </div>

            {/* Asymmetrical 2-Column Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Bold Editorial Headline */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#101F5B] leading-[1.05]">
                  Dari Temu Kangen, <br />
                  <span className="italic font-normal text-[#18213D]">Jadi Temu Peluang.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#334155] max-w-xl leading-relaxed pt-2">
                  Ekosistem jejaring profesional lulusan Universitas Muhammadiyah Surakarta di Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Menghubungkan perantau, membuka akses rujukan karier, dan mendorong kolaborasi usaha bersama.
                </p>

                {/* Swiss Button Group */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href="/gabung"
                    className="bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Daftar Direktori Alumni</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F4C542]" />
                  </Link>
                  <Link
                    href="/peta"
                    className="border border-[#18213D]/30 hover:border-[#101F5B] text-[#101F5B] text-xs font-semibold uppercase tracking-wider px-6 py-3.5 transition-colors"
                  >
                    Lihat Peta Sebaran
                  </Link>
                </div>
              </div>

              {/* Right Column: Authentic Editorial Photo with Caption */}
              <div className="lg:col-span-5 space-y-3">
                <div className="aspect-[4/3] w-full overflow-hidden border border-[#18213D]/15 bg-[#E8ECF2] relative shadow-sm">
                  <img
                    src="/images/hero-alumni.jpg"
                    alt="Alumni UMS Jabodetabek berdiskusi dan berjejaring dalam forum alumni"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-[#101F5B]/90 backdrop-blur-xs text-[#FAFAF8] text-[10px] font-mono px-2.5 py-1 tracking-wider">
                    DOKUMENTASI RESMI IKA UMS
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6678] border-b border-[#18213D]/10 pb-2">
                  <span>SILATURAHMI & KOLABORASI REGIONAL</span>
                  <span>JABODETABEK • 2026</span>
                </div>
              </div>

            </div>

            {/* Linear-Style 3-Metric Rule Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#18213D]/15 mt-16 divide-y sm:divide-y-0 sm:divide-x divide-[#18213D]/15">
              <div className="py-6 sm:pr-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#5F6678] block mb-1">
                  TOTAL ALUMNI TERDATA
                </span>
                <span className="font-serif text-3xl font-bold text-[#101F5B] block">
                  1.248
                </span>
                <span className="text-xs text-[#5F6678] mt-1 block">
                  Alumni terverifikasi melalui persetujuan opt-in mandiri.
                </span>
              </div>

              <div className="py-6 sm:px-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#5F6678] block mb-1">
                  SEBARAN KOTA / KABUPATEN
                </span>
                <span className="font-serif text-3xl font-bold text-[#101F5B] block">
                  9 Wilayah
                </span>
                <span className="text-xs text-[#5F6678] mt-1 block">
                  Tersebar di seluruh sub-wilayah DKI, Banten, dan Jawa Barat.
                </span>
              </div>

              <div className="py-6 sm:pl-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#5F6678] block mb-1">
                  PROFESIONAL & WIRAUSAHA
                </span>
                <span className="font-serif text-3xl font-bold text-[#101F5B] block">
                  326 Aktif
                </span>
                <span className="text-xs text-[#5F6678] mt-1 block">
                  Bersedia memberikan bimbingan karir dan rujukan proyek kerja.
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 4 CORE CAPABILITIES - SWISS NUMBERED RULE LIST */}
        <section className="py-16 border-b border-[#18213D]/15 bg-[#FDFCFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#18213D]/10 pb-4 mb-8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-1">
                  01 / PILAR FUNGSIONAL
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#101F5B]">
                  Peran & Manfaat Jejaring Alumni
                </h2>
              </div>
              <p className="text-xs text-[#5F6678] max-w-sm mt-2 sm:mt-0">
                Dirancang spesifik untuk kebutuhan alumni perantau di kawasan metropolitan Jabodetabek.
              </p>
            </div>

            {/* 4-Column Grid with Top Border Separators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="border-t-2 border-[#101F5B] pt-4 space-y-2">
                <span className="text-xs font-mono text-[#D97706] font-bold block">01</span>
                <h3 className="font-serif text-xl font-bold text-[#101F5B]">
                  Terkoneksi
                </h3>
                <p className="text-xs text-[#5F6678] leading-relaxed">
                  Menemukan teman seangkatan atau sesama alumni satu fakultas yang berdomisili di lingkungan sekitar tempat tinggal atau kantor.
                </p>
              </div>

              <div className="border-t-2 border-[#101F5B] pt-4 space-y-2">
                <span className="text-xs font-mono text-[#D97706] font-bold block">02</span>
                <h3 className="font-serif text-xl font-bold text-[#101F5B]">
                  Berkembang
                </h3>
                <p className="text-xs text-[#5F6678] leading-relaxed">
                  Akses rujukan lowongan pekerjaan privat, mentoring karir dari alumni senior, serta peluang tender bisnis antar-alumni.
                </p>
              </div>

              <div className="border-t-2 border-[#101F5B] pt-4 space-y-2">
                <span className="text-xs font-mono text-[#D97706] font-bold block">03</span>
                <h3 className="font-serif text-xl font-bold text-[#101F5B]">
                  Saling Bantu
                </h3>
                <p className="text-xs text-[#5F6678] leading-relaxed">
                  Modul gotong royong terpercaya: tawarkan keahlian teknis atau dapatkan advokasi hukum dan medis dari sesama alumni UMS.
                </p>
              </div>

              <div className="border-t-2 border-[#101F5B] pt-4 space-y-2">
                <span className="text-xs font-mono text-[#D97706] font-bold block">04</span>
                <h3 className="font-serif text-xl font-bold text-[#101F5B]">
                  Berkontribusi
                </h3>
                <p className="text-xs text-[#5F6678] leading-relaxed">
                  Wadah nyata menyalurkan program beasiswa almamater, kuliah tamu, dan pengabdian masyarakat di ibu kota.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* GEOGRAPHIC ALUMNI MAP SECTION */}
        <section className="py-16 border-b border-[#18213D]/15 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#18213D]/10 pb-4 mb-8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-1">
                  02 / SEBARAN WILAYAH
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#101F5B]">
                  Peta Sebaran Alumni di Jabodetabek
                </h2>
              </div>
              <Link
                href="/peta"
                className="text-xs font-mono uppercase tracking-wider text-[#101F5B] hover:text-[#D97706] flex items-center gap-1 font-bold mt-2 sm:mt-0"
              >
                <span>Buka Peta Interaktif Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Geographically accurate interactive map component */}
            <AccurateJabodetabekMap />

          </div>
        </section>

        {/* 2-SECTION EDITORIAL SPLIT: UPCOMING ACTIVITIES & RECENT IMPACT STORIES */}
        <section className="py-16 border-b border-[#18213D]/15 bg-[#FDFCFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Agenda & Kegiatan Alumni */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#18213D]/10 pb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-0.5">
                      03 / KEGIATAN KOMUNITAS
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#101F5B]">
                      Agenda Mendatang
                    </h3>
                  </div>
                  <Link
                    href="/kegiatan"
                    className="text-xs font-mono font-bold text-[#101F5B] hover:underline flex items-center gap-1"
                  >
                    <span>SEMUA KEGIATAN</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="divide-y divide-[#18213D]/10 border-b border-[#18213D]/10">
                  {DATA_KEGIATAN_SIMULASI.map((ev, i) => (
                    <div key={ev.id} className="py-4 flex items-start gap-4 group">
                      <div className="font-mono text-center w-12 shrink-0 border border-[#18213D]/15 p-1 bg-white">
                        <span className="text-base font-bold text-[#101F5B] block leading-none">
                          {i === 0 ? '28' : i === 1 ? '06' : '19'}
                        </span>
                        <span className="text-[9px] uppercase text-[#5F6678] tracking-wider block mt-0.5">
                          {i === 0 ? 'NOV' : 'DES'}
                        </span>
                      </div>

                      <div className="space-y-1 flex-grow">
                        <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider">
                          {ev.jenis}
                        </span>
                        <h4 className="font-serif text-base font-bold text-[#101F5B] leading-snug group-hover:text-[#18213D] transition-colors">
                          <Link href="/kegiatan">
                            {ev.judul}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-[#5F6678] pt-0.5">
                          <span>{ev.wilayah}</span>
                          <span>•</span>
                          <span>{ev.jamWIB}</span>
                        </div>
                      </div>

                      <Link
                        href="/kegiatan"
                        className="text-xs font-mono uppercase tracking-wider border border-[#18213D]/20 px-3 py-1.5 hover:bg-[#101F5B] hover:text-white transition-colors shrink-0"
                      >
                        RSVP
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Cerita Dampak & Kolaborasi Alumni */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#18213D]/10 pb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-0.5">
                      04 / KABAR ALUMNI
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#101F5B]">
                      Cerita Alumni
                    </h3>
                  </div>
                  <Link
                    href="/cerita"
                    className="text-xs font-mono font-bold text-[#101F5B] hover:underline flex items-center gap-1"
                  >
                    <span>SEMUA CERITA</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="border border-[#18213D]/15 bg-white p-6 space-y-4 shadow-xs">
                  <div className="aspect-[16/9] w-full overflow-hidden bg-[#E8ECF2] border border-[#18213D]/10">
                    <img
                      src="/images/cerita-startup.jpg"
                      alt="Cerita Alumni UMS Hendra Setiawan"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider">
                      WIRAUSAHA & EDUKASI
                    </span>
                    <h4 className="font-serif text-xl font-bold text-[#101F5B] leading-tight">
                      Dari Alumni UMS, Bangun Startup Edukasi di Jakarta
                    </h4>
                    <p className="text-xs text-[#5F6678] leading-relaxed">
                      Perjalanan Hendra Setiawan (Informatika 2016) merintis platform bimbingan teknologi di ibu kota, yang kini membuka lowongan dan mentoring bagi sesama lulusan baru Solo Raya.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/cerita"
                        className="text-xs font-mono font-bold text-[#101F5B] hover:underline uppercase tracking-wider inline-flex items-center gap-1"
                      >
                        <span>Baca Profil Lengkap</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* DIRECTORY PREVIEW TABLE (LINEAR HIGH INFORMATION DENSITY) */}
        <section className="py-16 border-b border-[#18213D]/15 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#18213D]/10 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-1">
                  05 / DIREKTORI ALUMNI
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#101F5B]">
                  Profil Alumni Terverifikasi
                </h2>
              </div>
              <Link
                href="/direktori"
                className="text-xs font-mono uppercase tracking-wider text-[#101F5B] hover:text-[#D97706] flex items-center gap-1 font-bold mt-2 sm:mt-0"
              >
                <span>Buka Seluruh Direktori (1.248)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Swiss Precision Table */}
            <div className="border border-[#18213D]/15 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#FAFAF8] border-b border-[#18213D]/15 text-[11px] font-mono uppercase tracking-wider text-[#5F6678]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Nama & Gelar</th>
                    <th className="py-3 px-4 font-bold">Prodi & Angkatan</th>
                    <th className="py-3 px-4 font-bold">Profesi / Institusi</th>
                    <th className="py-3 px-4 font-bold">Wilayah</th>
                    <th className="py-3 px-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18213D]/10 bg-white">
                  {DATA_ALUMNI_SIMULASI.slice(0, 4).map((alumni) => (
                    <tr key={alumni.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#101F5B] flex items-center gap-1.5">
                          <span>{alumni.nama}</span>
                          {alumni.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-[#22775A]" />
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6678]">
                        {alumni.prodi} • {alumni.angkatan}
                      </td>
                      <td className="py-3.5 px-4 text-[#18213D] font-medium">
                        {alumni.pekerjaan} {alumni.perusahaan ? `(${alumni.perusahaan})` : ''}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#5F6678]">
                        {alumni.wilayah}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/direktori"
                          className="font-mono text-xs uppercase text-[#101F5B] hover:underline font-bold"
                        >
                          Lihat Profil →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </section>

        {/* BOTTOM EDITORIAL BANNER - AUTHENTIC STATEMENT */}
        <section className="py-16 bg-[#101F5B] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-white/20 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              <div className="space-y-3 max-w-2xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#F4C542] font-bold block">
                  KOMITMEN SINERGI ALUMNI
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                  Mempertemukan Potensi, Memajukan Almamater di Perantauan.
                </h3>
                <p className="text-xs sm:text-sm text-[#EDF1FA]/80 leading-relaxed">
                  Semua data profil tersimpan dengan persetujuan mandiri di bawah perlindungan UU PDP. Tidak ada data yang dibagikan ke pihak ketiga tanpa izin pengguna.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <Link
                  href="/gabung"
                  className="w-full sm:w-auto bg-[#F4C542] hover:bg-[#e8b935] text-[#101F5B] text-xs font-mono font-bold uppercase tracking-wider px-6 py-3.5 text-center transition-colors shadow-xs"
                >
                  Daftar Sebagai Alumni
                </Link>
                <Link
                  href="/tentang"
                  className="w-full sm:w-auto border border-white/30 hover:border-white text-white text-xs font-mono uppercase tracking-wider px-6 py-3.5 text-center transition-colors"
                >
                  Tata Kelola Data
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

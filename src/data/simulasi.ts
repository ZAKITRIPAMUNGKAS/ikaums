import { WilayahStatistik, AlumniProfile, EventKegiatan, CeritaDampak } from '../types';

// DATA SIMULASI SESUAI MOCKUP VISUAL IKA UMS CONNECT (JABODETABEK)
// LABEL RESMI: SIMULASI (NON-PII / CONTEXT SAFE)

export const STATS_JABODETABEK = {
  totalAlumni: 1248,
  totalWilayah: 9,
  profesionalAktif: 326
};

export const DATA_WILAYAH_SIMULASI: WilayahStatistik[] = [
  { id: 'jkt-selatan', nama: 'Jakarta Selatan', provinsi: 'DKI Jakarta', jumlahAlumni: 184, keteranganAman: '184 Alumni', agendaTerdekat: 'Kopdar Alumni Jabodetabek', isDataTerbatas: false },
  { id: 'tangerang', nama: 'Tangerang', provinsi: 'Banten', jumlahAlumni: 126, keteranganAman: '126 Alumni', agendaTerdekat: 'Bincang Bisnis BSD', isDataTerbatas: false },
  { id: 'jkt-timur', nama: 'Jakarta Timur', provinsi: 'DKI Jakarta', jumlahAlumni: 121, keteranganAman: '121 Alumni', isDataTerbatas: false },
  { id: 'jkt-barat', nama: 'Jakarta Barat', provinsi: 'DKI Jakarta', jumlahAlumni: 118, keteranganAman: '118 Alumni', isDataTerbatas: false },
  { id: 'bekasi', nama: 'Bekasi', provinsi: 'Jawa Barat', jumlahAlumni: 117, keteranganAman: '117 Alumni', isDataTerbatas: false },
  { id: 'jkt-pusat', nama: 'Jakarta Pusat', provinsi: 'DKI Jakarta', jumlahAlumni: 94, keteranganAman: '94 Alumni', agendaTerdekat: 'Diskusi Karier Digital', isDataTerbatas: false },
  { id: 'depok', nama: 'Depok', provinsi: 'Jawa Barat', jumlahAlumni: 93, keteranganAman: '93 Alumni', isDataTerbatas: false },
  { id: 'bogor', nama: 'Bogor', provinsi: 'Jawa Barat', jumlahAlumni: 86, keteranganAman: '86 Alumni', isDataTerbatas: false },
  { id: 'jkt-utara', nama: 'Jakarta Utara', provinsi: 'DKI Jakarta', jumlahAlumni: 72, keteranganAman: '72 Alumni', isDataTerbatas: false }
];

export const DATA_ALUMNI_SIMULASI: AlumniProfile[] = [
  {
    id: 'alm-aditya',
    nama: 'Aditya R. Pratama, S.Kom.',
    prodi: 'Informatika',
    angkatan: 2018,
    wilayah: 'Jakarta Selatan',
    industri: 'Perbankan & Fintech',
    pekerjaan: 'Product Engineer',
    perusahaan: 'Bank Nasional Indonesia (BNI)',
    bio: 'Product Engineer dengan pengalaman di industri perbankan. Tertarik pada pengembangan produk digital, mentoring, dan kolaborasi proyek dengan sesama alumni UMS.',
    keahlian: ['Product Management', 'React / Next.js', 'Fintech Architecture', 'Mentoring'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'AP',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'alm-amalia',
    nama: 'Amalia Mumtazah, S.T.',
    prodi: 'Teknik Lingkungan',
    angkatan: 2019,
    wilayah: 'Jakarta Pusat',
    industri: 'Konsultan & Energi',
    pekerjaan: 'Konsultan Lingkungan',
    perusahaan: 'Konsultan Lingkungan',
    bio: 'Spesialis audit AMDAL dan sertifikasi keberlanjutan ESG untuk korporasi dan industri manufaktur di Jabodetabek.',
    keahlian: ['Environmental Audit', 'ESG Reporting', 'Sustainability', 'Regulatory Compliance'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'AM',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'alm-rizal',
    nama: 'Rizal Maulana, M.M.',
    prodi: 'Manajemen',
    angkatan: 2017,
    wilayah: 'Jakarta Timur',
    industri: 'Telekomunikasi & Digital',
    pekerjaan: 'Senior Business Strategist',
    perusahaan: 'PT Telkom Indonesia',
    bio: 'Fokus pada transformasi model bisnis digital dan kemitraan strategis B2B. Senang berdiskusi tentang pengembangan UMKM alumni.',
    keahlian: ['Business Strategy', 'Partnership Development', 'Corporate Planning', 'Marketing'],
    isVerified: true,
    bersediaMentoring: false,
    avatarInitials: 'RM',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'alm-dian',
    nama: 'Dian Anggraini, S.Farm., Apt.',
    prodi: 'Farmasi',
    angkatan: 2020,
    wilayah: 'Kota Bekasi',
    industri: 'Kesehatan & Farmasi',
    pekerjaan: 'Apoteker Penanggung Jawab',
    perusahaan: 'Jejaring Apotek Sehat Sejahtera',
    bio: 'Menjalankan supervisi regulasi obat dan layanan konsultasi kefarmasian di wilayah Bekasi dan Jakarta.',
    keahlian: ['Clinical Pharmacy', 'Healthcare Operations', 'Pharmacovigilance'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'DA'
  },
  {
    id: 'alm-fajar',
    nama: 'Fajar Nugroho, S.H.',
    prodi: 'Ilmu Hukum',
    angkatan: 2015,
    wilayah: 'Jakarta Selatan',
    industri: 'Legal & Advokasi',
    pekerjaan: 'Corporate Legal Counsel',
    perusahaan: 'Firma Hukum Perdata & Bisnis',
    bio: 'Konsultan kepatuhan korporasi dan kontrak bisnis. Berkomitmen memberikan bantuan advis legal bagi wirausaha alumni UMS.',
    keahlian: ['Corporate Law', 'Contract Drafting', 'Compliance', 'Labor Law'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'FN'
  }
];

export const DATA_KEGIATAN_SIMULASI: EventKegiatan[] = [
  {
    id: 'ev-1',
    judul: 'Kopdar Alumni Jabodetabek',
    slug: 'kopdar-alumni-jabodetabek',
    jenis: 'Kopdar Rutin',
    tanggalWIB: 'Sab, 28 Nov 2026',
    jamWIB: '09.00 - 12.00 WIB',
    wilayah: 'Jakarta Selatan',
    lokasiSpesifik: 'Co-Working & Hall TB Simatupang, Jakarta Selatan',
    deskripsi: 'Silaturahmi, berbagi cerita, dan membuka peluang kolaborasi.',
    kapasitas: 80,
    terdaftarCount: 54,
    penanggungJawab: 'Pengurus Wilayah IKA UMS',
    gambar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ev-2',
    judul: 'Diskusi Karier: Berkarier di Industri Digital',
    slug: 'diskusi-karier-digital',
    jenis: 'Eksplorasi Karir',
    tanggalWIB: 'Minggu, 06 Des 2026',
    jamWIB: '13.00 - 16.00 WIB',
    wilayah: 'Jakarta Pusat',
    lokasiSpesifik: 'Auditorium Perpustakaan Nasional / Hybrid Zoom',
    deskripsi: 'Berbagi pengalaman dan tips langsung dari alumni praktisi.',
    kapasitas: 120,
    terdaftarCount: 89,
    penanggungJawab: 'Divisi Karir & Pengembangan Profesional',
    gambar: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ev-3',
    judul: 'Sarasehan UMKM & Bisnis Alumni',
    slug: 'sarasehan-bisnis-alumni',
    jenis: 'Bisnis Alumni',
    tanggalWIB: 'Sabtu, 19 Des 2026',
    jamWIB: '10.00 - 14.00 WIB',
    wilayah: 'Kota Tangerang Selatan',
    lokasiSpesifik: 'Community Hub BSD City, Tangsel',
    deskripsi: 'Temu wirausaha alumni UMS: kurasi produk, jejaring rantai pasok, dan kolaborasi pendanaan mandiri.',
    kapasitas: 50,
    terdaftarCount: 38,
    penanggungJawab: 'Bidang Pemberdayaan Ekonomi',
    gambar: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80'
  }
];

export const DATA_CERITA_SIMULASI: CeritaDampak[] = [
  {
    id: 'cr-1',
    judul: 'Dari Alumni UMS, Bangun Startup Edukasi di Jakarta',
    slug: 'alumni-ums-startup-edukasi',
    alumniNama: 'Hendra Setiawan',
    jurusanAngkatan: 'Alumni Informatika • 5 menit baca',
    ringkasan: 'Kisah alumni merintis platform bimbingan belajar teknologi yang kini memperkerjakan puluhan lulusan baru Solo Raya di ibu kota.',
    dampak: 'Membuka 35+ lowongan kerja dan mentoring gratis bagi 200+ mahasiswa UMS.',
    gambar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  }
];

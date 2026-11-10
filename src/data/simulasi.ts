import { WilayahStatistik, AlumniProfile, EventKegiatan, CeritaDampak } from '../types';

// DATA TRANSFORMATION & DEMO INTEGRITY POLICY:
// Seluruh entitas profil, lowongan, dan agenda di bawah merupakan dataset demonstrasi pilot
// resmi inisiatif IKA UMS Connect Jabodetabek. Data disusun berdasarkan skenario perantauan riil
// dengan pemenuhan protokol privasi k-anonymity (k >= 5) dan pemisahan data pribadi publik vs privat sesuai UU PDP No. 27/2022.

export const DATASET_DISCLOSURE = {
  isDemonstrationData: true,
  governanceModel: 'Inisiatif Komunitas Alumni UMS Jabodetabek (Pilot Project)',
  privacyProtocol: 'k-Anonymity (k >= 5) & Explicit Opt-In Consent',
  lastAuditDate: '2026-11-10'
};

export const STATS_JABODETABEK = {
  totalAlumni: 1248,
  totalWilayah: 9,
  profesionalAktif: 326
};

export const DATA_WILAYAH_SIMULASI: WilayahStatistik[] = [
  { id: 'jkt-selatan', nama: 'Jakarta Selatan', provinsi: 'DKI Jakarta', jumlahAlumni: 184, keteranganAman: '184 Alumni Terdaftar', agendaTerdekat: 'Kopdar Alumni Jabodetabek', isDataTerbatas: false },
  { id: 'tangerang', nama: 'Tangerang', provinsi: 'Banten', jumlahAlumni: 126, keteranganAman: '126 Alumni Terdaftar', agendaTerdekat: 'Bincang Bisnis BSD', isDataTerbatas: false },
  { id: 'jkt-timur', nama: 'Jakarta Timur', provinsi: 'DKI Jakarta', jumlahAlumni: 121, keteranganAman: '121 Alumni Terdaftar', isDataTerbatas: false },
  { id: 'jkt-barat', nama: 'Jakarta Barat', provinsi: 'DKI Jakarta', jumlahAlumni: 118, keteranganAman: '118 Alumni Terdaftar', isDataTerbatas: false },
  { id: 'bekasi', nama: 'Bekasi', provinsi: 'Jawa Barat', jumlahAlumni: 117, keteranganAman: '117 Alumni Terdaftar', isDataTerbatas: false },
  { id: 'jkt-pusat', nama: 'Jakarta Pusat', provinsi: 'DKI Jakarta', jumlahAlumni: 94, keteranganAman: '94 Alumni Terdaftar', agendaTerdekat: 'Diskusi Karier Digital', isDataTerbatas: false },
  { id: 'depok', nama: 'Depok', provinsi: 'Jawa Barat', jumlahAlumni: 93, keteranganAman: '93 Alumni Terdaftar', isDataTerbatas: false },
  { id: 'bogor', nama: 'Bogor', provinsi: 'Jawa Barat', jumlahAlumni: 86, keteranganAman: '86 Alumni Terdaftar', isDataTerbatas: false },
  { id: 'jkt-utara', nama: 'Jakarta Utara', provinsi: 'DKI Jakarta', jumlahAlumni: 72, keteranganAman: '72 Alumni Terdaftar', isDataTerbatas: false }
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
    perusahaan: 'Bank Mandiri Digital Core',
    bio: 'Product Engineer dengan rekam jejak di modernisasi arsitektur perbankan dan API gateway. Aktif membangun jejaring sesama lulusan UMS dan bersedia membimbing alumni baru di bidang rekayasa perangkat lunak.',
    keahlian: ['Product Management', 'React / Next.js', 'Fintech Architecture', 'Mentoring'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'AP',
    avatarUrl: '/images/avatar-aditya.jpg'
  },
  {
    id: 'alm-amalia',
    nama: 'Amalia Mumtazah, S.T.',
    prodi: 'Teknik Sipil & Lingkungan',
    angkatan: 2019,
    wilayah: 'Jakarta Pusat',
    industri: 'Konsultan Lingkungan & ESG',
    pekerjaan: 'Lead Environmental Auditor',
    perusahaan: 'PT Nusantara Green Advisory',
    bio: 'Spesialis audit AMDAL, kalkulasi jejak karbon, dan sertifikasi keberlanjutan ESG untuk korporasi industri manufaktur di Jabodetabek.',
    keahlian: ['Environmental Audit', 'ESG Reporting', 'Sustainability', 'Regulatory Compliance'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'AM',
    avatarUrl: '/images/avatar-amalia.jpg'
  },
  {
    id: 'alm-rizal',
    nama: 'Rizal Maulana, M.M.',
    prodi: 'Manajemen Bisnis',
    angkatan: 2017,
    wilayah: 'Jakarta Timur',
    industri: 'Telekomunikasi & Digital',
    pekerjaan: 'Senior Business Strategist',
    perusahaan: 'PT Telkom Indonesia (Persero) Tbk',
    bio: 'Fokus pada transformasi model bisnis digital dan kemitraan strategis B2B enterprise. Menginisiasi kelompok inkubasi UMKM antar-alumni UMS Jabodetabek.',
    keahlian: ['Business Strategy', 'Partnership Development', 'Corporate Planning', 'Market Analytics'],
    isVerified: true,
    bersediaMentoring: false,
    avatarInitials: 'RM',
    avatarUrl: '/images/avatar-rizal.jpg'
  },
  {
    id: 'alm-dian',
    nama: 'Dian Anggraini, S.Farm., Apt.',
    prodi: 'Farmasi',
    angkatan: 2020,
    wilayah: 'Kota Bekasi',
    industri: 'Kesehatan & Farmasi',
    pekerjaan: 'Apoteker Penanggung Jawab',
    perusahaan: 'Jejaring Apotek Medika Sejahtera',
    bio: 'Menjalankan supervisi regulasi obat dan layanan konsultasi kefarmasian di wilayah Bekasi dan Jakarta Timur. Terbuka kolaborasi riset klinis dan klinik bersama.',
    keahlian: ['Clinical Pharmacy', 'Healthcare Operations', 'Pharmacovigilance', 'Health Tech'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'DA',
    avatarUrl: '/images/avatar-dian.jpg'
  },
  {
    id: 'alm-fajar',
    nama: 'Fajar Nugroho, S.H., M.H.',
    prodi: 'Ilmu Hukum',
    angkatan: 2015,
    wilayah: 'Jakarta Selatan',
    industri: 'Legal & Advokasi Korporasi',
    pekerjaan: 'Managing Legal Counsel',
    perusahaan: 'Nugroho & Partners Law Firm',
    bio: 'Konsultan kepatuhan korporasi, hukum ketenagakerjaan, dan kontrak bisnis komersial. Berkomitmen memberikan bantuan advis legal gratis bagi wirausaha rintisan alumni UMS.',
    keahlian: ['Corporate Law', 'Contract Drafting', 'Compliance', 'Labor Law', 'M&A'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'FN',
    avatarUrl: '/images/avatar-bambang.jpg'
  }
];

export const DATA_KEGIATAN_SIMULASI: EventKegiatan[] = [
  {
    id: 'ev-1',
    judul: 'Kopdar Akbar Alumni UMS Jabodetabek 2026',
    slug: 'kopdar-akbar-alumni-jabodetabek',
    jenis: 'Kopdar Rutin',
    tanggalWIB: 'Sabtu, 28 Nov 2026',
    jamWIB: '09.00 - 13.00 WIB',
    wilayah: 'Jakarta Selatan',
    lokasiSpesifik: 'Co-Working & Multi-Function Hall TB Simatupang, Cilandak, Jakarta Selatan',
    deskripsi: 'Pertemuan silaturahmi akbar lintas angkatan dan fakultas. Agenda mencakup sesi networking terarah, perkenalan direktori alumni, dan pertukaran peluang karir antar-profesional perantauan.',
    kapasitas: 80,
    terdaftarCount: 54,
    penanggungJawab: 'Pengurus Wilayah IKA UMS Jabodetabek',
    gambar: '/images/event-kopdar.jpg'
  },
  {
    id: 'ev-2',
    judul: 'Diskusi Karier: Menembus Industri Digital & Korporasi',
    slug: 'diskusi-karier-digital',
    jenis: 'Eksplorasi Karir',
    tanggalWIB: 'Minggu, 06 Des 2026',
    jamWIB: '13.00 - 16.30 WIB',
    wilayah: 'Jakarta Pusat',
    lokasiSpesifik: 'Auditorium Perpustakaan Nasional & Hybrid Zoom Session',
    deskripsi: 'Bedah jalur karir strategis di ibu kota bersama 4 alumni praktisi di sektor perbankan, telekomunikasi, dan unicorn. Sesi resume review langsung untuk lulusan baru.',
    kapasitas: 120,
    terdaftarCount: 89,
    penanggungJawab: 'Divisi Pengembangan Karir & Profesional',
    gambar: '/images/event-diskusi.jpg'
  },
  {
    id: 'ev-3',
    judul: 'Sarasehan UMKM & Bisnis Alumni UMS',
    slug: 'sarasehan-bisnis-alumni',
    jenis: 'Bisnis Alumni',
    tanggalWIB: 'Sabtu, 19 Des 2026',
    jamWIB: '10.00 - 15.00 WIB',
    wilayah: 'Kota Tangerang Selatan',
    lokasiSpesifik: 'Community Hub BSD City, Tangerang Selatan',
    deskripsi: 'Temu wirausaha alumni UMS se-Jabodetabek: kurasi produk unggulan, jejaring rantai pasok lokal, fasilitasi legalitas usaha, dan kolaborasi pendanaan mandiri.',
    kapasitas: 60,
    terdaftarCount: 42,
    penanggungJawab: 'Bidang Pemberdayaan Ekonomi & Kemitraan',
    gambar: '/images/alumni-gathering-3.jpg'
  }
];

export const DATA_CERITA_SIMULASI: CeritaDampak[] = [
  {
    id: 'cr-1',
    judul: 'Dari Kampus Pabelan ke Sentra Startup Jakarta: Kisah Hendra Bangun EdTech',
    slug: 'alumni-ums-startup-edukasi',
    tokoh: 'Hendra Setiawan, S.Kom.',
    prodiAngkatan: 'Informatika 2016 • Founder EduNusa',
    alumniNama: 'Hendra Setiawan',
    jurusanAngkatan: 'Alumni Informatika • 5 menit baca',
    ringkasan: 'Kisah Hendra merintis platform bimbingan teknologi yang kini mempekerjakan puluhan lulusan baru Solo Raya di ibu kota.',
    kutipan: 'Modal terbesar anak rantau Solo bukan cuma ijazah, tapi rasa saling percaya. Saat pertama ke Jakarta, alumni senior yang memberi tumpangan dan rujukan kerja pertama.',
    dampak: 'Membuka 35+ lowongan kerja dan mentoring gratis bagi 200+ fresh graduates UMS di Jabodetabek.',
    gambar: '/images/cerita-startup.jpg',
    kategori: 'Wirausaha & Edukasi'
  },
  {
    id: 'cr-2',
    judul: 'Advokasi Audit Hijau: Kiprah Amalia Mengawal ESG Korporasi Nasional',
    slug: 'amalia-audit-lingkungan-esg',
    tokoh: 'Amalia Mumtazah, S.T.',
    prodiAngkatan: 'Teknik Sipil & Lingkungan 2019 • Lead Auditor ESG',
    alumniNama: 'Amalia Mumtazah',
    jurusanAngkatan: 'Alumni Teknik • 4 menit baca',
    ringkasan: 'Membawa kepakaran audit lingkungan dari laboratorium UMS ke meja negosiasi emisi korporasi multinasional.',
    kutipan: 'Komunitas alumni di Jakarta menjadi ruang berbagi studi kasus nyata. Kami sering menghubungkan proyek studi kelayakan dengan rekan-rekan sipil dan arsitektur UMS.',
    dampak: 'Membimbing 18 lulusan baru fakultas teknik menembus sertifikasi konsultan lingkungan berstandar BNSP.',
    gambar: '/images/alumni-gathering-4.jpg',
    kategori: 'Karir & Keberlanjutan'
  },
  {
    id: 'cr-3',
    judul: 'Transformasi B2B Enterprise: Rizal Mengokohkan Sinergi Bisnis Alumni',
    slug: 'rizal-transformasi-b2b',
    tokoh: 'Rizal Maulana, M.M.',
    prodiAngkatan: 'Manajemen Bisnis 2017 • Senior Strategist',
    alumniNama: 'Rizal Maulana',
    jurusanAngkatan: 'Alumni Manajemen • 6 menit baca',
    ringkasan: 'Membangun ekosistem kemitraan rantai pasok antar-usaha alumni UMS di Jabodetabek.',
    kutipan: 'Silaturahmi itu baru bernilai maksimal kalau bisa berubah jadi kemandirian ekonomi. Jangan ragu beli produk teman atau libatkan vendor sesama alumni.',
    dampak: 'Memfasilitasi transaksi rantai pasok B2B senilai lebih dari 850 juta rupiah antar-alumni.',
    gambar: '/images/alumni-gathering-5.jpg',
    kategori: 'Kolaborasi Bisnis'
  }
];

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
  { 
    id: 'jkt-selatan', 
    nama: 'Jakarta Selatan', 
    provinsi: 'DKI Jakarta', 
    jumlahAlumni: 184, 
    keteranganAman: '184 alumni tercatat', 
    agendaTerdekat: 'Kopdar Bulanan di Cilandak', 
    isDataTerbatas: false,
    titikKumpul: 'Kawasan Tebet, Blok M, & TB Simatupang',
    koordinator: '[ISI: Nama Koordinator Jaksel]',
    kontakWa: '[ISI: Link Grup WhatsApp Jaksel]'
  },
  { 
    id: 'tangerang', 
    nama: 'Tangerang Raya', 
    provinsi: 'Banten', 
    jumlahAlumni: 126, 
    keteranganAman: '126 alumni tercatat', 
    agendaTerdekat: 'Bincang Bisnis & Wirausaha', 
    isDataTerbatas: false,
    titikKumpul: 'BSD City, Gading Serpong, & Bintaro',
    koordinator: '[ISI: Nama Koordinator Tangerang]',
    kontakWa: '[ISI: Link Grup WhatsApp Tangerang]'
  },
  { 
    id: 'jkt-timur', 
    nama: 'Jakarta Timur', 
    provinsi: 'DKI Jakarta', 
    jumlahAlumni: 121, 
    keteranganAman: '121 alumni tercatat', 
    agendaTerdekat: 'Silaturahmi Santai Rawamangun', 
    isDataTerbatas: false,
    titikKumpul: 'Rawamangun, Cawang, & Buaran',
    koordinator: '[ISI: Nama Koordinator Jaktim]',
    kontakWa: '[ISI: Link Grup WhatsApp Jaktim]'
  },
  { 
    id: 'jkt-barat', 
    nama: 'Jakarta Barat', 
    provinsi: 'DKI Jakarta', 
    jumlahAlumni: 118, 
    keteranganAman: '118 alumni tercatat', 
    agendaTerdekat: 'Ngopi Sore Tomang', 
    isDataTerbatas: false,
    titikKumpul: 'Tomang, Tanjung Duren, & Puri Indah',
    koordinator: '[ISI: Nama Koordinator Jakbar]',
    kontakWa: '[ISI: Link Grup WhatsApp Jakbar]'
  },
  { 
    id: 'bekasi', 
    nama: 'Bekasi', 
    provinsi: 'Jawa Barat', 
    jumlahAlumni: 117, 
    keteranganAman: '117 alumni tercatat', 
    agendaTerdekat: 'Temu Alumni Summarecon', 
    isDataTerbatas: false,
    titikKumpul: 'Summarecon Bekasi & Harapan Indah',
    koordinator: '[ISI: Nama Koordinator Bekasi]',
    kontakWa: '[ISI: Link Grup WhatsApp Bekasi]'
  },
  { 
    id: 'jkt-pusat', 
    nama: 'Jakarta Pusat', 
    provinsi: 'DKI Jakarta', 
    jumlahAlumni: 94, 
    keteranganAman: '94 alumni tercatat', 
    agendaTerdekat: 'Diskusi Karir Korporasi & BUMN', 
    isDataTerbatas: false,
    titikKumpul: 'Menteng, Cikini, & Bundaran HI',
    koordinator: '[ISI: Nama Koordinator Jakpus]',
    kontakWa: '[ISI: Link Grup WhatsApp Jakpus]'
  },
  { 
    id: 'depok', 
    nama: 'Depok', 
    provinsi: 'Jawa Barat', 
    jumlahAlumni: 93, 
    keteranganAman: '93 alumni tercatat', 
    agendaTerdekat: 'Kopdar Santai Margonda', 
    isDataTerbatas: false,
    titikKumpul: 'Margonda Raya & Sawangan',
    koordinator: '[ISI: Nama Koordinator Depok]',
    kontakWa: '[ISI: Link Grup WhatsApp Depok]'
  },
  { 
    id: 'bogor', 
    nama: 'Bogor', 
    provinsi: 'Jawa Barat', 
    jumlahAlumni: 86, 
    keteranganAman: '86 alumni tercatat', 
    agendaTerdekat: 'Jalan Santai Kebun Raya', 
    isDataTerbatas: false,
    titikKumpul: 'Pajajaran & Baranangsiang',
    koordinator: '[ISI: Nama Koordinator Bogor]',
    kontakWa: '[ISI: Link Grup WhatsApp Bogor]'
  },
  { 
    id: 'jkt-utara', 
    nama: 'Jakarta Utara', 
    provinsi: 'DKI Jakarta', 
    jumlahAlumni: 72, 
    keteranganAman: '72 alumni tercatat', 
    agendaTerdekat: 'Temu Industri Maritim & Logistik', 
    isDataTerbatas: false,
    titikKumpul: 'Kelapa Gading & Pluit',
    koordinator: '[ISI: Nama Koordinator Jakut]',
    kontakWa: '[ISI: Link Grup WhatsApp Jakut]'
  }
];

export const DATA_ALUMNI_SIMULASI: AlumniProfile[] = [
  {
    id: 'alm-aditya',
    nama: 'Aditya Pratama',
    prodi: 'Informatika',
    angkatan: 2018,
    wilayah: 'Jakarta Selatan',
    industri: 'Teknologi & Digital',
    pekerjaan: 'Product Engineer',
    perusahaan: 'Perusahaan Teknologi di Jakarta',
    bio: 'Product Engineer dengan fokus pada sistem backend dan API. Senang ngobrol seputar transisi karir IT dan review CV untuk alumni fresh graduate.',
    keahlian: ['Next.js', 'Fintech', 'Mentoring Karir'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'AP',
    avatarUrl: '/images/avatar-aditya.jpg'
  },
  {
    id: 'alm-amalia',
    nama: 'Amalia Mumtazah',
    prodi: 'Teknik Sipil',
    angkatan: 2019,
    wilayah: 'Jakarta Pusat',
    industri: 'Teknik & Lingkungan',
    pekerjaan: 'Environmental Consultant',
    perusahaan: 'Konsultan Lingkungan di Jakarta',
    bio: 'Spesialis audit AMDAL dan sertifikasi keberlanjutan. Terbuka diajak diskusi mengenai sertifikasi profesi teknik bagi rekan-rekan alumni.',
    keahlian: ['AMDAL', 'Audit Lingkungan'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'AM',
    avatarUrl: '/images/avatar-amalia.jpg'
  },
  {
    id: 'alm-rizal',
    nama: 'Rizal Maulana',
    prodi: 'Manajemen',
    angkatan: 2017,
    wilayah: 'Jakarta Timur',
    industri: 'Manajemen & Bisnis',
    pekerjaan: 'Business Strategist',
    perusahaan: 'BUMN Telekomunikasi',
    bio: 'Fokus pada strategi kemitraan B2B. Aktif di kegiatan komunitas alumni dan inisiatif jaringan usaha antaralumni UMS Jabodetabek.',
    keahlian: ['Business Development', 'Kemitraan Usaha'],
    isVerified: true,
    bersediaMentoring: false,
    avatarInitials: 'RM',
    avatarUrl: '/images/avatar-rizal.jpg'
  },
  {
    id: 'alm-dian',
    nama: 'Dian Anggraini',
    prodi: 'Farmasi',
    angkatan: 2020,
    wilayah: 'Bekasi',
    industri: 'Kesehatan & Farmasi',
    pekerjaan: 'Apoteker Penanggung Jawab',
    perusahaan: 'Jejaring Apotek Regional',
    bio: 'Mengelola perizinan dan operasional kefarmasian di kawasan Bekasi. Terbuka untuk sharing pengalaman ujian kompetensi dan dunia kerja farmasi.',
    keahlian: ['Farmasi Klinis', 'Regulasi Obat'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'DA',
    avatarUrl: '/images/avatar-dian.jpg'
  },
  {
    id: 'alm-fajar',
    nama: 'Fajar Nugroho',
    prodi: 'Hukum',
    angkatan: 2015,
    wilayah: 'Jakarta Selatan',
    industri: 'Hukum & Korporasi',
    pekerjaan: 'Corporate Legal Counsel',
    perusahaan: 'Firma Hukum di Kuningan',
    bio: 'Menangani kepatuhan korporasi dan hukum kontrak komersial. Siap memberikan advis awal seputar legalitas usaha dan kontrak kerja bagi alumni.',
    keahlian: ['Hukum Korporat', 'Legalitas UMKM'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'FN',
    avatarUrl: '/images/avatar-bambang.jpg'
  },
  {
    id: 'alm-nurul',
    nama: 'Nurul Hidayati',
    prodi: 'Arsitektur',
    angkatan: 2017,
    wilayah: 'Tangerang Raya',
    industri: 'Arsitektur & Desain',
    pekerjaan: 'Project Architect',
    perusahaan: 'Studio Arsitektur di BSD',
    bio: 'Praktisi desain arsitektur hunian dan komersial di kawasan Tangerang. Siap berbagi tips portofolio studio arsitektur dan magang.',
    keahlian: ['Desain Arsitektur', 'Review Portofolio'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'NH',
    avatarUrl: '/images/avatar-nurul.jpg'
  },
  {
    id: 'alm-bambang',
    nama: 'Bambang Triyono',
    prodi: 'Akuntansi',
    angkatan: 2014,
    wilayah: 'Jakarta Pusat',
    industri: 'Keuangan & Pajak',
    pekerjaan: 'Tax Consultant',
    perusahaan: 'Konsultan Pajak di Menteng',
    bio: 'Menangani konsultasi pajak korporasi dan audit keuangan. Bersedia membantu konsultasi pelaporan pajak awal bagi wirausaha alumni baru.',
    keahlian: ['Perpajakan', 'Audit Finansial'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'BT',
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

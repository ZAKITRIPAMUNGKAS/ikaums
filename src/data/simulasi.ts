import { WilayahStatistik, AlumniProfile, EventKegiatan, CeritaDampak } from '../types';

// Dataset demonstrasi resmi IKA UMS Connect Jabodetabek (data contoh untuk purwarupa komunitas).
// Angka agregat disajikan dengan prinsip perlindungan privasi UU PDP No. 27/2022.

export const DATASET_DISCLOSURE = {
  isDemonstrationData: true,
  governanceModel: 'Inisiatif Komunitas Alumni UMS Jabodetabek',
  privacyProtocol: 'Opt-In Consent & Agregasi Wilayah',
  lastAuditDate: '2026-11-11'
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
    koordinator: 'Fajar Nugroho (Hukum ’15)',
    kontakWa: 'Grup WhatsApp Korwil Jaksel'
  },
  { 
    id: 'tangerang', 
    nama: 'Tangerang Raya', 
    provinsi: 'Banten', 
    jumlahAlumni: 126, 
    keteranganAman: '126 alumni tercatat', 
    agendaTerdekat: 'Bincang Bisnis & Wirausaha BSD', 
    isDataTerbatas: false,
    titikKumpul: 'BSD City, Gading Serpong, & Bintaro',
    koordinator: 'Nurul Hidayati (Arsitektur ’17)',
    kontakWa: 'Grup WhatsApp Korwil Tangerang'
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
    koordinator: 'Rizal Maulana (Manajemen ’17)',
    kontakWa: 'Grup WhatsApp Korwil Jaktim'
  },
  { 
    id: 'jkt-barat', 
    nama: 'Jakarta Barat', 
    provinsi: 'DKI Jakarta', 
    jumlahAlumni: 118, 
    keteranganAman: '118 alumni tercatat', 
    agendaTerdekat: 'Ngopi Sore Tomang & Grogol', 
    isDataTerbatas: false,
    titikKumpul: 'Tomang, Tanjung Duren, & Puri Indah',
    koordinator: 'Bagus Saputro (Ilmu Komunikasi ’16)',
    kontakWa: 'Grup WhatsApp Korwil Jakbar'
  },
  { 
    id: 'bekasi', 
    nama: 'Bekasi', 
    provinsi: 'Jawa Barat', 
    jumlahAlumni: 117, 
    keteranganAman: '117 alumni tercatat', 
    agendaTerdekat: 'Temu Alumni Summarecon Bekasi', 
    isDataTerbatas: false,
    titikKumpul: 'Summarecon Bekasi & Harapan Indah',
    koordinator: 'Dian Anggraini (Farmasi ’20)',
    kontakWa: 'Grup WhatsApp Korwil Bekasi'
  },
  { 
    id: 'jkt-pusat', 
    nama: 'Jakarta Pusat', 
    provinsi: 'DKI Jakarta', 
    jumlahAlumni: 94, 
    keteranganAman: '94 alumni tercatat', 
    agendaTerdekat: 'Diskusi Karier Korporasi & BUMN', 
    isDataTerbatas: false,
    titikKumpul: 'Menteng, Cikini, & Bundaran HI',
    koordinator: 'Amalia Mumtazah (Teknik Sipil ’19)',
    kontakWa: 'Grup WhatsApp Korwil Jakpus'
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
    koordinator: 'Taufik Hidayat (Pendidikan Matematika ’15)',
    kontakWa: 'Grup WhatsApp Korwil Depok'
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
    koordinator: 'Ratna Kusuma (Psikologi ’16)',
    kontakWa: 'Grup WhatsApp Korwil Bogor'
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
    koordinator: 'Arif Wicaksono (Teknik Industri ’13)',
    kontakWa: 'Grup WhatsApp Korwil Jakut'
  }
];

export const DATA_ALUMNI_SIMULASI: AlumniProfile[] = [
  {
    id: 'alm-aditya',
    nama: 'Aditya Pratama',
    prodi: 'Teknik Informatika',
    angkatan: 2018,
    wilayah: 'Jakarta Selatan',
    industri: 'Teknologi & Digital',
    pekerjaan: 'Product Engineer',
    perusahaan: 'Ruang Digital Nusantara',
    bio: 'Menangani arsitektur backend dan layanan pembayaran digital. Senang bantu review CV serta ngobrol seputar transisi karier IT bagi adik tingkat dari UMS.',
    keahlian: ['Backend & API', 'Mentoring Karier'],
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
    perusahaan: 'Bina Karya Konsultan',
    bio: 'Menangani kajian AMDAL dan kepatuhan lingkungan proyek infrastruktur. Terbuka untuk diskusi sertifikasi keinsinyuran dan peluang kerja teknik di Jakarta.',
    keahlian: ['Kajian AMDAL', 'Manajemen Proyek'],
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
    perusahaan: 'Telkom Sigma Jakarta',
    bio: 'Aktif mengurus pengembangan kemitraan B2B sejak 2020. Sering ikut agenda kumpul alumni di Rawamangun dan senang menghubungkan vendor UMKM alumni.',
    keahlian: ['Kemitraan B2B', 'Pengembangan Usaha'],
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
    perusahaan: 'Apotek Sentosa Bekasi',
    bio: 'Mengurus perizinan apotek dan layanan farmasi klinis di kawasan Bekasi Timur. Siap berbagi cerita seputar ujian kompetensi apoteker dan dunia kerja farmasi.',
    keahlian: ['Farmasi Klinis', 'Regulasi Obat'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'DA',
    avatarUrl: '/images/avatar-dian.jpg'
  },
  {
    id: 'alm-fajar',
    nama: 'Fajar Nugroho',
    prodi: 'Ilmu Hukum',
    angkatan: 2015,
    wilayah: 'Jakarta Selatan',
    industri: 'Hukum & Korporasi',
    pekerjaan: 'Corporate Legal Counsel',
    perusahaan: 'Kantor Hukum Setia & Rekan',
    bio: 'Berpengalaman menangani kontrak komersial dan legalitas usaha rintisan. Bersedia memberi masukan awal buat alumni yang baru merintis usaha di Jabodetabek.',
    keahlian: ['Kontrak Komersial', 'Legalitas UMKM'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'FN'
  },
  {
    id: 'alm-nurul',
    nama: 'Nurul Hidayati',
    prodi: 'Arsitektur',
    angkatan: 2017,
    wilayah: 'Tangerang Raya',
    industri: 'Arsitektur & Desain',
    pekerjaan: 'Project Architect',
    perusahaan: 'Studio Ruang BSD',
    bio: 'Mengerjakan desain hunian tropis dan ruang komersial di Serpong & Bintaro. Terbuka untuk bedah portofolio mahasiswa tingkat akhir dan lulusan baru Arsitektur.',
    keahlian: ['Desain Hunian', 'Review Portofolio'],
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
    perusahaan: 'KAP Triyono & Partners',
    bio: 'Menangani pendampingan pajak dan pembukuan perusahaan menengah. Senang bantu teman-teman pemilik bisnis kecil merapikan laporan pajak tahunan.',
    keahlian: ['Perpajakan', 'Audit Keuangan'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'BT'
  },
  {
    id: 'alm-bagus',
    nama: 'Bagus Saputro',
    prodi: 'Ilmu Komunikasi',
    angkatan: 2016,
    wilayah: 'Jakarta Barat',
    industri: 'Media & Periklanan',
    pekerjaan: 'Brand Campaign Lead',
    perusahaan: 'Studio Kreatif Palmerah',
    bio: 'Bekerja di industri media dan kampanye brand di Jakarta Barat. Sering janjian ngopi sore bareng alumni sekitar Tomang dan Tanjung Duren.',
    keahlian: ['Komunikasi Brand', 'Produksi Konten'],
    isVerified: true,
    bersediaMentoring: false,
    avatarInitials: 'BS'
  },
  {
    id: 'alm-taufik',
    nama: 'Taufik Hidayat',
    prodi: 'Pendidikan Matematika',
    angkatan: 2015,
    wilayah: 'Depok',
    industri: 'Pendidikan & Riset',
    pekerjaan: 'Curriculum Specialist',
    perusahaan: 'Platform Belajar Cerdas',
    bio: 'Mengembangkan materi ajar digital dan asesmen siswa di Depok. Terbuka diskusi soal karier di dunia edtech dan manajemen sekolah.',
    keahlian: ['Desain Kurikulum', 'Teknologi Pendidikan'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'TH'
  },
  {
    id: 'alm-ratna',
    nama: 'Ratna Kusuma',
    prodi: 'Psikologi',
    angkatan: 2016,
    wilayah: 'Bogor',
    industri: 'Sumber Daya Manusia',
    pekerjaan: 'People Partner',
    perusahaan: 'Jaringan Ritel Bogor',
    bio: 'Menangani rekrutmen dan pembinaan karyawan di kawasan Bogor Raya. Dengan senang hati membantu simulasi wawancara kerja untuk lulusan baru UMS.',
    keahlian: ['Simulasi Interview', 'Pengembangan SDM'],
    isVerified: true,
    bersediaMentoring: true,
    avatarInitials: 'RK'
  },
  {
    id: 'alm-arif',
    nama: 'Arif Wicaksono',
    prodi: 'Teknik Industri',
    angkatan: 2013,
    wilayah: 'Jakarta Utara',
    industri: 'Logistik & Pelabuhan',
    pekerjaan: 'Supply Chain Manager',
    perusahaan: 'Logistik Nusantara Pelabuhan',
    bio: 'Menangani operasional rantai pasok dan pergudangan di kawasan Tanjung Priok & Marunda. Siap berbagi informasi seputar manajemen logistik industri.',
    keahlian: ['Rantai Pasok', 'Operasional Gudang'],
    isVerified: true,
    bersediaMentoring: false,
    avatarInitials: 'AW'
  }
];

export const DATA_KEGIATAN_SIMULASI: EventKegiatan[] = [
  {
    id: 'ev-1',
    judul: 'Kopdar Akbar Alumni UMS Jabodetabek',
    slug: 'kopdar-akbar-alumni-jabodetabek',
    jenis: 'Kopdar Rutin',
    tanggalWIB: 'Sabtu, 28 Nov 2026',
    jamWIB: '09.00 - 13.00 WIB',
    wilayah: 'Jakarta Selatan',
    lokasiSpesifik: 'Aula Pertemuan Cilandak, TB Simatupang, Jakarta Selatan',
    deskripsi: 'Kumpul santai lintas angkatan dan fakultas. Sekalian kenalan antaralumni yang baru pindah ke Jakarta, tukar info kerja, dan makan siang bareng.',
    kapasitas: 80,
    terdaftarCount: 54,
    penanggungJawab: 'Panitia Kopdar Wilayah Jakarta Selatan',
    gambar: '/images/event-kopdar.jpg'
  },
  {
    id: 'ev-2',
    judul: 'Bincang Santai Karier Digital & Korporasi',
    slug: 'bincang-karier-digital',
    jenis: 'Berbagi Pengalaman',
    tanggalWIB: 'Minggu, 06 Des 2026',
    jamWIB: '13.00 - 16.30 WIB',
    wilayah: 'Jakarta Pusat',
    lokasiSpesifik: 'Ruang Diskusi Cikini, Jakarta Pusat (dan Zoom)',
    deskripsi: 'Ngobrol langsung bersama 4 alumni UMS yang bekerja di perbankan, telekomunikasi, dan startup. Bawa CV kalau mau dibantu review langsung di tempat.',
    kapasitas: 120,
    terdaftarCount: 89,
    penanggungJawab: 'Tim Berbagi Karier IKA UMS Jabodetabek',
    gambar: '/images/event-diskusi.jpg'
  },
  {
    id: 'ev-3',
    judul: 'Temu Usaha & UMKM Alumni UMS di BSD',
    slug: 'temu-usaha-alumni-bsd',
    jenis: 'Kumpul Wirausaha',
    tanggalWIB: 'Sabtu, 19 Des 2026',
    jamWIB: '10.00 - 15.00 WIB',
    wilayah: 'Tangerang Raya',
    lokasiSpesifik: 'Ruang Komunitas BSD City, Tangerang Selatan',
    deskripsi: 'Pertemuan pemilik usaha kecil dan rintisan sesama alumni: saling kenal produk, berbagi info pengadaan bahan baku, hingga konsultasi izin usaha.',
    kapasitas: 60,
    terdaftarCount: 42,
    penanggungJawab: 'Korwil Tangerang Raya',
    gambar: '/images/alumni-gathering-3.jpg'
  }
];

export const DATA_CERITA_SIMULASI: CeritaDampak[] = [
  {
    id: 'cr-1',
    judul: 'Berawal dari Numpang Kos Alumni Senior, Hendra Kini Buka Kerja bagi Puluhan Lulusan Solo',
    slug: 'alumni-ums-startup-edukasi',
    tokoh: 'Hendra Setiawan',
    prodiAngkatan: 'Informatika 2016 · Pendiri EduNusa',
    alumniNama: 'Hendra Setiawan',
    jurusanAngkatan: 'Teknik Informatika ’16 · 5 menit baca',
    ringkasan: 'Waktu pertama merantau ke Jakarta dengan ijazah dari Pabelan, Hendra dibantu alumni senior mencari tempat tinggal dan wawancara kerja pertamanya. Kini usahanya ikut menampung rekan dari UMS.',
    kutipan: 'Modal terbesar anak rantau Solo bukan cuma ijazah, tapi rasa saling percaya. Waktu baru datang ke Jakarta, alumni senior yang duluan ngasih tumpangan dan rujukan kerja pertama.',
    dampak: 'Hingga akhir tahun ini, timnya mempekerjakan lebih dari 30 alumnus muda Solo Raya dan rutin mengadakan kelas persiapan kerja.',
    gambar: '/images/cerita-startup.jpg',
    kategori: 'Wirausaha & Edukasi'
  },
  {
    id: 'cr-2',
    judul: 'Perjalanan Amalia Menembus Proyek Kajian Lingkungan Nasional',
    slug: 'amalia-audit-lingkungan-esg',
    tokoh: 'Amalia Mumtazah',
    prodiAngkatan: 'Teknik Sipil 2019 · Konsultan Lingkungan',
    alumniNama: 'Amalia Mumtazah',
    jurusanAngkatan: 'Teknik Sipil ’19 · 4 menit baca',
    ringkasan: 'Menjalani sertifikasi auditor AMDAL tidak mudah saat baru lulus. Lewat kenalan kakak tingkat di Jakarta Pusat, Amalia menempuh jalur magang hingga memimpin tim kajian di berbagai pabrik.',
    kutipan: 'Komunitas alumni di Jakarta jadi tempat bertanya yang aman. Kalau ada proyek lapangan, kami sering ngajak teman-teman arsitektur dan sipil sesama UMS.',
    dampak: 'Aktif membimbing belasan adik tingkat jurusan teknik menempuh ujian sertifikasi keahlian lingkungan.',
    gambar: '/images/alumni-gathering-4.jpg',
    kategori: 'Karier Teknik'
  },
  {
    id: 'cr-3',
    judul: 'Saling Beli dan Jadi Vendor: Cara Rizal Menjaga Roda Usaha Sesama Alumni',
    slug: 'rizal-transformasi-b2b',
    tokoh: 'Rizal Maulana',
    prodiAngkatan: 'Manajemen 2017 · Jakarta Timur',
    alumniNama: 'Rizal Maulana',
    jurusanAngkatan: 'Manajemen ’17 · 4 menit baca',
    ringkasan: 'Dimulai dari grup ngopi di Rawamangun, beberapa alumni pelaku usaha katering, konveksi, dan percetakan mulai saling memesan kebutuhan kantor satu sama lain.',
    kutipan: 'Silaturahmi itu paling kerasa manfaatnya kalau saling bantu di pekerjaan. Kalau kantor butuh vendor atau suvenir acara, kami usahakan cek teman alumni dulu.',
    dampak: 'Menghubungkan belasan pemilik usaha kecil alumni dengan kebutuhan pengadaan korporasi di Jabodetabek.',
    gambar: '/images/alumni-gathering-5.jpg',
    kategori: 'Jaringan Usaha'
  }
];

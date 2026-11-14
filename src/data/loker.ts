export interface LokerItem {
  id: string;
  posisi: string;
  perusahaan: string;
  industri: string;
  wilayah: string;
  tipeKerja: 'Penuh Waktu' | 'Paruh Waktu' | 'Magang' | 'Kontrak';
  sistemKerja: 'On-site' | 'Hybrid' | 'Remote';
  gajiPerkiraan?: string;
  alumniRujukan?: string;
  kualifikasi: string[];
  deskripsi: string;
  kontakLamar: string;
  linkLamar?: string;
  status: 'Aktif' | 'Tutup';
  createdAt: string;
}

export const DEFAULT_LOKERS: LokerItem[] = [
  {
    id: 'loker-it-1',
    posisi: 'Frontend Developer (React / Next.js)',
    perusahaan: 'PT Rekadwipa Solusindo',
    industri: 'Teknologi Informasi & Software',
    wilayah: 'Jakarta Selatan',
    tipeKerja: 'Penuh Waktu',
    sistemKerja: 'Hybrid',
    gajiPerkiraan: 'Rp7.500.000 - Rp11.000.000',
    alumniRujukan: "Alumni Informatika UMS '16 (Lead Tech)",
    kualifikasi: [
      'Lulusan S1 Informatika / Sistem Informasi / Ilmu Komputer UMS',
      'Memahami React, Next.js, TypeScript, dan Tailwind CSS',
      'Terbuka untuk fresh graduate berportofolio atau pengalaman 1-2 tahun',
      'Mampu bekerja secara mandiri maupun tim secara hybrid di Jakarta Selatan',
    ],
    deskripsi:
      'Mengembangkan antarmuka web aplikasi enterprise dan sistem logistik modern klien nasional. Lingkungan kerja kolaboratif dengan bimbingan senior alumni.',
    kontakLamar: 'karir@rekadwipa.co.id',
    linkLamar: 'https://rekadwipa.co.id/karir',
    status: 'Aktif',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'loker-sipil-2',
    posisi: 'Site Engineer & Estimator Biaya Proyek',
    perusahaan: 'PT Wika Mitra Konstruksi Mandiri',
    industri: 'Konstruksi & Infrastruktur',
    wilayah: 'Bekasi',
    tipeKerja: 'Penuh Waktu',
    sistemKerja: 'On-site',
    gajiPerkiraan: 'Rp6.500.000 - Rp9.500.000',
    alumniRujukan: "Alumni Teknik Sipil UMS '13 (Project Manager)",
    kualifikasi: [
      'S1 Teknik Sipil UMS (IPK min 3.00)',
      'Menguasai software AutoCAD, SAP2000, serta perhitungan RAB & volume proyek',
      'Siap ditempatkan di site project area Bekasi, Cikarang, dan Karawang',
      'Memiliki integritas tinggi, disiplin waktu, dan ketelitian lapangan',
    ],
    deskripsi:
      'Melakukan pengawasan teknis di lapangan, review gambar kerja struktural, dan kontrol estimasi progress proyek gedung dan fasilitas industri.',
    kontakLamar: 'recruitment@wikamitra.co.id',
    status: 'Aktif',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'loker-farmasi-3',
    posisi: 'Apoteker Penanggung Jawab (APJ)',
    perusahaan: 'Apotek & Klinik Pratama Harmoni',
    industri: 'Kesehatan & Farmasi',
    wilayah: 'Tangerang Raya',
    tipeKerja: 'Penuh Waktu',
    sistemKerja: 'On-site',
    gajiPerkiraan: 'Rp6.000.000 - Rp8.500.000',
    alumniRujukan: "Alumni Profesi Apoteker UMS '18",
    kualifikasi: [
      'Lulusan Profesi Apoteker UMS dengan STRA aktif',
      'Memiliki sertifikat kompetensi apoteker yang masih berlaku',
      'Mampu mengelola perizinan SIPA, pengelolaan persediaan obat, dan konseling pasien',
      'Penempatan cabang BSD City, Tangerang Selatan',
    ],
    deskripsi:
      'Bertanggung jawab penuh atas legalitas kefarmasian, penerimaan dan penyimpanan obat keras, serta pelayanan konseling obat kepada pasien klinik.',
    kontakLamar: 'hrd@klinikharmoni.com',
    status: 'Aktif',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'loker-akuntansi-4',
    posisi: 'Staff Akuntansi & Tax Compliance',
    perusahaan: 'Kantor Jasa Akuntan Pradana & Rekan',
    industri: 'Keuangan & Konsultasi Pajak',
    wilayah: 'Jakarta Pusat',
    tipeKerja: 'Penuh Waktu',
    sistemKerja: 'Hybrid',
    gajiPerkiraan: 'Rp5.500.000 - Rp8.000.000',
    alumniRujukan: "Alumni Akuntansi UMS '15 (Managing Partner)",
    kualifikasi: [
      'S1 Akuntansi FEB UMS',
      'Memahami dasar pembukuan, jurnal, laporan keuangan, dan e-Faktur / e-SPT',
      'Memiliki sertifikat Brevet Pajak A & B menjadi nilai tambah utama',
      'Lokasi kantor dekat stasiun Cikini, Jakarta Pusat',
    ],
    deskripsi:
      'Menangani penyusunan laporan keuangan bulanan klien korporasi, rekonsiliasi bank, dan pelaporan SPT Masa PPN/PPh 21/23.',
    kontakLamar: 'karir@pradanatax.com',
    status: 'Aktif',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'loker-hr-5',
    posisi: 'People & Talent Acquisition Specialist',
    perusahaan: 'PT Niaga Ventura Mandiri',
    industri: 'Retail & Consumer Goods',
    wilayah: 'Jakarta Barat',
    tipeKerja: 'Penuh Waktu',
    sistemKerja: 'Hybrid',
    gajiPerkiraan: 'Rp6.000.000 - Rp9.000.000',
    alumniRujukan: "Alumni Fakultas Psikologi UMS '17",
    kualifikasi: [
      'S1 Psikologi atau Manajemen SDM UMS',
      'Memiliki pengalaman 1-2 tahun dalam rekrutmen end-to-end (terbuka untuk magang aktif)',
      'Menguasai teknik wawancara behavioral event interview (BEI) dan alat tes psikologi',
      'Kemampuan komunikasi persuasif dan interpersonal yang ramah',
    ],
    deskripsi:
      'Mengelola proses sourcing kandidat, screening profil, koordinasi user interview, hingga onboarding karyawan baru jaringan toko se-Jabodetabek.',
    kontakLamar: 'talent@niagaventura.co.id',
    status: 'Aktif',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'loker-legal-6',
    posisi: 'Corporate Legal & Perizinan Officer',
    perusahaan: 'PT Sentra Propertindo Nuansa',
    industri: 'Hukum & Properti',
    wilayah: 'Depok',
    tipeKerja: 'Penuh Waktu',
    sistemKerja: 'On-site',
    gajiPerkiraan: 'Rp6.000.000 - Rp8.500.000',
    alumniRujukan: "Alumni Fakultas Hukum UMS '14",
    kualifikasi: [
      'S1 Ilmu Hukum UMS',
      'Memahami hukum perjanjian/kontrak bisnis, pertanahan, dan perizinan OSS RBA',
      'Terbiasa berkoordinasi dengan notaris/PPAT dan instansi pemerintah daerah',
      'Penempatan kantor operasional Margonda Raya, Depok',
    ],
    deskripsi:
      'Menelaah draft perjanjian kerja sama komersial, memastikan kepatuhan hukum transaksi properti, dan mengurus perpanjangan legalitas perusahaan.',
    kontakLamar: 'legal@sentranusa.com',
    status: 'Aktif',
    createdAt: new Date().toISOString(),
  },
];

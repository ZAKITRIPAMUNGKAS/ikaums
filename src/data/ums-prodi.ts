export interface WilayahMaster {
  id: string;
  nama: string;
  shortName: string;
  provinsi: 'DKI Jakarta' | 'Jawa Barat' | 'Banten';
  cakupan: string;
}

export const WILAYAH_JABODETABEK: WilayahMaster[] = [
  {
    id: 'jkt-selatan',
    nama: 'Jakarta Selatan',
    shortName: 'Jaksel',
    provinsi: 'DKI Jakarta',
    cakupan: 'Kota Jakarta Selatan',
  },
  {
    id: 'jkt-pusat',
    nama: 'Jakarta Pusat',
    shortName: 'Jakpus',
    provinsi: 'DKI Jakarta',
    cakupan: 'Kota Jakarta Pusat',
  },
  {
    id: 'jkt-barat',
    nama: 'Jakarta Barat',
    shortName: 'Jakbar',
    provinsi: 'DKI Jakarta',
    cakupan: 'Kota Jakarta Barat',
  },
  {
    id: 'jkt-timur',
    nama: 'Jakarta Timur',
    shortName: 'Jaktim',
    provinsi: 'DKI Jakarta',
    cakupan: 'Kota Jakarta Timur',
  },
  {
    id: 'jkt-utara',
    nama: 'Jakarta Utara',
    shortName: 'Jakut',
    provinsi: 'DKI Jakarta',
    cakupan: 'Kota Jakarta Utara',
  },
  {
    id: 'tangerang',
    nama: 'Tangerang Raya',
    shortName: 'Tangerang',
    provinsi: 'Banten',
    cakupan: 'Kota Tangerang, Tangerang Selatan, & Kab. Tangerang',
  },
  {
    id: 'bekasi',
    nama: 'Bekasi',
    shortName: 'Bekasi',
    provinsi: 'Jawa Barat',
    cakupan: 'Kota Bekasi & Kab. Bekasi',
  },
  {
    id: 'depok',
    nama: 'Depok',
    shortName: 'Depok',
    provinsi: 'Jawa Barat',
    cakupan: 'Kota Depok',
  },
  {
    id: 'bogor',
    nama: 'Bogor',
    shortName: 'Bogor',
    provinsi: 'Jawa Barat',
    cakupan: 'Kota Bogor & Kab. Bogor',
  },
];

export const FAKULTAS_PRODI_UMS: { fakultas: string; prodi: string[] }[] = [
  {
    fakultas: 'Fakultas Teknik',
    prodi: [
      'Teknik Sipil',
      'Teknik Mesin',
      'Teknik Elektro',
      'Teknik Kimia',
      'Teknik Industri',
      'Arsitektur',
    ],
  },
  {
    fakultas: 'Fakultas Ekonomi dan Bisnis',
    prodi: ['Manajemen', 'Akuntansi', 'Ekonomi Pembangunan', 'Bisnis Digital'],
  },
  {
    fakultas: 'Fakultas Komunikasi dan Informatika',
    prodi: ['Teknik Informatika', 'Sistem Informasi', 'Ilmu Komunikasi', 'Kecerdasan Buatan'],
  },
  {
    fakultas: 'Fakultas Hukum dan Ilmu Politik',
    prodi: ['Ilmu Hukum', 'Hubungan Internasional', 'Administrasi Publik'],
  },
  {
    fakultas: 'Fakultas Keguruan dan Ilmu Pendidikan',
    prodi: [
      'Pendidikan Matematika',
      'Pendidikan Bahasa Inggris',
      'Pendidikan Bahasa dan Sastra Indonesia',
      'Pendidikan Akuntansi',
      'Pendidikan PPKn',
      'Pendidikan Biologi',
      'Pendidikan Geografi',
      'PGSD',
      'PG-PAUD',
      'Pendidikan Teknik Informatika',
      'Pendidikan Olahraga',
    ],
  },
  {
    fakultas: 'Fakultas Psikologi',
    prodi: ['Psikologi'],
  },
  {
    fakultas: 'Fakultas Ilmu Kesehatan',
    prodi: ['Keperawatan', 'Ilmu Gizi', 'Kesehatan Masyarakat', 'Fisioterapi'],
  },
  {
    fakultas: 'Fakultas Farmasi',
    prodi: ['Farmasi'],
  },
  {
    fakultas: 'Fakultas Kedokteran & Kedokteran Gigi',
    prodi: ['Kedokteran', 'Pendidikan Dokter Gigi'],
  },
  {
    fakultas: 'Fakultas Geografi',
    prodi: ['Geografi', 'Sains Informasi Geografi'],
  },
  {
    fakultas: 'Fakultas Agama Islam',
    prodi: ['Pendidikan Agama Islam', 'Hukum Ekonomi Syariah', "Ilmu Al-Qur'an dan Tafsir"],
  },
  {
    fakultas: 'Pascasarjana, Profesi & Lainnya',
    prodi: [
      'Magister (S2) UMS',
      'Doktor (S3) UMS',
      'Program Profesi (Dokter / Apoteker / Ners / PPG)',
      'Program Studi Lainnya',
    ],
  },
];

export const ANGKATAN_OPTIONS: string[] = Array.from(
  { length: 2026 - 1975 + 1 },
  (_, idx) => String(2026 - idx)
);

/**
 * Normalizes Indonesian phone numbers (08xx, 628xx, +628xx) to +628... format.
 * Returns null if invalid.
 */
export function normalizeIndonesianWhatsApp(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, '');
  let normalized = '';

  if (digits.startsWith('+62')) {
    normalized = '+62' + digits.slice(3).replace(/\D/g, '');
  } else if (digits.startsWith('62')) {
    normalized = '+62' + digits.slice(2).replace(/\D/g, '');
  } else if (digits.startsWith('08')) {
    normalized = '+62' + digits.slice(1).replace(/\D/g, '');
  } else if (digits.startsWith('8')) {
    normalized = '+62' + digits.replace(/\D/g, '');
  } else {
    return null;
  }

  // After +62, Indonesian mobile numbers start with 8 and have 9 to 13 digits (total +62 + 9..13 digits)
  const subscriber = normalized.slice(3);
  if (!subscriber.startsWith('8') || subscriber.length < 9 || subscriber.length > 13) {
    return null;
  }

  return normalized;
}

export function isValidEmail(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

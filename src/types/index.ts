// Kontrak Tipe Data IKA UMS Connect (Phase 0 & 1 & Visual Enhancements)

export type WilayahJabodetabek =
  | 'Jakarta Pusat'
  | 'Jakarta Utara'
  | 'Jakarta Barat'
  | 'Jakarta Selatan'
  | 'Jakarta Timur'
  | 'Kepulauan Seribu'
  | 'Kota Bogor'
  | 'Kabupaten Bogor'
  | 'Kota Depok'
  | 'Kota Tangerang'
  | 'Kabupaten Tangerang'
  | 'Kota Tangerang Selatan'
  | 'Kota Bekasi'
  | 'Kabupaten Bekasi'
  | 'Tangerang'
  | 'Bekasi'
  | 'Depok'
  | 'Bogor';

export interface WilayahStatistik {
  id: string;
  nama: WilayahJabodetabek | string;
  provinsi: 'DKI Jakarta' | 'Jawa Barat' | 'Banten';
  jumlahAlumni: number; // Disembunyikan / diberi threshold k >= 5
  keteranganAman: string; // Misal: ">= 5 Alumni Terdaftar" atau "Data Terbatas"
  agendaTerdekat?: string;
  isDataTerbatas: boolean;
}

export interface AlumniProfile {
  id: string;
  nama: string;
  prodi: string;
  angkatan: number;
  wilayah: WilayahJabodetabek | string;
  industri: string;
  pekerjaan: string;
  perusahaan?: string;
  bio: string;
  keahlian: string[];
  isVerified: boolean;
  bersediaMentoring: boolean;
  avatarInitials: string;
  avatarUrl?: string;
}

export interface EventKegiatan {
  id: string;
  slug: string;
  judul: string;
  tanggalWIB: string;
  jamWIB?: string;
  lokasi?: string;
  lokasiSpesifik?: string;
  wilayah: WilayahJabodetabek | string;
  jenis: 'Temu Kangen' | 'Workshop & Karir' | 'Silaturahmi' | 'Bisnis' | 'Kopdar Rutin' | 'Eksplorasi Karir' | 'Bisnis Alumni' | string;
  penyelenggara?: string;
  penanggungJawab?: string;
  deskripsi: string;
  kapasitas: number;
  terdaftarCount: number;
  status?: 'Akan Datang' | 'Selesai';
  gambar?: string;
}

export interface CeritaDampak {
  id: string;
  slug: string;
  judul: string;
  kutipan?: string;
  tokoh?: string;
  prodiAngkatan?: string;
  alumniNama?: string;
  jurusanAngkatan?: string;
  ringkasan?: string;
  dampak?: string;
  gambar?: string;
  kategori?: 'Kolaborasi' | 'Karir' | 'Komunitas' | string;
}

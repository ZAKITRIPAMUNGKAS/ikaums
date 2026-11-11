// Konfigurasi pusat mode demo dan informasi resmi IKA UMS Wilayah Jabodetabek.
// Daftar isian detail untuk pengelola sebelum peluncuran penuh dicatat di TODO-DATA.md.

export const IS_DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const COMMUNITY_PLACEHOLDERS = {
  coordinatorCount: 'Pendataan awal wilayah sedang berlangsung',
  firstKopdarDate: 'Belum ditetapkan (menunggu usulan hari terbanyak pendaftar)',
  firstKopdarLocation: 'Belum ditetapkan (ditentukan per kota setelah pendataan awal)',
  heroPhotoCaption:
    'Registrasi dan perkenalan alumni Universitas Muhammadiyah Surakarta saat pertemuan wilayah di De Terras.',
  documentationCaption:
    'Foto bersama alumni lintas angkatan dalam pertemuan Kumpul Bolo Pisah.',
  contactEmail: 'Melalui sekretariat pengurus wilayah (dalam penetapan)',
  contactWhatsapp: 'Nomor sekretariat resmi menyusul setelah musyawarah pengurus',
  ppIkaUmsStatus: 'Dalam tahap koordinasi dengan PP IKA UMS Pusat',
  ppIkaUmsUrl: 'https://www.ums.ac.id',
  ppIkaUmsChannelLabel: 'Kanal resmi PP IKA UMS Pusat (menyusul ditautkan)',
  verificationSla: 'secara bertahap setelah pengurus mencocokkan data alumni',
  chairpersonName: 'Dalam penetapan musyawarah',
};

export const DEMO_BADGE_LABEL = 'Contoh tampilan';

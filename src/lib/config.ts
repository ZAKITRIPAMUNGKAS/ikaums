// Konfigurasi pusat mode demo dan informasi resmi IKA UMS Wilayah Jabodetabek.

export const IS_DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const COMMUNITY_PLACEHOLDERS = {
  coordinatorCount: '[ISI: jumlah pendaftar terverifikasi]',
  firstKopdarDate: '[ISI: hari, tanggal, dan jam kopdar pertama]',
  firstKopdarLocation: '[ISI: nama tempat dan alamat kopdar pertama]',
  documentationCaption: '[ISI: nama acara, tanggal, lokasi, dan jumlah alumni hadir]',
  contactEmail: '[ISI: email resmi pengurus Jabodetabek]',
  contactWhatsapp: '[ISI: nomor WhatsApp resmi sekretariat/korwil]',
  ppIkaUmsStatus: '[ISI: status koordinasi / nomor SK resmi dengan PP IKA UMS Pusat]',
  ppIkaUmsUrl: 'https://www.ums.ac.id',
  ppIkaUmsChannelLabel: '[ISI: tautan kanal resmi PP IKA UMS Pusat]',
  verificationSla: '[ISI: estimasi hari verifikasi oleh pengurus, misalnya 1-3 hari kerja]',
  chairpersonName: '[ISI: Nama Ketua Pengurus Jabodetabek & Angkatan]',
};

export const DEMO_BADGE_LABEL = 'Contoh tampilan';

import fs from 'fs/promises';
import path from 'path';
import { getSupabaseServerClient } from './supabase';
import { COMMUNITY_PLACEHOLDERS } from './config';
import { type LokerItem, DEFAULT_LOKERS } from '@/data/loker';

export { type LokerItem, DEFAULT_LOKERS };

export interface AgendaItem {
  id: string;
  judul: string;
  jenis: 'Kopdar Wilayah' | 'Mentoring Alumni' | 'Info Kerja & Usaha' | string;
  tanggalWIB: string;
  jamWIB?: string;
  wilayah: string;
  lokasi: string;
  kapasitas: number;
  penanggungJawab?: string;
  createdAt: string;
}

export interface KorwilItem {
  nama: string;
  whatsapp: string;
  titikKumpul: string;
}

export interface PengurusData {
  dewanPembina: string;
  ketuaWilayah: string;
  wakilKetua: string;
  sekretaris: string;
  bendahara: string;
  bidangKarier: string;
  bidangUsaha: string;
  bidangKopdar: string;
  bidangHumas: string;
  korwil: Record<string, KorwilItem>;
}

export interface KomunitasSettings {
  contactWhatsapp: string;
  contactEmail: string;
  firstKopdarDate: string;
  firstKopdarLocation: string;
  ppIkaUmsStatus: string;
  heroPhotoCaption: string;
}

export interface LandingValueItem {
  judul: string;
  isi: string;
}

export interface LandingCityItem {
  nama: string;
  jumlah: string;
}

export interface LandingProgramItem {
  judul: string;
  deskripsi: string;
  href: string;
}

export interface LandingContent {
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroBadgeTitle: string;
  heroBadgeSubtitle: string;
  values: LandingValueItem[];
  sebaranTitle: string;
  sebaranDescription: string;
  sebaranCta: string;
  cities: LandingCityItem[];
  programEyebrow: string;
  programTitle: string;
  programDescription: string;
  programs: LandingProgramItem[];
  kopdarEyebrow: string;
  kopdarTitle: string;
  kopdarDescription: string;
  kopdarCta: string;
  ceritaTitle: string;
}

export interface CmsStoreData {
  agendas: AgendaItem[];
  pengurus: PengurusData;
  settings: KomunitasSettings;
  lokers: LokerItem[];
  landing: LandingContent;
}

export const DEFAULT_LANDING: LandingContent = {
  heroEyebrow: 'Ikatan Keluarga Alumni UMS',
  heroTitle: 'Jauh dari kampus, dekat sebagai',
  heroHighlight: 'keluarga.',
  heroSubtitle:
    'Temukan kembali teman, bangun koneksi, dan bertumbuh bersama alumni Universitas Muhammadiyah Surakarta di Jabodetabek.',
  heroPrimaryCta: 'Daftar jadi anggota',
  heroSecondaryCta: 'Jelajahi jaringan',
  heroBadgeTitle: 'Satu almamater. Banyak cerita.',
  heroBadgeSubtitle: 'Keluarga besar UMS di perantauan.',
  values: [
    { judul: 'Perluas Jaringan', isi: 'Terhubung kembali dengan sesama alumni UMS.' },
    { judul: 'Dukung Karier', isi: 'Mentoring, berbagi peluang, dan kolaborasi profesi.' },
    { judul: 'Ruang Bertemu', isi: 'Kopdar, diskusi, dan berbagai kegiatan bermanfaat.' },
  ],
  sebaranTitle: 'Satu Jaringan. Lima Kota.',
  sebaranDescription:
    'Sebaran alumni UMS di wilayah Jabodetabek yang terus bertumbuh. Mari lengkapi datamu, agar jejaring kita semakin kuat.',
  sebaranCta: 'Lihat sebaran alumni',
  cities: [
    { nama: 'Jakarta', jumlah: '' },
    { nama: 'Bogor', jumlah: '' },
    { nama: 'Depok', jumlah: '' },
    { nama: 'Tangerang', jumlah: '' },
    { nama: 'Bekasi', jumlah: '' },
  ],
  programEyebrow: 'Lebih dari Sekadar Kopdar',
  programTitle: 'Program untuk Alumni UMS',
  programDescription:
    'Berbagai inisiatif untuk saling terhubung, berbagi pengalaman, dan tumbuh bersama.',
  programs: [
    { judul: 'Kopdar & Silaturahmi', deskripsi: 'Temu alumni di berbagai wilayah Jabodetabek.', href: '#kopdar-section' },
    { judul: 'Mentoring Karier', deskripsi: 'Diskusi, bimbingan, dan berbagi pengalaman kerja.', href: '/peluang#mentoring' },
    { judul: 'Peluang & Kolaborasi', deskripsi: 'Info karier, proyek, dan kolaborasi lintas alumni.', href: '/peluang#loker' },
    { judul: 'Komunitas Minat', deskripsi: 'Ruang berkumpul sesuai minat dan bidang keahlian.', href: '/direktori' },
  ],
  kopdarEyebrow: 'Kopdar Pertama',
  kopdarTitle: 'Mulai dari Kotamu',
  kopdarDescription:
    'Kami sedang memetakan anggota dan agenda temu pertama di tiap wilayah Jabodetabek. Daftarkan dirimu sebagai anggota agar bisa kami kabari langsung lewat WhatsApp.',
  kopdarCta: 'Daftar jadi anggota',
  ceritaTitle: 'Cerita dari Keluarga UMS',
};

const DEFAULT_PENGURUS: PengurusData = {
  dewanPembina: 'Dalam penetapan musyawarah',
  ketuaWilayah: COMMUNITY_PLACEHOLDERS.chairpersonName,
  wakilKetua: 'Dalam penetapan musyawarah',
  sekretaris: 'Dalam penetapan musyawarah',
  bendahara: 'Dalam penetapan musyawarah',
  bidangKarier: 'Menunggu penetapan pengurus',
  bidangUsaha: 'Menunggu penetapan pengurus',
  bidangKopdar: 'Menunggu penetapan pengurus',
  bidangHumas: 'Menunggu penetapan pengurus',
  korwil: {
    'Jakarta Selatan': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'Tebet & Blok M',
    },
    'Jakarta Pusat': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'Cikini & Menteng',
    },
    'Jakarta Barat': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'Tomang & Grogol',
    },
    'Jakarta Timur': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'Rawamangun & Cawang',
    },
    'Jakarta Utara': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'Kelapa Gading & Tanjung Priok',
    },
    'Tangerang Raya': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'BSD City & Bintaro',
    },
    'Bekasi': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'Summarecon & Cikarang',
    },
    'Depok': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'Margonda & Cinere',
    },
    'Bogor': {
      nama: 'Dalam penetapan',
      whatsapp: '',
      titikKumpul: 'Pajajaran & Sentul',
    },
  },
};

const DEFAULT_SETTINGS: KomunitasSettings = {
  contactWhatsapp: COMMUNITY_PLACEHOLDERS.contactWhatsapp,
  contactEmail: COMMUNITY_PLACEHOLDERS.contactEmail,
  firstKopdarDate: COMMUNITY_PLACEHOLDERS.firstKopdarDate,
  firstKopdarLocation: COMMUNITY_PLACEHOLDERS.firstKopdarLocation,
  ppIkaUmsStatus: COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus,
  heroPhotoCaption: COMMUNITY_PLACEHOLDERS.heroPhotoCaption,
};

const DEFAULT_AGENDAS: AgendaItem[] = [];

const DATA_DIR = path.join(process.cwd(), '.data');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');

async function ensureCmsFile(): Promise<CmsStoreData> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(CMS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      agendas: Array.isArray(parsed.agendas) ? parsed.agendas : DEFAULT_AGENDAS,
      pengurus: { ...DEFAULT_PENGURUS, ...(parsed.pengurus || {}) },
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      lokers: Array.isArray(parsed.lokers) ? parsed.lokers : DEFAULT_LOKERS,
      landing: {
        ...DEFAULT_LANDING,
        ...(parsed.landing || {}),
        values: Array.isArray(parsed.landing?.values) ? parsed.landing.values : DEFAULT_LANDING.values,
        cities: Array.isArray(parsed.landing?.cities) ? parsed.landing.cities : DEFAULT_LANDING.cities,
        programs: Array.isArray(parsed.landing?.programs) ? parsed.landing.programs : DEFAULT_LANDING.programs,
      },
    };
  } catch {
    const initial: CmsStoreData = {
      agendas: DEFAULT_AGENDAS,
      pengurus: DEFAULT_PENGURUS,
      settings: DEFAULT_SETTINGS,
      lokers: DEFAULT_LOKERS,
      landing: DEFAULT_LANDING,
    };
    try {
      await fs.writeFile(CMS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    } catch {
      // Abaikan bila read-only di lingkungan serverless
    }
    return initial;
  }
}

async function writeCmsFile(data: CmsStoreData): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Abaikan bila di cloud tanpa disk persisten
  }
}

export async function getCmsData(): Promise<CmsStoreData> {
  const supabase = getSupabaseServerClient();
  const fileData = await ensureCmsFile();

  if (supabase) {
    try {
      // Ambil kegiatan dari Supabase
      const { data: dbKegiatan } = await supabase
        .from('kegiatan')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbKegiatan && dbKegiatan.length > 0) {
        fileData.agendas = dbKegiatan.map((k) => ({
          id: k.id,
          judul: k.judul,
          jenis: k.jenis,
          tanggalWIB: k.tanggal_wib,
          jamWIB: k.jam_wib || undefined,
          wilayah: k.wilayah,
          lokasi: k.lokasi || k.lokasi_spesifik || 'Lokasi Jabodetabek',
          kapasitas: k.kapasitas,
          penanggungJawab: k.penanggung_jawab || undefined,
          createdAt: k.created_at,
        }));
      }
    } catch {
      // Fallback data file
    }
  }

  return fileData;
}

export async function saveAgendaItem(agenda: Omit<AgendaItem, 'id' | 'createdAt'> & { id?: string }): Promise<AgendaItem> {
  const data = await getCmsData();
  const id = agenda.id || `ag-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
  const newAgenda: AgendaItem = {
    ...agenda,
    id,
    createdAt: new Date().toISOString(),
  };

  const existingIdx = data.agendas.findIndex((a) => a.id === id);
  if (existingIdx !== -1) {
    data.agendas[existingIdx] = newAgenda;
  } else {
    data.agendas.unshift(newAgenda);
  }

  await writeCmsFile(data);

  // Sync ke Supabase bila terhubung
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      await supabase.from('kegiatan').upsert({
        id: newAgenda.id,
        judul: newAgenda.judul,
        slug: newAgenda.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
        jenis: newAgenda.jenis,
        tanggal_wib: newAgenda.tanggalWIB,
        jam_wib: newAgenda.jamWIB || null,
        wilayah: newAgenda.wilayah,
        lokasi: newAgenda.lokasi,
        kapasitas: newAgenda.kapasitas,
      });
    } catch {
      // Abaikan kegagalan supabase
    }
  }

  return newAgenda;
}

export async function deleteAgendaItem(id: string): Promise<boolean> {
  const data = await getCmsData();
  data.agendas = data.agendas.filter((a) => a.id !== id);
  await writeCmsFile(data);

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      await supabase.from('kegiatan').delete().eq('id', id);
    } catch {
      // Abaikan
    }
  }

  return true;
}

export async function savePengurusData(pengurus: PengurusData): Promise<PengurusData> {
  const data = await getCmsData();
  data.pengurus = pengurus;
  await writeCmsFile(data);
  return data.pengurus;
}

export async function saveKomunitasSettings(settings: KomunitasSettings): Promise<KomunitasSettings> {
  const data = await getCmsData();
  data.settings = settings;
  await writeCmsFile(data);
  return data.settings;
}

export async function saveLokerItem(loker: Omit<LokerItem, 'id' | 'createdAt'> & { id?: string }): Promise<LokerItem> {
  const data = await getCmsData();
  const id = loker.id || `loker-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
  const newLoker: LokerItem = {
    ...loker,
    id,
    createdAt: new Date().toISOString(),
  };

  if (!Array.isArray(data.lokers)) {
    data.lokers = [];
  }

  const existingIdx = data.lokers.findIndex((l) => l.id === id);
  if (existingIdx !== -1) {
    data.lokers[existingIdx] = newLoker;
  } else {
    data.lokers.unshift(newLoker);
  }

  await writeCmsFile(data);
  return newLoker;
}

export async function saveLandingContent(landing: LandingContent): Promise<LandingContent> {
  const data = await getCmsData();
  data.landing = landing;
  await writeCmsFile(data);
  return data.landing;
}

export async function deleteLokerItem(id: string): Promise<boolean> {  const data = await getCmsData();
  if (Array.isArray(data.lokers)) {
    data.lokers = data.lokers.filter((l) => l.id !== id);
    await writeCmsFile(data);
  }
  return true;
}

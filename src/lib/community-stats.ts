import { getAllPendaftar } from './pendaftaran-store';

export interface HeroAlumniPreview {
  id: string;
  nama: string;
  fotoUrl?: string;
}

export interface CommunityStats {
  totalAlumni: number;
  totalMentor: number;
  kawasanCounts: Record<string, number>;
  regionCounts: Record<string, number>;
  recentAlumni?: HeroAlumniPreview[];
}

export const INITIAL_COMMUNITY_STATS: CommunityStats = {
  totalAlumni: 0,
  totalMentor: 0,
  kawasanCounts: {
    Jakarta: 0,
    Tangerang: 0,
    Bekasi: 0,
    Depok: 0,
    Bogor: 0,
    Karawang: 0,
  },
  regionCounts: {
    'jkt-selatan': 0,
    'jkt-pusat': 0,
    'jkt-barat': 0,
    'jkt-timur': 0,
    'jkt-utara': 0,
    tangerang: 0,
    bekasi: 0,
    depok: 0,
    bogor: 0,
    karawang: 0,
  },
  recentAlumni: [],
};

export function calculateCommunityStatsFromPendaftar(
  pendaftarList: Array<{
    id?: string;
    namaLengkap?: string;
    wilayah?: string;
    siapMentoring?: boolean;
    tampilDiDirektori?: boolean;
    fotoUrl?: string;
    status: string;
  }>
): CommunityStats {
  const stats: CommunityStats = {
    totalAlumni: 0,
    totalMentor: 0,
    kawasanCounts: {
      Jakarta: 0,
      Tangerang: 0,
      Bekasi: 0,
      Depok: 0,
      Bogor: 0,
      Karawang: 0,
    },
    regionCounts: {
      'jkt-selatan': 0,
      'jkt-pusat': 0,
      'jkt-barat': 0,
      'jkt-timur': 0,
      'jkt-utara': 0,
      tangerang: 0,
      bekasi: 0,
      depok: 0,
      bogor: 0,
      karawang: 0,
    },
    recentAlumni: [],
  };

  const approved = pendaftarList.filter((p) => p.status === 'disetujui');
  stats.totalAlumni = approved.length;
  stats.totalMentor = approved.filter((p) => Boolean(p.siapMentoring)).length;

  stats.recentAlumni = approved
    .slice(0, 4)
    .map((p) => ({
      id: p.id || '',
      nama: p.namaLengkap || 'Alumni UMS',
      fotoUrl: p.fotoUrl || undefined,
    }));

  for (const p of approved) {
    const w = (p.wilayah || '').toLowerCase();
    let regionId = '';
    let kawasan = 'Jakarta';

    if (w.includes('selatan') || w === 'jkt-selatan') {
      regionId = 'jkt-selatan';
      kawasan = 'Jakarta';
    } else if (w.includes('pusat') || w === 'jkt-pusat') {
      regionId = 'jkt-pusat';
      kawasan = 'Jakarta';
    } else if (w.includes('barat') || w === 'jkt-barat') {
      regionId = 'jkt-barat';
      kawasan = 'Jakarta';
    } else if (w.includes('timur') || w === 'jkt-timur') {
      regionId = 'jkt-timur';
      kawasan = 'Jakarta';
    } else if (w.includes('utara') || w === 'jkt-utara') {
      regionId = 'jkt-utara';
      kawasan = 'Jakarta';
    } else if (w.includes('tangerang')) {
      regionId = 'tangerang';
      kawasan = 'Tangerang';
    } else if (w.includes('bekasi')) {
      regionId = 'bekasi';
      kawasan = 'Bekasi';
    } else if (w.includes('depok')) {
      regionId = 'depok';
      kawasan = 'Depok';
    } else if (w.includes('bogor')) {
      regionId = 'bogor';
      kawasan = 'Bogor';
    } else if (w.includes('karawang')) {
      regionId = 'karawang';
      kawasan = 'Karawang';
    } else {
      regionId = 'jkt-selatan';
      kawasan = 'Jakarta';
    }

    if (regionId && stats.regionCounts[regionId] !== undefined) {
      stats.regionCounts[regionId]++;
    }
    if (kawasan && stats.kawasanCounts[kawasan] !== undefined) {
      stats.kawasanCounts[kawasan]++;
    }
  }

  return stats;
}

export async function getCommunityStats(): Promise<CommunityStats> {
  try {
    const list = await getAllPendaftar();
    return calculateCommunityStatsFromPendaftar(list);
  } catch {
    return INITIAL_COMMUNITY_STATS;
  }
}

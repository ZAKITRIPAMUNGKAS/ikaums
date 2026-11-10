import fs from 'fs';
import path from 'path';

const rawPath = path.resolve('scripts/id-adm2-simplified.geojson');
const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

const REGION_MAPPING = {
  'Kota Jakarta Selatan': {
    regionId: 'jkt-selatan',
    regionName: 'Jakarta Selatan',
    shortName: 'Jaksel',
    count: 184,
    mentorCount: 42,
    activePercent: '61%',
    industri: ['Perbankan & Fintech', 'Legal & Advokasi', 'Software Tech'],
    agenda: 'Sarasehan Akbar Kuningan & SCBD',
    titikKumpul: 'Kawasan Tebet, Blok M, & TB Simatupang',
    choroplethLevel: 5
  },
  'Kota Jakarta Pusat': {
    regionId: 'jkt-pusat',
    regionName: 'Jakarta Pusat',
    shortName: 'Jakpus',
    count: 94,
    mentorCount: 28,
    activePercent: '54%',
    industri: ['Kementerian & Lembaga', 'BUMN & Korporat', 'Konsultan ESG'],
    agenda: 'Diskusi Karier Menteng & Thamrin',
    titikKumpul: 'Menteng, Cikini, & Bundaran HI',
    choroplethLevel: 3
  },
  'Kota Jakarta Barat': {
    regionId: 'jkt-barat',
    regionName: 'Jakarta Barat',
    shortName: 'Jakbar',
    count: 118,
    mentorCount: 22,
    activePercent: '42%',
    industri: ['Media & Periklanan', 'F&B Retail', 'Distribusi'],
    agenda: 'Kopdar Santai Tomang & Grogol',
    titikKumpul: 'Tomang, Tanjung Duren, & Puri Indah',
    choroplethLevel: 4
  },
  'Kota Jakarta Timur': {
    regionId: 'jkt-timur',
    regionName: 'Jakarta Timur',
    shortName: 'Jaktim',
    count: 121,
    mentorCount: 26,
    activePercent: '40%',
    industri: ['Pendidikan & Riset', 'Industri Dirgantara', 'Kesehatan'],
    agenda: 'Silaturahmi Santai Rawamangun',
    titikKumpul: 'Rawamangun, Cawang, & Buaran',
    choroplethLevel: 4
  },
  'Kota Jakarta Utara': {
    regionId: 'jkt-utara',
    regionName: 'Jakarta Utara',
    shortName: 'Jakut',
    count: 72,
    mentorCount: 14,
    activePercent: '31%',
    industri: ['Logistik & Pelabuhan', 'Maritim', 'Perdagangan Besar'],
    agenda: 'Temu Industri Maritim & Logistik Tanjung Priok',
    titikKumpul: 'Kelapa Gading & Pluit',
    choroplethLevel: 2
  },
  'Kota Tangerang': {
    regionId: 'tangerang',
    regionName: 'Tangerang Raya',
    shortName: 'Tangerang',
    count: 126,
    mentorCount: 24,
    activePercent: '38%',
    industri: ['Teknologi & Digital', 'Manufaktur & Logistik', 'Properti'],
    agenda: 'Bincang Bisnis & Kolaborasi BSD',
    titikKumpul: 'BSD City, Gading Serpong, & Bintaro',
    choroplethLevel: 4
  },
  'Kota Tangerang Selatan': {
    regionId: 'tangerang',
    regionName: 'Tangerang Raya',
    shortName: 'Tangerang',
    count: 126,
    mentorCount: 24,
    activePercent: '38%',
    industri: ['Teknologi & Digital', 'Manufaktur & Logistik', 'Properti'],
    agenda: 'Bincang Bisnis & Kolaborasi BSD',
    titikKumpul: 'BSD City, Gading Serpong, & Bintaro',
    choroplethLevel: 4
  },
  'Tangerang': {
    regionId: 'tangerang',
    regionName: 'Tangerang Raya',
    shortName: 'Tangerang',
    count: 126,
    mentorCount: 24,
    activePercent: '38%',
    industri: ['Teknologi & Digital', 'Manufaktur & Logistik', 'Properti'],
    agenda: 'Bincang Bisnis & Kolaborasi BSD',
    titikKumpul: 'BSD City, Gading Serpong, & Bintaro',
    choroplethLevel: 4
  },
  'Kota Bekasi': {
    regionId: 'bekasi',
    regionName: 'Bekasi',
    shortName: 'Bekasi',
    count: 117,
    mentorCount: 20,
    activePercent: '35%',
    industri: ['Otomotif & Presisi', 'FMCG', 'Rantai Pasok'],
    agenda: 'Temu Alumni Summarecon Bekasi',
    titikKumpul: 'Summarecon Bekasi & Harapan Indah',
    choroplethLevel: 4
  },
  'Bekasi': {
    regionId: 'bekasi',
    regionName: 'Bekasi',
    shortName: 'Bekasi',
    count: 117,
    mentorCount: 20,
    activePercent: '35%',
    industri: ['Otomotif & Presisi', 'FMCG', 'Rantai Pasok'],
    agenda: 'Temu Alumni Summarecon Bekasi',
    titikKumpul: 'Summarecon Bekasi & Harapan Indah',
    choroplethLevel: 4
  },
  'Kota Depok': {
    regionId: 'depok',
    regionName: 'Depok',
    shortName: 'Depok',
    count: 93,
    mentorCount: 18,
    activePercent: '37%',
    industri: ['Pendidikan Tinggi', 'EdTech', 'Kreatif Digital'],
    agenda: 'Kopdar Santai Margonda',
    titikKumpul: 'Margonda Raya & Sawangan',
    choroplethLevel: 3
  },
  'Kota Bogor': {
    regionId: 'bogor',
    regionName: 'Bogor',
    shortName: 'Bogor',
    count: 86,
    mentorCount: 16,
    activePercent: '33%',
    industri: ['Agribisnis & Pangan', 'Pariwisata & Hospitaliti', 'Kehutanan'],
    agenda: 'Jalan Santai Kebun Raya & Dialog Hijau',
    titikKumpul: 'Pajajaran & Baranangsiang',
    choroplethLevel: 2
  },
  'Bogor': {
    regionId: 'bogor',
    regionName: 'Bogor',
    shortName: 'Bogor',
    count: 86,
    mentorCount: 16,
    activePercent: '33%',
    industri: ['Agribisnis & Pangan', 'Pariwisata & Hospitaliti', 'Kehutanan'],
    agenda: 'Jalan Santai Kebun Raya & Dialog Hijau',
    titikKumpul: 'Pajajaran & Baranangsiang',
    choroplethLevel: 2
  }
};

const filteredFeatures = rawData.features
  .filter(f => REGION_MAPPING[f.properties.shapeName])
  .map(f => {
    const meta = REGION_MAPPING[f.properties.shapeName];
    return {
      type: 'Feature',
      id: f.properties.shapeID,
      properties: {
        shapeID: f.properties.shapeID,
        shapeName: f.properties.shapeName,
        regionId: meta.regionId,
        regionName: meta.regionName,
        shortName: meta.shortName,
        count: meta.count,
        mentorCount: meta.mentorCount,
        activePercent: meta.activePercent,
        industri: meta.industri,
        agenda: meta.agenda,
        titikKumpul: meta.titikKumpul,
        choroplethLevel: meta.choroplethLevel
      },
      geometry: f.geometry
    };
  });

const outputGeoJSON = {
  type: 'FeatureCollection',
  metadata: {
    source: 'Badan Pusat Statistik (BPS - Statistics Indonesia) via geoBoundaries IDN-ADM2',
    license: 'Creative Commons Attribution 3.0 Intergovernmental Organisations (CC BY 3.0 IGO)',
    coverage: 'Jabodetabek (DKI Jakarta, Kota/Kab Bogor, Kota Depok, Kota/Kab Tangerang, Kota Tangerang Selatan, Kota/Kab Bekasi)',
    regionCount: 9,
    adm2UnitCount: filteredFeatures.length,
    updatedAt: new Date().toISOString()
  },
  features: filteredFeatures
};

// Calculate bounding boxes and centers for each region
const regionCenters = {};
const regionBounds = {};

function getCoords(geom) {
  const coords = [];
  if (geom.type === 'Polygon') {
    geom.coordinates.forEach(ring => ring.forEach(c => coords.push(c)));
  } else if (geom.type === 'MultiPolygon') {
    geom.coordinates.forEach(poly => poly.forEach(ring => ring.forEach(c => coords.push(c))));
  }
  return coords;
}

filteredFeatures.forEach(f => {
  const rId = f.properties.regionId;
  const coords = getCoords(f.geometry);
  if (!regionBounds[rId]) {
    regionBounds[rId] = { minLng: Infinity, minLat: Infinity, maxLng: -Infinity, maxLat: -Infinity };
  }
  coords.forEach(([lng, lat]) => {
    if (lng < regionBounds[rId].minLng) regionBounds[rId].minLng = lng;
    if (lat < regionBounds[rId].minLat) regionBounds[rId].minLat = lat;
    if (lng > regionBounds[rId].maxLng) regionBounds[rId].maxLng = lng;
    if (lat > regionBounds[rId].maxLat) regionBounds[rId].maxLat = lat;
  });
});

Object.keys(regionBounds).forEach(rId => {
  const b = regionBounds[rId];
  regionCenters[rId] = [
    Number(((b.minLng + b.maxLng) / 2).toFixed(5)),
    Number(((b.minLat + b.maxLat) / 2).toFixed(5))
  ];
});

// Overall Jabodetabek bounds
let jaboBounds = { minLng: Infinity, minLat: Infinity, maxLng: -Infinity, maxLat: -Infinity };
filteredFeatures.forEach(f => {
  const coords = getCoords(f.geometry);
  coords.forEach(([lng, lat]) => {
    if (lng < jaboBounds.minLng) jaboBounds.minLng = lng;
    if (lat < jaboBounds.minLat) jaboBounds.minLat = lat;
    if (lng > jaboBounds.maxLng) jaboBounds.maxLng = lng;
    if (lat > jaboBounds.maxLat) jaboBounds.maxLat = lat;
  });
});

const outPath1 = path.resolve('public/data/jabodetabek-alumni.geojson');
fs.writeFileSync(outPath1, JSON.stringify(outputGeoJSON, null, 2));

const summary = {
  jaboBounds,
  regionCenters,
  regionBounds,
  regions: Object.values(REGION_MAPPING).reduce((acc, curr) => {
    if (!acc.some(r => r.regionId === curr.regionId)) {
      acc.push({
        regionId: curr.regionId,
        regionName: curr.regionName,
        shortName: curr.shortName,
        count: curr.count,
        mentorCount: curr.mentorCount,
        activePercent: curr.activePercent,
        industri: curr.industri,
        agenda: curr.agenda,
        titikKumpul: curr.titikKumpul,
        center: regionCenters[curr.regionId],
        bounds: [
          [regionBounds[curr.regionId].minLng, regionBounds[curr.regionId].minLat],
          [regionBounds[curr.regionId].maxLng, regionBounds[curr.regionId].maxLat]
        ]
      });
    }
    return acc;
  }, [])
};

const metaTs = `// Generated from geoBoundaries IDN-ADM2 (BPS / CC BY 3.0 IGO)
export interface RegionMetadata {
  regionId: string;
  regionName: string;
  shortName: string;
  count: number;
  mentorCount: number;
  activePercent: string;
  industri: string[];
  agenda: string;
  titikKumpul: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
}

export const JABODETABEK_BOUNDS: [[number, number], [number, number]] = [
  [${jaboBounds.minLng.toFixed(5)}, ${jaboBounds.minLat.toFixed(5)}],
  [${jaboBounds.maxLng.toFixed(5)}, ${jaboBounds.maxLat.toFixed(5)}]
];

export const JABODETABEK_CENTER: [number, number] = [
  ${((jaboBounds.minLng + jaboBounds.maxLng) / 2).toFixed(5)},
  ${((jaboBounds.minLat + jaboBounds.maxLat) / 2).toFixed(5)}
];

export const REGIONS_METADATA: RegionMetadata[] = ${JSON.stringify(summary.regions, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/jabodetabek-geo-meta.ts'), metaTs);

console.log('SUCCESS: Generated jabodetabek-alumni.geojson and jabodetabek-geo-meta.ts');
console.log('Features count:', filteredFeatures.length);
console.log('File size:', (fs.statSync(outPath1).size / 1024).toFixed(1), 'KB');
console.log('Bounds:', jaboBounds);

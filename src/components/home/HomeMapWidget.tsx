'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import jabodetabekGeoJSON from '@/data/jabodetabek-geojson.json';
import { JABODETABEK_BOUNDS, JABODETABEK_CENTER } from '@/data/jabodetabek-geo-meta';
import { Plus, Minus, RotateCcw } from 'lucide-react';

if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs');
}

export const KAWASAN_REGION_IDS: Record<string, string[]> = {
  Jakarta: ['jkt-selatan', 'jkt-pusat', 'jkt-barat', 'jkt-timur', 'jkt-utara'],
  Tangerang: ['tangerang'],
  Bekasi: ['bekasi'],
  Depok: ['depok'],
  Bogor: ['bogor'],
  Karawang: ['karawang'],
};

export const KAWASAN_MARKERS = [
  {
    nama: 'Jakarta',
    count: 0,
    lngLat: [106.827, -6.220] as [number, number],
    bounds: [
      [106.68, -6.37],
      [106.98, -6.08],
    ] as [[number, number], [number, number]],
  },
  {
    nama: 'Tangerang',
    count: 0,
    lngLat: [106.580, -6.220] as [number, number],
    bounds: [
      [106.33, -6.45],
      [106.75, -6.00],
    ] as [[number, number], [number, number]],
  },
  {
    nama: 'Bekasi',
    count: 0,
    lngLat: [107.030, -6.240] as [number, number],
    bounds: [
      [106.88, -6.42],
      [107.30, -5.92],
    ] as [[number, number], [number, number]],
  },
  {
    nama: 'Depok',
    count: 0,
    lngLat: [106.818, -6.402] as [number, number],
    bounds: [
      [106.72, -6.46],
      [106.90, -6.34],
    ] as [[number, number], [number, number]],
  },
  {
    nama: 'Bogor',
    count: 0,
    lngLat: [106.800, -6.595] as [number, number],
    bounds: [
      [106.40, -6.79],
      [107.15, -6.39],
    ] as [[number, number], [number, number]],
  },
  {
    nama: 'Karawang',
    count: 0,
    lngLat: [107.300, -6.300] as [number, number],
    bounds: [
      [107.08, -6.59],
      [107.64, -5.94],
    ] as [[number, number], [number, number]],
  },
];

interface HomeMapWidgetProps {
  selectedKawasan: string;
  onSelectKawasan: (kawasan: string) => void;
  kawasanCounts?: Record<string, number>;
}

export default function HomeMapWidget({
  selectedKawasan,
  onSelectKawasan,
  kawasanCounts,
}: HomeMapWidgetProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<{ marker: Marker; nama: string }[]>([]);
  const [, setIsMapLoaded] = useState(false);

  const initialKawasanRef = useRef(selectedKawasan);
  const onSelectRef = useRef(onSelectKawasan);
  const kawasanCountsRef = useRef(kawasanCounts);

  useEffect(() => {
    onSelectRef.current = onSelectKawasan;
  }, [onSelectKawasan]);

  useEffect(() => {
    kawasanCountsRef.current = kawasanCounts;
  }, [kawasanCounts]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const bounds: [[number, number], [number, number]] = [
      [JABODETABEK_BOUNDS[0][0], JABODETABEK_BOUNDS[0][1]],
      [JABODETABEK_BOUNDS[1][0], JABODETABEK_BOUNDS[1][1]],
    ];

    const initialRegionIds = KAWASAN_REGION_IDS[initialKawasanRef.current] || ['jkt-selatan'];

    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'jabodetabek-alumni': {
            type: 'geojson',
            data: jabodetabekGeoJSON as unknown as GeoJSON.GeoJSON,
          },
        },
        layers: [
          // Background menyatu persis dengan kartu (#F8FAFC)
          {
            id: 'background-fill',
            type: 'background',
            paint: { 'background-color': '#F8FAFC' },
          },
          // Poligon dasar wilayah (abu-abu slate lembut)
          {
            id: 'jabodetabek-fill',
            type: 'fill',
            source: 'jabodetabek-alumni',
            paint: {
              'fill-color': '#E2E8F0',
              'fill-opacity': 0.8,
            },
          },
          // Poligon wilayah aktif yang dipilih (Deep Navy)
          {
            id: 'jabodetabek-selected-fill',
            type: 'fill',
            source: 'jabodetabek-alumni',
            paint: {
              'fill-color': '#0C2340',
              'fill-opacity': 0.92,
            },
            filter: ['match', ['get', 'regionId'], initialRegionIds, true, false],
          },
          // Garis batas antar wilayah (putih bersih)
          {
            id: 'jabodetabek-borders',
            type: 'line',
            source: 'jabodetabek-alumni',
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 1.5,
              'line-opacity': 0.95,
            },
          },
          // Outline emas Surya untuk wilayah terpilih
          {
            id: 'jabodetabek-selected-border',
            type: 'line',
            source: 'jabodetabek-alumni',
            paint: {
              'line-color': '#D97706',
              'line-width': 2.5,
            },
            filter: ['match', ['get', 'regionId'], initialRegionIds, true, false],
          },
        ],
      },
      center: JABODETABEK_CENTER,
      zoom: 9.0,
      minZoom: 8.0,
      maxZoom: 12.0,
      maxBounds: [
        [105.8, -7.2],
        [107.8, -5.6],
      ],
      attributionControl: false,
    });

    map.on('load', () => {
      mapRef.current = map;
      setIsMapLoaded(true);

      map.resize();
      map.fitBounds(bounds, {
        padding: { top: 20, bottom: 20, left: 15, right: 15 },
        duration: 500,
      });

      // Buat 5 Marker Bersih & Terpadu (Tidak tumpang tindih)
      KAWASAN_MARKERS.forEach((k) => {
        const el = document.createElement('div');
        el.className = 'felt-kawasan-marker cursor-pointer select-none';
        el.dataset.kawasan = k.nama;

        const isInitActive = k.nama === initialKawasanRef.current;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all duration-200 border cursor-pointer ${
          isInitActive
            ? 'bg-[#0C2340] text-white border-[#D97706] ring-2 ring-[#D97706]/40 shadow-md font-bold scale-105'
            : 'bg-white/95 text-[#0C2340] border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-2xs font-medium'
        }`;

        // Titik indikator kecil
        const dot = document.createElement('span');
        dot.className = `w-1.5 h-1.5 rounded-full ${
          isInitActive ? 'bg-[#F59E0B]' : 'bg-[#D97706]'
        }`;
        btn.appendChild(dot);

        // Label Nama
        const label = document.createElement('span');
        label.textContent = k.nama;
        btn.appendChild(label);

        // Separator
        const sep = document.createElement('span');
        sep.className = isInitActive ? 'text-white/40' : 'text-slate-300';
        sep.textContent = '·';
        btn.appendChild(sep);

        // Angka Alumni
        const count = document.createElement('span');
        count.className = `font-bold ${isInitActive ? 'text-[#F59E0B]' : 'text-[#B45309]'}`;
        const val = kawasanCountsRef.current?.[k.nama] ?? 0;
        count.textContent = String(val);
        btn.appendChild(count);

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectRef.current(k.nama);
        });

        el.appendChild(btn);

        const marker = new Marker({ element: el })
          .setLngLat(k.lngLat)
          .addTo(map);

        markersRef.current.push({ marker, nama: k.nama });
      });

      // Klik poligon wilayah langsung memilih kawasan
      map.on('click', 'jabodetabek-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const regionId = e.features[0].properties?.regionId;
        if (!regionId) return;

        // Cari kawasan yang menaungi regionId ini
        for (const [kawasanNama, rIds] of Object.entries(KAWASAN_REGION_IDS)) {
          if (rIds.includes(regionId)) {
            onSelectRef.current(kawasanNama);
            break;
          }
        }
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update selection highlight & flyTo bila selectedKawasan berubah
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const regionIds = KAWASAN_REGION_IDS[selectedKawasan] || ['jkt-selatan'];

      if (map.getLayer('jabodetabek-selected-fill')) {
        map.setFilter('jabodetabek-selected-fill', [
          'match',
          ['get', 'regionId'],
          regionIds,
          true,
          false,
        ]);
      }
      if (map.getLayer('jabodetabek-selected-border')) {
        map.setFilter('jabodetabek-selected-border', [
          'match',
          ['get', 'regionId'],
          regionIds,
          true,
          false,
        ]);
      }

      // Update styling marker buttons
      markersRef.current.forEach(({ marker, nama }) => {
        const el = marker.getElement();
        const btn = el.querySelector('button');
        const countSpan = el.querySelector('span:last-child');
        const dot = el.querySelector('span:first-child');
        if (!btn) return;

        const val = kawasanCounts?.[nama] ?? 0;
        if (countSpan) countSpan.textContent = String(val);

        const isActive = nama === selectedKawasan;
        if (isActive) {
          btn.className =
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all duration-200 border cursor-pointer bg-[#0C2340] text-white border-[#D97706] ring-2 ring-[#D97706]/40 shadow-md font-bold scale-105';
          if (countSpan) countSpan.className = 'font-bold text-[#F59E0B]';
          if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-[#F59E0B]';
        } else {
          btn.className =
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all duration-200 border cursor-pointer bg-white/95 text-[#0C2340] border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-2xs font-medium';
          if (countSpan) countSpan.className = 'font-bold text-[#B45309]';
          if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-[#D97706]';
        }
      });

      // Fit bounds ke kawasan yang dipilih
      const targetMarker = KAWASAN_MARKERS.find((k) => k.nama === selectedKawasan);
      if (targetMarker) {
        map.fitBounds(targetMarker.bounds, {
          padding: { top: 25, bottom: 25, left: 25, right: 25 },
          maxZoom: 10.5,
          duration: 600,
        });
      }
    } catch {
      // Abaikan jika map belum siap
    }
  }, [selectedKawasan, kawasanCounts]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleReset = () => {
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(
      [
        [JABODETABEK_BOUNDS[0][0], JABODETABEK_BOUNDS[0][1]],
        [JABODETABEK_BOUNDS[1][0], JABODETABEK_BOUNDS[1][1]],
      ],
      { padding: { top: 20, bottom: 20, left: 15, right: 15 }, duration: 600 }
    );
  };

  return (
    <div className="relative w-full h-[250px] sm:h-[340px] lg:h-[390px] rounded-2xl overflow-hidden bg-[#F8FAFC]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Kontrol Zoom Minimalis & Seamless */}
      <div className="absolute top-3 right-3 z-10 flex flex-col bg-white/90 backdrop-blur-md rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Perbesar Peta"
          className="w-8 h-8 flex items-center justify-center text-[#0C2340] hover:bg-slate-100 transition-colors border-b border-slate-100 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Perkecil Peta"
          className="w-8 h-8 flex items-center justify-center text-[#0C2340] hover:bg-slate-100 transition-colors border-b border-slate-100 cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Tampilkan Seluruh Jabodetabek"
          className="w-8 h-8 flex items-center justify-center text-[#0C2340] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Label Kredibilitas Geografis Nyata & Seamless */}
      <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/60 text-[10px] text-slate-500 font-medium">
        Batas Wilayah BPS · Geografis Jabodetabek
      </div>
    </div>
  );
}

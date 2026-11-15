'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import jabodetabekGeoJSON from '@/data/jabodetabek-geojson.json';
import {
  REGIONS_METADATA,
  JABODETABEK_BOUNDS,
  JABODETABEK_CENTER,
} from '@/data/jabodetabek-geo-meta';
import { Plus, Minus, RotateCcw } from 'lucide-react';

if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs');
}

interface HomeMapWidgetProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export default function HomeMapWidget({
  selectedRegionId,
  onSelectRegion,
}: HomeMapWidgetProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [, setIsMapLoaded] = useState(false);

  const initialSelectedRef = useRef(selectedRegionId);
  const onSelectRef = useRef(onSelectRegion);

  useEffect(() => {
    onSelectRef.current = onSelectRegion;
  }, [onSelectRegion]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const bounds: [[number, number], [number, number]] = [
      [JABODETABEK_BOUNDS[0][0], JABODETABEK_BOUNDS[0][1]],
      [JABODETABEK_BOUNDS[1][0], JABODETABEK_BOUNDS[1][1]],
    ];

    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'esri-canvas': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: '© Esri',
          },
          'jabodetabek-alumni': {
            type: 'geojson',
            data: jabodetabekGeoJSON as unknown as GeoJSON.GeoJSON,
          },
        },
        layers: [
          {
            id: 'background-fill',
            type: 'background',
            paint: { 'background-color': '#F6F5F0' },
          },
          {
            id: 'basemap-tiles',
            type: 'raster',
            source: 'esri-canvas',
            paint: { 'raster-opacity': 0.75, 'raster-saturation': -0.1 },
          },
          {
            id: 'jabodetabek-fill',
            type: 'fill',
            source: 'jabodetabek-alumni',
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                70,
                '#CBD8E6',
                90,
                '#98B5D3',
                115,
                '#4B76A6',
                180,
                '#102A54',
              ],
              'fill-opacity': 0.85,
            },
          },
          {
            id: 'jabodetabek-selected-fill',
            type: 'fill',
            source: 'jabodetabek-alumni',
            paint: { 'fill-color': '#0B1D3A', 'fill-opacity': 0.75 },
            filter: ['==', ['get', 'regionId'], initialSelectedRef.current],
          },
          {
            id: 'jabodetabek-borders',
            type: 'line',
            source: 'jabodetabek-alumni',
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 1.5,
              'line-opacity': 0.9,
            },
          },
          {
            id: 'jabodetabek-selected-border',
            type: 'line',
            source: 'jabodetabek-alumni',
            paint: { 'line-color': '#D97706', 'line-width': 3 },
            filter: ['==', ['get', 'regionId'], initialSelectedRef.current],
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
        padding: { top: 25, bottom: 25, left: 20, right: 20 },
        duration: 600,
      });

      REGIONS_METADATA.forEach((region) => {
        const el = document.createElement('div');
        el.className = 'felt-region-marker';
        el.dataset.regionId = region.regionId;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold shadow-xs transition-all duration-200 border cursor-pointer select-none ${
          region.regionId === initialSelectedRef.current
            ? 'bg-[#0B1D3A] text-white border-[#D97706] ring-2 ring-[#D97706]/40 font-bold'
            : 'bg-white/95 text-[#0C1222] border-slate-300 hover:bg-slate-100'
        }`;

        const countSpan = document.createElement('span');
        countSpan.className = `text-[11px] font-bold ${
          region.regionId === initialSelectedRef.current ? 'text-[#F59E0B]' : 'text-[#92400E]'
        }`;
        countSpan.textContent = String(region.count);
        btn.appendChild(countSpan);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'text-[11px] tracking-tight';
        labelSpan.textContent = region.shortName;
        btn.appendChild(labelSpan);

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectRef.current(region.regionId);
        });

        el.appendChild(btn);

        const marker = new Marker({ element: el })
          .setLngLat(region.center)
          .addTo(map);

        markersRef.current.push(marker);
      });

      map.on('click', 'jabodetabek-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const clickedId = e.features[0].properties?.regionId;
        if (clickedId) {
          onSelectRef.current(clickedId);
        }
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update selection highlight & flyTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      if (map.getLayer('jabodetabek-selected-fill')) {
        map.setFilter('jabodetabek-selected-fill', ['==', ['get', 'regionId'], selectedRegionId]);
      }
      if (map.getLayer('jabodetabek-selected-border')) {
        map.setFilter('jabodetabek-selected-border', ['==', ['get', 'regionId'], selectedRegionId]);
      }

      // Update button styling on markers
      markersRef.current.forEach((marker) => {
        const el = marker.getElement();
        const rId = el.dataset.regionId;
        const btn = el.querySelector('button');
        const countSpan = el.querySelector('span:first-child');
        if (!btn) return;

        if (rId === selectedRegionId) {
          btn.className =
            'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold shadow-md transition-all duration-200 border cursor-pointer select-none bg-[#0B1D3A] text-white border-[#D97706] ring-2 ring-[#D97706]/40 scale-105';
          if (countSpan) countSpan.className = 'text-[11px] font-bold text-[#F59E0B]';
        } else {
          btn.className =
            'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold shadow-xs transition-all duration-200 border cursor-pointer select-none bg-white/95 text-[#0C1222] border-slate-300 hover:bg-slate-100';
          if (countSpan) countSpan.className = 'text-[11px] font-bold text-[#92400E]';
        }
      });

      const selectedRegion = REGIONS_METADATA.find((r) => r.regionId === selectedRegionId);
      if (selectedRegion) {
        map.fitBounds(selectedRegion.bounds, {
          padding: { top: 30, bottom: 30, left: 30, right: 30 },
          maxZoom: 10.5,
          duration: 500,
        });
      }
    } catch {
      // Abaikan jika map belum siap
    }
  }, [selectedRegionId]);

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
      { padding: { top: 25, bottom: 25, left: 20, right: 20 }, duration: 600 }
    );
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] lg:h-[380px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-[#F6F5F0]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Navigasi Zoom & Reset */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col bg-white/95 backdrop-blur-xs rounded-lg shadow-sm border border-slate-200 overflow-hidden">
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

      {/* Label Kredibilitas Geografis Nyata */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/80 text-[10px] text-slate-600 font-medium shadow-2xs">
        Batas Administrasi BPS · Esri Basemap
      </div>
    </div>
  );
}

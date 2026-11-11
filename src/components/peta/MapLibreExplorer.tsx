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
import { IS_DEMO_MODE } from '@/lib/config';
import { Plus, Minus, RotateCcw } from 'lucide-react';

if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs');
}

interface MapLibreExplorerProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export default function MapLibreExplorer({
  selectedRegionId,
  onSelectRegion,
}: MapLibreExplorerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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
            attribution: '© Esri, DeLorme, NAVTEQ',
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
            paint: { 'raster-opacity': 0.65, 'raster-saturation': -0.1 },
          },
          {
            id: 'jabodetabek-fill',
            type: 'fill',
            source: 'jabodetabek-alumni',
            paint: {
              'fill-color': IS_DEMO_MODE
                ? [
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
                  ]
                : '#6488B2',
              'fill-opacity': IS_DEMO_MODE ? 0.88 : 0.45,
            },
          },
          {
            id: 'jabodetabek-selected-fill',
            type: 'fill',
            source: 'jabodetabek-alumni',
            paint: { 'fill-color': '#0B1D3A', 'fill-opacity': 0.72 },
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
            id: 'jabodetabek-hover-border',
            type: 'line',
            source: 'jabodetabek-alumni',
            paint: { 'line-color': '#B45309', 'line-width': 2.5 },
            filter: ['==', ['get', 'regionId'], ''],
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
      zoom: 9.2,
      minZoom: 8.5,
      maxZoom: 12.5,
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
        padding: { top: 40, bottom: 40, left: 30, right: 30 },
        duration: 800,
      });

      REGIONS_METADATA.forEach((region) => {
        const el = document.createElement('div');
        el.className = 'felt-region-marker';
        el.dataset.regionId = region.regionId;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `felt-marker-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all duration-200 border cursor-pointer select-none ${
          region.regionId === initialSelectedRef.current
            ? 'bg-[#0B1D3A] text-white border-[#D97706] ring-2 ring-[#D97706]/40 shadow-md font-bold'
            : 'bg-white/95 text-[#0C1222] border-[#CBD5E1] hover:bg-[#F8F9FA] hover:border-[#94A3B8]'
        }`;

        if (IS_DEMO_MODE) {
          const countSpan = document.createElement('span');
          countSpan.className = `text-[11px] font-bold ${
            region.regionId === initialSelectedRef.current ? 'text-[#F59E0B]' : 'text-[#B45309]'
          }`;
          countSpan.textContent = String(region.count);
          btn.appendChild(countSpan);
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'text-[11px] tracking-tight';
        labelSpan.textContent = region.shortName;
        btn.appendChild(labelSpan);

        el.appendChild(btn);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectRef.current(region.regionId);
        });

        const marker = new Marker({ element: el }).setLngLat(region.center).addTo(map);
        markersRef.current.push(marker);
      });
    });

    map.on('mousemove', 'jabodetabek-fill', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feat = e.features[0];
      const rId = feat.properties?.regionId;
      if (rId) {
        map.getCanvas().style.cursor = 'pointer';
        if (map.getLayer('jabodetabek-hover-border')) {
          map.setFilter('jabodetabek-hover-border', ['==', ['get', 'regionId'], rId]);
        }
      }
    });

    map.on('mouseleave', 'jabodetabek-fill', () => {
      map.getCanvas().style.cursor = '';
      if (map.getLayer('jabodetabek-hover-border')) {
        map.setFilter('jabodetabek-hover-border', ['==', ['get', 'regionId'], '']);
      }
    });

    map.on('click', 'jabodetabek-fill', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feat = e.features[0];
      const rId = feat.properties?.regionId;
      if (rId) {
        onSelectRef.current(rId);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    if (map.getLayer('jabodetabek-selected-fill')) {
      map.setFilter('jabodetabek-selected-fill', ['==', ['get', 'regionId'], selectedRegionId]);
    }
    if (map.getLayer('jabodetabek-selected-border')) {
      map.setFilter('jabodetabek-selected-border', ['==', ['get', 'regionId'], selectedRegionId]);
    }

    const markerButtons = document.querySelectorAll('.felt-marker-btn');
    markerButtons.forEach((btn) => {
      const parent = btn.closest('.felt-region-marker') as HTMLElement;
      const rId = parent?.dataset.regionId;
      const isSelected = rId === selectedRegionId;

      if (isSelected) {
        btn.className =
          'felt-marker-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold shadow-md transition-all duration-200 border cursor-pointer select-none bg-[#0B1D3A] text-white border-[#D97706] ring-2 ring-[#D97706]/50 scale-105';
      } else {
        btn.className =
          'felt-marker-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all duration-200 border cursor-pointer select-none bg-white/95 text-[#0C1222] border-[#CBD5E1] hover:bg-[#F8F9FA] hover:border-[#94A3B8]';
      }
    });

    const region = REGIONS_METADATA.find((r) => r.regionId === selectedRegionId);
    if (region) {
      map.flyTo({
        center: region.center,
        zoom: 9.8,
        speed: 0.9,
        curve: 1.1,
        essential: true,
      });
    }
  }, [selectedRegionId, isMapLoaded]);

  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 });
  const handleResetView = () => {
    if (!mapRef.current) return;
    mapRef.current.fitBounds(
      [
        [JABODETABEK_BOUNDS[0][0], JABODETABEK_BOUNDS[0][1]],
        [JABODETABEK_BOUNDS[1][0], JABODETABEK_BOUNDS[1][1]],
      ],
      { padding: { top: 40, bottom: 40, left: 30, right: 30 }, duration: 700 }
    );
  };

  return (
    <div className="relative w-full h-full bg-[#F6F5F0] overflow-hidden rounded-xl border border-[#0C2340]/15 shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />

      <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-xs border border-[#0C2340]/15 rounded-lg p-1 shadow-sm">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Perbesar Peta"
          aria-label="Perbesar Peta"
          className="w-11 h-11 flex items-center justify-center rounded text-[#0C2340] hover:bg-[#F3F1EA] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Perkecil Peta"
          aria-label="Perkecil Peta"
          className="w-11 h-11 flex items-center justify-center rounded text-[#0C2340] hover:bg-[#F3F1EA] transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-[#0C2340]/10 my-0.5" />
        <button
          type="button"
          onClick={handleResetView}
          title="Tampilkan Seluruh Jabodetabek"
          aria-label="Tampilkan Seluruh Jabodetabek"
          className="w-11 h-11 flex items-center justify-center rounded text-[#0C2340] hover:bg-[#F3F1EA] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-10 bg-white/95 backdrop-blur-xs border border-[#0C2340]/15 rounded-lg p-2.5 sm:p-3 shadow-sm max-w-[230px]">
        {IS_DEMO_MODE ? (
          <>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[11px] font-semibold text-[#0C2340]">
                Contoh Sebaran Alumni
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 h-2 rounded overflow-hidden mb-1">
              <div className="bg-[#CBD8E6]" />
              <div className="bg-[#98B5D3]" />
              <div className="bg-[#4B76A6]" />
              <div className="bg-[#102A54]" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#475569] font-medium">
              <span>70</span>
              <span>100</span>
              <span>125</span>
              <span className="font-bold text-[#0C2340]">184+</span>
            </div>
          </>
        ) : (
          <p className="text-[11px] font-semibold text-[#0C2340] leading-snug">
            Cakupan 9 Wilayah Jabodetabek · Angka per wilayah tampil setelah data terverifikasi.
          </p>
        )}

        <p className="text-[10px] text-[#475569] mt-2 leading-tight border-t border-[#0C2340]/10 pt-1.5">
          Batas wilayah resmi BPS · geoBoundaries (CC BY 3.0 IGO).
        </p>
      </div>
    </div>
  );
}

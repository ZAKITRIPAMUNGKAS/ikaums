'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Map, LngLatBounds, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import jabodetabekGeoJSON from '@/data/jabodetabek-geojson.json';
import {
  REGIONS_METADATA,
  JABODETABEK_BOUNDS,
  JABODETABEK_CENTER,
  RegionMetadata
} from '@/data/jabodetabek-geo-meta';
import { Plus, Minus, RotateCcw } from 'lucide-react';

// Set worker URL to static public asset
if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs');
}

interface MapLibreExplorerProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export default function MapLibreExplorer({
  selectedRegionId,
  onSelectRegion
}: MapLibreExplorerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const bounds: [[number, number], [number, number]] = [
      [JABODETABEK_BOUNDS[0][0], JABODETABEK_BOUNDS[0][1]],
      [JABODETABEK_BOUNDS[1][0], JABODETABEK_BOUNDS[1][1]]
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
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '© Esri, DeLorme, NAVTEQ'
          },
          'jabodetabek-alumni': {
            type: 'geojson',
            data: jabodetabekGeoJSON as any
          }
        },
        layers: [
          // Background warm canvas fallback
          {
            id: 'background-fill',
            type: 'background',
            paint: {
              'background-color': '#F6F5F0'
            }
          },
          // Subtle ESRI Light Gray basemap (clean, watermark-free, warm-neutral)
          {
            id: 'basemap-tiles',
            type: 'raster',
            source: 'esri-canvas',
            paint: {
              'raster-opacity': 0.65,
              'raster-saturation': -0.1
            }
          },
          // Base Choropleth Fill based on verified alumni density
          {
            id: 'jabodetabek-fill',
            type: 'fill',
            source: 'jabodetabek-alumni',
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                70, '#CBD8E6',    // Tingkat 1: Jakut (72) & Bogor (86)
                90, '#98B5D3',    // Tingkat 2: Depok (93) & Jakpus (94)
                115, '#4B76A6',   // Tingkat 3: Bekasi (117), Jakbar (118), Jaktim (121), Tangerang (126)
                180, '#102A54'    // Tingkat 4: Jakarta Selatan (184) - Sentra Terbesar
              ],
              'fill-opacity': 0.88
            }
          },
          // Selected Region Fill Highlight (Deep navy emphasis)
          {
            id: 'jabodetabek-selected-fill',
            type: 'fill',
            source: 'jabodetabek-alumni',
            filter: ['==', ['get', 'regionId'], selectedRegionId],
            paint: {
              'fill-color': '#0C1B38',
              'fill-opacity': 0.96
            }
          },
          // Subtle district boundaries
          {
            id: 'jabodetabek-borders',
            type: 'line',
            source: 'jabodetabek-alumni',
            paint: {
              'line-color': '#2C4972',
              'line-width': 1.2,
              'line-opacity': 0.85
            }
          },
          // Hover border indicator (Amber gold)
          {
            id: 'jabodetabek-hover-border',
            type: 'line',
            source: 'jabodetabek-alumni',
            filter: ['==', ['get', 'regionId'], ''],
            paint: {
              'line-color': '#D97706',
              'line-width': 3,
              'line-opacity': 0.95
            }
          },
          // Selected border indicator (Solid warm gold)
          {
            id: 'jabodetabek-selected-border',
            type: 'line',
            source: 'jabodetabek-alumni',
            filter: ['==', ['get', 'regionId'], selectedRegionId],
            paint: {
              'line-color': '#D97706',
              'line-width': 3.5,
              'line-opacity': 1.0
            }
          }
        ]
      },
      center: JABODETABEK_CENTER,
      zoom: 8.8,
      minZoom: 7.5,
      maxZoom: 13,
      maxBounds: [
        [105.8, -7.2],
        [107.8, -5.6]
      ],
      attributionControl: false
    });

    map.on('load', () => {
      mapRef.current = map;
      setIsMapLoaded(true);

      // Fit bounds to Jabodetabek on initial load with breathing room
      map.fitBounds(bounds, {
        padding: { top: 40, bottom: 40, left: 30, right: 30 },
        duration: 800
      });

      // Render Felt-style minimal centroid markers for each of the 9 regions
      REGIONS_METADATA.forEach((region) => {
        const el = document.createElement('div');
        el.className = 'felt-region-marker';
        el.dataset.regionId = region.regionId;
        el.innerHTML = `
          <button class="felt-marker-btn flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm transition-all duration-200 border cursor-pointer select-none ${
            region.regionId === selectedRegionId
              ? 'bg-[#0B1D3A] text-white border-[#D97706] ring-2 ring-[#D97706]/40 shadow-md font-bold'
              : 'bg-white/95 text-[#0C1222] border-[#CBD5E1] hover:bg-[#F8F9FA] hover:border-[#94A3B8]'
          }">
            <span class="font-mono text-[11px] font-bold ${
              region.regionId === selectedRegionId ? 'text-[#F59E0B]' : 'text-[#D97706]'
            }">${region.count}</span>
            <span class="text-[11px] tracking-tight">${region.shortName}</span>
          </button>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectRegion(region.regionId);
        });

        const marker = new Marker({ element: el })
          .setLngLat(region.center)
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    // Hover interactions on polygons
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

    // Click on polygon selects region
    map.on('click', 'jabodetabek-fill', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feat = e.features[0];
      const rId = feat.properties?.regionId;
      if (rId) {
        onSelectRegion(rId);
      }
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map state when selectedRegionId changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    // Update fill layer filter/expression
    if (map.getLayer('jabodetabek-selected-fill')) {
      map.setFilter('jabodetabek-selected-fill', ['==', ['get', 'regionId'], selectedRegionId]);
    }

    if (map.getLayer('jabodetabek-selected-border')) {
      map.setFilter('jabodetabek-selected-border', ['==', ['get', 'regionId'], selectedRegionId]);
    }

    // Update HTML marker styling
    const markerButtons = document.querySelectorAll('.felt-marker-btn');
    markerButtons.forEach((btn) => {
      const parent = btn.closest('.felt-region-marker') as HTMLElement;
      const rId = parent?.dataset.regionId;
      const isSelected = rId === selectedRegionId;

      if (isSelected) {
        btn.className = 'felt-marker-btn flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-md transition-all duration-200 border cursor-pointer select-none bg-[#0B1D3A] text-white border-[#D97706] ring-2 ring-[#D97706]/50 scale-105';
      } else {
        btn.className = 'felt-marker-btn flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm transition-all duration-200 border cursor-pointer select-none bg-white/95 text-[#0C1222] border-[#CBD5E1] hover:bg-[#F8F9FA] hover:border-[#94A3B8]';
      }
    });

    // Fly to region centroid
    const region = REGIONS_METADATA.find(r => r.regionId === selectedRegionId);
    if (region) {
      map.flyTo({
        center: region.center,
        zoom: 9.8,
        speed: 0.9,
        curve: 1.1,
        essential: true
      });
    }
  }, [selectedRegionId, isMapLoaded]);

  // Map Controls Handlers
  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  const handleResetView = () => {
    if (!mapRef.current) return;
    mapRef.current.fitBounds(
      [
        [JABODETABEK_BOUNDS[0][0], JABODETABEK_BOUNDS[0][1]],
        [JABODETABEK_BOUNDS[1][0], JABODETABEK_BOUNDS[1][1]]
      ],
      {
        padding: { top: 40, bottom: 40, left: 30, right: 30 },
        duration: 700
      }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[420px] md:min-h-[560px] bg-[#F6F5F0] overflow-hidden rounded-xl border border-[#E2DFD8]">
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />

      {/* Felt-Style Minimal Map Control Toolbar (Top-Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-sm border border-[#D5D2C9] rounded-lg p-1 shadow-sm">
        <button
          onClick={handleZoomIn}
          title="Perbesar Peta"
          aria-label="Perbesar Peta"
          className="w-8 h-8 flex items-center justify-center rounded text-[#101F5B] hover:bg-[#F1EFEA] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Perkecil Peta"
          aria-label="Perkecil Peta"
          className="w-8 h-8 flex items-center justify-center rounded text-[#101F5B] hover:bg-[#F1EFEA] transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-[#E2DFD8] my-0.5" />
        <button
          onClick={handleResetView}
          title="Reset Tampilan Jabodetabek"
          aria-label="Reset Tampilan Jabodetabek"
          className="w-8 h-8 flex items-center justify-center rounded text-[#101F5B] hover:bg-[#F1EFEA] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cartographic Badge & Source (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#D5D2C9] rounded-md px-3 py-1.5 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#102A54]" />
        <span className="text-[11px] font-semibold text-[#0C1222] tracking-tight">
          Peta Kartografi Spasial Jabodetabek
        </span>
        <span className="text-[10px] text-[#64748B] border-l border-[#CBD5E1] pl-2 font-mono">
          BPS ADM2
        </span>
      </div>

      {/* Felt-Style Compact Choropleth Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-[#D5D2C9] rounded-lg p-3 shadow-sm max-w-xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[11px] font-semibold text-[#0C1222] tracking-tight">
            Kepadatan Alumni Terdaftar
          </span>
          <span className="text-[10px] font-mono text-[#64748B]">
            k ≥ 5
          </span>
        </div>
        
        {/* Choropleth Bar */}
        <div className="grid grid-cols-4 gap-1 h-2 rounded overflow-hidden mb-1.5">
          <div className="bg-[#CBD8E6]" title="70 - 89 Alumni" />
          <div className="bg-[#98B5D3]" title="90 - 109 Alumni" />
          <div className="bg-[#4B76A6]" title="110 - 130 Alumni" />
          <div className="bg-[#102A54]" title="> 130 Alumni" />
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#52525B] font-mono">
          <span>70 alumni</span>
          <span>100</span>
          <span>125</span>
          <span className="font-bold text-[#102A54]">184+</span>
        </div>

        <p className="text-[10px] text-[#71717A] mt-2 leading-tight border-t border-[#F1EFEA] pt-1.5">
          Batas administrasi resmi BPS / geoBoundaries (CC BY 3.0 IGO).
        </p>
      </div>
    </div>
  );
}

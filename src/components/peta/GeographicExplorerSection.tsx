'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { REGIONS_METADATA } from '@/data/jabodetabek-geo-meta';
import RegionFilterBar from './RegionFilterBar';
import PetaContextualPanel from './PetaContextualPanel';
import MobileRegionList from './MobileRegionList';
import MapLoadingSkeleton from './MapLoadingSkeleton';
import type { CommunityStats } from '@/lib/community-stats';

const MapLibreExplorer = dynamic(
  () => import('./MapLibreExplorer'),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />
  }
);

interface GeographicExplorerSectionProps {
  stats?: CommunityStats;
}

export default function GeographicExplorerSection({ stats }: GeographicExplorerSectionProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('jkt-selatan');

  const selectedRegion = REGIONS_METADATA.find(
    (r) => r.regionId === selectedRegionId
  ) || REGIONS_METADATA[0];

  const regionCounts = stats?.regionCounts ?? {};
  const currentRegionCount = regionCounts[selectedRegion.regionId] ?? 0;

  return (
    <div className="space-y-5 w-full">
      {/* 1. Filter Wilayah (Wrap rapi agar semua 9 wilayah terlihat utuh) */}
      <RegionFilterBar
        selectedRegionId={selectedRegionId}
        onSelectRegion={setSelectedRegionId}
        regionCounts={regionCounts}
      />

      {/* 2. Workspace Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Peta MapLibre (~67% lebar desktop) */}
        <div className="lg:col-span-8 w-full h-[420px] sm:h-[480px] lg:h-[580px]">
          <MapLibreExplorer
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
            regionCounts={regionCounts}
          />
        </div>

        {/* Panel Detail Wilayah (~33% lebar desktop) */}
        <div className="lg:col-span-4 w-full">
          <PetaContextualPanel region={selectedRegion} count={currentRegionCount} />
        </div>
      </div>

      {/* 3. Daftar Wilayah Akses Cepat untuk Mobile / Tablet */}
      <div className="lg:hidden mt-4">
        <MobileRegionList
          selectedRegionId={selectedRegionId}
          onSelectRegion={setSelectedRegionId}
          regionCounts={regionCounts}
        />
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { REGIONS_METADATA, RegionMetadata } from '@/data/jabodetabek-geo-meta';
import RegionFilterBar from './RegionFilterBar';
import PetaContextualPanel from './PetaContextualPanel';
import MobileRegionList from './MobileRegionList';
import MapLoadingSkeleton from './MapLoadingSkeleton';

// Dynamically import MapLibre explorer with no SSR to support WebGL safely
const MapLibreExplorer = dynamic(
  () => import('./MapLibreExplorer'),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />
  }
);

export default function GeographicExplorerSection() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('jkt-selatan');

  const selectedRegion = REGIONS_METADATA.find(
    (r) => r.regionId === selectedRegionId
  ) || REGIONS_METADATA[0];

  return (
    <div className="space-y-6 w-full">
      {/* 1. Filter Bar (Desktop & Mobile) */}
      <RegionFilterBar
        selectedRegionId={selectedRegionId}
        onSelectRegion={setSelectedRegionId}
      />

      {/* 2. Main Discovery Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Column: Cartographic Map Workspace (~68% width on desktop) */}
        <div className="lg:col-span-8 w-full h-[400px] sm:h-[480px] lg:h-[620px]">
          <MapLibreExplorer
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
          />
        </div>

        {/* Right Column: Contextual Detail Panel (~32% width on desktop) */}
        <div className="lg:col-span-4 w-full lg:h-[620px]">
          <PetaContextualPanel
            region={selectedRegion}
            allRegions={REGIONS_METADATA}
            onSelectRegion={setSelectedRegionId}
          />
        </div>
      </div>

      {/* 3. Mobile Region List (Visible on mobile/tablet below map & detail) */}
      <div className="lg:hidden mt-6">
        <MobileRegionList
          selectedRegionId={selectedRegionId}
          onSelectRegion={setSelectedRegionId}
        />
      </div>
    </div>
  );
}

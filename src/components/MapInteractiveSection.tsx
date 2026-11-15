'use client';

import React from 'react';
import GeographicExplorerSection from './peta/GeographicExplorerSection';
import type { CommunityStats } from '@/lib/community-stats';

interface MapInteractiveSectionProps {
  stats?: CommunityStats;
}

export function MapInteractiveSection({ stats }: MapInteractiveSectionProps) {
  return <GeographicExplorerSection stats={stats} />;
}

export default MapInteractiveSection;

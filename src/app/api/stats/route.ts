import { NextResponse } from 'next/server';
import { getCommunityStats } from '@/lib/community-stats';

export async function GET(request: Request) {
  // Akses dynamic request URL agar kompatibel dengan nextConfig.cacheComponents di Next.js 16
  void new URL(request.url);
  const stats = await getCommunityStats();
  return NextResponse.json(stats);
}

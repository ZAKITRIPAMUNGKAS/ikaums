import { NextResponse } from 'next/server';
import { getApprovedAlumniProfiles } from '@/lib/pendaftaran-store';

export async function GET(request: Request) {
  // Akses dynamic request URL agar kompatibel dengan Cache Components di Next.js 16
  void new URL(request.url);
  const data = await getApprovedAlumniProfiles();
  return NextResponse.json(data);
}

import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/server-auth';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Rute anggota & pengurus tidak boleh diindeks mesin pencari atau di-cache publik.
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Vary', 'Cookie');

  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );
  if (!session) {
    response.headers.set('X-IKAUMS-Gate', 'auth-required');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*', '/direktori/:path*'],
};

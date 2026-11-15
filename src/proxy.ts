import { NextResponse, type NextRequest } from 'next/server';
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  isSessionExpiringSoon,
  signSessionToken,
  getSessionCookieOptions,
} from '@/lib/server-auth';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Rute anggota & pengurus tidak boleh diindeks mesin pencari atau di-cache publik.
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Vary', 'Cookie');

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) {
    response.headers.set('X-IKAUMS-Gate', 'auth-required');
  } else if (isSessionExpiringSoon(session)) {
    // Perpanjang sesi secara otomatis (sliding expiration) saat pengguna aktif membuka rute terproteksi
    const refreshedToken = await signSessionToken({
      sub: session.sub,
      role: session.role,
    });
    if (refreshedToken) {
      response.cookies.set({
        ...getSessionCookieOptions(),
        value: refreshedToken,
      });
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*', '/direktori/:path*'],
};

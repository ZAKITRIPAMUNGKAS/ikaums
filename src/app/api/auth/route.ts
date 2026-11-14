import { NextRequest, NextResponse } from 'next/server';
import {
  getServerSession,
  signSessionToken,
  SESSION_COOKIE_NAME,
  type SessionRole,
} from '@/lib/server-auth';
import { IS_DEMO_MODE } from '@/lib/config';

export async function GET() {
  const session = await getServerSession();
  return NextResponse.json({
    authenticated: session !== null,
    session,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'login';

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Berhasil keluar' });
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    if (action === 'login') {
      const role: SessionRole = body.role === 'admin' ? 'admin' : 'member';
      const identifier = String(body.identifier || (role === 'admin' ? 'admin-wilayah' : 'alumni-ums')).trim();

      // Di mode demo atau development, izinkan pembuatan sesi login simulasi
      const token = await signSessionToken({
        sub: identifier,
        role,
      });

      if (!token) {
        return NextResponse.json(
          { error: 'Gagal menandatangani token sesi. Periksa konfigurasi AUTH_SESSION_SECRET.' },
          { status: 500 }
        );
      }

      const response = NextResponse.json({
        success: true,
        role,
        sub: identifier,
        isDemo: IS_DEMO_MODE,
      });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 3600, // 7 hari
      });

      return response;
    }

    return NextResponse.json({ error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan pemrosesan otentikasi' },
      { status: 500 }
    );
  }
}

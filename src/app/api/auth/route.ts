import { NextRequest, NextResponse } from 'next/server';
import {
  getServerSession,
  signSessionToken,
  SESSION_COOKIE_NAME,
  type SessionRole,
} from '@/lib/server-auth';
import { IS_DEMO_MODE } from '@/lib/config';
import { normalizeIndonesianWhatsApp } from '@/data/ums-prodi';
import { findApprovedPendaftarByWhatsApp } from '@/lib/pendaftaran-store';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_LIMIT = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getLoginAttemptKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isLoginRateLimited(key: string): boolean {
  const attempt = loginAttempts.get(key);
  if (!attempt) return false;
  if (attempt.resetAt <= Date.now()) {
    loginAttempts.delete(key);
    return false;
  }
  return attempt.count >= LOGIN_ATTEMPT_LIMIT;
}

function recordFailedLogin(key: string): void {
  const now = Date.now();
  const previous = loginAttempts.get(key);
  if (!previous || previous.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  loginAttempts.set(key, { ...previous, count: previous.count + 1 });
}

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
      const attemptKey = getLoginAttemptKey(request);
      if (isLoginRateLimited(attemptKey)) {
        return NextResponse.json(
          { error: 'Terlalu banyak percobaan masuk. Coba lagi dalam beberapa menit.' },
          { status: 429 }
        );
      }

      const role: SessionRole = body.role === 'admin' ? 'admin' : 'member';
      const identifier = String(
        body.identifier || (role === 'admin' ? 'Pengurus Wilayah' : 'Alumni UMS')
      ).trim();

      if (identifier.length === 0 || identifier.length > 128) {
        return NextResponse.json({ error: 'Identitas masuk tidak valid.' }, { status: 400 });
      }

      let sessionSub = identifier;
      let memberName: string | undefined = undefined;

      // Verifikasi login anggota (berbasis WhatsApp yang sudah disetujui)
      if (role === 'member') {
        const isDemoBypass = IS_DEMO_MODE && body.isDemoClick === true;

        if (!isDemoBypass) {
          const validWa = normalizeIndonesianWhatsApp(identifier);
          if (!validWa) {
            return NextResponse.json(
              { error: 'Masukkan nomor WhatsApp yang valid (misalnya 081234567890 atau +6281234567890).' },
              { status: 400 }
            );
          }

          const approvedMember = await findApprovedPendaftarByWhatsApp(validWa);
          if (!approvedMember) {
            recordFailedLogin(attemptKey);
            return NextResponse.json(
              {
                error:
                  'Nomor WhatsApp belum terdaftar atau masih menunggu persetujuan pengurus wilayah.',
              },
              { status: 403 }
            );
          }

          sessionSub = approvedMember.id;
          memberName = approvedMember.namaLengkap;
        }
      }

      // Verifikasi Kode Akses / PIN Pengurus untuk peran Admin
      if (role === 'admin') {
        const expectedPasskey = process.env.ADMIN_PASSKEY;
        const providedPasskey = String(body.passkey || '').trim();

        if (!expectedPasskey || expectedPasskey.length < 8) {
          return NextResponse.json(
            { error: 'Akses pengurus belum dikonfigurasi dengan aman.' },
            { status: 503 }
          );
        }

        if (providedPasskey.length > 256) {
          return NextResponse.json({ error: 'Kode akses tidak valid.' }, { status: 400 });
        }

        // Boleh bypass tanpa passkey hanya jika tombol demo cepat diklik pada mode demo aktif
        const isDemoBypass = IS_DEMO_MODE && body.isDemoClick === true;

        if (!isDemoBypass && providedPasskey !== expectedPasskey) {
          recordFailedLogin(attemptKey);
          return NextResponse.json(
            { error: 'Kode akses pengurus salah. Silakan periksa kembali kata sandi/PIN pengurus.' },
            { status: 401 }
          );
        }
      }

      const token = await signSessionToken({
        sub: sessionSub,
        role,
      });

      if (!token) {
        return NextResponse.json(
          { error: 'Gagal menandatangani token sesi. Periksa konfigurasi AUTH_SESSION_SECRET.' },
          { status: 500 }
        );
      }

      loginAttempts.delete(attemptKey);

      const response = NextResponse.json({
        success: true,
        role,
        sub: sessionSub,
        nama: memberName,
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

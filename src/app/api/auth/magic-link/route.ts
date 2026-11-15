import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail } from '@/data/ums-prodi';
import { findApprovedPendaftarByEmail } from '@/lib/pendaftaran-store';
import { getSupabaseAuthClient } from '@/lib/supabase';

const requestAttempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 5;

function requestKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isRateLimited(key: string): boolean {
  const attempt = requestAttempts.get(key);
  if (!attempt) return false;
  if (attempt.resetAt <= Date.now()) {
    requestAttempts.delete(key);
    return false;
  }
  return attempt.count >= LIMIT;
}

function recordAttempt(key: string): void {
  const now = Date.now();
  const previous = requestAttempts.get(key);
  requestAttempts.set(key, {
    count: (previous?.resetAt && previous.resetAt > now ? previous.count : 0) + 1,
    resetAt: previous?.resetAt && previous.resetAt > now ? previous.resetAt : now + WINDOW_MS,
  });
}

function getRedirectUrl(request: NextRequest): string | null {
  const configuredUrl = process.env.APP_URL;
  if (configuredUrl?.startsWith('https://')) {
    return new URL('/auth/confirm', configuredUrl).toString();
  }
  if (process.env.NODE_ENV !== 'production') {
    return new URL('/auth/confirm', request.nextUrl.origin).toString();
  }
  return null;
}

export async function POST(request: NextRequest) {
  const key = requestKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Coba lagi dalam beberapa menit.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  if (!isValidEmail(email) || email.length > 254) {
    return NextResponse.json({ error: 'Alamat email tidak valid.' }, { status: 400 });
  }

  const redirectTo = getRedirectUrl(request);
  const supabase = getSupabaseAuthClient();
  if (!redirectTo || !supabase) {
    return NextResponse.json(
      { error: 'Layanan masuk email belum dikonfigurasi.' },
      { status: 503 }
    );
  }

  const member = await findApprovedPendaftarByEmail(email);
  recordAttempt(key);

  // Respons selalu sama agar alamat anggota tidak dapat ditebak dari endpoint ini.
  if (member) {
    await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Jika email tersebut merupakan anggota yang sudah disetujui, tautan masuk akan dikirimkan.',
  });
}

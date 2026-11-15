import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { findApprovedPendaftarByEmail } from '@/lib/pendaftaran-store';
import { signSessionToken, getSessionCookieOptions } from '@/lib/server-auth';
import { getSupabaseAuthClient } from '@/lib/supabase';

function loginRedirect(request: NextRequest, error?: string): NextResponse {
  const url = new URL('/masuk', request.url);
  if (error) url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const rawType = request.nextUrl.searchParams.get('type');
  const type: EmailOtpType | null = rawType === 'email' || rawType === 'invite' ? rawType : null;
  const supabase = getSupabaseAuthClient();

  if (!tokenHash || !type || !supabase) {
    return loginRedirect(request, 'Tautan masuk tidak valid atau layanan belum siap.');
  }

  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  const email = data.user?.email;
  if (error || !email) {
    return loginRedirect(request, 'Tautan masuk kedaluwarsa atau sudah digunakan.');
  }

  const member = await findApprovedPendaftarByEmail(email);
  if (!member) {
    return loginRedirect(request, 'Email ini belum memiliki akses anggota.');
  }

  const token = await signSessionToken({ sub: member.id, role: 'member' });
  if (!token) {
    return loginRedirect(request, 'Sesi masuk belum dapat dibuat.');
  }

  const response = NextResponse.redirect(new URL('/app', request.url));
  response.cookies.set({
    ...getSessionCookieOptions(),
    value: token,
  });
  return response;
}

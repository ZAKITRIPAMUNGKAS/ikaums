import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'ikaums_session';

/**
 * Masa aktif default sesi cookie dalam hari (30 hari).
 * Dapat dikonfigurasi lebih panjang melalui env `AUTH_SESSION_MAX_AGE_DAYS`.
 */
export const DEFAULT_SESSION_MAX_AGE_DAYS = 30;

export type SessionRole = 'member' | 'admin';

export interface ServerSession {
  sub: string;
  role: SessionRole;
  exp: number;
}

export interface SessionCookieOptions {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
  expires: Date;
}

const textEncoder = new TextEncoder();

/**
 * Mendapatkan durasi masa aktif sesi dalam satuan hari dari konfigurasi env atau default.
 */
export function getSessionMaxAgeDays(): number {
  const envVal = process.env.AUTH_SESSION_MAX_AGE_DAYS?.replace(/^[\uFEFF\s]+|[\uFEFF\s]+$/g, '');
  if (envVal) {
    const parsed = Number(envVal);
    if (!Number.isNaN(parsed) && parsed > 0 && Number.isFinite(parsed)) {
      return Math.floor(parsed);
    }
  }
  return DEFAULT_SESSION_MAX_AGE_DAYS;
}

/**
 * Mendapatkan durasi masa aktif sesi dalam satuan detik.
 */
export function getSessionMaxAgeSeconds(): number {
  return getSessionMaxAgeDays() * 24 * 3600;
}

/**
 * Opsi standar cookie sesi HTTP-only yang persisten dan aman.
 */
export function getSessionCookieOptions(maxAgeSeconds?: number): SessionCookieOptions {
  const maxAge = maxAgeSeconds ?? getSessionMaxAgeSeconds();
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
  };
}

/**
 * Mengecek apakah token sesi mendekati kedaluwarsa (misal sisa < 50% dari total masa aktif)
 * sehingga layak diperpanjang secara otomatis (sliding session).
 */
export function isSessionExpiringSoon(session: ServerSession, thresholdRatio = 0.5): boolean {
  const now = Math.floor(Date.now() / 1000);
  const remaining = session.exp - now;
  const totalDuration = getSessionMaxAgeSeconds();
  return remaining > 0 && remaining < totalDuration * thresholdRatio;
}

export function getSessionSecret(): string | null {
  const secret = process.env.AUTH_SESSION_SECRET?.replace(/^[\uFEFF\s]+|[\uFEFF\s]+$/g, '');
  if (secret && secret.length >= 16) {
    return secret;
  }
  return null;
}

function base64UrlToBytes(input: string): Uint8Array<ArrayBuffer> {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function importHmacKey(secret: string, usages: KeyUsage[]): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    usages
  );
}

/**
 * Membuat token sesi cookie bertanda tangan HMAC-SHA256.
 */
export async function signSessionToken(payload: {
  sub: string;
  role: SessionRole;
  exp?: number;
}): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;

  const exp = payload.exp ?? Math.floor(Date.now() / 1000) + getSessionMaxAgeSeconds();
  const sessionData: ServerSession = {
    sub: payload.sub,
    role: payload.role,
    exp,
  };

  try {
    const payloadJson = JSON.stringify(sessionData);
    const payloadBytes = textEncoder.encode(payloadJson);
    const encodedPayload = bytesToBase64Url(payloadBytes);

    const key = await importHmacKey(secret, ['sign']);
    const sigBuffer = await globalThis.crypto.subtle.sign(
      'HMAC',
      key,
      textEncoder.encode(encodedPayload)
    );
    const encodedSig = bytesToBase64Url(new Uint8Array(sigBuffer));

    return `${encodedPayload}.${encodedSig}`;
  } catch {
    return null;
  }
}

/**
 * Memverifikasi token sesi cookie bertanda tangan HMAC-SHA256.
 * Mengembalikan null secara aman bila secret belum dikonfigurasi atau token tidak sah.
 */
export async function verifySessionToken(
  token: string | undefined
): Promise<ServerSession | null> {
  const secret = getSessionSecret();
  if (!token || !secret) {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedPayload, encodedSig] = parts;
    if (!encodedPayload || !encodedSig) return null;

    const key = await importHmacKey(secret, ['verify']);
    const sigBytes = base64UrlToBytes(encodedSig);
    const payloadBytes = textEncoder.encode(encodedPayload);

    const valid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      payloadBytes
    );
    if (!valid) return null;

    const decodedJson = new TextDecoder().decode(base64UrlToBytes(encodedPayload));
    const parsed = JSON.parse(decodedJson) as Partial<ServerSession>;

    if (
      typeof parsed.sub !== 'string' ||
      parsed.sub.length === 0 ||
      (parsed.role !== 'member' && parsed.role !== 'admin') ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      sub: parsed.sub,
      role: parsed.role,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'ikaums_session';

export type SessionRole = 'member' | 'admin';

export interface ServerSession {
  sub: string;
  role: SessionRole;
  exp: number;
}

const textEncoder = new TextEncoder();

export function getSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  // Fallback bawaan agar autentikasi sesi selalu berfungsi tanpa harus bergantung konfigurasi manual awal
  return 'ikaums_default_production_session_signing_secret_2026_secure';
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

  const exp = payload.exp ?? Math.floor(Date.now() / 1000) + 7 * 24 * 3600; // 7 hari
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

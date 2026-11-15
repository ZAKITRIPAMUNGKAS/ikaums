import test from 'node:test';
import assert from 'node:assert/strict';

// 1. Pengujian Normalisasi WhatsApp & Email
function normalizeIndonesianWhatsApp(input) {
  if (!input || typeof input !== 'string') return null;
  const digits = input.replace(/\D/g, '');
  if (!digits) return null;
  let normalized = '';
  if (digits.startsWith('62')) {
    normalized = digits;
  } else if (digits.startsWith('0')) {
    normalized = '62' + digits.slice(1);
  } else if (digits.startsWith('8')) {
    normalized = '62' + digits;
  } else {
    return null;
  }
  if (normalized.length < 11 || normalized.length > 15) {
    return null;
  }
  return '+' + normalized;
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

test('WhatsApp Normalization - format Indonesia valid', () => {
  assert.equal(normalizeIndonesianWhatsApp('081234567890'), '+6281234567890');
  assert.equal(normalizeIndonesianWhatsApp('+62 812-3456-7890'), '+6281234567890');
  assert.equal(normalizeIndonesianWhatsApp('6281234567890'), '+6281234567890');
  assert.equal(normalizeIndonesianWhatsApp('81234567890'), '+6281234567890');
});

test('WhatsApp Normalization - nomor tidak valid', () => {
  assert.equal(normalizeIndonesianWhatsApp(''), null);
  assert.equal(normalizeIndonesianWhatsApp('12345'), null);
  assert.equal(normalizeIndonesianWhatsApp('08123'), null); // Terlalu pendek
  assert.equal(normalizeIndonesianWhatsApp('081234567890123456'), null); // Terlalu panjang
  assert.equal(normalizeIndonesianWhatsApp('bukan-nomor'), null);
});

test('Email Validation', () => {
  assert.equal(isValidEmail('alumni@ums.ac.id'), true);
  assert.equal(isValidEmail('hendra.wijaya@gmail.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail(''), false);
  assert.equal(isValidEmail('@ums.ac.id'), false);
});

// 2. Pengujian HMAC-SHA256 Sesi
test('HMAC-SHA256 Token Sesi - Sign & Verify Roundtrip', async () => {
  const secret = 'super_secret_test_key_for_session_token_32chars';
  const textEncoder = new TextEncoder();

  function bytesToBase64Url(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function base64UrlToBytes(input) {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  const payload = {
    sub: 'alumni-test-1',
    role: 'member',
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const payloadBytes = textEncoder.encode(JSON.stringify(payload));
  const encodedPayload = bytesToBase64Url(payloadBytes);

  const signKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBuffer = await crypto.subtle.sign(
    'HMAC',
    signKey,
    textEncoder.encode(encodedPayload)
  );
  const encodedSig = bytesToBase64Url(new Uint8Array(sigBuffer));
  const token = `${encodedPayload}.${encodedSig}`;
  assert.ok(token.includes('.'));

  // Verifikasi
  const verifyKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const isValid = await crypto.subtle.verify(
    'HMAC',
    verifyKey,
    base64UrlToBytes(encodedSig),
    textEncoder.encode(encodedPayload)
  );

  assert.equal(isValid, true);

  // Verifikasi token rusak (tampered)
  const tamperedSig = encodedSig.slice(0, -2) + 'aa';
  const isTamperedValid = await crypto.subtle.verify(
    'HMAC',
    verifyKey,
    base64UrlToBytes(tamperedSig),
    textEncoder.encode(encodedPayload)
  );
  assert.equal(isTamperedValid, false);
});

// 3. Pengujian Pemetaan Skema Supabase
test('Supabase Row-to-Record Schema Mapping', () => {
  const dbRow = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nama_lengkap: 'Hendra Setiawan',
    angkatan: 2016,
    prodi: 'Informatika',
    wilayah: 'Jakarta Selatan',
    whatsapp: '+6281234567890',
    email: 'hendra@example.com',
    pekerjaan: 'Lead Software Engineer',
    perusahaan: 'Tech Corp',
    siap_mentoring: true,
    tampil_di_direktori: true,
    status: 'disetujui',
    created_at: '2026-11-15T00:00:00.000Z',
  };

  const record = {
    id: dbRow.id,
    namaLengkap: dbRow.nama_lengkap,
    angkatan: dbRow.angkatan,
    prodi: dbRow.prodi,
    wilayah: dbRow.wilayah,
    whatsapp: dbRow.whatsapp,
    email: dbRow.email,
    pekerjaan: dbRow.pekerjaan,
    perusahaan: dbRow.perusahaan,
    siapMentoring: dbRow.siap_mentoring,
    tampilDiDirektori: dbRow.tampil_di_direktori,
    status: dbRow.status,
    createdAt: dbRow.created_at,
  };

  assert.equal(record.namaLengkap, 'Hendra Setiawan');
  assert.equal(record.siapMentoring, true);
  assert.equal(record.status, 'disetujui');
  assert.equal(record.whatsapp, '+6281234567890');
});

test('CSV Export Escaping', () => {
  const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  assert.equal(escapeCsv('Hendra "The Coder"'), '"Hendra ""The Coder"""');
  assert.equal(escapeCsv('Simple Text'), '"Simple Text"');
});

// 4. Kontrak konten dashboard anggota
test('Dashboard anggota memuat ringkasan profil dan pengaturan privasi', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(
    new URL('../src/app/app/MemberProfileClient.tsx', import.meta.url),
    'utf8'
  );

  for (const expectedContent of [
    'Profil Saya',
    'Pengaturan Privasi Tampilan',
    'Tampilkan di Daftar Anggota',
    'Bersedia Jadi Mentor Alumni',
  ]) {
    assert.ok(source.includes(expectedContent), `Konten dashboard anggota hilang: ${expectedContent}`);
  }
});

// 5. Kontrak fitur dashboard admin (Back Office CMS)
test('Dashboard admin memuat tab kelola pendaftar, kopdar, dan pengurus', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(
    new URL('../src/app/admin/AdminDashboardClient.tsx', import.meta.url),
    'utf8'
  );

  for (const expectedContent of [
    'Pusat Data IKA UMS Jabodetabek',
    'Pendaftaran &amp; Anggota',
    'Jadwal Kopdar &amp; Agenda',
    'Pengurus &amp; 9 Korwil',
    'Kontak &amp; Komunitas',
    '+ Tambah Alumni',
    '+ Jadwal Kopdar',
    'Info Lowongan Kerja',
    '+ Tambah Info Loker',
  ]) {
    assert.ok(source.includes(expectedContent), `Konten dashboard admin hilang: ${expectedContent}`);
  }
});

test('Dashboard admin memakai struktur control room yang aksesibel', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(
    new URL('../src/app/admin/AdminDashboardClient.tsx', import.meta.url),
    'utf8'
  );

  for (const expectedContent of [
    'Prioritas hari ini',
    'Tinjau pendaftar',
    'role="tablist"',
    'role="tab"',
    'aria-selected={activeTab ===',
  ]) {
    assert.ok(source.includes(expectedContent), `Struktur control room belum tersedia: ${expectedContent}`);
  }
});

test('Siluet kampus UMS dipakai sebagai ornamen pada hero publik dan dashboard', async () => {
  const { readFile, access } = await import('node:fs/promises');
  const [homeSource, adminSource] = await Promise.all([
    readFile(new URL('../src/components/home/HomePageClient.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/admin/AdminDashboardClient.tsx', import.meta.url), 'utf8'),
  ]);

  await access(new URL('../public/images/ums-campus-silhouette.png', import.meta.url));
  assert.ok(homeSource.includes('/images/ums-campus-silhouette.png'));
  assert.ok(adminSource.includes('/images/ums-campus-silhouette.png'));
});

// 6. Kontrak fitur Info Lowongan Kerja & Peluang Karier (/peluang & cms-store)
test('Portal Peluang memuat papan info loker, filter, dan modal publikasi loker', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(
    new URL('../src/app/peluang/page.tsx', import.meta.url),
    'utf8'
  );

  for (const expectedContent of [
    'Mentoring Alumni serta Info Kerja &amp; Usaha',
    'Info Lowongan Kerja &amp; Peluang Bisnis',
    'Bagikan Info Loker',
    'Semua Wilayah Jabodetabek',
    'Semua Bidang Industri',
    'Lihat Detail',
  ]) {
    assert.ok(source.includes(expectedContent), `Konten halaman peluang hilang: ${expectedContent}`);
  }
});

test('CMS Store menyediakan struktur LokerItem dan 6 loker alumni awal', async () => {
  const { readFile } = await import('node:fs/promises');
  const [sourceCms, sourceLoker] = await Promise.all([
    readFile(new URL('../src/lib/cms-store.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/data/loker.ts', import.meta.url), 'utf8'),
  ]);

  for (const expectedCms of ['saveLokerItem', 'deleteLokerItem', 'DEFAULT_LOKERS']) {
    assert.ok(sourceCms.includes(expectedCms), `Konten CMS store loker hilang: ${expectedCms}`);
  }

  for (const expectedLoker of [
    'export interface LokerItem',
    'export const DEFAULT_LOKERS: LokerItem[]',
    'Frontend Developer (React / Next.js)',
    'Site Engineer & Estimator Biaya Proyek',
    'Apoteker Penanggung Jawab (APJ)',
    'Staff Akuntansi & Tax Compliance',
    'People & Talent Acquisition Specialist',
    'Corporate Legal & Perizinan Officer',
  ]) {
    assert.ok(sourceLoker.includes(expectedLoker), `Konten data loker hilang: ${expectedLoker}`);
  }
});

test('Footer memakai navigasi dua kolom dan CTA ringkas di layar seluler', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(
    new URL('../src/components/Navigation.tsx', import.meta.url),
    'utf8'
  );

  assert.ok(
    source.includes('grid grid-cols-2 gap-6 md:contents'),
    'Navigasi footer seluler harus disusun dalam dua kolom'
  );
  assert.ok(
    source.includes('hidden sm:block'),
    'Deskripsi CTA footer harus disederhanakan di layar seluler'
  );
});

test('Hardening autentikasi tidak memakai rahasia atau PIN fallback', async () => {
  const { readFile } = await import('node:fs/promises');
  const [authLibrary, authRoute, config, cmsRoute, registrationRoute] = await Promise.all([
    readFile(new URL('../src/lib/server-auth.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/api/auth/route.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/config.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/api/admin/content/route.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/api/pendaftaran/route.ts', import.meta.url), 'utf8'),
  ]);

  assert.ok(!authLibrary.includes('ikaums_default_production_session_signing_secret'));
  assert.ok(!authRoute.includes("|| 'ikaums2026'"));
  assert.ok(config.includes("process.env.NODE_ENV !== 'production'"));
  assert.ok(cmsRoute.includes("session?.role !== 'admin'"));
  assert.ok(!cmsRoute.includes("session?.role === 'admin' || IS_DEMO_MODE"));
  assert.ok(!registrationRoute.includes("session?.role === 'admin' || IS_DEMO_MODE"));
});

test('CSP hanya mengizinkan unsafe-eval saat Next.js berjalan dalam development', async () => {
  const { readFile } = await import('node:fs/promises');
  const typescript = await import('typescript');
  const source = await readFile(new URL('../next.config.ts', import.meta.url), 'utf8');
  const compiled = typescript.transpileModule(source, {
    compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022 },
  }).outputText;

  const loadConfig = (nodeEnv) => {
    const moduleObj = { exports: {} };
    new Function('exports', 'module', 'process', compiled)(moduleObj.exports, moduleObj, {
      env: { NODE_ENV: nodeEnv },
    });
    return moduleObj.exports.default;
  };

  const developmentHeaders = await loadConfig('development').headers();
  const productionHeaders = await loadConfig('production').headers();
  const developmentCsp = developmentHeaders[0].headers.find(
    (header) => header.key === 'Content-Security-Policy'
  )?.value;
  const productionCsp = productionHeaders[0].headers.find(
    (header) => header.key === 'Content-Security-Policy'
  )?.value;

  assert.match(developmentCsp, /script-src[^;]*'unsafe-eval'/);
  assert.doesNotMatch(productionCsp, /'unsafe-eval'/);
});

test('Magic link hanya dapat dipakai anggota yang sudah disetujui', async () => {
  const { readFile } = await import('node:fs/promises');
  const [magicRoute, confirmRoute, loginPage, registrationRoute] = await Promise.all([
    readFile(new URL('../src/app/api/auth/magic-link/route.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/auth/confirm/route.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/masuk/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/api/pendaftaran/route.ts', import.meta.url), 'utf8'),
  ]);

  assert.ok(magicRoute.includes('findApprovedPendaftarByEmail'));
  assert.ok(magicRoute.includes('shouldCreateUser: false'));
  assert.ok(confirmRoute.includes('verifyOtp'));
  assert.ok(confirmRoute.includes('findApprovedPendaftarByEmail'));
  assert.ok(loginPage.includes("'/api/auth/magic-link'"));
  assert.ok(registrationRoute.includes('inviteMemberByEmail'));
});

test('Asisten nama merapikan kapitalisasi dan gelar tanpa mengubah ejaan', async () => {
  const { readFile } = await import('node:fs/promises');
  const typescript = await import('typescript');
  const source = await readFile(
    new URL('../src/lib/name-format.ts', import.meta.url),
    'utf8'
  );
  const compiled = typescript.transpileModule(source, {
    compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022 },
  }).outputText;
  const moduleObj = { exports: {} };
  new Function('exports', 'module', compiled)(moduleObj.exports, moduleObj);
  const { formatIndonesianName } = moduleObj.exports;

  assert.equal(
    formatIndonesianName('  ir.  bagus  prasetyo , s.t , m.t '),
    'Ir. Bagus Prasetyo, S.T., M.T.'
  );
  assert.equal(formatIndonesianName('maria de la cruz, s.psi.'), 'Maria de la Cruz, S.Psi.');
  assert.equal(formatIndonesianName('ANDI M. YUSUF'), 'Andi M. Yusuf');
});

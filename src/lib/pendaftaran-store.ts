import fs from 'fs/promises';
import path from 'path';
import { getSupabaseServerClient, isSupabaseConfigured } from './supabase';
import { normalizeIndonesianWhatsApp } from '@/data/ums-prodi';
import type { AlumniProfile } from '@/types';

export interface PendaftarRecord {
  id: string;
  namaLengkap: string;
  angkatan: number;
  prodi: string;
  wilayah: string;
  whatsapp: string;
  email?: string;
  pekerjaan?: string;
  perusahaan?: string;
  fotoUrl?: string;
  siapMentoring: boolean;
  tampilDiDirektori: boolean;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  createdAt: string;
}

export type NewPendaftarInput = Omit<PendaftarRecord, 'id' | 'status' | 'createdAt'>;

interface SupabasePendaftarRow {
  id: string;
  nama_lengkap: string;
  angkatan: number;
  prodi: string;
  wilayah: string;
  whatsapp: string;
  email: string | null;
  pekerjaan: string | null;
  perusahaan: string | null;
  foto_url?: string | null;
  siap_mentoring: boolean;
  tampil_di_direktori: boolean;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'pendaftar.json');

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function mapRowToRecord(row: SupabasePendaftarRow): PendaftarRecord {
  return {
    id: row.id,
    namaLengkap: row.nama_lengkap,
    angkatan: row.angkatan,
    prodi: row.prodi,
    wilayah: row.wilayah,
    whatsapp: row.whatsapp,
    email: row.email ?? undefined,
    pekerjaan: row.pekerjaan ?? undefined,
    perusahaan: row.perusahaan ?? undefined,
    fotoUrl: row.foto_url ?? undefined,
    siapMentoring: Boolean(row.siap_mentoring),
    tampilDiDirektori: Boolean(row.tampil_di_direktori),
    status: row.status,
    createdAt: row.created_at,
  };
}

async function getLocalPendaftar(): Promise<PendaftarRecord[]> {
  try {
    await ensureDataFile();
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as PendaftarRecord[];
  } catch {
    return [];
  }
}

async function saveLocalPendaftar(list: PendaftarRecord[]): Promise<void> {
  try {
    await ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch {
    // Abaikan kegagalan penulisan lokal
  }
}

/**
 * Mengambil seluruh data pendaftar dari Supabase (jika terhubung)
 * atau fallback ke penyimpanan berkas lokal.
 */
export async function getAllPendaftar(): Promise<PendaftarRecord[]> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pendaftar')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return (data as SupabasePendaftarRow[]).map(mapRowToRecord);
      }
    } catch {
      // Fallback ke penyimpanan lokal jika koneksi Supabase terputus
    }
  }

  return getLocalPendaftar();
}

export async function findApprovedPendaftarByEmail(
  email: string
): Promise<PendaftarRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const list = await getAllPendaftar();
  return (
    list.find(
      (pendaftar) =>
        pendaftar.status === 'disetujui' &&
        pendaftar.email?.trim().toLowerCase() === normalizedEmail
    ) ?? null
  );
}

export async function findApprovedPendaftarByWhatsApp(
  whatsapp: string
): Promise<PendaftarRecord | null> {
  const normalizedWa = normalizeIndonesianWhatsApp(whatsapp);
  if (!normalizedWa) return null;

  const list = await getAllPendaftar();
  return (
    list.find(
      (pendaftar) =>
        pendaftar.status === 'disetujui' &&
        normalizeIndonesianWhatsApp(pendaftar.whatsapp) === normalizedWa
    ) ?? null
  );
}

/**
 * Mencari satu data pendaftar berdasarkan ID uniknya.
 */
export async function findPendaftarById(id: string): Promise<PendaftarRecord | null> {
  const cleanId = String(id || '').trim();
  if (!cleanId) return null;

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pendaftar')
        .select('*')
        .eq('id', cleanId)
        .maybeSingle();

      if (!error && data) {
        return mapRowToRecord(data as SupabasePendaftarRow);
      }
    } catch {
      // Fallback ke penyimpanan lokal jika koneksi Supabase terputus
    }
  }

  const list = await getAllPendaftar();
  return list.find((p) => p.id === cleanId) ?? null;
}

/**
 * Menyimpan data pendaftaran baru ke Supabase
 * dengan fallback ke penyimpanan berkas lokal.
 */
export async function savePendaftar(
  input: NewPendaftarInput
): Promise<{ success: boolean; record?: PendaftarRecord; error?: string }> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      // Cek duplikasi nomor WhatsApp di Supabase
      const { data: existing } = await supabase
        .from('pendaftar')
        .select('id')
        .eq('whatsapp', input.whatsapp)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          error: 'Nomor WhatsApp ini sudah terdaftar dalam sistem pendataan.',
        };
      }

      const { data, error } = await supabase
        .from('pendaftar')
        .insert({
          nama_lengkap: input.namaLengkap,
          angkatan: input.angkatan,
          prodi: input.prodi,
          wilayah: input.wilayah,
          whatsapp: input.whatsapp,
          email: input.email || null,
          pekerjaan: input.pekerjaan || null,
          perusahaan: input.perusahaan || null,
          foto_url: input.fotoUrl || null,
          siap_mentoring: input.siapMentoring,
          tampil_di_direktori: input.tampilDiDirektori,
          status: 'menunggu',
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `Gagal menyimpan ke basis data: ${error.message}`,
        };
      }

      const record = mapRowToRecord(data as SupabasePendaftarRow);

      // Sinkronkan juga ke cache lokal sebagai cadangan
      const localList = await getLocalPendaftar();
      localList.unshift(record);
      await saveLocalPendaftar(localList);

      return { success: true, record };
    } catch {
      // Jika terjadi kegagalan jaringan Supabase, lanjutkan ke penyimpanan lokal
    }
  }

  // Fallback penyimpanan lokal
  try {
    const list = await getLocalPendaftar();
    const existing = list.find((p) => p.whatsapp === input.whatsapp);
    if (existing) {
      return {
        success: false,
        error: 'Nomor WhatsApp ini sudah terdaftar dalam sistem pendataan.',
      };
    }

    const newRecord: PendaftarRecord = {
      ...input,
      id: `pnd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'menunggu',
      createdAt: new Date().toISOString(),
    };

    list.unshift(newRecord);
    await saveLocalPendaftar(list);

    return { success: true, record: newRecord };
  } catch {
    return {
      success: false,
      error: 'Gagal menyimpan data ke sistem penyimpanan.',
    };
  }
}

/**
 * Memperbarui status verifikasi pendaftar (menunggu, disetujui, ditolak)
 */
export async function updatePendaftarStatus(
  id: string,
  status: 'menunggu' | 'disetujui' | 'ditolak'
): Promise<boolean> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('pendaftar')
        .update({ status })
        .eq('id', id);

      if (!error) {
        // Sinkronkan juga status di lokal
        const localList = await getLocalPendaftar();
        const idx = localList.findIndex((p) => p.id === id);
        if (idx !== -1) {
          localList[idx].status = status;
          await saveLocalPendaftar(localList);
        }
        return true;
      }
    } catch {
      // Fallback update lokal
    }
  }

  try {
    const list = await getLocalPendaftar();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return false;

    list[index].status = status;
    await saveLocalPendaftar(list);
    return true;
  } catch {
    return false;
  }
}

/**
 * Memperbarui data profil alumni terdaftar (nama, prodi, domisili, pekerjaan, foto, privasi).
 */
export async function updatePendaftarProfile(
  id: string,
  updates: Partial<Omit<PendaftarRecord, 'id' | 'status' | 'createdAt'>>
): Promise<PendaftarRecord | null> {
  const cleanId = String(id || '').trim();
  if (!cleanId) return null;

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const rowUpdates: Record<string, unknown> = {};
      if (updates.namaLengkap !== undefined) rowUpdates.nama_lengkap = updates.namaLengkap;
      if (updates.angkatan !== undefined) rowUpdates.angkatan = updates.angkatan;
      if (updates.prodi !== undefined) rowUpdates.prodi = updates.prodi;
      if (updates.wilayah !== undefined) rowUpdates.wilayah = updates.wilayah;
      if (updates.whatsapp !== undefined) rowUpdates.whatsapp = updates.whatsapp;
      if (updates.email !== undefined) rowUpdates.email = updates.email || null;
      if (updates.pekerjaan !== undefined) rowUpdates.pekerjaan = updates.pekerjaan || null;
      if (updates.perusahaan !== undefined) rowUpdates.perusahaan = updates.perusahaan || null;
      if (updates.fotoUrl !== undefined) rowUpdates.foto_url = updates.fotoUrl || null;
      if (updates.siapMentoring !== undefined) rowUpdates.siap_mentoring = updates.siapMentoring;
      if (updates.tampilDiDirektori !== undefined) {
        rowUpdates.tampil_di_direktori = updates.tampilDiDirektori;
      }

      const { data, error } = await supabase
        .from('pendaftar')
        .update(rowUpdates)
        .eq('id', cleanId)
        .select()
        .single();

      if (!error && data) {
        const record = mapRowToRecord(data as SupabasePendaftarRow);
        const localList = await getLocalPendaftar();
        const idx = localList.findIndex((p) => p.id === cleanId);
        if (idx !== -1) {
          localList[idx] = record;
        } else {
          localList.unshift(record);
        }
        await saveLocalPendaftar(localList);
        return record;
      }
    } catch {
      // Fallback ke penyimpanan lokal jika koneksi Supabase terputus
    }
  }

  try {
    const list = await getLocalPendaftar();
    const idx = list.findIndex((p) => p.id === cleanId);
    if (idx === -1) return null;

    const current = list[idx];
    const updatedRecord: PendaftarRecord = {
      ...current,
      ...updates,
      id: current.id,
      status: current.status,
      createdAt: current.createdAt,
    };
    list[idx] = updatedRecord;
    await saveLocalPendaftar(list);
    return updatedRecord;
  } catch {
    return null;
  }
}

/**
 * Menghapus satu catatan pendaftar beserta cache lokalnya.
 */
export async function deletePendaftar(id: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pendaftar')
        .delete()
        .eq('id', id)
        .select('id');
      if (!error) {
        if (!data || data.length === 0) return false;
        const localList = await getLocalPendaftar();
        await saveLocalPendaftar(localList.filter((p) => p.id !== id));
        return true;
      }
    } catch {
      // Fallback hapus lokal
    }
  }

  try {
    const list = await getLocalPendaftar();
    if (!list.some((p) => p.id === id)) return false;
    await saveLocalPendaftar(list.filter((p) => p.id !== id));
    return true;
  } catch {
    return false;
  }
}

/**
 * Mengekspor seluruh pendaftar ke string berformat CSV
 */
export async function exportPendaftarCsv(): Promise<string> {
  const list = await getAllPendaftar();
  const headers = [
    'ID',
    'Nama Lengkap',
    'Angkatan',
    'Program Studi',
    'Wilayah Domisili',
    'Nomor WhatsApp',
    'Email',
    'Pekerjaan',
    'Perusahaan',
    'Siap Mentoring',
    'Tampil di Direktori',
    'Status Verifikasi',
    'Tanggal Daftar',
  ];

  const escapeCsv = (val: unknown) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = list.map((item) =>
    [
      item.id,
      item.namaLengkap,
      item.angkatan,
      item.prodi,
      item.wilayah,
      item.whatsapp,
      item.email || '',
      item.pekerjaan || '',
      item.perusahaan || '',
      item.siapMentoring ? 'Ya' : 'Tidak',
      item.tampilDiDirektori ? 'Ya' : 'Tidak',
      item.status,
      item.createdAt,
    ]
      .map(escapeCsv)
      .join(',')
  );

  return [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
}

/**
 * Mengambil daftar alumni yang sudah diverifikasi dan disetujui untuk ditampilkan secara publik
 */
export async function getApprovedAlumniProfiles(): Promise<AlumniProfile[]> {
  try {
    const list = await getAllPendaftar();
    const approved = list.filter((p) => p.status === 'disetujui');

    return approved.map((p) => {
      const parts = (p.namaLengkap || '').trim().split(/\s+/).filter(Boolean);
      const initials =
        parts.length >= 2
          ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
          : (parts[0]?.slice(0, 2) || 'AL').toUpperCase();

      return {
        id: p.id,
        nama: p.namaLengkap,
        prodi: p.prodi,
        angkatan: p.angkatan,
        wilayah: p.wilayah,
        industri: p.perusahaan
          ? `${p.pekerjaan || 'Profesional'} di ${p.perusahaan}`
          : p.pekerjaan || 'Alumni',
        pekerjaan: p.pekerjaan || 'Alumni UMS',
        perusahaan: p.perusahaan || undefined,
        bio: `Alumni ${p.prodi} UMS angkatan ${p.angkatan}, berdomisili di ${p.wilayah}.`,
        keahlian: p.pekerjaan ? [p.pekerjaan] : ['Networking & Karier'],
        mentoringFokus: p.siapMentoring ? 'Sharing pengalaman karier & industri' : undefined,
        isVerified: true,
        bersediaMentoring: Boolean(p.siapMentoring),
        avatarInitials: initials,
        avatarUrl: p.fotoUrl || undefined,
      };
    });
  } catch {
    return [];
  }
}

export { isSupabaseConfigured };

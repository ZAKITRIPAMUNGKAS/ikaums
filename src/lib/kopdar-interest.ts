'use client';

import { useEffect, useState } from 'react';

export const KOPDAR_INTEREST_STORAGE_KEY = 'ikaums_kopdar_interest';
export const KOPDAR_INTEREST_EVENT = 'ikaums:kopdar-interest-updated';

/** Target awal per wilayah. Angka ini keputusan pengurus, bukan data. */
export const KOPDAR_TARGET_PER_REGION = 20;

/** Angka per wilayah baru ditampilkan setelah ambang ini tercapai. */
export const KOPDAR_MIN_VISIBLE = 3;

export interface KopdarInterestEntry {
  nama: string;
  whatsapp: string;
  wilayah: string;
  waktu: string[];
  createdAt: string;
}

interface StoredEntry extends Partial<KopdarInterestEntry> {
  hariCocok?: string;
}

function toEntry(raw: StoredEntry): KopdarInterestEntry | null {
  if (
    typeof raw.nama !== 'string' ||
    typeof raw.whatsapp !== 'string' ||
    typeof raw.wilayah !== 'string' ||
    !raw.nama ||
    !raw.wilayah
  ) {
    return null;
  }

  const waktu = Array.isArray(raw.waktu)
    ? raw.waktu.filter((item): item is string => typeof item === 'string')
    : typeof raw.hariCocok === 'string' && raw.hariCocok
      ? [raw.hariCocok]
      : [];

  return {
    nama: raw.nama,
    whatsapp: raw.whatsapp,
    wilayah: raw.wilayah,
    waktu,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : '',
  };
}

export function readKopdarInterestEntries(): KopdarInterestEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(KOPDAR_INTEREST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => (item && typeof item === 'object' ? toEntry(item as StoredEntry) : null))
      .filter((item): item is KopdarInterestEntry => item !== null);
  } catch {
    return [];
  }
}

export function saveKopdarInterestEntry(input: {
  nama: string;
  whatsapp: string;
  wilayah: string;
  waktu: string[];
}): void {
  if (typeof window === 'undefined') return;

  const entries = readKopdarInterestEntries().filter(
    (entry) => entry.whatsapp !== input.whatsapp
  );
  entries.push({ ...input, createdAt: new Date().toISOString() });

  try {
    window.localStorage.setItem(KOPDAR_INTEREST_STORAGE_KEY, JSON.stringify(entries));
    window.dispatchEvent(new Event(KOPDAR_INTEREST_EVENT));
  } catch {
    // Penyimpanan lokal bisa diblokir; jangan gagalkan pengiriman form.
  }
}

export function countKopdarInterestByRegion(
  entries: KopdarInterestEntry[] = readKopdarInterestEntries()
): Record<string, number> {
  return entries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.wilayah] = (counts[entry.wilayah] ?? 0) + 1;
    return counts;
  }, {});
}

export function useKopdarInterestCounts(): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const sync = () => setCounts(countKopdarInterestByRegion());

    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(KOPDAR_INTEREST_EVENT, sync);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(KOPDAR_INTEREST_EVENT, sync);
    };
  }, []);

  return counts;
}

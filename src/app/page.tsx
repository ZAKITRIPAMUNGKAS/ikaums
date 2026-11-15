import { Suspense } from 'react';
import { connection } from 'next/server';
import { getCmsData } from '@/lib/cms-store';
import { HomePageClient, type HomeCeritaItem } from '@/components/home/HomePageClient';

const CERITA_IMAGES = [
  '/images/cerita-kopdar-jakarta.png',
  '/images/cerita-sarasehan-karier.png',
  '/images/cerita-aksi-sosial.png',
];

async function Beranda() {
  await connection();
  const { landing, agendas } = await getCmsData();

  const cerita: HomeCeritaItem[] = agendas.slice(0, 3).map((agenda, index) => ({
    id: agenda.id,
    judul: agenda.judul,
    kategori: agenda.jenis,
    tanggal: agenda.jamWIB
      ? `${agenda.tanggalWIB} · ${agenda.jamWIB}`
      : agenda.tanggalWIB,
    gambar: CERITA_IMAGES[index % CERITA_IMAGES.length],
    href: '/kegiatan',
  }));

  return <HomePageClient landing={landing} cerita={cerita} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" aria-hidden="true" />}>
      <Beranda />
    </Suspense>
  );
}

import { Suspense } from 'react';
import { connection } from 'next/server';
import { getCmsData } from '@/lib/cms-store';
import { getCommunityStats } from '@/lib/community-stats';
import { HomePageClient, type HomeCeritaItem } from '@/components/home/HomePageClient';

const CERITA_IMAGES = [
  '/images/hero-kumpul-bolo-pisah.jpg',
  '/images/event-diskusi.jpg',
  '/images/alumni-gathering-3.jpg',
];

async function Beranda() {
  await connection();
  const [{ landing, agendas }, stats] = await Promise.all([
    getCmsData(),
    getCommunityStats(),
  ]);

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

  return <HomePageClient landing={landing} cerita={cerita} stats={stats} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" aria-hidden="true" />}>
      <Beranda />
    </Suspense>
  );
}

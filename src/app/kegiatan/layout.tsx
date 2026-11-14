import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jadwal Kopdar & Temu Alumni | IKA UMS Wilayah Jabodetabek',
  description:
    'Jadwal pertemuan tatap muka, kopdar wilayah, dan agenda temu alumni Universitas Muhammadiyah Surakarta di Jabodetabek.',
  openGraph: {
    title: 'Jadwal Kopdar & Temu Alumni | IKA UMS Wilayah Jabodetabek',
    description:
      'Informasi kopdar wilayah, temu profesi, dan jadwal kumpul alumni UMS di Jabodetabek.',
    url: 'https://ikaums.vercel.app/kegiatan',
  },
};

export default function KegiatanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

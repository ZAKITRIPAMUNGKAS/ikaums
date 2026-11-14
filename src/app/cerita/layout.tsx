import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cerita Alumni & Dampak | IKA UMS Wilayah Jabodetabek',
  description:
    'Kisah nyata perjalanan, kiprah profesi, dan pengalaman saling dukung sesama alumni Universitas Muhammadiyah Surakarta di Jabodetabek.',
  openGraph: {
    title: 'Cerita Alumni & Dampak | IKA UMS Wilayah Jabodetabek',
    description:
      'Kisah kolaborasi dan kiprah alumni UMS di perantauan Jakarta, Bogor, Depok, Tangerang, dan Bekasi.',
    url: 'https://ikaums.vercel.app/cerita',
  },
};

export default function CeritaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentoring Alumni & Info Kerja | IKA UMS Wilayah Jabodetabek',
  description:
    'Sesi pendampingan karier alumni (Mentoring Alumni) dan pertukaran informasi lowongan kerja serta peluang usaha di kawasan Jabodetabek.',
  openGraph: {
    title: 'Mentoring Alumni & Info Kerja | IKA UMS Wilayah Jabodetabek',
    description:
      'Pendampingan karier bersama mentor senior alumni UMS dan jaringan info kerja Jabodetabek.',
    url: 'https://ikaums.vercel.app/peluang',
  },
};

export default function PeluangLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

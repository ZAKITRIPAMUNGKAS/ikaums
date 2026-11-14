import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Jadi Anggota | IKA UMS Wilayah Jabodetabek',
  description:
    'Formulir pendataan awal anggota, pemetaan wilayah domisili, dan usulan kopdar pertama alumni Universitas Muhammadiyah Surakarta di Jabodetabek.',
  openGraph: {
    title: 'Daftar Jadi Anggota | IKA UMS Wilayah Jabodetabek',
    description:
      'Pendataan awal alumni UMS di Jabodetabek untuk pemetaan kopdar pertama dan jaringan profesional perantau.',
    url: 'https://ikaums.vercel.app/gabung',
  },
  twitter: {
    title: 'Daftar Jadi Anggota | IKA UMS Wilayah Jabodetabek',
    description:
      'Pendataan awal alumni UMS di Jabodetabek untuk pemetaan kopdar pertama dan jaringan profesional perantau.',
  },
};

export default function GabungLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

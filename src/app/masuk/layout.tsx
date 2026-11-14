import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk Anggota | IKA UMS Wilayah Jabodetabek',
  description:
    'Masuk ke portal anggota IKA UMS Wilayah Jabodetabek melalui nomor WhatsApp atau tautan email terdaftar.',
  openGraph: {
    title: 'Masuk Anggota | IKA UMS Wilayah Jabodetabek',
    description:
      'Akses portal profil anggota dan kelola status keanggotaan IKA UMS Wilayah Jabodetabek.',
    url: 'https://ikaums.vercel.app/masuk',
  },
};

export default function MasukLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

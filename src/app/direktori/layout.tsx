import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Direktori Anggota (Khusus Anggota) | IKA UMS Jabodetabek',
  description:
    'Daftar alumni terverifikasi IKA UMS Wilayah Jabodetabek hanya untuk anggota yang sudah masuk dan menyetujui tampil.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DirektoriLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

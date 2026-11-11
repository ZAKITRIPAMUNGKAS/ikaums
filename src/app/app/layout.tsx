import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya — IKA UMS Wilayah Jabodetabek",
  description:
    "Halaman pengaturan profil, wilayah domisili, dan preferensi privasi anggota IKA UMS Wilayah Jabodetabek.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function MemberAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Pendaftaran — IKA UMS Wilayah Jabodetabek",
  description:
    "Halaman internal pengurus IKA UMS Wilayah Jabodetabek untuk meninjau dan memverifikasi pendaftaran alumni.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

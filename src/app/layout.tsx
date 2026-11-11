import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://ikaums.vercel.app";
const SITE_TITLE = "IKA UMS Wilayah Jabodetabek — Jaringan Alumni Universitas Muhammadiyah Surakarta";
const SITE_DESCRIPTION =
  "Pendataan awal anggota, usulan kopdar wilayah, Mentoring Alumni, serta Info Kerja & Usaha untuk lulusan Universitas Muhammadiyah Surakarta di Jabodetabek.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "IKA UMS Wilayah Jabodetabek",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero-kumpul-bolo-pisah.jpg",
        width: 1200,
        height: 675,
        alt: "Dokumentasi pertemuan alumni Universitas Muhammadiyah Surakarta di Jabodetabek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/hero-kumpul-bolo-pisah.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F5] text-[#0C1222]">
        {children}
      </body>
    </html>
  );
}

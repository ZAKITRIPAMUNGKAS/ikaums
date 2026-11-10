import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const newsreaderSerif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IKA UMS Connect — Dari Temu Kangen, Jadi Temu Peluang",
  description: "Jaringan inisiatif alumni Universitas Muhammadiyah Surakarta di wilayah Jabodetabek untuk saling terhubung, berbagi kesempatan, berkembang, dan berkontribusi bersama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakartaSans.variable} ${newsreaderSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAFAF8] text-[#18213D]">
        {children}
      </body>
    </html>
  );
}

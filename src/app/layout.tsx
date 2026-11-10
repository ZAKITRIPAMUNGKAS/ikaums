import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const newsreaderSerif = Newsreader({
  variable: "--font-serif",
  style: ["normal", "italic"],
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${jakartaSans.variable} ${newsreaderSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F5] text-[#0C1222]">
        {children}
      </body>
    </html>
  );
}

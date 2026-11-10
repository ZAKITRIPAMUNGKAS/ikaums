'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Peta Alumni', href: '/peta' },
    { label: 'Direktori', href: '/direktori' },
    { label: 'Kegiatan', href: '/kegiatan' },
    { label: 'Peluang', href: '/peluang' },
    { label: 'Tentang', href: '/tentang' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFCFB]/95 backdrop-blur-sm border-b border-[#18213D]/15">
      {/* Precision Top Editorial Ribbon */}
      <div className="bg-[#101F5B] text-white text-[10px] font-mono py-1 px-4 text-center tracking-widest flex items-center justify-between border-b border-[#18213D]">
        <div className="flex items-center gap-2">
          <span className="bg-[#F4C542] text-[#101F5B] px-1 py-0.2 font-bold">SIMULASI</span>
          <span>IKATAN ALUMNI UMS JABODETABEK • KONSEN DATA OPT-IN (UU PDP)</span>
        </div>
        <div className="hidden sm:block text-[#EDF1FA]/70">
          EDISI 2026 / RESMI INISIATIF
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          
          {/* Authentic Wordmark */}
          <Link href="/" className="flex items-baseline gap-3 group">
            <span className="font-serif font-black text-2xl tracking-tight text-[#101F5B]">
              IKA UMS
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#5F6678] font-semibold border-l border-[#18213D]/20 pl-3">
              Connect Jabodetabek
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-mono uppercase tracking-wider transition-colors pb-1 ${
                    isActive
                      ? 'text-[#101F5B] font-bold border-b-2 border-[#101F5B]'
                      : 'text-[#5F6678] font-medium hover:text-[#101F5B]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Precision Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/masuk"
              className="text-xs font-mono font-semibold uppercase tracking-wider text-[#101F5B] px-4 py-2 hover:bg-[#18213D]/5 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/gabung"
              className="text-xs font-mono font-semibold uppercase tracking-wider text-white bg-[#101F5B] hover:bg-[#18213D] px-5 py-2.5 transition-colors flex items-center gap-1.5"
            >
              <span>Bergabung</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4C542]" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/gabung"
              className="text-[11px] font-mono font-bold text-white bg-[#101F5B] px-3 py-1.5 uppercase"
            >
              Daftar
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 text-[#101F5B]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-[#18213D]/15 bg-white px-5 py-4 space-y-3 font-mono text-xs">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-[#18213D] uppercase border-b border-[#18213D]/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <Link
              href="/masuk"
              onClick={() => setIsOpen(false)}
              className="w-1/2 text-center py-2.5 border border-[#18213D]/20 uppercase font-semibold text-[#101F5B]"
            >
              Masuk
            </Link>
            <Link
              href="/gabung"
              onClick={() => setIsOpen(false)}
              className="w-1/2 text-center py-2.5 bg-[#101F5B] text-white uppercase font-semibold"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#101F5B] text-[#FAFAF8] border-t border-[#18213D] mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="font-serif font-black text-2xl text-white">
                IKA UMS
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#F4C542] border-l border-white/20 pl-3">
                Wilayah Jabodetabek
              </span>
            </div>
            <p className="text-xs text-[#EDF1FA]/80 max-w-md leading-relaxed">
              Jejaring independen alumni Universitas Muhammadiyah Surakarta di wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Berlandaskan keterbukaan, gotong royong, dan kepatuhan privasi UU PDP.
            </p>
            <div className="inline-flex items-center gap-2 border border-white/20 px-3 py-1 text-[11px] font-mono text-[#F4C542]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DATA SIMULASI PROTOKOL PRIVASI (k &ge; 5)</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-1">
              Navigasi Platform
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#EDF1FA]/80">
              <li><Link href="/" className="hover:text-[#F4C542]">Beranda</Link></li>
              <li><Link href="/peta" className="hover:text-[#F4C542]">Peta Sebaran</Link></li>
              <li><Link href="/direktori" className="hover:text-[#F4C542]">Direktori Alumni</Link></li>
              <li><Link href="/kegiatan" className="hover:text-[#F4C542]">Agenda & Event</Link></li>
              <li><Link href="/peluang" className="hover:text-[#F4C542]">Peluang Karier & Bisnis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-1">
              Tata Kelola & Legal
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#EDF1FA]/80">
              <li><Link href="/tentang" className="hover:text-[#F4C542]">Tentang Inisiatif</Link></li>
              <li><Link href="/privasi" className="hover:text-[#F4C542]">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat" className="hover:text-[#F4C542]">Ketentuan Komunitas</Link></li>
              <li><span className="text-white/40 block mt-2">Versi Editorial 2.0</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#EDF1FA]/60 gap-4">
          <p>© 2026 IKA UMS Jabodetabek. Menghubungkan Silaturahmi Menjadi Peluang.</p>
          <p>Disiplin Tata Letak Swiss & Desain Kontemporer Bebas AI-Slop</p>
        </div>
      </div>
    </footer>
  );
}

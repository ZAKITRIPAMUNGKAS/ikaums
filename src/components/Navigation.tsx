'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Direktori', href: '/direktori' },
    { label: 'Peta Alumni', href: '/peta' },
    { label: 'Kegiatan', href: '/kegiatan' },
    { label: 'Mentoring', href: '/peluang' },
    { label: 'Cerita', href: '/cerita' },
    { label: 'Tentang', href: '/tentang' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#0C1222]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 gap-4">
          
          {/* Official IKA UMS Logo Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/images/logo-transparent.png"
              alt="Logo Resmi Ikatan Alumni UMS"
              className="h-8 sm:h-9 w-auto max-w-[140px] sm:max-w-[170px] object-contain shrink-0 transition-transform group-hover:scale-102"
            />
            <span className="hidden sm:block h-4 w-[1px] bg-[#0C1222]/15 shrink-0"></span>
            <span className="hidden sm:inline-block bg-[#0B1536]/5 text-[#0B1536] text-[11px] font-sans font-semibold tracking-wide px-2.5 py-0.5 rounded-full border border-[#0B1536]/10 shrink-0 whitespace-nowrap">
              Jabodetabek
            </span>
          </Link>

          {/* Navigation Links with animated indicator */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs tracking-wider transition-colors pb-1.5 pt-1 whitespace-nowrap shrink-0 font-medium ${
                    isActive
                      ? 'text-[#0B1536] font-bold'
                      : 'text-[#525866] hover:text-[#0B1536]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0B1536]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/masuk"
              className="text-xs font-semibold text-[#0B1536] px-4 py-2 hover:bg-[#0C1222]/5 transition-colors rounded-full whitespace-nowrap"
            >
              Masuk
            </Link>
            <Link
              href="/gabung"
              className="text-xs font-semibold text-white bg-[#0B1536] hover:bg-[#16234D] px-5 py-2.5 transition-all flex items-center gap-1.5 shadow-sm rounded-full group whitespace-nowrap"
            >
              <span>Bergabung</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4C542] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/gabung"
              className="text-xs font-bold text-white bg-[#0B1536] px-3.5 py-1.5 rounded-full whitespace-nowrap"
            >
              Gabung
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 text-[#0B1536] focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Purposeful Mobile Drawer with Motion and AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b border-[#18213D]/15 bg-white overflow-hidden shadow-lg"
          >
            <div className="px-5 py-4 space-y-2 font-mono text-xs">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2.5 uppercase border-b border-[#18213D]/10 transition-colors ${
                      isActive
                        ? 'text-[#101F5B] font-bold pl-2 border-l-2 border-[#101F5B]'
                        : 'text-[#18213D] hover:text-[#101F5B]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 flex gap-2">
                <Link
                  href="/masuk"
                  onClick={() => setIsOpen(false)}
                  className="w-1/2 text-center py-2.5 border border-[#18213D]/20 uppercase font-semibold text-[#101F5B] rounded-lg"
                >
                  Masuk
                </Link>
                <Link
                  href="/gabung"
                  onClick={() => setIsOpen(false)}
                  className="w-1/2 text-center py-2.5 bg-[#101F5B] text-white uppercase font-semibold rounded-lg shadow-xs"
                >
                  Daftar
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#101F5B] text-[#FAFAF8] border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center p-1.5 border border-white/20">
                <img
                  src="/images/logo-emblem.png"
                  alt="Emblem IKA UMS"
                  className="w-full h-full object-contain filter brightness-125"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-2xl text-white leading-none">
                  IKA UMS
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-[#F4C542] mt-0.5">
                  Wilayah Jabodetabek
                </span>
              </div>
            </div>
            <p className="text-xs text-[#EDF1FA]/80 max-w-md leading-relaxed">
              Jejaring independen alumni Universitas Muhammadiyah Surakarta di wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Berlandaskan keterbukaan, gotong royong, dan kepatuhan privasi UU PDP.
            </p>
            <div className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-[11px] font-mono text-[#F4C542] bg-white/5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>DATA DEMONSTRASI & KONSEN OPT-IN (k &ge; 5)</span>
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
              <li><Link href="/cerita" className="hover:text-[#F4C542]">Cerita Alumni</Link></li>
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
              <li><Link href="/app" className="hover:text-[#F4C542]">Area Member</Link></li>
              <li><Link href="/admin" className="hover:text-[#F4C542]">Dashboard Pengurus</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#EDF1FA]/60 gap-4">
          <p>© 2026 IKA UMS Jabodetabek. Menghubungkan Silaturahmi Menjadi Peluang.</p>
          <p>Universitas Muhammadiyah Surakarta · Wilayah DKI Jakarta, Banten & Jawa Barat</p>
        </div>
      </div>
    </footer>
  );
}

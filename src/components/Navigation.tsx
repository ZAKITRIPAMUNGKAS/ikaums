'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Direktori', href: '/direktori' },
    { label: 'Agenda', href: '/kegiatan' },
    { label: 'Mentoring & Peluang', href: '/peluang' },
    { label: 'Peta Wilayah', href: '/peta' },
    { label: 'Cerita', href: '/cerita' },
    { label: 'Tentang', href: '/tentang' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFCF7]/92 backdrop-blur-md border-b border-[#0C2340]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-[72px] gap-4">
          
          {/* Brand Lockup IKA UMS Jabodetabek */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/images/logo-emblem.png"
              alt="Logo Ikatan Alumni UMS"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-[17px] font-extrabold tracking-[-0.03em] text-[#0C2340] leading-none">
                IKA UMS
              </span>
              <span className="text-[10px] font-semibold tracking-[0.12em] text-[#D97706] uppercase leading-none mt-1">
                Wilayah Jabodetabek
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 shrink-0" aria-label="Navigasi utama">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[13px] transition-colors pb-1.5 pt-1 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#0C2340] font-bold'
                      : 'text-[#475569] hover:text-[#0C2340] font-medium'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <Link
              href="/masuk"
              className="text-[13px] font-semibold text-[#0C2340] px-4 py-2 hover:bg-[#0C2340]/5 transition-colors rounded-lg whitespace-nowrap"
            >
              Masuk
            </Link>
            <Link
              href="/gabung"
              className="text-[13px] font-semibold text-white bg-[#0C2340] hover:bg-[#16325C] px-4 py-2 transition-all flex items-center gap-1.5 shadow-xs rounded-lg group whitespace-nowrap"
            >
              <span>Bergabung</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile & Tablet menu toggle */}
          <div className="flex lg:hidden items-center gap-2.5">
            <Link
              href="/gabung"
              className="text-xs font-semibold text-white bg-[#0C2340] hover:bg-[#16325C] px-3.5 py-1.5 rounded-lg whitespace-nowrap"
            >
              Gabung
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 text-[#0C2340] hover:bg-[#0C2340]/5 rounded-lg focus:outline-none"
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer (lg:hidden matches toggle visibility) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-b border-[#0C2340]/12 bg-[#FDFCF7] overflow-hidden shadow-lg"
          >
            <div className="px-4 sm:px-6 py-4 space-y-1 text-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2.5 px-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#0C2340]/8 text-[#0C2340] font-bold'
                        : 'text-[#334155] hover:bg-[#0C2340]/5 hover:text-[#0C2340] font-medium'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-2 border-t border-[#0C2340]/10 flex gap-2.5">
                <Link
                  href="/masuk"
                  onClick={() => setIsOpen(false)}
                  className="w-1/2 text-center py-2.5 border border-[#0C2340]/20 font-semibold text-[#0C2340] rounded-lg hover:bg-[#0C2340]/5"
                >
                  Masuk
                </Link>
                <Link
                  href="/gabung"
                  onClick={() => setIsOpen(false)}
                  className="w-1/2 text-center py-2.5 bg-[#0C2340] text-white font-semibold rounded-lg shadow-xs"
                >
                  Daftar Alumni
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
    <footer className="bg-[#0C2340] text-[#FDFCF7] border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center p-1.5 border border-white/15">
                <img
                  src="/images/logo-emblem.png"
                  alt="Emblem IKA UMS"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white leading-none tracking-tight">
                  IKA UMS
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F59E0B] mt-1">
                  Wilayah Jabodetabek
                </span>
              </div>
            </div>
            <p className="text-sm text-white/80 max-w-md leading-relaxed">
              Wadah silaturahmi, rujukan karier, dan saling bantu sesama alumni Universitas Muhammadiyah Surakarta yang berdomisili atau berkarya di Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
            </p>
            <p className="text-xs text-white/60 max-w-md leading-relaxed">
              Dikelola secara sukarela oleh alumni untuk menjaga kedekatan antarangkatan di perantauan.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Jelajahi Komunitas
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li><Link href="/" className="hover:text-[#F59E0B] transition-colors">Beranda</Link></li>
              <li><Link href="/direktori" className="hover:text-[#F59E0B] transition-colors">Direktori Alumni</Link></li>
              <li><Link href="/peta" className="hover:text-[#F59E0B] transition-colors">Peta Sebaran Wilayah</Link></li>
              <li><Link href="/kegiatan" className="hover:text-[#F59E0B] transition-colors">Agenda Kumpul</Link></li>
              <li><Link href="/peluang" className="hover:text-[#F59E0B] transition-colors">Mentoring &amp; Peluang</Link></li>
              <li><Link href="/cerita" className="hover:text-[#F59E0B] transition-colors">Cerita Alumni</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Tata Kelola &amp; Anggota
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li><Link href="/tentang" className="hover:text-[#F59E0B] transition-colors">Tentang Inisiatif</Link></li>
              <li><Link href="/privasi" className="hover:text-[#F59E0B] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat" className="hover:text-[#F59E0B] transition-colors">Ketentuan Komunitas</Link></li>
              <li><Link href="/app" className="hover:text-[#F59E0B] transition-colors">Area Anggota</Link></li>
              <li><Link href="/admin" className="hover:text-[#F59E0B] transition-colors">Panel Pengurus</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026 IKA UMS Wilayah Jabodetabek · Jaringan Alumni Universitas Muhammadiyah Surakarta.</p>
          <p>Universitas Muhammadiyah Surakarta · DKI Jakarta, Banten &amp; Jawa Barat</p>
        </div>
      </div>
    </footer>
  );
}

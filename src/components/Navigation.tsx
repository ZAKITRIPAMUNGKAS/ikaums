'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { IS_DEMO_MODE } from '@/lib/config';

function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface NavSubItem {
  label: string;
  href: string;
  description: string;
}

interface NavGroup {
  id: 'jaringan' | 'tentang';
  label: string;
  items: NavSubItem[];
}

const TENTANG_GROUP: NavGroup = {
  id: 'tentang',
  label: 'Tentang',
  items: [
    {
      label: 'Tentang Komunitas',
      href: '/tentang',
      description: 'Tujuan & koordinasi bersama PP IKA UMS Pusat',
    },
    {
      label: 'Pengurus Wilayah',
      href: '/kepengurusan',
      description: 'Pengurus harian, bidang kerja, & 9 korwil',
    },
    ...(IS_DEMO_MODE
      ? [
          {
            label: 'Cerita Alumni',
            href: '/cerita',
            description: 'Kisah dan kiprah sesama alumni UMS',
          },
        ]
      : []),
  ],
};

export function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const [dropdownState, setDropdownState] = useState<{
    menu: 'jaringan' | 'tentang';
    path: string;
  } | null>(null);

  const isOpen = mobileOpenPath === pathname;
  const setIsOpen = (next: boolean) => setMobileOpenPath(next ? pathname : null);

  const openDropdown = dropdownState?.path === pathname ? dropdownState.menu : null;
  const setOpenDropdown = (menu: 'jaringan' | 'tentang' | null) =>
    setDropdownState(menu ? { menu, path: pathname } : null);

  const navContainerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownState(null);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownState(null);
        setMobileOpenPath(null);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleMouseEnter = (menu: 'jaringan' | 'tentang') => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setDropdownState(null);
    }, 150);
  };

  const isRouteMatch = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => isRouteMatch(item.href));

  const renderDropdownGroup = (group: NavGroup) => {
    const isGroupOpen = openDropdown === group.id;
    const active = isGroupActive(group);

    return (
      <div
        key={group.id}
        className="relative"
        onMouseEnter={() => handleMouseEnter(group.id)}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          aria-expanded={isGroupOpen}
          aria-haspopup="true"
          onClick={() => setOpenDropdown(isGroupOpen ? null : group.id)}
          className={`relative inline-flex items-center gap-1 min-h-[44px] text-[13px] font-medium transition-colors pb-1 pt-1 whitespace-nowrap cursor-pointer ${
            active
              ? 'text-[#0C2340] font-bold'
              : 'text-[#475569] hover:text-[#0C2340]'
          }`}
        >
          <span>{group.label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              isGroupOpen ? 'rotate-180 text-[#0C2340]' : 'text-slate-400'
            }`}
          />
          {active && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute bottom-1 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
            />
          )}
        </button>

        <AnimatePresence>
          {isGroupOpen && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              role="menu"
              className="absolute left-0 top-full pt-1.5 w-64 z-50"
            >
              <div className="bg-white rounded-xl shadow-lg border border-slate-200/90 p-2 space-y-1">
                {group.items.map((item) => {
                  const itemActive = isRouteMatch(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setDropdownState(null)}
                      className={`block rounded-lg px-3 py-2.5 min-h-[44px] transition-colors ${
                        itemActive
                          ? 'bg-slate-100 text-[#0C2340]'
                          : 'hover:bg-slate-50 text-[#0C2340]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[13px] ${itemActive ? 'font-bold' : 'font-semibold'}`}>
                          {item.label}
                        </span>
                        {itemActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C2340] rounded-md min-h-[44px]"
          >
            <Image
              src="/images/logo-ika-ums.png"
              alt="Logo IKA UMS Wilayah Jabodetabek"
              width={165}
              height={50}
              priority
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            ref={navContainerRef}
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-6"
          >
            <Link
              href="/"
              className={`relative inline-flex items-center min-h-[44px] text-[13px] transition-colors pb-1 pt-1 whitespace-nowrap shrink-0 ${
                pathname === '/'
                  ? 'text-[#0C2340] font-bold'
                  : 'text-[#475569] hover:text-[#0C2340] font-medium'
              }`}
            >
              <span>Beranda</span>
              {pathname === '/' && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute bottom-1 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
                />
              )}
            </Link>

            <Link
              href="/direktori"
              className={`relative inline-flex items-center min-h-[44px] text-[13px] transition-colors pb-1 pt-1 whitespace-nowrap shrink-0 ${
                isRouteMatch('/direktori')
                  ? 'text-[#0C2340] font-bold'
                  : 'text-[#475569] hover:text-[#0C2340] font-medium'
              }`}
            >
              <span>Jaringan</span>
              {isRouteMatch('/direktori') && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute bottom-1 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
                />
              )}
            </Link>

            <Link
              href="/kegiatan"
              className={`relative inline-flex items-center min-h-[44px] text-[13px] transition-colors pb-1 pt-1 whitespace-nowrap shrink-0 ${
                isRouteMatch('/kegiatan')
                  ? 'text-[#0C2340] font-bold'
                  : 'text-[#475569] hover:text-[#0C2340] font-medium'
              }`}
            >
              <span>Kegiatan</span>
              {isRouteMatch('/kegiatan') && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute bottom-1 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
                />
              )}
            </Link>

            <Link
              href="/peluang"
              className={`relative inline-flex items-center min-h-[44px] text-[13px] transition-colors pb-1 pt-1 whitespace-nowrap shrink-0 ${
                isRouteMatch('/peluang')
                  ? 'text-[#0C2340] font-bold'
                  : 'text-[#475569] hover:text-[#0C2340] font-medium'
              }`}
            >
              <span>Karier</span>
              {isRouteMatch('/peluang') && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute bottom-1 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
                />
              )}
            </Link>

            {renderDropdownGroup(TENTANG_GROUP)}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <Link
              href="/masuk"
              className="inline-flex items-center min-h-[44px] text-[13px] font-semibold text-[#0C2340] px-4 py-2 hover:bg-[#0C2340]/5 transition-colors rounded-lg whitespace-nowrap"
            >
              Masuk
            </Link>
            <Link
              href="/gabung"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-[13px] font-semibold text-white bg-[#0C2340] hover:bg-[#16325C] px-4 py-2 transition-all shadow-xs rounded-lg group whitespace-nowrap"
            >
              <span>Bergabung di IKA UMS</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile & Tablet Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/gabung"
              className="inline-flex items-center justify-center min-h-[44px] text-xs font-semibold text-white bg-[#0C2340] hover:bg-[#16325C] px-3.5 py-2 rounded-lg whitespace-nowrap"
            >
              Gabung
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#0C2340] hover:bg-slate-100 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C2340] cursor-pointer"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-md overflow-hidden"
          >
            <nav className="space-y-3">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                  pathname === '/'
                    ? 'bg-slate-100 border-slate-300 text-[#0C2340] font-bold'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 font-medium'
                }`}
              >
                <span>Beranda</span>
                {pathname === '/' && (
                  <span className="text-xs font-semibold text-[#B45309]">Aktif</span>
                )}
              </Link>
              <Link
                href="/peta"
                onClick={() => setIsOpen(false)}
                className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                  pathname === '/peta'
                    ? 'bg-slate-100 border-slate-300 text-[#0C2340] font-bold'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 font-medium'
                }`}
              >
                <span>Sebaran Wilayah (Peta)</span>
                {pathname === '/peta' && (
                  <span className="text-xs font-semibold text-[#B45309]">Aktif</span>
                )}
              </Link>
              <Link
                href="/direktori"
                onClick={() => setIsOpen(false)}
                className="min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 font-medium text-sm"
              >
                <span>Jaringan Alumni</span>
              </Link>
              <Link
                href="/kegiatan"
                onClick={() => setIsOpen(false)}
                className="min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 font-medium text-sm"
              >
                <span>Kegiatan</span>
              </Link>
              <Link
                href="/peluang"
                onClick={() => setIsOpen(false)}
                className="min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 font-medium text-sm"
              >
                <span>Karier &amp; Peluang</span>
              </Link>
              <Link
                href="/tentang"
                onClick={() => setIsOpen(false)}
                className="min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 font-medium text-sm"
              >
                <span>Tentang Komunitas</span>
              </Link>
              <Link
                href="/kepengurusan"
                onClick={() => setIsOpen(false)}
                className="min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 font-medium text-sm"
              >
                <span>Pengurus Wilayah</span>
              </Link>

              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2.5">
                <Link
                  href="/masuk"
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] flex items-center justify-center text-center py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg transition-colors"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/gabung"
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] flex items-center justify-center text-center py-2.5 px-3 bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Bergabung
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0C2340] text-white font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Kolom 1: Brand & Medsos */}
          <div className="md:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] rounded-md"
            >
              <Image
                src="/images/logo-white-text.png"
                alt="Logo Ikatan Alumni UMS"
                width={165}
                height={64}
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-sm">
              Jaringan alumni Universitas Muhammadiyah Surakarta di Jakarta, Bogor, Depok,
              Tangerang, dan Bekasi.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-slate-300">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram IKA UMS"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-[#D97706] hover:text-white transition-colors"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn IKA UMS"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-[#D97706] hover:text-white transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube IKA UMS"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-[#D97706] hover:text-white transition-colors"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Jelajahi */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Jelajahi
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-[#F59E0B] transition-colors inline-block py-0.5">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/direktori" className="hover:text-[#F59E0B] transition-colors inline-block py-0.5">
                  Jaringan Alumni
                </Link>
              </li>
              <li>
                <Link href="/kegiatan" className="hover:text-[#F59E0B] transition-colors inline-block py-0.5">
                  Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/peluang" className="hover:text-[#F59E0B] transition-colors inline-block py-0.5">
                  Karier &amp; Peluang
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Komunitas */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Komunitas
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/tentang" className="hover:text-[#F59E0B] transition-colors inline-block py-0.5">
                  Tentang IKA UMS
                </Link>
              </li>
              <li>
                <Link href="/kepengurusan" className="hover:text-[#F59E0B] transition-colors inline-block py-0.5">
                  Pengurus Wilayah
                </Link>
              </li>
              <li>
                <Link href="/kepengurusan#kontak" className="hover:text-[#F59E0B] transition-colors inline-block py-0.5">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#F59E0B] transition-colors inline-block py-0.5">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Mari Terhubung (Card Panel) */}
          <div className="md:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-[#112F55] p-5 sm:p-6 space-y-3 shadow-md">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Mari Terhubung
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Jadilah bagian dari jaringan alumni UMS di Jabodetabek.
              </p>
              <div className="pt-1">
                <Link
                  href="/gabung"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#E59838] hover:bg-[#D97706] text-[#0C2340] text-sm font-bold transition-all shadow-xs"
                >
                  Bergabung Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs sm:text-sm text-slate-400">
          <span>
            &copy; 2026 IKA UMS Wilayah Jabodetabek. Universitas Muhammadiyah Surakarta.
          </span>
          <span className="text-slate-300 font-medium">
            Satu Almamater, Terus Terhubung.
          </span>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, ArrowRight, ChevronDown, ExternalLink } from 'lucide-react';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS } from '@/lib/config';

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

const JARINGAN_GROUP: NavGroup = {
  id: 'jaringan',
  label: 'Jaringan',
  items: [
    {
      label: 'Daftar Anggota',
      href: '/direktori',
      description: 'Cari rekan prodi, angkatan, & wilayah (khusus anggota)',
    },
    {
      label: 'Sebaran Wilayah',
      href: '/peta',
      description: 'Cakupan 9 kota & kabupaten di Jabodetabek',
    },
    {
      label: 'Mentoring & Kerja',
      href: '/peluang',
      description: 'Mentoring Alumni serta Info Kerja & Usaha',
    },
  ],
};

const TENTANG_GROUP: NavGroup = {
  id: 'tentang',
  label: 'Tentang',
  items: [
    {
      label: 'Tentang Komunitas',
      href: '/tentang',
      description: 'Tujuan & koordinasi dengan PP IKA UMS Pusat',
    },
    {
      label: 'Pengurus & Kontak',
      href: '/kepengurusan',
      description: 'Pengurus harian, bidang kerja, & korwil',
    },
    ...(IS_DEMO_MODE
      ? [
          {
            label: 'Cerita Alumni',
            href: '/cerita',
            description: 'Contoh kisah dan kiprah sesama alumni',
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

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownState(null);
        setMobileOpenPath(null);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleMouseEnterGroup = (menu: 'jaringan' | 'tentang') => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(menu);
  };

  const handleMouseLeaveGroup = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setDropdownState(null);
    }, 120);
  };

  const isRouteMatch = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const isHome = pathname === '/';

  const renderDropdownGroup = (group: NavGroup) => {
    const isGroupActive = group.items.some((item) => isRouteMatch(item.href));
    const isDropdownOpen = openDropdown === group.id;

    return (
      <div
        key={group.id}
        className="relative"
        onMouseEnter={() => handleMouseEnterGroup(group.id)}
        onMouseLeave={handleMouseLeaveGroup}
      >
        <button
          type="button"
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          onClick={() => setOpenDropdown(isDropdownOpen ? null : group.id)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenDropdown(true as unknown as 'jaringan' ? group.id : null);
            }
          }}
          className={`relative inline-flex items-center gap-1 min-h-[44px] text-[13px] transition-colors pb-1 pt-1 whitespace-nowrap shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0C2340] rounded-md ${
            isGroupActive || isDropdownOpen
              ? 'text-[#0C2340] font-bold'
              : 'text-[#475569] hover:text-[#0C2340] font-medium'
          }`}
        >
          <span>{group.label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              isDropdownOpen ? 'rotate-180 text-[#0C2340]' : 'text-[#475569]'
            }`}
          />
          {isGroupActive && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute bottom-1 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
            />
          )}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              role="menu"
              aria-label={`Submenu ${group.label}`}
              className="absolute left-0 top-full pt-2 z-50 w-72"
            >
              <div className="bg-white border border-[#0C2340]/12 rounded-xl shadow-[0_16px_36px_-12px_rgba(12,35,64,0.16)] p-2 space-y-0.5">
                {group.items.map((item) => {
                  const active = isRouteMatch(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setDropdownState(null)}
                      className={`block rounded-lg px-3 py-2.5 min-h-[44px] transition-colors ${
                        active
                          ? 'bg-slate-100 text-[#0C2340]'
                          : 'hover:bg-slate-50 text-[#0C2340]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[13px] ${active ? 'font-bold' : 'font-semibold'}`}>
                          {item.label}
                        </span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#92400E] shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      <span className="block text-sm text-[#475569] mt-0.5 leading-snug">
                        {item.description}
                      </span>
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-[72px] gap-4">
          {/* Brand Lockup IKA UMS Jabodetabek */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 min-h-[44px]">
            <Image
              src="/images/logo-emblem.png"
              alt="Logo Ikatan Alumni UMS"
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-[17px] font-extrabold tracking-[-0.03em] text-[#0C2340] leading-none">
                IKA UMS
              </span>
              <span className="mt-1 hidden text-xs font-semibold tracking-[0.06em] text-[#B45309] uppercase leading-none min-[420px]:block">
                Wilayah Jabodetabek
              </span>
              <span className="mt-1 text-xs font-semibold tracking-[0.06em] text-[#B45309] uppercase leading-none min-[420px]:hidden">
                Jabodetabek
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            ref={navContainerRef}
            className="hidden lg:flex items-center gap-7 xl:gap-8 shrink-0"
            aria-label="Navigasi utama"
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

            {renderDropdownGroup(JARINGAN_GROUP)}

            <Link
              href="/kegiatan"
              className={`relative inline-flex items-center min-h-[44px] text-[13px] transition-colors pb-1 pt-1 whitespace-nowrap shrink-0 ${
                isRouteMatch('/kegiatan')
                  ? 'text-[#0C2340] font-bold'
                  : 'text-[#475569] hover:text-[#0C2340] font-medium'
              }`}
            >
              <span>Jadwal Kopdar</span>
              {isRouteMatch('/kegiatan') && (
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
              href={isHome ? '#kopdar' : '/gabung'}
              className="inline-flex items-center gap-1.5 min-h-[44px] text-[13px] font-semibold text-white bg-[#0C2340] hover:bg-[#16325C] px-4 py-2 transition-all shadow-xs rounded-lg group whitespace-nowrap"
            >
              <span>{isHome ? 'Kirim minat kopdar' : 'Daftar jadi anggota'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile & Tablet Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={isHome ? '#kopdar' : '/gabung'}
              className="inline-flex items-center justify-center min-h-[44px] text-xs font-semibold text-white bg-[#0C2340] hover:bg-[#16325C] px-3.5 py-2 rounded-lg whitespace-nowrap"
            >
              {isHome ? 'Minat kopdar' : 'Daftar'}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#0C2340] hover:bg-[#0C2340]/5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C2340] cursor-pointer"
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-b border-slate-200 bg-white overflow-hidden shadow-xl"
          >
            <nav aria-label="Menu navigasi seluler" className="px-4 sm:px-6 py-5 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* Grup Jaringan & Kegiatan */}
              <div className="space-y-1.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#B45309] px-1">
                  Jaringan &amp; Kegiatan
                </span>
                <div className="space-y-1">
                  {[
                    { href: '/', label: 'Beranda', active: pathname === '/' },
                    { href: '/kegiatan', label: 'Jadwal Kopdar', active: isRouteMatch('/kegiatan') },
                    { href: '/peta', label: 'Sebaran Wilayah (Peta)', active: isRouteMatch('/peta') },
                    { href: '/direktori', label: 'Daftar Anggota', active: isRouteMatch('/direktori') },
                    { href: '/peluang', label: 'Mentoring & Kerja', active: isRouteMatch('/peluang') },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                        item.active
                          ? 'bg-slate-100 border-slate-300 text-[#0C2340] font-bold'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.active && (
                        <span className="text-xs font-semibold text-[#B45309]">Aktif</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Grup Tentang & Kontak */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#B45309] px-1">
                  Tentang Komunitas
                </span>
                <div className="space-y-1">
                  {[
                    { href: '/tentang', label: 'Tentang Komunitas', active: isRouteMatch('/tentang') },
                    { href: '/kepengurusan', label: 'Pengurus & Kontak', active: isRouteMatch('/kepengurusan') },
                    ...(IS_DEMO_MODE
                      ? [{ href: '/cerita', label: 'Cerita Alumni', active: isRouteMatch('/cerita') }]
                      : []),
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                        item.active
                          ? 'bg-slate-100 border-slate-300 text-[#0C2340] font-bold'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.active && (
                        <span className="text-xs font-semibold text-[#B45309]">Aktif</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tombol Aksi Bawah */}
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
                  Daftar Anggota
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
    <footer className="bg-[#0C2340] text-white font-sans border-t-2 border-[#D97706]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-6 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] rounded-md"
            >
              <Image
                src="/images/logo-white-text.png"
                alt="Logo Ikatan Alumni UMS"
                width={165}
                height={64}
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-base text-slate-200 max-w-md leading-[1.6]">
              Jaringan alumni Universitas Muhammadiyah Surakarta yang tinggal dan bekerja di Jakarta,
              Bogor, Depok, Tangerang, dan Bekasi.
            </p>
            <div className="text-sm text-slate-300 max-w-md space-y-2 leading-relaxed">
              <div>{COMMUNITY_PLACEHOLDERS.ppIkaUmsStatus}.</div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                <Link
                  href="/kepengurusan"
                  className="inline-flex items-center min-h-[44px] text-[#F59E0B] hover:text-white underline underline-offset-4 transition-colors font-medium"
                >
                  Pengurus &amp; Sekretariat
                </Link>
                <a
                  href={COMMUNITY_PLACEHOLDERS.ppIkaUmsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 min-h-[44px] text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Situs Resmi UMS
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 gap-6 sm:gap-8">
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 border-b border-white/10 pb-2">
                Komunitas
              </h2>
              <ul className="space-y-0.5 text-sm sm:text-base text-slate-300">
                <li>
                  <Link href="/" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/kegiatan" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Jadwal Kopdar
                  </Link>
                </li>
                <li>
                  <Link href="/peluang" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Mentoring &amp; Kerja
                  </Link>
                </li>
                <li>
                  <Link href="/peta" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Sebaran Wilayah
                  </Link>
                </li>
                <li>
                  <Link href="/direktori" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Daftar Anggota
                  </Link>
                </li>
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 border-b border-white/10 pb-2">
                Informasi &amp; Privasi
              </h2>
              <ul className="space-y-0.5 text-sm sm:text-base text-slate-300">
                <li>
                  <Link href="/tentang" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Tentang Komunitas
                  </Link>
                </li>
                <li>
                  <Link href="/kepengurusan" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Pengurus &amp; Kontak
                  </Link>
                </li>
                <li>
                  <Link href="/privasi" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/syarat" className="inline-flex items-center min-h-[44px] hover:text-[#F59E0B] transition-colors">
                    Ketentuan Komunitas
                  </Link>
                </li>
                <li>
                  <Link href="/gabung" className="inline-flex items-center min-h-[44px] hover:text-white transition-colors font-semibold text-[#F59E0B]">
                    Daftar jadi anggota
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-slate-400">
          <span>
            &copy; 2026 IKA UMS Wilayah Jabodetabek · Komunitas Alumni Universitas Muhammadiyah Surakarta.
          </span>
          <span className="text-slate-400">
            Tahap Prapeluncuran Jabodetabek
          </span>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';

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
      label: 'Direktori Alumni',
      href: '/direktori',
      description: 'Cari teman satu prodi, angkatan, & bidang',
    },
    {
      label: 'Peta Wilayah',
      href: '/peta',
      description: 'Sebaran alumni di 9 wilayah Jabodetabek',
    },
    {
      label: 'Mentoring & Peluang',
      href: '/peluang',
      description: 'Diskusi karier, lowongan, & usaha alumni',
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
      description: 'Sejarah, tujuan, & prinsip pengelolaan',
    },
    {
      label: 'Kepengurusan',
      href: '/kepengurusan',
      description: 'Pengurus harian, bidang kerja, & korwil',
    },
    {
      label: 'Cerita Alumni',
      href: '/cerita',
      description: 'Kisah perantauan & kiprah alumni UMS',
    },
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
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnterGroup = (groupId: 'jaringan' | 'tentang') => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(groupId);
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
          className={`relative inline-flex items-center gap-1 text-[13px] transition-colors pb-1.5 pt-1 whitespace-nowrap shrink-0 cursor-pointer ${
            isGroupActive || isDropdownOpen
              ? 'text-[#0C2340] font-bold'
              : 'text-[#475569] hover:text-[#0C2340] font-medium'
          }`}
        >
          <span>{group.label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              isDropdownOpen ? 'rotate-180 text-[#0C2340]' : 'text-[#64748B]'
            }`}
          />
          {isGroupActive && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
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
                      className={`block rounded-lg px-3 py-2.5 transition-colors ${
                        active
                          ? 'bg-[#F3F1EA] text-[#0C2340]'
                          : 'hover:bg-[#FDFCF7] text-[#0C2340]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[13px] ${active ? 'font-bold' : 'font-semibold'}`}>
                          {item.label}
                        </span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">
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

          {/* Desktop Navigation Links — ringkas dengan droplist */}
          <nav
            ref={navContainerRef}
            className="hidden lg:flex items-center gap-7 xl:gap-8 shrink-0"
            aria-label="Navigasi utama"
          >
            <Link
              href="/"
              className={`relative text-[13px] transition-colors pb-1.5 pt-1 whitespace-nowrap shrink-0 ${
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
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
                />
              )}
            </Link>

            {renderDropdownGroup(JARINGAN_GROUP)}

            <Link
              href="/kegiatan"
              className={`relative text-[13px] transition-colors pb-1.5 pt-1 whitespace-nowrap shrink-0 ${
                isRouteMatch('/kegiatan')
                  ? 'text-[#0C2340] font-bold'
                  : 'text-[#475569] hover:text-[#0C2340] font-medium'
              }`}
            >
              <span>Agenda</span>
              {isRouteMatch('/kegiatan') && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : 'navbarActiveIndicator'}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0C2340] rounded-full"
                />
              )}
            </Link>

            {renderDropdownGroup(TENTANG_GROUP)}
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
            <div className="px-4 sm:px-6 py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-colors ${
                    pathname === '/'
                      ? 'bg-[#0C2340] border-[#0C2340] text-white font-bold'
                      : 'bg-[#F3F1EA]/70 border-[#0C2340]/10 text-[#0C2340] hover:bg-[#F3F1EA] font-semibold'
                  }`}
                >
                  Beranda
                </Link>
                <Link
                  href="/kegiatan"
                  onClick={() => setIsOpen(false)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-colors ${
                    isRouteMatch('/kegiatan')
                      ? 'bg-[#0C2340] border-[#0C2340] text-white font-bold'
                      : 'bg-[#F3F1EA]/70 border-[#0C2340]/10 text-[#0C2340] hover:bg-[#F3F1EA] font-semibold'
                  }`}
                >
                  Agenda
                </Link>
              </div>

              <div className="pt-2 border-t border-[#0C2340]/8 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  {JARINGAN_GROUP.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {JARINGAN_GROUP.items.map((item, idx) => {
                    const active = isRouteMatch(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`py-2.5 px-3 rounded-xl border transition-colors ${
                          idx === 2 ? 'col-span-2' : ''
                        } ${
                          active
                            ? 'bg-[#0C2340]/10 border-[#0C2340]/25 text-[#0C2340] font-bold'
                            : 'bg-white border-[#0C2340]/10 text-[#334155] hover:border-[#0C2340]/30 hover:text-[#0C2340] font-medium'
                        }`}
                      >
                        <span className="block text-[13px]">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-[#0C2340]/8 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  {TENTANG_GROUP.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TENTANG_GROUP.items.map((item, idx) => {
                    const active = isRouteMatch(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`py-2.5 px-3 rounded-xl border transition-colors ${
                          idx === 2 ? 'col-span-2' : ''
                        } ${
                          active
                            ? 'bg-[#0C2340]/10 border-[#0C2340]/25 text-[#0C2340] font-bold'
                            : 'bg-white border-[#0C2340]/10 text-[#334155] hover:border-[#0C2340]/30 hover:text-[#0C2340] font-medium'
                        }`}
                      >
                        <span className="block text-[13px]">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          
          <div className="md:col-span-6 space-y-3 sm:space-y-4">
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

          <div className="md:col-span-6 grid grid-cols-2 gap-6 sm:gap-8">
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 sm:mb-4 border-b border-white/10 pb-2">
                Jelajahi Komunitas
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-white/75">
                <li><Link href="/" className="hover:text-[#F59E0B] transition-colors">Beranda</Link></li>
                <li><Link href="/direktori" className="hover:text-[#F59E0B] transition-colors">Direktori Alumni</Link></li>
                <li><Link href="/peta" className="hover:text-[#F59E0B] transition-colors">Peta Sebaran Wilayah</Link></li>
                <li><Link href="/kegiatan" className="hover:text-[#F59E0B] transition-colors">Agenda Kumpul</Link></li>
                <li><Link href="/peluang" className="hover:text-[#F59E0B] transition-colors">Mentoring &amp; Peluang</Link></li>
                <li><Link href="/cerita" className="hover:text-[#F59E0B] transition-colors">Cerita Alumni</Link></li>
              </ul>
            </div>

            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 sm:mb-4 border-b border-white/10 pb-2">
                Tata Kelola &amp; Anggota
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-white/75">
                <li><Link href="/tentang" className="hover:text-[#F59E0B] transition-colors">Tentang Inisiatif</Link></li>
                <li><Link href="/kepengurusan" className="hover:text-[#F59E0B] transition-colors">Struktur Kepengurusan</Link></li>
                <li><Link href="/privasi" className="hover:text-[#F59E0B] transition-colors">Kebijakan Privasi</Link></li>
                <li><Link href="/syarat" className="hover:text-[#F59E0B] transition-colors">Ketentuan Komunitas</Link></li>
                <li><Link href="/app" className="hover:text-[#F59E0B] transition-colors">Area Anggota</Link></li>
                <li><Link href="/admin" className="hover:text-[#F59E0B] transition-colors">Panel Pengurus</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-2 sm:gap-4 text-center sm:text-left">
          <p>© 2026 IKA UMS Wilayah Jabodetabek · Jaringan Alumni Universitas Muhammadiyah Surakarta.</p>
          <p>Universitas Muhammadiyah Surakarta · DKI Jakarta, Banten &amp; Jawa Barat</p>
        </div>
      </div>
    </footer>
  );
}

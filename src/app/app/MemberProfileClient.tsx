'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { DEMO_BADGE_LABEL } from '@/lib/config';
import { ArrowRight, Bell, Briefcase, CalendarDays, CheckCircle2, ChevronRight, CircleUserRound, MapPin, ShieldCheck, UsersRound } from 'lucide-react';

const activityItems = [
  { title: 'Profil anggota siap digunakan', detail: 'Perbarui informasi kerja dan domisili agar jaringanmu lebih relevan.', icon: CircleUserRound },
  { title: 'Direktori anggota menanti persetujuanmu', detail: 'Pilih apakah profilmu boleh ditemukan oleh sesama alumni.', icon: UsersRound },
];

export default function MemberProfileClient() {
  const [tampilDiDirektori, setTampilDiDirektori] = useState(false);
  const [terbukaMentoring, setTerbukaMentoring] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />
      <main className="flex-grow page-grain-base w-full">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12 space-y-7 sm:space-y-9">
          <section className="overflow-hidden rounded-[1.75rem] bg-[#0C2340] text-white shadow-[0_18px_45px_-28px_rgba(12,35,64,0.7)]">
            <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-semibold"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" aria-hidden="true" />Ruang anggota</span>
                  <span className="rounded-full bg-[#F59E0B]/20 px-3 py-1.5 font-semibold text-[#FDE5B2]">{DEMO_BADGE_LABEL}</span>
                </div>
                <div className="mt-7 max-w-2xl">
                  <p className="text-[#FDE5B2] text-sm font-semibold">Selamat datang kembali, Rizal</p>
                  <h1 className="mt-2 text-3xl sm:text-4xl lg:text-[2.7rem] leading-[1.08] tracking-[-0.04em] font-bold">Jaringan alumni, lebih dekat dengan langkahmu.</h1>
                  <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-white/75">Kelola kehadiran, perluas koneksi, dan buka ruang berbagi pengalaman bersama alumni UMS di Jabodetabek.</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/kegiatan" className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-sm font-bold text-[#0C2340] transition-colors hover:bg-[#FBBF24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Lihat kegiatan<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                  <Link href="/direktori" className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Cari alumni</Link>
                </div>
              </div>
              <div className="relative border-t border-white/15 bg-[#08182E] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,_#F59E0B_1px,_transparent_0)] [background-size:18px_18px]" aria-hidden="true" />
                <div className="relative"><p className="text-sm font-semibold text-[#FDE5B2]">Agenda terdekat</p><div className="mt-4 rounded-2xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F59E0B] text-[#0C2340]"><span className="text-[10px] font-bold leading-none">NOV</span><span className="mt-0.5 text-lg font-extrabold leading-none">28</span></div><div><h2 className="font-bold leading-snug">Kopdar Jabodetabek</h2><p className="mt-1 text-sm leading-relaxed text-white/70">Sabtu, 10.00 WIB · Jakarta Selatan</p></div></div><Link href="/kegiatan" className="mt-5 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-[#FDE5B2] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Lihat detail agenda <ChevronRight className="h-4 w-4" aria-hidden="true" /></Link></div></div>
              </div>
            </div>
          </section>

          {savedNotice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" /><span>{savedNotice}</span></div>}

          <section aria-labelledby="summary-title" className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-card rounded-2xl p-5 sm:p-6 lg:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#92400E]">Profil Saya</p><h2 id="summary-title" className="mt-1 text-xl font-bold tracking-[-0.02em]">Rizal Hakim</h2></div><div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#0C2340]/15 bg-[#F3F1EA]"><Image src="/images/avatar-rizal.jpg" alt="Foto contoh profil alumni" fill sizes="56px" className="object-cover" /></div></div><div className="mt-5 grid gap-3 border-y border-[#0C2340]/10 py-4 text-sm sm:grid-cols-2"><span className="flex items-center gap-2 text-[#475569]"><Briefcase className="h-4 w-4 text-[#92400E]" />Engineering Manager · TI ’11</span><span className="flex items-center gap-2 text-[#475569]"><MapPin className="h-4 w-4 text-[#92400E]" />Jakarta Selatan</span></div><Link href="/direktori" className="mt-5 inline-flex min-h-[40px] items-center gap-1 text-sm font-bold text-[#0C2340] underline decoration-[#F59E0B] decoration-2 underline-offset-4 hover:text-[#92400E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0C2340]">Lihat profil publik <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            <div className="rounded-2xl border border-[#0C2340]/12 bg-[#F3F1EA] p-5 sm:p-6 lg:p-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#92400E] shadow-sm"><Bell className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-[#92400E]">Untuk kamu</p><h2 className="text-xl font-bold tracking-[-0.02em]">Aktivitas kamu</h2></div></div><div className="mt-5 space-y-3">{activityItems.map(({ title, detail, icon: Icon }) => <div key={title} className="flex gap-3 rounded-xl bg-white/80 p-3.5"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#92400E]" aria-hidden="true" /><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-[#475569]">{detail}</p></div></div>)}</div></div>
          </section>

          <section aria-labelledby="quick-access-title" className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-card rounded-2xl p-5 sm:p-6 lg:p-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0C2340] text-white"><CalendarDays className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-[#92400E]">Mulai dari sini</p><h2 id="quick-access-title" className="text-xl font-bold tracking-[-0.02em]">Akses cepat</h2></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Link href="/kegiatan" className="group rounded-xl border border-[#0C2340]/12 bg-[#FDFCF7] p-4 transition-colors hover:border-[#0C2340]/35 hover:bg-[#F3F1EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]"><span className="block text-sm font-bold">Jadwal kopdar</span><span className="mt-1 block text-sm text-[#475569]">Temukan pertemuan terdekat.</span><ArrowRight className="mt-3 h-4 w-4 text-[#92400E] transition-transform group-hover:translate-x-1" /></Link><Link href="/peluang" className="group rounded-xl border border-[#0C2340]/12 bg-[#FDFCF7] p-4 transition-colors hover:border-[#0C2340]/35 hover:bg-[#F3F1EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]"><span className="block text-sm font-bold">Mentoring & kerja</span><span className="mt-1 block text-sm text-[#475569]">Bagikan atau temukan peluang.</span><ArrowRight className="mt-3 h-4 w-4 text-[#92400E] transition-transform group-hover:translate-x-1" /></Link></div></div>
            <section aria-labelledby="privacy-title" className="surface-card rounded-2xl p-5 sm:p-6 lg:p-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDE5B2] text-[#92400E]"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-[#92400E]">Pengaturan Privasi Tampilan</p><h2 id="privacy-title" className="text-xl font-bold tracking-[-0.02em]">Atur visibilitasmu</h2></div></div><div className="mt-5 divide-y divide-[#0C2340]/10"><label htmlFor="pref-direktori" className="flex cursor-pointer items-start justify-between gap-4 py-3 first:pt-0"><span><span className="block text-sm font-bold">Tampilkan di Daftar Anggota</span><span className="mt-1 block text-sm leading-relaxed text-[#475569]">Hanya anggota yang masuk dapat melihat profilmu.</span></span><input id="pref-direktori" type="checkbox" checked={tampilDiDirektori} onChange={(event) => { setTampilDiDirektori(event.target.checked); setSavedNotice('Preferensi tampilan Daftar Anggota diperbarui (simulasi).'); }} className="mt-1 h-5 w-5 shrink-0 accent-[#0C2340]" /></label><label htmlFor="pref-mentoring" className="flex cursor-pointer items-start justify-between gap-4 pt-4"><span><span className="block text-sm font-bold">Bersedia Jadi Mentor Alumni</span><span className="mt-1 block text-sm leading-relaxed text-[#475569]">Tandai kesiapanmu berbagi pengalaman karier.</span></span><input id="pref-mentoring" type="checkbox" checked={terbukaMentoring} onChange={(event) => { setTerbukaMentoring(event.target.checked); setSavedNotice('Preferensi kesediaan mentoring diperbarui (simulasi).'); }} className="mt-1 h-5 w-5 shrink-0 accent-[#0C2340]" /></label></div></section>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

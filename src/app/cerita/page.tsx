'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { PatternSection } from '@/components/PatternSection';
import type { BeritaItem } from '@/lib/cms-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowRight, BookOpen, Calendar, MapPin, User, Camera, Sparkles } from 'lucide-react';

const FALLBACK_BERITAS: BeritaItem[] = [
  {
    id: 'berita-kopdar-perdana-2026',
    judul: 'Kopdar Perdana IKA UMS Jabodetabek Sukses Digelar di Jakarta',
    slug: 'kopdar-perdana-ika-ums-jabodetabek-2026',
    kategori: 'Kopdar & Temu Alumni',
    tanggal: '15 Februari 2026',
    wilayah: 'Jakarta Pusat',
    ringkasan:
      'Silaturahmi tatap muka perdana alumni Universitas Muhammadiyah Surakarta di Jabodetabek berlangsung hangat, mempererat kebersamaan lintas fakultas dan angkatan.',
    konten:
      'Alumni Universitas Muhammadiyah Surakarta (UMS) yang berdomisili dan berkarier di wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi sukses menyelenggarakan pertemuan tatap muka (Kopdar) perdana.\n\nKegiatan ini dihadiri oleh puluhan alumni lintas fakultas mulai dari Teknik, Ekonomi, Hukum, Farmasi, FKIP, Psikologi, Agama Islam, Geografi, hingga FKI dari angkatan senior hingga lulusan muda.\n\nDalam temu perdana ini, para alumni bersepakat memperkuat simpul komunikasi di 9 wilayah Jabodetabek, menyusun program pendampingan karier bagi lulusan baru, serta memperkuat sinergi profesional sesama alumni di perantauan.',
    fotoUrl: '/images/hero-kumpul-bolo-pisah.jpg',
    captionFoto: 'Kebersamaan alumni UMS lintas angkatan saat gelaran kopdar perdana di Jakarta.',
    penulis: 'Humas IKA UMS Jabodetabek',
    published: true,
    createdAt: '2026-02-15T10:00:00.000Z',
  },
];

export default function CeritaPage() {
  const [beritas, setBeritas] = useState<BeritaItem[]>(FALLBACK_BERITAS);
  const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed && Array.isArray(data.beritas) && data.beritas.length > 0) {
            setBeritas(data.beritas);
          }
        }
      } catch {
        // Fallback default beritas
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    void fetchContent();
    return () => {
      isSubscribed = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    beritas.forEach((b) => {
      if (b.kategori) set.add(b.kategori);
    });
    return ['Semua', ...Array.from(set)];
  }, [beritas]);

  const filteredBeritas = useMemo(() => {
    if (activeCategory === 'Semua') return beritas;
    return beritas.filter((b) => b.kategori === activeCategory);
  }, [beritas, activeCategory]);

  const featured = filteredBeritas[0] || null;
  const secondaryList = filteredBeritas.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full">
        <PatternSection
          as="section"
          variant="dots"
          tone="tint"
          fade="right-focus"
          patternOpacity={0.05}
          patternSize="24px"
          className="border-b border-slate-200"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-8 md:pb-10"
        >
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#475569] mb-4">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-semibold">Dokumentasi &amp; Berita</span>
          </nav>

          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#92400E] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Keluarga Alumni UMS Jabodetabek
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
              Dokumentasi &amp; Kabar Alumni
            </h1>
            <p className="text-base text-[#475569] max-w-2xl leading-[1.6]">
              Liputan pertemuan kopdar, perjalanan karier, aksi sosial, dan kabar kebersamaan alumni UMS di Jabodetabek.
            </p>
          </header>

          {/* Kategori Filter Tabs */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center gap-2 pt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#0C2340] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </PatternSection>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full relative z-[1]">
          {isLoading ? (
            <div className="surface-card rounded-2xl p-12 text-center text-slate-500">
              <div className="animate-pulse space-y-3">
                <div className="h-6 w-48 bg-slate-200 rounded mx-auto" />
                <div className="h-4 w-64 bg-slate-100 rounded mx-auto" />
              </div>
            </div>
          ) : !featured ? (
            <section className="surface-card rounded-2xl p-8 sm:p-12 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h2 className="text-xl font-bold text-[#0C2340]">Belum Ada Dokumentasi di Kategori Ini</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Silakan pilih kategori lain atau kembali ke beranda untuk melihat kabar terbaru.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('Semua')}
                className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#16325C]"
              >
                Tampilkan Semua Kategori
              </button>
            </section>
          ) : (
            <>
              {/* Featured Article */}
              <article className="surface-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 mb-10 border border-slate-200 shadow-xs">
                <div className="lg:col-span-6 aspect-[16/10] lg:aspect-auto relative bg-[#0C2340] overflow-hidden min-h-[280px]">
                  <Image
                    src={featured.fotoUrl || '/images/hero-kumpul-bolo-pisah.jpg'}
                    alt={featured.judul}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  {featured.captionFoto && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-[11px] text-white/90">
                      {featured.captionFoto}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-[#FEF3C7] text-[#92400E] font-bold px-2.5 py-0.5 rounded">
                        {featured.kategori}
                      </span>
                      {featured.wilayah && (
                        <span className="text-[#475569] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          {featured.wilayah}
                        </span>
                      )}
                      <span className="text-slate-400">•</span>
                      <span className="text-[#475569] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {featured.tanggal}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C2340] leading-tight">
                      {featured.judul}
                    </h2>

                    <p className="text-base text-slate-600 leading-relaxed">
                      {featured.ringkasan}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{featured.penulis || 'Humas IKA UMS'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedBerita(featured)}
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Baca Liputan Lengkap</span>
                      <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Secondary Grid */}
              {secondaryList.length > 0 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-[#0C2340]">Kabar Kegiatan Lainnya</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {secondaryList.map((berita) => (
                      <article
                        key={berita.id}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all"
                      >
                        <div>
                          <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden">
                            <Image
                              src={berita.fotoUrl || '/images/hero-kumpul-bolo-pisah.jpg'}
                              alt={berita.judul}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="inline-block rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-xs font-bold text-[#0C2340] shadow-2xs">
                                {berita.kategori}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar className="w-3.5 h-3.5 text-amber-600" />
                              <span>{berita.tanggal}</span>
                              {berita.wilayah && (
                                <>
                                  <span>•</span>
                                  <span>{berita.wilayah}</span>
                                </>
                              )}
                            </div>
                            <h4 className="text-base font-bold text-[#0C2340] leading-snug line-clamp-2">
                              {berita.judul}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                              {berita.ringkasan}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                          <span className="text-slate-500 font-medium">
                            {berita.penulis || 'Humas IKA UMS'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedBerita(berita)}
                            className="inline-flex items-center gap-1 font-bold text-[#0C2340] hover:text-amber-600 transition-colors cursor-pointer py-1"
                          >
                            <span>Baca selengkapnya</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Reader Modal Dialog */}
          <Dialog open={!!selectedBerita} onOpenChange={(open) => !open && setSelectedBerita(null)}>
            {selectedBerita && (
              <DialogContent className="bg-white border border-slate-200 rounded-2xl max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
                <DialogHeader className="space-y-2 border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5">
                      {selectedBerita.kategori}
                    </span>
                    {selectedBerita.wilayah && (
                      <span className="text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {selectedBerita.wilayah}
                      </span>
                    )}
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {selectedBerita.tanggal}
                    </span>
                  </div>

                  <DialogTitle className="text-xl sm:text-2xl font-extrabold text-[#0C2340] leading-snug">
                    {selectedBerita.judul}
                  </DialogTitle>

                  <DialogDescription className="text-xs text-slate-500">
                    Oleh: {selectedBerita.penulis || 'Pengurus IKA UMS Jabodetabek'}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 pt-3">
                  {selectedBerita.fotoUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[16/9] relative">
                      <Image
                        src={selectedBerita.fotoUrl}
                        alt={selectedBerita.judul}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                      />
                      {selectedBerita.captionFoto && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs p-2.5 text-xs text-white/95">
                          {selectedBerita.captionFoto}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-4 text-sm font-medium text-slate-800 leading-relaxed">
                    {selectedBerita.ringkasan}
                  </div>

                  <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedBerita.konten || selectedBerita.ringkasan}
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-amber-600" />
                      Dokumentasi Resmi IKA UMS Jabodetabek
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedBerita(null)}
                      className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}

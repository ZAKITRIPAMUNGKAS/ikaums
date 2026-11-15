'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { PatternSection } from '@/components/PatternSection';
import type { AgendaItem, BeritaItem } from '@/lib/cms-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Calendar, MapPin, ArrowRight, Camera, Sparkles, Building2 } from 'lucide-react';

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

export default function KegiatanPage() {
  const [activeMainTab, setActiveMainTab] = useState<'dokumentasi' | 'jadwal'>('dokumentasi');
  const [beritas, setBeritas] = useState<BeritaItem[]>(FALLBACK_BERITAS);
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed) {
            if (Array.isArray(data.beritas) && data.beritas.length > 0) {
              setBeritas(data.beritas);
            }
            if (Array.isArray(data.agendas)) {
              setAgendas(data.agendas);
            }
          }
        }
      } catch {
        // Fallback default
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    void fetchContent();
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full">
        <PatternSection
          as="section"
          variant="contour"
          tone="tint"
          fade="top-right"
          patternOpacity={0.075}
          patternSize="180px"
          className="border-b border-slate-200"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-8 md:pb-10"
        >
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#475569] mb-4">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-semibold">Kegiatan &amp; Dokumentasi</span>
          </nav>

          <header className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#92400E] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Kopdar &amp; Silaturahmi Alumni
            </div>
            <h1 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-extrabold tracking-[-0.02em] text-[#0C2340] leading-[1.15]">
              Dokumentasi &amp; Agenda Kegiatan
            </h1>
            <p className="text-base text-[#475569] leading-[1.6] max-w-2xl">
              Kopdar perdana alumni UMS di Jabodetabek telah resmi terlaksana. Simak dokumentasi liputan kegiatan dan pantau jadwal pertemuan berikutnya di sembilan wilayah.
            </p>
          </header>

          {/* Tab Utama: Dokumentasi vs Jadwal Mendatang */}
          <div className="flex items-center gap-2 pt-6">
            <button
              type="button"
              onClick={() => setActiveMainTab('dokumentasi')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeMainTab === 'dokumentasi'
                  ? 'bg-[#0C2340] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Dokumentasi Kegiatan</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeMainTab === 'dokumentasi' ? 'bg-amber-400 text-[#0C2340]' : 'bg-slate-100 text-slate-600'}`}>
                {beritas.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('jadwal')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeMainTab === 'jadwal'
                  ? 'bg-[#0C2340] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal Mendatang</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeMainTab === 'jadwal' ? 'bg-amber-400 text-[#0C2340]' : 'bg-slate-100 text-slate-600'}`}>
                {agendas.length}
              </span>
            </button>
          </div>
        </PatternSection>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full relative z-[1]">
          {isLoading ? (
            <div className="surface-card rounded-2xl p-12 text-center text-slate-500">
              <div className="animate-pulse space-y-3">
                <div className="h-6 w-48 bg-slate-200 rounded mx-auto" />
                <div className="h-4 w-64 bg-slate-100 rounded mx-auto" />
              </div>
            </div>
          ) : activeMainTab === 'dokumentasi' ? (
            /* TAB DOKUMENTASI KEGIATAN */
            <div className="space-y-8">
              {beritas.length === 0 ? (
                <div className="surface-card rounded-2xl p-10 text-center space-y-3">
                  <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                  <h2 className="text-xl font-bold text-[#0C2340]">Belum Ada Dokumentasi Kegiatan</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Dokumentasi kopdar dan kegiatan alumni yang diunggah pengurus akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {beritas.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden">
                          <Image
                            src={item.fotoUrl || '/images/hero-kumpul-bolo-pisah.jpg'}
                            alt={item.judul}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="inline-block rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-xs font-bold text-[#0C2340] shadow-2xs">
                              {item.kategori}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>{item.tanggal}</span>
                            {item.wilayah && (
                              <>
                                <span>•</span>
                                <span>{item.wilayah}</span>
                              </>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-[#0C2340] leading-snug line-clamp-2">
                            {item.judul}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                            {item.ringkasan}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                        <span className="text-slate-500 font-medium">
                          {item.penulis || 'Humas IKA UMS'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedBerita(item)}
                          className="inline-flex items-center gap-1 font-bold text-[#0C2340] hover:text-amber-600 transition-colors cursor-pointer py-1"
                        >
                          <span>Lihat liputan</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* TAB JADWAL MENDATANG */
            <div className="space-y-6">
              {agendas.length === 0 ? (
                <div className="surface-card rounded-2xl p-10 text-center space-y-4">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                  <h2 className="text-xl font-bold text-[#0C2340]">Belum Ada Jadwal Pertemuan Baru</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Kopdar perdana telah berhasil terlaksana. Jadwal kopdar berkala berikutnya sedang disusun oleh koordinator 9 wilayah Jabodetabek.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/gabung"
                      className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors"
                    >
                      Daftar Jadi Anggota untuk Dikabari
                      <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {agendas.map((agenda) => (
                    <article
                      key={agenda.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded">
                            {agenda.jenis}
                          </span>
                          <span className="text-xs text-slate-500">
                            Kapasitas: {agenda.kapasitas} orang
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0C2340] leading-snug">
                          {agenda.judul}
                        </h3>
                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{agenda.tanggalWIB} {agenda.jamWIB ? `· ${agenda.jamWIB}` : ''}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>{agenda.lokasi} ({agenda.wilayah})</span>
                          </div>
                          {agenda.penanggungJawab && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>Koordinator: {agenda.penanggungJawab}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href="/gabung"
                          className="inline-flex min-h-[40px] items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0C2340] text-white text-xs font-semibold hover:bg-[#16325C]"
                        >
                          Daftar Ikut Temu
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
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

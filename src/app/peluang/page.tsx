'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Navbar, Footer } from '@/components/Navigation';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Briefcase, 
  Code, 
  Palette, 
  Users, 
  ChevronRight, 
  ArrowRight, 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  X,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

interface PeluangItem {
  id: string;
  title: string;
  company: string;
  postedBy: string;
  category: string;
  location: string;
  workType: string;
  workModel: string;
  compensation: string;
  badge?: string;
  tags: string[];
  description: string;
  requirements: string[];
  contactEmail: string;
}

const STORAGE_KEY_INQUIRIES = 'ikaums_persisted_inquiries';

export default function PeluangPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedOpportunity, setSelectedOpportunity] = useState<PeluangItem | null>(null);
  const [inquirySent, setInquirySent] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const tabs = [
    { id: 'Semua', label: 'Semua' },
    { id: 'Lowongan', label: 'Lowongan' },
    { id: 'Proyek', label: 'Proyek' },
    { id: 'Bisnis Alumni', label: 'Bisnis Alumni' },
    { id: 'Mentoring', label: 'Mentoring' }
  ];

  const opportunities: PeluangItem[] = [
    {
      id: 'pl-1',
      title: 'Senior Front-End Engineer (Next.js & Design System)',
      company: 'Digital Core Perbankan • Mitra Alumni UMS',
      postedBy: 'Aditya R. Pratama (Informatika 2018)',
      category: 'Lowongan',
      location: 'Jakarta Selatan',
      workType: 'Full-time',
      workModel: 'Hybrid',
      compensation: 'Rp 18.000.000 - Rp 25.000.000 / bln',
      badge: 'Prioritas Alumni',
      tags: ['React 19', 'Next.js App Router', 'Tailwind CSS', 'TypeScript'],
      description: 'Membangun aplikasi portal nasabah korporasi dengan standar keamanan tinggi dan reliabilitas tinggi. Tim dipimpin langsung oleh alumni UMS yang siap memberikan pembinaan intensif.',
      requirements: [
        'Pengalaman minimal 3 tahun dengan ekosistem React/TypeScript',
        'Memahami arsitektur state management dan integrasi API RESTful/gRPC',
        'Nilai tambah untuk alumni Fakultas Komunikasi dan Informatika UMS'
      ],
      contactEmail: 'aditya.pratama@alumni.ums.ac.id'
    },
    {
      id: 'pl-2',
      title: 'Lead Environmental Auditor & ESG Consultant',
      company: 'PT Nusantara Green Advisory',
      postedBy: 'Amalia Mumtazah (Teknik Sipil 2019)',
      category: 'Lowongan',
      location: 'Jakarta Pusat',
      workType: 'Full-time',
      workModel: 'Hybrid',
      compensation: 'Rp 15.000.000 - Rp 22.000.000 / bln',
      badge: 'Baru',
      tags: ['AMDAL', 'ESG Reporting', 'ISO 14001', 'Kajian Lingkungan'],
      description: 'Memimpin tim audit keberlanjutan dan kepatuhan regulasi lingkungan industri bagi klien manufaktur skala menengah-besar di Jabodetabek.',
      requirements: [
        'Lulusan Teknik Lingkungan, Teknik Sipil, atau Teknik Kimia',
        'Memiliki sertifikasi auditor lingkungan atau pemahaman kuat UU Cipta Kerja & PP LH',
        'Kemampuan komunikasi manajerial dan presentasi korporasi'
      ],
      contactEmail: 'amalia.mumtazah@alumni.ums.ac.id'
    },
    {
      id: 'pl-3',
      title: 'Konsultan Independen: Audit Keamanan Sistem Koperasi Digital',
      company: 'Konsorsium UMKM Alumni UMS',
      postedBy: 'Rizal Maulana (Manajemen 2017)',
      category: 'Proyek',
      location: 'Tangerang Selatan',
      workType: 'Kontrak / Proyek',
      workModel: 'Remote',
      compensation: 'Rp 12.000.000 (Paket Proyek 1 Bulan)',
      badge: 'Proyek Cepat',
      tags: ['Security Audit', 'Penetration Testing', 'Fintech UMKM'],
      description: 'Melakukan uji penetrasi dan audit tata kelola keamanan basis data pada aplikasi simpan pinjam anggota koperasi alumni UMS sebelum rilis komersial.',
      requirements: [
        'Portofolio audit keamanan web / mobile teruji',
        'Dapat menyelesaikan laporan rekomendasi remediasi dalam 20 hari kerja'
      ],
      contactEmail: 'rizal.maulana@alumni.ums.ac.id'
    },
    {
      id: 'pl-4',
      title: 'Mentor Karier Perantau Baru (Fresh Graduate Coaching)',
      company: 'Program Pendampingan Wilayah IKA UMS Jabodetabek',
      postedBy: 'Pengurus Wilayah IKA UMS',
      category: 'Mentoring',
      location: 'Jabodetabek (Online Zoom)',
      workType: 'Volunteer',
      workModel: 'Remote',
      compensation: 'Sertifikat Apresiasi & Pengabdian Komunitas',
      tags: ['Career Mentoring', 'CV Review', 'Mock Interview', 'Networking'],
      description: 'Program sukarela mentoring 1-on-1 bagi alumni muda UMS yang baru lulus dan merantau ke Jakarta untuk persiapan wawancara kerja pertama mereka.',
      requirements: [
        'Alumni UMS dengan pengalaman kerja minimal 2 tahun di Jabodetabek',
        'Komitmen meluangkan 2 jam per dua pekan untuk sesi konsultasi'
      ],
      contactEmail: 'mentoring@ikaumsjabodetabek.id'
    },
    {
      id: 'pl-5',
      title: 'Kemitraan Vendor Pengadaan Seragam & Merchandise Komunitas',
      company: 'Divisi Acara & Perlengkapan IKA UMS',
      postedBy: 'Tim Pengadaan Wilayah',
      category: 'Bisnis Alumni',
      location: 'Bekasi / Jakarta',
      workType: 'Kemitraan',
      workModel: 'On-site',
      compensation: 'Tender Pembelian Resmi (PO Komunitas)',
      badge: 'Tender Terbuka',
      tags: ['Konveksi', 'Merchandise', 'Sinergi Usaha'],
      description: 'Peluang bagi alumni pemilik usaha konveksi atau sablon untuk menjadi vendor resmi penyedia jaket, polo shirt, dan goodie bag acara silaturahmi akbar.',
      requirements: [
        'Usaha dimiliki atau dikelola oleh alumni UMS terverifikasi',
        'Kapasitas produksi minimal 500 pcs dalam jangka waktu 14 hari kerja'
      ],
      contactEmail: 'pengadaan@ikaumsjabodetabek.id'
    }
  ];

  // Load persisted inquiry states
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (saved) {
        setInquirySent(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleInquiry = (id: string) => {
    setInquirySent(prev => {
      const updated = { ...prev, [id]: true };
      try {
        localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const filteredOpportunities = opportunities.filter((op) => {
    if (activeTab === 'Semua') return true;
    return op.category === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5F6678] mb-4 font-mono">
          <Link href="/" className="hover:text-[#101F5B]">BERANDA</Link>
          <span>/</span>
          <span className="text-[#101F5B] font-bold">PELUANG & KOLABORASI</span>
        </nav>

        {/* Title */}
        <div className="mb-8 border-b border-[#18213D]/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#101F5B] font-bold block mb-1">
                BURSA KARIER & KEMITRAAN ALUMNI
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1536]">
                Peluang Kerja, Proyek & Mentoring
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6678] mt-1.5 max-w-2xl leading-relaxed">
                Rujukan lowongan privat, proyek lepas, kemitraan bisnis UMKM, dan bimbingan karir langsung dari sesama alumni Universitas Muhammadiyah Surakarta di Jabodetabek.
              </p>
            </div>

            <Link
              href="/gabung"
              className="bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 transition-colors shadow-xs flex items-center gap-1.5 rounded-lg group"
            >
              <span>Pasang Lowongan / Proyek</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4C542] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Filter Tabs using 21st.dev Animated Tabs */}
        <div className="mb-8">
          <AnimatedTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            layoutId="peluangCategoryTabs"
          />
        </div>

        {/* High-Craft Contra-Style Opportunity Cards with AnimatePresence */}
        <div className="space-y-4 max-w-5xl">
          <AnimatePresence mode="popLayout">
            {filteredOpportunities.map((item) => (
              <motion.div
                key={item.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedOpportunity(item)}
                className="bg-white border border-[#E5E8EF] hover:border-[#101F5B]/30 rounded-xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left Metadata Block */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#EDF1FA] text-[#101F5B] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="bg-[#FAFAF8] text-[#5F6678] border border-[#E5E8EF] text-[10px] font-mono px-2 py-0.5 rounded">
                        {item.workType} • {item.workModel}
                      </span>
                      {item.badge && (
                        <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#0B1536] group-hover:text-[#18213D] transition-colors leading-tight">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F6678] font-mono">
                      <span className="flex items-center gap-1 font-semibold text-[#18213D]">
                        <Building2 className="w-3.5 h-3.5 text-[#101F5B]" />
                        {item.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#101F5B]" />
                        {item.location}
                      </span>
                    </div>

                    <p className="text-xs text-[#5F6678] line-clamp-2 leading-relaxed pt-1">
                      {item.description}
                    </p>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-[#FAFAF8] text-[#5F6678] border border-[#E5E8EF] text-[10px] font-mono px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Compensation & Action */}
                  <div className="sm:text-right shrink-0 flex flex-col justify-between items-start sm:items-end border-t sm:border-0 border-[#F0F2F6] pt-3 sm:pt-0">
                    <div className="mb-3">
                      <span className="text-[10px] font-mono uppercase text-[#5F6678] block">Kompensasi / Imbalan</span>
                      <span className="text-base font-bold font-mono text-[#0B1536]">
                        {item.compensation}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#101F5B] font-bold group-hover:underline flex items-center gap-1">
                        <span>Rincian & Lamar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ACCESSIBLE SHADCN/UI DIALOG FOR OPPORTUNITY DETAILS */}
        <Dialog
          open={!!selectedOpportunity}
          onOpenChange={(open) => !open && setSelectedOpportunity(null)}
        >
          {selectedOpportunity && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-[#EDF1FA] text-[#101F5B] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {selectedOpportunity.category}
                  </span>
                  <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {selectedOpportunity.workType}
                  </span>
                </div>
                <DialogTitle>{selectedOpportunity.title}</DialogTitle>
                <DialogDescription>
                  {selectedOpportunity.company} • {selectedOpportunity.location}
                </DialogDescription>
              </DialogHeader>

              {/* Body */}
              <div className="space-y-5 text-xs text-[#18213D] leading-relaxed pt-2">
                <div>
                  <h4 className="font-mono uppercase font-bold text-[#101F5B] text-[11px] mb-1">
                    Tentang Kesempatan Ini
                  </h4>
                  <p className="text-[#5F6678]">{selectedOpportunity.description}</p>
                </div>

                <div>
                  <h4 className="font-mono uppercase font-bold text-[#101F5B] text-[11px] mb-2">
                    Kualifikasi & Persyaratan
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-[#5F6678]">
                    {selectedOpportunity.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#FAFAF8] border border-[#E5E8EF] p-4 rounded-xl space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#5F6678]">Dipasang Oleh:</span>
                    <span className="font-bold text-[#101F5B]">{selectedOpportunity.postedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6678]">Estimasi Kompensasi:</span>
                    <span className="font-bold text-[#22775A]">{selectedOpportunity.compensation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6678]">Jalur Verifikasi:</span>
                    <span className="font-bold text-[#101F5B]">IKA UMS Peer-Verified</span>
                  </div>
                </div>

                {/* Application feedback */}
                {inquirySent[selectedOpportunity.id] ? (
                  <div className="bg-[#22775A]/10 border border-[#22775A]/30 p-4 rounded-xl text-center space-y-1 text-[#22775A]">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                    <p className="font-bold text-xs">Peminatan Kolaborasi Terkirim!</p>
                    <p className="text-[11px]">
                      Profil dan kontak Anda telah diteruskan ke {selectedOpportunity.postedBy}. Status ini tersimpan di perangkat Anda.
                    </p>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOpportunity(null)}
                      className="px-4 py-2.5 rounded-lg border border-[#D1D5DB] text-xs font-mono font-semibold text-[#5F6678] hover:bg-slate-50 transition-colors"
                    >
                      Tutup
                    </button>
                    <motion.button
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      type="button"
                      onClick={() => handleInquiry(selectedOpportunity.id)}
                      className="px-5 py-2.5 rounded-lg bg-[#101F5B] hover:bg-[#18213D] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Kirim Lamaran / Peminatan
                    </motion.button>
                  </div>
                )}

              </div>
            </DialogContent>
          )}
        </Dialog>

      </main>

      <Footer />
    </div>
  );
}

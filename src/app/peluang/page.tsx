'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { DATA_ALUMNI_SIMULASI } from '@/data/simulasi';
import { AlumniProfile } from '@/types';
import {
  ArrowRight,
  Building2,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  MessageCircle
} from 'lucide-react';

interface PeluangItem {
  id: string;
  title: string;
  company: string;
  postedBy: string;
  category: string;
  location: string;
  workType: string;
  compensation: string;
  tags: string[];
  description: string;
  requirements: string[];
}

const STORAGE_KEY_INQUIRIES = 'ikaums_persisted_inquiries';

export default function PeluangPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedOpportunity, setSelectedOpportunity] = useState<PeluangItem | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);
  const [mentorTopic, setMentorTopic] = useState('Review CV & Portofolio');
  const [mentorNote, setMentorNote] = useState('');
  const [isBookingDone, setIsBookingDone] = useState(false);
  const [inquirySent, setInquirySent] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const mentors = useMemo(
    () => DATA_ALUMNI_SIMULASI.filter((a) => a.bersediaMentoring).slice(0, 4),
    []
  );

  const tabs = [
    { id: 'Semua', label: 'Semua Peluang' },
    { id: 'Lowongan', label: 'Lowongan Kerja' },
    { id: 'Proyek', label: 'Proyek Lepas' },
    { id: 'Usaha Alumni', label: 'Sinergi Usaha' }
  ];

  const opportunities: PeluangItem[] = [
    {
      id: 'pl-1',
      title: 'Front-End Developer (React / Next.js)',
      company: 'Ruang Digital Nusantara',
      postedBy: 'Aditya Pratama (Teknik Informatika ’18)',
      category: 'Lowongan',
      location: 'Jakarta Selatan · Hybrid',
      workType: 'Penuh waktu',
      compensation: 'Rp 14.000.000 – Rp 20.000.000 / bln',
      tags: ['React', 'TypeScript'],
      description:
        'Membantu pengembangan antarmuka portal nasabah. Tim dipimpin alumni UMS dan terbuka membimbing lulusan dengan pengalaman kerja 1–3 tahun.',
      requirements: [
        'Pengalaman membangun aplikasi web dengan React atau Next.js minimal 2 tahun',
        'Terbiasa bekerja rapi dengan Git dan code review tim',
        'Domisili Jabodetabek atau siap hadir ke kantor 2 kali sepekan'
      ]
    },
    {
      id: 'pl-2',
      title: 'Staf Kajian Lingkungan & AMDAL Junior–Menengah',
      company: 'Bina Karya Konsultan',
      postedBy: 'Amalia Mumtazah (Teknik Sipil ’19)',
      category: 'Lowongan',
      location: 'Jakarta Pusat · Hybrid',
      workType: 'Penuh waktu',
      compensation: 'Rp 10.000.000 – Rp 15.000.000 / bln',
      tags: ['AMDAL', 'Teknik Lingkungan'],
      description:
        'Mendampingi penyusunan dokumen kelayakan lingkungan dan survei lapangan untuk proyek infrastruktur di Jawa Barat dan Banten.',
      requirements: [
        'Lulusan Teknik Sipil, Teknik Kimia, Teknik Lingkungan, atau rumpun sejenis',
        'Teliti menyusun laporan teknis dan bersedia survei lapangan',
        'Nilai tambah jika memiliki sertifikat dasar penyusun AMDAL'
      ]
    },
    {
      id: 'pl-3',
      title: 'Audit Keamanan Aplikasi Web Koperasi Anggota',
      company: 'Konsorsium Usaha Alumni UMS',
      postedBy: 'Rizal Maulana (Manajemen ’17)',
      category: 'Proyek',
      location: 'Tangerang Selatan · Remote',
      workType: 'Proyek 1 Bulan',
      compensation: 'Rp 12.000.000 (paket proyek)',
      tags: ['Keamanan Web', 'Audit'],
      description:
        'Pemeriksaan celah keamanan sederhana (OWASP) serta saran perbaikan konfigurasi database sebelum aplikasi koperasi dirilis ke anggota.',
      requirements: [
        'Pernah melakukan pengujian keamanan aplikasi web atau API',
        'Mampu menyusun laporan perbaikan yang jelas dalam 3 minggu kerja'
      ]
    },
    {
      id: 'pl-4',
      title: 'Pengadaan Seragam & Suvenir Kopdar Akbar 2026',
      company: 'Panitia Acara Wilayah Jabodetabek',
      postedBy: 'Bagus Saputro (Ilmu Komunikasi ’16)',
      category: 'Usaha Alumni',
      location: 'Bekasi / Jakarta',
      workType: 'Vendor Mitra',
      compensation: 'Pembelian Resmi Panitia (~300 pcs)',
      tags: ['Konveksi', 'Suvenir'],
      description:
        'Mencari vendor konveksi milik alumni UMS atau mitra binaan alumni untuk mengerjakan kaus kerah (polo) dan totebag acara temu kangen.',
      requirements: [
        'Usaha dimiliki atau dikelola langsung oleh alumni UMS',
        'Bisa mengirimkan sampel bahan dan selesai dalam 14 hari kerja'
      ]
    }
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (saved) setInquirySent(JSON.parse(saved));
    } catch {}
  }, []);

  const handleInquiry = (id: string) => {
    setInquirySent(prev => {
      const updated = { ...prev, [id]: true };
      try {
        localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingDone(true);
    setTimeout(() => {
      setIsBookingDone(false);
      setSelectedMentor(null);
      setMentorNote('');
    }, 1800);
  };

  const filteredOpportunities = opportunities.filter((op) => {
    if (activeTab === 'Semua') return true;
    return op.category === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full space-y-12">
        {/* Breadcrumb & Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
            <Link href="/" className="hover:text-[#0C2340] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#0C2340] font-semibold">Mentoring &amp; Peluang</span>
          </nav>

          <div className="border-b border-[#0C2340]/10 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1.5">
                Saling Bantu Karier &amp; Usaha
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
                Mentoring &amp; Peluang Alumni
              </h1>
              <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
                Tempat adik tingkat bertanya seputar dunia kerja ke seniornya, sekaligus berbagi info lowongan, proyek lepas, dan kebutuhan vendor sesama alumni.
              </p>
            </div>

            <Link
              href="/gabung"
              className="bg-[#0C2340] hover:bg-[#16325C] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 transition-colors shadow-xs inline-flex items-center gap-1.5 rounded-lg self-start lg:self-auto group shrink-0"
            >
              <span>Bagikan Info Peluang</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bagian 1: Alumni yang Membuka Sesi Mentoring */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#D97706]" />
                <span>Tanya Jawab &amp; Bimbingan Karier</span>
              </h2>
              <p className="text-sm text-[#475569] mt-1">
                100% sukarela tanpa biaya. Cocok buat lulusan baru atau alumni yang sedang pindah haluan karier di Jabodetabek.
              </p>
            </div>
            <Link
              href="/direktori"
              className="text-xs font-semibold text-[#0C2340] hover:text-[#D97706] flex items-center gap-1 shrink-0"
            >
              <span>Lihat mentor lain di direktori</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white border border-[#0C2340]/12 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#0C2340]/10 bg-[#F3F1EA]">
                    {mentor.avatarUrl ? (
                      <img src={mentor.avatarUrl} alt={mentor.nama} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-sm">
                        {mentor.avatarInitials}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#0C2340]">
                      {mentor.nama}{' '}
                      <span className="text-xs font-normal text-[#64748B]">
                        ({mentor.prodi} &apos;{String(mentor.angkatan).slice(-2)})
                      </span>
                    </h3>
                    <p className="text-xs font-semibold text-[#0C2340]">{mentor.pekerjaan}</p>
                    <p className="text-xs text-[#475569] line-clamp-2">{mentor.bio}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMentor(mentor)}
                  className="bg-[#FDFCF7] hover:bg-[#0C2340] text-[#0C2340] hover:text-white border border-[#0C2340]/20 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ajak Ngobrol</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian 2: Bursa Lowongan, Proyek & Sinergi Usaha */}
        <section className="space-y-6 pt-4 border-t border-[#0C2340]/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0C2340]">
                Lowongan, Proyek &amp; Kebutuhan Vendor
              </h2>
              <p className="text-sm text-[#475569] mt-0.5">
                Informasi pekerjaan dan kerja sama langsung dari perusahaan atau usaha yang dikelola rekan alumni.
              </p>
            </div>

            <AnimatedTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              layoutId="peluangCategoryTabs"
            />
          </div>

          <div className="divide-y divide-[#0C2340]/10 bg-white border border-[#0C2340]/12 rounded-xl overflow-hidden shadow-2xs">
            <AnimatePresence mode="popLayout">
              {filteredOpportunities.map((item) => (
                <motion.div
                  key={item.id}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedOpportunity(item)}
                  className="p-5 sm:p-6 hover:bg-[#FDFCF7] transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        {item.workType} · Diinformasikan oleh {item.postedBy}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0C2340] group-hover:text-[#1D4ED8] transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569]">
                      <span className="flex items-center gap-1 font-medium text-[#0C2340]">
                        <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
                        {item.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                        {item.location}
                      </span>
                    </div>

                    <p className="text-sm text-[#475569] leading-relaxed pt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="md:text-right shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between gap-2 pt-3 md:pt-0 border-t md:border-0 border-[#0C2340]/8">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-[#64748B] block">Kisaran Imbalan</span>
                      <span className="text-sm font-bold text-[#0C2340]">{item.compensation}</span>
                    </div>

                    <span className="text-xs font-semibold text-[#0C2340] group-hover:text-[#D97706] inline-flex items-center gap-1 transition-colors">
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Dialog Detail Peluang */}
        <Dialog
          open={!!selectedOpportunity}
          onOpenChange={(open) => !open && setSelectedOpportunity(null)}
        >
          {selectedOpportunity && (
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="text-left">
                <span className="inline-block w-fit bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-2.5 py-0.5 rounded mb-1">
                  {selectedOpportunity.category} · {selectedOpportunity.workType}
                </span>
                <DialogTitle className="text-xl font-extrabold text-[#0C2340]">
                  {selectedOpportunity.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#64748B]">
                  {selectedOpportunity.company} · {selectedOpportunity.location}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm text-[#475569] leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-[#0C2340] text-xs uppercase tracking-wider mb-1">
                    Uraian Singkat
                  </h4>
                  <p>{selectedOpportunity.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0C2340] text-xs uppercase tracking-wider mb-1.5">
                    Yang Dibutuhkan
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4">
                    {selectedOpportunity.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#FDFCF7] border border-[#0C2340]/12 p-4 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#64748B]">Diinformasikan oleh:</span>
                    <span className="font-semibold text-[#0C2340] text-right">{selectedOpportunity.postedBy}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#64748B]">Estimasi Kompensasi:</span>
                    <span className="font-semibold text-[#15803D] text-right">{selectedOpportunity.compensation}</span>
                  </div>
                </div>

                {inquirySent[selectedOpportunity.id] ? (
                  <div className="bg-[#F0FDF4] border border-[#16A34A]/30 p-4 rounded-xl text-center space-y-1 text-[#15803D]">
                    <CheckCircle2 className="w-6 h-6 mx-auto" />
                    <p className="font-bold text-sm">Peminatan Berhasil Dicatat</p>
                    <p className="text-xs">
                      Pesan ketertarikanmu akan diteruskan ke {selectedOpportunity.postedBy}.
                    </p>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedOpportunity(null)}
                      className="px-4 py-2 rounded-lg border border-[#0C2340]/20 text-xs font-semibold text-[#475569] hover:bg-[#FDFCF7] cursor-pointer"
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInquiry(selectedOpportunity.id)}
                      className="px-5 py-2 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-xs font-semibold cursor-pointer"
                    >
                      Ajukan Diri / Hubungi Pengirim
                    </button>
                  </div>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Modal Booking Sesi Ngobrol Mentor */}
        <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
          <DialogContent className="sm:max-w-md bg-white border border-[#0C2340]/20 p-6 rounded-xl">
            {selectedMentor && (
              <div className="space-y-4">
                <DialogHeader className="text-left">
                  <span className="text-xs font-bold text-[#D97706] uppercase">
                    Ajak Ngobrol Alumni Senior
                  </span>
                  <DialogTitle className="text-xl font-bold text-[#0C2340] pt-1">
                    Bimbingan dengan {selectedMentor.nama}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#64748B]">
                    {selectedMentor.pekerjaan} · {selectedMentor.prodi} &apos;{String(selectedMentor.angkatan).slice(-2)}
                  </DialogDescription>
                </DialogHeader>

                {isBookingDone ? (
                  <div className="bg-[#F0FDF4] border border-[#16A34A]/30 p-5 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto" />
                    <h4 className="font-bold text-base text-[#15803D]">Permintaan Terkirim</h4>
                    <p className="text-xs text-[#475569]">
                      Rekan mentor akan membalas jadwal luangnya lewat kontak WhatsApp terdaftar.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                        Topik Obrolan
                      </label>
                      <select
                        value={mentorTopic}
                        onChange={(e) => setMentorTopic(e.target.value)}
                        className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg text-xs focus:outline-none focus:border-[#0C2340] bg-white"
                      >
                        <option>Review CV &amp; Portofolio</option>
                        <option>Tanya Jawab Dunia Kerja Jabodetabek</option>
                        <option>Simulasi Wawancara Kerja</option>
                        <option>Konsultasi Merintis Usaha</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#0C2340] block mb-1">
                        Perkenalan Singkat
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={mentorNote}
                        onChange={(e) => setMentorNote(e.target.value)}
                        placeholder="Ceritakan singkat jurusan, angkatan, dan pertanyaan utamamu..."
                        className="w-full px-3 py-2 border border-[#0C2340]/20 rounded-lg text-xs focus:outline-none focus:border-[#0C2340]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0C2340] hover:bg-[#16325C] text-white text-xs font-semibold py-2.5 rounded-lg cursor-pointer"
                    >
                      Kirim Permintaan Ngobrol
                    </button>
                  </form>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getAlumniList } from '@/data/simulasi';
import { normalizeIndonesianWhatsApp } from '@/data/ums-prodi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { AlumniProfile } from '@/types';
import {
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  Briefcase,
} from 'lucide-react';

export default function PeluangPage() {
  const mentors = useMemo(
    () => getAlumniList().filter((a) => a.bersediaMentoring).slice(0, 4),
    []
  );

  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);
  const [requestForm, setRequestForm] = useState({
    nama: '',
    angkatanProdi: '',
    whatsapp: '',
    topik: 'Ulas CV & Portofolio',
    catatan: '',
  });
  const [formError, setFormError] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  const handleOpenBooking = (mentor: AlumniProfile | null) => {
    setSelectedMentor(mentor);
    setFormError('');
    setBookingDone(false);
    setMentorModalOpen(true);
  };

  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestForm.nama.trim().length < 3) {
      setFormError('Tuliskan nama lengkapmu minimal 3 huruf.');
      return;
    }
    const validWa = normalizeIndonesianWhatsApp(requestForm.whatsapp);
    if (!validWa) {
      setFormError('Masukkan nomor WhatsApp Indonesia yang valid (misalnya 081234567890).');
      return;
    }
    setRequestForm((prev) => ({ ...prev, whatsapp: validWa }));
    setFormError('');
    setBookingDone(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full space-y-12">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-2 text-xs text-[#475569] mb-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
                Beranda
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#0C2340] font-semibold">Mentoring &amp; Kerja</span>
            </div>
            {IS_DEMO_MODE && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] font-semibold">
                {DEMO_BADGE_LABEL}
              </span>
            )}
          </nav>

          <header className="border-b border-[#0C2340]/10 pb-6 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
              Pengembangan Karier Alumni
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C2340]">
              Mentoring Alumni serta Info Kerja &amp; Usaha
            </h1>
            <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
              Ruang untuk mencocokkan kebutuhan bimbingan karier lulusan baru dengan praktisi
              alumni serta membagikan info lowongan atau kerja sama usaha yang terverifikasi.
            </p>
          </header>
        </div>

        {/* Bagian 1: Mentoring Alumni */}
        <section id="mentoring" aria-labelledby="heading-mentoring" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h2 id="heading-mentoring" className="text-2xl font-bold text-[#0C2340]">
                Mentoring Alumni
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Sesi 1-on-1 singkat untuk ulas CV, persiapan wawancara, atau bertukar pikiran soal
                jalur industri di Jabodetabek.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenBooking(null)}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Cari Mentor
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
              <Link
                href="/gabung?mentor=ya"
                className="inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-lg bg-white border border-[#0C2340]/20 hover:border-[#0C2340]/45 text-[#0C2340] text-sm font-semibold transition-colors"
              >
                Daftar Jadi Mentor
              </Link>
            </div>
          </div>

          {!IS_DEMO_MODE ? (
            <div className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B45309]">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Pencocokan Mentor Pra-Launch</span>
                </div>
                <h3 className="text-lg font-bold text-[#0C2340]">
                  Daftar Mentor Sedang Dihimpun dari Pendaftar Awal
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Untuk menjaga privasi nama dan tempat kerja alumni, profil mentor baru ditampilkan
                  setelah pendaftar memverifikasi data dan menyetujui pencantuman dirinya. Sementara
                  itu, kamu tetap bisa mengirim permintaan butuh mentor melalui tombol Cari Mentor di
                  atas agar pengurus membantu mencocokkan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBooking(null)}
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors shrink-0 cursor-pointer"
              >
                Ajukan Topik Bimbingan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mentors.map((m) => (
                <article
                  key={m.id}
                  className="bg-white border border-[#0C2340]/12 rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F3F1EA] relative shrink-0">
                        {m.avatarUrl ? (
                          <Image
                            src={m.avatarUrl}
                            alt={`Foto ${m.nama}`}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0C2340] text-[#F59E0B] font-bold text-sm">
                            {m.avatarInitials}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#0C2340] truncate">{m.nama}</h3>
                        <p className="text-xs text-[#475569] truncate">
                          {m.prodi} &apos;{String(m.angkatan).slice(-2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-[#0C2340]">
                      {m.mentoringFokus || m.pekerjaan}
                    </p>
                    <p className="text-xs text-[#475569] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                      {m.wilayah}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBooking(m)}
                    className="w-full min-h-[44px] rounded-lg bg-[#F3F1EA] hover:bg-[#0C2340] text-[#0C2340] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Ajukan Sesi ({DEMO_BADGE_LABEL})
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Bagian 2: Info Kerja & Usaha */}
        <section aria-labelledby="heading-info-kerja" className="pt-8 border-t border-[#0C2340]/10 space-y-5">
          <div className="space-y-2 max-w-2xl">
            <h2 id="heading-info-kerja" className="text-2xl font-bold text-[#0C2340]">
              Info Kerja &amp; Usaha
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Papan berbagi lowongan dari tim internal alumni serta informasi peluang kemitraan usaha di wilayah Jabodetabek.
            </p>
          </div>

          <div className="bg-[#F3F1EA] border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C2340]">
                <Briefcase className="w-4 h-4 text-[#B45309]" />
                <span>Belum Ada Kiriman Aktif</span>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">
                Pada tahap pra-launch ini, daftar lowongan maupun penawaran usaha anggota belum
                dipublikasikan agar hanya informasi nyata dari anggota terverifikasi yang tampil.
                Jika kamu memiliki info lowongan untuk dibagikan ke sesama alumni, kirimkan melalui
                kontak pengurus ({COMMUNITY_PLACEHOLDERS.contactWhatsapp}).
              </p>
            </div>
            <Link
              href="/gabung"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors shrink-0"
            >
              Daftar jadi anggota
              <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
            </Link>
          </div>
        </section>
      </main>

      {/* Dialog Ajukan Mentoring */}
      <Dialog open={mentorModalOpen} onOpenChange={setMentorModalOpen}>
        <DialogContent className="bg-white border border-[#0C2340]/15 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0C2340]">
              {selectedMentor ? `Ajukan Mentoring ke ${selectedMentor.nama}` : 'Cari Mentor Alumni UMS'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#475569]">
              {selectedMentor
                ? `Fokus: ${selectedMentor.mentoringFokus || selectedMentor.pekerjaan} (${DEMO_BADGE_LABEL})`
                : 'Isikan data singkat di bawah agar pengurus membantu mencocokkanmu dengan mentor di bidang terkait.'}
            </DialogDescription>
          </DialogHeader>

          {!bookingDone ? (
            <form onSubmit={handleMentorSubmit} className="space-y-4 mt-2" noValidate>
              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label htmlFor="mentor-req-nama" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Nama Lengkap *
                </label>
                <input
                  id="mentor-req-nama"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Nama lengkap kamu"
                  value={requestForm.nama}
                  onChange={(e) => setRequestForm({ ...requestForm, nama: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="mentor-req-prodi" className="block text-sm font-semibold text-[#0C2340] mb-1">
                    Prodi &amp; Angkatan
                  </label>
                  <input
                    id="mentor-req-prodi"
                    type="text"
                    placeholder="Contoh: Manajemen '22"
                    value={requestForm.angkatanProdi}
                    onChange={(e) => setRequestForm({ ...requestForm, angkatanProdi: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
                  />
                </div>
                <div>
                  <label htmlFor="mentor-req-wa" className="block text-sm font-semibold text-[#0C2340] mb-1">
                    Nomor WhatsApp *
                  </label>
                  <input
                    id="mentor-req-wa"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="081234567890"
                    value={requestForm.whatsapp}
                    onChange={(e) => setRequestForm({ ...requestForm, whatsapp: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mentor-req-topik" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Topik Bimbingan
                </label>
                <select
                  id="mentor-req-topik"
                  value={requestForm.topik}
                  onChange={(e) => setRequestForm({ ...requestForm, topik: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
                >
                  <option value="Ulas CV & Portofolio">Ulas CV &amp; Portofolio</option>
                  <option value="Persiapan Wawancara Kerja">Persiapan Wawancara Kerja</option>
                  <option value="Diskusi Bidang Industri / Karier">Diskusi Bidang Industri / Karier</option>
                  <option value="Merintis Usaha Kecil / UMKM">Merintis Usaha Kecil / UMKM</option>
                </select>
              </div>

              <div>
                <label htmlFor="mentor-req-catatan" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Pertanyaan atau Tujuan Singkat
                </label>
                <textarea
                  id="mentor-req-catatan"
                  rows={3}
                  placeholder="Ceritakan singkat bidang yang sedang kamu tuju..."
                  value={requestForm.catatan}
                  onChange={(e) => setRequestForm({ ...requestForm, catatan: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setMentorModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-sm font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#16325C] cursor-pointer"
                >
                  Kirim Permintaan
                </button>
              </div>
            </form>
          ) : (
            <div className="py-4 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#0C2340]">
                  Permintaan Mentoring Dicatat
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Terima kasih, {requestForm.nama}. Permintaan topik <strong>{requestForm.topik}</strong> akan
                  ditindaklanjuti pengurus bidang karier ke WhatsApp <strong>{requestForm.whatsapp}</strong> dalam{' '}
                  {COMMUNITY_PLACEHOLDERS.verificationSla}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMentorModalOpen(false)}
                className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { PatternSection } from '@/components/PatternSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getAlumniList } from '@/data/simulasi';
import {
  ANGKATAN_OPTIONS,
  FAKULTAS_PRODI_UMS,
  normalizeIndonesianWhatsApp,
} from '@/data/ums-prodi';
import { IS_DEMO_MODE, COMMUNITY_PLACEHOLDERS, DEMO_BADGE_LABEL } from '@/lib/config';
import { AlumniProfile } from '@/types';
import {
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  Briefcase,
  Loader2,
} from 'lucide-react';

interface MentorFieldErrors {
  nama?: string;
  whatsapp?: string;
  mentorContactConsent?: string;
  form?: string;
}

export default function PeluangPage() {
  const mentors = useMemo(
    () => getAlumniList().filter((a) => a.bersediaMentoring).slice(0, 4),
    []
  );

  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);
  const [requestForm, setRequestForm] = useState({
    nama: '',
    prodi: '',
    angkatan: '',
    whatsapp: '',
    topik: 'Ulas CV & Portofolio',
    catatan: '',
    mentorContactConsent: false,
    website: '', // honeypot anti-spam
  });
  const [fieldErrors, setFieldErrors] = useState<MentorFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  const clearMentorError = (field: keyof MentorFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field] && !prev.form) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  };

  const handleOpenBooking = (mentor: AlumniProfile | null) => {
    setSelectedMentor(mentor);
    setFieldErrors({});
    setIsSubmitting(false);
    setBookingDone(false);
    setMentorModalOpen(true);
  };

  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (requestForm.website.trim().length > 0) {
      setFieldErrors({
        form: 'Permintaan tidak dapat diproses. Silakan muat ulang halaman lalu coba lagi.',
      });
      return;
    }

    const errors: MentorFieldErrors = {};
    if (requestForm.nama.trim().length < 3) {
      errors.nama = 'Tuliskan nama lengkapmu minimal 3 huruf.';
    }
    const validWa = normalizeIndonesianWhatsApp(requestForm.whatsapp);
    if (!validWa) {
      errors.whatsapp = 'Masukkan nomor WhatsApp Indonesia yang valid (misalnya 081234567890).';
    }
    if (!requestForm.mentorContactConsent) {
      errors.mentorContactConsent =
        'Centang izin penerusan nomor WhatsApp agar pengurus dapat menghubungkanmu dengan mentor.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstId = errors.nama
        ? 'mentor-req-nama'
        : errors.whatsapp
        ? 'mentor-req-wa'
        : 'mentor-req-consent';
      setTimeout(() => document.getElementById(firstId)?.focus(), 0);
      return;
    }

    setIsSubmitting(true);
    setRequestForm((prev) => ({ ...prev, whatsapp: validWa! }));
    setFieldErrors({});
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingDone(true);
    }, 180);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow page-grain-base w-full">
        <PatternSection
          as="section"
          variant="dots"
          tone="tint"
          fade="right-focus"
          patternOpacity={0.055}
          patternSize="24px"
          className="border-b border-[#0C2340]/10"
          contentClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-8 md:pb-10"
        >
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

          <header className="space-y-2.5">
            <span className="inline-block text-sm font-semibold text-[#92400E]">
              Pengembangan Karier Alumni
            </span>
            <h1 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-extrabold tracking-[-0.02em] text-[#0C2340]">
              Mentoring Alumni serta Info Kerja &amp; Usaha
            </h1>
            <p className="text-base text-[#475569] max-w-[48ch] sm:max-w-2xl leading-[1.6]">
              Ruang untuk mencocokkan kebutuhan mentoring karier lulusan baru dengan praktisi
              alumni serta membagikan info lowongan atau kerja sama usaha yang terverifikasi.
            </p>
          </header>
        </PatternSection>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 w-full space-y-12 relative z-[1]">
        {/* Bagian 1: Mentoring Alumni */}
        <section id="mentoring" aria-labelledby="heading-mentoring" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h2 id="heading-mentoring" className="text-2xl font-bold text-[#0C2340]">
                Mentoring Alumni
              </h2>
              <p className="text-base text-[#475569] leading-[1.6]">
                Sesi mentoring singkat untuk ulas CV, persiapan wawancara, atau bertukar pikiran soal
                jalur industri di Jabodetabek.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenBooking(null)}
                className="inline-flex items-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] text-white text-base font-semibold transition-all duration-150 cursor-pointer"
              >
                Cari Mentor
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
              <Link
                href="/gabung?mentor=ya"
                className="inline-flex items-center min-h-[48px] px-5 py-3 rounded-lg bg-white border border-[#0C2340]/20 hover:border-[#0C2340]/45 text-[#0C2340] text-base font-semibold transition-colors"
              >
                Daftar Jadi Mentor
              </Link>
            </div>
          </div>

          {!IS_DEMO_MODE ? (
            <div className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-[#92400E]">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Pencocokan Mentor Prapeluncuran</span>
                </div>
                <h3 className="text-xl font-bold text-[#0C2340]">
                  Daftar Mentor Sedang Dihimpun dari Pendaftar Awal
                </h3>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Untuk menjaga privasi nama dan tempat kerja alumni, profil mentor baru ditampilkan
                  setelah pendaftar memverifikasi data dan menyetujui pencantuman dirinya. Sementara
                  itu, kamu tetap bisa mengirim permintaan butuh mentor melalui tombol Cari Mentor di
                  atas agar pengurus membantu mencocokkan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBooking(null)}
                className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-base font-semibold transition-colors shrink-0 cursor-pointer"
              >
                Ajukan Topik Mentoring
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
                        <h3 className="text-base font-bold text-[#0C2340] truncate">{m.nama}</h3>
                        <span className="block text-sm text-[#475569] truncate">
                          {m.prodi} &apos;{String(m.angkatan).slice(-2)}
                        </span>
                      </div>
                    </div>
                    <p className="text-base font-semibold text-[#0C2340] leading-[1.5]">
                      {m.mentoringFokus || m.pekerjaan}
                    </p>
                    <span className="text-sm text-[#475569] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#92400E] shrink-0" />
                      {m.wilayah}
                    </span>
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
            <p className="text-base text-[#475569] leading-[1.6]">
              Papan berbagi lowongan dari tim internal alumni serta informasi peluang kemitraan usaha di wilayah Jabodetabek.
            </p>
          </div>

          <div className="bg-[#F3F1EA] border border-[#0C2340]/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-[#0C2340]">
                <Briefcase className="w-4 h-4 text-[#92400E]" />
                <span>Belum Ada Kiriman Aktif</span>
              </div>
              <p className="text-base text-[#475569] leading-[1.6]">
                Pada tahap prapeluncuran ini, daftar lowongan maupun penawaran usaha anggota belum
                dipublikasikan agar hanya informasi nyata dari anggota terverifikasi yang tampil.
                Jika kamu memiliki info lowongan atau peluang kerja sama yang terverifikasi untuk
                dibagikan ke sesama alumni, kirimkan melalui saluran resmi pengurus di halaman
                Pengurus &amp; Kontak.
              </p>
            </div>
            <Link
              href="/gabung"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] active:scale-[0.99] text-white text-base font-semibold transition-all duration-150 shrink-0"
            >
              Daftar jadi anggota
              <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
            </Link>
          </div>
        </section>
        </div>
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
              {/* Honeypot anti-spam */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="mentor-req-website">Kosongkan kolom ini</label>
                <input
                  id="mentor-req-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={requestForm.website}
                  onChange={(e) => setRequestForm({ ...requestForm, website: e.target.value })}
                />
              </div>

              {fieldErrors.form && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{fieldErrors.form}</span>
                </div>
              )}

              <div>
                <label htmlFor="mentor-req-nama" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Nama Lengkap <span className="text-[#92400E]">*</span>
                </label>
                <input
                  id="mentor-req-nama"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={fieldErrors.nama ? 'true' : undefined}
                  aria-describedby={fieldErrors.nama ? 'err-mentor-nama' : undefined}
                  placeholder="Nama lengkap kamu"
                  value={requestForm.nama}
                  onChange={(e) => {
                    setRequestForm({ ...requestForm, nama: e.target.value });
                    clearMentorError('nama');
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                    fieldErrors.nama
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-[#0C2340]/20 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                  }`}
                />
                {fieldErrors.nama && (
                  <p id="err-mentor-nama" className="mt-1 text-sm text-red-700 font-medium">
                    {fieldErrors.nama}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="mentor-req-prodi" className="block text-sm font-semibold text-[#0C2340] mb-1">
                    Program Studi UMS
                  </label>
                  <select
                    id="mentor-req-prodi"
                    value={requestForm.prodi}
                    onChange={(e) => setRequestForm({ ...requestForm, prodi: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-base text-[#0C2340]"
                  >
                    <option value="">Pilih Prodi (Opsional)</option>
                    {FAKULTAS_PRODI_UMS.map((group) => (
                      <optgroup key={group.fakultas} label={group.fakultas}>
                        {group.prodi.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="mentor-req-angkatan" className="block text-sm font-semibold text-[#0C2340] mb-1">
                    Tahun Angkatan
                  </label>
                  <select
                    id="mentor-req-angkatan"
                    value={requestForm.angkatan}
                    onChange={(e) => setRequestForm({ ...requestForm, angkatan: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-base text-[#0C2340]"
                  >
                    <option value="">Pilih Angkatan (Opsional)</option>
                    {ANGKATAN_OPTIONS.map((tahun) => (
                      <option key={tahun} value={tahun}>
                        Angkatan {tahun}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="mentor-req-wa" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Nomor WhatsApp <span className="text-[#92400E]">*</span>
                </label>
                <input
                  id="mentor-req-wa"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  aria-invalid={fieldErrors.whatsapp ? 'true' : undefined}
                  aria-describedby={fieldErrors.whatsapp ? 'hint-mentor-wa err-mentor-wa' : 'hint-mentor-wa'}
                  placeholder="081234567890"
                  value={requestForm.whatsapp}
                  onChange={(e) => {
                    setRequestForm({ ...requestForm, whatsapp: e.target.value });
                    clearMentorError('whatsapp');
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border text-base text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                    fieldErrors.whatsapp
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-[#0C2340]/20 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                  }`}
                />
                <p id="hint-mentor-wa" className="mt-1 text-sm text-[#475569]">
                  Tidak ditampilkan publik; hanya diteruskan jika kamu menyetujui izin di bawah.
                </p>
                {fieldErrors.whatsapp && (
                  <p id="err-mentor-wa" className="mt-1 text-sm text-red-700 font-medium">
                    {fieldErrors.whatsapp}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="mentor-req-topik" className="block text-sm font-semibold text-[#0C2340] mb-1">
                  Topik Mentoring
                </label>
                <select
                  id="mentor-req-topik"
                  value={requestForm.topik}
                  onChange={(e) => setRequestForm({ ...requestForm, topik: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-base text-[#0C2340]"
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
                  className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-base text-[#0C2340]"
                />
              </div>

              <div className="bg-[#F3F1EA]/75 border border-[#0C2340]/12 rounded-xl p-3.5">
                <label
                  htmlFor="mentor-req-consent"
                  className="flex items-start gap-2.5 min-h-[44px] cursor-pointer text-base text-[#0C2340] leading-[1.5]"
                >
                  <input
                    id="mentor-req-consent"
                    type="checkbox"
                    aria-invalid={fieldErrors.mentorContactConsent ? 'true' : undefined}
                    aria-describedby={fieldErrors.mentorContactConsent ? 'err-mentor-consent' : undefined}
                    checked={requestForm.mentorContactConsent}
                    onChange={(e) => {
                      setRequestForm({ ...requestForm, mentorContactConsent: e.target.checked });
                      clearMentorError('mentorContactConsent');
                    }}
                    className="mt-1.5 w-4 h-4 rounded border-[#0C2340]/30 accent-[#0C2340] shrink-0"
                  />
                  <span>
                    Saya mengizinkan pengurus meneruskan nomor WhatsApp ini kepada mentor yang cocok agar dapat menghubungi saya.{' '}
                    <span className="text-[#92400E] font-semibold">*</span>
                  </span>
                </label>
                {fieldErrors.mentorContactConsent && (
                  <p id="err-mentor-consent" className="mt-1 pl-6 text-sm text-red-700 font-medium">
                    {fieldErrors.mentorContactConsent}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setMentorModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-base font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#0C2340] text-white text-base font-semibold hover:bg-[#08182E] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim permintaan mentoring</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-4 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#0C2340]">
                  Permintaan Mentoring Dicatat
                </h3>
                <p className="text-base text-[#475569] leading-[1.6]">
                  Terima kasih, {requestForm.nama}. Permintaan topik <strong>{requestForm.topik}</strong> sudah
                  dicatat dan akan ditindaklanjuti ke WhatsApp <strong>{requestForm.whatsapp}</strong> (
                  {COMMUNITY_PLACEHOLDERS.verificationSla}).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMentorModalOpen(false)}
                className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0C2340] text-white text-base font-semibold cursor-pointer"
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

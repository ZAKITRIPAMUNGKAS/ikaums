'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  CheckCircle2,
  MapPin,
  Briefcase,
  Plus,
} from 'lucide-react';

interface PermintaanKoneksi {
  id: string;
  nama: string;
  prodiAngkatan: string;
  wilayah: string;
  topik: string;
  pesan: string;
  waktu: string;
}

interface CatatanBantuan {
  id: string;
  penulis: string;
  prodiAngkatan: string;
  wilayah: string;
  judul: string;
  ringkasan: string;
  jumlahTanggapan: number;
  sudahDitanggapi?: boolean;
}

const INITIAL_PERMINTAAN: PermintaanKoneksi[] = [
  {
    id: 'req-1',
    nama: 'Nadia Kusuma Putri',
    prodiAngkatan: "Teknik Informatika '22",
    wilayah: 'Jakarta Selatan',
    topik: 'Diskusi Portofolio & Interview Kerja',
    pesan: 'Assalamualaikum Mas Rizal, saya baru lulus tahun lalu dan sedang melamar posisi backend engineer di Jakarta. Boleh minta waktu 20 menit untuk ulas CV?',
    waktu: 'Kemarin, 19:40 WIB',
  },
  {
    id: 'req-2',
    nama: 'Fajar Sidik Purnomo',
    prodiAngkatan: "Manajemen '19",
    wilayah: 'Tangerang Raya',
    topik: 'Sapa Alumni Baru Pindah Domisili',
    pesan: 'Mas, saya baru dipindah tugaskan ke kantor area BSD bulan ini. Kalau ada jadwal ngopi alumni Tangerang Raya boleh ikut gabung.',
    waktu: '2 hari lalu',
  },
];

const INITIAL_BANTUAN: CatatanBantuan[] = [
  {
    id: 'help-1',
    penulis: 'Dian Pertiwi',
    prodiAngkatan: "Hukum '12",
    wilayah: 'Jakarta Pusat',
    judul: 'Mencari Rujukan Rekan Teknik Sipil untuk Proyek Renovasi Klinik',
    ringkasan: 'Klinik mitra kami di daerah Tebet berencana merapikan tata ruang dan instalasi listrik bulan depan. Jika ada rekan alumni kontraktor sipil/MEP, silakan hubungi.',
    jumlahTanggapan: 3,
  },
  {
    id: 'help-2',
    penulis: 'Arif Budiman',
    prodiAngkatan: "Teknik Industri '14",
    wilayah: 'Jakarta Utara',
    judul: 'Info Tempat Kos Aman Dekat Stasiun Sudirman untuk Adik Tingkat',
    ringkasan: 'Ada 2 mahasiswa magang UMS dari Surakarta yang baru tiba awal bulan depan. Barangkali ada rekan punya rekomendasi hunian bersih terjangkau.',
    jumlahTanggapan: 5,
  },
];

export default function PortalAnggotaPage() {
  const [activeTab, setActiveTab] = useState('koneksi');
  const [permintaanList, setPermintaanList] = useState<PermintaanKoneksi[]>(INITIAL_PERMINTAAN);
  const [bantuanList, setBantuanList] = useState<CatatanBantuan[]>(INITIAL_BANTUAN);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Privasi toggles
  const [tampilDiDirektori, setTampilDiDirektori] = useState(true);
  const [terbukaMentoring, setTerbukaMentoring] = useState(true);
  const [ikutPetaWilayah, setIkutPetaWilayah] = useState(true);

  // Modals
  const [composerOpen, setComposerOpen] = useState(false);
  const [newJudul, setNewJudul] = useState('');
  const [newIsi, setNewIsi] = useState('');
  const [replyTarget, setReplyTarget] = useState<CatatanBantuan | null>(null);
  const [replyText, setReplyText] = useState('');
  const [accountDialogOpen, setAccountDialogOpen] = useState<'ekspor' | 'hapus' | null>(null);

  const handleKeputusanKoneksi = (item: PermintaanKoneksi, disetujui: boolean) => {
    setPermintaanList((prev) => prev.filter((r) => r.id !== item.id));
    setStatusFeedback(
      disetujui
        ? `Permintaan dari ${item.nama} disetujui (simulasi). Notifikasi kontak diteruskan secara internal.`
        : `Permintaan dari ${item.nama} ditandai selesai.`
    );
  };

  const handleTambahBantuan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim() || !newIsi.trim()) return;
    const itemBaru: CatatanBantuan = {
      id: `help-${Date.now()}`,
      penulis: 'Rizal Hakim (Anda)',
      prodiAngkatan: "Teknik Informatika '11",
      wilayah: 'Jakarta Selatan',
      judul: newJudul.trim(),
      ringkasan: newIsi.trim(),
      jumlahTanggapan: 0,
    };
    setBantuanList((prev) => [itemBaru, ...prev]);
    setNewJudul('');
    setNewIsi('');
    setComposerOpen(false);
    setStatusFeedback('Catatan bantuan berhasil ditambahkan ke papan simulasi.');
  };

  const handleKirimTanggapan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTarget || !replyText.trim()) return;
    setBantuanList((prev) =>
      prev.map((b) =>
        b.id === replyTarget.id
          ? { ...b, jumlahTanggapan: b.jumlahTanggapan + 1, sudahDitanggapi: true }
          : b
      )
    );
    setStatusFeedback(`Tanggapan untuk "${replyTarget.penulis}" terkirim dalam sesi simulasi.`);
    setReplyText('');
    setReplyTarget(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748B] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#0C2340] transition-colors">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-medium">Portal Anggota</span>
          </div>
          <span className="text-xs text-[#64748B]">Mode Pratinjau Sesi Lokal</span>
        </nav>

        {/* Profil Ringkas Anggota */}
        <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <img
              src="/images/avatar-rizal.jpg"
              alt="Foto profil Rizal Hakim"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-[#0C2340]/15 shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0C2340]">
                  Rizal Hakim
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Anggota Terverifikasi
                </span>
              </div>
              <p className="text-sm text-[#475569] flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#D97706]" />
                  Engineering Manager · Teknik Informatika &apos;11
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#64748B]" />
                  Jakarta Selatan
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/direktori"
              className="px-4 py-2 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors"
            >
              Cari Rekan Alumni
            </Link>
            <Link
              href="/peta"
              className="px-4 py-2 rounded-lg bg-white border border-[#0C2340]/15 hover:border-[#0C2340]/35 text-[#0C2340] text-sm font-semibold transition-colors"
            >
              Peta Wilayah
            </Link>
          </div>
        </section>

        {statusFeedback && (
          <div
            role="status"
            className="bg-white border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-900 flex items-center justify-between gap-4 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFeedback(null)}
              className="text-xs font-semibold text-[#64748B] hover:text-[#0C2340] cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Navigasi Tab */}
        <div>
          <AnimatedTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            layoutId="portalAnggotaTabs"
            tabs={[
              {
                id: 'koneksi',
                label: 'Permintaan Koneksi',
                badge: permintaanList.length,
              },
              {
                id: 'bantuan',
                label: 'Papan Bantuan Alumni',
                badge: bantuanList.length,
              },
              {
                id: 'privasi',
                label: 'Privasi & Akun',
              },
            ]}
          />
        </div>

        {/* Konten Tab 1: Permintaan Koneksi */}
        {activeTab === 'koneksi' && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[#0C2340]">
                Sapaan & Permintaan Mentoring Masuk
              </h2>
              <p className="text-sm text-[#64748B]">
                Kontak WhatsApp/email Anda hanya dibagikan bila Anda menekan Setujui.
              </p>
            </div>

            {permintaanList.length === 0 ? (
              <div className="bg-white border border-[#0C2340]/12 rounded-2xl p-8 text-center space-y-2">
                <p className="font-semibold text-[#0C2340]">Belum ada permintaan baru</p>
                <p className="text-sm text-[#64748B]">
                  Semua sapaan masuk telah ditanggapi. Anda juga bisa menjelajahi direktori untuk menyapa rekan seangkatan.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permintaanList.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-2xs"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[#0C2340]">{item.nama}</h3>
                          <p className="text-xs text-[#64748B]">
                            {item.prodiAngkatan} &middot; {item.wilayah}
                          </p>
                        </div>
                        <span className="text-xs text-[#64748B] shrink-0">{item.waktu}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#D97706]">{item.topik}</p>
                      <p className="text-sm text-[#475569] leading-relaxed">{item.pesan}</p>
                    </div>

                    <div className="flex items-center gap-2.5 pt-3 border-t border-[#0C2340]/10">
                      <button
                        type="button"
                        onClick={() => handleKeputusanKoneksi(item, true)}
                        className="flex-1 px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Setujui Perkenalan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeputusanKoneksi(item, false)}
                        className="px-4 py-2 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Lewati
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Konten Tab 2: Papan Bantuan */}
        {activeTab === 'bantuan' && (
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0C2340]">
                  Papan Rujukan & Tolong-Menolong Sesama Alumni
                </h2>
                <p className="text-sm text-[#64748B]">
                  Ruang berbagi kebutuhan praktis di perantauan mulai dari informasi hunian hingga kolaborasi jasa profesional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Buat Catatan Baru
              </button>
            </div>

            <div className="divide-y divide-[#0C2340]/10 bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden">
              {bantuanList.map((item) => (
                <article
                  key={item.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <p className="text-xs text-[#64748B]">
                      <strong className="text-[#0C2340] font-semibold">{item.penulis}</strong> &middot;{' '}
                      {item.prodiAngkatan} &middot; {item.wilayah}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">{item.judul}</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">{item.ringkasan}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#64748B]">
                      {item.jumlahTanggapan} tanggapan
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyTarget(item)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        item.sudahDitanggapi
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340]'
                      }`}
                    >
                      {item.sudahDitanggapi ? 'Terkirim' : 'Tanggapi'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Konten Tab 3: Privasi & Akun */}
        {activeTab === 'privasi' && (
          <section className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0C2340]">
                Pengaturan Visibilitas & Kendali Data Pribadi
              </h2>
              <p className="text-sm text-[#64748B]">
                Atur bagaimana profil Anda muncul di hadapan sesama anggota IKA UMS Jabodetabek.
              </p>
            </div>

            <div className="divide-y divide-[#0C2340]/10">
              <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-[#0C2340]">Tampilkan Profil di Direktori Alumni</p>
                  <p className="text-xs text-[#64748B]">Anggota terdaftar dapat melihat bidang keahlian dan kota domisili Anda.</p>
                </div>
                <input
                  type="checkbox"
                  checked={tampilDiDirektori}
                  onChange={(e) => {
                    setTampilDiDirektori(e.target.checked);
                    setStatusFeedback('Preferensi tampilan direktori diperbarui (simulasi).');
                  }}
                  className="w-4 h-4 rounded border-[#0C2340]/30 text-[#0C2340]"
                />
              </label>

              <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-[#0C2340]">Terbuka sebagai Mentor Relawan</p>
                  <p className="text-xs text-[#64748B]">Izinkan adik tingkat mengirim ajakan diskusi karier secara terjadwal.</p>
                </div>
                <input
                  type="checkbox"
                  checked={terbukaMentoring}
                  onChange={(e) => {
                    setTerbukaMentoring(e.target.checked);
                    setStatusFeedback('Status kesediaan mentoring diperbarui (simulasi).');
                  }}
                  className="w-4 h-4 rounded border-[#0C2340]/30 text-[#0C2340]"
                />
              </label>

              <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-[#0C2340]">Sertakan Kota Domisili pada Peta Wilayah</p>
                  <p className="text-xs text-[#64748B]">Hanya dihitung sebagai angka gabungan pada tingkat kota/kabupaten.</p>
                </div>
                <input
                  type="checkbox"
                  checked={ikutPetaWilayah}
                  onChange={(e) => {
                    setIkutPetaWilayah(e.target.checked);
                    setStatusFeedback('Preferensi agregasi peta wilayah diperbarui (simulasi).');
                  }}
                  className="w-4 h-4 rounded border-[#0C2340]/30 text-[#0C2340]"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-[#0C2340]/10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAccountDialogOpen('ekspor')}
                className="px-4 py-2 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors cursor-pointer"
              >
                Unduh Salinan Data Pribadi
              </button>
              <button
                type="button"
                onClick={() => setAccountDialogOpen('hapus')}
                className="px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm font-semibold transition-colors cursor-pointer"
              >
                Ajukan Penghapusan Akun
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Dialog Tulis Bantuan */}
      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="bg-white border border-[#0C2340]/15 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0C2340]">
              Tulis Catatan Bantuan Alumni
            </DialogTitle>
            <DialogDescription className="text-sm text-[#475569]">
              Bagikan informasi kebutuhan kolaborasi, hunian, atau rujukan kerja bagi sesama alumni Jabodetabek.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTambahBantuan} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-semibold text-[#0C2340] mb-1">Judul Singkat</label>
              <input
                type="text"
                required
                placeholder="Contoh: Butuh Rujukan Desainer Kemasan UMKM"
                value={newJudul}
                onChange={(e) => setNewJudul(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0C2340] mb-1">Penjelasan Kebutuhan</label>
              <textarea
                rows={4}
                required
                placeholder="Jelaskan konteks, lokasi, dan jenis bantuan yang dibutuhkan..."
                value={newIsi}
                onChange={(e) => setNewIsi(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-sm font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#16325C] cursor-pointer"
              >
                Terbitkan Catatan
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Tanggapi */}
      <Dialog open={!!replyTarget} onOpenChange={(open) => !open && setReplyTarget(null)}>
        <DialogContent className="bg-white border border-[#0C2340]/15 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0C2340]">
              Tanggapi {replyTarget?.penulis}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#475569]">
              {replyTarget?.judul}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleKirimTanggapan} className="space-y-4 mt-2">
            <textarea
              rows={4}
              required
              placeholder="Tuliskan info atau kesediaan Anda membantu..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
            />
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="px-4 py-2 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-sm font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#16325C] cursor-pointer"
              >
                Kirim Tanggapan
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Ekspor / Hapus Akun */}
      <Dialog open={!!accountDialogOpen} onOpenChange={(open) => !open && setAccountDialogOpen(null)}>
        <DialogContent className="bg-white border border-[#0C2340]/15 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0C2340]">
              {accountDialogOpen === 'ekspor' ? 'Permintaan Ekspor Data Pribadi' : 'Konfirmasi Penghapusan Akun'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#475569] leading-relaxed">
              {accountDialogOpen === 'ekspor'
                ? 'Dalam mode penuh, salinan seluruh data profil Anda (JSON/CSV) akan dikirim ke email terdaftar dalam 1x24 jam.'
                : 'Penghapusan akun akan menghapus profil Anda dari direktori dan menghentikan notifikasi kegiatan. Lanjutkan pengajuan dalam pratinjau?'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setAccountDialogOpen(null)}
              className="px-4 py-2 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-sm font-semibold cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                const action = accountDialogOpen;
                setAccountDialogOpen(null);
                setStatusFeedback(
                  action === 'ekspor'
                    ? 'Permintaan unduh salinan data telah dicatat (simulasi).'
                    : 'Permintaan penghapusan akun diteruskan ke sekretariat pengurus (simulasi).'
                );
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer ${
                accountDialogOpen === 'hapus' ? 'bg-red-700 hover:bg-red-800' : 'bg-[#0C2340] hover:bg-[#16325C]'
              }`}
            >
              {accountDialogOpen === 'ekspor' ? 'Kirim Salinan Data' : 'Ajukan Penghapusan'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

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
import { DATA_KEGIATAN_SIMULASI } from '@/data/simulasi';
import { REGIONS_METADATA } from '@/data/jabodetabek-geo-meta';
import { CheckCircle2, Plus, QrCode } from 'lucide-react';

interface PendaftarMenunggu {
  id: string;
  nama: string;
  prodi: string;
  angkatan: number;
  wilayah: string;
  pekerjaan: string;
  tanggalDaftar: string;
}

interface AdminAgendaItem {
  id: string;
  judul: string;
  tanggalWIB: string;
  lokasi: string;
  wilayah: string;
  jenis: string;
  kapasitas: number;
  terdaftarCount: number;
  presensiTerbuka: boolean;
}

const INITIAL_ANTREAN: PendaftarMenunggu[] = [
  {
    id: 'pend-1',
    nama: 'Hendra Wijaya',
    prodi: 'Teknik Mesin',
    angkatan: 2015,
    wilayah: 'Bekasi',
    pekerjaan: 'Plant Maintenance Supervisor',
    tanggalDaftar: 'Hari ini, 08:15 WIB',
  },
  {
    id: 'pend-2',
    nama: 'Siti Rahmawati',
    prodi: 'Psikologi',
    angkatan: 2018,
    wilayah: 'Jakarta Selatan',
    pekerjaan: 'People Partner',
    tanggalDaftar: 'Kemarin, 16:42 WIB',
  },
  {
    id: 'pend-3',
    nama: 'Bayu Kurniawan',
    prodi: 'Akuntansi',
    angkatan: 2013,
    wilayah: 'Tangerang Raya',
    pekerjaan: 'Finance & Tax Manager',
    tanggalDaftar: '2 hari lalu',
  },
];

export default function AdminPengurusPage() {
  const [activeTab, setActiveTab] = useState('verifikasi');
  const [antrean, setAntrean] = useState<PendaftarMenunggu[]>(INITIAL_ANTREAN);
  const [totalDisetujui, setTotalDisetujui] = useState(1248);
  const [agendaList, setAgendaList] = useState<AdminAgendaItem[]>(() =>
    DATA_KEGIATAN_SIMULASI.map((k) => ({
      id: k.id,
      judul: k.judul,
      tanggalWIB: k.tanggalWIB,
      lokasi: k.lokasi || k.lokasiSpesifik || 'Lokasi Jabodetabek',
      wilayah: String(k.wilayah),
      jenis: k.jenis,
      kapasitas: k.kapasitas,
      terdaftarCount: k.terdaftarCount,
      presensiTerbuka: false,
    }))
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Add Agenda Dialog
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [judulAgenda, setJudulAgenda] = useState('');
  const [tanggalAgenda, setTanggalAgenda] = useState('');
  const [lokasiAgenda, setLokasiAgenda] = useState('');
  const [wilayahAgenda, setWilayahAgenda] = useState('Jakarta Selatan');

  const handleVerifikasi = (item: PendaftarMenunggu, setuju: boolean) => {
    setAntrean((prev) => prev.filter((p) => p.id !== item.id));
    if (setuju) {
      setTotalDisetujui((n) => n + 1);
      setToastMsg(`Profil ${item.nama} (${item.prodi} '${String(item.angkatan).slice(2)}) telah disetujui.`);
    } else {
      setToastMsg(`Permintaan klarifikasi data dikirim ke ${item.nama}.`);
    }
  };

  const handleTogglePresensi = (id: string) => {
    setAgendaList((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const nextState = !a.presensiTerbuka;
        setToastMsg(
          nextState
            ? `Presensi QR dibuka untuk "${a.judul}" (simulasi).`
            : `Presensi QR ditutup untuk "${a.judul}".`
        );
        return { ...a, presensiTerbuka: nextState };
      })
    );
  };

  const handleTambahAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulAgenda.trim() || !tanggalAgenda.trim() || !lokasiAgenda.trim()) return;
    setAgendaList((prev) => [
      {
        id: `ag-${Date.now()}`,
        judul: judulAgenda.trim(),
        tanggalWIB: tanggalAgenda.trim(),
        lokasi: lokasiAgenda.trim(),
        wilayah: wilayahAgenda,
        jenis: 'Kopdar Rutin',
        kapasitas: 60,
        terdaftarCount: 1,
        presensiTerbuka: false,
      },
      ...prev,
    ]);
    setToastMsg(`Agenda "${judulAgenda.trim()}" ditambahkan ke daftar pratinjau.`);
    setJudulAgenda('');
    setTanggalAgenda('');
    setLokasiAgenda('');
    setAgendaOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748B] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#0C2340] transition-colors">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-medium">Panel Pengurus Wilayah</span>
          </div>
          <span className="text-xs text-[#64748B]">Mode Simulasi Pengelolaan</span>
        </nav>

        <header className="space-y-2">
          <p className="text-sm font-semibold text-[#D97706]">
            Koordinasi Pengurus Jabodetabek
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0C2340]">
            Pengelolaan Anggota & Agenda Komunitas
          </h1>
          <p className="text-base text-[#475569]">
            Alur kerja koordinator untuk memverifikasi kesesuaian latar alumni pendaftar baru serta menyusun jadwal pertemuan wilayah.
          </p>
        </header>

        {/* Ringkasan Angka */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5">
            <p className="text-xs font-medium text-[#64748B]">Menunggu Verifikasi</p>
            <p className="text-2xl font-bold text-[#0C2340] mt-1">{antrean.length}</p>
          </div>
          <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5">
            <p className="text-xs font-medium text-[#64748B]">Total Anggota Aktif</p>
            <p className="text-2xl font-bold text-[#0C2340] mt-1">{totalDisetujui.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5">
            <p className="text-xs font-medium text-[#64748B]">Agenda Terjadwal</p>
            <p className="text-2xl font-bold text-[#0C2340] mt-1">{agendaList.length}</p>
          </div>
          <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5">
            <p className="text-xs font-medium text-[#64748B]">Cakupan Wilayah</p>
            <p className="text-2xl font-bold text-[#0C2340] mt-1">{REGIONS_METADATA.length} Wilayah</p>
          </div>
        </section>

        {toastMsg && (
          <div
            role="status"
            className="bg-white border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-900 flex items-center justify-between gap-4 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-xs font-semibold text-[#64748B] hover:text-[#0C2340] cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        <AnimatedTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          layoutId="adminPengurusTabs"
          tabs={[
            {
              id: 'verifikasi',
              label: 'Antrean Verifikasi',
              badge: antrean.length,
            },
            {
              id: 'agenda',
              label: 'Kelola Agenda',
              badge: agendaList.length,
            },
            {
              id: 'wilayah',
              label: 'Rekap Wilayah',
            },
          ]}
        />

        {/* Tab 1: Antrean Verifikasi */}
        {activeTab === 'verifikasi' && (
          <section className="space-y-4">
            {antrean.length === 0 ? (
              <div className="bg-white border border-[#0C2340]/12 rounded-2xl p-8 text-center space-y-2">
                <p className="font-semibold text-[#0C2340]">Semua pendaftar sudah diperiksa</p>
                <p className="text-sm text-[#64748B]">Tidak ada antrean verifikasi alumni yang tertunda saat ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#0C2340]/10 bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden">
                {antrean.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-[#0C2340]">{item.nama}</h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F3F1EA] text-[#0C2340] font-medium">
                          {item.wilayah}
                        </span>
                      </div>
                      <p className="text-sm text-[#475569]">
                        {item.prodi} (Angkatan {item.angkatan}) &middot; {item.pekerjaan}
                      </p>
                      <p className="text-xs text-[#64748B]">Masuk: {item.tanggalDaftar}</p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleVerifikasi(item, true)}
                        className="px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Setujui Alumni
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerifikasi(item, false)}
                        className="px-4 py-2 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Minta Klarifikasi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Kelola Agenda */}
        {activeTab === 'agenda' && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-[#475569]">
                Atur jadwal kumpul lintas angkatan dan aktivasi presensi kehadiran di lokasi.
              </p>
              <button
                type="button"
                onClick={() => setAgendaOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tambah Agenda Baru
              </button>
            </div>

            <div className="divide-y divide-[#0C2340]/10 bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden">
              {agendaList.map((ag) => (
                <div
                  key={ag.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-[#0C2340]">{ag.judul}</h2>
                      <span className="text-xs font-medium text-[#D97706]">{ag.jenis}</span>
                    </div>
                    <p className="text-sm text-[#475569]">
                      {ag.tanggalWIB} &middot; {ag.lokasi} ({ag.wilayah})
                    </p>
                    <p className="text-xs text-[#64748B]">
                      Pendaftar tercatat: {ag.terdaftarCount} / {ag.kapasitas} peserta
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePresensi(ag.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
                      ag.presensiTerbuka
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340]'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    {ag.presensiTerbuka ? 'Presensi QR Aktif' : 'Buka Presensi QR'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 3: Rekap Wilayah */}
        {activeTab === 'wilayah' && (
          <section className="bg-white border border-[#0C2340]/12 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#0C2340]/10 bg-[#FDFCF7] text-xs font-semibold text-[#64748B]">
                    <th className="py-3.5 px-5">Wilayah</th>
                    <th className="py-3.5 px-5">Alumni Terdata</th>
                    <th className="py-3.5 px-5">Mentor Siap Berbagi</th>
                    <th className="py-3.5 px-5">Bidang Dominan</th>
                    <th className="py-3.5 px-5 text-right">Direktori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0C2340]/10 text-sm">
                  {REGIONS_METADATA.map((w) => (
                    <tr key={w.regionId} className="hover:bg-[#FDFCF7]">
                      <td className="py-3.5 px-5 font-semibold text-[#0C2340]">{w.regionName}</td>
                      <td className="py-3.5 px-5 text-[#475569]">{w.count}</td>
                      <td className="py-3.5 px-5 text-[#475569]">{w.mentorCount}</td>
                      <td className="py-3.5 px-5 text-[#475569]">{w.industri.slice(0, 2).join(', ')}</td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/direktori?wilayah=${encodeURIComponent(w.regionName)}`}
                          className="text-xs font-semibold text-[#0C2340] hover:text-[#D97706] underline underline-offset-4"
                        >
                          Buka
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Dialog Tambah Agenda */}
      <Dialog open={agendaOpen} onOpenChange={setAgendaOpen}>
        <DialogContent className="bg-white border border-[#0C2340]/15 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0C2340]">
              Tambah Agenda Wilayah Baru
            </DialogTitle>
            <DialogDescription className="text-sm text-[#475569]">
              Jadwalkan acara kumpul atau diskusi profesi baru ke kalender pratinjau.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTambahAgenda} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-semibold text-[#0C2340] mb-1">Nama Kegiatan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ngopi Sore Alumni Bekasi"
                value={judulAgenda}
                onChange={(e) => setJudulAgenda(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#0C2340] mb-1">Tanggal</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sabtu, 28 Nov 2026"
                  value={tanggalAgenda}
                  onChange={(e) => setTanggalAgenda(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C2340] mb-1">Wilayah</label>
                <select
                  value={wilayahAgenda}
                  onChange={(e) => setWilayahAgenda(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
                >
                  {REGIONS_METADATA.map((w) => (
                    <option key={w.regionId} value={w.regionName}>
                      {w.regionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0C2340] mb-1">Lokasi Pertemuan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Kedai Kopi Kemang Pratama"
                value={lokasiAgenda}
                onChange={(e) => setLokasiAgenda(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-sm text-[#0C2340]"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAgendaOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-sm font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#16325C] cursor-pointer"
              >
                Simpan Agenda
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

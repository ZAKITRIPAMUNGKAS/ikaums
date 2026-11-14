'use client';

import React, { useState, useEffect } from 'react';
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
import { getKegiatanList, STATS_JABODETABEK } from '@/data/simulasi';
import { WILAYAH_JABODETABEK } from '@/data/ums-prodi';
import { IS_DEMO_MODE, DEMO_BADGE_LABEL } from '@/lib/config';
import { CheckCircle2, Plus, QrCode, Download } from 'lucide-react';

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

const DEMO_ANTREAN: PendaftarMenunggu[] = [
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

export default function KelolaPendaftaranPage() {
  const [activeTab, setActiveTab] = useState('verifikasi');
  const [antrean, setAntrean] = useState<PendaftarMenunggu[]>(() =>
    IS_DEMO_MODE ? DEMO_ANTREAN : []
  );
  const [totalDisetujui, setTotalDisetujui] = useState(() =>
    IS_DEMO_MODE ? STATS_JABODETABEK.totalAlumni : 0
  );
  const [agendaList, setAgendaList] = useState<AdminAgendaItem[]>(() =>
    IS_DEMO_MODE
      ? getKegiatanList().map((k) => ({
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
      : []
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pendaftaran')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          const pending = data.items
            .filter((item: { status: string }) => item.status === 'menunggu')
            .map((item: { id: string; namaLengkap: string; prodi: string; angkatan: number; wilayah: string; pekerjaan?: string; perusahaan?: string; createdAt: string }) => ({
              id: item.id,
              nama: item.namaLengkap,
              prodi: item.prodi,
              angkatan: item.angkatan,
              wilayah: item.wilayah,
              pekerjaan: item.pekerjaan || item.perusahaan || 'Alumni UMS',
              tanggalDaftar: new Date(item.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) + ' WIB',
            }));
          const approvedCount = data.items.filter((item: { status: string }) => item.status === 'disetujui').length;
          if (pending.length > 0 || approvedCount > 0) {
            setAntrean(pending);
            if (approvedCount > 0) {
              setTotalDisetujui(approvedCount);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const [agendaOpen, setAgendaOpen] = useState(false);
  const [judulAgenda, setJudulAgenda] = useState('');
  const [tanggalAgenda, setTanggalAgenda] = useState('');
  const [lokasiAgenda, setLokasiAgenda] = useState('');
  const [wilayahAgenda, setWilayahAgenda] = useState('Jakarta Selatan');

  const handleVerifikasi = (item: PendaftarMenunggu, setuju: boolean) => {
    setAntrean((prev) => prev.filter((p) => p.id !== item.id));
    if (setuju) {
      setTotalDisetujui((n) => n + 1);
      setToastMsg(
        `Profil ${item.nama} (${item.prodi} '${String(item.angkatan).slice(2)}) ditandai disetujui.`
      );
    } else {
      setToastMsg(`Permintaan ${item.nama} ditandai untuk pemeriksaan ulang oleh korwil.`);
    }

    fetch('/api/pendaftaran', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: item.id,
        status: setuju ? 'disetujui' : 'ditolak',
      }),
    }).catch(() => {});
  };

  const togglePresensi = (id: string) => {
    setAgendaList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, presensiTerbuka: !a.presensiTerbuka } : a))
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
        jenis: 'Kopdar Wilayah',
        kapasitas: 50,
        terdaftarCount: 1,
        presensiTerbuka: false,
      },
      ...prev,
    ]);
    setToastMsg(`Jadwal "${judulAgenda.trim()}" ditambahkan ke daftar (${DEMO_BADGE_LABEL}).`);
    setJudulAgenda('');
    setTanggalAgenda('');
    setLokasiAgenda('');
    setAgendaOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow page-grain-base max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm text-[#475569] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-medium">Kelola Pendaftaran</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/pendaftaran?format=csv"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Rekap CSV
            </a>
            {IS_DEMO_MODE && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-xs font-semibold">
                {DEMO_BADGE_LABEL}
              </span>
            )}
          </div>
        </nav>

        <header className="space-y-2">
          <span className="inline-block text-sm font-semibold text-[#92400E]">
            Koordinasi Pengurus Jabodetabek
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#0C2340]">
            Kelola Pendaftaran &amp; Jadwal Kopdar
          </h1>
          <p className="text-base text-[#475569]">
            Simulasi alur pengurus untuk meninjau pendaftar baru serta menyusun jadwal kopdar per wilayah.
          </p>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Ringkasan demo">
          <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5">
            <span className="block text-sm font-medium text-[#475569]">Menunggu Verifikasi</span>
            <span className="block text-2xl font-bold text-[#0C2340] mt-1">{antrean.length}</span>
          </div>
          <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5">
            <span className="block text-sm font-medium text-[#475569]">Anggota Contoh</span>
            <span className="block text-2xl font-bold text-[#0C2340] mt-1">{totalDisetujui.toLocaleString('id-ID')}</span>
          </div>
          <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5">
            <span className="block text-sm font-medium text-[#475569]">Jadwal Kopdar</span>
            <span className="block text-2xl font-bold text-[#0C2340] mt-1">{agendaList.length}</span>
          </div>
          <div className="bg-white border border-[#0C2340]/12 rounded-xl p-5">
            <span className="block text-sm font-medium text-[#475569]">Cakupan Wilayah</span>
            <span className="block text-2xl font-bold text-[#0C2340] mt-1">{WILAYAH_JABODETABEK.length} Wilayah</span>
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
              className="min-h-[44px] px-2 text-xs font-semibold text-[#475569] hover:text-[#0C2340] cursor-pointer"
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
            { id: 'verifikasi', label: 'Antrean Verifikasi', badge: antrean.length },
            { id: 'agenda', label: 'Jadwal Kopdar', badge: agendaList.length },
            { id: 'wilayah', label: 'Daftar Wilayah' },
          ]}
        />

        {activeTab === 'verifikasi' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0C2340]">
              Verifikasi Pendaftaran Alumni Baru ({DEMO_BADGE_LABEL})
            </h2>

            {antrean.length === 0 ? (
              <div className="bg-white border border-[#0C2340]/12 rounded-xl p-10 text-center space-y-2">
                <p className="font-semibold text-[#0C2340]">Tidak ada antrean pendaftar contoh.</p>
                <button
                  type="button"
                  onClick={() => setAntrean(DEMO_ANTREAN)}
                  className="mt-2 inline-flex items-center min-h-[44px] px-4 py-2 rounded-lg bg-[#F3F1EA] text-xs font-semibold text-[#0C2340] cursor-pointer"
                >
                  Muat Ulang Data Contoh
                </button>
              </div>
            ) : (
              <div className="bg-white border border-[#0C2340]/12 rounded-2xl divide-y divide-[#0C2340]/10 overflow-hidden shadow-xs">
                {antrean.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#0C2340]">{item.nama}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#F3F1EA] text-[#0C2340] font-medium">
                          {item.prodi} &apos;{String(item.angkatan).slice(2)}
                        </span>
                      </div>
                      <p className="text-base text-[#475569]">
                        {item.pekerjaan} · Domisili <span className="font-medium text-[#0C2340]">{item.wilayah}</span>
                      </p>
                      <span className="block text-xs text-[#475569]">Mendaftar {item.tanggalDaftar}</span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleVerifikasi(item, false)}
                        className="min-h-[44px] px-3.5 py-2 rounded-lg border border-[#0C2340]/15 hover:border-red-300 text-xs font-semibold text-[#475569] hover:text-red-700 transition-colors cursor-pointer"
                      >
                        Tinjau Ulang
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerifikasi(item, true)}
                        className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Setujui Anggota
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'agenda' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#0C2340]">Daftar Jadwal Kopdar</h2>
              <button
                type="button"
                onClick={() => setAgendaOpen(true)}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Buat Jadwal Kopdar Baru
              </button>
            </div>

            <div className="bg-white border border-[#0C2340]/12 rounded-2xl divide-y divide-[#0C2340]/10 overflow-hidden shadow-xs">
              {agendaList.map((ag) => (
                <div
                  key={ag.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#0C2340]">{ag.judul}</h3>
                    <p className="text-base text-[#475569]">
                      {ag.tanggalWIB} · {ag.lokasi} ({ag.wilayah})
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePresensi(ag.id)}
                    className={`inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      ag.presensiTerbuka
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-[#F3F1EA] text-[#0C2340] hover:bg-[#E7E3D7]'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    {ag.presensiTerbuka ? 'Presensi Aktif' : 'Buka Presensi'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'wilayah' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0C2340]">Sembilan Wilayah Jabodetabek</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {WILAYAH_JABODETABEK.map((reg) => (
                <div key={reg.id} className="bg-white border border-[#0C2340]/12 rounded-xl p-5 space-y-2">
                  <h3 className="text-base font-bold text-[#0C2340]">{reg.nama}</h3>
                  <span className="block text-sm font-medium text-[#92400E]">{reg.provinsi}</span>
                  <p className="text-base text-[#475569] leading-[1.5]">{reg.cakupan}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Dialog open={agendaOpen} onOpenChange={setAgendaOpen}>
        <DialogContent className="bg-white border border-[#0C2340]/15 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0C2340]">
              Tambah Jadwal Kopdar ({DEMO_BADGE_LABEL})
            </DialogTitle>
            <DialogDescription className="text-sm text-[#475569]">
              Simulasi penambahan agenda pertemuan alumni ke daftar kegiatan wilayah.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTambahAgenda} className="space-y-4 mt-2">
            <div>
              <label htmlFor="admin-judul-kopdar" className="block text-sm font-medium text-[#0C2340] mb-1">
                Nama Kegiatan *
              </label>
              <input
                id="admin-judul-kopdar"
                type="text"
                required
                placeholder="Misalnya: Kopdar Alumni UMS Bekasi Barat"
                value={judulAgenda}
                onChange={(e) => setJudulAgenda(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-base text-[#0C2340]"
              />
            </div>
            <div>
              <label htmlFor="admin-tanggal-kopdar" className="block text-sm font-medium text-[#0C2340] mb-1">
                Hari, Tanggal &amp; Jam *
              </label>
              <input
                id="admin-tanggal-kopdar"
                type="text"
                required
                placeholder="Misalnya: Sabtu, 19 Desember 2026 · 10.00 WIB"
                value={tanggalAgenda}
                onChange={(e) => setTanggalAgenda(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-base text-[#0C2340]"
              />
            </div>
            <div>
              <label htmlFor="admin-lokasi-kopdar" className="block text-sm font-medium text-[#0C2340] mb-1">
                Lokasi Pertemuan *
              </label>
              <input
                id="admin-lokasi-kopdar"
                type="text"
                required
                placeholder="Misalnya: Kafe Sekitar Stasiun Bekasi"
                value={lokasiAgenda}
                onChange={(e) => setLokasiAgenda(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-base text-[#0C2340]"
              />
            </div>
            <div>
              <label htmlFor="admin-wilayah-kopdar" className="block text-sm font-medium text-[#0C2340] mb-1">
                Wilayah Jabodetabek
              </label>
              <select
                id="admin-wilayah-kopdar"
                value={wilayahAgenda}
                onChange={(e) => setWilayahAgenda(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 text-base text-[#0C2340]"
              >
                {WILAYAH_JABODETABEK.map((r) => (
                  <option key={r.id} value={r.nama}>
                    {r.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAgendaOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#F3F1EA] text-[#0C2340] text-sm font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#16325C] cursor-pointer"
              >
                Simpan Jadwal
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

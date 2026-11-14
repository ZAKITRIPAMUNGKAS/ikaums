'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/components/Navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { WILAYAH_JABODETABEK, FAKULTAS_PRODI_UMS, ANGKATAN_OPTIONS, normalizeIndonesianWhatsApp } from '@/data/ums-prodi';
import {
  CheckCircle2,
  Plus,
  Download,
  Users,
  Calendar,
  Settings,
  ShieldCheck,
  Trash2,
  Save,
  UserPlus,
  Phone,
  Mail,
  LogOut,
  MapPin,
  Search,
  Briefcase,
  Loader2,
} from 'lucide-react';
import type { AgendaItem, PengurusData, KomunitasSettings } from '@/lib/cms-store';
import { type LokerItem, DEFAULT_LOKERS } from '@/data/loker';

interface PendaftarItem {
  id: string;
  namaLengkap: string;
  angkatan: number;
  prodi: string;
  wilayah: string;
  whatsapp: string;
  email?: string;
  pekerjaan?: string;
  perusahaan?: string;
  siapMentoring: boolean;
  tampilDiDirektori: boolean;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  createdAt: string;
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pendaftar' | 'agenda' | 'loker' | 'pengurus' | 'settings'>('pendaftar');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Data Pendaftar
  const [pendaftarList, setPendaftarList] = useState<PendaftarItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'semua' | 'menunggu' | 'disetujui' | 'ditolak'>('semua');
  const [wilayahFilter, setWilayahFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 2. Data Agenda / Kopdar
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);

  // 3. Data Loker / Peluang Karier
  const [lokerList, setLokerList] = useState<LokerItem[]>(DEFAULT_LOKERS);
  const [lokerSearch, setLokerSearch] = useState<string>('');
  const [lokerWilayahFilter, setLokerWilayahFilter] = useState<string>('semua');

  // 4. Data Pengurus & Korwil
  const [pengurusData, setPengurusData] = useState<PengurusData | null>(null);

  // 5. Data Settings Komunitas
  const [settingsData, setSettingsData] = useState<KomunitasSettings | null>(null);

  // Modals
  const [manualAlumniOpen, setManualAlumniOpen] = useState(false);
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [lokerModalOpen, setLokerModalOpen] = useState(false);

  // Form State: Tambah Loker Baru
  const [newLoker, setNewLoker] = useState<{
    posisi: string;
    perusahaan: string;
    industri: string;
    wilayah: string;
    tipeKerja: LokerItem['tipeKerja'];
    sistemKerja: LokerItem['sistemKerja'];
    gajiPerkiraan: string;
    alumniRujukan: string;
    kualifikasi: string;
    deskripsi: string;
    kontakLamar: string;
    linkLamar: string;
    status: LokerItem['status'];
  }>({
    posisi: '',
    perusahaan: '',
    industri: 'Teknologi Informasi & Software',
    wilayah: 'Jakarta Selatan',
    tipeKerja: 'Penuh Waktu',
    sistemKerja: 'Hybrid',
    gajiPerkiraan: '',
    alumniRujukan: '',
    kualifikasi: '',
    deskripsi: '',
    kontakLamar: '',
    linkLamar: '',
    status: 'Aktif',
  });

  // Form State: Tambah Alumni Manual
  const [newAlumni, setNewAlumni] = useState({
    namaLengkap: '',
    angkatan: 2020,
    prodi: 'Informatika',
    wilayah: 'Jakarta Selatan',
    whatsapp: '',
    email: '',
    pekerjaan: '',
    perusahaan: '',
    siapMentoring: false,
    tampilDiDirektori: true,
    status: 'disetujui' as const,
  });

  // Form State: Tambah Agenda Baru
  const [newAgenda, setNewAgenda] = useState({
    judul: '',
    jenis: 'Kopdar Wilayah',
    tanggalWIB: '',
    jamWIB: '09.00 - 12.00 WIB',
    wilayah: 'Jakarta Selatan',
    lokasi: '',
    kapasitas: 50,
    penanggungJawab: 'Panitia Wilayah',
  });

  // Notifikasi Toast Helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Muat Data Pendaftar & CMS Content
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch pendaftar
      const resPendaftar = await fetch('/api/pendaftaran');
      const dataPendaftar = await resPendaftar.json();
      if (dataPendaftar && Array.isArray(dataPendaftar.items)) {
        setPendaftarList(dataPendaftar.items);
      }

      // Fetch CMS Content (Agenda, Pengurus, Settings, Lokers)
      const resContent = await fetch('/api/admin/content');
      const dataContent = await resContent.json();
      if (dataContent) {
        if (Array.isArray(dataContent.agendas)) {
          setAgendaList(dataContent.agendas);
        }
        if (Array.isArray(dataContent.lokers) && dataContent.lokers.length > 0) {
          setLokerList(dataContent.lokers);
        }
        if (dataContent.pengurus) {
          setPengurusData(dataContent.pengurus);
        }
        if (dataContent.settings) {
          setSettingsData(dataContent.settings);
        }
      }
    } catch {
      showToast('Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const initData = async () => {
      try {
        const [resPendaftar, resContent] = await Promise.all([
          fetch('/api/pendaftaran'),
          fetch('/api/admin/content'),
        ]);
        const dataPendaftar = await resPendaftar.json();
        const dataContent = await resContent.json();

        if (!isSubscribed) return;

        if (dataPendaftar && Array.isArray(dataPendaftar.items)) {
          setPendaftarList(dataPendaftar.items);
        }
        if (dataContent) {
          if (Array.isArray(dataContent.agendas)) {
            setAgendaList(dataContent.agendas);
          }
          if (Array.isArray(dataContent.lokers) && dataContent.lokers.length > 0) {
            setLokerList(dataContent.lokers);
          }
          if (dataContent.pengurus) {
            setPengurusData(dataContent.pengurus);
          }
          if (dataContent.settings) {
            setSettingsData(dataContent.settings);
          }
        }
      } catch {
        // Abaikan atau tampilkan pesan kesalahan jika diperlukan
      }
    };

    void initData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Handler: Verifikasi Status Pendaftar
  const handleUpdateStatus = async (id: string, status: 'disetujui' | 'ditolak' | 'menunggu') => {
    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setPendaftarList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        showToast(`Status alumni berhasil diubah menjadi: ${status}.`);
      } else {
        showToast('Gagal memperbarui status pendaftar.');
      }
    } catch {
      showToast('Terjadi kendala jaringan.');
    }
  };

  // Handler: Simpan Alumni Manual
  const handleSaveManualAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWa = normalizeIndonesianWhatsApp(newAlumni.whatsapp);
    if (!cleanWa) {
      showToast('Nomor WhatsApp Indonesia tidak valid.');
      return;
    }

    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAlumni,
          whatsapp: cleanWa,
          agreeConsent: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Data alumni berhasil ditambahkan.');
        setManualAlumniOpen(false);
        setNewAlumni({
          namaLengkap: '',
          angkatan: 2020,
          prodi: 'Informatika',
          wilayah: 'Jakarta Selatan',
          whatsapp: '',
          email: '',
          pekerjaan: '',
          perusahaan: '',
          siapMentoring: false,
          tampilDiDirektori: true,
          status: 'disetujui',
        });
        loadData();
      } else {
        showToast(data.error || 'Gagal menyimpan data alumni.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  // Handler: Simpan Agenda Baru
  const handleSaveAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgenda.judul.trim() || !newAgenda.tanggalWIB.trim() || !newAgenda.lokasi.trim()) {
      showToast('Judul, tanggal, dan lokasi agenda wajib diisi.');
      return;
    }

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'agenda',
          data: newAgenda,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Jadwal kopdar baru berhasil disimpan.');
        setAgendaModalOpen(false);
        setNewAgenda({
          judul: '',
          jenis: 'Kopdar Wilayah',
          tanggalWIB: '',
          jamWIB: '09.00 - 12.00 WIB',
          wilayah: 'Jakarta Selatan',
          lokasi: '',
          kapasitas: 50,
          penanggungJawab: 'Panitia Wilayah',
        });
        loadData();
      } else {
        showToast(data.error || 'Gagal menyimpan jadwal.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  // Handler: Hapus Agenda
  const handleDeleteAgenda = async (id: string) => {
    if (!confirm('Yakin ingin menghapus jadwal kegiatan ini?')) return;
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'agenda-delete',
          id,
        }),
      });
      if (res.ok) {
        showToast('Jadwal kegiatan berhasil dihapus.');
        setAgendaList((prev) => prev.filter((a) => a.id !== id));
      } else {
        showToast('Gagal menghapus jadwal.');
      }
    } catch {
      showToast('Terjadi kesalahan.');
    }
  };

  // Handler: Simpan Loker Baru
  const handleSaveLoker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kualifikasiArray = newLoker.kualifikasi
        .split('\n')
        .map((k) => k.replace(/^[•\-\s]+/, '').trim())
        .filter(Boolean);

      const dataToSend = {
        ...newLoker,
        kualifikasi: kualifikasiArray.length > 0 ? kualifikasiArray : ['Kualifikasi relevan bagi alumni'],
        gajiPerkiraan: newLoker.gajiPerkiraan.trim() || undefined,
        alumniRujukan: newLoker.alumniRujukan.trim() || undefined,
        linkLamar: newLoker.linkLamar.trim() || undefined,
      };

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'loker',
          data: dataToSend,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.item) {
          setLokerList((prev) => [json.item, ...prev]);
        } else {
          await loadData();
        }
        setLokerModalOpen(false);
        setNewLoker({
          posisi: '',
          perusahaan: '',
          industri: 'Teknologi Informasi & Software',
          wilayah: 'Jakarta Selatan',
          tipeKerja: 'Penuh Waktu',
          sistemKerja: 'Hybrid',
          gajiPerkiraan: '',
          alumniRujukan: '',
          kualifikasi: '',
          deskripsi: '',
          kontakLamar: '',
          linkLamar: '',
          status: 'Aktif',
        });
        showToast('Info lowongan kerja berhasil disimpan dan diterbitkan.');
      } else {
        showToast('Gagal menerbitkan lowongan kerja.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  // Handler: Hapus Loker
  const handleDeleteLoker = async (id: string) => {
    if (!confirm('Yakin ingin menghapus info lowongan kerja ini?')) return;
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'loker-delete',
          id,
        }),
      });
      if (res.ok) {
        setLokerList((prev) => prev.filter((item) => item.id !== id));
        showToast('Info lowongan kerja berhasil dihapus.');
      } else {
        showToast('Gagal menghapus lowongan kerja.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  // Handler: Simpan Data Pengurus
  const handleSavePengurus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pengurusData) return;

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pengurus',
          data: pengurusData,
        }),
      });
      if (res.ok) {
        showToast('Susunan pengurus dan 9 koordinator wilayah berhasil disimpan.');
      } else {
        showToast('Gagal menyimpan data pengurus.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  // Handler: Simpan Pengaturan Komunitas
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsData) return;

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'settings',
          data: settingsData,
        }),
      });
      if (res.ok) {
        showToast('Pengaturan informasi kontak & organisasi berhasil disimpan.');
      } else {
        showToast('Gagal menyimpan pengaturan.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  // Handler: Keluar Sesi Admin
  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/masuk');
  };

  // Filter pendaftar
  const filteredPendaftar = pendaftarList.filter((item) => {
    if (statusFilter !== 'semua' && item.status !== statusFilter) return false;
    if (wilayahFilter !== 'semua' && item.wilayah !== wilayahFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.namaLengkap.toLowerCase().includes(q);
      const matchProdi = item.prodi.toLowerCase().includes(q);
      const matchAngkatan = String(item.angkatan).includes(q);
      const matchWilayah = item.wilayah.toLowerCase().includes(q);
      const matchPekerjaan = item.pekerjaan?.toLowerCase().includes(q);
      return matchName || matchProdi || matchAngkatan || matchWilayah || matchPekerjaan;
    }
    return true;
  });

  const countMenunggu = pendaftarList.filter((p) => p.status === 'menunggu').length;
  const countDisetujui = pendaftarList.filter((p) => p.status === 'disetujui').length;

  // Filter loker
  const filteredLokers = lokerList.filter((item) => {
    if (lokerWilayahFilter !== 'semua' && item.wilayah !== lokerWilayahFilter) return false;
    if (lokerSearch.trim()) {
      const q = lokerSearch.toLowerCase();
      const matchPosisi = item.posisi.toLowerCase().includes(q);
      const matchPerusahaan = item.perusahaan.toLowerCase().includes(q);
      const matchIndustri = item.industri.toLowerCase().includes(q);
      const matchWilayah = item.wilayah.toLowerCase().includes(q);
      const matchAlumni = item.alumniRujukan?.toLowerCase().includes(q);
      return matchPosisi || matchPerusahaan || matchIndustri || matchWilayah || matchAlumni;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        {/* Navigasi Breadcrumb & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <nav aria-label="Breadcrumb" className="text-sm text-[#475569] flex items-center gap-2">
            <Link href="/" className="hover:text-[#0C2340] transition-colors inline-flex items-center min-h-[44px]">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0C2340] font-semibold">Pusat Kelola Data Organisasi</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="/api/pendaftaran?format=csv"
              download
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-[#0C2340] text-xs sm:text-sm font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh CSV
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-lg text-red-700 hover:bg-red-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar Sesi
            </button>
          </div>
        </div>

        {/* Header Dashboard */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#92400E] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#92400E]" />
              <span>Sekretariat &amp; Koordinasi Wilayah</span>
              {isLoading && (
                <span className="inline-flex items-center gap-1 text-[#475569] font-normal normal-case">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#92400E]" />
                  <span>Memperbarui data...</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
              Pusat Data IKA UMS Jabodetabek
            </h1>
            <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-[1.6]">
              Kelola verifikasi alumni baru, jadwal kopdar, info lowongan kerja, struktur 9 korwil, serta pengaturan kontak resmi organisasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setManualAlumniOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              + Tambah Alumni
            </button>
            <button
              type="button"
              onClick={() => setAgendaModalOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#92400E] hover:bg-[#78350F] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              + Jadwal Kopdar
            </button>
            <button
              type="button"
              onClick={() => setLokerModalOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#047857] hover:bg-[#065F46] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Briefcase className="w-4 h-4" />
              + Info Loker
            </button>
          </div>
        </header>

        {/* Kartu Statistik Cepat */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" aria-label="Ringkasan data">
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <span className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">Menunggu Verifikasi</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2340]">{countMenunggu}</span>
              <span className="text-xs text-[#92400E] font-medium">alumni baru</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <span className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">Total Anggota Masuk</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2340]">{pendaftarList.length}</span>
              <span className="text-xs text-emerald-700 font-medium">({countDisetujui} terverifikasi)</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <span className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">Jadwal Kopdar Aktif</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2340]">{agendaList.length}</span>
              <span className="text-xs text-[#475569]">agenda wilayah</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <span className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">Info Loker Aktif</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#047857]">{lokerList.length}</span>
              <span className="text-xs text-[#475569]">lowongan terbuka</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs col-span-2 md:col-span-1">
            <span className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">Cakupan Wilayah</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2340]">{WILAYAH_JABODETABEK.length}</span>
              <span className="text-xs text-[#475569]">Kota &amp; Kabupaten</span>
            </div>
          </div>
        </section>

        {/* Toast Notifikasi */}
        {toastMsg && (
          <div
            role="status"
            className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-3 text-sm text-emerald-950 flex items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="font-medium">{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold px-2 py-1"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Tab Navigasi Pengelolaan */}
        <div className="border-b border-slate-200 flex overflow-x-auto gap-2 sm:gap-4 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('pendaftar')}
            className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'pendaftar'
                ? 'border-[#0C2340] text-[#0C2340]'
                : 'border-transparent text-[#475569] hover:text-[#0C2340]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pendaftaran &amp; Anggota</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-[#0C2340]">
              {pendaftarList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'agenda'
                ? 'border-[#0C2340] text-[#0C2340]'
                : 'border-transparent text-[#475569] hover:text-[#0C2340]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal Kopdar &amp; Agenda</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-[#0C2340]">
              {agendaList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('loker')}
            className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'loker'
                ? 'border-[#0C2340] text-[#0C2340]'
                : 'border-transparent text-[#475569] hover:text-[#0C2340]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Info Lowongan Kerja</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 font-bold">
              {lokerList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pengurus')}
            className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'pengurus'
                ? 'border-[#0C2340] text-[#0C2340]'
                : 'border-transparent text-[#475569] hover:text-[#0C2340]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pengurus &amp; 9 Korwil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-[#0C2340] text-[#0C2340]'
                : 'border-transparent text-[#475569] hover:text-[#0C2340]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Kontak &amp; Komunitas</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PENDAFTARAN & ANGGOTA                                              */}
        {/* ========================================================================= */}
        {activeTab === 'pendaftar' && (
          <div className="space-y-6">
            {/* Filter Bar & Search */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama alumni, prodi, angkatan, atau pekerjaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full min-h-[42px] pl-10 pr-4 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/15"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'semua' | 'menunggu' | 'disetujui' | 'ditolak')}
                  className="min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:ring-2 focus:ring-[#0C2340]/15 cursor-pointer font-medium"
                >
                  <option value="semua">Semua Status</option>
                  <option value="menunggu">Menunggu Verifikasi ({countMenunggu})</option>
                  <option value="disetujui">Disetujui ({countDisetujui})</option>
                  <option value="ditolak">Ditolak / Review</option>
                </select>

                <select
                  value={wilayahFilter}
                  onChange={(e) => setWilayahFilter(e.target.value)}
                  className="min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:ring-2 focus:ring-[#0C2340]/15 cursor-pointer font-medium"
                >
                  <option value="semua">Semua 9 Wilayah</option>
                  {WILAYAH_JABODETABEK.map((w) => (
                    <option key={w.id} value={w.nama}>
                      {w.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Daftar Pendaftar */}
            {filteredPendaftar.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
                <Users className="w-10 h-10 text-[#475569]/60 mx-auto" />
                <h3 className="text-lg font-bold text-[#0C2340]">Tidak Ada Data Pendaftar</h3>
                <p className="text-sm text-[#475569] max-w-md mx-auto">
                  Belum ada alumni yang cocok dengan filter yang dipilih. Anda dapat menambahkan alumni secara manual melalui tombol di bawah.
                </p>
                <button
                  type="button"
                  onClick={() => setManualAlumniOpen(true)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#08182E] transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Tambah Alumni Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPendaftar.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-[#0C2340]/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-[#0C2340]">
                          {item.namaLengkap}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#0C2340]">
                          {item.prodi} &apos;{String(item.angkatan).slice(2)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            item.status === 'disetujui'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'menunggu'
                              ? 'bg-amber-100 text-[#92400E]'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status === 'disetujui'
                            ? 'Terverifikasi'
                            : item.status === 'menunggu'
                            ? 'Menunggu'
                            : 'Pemeriksaan Ulang'}
                        </span>
                        {item.siapMentoring && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Mentor
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#475569]">
                        <span className="inline-flex items-center gap-1 font-medium text-[#0C2340]">
                          <MapPin className="w-3.5 h-3.5 text-[#92400E]" />
                          {item.wilayah}
                        </span>
                        {item.pekerjaan && (
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-[#475569]" />
                            {item.pekerjaan} {item.perusahaan ? `di ${item.perusahaan}` : ''}
                          </span>
                        )}
                        <a
                          href={`https://wa.me/${item.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {item.whatsapp}
                        </a>
                        {item.email && (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {item.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Aksi Verifikasi */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                      {item.status !== 'disetujui' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(item.id, 'disetujui')}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Setujui
                        </button>
                      )}
                      {item.status !== 'ditolak' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(item.id, 'ditolak')}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-[#0C2340] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                        >
                          Review Ulang
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: JADWAL KOPDAR & AGENDA                                             */}
        {/* ========================================================================= */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0C2340]">Daftar Jadwal Kopdar &amp; Temu Alumni</h2>
                <p className="text-sm text-[#475569]">
                  Jadwal di bawah ini tampil di halaman publik Jadwal Kopdar (/kegiatan) dan Beranda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAgendaModalOpen(true)}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                + Tambah Jadwal Baru
              </button>
            </div>

            {agendaList.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
                <Calendar className="w-10 h-10 text-[#475569]/60 mx-auto" />
                <h3 className="text-lg font-bold text-[#0C2340]">Belum Ada Jadwal Kopdar</h3>
                <p className="text-sm text-[#475569] max-w-md mx-auto">
                  Buat jadwal kopdar pertama atau sesi mentoring alumni untuk wilayah Jabodetabek.
                </p>
                <button
                  type="button"
                  onClick={() => setAgendaModalOpen(true)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#08182E] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Buat Jadwal Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agendaList.map((agenda) => (
                  <div
                    key={agenda.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#92400E]">
                          {agenda.jenis}
                        </span>
                        <span className="text-xs text-[#475569] font-medium">
                          Maks {agenda.kapasitas} Peserta
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0C2340] leading-snug">
                        {agenda.judul}
                      </h3>
                      <div className="space-y-1.5 text-xs sm:text-sm text-[#475569] pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#92400E] shrink-0" />
                          <span>{agenda.tanggalWIB} {agenda.jamWIB ? `(${agenda.jamWIB})` : ''}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#92400E] shrink-0 mt-0.5" />
                          <span><strong>{agenda.wilayah}</strong> · {agenda.lokasi}</span>
                        </div>
                        {agenda.penanggungJawab && (
                          <div className="text-xs text-[#475569] pt-1">
                            PJ: <strong>{agenda.penanggungJawab}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleDeleteAgenda(agenda.id)}
                        className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1 rounded-lg text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus Jadwal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INFO LOWONGAN KERJA & PELUANG ALUMNI                               */}
        {/* ========================================================================= */}
        {activeTab === 'loker' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0C2340]">Daftar Lowongan Kerja &amp; Peluang Bisnis</h2>
                <p className="text-sm text-[#475569]">
                  Kelola informasi karier alumni. Lowongan aktif langsung tampil di halaman publik (/peluang#loker).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLokerModalOpen(true)}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-[#F59E0B]" />
                + Tambah Info Loker
              </button>
            </div>

            {/* Filter Bar Loker */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari lowongan berdasarkan posisi, perusahaan, atau rujukan..."
                  value={lokerSearch}
                  onChange={(e) => setLokerSearch(e.target.value)}
                  className="w-full min-h-[42px] pl-10 pr-4 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/15"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={lokerWilayahFilter}
                  onChange={(e) => setLokerWilayahFilter(e.target.value)}
                  className="min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:ring-2 focus:ring-[#0C2340]/15 cursor-pointer font-medium"
                >
                  <option value="semua">Semua Wilayah</option>
                  {WILAYAH_JABODETABEK.map((w) => (
                    <option key={w.id} value={w.nama}>
                      {w.nama}
                    </option>
                  ))}
                  <option value="Jabodetabek / Remote">Jabodetabek / Remote</option>
                </select>
              </div>
            </div>

            {/* List Lowongan */}
            {filteredLokers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-[#475569]/60 mx-auto" />
                <h3 className="text-lg font-bold text-[#0C2340]">Belum Ada Lowongan yang Cocok</h3>
                <p className="text-sm text-[#475569] max-w-md mx-auto">
                  Belum ada lowongan yang sesuai kriteria pencarian. Kamu dapat menambah info loker baru untuk alumni UMS.
                </p>
                <button
                  type="button"
                  onClick={() => setLokerModalOpen(true)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#08182E] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#F59E0B]" />
                  <span>Terbitkan Loker Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLokers.map((loker) => (
                  <div
                    key={loker.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-[#0C2340]/30 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {loker.tipeKerja} • {loker.sistemKerja}
                        </span>
                        <span className="text-xs text-[#475569]">
                          {loker.wilayah}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">
                          {loker.posisi}
                        </h3>
                        <p className="text-sm font-semibold text-[#92400E]">
                          {loker.perusahaan}
                        </p>
                        <p className="text-xs text-[#475569] mt-0.5">
                          Bidang: {loker.industri}
                        </p>
                      </div>

                      {loker.alumniRujukan && (
                        <div className="text-xs bg-slate-100 p-2.5 rounded-lg text-[#0C2340]">
                          <span className="font-semibold">Rujukan Alumni:</span> {loker.alumniRujukan}
                        </div>
                      )}

                      <div className="text-xs text-[#475569] space-y-1">
                        <div>
                          <strong>Kontak Lamar:</strong> {loker.kontakLamar}
                        </div>
                        {loker.gajiPerkiraan && (
                          <div>
                            <strong>Kompensasi:</strong> {loker.gajiPerkiraan}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <Link
                        href="/peluang#loker"
                        target="_blank"
                        className="text-xs text-[#0C2340] hover:underline font-semibold"
                      >
                        Lihat di Halaman Publik →
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteLoker(loker.id)}
                        className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1 rounded-lg text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus Loker
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PENGURUS & 9 KORWIL                                                */}
        {/* ========================================================================= */}
        {activeTab === 'pengurus' && pengurusData && (
          <form onSubmit={handleSavePengurus} className="space-y-8">
            {/* 1. Pengurus Harian */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">1. Pengurus Harian Wilayah</h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Tampil pada halaman Pengurus &amp; Kontak (/kepengurusan).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Dewan Pembina &amp; Penasihat
                  </label>
                  <input
                    type="text"
                    value={pengurusData.dewanPembina}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, dewanPembina: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Contoh: Nama Tokoh Senior Alumni UMS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Ketua Wilayah Jabodetabek
                  </label>
                  <input
                    type="text"
                    value={pengurusData.ketuaWilayah}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, ketuaWilayah: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Contoh: Nama Ketua Pengurus & Angkatan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Wakil Ketua Wilayah
                  </label>
                  <input
                    type="text"
                    value={pengurusData.wakilKetua}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, wakilKetua: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Contoh: Nama Wakil Ketua & Angkatan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Sekretaris Wilayah
                  </label>
                  <input
                    type="text"
                    value={pengurusData.sekretaris}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, sekretaris: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Contoh: Nama Sekretaris & Angkatan"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Bendahara Wilayah
                  </label>
                  <input
                    type="text"
                    value={pengurusData.bendahara}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, bendahara: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Contoh: Nama Bendahara & Angkatan"
                  />
                </div>
              </div>
            </div>

            {/* 2. Koordinator Bidang Kerja */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">2. Koordinator 4 Bidang Kerja</h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Koordinator penggerak program karier, usaha, kopdar, dan humas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Bidang Karier &amp; Mentoring
                  </label>
                  <input
                    type="text"
                    value={pengurusData.bidangKarier}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, bidangKarier: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Bidang Wirausaha &amp; Kemitraan
                  </label>
                  <input
                    type="text"
                    value={pengurusData.bidangUsaha}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, bidangUsaha: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Bidang Kopdar &amp; Kegiatan Sosial
                  </label>
                  <input
                    type="text"
                    value={pengurusData.bidangKopdar}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, bidangKopdar: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Bidang Humas &amp; Informasi
                  </label>
                  <input
                    type="text"
                    value={pengurusData.bidangHumas}
                    onChange={(e) =>
                      setPengurusData({ ...pengurusData, bidangHumas: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                  />
                </div>
              </div>
            </div>

            {/* 3. Koordinator 9 Wilayah Jabodetabek */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">3. Koordinator 9 Wilayah (Korwil)</h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Lengkapi nama koordinator, kontak WhatsApp, dan titik kumpul per kota/kabupaten.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WILAYAH_JABODETABEK.map((wil) => {
                  const current = pengurusData.korwil[wil.nama] || {
                    nama: '',
                    whatsapp: '',
                    titikKumpul: '',
                  };
                  return (
                    <div
                      key={wil.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                    >
                      <span className="text-sm font-bold text-[#0C2340] block border-b border-slate-200 pb-1.5">
                        {wil.nama}
                      </span>
                      <div>
                        <label className="block text-xs text-[#475569] mb-1">Nama Koordinator</label>
                        <input
                          type="text"
                          value={current.nama}
                          onChange={(e) => {
                            const updated = {
                              ...pengurusData.korwil,
                              [wil.nama]: { ...current, nama: e.target.value },
                            };
                            setPengurusData({ ...pengurusData, korwil: updated });
                          }}
                          placeholder="Nama & Angkatan"
                          className="w-full min-h-[38px] px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#475569] mb-1">Kontak WhatsApp</label>
                        <input
                          type="text"
                          value={current.whatsapp}
                          onChange={(e) => {
                            const updated = {
                              ...pengurusData.korwil,
                              [wil.nama]: { ...current, whatsapp: e.target.value },
                            };
                            setPengurusData({ ...pengurusData, korwil: updated });
                          }}
                          placeholder="081234567890"
                          className="w-full min-h-[38px] px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#475569] mb-1">Rencana Titik Kumpul</label>
                        <input
                          type="text"
                          value={current.titikKumpul}
                          onChange={(e) => {
                            const updated = {
                              ...pengurusData.korwil,
                              [wil.nama]: { ...current, titikKumpul: e.target.value },
                            };
                            setPengurusData({ ...pengurusData, korwil: updated });
                          }}
                          placeholder="Contoh: Tebet / BSD"
                          className="w-full min-h-[38px] px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-base font-semibold transition-colors cursor-pointer shadow-md"
              >
                <Save className="w-5 h-5" />
                Simpan Seluruh Data Pengurus
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KONTAK & PENGATURAN KOMUNITAS                                      */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && settingsData && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">
                  Informasi Resmi &amp; Kontak Sekretariat
                </h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Data ini ditampilkan pada Beranda, Footer, dan halaman Kebijakan Privasi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Nomor WhatsApp Resmi Sekretariat
                  </label>
                  <input
                    type="text"
                    value={settingsData.contactWhatsapp}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, contactWhatsapp: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Contoh: +62 812-xxxx-xxxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Alamat Email Resmi Sekretariat
                  </label>
                  <input
                    type="email"
                    value={settingsData.contactEmail}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, contactEmail: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="sekretariat@ikaums-jabodetabek.org"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Jadwal Kopdar Pertama Wilayah
                  </label>
                  <input
                    type="text"
                    value={settingsData.firstKopdarDate}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, firstKopdarDate: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Contoh: Sabtu, 28 November 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Lokasi Kopdar Pertama Wilayah
                  </label>
                  <input
                    type="text"
                    value={settingsData.firstKopdarLocation}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, firstKopdarLocation: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Contoh: Gedung Pertemuan Cilandak, Jakarta Selatan"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#0C2340] mb-1.5 uppercase">
                    Status Hubungan dengan PP IKA UMS Pusat
                  </label>
                  <input
                    type="text"
                    value={settingsData.ppIkaUmsStatus}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, ppIkaUmsStatus: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10"
                    placeholder="Dalam koordinasi dengan PP IKA UMS Pusat"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-base font-semibold transition-colors cursor-pointer shadow-md"
                >
                  <Save className="w-5 h-5" />
                  Simpan Pengaturan Organisasi
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH ALUMNI MANUAL                                             */}
      {/* ========================================================================= */}
      <Dialog open={manualAlumniOpen} onOpenChange={setManualAlumniOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 shadow-xl p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1.5 border-b border-slate-200 pb-3">
            <DialogTitle className="text-xl font-bold text-[#0C2340]">
              Tambah Data Alumni Manual
            </DialogTitle>
            <DialogDescription className="text-xs text-[#475569]">
              Gunakan untuk memasukkan alumni yang mendaftar secara offline, via WhatsApp, atau pendataan langsung.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveManualAlumni} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                Nama Lengkap (beserta gelar jika ada) *
              </label>
              <input
                type="text"
                required
                value={newAlumni.namaLengkap}
                onChange={(e) => setNewAlumni({ ...newAlumni, namaLengkap: e.target.value })}
                placeholder="Contoh: Ir. Budi Santoso, M.T."
                className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Angkatan *</label>
                <select
                  value={newAlumni.angkatan}
                  onChange={(e) => setNewAlumni({ ...newAlumni, angkatan: Number(e.target.value) })}
                  className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                >
                  {ANGKATAN_OPTIONS.map((th) => (
                    <option key={th} value={th}>
                      {th}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Wilayah Domisili *</label>
                <select
                  value={newAlumni.wilayah}
                  onChange={(e) => setNewAlumni({ ...newAlumni, wilayah: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                >
                  {WILAYAH_JABODETABEK.map((w) => (
                    <option key={w.id} value={w.nama}>
                      {w.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Program Studi UMS *</label>
              <select
                value={newAlumni.prodi}
                onChange={(e) => setNewAlumni({ ...newAlumni, prodi: e.target.value })}
                className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
              >
                {FAKULTAS_PRODI_UMS.flatMap((f) => f.prodi).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">No. WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={newAlumni.whatsapp}
                  onChange={(e) => setNewAlumni({ ...newAlumni, whatsapp: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Email (Opsional)</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={newAlumni.email}
                  onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Pekerjaan</label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={newAlumni.pekerjaan}
                  onChange={(e) => setNewAlumni({ ...newAlumni, pekerjaan: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Perusahaan / Usaha</label>
                <input
                  type="text"
                  placeholder="PT Nusantara / Wirausaha"
                  value={newAlumni.perusahaan}
                  onChange={(e) => setNewAlumni({ ...newAlumni, perusahaan: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#0C2340] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAlumni.siapMentoring}
                  onChange={(e) => setNewAlumni({ ...newAlumni, siapMentoring: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0C2340]"
                />
                Siap Menjadi Mentor
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#0C2340] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAlumni.tampilDiDirektori}
                  onChange={(e) => setNewAlumni({ ...newAlumni, tampilDiDirektori: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0C2340]"
                />
                Tampil di Direktori Anggota
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setManualAlumniOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 hover:bg-slate-100 text-[#0C2340]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-xs sm:text-sm font-semibold"
              >
                Simpan Alumni
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: TAMBAH JADWAL KOPDAR                                             */}
      {/* ========================================================================= */}
      <Dialog open={agendaModalOpen} onOpenChange={setAgendaModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 shadow-xl p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1.5 border-b border-slate-200 pb-3">
            <DialogTitle className="text-xl font-bold text-[#0C2340]">
              Buat Jadwal Kopdar Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-[#475569]">
              Agenda yang disimpan langsung terbit pada halaman Jadwal Kopdar publik (/kegiatan).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAgenda} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                Judul Kopdar / Pertemuan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kopdar Temu Santai Alumni UMS Jaksel"
                value={newAgenda.judul}
                onChange={(e) => setNewAgenda({ ...newAgenda, judul: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Jenis Kegiatan *</label>
                <select
                  value={newAgenda.jenis}
                  onChange={(e) => setNewAgenda({ ...newAgenda, jenis: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                >
                  <option value="Kopdar Wilayah">Kopdar Wilayah</option>
                  <option value="Mentoring Alumni">Mentoring Alumni</option>
                  <option value="Info Kerja & Usaha">Info Kerja &amp; Usaha</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Wilayah *</label>
                <select
                  value={newAgenda.wilayah}
                  onChange={(e) => setNewAgenda({ ...newAgenda, wilayah: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                >
                  {WILAYAH_JABODETABEK.map((w) => (
                    <option key={w.id} value={w.nama}>
                      {w.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Hari &amp; Tanggal *</label>
                <input
                  type="text"
                  required
                  placeholder="Sabtu, 28 Nov 2026"
                  value={newAgenda.tanggalWIB}
                  onChange={(e) => setNewAgenda({ ...newAgenda, tanggalWIB: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Waktu WIB</label>
                <input
                  type="text"
                  placeholder="09.00 - 12.00 WIB"
                  value={newAgenda.jamWIB}
                  onChange={(e) => setNewAgenda({ ...newAgenda, jamWIB: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                Lokasi Spesifik / Titik Temu *
              </label>
              <input
                type="text"
                required
                placeholder="Aula Pertemuan TB Simatupang / Kafe Tebet"
                value={newAgenda.lokasi}
                onChange={(e) => setNewAgenda({ ...newAgenda, lokasi: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Kapasitas Kursi</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={newAgenda.kapasitas}
                  onChange={(e) => setNewAgenda({ ...newAgenda, kapasitas: Number(e.target.value) })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">Penanggung Jawab</label>
                <input
                  type="text"
                  placeholder="Panitia Kopdar Jaksel"
                  value={newAgenda.penanggungJawab}
                  onChange={(e) => setNewAgenda({ ...newAgenda, penanggungJawab: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAgendaModalOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 hover:bg-slate-100 text-[#0C2340]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-xs sm:text-sm font-semibold"
              >
                Simpan &amp; Terbitkan
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: TAMBAH INFO LOKER BARU                                           */}
      {/* ========================================================================= */}
      <Dialog open={lokerModalOpen} onOpenChange={setLokerModalOpen}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1.5 border-b border-slate-200 pb-3">
            <DialogTitle className="text-xl font-bold text-[#0C2340]">
              Terbitkan Info Lowongan Kerja Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-[#475569]">
              Lowongan yang disimpan langsung tampil di halaman publik Mentoring &amp; Kerja (/peluang#loker).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveLoker} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Posisi Pekerjaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Frontend Developer"
                  value={newLoker.posisi}
                  onChange={(e) => setNewLoker({ ...newLoker, posisi: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Nama Perusahaan / Usaha *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Teknologi Bangsa"
                  value={newLoker.perusahaan}
                  onChange={(e) => setNewLoker({ ...newLoker, perusahaan: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Bidang Industri *
                </label>
                <select
                  value={newLoker.industri}
                  onChange={(e) => setNewLoker({ ...newLoker, industri: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                >
                  <option value="Teknologi Informasi & Software">Teknologi Informasi &amp; Software</option>
                  <option value="Konstruksi & Rekayasa Bangunan">Konstruksi &amp; Rekayasa</option>
                  <option value="Kesehatan, Farmasi & Klinik">Kesehatan &amp; Farmasi</option>
                  <option value="Keuangan, Pajak & Perbankan">Keuangan, Pajak &amp; Perbankan</option>
                  <option value="Sumber Daya Manusia & Rekrutmen">SDM &amp; Manajemen</option>
                  <option value="Hukum, Regulasi & Notaris">Hukum &amp; Legal</option>
                  <option value="Pendidikan, Riset & Bimbel">Pendidikan &amp; Bimbel</option>
                  <option value="Kreatif, Media & Komunikasi">Media &amp; Desain Kreatif</option>
                  <option value="Logistik, Ekspor & Perdagangan">Logistik &amp; Perdagangan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Wilayah Penempatan *
                </label>
                <select
                  value={newLoker.wilayah}
                  onChange={(e) => setNewLoker({ ...newLoker, wilayah: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                >
                  {WILAYAH_JABODETABEK.map((w) => (
                    <option key={w.id} value={w.nama}>
                      {w.nama}
                    </option>
                  ))}
                  <option value="Jabodetabek / Remote">Jabodetabek / Remote</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Tipe Pekerjaan *
                </label>
                <select
                  value={newLoker.tipeKerja}
                  onChange={(e) =>
                    setNewLoker({
                      ...newLoker,
                      tipeKerja: e.target.value as 'Penuh Waktu' | 'Paruh Waktu' | 'Magang' | 'Kontrak',
                    })
                  }
                  className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                >
                  <option value="Penuh Waktu">Penuh Waktu (Full-time)</option>
                  <option value="Paruh Waktu">Paruh Waktu (Part-time)</option>
                  <option value="Magang">Magang (Internship)</option>
                  <option value="Kontrak">Kontrak Proyek (Contract)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Sistem Kerja *
                </label>
                <select
                  value={newLoker.sistemKerja}
                  onChange={(e) =>
                    setNewLoker({
                      ...newLoker,
                      sistemKerja: e.target.value as 'On-site' | 'Hybrid' | 'Remote',
                    })
                  }
                  className="w-full min-h-[42px] px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                >
                  <option value="Hybrid">Hybrid (Sebagian Kantor / Rumah)</option>
                  <option value="On-site">On-site (Wajib di Kantor/Lokasi)</option>
                  <option value="Remote">Remote (Dari Mana Saja)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Perkiraan Gaji (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rp 7.000.000 - Rp 10.000.000"
                  value={newLoker.gajiPerkiraan}
                  onChange={(e) => setNewLoker({ ...newLoker, gajiPerkiraan: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Alumni UMS Rujukan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso (Informatika '18)"
                  value={newLoker.alumniRujukan}
                  onChange={(e) => setNewLoker({ ...newLoker, alumniRujukan: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                Kualifikasi &amp; Persyaratan (Pisahkan per baris) *
              </label>
              <textarea
                rows={3}
                required
                placeholder={"Contoh:\n- Minimal S1 Informatika / Sistem Informasi\n- Pengalaman React & Next.js minimal 1 tahun\n- Disiplin & terbiasa kerja tim"}
                value={newLoker.kualifikasi}
                onChange={(e) => setNewLoker({ ...newLoker, kualifikasi: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                Deskripsi Tanggung Jawab *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Tuliskan tugas harian, tantangan pekerjaan, serta fasilitas kerja..."
                value={newLoker.deskripsi}
                onChange={(e) => setNewLoker({ ...newLoker, deskripsi: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Email / Kontak Lamaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="hrd@kantor.com atau WA 0812..."
                  value={newLoker.kontakLamar}
                  onChange={(e) => setNewLoker({ ...newLoker, kontakLamar: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Tautan Karir Eksternal (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://perusahaan.com/karir"
                  value={newLoker.linkLamar}
                  onChange={(e) => setNewLoker({ ...newLoker, linkLamar: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setLokerModalOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 hover:bg-slate-100 text-[#0C2340]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-xs sm:text-sm font-semibold"
              >
                Simpan &amp; Terbitkan Loker
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

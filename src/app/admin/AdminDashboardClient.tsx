'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  LayoutTemplate,
  Pencil,
  MessageCircle,
  Camera,
  Eye,
  EyeOff,
  Globe,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react';
import type { AgendaItem, PengurusData, KomunitasSettings, LandingContent, BeritaItem } from '@/lib/cms-store';
import { type LokerItem } from '@/data/loker';

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

const adminFieldClass =
  'w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/10 focus:outline-hidden';

const adminLabelClass = 'block text-xs font-bold text-[#0C2340] mb-1.5 uppercase';

const BLANK_AGENDA = {
  judul: '',
  jenis: 'Kopdar Wilayah',
  tanggalWIB: '',
  jamWIB: '09.00 - 12.00 WIB',
  wilayah: 'Jakarta Selatan',
  lokasi: '',
  kapasitas: 50,
  penanggungJawab: 'Panitia Wilayah',
};

const BLANK_LOKER = {
  posisi: '',
  perusahaan: '',
  industri: 'Teknologi Informasi & Software',
  wilayah: 'Jakarta Selatan',
  tipeKerja: 'Penuh Waktu' as LokerItem['tipeKerja'],
  sistemKerja: 'Hybrid' as LokerItem['sistemKerja'],
  gajiPerkiraan: '',
  alumniRujukan: '',
  kualifikasi: '',
  deskripsi: '',
  kontakLamar: '',
  linkLamar: '',
  status: 'Aktif' as LokerItem['status'],
};

const BLANK_BERITA = {
  judul: '',
  kategori: 'Kopdar & Temu Alumni',
  tanggal: '',
  wilayah: 'Jakarta Pusat',
  ringkasan: '',
  konten: '',
  fotoUrl: '',
  captionFoto: '',
  penulis: 'Pengurus IKA UMS Jabodetabek',
  published: true,
};

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pendaftar' | 'agenda' | 'loker' | 'berita' | 'pengurus' | 'landing' | 'settings'>('pendaftar');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tab horizontal scroll support
  const tabScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkTabScroll = () => {
    const el = tabScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  };

  useEffect(() => {
    const timer = setTimeout(checkTabScroll, 150);
    window.addEventListener('resize', checkTabScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkTabScroll);
    };
  }, [activeTab]);

  const scrollTabs = (direction: 'left' | 'right') => {
    const el = tabScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -280 : 280,
      behavior: 'smooth',
    });
    setTimeout(checkTabScroll, 320);
  };

  // 1. Data Pendaftar
  const [pendaftarList, setPendaftarList] = useState<PendaftarItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'semua' | 'menunggu' | 'disetujui' | 'ditolak'>('semua');
  const [wilayahFilter, setWilayahFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 2. Data Agenda / Kopdar
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);

  // 3. Data Loker / Peluang Karier
  const [lokerList, setLokerList] = useState<LokerItem[]>([]);
  const [lokerSearch, setLokerSearch] = useState<string>('');
  const [lokerWilayahFilter, setLokerWilayahFilter] = useState<string>('semua');

  // 4. Data Dokumentasi & Berita
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [beritaSearch, setBeritaSearch] = useState<string>('');
  const [beritaKategoriFilter, setBeritaKategoriFilter] = useState<string>('semua');

  // 5. Data Pengurus & Korwil
  const [pengurusData, setPengurusData] = useState<PengurusData | null>(null);

  // 6. Data Settings Komunitas
  const [settingsData, setSettingsData] = useState<KomunitasSettings | null>(null);

  // 7. Data Konten Beranda (landing page)
  const [landingData, setLandingData] = useState<LandingContent | null>(null);

  // Modals
  const [manualAlumniOpen, setManualAlumniOpen] = useState(false);
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [lokerModalOpen, setLokerModalOpen] = useState(false);
  const [beritaModalOpen, setBeritaModalOpen] = useState(false);
  const [editingAgendaId, setEditingAgendaId] = useState<string | null>(null);
  const [editingLokerId, setEditingLokerId] = useState<string | null>(null);
  const [editingBeritaId, setEditingBeritaId] = useState<string | null>(null);
  const [fotoUploadLoading, setFotoUploadLoading] = useState(false);

  // Form State: Tambah/Ubah Berita
  const [newBerita, setNewBerita] = useState<typeof BLANK_BERITA>({ ...BLANK_BERITA });

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
    ...BLANK_LOKER,
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
  const [newAgenda, setNewAgenda] = useState({ ...BLANK_AGENDA });

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
        if (Array.isArray(dataContent.lokers)) {
          setLokerList(dataContent.lokers);
        }
        if (Array.isArray(dataContent.beritas)) {
          setBeritaList(dataContent.beritas);
        }
        if (dataContent.pengurus) {
          setPengurusData(dataContent.pengurus);
        }
        if (dataContent.settings) {
          setSettingsData(dataContent.settings);
        }
        if (dataContent.landing) {
          setLandingData(dataContent.landing);
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
          if (Array.isArray(dataContent.lokers)) {
            setLokerList(dataContent.lokers);
          }
          if (Array.isArray(dataContent.beritas)) {
            setBeritaList(dataContent.beritas);
          }
          if (dataContent.pengurus) {
            setPengurusData(dataContent.pengurus);
          }
          if (dataContent.settings) {
            setSettingsData(dataContent.settings);
          }
          if (dataContent.landing) {
            setLandingData(dataContent.landing);
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
        if (status === 'disetujui') {
          showToast('Status disetujui! Klik tombol "Kirim Info WA" untuk mengirim pesan ke alumni.');
        } else {
          showToast(`Status alumni berhasil diubah menjadi: ${status}.`);
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(errorData.error || 'Gagal memperbarui status pendaftar.');
      }
    } catch {
      showToast('Terjadi kendala jaringan.');
    }
  };

  // Handler: Hapus Data Pendaftar
  const handleDeletePendaftar = async (id: string, nama: string) => {
    if (!confirm(`Hapus data pendaftar "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPendaftarList((prev) => prev.filter((item) => item.id !== id));
        showToast('Data pendaftar berhasil dihapus.');
      } else {
        showToast('Gagal menghapus data pendaftar.');
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

  // Buka modal: tambah / ubah jadwal
  const openAgendaCreate = () => {
    setEditingAgendaId(null);
    setNewAgenda({ ...BLANK_AGENDA });
    setAgendaModalOpen(true);
  };

  const openAgendaEdit = (agenda: AgendaItem) => {
    setEditingAgendaId(agenda.id);
    setNewAgenda({
      judul: agenda.judul,
      jenis: agenda.jenis,
      tanggalWIB: agenda.tanggalWIB,
      jamWIB: agenda.jamWIB ?? '',
      wilayah: agenda.wilayah,
      lokasi: agenda.lokasi,
      kapasitas: agenda.kapasitas,
      penanggungJawab: agenda.penanggungJawab ?? '',
    });
    setAgendaModalOpen(true);
  };

  // Handler: Simpan Agenda Baru / Perubahan Agenda
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
          data: { ...newAgenda, id: editingAgendaId || undefined },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          editingAgendaId
            ? 'Perubahan jadwal berhasil disimpan.'
            : 'Jadwal kopdar baru berhasil disimpan.'
        );
        setAgendaModalOpen(false);
        setEditingAgendaId(null);
        setNewAgenda({ ...BLANK_AGENDA });
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

  // Buka modal: tambah / ubah lowongan
  const openLokerCreate = () => {
    setEditingLokerId(null);
    setNewLoker({ ...BLANK_LOKER });
    setLokerModalOpen(true);
  };

  const openLokerEdit = (loker: LokerItem) => {
    setEditingLokerId(loker.id);
    setNewLoker({
      posisi: loker.posisi,
      perusahaan: loker.perusahaan,
      industri: loker.industri,
      wilayah: loker.wilayah,
      tipeKerja: loker.tipeKerja,
      sistemKerja: loker.sistemKerja,
      gajiPerkiraan: loker.gajiPerkiraan ?? '',
      alumniRujukan: loker.alumniRujukan ?? '',
      kualifikasi: (loker.kualifikasi ?? []).join('\n'),
      deskripsi: loker.deskripsi ?? '',
      kontakLamar: loker.kontakLamar ?? '',
      linkLamar: loker.linkLamar ?? '',
      status: loker.status,
    });
    setLokerModalOpen(true);
  };

  // Handler: Simpan Loker Baru / Perubahan Loker
  const handleSaveLoker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kualifikasiArray = newLoker.kualifikasi
        .split('\n')
        .map((k) => k.replace(/^[•\-\s]+/, '').trim())
        .filter(Boolean);

      const dataToSend = {
        ...newLoker,
        id: editingLokerId || undefined,
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
        setLokerModalOpen(false);
        setEditingLokerId(null);
        setNewLoker({ ...BLANK_LOKER });
        await loadData();
        showToast(
          editingLokerId
            ? 'Perubahan info lowongan kerja berhasil disimpan.'
            : 'Info lowongan kerja berhasil disimpan dan diterbitkan.'
        );
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

  // Handler Buka Modal Berita
  const openBeritaCreate = () => {
    setEditingBeritaId(null);
    setNewBerita({
      ...BLANK_BERITA,
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    });
    setBeritaModalOpen(true);
  };

  const openBeritaEdit = (item: BeritaItem) => {
    setEditingBeritaId(item.id);
    setNewBerita({
      judul: item.judul,
      kategori: item.kategori,
      tanggal: item.tanggal,
      wilayah: item.wilayah || 'Jakarta Pusat',
      ringkasan: item.ringkasan,
      konten: item.konten,
      fotoUrl: item.fotoUrl || '',
      captionFoto: item.captionFoto || '',
      penulis: item.penulis || 'Pengurus IKA UMS Jabodetabek',
      published: item.published ?? true,
    });
    setBeritaModalOpen(true);
  };

  const handleSaveBerita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBerita.judul.trim()) {
      showToast('Judul dokumentasi/berita wajib diisi.');
      return;
    }
    if (!newBerita.ringkasan.trim()) {
      showToast('Ringkasan singkat wajib diisi.');
      return;
    }

    try {
      const dataToSend = {
        ...(editingBeritaId ? { id: editingBeritaId } : {}),
        ...newBerita,
      };

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'berita',
          data: dataToSend,
        }),
      });

      if (res.ok) {
        setBeritaModalOpen(false);
        setEditingBeritaId(null);
        setNewBerita({ ...BLANK_BERITA });
        await loadData();
        showToast(
          editingBeritaId
            ? 'Perubahan berita & dokumentasi berhasil disimpan.'
            : 'Berita & dokumentasi kegiatan berhasil diterbitkan.'
        );
      } else {
        showToast('Gagal menyimpan berita & dokumentasi.');
      }
    } catch {
      showToast('Terjadi kendala jaringan.');
    }
  };

  const handleDeleteBerita = async (id: string, judul: string) => {
    if (!confirm(`Hapus dokumentasi/berita "${judul}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'berita-delete',
          id,
        }),
      });
      if (res.ok) {
        setBeritaList((prev) => prev.filter((item) => item.id !== id));
        showToast('Dokumentasi/berita berhasil dihapus.');
      } else {
        showToast('Gagal menghapus berita.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  const handleTogglePublishBerita = async (item: BeritaItem) => {
    try {
      const updated = { ...item, published: !item.published };
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'berita',
          data: updated,
        }),
      });
      if (res.ok) {
        setBeritaList((prev) => prev.map((b) => (b.id === item.id ? updated : b)));
        showToast(
          updated.published
            ? 'Dokumentasi kini tayang di web publik.'
            : 'Dokumentasi diubah menjadi draft internal.'
        );
      } else {
        showToast('Gagal mengubah status publikasi.');
      }
    } catch {
      showToast('Terjadi kendala jaringan.');
    }
  };

  const handleBeritaPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Format berkas harus berupa gambar (JPG, PNG, atau WebP).');
      return;
    }

    setFotoUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
          setNewBerita((prev) => ({ ...prev, fotoUrl: compressedBase64 }));
          showToast('Foto dokumentasi berhasil dipilih & dioptimalkan.');
        }
        setFotoUploadLoading(false);
      };
      img.onerror = () => {
        setFotoUploadLoading(false);
        showToast('Gagal memproses gambar.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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

  // Handler: Simpan Konten Beranda
  const handleSaveLanding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landingData) return;

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'landing',
          data: landingData,
        }),
      });
      if (res.ok) {
        showToast('Konten beranda berhasil disimpan dan langsung tampil di halaman utama.');
      } else {
        showToast('Gagal menyimpan konten beranda.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  const patchLanding = (patch: Partial<LandingContent>) =>
    setLandingData((prev) => (prev ? { ...prev, ...patch } : prev));

  const patchLandingList = (
    key: 'values' | 'cities' | 'programs',
    index: number,
    patch: Record<string, string>
  ) =>
    setLandingData((prev) => {
      if (!prev) return prev;
      const list = prev[key].map((item, i) => (i === index ? { ...item, ...patch } : item));
      return { ...prev, [key]: list } as LandingContent;
    });

  const addLandingListItem = (key: 'values' | 'cities' | 'programs') =>
    setLandingData((prev) => {
      if (!prev) return prev;
      const blank =
        key === 'values'
          ? { judul: '', isi: '' }
          : key === 'cities'
            ? { nama: '', jumlah: '' }
            : { judul: '', deskripsi: '', href: '' };
      return { ...prev, [key]: [...prev[key], blank] } as LandingContent;
    });

  const removeLandingListItem = (key: 'values' | 'cities' | 'programs', index: number) =>
    setLandingData((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: prev[key].filter((_, i) => i !== index) } as LandingContent;
    });


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

  // Filter dokumentasi & berita
  const filteredBeritas = beritaList.filter((item) => {
    if (beritaKategoriFilter !== 'semua' && item.kategori !== beritaKategoriFilter) return false;
    if (beritaSearch.trim()) {
      const q = beritaSearch.toLowerCase();
      const matchJudul = item.judul.toLowerCase().includes(q);
      const matchRingkasan = item.ringkasan.toLowerCase().includes(q);
      const matchWilayah = item.wilayah?.toLowerCase().includes(q);
      return matchJudul || matchRingkasan || matchWilayah;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-9 w-full space-y-5 sm:space-y-8">
        <section className="overflow-hidden rounded-xl sm:rounded-2xl bg-[#0C2340] text-white shadow-[0_18px_45px_-30px_rgba(12,35,64,0.8)]" aria-labelledby="admin-dashboard-title">
          <div className="relative px-5 py-5 sm:px-8 sm:py-8">
            <Image
              src="/images/ums-campus-silhouette.png"
              alt=""
              aria-hidden="true"
              width={2200}
              height={760}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="pointer-events-none absolute -bottom-24 right-[-15%] w-[780px] max-w-none opacity-[0.1] sm:right-[-5%] sm:opacity-[0.13]"
            />
            <div aria-hidden="true" className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10 bg-white/[0.03]" />
            <div aria-hidden="true" className="absolute right-20 top-10 h-20 w-20 rounded-full border border-[#F59E0B]/25" />
            <div className="relative flex flex-col items-stretch gap-1.5 border-b border-white/15 pb-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2 sm:pb-4 sm:text-sm">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-300">
                <Link href="/" className="inline-flex min-h-[44px] items-center font-medium transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Beranda
                </Link>
                <span aria-hidden="true" className="text-slate-500">/</span>
                <span className="font-semibold text-white">Pusat Kelola Data</span>
              </nav>
              <div className="flex items-center gap-1 border-t border-white/10 pt-1.5 sm:border-0 sm:pt-0 sm:gap-2">
                <a href="/api/pendaftaran?format=csv" download className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <Download className="h-3.5 w-3.5" /> Unduh CSV
                </a>
                <button type="button" onClick={handleLogout} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 font-semibold text-rose-200 transition-colors hover:bg-rose-400/15 hover:text-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer">
                  <LogOut className="h-3.5 w-3.5" /> Keluar
                </button>
              </div>
            </div>

            <header className="relative grid gap-4 pt-5 sm:gap-6 sm:pt-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="max-w-2xl">
                <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FCD34D] sm:mb-3 sm:text-[11px] sm:tracking-[0.14em]">
                  <ShieldCheck className="h-3.5 w-3.5" /> Sekretariat &amp; Koordinasi Wilayah
                </div>
                <h1 id="admin-dashboard-title" className="text-[28px] font-extrabold leading-[1.1] tracking-tight sm:text-4xl">Pusat Data IKA UMS Jabodetabek</h1>
                <p className="mt-2.5 max-w-xl text-sm leading-[1.45] text-slate-300 sm:mt-3 sm:text-base sm:leading-6">
                  Pantau pekerjaan organisasi, tangani alumni baru, dan kelola layanan untuk seluruh jaringan Jabodetabek.
                </p>
                {isLoading && (
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-300">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FCD34D]" /> Memperbarui data...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-end">
                <button
                  type="button"
                  onClick={() => setManualAlumniOpen(true)}
                  className="col-span-2 sm:col-span-1 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0C2340] shadow-sm transition-colors hover:bg-slate-100 sm:text-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  + Tambah Alumni
                </button>
                <button
                  type="button"
                  onClick={() => openAgendaCreate()}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20 sm:px-4 sm:text-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  + Jadwal Kopdar
                </button>
                <button
                  type="button"
                  onClick={() => openLokerCreate()}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20 sm:px-4 sm:text-sm cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  + Info Loker
                </button>
                <button
                  type="button"
                  onClick={() => openBeritaCreate()}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/20 px-2.5 py-2 text-xs font-bold text-[#FCD34D] transition-colors hover:bg-amber-400/30 sm:px-4 sm:text-sm cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  + Dokumentasi / Berita
                </button>
              </div>
            </header>
          </div>
        </section>

        {/* Kartu Statistik Cepat - 5 Kolom Desktop (Bebas Gantung dengan lg:col-span-1 pada Card 1) */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-[1.45fr_repeat(4,minmax(0,1fr))]" aria-label="Ringkasan data">
          <div className="col-span-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 lg:col-span-1 flex flex-col justify-between shadow-2xs hover:border-amber-300 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Prioritas hari ini
                </p>
                <p className="mt-1 text-sm text-amber-800">Alumni menunggu verifikasi</p>
              </div>
              <span className="grid h-9 min-w-9 place-items-center rounded-full bg-amber-500 px-2 text-sm font-extrabold text-white">
                {countMenunggu}
              </span>
            </div>
            <button
              type="button"
              onClick={() => { setActiveTab('pendaftar'); setStatusFilter('menunggu'); }}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#0C2340] px-3 text-xs font-bold text-white transition-colors hover:bg-[#08182E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] cursor-pointer"
            >
              Tinjau pendaftar
            </button>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => { setActiveTab('pendaftar'); setStatusFilter('semua'); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActiveTab('pendaftar'); setStatusFilter('semua'); } }}
            className="min-h-[132px] rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 hover:border-[#0C2340]/30 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                Anggota
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#0C2340]">{pendaftarList.length}</p>
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-700">{countDisetujui} terverifikasi</p>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('agenda')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('agenda'); }}
            className="min-h-[132px] rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 hover:border-[#0C2340]/30 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Kopdar aktif
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#0C2340]">{agendaList.length}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">agenda wilayah</p>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('loker')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('loker'); }}
            className="min-h-[132px] rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 hover:border-[#0C2340]/30 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                Lowongan aktif
              </p>
              <p className="mt-2 text-2xl font-extrabold text-emerald-700">{lokerList.length}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">peluang terbuka</p>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('pengurus')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('pengurus'); }}
            className="min-h-[132px] rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 hover:border-[#0C2340]/30 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                Cakupan
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#0C2340]">{WILAYAH_JABODETABEK.length}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">kota &amp; kabupaten</p>
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
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold px-2 py-1 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Tab Navigasi Pengelolaan dengan Navigasi Geser (Smooth Scroll Chevrons) */}
        <div className="relative">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              aria-label="Geser tab ke kiri"
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#0C2340] hover:bg-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div
            ref={tabScrollRef}
            onScroll={checkTabScroll}
            role="tablist"
            aria-label="Modul pengelolaan organisasi"
            className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xs flex overflow-x-auto gap-1.5 scroll-smooth no-scrollbar"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'pendaftar'}
              aria-controls="admin-panel-pendaftar"
              onClick={() => setActiveTab('pendaftar')}
              className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                activeTab === 'pendaftar'
                  ? 'border-[#0C2340] bg-[#0C2340] text-white rounded-xl'
                  : 'border-transparent text-[#475569] hover:text-[#0C2340] hover:bg-slate-50 rounded-xl'
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
              role="tab"
              aria-selected={activeTab === 'agenda'}
              aria-controls="admin-panel-agenda"
              onClick={() => setActiveTab('agenda')}
              className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                activeTab === 'agenda'
                  ? 'border-[#0C2340] bg-[#0C2340] text-white rounded-xl'
                  : 'border-transparent text-[#475569] hover:text-[#0C2340] hover:bg-slate-50 rounded-xl'
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
              role="tab"
              aria-selected={activeTab === 'loker'}
              aria-controls="admin-panel-loker"
              onClick={() => setActiveTab('loker')}
              className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                activeTab === 'loker'
                  ? 'border-[#0C2340] bg-[#0C2340] text-white rounded-xl'
                  : 'border-transparent text-[#475569] hover:text-[#0C2340] hover:bg-slate-50 rounded-xl'
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
              role="tab"
              aria-selected={activeTab === 'berita'}
              aria-controls="admin-panel-berita"
              onClick={() => setActiveTab('berita')}
              className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                activeTab === 'berita'
                  ? 'border-[#0C2340] bg-[#0C2340] text-white rounded-xl'
                  : 'border-transparent text-[#475569] hover:text-[#0C2340] hover:bg-slate-50 rounded-xl'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Dokumentasi &amp; Berita</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-900 font-bold">
                {beritaList.length}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'pengurus'}
              aria-controls="admin-panel-pengurus"
              onClick={() => setActiveTab('pengurus')}
              className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                activeTab === 'pengurus'
                  ? 'border-[#0C2340] bg-[#0C2340] text-white rounded-xl'
                  : 'border-transparent text-[#475569] hover:text-[#0C2340] hover:bg-slate-50 rounded-xl'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Pengurus &amp; 9 Korwil</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'landing'}
              aria-controls="admin-panel-landing"
              onClick={() => setActiveTab('landing')}
              className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                activeTab === 'landing'
                  ? 'border-[#0C2340] bg-[#0C2340] text-white rounded-xl'
                  : 'border-transparent text-[#475569] hover:text-[#0C2340] hover:bg-slate-50 rounded-xl'
              }`}
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>Konten Beranda</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'settings'}
              aria-controls="admin-panel-settings"
              onClick={() => setActiveTab('settings')}
              className={`min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340] ${
                activeTab === 'settings'
                  ? 'border-[#0C2340] bg-[#0C2340] text-white rounded-xl'
                  : 'border-transparent text-[#475569] hover:text-[#0C2340] hover:bg-slate-50 rounded-xl'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Kontak &amp; Komunitas</span>
            </button>
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              aria-label="Geser tab ke kanan"
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#0C2340] hover:bg-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PENDAFTARAN & ANGGOTA                                              */}
        {/* ========================================================================= */}
        {activeTab === 'pendaftar' && (
          <section id="admin-panel-pendaftar" role="tabpanel" aria-label="Pendaftaran dan anggota" className="space-y-6">
            {/* Header Modul & Filter */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0C2340] flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-600" />
                    <span>Data Pendaftar &amp; Keanggotaan Alumni</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Verifikasi pendaftar baru, perbarui status keanggotaan, dan kirim notifikasi aktivasi via WhatsApp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setManualAlumniOpen(true)}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] hover:bg-[#08182E] text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>+ Tambah Alumni Manual</span>
                </button>
              </div>

              {/* Filter Bar & Search */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama alumni, prodi, angkatan, atau pekerjaan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-h-[42px] pl-10 pr-9 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                      aria-label="Bersihkan pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 w-full gap-2 md:flex md:w-auto md:items-center md:gap-2.5">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'semua' | 'menunggu' | 'disetujui' | 'ditolak')}
                    className="w-full min-w-0 min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 focus:outline-hidden cursor-pointer font-medium"
                  >
                    <option value="semua">Semua Status ({pendaftarList.length})</option>
                    <option value="menunggu">Menunggu Verifikasi ({countMenunggu})</option>
                    <option value="disetujui">Disetujui ({countDisetujui})</option>
                    <option value="ditolak">Ditolak / Review Ulang</option>
                  </select>

                  <select
                    value={wilayahFilter}
                    onChange={(e) => setWilayahFilter(e.target.value)}
                    className="w-full min-w-0 min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 focus:outline-hidden cursor-pointer font-medium"
                  >
                    <option value="semua">Semua Wilayah</option>
                    {WILAYAH_JABODETABEK.map((w) => (
                      <option key={w.id} value={w.nama}>
                        {w.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Menampilkan <strong className="text-[#0C2340]">{filteredPendaftar.length}</strong> alumni
                {statusFilter !== 'semua' ? ` dengan status ${statusFilter}` : ''}
                {wilayahFilter !== 'semua' ? ` di wilayah ${wilayahFilter}` : ''}
              </div>
            </div>

            {/* Daftar Pendaftar */}
            {filteredPendaftar.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-center space-y-3">
                <Users className="w-9 h-9 sm:w-10 sm:h-10 text-[#475569]/60 mx-auto" />
                <h3 className="text-base sm:text-lg font-bold text-[#0C2340]">Tidak Ada Data Pendaftar</h3>
                <p className="text-sm leading-5 text-[#475569] max-w-md mx-auto">
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
                      {item.status === 'disetujui' && (
                        <a
                          href={`https://wa.me/${item.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Assalamu'alaikum Wr. Wb. / Salam hangat Mas/Mbak ${item.namaLengkap},\n\nPendaftaran keanggotaan IKA UMS Anda telah diverifikasi & DISETUJUI oleh pengurus! 🎉\n\nSilakan masuk ke portal Ruang Anggota di:\n${typeof window !== 'undefined' ? window.location.origin : ''}/masuk\n\n(Cukup masukkan nomor WhatsApp Anda: ${item.whatsapp} pada tab WhatsApp).\n\nSelamat bergabung di jejaring alumni UMS Jabodetabek! Salam hangat, Pengurus IKA UMS.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                          title="Kirim notifikasi penerimaan ke WhatsApp alumni"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-100" />
                          <span>Kirim Info WA</span>
                        </a>
                      )}
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
                      <button
                        type="button"
                        onClick={() => handleDeletePendaftar(item.id, item.namaLengkap)}
                        className="min-h-[40px] w-10 inline-flex items-center justify-center rounded-lg text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label={`Hapus data ${item.namaLengkap}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: JADWAL KOPDAR & AGENDA                                             */}
        {/* ========================================================================= */}
        {activeTab === 'agenda' && (
          <section id="admin-panel-agenda" role="tabpanel" aria-label="Jadwal kopdar dan agenda" className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0C2340] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span>Jadwal Kopdar &amp; Agenda Wilayah</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Jadwal aktif langsung tampil di halaman publik Kegiatan (/kegiatan) dan Beranda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openAgendaCreate()}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] hover:bg-[#08182E] text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>+ Tambah Jadwal Baru</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                Menampilkan <strong className="text-[#0C2340]">{agendaList.length}</strong> jadwal agenda &amp; kopdar wilayah
              </div>
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
                  onClick={() => openAgendaCreate()}
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
                        onClick={() => openAgendaEdit(agenda)}
                        className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1 rounded-lg text-[#0C2340] hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Ubah Jadwal
                      </button>
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
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INFO LOWONGAN KERJA & PELUANG ALUMNI                               */}
        {/* ========================================================================= */}
        {activeTab === 'loker' && (
          <section id="admin-panel-loker" role="tabpanel" aria-label="Info lowongan kerja" className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0C2340] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    <span>Lowongan Kerja &amp; Peluang Bisnis</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Kelola informasi karier alumni. Lowongan aktif langsung tampil di halaman publik (/peluang#loker).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openLokerCreate()}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] hover:bg-[#08182E] text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-emerald-300" />
                  <span>+ Tambah Info Loker</span>
                </button>
              </div>

              {/* Filter Bar Loker */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari lowongan berdasarkan posisi, perusahaan, atau rujukan..."
                    value={lokerSearch}
                    onChange={(e) => setLokerSearch(e.target.value)}
                    className="w-full min-h-[42px] pl-10 pr-9 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 focus:outline-hidden"
                  />
                  {lokerSearch && (
                    <button
                      type="button"
                      onClick={() => setLokerSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                      aria-label="Bersihkan pencarian loker"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <select
                  value={lokerWilayahFilter}
                  onChange={(e) => setLokerWilayahFilter(e.target.value)}
                  className="min-h-[42px] px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 focus:outline-hidden cursor-pointer font-medium"
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

              <div className="text-xs text-slate-500 font-medium">
                Menampilkan <strong className="text-[#0C2340]">{filteredLokers.length}</strong> lowongan kerja
                {lokerWilayahFilter !== 'semua' ? ` di wilayah ${lokerWilayahFilter}` : ''}
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
                  onClick={() => openLokerCreate()}
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
                        onClick={() => openLokerEdit(loker)}
                        className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1 rounded-lg text-[#0C2340] hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Ubah Loker
                      </button>
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
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB: DOKUMENTASI & BERITA KEGIATAN                                         */}
        {/* ========================================================================= */}
        {activeTab === 'berita' && (
          <section id="admin-panel-berita" role="tabpanel" aria-label="Dokumentasi dan berita kegiatan" className="space-y-6">
            {/* Header Modul & Filter */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0C2340] flex items-center gap-2">
                    <Camera className="w-5 h-5 text-amber-500" />
                    <span>Dokumentasi &amp; Berita Kegiatan</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Kelola foto, liputan, dan rilis berita kegiatan alumni untuk ditampilkan di Beranda dan halaman Cerita.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openBeritaCreate()}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#0C2340] hover:bg-[#08182E] text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>+ Unggah Dokumentasi / Berita</span>
                </button>
              </div>

              {/* Filter & Pencarian */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={beritaSearch}
                    onChange={(e) => setBeritaSearch(e.target.value)}
                    placeholder="Cari judul, ringkasan, atau wilayah..."
                    className="w-full min-h-[42px] pl-10 pr-9 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 focus:outline-hidden"
                  />
                  {beritaSearch && (
                    <button
                      type="button"
                      onClick={() => setBeritaSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                      aria-label="Bersihkan pencarian berita"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <select
                  value={beritaKategoriFilter}
                  onChange={(e) => setBeritaKategoriFilter(e.target.value)}
                  className="min-h-[42px] px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0C2340] focus:ring-2 focus:ring-[#0C2340]/15 focus:outline-hidden bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="semua">Semua Kategori</option>
                  <option value="Kopdar & Temu Alumni">Kopdar &amp; Temu Alumni</option>
                  <option value="Sosial & Pengabdian">Sosial &amp; Pengabdian</option>
                  <option value="Karier & Bisnis">Karier &amp; Bisnis</option>
                  <option value="Info Organisasi">Info Organisasi</option>
                  <option value="Prestasi Alumni">Prestasi Alumni</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Menampilkan <strong className="text-[#0C2340]">{filteredBeritas.length}</strong> dokumentasi &amp; liputan berita
                {beritaKategoriFilter !== 'semua' ? ` kategori ${beritaKategoriFilter}` : ''}
              </div>
            </div>

            {/* List Berita / Dokumentasi */}
            {filteredBeritas.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
                <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-[#0C2340]">Belum Ada Dokumentasi Kegiatan</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Unggah liputan kopdar perdana, foto bersama, dan kabar terbaru alumni agar tampil di web publik.
                </p>
                <button
                  type="button"
                  onClick={() => openBeritaCreate()}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#08182E] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Unggah Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredBeritas.map((berita) => (
                  <div
                    key={berita.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                        {berita.fotoUrl ? (
                          <Image
                            src={berita.fotoUrl}
                            alt={berita.judul}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
                            <ImageIcon className="w-8 h-8" />
                            <span className="text-xs">Belum ada foto</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-[#0C2340] shadow-2xs">
                            {berita.kategori}
                          </span>
                          {berita.wilayah && (
                            <span className="rounded-md bg-[#0C2340]/90 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-white shadow-2xs">
                              {berita.wilayah}
                            </span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold shadow-2xs ${
                              berita.published
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-200 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {berita.published ? '✓ Tayang' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>{berita.tanggal}</span>
                          {berita.penulis && (
                            <>
                              <span>•</span>
                              <span>{berita.penulis}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[#0C2340] leading-snug">
                          {berita.judul}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {berita.ringkasan}
                        </p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Link
                          href="/cerita"
                          target="_blank"
                          className="inline-flex items-center gap-1 font-semibold text-[#0C2340] hover:text-amber-600"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Halaman Cerita</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleTogglePublishBerita(berita)}
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-1 rounded transition-colors ${
                            berita.published
                              ? 'text-amber-700 hover:bg-amber-100'
                              : 'text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {berita.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{berita.published ? 'Set Draft' : 'Tayangkan'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openBeritaEdit(berita)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-white hover:shadow-2xs font-semibold transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#0C2340]" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBerita(berita.id, berita.judul)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PENGURUS & 9 KORWIL                                                */}
        {/* ========================================================================= */}
        {activeTab === 'pengurus' && pengurusData && (
          <form id="admin-panel-pengurus" role="tabpanel" aria-label="Pengurus dan korwil" onSubmit={handleSavePengurus} className="space-y-8">
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
        {activeTab === 'landing' && landingData && (
          <form id="admin-panel-landing" role="tabpanel" aria-label="Konten beranda" onSubmit={handleSaveLanding} className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">Hero Beranda</h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Teks utama yang pertama kali dibaca pengunjung. Perubahan langsung tampil di
                  halaman utama.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={adminLabelClass}>Label Kecil di Atas Judul</label>
                  <input
                    type="text"
                    value={landingData.heroEyebrow}
                    onChange={(e) => patchLanding({ heroEyebrow: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Judul Utama</label>
                  <input
                    type="text"
                    value={landingData.heroTitle}
                    onChange={(e) => patchLanding({ heroTitle: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Kata Penekanan (warna emas)</label>
                  <input
                    type="text"
                    value={landingData.heroHighlight}
                    onChange={(e) => patchLanding({ heroHighlight: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Tombol Utama</label>
                  <input
                    type="text"
                    value={landingData.heroPrimaryCta}
                    onChange={(e) => patchLanding({ heroPrimaryCta: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Tombol Sekunder</label>
                  <input
                    type="text"
                    value={landingData.heroSecondaryCta}
                    onChange={(e) => patchLanding({ heroSecondaryCta: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Judul Kartu Foto</label>
                  <input
                    type="text"
                    value={landingData.heroBadgeTitle}
                    onChange={(e) => patchLanding({ heroBadgeTitle: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Subjudul Kartu Foto</label>
                  <input
                    type="text"
                    value={landingData.heroBadgeSubtitle}
                    onChange={(e) => patchLanding({ heroBadgeSubtitle: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={adminLabelClass}>Deskripsi Pembuka</label>
                  <textarea
                    rows={3}
                    value={landingData.heroSubtitle}
                    onChange={(e) => patchLanding({ heroSubtitle: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">Tiga Nilai Utama</h2>
                  <p className="text-xs sm:text-sm text-[#475569]">
                    Kartu ringkas di bawah hero.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addLandingListItem('values')}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg border border-slate-300 text-sm font-semibold text-[#0C2340] hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>

              <div className="space-y-3">
                {landingData.values.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_1.6fr_auto] gap-3 items-start rounded-xl border border-slate-200 p-3"
                  >
                    <input
                      type="text"
                      value={item.judul}
                      onChange={(e) => patchLandingList('values', index, { judul: e.target.value })}
                      placeholder="Judul kartu"
                      className={adminFieldClass}
                    />
                    <input
                      type="text"
                      value={item.isi}
                      onChange={(e) => patchLandingList('values', index, { isi: e.target.value })}
                      placeholder="Satu kalimat penjelasan"
                      className={adminFieldClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeLandingListItem('values', index)}
                      className="inline-flex items-center justify-center min-h-[42px] w-11 rounded-lg text-red-600 hover:bg-red-50"
                      aria-label={`Hapus nilai ${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">Sebaran Wilayah</h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Isi jumlah alumni hanya bila angkanya nyata. Kosongkan bila belum ada data.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={adminLabelClass}>Judul Bagian</label>
                  <input
                    type="text"
                    value={landingData.sebaranTitle}
                    onChange={(e) => patchLanding({ sebaranTitle: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Label Tombol</label>
                  <input
                    type="text"
                    value={landingData.sebaranCta}
                    onChange={(e) => patchLanding({ sebaranCta: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={adminLabelClass}>Deskripsi</label>
                  <textarea
                    rows={3}
                    value={landingData.sebaranDescription}
                    onChange={(e) => patchLanding({ sebaranDescription: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase text-[#0C2340]">Daftar Wilayah</p>
                <button
                  type="button"
                  onClick={() => addLandingListItem('cities')}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg border border-slate-300 text-sm font-semibold text-[#0C2340] hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4" />
                  Tambah wilayah
                </button>
              </div>

              <div className="space-y-3">
                {landingData.cities.map((kota, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_auto] gap-3 items-start rounded-xl border border-slate-200 p-3"
                  >
                    <input
                      type="text"
                      value={kota.nama}
                      onChange={(e) => patchLandingList('cities', index, { nama: e.target.value })}
                      placeholder="Nama wilayah"
                      className={adminFieldClass}
                    />
                    <input
                      type="text"
                      value={kota.jumlah}
                      onChange={(e) => patchLandingList('cities', index, { jumlah: e.target.value })}
                      placeholder="Jumlah alumni (opsional)"
                      className={adminFieldClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeLandingListItem('cities', index)}
                      className="inline-flex items-center justify-center min-h-[42px] w-11 rounded-lg text-red-600 hover:bg-red-50"
                      aria-label={`Hapus wilayah ${kota.nama || index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">Program Alumni</h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Kartu program di beranda. Kartu pertama tampil dengan latar navy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={adminLabelClass}>Label Kecil</label>
                  <input
                    type="text"
                    value={landingData.programEyebrow}
                    onChange={(e) => patchLanding({ programEyebrow: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Judul Bagian</label>
                  <input
                    type="text"
                    value={landingData.programTitle}
                    onChange={(e) => patchLanding({ programTitle: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={adminLabelClass}>Deskripsi</label>
                  <textarea
                    rows={2}
                    value={landingData.programDescription}
                    onChange={(e) => patchLanding({ programDescription: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase text-[#0C2340]">Daftar Program</p>
                <button
                  type="button"
                  onClick={() => addLandingListItem('programs')}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg border border-slate-300 text-sm font-semibold text-[#0C2340] hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4" />
                  Tambah program
                </button>
              </div>

              <div className="space-y-3">
                {landingData.programs.map((program, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_1fr_auto] gap-3 items-start rounded-xl border border-slate-200 p-3"
                  >
                    <input
                      type="text"
                      value={program.judul}
                      onChange={(e) =>
                        patchLandingList('programs', index, { judul: e.target.value })
                      }
                      placeholder="Judul program"
                      className={adminFieldClass}
                    />
                    <input
                      type="text"
                      value={program.deskripsi}
                      onChange={(e) =>
                        patchLandingList('programs', index, { deskripsi: e.target.value })
                      }
                      placeholder="Deskripsi singkat"
                      className={adminFieldClass}
                    />
                    <input
                      type="text"
                      value={program.href}
                      onChange={(e) =>
                        patchLandingList('programs', index, { href: e.target.value })
                      }
                      placeholder="/peluang#mentoring"
                      className={adminFieldClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeLandingListItem('programs', index)}
                      className="inline-flex items-center justify-center min-h-[42px] w-11 rounded-lg text-red-600 hover:bg-red-50"
                      aria-label={`Hapus program ${program.judul || index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0C2340]">Banner Kopdar &amp; Judul Cerita</h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Kartu ajakan kopdar. Daftar cerita diambil otomatis dari agenda kegiatan yang
                  aktif.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={adminLabelClass}>Label Kecil</label>
                  <input
                    type="text"
                    value={landingData.kopdarEyebrow}
                    onChange={(e) => patchLanding({ kopdarEyebrow: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Judul Banner</label>
                  <input
                    type="text"
                    value={landingData.kopdarTitle}
                    onChange={(e) => patchLanding({ kopdarTitle: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Label Tombol</label>
                  <input
                    type="text"
                    value={landingData.kopdarCta}
                    onChange={(e) => patchLanding({ kopdarCta: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Judul Bagian Cerita</label>
                  <input
                    type="text"
                    value={landingData.ceritaTitle}
                    onChange={(e) => patchLanding({ ceritaTitle: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={adminLabelClass}>Deskripsi Banner</label>
                  <textarea
                    rows={3}
                    value={landingData.kopdarDescription}
                    onChange={(e) => patchLanding({ kopdarDescription: e.target.value })}
                    className={adminFieldClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-base font-semibold transition-colors cursor-pointer shadow-md"
              >
                <Save className="w-5 h-5" />
                Simpan Konten Beranda
              </button>
            </div>
          </form>
        )}

        {activeTab === 'settings' && settingsData && (
          <form id="admin-panel-settings" role="tabpanel" aria-label="Kontak dan komunitas" onSubmit={handleSaveSettings} className="space-y-6">
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
              {editingAgendaId ? 'Ubah Jadwal Kopdar' : 'Buat Jadwal Kopdar Baru'}
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
              {editingLokerId ? 'Ubah Info Lowongan Kerja' : 'Terbitkan Info Lowongan Kerja Baru'}
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

      {/* ========================================================================= */}
      {/* MODAL 4: UNGGAH / UBAH DOKUMENTASI & BERITA KEGIATAN                       */}
      {/* ========================================================================= */}
      <Dialog open={beritaModalOpen} onOpenChange={setBeritaModalOpen}>
        <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 rounded-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="space-y-1.5 border-b border-slate-200 pb-3">
            <DialogTitle className="text-xl font-bold text-[#0C2340]">
              {editingBeritaId ? 'Ubah Berita & Dokumentasi Kegiatan' : 'Unggah Dokumentasi & Berita Kegiatan'}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#475569]">
              Dokumentasi yang ditayangkan otomatis muncul di halaman Cerita (/cerita) dan Beranda publik.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveBerita} className="space-y-4 pt-3">
            {/* Judul Berita */}
            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                Judul Berita / Dokumentasi *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kopdar Perdana IKA UMS Jabodetabek Sukses Digelar"
                value={newBerita.judul}
                onChange={(e) => setNewBerita({ ...newBerita, judul: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:border-[#0C2340] focus:outline-hidden"
              />
            </div>

            {/* Kategori & Wilayah */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Kategori Kegiatan *
                </label>
                <select
                  value={newBerita.kategori}
                  onChange={(e) => setNewBerita({ ...newBerita, kategori: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:border-[#0C2340] focus:outline-hidden"
                >
                  <option value="Kopdar & Temu Alumni">Kopdar &amp; Temu Alumni</option>
                  <option value="Sosial & Pengabdian">Sosial &amp; Pengabdian</option>
                  <option value="Karier & Bisnis">Karier &amp; Bisnis</option>
                  <option value="Info Organisasi">Info Organisasi</option>
                  <option value="Prestasi Alumni">Prestasi Alumni</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Wilayah / Titik Temu
                </label>
                <select
                  value={newBerita.wilayah}
                  onChange={(e) => setNewBerita({ ...newBerita, wilayah: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:border-[#0C2340] focus:outline-hidden"
                >
                  <option value="Seluruh Jabodetabek">Seluruh Jabodetabek</option>
                  {WILAYAH_JABODETABEK.map((w) => (
                    <option key={w.nama} value={w.nama}>
                      {w.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tanggal Pelaksanaan & Penulis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Tanggal Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 15 Februari 2026"
                  value={newBerita.tanggal}
                  onChange={(e) => setNewBerita({ ...newBerita, tanggal: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:border-[#0C2340] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                  Penulis / Rilis Oleh
                </label>
                <input
                  type="text"
                  placeholder="Pengurus IKA UMS Jabodetabek"
                  value={newBerita.penulis}
                  onChange={(e) => setNewBerita({ ...newBerita, penulis: e.target.value })}
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:border-[#0C2340] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Unggah Foto Dokumentasi */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
              <label className="block text-xs font-bold text-[#0C2340] uppercase">
                Foto Dokumentasi / Cover Berita
              </label>

              {newBerita.fotoUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-300 aspect-[16/9] w-full max-h-56 bg-slate-900">
                  <Image
                    src={newBerita.fotoUrl}
                    alt="Pratinjau Foto Berita"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setNewBerita({ ...newBerita, fotoUrl: '' })}
                    className="absolute top-2 right-2 rounded-md bg-rose-600/90 text-white text-xs font-semibold px-2.5 py-1 hover:bg-rose-700 shadow-sm cursor-pointer"
                  >
                    Ganti / Hapus Foto
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex min-h-[40px] items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0C2340] text-white text-xs font-semibold cursor-pointer hover:bg-[#08182E] transition-colors">
                      <Camera className="w-4 h-4" />
                      <span>{fotoUploadLoading ? 'Memproses...' : 'Pilih Foto dari Perangkat'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleBeritaPhotoUpload}
                        className="hidden"
                        disabled={fotoUploadLoading}
                      />
                    </label>

                    <div className="text-[11px] text-slate-500">
                      atau pilih preset dokumentasi:
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNewBerita({
                          ...newBerita,
                          fotoUrl: '/images/hero-kumpul-bolo-pisah.jpg',
                          captionFoto: 'Dokumentasi kopdar silaturahmi alumni UMS Jabodetabek.',
                        })
                      }
                      className="px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Kumpul Alumni
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewBerita({
                          ...newBerita,
                          fotoUrl: '/images/event-kopdar.jpg',
                          captionFoto: 'Temu akrab alumni UMS di perantauan.',
                        })
                      }
                      className="px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Kopdar Santai
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewBerita({
                          ...newBerita,
                          fotoUrl: '/images/alumni-gathering-3.jpg',
                          captionFoto: 'Suasana diskusi dan jejaring alumni UMS.',
                        })
                      }
                      className="px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Gathering
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Atau masukkan tautan URL foto gambar di sini (https://... atau /images/...)"
                    value={newBerita.fotoUrl}
                    onChange={(e) => setNewBerita({ ...newBerita, fotoUrl: e.target.value })}
                    className="w-full min-h-[38px] px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-[#0C2340]"
                  />
                </div>
              )}

              {/* Caption Foto */}
              <input
                type="text"
                placeholder="Keterangan foto / caption (contoh: Suasana temu alumni UMS di Tebet)"
                value={newBerita.captionFoto}
                onChange={(e) => setNewBerita({ ...newBerita, captionFoto: e.target.value })}
                className="w-full min-h-[38px] px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-[#0C2340]"
              />
            </div>

            {/* Ringkasan Singkat */}
            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                Ringkasan Singkat (Lead / Teaser) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Tulis 1-2 kalimat ringkasan yang menarik perhatian di kartu beranda..."
                value={newBerita.ringkasan}
                onChange={(e) => setNewBerita({ ...newBerita, ringkasan: e.target.value })}
                className="w-full p-3 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:border-[#0C2340] focus:outline-hidden"
              />
            </div>

            {/* Isi Konten Lengkap */}
            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1 uppercase">
                Isi Konten &amp; Narasi Berita Lengkap
              </label>
              <textarea
                rows={6}
                placeholder="Ceritakan detail kegiatan, testimoni peserta, hasil musyawarah, susunan acara, dsb..."
                value={newBerita.konten}
                onChange={(e) => setNewBerita({ ...newBerita, konten: e.target.value })}
                className="w-full p-3 text-sm rounded-lg bg-white border border-slate-300 text-[#0C2340] focus:border-[#0C2340] focus:outline-hidden"
              />
            </div>

            {/* Status Publikasi */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="berita-publish-checkbox"
                checked={newBerita.published}
                onChange={(e) => setNewBerita({ ...newBerita, published: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-[#0C2340] focus:ring-[#0C2340]"
              />
              <label htmlFor="berita-publish-checkbox" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer">
                Tayangkan langsung ke web publik (Halaman Cerita &amp; Beranda)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setBeritaModalOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 hover:bg-slate-100 text-[#0C2340]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0C2340] hover:bg-[#08182E] text-white text-xs sm:text-sm font-semibold"
              >
                Simpan &amp; Terbitkan Berita
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

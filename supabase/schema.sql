-- ==============================================================================
-- SKEMA BASIS DATA SUPABASE — IKA UMS WILAYAH JABODETABEK
-- Jalankan skrip ini di Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PENDAFTAR (Pendaftaran Alumni Pra-launch & Anggota)
CREATE TABLE IF NOT EXISTS public.pendaftar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_lengkap TEXT NOT NULL,
    angkatan INTEGER NOT NULL CHECK (angkatan >= 1970 AND angkatan <= 2040),
    prodi TEXT NOT NULL,
    wilayah TEXT NOT NULL,
    whatsapp TEXT NOT NULL UNIQUE,
    email TEXT,
    pekerjaan TEXT,
    perusahaan TEXT,
    siap_mentoring BOOLEAN DEFAULT FALSE NOT NULL,
    tampil_di_direktori BOOLEAN DEFAULT FALSE NOT NULL,
    status TEXT DEFAULT 'menunggu' NOT NULL CHECK (status IN ('menunggu', 'disetujui', 'ditolak')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- Indeks untuk pencarian dan pemfilteran cepat
CREATE INDEX IF NOT EXISTS idx_pendaftar_whatsapp ON public.pendaftar(whatsapp);
CREATE INDEX IF NOT EXISTS idx_pendaftar_wilayah ON public.pendaftar(wilayah);
CREATE INDEX IF NOT EXISTS idx_pendaftar_status ON public.pendaftar(status);
CREATE INDEX IF NOT EXISTS idx_pendaftar_created_at ON public.pendaftar(created_at DESC);

-- Trigger untuk memperbarui kolom updated_at otomatis
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::TEXT, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_timestamp_pendaftar ON public.pendaftar;
CREATE TRIGGER trigger_set_timestamp_pendaftar
    BEFORE UPDATE ON public.pendaftar
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 3. TABEL KEGIATAN (Jadwal Kopdar & Acara Alumni)
CREATE TABLE IF NOT EXISTS public.kegiatan (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    jenis TEXT NOT NULL,
    tanggal_wib TEXT NOT NULL,
    jam_wib TEXT,
    wilayah TEXT NOT NULL,
    lokasi TEXT,
    lokasi_spesifik TEXT,
    deskripsi TEXT,
    kapasitas INTEGER DEFAULT 50 NOT NULL,
    terdaftar_count INTEGER DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'Akan Datang' NOT NULL,
    gambar TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_kegiatan_wilayah ON public.kegiatan(wilayah);
CREATE INDEX IF NOT EXISTS idx_kegiatan_status ON public.kegiatan(status);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.pendaftar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS Tabel Pendaftar:
-- a. Publik dapat mengirim pendaftaran baru (INSERT)
CREATE POLICY "Publik dapat mendaftarkan profil alumni"
    ON public.pendaftar
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- b. Publik hanya dapat melihat profil yang sudah disetujui & memilih tampil di direktori
CREATE POLICY "Publik melihat alumni terverifikasi di direktori"
    ON public.pendaftar
    FOR SELECT
    TO anon, authenticated
    USING (status = 'disetujui' AND tampil_di_direktori = true);

-- c. Kunci Service Role memiliki wewenang penuh (Admin backend)
CREATE POLICY "Service Role mengelola seluruh pendaftar"
    ON public.pendaftar
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Kebijakan RLS Tabel Kegiatan:
-- Publik dapat membaca seluruh agenda kegiatan
CREATE POLICY "Publik dapat melihat kegiatan"
    ON public.kegiatan
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Service Role mengelola kegiatan"
    ON public.kegiatan
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

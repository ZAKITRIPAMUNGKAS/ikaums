# Daftar Data Asli yang Perlu Diisi (`TODO-DATA.md`)

Seluruh angka, nama pengurus, jadwal kopdar, kontak resmi, dan status organisasi yang belum tersedia secara nyata pada fase pra-peluncuran sengaja ditandai dengan placeholder `[ISI: ...]` di kode agar situs tidak menampilkan data fiktif.

Dokumen ini menjadi daftar periksa sebelum mengubah `NEXT_PUBLIC_DEMO_MODE=false` menjadi rilis penuh ke publik.

---

## 1. Jumlah Pendaftar & Sebaran Wilayah Asli

- [ ] **`coordinatorCount` (`src/lib/config.ts`)**: `[ISI: jumlah pendaftar terverifikasi]`
  - Ditampilkan di bagian hero halaman utama (`/`) dan panel header/wilayah di `/peta`.
  - Isi hanya setelah ada hitungan nyata dari formulir pendaftaran yang diverifikasi pengurus.
- [ ] **Rekap jumlah per 9 kota/kabupaten (`src/components/peta/PetaContextualPanel.tsx`, `/peta`)**:
  - Saat ini angka per wilayah disembunyikan. Aktifkan hanya setelah setiap wilayah memiliki data pendaftar terverifikasi yang cukup.

---

## 2. Nama Pengurus Resmi & Koordinator Wilayah (`/kepengurusan` & `src/lib/config.ts`)

### Pengurus Harian (`src/app/kepengurusan/page.tsx` & `src/lib/config.ts`)
- [ ] **Dewan Pembina & Penasihat**: `[ISI: Nama Tokoh Senior Alumni & Angkatan]`
- [ ] **Ketua Wilayah Jabodetabek (`chairpersonName`)**: `[ISI: Nama Ketua Pengurus Jabodetabek & Angkatan]`
- [ ] **Wakil Ketua**: `[ISI: Nama Wakil Ketua, Prodi & Angkatan]`
- [ ] **Sekretaris**: `[ISI: Nama Sekretaris, Prodi & Angkatan]`
- [ ] **Bendahara**: `[ISI: Nama Bendahara, Prodi & Angkatan]`

### Koordinator Bidang Kerja (`src/app/kepengurusan/page.tsx`)
- [ ] **Bidang Karier & Mentoring Alumni**: `[ISI: Nama Koordinator Bidang Karier]`
- [ ] **Bidang Wirausaha & Kemitraan**: `[ISI: Nama Koordinator Bidang Usaha]`
- [ ] **Bidang Kopdar & Kegiatan Sosial**: `[ISI: Nama Koordinator Bidang Kegiatan]`
- [ ] **Bidang Humas & Informasi**: `[ISI: Nama Koordinator Bidang Humas]`

### Koordinator 9 Wilayah Jabodetabek (`src/app/kepengurusan/page.tsx`)
Lengkapi nama koordinator resmi beserta kontak WhatsApp / rencana lokasi temu per wilayah:
- [ ] **Jakarta Selatan**: `[ISI: Nama Koordinator JakSel]` & `[ISI: Kontak WA / rencana lokasi]`
- [ ] **Jakarta Pusat**: `[ISI: Nama Koordinator JakPus]` & `[ISI: Kontak WA / rencana lokasi]`
- [ ] **Jakarta Barat**: `[ISI: Nama Koordinator JakBar]` & `[ISI: Kontak WA / rencana lokasi]`
- [ ] **Jakarta Timur**: `[ISI: Nama Koordinator JakTim]` & `[ISI: Kontak WA / rencana lokasi]`
- [ ] **Jakarta Utara**: `[ISI: Nama Koordinator JakUt]` & `[ISI: Kontak WA / rencana lokasi]`
- [ ] **Tangerang Raya**: `[ISI: Nama Koordinator Tangerang]` & `[ISI: Kontak WA / rencana lokasi]`
- [ ] **Bekasi**: `[ISI: Nama Koordinator Bekasi]` & `[ISI: Kontak WA / rencana lokasi]`
- [ ] **Depok**: `[ISI: Nama Koordinator Depok]` & `[ISI: Kontak WA / rencana lokasi]`
- [ ] **Bogor**: `[ISI: Nama Koordinator Bogor]` & `[ISI: Kontak WA / rencana lokasi]`

---

## 3. Tanggal & Lokasi Kopdar Pertama

- [ ] **`firstKopdarDate` (`src/lib/config.ts`)**: `[ISI: hari, tanggal, dan jam kopdar pertama]`
  - Muncul di beranda (`/`) pada section `#kopdar` dan halaman `/kegiatan`.
- [ ] **`firstKopdarLocation` (`src/lib/config.ts`)**: `[ISI: nama tempat dan alamat kopdar pertama]`
  - Muncul di beranda (`/#kopdar`) dan `/kegiatan`.
- [ ] **Rencana kopdar per wilayah (`src/components/peta/PetaContextualPanel.tsx`)**:
  - Setiap wilayah saat diklik di `/peta` menampilkan `[ISI: rencana jadwal dan titik temu kopdar wilayah <Nama Wilayah>]`.

---

## 4. Foto Asli & Keterangan Dokumentasi

- [ ] **`documentationCaption` (`src/lib/config.ts`)**: `[ISI: nama acara, tanggal, lokasi, dan jumlah alumni hadir]`
  - Dipakai sebagai keterangan foto di hero (`/`), section Dokumentasi (`/`), dan halaman `/tentang`.
- [ ] **Verifikasi izin foto yang terpasang**:
  - Pastikan foto `/images/alumni-gathering-4.jpg` (235,6 KB) dan `/images/hero-kumpul-bolo-pisah.jpg` (374,3 KB) sudah mendapat persetujuan dari peserta foto untuk dipublikasikan, lengkap dengan tanggal dan tempat pengambilannya.
  - Pertimbangkan menghapus file foto stok/duplikat yang tidak dipakai di `public/images/` (`hero-alumni.jpg`, `IMG_*.jpg`, dan avatar contoh jika tidak lagi memakai mode demo).

---

## 5. Kontak Resmi & Waktu Verifikasi

- [ ] **`contactEmail` (`src/lib/config.ts`)**: `[ISI: email resmi pengurus Jabodetabek]`
  - Dipakai di Footer, `/kepengurusan`, `/privasi`, `/syarat`, `/masuk`, `/admin`, `/app`, dan `/cerita`.
- [ ] **`contactWhatsapp` (`src/lib/config.ts`)**: `[ISI: nomor WhatsApp resmi sekretariat/korwil]`
  - Dipakai di Footer, `/kepengurusan`, `/privasi`, `/gabung` (state sukses), `/masuk`, `/peluang`, dan `/app`.
- [ ] **`verificationSla` (`src/lib/config.ts`)**: `[ISI: estimasi hari verifikasi oleh pengurus, misalnya 1-3 hari kerja]`
  - Dipakai pada pesan konfirmasi di `/gabung` dan `/peluang`.

---

## 6. Izin Penggunaan Nama/Logo & Hubungan dengan PP IKA UMS Pusat

- [ ] **`ppIkaUmsStatus` (`src/lib/config.ts`)**: `[ISI: status koordinasi / nomor SK resmi dengan PP IKA UMS Pusat]`
  - Muncul di `/tentang`, `/kepengurusan`, `/syarat`, `/privasi`, FAQ di `/`, dan Footer.
- [ ] **`ppIkaUmsChannelLabel` (`src/lib/config.ts`)**: `[ISI: tautan kanal resmi PP IKA UMS Pusat]`
  - Tambahkan URL resmi situs/Instagram/sekretariat PP IKA UMS Pusat setelah dikonfirmasi (saat ini hanya menautkan situs resmi kampus `https://www.ums.ac.id` lewat `ppIkaUmsUrl`).
- [ ] **Konfirmasi hak pakai logo**:
  - Pastikan emblem `/images/logo-emblem.png` dan `/images/logo-white-text.png` sesuai panduan resmi IKA UMS Pusat.

---

## 7. Catatan Integrasi Backend Sebelum Peluncuran Penuh

- [ ] Sambungkan formulir `/gabung`, form minat kopdar (`/#kopdar`), dan form permintaan mentoring (`/peluang`) ke endpoint server/database (misalnya Supabase / API Route Next.js + notifikasi WhatsApp/Email pengurus) karena saat ini isian hanya tersimpan sementara di peramban pengguna (`localStorage`).
- [ ] Pasang autentikasi sisi server (OTP WhatsApp / magic link email + session cookie `httpOnly` + middleware Next.js) untuk rute `/app` (`Profil Saya`), `/direktori` (`Daftar Anggota`), dan `/admin` (`Kelola Pendaftaran`, wajib role pengurus) sebelum mengaktifkan login publik.

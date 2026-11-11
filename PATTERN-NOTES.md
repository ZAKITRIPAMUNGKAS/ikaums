# Catatan Inspeksi & Arsitektur Sistem Pola Latar (Background Pattern System)

Dokumen ini ditulis sebelum perubahan kode/CSS apa pun untuk merangkum temuan token visual eksisting, struktur halaman, serta rancangan sistem pola latar **IKA UMS Wilayah Jabodetabek**.

---

## 1. Hasil Inspeksi Eksisting

### Stack & Konfigurasi CSS
- **Framework**: Next.js `16.4.6` (`App Router`, `cacheComponents: true`), React `19.3.0`, Tailwind CSS v4 (`@import "tailwindcss";` + `@theme` di `src/app/globals.css`, `@tailwindcss/turbopack`).
- **Tailwind Config**: Tidak ada `tailwind.config.js/ts` terpisah; konfigurasi tema menggunakan blok `@theme` di `src/app/globals.css`.
- **Dark Mode**: **Tidak ada**. Seluruh rute berjalan dalam mode terang hangat (*warm light mode*). Sesuai arahan proyek, dark mode tidak ditambahkan.
- **Font**: `Plus_Jakarta_Sans` melalui `next/font/google` dengan CSS variable `--font-sans` (`weight: 400, 500, 600, 700, 800`, `display: swap`).

### Token Warna Brand Eksisting (Dari `globals.css`, komponen, dan logo `logo-ika-ums.png` / `logo-emblem.png`)
- **Latar Dasar (Warm Paper White)**: `#FDFCF7` (latar halaman utama) dan `#FAF9F5` (`:root --background` pada `body`).
- **Latar Sekunder (Warm Linen Tint)**: `#F3F1EA` (dipakai pada strip *Cara Kerjanya*, *Mentoring Alumni*, kontak sekretariat, dan kotak info).
- **Brand Navy Tua (Primary Ink & Dark Surface)**: `#0C2340` (hover `#16325C`, varian tinta gelap `#0C1222` pada `body`).
- **Brand Gold / Amber (Accent)**:
  - `#92400E` untuk teks eyebrow / badge (kontras WCAG AA >= 4.5:1 di atas krem & putih hangat).
  - `#B45309` untuk ikon kecil & garis aksen tipis.
  - `#F59E0B` (hover `#FBBF24`) untuk aksen panah & tombol kontras tinggi di atas latar navy `#0C2340`.
- **Teks Sekunder**: `#475569` dan `#334155`.

### Token Radius, Border & Shadow Eksisting
- **Radius**: Kartu utama `rounded-2xl` (16px), kartu info / kontainer `rounded-xl` (12px), input / tombol kecil `rounded-lg` (8px), badge `rounded-full`.
- **Border**: Garis tipis transparan `border-[#0C2340]/10` hingga `border-[#0C2340]/15`.
- **Shadow**: Saat ini hanya memakai utilitas dasar `shadow-xs` / `shadow-2xs`, sehingga kartu di atas latar `#FDFCF7` terlihat hampir rata dan setiap section terasa seragam.

### Struktur 8 Section Landing Page (`src/app/page.tsx`) + Footer (`src/components/Navigation.tsx`)
1. **Hero** (`bg-[#FDFCF7]` polos): Kiri = badge status, `<h1>`, deskripsi, 1 CTA utama (`Daftar jadi anggota`), 1 tautan sekunder (`Masuk`), baris status; Kanan = kartu foto `aspect-[16/10]`.
2. **Apa yang Kamu Dapatkan** (`bg-[#FDFCF7]` + `border-t`): 3 kolom manfaat dengan garis aksen atas 2px.
3. **Cara Kerjanya** (`bg-[#F3F1EA]` datar + `border-y`): 3 langkah bernomor (`Langkah 01`–`03`).
4. **Usulkan Minat Kopdar Pertama** (`#kopdar`, `bg-[#FDFCF7]`): Kolom kiri info jadwal & tautan; kolom kanan kartu putih form minat wilayah & hari cocok.
5. **Dokumentasi Pertemuan Alumni** (`bg-[#FDFCF7]` + `border-t`): Foto `16:9` + keterangan di kanan.
6. **Mentoring Alumni** (`bg-[#F3F1EA]` datar + `border-y`): Deskripsi + 2 tombol (`Cari Mentor`, `Daftar Jadi Mentor`).
7. **Pertanyaan yang Sering Diajukan (FAQ)** (`bg-[#FDFCF7]`): Daftar `<details>` bersih.
8. **CTA Penutup** (`bg-[#0C2340]` kotak rounded di dalam section `#FDFCF7`): Ajakan mendata diri + 2 tombol.
9. **Footer** (`bg-[#0C2340]`): Logo putih full-width + deskripsi + status PP IKA UMS + 2 kolom tautan.

---

## 2. Rancangan Sistem Pola (`public/patterns/` & `globals.css`)

Seluruh pola menggunakan warna brand eksisting (`#0C2340`, `#92400E`, `#FDFCF7`, `#F59E0B`) via CSS variables (`--pattern-color`, `--pattern-opacity`, `--pattern-size`) pada pseudo-element `::before` (`pointer-events: none`) dan masking `mask-image` agar tepi memudar halus:

| Nama Pola | File SVG (`public/patterns/`) | Penggunaan & Karakter Visual | Target Opasitas |
|---|---|---|---|
| `pattern-dots` | `pattern-dots.svg` (dan variabel CSS `radial-gradient`) | Grid titik 24px (titik 1.15px) untuk area netral, manfaat, dan header halaman sub-rute. | `4.5% – 6%` |
| `pattern-batik` | `pattern-batik.svg` | Motif geometris orisinal terinspirasi *kawung / ceplok* Surakarta (garis tipis simetris tanpa logo organisasi). Untuk Hero, CTA penutup, dan versi tenang di Footer. | `5% – 8%` |
| `pattern-contour` | `pattern-contour.svg` | Garis kontur topografi melengkung halus (terinspirasi peta Jabodetabek). Untuk area `#kopdar`, header `/kegiatan`, dan halaman `/peta`. | `6% – 9%` |
| `pattern-grain` | `pattern-grain.svg` | Tekstur mikro-stipple sangat ringan (tanpa filter `feTurbulence` berat agar hemat CPU HP) sebagai tekstur kertas hangat halus. | `2.5% – 3.5%` (<= 4%) |

### Aturan Ritme, Pemisah, dan Aksesibilitas
- **Selang-seling Section Landing Page**:
  - Hero: `pattern-batik` memudar ke kanan/bawah (`tone="light"`) + `grain` dasar + pembatas lengkung halus.
  - Manfaat: `pattern-dots` sangat halus pada `tone="tint"` (`#F3F1EA`).
  - Cara Kerjanya: **Polos** (`#FDFCF7`), langkah bernomor tampil di atas permukaan kertas hangat dengan elevasi halus.
  - Kopdar Pertama (`#kopdar`): `tone="tint"` dengan `pattern-contour` memudar dari kanan atas (`fade="top-right"`), sedangkan kartu form tetap putih bersih (`bg-white`) + border & shadow lembut.
  - Dokumentasi Pertemuan: **Polos / grain saja** (`#FDFCF7`) agar foto dan caption menjadi fokus.
  - Mentoring Alumni: `tone="tint"` (`#F3F1EA`) sangat bersih (tanpa pola geometris, grain saja) karena berfokus pada profil/deskripsi.
  - FAQ: **Polos** (`#FDFCF7`).
  - CTA Penutup: `tone="brand"` (`#0C2340`) dengan `pattern-batik` terang (`#FDFCF7` pada ~7%).
  - Footer: `tone="brand-deep"` (`#08182E`) dengan variasi `pattern-batik` lebih tenang/besar (`opacity ~4.5%`) dan garis pemisah bermotif tipis di tepi atas.
- **Kontras WCAG AA**: Teks berpola selalu diukur terhadap warna campur tergelap/terterang motif. Eyebrow/label amber pada area krem atau berpola distandardisasi memakai `#92400E` (`>= 5.6:1`) menggantikan `#B45309` (`~4.05:1` di atas pola).
- **Performa & Gerak**: Default seluruh pola bersifat statis; dukungan `@media (prefers-reduced-motion: reduce)` mematikan transisi/animasi yang tidak esensial. Tidak memakai `background-attachment: fixed`.

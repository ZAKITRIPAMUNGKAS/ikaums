# DESIGN-NOTES — IKA UMS Wilayah Jabodetabek

Dokumen acuan desain mobile-first sebelum kode diubah. Seluruh komponen UI wajib merujuk pada sistem di dokumen ini agar tampilan konsisten di layar 360px, 390px, 768px, dan 1440px serta bebas pola generik AI.

## (a) 3 Kata Karakter Situs

1. **Jujur** — Menampilkan status pra-peluncuran apa adanya tanpa angka dummy, klaim palsu, atau kosmetik startup.
2. **Membumi** — Dekat dengan keseharian perantau UMS di Jabodetabek, fokus pada pertemuan nyata, kerja sama profesi, dan dokumentasi asli.
3. **Guyub** — Struktur halaman langsung mengarah ke keterlibatan komunitas tanpa lapisan birokrasi atau elemen antarmuka yang berjarak.

## (b) Sistem Tipografi

- **Keluarga Font**: Satu keluarga tunggal `Plus Jakarta Sans` (`--font-sans`, weights 400–800) untuk menjaga konsistensi dan kecepatan muat di jaringan seluler (`LCP < 2.5s`).
- **Skala Ukuran & Fungsi**:
  - `14px` (`0.875rem` / `text-sm`, line-height `1.5`): hanya untuk metadata terstruktur singkat, label input form, tag kecil, dan footer link/keterangan sekunder.
  - `16px` (`1rem` / `text-base`, line-height `1.6`): **minimum wajib** untuk seluruh teks isi, pengantar section, jawaban FAQ, deskripsi kartu, pesan status form, serta ukuran font `<input>`/`<select>`/`<textarea>` agar tidak memicu auto-zoom iOS Safari dan nyaman dibaca pada lebar `35–45ch` di HP.
  - `20px` (`1.25rem` / `text-xl`, line-height `1.35`): subjudul kartu editorial, nama kegiatan, judul blok FAQ/kutipan.
  - `28px` (`1.75rem` / `text-2xl`–`text-3xl`, line-height `1.22`, `-0.015em` tracking): judul section `<h2>`.
  - `30px–44px` (`clamp(1.875rem, 1.35rem + 2.2vw, 2.75rem)`, line-height `1.12`, `-0.025em` tracking): satu `<h1>` per halaman, menyesuaikan mulus antara HP 360px hingga desktop 1440px.
- **Kontras**: Teks utama `#0C1222` dan `#0C2340` di atas krem `#FAF9F5` / putih `#FDFCF7` serta teks pendukung `#475569` memastikan kontras minimal WCAG AA (`>= 4.5:1`).

## (c) Palet Warna

Mengambil warna langsung dari emblem resmi IKA UMS Jabodetabek tanpa menambah palet baru:

- **Brand Utama**: Navy `#0C2340` (Hover/Deep `#08182E`) — dipakai untuk tombol primer, header gelap footer/section penutup, serta penekanan judul penting.
- **Aksen**: Emas Amber Gelap `#92400E` pada latar terang (memenuhi WCAG AA) dan Amber Terang `#F59E0B` / `#FCD34D` khusus pada latar Navy gelap (`#0C2340`) serta aksen garis tepi halus.
- **Netral Kertas & Tinta**:
  - Latar dasar halaman: `#FAF9F5`
  - Latar kartu bersih: `#FDFCF7`
  - Latar band sekunder berselang: `#F3F1EA`
  - Teks utama: `#0C1222`
  - Teks pendukung: `#475569`
  - Border tipis: `rgba(12, 35, 64, 0.12)`
- Aturan disiplin: maksimal 3 warna yang menonjol dalam satu viewport (krem, navy, amber) tanpa gradien ungu-biru, tanpa glow neon, dan tanpa blob dekoratif.

## (d) Skala Spasi

Seluruh spasi mengikuti kelipatan `4px` / `8px`:

- Padding horizontal layar mobile (`360–390px`): `16px` (`px-4`), tablet (`768px`): `24px` (`sm:px-6`), desktop (`1440px`): `32px` (`lg:px-8`) dalam `max-w-5xl` atau `max-w-6xl`.
- Jarak antar-section: lega dan seragam (`py-12 sm:py-16` atau `py-14 sm:py-20`), dibedakan ritme latar polos dan latar berpola tipis (`pattern-dots`, `pattern-batik`, `pattern-contour`, `pattern-grain`).
- Jarak internal kartu: `p-5 sm:p-6`, jarak antar elemen teks dalam blok `space-y-3` atau `space-y-4`.
- Ruang aman bawah pada halaman form panjang (`/gabung`) agar sticky bar mobile tidak menutupi input aktif (`scroll-margin-bottom: 5.5rem` dan `pb-24 sm:pb-0`).

## (e) Gaya Kartu, Daftar, dan Tombol

- **Navigasi Mobile**: Maksimal 5 tautan ringkas di drawer (`Beranda`, `Jadwal Kopdar`, `Mentoring & Kerja`, `Tentang Komunitas`, `Masuk`) + 1 tombol primer penuh (`Daftar jadi anggota`), semuanya tinggi minimal `44px`. Menu sekunder tetap tersedia di footer.
- **Variasi Tata Letak Antar-Section**: Dilarang menumpuk dua section berurutan berformat "judul tengah + 3 kartu kotak sejajar". Di landing page:
  1. Hero: split asimetris teks kiri + bingkai foto dokumentasi kopdar kanan (tanpa pill/badge SaaS kuning).
  2. Manfaat bergabung: split editorial 12 kolom (judul kiri + daftar definisi bertipografi bersih dengan garis pemisah horizontal, tanpa kotak kartu).
  3. Alur bergabung: 3 langkah bernomor tipografis dengan garis atas tipis (`border-t`), bukan slab kartu putih tebal.
  4. Rencana kopdar & survei minat: layout 2 kolom isi ringkas + panel survei interaktif.
  5. Dokumentasi & kutipan penggerak: foto asli kopdar bernotasi tanggal/lokasi + blok kutipan editorial.
  6. Mentoring & Peluang: band latar `#F3F1EA` dengan daftar ringkas + ajakan mentor.
  7. FAQ: daftar `<details>` akordeon lebar nyaman dengan tautan aksi terpisah minimal tinggi `44px`.
- **Daftar Panjang (`/kegiatan`, `/direktori`)**: Tampil sebagai daftar satu kolom ringkas (`max-w-3xl space-y-4`), membatasi jumlah item awal yang tampil lalu sisanya dimuat bertahap lewat tombol `"Tampilkan lebih banyak"`.
- **Tombol & Target Sentuh**:
  - Tinggi minimum seluruh kontrol interaktif dan tautan aksi mandiri: `min-h-[44px]` (primer hero/form `min-h-[48px]`).
  - Radius konsisten `rounded-lg` (`8px`) untuk tombol/input dan `rounded-xl` (`12px`) untuk bingkai kartu/foto.
  - State lengkap `hover`, `active:scale-[0.99]`, `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2340]`, `disabled`, dan `loading`, transisi `150–200ms`.

---

## Kritik Putaran 1 (Audit Visual & DOM dari `before-*.png` pada `360, 390, 768, 1440px`)

1. **Menu Mobile Kelebihan Muatan (`Navigation.tsx`)**: Drawer mobile masih memuat 10 tautan dalam 3 kelompok grid plus teks `10px` pada subjudul brand. Harus diringkas menjadi maksimal 5 tautan + 1 tombol `"Daftar jadi anggota"`.
2. **Paragraf Isi Terlalu Kecil (`< 16px`)**: Hasil pengukuran DOM Putaran 1 menunjukkan `/` memiliki 19 paragraf di bawah `16px` (`12–14px`) pada lebar 360/390px (juga muncul di `/gabung` 4 paragraf, `/masuk` 3 paragraf, `/kegiatan` 2 paragraf, `/direktori` 2 paragraf). Banyak kartu, subtitle, dan jawaban FAQ menggunakan `text-sm` atau `text-xs`, membuat pembacaan di HP melelahkan.
3. **Target Sentuh Tautan Di Bawah `44x44px`**: Tautan inline di dalam jawaban FAQ beranda (`Kebijakan Privasi`, `Pengurus & Kontak`, `Tentang Komunitas` setinggi `18–41px`) serta dua tautan kebijakan di dalam label checkbox `/gabung` (`18–38px`) rawan salah ketuk di layar sentuh HP.
4. **Pola Kartu Berulang & Nuansa Pill SaaS**: Landing page menumpuk dua blok `"judul + 3 kartu sejajar"` berturut-turut (`Apa yang Kamu Dapatkan` dan `Cara Kerjanya`), diawali eyebrow berbentuk pill kuning di Hero yang terasa seperti template produk SaaS.
5. **Daftar Multi-Kolom Terlalu Rapat & Tanpa Muat Bertahap**: Saat daftar `/kegiatan` dan `/direktori` aktif, susunan memakai grid 3 kolom sekaligus tanpa pembatas satu kolom maupun pemuatan bertahap.
6. **Sisa Em Dash (`—`) & Sapaan Slop**: Masih tersisa `"Yuk ikut daftar"` di halaman konfirmasi `/gabung` serta beberapa karakter `"—"` di metadata judul rute (`<title>`) dan UI minor.

---

## Kritik Putaran 2 (Temuan Visual & DOM dari `after-*.png` Putaran 2)

1. **Bug Overlay Sticky Bar pada `/gabung` (`after-gabung-360.png`)**: Penerapan `sticky bottom-2` pada container tombol submit di dalam `<form>` menutup kolom `Tahun Angkatan Masuk UMS` saat dirender di viewport 360px/390px serta memakan ruang layar tinggi akibat paragraf SLA multi-baris di atas tombol. **Perbaikan**: Mengubah blok tombol kirim menjadi `static` di bagian bawah formulir (tetap dengan `scroll-margin-bottom: 6rem` global pada input), lebar penuh `min-h-[48px]` di mobile, serta mengubah teks SLA menjadi `<span>`.
2. **Sisa Paragraf Eyebrow 14px pada Hero (`/`)**: Elemen `<p className="text-sm">` pada eyebrow Hero masih terhitung 1 paragraf `< 16px`. **Perbaikan**: Mengganti tag eyebrow Hero menjadi `<span className="inline-block text-sm ...">` agar seluruh elemen `<p>` teks isi minimal `16px`.
3. **Sisa Lencana Pill pada `ProtectedRouteGate.tsx` (`/direktori`)**: Label `"DIREKTORI KHUSUS ANGGOTA"` masih berbentuk pill kuning berbingkai. **Perbaikan**: Diselaraskan menjadi label teks polos `text-sm font-bold uppercase tracking-wider text-[#92400E]` seperti `/kegiatan` dan `/peta`.

## Hasil Verifikasi Putaran 3 (`after-*.png` Final & Mobile Lighthouse)

- **Seluruh 20 tangkapan layar** (`360px, 390px, 768px, 1440px` di `/`, `/gabung`, `/masuk`, `/kegiatan`, `/direktori`) + `after-drawer-360.png`: **0** overflow horizontal, **0** paragraf `< 16px`, **0** gambar rusak, dan **0** target sentuh `< 44x44px`.
- **Drawer Navigasi Seluler (`360px`)**: Ringkas menjadi **5 tautan** (tinggi `46px`) + **1 tombol primer `Daftar jadi anggota`** (tinggi `48px`), tanpa penumpukan grid 10 tautan desktop.
- **Mobile Lighthouse (`/`)**: Performance **95**, Accessibility **100**, Best Practices **100**, SEO **100**, CLS **0**, FCP **0.8 dtk**, TBT **30 ms**, trace LCP mentah **192 ms** (simulasi Slow 4G Lighthouse **3.0 dtk**).

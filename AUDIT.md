# Audit Komprehensif Website IKA UMS Wilayah Jabodetabek (Pra-Launch)

**Tanggal Audit:** 11 November 2026  
**Target Sistem:** Web Komunitas IKA UMS Wilayah Jabodetabek (`D:\website\IKAUMS\web` · Next.js 16.4.6 + Tailwind CSS v4 + MapLibre GL)  
**Status Saat Ini:** Pra-launch (100% data simulasi/dummy, belum ada basis data anggota asli maupun backend autentikasi aktif).

---

## Ringkasan Eksekutif & Pengukuran Baseline

Berdasarkan pembacaan seluruh berkas di `src/` serta pengujian langsung di `http://localhost:3000/` (Playwright 390px/1440px dan Lighthouse Mobile):

| Aspek | Hasil Baseline Saat Ini | Masalah Kritis |
|---|---|---|
| **Kepercayaan & Kejujuran Data** | Angka palsu tampil sebagai fakta (`1.200+`, `1.248`, `~184`, `54/80 kursi`) | Tidak ada flag pemisah mode demo; selisih hitung antar-halaman (`1.011` vs `1.248` vs `1.200+`) |
| **Privasi & Keamanan Rute** | `/direktori` terbuka publik; `/admin` & `/app` bisa diakses siapa saja tanpa auth & tertaut di Footer | Tidak ada `noindex` di `/admin` & `/app`; default opt-in direktori di `/gabung` menyala (`true`) |
| **SEO & Shareability WhatsApp** | `og:title`, `og:description`, `og:image` **absen di seluruh 14 rute** (`og=False`) | Saat link dibagikan di grup WA alumni, preview muncul kosong |
| **Lighthouse Mobile (`/`)** | Performance **73** (LCP **7.7 s**, TTI **8.6 s**), Accessibility **95**, BP **100**, SEO **100** | Gambar mentah tak terkompresi (`hero-kumpul-bolo-pisah.jpg` 374 KB), `#D97706` gagal kontras (`< 4.5:1`), `heading-order` lompat |
| **Mobile Tap Target (390px)** | **46 dari 51** elemen interaktif di `/` memiliki tinggi `< 44px` (`smallTap=46/51`) | Tombol kecil, tautan footer padat, dan chip filter sulit ditekan di layar sentuh |

---

## Glosarium Resmi (Satu Istilah per Konsep)

Dipilih nada komunitas alumni yang lugas, sederhana, dan jujur (bukan gaya startup/SaaS dan bukan brosur kampus):

| Konsep | Istilah Resmi (Dipakai Seragam) | Istilah Lama yang Dihapus/Diganti |
|---|---|---|
| Pertemuan alumni wilayah | **Kopdar** & **Jadwal Kopdar** (`/kegiatan`) | Agenda, Kegiatan, Kumpul, Silaturahmi, Temu, Agenda Kumpul |
| Pendampingan karier senior–junior | **Mentoring Alumni** (**Cari Mentor** / **Jadi Mentor**) | Bimbingan, Ajak Ngobrol, Sesi Tanya Jawab, Konsultasi |
| Daftar anggota (khusus member login) | **Daftar Anggota** / **Profil Alumni** | Direktori Alumni, Direktori Perantauan, Database Alumni |
| Ajakan mendaftar | **Daftar jadi anggota** | Gabung, Bergabung, Daftar Alumni, Daftarkan Profil, Kirim Pendaftaran |
| Info lowongan & usaha alumni | **Info Kerja & Usaha** | Peluang Alumni, Bursa Lowongan, Sinergi Usaha |
| Halaman profil anggota (`/app`) | **Profil Saya** | Area Anggota, Portal Anggota |
| Halaman verifikasi pengurus (`/admin`) | **Kelola Pendaftaran** (tertutup/internal) | Panel Pengurus Wilayah, Panel Pengurus, Mode Simulasi Pengelolaan |
| Struktur & kontak pengurus (`/kepengurusan`) | **Pengurus & Kontak** | Tata Kelola & Organisasi |
| Sebaran wilayah | **Sebaran Wilayah** (di dalam form/halaman `/peta`) | Peta Sebaran Interaktif, Felt GIS |

---

## Fase 1A: Audit Copywriting

### 1. Klaim Tak Berdasar & Angka Tidak Konsisten
| Temuan | Keparahan | Lokasi File & Baris | Saran Perbaikan |
|---|---|---|---|
| Klaim `"1.200+ Alumni terhubung"` tampil di Hero sebagai angka nyata tanpa sumber/DB asli | **Tinggi** | `src/app/page.tsx:162`, `src/data/simulasi.ts:14` | Hapus kartu statistik palsu dari Hero pra-launch; tampilkan hanya jika ada counter nyata atau placeholder `[ISI: jumlah pendaftar terverifikasi]`. |
| Inkonsistensi matematis antar-halaman: penjumlahan 9 wilayah di `DATA_WILAYAH_SIMULASI` & `REGIONS_METADATA` = **1.011**, namun `STATS_JABODETABEK` & `/peta` menulis **1.248** dan Hero menulis **1.200+** | **Tinggi** | `src/data/simulasi.ts:14-127`, `src/app/peta/page.tsx:44`, `src/components/peta/MobileRegionList.tsx:24`, `src/app/admin/page.tsx:73` | Sembunyikan angka fiktif ketika `NEXT_PUBLIC_DEMO_MODE` nonaktif; di mode demo, samakan sumber angka atau tandai `"Contoh tampilan"`. |
| Klaim angka kursi & pendaftar acara fiktif (`"54 / 80 kursi"`, `"89 / 120 kursi"`, `"42 / 60 kursi"`) | **Tinggi** | `src/data/simulasi.ts:314-345`, `src/app/page.tsx:335`, `src/app/kegiatan/page.tsx:129` | Di pra-launch, ganti dengan form minat kopdar pertama atau event asli berstatus `[ISI: jadwal & kapasitas]`. |
| Testimoni `"Hendra Setiawan — Alumni Informatika 2016"` fiktif disajikan seolah kisah nyata | **Tinggi** | `src/app/page.tsx:625-632`, `src/data/simulasi.ts:352-365` | Hapus dari landing page pra-launch; pindahkan ke mode demo berlabel `"Contoh tampilan"`. |
| Klaim `"Datamu dikelola dengan aman"` dan `"Privasi terjaga sejak awal"` padahal belum ada autentikasi/backend | **Tinggi** | `src/app/page.tsx:736`, `src/app/tentang/page.tsx:101` | Nyatakan jujur alur penyimpanan data saat ini, siapa pengurus pemegangnya, dan untuk apa data dipakai. |
| Klaim `"210 mentor aktif"` & `"Partisipasi 61% aktif kopdar"` tanpa data nyata | **Sedang** | `src/app/peta/page.tsx:49`, `src/components/peta/PetaContextualPanel.tsx:78-83`, `src/data/jabodetabek-geo-meta.ts:33` | Sembunyikan seluruh metrik partisipasi palsu saat mode demo mati. |

### 2. Kata/Frasa Pengisi & Klise
Hasil pemindaian codebase menemukan pengulangan klise tinggi yang membuat situs terasa generik/kurang lugas:
- **`santai`** (15 kemunculan): `src/app/page.tsx:202, 526`, `src/app/direktori/page.tsx:485`, `src/data/simulasi.ts:50, 98, 110, 313, 321`, `src/data/jabodetabek-geo-meta.ts:97, 126, 242, 271`, `src/components/AccurateJabodetabekMap.tsx:61, 145, 447`.
- **`perantauan`** (13 kemunculan): `src/app/page.tsx:136, 359, 626, 736`, `src/app/app/page.tsx:326`, `src/app/cerita/page.tsx:38`, `src/app/direktori/page.tsx:145`, `src/app/kepengurusan/page.tsx:214`, `src/app/peta/page.tsx:28`, `src/app/tentang/page.tsx:28, 80`, `src/components/Navigation.tsx:60, 459`.
- **`rujukan`** (11 kemunculan): `src/app/page.tsx:233, 626`, `src/app/app/page.tsx:69, 323, 466, 475`, `src/app/privasi/page.tsx:82`, `src/app/syarat/page.tsx:50, 60`, `src/components/Navigation.tsx:456`, `src/data/simulasi.ts:361`.
- **`ngopi`** (8 kemunculan): `src/app/page.tsx:136`, `src/app/kegiatan/page.tsx:74`, `src/app/app/page.tsx:58`, `src/app/admin/page.tsx:394`, `src/data/simulasi.ts:62, 250, 388`, `src/components/AccurateJabodetabekMap.tsx:131`.
- **`jangan sungkan`** (`src/app/page.tsx:529`), **`sekadar`** (`src/app/page.tsx:136`), **`sudut-sudut`** (`src/app/page.tsx:230`), **`wadah`** (`src/components/Navigation.tsx:456`), **`hangat`** (`src/app/page.tsx:120, 195`).

**Keparahan:** Sedang. **Saran:** Tulis ulang seluruh kalimat memakai bahasa langsung dan konkret sesuai prinsip *spesifik > merdu; fakta > janji*.

### 3. Pola Template Berulang, Nada Campur, & CTA Tidak Jelas
| Temuan | Keparahan | Lokasi File & Baris | Saran Perbaikan |
|---|---|---|---|
| Struktur berulang di semua section landing page (`SPAN KAPITAL + H2 Title Case + 1 kalimat subjudul + grid kartu`) dan pola `**Label tebal:** penjelasan` beruntun | **Sedang** | `src/app/page.tsx:243-726` | Variasikan tata letak antar-section (contoh: daftar bernomor tanpa kartu berat, dua kolom tanya-jawab/FAQ, form minat satu baris, quote blok sederhana). |
| Nada campur SaaS vs komunitas: `"Tata Kelola Komunitas"`, `"Area Anggota"`, `"Panel Pengurus"`, `"Peta Sebaran Interaktif"`, `"database"`, `"Antarmuka"`, `"JSON/CSV dalam 1x24 jam"` | **Sedang** | `src/components/Navigation.tsx:480-488`, `src/app/page.tsx:657, 733, 750`, `src/app/masuk/page.tsx:100`, `src/app/app/page.tsx:559` | Ubah menjadi bahasa pengurus komunitas manusiawi dan seragam mengikuti Glosarium Resmi. |
| Tombol/CTA tidak menyebut hasil nyata: `"Gabung"` (mobile nav), `"Bergabung"` (desktop nav), `"Ajak Ngobrol"`, `"Lihat Detail"`, `"Terhubung"`, `"Baca"` | **Sedang** | `src/components/Navigation.tsx:298, 309`, `src/app/page.tsx:607`, `src/app/direktori/page.tsx:350`, `src/app/cerita/page.tsx:137` | Gunakan kata kerja + hasil: `"Daftar jadi anggota"`, `"Jadwalkan sesi mentoring"`, `"Lihat detail lowongan"`, `"Ajukan kenalan"`. |

### 4. Inkonsistensi Data Dummy & Status Organisasi Resmi IKA UMS
| Temuan | Keparahan | Lokasi File & Baris | Saran Perbaikan |
|---|---|---|---|
| **Salah pairing mentor-bidang:** `mentorList` mengambil **Dian Anggraini (Farmasi '20, Apoteker)** sebagai item ke-3 (`alm-dian`), namun kode hardcoded memberi label `Fokus bimbingan: Konsultasi Legalitas Usaha & Hak Kontrak Kerja` yang seharusnya milik Fajar Nugroho (Hukum '15) | **Tinggi** | `src/app/page.tsx:88, 597` & `src/data/simulasi.ts:180-209` | Tambahkan properti topik bimbingan langsung pada tipe data profil bila mode demo aktif, dan jangan pernah hardcode dengan ternary ID rapuh. |
| **Foto profil hilang & fallback salah wajah:** 6 dari 11 profil dummy (`alm-fajar`, `alm-bambang`, `alm-bagus`, `alm-taufik`, `alm-ratna`, `alm-arif`) tidak punya `avatarUrl`, dan modal `page.tsx:585, 767` memakai fallback `/images/avatar-aditya.jpg` (memakai foto Aditya untuk profil lain!) | **Tinggi** | `src/data/simulasi.ts:196-300`, `src/app/page.tsx:585, 767` | Gunakan inisial (`avatarInitials`) ketika `avatarUrl` kosong, jangan pernah tampilkan foto orang lain sebagai fallback. |
| Daur ulang 6 tokoh yang sama (`Aditya`, `Amalia`, `Rizal`, `Dian`, `Bagus`, `Hendra`) di direktori, mentor, koordinator wilayah, lowongan kerja, cerita dampak, portal anggota, dan antrean admin | **Sedang** | `src/data/simulasi.ts`, `src/app/peluang/page.tsx`, `src/app/app/page.tsx`, `src/app/admin/page.tsx` | Saat pra-launch (`DEMO_MODE` off), hapus semua profil fiktif tersebut; di mode demo beri penanda `"Contoh tampilan"`. |
| **Penggunaan nama & logo resmi "IKA UMS" (Ikatan Keluarga Alumni UMS):** belum ada kejelasan hubungan resmi dengan **PP IKA UMS Pusat** maupun tautan ke kanal resmi PP IKA UMS dan kampus Universitas Muhammadiyah Surakarta | **Tinggi** | `src/components/Navigation.tsx`, `src/app/tentang/page.tsx`, `src/app/kepengurusan/page.tsx` | Tambahkan keterangan jujur di FAQ, Tentang, dan Footer tentang status koordinasi dengan PP IKA UMS (`[ISI: status SK/hubungan resmi dengan PP IKA UMS]`) serta tautan resmi kanal PP IKA UMS & `ums.ac.id`. |

### 5. Tabel Perbaikan Copywriting (15 Kalimat Bermasalah: Sebelum → Sesudah)

| No | Lokasi | Sebelum | Sesudah |
|---|---|---|---|
| 1 | `src/app/page.tsx:132` | Tempat kumpul dan saling bantu sesama alumni UMS di Jabodetabek. | Kenal lagi alumni UMS di kotamu di Jabodetabek. |
| 2 | `src/app/page.tsx:136` | Biar di perantauan tidak jalan sendirian. Di sini kamu bisa cari teman satu almamater, minta saran dunia kerja dari alumni yang lebih dulu di Jakarta, atau sekadar janjian ngopi bareng di kotamu. | Daftar sebagai anggota untuk ketemu alumni sewilayah, ikut sesi mentoring karier, dan dapat kabar kopdar terdekat. |
| 3 | `src/app/page.tsx:162` | `1.200+ Alumni terhubung` | Dihapus pada pra-launch (ganti counter pendaftar nyata `[N] alumni sudah mendaftar` atau tidak tampilkan angka palsu). |
| 4 | `src/app/page.tsx:230` | Dari Kampus Pabelan dan Gonilan sampai ke sudut-sudut ibu kota. | Dokumentasi temu alumni UMS Jabodetabek (`[ISI: tanggal & lokasi acara]` · `[ISI: jumlah hadir]` peserta). |
| 5 | `src/app/page.tsx:233` | Pertemuan silaturahmi akbar lintas angkatan dan fakultas. Bertemu kawan lama masa kuliah, berkenalan dengan senior dan adik tingkat, serta saling membuka jalan rujukan karier di Jabodetabek. | Kumpul lintas angkatan alumni UMS Jabodetabek untuk saling kenal, bertukar kabar kerja, dan menyusun agenda wilayah berikutnya. |
| 6 | `src/app/page.tsx:252` | Datang dan gabung langsung. Semua kegiatan terbuka untuk seluruh alumni UMS tanpa memandang angkatan atau jurusan. | Kami sedang mengumpulkan jadwal kopdar pertama per wilayah. Pilih hari yang cocok buat kamu datang. |
| 7 | `src/app/page.tsx:365` | Cari rekan satu jurusan atau alumni UMS yang bekerja di industri yang sedang kamu minati di wilayah Jabodetabek. | Daftar anggota hanya tampil untuk alumni yang sudah login dan menyetujui profilnya ditampilkan. |
| 8 | `src/app/page.tsx:526-529` | Ngobrol Santai dan Minta Saran ke Alumni Senior. Baru wisuda atau baru pindah ke Jabodetabek? Jangan sungkan. Ada alumni senior yang siap meluangkan waktu untuk bantu review berkas lamaran atau berbagi tips bekerja di ibu kota. | Mentoring Karier dari Alumni yang Lebih Dulu Bekerja. Butuh masukan CV atau persiapan wawancara? Kamu bisa mengajukan sesi mentoring tanpa biaya dengan senior sebidang. |
| 9 | `src/app/page.tsx:649` | Temukan perkiraan sebaran alumni dan titik kumpul favorit di sekitar tempat tinggal atau kantormu. | Pilih wilayah tempat tinggalmu saat mendaftar agar pengurus mudah memberi kabar kopdar terdekat. |
| 10 | `src/app/page.tsx:733-736` | Belum tercatat di database alumni UMS Jabodetabek? Datamu dikelola dengan aman oleh pengurus dan hanya digunakan untuk saling menghubungkan sesama keluarga besar UMS di perantauan. | Belum terdaftar sebagai anggota IKA UMS Jabodetabek? Isi formulir 1 menit dengan data dasar. Nomor WhatsApp hanya dipakai pengurus untuk verifikasi dan undangan kopdar wilayah. |
| 11 | `src/components/Navigation.tsx:456-459` | Wadah silaturahmi, rujukan karier, dan saling bantu sesama alumni Universitas Muhammadiyah Surakarta yang berdomisili atau berkarya di Jakarta, Bogor, Depok, Tangerang, dan Bekasi. | Jaringan alumni Universitas Muhammadiyah Surakarta yang tinggal atau bekerja di Jakarta, Bogor, Depok, Tangerang, dan Bekasi. |
| 12 | `src/app/kegiatan/page.tsx:74` | Dari kopdar ngopi per wilayah sampai sesi berbagi pengalaman kerja. Tandai kehadiranmu supaya panitia mudah menyiapkan tempat. | Daftar jadwal kopdar resmi per wilayah. Konfirmasi hadir membantu panitia menyiapkan kapasitas tempat. |
| 13 | `src/app/gabung/page.tsx:148` | Lengkapi data dasar Anda agar koordinator wilayah dapat menghubungkan Anda dengan rekan seangkatan, komunitas domisili terdekat, serta kegiatan kopdar resmi. | Isi data dasar untuk mendaftar. Pengurus akan mengecek latar alumni dan mengirim undangan grup wilayah ke WhatsApp kamu. |
| 14 | `src/app/tentang/page.tsx:28` | Menyambung Silaturahmi Alumni Universitas Muhammadiyah Surakarta di Perantauan | Jaringan alumni UMS di Jabodetabek agar tetap saling mengenal setelah lulus. |
| 15 | `src/app/privasi/page.tsx:92-95` | ...mengunduh salinan data pribadinya, atau meminta penghapusan akun secara permanen melalui menu Portal Anggota atau menghubungi sekretariat pengurus Jabodetabek. | Kamu bisa meminta perubahan atau penghapusan datamu kapan saja dengan mengirim pesan ke kontak pengurus di `[ISI: email & WhatsApp pengurus]`. |

---

## Fase 1B: Audit Struktur, UI, Aksesibilitas, Mobile, & Performa

1. **Urutan & Kepadatan Landing Page (`src/app/page.tsx` — Keparahan: Tinggi)**
   - Saat ini ada 8 bagian besar (`Hero + 3 stat → Foto Penuh → Agenda → Direktori → Mentoring → Kutipan → 9 Kartu Wilayah → Ajakan Daftar`). Terlalu panjang (`7.537px` di mobile 390px) dan memunculkan dua foto besar beruntun di 2 layar teratas tanpa keterangan tanggal/jumlah hadir.
   - Tombol di Hero (`Cari Rekan Alumni` dan `Agenda Kumpul`) saling bersaing dan belum mengarah ke konversi utama pra-launch (**Daftar jadi anggota**).
   - 9 kartu wilayah di bawah menyita ruang vertikal besar dengan angka estimasi fiktif.
2. **Empty State Saat Pra-Launch (`NEXT_PUBLIC_DEMO_MODE=false` — Keparahan: Tinggi)**
   - Tidak ada penanganan apabila array `DATA_ALUMNI_SIMULASI` / `DATA_KEGIATAN_SIMULASI` kosong: `/kegiatan` men-dereference `featuredEvent.id` (`src/app/kegiatan/page.tsx:49`) dan `/cerita` men-dereference `featured.gambar` (`src/app/cerita/page.tsx:55`) sehingga akan crash (`TypeError: Cannot read properties of undefined`) bila list dikosongkan!
3. **Kontras Warna WCAG AA (`color-contrast` Lighthouse = 0 — Keparahan: Tinggi)**
   - Teks amber `text-[#D97706]` pada latar `#FDFCF7` memiliki rasio kontras ~`3.12:1` (gagal batas minimal `4.5:1` teks normal) di navbar tagline, label section Hero/Agenda/Direktori/Mentoring/Wilayah. Harus digelapkan ke `#B45309` (`~5.0:1`) atau `#92400E` (`~7.0:1`).
   - Teks `#64748B` di atas latar `#F3F1EA` (`~4.1:1`) perlu digelapkan menjadi `#475569`.
4. **Urutan Heading (`heading-order` Lighthouse = 0 — Keparahan: Sedang)**
   - `Navigation.tsx:465, 479` memakai `<h4>` langsung di Footer sehingga menyebabkan lompatan `H2 -> H4` di `/`, `/gabung`, `/tentang`, `/kepengurusan`, `/privasi`, `/syarat`, `/admin`, dan `H1 -> H4` di `/masuk`.
   - `page.tsx:540, 550, 560, 592` memakai `<h4>` di bawah `<h2>`/`<h3>` secara tidak urut; `direktori/page.tsx:287` memakai `<h3>` langsung di bawah `<h1>` (`H1 -> H3`).
5. **Tap Target Mobile `< 44px` (`smallTap=46/51` di `/` — Keparahan: Tinggi)**
   - Hampir semua tombol chip (`py-2`), link footer, tombol modal (`py-2`), dan CTA mobile header (`py-1.5`) lebih pendek dari `44px`. Perlu `min-h-[44px]` pada elemen interaktif mobile agar nyaman ditekan ibu jari.
6. **Performa Mobile (Lighthouse Performance `73`, LCP `7.7 s` — Keparahan: Tinggi)**
   - Semua foto (`hero-kumpul-bolo-pisah.jpg` 374 KB, `alumni-gathering-4.jpg` 235 KB, logo PNG 144–156 KB) memakai tag `<img>` mentah tanpa `next/image` (tidak ada WebP/AVIF responsif), tanpa atribut `width`/`height` eksplisit pada logo footer (`unsized-images`), dan tanpa `loading="lazy"` di gambar bawah lipatan.
   - `next/font` di `layout.tsx` memuat 3 keluarga font sekaligus (`Jakarta Sans`, `Newsreader`, `JetBrains Mono`) padahal hampir seluruh UI hanya menggunakan `Plus Jakarta Sans`.
   - Komponen usang `src/components/AccurateJabodetabekMap.tsx` (468 baris) memakai `animate-pulse` dan istilah `"FELT GIS"`, meski tidak lagi dirender oleh rute mana pun (dead code).
7. **SEO & Open Graph untuk Grup WhatsApp (Keparahan: Tinggi)**
   - `layout.tsx` belum mengatur `metadataBase`, `openGraph` (`title`, `description`, `locale: 'id_ID'`, `images`), maupun `twitter` card. Saat dibagikan di grup WA alumni UMS, link tidak menampilkan ringkasan yang jelas.

---

## Fase 1C: Audit Form & Alur Pendaftaran

1. **`/gabung` (`src/app/gabung/page.tsx`) — Keparahan: Tinggi**
   - **Terlalu banyak field pada langkah awal (11 field):** `namaLengkap`, `email`, `whatsapp`, `prodi`, `angkatan`, `wilayah`, `pekerjaan`, `perusahaan`, `siapMentoring`, `tampilDiDirektori`, `tampilDiPeta`, `agreeConsent`. Seharusnya cukup 5–6 field wajib inti (`nama`, `angkatan`, `prodi`, `wilayah`, `whatsapp`, opsional `email`) di langkah pertama; pekerjaan/perusahaan & mentoring bisa opsional yang ringkas.
   - **Bug validasi WhatsApp & email:** `handleSubmit` (`gabung/page.tsx:113`) **tidak memeriksa `formData.whatsapp` sama sekali** walaupun labelnya bertanda `*` wajib, tidak memvalidasi format nomor HP Indonesia (`08...` / `+628...`), dan tidak memvalidasi format email.
   - **Risiko privasi default ON:** `tampilDiDirektori: true` dan `tampilDiPeta: true` (`gabung/page.tsx:103-104`) menyala otomatis tanpa persetujuan sadar pengguna. Harusnya default **TIDAK** (`false`) dan dipisahkan tegas dari persetujuan pemrosesan data (`agreeConsent`).
   - **Aksesibilitas & keyboard mobile:** Field belum memakai `autoComplete="name"`, `autoComplete="email"`, `autoComplete="tel"`, dan `inputMode="tel"` / `"email"`. Pesan error hanya satu banner di atas, tidak muncul di dekat field masing-masing.
   - **Perlindungan spam & UX:** Belum ada honeypot anti-bot tersembunyi, cek duplikat lokal (WhatsApp/email sudah dikirim), status loading, proteksi double-submit, dan halaman sukses belum punya tombol "Bagikan link pendaftaran ke grup WhatsApp alumni".
2. **`/masuk` (`src/app/masuk/page.tsx`) — Keparahan: Tinggi**
   - Tidak memakai password (bagus, konsep tautan masuk / kode verifikasi), tetapi: tidak memvalidasi format email dengan benar, belum menyediakan pilihan WhatsApp/OTP atau panduan `"Lupa akses / ganti email"`, dan **memajang tautan `"Demo Panel Pengurus"` (`/admin`) di halaman login publik**.
3. **Form RSVP & Form Mentoring di `/` & `/peluang` — Keparahan: Sedang**
   - RSVP modal di `/` memakai input teks bebas untuk prodi+angkatan (rawan inkonsisten), belum menormalisasi WhatsApp, dan otomatis menutup modal via `setTimeout(2000)` sebelum user sempat membaca konfirmasi.
   - Modal mentoring di `src/app/page.tsx:959-997` tidak meminta nama, prodi/angkatan, maupun nomor WhatsApp pengirim sehingga di dunia nyata mentor tidak tahu siapa yang menghubungi!

---

## Fase 1D: Audit Halaman Lain & Risiko Privasi/Akses

| Route | Tujuan | Relevansi Pra-Launch | Masalah Privasi, Copy, & Struktur | Rekomendasi | Keparahan |
|---|---|---|---|---|---|
| `/` | Pengenalan + ajakan daftar | Inti pra-launch | 8 section penuh data fiktif, 3 stat palsu, CTA tidak konsisten | Susun ulang ke versi pra-launch 8 bagian yang fokus satu CTA `"Daftar jadi anggota"` + form minat kopdar | **Tinggi** |
| `/gabung` | Pendaftaran anggota | Inti pra-launch | `whatsapp` tidak divalidasi, checkbox direktori default `true`, tak ada honeypot | Sederhanakan field inti, perketat validasi WA `+62/08`, default direktori `false`, tambah share WA di sukses | **Tinggi** |
| `/masuk` | Masuk portal anggota | Diperlukan (pra-launch info) | Punya pintasan langsung ke `/admin`; belum ada alur lupa akses | Hapus link `/admin`, tambahkan alur verifikasi/lupa akses, dan status non-aktif saat DB belum terhubung | **Tinggi** |
| `/direktori` | Daftar anggota terverifikasi | **Belum siap (privasi & kosong)** | Menampilkan profil, foto, dan tempat kerja secara **publik tanpa login**; melompati `H1->H3` | Kunci di balik status login anggota (saat DB/auth belum aktif, tampilkan gate pra-launch + form daftar; data dummy hanya di `DEMO_MODE=true`) | **Tinggi** |
| `/admin` | Verifikasi pendaftar & acara | **Internal pengurus saja** | Tanpa auth server-side, terindeks mesin pencari (`robots=None`), **tertaut dari Footer publik!** | Hapus dari Footer publik, pasang `robots: noindex, nofollow`, tampilkan gerbang autentikasi pengurus | **Tinggi** |
| `/app` | Profil saya & sapaan | Anggota login saja | Tanpa auth, tanpa `noindex`, tertaut dari Footer sebagai `"Area Anggota"` | Tambah `noindex, nofollow`, pindahkan akses lewat alur `/masuk` (hapus link Footer SaaS `"Area Anggota"`) | **Sedang** |
| `/kegiatan` | Jadwal kopdar wilayah | Siap untuk pra-launch jika jujur | Berisi jadwal & kuota palsu; crash jika array kosong | Gunakan mode `DEMO_MODE`: bila OFF tampilkan empty state jujur + form usul kopdar | **Tinggi** |
| `/peta` | Sebaran kota Jabodetabek | Sekunder di pra-launch | Menampilkan angka palsu `1.248` dan `210 mentor`; MapLibre cukup berat (~250KB) | Bila `DEMO_MODE` OFF, sembunyikan angka fiktif & fokus pada 9 titik kumpul potensial + CTA daftar | **Sedang** |
| `/peluang` | Mentoring & info kerja | Belum punya isi asli | Berisi 4 lowongan/mentor fiktif & kisaran gaji karangan | Bila `DEMO_MODE` OFF, tampilkan ajakan `"Jadi Mentor / Kirim Info Kerja"` + empty state jujur `"Segera Hadir"` | **Sedang** |
| `/cerita` | Cerita sesama alumni | Belum ada wawancara asli | Berisi 3 artikel karangan (Hendra, Amalia, Rizal); crash jika kosong | Sembunyikan dari navigasi utama saat pra-launch atau tampilkan state `"Segera Hadir — Bagikan Ceritamu"` | **Sedang** |
| `/tentang` | Profil & relasi organisasi | Penting untuk kepercayaan | Belum menjelaskan hubungan dengan **PP IKA UMS Pusat** dan nama pengurus penanggung jawab | Tambahkan klarifikasi resmi PP IKA UMS + link `ums.ac.id` / kanal IKA UMS + ringkas nada SaaS | **Tinggi** |
| `/kepengurusan` | Pengurus & korwil | Penting untuk kepercayaan | Sudah memakai placeholder `[ISI — ...]` untuk inti, tetapi tabel korwil masih memakai 9 nama simulasi | Di pra-launch (`DEMO_MODE` OFF), pakai placeholder `[ISI: ...]` juga untuk Korwil 9 wilayah, bukan nama fiktif | **Tinggi** |
| `/privasi` & `/syarat` | Kebijakan data & etika | Penting untuk persetujuan form | Menyebut fitur yang belum ada (`ekspor JSON/CSV 1x24 jam`, `Portal Anggota otomatis`) | Tulis ulang jujur dalam bahasa awam sesuai praktik pra-launch (data disimpan oleh pengurus, kontak tidak dipajang publik, hak hapus via kontak pengurus) | **Tinggi** |

---

## Catatan Infrastruktur Belum Ada (Scope Blockers untuk Frontend-Only)
Karena proyek saat ini adalah situs statis/client-side tanpa database atau layanan autentikasi aktif:
- Penyimpanan pendaftaran, OTP/magic link email & WhatsApp sungguhan, proteksi rate-limit sisi server, serta sesi login `/app` dan `/admin` memerlukan backend API/database (misalnya Next.js Route Handlers + Supabase/Postgres/Auth) sebelum rilis publik penuh. Pada Fase 2 ini, seluruh UI, validasi, gerbang privasi, flag `NEXT_PUBLIC_DEMO_MODE`, metadata SEO/OG, aksesibilitas, dan placeholder `[ISI: ...]` disiapkan agar siap disambungkan tanpa menampilkan satu pun klaim palsu.

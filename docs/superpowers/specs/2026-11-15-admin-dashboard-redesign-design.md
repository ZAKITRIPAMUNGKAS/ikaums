# Redesign Dashboard Admin IKA UMS

## Intent

Membuat halaman `/admin` terasa seperti ruang kendali pengurus: ringkas saat dipindai, jelas dalam memprioritaskan pekerjaan, dan tetap berwibawa sesuai identitas IKA UMS. Pengurus harus dapat melihat antrean verifikasi, kesehatan konten, serta jalan pintas untuk aksi rutin tanpa kehilangan akses ke seluruh modul yang sudah ada.

## Goals

- Memperjelas hierarki: konteks organisasi, tugas prioritas, metrik, lalu modul kerja.
- Mempertahankan semua data, route API, filter, modal, dan aksi saat ini.
- Membuat layar 375px sampai desktop mudah digunakan melalui susunan kartu dan tab yang dapat digulir secara horizontal.
- Menjaga aksesibilitas: fokus keyboard terlihat, status tidak bergantung pada warna saja, serta target sentuh minimum 44px.

## Non-goals

- Tidak mengubah model data, endpoint, autentikasi, atau logika mutasi.
- Tidak menambah dependensi, grafik, animasi baru, atau tema gelap.
- Tidak mengubah konten pada formulir pengelolaan di dalam setiap tab.

## Approaches

1. Penyegaran kosmetik: hanya mengganti warna dan radius. Cepat, tetapi tidak menyelesaikan kepadatan dan prioritas aksi.
2. **Control room editorial (dipilih):** memadukan panel konteks navy, kartu prioritas yang menonjolkan antrean verifikasi, metrik pendukung, dan nav modul bergaya segmented control. Perubahan berdampak langsung pada keterbacaan tanpa mengganggu fungsi.
3. Sidebar aplikasi penuh: memberi struktur kuat di desktop, namun memerlukan restrukturisasi besar dan berisiko memperumit perangkat mobile.

## Design Direction

- Palet tetap berasal dari brand saat ini: navy `#0C2340`, navy gelap `#08182E`, putih, slate, amber `#92400E`, emerald `#047857`, dan merah destruktif.
- Header menjadi satu panel navy dengan pola cahaya halus: breadcrumb/status, judul, ringkasan, dan tiga aksi utama terorganisasi dalam satu konteks.
- Metrik dibedakan berdasarkan fungsi: kartu antrean memakai aksen amber dan CTA tab, sedangkan empat kartu lain menjadi indikator sekunder yang lebih tenang.
- Tab dipertahankan sebagai satu baris scrollable; setiap tombol mendapat `role=tab`, `aria-selected`, dan badge tidak hanya memakai warna.
- Pada mobile, panel header dan aksi ditumpuk, kartu metrik memakai dua kolom, serta aksi utama mendapat lebar penuh bila ruang terbatas.

## Acceptance Criteria

- Teks, handler, dan condition rendering untuk enam tab admin tetap ada.
- Dashboard memperlihatkan kartu prioritas verifikasi, empat metrik pendukung, dan toolbar modul yang dapat diakses.
- Aksi tambah alumni, tambah kopdar, tambah loker, unduh CSV, dan keluar tetap berfungsi dengan handler/href lama.
- Kontrak pengujian memeriksa keberadaan struktur visual dan semantics tab baru.
- `npm test`, ESLint, dan `next build` berhasil.

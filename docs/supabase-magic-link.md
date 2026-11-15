# Konfigurasi Magic Link Supabase

Implementasi aplikasi menggunakan `pendaftar.email` dengan status `disetujui` sebagai syarat akses anggota. Tidak ada akun anggota yang dibuat otomatis dari form login.

## Environment production

Isi environment berikut di penyedia hosting, lalu buat ulang deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<secret-server-only-key>
APP_URL=https://domain-produksi-anda.id
AUTH_SESSION_SECRET=<secret-acak-minimal-16-karakter>
ADMIN_PASSKEY=<kata-sandi-acak-minimal-16-karakter>
NEXT_PUBLIC_DEMO_MODE=false
```

Jangan pernah memberi prefix `NEXT_PUBLIC_` pada `SUPABASE_SERVICE_ROLE_KEY`, `AUTH_SESSION_SECRET`, atau `ADMIN_PASSKEY`.

## Dashboard Supabase

1. Buka **Authentication → URL Configuration**.
2. Atur **Site URL** ke domain production.
3. Tambahkan `https://domain-produksi-anda.id/auth/confirm` sebagai Redirect URL.
4. Pada template **Invite user**, gunakan callback server-side berikut:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite">
  Buka akses IKA UMS
</a>
```

5. Pada template **Magic Link**, gunakan callback berikut:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Masuk ke IKA UMS
</a>
```

6. Gunakan SMTP organisasi sebelum rilis agar email tidak dibatasi layanan bawaan dan tidak masuk spam.

## Alur operasional pengurus

1. Pastikan pendaftar mengisi email yang benar.
2. Ubah status pendaftar menjadi `disetujui` di panel pengurus.
3. Sistem mengirim undangan Supabase satu kali untuk email tersebut.
4. Setelah undangan diterima, anggota masuk lewat tab **Email** dan menerima magic link untuk sesi berikutnya.

Jika undangan gagal dikirim, status persetujuan tetap tersimpan dan API memberi pesan peringatan. Periksa konfigurasi Supabase/SMTP sebelum mengirim ulang.

# Admin Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah presentasi dashboard `/admin` menjadi control room yang lebih jelas dan responsif tanpa mengubah fungsi pengelolaan.

**Architecture:** Seluruh perubahan berada pada markup dan utilitas Tailwind di `AdminDashboardClient.tsx`. State, handler, API route, modal, dan isi tiap tab dipertahankan. Kontrak source-level di test runner mencegah struktur visual inti dan semantics tab terhapus.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide React, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-15-admin-dashboard-redesign-design.md`

## Global Constraints

- Jangan ubah API, autentikasi, data, handler, atau dependensi.
- Gunakan palet brand yang sudah ada dan target interaksi minimum 44px.
- Pertahankan reduced-motion dan fokus keyboard yang terlihat.

## Review Focus

- Layar 375px: aksi dan kartu metrik tidak memotong teks atau menghilangkan akses.
- Tab yang panjang tetap dapat dipilih melalui keyboard maupun scroll horizontal.
- Status verifikasi tidak hanya disampaikan dengan warna.
- Handler aksi cepat dan href ekspor CSV tidak berubah.
- Loading state tetap jelas pada header baru.

### Task 1: Kontrak UI Dashboard

**Files:**
- Modify: `scripts/run-tests.mjs`
- Test: `scripts/run-tests.mjs`

**Interfaces:**
- Consumes: source `src/app/admin/AdminDashboardClient.tsx`
- Produces: kontrak regresi atas struktur control room dan semantic tab.

- [ ] **Step 1: Write the failing test**

Tambahkan test `Dashboard admin memakai struktur control room yang aksesibel` yang mengharapkan `Prioritas hari ini`, `role="tablist"`, `aria-selected`, dan `Tinjau pendaftar` pada source.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL karena struktur control room belum ada.

- [ ] **Step 3: Implement the visual structure in `src/app/admin/AdminDashboardClient.tsx`**

Ganti blok header, metrik, dan navigasi tab dengan panel konteks navy, kartu prioritas, metrik pendukung, serta toolbar modul bersemantik tab; pertahankan setiap handler dan state yang ada.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS termasuk kontrak dashboard baru.

- [ ] **Step 5: Verify responsive rendering and application quality**

Run: `node node_modules\\eslint\\bin\\eslint.js` dan `node node_modules\\next\\dist\\bin\\next build`
Expected: kedua perintah keluar dengan kode 0.

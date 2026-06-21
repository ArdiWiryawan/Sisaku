# SisaKu

SisaKu adalah PWA budgeting harian untuk mahasiswa dan anak muda. Fokus utamanya bukan mencatat uang habis ke mana, tetapi menjawab:

```text
Hari ini aman pakai berapa supaya uangku cukup sampai hari terakhir?
```

## Ringkasan Produk

- **Goal:** user membuat budget berdasarkan uang dan durasi, lalu melihat batas aman pengeluaran harian.
- **Core flow:** buat pocket, lihat angka aman harian, catat pengeluaran cepat, cek status Aman/Waspada/Bahaya, lihat recovery message jika mulai mepet.
- **Data model:** `Pocket`, `Expense`, `Category`, `QuickAddTemplate`, dan `AppSettings` disimpan local-first di `localStorage`.
- **Budget logic:** `remainingMoney = totalBudget - totalSpent`, `remainingDays = endDate - today + 1`, `safePerDay = remainingMoney / remainingDays`.
- **PWA:** manifest, icon 192/512/maskable, service worker app-shell caching, standalone display, install guidance.
- **UX:** Bahasa Indonesia, suportif, ringan, tanpa copy yang menghakimi.

## Fitur MVP

- Onboarding dan pembuatan pocket pertama.
- Multiple budget pocket, detail pocket, set pocket aktif, edit, dan hapus.
- Dashboard dengan angka `Hari ini aman pakai` sebagai elemen utama.
- Quick add template: Makan 15K, Kopi 12K, Transport 20K, Print 5K, Laundry 10K.
- Tambah, edit, hapus, dan filter riwayat pengeluaran.
- Insight ringan: kategori terbesar, total hari ini, total minggu ini, rekomendasi sederhana.
- Export CSV dan reset data lokal.
- Offline-first basic setelah first load production.

## Keputusan Implementasi

- Dokumentasi memakai dua nama field budget: `initialBudget` dan `totalBudget`. Implementasi memakai `totalBudget` sesuai dokumen Data Model.
- Dokumentasi menyebut kategori sebagai string dan `categoryId`. Implementasi memakai `categoryId` agar data lebih stabil.
- Reminder masih placeholder sesuai scope MVP, belum memakai native notification.
- Install prompt otomatis belum dipaksa; halaman Saya memberi panduan Android Chrome dan iOS Safari.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

Test logic:

```bash
npm run test
```

## Publish

Build output ada di:

```text
dist/
```

Deploy ke Vercel, Netlify, atau Cloudflare Pages dengan command build:

```bash
npm run build
```

Pastikan deployment berjalan di HTTPS agar PWA install dan service worker aktif dengan benar.

## Catatan Privasi

SisaKu MVP tidak memakai login, backend, bank sync, atau e-wallet sync. Data pengguna tersimpan di perangkat/browser pengguna. Export CSV disediakan sebagai backup manual.

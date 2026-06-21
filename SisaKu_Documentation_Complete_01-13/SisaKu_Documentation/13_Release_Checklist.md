# SisaKu — Release Checklist

**Versi:** 1.0  
**Produk:** SisaKu — PWA Budgeting Harian untuk Mahasiswa  
**Status:** MVP Documentation

---

## 1. Tujuan Dokumen

Dokumen ini menjadi checklist sebelum SisaKu dirilis sebagai PWA yang bisa dibuka lewat link dan diinstall di HP. Checklist ini memastikan produk siap secara:

- produk,
- UI/UX,
- teknis,
- data,
- PWA,
- QA,
- privacy,
- deployment,
- post-release monitoring.

---

## 2. Release Scope MVP

### 2.1 Included in MVP

```text
Create pocket budget X hari
Safe-to-spend today
Add expense
Edit/delete expense
Budget status Aman/Waspada/Bahaya
Recovery message basic
History
Local data storage
Export CSV
Reset data
PWA manifest
Service worker/app shell caching
Installable to home screen
Responsive mobile-first UI
```

### 2.2 Not Included in MVP

```text
Login
Cloud sync
Bank/e-wallet sync
AI insight
Native push notification advanced
APK Play Store
Multi-device sync
Subscription/payment
```

---

## 3. Product Readiness Checklist

- [ ] Product positioning jelas: daily allowance planner, bukan expense tracker biasa.
- [ ] Tagline final tersedia.
- [ ] Core promise jelas di onboarding.
- [ ] Target user jelas: mahasiswa/anak kos/anak muda.
- [ ] Problem statement sudah tertulis.
- [ ] MVP scope tidak melebar.
- [ ] Non-goals disepakati.
- [ ] Success metric ditentukan.
- [ ] North Star Metric ditentukan.

Recommended North Star:

```text
Jumlah pocket budget yang selesai tanpa uang habis sebelum waktunya.
```

---

## 4. UX Readiness Checklist

- [ ] Onboarding selesai dalam kurang dari 1 menit.
- [ ] User langsung melihat safe-to-spend setelah membuat pocket.
- [ ] Home menjawab “hari ini aman pakai berapa?” dalam 3 detik.
- [ ] Catat pengeluaran bisa dilakukan kurang dari 10 detik.
- [ ] Navigasi hanya memakai tab utama: Home, Pocket, Riwayat, Saya.
- [ ] Empty state punya CTA jelas.
- [ ] Error message membantu user memperbaiki input.
- [ ] Recovery message tidak menghakimi.
- [ ] Tidak ada istilah teknis finance yang berat.
- [ ] Bahasa aplikasi konsisten dengan UX Writing Guide.

---

## 5. UI Readiness Checklist

- [ ] Safe Number Card menjadi elemen paling dominan di Home.
- [ ] Status Aman/Waspada/Bahaya konsisten warna dan teks.
- [ ] Semua tombol utama minimal 44px tinggi.
- [ ] UI nyaman di layar 360px.
- [ ] Bottom navigation tidak menutupi konten penting.
- [ ] Form input tidak overflow.
- [ ] Card dan spacing konsisten.
- [ ] Tampilan tidak terlalu ramai.
- [ ] Mode desktop tetap rapi walau bukan prioritas utama.
- [ ] Icon dan label tidak ambigu.

---

## 6. Budgeting Logic Checklist

- [ ] `remainingMoney = totalBudget - totalSpent` benar.
- [ ] `remainingDays = endDate - today + 1` benar.
- [ ] `safePerDay = remainingMoney / remainingDays` benar.
- [ ] Budget 1 hari ditangani dengan benar.
- [ ] Budget habis ditandai Bahaya.
- [ ] Pocket selesai jika periode berakhir.
- [ ] Edit expense menghitung ulang summary.
- [ ] Delete expense menghitung ulang summary.
- [ ] Expense lebih besar dari budget tidak membuat app crash.
- [ ] Semua nominal diformat sebagai Rupiah.

---

## 7. Data Checklist

- [ ] Data pocket tersimpan setelah refresh.
- [ ] Data expense tersimpan setelah refresh.
- [ ] Data tetap ada setelah PWA ditutup dan dibuka kembali.
- [ ] Export CSV berjalan.
- [ ] Reset data meminta konfirmasi.
- [ ] Cancel reset tidak menghapus data.
- [ ] Schema version tersedia.
- [ ] Migration strategy dasar tersedia.
- [ ] Data sample/test tidak ikut production build.
- [ ] Privacy note tersedia di aplikasi.

---

## 8. Technical Checklist

### 8.1 Build

- [ ] Project dapat berjalan dengan `npm install`.
- [ ] Project dapat berjalan dengan `npm run dev`.
- [ ] Production build berhasil dengan `npm run build`.
- [ ] Preview build berhasil dengan `npm run preview`.
- [ ] Tidak ada error console kritis.
- [ ] Tidak ada dependency yang tidak digunakan secara besar.

### 8.2 Code Quality

- [ ] Struktur folder rapi.
- [ ] Komponen dipisahkan dengan jelas.
- [ ] Utility budgeting logic dipisahkan dari UI.
- [ ] Fungsi format Rupiah reusable.
- [ ] State management tidak terlalu kompleks.
- [ ] Error handling tersedia.
- [ ] Semua hardcoded text penting mudah dicari.

### 8.3 Recommended Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Optional:

```bash
npm run lint
npm run test
```

---

## 9. PWA Checklist

### 9.1 Manifest

- [ ] `manifest.webmanifest` tersedia.
- [ ] `name` diisi: SisaKu.
- [ ] `short_name` diisi: SisaKu.
- [ ] `description` tersedia.
- [ ] `start_url` benar.
- [ ] `display` menggunakan `standalone`.
- [ ] `theme_color` sesuai design system.
- [ ] `background_color` sesuai design system.
- [ ] Icon 192x192 tersedia.
- [ ] Icon 512x512 tersedia.
- [ ] Maskable icon tersedia jika memungkinkan.

### 9.2 Service Worker

- [ ] Service worker terdaftar di production.
- [ ] App shell dapat dicache.
- [ ] Offline fallback tersedia.
- [ ] Cache update strategy aman.
- [ ] Tidak menyimpan data sensitif di cache publik.

### 9.3 Installability

- [ ] App bisa diinstall di Chrome Android.
- [ ] App bisa dibuka dari home screen.
- [ ] Mode standalone berjalan.
- [ ] Icon tampil benar di home screen.
- [ ] Splash screen tidak rusak.

---

## 10. Offline Checklist

- [ ] App dapat dibuka setelah pernah dimuat online.
- [ ] Home tetap muncul saat offline.
- [ ] Data lokal tetap terbaca saat offline.
- [ ] User bisa menambah expense saat offline.
- [ ] Expense offline tetap tersimpan.
- [ ] Tidak ada infinite loading saat offline.
- [ ] Pesan offline ramah tersedia jika ada fitur yang butuh internet.

---

## 11. Accessibility Checklist

- [ ] Semua input punya label.
- [ ] Semua tombol punya teks atau aria-label.
- [ ] Status tidak hanya menggunakan warna.
- [ ] Kontras teks cukup nyaman dibaca.
- [ ] Tap target cukup besar.
- [ ] Fokus keyboard terlihat.
- [ ] Modal/bottom sheet bisa ditutup dengan jelas.
- [ ] Error message terhubung ke input yang salah.

---

## 12. Performance Checklist

- [ ] Halaman Home muncul cepat.
- [ ] App shell ringan.
- [ ] Tidak ada gambar besar yang tidak dikompresi.
- [ ] Icon PWA sudah dioptimalkan.
- [ ] Tidak memakai library berat untuk fitur sederhana.
- [ ] History tetap lancar dengan ratusan transaksi.
- [ ] Lighthouse performance diperiksa.

---

## 13. Security & Privacy Checklist

- [ ] Tidak meminta login untuk MVP.
- [ ] Tidak meminta koneksi bank/e-wallet.
- [ ] Tidak mengirim data expense ke server.
- [ ] Privacy note ditampilkan.
- [ ] Export CSV tersedia.
- [ ] Reset data tersedia.
- [ ] Tidak menyimpan data rahasia di source code.
- [ ] Tidak ada API key production di repository publik.

Privacy copy recommended:

```text
Data kamu tersimpan di perangkat ini. SisaKu tidak mengirim data pengeluaran ke server untuk MVP.
```

---

## 14. QA Release Gate

Release hanya boleh dilakukan jika:

- [ ] Semua P0 test case lulus.
- [ ] Tidak ada bug Critical.
- [ ] Tidak ada bug High pada budgeting logic.
- [ ] PWA bisa diinstall.
- [ ] App bisa dibuka offline setelah first load.
- [ ] Data tersimpan setelah refresh.
- [ ] User bisa export CSV.
- [ ] User bisa reset data dengan konfirmasi.

---

## 15. Deployment Checklist

### 15.1 Before Deploy

- [ ] Environment production siap.
- [ ] Build production berhasil.
- [ ] Manifest path benar.
- [ ] Service worker hanya aktif di production.
- [ ] Base URL benar.
- [ ] Favicon dan app icon benar.
- [ ] Metadata HTML benar.

### 15.2 Deployment Platform

Recommended:

```text
Vercel
Netlify
Cloudflare Pages
```

### 15.3 After Deploy

- [ ] Buka production URL.
- [ ] Cek console error.
- [ ] Cek PWA installability.
- [ ] Cek mobile responsive.
- [ ] Cek offline mode.
- [ ] Cek data persistence.
- [ ] Cek export CSV.

---

## 16. Release Notes Template

```text
# SisaKu v1.0.0 — MVP Release

Tanggal rilis: YYYY-MM-DD

## Fitur Utama
- Buat pocket budget berdasarkan jumlah hari
- Hitung aman per hari
- Catat pengeluaran cepat
- Riwayat transaksi
- Status Aman/Waspada/Bahaya
- Export CSV
- Installable sebagai PWA
- Offline-first basic

## Catatan
Data tersimpan di perangkat pengguna. Belum ada login dan cloud sync.

## Known Limitations
- Data bisa hilang jika browser storage dihapus
- Belum ada backup otomatis
- Belum ada sync antar device
```

---

## 17. Rollback Plan

Jika release bermasalah:

1. Identifikasi bug Critical/High.
2. Jika app tidak bisa dibuka, rollback deployment ke versi sebelumnya.
3. Jika hanya fitur tertentu bermasalah, disable fitur melalui patch.
4. Jangan mengubah struktur data tanpa migration.
5. Komunikasikan ke user jika ada risiko data lokal.

Rollback checklist:

- [ ] Versi sebelumnya masih tersedia.
- [ ] Changelog tersimpan.
- [ ] Data migration tidak merusak data lama.
- [ ] Patch tested di staging/local.

---

## 18. Post-Release Monitoring

Karena MVP tidak memakai backend analytics, monitoring awal bisa dilakukan manual:

```text
Feedback user
Screen recording usability test
Bug report form
Manual interview 3 hari pemakaian
```

Pertanyaan feedback:

```text
1. Kamu paham hari ini aman pakai berapa?
2. Catat pengeluaran terasa cepat atau ribet?
3. App terasa membantu atau menghakimi?
4. Apa fitur yang paling berguna?
5. Apa yang bikin kamu malas pakai app ini?
```

---

## 19. Versioning

Gunakan semantic versioning sederhana:

```text
v1.0.0 = MVP release
v1.1.0 = fitur baru kecil
v1.1.1 = bug fix
v2.0.0 = perubahan besar/data model besar
```

Contoh roadmap:

```text
v1.0.0 — Core PWA budgeting
v1.1.0 — Quick Add templates
v1.2.0 — Weekly reflection
v1.3.0 — Import/export backup
v2.0.0 — Optional account/cloud sync
```

---

## 20. Final Go/No-Go

### Go jika:

- [ ] Produk menjawab “hari ini aman pakai berapa?”
- [ ] Input pengeluaran cepat.
- [ ] Data tidak hilang setelah refresh.
- [ ] PWA bisa diinstall.
- [ ] Offline basic berjalan.
- [ ] Tidak ada bug critical.

### No-Go jika:

- [ ] Safe per day salah.
- [ ] Data expense hilang.
- [ ] App tidak bisa dibuka di mobile.
- [ ] PWA tidak bisa diinstall sama sekali.
- [ ] Ada error yang membuat user tidak bisa mencatat.

---

## 21. Sumber Rujukan

- MDN — Making PWAs installable: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- MDN — Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- web.dev — Service workers: https://web.dev/learn/pwa/service-workers
- web.dev — Caching: https://web.dev/learn/pwa/caching
- web.dev — Web app manifest: https://web.dev/learn/pwa/web-app-manifest

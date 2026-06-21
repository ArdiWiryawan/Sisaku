# Product Requirements Document (PRD) — SisaKu MVP

**Versi:** 1.0  
**Tanggal:** 2026-06-21  
**Produk:** SisaKu  
**Platform:** PWA, mobile-first  
**Status:** Draft MVP

---

## 1. Overview

SisaKu adalah PWA budgeting harian yang membantu pengguna mengetahui batas aman pengeluaran per hari berdasarkan uang yang tersedia dan jumlah hari yang harus dilalui. Produk ini berfokus pada mahasiswa dan anak muda yang ingin mengatur uang saku tanpa aplikasi finance yang kompleks.

---

## 2. Background

Expense tracker biasa menjawab:

> “Uangku habis ke mana?”

SisaKu menjawab:

> “Hari ini aman pakai berapa supaya uangku cukup sampai hari terakhir?”

Masalah utama pengguna bukan hanya kurangnya pencatatan, tetapi tidak adanya feedback sederhana yang menghubungkan **sisa uang** dengan **sisa waktu**.

---

## 3. Goals

### Product goals

1. Membantu pengguna membuat budget berdasarkan jumlah hari.
2. Menghitung safe-to-spend harian secara otomatis.
3. Membantu pengguna mencatat pengeluaran dalam waktu kurang dari 10 detik.
4. Memberi status budget yang mudah dipahami.
5. Memberi recovery plan saat pengguna melewati batas aman.
6. Membuat PWA yang bisa dipasang di HP dan digunakan offline untuk fitur inti.

### User goals

1. Tahu uang cukup sampai kapan.
2. Tahu batas aman hari ini.
3. Catat pengeluaran tanpa ribet.
4. Tidak merasa dihakimi saat boros.
5. Bisa memperbaiki budget jika melewati batas.

---

## 4. Non-Goals

Untuk MVP, produk tidak akan membuat:

- Login/register.
- Cloud sync.
- Bank/e-wallet synchronization.
- AI financial advisor.
- Multi-currency.
- Investasi.
- Debt management kompleks.
- Subscription.
- Admin dashboard.

---

## 5. Target User

### Persona utama

**Nama:** Raka / Rani  
**Usia:** 18–24 tahun  
**Status:** Mahasiswa / anak kos  
**Kebutuhan:** Mengatur uang saku mingguan/bulanan  
**Pain point:** Sering merasa uang masih aman, tetapi tiba-tiba menipis sebelum periode selesai.

### Jobs to Be Done

> Ketika aku punya uang terbatas untuk beberapa hari, bantu aku tahu berapa yang aman kupakai hari ini agar uangku cukup sampai akhir periode.

---

## 6. User Stories

### Budget pocket

- Sebagai pengguna, saya ingin membuat budget berdasarkan jumlah uang dan jumlah hari, supaya saya tahu batas aman harian.
- Sebagai pengguna, saya ingin memberi nama pocket seperti “Uang Minggu Ini”, supaya budget terasa personal dan mudah dipahami.
- Sebagai pengguna, saya ingin melihat sisa uang dan sisa hari, supaya saya tahu kondisi budget saya.

### Expense tracking

- Sebagai pengguna, saya ingin mencatat pengeluaran dengan cepat, supaya saya tidak malas mencatat.
- Sebagai pengguna, saya ingin memilih kategori pengeluaran, supaya saya tahu uang saya habis untuk apa.
- Sebagai pengguna, saya ingin mengedit atau menghapus transaksi, supaya data bisa dikoreksi.

### Safe-to-spend

- Sebagai pengguna, saya ingin melihat “hari ini aman pakai berapa”, supaya saya bisa mengambil keputusan harian.
- Sebagai pengguna, saya ingin aplikasi memperbarui batas aman setelah saya mencatat pengeluaran, supaya saya tahu dampaknya.

### Recovery

- Sebagai pengguna, saya ingin tahu apa yang harus dilakukan ketika melewati batas, supaya saya tidak merasa gagal dan tetap bisa memperbaiki budget.

---

## 7. Functional Requirements

### FR-01 — Onboarding Budget

User dapat membuat pocket budget pertama dengan input:
- nama pocket;
- jumlah uang;
- jumlah hari atau tanggal akhir;
- tanggal mulai;
- kategori/purpose opsional.

**Acceptance criteria:**
- Jika user memasukkan Rp300.000 untuk 7 hari, sistem menghitung batas awal Rp42.857/hari.
- User tidak dapat menyimpan budget dengan nominal ≤ 0.
- User tidak dapat menyimpan budget dengan durasi ≤ 0 hari.

---

### FR-02 — Dashboard Safe-to-Spend

Dashboard menampilkan:
- pocket aktif;
- hari ini aman pakai berapa;
- sisa uang;
- sisa hari;
- status budget;
- tombol catat pengeluaran;
- transaksi terbaru.

**Acceptance criteria:**
- Angka safe-to-spend harus terlihat tanpa scroll pada layar mobile.
- Status budget tampil sebagai Aman, Waspada, atau Bahaya.
- Jika tidak ada pocket, dashboard menampilkan CTA “Buat Pocket Pertama”.

---

### FR-03 — Catat Pengeluaran Cepat

User dapat mencatat pengeluaran dengan input minimum:
- nominal;
- kategori;
- pocket.

Input opsional:
- nama transaksi;
- tanggal;
- catatan.

**Acceptance criteria:**
- User bisa menyimpan transaksi valid dalam <10 detik.
- Setelah transaksi disimpan, sistem memperbarui sisa uang dan safe-to-spend.
- Jika nominal ≤ 0, sistem menampilkan validasi.
- Tanggal default adalah hari ini.

---

### FR-04 — Riwayat Transaksi

User dapat melihat daftar transaksi berdasarkan:
- hari ini;
- kemarin;
- minggu ini;
- semua;
- filter pocket;
- filter kategori.

**Acceptance criteria:**
- Transaksi terbaru muncul paling atas.
- User dapat mengedit transaksi.
- User dapat menghapus transaksi dengan konfirmasi.

---

### FR-05 — Budget Pocket

User dapat melihat daftar pocket:
- nama pocket;
- total budget;
- sisa budget;
- sisa hari;
- safe-to-spend;
- status.

**Acceptance criteria:**
- User dapat membuat lebih dari satu pocket.
- User dapat memilih pocket aktif.
- User dapat melihat detail pocket.

---

### FR-06 — Recovery Plan

Jika user melewati batas aman, sistem memberikan pesan recovery.

Contoh:
> Hari ini lewat Rp12.000. Masih bisa aman kalau 3 hari ke depan jaga di bawah Rp35.000/hari.

**Acceptance criteria:**
- Pesan tidak menggunakan tone menyalahkan.
- Pesan memberi angka tindakan yang jelas.
- Recovery plan muncul di dashboard dan detail pocket.

---

### FR-07 — Export CSV

User dapat mengekspor transaksi ke CSV.

**Acceptance criteria:**
- CSV berisi tanggal, nama transaksi, kategori, pocket, nominal, catatan.
- File dapat diunduh dari browser.
- Jika tidak ada transaksi, tampilkan empty state.

---

### FR-08 — Reset Data

User dapat menghapus semua data lokal.

**Acceptance criteria:**
- Reset memerlukan konfirmasi.
- Setelah reset, semua pocket, transaksi, dan pengaturan lokal hilang.
- App kembali ke state onboarding.

---

### FR-09 — PWA Installability

Aplikasi dapat dipasang ke Home Screen.

**Acceptance criteria:**
- Memiliki manifest.
- Memiliki icon minimal 192x192 dan 512x512.
- Menggunakan display mode standalone.
- Memiliki service worker untuk caching asset inti.
- Dapat dibuka dari home screen tanpa browser chrome jika perangkat mendukung.

---

## 8. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | First load ringan, target <3 detik pada koneksi normal |
| Responsiveness | Mobile-first, tetap nyaman di desktop |
| Offline | Fitur inti tetap dapat dibuka tanpa internet setelah kunjungan pertama |
| Privacy | Data MVP tersimpan di perangkat pengguna |
| Accessibility | Kontras teks cukup, tombol mudah disentuh |
| Reliability | Kalkulasi budget konsisten meski transaksi diedit/hapus |
| Maintainability | Kode modular, fungsi kalkulasi dipisah dari UI |

---

## 9. Key Screens

1. Onboarding Budget.
2. Home Dashboard.
3. Add Expense.
4. Pocket List.
5. Pocket Detail.
6. History.
7. Settings/Profile.
8. Empty State.
9. Recovery State.

---

## 10. Success Metrics

| Metric | Target |
|---|---|
| Time to first budget | < 1 menit |
| Add expense time | < 10 detik |
| User paham safe-to-spend | ≥ 80% pada usability test |
| User menyelesaikan pocket | ≥ 40% pada pilot |
| PWA install rate | ≥ 30% dari pengguna pilot |
| 7-day retention | ≥ 25% pada pilot awal |

---

## 11. MVP Release Criteria

MVP dapat dirilis jika:

- User bisa membuat pocket budget X hari.
- Dashboard menghitung safe-to-spend dengan benar.
- User bisa tambah/edit/hapus transaksi.
- Status budget berjalan sesuai formula.
- PWA dapat di-install.
- Data tersimpan lokal.
- UI mobile-first sudah nyaman.
- QA edge case utama lolos.

---

## 12. Risks

| Risiko | Mitigasi |
|---|---|
| User malas mencatat | Quick add dan input minimal |
| User bingung konsep pocket | Onboarding dengan contoh “Rp300.000 untuk 7 hari” |
| Data hilang karena local storage | Export CSV dan backup manual |
| App terasa menghakimi | UX writing suportif |
| PWA install tidak konsisten di semua device | Beri instruksi install di halaman Saya |

---

## 13. Future Scope

- Quick Add template custom.
- Reminder malam.
- Weekly reflection.
- PIN lock.
- Dark mode.
- Import/export backup JSON.
- Cloud sync opsional.
- Login opsional.
- APK Android via Capacitor.
- AI insight ringan.

---

## 14. Referensi

- Atlassian — Product Requirements Document: https://www.atlassian.com/agile/product-management/requirements
- web.dev — Progressive Web Apps: https://web.dev/learn/pwa/progressive-web-apps

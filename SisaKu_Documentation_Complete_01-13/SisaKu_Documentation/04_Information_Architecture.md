# Information Architecture — SisaKu PWA

**Versi:** 1.0  
**Tanggal:** 2026-06-21  
**Produk:** SisaKu

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan struktur informasi, navigasi, dan hubungan antar halaman dalam SisaKu. Karena SisaKu adalah PWA mobile-first, struktur harus sederhana, cepat dipahami, dan tidak terasa seperti dashboard finance yang berat.

---

## 2. Prinsip Information Architecture

1. **Empat tab utama cukup.**  
   Home, Pocket, Riwayat, Saya.

2. **Safe-to-spend menjadi informasi utama.**  
   User membuka aplikasi untuk tahu “hari ini aman pakai berapa”.

3. **Budget dipahami sebagai Pocket.**  
   Bukan hanya kategori, tetapi kantong uang berdasarkan tujuan dan durasi.

4. **Transaksi hanya mendukung keputusan budget.**  
   Riwayat penting, tetapi bukan pusat utama aplikasi.

5. **Settings tidak boleh mengganggu flow utama.**  
   Pengaturan diletakkan di tab Saya.

---

## 3. Top-Level Navigation

```text
Home | Pocket | Riwayat | Saya
```

### Rekomendasi UI

Gunakan bottom navigation pada mobile PWA.

| Tab | Tujuan |
|---|---|
| Home | Menjawab kondisi budget hari ini |
| Pocket | Mengelola budget X hari |
| Riwayat | Melihat dan mengoreksi transaksi |
| Saya | Pengaturan, export, privacy, install app |

---

## 4. Site Map

```text
SisaKu
├── Home
│   ├── Active Pocket Summary
│   ├── Safe-to-Spend Today
│   ├── Remaining Money
│   ├── Remaining Days
│   ├── Budget Status
│   ├── Recovery Banner
│   ├── Quick Add
│   └── Recent Expenses
│
├── Pocket
│   ├── Pocket List
│   ├── Create Pocket
│   ├── Pocket Detail
│   │   ├── Budget Overview
│   │   ├── Money vs Time Progress
│   │   ├── Safe-to-Spend
│   │   ├── Recovery Plan
│   │   └── Pocket Transactions
│   └── Edit Pocket
│
├── Riwayat
│   ├── Transaction List
│   ├── Filter by Date
│   ├── Filter by Pocket
│   ├── Filter by Category
│   ├── Edit Transaction
│   └── Delete Transaction
│
└── Saya
    ├── Reminder Settings
    ├── Quick Add Settings
    ├── Export CSV
    ├── Backup/Import Future
    ├── Reset Data
    ├── Install App Guide
    ├── Privacy Note
    └── About SisaKu
```

---

## 5. Home IA

### Tujuan

Menjawab pertanyaan:

> “Hari ini aman pakai berapa?”

### Hierarki konten

1. Pocket aktif.
2. Safe-to-spend today.
3. Sisa uang.
4. Sisa hari.
5. Status budget.
6. CTA catat pengeluaran.
7. Recovery banner jika ada.
8. Quick Add.
9. Transaksi terbaru.

### Struktur layar

```text
Header
- Greeting / nama app
- Pocket aktif

Hero Card
- Hari ini aman pakai
- Angka besar safe-to-spend

Budget Summary
- Sisa uang
- Sisa hari
- Status

Primary CTA
- + Catat Pengeluaran

Conditional Banner
- Recovery plan / warning

Quick Add
- Makan 15K
- Kopi 12K
- Transport 20K

Recent Transactions
- 3–5 transaksi terbaru
```

---

## 6. Pocket IA

### Tujuan

Mengelola budget berdasarkan jumlah uang dan durasi.

### Daftar pocket

Setiap pocket card berisi:

- Nama pocket.
- Sisa uang.
- Sisa hari.
- Safe-to-spend.
- Status.
- Progress ringkas.

### Create Pocket

Field:

1. Nama pocket.
2. Jumlah uang.
3. Durasi atau tanggal akhir.
4. Tanggal mulai.
5. Deskripsi opsional.

### Pocket Detail

Konten:

```text
Pocket name
Budget awal
Total terpakai
Sisa uang
Sisa hari
Aman per hari
Status
Progress uang vs waktu
Recovery plan
Transaksi pocket
```

---

## 7. Riwayat IA

### Tujuan

Membantu user melihat, mengedit, dan menghapus transaksi.

### Struktur

```text
Header
Filter row
Transaction groups
Action menu
```

### Grouping transaksi

Urutan:

1. Hari ini.
2. Kemarin.
3. Minggu ini.
4. Lebih lama.

### Transaction item

Berisi:

- Nama/kategori.
- Nominal.
- Pocket.
- Tanggal.
- Catatan opsional.
- Edit/hapus.

---

## 8. Saya IA

### Tujuan

Mengatur preferensi dan data.

### Konten

1. Reminder.
2. Quick Add template.
3. Export CSV.
4. Reset data.
5. Install app guide.
6. Privacy note.
7. About.

### Privacy note MVP

> Data SisaKu tersimpan di perangkat kamu. Tidak perlu login dan tidak ada koneksi bank/e-wallet.

---

## 9. Navigation Behavior

| Aksi | Tujuan |
|---|---|
| Tap Home | Kembali ke dashboard |
| Tap Pocket | Lihat semua pocket |
| Tap Riwayat | Lihat transaksi |
| Tap Saya | Pengaturan |
| Floating/primary CTA + Catat | Buka add expense |
| Tap pocket card | Buka detail pocket |
| Tap transaction | Buka detail/edit transaction |

---

## 10. Screen Priority

### P0 Screens

- Onboarding.
- Home.
- Add Expense.
- Pocket List.
- Pocket Detail.
- History.
- Settings/Saya.

### P1 Screens

- Quick Add Settings.
- Weekly Reflection.
- Export CSV.
- Install App Guide.

### P2 Screens

- Backup/Import.
- PIN Lock.
- Dark Mode.
- AI Insight.

---

## 11. Content Grouping Rationale

### Kenapa Home bukan grafik?

Karena user membuka aplikasi untuk membuat keputusan cepat. Grafik berguna untuk refleksi, tetapi bukan informasi pertama.

### Kenapa Pocket terpisah dari Riwayat?

Pocket adalah rencana. Riwayat adalah catatan. Jika dicampur, user sulit membedakan antara “uang untuk masa depan” dan “transaksi masa lalu”.

### Kenapa Saya berisi install guide?

Karena PWA install behavior bisa berbeda per browser. User perlu panduan sederhana untuk menambahkan app ke Home Screen.

---

## 12. IA Anti-Patterns yang Harus Dihindari

- Terlalu banyak tab.
- Menaruh grafik sebagai hero.
- Menjadikan riwayat sebagai halaman utama.
- Memaksa user membuat akun.
- Memunculkan banyak angka tanpa konteks.
- Menaruh fitur advanced di onboarding.
- Menggunakan istilah finance formal seperti rasio, proyeksi likuiditas, atau saldo berjalan.

---

## 13. Empty State Architecture

| Area | Empty state | CTA |
|---|---|---|
| Home tanpa pocket | “Buat pocket pertama untuk tahu batas aman harianmu.” | Buat Pocket |
| Pocket kosong | “Mulai dari budget sederhana seperti Uang Minggu Ini.” | Buat Pocket |
| Riwayat kosong | “Belum ada pengeluaran. Catat transaksi kecil pertamamu.” | Catat Pengeluaran |
| Quick Add kosong | “Belum ada template cepat.” | Tambah Template |

# SisaKu — UX Writing Guide

**Versi:** 1.0  
**Produk:** SisaKu — PWA Budgeting Harian untuk Mahasiswa  
**Tagline:** Tahu batas aman uangmu setiap hari.  
**Status:** MVP Documentation

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan standar bahasa, tone, istilah, microcopy, error message, onboarding copy, notification copy, dan feedback message untuk SisaKu.

UX writing SisaKu harus membantu user merasa:

- tenang,
- punya kontrol,
- tidak dihakimi,
- tahu langkah berikutnya,
- mampu memperbaiki kondisi budget.

Aplikasi ini menang bukan hanya karena fitur, tetapi karena cara aplikasinya berbicara dengan user.

---

## 2. Prinsip Suara Produk

### 2.1 Tenang

Uang adalah topik sensitif. Hindari bahasa yang membuat user panik.

Buruk:

```text
Budget kamu gagal total.
```

Baik:

```text
Uang mulai tipis. Prioritaskan kebutuhan utama dulu.
```

### 2.2 Suportif

App harus terasa seperti teman yang membantu, bukan guru yang menghukum.

Buruk:

```text
Kamu boros hari ini.
```

Baik:

```text
Hari ini lewat Rp12.000, tapi masih bisa diperbaiki.
```

### 2.3 Langsung ke Tindakan

User tidak butuh penjelasan panjang. User butuh tahu apa yang harus dilakukan.

Buruk:

```text
Rasio pengeluaran Anda terhadap alokasi budget telah menunjukkan deviasi dari standar pengeluaran ideal.
```

Baik:

```text
Mulai mepet. Hari ini coba jaga di bawah Rp35.000.
```

### 2.4 Bahasa Mahasiswa Indonesia

Gunakan bahasa yang dekat dengan target user.

Gunakan:

```text
uang mingguan
uang makan
jajan
kos
print
laundry
aman sampai Minggu
```

Hindari:

```text
alokasi kas personal
rasio pengeluaran ideal
proyeksi likuiditas pribadi
```

---

## 3. Tone Matrix

| Situasi | Tone | Contoh |
|---|---|---|
| User baru | Ramah dan ringan | “Yuk atur uangmu biar cukup sampai hari terakhir.” |
| Budget aman | Positif dan tenang | “Masih aman. Lanjutkan ritme ini.” |
| Budget waspada | Membantu dan jelas | “Mulai mepet. Jaga pengeluaran hari ini.” |
| Budget bahaya | Tenang dan prioritas | “Uang mulai tipis. Prioritaskan makan dan transport dulu.” |
| User lupa catat | Tidak menyalahkan | “Tidak apa-apa. Lanjut dari hari ini.” |
| User selesai budget | Apresiatif | “Nice, uangmu cukup sampai hari terakhir.” |

---

## 4. Glossary Produk

| Istilah | Definisi | Catatan Penggunaan |
|---|---|---|
| Pocket | Budget untuk uang tertentu dalam periode tertentu | Gunakan untuk mengganti istilah “amplop” atau “wallet” |
| Aman per hari | Jumlah uang yang aman dipakai hari ini | Hero metric aplikasi |
| Sisa uang | Uang yang belum terpakai dalam pocket | Jangan sebut “saldo” jika bukan akun bank |
| Sisa hari | Jumlah hari budget yang masih harus dilalui | Gunakan untuk menghitung batas harian |
| Status | Kondisi budget: Aman/Waspada/Bahaya | Hindari istilah “gagal” |
| Recovery plan | Rekomendasi sederhana saat user lewat batas | Gunakan bahasa suportif |
| Catat cepat | Input pengeluaran sederhana | Cocok untuk CTA |

---

## 5. Product One-Liner

Versi pendek:

```text
SisaKu bantu kamu tahu batas aman uang harian.
```

Versi onboarding:

```text
Masukkan uang yang kamu punya, tentukan harus cukup sampai kapan, lalu SisaKu hitungkan batas aman per hari.
```

Versi app store / landing page:

```text
SisaKu adalah PWA budgeting harian untuk mahasiswa yang membantu menghitung berapa uang yang aman dipakai per hari agar uang cukup sampai hari terakhir.
```

---

## 6. Onboarding Copy

### Screen 1 — Value Proposition

Title:

```text
Tahu batas aman uangmu setiap hari.
```

Body:

```text
Masukkan uang yang kamu punya dan tentukan harus cukup sampai kapan. SisaKu akan bantu hitung batas aman harianmu.
```

CTA:

```text
Mulai atur uang
```

---

### Screen 2 — Input Budget

Title:

```text
Kamu punya uang berapa?
```

Helper:

```text
Masukkan uang yang ingin kamu atur. Contoh: uang mingguan, uang makan, atau uang sampai kiriman berikutnya.
```

Placeholder:

```text
Contoh: 300000
```

CTA:

```text
Lanjut
```

---

### Screen 3 — Budget Period

Title:

```text
Uang ini harus cukup sampai kapan?
```

Options:

```text
Untuk beberapa hari
Sampai tanggal tertentu
Sampai akhir minggu
Sampai akhir bulan
```

Helper:

```text
SisaKu akan menghitung batas aman per hari dari jumlah uang dan sisa hari.
```

---

### Screen 4 — Aha Moment

Title:

```text
Hari ini aman pakai
```

Example:

```text
Rp42.857
```

Body:

```text
Kalau kamu menjaga pengeluaran di sekitar angka ini, uangmu lebih aman sampai akhir periode.
```

CTA:

```text
Masuk ke Home
```

---

## 7. Home Screen Copy

### Safe Number Card

Label:

```text
Hari ini aman pakai
```

Subtext Aman:

```text
Masih aman. Lanjutkan ritme ini.
```

Subtext Waspada:

```text
Mulai mepet. Hari ini coba lebih selektif.
```

Subtext Bahaya:

```text
Uang mulai tipis. Prioritaskan kebutuhan utama dulu.
```

CTA:

```text
+ Catat Pengeluaran
```

---

## 8. Add Expense Copy

Title:

```text
Catat pengeluaran
```

Nominal Label:

```text
Keluar berapa?
```

Nominal Placeholder:

```text
Contoh: 15000
```

Category Label:

```text
Untuk apa?
```

Pocket Label:

```text
Masuk ke pocket mana?
```

Optional Note Label:

```text
Catatan opsional
```

Save CTA:

```text
Simpan
```

Success Message:

```text
Tercatat. Batas aman harianmu sudah diperbarui.
```

Success Message with Result:

```text
Tercatat. Sisa uang Rp240.000, aman per hari Rp40.000.
```

---

## 9. Status Copy

### Aman

```text
Masih aman. Lanjutkan ritme ini.
```

```text
Pengeluaranmu masih sesuai pace.
```

```text
Uangmu masih on track sampai akhir periode.
```

### Waspada

```text
Mulai mepet. Coba jaga pengeluaran hari ini.
```

```text
Pengeluaranmu sedikit lebih cepat dari rencana.
```

```text
Masih bisa aman kalau hari ini lebih selektif.
```

### Bahaya

```text
Uang mulai tipis. Prioritaskan kebutuhan utama dulu.
```

```text
Budget berisiko habis sebelum waktunya.
```

```text
Coba tahan pengeluaran non-wajib dulu.
```

### Selesai

```text
Nice, uangmu cukup sampai hari terakhir.
```

```text
Budget selesai. Kamu berhasil menjaga ritme pengeluaran.
```

---

## 10. Recovery Plan Copy

### Saat Lewat Batas Harian

```text
Hari ini lewat Rp12.000.
Masih bisa aman kalau 3 hari ke depan jaga di bawah Rp35.000/hari.
```

### Saat Budget Hampir Habis

```text
Sisa uang mulai tipis.
Untuk tetap aman, prioritaskan makan, transport, dan kebutuhan kuliah dulu.
```

### Saat Budget Habis

```text
Budget ini sudah habis.
Kamu bisa tutup pocket ini atau buat pocket baru untuk periode berikutnya.
```

### Saat User Ingin Reset

```text
Reset akan menghapus semua transaksi di pocket ini. Pastikan kamu sudah export data jika masih diperlukan.
```

---

## 11. Empty State Copy

### Belum Ada Pocket

Title:

```text
Belum ada pocket
```

Body:

```text
Buat budget pertamamu agar tahu batas aman harian.
```

CTA:

```text
+ Buat Pocket
```

### Belum Ada Transaksi

Title:

```text
Belum ada pengeluaran
```

Body:

```text
Catat pengeluaran pertamamu supaya batas aman harian lebih akurat.
```

CTA:

```text
Catat Pengeluaran
```

### Tidak Ada Hasil Filter

Title:

```text
Tidak ada transaksi yang cocok
```

Body:

```text
Coba ubah filter tanggal atau kategori.
```

CTA:

```text
Reset Filter
```

---

## 12. Error Message Guidelines

Error harus:

- jelas,
- spesifik,
- membantu memperbaiki input,
- tidak menyalahkan user.

| Kondisi | Copy |
|---|---|
| Nominal kosong | “Masukkan nominal pengeluaran dulu.” |
| Nominal 0 | “Nominal harus lebih dari Rp0.” |
| Budget kosong | “Masukkan jumlah uang yang ingin kamu atur.” |
| Tanggal akhir sebelum hari ini | “Tanggal akhir tidak boleh sebelum hari ini.” |
| Pocket belum dipilih | “Pilih pocket untuk pengeluaran ini.” |
| Export gagal | “Export belum berhasil. Coba lagi beberapa saat.” |
| Storage penuh | “Penyimpanan browser hampir penuh. Coba export data lalu hapus data lama.” |

---

## 13. Notification Copy

### Reminder Malam

```text
Cek sebentar: hari ini keluar berapa?
```

```text
Sebelum tidur, catat pengeluaran hari ini biar budget tetap akurat.
```

```text
Review 1 menit: uangmu masih aman sampai akhir periode?
```

### Reminder Setelah Jam Makan

```text
Habis makan? Catat cepat biar batas harian tetap akurat.
```

### Jangan Terlalu Sering

Rules:

- Maksimal 1 reminder aktif per hari untuk MVP.
- Reminder harus bisa dimatikan.
- Jangan gunakan rasa takut sebagai pemicu.

---

## 14. Privacy Copy

Privacy note di halaman Saya:

```text
Data kamu tersimpan di perangkat ini.
SisaKu tidak mengirim data pengeluaran ke server dan tidak membutuhkan koneksi bank/e-wallet untuk MVP.
```

Export copy:

```text
Export data ke CSV agar kamu punya cadangan di luar aplikasi.
```

Reset copy:

```text
Reset akan menghapus data dari perangkat ini. Tindakan ini tidak bisa dibatalkan.
```

---

## 15. Do and Don’t

| Do | Don’t |
|---|---|
| “Masih bisa diperbaiki.” | “Kamu gagal.” |
| “Mulai mepet.” | “Kamu boros.” |
| “Prioritaskan kebutuhan utama.” | “Jangan beli apa-apa.” |
| “Hari ini aman pakai Rp40.000.” | “Rasio ideal harian Rp40.000.” |
| “Tidak apa-apa, lanjut dari hari ini.” | “Streak hilang.” |

---

## 16. Sumber Rujukan

- Nielsen Norman Group — Content Standards in Design Systems: https://www.nngroup.com/articles/content-design-systems/
- Nielsen Norman Group — Design Systems 101: https://www.nngroup.com/articles/design-systems-101/

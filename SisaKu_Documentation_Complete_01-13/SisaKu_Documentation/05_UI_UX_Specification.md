# UI/UX Specification — SisaKu PWA

**Versi:** 1.0  
**Tanggal:** 2026-06-21  
**Produk:** SisaKu

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan spesifikasi UI/UX untuk SisaKu PWA. Fokus desain adalah membuat aplikasi terasa cepat, tenang, mudah dipahami, dan bermanfaat untuk pengambilan keputusan harian.

---

## 2. Product Experience Goal

Pengguna harus bisa membuka aplikasi dan memahami kondisi uangnya dalam 3 detik.

Pertanyaan utama yang dijawab UI:

> “Hari ini aman pakai berapa?”

---

## 3. UX Principles

1. **Safe number first**  
   Angka batas aman harian adalah pusat UI.

2. **Fast input**  
   Tambah pengeluaran harus bisa dilakukan dalam <10 detik.

3. **Low cognitive load**  
   Jangan tampilkan terlalu banyak pilihan dalam satu layar.

4. **Supportive tone**  
   Gunakan bahasa yang membantu, bukan menghakimi.

5. **Mobile-first**  
   Seluruh desain harus nyaman untuk layar HP.

6. **Visible feedback**  
   Setelah user mencatat pengeluaran, app harus langsung menunjukkan dampaknya.

---

## 4. Visual Direction

### Karakter visual

- Clean.
- Soft.
- Tenang.
- Mahasiswa-friendly.
- Tidak seperti aplikasi bank.
- Tidak terlalu childish.

### Warna rekomendasi

| Role | Warna | Hex |
|---|---|---|
| Primary | Blue | #2563EB |
| Primary dark | Indigo | #1E40AF |
| Success | Green | #16A34A |
| Warning | Amber | #F59E0B |
| Danger | Red soft | #DC2626 |
| Background | Soft gray | #F8FAFC |
| Card | White | #FFFFFF |
| Text main | Charcoal | #111827 |
| Text muted | Gray | #6B7280 |
| Border | Light gray | #E5E7EB |

### Typography

Gunakan system font atau Inter.

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Spacing

Gunakan skala 4px:

```text
4, 8, 12, 16, 20, 24, 32, 40
```

### Border radius

- Button: 14–16px.
- Card: 20–24px.
- Chip: 999px.
- Bottom sheet: 24px top radius.

---

## 5. Main Components

### 5.1 Safe Number Card

**Tujuan:** Menampilkan angka utama: “hari ini aman pakai berapa”.

**Konten:**
- Label: “Hari ini aman pakai”
- Angka besar: Rp42.857
- Subtext: “Agar uang cukup sampai Minggu”
- Status pill: Aman/Waspada/Bahaya

**Rules:**
- Angka harus paling besar di layar.
- Tidak boleh tertutup grafik.
- Harus muncul di atas fold pada mobile.

---

### 5.2 Pocket Card

**Tujuan:** Menampilkan ringkasan budget pocket.

**Konten:**
- Nama pocket.
- Sisa uang.
- Sisa hari.
- Safe-to-spend.
- Status.
- Progress bar.

**State:**
- Aman.
- Waspada.
- Bahaya.
- Selesai.
- Habis.

---

### 5.3 Quick Add Chip

**Tujuan:** Mengurangi friction pencatatan.

**Contoh chip:**
- Makan 15K.
- Kopi 12K.
- Transport 20K.
- Print 5K.
- Laundry 10K.

**Interaction:**
- Tap chip langsung membuka confirmation mini sheet.
- Jika user punya satu pocket aktif, transaksi langsung masuk ke pocket aktif.
- Jika user punya banyak pocket, pilih pocket dulu.

---

### 5.4 Expense Item

**Konten:**
- Kategori/nama transaksi.
- Nominal.
- Pocket.
- Tanggal.
- Catatan opsional.

**Actions:**
- Edit.
- Hapus.
- Ubah pocket.

---

### 5.5 Recovery Banner

**Tujuan:** Memberi jalan balik saat user melewati batas.

**Contoh copy:**
> Hari ini lewat Rp12.000. Masih bisa aman kalau 3 hari ke depan jaga di bawah Rp35.000/hari.

**Rules:**
- Tidak menggunakan kata “boros”, “gagal”, atau “buruk”.
- Harus memberi angka tindakan yang jelas.

---

### 5.6 Bottom Navigation

Tab:
- Home.
- Pocket.
- Riwayat.
- Saya.

**Rules:**
- Maksimal 4 tab.
- Active tab jelas.
- Label harus singkat.
- Tinggi cukup untuk tap di mobile.

---

## 6. Screen Specification

## 6.1 Onboarding Screen

### Tujuan

Membuat user mendapatkan aha moment secepat mungkin.

### Headline

> Kamu mau uang ini cukup sampai kapan?

### Fields

1. Jumlah uang.
2. Durasi hari atau tanggal akhir.
3. Nama pocket.
4. Pengeluaran wajib opsional.

### Primary CTA

> Hitung Batas Aman

### Success output

> Hari ini aman pakai Rp42.857.

### Empty/error state

| Kondisi | Pesan |
|---|---|
| Nominal kosong | “Masukkan jumlah uang dulu.” |
| Durasi kosong | “Tentukan uang ini harus cukup sampai kapan.” |
| Nominal tidak valid | “Jumlah uang harus lebih dari 0.” |

---

## 6.2 Home Screen

### Tujuan

Menjawab kondisi budget hari ini.

### Layout

```text
Header
Active Pocket
Safe Number Card
Budget Summary
Recovery Banner conditional
+ Catat Pengeluaran
Quick Add
Recent Transactions
```

### Primary CTA

> + Catat Pengeluaran

### Content priority

1. Safe-to-spend.
2. Sisa uang.
3. Sisa hari.
4. Status.
5. CTA.

### Empty state

> Buat pocket pertama untuk tahu batas aman harianmu.

CTA:
> Buat Pocket

---

## 6.3 Add Expense Screen

### Tujuan

Mencatat pengeluaran dengan cepat.

### Form order

1. Nominal.
2. Kategori.
3. Pocket.
4. Nama transaksi opsional.
5. Tanggal opsional.
6. Catatan opsional.

### Default value

- Tanggal: hari ini.
- Pocket: pocket aktif.
- Kategori: kategori terakhir digunakan atau “Makan”.

### Success message

> Tercatat. Sisa uang Rp240.000. Besok aman pakai Rp40.000/hari.

---

## 6.4 Pocket List Screen

### Tujuan

Melihat semua budget pocket.

### Components

- Header: “Pocket”
- CTA: “+ Buat Pocket”
- List pocket card.
- Empty state.

### Empty state

> Buat pocket seperti “Uang Minggu Ini” atau “Uang Makan”.

---

## 6.5 Pocket Detail Screen

### Tujuan

Melihat kondisi satu pocket secara detail.

### Content

- Nama pocket.
- Budget awal.
- Total terpakai.
- Sisa uang.
- Sisa hari.
- Safe-to-spend.
- Status.
- Progress uang vs waktu.
- Recovery plan.
- Transaksi pocket.

### Progress uang vs waktu

Tampilkan dua progress:
- Uang terpakai.
- Waktu berjalan.

Interpretasi:
- Jika uang terpakai lebih cepat daripada waktu berjalan, status bisa Waspada/Bahaya.

---

## 6.6 History Screen

### Tujuan

Melihat dan memperbaiki catatan.

### Components

- Filter row.
- Transaction list.
- Group by date.
- Edit/hapus action.

### Filters

- Semua.
- Hari ini.
- Minggu ini.
- Pocket.
- Kategori.

### Empty state

> Belum ada pengeluaran. Mulai dari transaksi kecil hari ini.

---

## 6.7 Saya Screen

### Tujuan

Pengaturan dan data.

### Items

- Reminder.
- Quick Add template.
- Export CSV.
- Reset data.
- Install app.
- Privacy note.
- About.

### Privacy note

> Data kamu tersimpan di perangkat ini. SisaKu MVP tidak mengirim data ke server dan tidak membutuhkan login.

---

## 7. Status Design

| Status | Warna | Kriteria umum | Copy |
|---|---|---|---|
| Aman | Green | Safe-to-spend masih sehat | “Masih aman. Lanjutkan ritme ini.” |
| Waspada | Amber | Safe-to-spend mulai turun | “Mulai mepet. Coba jaga pengeluaran hari ini.” |
| Bahaya | Red soft | Uang hampir habis/melewati batas | “Uang mulai tipis. Prioritaskan kebutuhan utama dulu.” |

---

## 8. UX Writing Rules

### Gunakan

- “Masih aman.”
- “Mulai mepet.”
- “Masih bisa diperbaiki.”
- “Prioritaskan makan dan transport dulu.”
- “Lanjut dari hari ini.”

### Hindari

- “Kamu boros.”
- “Budget gagal.”
- “Pengeluaran buruk.”
- “Kamu tidak disiplin.”
- “Rasio keuangan tidak optimal.”

---

## 9. Accessibility Notes

- Kontras teks minimal cukup untuk dibaca.
- Tombol minimum 44px tinggi.
- Jangan hanya mengandalkan warna untuk status; gunakan label.
- Semua input punya label.
- Format Rupiah harus jelas.
- Error message harus dekat dengan field.

---

## 10. Responsive Behavior

### Mobile

- Bottom navigation.
- Safe number card di atas.
- Form full-width.
- CTA besar.
- Quick Add chip horizontal scroll.

### Desktop

- Layout boleh dua kolom.
- Navigation bisa sidebar.
- Safe number tetap menjadi pusat.

---

## 11. Microinteractions

| Aksi | Feedback |
|---|---|
| Simpan transaksi | Toast + update angka |
| Hapus transaksi | Konfirmasi |
| Buat pocket | Animasi ringan ke dashboard |
| Status berubah | Banner muncul |
| Export CSV | Download + toast |
| Reset data | Konfirmasi kuat |

---

## 12. Design System Reference

Design system adalah standar untuk menjaga konsistensi desain, komponen, dan bahasa visual dalam produk digital. Rekomendasi ini mengikuti prinsip umum design system: standar, reusable components, dan visual consistency.

Referensi:
- Nielsen Norman Group — Design Systems 101: https://www.nngroup.com/articles/design-systems-101/

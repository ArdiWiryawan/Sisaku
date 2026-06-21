# User Flow — SisaKu PWA

**Versi:** 1.0  
**Tanggal:** 2026-06-21  
**Produk:** SisaKu

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan alur pengguna SisaKu dari pertama kali membuka aplikasi, membuat budget, mencatat pengeluaran, sampai menyelesaikan periode budget. Fokus utama user flow adalah membuat aplikasi terasa cepat, jelas, dan tidak ribet di HP.

---

## 2. Prinsip User Flow

1. **Aha moment harus muncul dalam 1 menit.**  
   User harus langsung tahu: “Hari ini aman pakai berapa?”

2. **Input pengeluaran harus <10 detik.**  
   Form utama tidak boleh terlalu panjang.

3. **Setiap aksi harus memberi feedback.**  
   Setelah mencatat pengeluaran, app langsung memperbarui sisa uang dan safe-to-spend.

4. **Saat user melewati batas, app memberi recovery plan.**  
   Bukan menyalahkan.

5. **Mobile-first.**  
   Alur harus nyaman dengan satu tangan.

---

## 3. First-Time User Flow

```mermaid
flowchart TD
    A[Buka SisaKu] --> B{Sudah punya pocket?}
    B -- Tidak --> C[Onboarding]
    C --> D[Input jumlah uang]
    D --> E[Input jumlah hari / tanggal akhir]
    E --> F[Beri nama pocket]
    F --> G[Opsional: pengeluaran wajib]
    G --> H[Lihat hasil: aman per hari]
    H --> I[Masuk Home Dashboard]
    B -- Ya --> I
```

### Detail langkah

1. User membuka SisaKu.
2. Jika belum ada pocket, aplikasi menampilkan onboarding.
3. User memasukkan jumlah uang.
4. User memilih jumlah hari atau tanggal akhir.
5. User memberi nama pocket.
6. App menghitung safe-to-spend.
7. User masuk dashboard.

### Contoh

Input:
- Uang: Rp300.000
- Durasi: 7 hari
- Pocket: Uang Minggu Ini

Output:
- Aman per hari: Rp42.857
- Status: Aman

---

## 4. Returning User Flow

```mermaid
flowchart TD
    A[Buka app] --> B[Home Dashboard]
    B --> C[Lihat safe-to-spend hari ini]
    B --> D[Tap + Catat]
    B --> E[Lihat riwayat]
    B --> F[Lihat pocket]
```

### Tujuan flow

User yang kembali tidak perlu mengatur ulang. App langsung menampilkan:
- pocket aktif;
- safe-to-spend hari ini;
- sisa uang;
- sisa hari;
- status budget;
- CTA catat pengeluaran.

---

## 5. Create Pocket Flow

```mermaid
flowchart TD
    A[Tab Pocket] --> B[Tap Buat Pocket]
    B --> C[Input nama pocket]
    C --> D[Input total uang]
    D --> E[Pilih durasi / tanggal akhir]
    E --> F[Review hasil aman per hari]
    F --> G[Tap Simpan Pocket]
    G --> H[Pocket Detail]
```

### Field wajib

- Nama pocket.
- Total uang.
- Durasi/tanggal akhir.

### Field opsional

- Deskripsi.
- Pengeluaran wajib.
- Kategori default.

### Validasi

| Kondisi | Respons |
|---|---|
| Total uang kosong | “Masukkan jumlah uang dulu.” |
| Total uang ≤ 0 | “Jumlah uang harus lebih dari 0.” |
| Durasi kosong | “Tentukan uang ini harus cukup sampai kapan.” |
| Durasi 0 hari | “Durasi minimal 1 hari.” |

---

## 6. Add Expense Flow

```mermaid
flowchart TD
    A[Home Dashboard] --> B[Tap + Catat]
    B --> C[Input nominal]
    C --> D[Pilih kategori]
    D --> E[Pilih pocket]
    E --> F[Tap Simpan]
    F --> G[Sistem update budget]
    G --> H[Feedback: sisa uang dan safe-to-spend baru]
    H --> I[Kembali ke Home]
```

### Form utama

1. Nominal.
2. Kategori.
3. Pocket.
4. Simpan.

### Form opsional

- Nama transaksi.
- Tanggal.
- Catatan.

### Feedback setelah simpan

Contoh aman:
> Tercatat. Sisa uang Rp240.000. Hari ini masih aman.

Contoh waspada:
> Tercatat. Mulai mepet. Besok coba jaga di bawah Rp38.000.

Contoh bahaya:
> Tercatat. Uang mulai tipis. Prioritaskan makan dan transport dulu.

---

## 7. Quick Add Flow

```mermaid
flowchart TD
    A[Home Dashboard] --> B[Lihat Quick Add]
    B --> C[Tap Makan 15K]
    C --> D[Pilih pocket default]
    D --> E[Transaksi tersimpan]
    E --> F[Safe-to-spend diperbarui]
```

### Template awal

- Makan 15K.
- Kopi 12K.
- Transport 20K.
- Print 5K.
- Laundry 10K.

### Prinsip

Quick Add dibuat untuk transaksi kecil dan berulang. User tidak perlu mengetik jika pengeluaran mirip dengan template.

---

## 8. Pocket Detail Flow

```mermaid
flowchart TD
    A[Tab Pocket] --> B[Pilih pocket]
    B --> C[Lihat detail]
    C --> D[Lihat budget awal]
    C --> E[Lihat sisa uang]
    C --> F[Lihat sisa hari]
    C --> G[Lihat safe-to-spend]
    C --> H[Lihat transaksi pocket]
```

### Informasi utama

- Nama pocket.
- Budget awal.
- Total terpakai.
- Sisa uang.
- Sisa hari.
- Safe-to-spend.
- Status.
- Progress uang vs waktu.
- Recovery plan jika ada.

---

## 9. Edit Expense Flow

```mermaid
flowchart TD
    A[Riwayat] --> B[Pilih transaksi]
    B --> C[Tap Edit]
    C --> D[Ubah nominal/kategori/pocket/tanggal]
    D --> E[Tap Simpan]
    E --> F[Sistem hitung ulang budget]
    F --> G[Kembali ke Riwayat]
```

### Acceptance behavior

- Setelah transaksi diedit, semua kalkulasi pocket terkait diperbarui.
- Jika transaksi dipindah ke pocket lain, kedua pocket diperbarui.
- User melihat pesan sukses.

---

## 10. Delete Expense Flow

```mermaid
flowchart TD
    A[Riwayat] --> B[Pilih transaksi]
    B --> C[Tap Hapus]
    C --> D{Konfirmasi?}
    D -- Ya --> E[Transaksi dihapus]
    E --> F[Budget dihitung ulang]
    D -- Tidak --> G[Batal]
```

### Copy konfirmasi

> Hapus pengeluaran ini? Data yang dihapus tidak bisa dikembalikan.

---

## 11. Recovery Flow

```mermaid
flowchart TD
    A[User mencatat pengeluaran] --> B[Sistem hitung safe-to-spend]
    B --> C{Status}
    C -- Aman --> D[Tampilkan pesan aman]
    C -- Waspada --> E[Tampilkan batas hemat]
    C -- Bahaya --> F[Tampilkan recovery plan]
```

### Pesan recovery

Jika melewati batas harian:
> Hari ini lewat Rp12.000. Masih bisa aman kalau 3 hari ke depan jaga di bawah Rp35.000/hari.

Jika budget hampir habis:
> Uang mulai tipis. Prioritaskan makan, transport, dan kebutuhan kuliah dulu.

---

## 12. Export Data Flow

```mermaid
flowchart TD
    A[Tab Saya] --> B[Tap Export CSV]
    B --> C{Ada transaksi?}
    C -- Ya --> D[Generate file CSV]
    D --> E[Download]
    C -- Tidak --> F[Tampilkan empty state]
```

---

## 13. Reset Data Flow

```mermaid
flowchart TD
    A[Tab Saya] --> B[Tap Reset Data]
    B --> C[Konfirmasi]
    C --> D{User setuju?}
    D -- Ya --> E[Hapus data lokal]
    E --> F[Kembali ke onboarding]
    D -- Tidak --> G[Batal]
```

---

## 14. Critical User Paths

### Path 1 — Aha Moment

```text
Buka app → Input Rp300.000 untuk 7 hari → Lihat aman per hari Rp42.857
```

### Path 2 — Daily Habit

```text
Buka app → Tap + Catat → Input nominal → Pilih kategori → Simpan → Lihat sisa aman baru
```

### Path 3 — Recovery

```text
Catat pengeluaran besar → Status berubah Waspada/Bahaya → Lihat recovery plan → Sesuaikan pengeluaran
```

---

## 15. Empty States

| Screen | Empty state |
|---|---|
| Home tanpa pocket | “Buat pocket pertama untuk tahu batas aman harianmu.” |
| Riwayat kosong | “Belum ada pengeluaran. Mulai catat dari transaksi kecil.” |
| Pocket kosong | “Buat pocket seperti Uang Minggu Ini atau Uang Makan.” |
| Export kosong | “Belum ada data untuk diexport.” |

---

## 16. UX Risks

| Risiko | Solusi |
|---|---|
| User tidak paham pocket | Gunakan contoh “Rp300.000 untuk 7 hari” |
| User malas mencatat | Quick Add dan form 2 langkah |
| User merasa gagal | No shame copy + recovery plan |
| User lupa membuka app | Reminder malam opsional |
| Data hilang | Export CSV dan backup JSON di versi berikutnya |

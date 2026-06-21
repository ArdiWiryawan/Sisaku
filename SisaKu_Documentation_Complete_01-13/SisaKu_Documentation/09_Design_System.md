# SisaKu — Design System

**Versi:** 1.0  
**Produk:** SisaKu — PWA Budgeting Harian untuk Mahasiswa  
**Tagline:** Tahu batas aman uangmu setiap hari.  
**Status:** MVP Documentation  

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan sistem desain SisaKu agar tampilan, interaksi, dan komponen aplikasi konsisten saat dikembangkan sebagai Progressive Web App (PWA). Design system ini dibuat untuk menjaga produk tetap:

- sederhana,
- mobile-first,
- mudah dipakai harian,
- terasa tenang dan tidak menghakimi,
- konsisten secara visual dan perilaku.

Design system SisaKu tidak hanya berisi warna dan komponen, tetapi juga prinsip pengalaman pengguna yang mendukung tujuan utama produk: membantu pengguna mengetahui **batas aman uang harian**.

---

## 2. Prinsip Desain Utama

### 2.1 Safe Number First

Angka paling penting dalam aplikasi adalah:

> **Hari ini aman pakai berapa?**

Karena itu, layar utama harus selalu memprioritaskan **safe-to-spend today** dibanding grafik atau laporan panjang.

### 2.2 Mobile-First, Not Desktop Dashboard

SisaKu dibuat untuk dibuka cepat di HP, terutama setelah transaksi kecil seperti makan, kopi, transportasi, atau print. Karena itu, desain harus:

- nyaman di layar kecil,
- tombol mudah dijangkau ibu jari,
- navigasi sederhana,
- tidak memaksa pengguna berpikir lama.

### 2.3 No Shame, Only Recovery

Aplikasi keuangan sering membuat pengguna merasa bersalah. SisaKu harus menghindari bahasa yang menghakimi. Saat pengguna melewati batas, UI harus memberi jalan balik.

Contoh:

```text
Hari ini lewat Rp12.000.
Masih bisa aman kalau 3 hari ke depan jaga di bawah Rp35.000/hari.
```

Bukan:

```text
Kamu boros.
```

### 2.4 Fast Input Beats Complete Input

Untuk membangun kebiasaan, input pengeluaran harus lebih ringan daripada rasa malas pengguna. Field wajib hanya:

```text
Nominal
Kategori
Pocket
```

Nama transaksi, catatan, dan tanggal detail boleh ada, tetapi tidak boleh menghambat input cepat.

### 2.5 Calm Finance Interface

SisaKu bukan aplikasi bank, bukan aplikasi akuntansi, dan bukan aplikasi investasi. Visualnya harus terasa:

- tenang,
- bersih,
- modern,
- ramah mahasiswa,
- tidak terlalu formal,
- tidak terlalu childish.

---

## 3. Brand Personality

| Dimensi | Arah SisaKu |
|---|---|
| Kepribadian | Teman finansial harian |
| Nada | Tenang, suportif, langsung ke inti |
| Energi visual | Soft, clean, modern |
| Kesan produk | Ringan, cepat, aman, bisa dipercaya |
| Anti-personality | Menghakimi, terlalu corporate, terlalu ramai, terlalu game-like |

### Brand Statement

> SisaKu membantu mahasiswa tahu batas aman uang harian agar uang cukup sampai hari terakhir tanpa ribet.

---

## 4. Visual Direction

### 4.1 Style Keywords

```text
Calm
Minimal
Mobile-first
Student-friendly
Friendly finance
Simple budgeting
Soft utility
```

### 4.2 Referensi Pola Kompetitor

| Kompetitor | Pola UI/UX yang Diambil | Adaptasi untuk SisaKu |
|---|---|---|
| Monefy | Input cepat | Quick Add nominal + kategori |
| PocketGuard | Safe-to-spend | Hero metric “Hari ini aman pakai” |
| Goodbudget | Envelope budgeting | Pocket budget |
| Toshl | Budget vs time | Sisa uang dibanding sisa hari |
| Sribuu/Finku | Bahasa lokal | Copywriting mahasiswa Indonesia |

---

## 5. Design Tokens

### 5.1 Color Palette

#### Primary Colors

| Token | Hex | Fungsi |
|---|---|---|
| `--color-primary` | `#2563EB` | CTA utama, link aktif, highlight |
| `--color-primary-dark` | `#1D4ED8` | Hover/pressed primary |
| `--color-primary-soft` | `#EFF6FF` | Background ringan untuk elemen aktif |

#### Semantic Colors

| Token | Hex | Status | Fungsi |
|---|---|---|---|
| `--color-safe` | `#16A34A` | Aman | Status budget sehat |
| `--color-safe-bg` | `#ECFDF3` | Aman | Background banner/card aman |
| `--color-warning` | `#D97706` | Waspada | Budget mulai mepet |
| `--color-warning-bg` | `#FFF7ED` | Waspada | Background banner waspada |
| `--color-danger` | `#DC2626` | Bahaya | Budget habis/overspend |
| `--color-danger-bg` | `#FEF2F2` | Bahaya | Background banner bahaya |

#### Neutral Colors

| Token | Hex | Fungsi |
|---|---|---|
| `--color-bg` | `#F8FAFC` | Background aplikasi |
| `--color-surface` | `#FFFFFF` | Card, modal, bottom sheet |
| `--color-border` | `#E2E8F0` | Border card/input |
| `--color-text` | `#0F172A` | Teks utama |
| `--color-text-muted` | `#64748B` | Teks sekunder |
| `--color-disabled` | `#CBD5E1` | Disabled state |

### 5.2 Color Usage Rules

- Gunakan primary blue untuk aksi utama.
- Gunakan green hanya untuk status aman.
- Gunakan amber untuk peringatan ringan.
- Gunakan red secara hemat untuk kondisi benar-benar kritis.
- Jangan menggunakan warna merah untuk menyalahkan user.
- Jangan menggunakan terlalu banyak warna kategori di MVP; cukup gunakan icon/chip ringan.

---

## 6. Typography

### 6.1 Font Family

Rekomendasi:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Alasan:

- mudah dibaca di layar kecil,
- modern,
- cocok untuk interface produk digital,
- tersedia fallback system font.

### 6.2 Type Scale

| Token | Size | Weight | Use Case |
|---|---:|---:|---|
| `display-lg` | 36px | 800 | Safe number utama |
| `heading-lg` | 28px | 800 | Judul halaman |
| `heading-md` | 22px | 700 | Judul card |
| `body-lg` | 18px | 600 | Nilai penting |
| `body-md` | 16px | 400 | Teks utama |
| `body-sm` | 14px | 400 | Teks sekunder |
| `caption` | 12px | 500 | Label, helper text |

### 6.3 Typography Rules

- Safe number harus paling dominan secara visual.
- Gunakan maksimal 2 ukuran heading dalam satu screen.
- Hindari paragraf panjang di layar utama.
- Gunakan angka rupiah dengan format Indonesia.

Contoh:

```text
Rp42.857
```

Bukan:

```text
IDR 42,857.00
```

---

## 7. Spacing & Layout

### 7.1 Spacing Scale

| Token | Value | Use Case |
|---|---:|---|
| `space-1` | 4px | Jarak kecil antar label |
| `space-2` | 8px | Jarak elemen kecil |
| `space-3` | 12px | Padding chip |
| `space-4` | 16px | Padding card mobile |
| `space-5` | 20px | Gap section kecil |
| `space-6` | 24px | Padding halaman |
| `space-8` | 32px | Gap antar section utama |

### 7.2 Mobile Layout

- Max content width mobile: full width dengan padding 16px.
- Bottom navigation fixed.
- Primary CTA mudah dijangkau.
- Hindari card terlalu banyak dalam satu layar pertama.

### 7.3 Desktop Layout

PWA tetap boleh responsive di desktop, tetapi desktop bukan prioritas utama.

- Max width content: 1120px.
- Layout boleh 2 kolom untuk detail pocket dan riwayat.
- Jangan membuat dashboard desktop terlalu kompleks.

---

## 8. Shape, Radius, Shadow

### 8.1 Border Radius

| Token | Value | Use Case |
|---|---:|---|
| `radius-sm` | 8px | Small chip, badge |
| `radius-md` | 12px | Input, small button |
| `radius-lg` | 16px | Card kecil |
| `radius-xl` | 24px | Main card, modal |
| `radius-full` | 999px | Pill, chip |

### 8.2 Shadow

Gunakan shadow lembut.

```css
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
```

Shadow tidak boleh membuat UI terasa berat atau seperti dashboard enterprise.

---

## 9. Core Components

### 9.1 Safe Number Card

**Tujuan:** Menampilkan batas aman pengeluaran hari ini.

Isi:

```text
Hari ini aman pakai
Rp42.857
Sisa 6 hari • Rp240.000 tersisa
```

State:

| State | Visual | Copy |
|---|---|---|
| Aman | Green soft | Masih aman. Lanjutkan ritme ini. |
| Waspada | Amber soft | Mulai mepet. Jaga pengeluaran hari ini. |
| Bahaya | Red soft | Uang mulai tipis. Prioritaskan kebutuhan utama. |

Rules:

- Safe number harus paling besar.
- Jangan taruh grafik di atas safe number.
- Card harus muncul di layar pertama Home.

---

### 9.2 Pocket Card

**Tujuan:** Menampilkan budget pocket.

Isi:

```text
Uang Minggu Ini
Rp240.000 tersisa
6 hari lagi
Aman per hari Rp40.000
```

Komponen:

- nama pocket,
- sisa uang,
- sisa hari,
- status pill,
- progress uang vs waktu.

---

### 9.3 Quick Add Chip

**Tujuan:** Mempercepat input transaksi berulang.

Contoh:

```text
Makan 15K
Kopi 12K
Transport 20K
Print 5K
Laundry 10K
```

Behavior:

- Tap chip langsung membuka bottom sheet konfirmasi.
- User bisa mengedit nominal sebelum simpan.
- Chip dapat disesuaikan di versi berikutnya.

---

### 9.4 Expense Item

Isi:

```text
Ayam geprek
Makan • Hari ini
Rp15.000
```

Actions:

- Tap item membuka detail.
- Swipe/delete hanya jika aman secara UX.
- Edit dan hapus tersedia di detail.

---

### 9.5 Status Pill

Status:

```text
Aman
Waspada
Bahaya
Selesai
```

Rules:

- Gunakan warna semantic.
- Jangan gunakan teks seperti “Gagal”.
- Status harus memberi arah, bukan vonis.

---

### 9.6 Recovery Banner

Muncul ketika user melewati batas aman.

Contoh:

```text
Hari ini lewat Rp12.000.
Masih bisa aman kalau 3 hari ke depan jaga di bawah Rp35.000/hari.
```

Rules:

- Copy harus suportif.
- CTA opsional: “Lihat rencana hemat”.
- Jangan muncul terlalu agresif.

---

### 9.7 Bottom Navigation

Tab utama:

```text
Home
Pocket
Riwayat
Saya
```

Rules:

- Maksimal 4 tab.
- Gunakan label teks, bukan icon saja.
- Active tab harus jelas.

---

## 10. Interaction States

### 10.1 Button States

| State | Behavior |
|---|---|
| Default | Warna normal |
| Hover | Warna sedikit lebih gelap di desktop |
| Pressed | Scale halus atau warna lebih gelap |
| Disabled | Opacity rendah dan tidak bisa diklik |
| Loading | Spinner kecil + teks aksi |

### 10.2 Input States

| State | Behavior |
|---|---|
| Default | Border neutral |
| Focus | Border primary + ring soft |
| Error | Border danger + helper text |
| Success | Tidak perlu berlebihan |
| Disabled | Background muted |

### 10.3 Empty States

Empty state harus menjelaskan tindakan berikutnya.

Contoh:

```text
Belum ada pocket.
Buat budget pertamamu agar tahu batas aman harian.
[+ Buat Pocket]
```

---

## 11. Accessibility Guidelines

- Minimum kontras teks mengikuti praktik aksesibilitas umum.
- Jangan mengandalkan warna saja untuk status; selalu gunakan teks “Aman/Waspada/Bahaya”.
- Tombol minimal 44px tinggi untuk mobile.
- Input harus punya label eksplisit.
- Semua icon penting harus punya label atau `aria-label`.
- Jangan gunakan animasi berlebihan.

---

## 12. Implementation Notes

### 12.1 Tailwind Token Mapping

Contoh mapping:

```js
colors: {
  primary: '#2563EB',
  safe: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  surface: '#FFFFFF',
  background: '#F8FAFC'
}
```

### 12.2 Component Naming

```text
SafeNumberCard
PocketCard
QuickAddChip
ExpenseItem
StatusPill
RecoveryBanner
BottomNav
InsightCard
```

---

## 13. Design QA Checklist

Sebelum desain dianggap siap:

- [ ] Safe number terlihat dalam 3 detik.
- [ ] Tombol tambah pengeluaran jelas.
- [ ] Form tambah transaksi bisa selesai kurang dari 10 detik.
- [ ] Status tidak terasa menghakimi.
- [ ] Semua state kosong punya CTA.
- [ ] Tampilan nyaman di layar 360px.
- [ ] Bottom nav tidak menutupi CTA penting.
- [ ] Warna status konsisten.
- [ ] Semua komponen punya versi mobile.
- [ ] UI tetap dapat dipakai offline.

---

## 14. Sumber Rujukan

- Nielsen Norman Group — Design Systems 101: https://www.nngroup.com/articles/design-systems-101/
- Nielsen Norman Group — Design Systems vs Style Guides: https://www.nngroup.com/articles/design-systems-vs-style-guides/
- Figma — Design Systems 101: https://www.figma.com/blog/design-systems-101-what-is-a-design-system/

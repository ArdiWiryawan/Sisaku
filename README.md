# 🪙 SisaKu — PWA Budgeting Harian Mahasiswa

> **"Hari ini aman pakai berapa supaya uang saku cukup sampai hari terakhir?"**

[![Live Demo](https://img.shields.io/badge/demo-live-blue.svg?style=for-the-badge&logo=vercel&color=2f6df6)](https://sisaku-app.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/github-repo-black.svg?style=for-the-badge&logo=github)](https://github.com/ArdiWiryawan/Sisaku)

SisaKu adalah aplikasi Progressive Web App (PWA) budgeting harian local-first yang dirancang khusus untuk mahasiswa dan anak muda. Berbeda dengan aplikasi keuangan biasa yang hanya mencatat kemana uang pergi, SisaKu berfokus pada **tindakan preventif** dengan memberitahu pengguna batas aman belanja mereka setiap hari secara dinamis.

---

## ✨ Fitur Utama

- 🎯 **Daily Safe-to-Spend (Batas Aman Harian):** Angka aman belanja hari ini dihitung dinamis setiap kali Anda mencatat transaksi (`Sisa Uang / Sisa Hari`).
- 🎨 **Visual Premium & Taktil:** Antarmuka modern berkonsep *glassmorphic*, gradasi warna yang menenangkan, serta transisi interaktif yang responsif dan memuaskan.
- 🦊 **Kiko, Asisten Keuanganmu:** Maskot suportif yang memberikan rekomendasi finansial tanpa kesan menghakimi (*no shame, only recovery*).
- 🏆 **Gamifikasi XP & Misi Harian:** Dapatkan XP dan buka lencana (*badges*) hemat dengan menjaga disiplin keuangan dan menyelesaikan tantangan harian.
- ⚡ **Tap Catat Cepat (Quick Add):** Template transaksi rutin sekali ketuk (Makan, Kopi, Transportasi, Print, dan Laundry).
- 🔐 **Local-First & Privasi Penuh:** Berjalan 100% offline, seluruh data disimpan di browser Anda (`localStorage`). Tanpa login, tanpa bank-sync, tanpa iklan.
- 📥 **Ekspor CSV:** Ekspor seluruh data transaksi Anda ke file CSV kapan saja untuk cadangan atau analisis manual.

---

## 🛠️ Teknologi & Desain

- **Core:** React 19 + TypeScript + Vite 8
- **Styling:** Vanilla CSS (Modern CSS variables, flexbox/grid layout, glassmorphic backdrop-filters, custom keyframe spring animations)
- **Icons:** Lucide React
- **PWA:** Service worker cache, standalone display mode, offline-first support.
- **Typography:** *Plus Jakarta Sans* (Heading & Angka) & *Inter* (Body Text) via Google Fonts.

---

## 📈 Logika Budgeting SisaKu

Aplikasi menghitung batas aman Anda menggunakan rumus sederhana namun sangat efektif:

$$\text{Sisa Uang} = \text{Total Budget} - \text{Total Pengeluaran}$$
$$\text{Sisa Hari} = \text{Tanggal Akhir} - \text{Hari Ini} + 1$$
$$\text{Batas Aman Per Hari} = \frac{\text{Sisa Uang}}{\text{Sisa Hari}}$$

Jika Anda belanja melebihi batas hari ini, sistem akan menghitung ulang rekomendasi harian baru secara otomatis (*recovery plan*):
> *"Hari ini lewat Rp12.000. Masih bisa aman kalau 3 hari ke depan jaga pengeluaran di bawah Rp35.000/hari."*

---

## 🚀 Menjalankan Secara Lokal

Pastikan Anda memiliki [Node.js](https://nodejs.org/) terinstal di komputer Anda.

1. **Clone repositori:**
   ```bash
   git clone https://github.com/ArdiWiryawan/Sisaku.git
   cd Sisaku
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser Anda.

4. **Jalankan uji logika (Vitest):**
   ```bash
   npm run test
   ```

5. **Build produksi:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔒 Catatan Privasi

SisaKu dibangun dengan prinsip menghargai privasi Anda. Aplikasi ini tidak mengirimkan data transaksi Anda ke server mana pun. Seluruh kalkulasi dan penyimpanan data murni dilakukan di dalam perangkat Anda.

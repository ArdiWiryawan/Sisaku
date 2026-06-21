# PWA Specification — SisaKu

**Versi:** 1.0  
**Tanggal:** 2026-06-21  
**Produk:** SisaKu  
**Platform:** Progressive Web App

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan spesifikasi PWA untuk SisaKu agar aplikasi dapat dibuka melalui browser, dipasang ke Home Screen, terasa seperti aplikasi mobile, dan tetap dapat digunakan untuk fitur inti secara offline setelah kunjungan pertama.

---

## 2. PWA Goal

SisaKu dibuat sebagai PWA karena:

1. User bisa mencoba lewat link tanpa Play Store.
2. User bisa memasang ke Home Screen.
3. Development lebih cepat daripada native app.
4. Satu codebase dapat berjalan di mobile dan desktop.
5. Fitur inti dapat berjalan offline.
6. Cocok untuk MVP dan validasi cepat.

---

## 3. PWA Experience Target

Setelah di-install, SisaKu harus terasa seperti aplikasi:

- memiliki icon di Home Screen;
- terbuka dalam standalone mode;
- tidak terlihat seperti tab browser biasa;
- cepat dibuka;
- dapat menampilkan data lokal tanpa internet;
- tetap mobile-first.

---

## 4. Installability Requirements

Agar PWA dapat dipasang, SisaKu harus memiliki:

1. Web app manifest.
2. Nama aplikasi.
3. Icon yang sesuai.
4. Start URL.
5. Display mode standalone.
6. Service worker.
7. HTTPS saat deployment.
8. Halaman responsive mobile.

---

## 5. Web App Manifest

File:

```text
public/manifest.webmanifest
```

Contoh:

```json
{
  "name": "SisaKu",
  "short_name": "SisaKu",
  "description": "Tahu batas aman uangmu setiap hari.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#F8FAFC",
  "theme_color": "#2563EB",
  "categories": ["finance", "productivity", "utilities"],
  "lang": "id-ID",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

---

## 6. Icon Requirements

### Required

| Size | Purpose |
|---|---|
| 192x192 | Android icon |
| 512x512 | PWA install icon |
| 512x512 maskable | Adaptive icon |

### Recommended visual

- Logo huruf “S” atau simbol dompet sederhana.
- Background biru.
- Shape sederhana.
- Tetap terbaca di ukuran kecil.

---

## 7. Theme and Display

### Theme color

```text
#2563EB
```

### Background color

```text
#F8FAFC
```

### Display mode

```text
standalone
```

### Orientation

```text
portrait
```

Alasan:
- Target utama penggunaan adalah mobile.
- Pengguna mencatat pengeluaran sambil berjalan atau setelah transaksi.
- Portrait lebih cocok untuk penggunaan cepat satu tangan.

---

## 8. Service Worker Strategy

Service worker digunakan untuk:

- cache app shell;
- cache static assets;
- memungkinkan akses offline setelah first load;
- mempercepat loading berikutnya.

### MVP caching strategy

| Resource | Strategy |
|---|---|
| HTML shell | Network first fallback cache |
| JS/CSS build assets | Cache first |
| Icons | Cache first |
| Manifest | Cache first |
| User data | Browser storage, bukan cache |

### Catatan

Data pengeluaran tidak disimpan di Cache Storage. Data pengguna disimpan di LocalStorage/IndexedDB.

---

## 9. Offline Behavior

### Expected offline behavior

| Fitur | Offline MVP |
|---|---|
| Buka app setelah first load | Bisa |
| Lihat dashboard | Bisa |
| Tambah transaksi | Bisa |
| Edit/hapus transaksi | Bisa |
| Buat pocket | Bisa |
| Export CSV | Bisa |
| Install app pertama kali | Butuh online |
| Update app versi baru | Butuh online |

### Offline message

Jika app mendeteksi offline:

> Kamu sedang offline. Data tetap tersimpan di perangkat ini.

---

## 10. Local Data Strategy

### MVP

Gunakan:
- LocalStorage untuk versi awal cepat.
- IndexedDB untuk versi berikutnya jika data makin besar.

### Data stored locally

- Pocket.
- Expense.
- Settings.
- Quick add templates.
- Onboarding state.

### Data not stored

- Password.
- Bank credentials.
- E-wallet credentials.
- Sensitive identity data.

---

## 11. Update Strategy

Masalah umum PWA: user masih memakai asset lama setelah update.

### MVP approach

- Tampilkan banner jika update tersedia:

> Versi baru SisaKu tersedia. Muat ulang sekarang?

### Future approach

- Workbox.
- Service worker versioning.
- Skip waiting dengan konfirmasi user.

---

## 12. Install Prompt UX

### Android Chrome

Jika browser mendukung, tampilkan custom install card:

> Pasang SisaKu di HP agar lebih cepat dibuka.

CTA:
> Pasang App

### iOS Safari

Karena prompt install otomatis berbeda, tampilkan instruksi manual:

1. Tap tombol Share.
2. Pilih Add to Home Screen.
3. Tap Add.

### Desktop

Tampilkan instruksi ringan jika install tersedia.

---

## 13. App Shell

App shell yang harus di-cache:

```text
/
index.html
main JS
CSS
manifest
icons
core fonts jika ada
```

### App shell goal

User dapat membuka UI utama meskipun offline.

---

## 14. Performance Requirements

- App dapat dibuka cepat di mobile.
- Hindari library berat.
- Gunakan lazy loading jika diperlukan.
- Gambar/icon dioptimasi.
- Tidak ada request server untuk data MVP.

Target:
- Loading awal sederhana.
- Interaksi tambah transaksi instan.
- Dashboard update tanpa loading.

---

## 15. Browser Support

Target awal:

| Platform | Browser |
|---|---|
| Android | Chrome, Edge |
| iOS | Safari |
| Desktop | Chrome, Edge, Firefox |

Catatan:
- Dukungan install PWA berbeda antar browser.
- iOS punya batasan tertentu, sehingga perlu halaman panduan install manual.

---

## 16. Security Considerations

### HTTPS

PWA harus di-deploy dengan HTTPS.

### Service worker scope

Pastikan service worker hanya mengontrol scope aplikasi.

### XSS prevention

- Jangan render input user sebagai HTML mentah.
- Escape data saat export CSV.
- Validasi input nominal dan tanggal.

### Privacy

- Jangan kirim data pengguna ke server pada MVP.
- Jangan gunakan analytics invasif.
- Jika analytics digunakan, harus anonim dan dijelaskan.

---

## 17. PWA QA Checklist

| Checklist | Status |
|---|---|
| manifest.webmanifest valid | Pending |
| icon 192 tersedia | Pending |
| icon 512 tersedia | Pending |
| maskable icon tersedia | Pending |
| display standalone | Pending |
| theme color benar | Pending |
| start_url benar | Pending |
| service worker registered | Pending |
| app bisa dibuka offline | Pending |
| data lokal tetap tersimpan | Pending |
| install prompt Android diuji | Pending |
| Add to Home Screen iOS diuji | Pending |
| Lighthouse PWA audit dilakukan | Pending |

---

## 18. Deployment Recommendation

### MVP hosting

- Vercel.
- Netlify.
- Cloudflare Pages.

### Requirement

- HTTPS aktif.
- Correct headers untuk manifest.
- Build assets cacheable.
- No server required untuk MVP.

---

## 19. Future Native Packaging

Jika PWA sudah tervalidasi, SisaKu dapat dibungkus menjadi APK Android menggunakan Capacitor.

Future flow:

```text
React/Vite PWA
↓
Capacitor init
↓
Add Android platform
↓
Build web assets
↓
Sync Capacitor
↓
Open Android Studio
↓
Build APK
```

APK sebaiknya dibuat setelah:
- MVP dipakai harian;
- UI stabil;
- formula budget sudah tervalidasi;
- user benar-benar butuh file APK.

---

## 20. Referensi

- MDN — Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- MDN — Web App Manifest: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
- web.dev — Progressive Web Apps: https://web.dev/learn/pwa/progressive-web-apps
- web.dev — Service Workers: https://web.dev/learn/pwa/service-workers
- web.dev — Offline data: https://web.dev/learn/pwa/offline-data

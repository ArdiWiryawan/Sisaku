# Technical Specification — SisaKu PWA

**Versi:** 1.0  
**Tanggal:** 2026-06-21  
**Produk:** SisaKu  
**Target Platform:** Mobile-first PWA

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan spesifikasi teknis untuk membangun MVP SisaKu. Fokus teknis MVP adalah aplikasi ringan, installable, offline-first, dan data tersimpan lokal di perangkat pengguna.

---

## 2. Recommended Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS atau CSS biasa modular |
| State | React state + custom hooks |
| Storage MVP | LocalStorage atau IndexedDB |
| PWA | Web App Manifest + Service Worker |
| Deployment | Vercel / Netlify |
| Testing | Vitest untuk logic, manual QA untuk UX |
| Future APK | Capacitor |

### Rekomendasi storage

Untuk MVP tercepat:
- Mulai dengan **LocalStorage**.

Untuk versi lebih robust:
- Pindah ke **IndexedDB**.

---

## 3. Architecture Overview

```text
UI Components
↓
Hooks / State Management
↓
Domain Logic
↓
Storage Adapter
↓
Browser Storage
```

### Prinsip arsitektur

1. UI tidak langsung menghitung budget kompleks.
2. Semua formula diletakkan di `utils/budgeting`.
3. Storage dibungkus adapter agar mudah diganti dari LocalStorage ke IndexedDB.
4. PWA config dipisahkan dari domain logic.
5. Komponen dibuat reusable.

---

## 4. Project Structure

```text
sisaku-pwa/
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── manifest.webmanifest
│   └── screenshots/
│
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── routes.jsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx
│   │   │   └── AppShell.jsx
│   │   ├── pocket/
│   │   │   ├── PocketCard.jsx
│   │   │   ├── PocketForm.jsx
│   │   │   └── PocketSummary.jsx
│   │   ├── expense/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseItem.jsx
│   │   │   └── QuickAddChips.jsx
│   │   └── feedback/
│   │       ├── StatusPill.jsx
│   │       ├── RecoveryBanner.jsx
│   │       └── EmptyState.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── PocketPage.jsx
│   │   ├── PocketDetailPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── AddExpensePage.jsx
│   │   ├── OnboardingPage.jsx
│   │   └── SettingsPage.jsx
│   │
│   ├── hooks/
│   │   ├── usePockets.js
│   │   ├── useExpenses.js
│   │   └── useSettings.js
│   │
│   ├── utils/
│   │   ├── budgeting.js
│   │   ├── date.js
│   │   ├── currency.js
│   │   └── csv.js
│   │
│   ├── storage/
│   │   ├── keys.js
│   │   ├── localStorageAdapter.js
│   │   └── seed.js
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 5. Data Model

### Pocket

```ts
type Pocket = {
  id: string;
  name: string;
  initialBudget: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### Expense

```ts
type Expense = {
  id: string;
  pocketId: string;
  amount: number;
  category: string;
  title?: string;
  note?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};
```

### Settings

```ts
type Settings = {
  hasCompletedOnboarding: boolean;
  activePocketId?: string;
  reminderTime?: string;
  currency: "IDR";
  quickAddTemplates: QuickAddTemplate[];
};
```

---

## 6. Storage Keys

```ts
const STORAGE_KEYS = {
  pockets: "sisaku:pockets",
  expenses: "sisaku:expenses",
  settings: "sisaku:settings",
  version: "sisaku:version",
};
```

---

## 7. Core Utility Functions

### Budget summary

```ts
calculatePocketSummary(pocket, expenses, today)
```

Returns:
- totalDays;
- remainingDays;
- totalSpent;
- spentToday;
- remainingMoney;
- initialSafePerDay;
- safePerDay;
- status;
- recoveryMessage.

### Status

```ts
getBudgetStatus(summary)
```

Returns:
- "AMAN";
- "WASPADA";
- "BAHAYA";
- "SELESAI".

### Currency

```ts
formatRupiah(value)
```

### Date

```ts
diffDays(dateA, dateB)
getTodayISO()
formatDateLabel(date)
```

### CSV

```ts
exportExpensesToCSV(expenses, pockets)
```

---

## 8. State Management

Untuk MVP, gunakan React state di root dan custom hooks.

```text
App
├── usePockets()
├── useExpenses()
└── useSettings()
```

### Kenapa tidak langsung Redux/Zustand?

MVP kecil. State masih sederhana. Hindari dependency sebelum kebutuhan jelas.

### Kapan perlu Zustand?

Jika:
- pocket dan expense semakin kompleks;
- banyak modal/screen butuh akses global;
- fitur sync ditambahkan.

---

## 9. Routing

Untuk MVP bisa menggunakan state-based navigation atau React Router.

Rekomendasi:
- Jika ingin cepat: state `currentTab`.
- Jika ingin lebih scalable: React Router.

Route yang direkomendasikan:

```text
/
 /onboarding
 /add-expense
 /pockets
 /pockets/:id
 /history
 /settings
```

---

## 10. PWA Implementation

### Required files

```text
public/manifest.webmanifest
public/icons/icon-192.png
public/icons/icon-512.png
service-worker.js atau generated service worker
```

### Manifest essentials

- name.
- short_name.
- start_url.
- display: standalone.
- theme_color.
- background_color.
- icons.

### Service worker strategy

MVP:
- cache app shell;
- cache static assets;
- allow app to open offline after first load.

Data:
- user data remains in browser storage;
- do not cache sensitive exports unnecessarily.

---

## 11. Offline Strategy

### MVP Offline Behavior

| Condition | Behavior |
|---|---|
| User sudah pernah membuka app | App shell tetap bisa dibuka |
| User membuat transaksi offline | Data disimpan lokal |
| User export CSV offline | Tetap bisa karena data lokal |
| User belum pernah membuka app | Membutuhkan internet untuk first load |

---

## 12. Error Handling

### Input validation

- Nominal harus > 0.
- Durasi harus minimal 1 hari.
- End date tidak boleh sebelum start date.
- Pocket harus dipilih sebelum transaksi disimpan.
- Kategori tidak boleh kosong.

### Storage error

Jika LocalStorage gagal:
- tampilkan pesan: “Data tidak bisa disimpan di perangkat ini.”
- sarankan user cek mode private/incognito.

### Date error

Jika tanggal transaksi di luar periode pocket:
- MVP: izinkan, tetapi beri warning.
- Versi berikutnya: tawarkan pindahkan ke pocket lain.

---

## 13. Security & Privacy

### MVP privacy

- Tidak ada login.
- Tidak ada server.
- Tidak ada koneksi bank/e-wallet.
- Data tersimpan lokal.
- Export dilakukan oleh user.

### Risiko

| Risiko | Mitigasi |
|---|---|
| Data hilang saat browser data dihapus | Export CSV/backup |
| Device dipakai orang lain | Future: PIN lock |
| Browser storage terbatas | Future: IndexedDB + backup |
| XSS | Hindari render HTML mentah dari input user |

---

## 14. Performance Requirements

- First contentful paint cepat.
- Bundle ringan.
- Hindari library besar untuk MVP.
- Gunakan lazy loading jika halaman semakin banyak.
- Komponen list transaksi harus efisien.

Target:
- App shell < 200KB gzipped jika memungkinkan.
- Add expense interaction tanpa loading berat.
- Kalkulasi dilakukan lokal dan instan.

---

## 15. Testing Plan

### Unit test

- calculatePocketSummary.
- getBudgetStatus.
- diffDays.
- formatRupiah.
- export CSV.

### Manual QA

- Buat pocket valid.
- Buat pocket invalid.
- Tambah transaksi.
- Edit transaksi.
- Hapus transaksi.
- Safe-to-spend berubah.
- Status berubah.
- Recovery banner muncul.
- App dibuka offline.
- PWA bisa diinstall.
- Export CSV berhasil.

---

## 16. Deployment

### Vercel

```bash
npm run build
vercel deploy
```

### Netlify

```bash
npm run build
netlify deploy
```

### Build output

```text
dist/
```

---

## 17. Future Technical Roadmap

### MVP 2

- IndexedDB.
- Notification reminder.
- Backup JSON.
- Import JSON.
- Better service worker caching.

### MVP 3

- Login optional.
- Cloud sync.
- PIN lock.
- Push notification.
- Install prompt optimization.

### MVP 4

- Capacitor Android APK.
- Play Store packaging.
- AI insight optional.

---

## 18. Referensi

- web.dev — PWA Service Workers: https://web.dev/learn/pwa/service-workers
- web.dev — Offline data for PWA: https://web.dev/learn/pwa/offline-data
- MDN — Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

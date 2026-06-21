# SisaKu — Data Model

**Versi:** 1.0  
**Produk:** SisaKu — PWA Budgeting Harian untuk Mahasiswa  
**Status:** MVP Documentation  
**Storage MVP:** LocalStorage atau IndexedDB

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan struktur data utama SisaKu agar aplikasi mudah dikembangkan, diuji, di-*backup*, dan dikembangkan ke fitur lanjutan seperti cloud sync atau APK Android.

Data model ini dirancang untuk MVP yang:

- offline-first,
- tidak membutuhkan login,
- menyimpan data di perangkat user,
- mendukung export CSV,
- mudah dimigrasikan ke database cloud jika diperlukan.

---

## 2. Prinsip Data

### 2.1 Local-First

Untuk MVP, data disimpan di perangkat pengguna. Hal ini sesuai positioning produk:

```text
Tidak perlu login.
Data tersimpan di HP kamu.
Bisa dipakai offline.
```

### 2.2 Simple but Extendable

Struktur data harus sederhana untuk MVP, tetapi tetap siap jika nanti ditambah:

- login opsional,
- cloud backup,
- multi-device sync,
- PIN lock,
- import/export data.

### 2.3 Derived Data Jangan Disimpan Jika Bisa Dihitung

Data seperti `remainingMoney`, `safePerDay`, dan `status` sebaiknya dihitung dari pocket dan expense, bukan disimpan permanen, agar mengurangi risiko data tidak sinkron.

---

## 3. Entity Relationship Overview

```text
AppSettings
    └── defaultPocketId

Pocket
    └── has many Expense

Category
    └── used by Expense

QuickAddTemplate
    └── creates Expense
```

Relasi utama:

```text
Pocket 1 --- many Expense
Category 1 --- many Expense
Pocket 1 --- many QuickAddTemplate optional
```

---

## 4. Entity: Pocket

Pocket adalah budget berdasarkan nominal uang dan periode waktu.

### 4.1 Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Unique ID pocket |
| `name` | string | Yes | Nama pocket, contoh “Uang Minggu Ini” |
| `totalBudget` | number | Yes | Jumlah uang awal |
| `startDate` | string | Yes | Format YYYY-MM-DD |
| `endDate` | string | Yes | Format YYYY-MM-DD |
| `createdAt` | string | Yes | ISO timestamp |
| `updatedAt` | string | Yes | ISO timestamp |
| `archivedAt` | string/null | No | Timestamp jika pocket diarsipkan |
| `type` | string | No | `general`, `food`, `transport`, `event`, `emergency` |
| `note` | string | No | Catatan opsional |

### 4.2 Example JSON

```json
{
  "id": "pocket_001",
  "name": "Uang Minggu Ini",
  "totalBudget": 300000,
  "startDate": "2026-06-21",
  "endDate": "2026-06-27",
  "type": "general",
  "note": "Uang sampai akhir minggu",
  "createdAt": "2026-06-21T09:00:00.000Z",
  "updatedAt": "2026-06-21T09:00:00.000Z",
  "archivedAt": null
}
```

### 4.3 Validation Rules

- `totalBudget` harus lebih dari 0.
- `endDate` tidak boleh sebelum `startDate`.
- `name` tidak boleh kosong.
- Pocket boleh aktif lebih dari satu, tetapi Home hanya menampilkan satu active pocket utama.

---

## 5. Entity: Expense

Expense adalah catatan pengeluaran yang mengurangi sisa uang pocket.

### 5.1 Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Unique ID expense |
| `pocketId` | string | Yes | Relasi ke Pocket |
| `amount` | number | Yes | Nominal pengeluaran |
| `categoryId` | string | Yes | Relasi ke Category |
| `title` | string | No | Nama transaksi opsional |
| `date` | string | Yes | Format YYYY-MM-DD |
| `note` | string | No | Catatan opsional |
| `createdAt` | string | Yes | ISO timestamp |
| `updatedAt` | string | Yes | ISO timestamp |
| `deletedAt` | string/null | No | Untuk soft delete opsional |

### 5.2 Example JSON

```json
{
  "id": "expense_001",
  "pocketId": "pocket_001",
  "amount": 15000,
  "categoryId": "cat_food",
  "title": "Ayam geprek",
  "date": "2026-06-21",
  "note": "Makan siang",
  "createdAt": "2026-06-21T12:00:00.000Z",
  "updatedAt": "2026-06-21T12:00:00.000Z",
  "deletedAt": null
}
```

### 5.3 Validation Rules

- `amount` harus lebih dari 0.
- `pocketId` harus mengarah ke pocket yang ada.
- `categoryId` harus mengarah ke kategori yang ada.
- `date` boleh sebelum hari ini untuk input transaksi terlambat.
- `date` tidak disarankan jauh di luar periode pocket, tetapi dapat ditangani dengan warning.

---

## 6. Entity: Category

Kategori digunakan untuk mengelompokkan pengeluaran.

### 6.1 Default Categories

| ID | Name | Icon | Notes |
|---|---|---|---|
| `cat_food` | Makan | 🍽️ | Makanan utama |
| `cat_drink` | Kopi/Jajan | ☕ | Kopi, minuman, snack |
| `cat_transport` | Transport | 🛵 | Grab, bensin, parkir |
| `cat_rent` | Kos | 🏠 | Kos/tempat tinggal |
| `cat_laundry` | Laundry | 🧺 | Laundry/pakaian |
| `cat_college` | Kuliah | 📚 | Print, fotokopi, tugas |
| `cat_org` | Organisasi | 👥 | Kegiatan organisasi |
| `cat_health` | Kesehatan | 💊 | Obat, klinik |
| `cat_shopping` | Belanja | 🛍️ | Barang pribadi |
| `cat_other` | Lainnya | 📌 | Kebutuhan lain |

### 6.2 Example JSON

```json
{
  "id": "cat_food",
  "name": "Makan",
  "icon": "🍽️",
  "isDefault": true,
  "createdAt": "2026-06-21T09:00:00.000Z"
}
```

---

## 7. Entity: QuickAddTemplate

Quick Add membantu user mencatat transaksi berulang dengan cepat.

### 7.1 Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | string | Yes | Unique ID |
| `label` | string | Yes | Label chip, contoh “Makan 15K” |
| `amount` | number | Yes | Nominal default |
| `categoryId` | string | Yes | Kategori default |
| `pocketId` | string/null | No | Pocket default jika ada |
| `isActive` | boolean | Yes | Apakah template ditampilkan |
| `createdAt` | string | Yes | ISO timestamp |

### 7.2 Example JSON

```json
{
  "id": "quick_001",
  "label": "Makan 15K",
  "amount": 15000,
  "categoryId": "cat_food",
  "pocketId": null,
  "isActive": true,
  "createdAt": "2026-06-21T09:00:00.000Z"
}
```

---

## 8. Entity: AppSettings

AppSettings menyimpan preferensi lokal pengguna.

### 8.1 Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `hasCompletedOnboarding` | boolean | Yes | Status onboarding |
| `defaultPocketId` | string/null | No | Pocket utama di Home |
| `currency` | string | Yes | Default `IDR` |
| `reminderEnabled` | boolean | Yes | Reminder aktif atau tidak |
| `reminderTime` | string/null | No | Format HH:mm |
| `theme` | string | Yes | `system`, `light`, `dark` |
| `lastOpenedAt` | string/null | No | ISO timestamp |
| `schemaVersion` | number | Yes | Versi data lokal |

### 8.2 Example JSON

```json
{
  "hasCompletedOnboarding": true,
  "defaultPocketId": "pocket_001",
  "currency": "IDR",
  "reminderEnabled": true,
  "reminderTime": "21:00",
  "theme": "system",
  "lastOpenedAt": "2026-06-21T21:00:00.000Z",
  "schemaVersion": 1
}
```

---

## 9. Derived Values

Derived values dihitung saat runtime.

### 9.1 Pocket Spending

```js
const totalSpent = expenses
  .filter(expense => expense.pocketId === pocket.id && !expense.deletedAt)
  .reduce((sum, expense) => sum + expense.amount, 0);
```

### 9.2 Remaining Money

```js
const remainingMoney = pocket.totalBudget - totalSpent;
```

### 9.3 Total Days

```js
const totalDays = differenceInCalendarDays(endDate, startDate) + 1;
```

### 9.4 Remaining Days

```js
const remainingDays = Math.max(
  differenceInCalendarDays(endDate, today) + 1,
  0
);
```

### 9.5 Initial Safe Per Day

```js
const initialSafePerDay = pocket.totalBudget / totalDays;
```

### 9.6 Current Safe Per Day

```js
const safePerDay = remainingDays > 0
  ? remainingMoney / remainingDays
  : 0;
```

---

## 10. Storage Structure MVP

### 10.1 LocalStorage Option

Key names:

```text
sisaku:pockets
sisaku:expenses
sisaku:categories
sisaku:quickAddTemplates
sisaku:settings
```

Example:

```js
localStorage.setItem('sisaku:pockets', JSON.stringify(pockets));
```

Kelebihan:

- mudah dibuat,
- cocok untuk prototype,
- cukup untuk data kecil.

Kekurangan:

- synchronous,
- kurang ideal untuk data besar,
- tidak sefleksibel IndexedDB.

### 10.2 IndexedDB Option

Object stores:

```text
pockets
expenses
categories
quickAddTemplates
settings
```

Kelebihan:

- cocok untuk data lebih besar,
- asynchronous,
- lebih tepat untuk PWA offline-first.

Rekomendasi:

```text
MVP cepat: LocalStorage
MVP lebih serius: IndexedDB via Dexie.js
```

---

## 11. Export CSV Schema

### 11.1 Expense CSV

Columns:

```text
Date, Pocket, Category, Title, Amount, Note
```

Example:

```csv
Date,Pocket,Category,Title,Amount,Note
2026-06-21,Uang Minggu Ini,Makan,Ayam geprek,15000,Makan siang
```

### 11.2 Pocket CSV

Columns:

```text
Name, Total Budget, Start Date, End Date, Total Spent, Remaining Money, Status
```

---

## 12. Data Migration Strategy

Setiap data lokal harus punya `schemaVersion`.

Contoh:

```js
const CURRENT_SCHEMA_VERSION = 1;
```

Jika versi naik:

```js
if (settings.schemaVersion < CURRENT_SCHEMA_VERSION) {
  runMigrations();
}
```

Migration examples:

| From | To | Action |
|---|---|---|
| v1 | v2 | Tambah field `type` pada pocket |
| v2 | v3 | Tambah soft delete `deletedAt` |
| v3 | v4 | Tambah custom category |

---

## 13. Privacy Notes

Untuk MVP:

```text
Data tidak dikirim ke server.
Data tersimpan di browser/perangkat user.
User bertanggung jawab melakukan export jika ingin backup.
```

Risiko:

- Data bisa hilang jika browser storage dihapus.
- Data tidak otomatis sinkron ke device lain.
- Mode private/incognito tidak cocok untuk penyimpanan jangka panjang.

Mitigasi:

- Tampilkan privacy note.
- Sediakan export CSV.
- Tambahkan backup/import di versi berikutnya.

---

## 14. Future Cloud Data Model

Jika nanti memakai Supabase/Firebase, entity dapat dipetakan menjadi tabel:

```text
users
pockets
expenses
categories
quick_add_templates
settings
```

Tambahan field:

```text
user_id
synced_at
server_updated_at
device_id
```

Cloud sync harus opsional agar positioning privacy-first tetap kuat.

---

## 15. Data QA Checklist

- [ ] Pocket tidak bisa dibuat dengan budget 0.
- [ ] Pocket tidak bisa dibuat dengan tanggal akhir sebelum tanggal mulai.
- [ ] Expense tidak bisa dibuat dengan nominal 0 atau negatif.
- [ ] Expense selalu terhubung ke pocket valid.
- [ ] Safe per day berubah setelah expense ditambah.
- [ ] Safe per day berubah setelah expense dihapus.
- [ ] Export CSV berisi data sesuai transaksi.
- [ ] Data tetap ada setelah refresh browser.
- [ ] Data tetap ada setelah PWA ditutup dan dibuka ulang.
- [ ] Reset data benar-benar menghapus semua data lokal.

---

## 16. Sumber Rujukan

- MDN — Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- web.dev — Offline data in PWAs: https://web.dev/learn/pwa/offline-data
- web.dev — Caching: https://web.dev/learn/pwa/caching

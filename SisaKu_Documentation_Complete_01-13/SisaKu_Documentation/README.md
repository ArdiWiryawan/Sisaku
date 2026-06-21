# SisaKu Documentation Pack

**SisaKu** adalah PWA budgeting harian untuk mahasiswa yang membantu menghitung batas aman pengeluaran harian berdasarkan uang yang dimiliki dan jumlah hari yang harus dilalui.

## Core Promise

> Masukkan uang yang kamu punya, tentukan harus cukup sampai kapan, lalu SisaKu bantu hitung batas aman harian.

## Dokumen

1. [Product Vision](01_Product_Vision.md)
2. [PRD](02_PRD.md)
3. [User Flow](03_User_Flow.md)
4. [Information Architecture](04_Information_Architecture.md)
5. [UI/UX Specification](05_UI_UX_Specification.md)
6. [Budgeting Logic](06_Budgeting_Logic.md)
7. [Technical Specification](07_Technical_Specification.md)
8. [PWA Specification](08_PWA_Specification.md)
9. [Design System](09_Design_System.md)
10. [UX Writing Guide](10_UX_Writing_Guide.md)
11. [Data Model](11_Data_Model.md)
12. [QA Testing Plan](12_QA_Testing_Plan.md)
13. [Release Checklist](13_Release_Checklist.md)

## Struktur Konsep Produk

```text
SisaKu
├── Budget Pocket
├── Safe-to-Spend Today
├── Catat Pengeluaran Cepat
├── Status Aman/Waspada/Bahaya
├── Recovery Plan
├── Riwayat
├── Export CSV
└── PWA Installable + Offline-first
```

## Catatan MVP

MVP SisaKu dirancang sebagai aplikasi local-first:

- tidak perlu login,
- tidak perlu koneksi bank/e-wallet,
- data tersimpan di perangkat user,
- dapat diinstall sebagai PWA,
- dapat dipakai untuk budgeting harian sederhana.

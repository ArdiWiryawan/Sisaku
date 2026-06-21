# SisaKu — QA Testing Plan

**Versi:** 1.0  
**Produk:** SisaKu — PWA Budgeting Harian untuk Mahasiswa  
**Status:** MVP Documentation

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan rencana pengujian SisaKu sebelum aplikasi dirilis sebagai PWA. Fokus QA bukan hanya memastikan aplikasi tidak error, tetapi memastikan core value produk benar-benar berjalan:

> User bisa tahu batas aman uang harian dan mencatat pengeluaran dengan cepat.

QA harus memastikan:

- kalkulasi budgeting akurat,
- input pengeluaran cepat,
- data tersimpan dengan aman secara lokal,
- PWA bisa diinstall di HP,
- aplikasi tetap berguna saat offline,
- tone dan UI tidak menghakimi user.

---

## 2. Scope Testing

### 2.1 In Scope

```text
Onboarding
Create pocket budget
Safe-to-spend calculation
Add/edit/delete expense
Expense history
Budget status
Recovery plan
Quick add
Local data persistence
CSV export
PWA installability
Offline behavior
Responsive mobile UI
Accessibility basics
```

### 2.2 Out of Scope for MVP

```text
Login
Cloud sync
Bank/e-wallet sync
AI insight
Payment integration
Multi-user account
Native push notification advanced
```

---

## 3. Test Environments

### 3.1 Browser

| Browser | Priority |
|---|---|
| Chrome Android | P0 |
| Chrome Desktop | P0 |
| Safari iOS | P1 |
| Edge Desktop | P1 |
| Firefox Desktop | P2 |

### 3.2 Device Width

| Width | Device Type | Priority |
|---:|---|---|
| 360px | Small Android | P0 |
| 390px | iPhone-like | P0 |
| 412px | Common Android | P0 |
| 768px | Tablet | P1 |
| 1024px+ | Desktop | P1 |

### 3.3 Network

| Condition | Priority |
|---|---|
| Online normal | P0 |
| Offline after first load | P0 |
| Slow 3G | P1 |
| Reload while offline | P1 |

---

## 4. Test Levels

| Level | Purpose | Example |
|---|---|---|
| Unit Test | Menguji fungsi kecil | Formula safePerDay |
| Integration Test | Menguji alur antar modul | Tambah expense mengubah pocket summary |
| UI Test | Menguji tampilan dan interaksi | Tombol Catat membuka form |
| PWA Test | Menguji install/offline/cache | App bisa dibuka offline |
| UAT | Menguji manfaat nyata | User bisa pakai 3 hari dan paham batas harian |

---

## 5. Critical User Journeys

### Journey 1 — First-Time User

```text
Open PWA
↓
Complete onboarding
↓
Create first pocket
↓
See safe-to-spend today
```

Expected result:

```text
User memahami “hari ini aman pakai berapa” dalam kurang dari 1 menit.
```

### Journey 2 — Daily Expense Input

```text
Open app
↓
Tap + Catat
↓
Input nominal
↓
Choose category
↓
Save
↓
Safe number updates
```

Expected result:

```text
User bisa mencatat pengeluaran kurang dari 10 detik.
```

### Journey 3 — Recovery

```text
User overspends
↓
App updates status
↓
App shows recovery plan
```

Expected result:

```text
User tahu cara memperbaiki budget tanpa merasa dihakimi.
```

---

## 6. Functional Test Cases

### 6.1 Onboarding

| ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| ONB-001 | User membuka app pertama kali | Open app | Onboarding muncul | P0 |
| ONB-002 | User input uang valid | Input Rp300.000 | Bisa lanjut | P0 |
| ONB-003 | User input kosong | Klik lanjut tanpa input | Error muncul | P0 |
| ONB-004 | User pilih durasi 7 hari | Input 7 hari | End date otomatis valid | P0 |
| ONB-005 | Onboarding selesai | Complete flow | Home menampilkan safe number | P0 |

### 6.2 Pocket Budget

| ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| PCK-001 | Buat pocket valid | Budget 300000, 7 hari | Pocket tersimpan | P0 |
| PCK-002 | Budget 0 | Input 0 | Error muncul | P0 |
| PCK-003 | End date sebelum start date | Pilih tanggal salah | Error muncul | P0 |
| PCK-004 | Edit pocket | Ubah nama/budget | Data berubah | P1 |
| PCK-005 | Arsip pocket | Archive pocket | Pocket tidak muncul sebagai aktif | P1 |

### 6.3 Budget Calculation

| ID | Scenario | Input | Expected Result | Priority |
|---|---|---|---|---|
| CAL-001 | Budget 300000 untuk 7 hari | No expense | Safe/day = 42857 | P0 |
| CAL-002 | Expense 60000 hari pertama | Remaining 240000, 6 hari | Safe/day = 40000 | P0 |
| CAL-003 | Budget habis | Remaining <= 0 | Status Bahaya | P0 |
| CAL-004 | Hari terakhir | Remaining 50000, 1 hari | Safe/day = 50000 | P0 |
| CAL-005 | Periode selesai | Remaining days 0 | Pocket selesai | P0 |

### 6.4 Expense

| ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| EXP-001 | Tambah expense valid | Input 15000 | Expense tersimpan | P0 |
| EXP-002 | Nominal kosong | Save tanpa nominal | Error muncul | P0 |
| EXP-003 | Nominal negatif | Input -10000 | Error muncul | P0 |
| EXP-004 | Edit expense | Ubah 15000 ke 20000 | Summary berubah | P0 |
| EXP-005 | Hapus expense | Delete item | Summary berubah | P0 |
| EXP-006 | Expense ke pocket berbeda | Pilih pocket lain | Expense masuk pocket benar | P1 |

### 6.5 History

| ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| HIS-001 | Lihat riwayat | Buka tab Riwayat | List muncul urut terbaru | P0 |
| HIS-002 | Filter kategori | Pilih Makan | Hanya kategori makan muncul | P1 |
| HIS-003 | Filter tanggal | Pilih hari ini | Hanya transaksi hari ini muncul | P1 |
| HIS-004 | Empty state | Tidak ada transaksi | Empty state + CTA muncul | P0 |

---

## 7. PWA Test Cases

| ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| PWA-001 | Manifest valid | Run Lighthouse | Manifest detected | P0 |
| PWA-002 | App installable | Open in Chrome Android | Install prompt/Add to Home Screen tersedia | P0 |
| PWA-003 | Standalone mode | Open from home screen | Tidak terlihat browser chrome penuh | P0 |
| PWA-004 | Icon tampil | Install app | Icon tampil benar | P0 |
| PWA-005 | Offline after first load | Load app, turn off internet | App tetap terbuka | P0 |
| PWA-006 | Data persists offline | Add expense offline | Expense tersimpan lokal | P0 |
| PWA-007 | Reload offline | Reload app offline | Offline fallback/app shell muncul | P1 |

---

## 8. Data Persistence Test Cases

| ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| DAT-001 | Refresh page | Tambah data, refresh | Data tetap ada | P0 |
| DAT-002 | Close and reopen PWA | Tutup app, buka lagi | Data tetap ada | P0 |
| DAT-003 | Export CSV | Klik export | File CSV terunduh | P1 |
| DAT-004 | Reset data | Klik reset dan confirm | Data terhapus | P0 |
| DAT-005 | Cancel reset | Klik reset lalu cancel | Data tidak terhapus | P0 |

---

## 9. UI/UX Test Cases

| ID | Scenario | Criteria | Priority |
|---|---|---|---|
| UX-001 | Safe number visible | Terlihat di layar pertama tanpa scroll | P0 |
| UX-002 | Add expense easy | User bisa input <10 detik | P0 |
| UX-003 | Bottom nav usable | Semua tab mudah dijangkau | P0 |
| UX-004 | Empty states helpful | Ada CTA jelas | P0 |
| UX-005 | Copy non-judgmental | Tidak ada kata “boros/gagal” | P0 |
| UX-006 | Responsive mobile | Tidak overflow di 360px | P0 |
| UX-007 | Error understandable | Error menjelaskan cara memperbaiki | P0 |

---

## 10. Accessibility Test Cases

| ID | Scenario | Criteria | Priority |
|---|---|---|---|
| A11Y-001 | Keyboard navigation | Semua input dan tombol bisa diakses keyboard | P1 |
| A11Y-002 | Label input | Semua input punya label | P0 |
| A11Y-003 | Color status | Status tidak hanya bergantung pada warna | P0 |
| A11Y-004 | Tap target | Tombol utama minimal 44px | P0 |
| A11Y-005 | Contrast | Teks utama mudah dibaca | P0 |

---

## 11. Performance Test Cases

| ID | Scenario | Target | Priority |
|---|---|---|---|
| PERF-001 | First load | Cepat di koneksi normal | P0 |
| PERF-002 | Reopen PWA | App shell muncul cepat | P0 |
| PERF-003 | Add expense | Tidak terasa delay | P0 |
| PERF-004 | History list | Tetap lancar dengan 500 transaksi | P1 |
| PERF-005 | Bundle size | Tidak membawa library berat yang tidak perlu | P1 |

---

## 12. Edge Cases

| Case | Expected Handling |
|---|---|
| Budget 1 hari | Safe per day = remaining money |
| Budget habis sebelum end date | Status Bahaya + recovery/close pocket |
| Sisa hari 0 | Pocket selesai/expired |
| Expense lebih besar dari budget | Allow, status Bahaya |
| User menghapus expense besar | Safe number recalculated |
| User mengubah tanggal HP | App tetap memakai tanggal lokal, beri toleransi |
| Browser storage penuh | Tampilkan error dan sarankan export |
| Incognito mode | Beri warning jika data mungkin tidak tersimpan |

---

## 13. User Acceptance Testing

### 13.1 Target UAT

Minimal 5 pengguna:

```text
Mahasiswa
Anak kos
Anak muda dengan uang mingguan/bulanan
```

### 13.2 UAT Tasks

```text
1. Buat pocket Rp300.000 untuk 7 hari.
2. Catat pengeluaran makan Rp15.000.
3. Cek berapa aman per hari setelah transaksi.
4. Edit transaksi menjadi Rp20.000.
5. Hapus transaksi.
6. Export data.
7. Install app ke home screen.
```

### 13.3 Success Criteria

| Criteria | Target |
|---|---:|
| User memahami safe-to-spend | ≥ 80% |
| User bisa buat pocket tanpa bantuan | ≥ 80% |
| User bisa catat expense <10 detik | ≥ 70% |
| User merasa tone tidak menghakimi | ≥ 80% |
| User mau mencoba selama 3 hari | ≥ 60% |

---

## 14. Bug Severity

| Severity | Definition | Example |
|---|---|---|
| Critical | App tidak bisa dipakai | Data hilang, app blank |
| High | Core feature gagal | Safe per day salah |
| Medium | Fitur penting terganggu | Export CSV gagal |
| Low | Minor UI issue | Spacing kurang rapi |

---

## 15. Definition of Done

Satu fitur dianggap selesai jika:

- [ ] Requirement terpenuhi.
- [ ] UI sesuai design system.
- [ ] Copy sesuai UX writing guide.
- [ ] Kalkulasi sudah diuji.
- [ ] Edge cases utama aman.
- [ ] Berfungsi di mobile 360px.
- [ ] Data tersimpan setelah refresh.
- [ ] Tidak merusak fitur lain.

---

## 16. Release Gate

SisaKu MVP boleh dirilis jika:

- [ ] Semua P0 test case lulus.
- [ ] Tidak ada bug Critical.
- [ ] Tidak ada bug High di budgeting calculation.
- [ ] PWA bisa diinstall.
- [ ] App bisa dibuka setelah offline.
- [ ] Data tersimpan setelah refresh/reopen.
- [ ] Safe number terlihat di Home.
- [ ] Export/reset data tersedia.

---

## 17. Sumber Rujukan

- MDN — Making PWAs installable: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- web.dev — Service workers: https://web.dev/learn/pwa/service-workers
- web.dev — Caching: https://web.dev/learn/pwa/caching
- Nielsen Norman Group — Design Systems 101: https://www.nngroup.com/articles/design-systems-101/

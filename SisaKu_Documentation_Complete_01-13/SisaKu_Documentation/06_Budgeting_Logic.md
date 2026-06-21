# Budgeting Logic — SisaKu

**Versi:** 1.0  
**Tanggal:** 2026-06-21  
**Produk:** SisaKu

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan logika kalkulasi utama SisaKu: budget pocket, safe-to-spend, status budget, dan recovery plan. Dokumen ini menjadi referensi untuk developer dan product designer agar kalkulasi selalu konsisten.

---

## 2. Konsep Utama

SisaKu dibangun berdasarkan rumus sederhana:

```text
safePerDay = remainingMoney / remainingDays
```

Produk ini mengubah pertanyaan “uangku tinggal berapa?” menjadi:

> “Dengan sisa uang dan sisa hari yang ada, hari ini aman pakai berapa?”

---

## 3. Entity Definition

## 3.1 Pocket

Pocket adalah budget berdasarkan nominal dan durasi.

Contoh:
- Uang Minggu Ini — Rp300.000 untuk 7 hari.
- Uang Makan — Rp150.000 untuk 5 hari.
- Budget Event — Rp100.000 untuk 2 hari.

### Pocket fields

```ts
type Pocket = {
  id: string;
  name: string;
  initialBudget: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```

---

## 3.2 Expense

Expense adalah catatan pengeluaran yang terhubung ke pocket.

```ts
type Expense = {
  id: string;
  pocketId: string;
  amount: number;
  category: string;
  title?: string;
  note?: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Date Logic

### 4.1 Total Days

```text
totalDays = differenceInDays(endDate, startDate) + 1
```

Kenapa +1?

Karena jika user membuat budget dari 21 Juni sampai 21 Juni, durasinya tetap 1 hari, bukan 0 hari.

### 4.2 Remaining Days

```text
remainingDays = differenceInDays(endDate, today) + 1
```

Jika today > endDate:

```text
remainingDays = 0
```

Jika today < startDate:

```text
remainingDays = totalDays
```

---

## 5. Spending Logic

### 5.1 Total Spent

```text
totalSpent = sum(expense.amount where expense.pocketId == pocket.id)
```

### 5.2 Spent Today

```text
spentToday = sum(expense.amount where expense.date == today and expense.pocketId == pocket.id)
```

### 5.3 Remaining Money

```text
remainingMoney = initialBudget - totalSpent
```

Jika remainingMoney < 0, tetap tampilkan angka negatif atau “melebihi budget”. Rekomendasi UI:

```text
Melebihi budget Rp12.000
```

---

## 6. Safe-to-Spend Logic

### 6.1 Initial Safe Per Day

```text
initialSafePerDay = initialBudget / totalDays
```

### 6.2 Current Safe Per Day

```text
if remainingDays > 0:
    safePerDay = remainingMoney / remainingDays
else:
    safePerDay = 0
```

### 6.3 Safe Per Day Display

Jika safePerDay > 0:

```text
Hari ini aman pakai RpX
```

Jika safePerDay == 0:

```text
Budget selesai / tidak ada sisa hari
```

Jika safePerDay < 0:

```text
Budget sudah lewat RpX
```

---

## 7. Budget Pace Logic

Budget pace membandingkan persentase uang yang sudah dipakai dengan persentase waktu yang sudah berjalan.

### 7.1 Percent Money Used

```text
moneyUsedPercent = totalSpent / initialBudget * 100
```

### 7.2 Percent Time Elapsed

```text
elapsedDays = differenceInDays(today, startDate) + 1
timeElapsedPercent = elapsedDays / totalDays * 100
```

### 7.3 Pace Difference

```text
paceDifference = moneyUsedPercent - timeElapsedPercent
```

Interpretasi:

| Kondisi | Artinya |
|---|---|
| paceDifference <= 0 | Uang dipakai lebih lambat dari waktu |
| paceDifference 1–15 | Sedikit lebih cepat |
| paceDifference > 15 | Pengeluaran jauh lebih cepat dari waktu |

---

## 8. Status Logic

### 8.1 Recommended MVP Status

```text
if remainingMoney <= 0:
    status = "Bahaya"
else if remainingDays <= 0:
    status = "Selesai"
else if safePerDay < initialSafePerDay * 0.5:
    status = "Bahaya"
else if safePerDay < initialSafePerDay * 0.8:
    status = "Waspada"
else:
    status = "Aman"
```

### 8.2 Alternative with Pace

```text
if remainingMoney <= 0:
    status = "Bahaya"
else if paceDifference > 25:
    status = "Bahaya"
else if paceDifference > 10:
    status = "Waspada"
else:
    status = "Aman"
```

### 8.3 Recommended Approach

Untuk MVP, gunakan kombinasi:

1. Remaining money.
2. Safe per day dibanding initial safe per day.
3. Pace difference sebagai indikator tambahan.

---

## 9. Recovery Plan Logic

Recovery plan dibuat saat user melewati batas harian atau status Waspada/Bahaya.

### 9.1 Overspent Today

```text
dailyOverspend = spentToday - initialSafePerDay
```

Jika dailyOverspend > 0:

```text
Hari ini lewat RpX.
```

### 9.2 Recovery Safe Per Day

```text
futureDays = remainingDays - 1
futureSafePerDay = remainingMoney / futureDays
```

Jika futureDays > 0:

```text
Agar tetap aman, jaga pengeluaran di bawah RpX/hari untuk sisa periode.
```

Jika futureDays <= 0:

```text
Periode budget berakhir hari ini.
```

### 9.3 Recovery Copy Rules

Jangan:
- “Kamu boros.”
- “Budget gagal.”
- “Pengeluaran buruk.”

Gunakan:
- “Masih bisa diperbaiki.”
- “Prioritaskan kebutuhan utama.”
- “Coba jaga di bawah RpX.”

---

## 10. Examples

### Example 1 — Budget normal

Input:
- Budget: Rp300.000
- Durasi: 7 hari
- Total spent: Rp60.000
- Sisa hari: 6

Calculation:

```text
remainingMoney = 300000 - 60000 = 240000
safePerDay = 240000 / 6 = 40000
```

Output:
> Sisa uang Rp240.000. Aman per hari Rp40.000.

---

### Example 2 — Waspada

Input:
- Budget: Rp300.000
- Durasi: 7 hari
- Initial safe/day: Rp42.857
- Remaining money: Rp120.000
- Remaining days: 5

```text
safePerDay = 120000 / 5 = 24000
```

Karena Rp24.000 < 80% dari Rp42.857, status Waspada atau Bahaya tergantung threshold final.

Output:
> Mulai mepet. Coba jaga pengeluaran di bawah Rp24.000/hari.

---

### Example 3 — Bahaya

Input:
- Budget: Rp100.000
- Spent: Rp120.000
- Remaining money: -Rp20.000

Output:
> Budget sudah lewat Rp20.000. Prioritaskan kebutuhan utama dulu.

---

## 11. Edge Cases

| Kasus | Handling |
|---|---|
| Budget 0 | Tidak boleh disimpan |
| Durasi 0 | Tidak boleh disimpan |
| Expense nominal 0 | Tidak boleh disimpan |
| Expense nominal negatif | Tidak boleh disimpan |
| Today setelah endDate | remainingDays = 0 |
| User edit tanggal transaksi | Recalculate pocket |
| User pindah transaksi ke pocket lain | Recalculate dua pocket |
| Budget sudah habis | Status Bahaya |
| Semua expense dihapus | Recalculate ke initial state |
| End date sebelum start date | Validasi error |

---

## 12. Formatting

### Rupiah

Gunakan format:

```js
new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
}).format(value)
```

### Date

Gunakan ISO string untuk storage:

```text
YYYY-MM-DD
```

Untuk UI, tampilkan:

```text
21 Jun 2026
Hari ini
Kemarin
```

---

## 13. Pseudocode

```ts
function calculatePocketSummary(pocket, expenses, today) {
  const totalDays = diffDays(pocket.endDate, pocket.startDate) + 1;
  const remainingDays = Math.max(diffDays(pocket.endDate, today) + 1, 0);

  const pocketExpenses = expenses.filter(e => e.pocketId === pocket.id);
  const totalSpent = pocketExpenses.reduce((sum, e) => sum + e.amount, 0);
  const spentToday = pocketExpenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const remainingMoney = pocket.initialBudget - totalSpent;
  const initialSafePerDay = pocket.initialBudget / totalDays;
  const safePerDay = remainingDays > 0 ? remainingMoney / remainingDays : 0;

  const status = getBudgetStatus({
    remainingMoney,
    remainingDays,
    safePerDay,
    initialSafePerDay,
  });

  return {
    totalDays,
    remainingDays,
    totalSpent,
    spentToday,
    remainingMoney,
    initialSafePerDay,
    safePerDay,
    status,
  };
}
```

---

## 14. Implementation Notes

- Semua kalkulasi harus diletakkan di utility/helper function, bukan langsung di komponen UI.
- Setiap perubahan expense harus memicu recalculation.
- Gunakan unit test untuk fungsi kalkulasi.
- Hindari floating display terlalu detail; bulatkan ke Rupiah penuh.
- Untuk internal calculation, tetap gunakan number.

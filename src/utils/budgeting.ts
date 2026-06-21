import type { BudgetStatus, Expense, Pocket, PocketSummary } from "../types";
import { formatRupiah, formatRupiahAbs } from "./currency";
import { diffDays, getTodayISO } from "./date";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getBudgetStatus(summary: Pick<PocketSummary, "remainingMoney" | "remainingDays" | "todayAllowance" | "initialSafePerDay" | "paceDifference">): BudgetStatus {
  if (summary.remainingMoney <= 0) {
    return "Bahaya";
  }

  if (summary.remainingDays <= 0) {
    return "Selesai";
  }

  if (summary.todayAllowance < summary.initialSafePerDay * 0.5 || summary.paceDifference > 25) {
    return "Bahaya";
  }

  if (summary.todayAllowance < summary.initialSafePerDay * 0.8 || summary.paceDifference > 10) {
    return "Waspada";
  }

  return "Aman";
}

export function getStatusMessage(status: BudgetStatus): string {
  if (status === "Aman") {
    return "Masih aman. Lanjutkan ritme ini.";
  }

  if (status === "Waspada") {
    return "Mulai mepet. Coba jaga pengeluaran hari ini.";
  }

  if (status === "Bahaya") {
    return "Uang mulai tipis. Prioritaskan kebutuhan utama dulu.";
  }

  return "Nice, budget ini sudah sampai akhir periode.";
}

function getPaceMessage(paceDifference: number): string {
  if (paceDifference <= 0) {
    return "Pengeluaranmu masih lebih pelan dari waktu.";
  }

  if (paceDifference <= 10) {
    return "Pengeluaran sedikit lebih cepat, tapi masih bisa dijaga.";
  }

  if (paceDifference <= 25) {
    return "Pengeluaran mulai lebih cepat dari waktu.";
  }

  return "Pengeluaran jauh lebih cepat dari waktu.";
}

function getRecoveryMessage(summary: Omit<PocketSummary, "status" | "statusMessage" | "paceMessage" | "recoveryMessage">): string | null {
  if (summary.remainingMoney <= 0) {
    return `Budget ini sudah lewat ${formatRupiahAbs(summary.remainingMoney)}. Tidak apa-apa, lanjut dari hari ini dan prioritaskan kebutuhan utama dulu.`;
  }

  if (summary.remainingDays <= 0) {
    return "Periode budget ini sudah selesai. Kamu bisa buat pocket baru untuk periode berikutnya.";
  }

  const dailyOverspend = summary.spentToday - summary.initialSafePerDay;
  const futureDays = summary.remainingDays - 1;

  if (dailyOverspend > 0 && futureDays > 0) {
    const futureSafePerDay = summary.remainingMoney / futureDays;
    return `Hari ini lewat ${formatRupiah(dailyOverspend)}. Masih bisa aman kalau ${futureDays} hari ke depan jaga di bawah ${formatRupiah(futureSafePerDay)}/hari.`;
  }

  if (summary.todayAllowance < summary.initialSafePerDay * 0.8 || summary.paceDifference > 10) {
    return `Mulai mepet. Coba jaga pengeluaran di bawah ${formatRupiah(summary.todayAllowance)}/hari untuk sisa periode.`;
  }

  return null;
}

export function calculatePocketSummary(pocket: Pocket, expenses: Expense[], todayISO = getTodayISO()): PocketSummary {
  const totalDays = Math.max(diffDays(pocket.endDate, pocket.startDate) + 1, 1);

  const isBeforeStart = diffDays(todayISO, pocket.startDate) < 0;
  const isAfterEnd = diffDays(todayISO, pocket.endDate) > 0;

  const remainingDays = isBeforeStart ? totalDays : isAfterEnd ? 0 : Math.max(diffDays(pocket.endDate, todayISO) + 1, 0);
  const elapsedDays = isBeforeStart ? 0 : isAfterEnd ? totalDays : clamp(diffDays(todayISO, pocket.startDate) + 1, 0, totalDays);

  const pocketExpenses = expenses.filter((expense) => expense.pocketId === pocket.id && !expense.deletedAt);
  const totalSpent = pocketExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const spentToday = pocketExpenses.filter((expense) => expense.date === todayISO).reduce((sum, expense) => sum + expense.amount, 0);
  const remainingMoney = pocket.totalBudget - totalSpent;
  const initialSafePerDay = pocket.totalBudget / totalDays;

  // New Safe-to-Spend Today Logic
  const todayAllowance = remainingDays > 0 ? (remainingMoney + spentToday) / remainingDays : 0;
  const safePerDay = remainingDays > 0 ? todayAllowance - spentToday : remainingMoney;

  const moneyUsedPercent = pocket.totalBudget > 0 ? clamp((totalSpent / pocket.totalBudget) * 100, 0, 999) : 0;
  const timeElapsedPercent = totalDays > 0 ? clamp((elapsedDays / totalDays) * 100, 0, 100) : 0;
  const paceDifference = moneyUsedPercent - timeElapsedPercent;

  const partialSummary = {
    totalDays,
    elapsedDays,
    remainingDays,
    totalSpent,
    spentToday,
    remainingMoney,
    initialSafePerDay,
    todayAllowance,
    safePerDay,
    moneyUsedPercent,
    timeElapsedPercent,
    paceDifference,
  };

  const status = getBudgetStatus({ ...partialSummary });

  return {
    ...partialSummary,
    status,
    statusMessage: getStatusMessage(status),
    paceMessage: getPaceMessage(paceDifference),
    recoveryMessage: getRecoveryMessage(partialSummary),
  };
}

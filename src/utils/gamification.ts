import type { Category, Expense, Pocket, PocketSummary } from "../types";
import { formatRupiah } from "./currency";
import { addDaysISO, diffDays, getTodayISO } from "./date";

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type GamificationStats = {
  level: number;
  xp: number;
  xpTarget: number;
  xpProgress: number;
  streakDays: number;
  missionTitle: string;
  missionBody: string;
  missionProgress: number;
  missionReward: number;
  badges: Badge[];
};

export function calculateStreak(expenseDates: string[]): number {
  if (expenseDates.length === 0) {
    return 0;
  }

  const uniqueDates = Array.from(new Set(expenseDates)).sort((a, b) => b.localeCompare(a));
  const today = getTodayISO();
  const yesterday = addDaysISO(today, -1);

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = uniqueDates[0];

  while (uniqueDates.includes(checkDate)) {
    streak++;
    checkDate = addDaysISO(checkDate, -1);
  }

  return streak;
}

export function getLevelInfo(totalXp: number) {
  let level = 1;
  let currentLevelXpStart = 0;
  let nextLevelXpStart = 200;

  while (totalXp >= nextLevelXpStart) {
    level++;
    currentLevelXpStart = nextLevelXpStart;
    const xpNeededForNext = 150 + level * 50;
    nextLevelXpStart = currentLevelXpStart + xpNeededForNext;
  }

  const xpInCurrentLevel = totalXp - currentLevelXpStart;
  const xpTargetForNextLevel = nextLevelXpStart - currentLevelXpStart;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpTargetForNextLevel) * 100));

  return {
    level,
    xpInCurrentLevel,
    xpTargetForNextLevel,
    progressPercent,
    currentLevelXpStart,
    nextLevelXpStart,
  };
}

export function getGamificationStats(
  expenses: Expense[],
  categories: Category[],
  summary: PocketSummary,
  pockets: Pocket[],
  activePocket: Pocket | null
): GamificationStats {
  const activeExpenses = expenses.filter((expense) => !expense.deletedAt);
  const txCount = activeExpenses.length;

  const baseTxXp = txCount * 20;

  const expenseDates = activeExpenses.map((expense) => expense.date);
  const streakDays = calculateStreak(expenseDates);
  let streakXp = streakDays * 15;
  if (streakDays >= 30) streakXp += 1000;
  else if (streakDays >= 14) streakXp += 350;
  else if (streakDays >= 7) streakXp += 150;
  else if (streakDays >= 3) streakXp += 50;

  let volumeXp = 0;
  if (txCount >= 50) volumeXp += 800;
  else if (txCount >= 30) volumeXp += 400;
  else if (txCount >= 15) volumeXp += 150;
  else if (txCount >= 5) volumeXp += 50;

  const smallTxCount = activeExpenses.filter((expense) => expense.amount <= 20000).length;
  const smallTxXp = smallTxCount * 10;

  let budgetPerformanceXp = 0;
  if (summary.status === "Aman") {
    budgetPerformanceXp += 120;
  } else if (summary.status === "Waspada") {
    budgetPerformanceXp += 60;
  }
  budgetPerformanceXp += Math.round(Math.max(summary.timeElapsedPercent, 0) * 2);

  if (activePocket && activePocket.totalBudget > 0) {
    const savingsPercent = Math.max(0, (summary.remainingMoney / activePocket.totalBudget) * 100);
    budgetPerformanceXp += Math.round(savingsPercent * 1.5);
  }

  const xp = baseTxXp + streakXp + volumeXp + smallTxXp + budgetPerformanceXp;
  const lvlInfo = getLevelInfo(xp);

  const categoryName = new Map(categories.map((category) => [category.id, category.name]));
  const countMatches = (needle: string) =>
    activeExpenses.filter((expense) => {
      const cat = (categoryName.get(expense.categoryId) ?? "").toLowerCase();
      const title = expense.title.toLowerCase();
      return cat.includes(needle) || title.includes(needle);
    }).length;

  const nightExpensesCount = activeExpenses.filter((expense) => {
    const dateObj = new Date(expense.createdAt);
    const hour = dateObj.getHours();
    return (hour >= 18 || hour < 6) && expense.amount <= 20000;
  }).length;

  const detailedNotesCount = activeExpenses.filter((expense) => expense.note && expense.note.trim().length > 0).length;

  const hasExtremeSaving = pockets.some((pocket) => {
    const pocketExpenses = activeExpenses.filter((expense) => expense.pocketId === pocket.id);
    const totalSpent = pocketExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = pocket.totalBudget - totalSpent;
    const totalDays = Math.max(1, diffDays(pocket.endDate, pocket.startDate) + 1);
    const elapsed = Math.max(0, Math.min(totalDays, diffDays(getTodayISO(), pocket.startDate) + 1));
    const timePercent = (elapsed / totalDays) * 100;
    return remaining >= pocket.totalBudget * 0.5 && timePercent > 80;
  });

  const badges: Badge[] = [
    {
      id: "starter",
      title: "Pemula Hemat",
      description: "Pocket pertama sudah dibuat. Ritme hematmu resmi dimulai.",
      icon: "\u2B50",
      unlocked: pockets.length > 0,
    },
    {
      id: "loyal_recorder",
      title: "Pencatat Setia",
      description: "Catat transaksi selama 3 hari berturut-turut.",
      icon: "\u{1F5D3}\uFE0F",
      unlocked: streakDays >= 3,
    },
    {
      id: "calm_pace",
      title: "Ritme Tenang",
      description: "Status tetap aman setelah lebih dari 30% periode berjalan.",
      icon: "\u{1F9D8}",
      unlocked: summary.status === "Aman" && summary.timeElapsedPercent > 30,
    },
    {
      id: "night_saving",
      title: "Malam Hemat",
      description: "Catat 3 pengeluaran kecil di malam hari tanpa kebablasan.",
      icon: "\u{1F319}",
      unlocked: nightExpensesCount >= 3,
    },
    {
      id: "pocket_collector",
      title: "Kolektor Pocket",
      description: "Punya 3 pocket terpisah untuk rencana yang berbeda.",
      icon: "\u{1F4BC}",
      unlocked: pockets.length >= 3,
    },
    {
      id: "discipline_master",
      title: "Master Disiplin",
      description: "Berhasil mencatat 15 pengeluaran.",
      icon: "\u{1F3C6}",
      unlocked: txCount >= 15,
    },
    {
      id: "coffee_lover",
      title: "Kopi Terkendali",
      description: "Catat 3 kopi atau minuman favorit tanpa lupa nominalnya.",
      icon: "\u2615",
      unlocked: countMatches("kopi") + countMatches("minum") + countMatches("coffee") >= 3,
    },
    {
      id: "culinary_soldier",
      title: "Makan Terpantau",
      description: "Catat 5 pengeluaran makanan agar pola jajan makin terbaca.",
      icon: "\u{1F35C}",
      unlocked: countMatches("makan") + countMatches("food") >= 5,
    },
    {
      id: "financial_detective",
      title: "Detektif Finansial",
      description: "Tambahkan detail pada 5 catatan pengeluaran.",
      icon: "\u{1F50D}",
      unlocked: detailedNotesCount >= 5,
    },
    {
      id: "waste_free",
      title: "Bebas Boros",
      description: "Sisa uang masih di atas 50% saat periode hampir selesai.",
      icon: "\u{1F6E1}\uFE0F",
      unlocked: hasExtremeSaving,
    },
  ];

  const dailyLimit = Math.max(summary.todayAllowance, summary.initialSafePerDay);
  const missionProgress = dailyLimit > 0 ? Math.min(100, Math.round((Math.max(dailyLimit - summary.spentToday, 0) / dailyLimit) * 100)) : 0;

  return {
    level: lvlInfo.level,
    xp,
    xpTarget: lvlInfo.nextLevelXpStart,
    xpProgress: lvlInfo.progressPercent,
    streakDays,
    missionTitle: summary.status === "Aman" ? "Jaga ritme hari ini" : "Pulihkan ritme hari ini",
    missionBody:
      summary.status === "Aman"
        ? `Usahakan tetap di bawah ${formatRupiah(Math.max(summary.safePerDay, 0))} hari ini.`
        : "Pilih kebutuhan utama dulu. Setelah kamu catat, Kiko hitung ulang batas amannya.",
    missionProgress,
    missionReward: summary.status === "Aman" ? 25 : 15,
    badges,
  };
}

import type { Category, Expense, Pocket, PocketSummary } from "../types";
import { formatRupiah } from "./currency";
import { addDaysISO, diffDays, getTodayISO } from "./date";

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
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

  if (activePocket && summary.totalAvailable > 0) {
    const savingsPercent = Math.max(0, (summary.remainingMoney / summary.totalAvailable) * 100);
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

  const coffeeCount = countMatches("kopi") + countMatches("minum") + countMatches("coffee");
  const foodCount = countMatches("makan") + countMatches("food");

  const badges: Badge[] = [
    {
      id: "starter",
      title: "Pecah Telur",
      description: "Pocket pertama sudah dibuat. Pola hematmu resmi dimulai.",
      icon: "\u2B50",
      unlocked: pockets.length > 0,
      progress: pockets.length > 0 ? 1 : 0,
      target: 1,
    },
    {
      id: "loyal_recorder",
      title: "Jalur Konsisten",
      description: "Catat transaksi selama 3 hari berturut-turut.",
      icon: "\u{1F5D3}\uFE0F",
      unlocked: streakDays >= 3,
      progress: Math.min(3, streakDays),
      target: 3,
    },
    {
      id: "calm_pace",
      title: "Pawang Budget",
      description: "Status tetap aman setelah lebih dari 30% periode berjalan.",
      icon: "\u{1F9D8}",
      unlocked: summary.status === "Aman" && summary.timeElapsedPercent > 30,
      progress: (summary.status === "Aman" && summary.timeElapsedPercent > 30) ? 1 : 0,
      target: 1,
    },
    {
      id: "night_saving",
      title: "Anti Laper Mata",
      description: "Catat 3 pengeluaran kecil (<= Rp20rb) di malam hari tanpa kebablasan.",
      icon: "\u{1F319}",
      unlocked: nightExpensesCount >= 3,
      progress: Math.min(3, nightExpensesCount),
      target: 3,
    },
    {
      id: "pocket_collector",
      title: "Jago Nge-Pos",
      description: "Membuat minimal 3 pocket terpisah untuk alokasi dana.",
      icon: "\u{1F4BC}",
      unlocked: pockets.length >= 3,
      progress: Math.min(3, pockets.length),
      target: 3,
    },
    {
      id: "discipline_master",
      title: "Rajin Pangkal Hemat",
      description: "Berhasil mencatat total 15 pengeluaran.",
      icon: "\u{1F3C6}",
      unlocked: txCount >= 15,
      progress: Math.min(15, txCount),
      target: 15,
    },
    {
      id: "coffee_lover",
      title: "Ngopi Senja",
      description: "Mencatat 3 pengeluaran kopi atau minuman favorit.",
      icon: "\u2615",
      unlocked: coffeeCount >= 3,
      progress: Math.min(3, coffeeCount),
      target: 3,
    },
    {
      id: "culinary_soldier",
      title: "Kenyang Terkendali",
      description: "Mencatat 5 pengeluaran makanan biar pola jajan makin terpantau.",
      icon: "\u{1F35C}",
      unlocked: foodCount >= 5,
      progress: Math.min(5, foodCount),
      target: 5,
    },
    {
      id: "financial_detective",
      title: "Si Paling Rinci",
      description: "Menambahkan detail catatan pada 5 pengeluaran.",
      icon: "\u{1F50D}",
      unlocked: detailedNotesCount >= 5,
      progress: Math.min(5, detailedNotesCount),
      target: 5,
    },
    {
      id: "waste_free",
      title: "Juara Bertahan",
      description: "Sisa uang masih di atas 50% saat periode pocket sudah lewat 80%.",
      icon: "\u{1F6E1}\uFE0F",
      unlocked: hasExtremeSaving,
      progress: hasExtremeSaving ? 1 : 0,
      target: 1,
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
    missionTitle: summary.status === "Aman" ? "Jaga batas aman" : "Pulihkan batas aman",
    missionBody:
      summary.status === "Aman"
        ? `Usahakan tetap di bawah ${formatRupiah(Math.max(summary.safePerDay, 0))} hari ini.`
        : "Pilih kebutuhan utama dulu. Setelah kamu catat, Kiko hitung ulang batas amannya.",
    missionProgress,
    missionReward: summary.status === "Aman" ? 25 : 15,
    badges,
  };
}

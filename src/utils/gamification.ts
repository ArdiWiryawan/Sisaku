import type { Category, Expense, Pocket, PocketSummary } from "../types";
import { formatRupiah } from "./currency";
import { addDaysISO, getTodayISO, diffDays } from "./date";

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
  if (expenseDates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(expenseDates)).sort((a, b) => b.localeCompare(a));
  const today = getTodayISO();
  const yesterday = addDaysISO(today, -1);

  // If latest expense date is older than yesterday, current streak is 0
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
  let nextLevelXpStart = 200; // Target to reach Level 2

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

  // 1. Volume XP (+20 XP per active record)
  const baseTxXp = txCount * 20;

  // 2. Frequency / Streak XP (+15 XP per streak day + milestone bonuses)
  const expenseDates = activeExpenses.map((e) => e.date);
  const streakDays = calculateStreak(expenseDates);
  let streakXp = streakDays * 15;
  if (streakDays >= 30) streakXp += 1000;
  else if (streakDays >= 14) streakXp += 350;
  else if (streakDays >= 7) streakXp += 150;
  else if (streakDays >= 3) streakXp += 50;

  // 3. Volume Milestones
  let volumeXp = 0;
  if (txCount >= 50) volumeXp += 800;
  else if (txCount >= 30) volumeXp += 400;
  else if (txCount >= 15) volumeXp += 150;
  else if (txCount >= 5) volumeXp += 50;

  // 4. Small Transaction Bonus (+10 XP per transaction <= Rp 20,000)
  const smallTxCount = activeExpenses.filter((e) => e.amount <= 20000).length;
  const smallTxXp = smallTxCount * 10;

  // 5. Budget Adherence / Savings Performance
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

  // Calculate total XP
  const xp = baseTxXp + streakXp + volumeXp + smallTxXp + budgetPerformanceXp;

  // Level info
  const lvlInfo = getLevelInfo(xp);

  // Badge Unlocks Checks
  const categoryName = new Map(categories.map((category) => [category.id, category.name]));
  const hasCategory = (needle: string) =>
    activeExpenses.some((expense) => (categoryName.get(expense.categoryId) ?? "").toLowerCase().includes(needle));

  const countMatches = (needle: string) =>
    activeExpenses.filter((expense) => {
      const cat = (categoryName.get(expense.categoryId) ?? "").toLowerCase();
      const title = expense.title.toLowerCase();
      return cat.includes(needle) || title.includes(needle);
    }).length;

  // Night Owl Check (18:00 - 06:00, <= Rp20.000)
  const nightExpensesCount = activeExpenses.filter((expense) => {
    const dateObj = new Date(expense.createdAt);
    const hour = dateObj.getHours();
    return (hour >= 18 || hour < 6) && expense.amount <= 20000;
  }).length;

  // Detailed note check
  const detailedNotesCount = activeExpenses.filter((e) => e.note && e.note.trim().length > 0).length;

  // Extreme Saving Check (remains > 50% budget when elapsed duration > 80%)
  const hasExtremeSaving = pockets.some((pocket) => {
    const pocketExpenses = activeExpenses.filter((e) => e.pocketId === pocket.id);
    const totalSpent = pocketExpenses.reduce((sum, e) => sum + e.amount, 0);
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
      description: "Membuat pocket pertamamu untuk mulai berhemat.",
      icon: "⭐",
      unlocked: pockets.length > 0,
    },
    {
      id: "loyal_recorder",
      title: "Pencatat Setia",
      description: "Mencatat transaksi selama 3 hari berturut-turut.",
      icon: "📅",
      unlocked: streakDays >= 3,
    },
    {
      id: "calm_pace",
      title: "Pace Tenang",
      description: "Menjaga ritme keuangan tetap 'Aman' di atas 30% hari.",
      icon: "🧘",
      unlocked: summary.status === "Aman" && summary.timeElapsedPercent > 30,
    },
    {
      id: "night_saving",
      title: "Malam Hemat",
      description: "Mencatat 3 pengeluaran kecil (<= Rp20rb) di malam hari (18:00 - 06:00).",
      icon: "🌙",
      unlocked: nightExpensesCount >= 3,
    },
    {
      id: "pocket_collector",
      title: "Kolektor Pocket",
      description: "Membuat minimal 3 pocket terpisah.",
      icon: "💼",
      unlocked: pockets.length >= 3,
    },
    {
      id: "discipline_master",
      title: "Master Disiplin",
      description: "Berhasil mencatat hingga 15 pengeluaran.",
      icon: "🏆",
      unlocked: txCount >= 15,
    },
    {
      id: "coffee_lover",
      title: "Pecinta Kopi",
      description: "Mencatat 3 pengeluaran kopi atau minuman favorit.",
      icon: "☕",
      unlocked: countMatches("kopi") + countMatches("minum") + countMatches("coffee") >= 3,
    },
    {
      id: "culinary_soldier",
      title: "Prajurit Kuliner",
      description: "Mencatat 5 pengeluaran makanan.",
      icon: "🍜",
      unlocked: countMatches("makan") + countMatches("food") >= 5,
    },
    {
      id: "financial_detective",
      title: "Detektif Finansial",
      description: "Menambahkan catatan detail pada 5 pengeluaran.",
      icon: "🔍",
      unlocked: detailedNotesCount >= 5,
    },
    {
      id: "waste_free",
      title: "Bebas Boros",
      description: "Menyisakan > 50% budget saat durasi pocket sudah lewat 80%.",
      icon: "🛡️",
      unlocked: hasExtremeSaving,
    },
  ];

  const dailyLimit = Math.max(summary.safePerDay + summary.spentToday, summary.initialSafePerDay);
  const missionProgress = dailyLimit > 0 ? Math.min(100, Math.round((Math.max(dailyLimit - summary.spentToday, 0) / dailyLimit) * 100)) : 0;

  return {
    level: lvlInfo.level,
    xp,
    xpTarget: lvlInfo.nextLevelXpStart,
    xpProgress: lvlInfo.progressPercent,
    streakDays,
    missionTitle: summary.status === "Aman" ? "Jaga ritme hari ini" : "Misi penyelamatan",
    missionBody:
      summary.status === "Aman"
        ? `Usahakan tetap di bawah ${formatRupiah(Math.max(summary.safePerDay, 0))} hari ini.`
        : "Pilih kebutuhan utama dulu. Kiko bantu hitung ulang setelah kamu catat.",
    missionProgress,
    missionReward: summary.status === "Aman" ? 25 : 15,
    badges,
  };
}

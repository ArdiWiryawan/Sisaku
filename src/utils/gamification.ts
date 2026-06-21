import type { Category, Expense, PocketSummary } from "../types";
import { formatRupiah } from "./currency";

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

export function getGamificationStats(expenses: Expense[], categories: Category[], summary: PocketSummary): GamificationStats {
  const activeExpenses = expenses.filter((expense) => !expense.deletedAt);
  const xp = activeExpenses.length * 35 + Math.round(Math.max(summary.timeElapsedPercent, 0) * 2) + (summary.status === "Aman" ? 120 : 40);
  const level = Math.max(1, Math.floor(xp / 260) + 1);
  const xpTarget = level * 260;
  const xpProgress = Math.min(100, Math.round(((xp % 260) / 260) * 100));
  const streakDays = Math.max(1, Math.min(summary.elapsedDays || 1, 7));
  const dailyLimit = Math.max(summary.safePerDay + summary.spentToday, summary.initialSafePerDay);
  const missionProgress = dailyLimit > 0 ? Math.min(100, Math.round((Math.max(dailyLimit - summary.spentToday, 0) / dailyLimit) * 100)) : 0;

  const categoryName = new Map(categories.map((category) => [category.id, category.name]));
  const hasCategory = (needle: string) =>
    activeExpenses.some((expense) => (categoryName.get(expense.categoryId) ?? "").toLowerCase().includes(needle));

  const badges: Badge[] = [
    {
      id: "coffee",
      title: "Hemat Kopi",
      description: "Catat minum atau kopi tanpa lepas kendali.",
      icon: "\u2615",
      unlocked: hasCategory("kopi") || hasCategory("minum"),
    },
    {
      id: "food",
      title: "Makan Aman",
      description: "Pengeluaran makan sudah masuk radar.",
      icon: "\u{1F35C}",
      unlocked: hasCategory("makan"),
    },
    {
      id: "transport",
      title: "Transport Terkendali",
      description: "Transport tidak lagi jadi tebakan.",
      icon: "\u{1F68C}",
      unlocked: hasCategory("transport"),
    },
    {
      id: "starter",
      title: "Pemula Hemat",
      description: "Pocket pertama sudah berjalan.",
      icon: "\u2B50",
      unlocked: true,
    },
  ];

  return {
    level,
    xp,
    xpTarget,
    xpProgress,
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

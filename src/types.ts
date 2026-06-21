export type BudgetStatus = "Aman" | "Waspada" | "Bahaya" | "Selesai";

export type AppTab = "home" | "pockets" | "history" | "settings";

export type PocketType = "general" | "food" | "transport" | "event" | "emergency";

export type Pocket = {
  id: string;
  name: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  type: PocketType;
  note: string;
};

export type Expense = {
  id: string;
  pocketId: string;
  amount: number;
  categoryId: string;
  title: string;
  date: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Category = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type QuickAddTemplate = {
  id: string;
  label: string;
  amount: number;
  categoryId: string;
  pocketId: string | null;
  isActive: boolean;
  createdAt: string;
};

export type AppSettings = {
  hasCompletedOnboarding: boolean;
  defaultPocketId: string | null;
  currency: "IDR";
  reminderEnabled: boolean;
  reminderTime: string | null;
  theme: "light" | "dark";
  lastOpenedAt: string | null;
  schemaVersion: number;
  userName?: string;
  userBio?: string;
};

export type PocketSummary = {
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  totalSpent: number;
  spentToday: number;
  remainingMoney: number;
  initialSafePerDay: number;
  todayAllowance: number;
  safePerDay: number;
  moneyUsedPercent: number;
  timeElapsedPercent: number;
  paceDifference: number;
  status: BudgetStatus;
  statusMessage: string;
  paceMessage: string;
  recoveryMessage: string | null;
};

export type PocketInput = {
  name: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  note: string;
  type: PocketType;
};

export type ExpenseInput = {
  pocketId: string;
  amount: number;
  categoryId: string;
  title: string;
  date: string;
  note: string;
};

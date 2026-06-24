import { DEFAULT_CATEGORIES, DEFAULT_QUICK_ADD_TEMPLATES, DEFAULT_SETTINGS } from "../data/defaults";
import type { AppSettings, Category, Expense, Income, Pocket, QuickAddTemplate } from "../types";

const STORAGE_KEYS = {
  pockets: "sisaku:pockets",
  expenses: "sisaku:expenses",
  incomes: "sisaku:incomes",
  categories: "sisaku:categories",
  quickAddTemplates: "sisaku:quickAddTemplates",
  settings: "sisaku:settings",
};

export type StoredAppState = {
  pockets: Pocket[];
  expenses: Expense[];
  incomes: Income[];
  categories: Category[];
  quickAddTemplates: QuickAddTemplate[];
  settings: AppSettings;
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadStoredState(): StoredAppState {
  return {
    pockets: readJSON<StoredAppState["pockets"]>(STORAGE_KEYS.pockets, []),
    expenses: readJSON<StoredAppState["expenses"]>(STORAGE_KEYS.expenses, []),
    incomes: readJSON<StoredAppState["incomes"]>(STORAGE_KEYS.incomes, []),
    categories: readJSON<StoredAppState["categories"]>(STORAGE_KEYS.categories, DEFAULT_CATEGORIES),
    quickAddTemplates: readJSON<StoredAppState["quickAddTemplates"]>(STORAGE_KEYS.quickAddTemplates, DEFAULT_QUICK_ADD_TEMPLATES),
    settings: {
      ...DEFAULT_SETTINGS,
      ...readJSON<Partial<AppSettings>>(STORAGE_KEYS.settings, {}),
    },
  };
}

export function saveStoredState(state: StoredAppState): void {
  writeJSON(STORAGE_KEYS.pockets, state.pockets);
  writeJSON(STORAGE_KEYS.expenses, state.expenses);
  writeJSON(STORAGE_KEYS.incomes, state.incomes);
  writeJSON(STORAGE_KEYS.categories, state.categories);
  writeJSON(STORAGE_KEYS.quickAddTemplates, state.quickAddTemplates);
  writeJSON(STORAGE_KEYS.settings, state.settings);
}

export function clearStoredState(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

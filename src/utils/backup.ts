import { CURRENT_SCHEMA_VERSION, DEFAULT_CATEGORIES, DEFAULT_QUICK_ADD_TEMPLATES, DEFAULT_SETTINGS } from "../data/defaults";
import type { AppSettings, Category, Expense, Income, Pocket, QuickAddTemplate } from "../types";

export type BackupPayload = {
  app: "SisaKu";
  exportedAt: string;
  schemaVersion: number;
  data: {
    pockets: Pocket[];
    expenses: Expense[];
    incomes: Income[];
    categories: Category[];
    quickAddTemplates: QuickAddTemplate[];
    settings: AppSettings;
  };
};

export function buildBackupJSON(data: BackupPayload["data"]): string {
  const payload: BackupPayload = {
    app: "SisaKu",
    exportedAt: new Date().toISOString(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    data,
  };

  return JSON.stringify(payload, null, 2);
}

export function downloadJSON(json: string, filename: string): void {
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function parseBackupJSON(raw: string): BackupPayload["data"] {
  const parsed = JSON.parse(raw) as Partial<BackupPayload>;

  if (parsed.app !== "SisaKu" || !parsed.data) {
    throw new Error("File backup tidak dikenali.");
  }

  const data = parsed.data;

  if (!Array.isArray(data.pockets) || !Array.isArray(data.expenses)) {
    throw new Error("File backup tidak lengkap.");
  }

  return {
    pockets: data.pockets,
    expenses: data.expenses,
    incomes: Array.isArray(data.incomes) ? data.incomes : [],
    categories: Array.isArray(data.categories) && data.categories.length ? data.categories : DEFAULT_CATEGORIES,
    quickAddTemplates: Array.isArray(data.quickAddTemplates) && data.quickAddTemplates.length ? data.quickAddTemplates : DEFAULT_QUICK_ADD_TEMPLATES,
    settings: {
      ...DEFAULT_SETTINGS,
      ...(data.settings ?? {}),
    },
  };
}

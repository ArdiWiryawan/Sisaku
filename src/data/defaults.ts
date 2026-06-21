import type { AppSettings, Category, QuickAddTemplate } from "../types";

export const APP_VERSION = "1.0.0";
export const CURRENT_SCHEMA_VERSION = 1;

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat_food", name: "Makan", isDefault: true },
  { id: "cat_drink", name: "Minum / Kopi", isDefault: true },
  { id: "cat_transport", name: "Transport", isDefault: true },
  { id: "cat_rent", name: "Kos", isDefault: true },
  { id: "cat_laundry", name: "Laundry", isDefault: true },
  { id: "cat_college", name: "Kuliah", isDefault: true },
  { id: "cat_print", name: "Print / Fotokopi", isDefault: true },
  { id: "cat_org", name: "Organisasi", isDefault: true },
  { id: "cat_fun", name: "Main / Hiburan", isDefault: true },
  { id: "cat_shopping", name: "Belanja", isDefault: true },
  { id: "cat_health", name: "Kesehatan", isDefault: true },
  { id: "cat_emergency", name: "Darurat", isDefault: true },
  { id: "cat_other", name: "Lainnya", isDefault: true },
];

export const DEFAULT_QUICK_ADD_TEMPLATES: QuickAddTemplate[] = [
  { id: "quick_food_15", label: "Makan 15K", amount: 15000, categoryId: "cat_food", pocketId: null, isActive: true, createdAt: "2026-06-21T00:00:00.000Z" },
  { id: "quick_coffee_12", label: "Kopi 12K", amount: 12000, categoryId: "cat_drink", pocketId: null, isActive: true, createdAt: "2026-06-21T00:00:00.000Z" },
  { id: "quick_transport_20", label: "Transport 20K", amount: 20000, categoryId: "cat_transport", pocketId: null, isActive: true, createdAt: "2026-06-21T00:00:00.000Z" },
  { id: "quick_print_5", label: "Print 5K", amount: 5000, categoryId: "cat_print", pocketId: null, isActive: true, createdAt: "2026-06-21T00:00:00.000Z" },
  { id: "quick_laundry_10", label: "Laundry 10K", amount: 10000, categoryId: "cat_laundry", pocketId: null, isActive: true, createdAt: "2026-06-21T00:00:00.000Z" },
];

export const DEFAULT_SETTINGS: AppSettings = {
  hasCompletedOnboarding: false,
  defaultPocketId: null,
  currency: "IDR",
  reminderEnabled: false,
  reminderTime: "21:00",
  theme: "light",
  lastOpenedAt: null,
  schemaVersion: CURRENT_SCHEMA_VERSION,
  userName: "Dika Pratama",
  userBio: "Anak hemat masa depan cerah ✨",
};

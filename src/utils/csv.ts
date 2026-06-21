import type { Category, Expense, Pocket } from "../types";

function escapeCSV(value: string | number): string {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function buildExpenseCSV(expenses: Expense[], pockets: Pocket[], categories: Category[]): string {
  const pocketById = new Map(pockets.map((pocket) => [pocket.id, pocket.name]));
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const rows = [
    ["Date", "Pocket", "Category", "Title", "Amount", "Note"],
    ...expenses
      .filter((expense) => !expense.deletedAt)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((expense) => [
        expense.date,
        pocketById.get(expense.pocketId) ?? "Pocket terhapus",
        categoryById.get(expense.categoryId) ?? "Lainnya",
        expense.title,
        expense.amount,
        expense.note,
      ]),
  ];

  return rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

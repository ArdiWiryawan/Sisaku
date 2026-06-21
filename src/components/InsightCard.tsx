import { Lightbulb } from "lucide-react";
import type { Category, Expense, PocketSummary } from "../types";
import { formatRupiah } from "../utils/currency";
import { getTodayISO, isDateInThisWeek } from "../utils/date";

type InsightCardProps = {
  expenses: Expense[];
  categories: Category[];
  summary: PocketSummary;
};

export function InsightCard({ expenses, categories, summary }: InsightCardProps) {
  const today = getTodayISO();
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const totals = new Map<string, number>();

  expenses.forEach((expense) => {
    totals.set(expense.categoryId, (totals.get(expense.categoryId) ?? 0) + expense.amount);
  });

  const biggest = [...totals.entries()].sort((a, b) => b[1] - a[1])[0];
  const todaySpent = expenses.filter((expense) => expense.date === today).reduce((sum, expense) => sum + expense.amount, 0);
  const weekSpent = expenses.filter((expense) => isDateInThisWeek(expense.date, today)).reduce((sum, expense) => sum + expense.amount, 0);

  const recommendation =
    summary.status === "Aman"
      ? "Batas amanmu terjaga. Terus catat pengeluaran kecil supaya batas harian tetap presisi."
      : summary.status === "Waspada"
        ? "Hari ini pilih yang paling penting dulu. Pengeluaran kecil tetap bisa bikin batas aman berubah."
        : "Jeda dulu pengeluaran tambahan. Pakai uang untuk kebutuhan utama terlebih dahulu.";

  return (
    <section className="card insight-card">
      <div className="card-header-row">
        <div>
          <p className="eyebrow">Pantauan Kiko</p>
          <h2>Pola belanjamu</h2>
        </div>
        <div className="icon-bubble primary">
          <Lightbulb size={20} aria-hidden="true" />
        </div>
      </div>
      <div className="insight-grid">
        <div>
          <span>Paling banyak</span>
          <strong>{biggest ? categoryById.get(biggest[0]) ?? "Lainnya" : "Belum ada"}</strong>
        </div>
        <div>
          <span>Hari ini</span>
          <strong>{formatRupiah(todaySpent)}</strong>
        </div>
        <div>
          <span>Minggu ini</span>
          <strong>{formatRupiah(weekSpent)}</strong>
        </div>
      </div>
      <p className="recommendation">{recommendation}</p>
    </section>
  );
}

import { Droplet, TrendingDown } from "lucide-react";
import type { Category, Expense } from "../types";
import { formatRupiah } from "../utils/currency";
import { getTodayISO, isDateInThisWeek } from "../utils/date";

type LeakInsightCardProps = {
  expenses: Expense[];
  categories: Category[];
};

type LeakGroup = {
  key: string;
  label: string;
  count: number;
  total: number;
};

export function LeakInsightCard({ expenses, categories }: LeakInsightCardProps) {
  const today = getTodayISO();
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const groups = new Map<string, LeakGroup>();

  expenses
    .filter((expense) => !expense.deletedAt)
    .filter((expense) => isDateInThisWeek(expense.date, today))
    .filter((expense) => expense.amount <= 25000)
    .forEach((expense) => {
      const label = (categoryById.get(expense.categoryId) ?? expense.title) || "Pengeluaran kecil";
      const current = groups.get(label) ?? { key: label, label, count: 0, total: 0 };
      groups.set(label, {
        ...current,
        count: current.count + 1,
        total: current.total + expense.amount,
      });
    });

  const strongest = [...groups.values()]
    .filter((group) => group.count >= 2)
    .sort((a, b) => b.count - a.count || b.total - a.total)[0];

  if (!strongest) {
    return (
      <section className="card leak-insight-card">
        <div className="card-header-row">
          <div>
            <p className="eyebrow">Bocor halus</p>
            <h2>Belum ada pola kecil</h2>
          </div>
          <div className="icon-bubble safe">
            <Droplet size={20} aria-hidden="true" />
          </div>
        </div>
        <p className="recommendation">Kiko belum melihat pengeluaran kecil yang berulang minggu ini. Terus catat yang kecil-kecil juga.</p>
      </section>
    );
  }

  return (
    <section className="card leak-insight-card">
      <div className="card-header-row">
        <div>
          <p className="eyebrow">Bocor halus</p>
          <h2>{strongest.label}</h2>
          <p className="leak-subtitle">Kecil-kecil, tapi mulai berulang minggu ini.</p>
        </div>
        <div className="icon-bubble warning">
          <Droplet size={20} aria-hidden="true" />
        </div>
      </div>
      <div className="leak-meter" aria-label={`${strongest.label} muncul ${strongest.count} kali dengan total ${formatRupiah(strongest.total)}`}>
        <div className="leak-meter-icon" aria-hidden="true">
          <TrendingDown size={20} />
        </div>
        <div className="leak-meter-copy">
          <span>{strongest.count}x muncul</span>
          <strong>{formatRupiah(strongest.total)}</strong>
        </div>
      </div>
      <p className="recommendation">Kecil-kecil, tapi sering muncul. Coba awasi ini dulu sebelum menambah aturan baru.</p>
    </section>
  );
}

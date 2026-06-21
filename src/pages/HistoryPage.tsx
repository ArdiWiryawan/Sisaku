import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { ExpenseItem } from "../components/ExpenseItem";
import type { Category, Expense, Pocket } from "../types";
import { formatDateLabel, getTodayISO, isDateInThisWeek } from "../utils/date";

type DateFilter = "all" | "today" | "week";

type HistoryPageProps = {
  expenses: Expense[];
  pockets: Pocket[];
  categories: Category[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
};

export function HistoryPage({ expenses, pockets, categories, onAddExpense, onEditExpense, onDeleteExpense }: HistoryPageProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [pocketFilter, setPocketFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const today = getTodayISO();
  const pocketById = new Map(pockets.map((pocket) => [pocket.id, pocket.name]));
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => !expense.deletedAt)
      .filter((expense) => {
        if (dateFilter === "today") {
          return expense.date === today;
        }

        if (dateFilter === "week") {
          return isDateInThisWeek(expense.date, today);
        }

        return true;
      })
      .filter((expense) => (pocketFilter === "all" ? true : expense.pocketId === pocketFilter))
      .filter((expense) => (categoryFilter === "all" ? true : expense.categoryId === categoryFilter))
      .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`));
  }, [categoryFilter, dateFilter, expenses, pocketFilter, today]);

  const grouped = filteredExpenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const label = formatDateLabel(expense.date, today);
    acc[label] = acc[label] ? [...acc[label], expense] : [expense];
    return acc;
  }, {});

  return (
    <div className="page history-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Riwayat</p>
          <h1>Lihat lagi ke mana uangmu pergi.</h1>
        </div>
        <button className="btn btn-primary" type="button" onClick={onAddExpense}>
          <Plus size={18} aria-hidden="true" />
          Catat baru
        </button>
      </section>

      <section className="card filter-card" aria-label="Filter riwayat">
        <div className="segmented-control">
          <button className={dateFilter === "all" ? "selected" : ""} type="button" onClick={() => setDateFilter("all")}>
            Semua
          </button>
          <button className={dateFilter === "today" ? "selected" : ""} type="button" onClick={() => setDateFilter("today")}>
            Hari ini
          </button>
          <button className={dateFilter === "week" ? "selected" : ""} type="button" onClick={() => setDateFilter("week")}>
            Minggu ini
          </button>
        </div>
        <div className="filter-row">
          <label>
            <span>Pocket</span>
            <select value={pocketFilter} onChange={(event) => setPocketFilter(event.target.value)}>
              <option value="all">Semua pocket</option>
              {pockets.map((pocket) => (
                <option key={pocket.id} value={pocket.id}>
                  {pocket.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Kategori</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">Semua kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {filteredExpenses.length ? (
        <section className="history-list" aria-label="Daftar riwayat">
          {Object.entries(grouped).map(([label, group]) => (
            <div className="history-group" key={label}>
              <h2>{label}</h2>
              <div className="expense-list">
                {group.map((expense) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    categoryName={categoryById.get(expense.categoryId) ?? "Lainnya"}
                    pocketName={pocketById.get(expense.pocketId) ?? "Pocket terhapus"}
                    onEdit={() => onEditExpense(expense)}
                    onDelete={() => onDeleteExpense(expense)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <EmptyState
          title={expenses.length ? "Belum ketemu catatan yang cocok" : "Belum ada pengeluaran"}
          body={expenses.length ? "Coba longgarkan filter tanggal, pocket, atau kategori." : "Catat transaksi pertama supaya SisaKu bisa membaca pola belanjamu."}
          actionLabel={expenses.length ? "Reset filter" : "Catat sekarang"}
          onAction={expenses.length ? () => { setDateFilter("all"); setPocketFilter("all"); setCategoryFilter("all"); } : onAddExpense}
        />
      )}
    </div>
  );
}

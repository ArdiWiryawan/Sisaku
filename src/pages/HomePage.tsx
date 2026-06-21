import { Plus } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { ExpenseItem } from "../components/ExpenseItem";
import { GamificationPanel } from "../components/GamificationPanel";
import { InsightCard } from "../components/InsightCard";
import { MascotCoach } from "../components/MascotCoach";
import { QuickAddChips } from "../components/QuickAddChips";
import { RecoveryBanner } from "../components/RecoveryBanner";
import { SafeNumberCard } from "../components/SafeNumberCard";
import type { Category, Expense, Pocket, QuickAddTemplate } from "../types";
import { calculatePocketSummary } from "../utils/budgeting";
import { formatRupiah } from "../utils/currency";
import { getGamificationStats } from "../utils/gamification";

type HomePageProps = {
  activePocket: Pocket | null;
  expenses: Expense[];
  categories: Category[];
  quickAddTemplates: QuickAddTemplate[];
  onAddExpense: () => void;
  onCreatePocket: () => void;
  onQuickAdd: (template: QuickAddTemplate) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
};

export function HomePage({ activePocket, expenses, categories, quickAddTemplates, onAddExpense, onCreatePocket, onQuickAdd, onEditExpense, onDeleteExpense }: HomePageProps) {
  if (!activePocket) {
    return (
      <div className="page narrow-page">
        <EmptyState
          title="Belum ada pocket"
          body="Buat pocket pertama untuk tahu batas aman harianmu."
          actionLabel="+ Buat Pocket"
          onAction={onCreatePocket}
        />
      </div>
    );
  }

  const activeExpenses = expenses.filter((expense) => expense.pocketId === activePocket.id && !expense.deletedAt);
  const summary = calculatePocketSummary(activePocket, expenses);
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const recentExpenses = [...activeExpenses].sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`)).slice(0, 5);
  const gameStats = getGamificationStats(activeExpenses, categories, summary);

  return (
    <div className="page dashboard-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Hai, pejuang hemat</p>
          <h1>Jaga uang saku bareng Kiko.</h1>
        </div>
        <button className="btn btn-primary" type="button" onClick={onAddExpense}>
          <Plus size={18} aria-hidden="true" />
          Catat Pengeluaran
        </button>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <SafeNumberCard pocket={activePocket} summary={summary} />

          <section className="summary-strip" aria-label="Ringkasan budget">
            <div>
              <span>Sisa uang</span>
              <strong>{formatRupiah(summary.remainingMoney)}</strong>
            </div>
            <div>
              <span>Sisa hari</span>
              <strong>{summary.remainingDays}</strong>
            </div>
            <div>
              <span>Pace</span>
              <strong>{summary.paceDifference <= 0 ? "Tenang" : "Cepat"}</strong>
            </div>
          </section>

          {summary.recoveryMessage ? <RecoveryBanner message={summary.recoveryMessage} /> : null}

          <QuickAddChips templates={quickAddTemplates} categories={categories} onSelect={onQuickAdd} />
          <GamificationPanel stats={gameStats} />
        </div>

        <aside className="dashboard-side">
          <InsightCard expenses={activeExpenses} categories={categories} summary={summary} />

          <section className="card recent-card">
            <div className="section-heading">
              <h2>Pengeluaran terbaru</h2>
              <span>{summary.paceMessage}</span>
            </div>
            {recentExpenses.length ? (
              <div className="expense-list compact-list">
                {recentExpenses.map((expense) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    categoryName={categoryById.get(expense.categoryId) ?? "Lainnya"}
                    pocketName={activePocket.name}
                    onEdit={() => onEditExpense(expense)}
                    onDelete={() => onDeleteExpense(expense)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Belum ada pengeluaran"
                body="Catat transaksi kecil pertamamu supaya batas aman lebih akurat."
                actionLabel="Catat Pengeluaran"
                onAction={onAddExpense}
              />
            )}
          </section>
          <MascotCoach summary={summary} />
        </aside>
      </div>
    </div>
  );
}

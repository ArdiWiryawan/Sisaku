import { Bell, Plus, ShieldCheck, Wallet } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { ExpenseItem } from "../components/ExpenseItem";
import { GamificationPanel } from "../components/GamificationPanel";
import { IncomeItem } from "../components/IncomeItem";
import { InsightCard } from "../components/InsightCard";
import { LeakInsightCard } from "../components/LeakInsightCard";
import { MascotCoach } from "../components/MascotCoach";
import { QuickAddChips } from "../components/QuickAddChips";
import { RecoveryBanner } from "../components/RecoveryBanner";
import { SafeNumberCard } from "../components/SafeNumberCard";
import type { Category, Expense, Income, Pocket, QuickAddTemplate } from "../types";
import { calculatePocketSummary } from "../utils/budgeting";
import { formatRupiah } from "../utils/currency";
import { getGamificationStats } from "../utils/gamification";

type HomePageProps = {
  activePocket: Pocket | null;
  expenses: Expense[];
  incomes: Income[];
  categories: Category[];
  pockets: Pocket[];
  quickAddTemplates: QuickAddTemplate[];
  userName?: string;
  onSetActivePocket: (id: string) => void;
  onAddExpense: () => void;
  onAddIncome: () => void;
  onCreatePocket: () => void;
  onQuickAdd: (template: QuickAddTemplate) => void;
  onSaveQuickAddTemplate: (input: Omit<QuickAddTemplate, "id" | "createdAt"> & { id?: string }) => void;
  onDeleteQuickAddTemplate: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  onDeleteIncome: (income: Income) => void;
};

export function HomePage({
  activePocket,
  expenses,
  incomes,
  categories,
  pockets,
  quickAddTemplates,
  userName = "Dika Pratama",
  onSetActivePocket,
  onAddExpense,
  onAddIncome,
  onCreatePocket,
  onQuickAdd,
  onSaveQuickAddTemplate,
  onDeleteQuickAddTemplate,
  onEditExpense,
  onDeleteExpense,
  onDeleteIncome,
}: HomePageProps) {
  if (!activePocket) {
    return (
      <div className="page narrow-page">
        <EmptyState
          title="Belum ada pocket"
          body="Buat rencana uang dulu. Setelah itu SisaKu akan hitung batas aman yang bisa kamu pakai setiap hari."
          actionLabel="+ Buat rencana"
          onAction={onCreatePocket}
        />
      </div>
    );
  }

  const activeExpenses = expenses.filter((expense) => expense.pocketId === activePocket.id && !expense.deletedAt);
  const activeIncomes = incomes.filter((income) => income.pocketId === activePocket.id && !income.deletedAt);
  const summary = calculatePocketSummary(activePocket, expenses, incomes);
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const recentEntries = [
    ...activeExpenses.map((expense) => ({ type: "expense" as const, date: expense.date, createdAt: expense.createdAt, item: expense })),
    ...activeIncomes.map((income) => ({ type: "income" as const, date: income.date, createdAt: income.createdAt, item: income })),
  ].sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`)).slice(0, 5);
  const gameStats = getGamificationStats(expenses.filter(e => !e.deletedAt), categories, summary, pockets, activePocket);

  // Dynamic values for the daily mission progress
  const missionTarget = Math.max(summary.todayAllowance, summary.initialSafePerDay);
  const missionProgressPercent = missionTarget > 0 ? Math.min(100, Math.round((summary.spentToday / missionTarget) * 100)) : 0;
  const isMissionCompleted = summary.spentToday <= missionTarget;

  return (
    <div className="page dashboard-page">
      {/* 1. Mockup Profile Header (Visible on Mobile) */}
      <header className="mobile-only-header">
        <div className="mobile-header-profile">
          <div className="mobile-avatar" aria-hidden="true">
            {userName.charAt(0)}
          </div>
          <div>
            <p className="mobile-greetings-eyebrow">Haiii, {userName.split(" ")[0]}! 👋</p>
          </div>
        </div>
        <div className="mobile-header-actions">
          <button
            className="mobile-header-catat-btn"
            type="button"
            onClick={onAddExpense}
            aria-label="Catat pengeluaran"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Catat</span>
          </button>
          <button
            className="mobile-notification-bell"
            type="button"
            aria-label="Notifikasi"
            onClick={() => alert("🔔 Kiko: Semua pemberitahuan budget terupdate otomatis di sini!")}
          >
            <Bell size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* 2. Mockup Active Pocket Selector */}
      <section className="mobile-pocket-selector" aria-label="Pemilih pocket aktif">
        <span className="pocket-sel-label">Rencana aktif</span>
        <div className="pocket-sel-pill">
          <Wallet size={14} className="pocket-sel-icon" aria-hidden="true" />
          <select
            value={activePocket.id}
            onChange={(e) => onSetActivePocket(e.target.value)}
            className="pocket-sel-select"
            aria-label="Pilih pocket aktif"
          >
            {pockets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <span className="pocket-sel-arrow" aria-hidden="true">▾</span>
        </div>
      </section>

      {/* Desktop traditional header */}
      <section className="page-header desktop-only-header">
        <div>
          <p className="eyebrow">Hai, pejuang hemat</p>
          <h1>Jaga uang saku bareng Kiko.</h1>
        </div>
        <button className="btn btn-primary" type="button" onClick={onAddExpense}>
          <Plus size={18} aria-hidden="true" />
          Catat pengeluaran
        </button>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Main Safe-To-Spend Card */}
          <SafeNumberCard pocket={activePocket} summary={summary} onAddIncome={onAddIncome} />

          {/* 3. Redesigned 2-column grid for Sisa Uang & Sisa Hari to match mockup */}
          <section className="summary-cards-grid" aria-label="Ringkasan keuangan">
            <div className="summary-card-item">
              <span className="summary-card-label">Sisa uang</span>
              <strong className="summary-card-value">{formatRupiah(summary.remainingMoney)}</strong>
            </div>
            <div className="summary-card-item">
              <span className="summary-card-label">Sisa hari</span>
              <strong className="summary-card-value">{summary.remainingDays} hari</strong>
            </div>
            <div className="summary-card-item">
              <span className="summary-card-label">Uang masuk</span>
              <strong className="summary-card-value">{formatRupiah(summary.totalIncome)}</strong>
            </div>
          </section>

          {summary.recoveryMessage ? <RecoveryBanner message={summary.recoveryMessage} /> : null}

          {/* Quick Add template section */}
          <QuickAddChips
            templates={quickAddTemplates}
            categories={categories}
            pockets={pockets}
            onSelect={onQuickAdd}
            onSaveTemplate={onSaveQuickAddTemplate}
            onDeleteTemplate={onDeleteQuickAddTemplate}
          />
          
          <GamificationPanel stats={gameStats} />
        </div>

        <aside className="dashboard-side">
          <InsightCard expenses={activeExpenses} categories={categories} summary={summary} />
          <LeakInsightCard expenses={activeExpenses} categories={categories} />

          {/* 4. Mockup dynamic mission card */}
          <section className="card mission-tracker-card">
            <div className="section-heading">
              <h2>Misi hari ini</h2>
            </div>
            <div className="mission-tracker-content">
              <div className="mission-tracker-info">
                <div className="mission-tracker-text">
                  <h3>
                    {summary.status === "Aman" ? "Jangan jajan di luar" : "Misi penyelamatan"}
                  </h3>
                  <p>
                    {isMissionCompleted 
                      ? `Kamu berhasil hemat! Batas belanja hari ini: ${formatRupiah(missionTarget)}` 
                      : `Kamu melebihi jatah harian sebesar ${formatRupiah(summary.spentToday - missionTarget)}`}
                  </p>
                </div>
                <span className="mission-tracker-reward">+{gameStats.missionReward} XP</span>
              </div>
              <div className="mission-tracker-progress-row">
                <div className="mission-progress-track">
                  <span 
                    className={`mission-progress-bar ${isMissionCompleted ? "green" : "red"}`}
                    style={{ width: `${missionProgressPercent}%` }} 
                  />
                </div>
                <span className="mission-progress-label">
                  {formatRupiah(summary.spentToday)} / {formatRupiah(missionTarget)}
                </span>
              </div>
            </div>
          </section>

          <section className="card recent-card">
            <div className="section-heading">
              <h2>Catatan terbaru</h2>
              <span>{summary.paceMessage}</span>
            </div>
            {recentEntries.length ? (
              <div className="expense-list compact-list">
                {recentEntries.map((entry) =>
                  entry.type === "expense" ? (
                    <ExpenseItem
                      key={entry.item.id}
                      expense={entry.item}
                      categoryName={categoryById.get(entry.item.categoryId) ?? "Lainnya"}
                      pocketName={activePocket.name}
                      onEdit={() => onEditExpense(entry.item)}
                      onDelete={() => onDeleteExpense(entry.item)}
                    />
                  ) : (
                    <IncomeItem
                      key={entry.item.id}
                      income={entry.item}
                      pocketName={activePocket.name}
                      onDelete={() => onDeleteIncome(entry.item)}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState
                title="Belum ada pengeluaran"
                body="Mulai dari transaksi kecil. Semakin rutin dicatat, semakin jujur batas amanmu."
                actionLabel="Catat sekarang"
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

import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { ExpenseForm } from "./components/ExpenseForm";
import { Modal } from "./components/Modal";
import { PocketForm } from "./components/PocketForm";
import { Toast } from "./components/Toast";
import { useLocalAppState } from "./hooks/useLocalAppState";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PocketsPage } from "./pages/PocketsPage";
import { SettingsPage } from "./pages/SettingsPage";
import type { AppTab, Expense, ExpenseInput, Pocket, PocketInput, QuickAddTemplate } from "./types";
import { calculatePocketSummary } from "./utils/budgeting";
import { buildExpenseCSV, downloadCSV } from "./utils/csv";
import { getTodayISO } from "./utils/date";
import { getGamificationStats } from "./utils/gamification";

type ExpenseModalState =
  | {
      mode: "create";
      preset?: QuickAddTemplate | null;
      expense?: null;
    }
  | {
      mode: "edit";
      preset?: null;
      expense: Expense;
    };

export default function App() {
  const store = useLocalAppState();
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [expenseModal, setExpenseModal] = useState<ExpenseModalState | null>(null);
  const [showCreatePocket, setShowCreatePocket] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(() => (typeof navigator === "undefined" ? false : !navigator.onLine));

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const root = document.documentElement;
    if (store.settings.theme === "dark") {
      root.classList.add("dark-theme");
    } else {
      root.classList.remove("dark-theme");
    }
  }, [store.settings.theme]);

  function handleCreatePocket(input: PocketInput) {
    const pocket = store.createPocket(input);
    store.setActivePocket(pocket.id);
    setShowCreatePocket(false);
    setActiveTab("home");
    setToast("Pocket siap. Batas aman harianmu sudah dihitung.");
  }

  function handleOnboardingPocket(input: PocketInput) {
    handleCreatePocket(input);
  }

  function handleDeletePocket(pocket: Pocket) {
    const confirmed = window.confirm(`Hapus pocket "${pocket.name}"? Semua catatan pengeluaran di pocket ini juga akan ikut terhapus.`);
    if (!confirmed) {
      return;
    }

    store.deletePocket(pocket.id);
    setToast("Pocket sudah dihapus.");
  }

  function handleSubmitExpense(input: ExpenseInput) {
    if (expenseModal?.mode === "edit" && expenseModal.expense) {
      store.updateExpense(expenseModal.expense.id, input);
      setToast("Catatan diperbarui. Batas amanmu ikut dihitung ulang.");
    } else {
      const activeExpensesBefore = store.expenses.filter((expense) => !expense.deletedAt);
      const summaryBefore = store.activePocket ? calculatePocketSummary(store.activePocket, store.expenses) : null;
      const oldStats = summaryBefore
        ? getGamificationStats(activeExpensesBefore, store.categories, summaryBefore, store.pockets, store.activePocket)
        : null;

      const newExpense = store.createExpense(input);

      if (oldStats && store.activePocket) {
        const nextExpenses = [...store.expenses, newExpense].filter((expense) => !expense.deletedAt);
        const summaryAfter = calculatePocketSummary(store.activePocket, nextExpenses);
        const newStats = getGamificationStats(nextExpenses, store.categories, summaryAfter, store.pockets, store.activePocket);

        if (newStats.level > oldStats.level) {
          setToast(`Level up! Kamu naik ke Level ${newStats.level}.`);
        } else {
          const oldUnlockedIds = new Set(oldStats.badges.filter((badge) => badge.unlocked).map((badge) => badge.id));
          const newUnlocked = newStats.badges.filter((badge) => badge.unlocked && !oldUnlockedIds.has(badge.id));
          if (newUnlocked.length > 0) {
            setToast(`Badge baru terbuka: ${newUnlocked[0].title}.`);
          } else {
            setToast("Tercatat. Batas aman harianmu sudah diperbarui.");
          }
        }
      } else {
        setToast("Tercatat. Batas aman harianmu sudah diperbarui.");
      }
    }

    setExpenseModal(null);
  }

  function handleDeleteExpense(expense: Expense) {
    const confirmed = window.confirm("Hapus catatan pengeluaran ini? Data yang dihapus tidak bisa dikembalikan.");
    if (!confirmed) {
      return;
    }

    store.deleteExpense(expense.id);
    setToast("Catatan dihapus. Sisa aman sudah dihitung ulang.");
  }

  function handleExportCSV() {
    const exportableExpenses = store.expenses.filter((expense) => !expense.deletedAt);

    if (!exportableExpenses.length) {
      setToast("Belum ada catatan untuk diunduh.");
      return;
    }

    const csv = buildExpenseCSV(exportableExpenses, store.pockets, store.categories);
    downloadCSV(csv, `sisaku-expenses-${getTodayISO()}.csv`);
    setToast("CSV siap diunduh.");
  }

  function handleResetData() {
    const confirmed = window.confirm("Reset akan menghapus semua data SisaKu dari perangkat ini. Tindakan ini tidak bisa dibatalkan.");
    if (!confirmed) {
      return;
    }

    store.resetAllData();
    setActiveTab("home");
    setToast("Data SisaKu sudah direset.");
  }

  if (!store.settings.hasCompletedOnboarding || !store.pockets.length) {
    return (
      <>
        <OnboardingPage onCreatePocket={handleOnboardingPocket} />
        <Toast message={toast} />
      </>
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      activePocket={store.activePocket}
      isOffline={isOffline}
      onChangeTab={setActiveTab}
      onAddExpense={() => setExpenseModal({ mode: "create", preset: null })}
    >
      {activeTab === "home" ? (
        <HomePage
          activePocket={store.activePocket}
          expenses={store.expenses}
          categories={store.categories}
          pockets={store.pockets}
          quickAddTemplates={store.quickAddTemplates}
          onAddExpense={() => setExpenseModal({ mode: "create", preset: null })}
          onCreatePocket={() => setShowCreatePocket(true)}
          onQuickAdd={(template) => setExpenseModal({ mode: "create", preset: template })}
          onEditExpense={(expense) => setExpenseModal({ mode: "edit", expense })}
          onDeleteExpense={handleDeleteExpense}
        />
      ) : null}

      {activeTab === "pockets" ? (
        <PocketsPage
          pockets={store.pockets}
          expenses={store.expenses}
          categories={store.categories}
          activePocketId={store.activePocketId}
          onCreatePocket={handleCreatePocket}
          onUpdatePocket={store.updatePocket}
          onDeletePocket={handleDeletePocket}
          onSetActivePocket={(id) => {
            store.setActivePocket(id);
            setToast("Pocket aktif sudah diganti.");
          }}
          onEditExpense={(expense) => setExpenseModal({ mode: "edit", expense })}
          onDeleteExpense={handleDeleteExpense}
        />
      ) : null}

      {activeTab === "history" ? (
        <HistoryPage
          expenses={store.expenses}
          pockets={store.pockets}
          categories={store.categories}
          onAddExpense={() => setExpenseModal({ mode: "create", preset: null })}
          onEditExpense={(expense) => setExpenseModal({ mode: "edit", expense })}
          onDeleteExpense={handleDeleteExpense}
        />
      ) : null}

      {activeTab === "settings" ? (
        <SettingsPage
          settings={store.settings}
          expenses={store.expenses}
          pockets={store.pockets}
          categories={store.categories}
          storageError={store.storageError}
          isOffline={isOffline}
          onUpdateSettings={store.updateSettings}
          onExportCSV={handleExportCSV}
          onResetData={handleResetData}
        />
      ) : null}

      <Modal
        title={expenseModal?.mode === "edit" ? "Edit catatan" : expenseModal?.preset ? "Cek catat cepat" : "Catat pengeluaran"}
        open={expenseModal !== null}
        onClose={() => setExpenseModal(null)}
      >
        <ExpenseForm
          pockets={store.pockets}
          categories={store.categories}
          activePocketId={store.activePocketId}
          initialExpense={expenseModal?.mode === "edit" ? expenseModal.expense : null}
          preset={expenseModal?.mode === "create" ? expenseModal.preset : null}
          submitLabel={expenseModal?.mode === "edit" ? "Simpan perubahan" : "Simpan catatan"}
          onSubmit={handleSubmitExpense}
          onCancel={() => setExpenseModal(null)}
        />
      </Modal>

      <Modal title="Buat pocket baru" open={showCreatePocket} onClose={() => setShowCreatePocket(false)}>
        <PocketForm submitLabel="Hitung batas aman" onSubmit={handleCreatePocket} onCancel={() => setShowCreatePocket(false)} />
      </Modal>

      <Toast message={toast} />
    </AppShell>
  );
}

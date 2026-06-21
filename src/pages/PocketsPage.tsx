import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { ExpenseItem } from "../components/ExpenseItem";
import { Modal } from "../components/Modal";
import { PocketCard } from "../components/PocketCard";
import { PocketForm } from "../components/PocketForm";
import { ProgressBars } from "../components/ProgressBars";
import { RecoveryBanner } from "../components/RecoveryBanner";
import { StatusPill } from "../components/StatusPill";
import type { Category, Expense, Pocket, PocketInput } from "../types";
import { calculatePocketSummary } from "../utils/budgeting";
import { formatRupiah } from "../utils/currency";
import { formatDateLabel } from "../utils/date";

type PocketsPageProps = {
  pockets: Pocket[];
  expenses: Expense[];
  categories: Category[];
  activePocketId: string | null;
  onCreatePocket: (input: PocketInput) => void;
  onUpdatePocket: (id: string, input: PocketInput) => void;
  onDeletePocket: (pocket: Pocket) => void;
  onSetActivePocket: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
};

export function PocketsPage({ pockets, expenses, categories, activePocketId, onCreatePocket, onUpdatePocket, onDeletePocket, onSetActivePocket, onEditExpense, onDeleteExpense }: PocketsPageProps) {
  const [selectedPocketId, setSelectedPocketId] = useState<string | null>(activePocketId ?? pockets[0]?.id ?? null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);

  useEffect(() => {
    if (!selectedPocketId && pockets.length) {
      setSelectedPocketId(activePocketId ?? pockets[0].id);
    }

    if (selectedPocketId && !pockets.some((pocket) => pocket.id === selectedPocketId)) {
      setSelectedPocketId(activePocketId ?? pockets[0]?.id ?? null);
    }
  }, [activePocketId, pockets, selectedPocketId]);

  const selectedPocket = useMemo(() => pockets.find((pocket) => pocket.id === selectedPocketId) ?? null, [pockets, selectedPocketId]);
  const selectedSummary = selectedPocket ? calculatePocketSummary(selectedPocket, expenses) : null;
  const selectedExpenses = selectedPocket
    ? expenses.filter((expense) => expense.pocketId === selectedPocket.id && !expense.deletedAt).sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))
    : [];
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));

  function handleSubmitPocket(input: PocketInput) {
    if (formMode === "edit" && selectedPocket) {
      onUpdatePocket(selectedPocket.id, input);
    } else {
      const pocketCountBefore = pockets.length;
      onCreatePocket(input);
      if (pocketCountBefore === 0) {
        setSelectedPocketId(null);
      }
    }

    setFormMode(null);
  }

  return (
    <div className="page pockets-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Pocket</p>
          <h1>Atur uang berdasarkan hari.</h1>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setFormMode("create")}>
          <Plus size={18} aria-hidden="true" />
          Buat Pocket
        </button>
      </section>

      {!pockets.length ? (
        <EmptyState
          title="Belum ada pocket"
          body="Buat pocket seperti Uang Minggu Ini atau Uang Makan."
          actionLabel="+ Buat Pocket"
          onAction={() => setFormMode("create")}
        />
      ) : (
        <div className="pockets-layout">
          <section className="pocket-list" aria-label="Daftar pocket">
            {pockets.map((pocket) => (
              <PocketCard
                key={pocket.id}
                pocket={pocket}
                summary={calculatePocketSummary(pocket, expenses)}
                isActive={pocket.id === activePocketId}
                onOpen={() => setSelectedPocketId(pocket.id)}
                onSetActive={() => onSetActivePocket(pocket.id)}
              />
            ))}
          </section>

          {selectedPocket && selectedSummary ? (
            <section className="card pocket-detail" aria-labelledby="pocket-detail-title">
              <div className="card-header-row">
                <div>
                  <p className="eyebrow">Detail pocket</p>
                  <h2 id="pocket-detail-title">{selectedPocket.name}</h2>
                </div>
                <StatusPill status={selectedSummary.status} />
              </div>

              <div className="detail-metrics">
                <div>
                  <span>Budget awal</span>
                  <strong>{formatRupiah(selectedPocket.totalBudget)}</strong>
                </div>
                <div>
                  <span>Total terpakai</span>
                  <strong>{formatRupiah(selectedSummary.totalSpent)}</strong>
                </div>
                <div>
                  <span>Sisa uang</span>
                  <strong>{formatRupiah(selectedSummary.remainingMoney)}</strong>
                </div>
                <div>
                  <span>Aman per hari</span>
                  <strong>{formatRupiah(selectedSummary.safePerDay)}</strong>
                </div>
              </div>

              <div className="detail-date">
                <CalendarDays size={18} aria-hidden="true" />
                <span>
                  {formatDateLabel(selectedPocket.startDate)} sampai {formatDateLabel(selectedPocket.endDate)} / {selectedSummary.remainingDays} hari tersisa
                </span>
              </div>

              <ProgressBars moneyUsedPercent={selectedSummary.moneyUsedPercent} timeElapsedPercent={selectedSummary.timeElapsedPercent} />
              {selectedSummary.recoveryMessage ? <RecoveryBanner message={selectedSummary.recoveryMessage} /> : null}

              <div className="card-actions strong-actions">
                <button className="btn btn-secondary" type="button" onClick={() => setFormMode("edit")}>
                  <Pencil size={16} aria-hidden="true" />
                  Edit Pocket
                </button>
                <button className="btn btn-danger" type="button" onClick={() => onDeletePocket(selectedPocket)}>
                  <Trash2 size={16} aria-hidden="true" />
                  Hapus
                </button>
              </div>

              <div className="section-heading with-top-border">
                <h3>Transaksi pocket</h3>
                <span>{selectedExpenses.length} transaksi</span>
              </div>
              {selectedExpenses.length ? (
                <div className="expense-list">
                  {selectedExpenses.slice(0, 8).map((expense) => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      categoryName={categoryById.get(expense.categoryId) ?? "Lainnya"}
                      pocketName={selectedPocket.name}
                      onEdit={() => onEditExpense(expense)}
                      onDelete={() => onDeleteExpense(expense)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState title="Belum ada pengeluaran" body="Transaksi yang masuk ke pocket ini akan muncul di sini." />
              )}
            </section>
          ) : null}
        </div>
      )}

      <Modal title={formMode === "edit" ? "Edit pocket" : "Buat pocket"} open={formMode !== null} onClose={() => setFormMode(null)}>
        <PocketForm
          initialPocket={formMode === "edit" ? selectedPocket : null}
          submitLabel={formMode === "edit" ? "Simpan Perubahan" : "Simpan Pocket"}
          onSubmit={handleSubmitPocket}
          onCancel={() => setFormMode(null)}
        />
      </Modal>
    </div>
  );
}

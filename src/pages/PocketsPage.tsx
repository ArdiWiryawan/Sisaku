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

export function PocketsPage({
  pockets,
  expenses,
  categories,
  activePocketId,
  onCreatePocket,
  onUpdatePocket,
  onDeletePocket,
  onSetActivePocket,
  onEditExpense,
  onDeleteExpense,
}: PocketsPageProps) {
  const [selectedPocketId, setSelectedPocketId] = useState<string | null>(activePocketId ?? pockets[0]?.id ?? null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

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
    ? expenses
        .filter((expense) => expense.pocketId === selectedPocket.id && !expense.deletedAt)
        .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))
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

  function handleOpenPocketCard(id: string) {
    setSelectedPocketId(id);
    setMobileDetailOpen(true);
  }

  function renderDetailContent() {
    if (!selectedPocket || !selectedSummary) return null;

    return (
      <div className="pocket-detail-inner-scroll">
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
            <span>Batas aman harian</span>
            <strong>{formatRupiah(selectedSummary.safePerDay)}</strong>
          </div>
        </div>

        <div className="detail-date">
          <CalendarDays size={18} aria-hidden="true" />
          <span>
            {formatDateLabel(selectedPocket.startDate)} sampai {formatDateLabel(selectedPocket.endDate)} / {selectedSummary.remainingDays} hari lagi
          </span>
        </div>

        <ProgressBars moneyUsedPercent={selectedSummary.moneyUsedPercent} timeElapsedPercent={selectedSummary.timeElapsedPercent} />
        {selectedSummary.recoveryMessage ? <RecoveryBanner message={selectedSummary.recoveryMessage} /> : null}

        <div className="card-actions strong-actions">
          <button className="btn btn-secondary" type="button" onClick={() => setFormMode("edit")}>
            <Pencil size={16} aria-hidden="true" />
            Edit pocket
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => {
              onDeletePocket(selectedPocket);
              setMobileDetailOpen(false);
            }}
          >
            <Trash2 size={16} aria-hidden="true" />
            Hapus
          </button>
        </div>

        <div className="section-heading with-top-border">
          <h3>Catatan di pocket ini</h3>
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
          <EmptyState title="Belum ada pengeluaran" body="Setelah kamu mencatat transaksi ke pocket ini, riwayatnya akan muncul di sini." />
        )}
      </div>
    );
  }

  return (
    <div className="page pockets-page">
      {/* Custom Mobile Header */}
      <section className="page-header mobile-header-pockets">
        <h1>Pocket</h1>
        <button
          className="mobile-header-plus-btn"
          type="button"
          onClick={() => setFormMode("create")}
          aria-label="Buat pocket baru"
        >
          <Plus size={20} aria-hidden="true" />
        </button>
      </section>

      {/* Desktop Page Header */}
      <section className="page-header desktop-only-header">
        <div>
          <p className="eyebrow">Pocket</p>
          <h1>Bagi uangmu jadi rencana yang jelas.</h1>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setFormMode("create")}>
          <Plus size={18} aria-hidden="true" />
          Buat pocket
        </button>
      </section>

      {!pockets.length ? (
        <EmptyState
          title="Belum ada pocket"
          body="Mulai dari pocket sederhana, misalnya uang minggu ini, uang makan, atau transport."
          actionLabel="+ Buat pocket"
          onAction={() => setFormMode("create")}
        />
      ) : (
        <div className="pockets-layout">
          <div className="pocket-list-wrap">
            <section className="pocket-list" aria-label="Daftar pocket">
              {pockets.map((pocket) => (
                <PocketCard
                  key={pocket.id}
                  pocket={pocket}
                  summary={calculatePocketSummary(pocket, expenses)}
                  isActive={pocket.id === activePocketId}
                  onOpen={() => handleOpenPocketCard(pocket.id)}
                  onSetActive={() => onSetActivePocket(pocket.id)}
                />
              ))}
            </section>

            {/* Mascot Coach Callout at bottom of list */}
            <div className="pocket-mascot-coach-callout">
              <img src="/assets/kiko-mascot.png" alt="Kiko" />
              <div className="pocket-mascot-bubble">
                <h3>Mau pocket barumu makin semangat?</h3>
                <p>Beri nama & target belanja yang jelas ya!</p>
              </div>
            </div>
          </div>

          {/* Desktop details card */}
          {selectedPocket && selectedSummary ? (
            <section className="card pocket-detail desktop-only-detail" aria-labelledby="pocket-detail-title">
              {renderDetailContent()}
            </section>
          ) : null}
        </div>
      )}

      {/* Mobile details Modal */}
      <Modal title="Detail Pocket" open={mobileDetailOpen} onClose={() => setMobileDetailOpen(false)}>
        <div className="mobile-detail-modal-wrap">
          {renderDetailContent()}
        </div>
      </Modal>

      <Modal title={formMode === "edit" ? "Edit pocket" : "Buat pocket baru"} open={formMode !== null} onClose={() => setFormMode(null)}>
        <PocketForm
          initialPocket={formMode === "edit" ? selectedPocket : null}
          submitLabel={formMode === "edit" ? "Simpan perubahan" : "Hitung batas aman"}
          onSubmit={handleSubmitPocket}
          onCancel={() => setFormMode(null)}
        />
      </Modal>
    </div>
  );
}

import { ArrowDownToLine, Trash2 } from "lucide-react";
import type { Income } from "../types";
import { formatRupiah } from "../utils/currency";
import { formatDateLabel } from "../utils/date";

type IncomeItemProps = {
  income: Income;
  pocketName: string;
  onDelete?: () => void;
};

export function IncomeItem({ income, pocketName, onDelete }: IncomeItemProps) {
  return (
    <article className="expense-item income-item">
      <div className="expense-main">
        <strong>{income.title || "Uang masuk"}</strong>
        <span>
          <ArrowDownToLine size={14} aria-hidden="true" /> {pocketName} / {formatDateLabel(income.date)}
        </span>
        {income.note ? <p>{income.note}</p> : null}
      </div>
      <div className="expense-side">
        <strong>+{formatRupiah(income.amount)}</strong>
        {onDelete ? (
          <div className="expense-actions">
            <button type="button" aria-label="Hapus uang masuk" onClick={onDelete}>
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

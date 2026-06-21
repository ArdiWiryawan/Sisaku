import { Pencil, Trash2 } from "lucide-react";
import type { Expense } from "../types";
import { formatRupiah } from "../utils/currency";
import { formatDateLabel } from "../utils/date";

type ExpenseItemProps = {
  expense: Expense;
  categoryName: string;
  pocketName: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function ExpenseItem({ expense, categoryName, pocketName, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <article className="expense-item">
      <div className="expense-main">
        <strong>{expense.title || categoryName}</strong>
        <span>
          {categoryName} / {pocketName} / {formatDateLabel(expense.date)}
        </span>
        {expense.note ? <p>{expense.note}</p> : null}
      </div>
      <div className="expense-side">
        <strong>{formatRupiah(expense.amount)}</strong>
        <div className="expense-actions">
          <button className="icon-button" type="button" aria-label="Edit pengeluaran" onClick={onEdit}>
            <Pencil size={16} aria-hidden="true" />
          </button>
          <button className="icon-button danger" type="button" aria-label="Hapus pengeluaran" onClick={onDelete}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

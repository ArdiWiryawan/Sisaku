import { useEffect, useState, type FormEvent } from "react";
import type { Category, Expense, ExpenseInput, Pocket, QuickAddTemplate } from "../types";
import { formatRupiah, parseMoneyInput } from "../utils/currency";
import { getTodayISO } from "../utils/date";

type ExpenseFormProps = {
  pockets: Pocket[];
  categories: Category[];
  activePocketId: string | null;
  initialExpense?: Expense | null;
  preset?: QuickAddTemplate | null;
  submitLabel: string;
  onSubmit: (input: ExpenseInput) => void;
  onCancel: () => void;
};

function presetTitle(template: QuickAddTemplate | null | undefined): string {
  if (!template) {
    return "";
  }

  return template.label.replace(/\s+\d+K$/i, "");
}

export function ExpenseForm({ pockets, categories, activePocketId, initialExpense, preset, submitLabel, onSubmit, onCancel }: ExpenseFormProps) {
  const [amount, setAmount] = useState(initialExpense ? String(initialExpense.amount) : preset ? String(preset.amount) : "");
  const [categoryId, setCategoryId] = useState(initialExpense?.categoryId ?? preset?.categoryId ?? categories[0]?.id ?? "");
  const [pocketId, setPocketId] = useState(initialExpense?.pocketId ?? preset?.pocketId ?? activePocketId ?? pockets[0]?.id ?? "");
  const [title, setTitle] = useState(initialExpense?.title ?? presetTitle(preset));
  const [date, setDate] = useState(initialExpense?.date ?? getTodayISO());
  const [note, setNote] = useState(initialExpense?.note ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAmount(initialExpense ? String(initialExpense.amount) : preset ? String(preset.amount) : "");
    setCategoryId(initialExpense?.categoryId ?? preset?.categoryId ?? categories[0]?.id ?? "");
    setPocketId(initialExpense?.pocketId ?? preset?.pocketId ?? activePocketId ?? pockets[0]?.id ?? "");
    setTitle(initialExpense?.title ?? presetTitle(preset));
    setDate(initialExpense?.date ?? getTodayISO());
    setNote(initialExpense?.note ?? "");
    setError(null);
  }, [activePocketId, categories, initialExpense, pockets, preset]);

  const parsedAmount = parseMoneyInput(amount);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (parsedAmount <= 0) {
      setError("Nominal harus lebih dari Rp0.");
      return;
    }

    if (!categoryId) {
      setError("Pilih kategori pengeluaran.");
      return;
    }

    if (!pocketId) {
      setError("Pilih pocket untuk pengeluaran ini.");
      return;
    }

    onSubmit({
      amount: parsedAmount,
      categoryId,
      pocketId,
      title: title.trim(),
      date,
      note: note.trim(),
    });
  }

  if (!pockets.length) {
    return (
      <div className="empty-state compact">
        <h2>Belum ada pocket</h2>
        <p>Buat pocket dulu supaya pengeluaran punya tempat.</p>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Tutup
        </button>
      </div>
    );
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="field hero-input">
        <label htmlFor="expense-amount">Keluar berapa?</label>
        <input
          id="expense-amount"
          autoFocus
          inputMode="numeric"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Contoh: 15000"
        />
        <span>{parsedAmount > 0 ? formatRupiah(parsedAmount) : "Masukkan nominal"}</span>
      </div>

      <fieldset className="field fieldset">
        <legend>Untuk apa?</legend>
        <div className="category-grid">
          {categories.map((category) => {
            const iconByCategory = new Map([
              ["cat_food", "\u{1F35C}"],
              ["cat_drink", "\u2615"],
              ["cat_transport", "\u{1F68C}"],
              ["cat_print", "\u{1F5A8}\uFE0F"],
              ["cat_laundry", "\u{1F9FA}"],
            ]);
            return (
              <button
                className={categoryId === category.id ? "selected" : ""}
                key={category.id}
                type="button"
                onClick={() => setCategoryId(category.id)}
              >
                <span style={{ marginRight: "6px" }} aria-hidden="true">
                  {iconByCategory.get(category.id) ?? "\u2728"}
                </span>
                {category.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="expense-pocket">Masuk ke pocket mana?</label>
        <select id="expense-pocket" value={pocketId} onChange={(event) => setPocketId(event.target.value)}>
          {pockets.map((pocket) => (
            <option key={pocket.id} value={pocket.id}>
              {pocket.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-grid-two">
        <div className="field">
          <label htmlFor="expense-title">Nama transaksi opsional</label>
          <input id="expense-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Ayam geprek" />
        </div>
        <div className="field">
          <label htmlFor="expense-date">Tanggal</label>
          <input id="expense-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="expense-note">Catatan opsional</label>
        <textarea id="expense-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Contoh: makan siang" />
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="form-actions">
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Batal
        </button>
        <button className="btn btn-primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

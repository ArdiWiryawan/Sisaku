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
      setError("Masukkan nominal yang lebih dari Rp0.");
      return;
    }

    if (!categoryId) {
      setError("Pilih kategori supaya catatanmu rapi.");
      return;
    }

    if (!pocketId) {
      setError("Pilih pocket tempat pengeluaran ini dicatat.");
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
        <p>Buat pocket dulu agar setiap pengeluaran punya tujuan yang jelas.</p>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Tutup
        </button>
      </div>
    );
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="field hero-input">
        <label htmlFor="expense-amount">Nominal pengeluaran</label>
        <input
          id="expense-amount"
          autoFocus
          inputMode="numeric"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Misal: 15000"
        />
        <span>{parsedAmount > 0 ? formatRupiah(parsedAmount) : "Tulis angka tanpa titik juga boleh"}</span>
      </div>

      <fieldset className="field fieldset">
        <legend>Dipakai untuk apa?</legend>
        <div className="category-grid">
          {categories.map((category) => {
            const iconByCategory = new Map([
              ["cat_food", "\u{1F35C}"], // 🍜
              ["cat_drink", "\u2615"], // ☕
              ["cat_transport", "\u{1F68C}"], // 🚍
              ["cat_rent", "\u{1F3E0}"], // 🏠
              ["cat_laundry", "\u{1F9FA}"], // 🧺
              ["cat_college", "\u{1F4D6}"], // 📖
              ["cat_print", "\u{1F5A8}\uFE0F"], // 🖨️
              ["cat_org", "\u{1F465}"], // 👥
              ["cat_fun", "\u{1F3AE}"], // 🎮
              ["cat_shopping", "\u{1F6CD}"], // 🛍️
              ["cat_health", "\u{1F48A}"], // 💊
              ["cat_emergency", "\u{1F6E1}"], // 🛡️
              ["cat_other", "\u{1F4AC}"], // 💬
            ]);
            return (
              <button
                className={categoryId === category.id ? "selected" : ""}
                key={category.id}
                type="button"
                onClick={() => setCategoryId(category.id)}
              >
                <span className="category-emoji" aria-hidden="true">
                  {iconByCategory.get(category.id) ?? "\u2728"}
                </span>
                {category.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="expense-pocket">Catat ke pocket</label>
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
          <label htmlFor="expense-title">Nama transaksi</label>
          <input id="expense-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Misal: Ayam geprek" />
        </div>
        <div className="field">
          <label htmlFor="expense-date">Tanggal</label>
          <input id="expense-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="expense-note">Catatan tambahan</label>
        <textarea id="expense-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Misal: makan siang setelah kelas" />
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

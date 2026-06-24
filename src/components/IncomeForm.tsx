import { useEffect, useState, type FormEvent } from "react";
import type { Income, IncomeInput, Pocket } from "../types";
import { formatRupiah, parseMoneyInput } from "../utils/currency";
import { getTodayISO } from "../utils/date";

type IncomeFormProps = {
  pockets: Pocket[];
  activePocketId: string | null;
  initialIncome?: Income | null;
  submitLabel: string;
  onSubmit: (input: IncomeInput) => void;
  onCancel: () => void;
};

export function IncomeForm({ pockets, activePocketId, initialIncome, submitLabel, onSubmit, onCancel }: IncomeFormProps) {
  const [amount, setAmount] = useState(initialIncome ? String(initialIncome.amount) : "");
  const [pocketId, setPocketId] = useState(initialIncome?.pocketId ?? activePocketId ?? pockets[0]?.id ?? "");
  const [title, setTitle] = useState(initialIncome?.title ?? "Uang masuk");
  const [date, setDate] = useState(initialIncome?.date ?? getTodayISO());
  const [note, setNote] = useState(initialIncome?.note ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAmount(initialIncome ? String(initialIncome.amount) : "");
    setPocketId(initialIncome?.pocketId ?? activePocketId ?? pockets[0]?.id ?? "");
    setTitle(initialIncome?.title ?? "Uang masuk");
    setDate(initialIncome?.date ?? getTodayISO());
    setNote(initialIncome?.note ?? "");
    setError(null);
  }, [activePocketId, initialIncome, pockets]);

  const parsedAmount = parseMoneyInput(amount);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (parsedAmount <= 0) {
      setError("Masukkan nominal uang masuk yang lebih dari Rp0.");
      return;
    }

    if (!pocketId) {
      setError("Pilih rencana uang tempat tambahan ini dicatat.");
      return;
    }

    onSubmit({
      pocketId,
      amount: parsedAmount,
      title: title.trim() || "Uang masuk",
      date,
      note: note.trim(),
    });
  }

  if (!pockets.length) {
    return (
      <div className="empty-state compact">
        <h2>Belum ada rencana uang</h2>
        <p>Buat rencana uang dulu agar uang masuk punya tempat.</p>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Tutup
        </button>
      </div>
    );
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="field hero-input">
        <label htmlFor="income-amount">Nominal uang masuk</label>
        <input
          id="income-amount"
          autoFocus
          inputMode="numeric"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Misal: 100000"
        />
        <span>{parsedAmount > 0 ? formatRupiah(parsedAmount) : "Tulis angka tanpa titik juga boleh"}</span>
      </div>

      <div className="field">
        <label htmlFor="income-title">Sumber uang</label>
        <select id="income-title" value={title} onChange={(event) => setTitle(event.target.value)}>
          <option value="Kiriman">Kiriman</option>
          <option value="Cashback">Cashback</option>
          <option value="Refund">Refund</option>
          <option value="Bonus">Bonus</option>
          <option value="Uang masuk">Lainnya</option>
        </select>
      </div>

      <div className="form-grid-two">
        <div className="field">
          <label htmlFor="income-pocket">Masukkan ke rencana</label>
          <select id="income-pocket" value={pocketId} onChange={(event) => setPocketId(event.target.value)}>
            {pockets.map((pocket) => (
              <option key={pocket.id} value={pocket.id}>
                {pocket.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="income-date">Tanggal</label>
          <input id="income-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="income-note">Catatan tambahan</label>
        <textarea id="income-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Misal: kiriman orang tua" />
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

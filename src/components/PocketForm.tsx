import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Pocket, PocketInput, PocketType } from "../types";
import { formatRupiah, parseMoneyInput } from "../utils/currency";
import { diffDays, getEndDateFromDuration, getTodayISO } from "../utils/date";

type PocketFormProps = {
  initialPocket?: Pocket | null;
  submitLabel: string;
  onSubmit: (input: PocketInput) => void;
  onCancel?: () => void;
};

export function PocketForm({ initialPocket, submitLabel, onSubmit, onCancel }: PocketFormProps) {
  const today = getTodayISO();
  const [name, setName] = useState(initialPocket?.name ?? "Uang Minggu Ini");
  const [budget, setBudget] = useState(initialPocket ? String(initialPocket.totalBudget) : "");
  const [startDate, setStartDate] = useState(initialPocket?.startDate ?? today);
  const [dateMode, setDateMode] = useState<"duration" | "endDate">(initialPocket ? "endDate" : "duration");
  const [durationDays, setDurationDays] = useState("7");
  const [endDate, setEndDate] = useState(initialPocket?.endDate ?? getEndDateFromDuration(today, 7));
  const [type, setType] = useState<PocketType>(initialPocket?.type ?? "general");
  const [note, setNote] = useState(initialPocket?.note ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPocket) {
      return;
    }

    setName(initialPocket.name);
    setBudget(String(initialPocket.totalBudget));
    setStartDate(initialPocket.startDate);
    setDateMode("endDate");
    setDurationDays(String(Math.max(diffDays(initialPocket.endDate, initialPocket.startDate) + 1, 1)));
    setEndDate(initialPocket.endDate);
    setType(initialPocket.type);
    setNote(initialPocket.note);
  }, [initialPocket]);

  const totalBudget = parseMoneyInput(budget);
  const effectiveEndDate = dateMode === "duration" ? getEndDateFromDuration(startDate, Number(durationDays || 1)) : endDate;
  const totalDays = useMemo(() => Math.max(diffDays(effectiveEndDate, startDate) + 1, 0), [effectiveEndDate, startDate]);
  const previewSafe = totalBudget > 0 && totalDays > 0 ? totalBudget / totalDays : 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Beri nama pocket agar mudah dikenali.");
      return;
    }

    if (totalBudget <= 0) {
      setError("Masukkan jumlah uang yang lebih dari Rp0.");
      return;
    }

    if (totalDays <= 0) {
      setError("Tanggal akhir harus setelah tanggal mulai.");
      return;
    }

    onSubmit({
      name: name.trim(),
      totalBudget,
      startDate,
      endDate: effectiveEndDate,
      note: note.trim(),
      type,
    });
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="pocket-name">Nama pocket</label>
        <input id="pocket-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Misal: Uang Minggu Ini" />
      </div>

      <div className="field">
        <label htmlFor="pocket-budget">Total uang yang tersedia</label>
        <input
          id="pocket-budget"
          inputMode="numeric"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          placeholder="Misal: 300000"
        />
      </div>

      <div className="field">
        <label htmlFor="pocket-start">Tanggal mulai</label>
        <input id="pocket-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
      </div>

      <fieldset className="field fieldset">
        <legend>Target cukup sampai kapan?</legend>
        <div className="segmented-control">
          <button className={dateMode === "duration" ? "selected" : ""} type="button" onClick={() => setDateMode("duration")}>
            Pakai jumlah hari
          </button>
          <button className={dateMode === "endDate" ? "selected" : ""} type="button" onClick={() => setDateMode("endDate")}>
            Pilih tanggal akhir
          </button>
        </div>
      </fieldset>

      {dateMode === "duration" ? (
        <div className="field">
          <label htmlFor="pocket-duration">Berapa hari?</label>
          <input
            id="pocket-duration"
            type="number"
            min="1"
            value={durationDays}
            onChange={(event) => setDurationDays(event.target.value)}
          />
        </div>
      ) : (
        <div className="field">
          <label htmlFor="pocket-end">Tanggal akhir</label>
          <input id="pocket-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </div>
      )}

      <div className="field">
        <label htmlFor="pocket-type">Tujuan pocket</label>
        <select id="pocket-type" value={type} onChange={(event) => setType(event.target.value as PocketType)}>
          <option value="general">Kebutuhan umum</option>
          <option value="food">Uang makan</option>
          <option value="transport">Transport</option>
          <option value="event">Acara / rencana</option>
          <option value="emergency">Darurat</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="pocket-note">Catatan tambahan</label>
        <textarea id="pocket-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Misal: uang sampai kiriman berikutnya" />
      </div>

      <div className="form-preview" aria-live="polite">
        <span>Perkiraan aman per hari</span>
        <strong>{previewSafe > 0 ? formatRupiah(previewSafe) : "Isi nominal dan durasi dulu"}</strong>
        {totalDays > 0 ? <small>{totalDays} hari, sampai {effectiveEndDate}</small> : null}
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="form-actions">
        {onCancel ? (
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Batal
          </button>
        ) : null}
        <button className="btn btn-primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

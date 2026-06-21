import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Pocket, PocketSummary } from "../types";
import { formatRupiah } from "../utils/currency";
import { ProgressBars } from "./ProgressBars";
import { StatusPill } from "./StatusPill";

type PocketCardProps = {
  pocket: Pocket;
  summary: PocketSummary;
  isActive: boolean;
  onOpen: () => void;
  onSetActive: () => void;
};

export function PocketCard({ pocket, summary, isActive, onOpen, onSetActive }: PocketCardProps) {
  return (
    <article className={`card pocket-card ${isActive ? "active-card" : ""}`}>
      <div className="card-header-row">
        <div>
          <p className="eyebrow">{isActive ? "Pocket aktif" : "Pocket"}</p>
          <h3>{pocket.name}</h3>
        </div>
        <StatusPill status={summary.status} />
      </div>

      <div className="pocket-values">
        <div>
          <span>Sisa uang</span>
          <strong>{formatRupiah(summary.remainingMoney)}</strong>
        </div>
        <div>
          <span>Aman per hari</span>
          <strong>{formatRupiah(summary.safePerDay)}</strong>
        </div>
        <div>
          <span>Sisa hari</span>
          <strong>{summary.remainingDays}</strong>
        </div>
      </div>

      <ProgressBars moneyUsedPercent={summary.moneyUsedPercent} timeElapsedPercent={summary.timeElapsedPercent} />

      <div className="card-actions">
        <button className="btn btn-ghost" type="button" onClick={onOpen}>
          Detail
          <ArrowRight size={16} aria-hidden="true" />
        </button>
        <button className="btn btn-secondary" type="button" onClick={onSetActive} disabled={isActive}>
          <CheckCircle2 size={16} aria-hidden="true" />
          {isActive ? "Aktif" : "Jadikan aktif"}
        </button>
      </div>
    </article>
  );
}

import { ShieldCheck, Wallet } from "lucide-react";
import type { Pocket, PocketSummary } from "../types";
import { formatRupiah, formatRupiahAbs } from "../utils/currency";
import { formatDateLabel } from "../utils/date";
import { StatusPill } from "./StatusPill";

type SafeNumberCardProps = {
  pocket: Pocket;
  summary: PocketSummary;
};

export function SafeNumberCard({ pocket, summary }: SafeNumberCardProps) {
  const safeLabel =
    summary.safePerDay > 0
      ? formatRupiah(summary.safePerDay)
      : summary.remainingMoney < 0
        ? `Lewat ${formatRupiahAbs(summary.remainingMoney)}`
        : "Rp0";
  const statusLabel = summary.status === "Aman" ? "Masih aman" : summary.statusMessage;

  return (
    <section className={`safe-card status-ring-${summary.status.toLowerCase()}`} aria-labelledby="safe-title">
      <div className="safe-content">
        <div className="safe-card-topline">
          <div className="safe-pocket">
            <Wallet size={18} aria-hidden="true" />
            <span>{pocket.name}</span>
          </div>
          <StatusPill status={summary.status} />
        </div>
        <p className="safe-label" id="safe-title">
          Hari ini aman pakai
        </p>
        <strong className="safe-amount">{safeLabel}</strong>
        <div className="safe-status-chip">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>{statusLabel}</span>
        </div>
        <p className="safe-subtext">
          {summary.remainingDays > 0
            ? `${summary.remainingDays} hari tersisa sampai ${formatDateLabel(pocket.endDate)}`
            : "Periode budget ini sudah selesai"}
        </p>
        <div className="safe-card-footer">
          <span>{formatRupiah(summary.remainingMoney)} tersisa</span>
          <span>{summary.spentToday > 0 ? `${formatRupiah(summary.spentToday)} tercatat hari ini` : "Belum ada pengeluaran hari ini"}</span>
        </div>
      </div>
      <div className="safe-mascot-wrap" aria-hidden="true">
        <img src="/assets/kiko-mascot.png" alt="" />
        <span className="coin coin-one" />
        <span className="coin coin-two" />
      </div>
    </section>
  );
}

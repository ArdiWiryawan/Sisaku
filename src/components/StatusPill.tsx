import type { BudgetStatus } from "../types";

type StatusPillProps = {
  status: BudgetStatus;
};

export function StatusPill({ status }: StatusPillProps) {
  return <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span>;
}

type ProgressBarsProps = {
  moneyUsedPercent: number;
  timeElapsedPercent: number;
};

export function ProgressBars({ moneyUsedPercent, timeElapsedPercent }: ProgressBarsProps) {
  return (
    <div className="progress-stack" aria-label="Progress uang dan waktu">
      <div>
        <div className="progress-label">
          <span>Uang terpakai</span>
          <span>{Math.round(moneyUsedPercent)}%</span>
        </div>
        <div className="progress-track">
          <span className="progress-fill money" style={{ width: `${Math.min(moneyUsedPercent, 100)}%` }} />
        </div>
      </div>
      <div>
        <div className="progress-label">
          <span>Waktu berjalan</span>
          <span>{Math.round(timeElapsedPercent)}%</span>
        </div>
        <div className="progress-track">
          <span className="progress-fill time" style={{ width: `${Math.min(timeElapsedPercent, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

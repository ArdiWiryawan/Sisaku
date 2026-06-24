import type { Pocket, PocketSummary } from "../types";
import { formatRupiah } from "../utils/currency";

type PocketCardProps = {
  pocket: Pocket;
  summary: PocketSummary;
  isActive: boolean;
  onOpen: () => void;
  onSetActive: () => void;
};

export function PocketCard({ pocket, summary, isActive, onOpen, onSetActive }: PocketCardProps) {
  // Map styles and emojis based on pocket type
  const typeConfigs = {
    general: {
      emoji: "\u{1F4B5}", // 💵
      className: "type-general",
    },
    food: {
      emoji: "\u{1F35C}", // 🍜
      className: "type-food",
    },
    transport: {
      emoji: "\u{1F68C}", // 🚍
      className: "type-transport",
    },
    event: {
      emoji: "\u{1F381}", // 🎁
      className: "type-event",
    },
    emergency: {
      emoji: "\u{1F6E1}\uFE0F", // 🛡️
      className: "type-emergency",
    },
  };

  const config = typeConfigs[pocket.type] || typeConfigs.general;

  // Let clicking the card trigger set active if not active, or open details on double tap, or just open details on click!
  // To match the mockup, clicking the card selects it (opens details modal on mobile).
  // Let's also provide a small "Jadikan aktif" action or make the card header click activate it.
  return (
    <article
      className={`card pocket-card-v2 ${config.className} ${isActive ? "is-active" : ""}`}
      onClick={onOpen}
    >
      <div className="pocket-v2-header">
        <div className="pocket-v2-title-block">
          <h3>{pocket.name}</h3>
          {isActive ? (
            <span className="active-badge-pill">Aktif</span>
          ) : (
            <button
              className="set-active-trigger-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent opening details
                onSetActive();
              }}
              title="Jadikan rencana aktif"
            >
              Jadikan aktif
            </button>
          )}
        </div>
        <div className="pocket-v2-icon-wrap" aria-hidden="true">
          {config.emoji}
        </div>
      </div>

      <div className="pocket-v2-body">
        <div className="pocket-v2-amount">{formatRupiah(summary.totalAvailable)}</div>
        <div className="pocket-v2-meta">
          <span>Sisa {formatRupiah(summary.remainingMoney)}</span>
          <span className="dot-separator">•</span>
          <span>
            {summary.remainingDays > 0 ? `${summary.remainingDays} hari lagi` : "Tidak ada batas"}
          </span>
        </div>
      </div>
    </article>
  );
}

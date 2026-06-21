import { useState } from "react";
import { Gift, Sparkles, Trophy } from "lucide-react";
import type { GamificationStats } from "../utils/gamification";
import { Modal } from "./Modal";

type GamificationPanelProps = {
  stats: GamificationStats;
};

export function GamificationPanel({ stats }: GamificationPanelProps) {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const unlockedCount = stats.badges.filter((badge) => badge.unlocked).length;
  const previewBadges = stats.badges.slice(0, 4);

  return (
    <section className="game-panel" aria-label="Progress hemat">
      <div className="level-card">
        <div className="level-medal">
          <Trophy size={24} aria-hidden="true" />
        </div>
        <div className="level-copy">
          <div className="level-row">
            <strong>Level {stats.level}</strong>
            <span>{stats.xp} / {stats.xpTarget} XP</span>
          </div>
          <div className="xp-track" aria-label={`Progress XP ${stats.xpProgress}%`}>
            <span style={{ width: `${stats.xpProgress}%` }} />
          </div>
        </div>
        <button
          className="reward-chest-btn"
          type="button"
          aria-label="Lihat peti hadiah level"
          onClick={() => alert("Kiko: terus catat pengeluaranmu. Peti hadiah akan terbuka saat kamu mencapai Level 5.")}
        >
          {"\u{1F381}"}
        </button>
      </div>

      <div className="mission-card">
        <div className="mission-icon">
          <Sparkles size={20} aria-hidden="true" />
        </div>
        <div className="mission-copy">
          <div className="mission-title-row">
            <div>
              <p className="eyebrow">Misi hari ini</p>
              <h2>{stats.missionTitle}</h2>
            </div>
            <div className="mission-reward">
              <Gift size={16} aria-hidden="true" />
              +{stats.missionReward} XP
            </div>
          </div>
          <p>{stats.missionBody}</p>
          <div className="mission-progress">
            <span style={{ width: `${stats.missionProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="badge-strip">
        <div className="section-heading">
          <h2>Badge hemat</h2>
          <button
            className="inline-link"
            type="button"
            aria-label="Lihat semua badge pencapaian"
            onClick={() => setShowAllBadges(true)}
          >
            Lihat semua
          </button>
        </div>
        <div className="badge-row" aria-label={`Badge pencapaian ${unlockedCount} dari ${stats.badges.length}`}>
          {previewBadges.map((badge) => (
            <article className={`badge-card ${badge.unlocked ? "unlocked" : ""}`} key={badge.id}>
              <span>{badge.icon}</span>
              <strong>{badge.title}</strong>
              <small>{badge.unlocked ? "Aktif" : "Terkunci"}</small>
            </article>
          ))}
        </div>
      </div>

      <Modal title="Badge hematmu" open={showAllBadges} onClose={() => setShowAllBadges(false)}>
        <div className="modal-scroll-area">
          <p className="modal-description-text">
            Kamu sudah membuka <strong>{unlockedCount} dari {stats.badges.length}</strong> badge. Terus catat transaksi agar pola pengeluaranmu makin terkendali.
          </p>
          <div className="badges-modal-list">
            {stats.badges.map((badge) => (
              <article className={`badge-detail-card ${badge.unlocked ? "unlocked" : "locked"}`} key={badge.id}>
                <span className="badge-detail-icon" aria-hidden="true">{badge.icon}</span>
                <div className="badge-detail-info">
                  <h3>{badge.title}</h3>
                  <p>{badge.description}</p>
                  <span className={`badge-status-pill ${badge.unlocked ? "unlocked" : "locked"}`}>
                    {badge.unlocked ? "✓ Terbuka" : `🔒 Terkunci (${badge.progress}/${badge.target})`}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Modal>
    </section>
  );
}

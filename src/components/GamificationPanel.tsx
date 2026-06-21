import { Gift, Sparkles, Trophy } from "lucide-react";
import type { GamificationStats } from "../utils/gamification";

type GamificationPanelProps = {
  stats: GamificationStats;
};

export function GamificationPanel({ stats }: GamificationPanelProps) {
  const unlockedCount = stats.badges.filter((badge) => badge.unlocked).length;

  return (
    <section className="game-panel" aria-label="Progress gamifikasi">
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
        <div className="reward-chest" aria-hidden="true">{"\u{1F381}"}</div>
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
          <h2>Badge saya</h2>
          <button className="inline-link" type="button" aria-label="Lihat semua badge">Lihat semua</button>
        </div>
        <div className="badge-row" aria-label={`Badge pencapaian ${unlockedCount} dari ${stats.badges.length}`}>
          {stats.badges.map((badge) => (
            <article className={`badge-card ${badge.unlocked ? "unlocked" : ""}`} key={badge.id}>
              <span>{badge.icon}</span>
              <strong>{badge.title}</strong>
              <small>{badge.unlocked ? "Aktif" : "Terkunci"}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

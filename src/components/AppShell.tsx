import { Plus, WifiOff } from "lucide-react";
import type { ReactNode } from "react";
import type { AppTab, Pocket } from "../types";
import { BottomNav } from "./BottomNav";

type AppShellProps = {
  activeTab: AppTab;
  activePocket: Pocket | null;
  isOffline: boolean;
  children: ReactNode;
  onChangeTab: (tab: AppTab) => void;
  onAddExpense: () => void;
};

export function AppShell({ activeTab, activePocket, isOffline, children, onChangeTab, onAddExpense }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="side-nav" aria-label="Navigasi desktop">
        <div className="brand-lockup">
          <img className="brand-mark" src="/icons/logo-sisaku.png" alt="" />
          <span>SisaKu</span>
        </div>
        <BottomNav activeTab={activeTab} onChange={onChangeTab} />
        <div className="side-mascot-note" aria-hidden="true">
          <img src="/assets/kiko-mascot.png" alt="" />
          <p>Kiko siap bantu jaga uang sakumu!</p>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button className="brand-lockup brand-button" type="button" onClick={() => onChangeTab("home")} aria-label="Ke Home">
            <img className="brand-mark" src="/icons/logo-sisaku.png" alt="" />
            <span>SisaKu</span>
          </button>
          <div className="topbar-meta">
            {isOffline ? (
              <span className="offline-pill">
                <WifiOff size={14} aria-hidden="true" />
                Offline
              </span>
            ) : null}
            {activePocket ? <span className="active-pocket-pill">{activePocket.name}</span> : null}
            <button className="btn btn-primary topbar-add" type="button" onClick={onAddExpense} disabled={!activePocket}>
              <Plus size={18} aria-hidden="true" />
              Catat
            </button>
          </div>
        </header>

        <main>{children}</main>
      </div>

      <BottomNav activeTab={activeTab} onChange={onChangeTab} />
    </div>
  );
}

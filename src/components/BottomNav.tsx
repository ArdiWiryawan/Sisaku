import { History, Home, UserRound, WalletCards } from "lucide-react";
import type { AppTab } from "../types";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "pockets", label: "Pocket", icon: WalletCards },
  { id: "history", label: "Riwayat", icon: History },
  { id: "settings", label: "Saya", icon: UserRound },
] satisfies { id: AppTab; label: string; icon: typeof Home }[];

type BottomNavProps = {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button className={active ? "active" : ""} key={item.id} type="button" onClick={() => onChange(item.id)} aria-current={active ? "page" : undefined}>
            <Icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

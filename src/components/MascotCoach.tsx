import { MessageCircleHeart } from "lucide-react";
import type { PocketSummary } from "../types";

type MascotCoachProps = {
  summary: PocketSummary;
};

export function MascotCoach({ summary }: MascotCoachProps) {
  const message =
    summary.status === "Aman"
      ? "Kiko lihat ritmemu masih aman. Catat yang kecil-kecil biar angka tetap jujur."
      : summary.status === "Waspada"
        ? "Mulai mepet, tapi belum terlambat. Kiko sarankan tahan jajan dulu hari ini."
        : "Pelan-pelan. Prioritaskan makan, transport, dan kebutuhan kuliah dulu.";

  return (
    <section className="mascot-coach">
      <img src="/assets/kiko-mascot.png" alt="Kiko, maskot SisaKu" />
      <div className="coach-bubble">
        <MessageCircleHeart size={18} aria-hidden="true" />
        <p>{message}</p>
      </div>
    </section>
  );
}

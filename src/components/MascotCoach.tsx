import { MessageCircleHeart } from "lucide-react";
import type { PocketSummary } from "../types";

type MascotCoachProps = {
  summary: PocketSummary;
};

export function MascotCoach({ summary }: MascotCoachProps) {
  const message =
    summary.status === "Aman"
      ? "Pola belanjamu masih aman. Catat transaksi kecil juga, biar angka harian tetap akurat."
      : summary.status === "Waspada"
        ? "Mulai mepet, tapi masih bisa dikejar. Tahan dulu pengeluaran yang belum penting."
        : "Fokus ke kebutuhan utama dulu: makan, transport, dan hal yang benar-benar wajib.";

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

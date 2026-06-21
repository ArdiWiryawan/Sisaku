import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { PocketForm } from "../components/PocketForm";
import type { PocketInput } from "../types";

type OnboardingPageProps = {
  onCreatePocket: (input: PocketInput) => void;
};

export function OnboardingPage({ onCreatePocket }: OnboardingPageProps) {
  return (
    <main className="onboarding-page">
      <section className="onboarding-hero">
        <div className="brand-lockup">
          <img className="brand-mark" src="/icons/logo-sisaku.png" alt="" />
          <span>SisaKu</span>
        </div>
        <div className="onboarding-copy">
          <div className="icon-bubble primary">
            <ShieldCheck size={22} aria-hidden="true" />
          </div>
          <h1>Atur uang saku bareng Kiko.</h1>
          <p>Masukkan uang yang kamu punya, tentukan harinya, lalu Kiko bantu jaga batas amanmu setiap hari.</p>
          <img className="onboarding-mascot" src="/assets/kiko-mascot.png" alt="Kiko, maskot SisaKu" />
          <div className="onboarding-perks" aria-label="Keunggulan SisaKu">
            <span><BadgeCheck size={16} aria-hidden="true" /> Misi harian</span>
            <span><Sparkles size={16} aria-hidden="true" /> Badge hemat</span>
          </div>
        </div>
      </section>

      <section className="card onboarding-form-card" aria-labelledby="onboarding-title">
        <p className="eyebrow">Buat pocket pertama</p>
        <h2 id="onboarding-title">Kamu mau uang ini cukup sampai kapan?</h2>
        <PocketForm submitLabel="Hitung Batas Aman" onSubmit={onCreatePocket} />
      </section>
    </main>
  );
}

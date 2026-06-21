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
          <h1>Biar uang cukup sampai hari terakhir.</h1>
          <p>Masukkan jumlah uang dan target harinya. Kiko akan hitung batas aman harian, lalu bantu kamu tetap di jalur.</p>
          <img className="onboarding-mascot" src="/assets/kiko-mascot.png" alt="Kiko, maskot SisaKu" />
          <div className="onboarding-perks" aria-label="Keunggulan SisaKu">
            <span><BadgeCheck size={16} aria-hidden="true" /> Batas aman harian</span>
            <span><Sparkles size={16} aria-hidden="true" /> Misi hemat</span>
          </div>
        </div>
      </section>

      <section className="card onboarding-form-card" aria-labelledby="onboarding-title">
        <p className="eyebrow">Mulai dari satu pocket</p>
        <h2 id="onboarding-title">Uang ini perlu bertahan sampai kapan?</h2>
        <PocketForm submitLabel="Hitung Batas Aman" onSubmit={onCreatePocket} />
      </section>
    </main>
  );
}

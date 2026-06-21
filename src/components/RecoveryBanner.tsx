import { LifeBuoy } from "lucide-react";

type RecoveryBannerProps = {
  message: string;
};

export function RecoveryBanner({ message }: RecoveryBannerProps) {
  return (
    <section className="recovery-banner" aria-live="polite">
      <div className="icon-bubble warning">
        <LifeBuoy size={20} aria-hidden="true" />
      </div>
      <p>{message}</p>
    </section>
  );
}

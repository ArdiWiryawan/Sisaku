import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, open, children, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-handle" />
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" aria-label="Tutup" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

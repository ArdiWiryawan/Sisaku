import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Category, Pocket, QuickAddTemplate } from "../types";
import { formatRupiah, parseMoneyInput } from "../utils/currency";
import { Modal } from "./Modal";

type QuickAddChipsProps = {
  templates: QuickAddTemplate[];
  categories: Category[];
  pockets: Pocket[];
  onSelect: (template: QuickAddTemplate) => void;
  onSaveTemplate: (input: Omit<QuickAddTemplate, "id" | "createdAt"> & { id?: string }) => void;
  onDeleteTemplate: (id: string) => void;
};

type TemplateFormState = {
  id?: string;
  label: string;
  amount: string;
  categoryId: string;
  pocketId: string;
  isActive: boolean;
};

function createFormState(template: QuickAddTemplate | null, categories: Category[], pockets: Pocket[]): TemplateFormState {
  return {
    id: template?.id,
    label: template?.label ?? "",
    amount: template ? String(template.amount) : "",
    categoryId: template?.categoryId ?? categories[0]?.id ?? "",
    pocketId: template?.pocketId ?? pockets[0]?.id ?? "",
    isActive: template?.isActive ?? true,
  };
}

export function QuickAddChips({ templates, categories, pockets, onSelect, onSaveTemplate, onDeleteTemplate }: QuickAddChipsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<QuickAddTemplate | null>(null);
  const [formState, setFormState] = useState<TemplateFormState>(() => createFormState(null, categories, pockets));
  const [error, setError] = useState<string | null>(null);
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const pocketById = new Map(pockets.map((pocket) => [pocket.id, pocket.name]));
  const iconByCategory = new Map([
    ["cat_food", "\u{1F35C}"],
    ["cat_drink", "\u2615"],
    ["cat_transport", "\u{1F68C}"],
    ["cat_print", "\u{1F5A8}\uFE0F"],
    ["cat_laundry", "\u{1F9FA}"],
  ]);

  function openTemplateModal(template: QuickAddTemplate | null) {
    setEditingTemplate(template);
    setFormState(createFormState(template, categories, pockets));
    setError(null);
    setModalOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseMoneyInput(formState.amount);

    if (!formState.label.trim()) {
      setError("Beri nama template agar mudah dikenali.");
      return;
    }

    if (amount <= 0) {
      setError("Masukkan nominal template yang lebih dari Rp0.");
      return;
    }

    if (!formState.categoryId) {
      setError("Pilih kategori template.");
      return;
    }

    onSaveTemplate({
      id: formState.id,
      label: formState.label.trim(),
      amount,
      categoryId: formState.categoryId,
      pocketId: formState.pocketId || null,
      isActive: formState.isActive,
    });

    setModalOpen(false);
  }

  return (
    <section className="section-block quick-add-card">
      <div className="section-heading">
        <h2>Catat sekali tap</h2>
        <button className="inline-link" type="button" aria-label="Kelola template catat cepat" onClick={() => openTemplateModal(null)}>+ Template</button>
      </div>
      <div className="quick-add-row" aria-label="Template catat cepat">
        {templates
          .filter((template) => template.isActive)
          .map((template) => (
            <button className="quick-chip" key={template.id} type="button" onClick={() => onSelect(template)}>
              <span className="quick-icon" aria-hidden="true">{iconByCategory.get(template.categoryId) ?? "\u2728"}</span>
              <span>{template.label}</span>
              <small>{categoryById.get(template.categoryId) ?? "Lainnya"}</small>
              <Plus className="quick-plus" size={15} aria-hidden="true" />
            </button>
          ))}
      </div>
      <Modal title={editingTemplate ? "Edit template" : "Template catat cepat"} open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="modal-scroll-area">
          <form className="stack-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="quick-label">Nama template</label>
              <input
                id="quick-label"
                value={formState.label}
                onChange={(event) => setFormState((current) => ({ ...current, label: event.target.value }))}
                placeholder="Misal: Kopi 12K"
              />
            </div>
            <div className="field hero-input">
              <label htmlFor="quick-amount">Nominal</label>
              <input
                id="quick-amount"
                inputMode="numeric"
                value={formState.amount}
                onChange={(event) => setFormState((current) => ({ ...current, amount: event.target.value }))}
                placeholder="Misal: 12000"
              />
              <span>{parseMoneyInput(formState.amount) > 0 ? formatRupiah(parseMoneyInput(formState.amount)) : "Tulis angka tanpa titik juga boleh"}</span>
            </div>
            <div className="form-grid-two">
              <div className="field">
                <label htmlFor="quick-category">Kategori</label>
                <select id="quick-category" value={formState.categoryId} onChange={(event) => setFormState((current) => ({ ...current, categoryId: event.target.value }))}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="quick-pocket">Rencana default</label>
                <select id="quick-pocket" value={formState.pocketId} onChange={(event) => setFormState((current) => ({ ...current, pocketId: event.target.value }))}>
                  <option value="">Pakai rencana aktif</option>
                  {pockets.map((pocket) => (
                    <option key={pocket.id} value={pocket.id}>
                      {pocket.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="toggle-row compact-toggle">
              <span>
                <strong>Template aktif</strong>
                <small>Tampilkan di baris catat cepat.</small>
              </span>
              <input
                type="checkbox"
                checked={formState.isActive}
                onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <div className="form-actions">
              <button className="btn btn-secondary" type="button" onClick={() => setModalOpen(false)}>
                Batal
              </button>
              <button className="btn btn-primary" type="submit">
                Simpan template
              </button>
            </div>
          </form>

          <div className="section-heading with-top-border">
            <h3>Template tersimpan</h3>
            <span>{templates.length} item</span>
          </div>
          <div className="expense-list">
            {templates.map((template) => (
              <article className="expense-item" key={template.id}>
                <div className="expense-main">
                  <strong>{template.label}</strong>
                  <span>
                    {categoryById.get(template.categoryId) ?? "Lainnya"} / {template.pocketId ? pocketById.get(template.pocketId) ?? "Rencana terhapus" : "Rencana aktif"}
                  </span>
                </div>
                <div className="expense-side">
                  <strong>{formatRupiah(template.amount)}</strong>
                  <div className="expense-actions">
                    <button type="button" onClick={() => openTemplateModal(template)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => onDeleteTemplate(template.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Modal>
    </section>
  );
}

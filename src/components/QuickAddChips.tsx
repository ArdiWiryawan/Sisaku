import { Plus } from "lucide-react";
import type { Category, QuickAddTemplate } from "../types";

type QuickAddChipsProps = {
  templates: QuickAddTemplate[];
  categories: Category[];
  onSelect: (template: QuickAddTemplate) => void;
};

export function QuickAddChips({ templates, categories, onSelect }: QuickAddChipsProps) {
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const iconByCategory = new Map([
    ["cat_food", "\u{1F35C}"],
    ["cat_drink", "\u2615"],
    ["cat_transport", "\u{1F68C}"],
    ["cat_print", "\u{1F5A8}\uFE0F"],
    ["cat_laundry", "\u{1F9FA}"],
  ]);

  return (
    <section className="section-block quick-add-card">
      <div className="section-heading">
        <h2>Catat sekali tap</h2>
        <button className="inline-link" type="button" aria-label="Lihat semua template catat cepat">+ Template</button>
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
    </section>
  );
}

import type { FormEvent } from "react";
import { Loader2, PackagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductFormValues } from "@/types/product";

type ProductFormProps = {
  form: ProductFormValues;
  editingId: number | null;
  isSaving: boolean;
  onCancelEdit: () => void;
  onChange: (form: ProductFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ProductForm({
  form,
  editingId,
  isSaving,
  onCancelEdit,
  onChange,
  onSubmit,
}: ProductFormProps) {
  return (
    <section className="inventory-panel form-panel">
      <div className="panel-heading">
        <div>
          <h2>{editingId ? "Edit product" : "Add product"}</h2>
          <p>{editingId ? `Updating product #${editingId}` : "Create a new item."}</p>
        </div>

        {editingId && (
          <Button type="button" variant="ghost" size="icon" onClick={onCancelEdit}>
            <X />
            <span className="sr-only">Cancel edit</span>
          </Button>
        )}
      </div>

      <form className="product-form" onSubmit={onSubmit}>
        <label>
          Product ID
          <input
            required
            min="1"
            type="number"
            value={form.id}
            onChange={(event) => onChange({ ...form, id: event.target.value })}
            disabled={Boolean(editingId)}
          />
        </label>

        <label>
          Name
          <input
            required
            value={form.name}
            onChange={(event) => onChange({ ...form, name: event.target.value })}
          />
        </label>

        <label>
          Description
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(event) => onChange({ ...form, description: event.target.value })}
          />
        </label>

        <div className="form-row">
          <label>
            Price
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={form.price}
              onChange={(event) => onChange({ ...form, price: event.target.value })}
            />
          </label>

          <label>
            Quantity
            <input
              required
              min="0"
              type="number"
              value={form.quantity}
              onChange={(event) => onChange({ ...form, quantity: event.target.value })}
            />
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" /> : <PackagePlus />}
          {editingId ? "Save changes" : "Add product"}
        </Button>
      </form>
    </section>
  );
}

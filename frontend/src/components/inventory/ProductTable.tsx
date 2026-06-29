import { Check, Edit3, Loader2, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type ProductTableProps = {
  products: Product[];
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
};

export function ProductTable({
  products,
  isLoading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <section className="inventory-panel table-panel">
      <div className="panel-heading table-heading">
        <div>
          <h2>Products</h2>
          <p>{products.length} items shown</p>
        </div>

        <label className="search-box">
          <Search className="size-4" />
          <input
            placeholder="Search inventory"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  <Loader2 className="mx-auto mb-2 animate-spin" />
                  Loading products
                </td>
              </tr>
            ) : products.length ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>#{product.id}</td>
                  <td>
                    <strong>{product.name}</strong>
                    <span>{product.description}</span>
                  </td>
                  <td>{formatCurrency.format(product.price)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <span
                      className={
                        product.quantity <= 10
                          ? "stock-pill stock-low"
                          : "stock-pill stock-ok"
                      }
                    >
                      {product.quantity <= 10 ? "Low" : "In stock"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onEdit(product)}
                      >
                        <Edit3 />
                        <span className="sr-only">Edit {product.name}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 />
                        <span className="sr-only">Delete {product.name}</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-state">
                  <Check className="mx-auto mb-2" />
                  No products match your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

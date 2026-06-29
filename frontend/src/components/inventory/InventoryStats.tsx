import type { Product } from "@/types/product";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type InventoryStatsProps = {
  products: Product[];
};

export function InventoryStats({ products }: InventoryStatsProps) {
  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockCount = products.filter((product) => product.quantity <= 10).length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  return (
    <section className="stats-grid" aria-label="Inventory summary">
      <article>
        <span>Total products</span>
        <strong>{products.length}</strong>
      </article>
      <article>
        <span>Total stock</span>
        <strong>{totalStock}</strong>
      </article>
      <article>
        <span>Inventory value</span>
        <strong>{formatCurrency.format(totalValue)}</strong>
      </article>
      <article>
        <span>Low stock</span>
        <strong>{lowStockCount}</strong>
      </article>
    </section>
  );
}

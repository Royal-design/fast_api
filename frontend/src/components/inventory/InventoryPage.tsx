import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/lib/productsApi";
import {
  emptyProductForm,
  type Product,
  type ProductFormValues,
} from "@/types/product";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormValues>(emptyProductForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");

    try {
      setProducts(await getProducts());
    } catch {
      setError("Could not load products. Make sure the FastAPI server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [product.id, product.name, product.description]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [products, search]);

  const resetForm = () => {
    setForm(emptyProductForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const product: Product = {
      id: Number(form.id),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      if (editingId !== null) {
        await updateProduct(editingId, product);
      } else {
        await createProduct(product);
      }

      resetForm();
      await fetchProducts();
    } catch {
      setError("Could not save product. Check that the ID is unique and fields are valid.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      id: String(product.id),
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
    });
  };

  const handleDelete = async (id: number) => {
    setError("");

    try {
      await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );

      if (editingId === id) {
        resetForm();
      }
    } catch {
      setError("Could not delete product. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#1d211f]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <InventoryHeader isLoading={isLoading} onRefresh={fetchProducts} />

        {error && (
          <div className="status-message" role="alert">
            {error}
          </div>
        )}

        <InventoryStats products={products} />

        <div className="inventory-layout">
          <ProductForm
            form={form}
            editingId={editingId}
            isSaving={isSaving}
            onCancelEdit={resetForm}
            onChange={setForm}
            onSubmit={handleSubmit}
          />
          <ProductTable
            products={filteredProducts}
            isLoading={isLoading}
            search={search}
            onSearchChange={setSearch}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </section>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/lib/productsApi";
import {
  type Product,
  type ProductFormValues,
} from "@/types/product";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
    let isMounted = true;

    async function loadProducts() {
      try {
        const loadedProducts = await getProducts();

        if (isMounted) {
          setProducts(loadedProducts);
        }
      } catch {
        if (isMounted) {
          setError("Could not load products. Make sure the FastAPI server is running.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
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
    setSelectedProduct(null);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    setIsSaving(true);
    setError("");

    const product: Product = {
      id: Number(values.id),
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      quantity: Number(values.quantity),
    };

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, product);
        toast.success("Product updated", {
          description: `${product.name} was saved successfully.`,
        });
      } else {
        await createProduct(product);
        toast.success("Product created", {
          description: `${product.name} was added to inventory.`,
        });
      }

      resetForm();
      await fetchProducts();
    } catch {
      toast.error("Could not save product", {
        description: "Check that the ID is unique and all fields are valid.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (id: number) => {
    setError("");

    try {
      await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
      toast.success("Product deleted");

      if (selectedProduct?.id === id) {
        resetForm();
      }
    } catch {
      toast.error("Could not delete product", {
        description: "Please try again.",
      });
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
            product={selectedProduct}
            isSaving={isSaving}
            onCancelEdit={resetForm}
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

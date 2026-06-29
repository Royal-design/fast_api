import axios from "axios";
import type { Product } from "@/types/product";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function getProducts() {
  const response = await axios.get<Product[]>(`${API_URL}/products`);
  return response.data;
}

export async function createProduct(product: Product) {
  const response = await axios.post<Product>(`${API_URL}/product`, product);
  return response.data;
}

export async function updateProduct(id: number, product: Product) {
  const response = await axios.put<Product>(`${API_URL}/products/${id}`, product);
  return response.data;
}

export async function deleteProduct(id: number) {
  await axios.delete(`${API_URL}/products/${id}`);
}

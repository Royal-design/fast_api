export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

export type ProductFormValues = {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
};

export const emptyProductForm: ProductFormValues = {
  id: "",
  name: "",
  description: "",
  price: "",
  quantity: "",
};

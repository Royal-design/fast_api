"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2, PackagePlus, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { Product, ProductFormValues } from "@/types/product";
import { emptyProductForm } from "@/types/product";

const productFormSchema = z.object({
  id: z
    .string()
    .min(1, "Product ID is required.")
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, {
      message: "Product ID must be a positive whole number.",
    }),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name must be at most 60 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters.")
    .max(160, "Description must be at most 160 characters."),
  price: z
    .string()
    .min(1, "Price is required.")
    .refine((value) => Number(value) >= 0, {
      message: "Price cannot be negative.",
    }),
  quantity: z
    .string()
    .min(1, "Quantity is required.")
    .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, {
      message: "Quantity must be a whole number.",
    }),
});

type ProductFormSchema = z.infer<typeof productFormSchema>;

type ProductFormProps = {
  product: Product | null;
  isSaving: boolean;
  onCancelEdit: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
};

function productToFormValues(product: Product | null): ProductFormValues {
  if (!product) {
    return emptyProductForm;
  }

  return {
    id: String(product.id),
    name: product.name,
    description: product.description,
    price: String(product.price),
    quantity: String(product.quantity),
  };
}

export function ProductForm({
  product,
  isSaving,
  onCancelEdit,
  onSubmit,
}: ProductFormProps) {
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: productToFormValues(product),
  });

  React.useEffect(() => {
    form.reset(productToFormValues(product));
  }, [form, product]);

  async function handleSubmit(values: ProductFormSchema) {
    toast("Submitting product", {
      description: (
        <pre className="mt-2 w-[280px] overflow-x-auto rounded-md bg-muted p-3 text-muted-foreground">
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius) + 4px)",
      } as React.CSSProperties,
    });

    await onSubmit(values);
  }

  const description = useWatch({
    control: form.control,
    name: "description",
  });
  const formId = "product-inventory-form";

  return (
    <Card className="inventory-form-card">
      <CardHeader>
        <CardTitle>{product ? "Edit product" : "Add product"}</CardTitle>
        <CardDescription>
          {product ? `Updating product #${product.id}` : "Create a new inventory item."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-form-id">Product ID</FieldLabel>
                  <Input
                    {...field}
                    id="product-form-id"
                    type="number"
                    min="1"
                    aria-invalid={fieldState.invalid}
                    disabled={Boolean(product)}
                    placeholder="101"
                  />
                  <FieldDescription>
                    IDs must be unique in your FastAPI database.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-form-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="product-form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Wireless Keyboard"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-form-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="product-form-description"
                      rows={5}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                      placeholder="Compact keyboard for office inventory."
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {description.length}/160 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Keep this short enough to scan in the product table.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="form-row">
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-form-price">Price</FieldLabel>
                    <Input
                      {...field}
                      id="product-form-price"
                      type="number"
                      min="0"
                      step="0.01"
                      aria-invalid={fieldState.invalid}
                      placeholder="29.99"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="quantity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-form-quantity">Quantity</FieldLabel>
                    <Input
                      {...field}
                      id="product-form-quantity"
                      type="number"
                      min="0"
                      aria-invalid={fieldState.invalid}
                      placeholder="24"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal" className="justify-end">
          {product ? (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              <X />
              Cancel
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              <RotateCcw />
              Reset
            </Button>
          )}
          <Button type="submit" form={formId} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : <PackagePlus />}
            {product ? "Save changes" : "Add product"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

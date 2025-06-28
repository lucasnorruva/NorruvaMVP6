// --- File: page.tsx (Add/Edit Product Page) ---
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import type { ProductFormData } from "@/types/productFormTypes";
import { useToast } from "@/hooks/use-toast";
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from "@/types/dpp";

export default function AddNewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: For a real app, 'id' would come from URL params for editing,
  // and initialData would be fetched from an API.
  // This is a simplified mock for the prototype.
  const id = undefined; // Forcing 'create' mode for now
  const initialData = undefined;

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    console.log("Form Submitted Data:", data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock saving to localStorage for user-added products
    try {
      const newProduct = {
        id: `USER_PROD_${Date.now().toString().slice(-6)}`,
        productName: data.productName,
        category: data.category,
        gtin: data.technical?.gtin,
        modelNumber: data.technical?.modelNumber,
        status: "Draft",
        compliance: "Pending", // Default compliance status
        lastUpdated: new Date().toISOString(),
        // Add other fields from data as needed
      };

      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      const userProducts = storedProductsString ? JSON.parse(storedProductsString) : [];
      userProducts.push(newProduct);
      localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));

      toast({
        title: "Product Passport Created (Mock)",
        description: `DPP for "${data.productName}" has been successfully saved to local storage.`,
      });
      router.push("/products"); // Redirect to the product list after submission
    } catch (e) {
      console.error("Failed to save product:", e);
      toast({
        title: "Error",
        description: "Failed to save the product passport.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProductForm
      id={id}
      initialData={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}

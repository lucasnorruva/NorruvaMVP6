
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/forms"; // Updated import
import { useCreateProduct } from "@/hooks/products/useProduct";
import type { ProductFormData } from "@/types/products"; // Updated import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanLine } from "lucide-react";

export default function AddNewProductPage() {
  const router = useRouter();
  const createProductMutation = useCreateProduct({
    onSuccess: (data) => {
      // On success, redirect to the product list page
      router.push("/products");
    },
    // onError is handled globally by the useErrorHandler hook, but can be overridden here if needed
  });

  const handleSubmit = async (data: ProductFormData) => {
    // The useCreateProduct hook handles the submission logic
    await createProductMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <ScanLine className="mr-3 h-6 w-6 text-primary" /> Create New Digital Product Passport
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new DPP. Start with basic information, and complete other sections as data becomes available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={handleSubmit}
            isSubmitting={createProductMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

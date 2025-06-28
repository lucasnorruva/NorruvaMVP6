// src/app/(app)/products/new/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScanLine } from 'lucide-react';
import { ProductForm } from '@/components/products/forms/ProductForm';
import { useCreateProduct } from '@/hooks/products/useProduct';
import type { ProductFormData } from '@/types/products';
import { useErrorHandler } from '@/hooks/shared/useErrorHandler';

export default function AddNewProductPage() {
  const router = useRouter();
  const { handleError } = useErrorHandler();
  
  const { mutateAsync: createProduct, isPending } = useCreateProduct({
    onSuccess: (data) => {
      // On success, redirect to the new product's detail page
      router.push(`/products/${data.id}`);
    },
    onError: (error) => {
      handleError(error, 'Failed to create product');
    },
  });

  const handleSubmit = async (data: ProductFormData) => {
    await createProduct(data);
  };
  
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <ScanLine className="mr-3 h-6 w-6 text-primary" />
            Create New Digital Product Passport
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new DPP. Start with basic information, and complete other sections as data becomes available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

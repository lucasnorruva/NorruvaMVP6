// src/app/(app)/products/new/page.tsx
"use client";

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductForm } from '@/components/products/forms/ProductForm';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/products/useProduct';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { EmptyState } from '@/components/shared/EmptyState';
import { productFormUtils } from '@/utils/products/formUtils';
import type { ProductFormData } from '@/types/products';
import { ProductHeader } from '@/components/products/ui/ProductHeader';

export default function AddEditProductPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const { data: product, isLoading: isProductLoading, error: productError } = useProduct({
    productId: productId!,
    options: { enabled: !!productId },
  });

  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (data: ProductFormData) => {
    if (productId) {
      await updateProduct({ id: productId, data });
    } else {
      await createProduct(data);
    }
  };

  const initialData = useMemo(() => {
    if (productId && product) {
      return productFormUtils.productToFormData(product);
    }
    return productFormUtils.getDefaultFormData();
  }, [productId, product]);

  if (isProductLoading) {
    return <FullPageLoader message="Loading product data..." />;
  }
  
  if (productId && productError) {
    return (
      <EmptyState
        title="Failed to load product"
        description="The product you are trying to edit could not be found or loaded."
      />
    );
  }

  return (
    <div className="space-y-6">
      <ProductHeader
        title={productId ? 'Edit Product' : 'Create New Product'}
        description={productId ? `Editing ${product?.productName.value || productId}` : 'Fill out the form below to create a new Digital Product Passport.'}
        showCreateButton={false}
      />
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        key={productId || 'new-product'}
      />
    </div>
  );
}

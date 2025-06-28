// src/app/(app)/products/[productId]/page.tsx
/**
 * Product detail page. Fetches product data using the new architecture
 * and displays it using the new modular components.
 */
"use client";

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useProduct } from '@/hooks/products/useProduct';
import { ProductContainer } from '@/components/products/detail/ProductContainer';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;

  const { data: product, isLoading, error, refetch } = useProduct({
    productId: productId!,
    options: { enabled: !!productId },
  });
  
  if (isLoading) {
    return <FullPageLoader message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <EmptyState
        title="Product Not Found"
        description={error?.message || "The product you are looking for does not exist or could not be loaded."}
        action={
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        }
      />
    );
  }

  return (
    <ProductContainer product={product} />
  );
}

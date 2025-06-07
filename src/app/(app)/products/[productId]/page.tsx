
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import { SIMPLE_MOCK_PRODUCTS } from '@/types/dpp';
import type { SimpleProductDetail } from '@/types/dpp';
import { Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<SimpleProductDetail | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    if (productId) {
      // Simulate fetching product data
      const foundProduct = SIMPLE_MOCK_PRODUCTS.find(p => p.id === productId);
      // In a real app, you'd fetch from an API:
      // fetch(`/api/products/${productId}`).then(res => res.json()).then(data => setProduct(data));
      
      // Also check user-added products from localStorage if USER_PRODUCTS_LOCAL_STORAGE_KEY is defined
      // and its structure matches SimpleProductDetail or can be mapped.
      // For this refactor, we'll primarily use SIMPLE_MOCK_PRODUCTS.
      
      // Simulate delay
      setTimeout(() => {
        setProduct(foundProduct || null);
      }, 300);
    }
  }, [productId]);

  if (product === undefined) { // Loading state
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductContainer product={product} />;
}

    
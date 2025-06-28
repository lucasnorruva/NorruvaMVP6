// src/components/products/ui/ProductListSkeleton.tsx
/**
 * Skeleton loading state for product lists
 */
"use client";

import React, { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductListSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

const ProductListSkeleton = memo<ProductListSkeletonProps>(({ 
  count = 8, 
  viewMode = 'grid' 
}) => {
  const gridClasses = viewMode === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    : 'space-y-4';

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <Skeleton className="h-full w-full" />
          </AspectRatio>
          <CardHeader className="pb-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

ProductListSkeleton.displayName = 'ProductListSkeleton';

export { ProductListSkeleton };

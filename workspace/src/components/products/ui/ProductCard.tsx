// src/components/products/ui/ProductCard.tsx
/**
 * Pure UI component for displaying product card with memoization
 */
"use client";

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import type { ProductListItem, ComponentProps } from '@/types/products';
import { ProductStatusBadge } from './ProductStatusBadge';
import { ProductComplianceBadge } from './ProductComplianceBadge';
import { ProductCompletenessIndicator } from './ProductCompletenessIndicator';

interface ProductCardProps extends ComponentProps {
  product: ProductListItem;
  onView?: (productId: string) => void;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string, productName?: string) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const ProductCard = memo<ProductCardProps>(({
  product,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'default',
  className,
  testId,
}) => {
  const handleView = () => onView?.(product.id);
  const handleEdit = () => onEdit?.(product.id);
  const handleDelete = () => onDelete?.(product.id, product.productName);

  const imageUrl = product.imageUrl || '/images/product-placeholder.png';

  return (
    <Card 
      className={`hover:shadow-md transition-shadow duration-200 ${className} flex flex-col`}
      data-testid={testId}
    >
      {variant !== 'compact' && (
        <div className="relative">
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <Image
              src={imageUrl}
              alt={product.productName}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </AspectRatio>
          {showActions && (
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  {onEdit && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className={`${variant === 'compact' ? 'pb-2' : 'pb-4'} flex-grow`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight line-clamp-2">{product.productName}</CardTitle>
            <CardDescription className="text-xs truncate">{product.manufacturer}</CardDescription>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
          {variant === 'compact' && showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                {onEdit && <DropdownMenuItem onClick={handleEdit}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>}
                {onDelete && <><DropdownMenuSeparator /><DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></>}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between">
          <ProductStatusBadge status={product.status} size="sm"/>
          <ProductComplianceBadge status={product.complianceStatus} size="sm"/>
        </div>
        
        <ProductCompletenessIndicator score={product.completenessScore} />
        
        {variant === 'detailed' && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Last updated: {new Date(product.lastUpdated).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export { ProductCard };

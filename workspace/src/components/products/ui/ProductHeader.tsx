// src/components/products/ui/ProductHeader.tsx
/**
 * Header component for product pages
 */
"use client";

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { ComponentProps } from '@/types/products';
import { useRouter } from 'next/navigation';

interface ProductHeaderProps extends ComponentProps {
  title: string;
  description: string;
  onEdit?: () => void;
  onDelete?: () => void;
  showCreateButton?: boolean;
  onCreate?: () => void;
}

const ProductHeader = memo<ProductHeaderProps>(({
  title,
  description,
  onEdit,
  onDelete,
  showCreateButton = true,
  onCreate,
  className,
  testId,
}) => {
  const router = useRouter();
  
  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      router.push('/products/new');
    }
  };

  return (
    <div className={`flex items-center justify-between mb-6 ${className}`} data-testid={testId}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        {showCreateButton && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        )}
      </div>
    </div>
  );
});

ProductHeader.displayName = 'ProductHeader';

export { ProductHeader };

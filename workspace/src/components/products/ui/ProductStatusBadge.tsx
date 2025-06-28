
// src/components/products/ui/ProductStatusBadge.tsx
/**
 * Memoized status badge component
 */
"use client";

import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, Archive } from 'lucide-react';
import type { ProductStatus } from '@/types/products';

interface ProductStatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'default' | 'lg';
}

const STATUS_CONFIG = {
  [ProductStatus.ACTIVE]: {
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-green-100 text-green-700 border-green-300',
  },
  [ProductStatus.PENDING]: {
    icon: Clock,
    variant: 'outline' as const,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  [ProductStatus.DRAFT]: {
    icon: AlertTriangle,
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  [ProductStatus.ARCHIVED]: {
    icon: Archive,
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  [ProductStatus.RECALLED]: {
    icon: AlertTriangle,
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-700 border-red-300',
  },
} as const;

const ProductStatusBadge = memo<ProductStatusBadgeProps>(({ status, size = 'default' }) => {
  const config = STATUS_CONFIG[status];
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1`}
    >
      <IconComponent className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
});

ProductStatusBadge.displayName = 'ProductStatusBadge';

export { ProductStatusBadge };

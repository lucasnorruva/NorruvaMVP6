// src/components/products/ui/ProductComplianceBadge.tsx
/**
 * Memoized compliance status badge component
 */
"use client";

import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import type { ComplianceStatus } from '@/types/products';

interface ProductComplianceBadgeProps {
  status: ComplianceStatus;
  size?: 'sm' | 'default' | 'lg';
}

const COMPLIANCE_CONFIG = {
  [ComplianceStatus.COMPLIANT]: {
    icon: ShieldCheck,
    variant: 'default' as const,
    className: 'bg-green-100 text-green-700 border-green-300',
  },
  [ComplianceStatus.PENDING]: {
    icon: ShieldQuestion,
    variant: 'outline' as const,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  [ComplianceStatus.NON_COMPLIANT]: {
    icon: ShieldAlert,
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-700 border-red-300',
  },
  [ComplianceStatus.NOT_APPLICABLE]: {
    icon: ShieldQuestion,
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
} as const;

const ProductComplianceBadge = memo<ProductComplianceBadgeProps>(({ status, size = 'default' }) => {
  const config = COMPLIANCE_CONFIG[status];
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
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </Badge>
  );
});

ProductComplianceBadge.displayName = 'ProductComplianceBadge';

export { ProductComplianceBadge };

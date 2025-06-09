
// --- File: ProductComplianceBadge.tsx ---
// Description: Component to display a product's compliance status as a styled badge.
"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { cn } from '@/lib/utils';
import type { DisplayableProduct } from "@/types/dpp";

interface ProductComplianceBadgeProps {
  compliance: DisplayableProduct['compliance'];
}

export default function ProductComplianceBadge({ compliance }: ProductComplianceBadgeProps) {
  const getComplianceBadgeVariant = (c: DisplayableProduct['compliance']) => {
    switch (c) {
      case "Compliant": return "default";
      case "Pending": return "outline";
      case "N/A": return "secondary";
      default: return "destructive"; // Non-Compliant or other issues
    }
  };

  const getComplianceBadgeClass = (c: DisplayableProduct['compliance']) => {
     switch (c) {
        case "Compliant": return "bg-green-100 text-green-700 border-green-300";
        case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "N/A": return "bg-muted text-muted-foreground border-border";
        default: return "bg-red-100 text-red-700 border-red-300"; // Non-Compliant
    }
  };

  const ComplianceIcon = compliance === "Compliant" ? ShieldCheck :
                         compliance === "Pending" ? ShieldQuestion :
                         compliance === "N/A" ? ShieldQuestion : ShieldAlert;

  return (
    <Badge
      variant={getComplianceBadgeVariant(compliance)}
      className={cn(getComplianceBadgeClass(compliance))}
    >
      <ComplianceIcon className="mr-1 h-3.5 w-3.5" />
      {compliance}
    </Badge>
  );
}

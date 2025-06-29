// --- File: ProductStatusBadge.tsx ---
// Description: Component to display a product's status as a styled badge.
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DisplayableProduct } from "@/types/dpp";

interface ProductStatusBadgeProps {
  status: DisplayableProduct["status"];
}

export default function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  const getProductStatusBadgeVariant = (s: DisplayableProduct["status"]) => {
    switch (s) {
      case "Active":
        return "default";
      case "Pending":
        return "outline";
      case "Draft":
        return "secondary";
      case "Archived":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getProductStatusBadgeClass = (s: DisplayableProduct["status"]) => {
    switch (s) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Draft":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "Archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const StatusIcon =
    status === "Active"
      ? CheckCircle
      : status === "Pending"
        ? Info
        : AlertTriangle;

  return (
    <Badge
      variant={getProductStatusBadgeVariant(status)}
      className={cn(getProductStatusBadgeClass(status))}
    >
      <StatusIcon className="mr-1 h-3.5 w-3.5" />
      {status}
    </Badge>
  );
}

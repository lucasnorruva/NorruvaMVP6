// --- File: ProductComplianceHeader.tsx ---
// Description: Component to display the overall compliance status header for a product.
"use client";

import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Removed CardContent
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getStatusIcon,
  getStatusBadgeVariant,
  getStatusBadgeClasses,
} from "@/utils/dppDisplayUtils";
import type { ProductComplianceSummary } from "@/types/dpp";

// Kept for notifications prop, can be defined elsewhere if shared
interface ProductNotification {
  id: string;
  type: "info" | "warning" | "error";
  message: string;
  date: string;
}

interface ProductComplianceHeaderProps {
  overallStatusText: ProductComplianceSummary["overallStatus"];
  notifications?: ProductNotification[];
}

const ProductComplianceHeader: React.FC<ProductComplianceHeaderProps> = ({
  overallStatusText,
  notifications,
}) => {
  const hasErrorNotifications = notifications?.some((n) => n.type === "error");
  const overallStatusIcon = getStatusIcon(overallStatusText);
  const overallStatusBadgeVariant = getStatusBadgeVariant(overallStatusText);
  const overallStatusBadgeClasses = getStatusBadgeClasses(overallStatusText);
  const formattedOverallStatusText = overallStatusText
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Card
      className={cn(
        "shadow-md mb-6",
        hasErrorNotifications && "border-destructive border-2",
      )}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle
              className={cn(
                "text-lg font-headline flex items-center",
                hasErrorNotifications && "text-destructive",
              )}
            >
              {hasErrorNotifications && (
                <AlertTriangle className="mr-2 h-5 w-5" />
              )}
              Product Compliance Status
            </CardTitle>
            <CardDescription className="mt-1">
              Overall status and key regulatory checkpoints.
              {hasErrorNotifications && (
                <span className="block text-destructive font-medium mt-1">
                  Attention: Critical alerts require review.
                </span>
              )}
            </CardDescription>
          </div>
          {overallStatusText && overallStatusText.toLowerCase() !== "n/a" && (
            <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
              <span className="text-xs text-muted-foreground mb-0.5">
                Overall Status
              </span>
              <Badge
                variant={overallStatusBadgeVariant}
                className={cn("text-sm px-3 py-1", overallStatusBadgeClasses)}
              >
                {React.cloneElement(overallStatusIcon, {
                  className: cn(
                    overallStatusIcon.props.className,
                    "mr-2 h-4 w-4",
                  ),
                })}
                {formattedOverallStatusText}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      {/* CardContent removed as individual items will be listed in ComplianceTab */}
    </Card>
  );
};

export default ProductComplianceHeader;

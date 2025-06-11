
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Package, Tag, Building, CheckCircle, AlertTriangle, Info, ShieldCheck, Barcode } from "lucide-react"; // Added Barcode
import { getStatusIcon as getComplianceStatusIcon, getStatusBadgeVariant as getComplianceBadgeVariant, getStatusBadgeClasses as getComplianceBadgeClasses } from "@/utils/dppDisplayUtils";
import React from "react";
import QrCodeGenerator from "@/components/qr/QrCodeGenerator";

interface ProductHeaderProps {
  product: SimpleProductDetail;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
  if (!product) {
    return null;
  }

  const getProductStatusBadgeVariant = (status: SimpleProductDetail['status']) => {
    switch (status) {
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

  const getProductStatusBadgeClass = (status: SimpleProductDetail['status']) => {
    switch (status) {
        case "Active": return "bg-green-100 text-green-700 border-green-300";
        case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "Draft": return "bg-gray-100 text-gray-700 border-gray-300";
        case "Archived": return "bg-muted text-muted-foreground";
        default: return "bg-muted text-muted-foreground";
    }
  }

  const ProductStatusIcon = product.status === "Active" ? CheckCircle : product.status === "Pending" ? Info : AlertTriangle;

  const overallComplianceStatus = product.complianceSummary?.overallStatus || "N/A";
  const ComplianceStatusIconComponent = getComplianceStatusIcon(overallComplianceStatus);
  const complianceBadgeVariant = getComplianceBadgeVariant(overallComplianceStatus);
  const complianceBadgeClasses = getComplianceBadgeClasses(overallComplianceStatus);
  const formattedOverallComplianceText = overallComplianceStatus
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());


  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="text-2xl md:text-3xl font-headline text-primary flex items-center">
                    <Package className="mr-3 h-7 w-7" />
                    {product.productName}
                </CardTitle>
                <CardDescription className="mt-1 text-md text-muted-foreground">
                    Product ID: {product.id}
                </CardDescription>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0 shrink-0">
                <Badge
                    variant={getProductStatusBadgeVariant(product.status)}
                    className={cn("text-sm px-3 py-1", getProductStatusBadgeClass(product.status))}
                >
                    <ProductStatusIcon className="mr-1.5 h-4 w-4" />
                    Product Status: {product.status}
                </Badge>
                <Badge
                    variant={complianceBadgeVariant}
                    className={cn("text-sm px-3 py-1", complianceBadgeClasses)}
                >
                   {React.cloneElement(ComplianceStatusIconComponent, { className: "mr-1.5 h-4 w-4" })}
                   Compliance: {formattedOverallComplianceText}
                </Badge>
            </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground border-t pt-4">
            {product.category && (
                <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1.5 text-primary/80" />
                    Category: <span className="font-medium text-foreground/90 ml-1">{product.category}</span>
                </div>
            )}
            {product.manufacturer && (
                <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1.5 text-primary/80" />
                    Manufacturer: <span className="font-medium text-foreground/90 ml-1">{product.manufacturer}</span>
                </div>
            )}
             {product.gtin && (
                <div className="flex items-center">
                    <Barcode className="h-4 w-4 mr-1.5 text-primary/80" />
                    GTIN: <span className="font-medium text-foreground/90 ml-1">{product.gtin}</span>
                </div>
            )}
        </div>
        <QrCodeGenerator productId={product.id} />
      </CardHeader>
    </Card>
  );
}
    

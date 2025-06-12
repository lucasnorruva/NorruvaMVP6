
// --- File: ProductListRow.tsx ---
// Description: Component to render a single row in the Product Management table.

"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, FileText as FileTextIcon, Sigma } from "lucide-react";
import type { DisplayableProduct } from "@/types/dpp";
import type { UserRole } from "@/contexts/RoleContext";
import ProductStatusBadge from './list/ProductStatusBadge';
import ProductComplianceBadge from './list/ProductComplianceBadge';
import ProductCompletenessIndicator from './list/ProductCompletenessIndicator';
import { getAiHintForImage } from '@/utils/imageUtils';
import { Badge } from '@/components/ui/badge'; // Import Badge
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip


interface ProductListRowProps {
  product: DisplayableProduct;
  completenessData: { score: number; filledFields: number; totalFields: number; missingFields: string[] };
  currentRole: UserRole;
  onDeleteProduct: (product: DisplayableProduct) => void;
}

export function ProductListRow({ product, completenessData, currentRole, onDeleteProduct }: ProductListRowProps) {
  const canEdit = (currentRole === 'admin' || currentRole === 'manufacturer') && product.id.startsWith("USER_PROD");
  const canDelete = (currentRole === 'admin' || currentRole === 'manufacturer') && product.id.startsWith("USER_PROD");

  const currentProductName = product.productName || "Unnamed Product";
  const currentCategory = product.category || product.productCategory || "N/A";
  const currentManufacturer = product.manufacturer || "N/A";
  const imageUrl = product.imageUrl || "https://placehold.co/50x50.png?text=N/A";
  
  const aiHint = getAiHintForImage({
    productName: currentProductName,
    category: currentCategory,
    imageHint: product.imageHint,
  });

  const onChainStatusDisplay = product.metadata?.onChainStatus || "Unknown";


  return (
    <TableRow key={product.id}>
      <TableCell>
        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
          <Image 
            src={imageUrl} 
            alt={currentProductName} 
            width={48} 
            height={48} 
            className="object-contain"
            data-ai-hint={aiHint}
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <Link href={`/products/${product.id}`} className="hover:underline text-primary">
          {product.id}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={`/products/${product.id}`} className="hover:underline">
          {currentProductName}
        </Link>
      </TableCell>
      <TableCell>{currentManufacturer}</TableCell>
      <TableCell>{currentCategory}</TableCell>
      <TableCell>
        <ProductStatusBadge status={product.status} />
      </TableCell>
      <TableCell>
        <ProductComplianceBadge compliance={product.compliance} />
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Badge variant={onChainStatusDisplay === "Active" ? "default" : "outline"} className={`capitalize ${onChainStatusDisplay === "Active" ? 'bg-blue-100 text-blue-700 border-blue-300' : onChainStatusDisplay === "Recalled" ? 'bg-red-100 text-red-700 border-red-300' : 'bg-muted text-muted-foreground'}`}>
                <Sigma className="mr-1 h-3.5 w-3.5" />
                {onChainStatusDisplay.replace(/_/g, ' ')}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Conceptual On-Chain Status: {onChainStatusDisplay.replace(/_/g, ' ')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <ProductCompletenessIndicator completenessData={completenessData} />
      </TableCell>
      <TableCell>{new Date(product.lastUpdated).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">Product Actions for {currentProductName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem asChild>
                <Link href={`/products/new?edit=${product.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => alert(`Mock: Settings for ${product.id}`)}>
              <FileTextIcon className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => onDeleteProduct(product)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}


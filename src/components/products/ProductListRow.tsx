
// --- File: ProductListRow.tsx ---
// Description: Component to render a single row in the Product Management table.

"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle2, FileText as FileTextIcon } from "lucide-react";
import type { DisplayableProduct } from "@/types/dpp";
import type { UserRole } from "@/contexts/RoleContext";
import { cn } from '@/lib/utils';

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
  const imageHint = product.imageHint || (product.imageUrl?.includes('placehold.co') ? currentProductName.split(" ").slice(0,2).join(" ") : "product " + (currentCategory).toLowerCase());


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
            data-ai-hint={imageHint}
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
        <Badge variant={
          product.status === "Active" ? "default" :
          product.status === "Archived" ? "secondary" : "outline"
        } className={cn(
          product.status === "Active" ? "bg-green-100 text-green-700 border-green-300" :
          product.status === "Archived" ? "bg-muted text-muted-foreground border-border" :
          "bg-yellow-100 text-yellow-700 border-yellow-300" // Draft, Pending
        )}>
          {product.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={
            product.compliance === "Compliant" ? "default" :
            product.compliance === "Pending" ? "outline" :
            product.compliance === "N/A" ? "secondary" : "destructive"
          } className={cn(
            product.compliance === "Compliant" ? "bg-green-100 text-green-700 border-green-300" :
            product.compliance === "Pending" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
            product.compliance === "N/A" ? "bg-muted text-muted-foreground border-border" :
            "bg-red-100 text-red-700 border-red-300"
          )}>
          {product.compliance}
        </Badge>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <div className="flex items-center w-24 cursor-help">
                <Progress value={completenessData.score} className="h-2 flex-grow [&>div]:bg-primary" />
                <span className="text-xs text-muted-foreground ml-1.5">{completenessData.score}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent align="start" className="bg-background shadow-xl p-3 rounded-lg border max-w-xs z-50">
              <p className="font-medium text-sm mb-1 text-foreground">DPP Completeness: {completenessData.score}%</p>
              <p className="text-xs text-muted-foreground mb-1">({completenessData.filledFields}/{completenessData.totalFields} essential fields filled)</p>
              {completenessData.missingFields.length > 0 ? (
                <>
                  <p className="text-xs font-semibold mt-2 text-foreground/90">Missing essential fields:</p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground max-h-32 overflow-y-auto space-y-0.5 mt-1">
                    {completenessData.missingFields.slice(0, 5).map(field => <li key={field}>{field}</li>)}
                    {completenessData.missingFields.length > 5 && (
                      <li>...and {completenessData.missingFields.length - 5} more.</li>
                    )}
                  </ul>
                </>
              ) : (
                <p className="text-xs text-green-600 flex items-center mt-2"><CheckCircle2 className="mr-1 h-3.5 w-3.5"/>All essential fields filled!</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

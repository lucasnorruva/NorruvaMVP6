
// --- File: SupplierList.tsx ---
// Description: Component to display a list of suppliers in a table.
"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import type { Supplier } from "@/types/dpp";
import { cn } from "@/lib/utils";

interface SupplierListProps {
  suppliers: Supplier[];
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
  canManage: boolean;
}

export default function SupplierList({ suppliers, onEditSupplier, onDeleteSupplier, canManage }: SupplierListProps) {
  if (suppliers.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No suppliers found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact Person</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Materials Supplied</TableHead>
          <TableHead>Status</TableHead>
          {canManage && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell className="font-medium">{supplier.name}</TableCell>
            <TableCell>{supplier.contactPerson || "-"}</TableCell>
            <TableCell>{supplier.email || "-"}</TableCell>
            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{supplier.materialsSupplied}</TableCell>
            <TableCell>
              <Badge
                variant={
                  supplier.status === "Active" ? "default"
                  : supplier.status === "Pending Review" ? "outline"
                  : "secondary"
                }
                className={cn(
                    supplier.status === "Active" && "bg-green-100 text-green-700 border-green-300",
                    supplier.status === "Pending Review" && "bg-yellow-100 text-yellow-700 border-yellow-300",
                    supplier.status === "Inactive" && "bg-muted text-muted-foreground"
                )}
              >
                {supplier.status}
              </Badge>
            </TableCell>
            {canManage && (
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditSupplier(supplier)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteSupplier(supplier.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

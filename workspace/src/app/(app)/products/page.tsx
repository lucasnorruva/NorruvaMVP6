
// --- File: page.tsx (Product Management List) ---
// Description: Main page for listing and managing all products.

"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Package as PackageIcon, CheckCircle2, FileText as FileTextIcon, ArrowDown, ArrowUp, ChevronsUpDown, PieChart, Edit3 } from "lucide-react"; // Added PieChart, Edit3
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import type { StoredUserProduct, DigitalProductPassport, DisplayableProduct } from "@/types/dpp";
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from "@/types/dpp";
import ProductManagementFiltersComponent, { type ProductManagementFilterState } from "@/components/products/ProductManagementFiltersComponent";
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { ProductListRow } from "@/components/products/ProductListRow";
import { calculateDppCompletenessForList } from "@/utils/dppDisplayUtils";
import { cn } from "@/lib/utils";
import { MOCK_DPPS as InitialMockDppsData } from '@/data';

const initialMockProductsData: DigitalProductPassport[] = InitialMockDppsData.map(dpp => ({
  ...dpp,
}));


type SortableProductKeys = keyof Pick<DisplayableProduct, 'id' | 'productName' | 'status' | 'compliance' | 'lastUpdated' | 'manufacturer'> | 'category' | 'completenessScore';

interface SortConfig {
  key: SortableProductKeys | null;
  direction: 'ascending' | 'descending' | null;
}

const SortableTableHead: React.FC<{
  columnKey: SortableProductKeys;
  title: string;
  onSort: (key: SortableProductKeys) => void;
  sortConfig: SortConfig;
  className?: string;
}> = ({ columnKey, title, onSort, sortConfig, className }) => {
  const isSorted = sortConfig.key === columnKey;
  const Icon = isSorted ? (sortConfig.direction === 'ascending' ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <TableHead className={cn("cursor-pointer hover:bg-muted/50 transition-colors", className)} onClick={() => onSort(columnKey)}>
      <div className="flex items-center gap-1">
        {title}
        <Icon className={cn("h-3.5 w-3.5", isSorted ? "text-primary" : "text-muted-foreground/70")} />
      </div>
    </TableHead>
  );
};

interface ProductWithCompleteness extends DisplayableProduct {
  completeness: { score: number; filledFields: number; totalFields: number; missingFields: string[] };
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers'];
}


export default function ProductsPage() {
  const { currentRole } = useRole();
  const [allProducts, setAllProducts] = useState<ProductWithCompleteness[]>([]);
  const [productToDelete, setProductToDelete] = useState<ProductWithCompleteness | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<ProductManagementFilterState>({
    searchQuery: "",
    status: "All",
    compliance: "All",
    category: "All",
    blockchainAnchored: "all",
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });

  useEffect(() => {
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    const userAddedStoredProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];

    const userAddedDisplayable: ProductWithCompleteness[] = userAddedStoredProducts.map(p => ({
      ...p,
      productName: p.productName || "Unnamed Product",
      compliance: p.compliance || "N/A",
      lastUpdated: p.lastUpdated || new Date().toISOString(),
      completeness: calculateDppCompletenessForList(p as DisplayableProduct),
    }));

    const initialDisplayable: ProductWithCompleteness[] = initialMockProductsData.map(mock => ({
      ...mock,
      status: mock.metadata.status, // Map metadata status to top-level status
      compliance: mock.complianceSummary?.overallStatus || "N/A",
      lastUpdated: mock.metadata.last_updated,
      manufacturer: mock.manufacturer?.name,
      completeness: calculateDppCompletenessForList(mock as unknown as DisplayableProduct), 
      blockchainIdentifiers: mock.blockchainIdentifiers,
    }));

    const combined = [
      ...initialDisplayable.filter(mock => !userAddedDisplayable.find(userProd => userProd.id === mock.id)),
      ...userAddedDisplayable
    ];
    setAllProducts(combined);
  }, []);

  const handleSort = (key: SortableProductKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let tempProducts = [...allProducts];

    if (filters.searchQuery) {
      const lowerSearchQuery = filters.searchQuery.toLowerCase();
      tempProducts = tempProducts.filter(p =>
        p.productName?.toLowerCase().includes(lowerSearchQuery) ||
        p.gtin?.toLowerCase().includes(lowerSearchQuery) ||
        p.manufacturer?.toLowerCase().includes(lowerSearchQuery)
      );
    }
    if (filters.status !== "All") {
      tempProducts = tempProducts.filter(p => p.status === filters.status);
    }
    if (filters.compliance !== "All") {
      tempProducts = tempProducts.filter(p => p.compliance === filters.compliance);
    }
    if (filters.category !== "All") {
      tempProducts = tempProducts.filter(p => (p.category || p.productCategory) === filters.category);
    }
    if (filters.blockchainAnchored && filters.blockchainAnchored !== "all") {
      if (filters.blockchainAnchored === "anchored") {
        tempProducts = tempProducts.filter(p => !!p.blockchainIdentifiers?.anchorTransactionHash);
      } else if (filters.blockchainAnchored === "not_anchored") {
        tempProducts = tempProducts.filter(p => !p.blockchainIdentifiers?.anchorTransactionHash);
      }
    }

    const getValue = (product: ProductWithCompleteness, key: SortableProductKeys) => {
      if (key === 'category') {
        return product.category || product.productCategory;
      }
      if (key === 'completenessScore') {
        return product.completeness.score;
      }
      return product[key as keyof ProductWithCompleteness];
    };

    if (sortConfig.key && sortConfig.direction) {
      tempProducts.sort((a, b) => {
        let valA = getValue(a, sortConfig.key!);
        let valB = getValue(b, sortConfig.key!);

        if (valA === undefined || valA === null) valA = (typeof valA === 'number') ? -Infinity : "";
        if (valB === undefined || valB === null) valB = (typeof valB === 'number') ? -Infinity : "";


        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return tempProducts;
  }, [filters, allProducts, sortConfig]);


  const openDeleteConfirmDialog = (product: ProductWithCompleteness) => {
    setProductToDelete(product);
    setIsAlertOpen(true);
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;

    if (productToDelete.id.startsWith("USER_PROD")) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      let userAddedProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      userAddedProducts = userAddedProducts.filter(p => p.id !== productToDelete.id);
      localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userAddedProducts));
    }

    setAllProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));

    toast({
      title: "Product Deleted",
      description: `Product "${productToDelete.productName || productToDelete.id}" has been deleted.`,
    });

    setIsAlertOpen(false);
    setProductToDelete(null);
  };

  const canAddProducts = currentRole === 'admin' || currentRole === 'manufacturer';

  const statusOptions = useMemo(() => ["All", ...new Set(allProducts.map(p => p.status).filter(Boolean).sort())], [allProducts]);
  const complianceOptions = useMemo(() => ["All", ...new Set(allProducts.map(p => p.compliance).filter(Boolean).sort())], [allProducts]);
  const categoryOptions = useMemo(() => ["All", ...new Set(allProducts.map(p => p.category || p.productCategory).filter(Boolean).sort())], [allProducts]);

  const summaryMetrics = useMemo(() => {
    const total = allProducts.length;
    const active = allProducts.filter(p => p.status === 'Active' || p.status === 'published').length;
    const draft = allProducts.filter(p => p.status === 'Draft' || p.status === 'draft').length;
    const issues = allProducts.filter(p => p.compliance === 'Non-Compliant' || p.compliance === 'Pending').length;
    const totalCompletenessScore = allProducts.reduce((sum, p) => sum + p.completeness.score, 0);
    const averageCompleteness = total > 0 ? (totalCompletenessScore / total).toFixed(1) + "%" : "0%";
    return { total, active, draft, issues, averageCompleteness };
  }, [allProducts]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Product Management</h1>
        {canAddProducts && (
          <Link href="/products/new" passHref>
            <Button variant="default">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Product
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard title="Total Products" value={summaryMetrics.total} icon={PackageIcon} />
        <MetricCard title="Active Products" value={summaryMetrics.active} icon={CheckCircle2} />
        <MetricCard title="Draft Products" value={summaryMetrics.draft} icon={Edit3} />
        <MetricCard title="Compliance Issues" value={summaryMetrics.issues} trendDirection={summaryMetrics.issues > 0 ? "up" : "neutral"} />
        <MetricCard title="Avg. DPP Completeness" value={summaryMetrics.averageCompleteness} icon={PieChart} />
      </div>

      <ProductManagementFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        complianceOptions={complianceOptions}
        categoryOptions={categoryOptions}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Product Inventory</CardTitle>
          <CardDescription>Manage and track all products in your system and their Digital Product Passports. Click headers to sort.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Image</TableHead>
                <SortableTableHead columnKey="id" title="ID" onSort={handleSort} sortConfig={sortConfig} />
                <SortableTableHead columnKey="productName" title="Name" onSort={handleSort} sortConfig={sortConfig} />
                <SortableTableHead columnKey="manufacturer" title="Manufacturer" onSort={handleSort} sortConfig={sortConfig} />
                <SortableTableHead columnKey="category" title="Category" onSort={handleSort} sortConfig={sortConfig} />
                <SortableTableHead columnKey="status" title="Status" onSort={handleSort} sortConfig={sortConfig} />
                <SortableTableHead columnKey="compliance" title="Compliance" onSort={handleSort} sortConfig={sortConfig} />
                <SortableTableHead columnKey="completenessScore" title="Completeness" onSort={handleSort} sortConfig={sortConfig} className="w-28" />
                <SortableTableHead columnKey="lastUpdated" title="Last Updated" onSort={handleSort} sortConfig={sortConfig} />
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedProducts.map((product) => (
                <ProductListRow
                    key={product.id}
                    product={product}
                    completenessData={product.completeness}
                    currentRole={currentRole}
                    onDeleteProduct={openDeleteConfirmDialog}
                />
              ))}
               {filteredAndSortedProducts.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">No products found matching your filters.</TableCell></TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{productToDelete?.productName || productToDelete?.id}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


// --- File: page.tsx (Product Management List) ---
// Description: Main page for listing and managing all products.

"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Package as PackageIcon, CheckCircle2, FileText as FileTextIconPg, ArrowDown, ArrowUp, ChevronsUpDown, PieChart, Edit3, Sigma, Upload, Download } from "lucide-react"; // Added Upload, Download
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Added Tooltip
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import type { StoredUserProduct, RichMockProduct, DisplayableProduct, DigitalProductPassport } from "@/types/dpp"; 
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from "@/types/dpp";
import ProductManagementFiltersComponent, { type ProductManagementFilterState } from "@/components/products/ProductManagementFiltersComponent";
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { ProductListRow } from "@/components/products/ProductListRow";
import { calculateDppCompletenessForList } from "@/utils/dppDisplayUtils";
import { cn } from "@/lib/utils";
import { MOCK_DPPS as InitialMockDppsData } from '@/data';

const initialMockProductsData: RichMockProduct[] = InitialMockDppsData.map(dpp => ({
  ...dpp,
  productId: dpp.id,
  status: dpp.metadata.status as RichMockProduct['status'], 
  compliance: dpp.complianceSummary?.overallStatus || "N/A", 
  lastUpdated: dpp.metadata.last_updated,
  description: dpp.productDetails?.description,
  imageUrl: dpp.productDetails?.imageUrl,
  imageHint: dpp.productDetails?.imageHint,
  materials: dpp.productDetails?.materials?.map(m => m.name).join(', '),
  sustainabilityClaims: dpp.productDetails?.sustainabilityClaims?.map(c => c.claim).join(', '),
  energyLabel: dpp.productDetails?.energyLabel,
  specifications: dpp.productDetails?.specifications,
  lifecycleEvents: dpp.lifecycleEvents?.map(e => ({ id: e.id, eventName: e.type, date: e.timestamp, status: 'Completed' })),
  complianceSummary: dpp.complianceSummary,
  ebsiVerification: dpp.ebsiVerification,
  certifications: dpp.certifications,
  documents: dpp.documents,
  supplyChainLinks: dpp.supplyChainLinks,
  customAttributes: dpp.productDetails?.customAttributes,
  blockchainIdentifiers: dpp.blockchainIdentifiers,
  authenticationVcId: dpp.authenticationVcId,
  ownershipNftLink: dpp.ownershipNftLink,
  metadata: dpp.metadata, 
}));


type SortableProductKeys = keyof Pick<DisplayableProduct, 'id' | 'productName' | 'status' | 'compliance' | 'lastUpdated' | 'manufacturer'> | 'category' | 'completenessScore' | 'metadata.onChainStatus';

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
  metadata?: Partial<DigitalProductPassport['metadata']>; 
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
      productId: p.id,
      complianceSummary: p.complianceSummary || { overallStatus: 'N/A', eprel: { status: 'N/A', lastChecked: p.lastUpdated }, ebsi: { status: 'N/A', lastChecked: p.lastUpdated } },
      lifecycleEvents: p.lifecycleEvents || [],
      supplyChainLinks: p.supplyChainLinks || [],
      completeness: calculateDppCompletenessForList(p as DisplayableProduct),
      metadata: p.metadata, 
    }));

    const initialDisplayable: ProductWithCompleteness[] = initialMockProductsData.map(mock => ({
      ...mock,
      productId: mock.productId || mock.id,
      complianceSummary: mock.complianceSummary || { overallStatus: 'N/A', eprel: { status: 'N/A', lastChecked: mock.lastUpdated }, ebsi: { status: 'N/A', lastChecked: mock.lastUpdated } },
      lifecycleEvents: mock.lifecycleEvents || [],
      supplyChainLinks: mock.supplyChainLinks || [],
      completeness: calculateDppCompletenessForList(mock as DisplayableProduct), 
      blockchainIdentifiers: mock.blockchainIdentifiers, 
      metadata: mock.metadata, 
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
      if (key === 'metadata.onChainStatus') { 
        return product.metadata?.onChainStatus;
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
    const active = allProducts.filter(p => p.status === 'Active').length;
    const draft = allProducts.filter(p => p.status === 'Draft').length;
    const issues = allProducts.filter(p => p.compliance === 'Non-Compliant' || p.compliance === 'Pending').length;
    const totalCompletenessScore = allProducts.reduce((sum, p) => sum + p.completeness.score, 0);
    const averageCompleteness = total > 0 ? (totalCompletenessScore / total).toFixed(1) + "%" : "0%";
    return { total, active, draft, issues, averageCompleteness };
  }, [allProducts]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Product Management</h1>
        <div className="flex items-center gap-2">
          {canAddProducts && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" disabled>
                    <Upload className="mr-2 h-4 w-4" /> Batch Update Selected
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Conceptual: Batch update selected products (Coming Soon)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" disabled>
                    <Download className="mr-2 h-4 w-4" /> Export Selected (CSV)
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Conceptual: Export selected products as CSV (Coming Soon)</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {canAddProducts && (
            <Link href="/products/new" passHref>
              <Button variant="default"> {/* Changed from secondary to default */}
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Product
              </Button>
            </Link>
          )}
        </div>
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
                <SortableTableHead columnKey="metadata.onChainStatus" title="On-Chain Status" onSort={handleSort} sortConfig={sortConfig} />
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
                <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground py-8">No products found matching your filters.</TableCell></TableRow>
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


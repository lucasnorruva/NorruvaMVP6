
// --- File: page.tsx (Product Management List) ---
// Description: Main page for listing and managing all products.

"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Package as PackageIcon, CheckCircle2, FileText as FileTextIconPg, ArrowDown, ArrowUp, ChevronsUpDown, PieChart, Edit3 } from "lucide-react"; // Added PieChart, Edit3
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
import type { StoredUserProduct, RichMockProduct, DisplayableProduct } from "@/types/dpp";
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from "@/types/dpp";
import ProductManagementFiltersComponent, { type ProductManagementFilterState } from "@/components/products/ProductManagementFiltersComponent";
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { ProductListRow } from "@/components/products/ProductListRow";
import { calculateDppCompletenessForList } from "@/utils/dppDisplayUtils";
import { cn } from "@/lib/utils";

const initialMockProductsData: RichMockProduct[] = [
  {
    id: "PROD001", productId: "PROD001", productName: "EcoFriendly Refrigerator X2000", category: "Appliances", status: "Active", compliance: "Compliant", lastUpdated: "2024-07-20",
    gtin: "01234567890123", manufacturer: "GreenTech Appliances", modelNumber: "X2000-ECO", description: "State-of-the-art energy efficient refrigerator.", imageUrl: "https://placehold.co/400x300.png", imageHint: "refrigerator appliance", materials: "Recycled Steel, Bio-polymers", sustainabilityClaims: "Energy Star Certified", energyLabel: "A+++", specifications: { "Capacity": "400L", "Warranty": "5 years" }, lifecycleEvents: [{id:"lc_mfg_001", eventName:"Manufacturing Complete", date: "2024-01-01", status: "Completed"}], complianceSummary: { overallStatus: "Compliant", eprel: {id: "EPREL123", status: "Registered", lastChecked: "2024-07-01"}, ebsi: {status: "Verified", lastChecked: "2024-07-01"} },
    supplyChainLinks: [
      { supplierId: "SUP001", suppliedItem: "Compressor Unit XJ-500", notes: "Primary compressor supplier for EU market. Audited for ethical sourcing." },
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels (70%)", notes: "Certified post-consumer recycled content." }
    ]
  },
  {
    id: "PROD002", productId: "PROD002", productName: "Smart LED Bulb Pack (4-pack)", category: "Electronics", status: "Active", compliance: "Pending", lastUpdated: "2024-07-18",
    gtin: "98765432109876", manufacturer: "BrightSpark Electronics", modelNumber: "BS-LED-S04B", description: "Tunable white and color smart LED bulbs.", imageUrl: "https://placehold.co/400x300.png", imageHint: "led bulbs", materials: "Polycarbonate, Aluminum", sustainabilityClaims: "Uses 85% less energy", energyLabel: "A+", specifications: { "Lumens": "800lm", "Connectivity": "Wi-Fi" }, batteryChemistry: "Li-ion", stateOfHealth: 99, carbonFootprintManufacturing: 5, recycledContentPercentage: 10,
    lifecycleEvents: [{id:"lc_mfg_002", eventName:"Manufacturing Complete", date: "2024-03-01", status: "Completed"}], complianceSummary: { overallStatus: "Pending Review", eprel: {status: "Pending", lastChecked: "2024-07-10"}, ebsi: {status: "Pending", lastChecked: "2024-07-10"} },
    supplyChainLinks: [
       { supplierId: "SUP004", suppliedItem: "LED Chips & Drivers", notes: "Specialized electronics supplier from Shanghai." }
    ]
  },
  {
    id: "PROD003", productId: "PROD003", productName: "Organic Cotton T-Shirt", category: "Apparel", status: "Archived", compliance: "Compliant", lastUpdated: "2024-06-10",
    description: "100% organic cotton t-shirt.", materials: "Organic Cotton", sustainabilityClaims: "GOTS Certified", imageUrl: "https://placehold.co/400x300.png", imageHint: "cotton t-shirt", manufacturer: "EcoThreads",
    specifications: {"Fit": "Regular", "Origin": "India"}, lifecycleEvents: [], complianceSummary: { overallStatus: "Compliant", eprel: {status: "N/A", lastChecked: "2024-06-01"}, ebsi: {status: "N/A", lastChecked: "2024-06-01"} }, supplyChainLinks: []
  },
  {
    id: "PROD004", productId: "PROD004", productName: "Recycled Plastic Water Bottle", category: "Homeware", status: "Active", compliance: "Non-Compliant", lastUpdated: "2024-07-21",
    description: "Made from 100% recycled ocean-bound plastic.", materials: "Recycled PET", sustainabilityClaims: "Reduces ocean plastic", imageUrl: "https://placehold.co/400x300.png", imageHint: "water bottle", manufacturer: "RePurpose Inc.",
    specifications: {"Volume": "500ml", "BPA-Free": "Yes"}, lifecycleEvents: [], complianceSummary: { overallStatus: "Non-Compliant", eprel: {status: "N/A", lastChecked: "2024-07-01"}, ebsi: {status: "N/A", lastChecked: "2024-07-01"} }, supplyChainLinks: []
  },
  {
    id: "PROD005", productId: "PROD005", productName: "Solar Powered Garden Light", category: "Outdoor", status: "Draft", compliance: "N/A", lastUpdated: "2024-07-22",
    description: "Solar-powered LED light for gardens.", materials: "Aluminum, Solar Panel", energyLabel: "N/A", imageUrl: "https://placehold.co/400x300.png", imageHint: "garden light", manufacturer: "SunBeam",
    specifications: {"Brightness": "100 lumens", "Battery life": "8 hours"}, lifecycleEvents: [], complianceSummary: { overallStatus: "N/A", eprel: {status: "N/A", lastChecked: "2024-07-01"}, ebsi: {status: "N/A", lastChecked: "2024-07-01"} }, supplyChainLinks: []
  },
];

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
}


export default function ProductsPage() {
  const { currentRole } = useRole();
  const [allProducts, setAllProducts] = useState<DisplayableProduct[]>([]);
  const [productToDelete, setProductToDelete] = useState<DisplayableProduct | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<ProductManagementFilterState>({
    searchQuery: "",
    status: "All",
    compliance: "All",
    category: "All",
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });

  useEffect(() => {
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    const userAddedStoredProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];

    const userAddedDisplayable: DisplayableProduct[] = userAddedStoredProducts.map(p => ({
      ...p,
      productId: p.id,
      complianceSummary: p.complianceSummary || { overallStatus: 'N/A', eprel: { status: 'N/A', lastChecked: p.lastUpdated }, ebsi: { status: 'N/A', lastChecked: p.lastUpdated } },
      lifecycleEvents: p.lifecycleEvents || [],
      supplyChainLinks: p.supplyChainLinks || [],
    }));

    const initialDisplayable: DisplayableProduct[] = initialMockProductsData.map(mock => ({
      ...mock,
      productId: mock.productId || mock.id,
      complianceSummary: mock.complianceSummary || { overallStatus: 'N/A', eprel: { status: 'N/A', lastChecked: mock.lastUpdated }, ebsi: { status: 'N/A', lastChecked: mock.lastUpdated } },
      lifecycleEvents: mock.lifecycleEvents || [],
      supplyChainLinks: mock.supplyChainLinks || [],
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

  const productsWithCompleteness: ProductWithCompleteness[] = useMemo(() => {
    return allProducts.map(p => ({
      ...p,
      completeness: calculateDppCompletenessForList(p)
    }));
  }, [allProducts]);


  const filteredAndSortedProducts = useMemo(() => {
    let tempProducts = [...productsWithCompleteness];

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

    if (sortConfig.key && sortConfig.direction) {
      tempProducts.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortConfig.key === 'category') {
          valA = a.category || a.productCategory;
          valB = b.category || b.productCategory;
        } else if (sortConfig.key === 'completenessScore') {
          valA = a.completeness.score;
          valB = b.completeness.score;
        } else {
          valA = (a as any)[sortConfig.key!];
          valB = (b as any)[sortConfig.key!];
        }

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
  }, [filters, productsWithCompleteness, sortConfig]);


  const openDeleteConfirmDialog = (product: DisplayableProduct) => {
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
    const totalCompletenessScore = productsWithCompleteness.reduce((sum, p) => sum + p.completeness.score, 0);
    const averageCompleteness = total > 0 ? (totalCompletenessScore / total).toFixed(1) + "%" : "0%";
    return { total, active, draft, issues, averageCompleteness };
  }, [allProducts, productsWithCompleteness]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Product Management</h1>
        {canAddProducts && (
          <Link href="/products/new" passHref>
            <Button variant="secondary">
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

    

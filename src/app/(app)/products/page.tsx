
"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { ProductFormData as ProductFormDataType } from "@/components/products/ProductForm";
import ProductManagementFiltersComponent, { type ProductManagementFilterState } from "@/components/products/ProductManagementFiltersComponent";

// Represents product data stored by user interactions
interface StoredUserProduct extends ProductFormDataType {
  id: string;
  status: string;
  compliance: string;
  lastUpdated: string;
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  productDescriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  manufacturerOrigin?: 'AI_EXTRACTED' | 'manual';
  modelNumberOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsOrigin?: 'AI_EXTRACTED' | 'manual';
  sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
  energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
  specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
  batteryChemistryOrigin?: 'AI_EXTRACTED' | 'manual';
  stateOfHealthOrigin?: 'AI_EXTRACTED' | 'manual';
  carbonFootprintManufacturingOrigin?: 'AI_EXTRACTED' | 'manual';
  recycledContentPercentageOrigin?: 'AI_EXTRACTED' | 'manual';
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
}

// Represents the structure for initial mock products
interface RichMockProduct {
  id: string;
  productId: string;
  productName: string;
  category?: string;
  status: string;
  compliance: string;
  lastUpdated: string;
  gtin?: string;
  manufacturer?: string;
  modelNumber?: string;
  description?: string;
  imageUrl?: string;
  materials?: string;
  sustainabilityClaims?: string;
  energyLabel?: string;
  specifications?: Record<string, string> | string;
  lifecycleEvents?: Array<any>;
  complianceData?: Record<string, any>;
  batteryChemistry?: string;
  stateOfHealth?: number;
  carbonFootprintManufacturing?: number;
  recycledContentPercentage?: number;
}

// A unified type for products displayed in the list
export interface DisplayableProduct {
  id: string;
  productId?: string;
  productName?: string;
  category?: string;
  productCategory?: string; // From ProductFormDataType
  status: string;
  compliance: string;
  lastUpdated: string;
  gtin?: string;
  manufacturer?: string;
  modelNumber?: string;
  description?: string;
  productDescription?: string; // From ProductFormDataType
  imageUrl?: string;
  materials?: string;
  sustainabilityClaims?: string;
  energyLabel?: string;
  specifications?: Record<string, string> | string;
  lifecycleEvents?: Array<any>;
  complianceData?: Record<string, any>;
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
}

const initialMockProductsData: RichMockProduct[] = [
  {
    id: "PROD001", productId: "PROD001", productName: "EcoFriendly Refrigerator X2000", category: "Appliances", status: "Active", compliance: "Compliant", lastUpdated: "2024-07-20",
    gtin: "01234567890123", manufacturer: "GreenTech Appliances", modelNumber: "X2000-ECO", description: "State-of-the-art energy efficient refrigerator.", imageUrl: "https://placehold.co/600x400.png?text=PROD001", materials: "Recycled Steel, Bio-polymers", sustainabilityClaims: "Energy Star Certified", energyLabel: "A+++", specifications: { "Capacity": "400L", "Warranty": "5 years" }, lifecycleEvents: [{id:"lc_mfg_001", name:"Manufacturing"}], complianceData: {REACH: {status:"Compliant"}},
  },
  {
    id: "PROD002", productId: "PROD002", productName: "Smart LED Bulb Pack (4-pack)", category: "Electronics", status: "Active", compliance: "Pending", lastUpdated: "2024-07-18",
    gtin: "98765432109876", manufacturer: "BrightSpark Electronics", modelNumber: "BS-LED-S04B", description: "Tunable white and color smart LED bulbs.", imageUrl: "https://placehold.co/600x400.png?text=PROD002", materials: "Polycarbonate, Aluminum", sustainabilityClaims: "Uses 85% less energy", energyLabel: "A+", specifications: { "Lumens": "800lm", "Connectivity": "Wi-Fi" }, batteryChemistry: "Li-ion", stateOfHealth: 99, carbonFootprintManufacturing: 5, recycledContentPercentage: 10,
    lifecycleEvents: [{id:"lc_mfg_002", name:"Manufacturing"}], complianceData: {RoHS: {status:"Compliant"}},
  },
  {
    id: "PROD003", productId: "PROD003", productName: "Organic Cotton T-Shirt", category: "Apparel", status: "Archived", compliance: "Compliant", lastUpdated: "2024-06-10",
    description: "100% organic cotton t-shirt.", materials: "Organic Cotton", sustainabilityClaims: "GOTS Certified", imageUrl: "https://placehold.co/600x400.png?text=PROD003", manufacturer: "EcoThreads",
    specifications: {"Fit": "Regular", "Origin": "India"}, lifecycleEvents: [], complianceData: {},
  },
  {
    id: "PROD004", productId: "PROD004", productName: "Recycled Plastic Water Bottle", category: "Homeware", status: "Active", compliance: "Non-Compliant", lastUpdated: "2024-07-21",
    description: "Made from 100% recycled ocean-bound plastic.", materials: "Recycled PET", sustainabilityClaims: "Reduces ocean plastic", imageUrl: "https://placehold.co/600x400.png?text=PROD004", manufacturer: "RePurpose Inc.",
    specifications: {"Volume": "500ml", "BPA-Free": "Yes"}, lifecycleEvents: [], complianceData: {},
  },
  {
    id: "PROD005", productId: "PROD005", productName: "Solar Powered Garden Light", category: "Outdoor", status: "Draft", compliance: "N/A", lastUpdated: "2024-07-22",
    description: "Solar-powered LED light for gardens.", materials: "Aluminum, Solar Panel", energyLabel: "N/A", imageUrl: "https://placehold.co/600x400.png?text=PROD005", manufacturer: "SunBeam",
    specifications: {"Brightness": "100 lumens", "Battery life": "8 hours"}, lifecycleEvents: [], complianceData: {},
  },
];

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

const calculateDppCompletenessForList = (product: DisplayableProduct): { score: number; filledFields: number; totalFields: number; missingFields: string[] } => {
  const essentialFieldsConfig: Array<{ key: keyof DisplayableProduct; label: string; check?: (p: DisplayableProduct) => boolean; categoryScope?: string[] }> = [
    { key: 'productName', label: 'Product Name' },
    { key: 'gtin', label: 'GTIN' },
    { key: 'category', label: 'Category', check: p => !!(p.category || p.productCategory) },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'modelNumber', label: 'Model Number' },
    { key: 'description', label: 'Description', check: p => !!(p.description || p.productDescription) },
    { key: 'imageUrl', label: 'Image URL', check: (p) => !!p.imageUrl && !p.imageUrl.includes('placehold.co') && !p.imageUrl.includes('?text=') },
    { key: 'materials', label: 'Materials' },
    { key: 'sustainabilityClaims', label: 'Sustainability Claims' },
    { key: 'energyLabel', label: 'Energy Label', categoryScope: ['Appliances', 'Electronics'] },
    { key: 'specifications', label: 'Specifications', check: (p) => {
        if (typeof p.specifications === 'string') return !!p.specifications && p.specifications.trim() !== '' && p.specifications.trim() !== '{}';
        if (typeof p.specifications === 'object' && p.specifications !== null) return Object.keys(p.specifications).length > 0;
        return false;
      }
    },
    { key: 'lifecycleEvents', label: 'Lifecycle Events', check: (p) => (p.lifecycleEvents || []).length > 0 },
    { key: 'complianceData', label: 'Compliance Data', check: (p) => p.complianceData && Object.keys(p.complianceData).length > 0 },
  ];

  const currentCategory = product.category || product.productCategory;
  const isBatteryRelevantCategory = currentCategory?.toLowerCase().includes('electronics') || currentCategory?.toLowerCase().includes('automotive parts') || currentCategory?.toLowerCase().includes('battery');

  if (isBatteryRelevantCategory || product.batteryChemistry) {
    essentialFieldsConfig.push({ key: 'batteryChemistry', label: 'Battery Chemistry' });
    essentialFieldsConfig.push({ key: 'stateOfHealth', label: 'Battery State of Health (SoH)', check: p => typeof p.stateOfHealth === 'number' });
    essentialFieldsConfig.push({ key: 'carbonFootprintManufacturing', label: 'Battery Mfg. Carbon Footprint', check: p => typeof p.carbonFootprintManufacturing === 'number' });
    essentialFieldsConfig.push({ key: 'recycledContentPercentage', label: 'Battery Recycled Content', check: p => typeof p.recycledContentPercentage === 'number' });
  }

  let filledCount = 0;
  const missingFields: string[] = [];
  let actualTotalFields = 0;

  essentialFieldsConfig.forEach(fieldConfig => {
    if (fieldConfig.categoryScope) {
      const productCategoryLower = currentCategory?.toLowerCase();
      if (!productCategoryLower || !fieldConfig.categoryScope.some(scope => productCategoryLower.includes(scope.toLowerCase()))) { return; }
    }
    actualTotalFields++;

    const value = product[fieldConfig.key];
    let isFieldFilled = false;

    if (fieldConfig.check) {
      isFieldFilled = fieldConfig.check(product);
    } else {
      if (typeof value === 'object' && value !== null) {
        isFieldFilled = Object.keys(value).length > 0;
      } else {
        isFieldFilled = value !== null && value !== undefined && String(value).trim() !== '' && String(value).trim() !== 'N/A';
      }
    }

    if (isFieldFilled) {
      filledCount++;
    } else {
      missingFields.push(fieldConfig.label);
    }
  });

  const score = actualTotalFields > 0 ? Math.round((filledCount / actualTotalFields) * 100) : 0;
  return { score, filledFields: filledCount, totalFields: actualTotalFields, missingFields };
};


export default function ProductsPage() {
  const { currentRole } = useRole();
  const [allProducts, setAllProducts] = useState<DisplayableProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DisplayableProduct[]>([]);
  const [productToDelete, setProductToDelete] = useState<DisplayableProduct | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<ProductManagementFilterState>({
    searchQuery: "",
    status: "All",
    compliance: "All",
    category: "All",
  });

  useEffect(() => {
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    const userAddedStoredProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];

    const userAddedDisplayableProducts: DisplayableProduct[] = userAddedStoredProducts.map(p => ({
      ...p,
      id: p.id,
      productId: p.id,
    }));

    const initialDisplayableProducts: DisplayableProduct[] = initialMockProductsData.map(mock => ({
      ...mock,
    }));

    const combined = [
      ...initialDisplayableProducts.filter(mock => !userAddedDisplayableProducts.find(userProd => userProd.id === mock.id)),
      ...userAddedDisplayableProducts
    ];
    setAllProducts(combined);
  }, []);

  useEffect(() => {
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

    setFilteredProducts(tempProducts.sort((a, b) => (a.id || "").localeCompare(b.id || "")));
  }, [filters, allProducts]);


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

    setAllProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id)); // Update allProducts, useEffect will update filteredProducts

    toast({
      title: "Product Deleted",
      description: `Product "${productToDelete.productName}" has been deleted.`,
    });

    setIsAlertOpen(false);
    setProductToDelete(null);
  };

  const canAddProducts = currentRole === 'admin' || currentRole === 'manufacturer';
  const canEditProducts = currentRole === 'admin' || currentRole === 'manufacturer';
  const canDeleteProducts = currentRole === 'admin' || currentRole === 'manufacturer';

  const statusOptions = useMemo(() => ["All", ...new Set(allProducts.map(p => p.status).filter(Boolean).sort())], [allProducts]);
  const complianceOptions = useMemo(() => ["All", ...new Set(allProducts.map(p => p.compliance).filter(Boolean).sort())], [allProducts]);
  const categoryOptions = useMemo(() => ["All", ...new Set(allProducts.map(p => p.category || p.productCategory).filter(Boolean).sort())], [allProducts]);

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
          <CardDescription>Manage and track all products in your system and their Digital Product Passports.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Completeness</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const completeness = calculateDppCompletenessForList(product);
                const currentProductName = product.productName || "Unnamed Product";
                const currentCategory = product.category || product.productCategory || "N/A";
                return (
                <TableRow key={product.id}>
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
                  <TableCell>{currentCategory}</TableCell>
                  <TableCell>
                    <Badge variant={
                      product.status === "Active" ? "default" :
                      product.status === "Archived" ? "secondary" : "outline"
                    } className={
                      product.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                      product.status === "Archived" ? "bg-muted text-muted-foreground border-border" :
                      "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
                    }>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant={
                        product.compliance === "Compliant" ? "default" :
                        product.compliance === "Pending" ? "outline" :
                        product.compliance === "N/A" ? "secondary" : "destructive"
                      } className={
                        product.compliance === "Compliant" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                        product.compliance === "Pending" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                        product.compliance === "N/A" ? "bg-muted text-muted-foreground border-border" :
                        "bg-red-500/20 text-red-700 border-red-500/30"
                      }>
                       {product.compliance}
                     </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center w-28 cursor-help">
                            <Progress value={completeness.score} className="h-2.5 flex-grow" />
                            <span className="text-xs text-muted-foreground ml-2">{completeness.score}%</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent align="start" className="bg-background shadow-lg p-3 rounded-md border max-w-xs">
                          <p className="font-medium text-sm mb-1">DPP Completeness: {completeness.score}%</p>
                          <p className="text-xs text-muted-foreground mb-1">({completeness.filledFields}/{completeness.totalFields} fields filled)</p>
                          {completeness.missingFields.length > 0 ? (
                            <>
                              <p className="text-xs font-semibold mt-2">Missing fields:</p>
                              <ul className="list-disc list-inside text-xs text-muted-foreground max-h-32 overflow-y-auto">
                                {completeness.missingFields.map(field => <li key={field}>{field}</li>)}
                              </ul>
                            </>
                          ) : (
                            <p className="text-xs text-green-600 flex items-center"><CheckCircle2 className="mr-1 h-3 w-3"/>All essential fields filled!</p>
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {canEditProducts && product.id.startsWith("USER_PROD") && (
                            <DropdownMenuItem asChild>
                                <Link href={`/products/new?edit=${product.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDeleteProducts && (
                            <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => openDeleteConfirmDialog(product)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                            </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );})}
               {filteredProducts.length === 0 && (
                <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No products found matching your filters.
                    </TableCell>
                </TableRow>
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

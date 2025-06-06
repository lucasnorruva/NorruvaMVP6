
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { DashboardFiltersComponent } from "@/components/dpp-dashboard/DashboardFiltersComponent";
import type { DigitalProductPassport, DashboardFiltersState, EbsiVerificationDetails } from "@/types/dpp";
import { MOCK_DPPS } from "@/types/dpp"; // Import mock data
import { BarChart3, CheckSquare, Clock, Eye, PlusCircle, ScanEye, Percent, Users, QrCode, Camera } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
import { DPPTable } from "@/components/dpp-dashboard/DPPTable"; // Ensure DPPTable is imported

const availableRegulations = [
  { value: "all", label: "All Regulations" },
  { value: "eu_espr", label: "EU ESPR" },
  { value: "us_scope3", label: "US Scope 3" },
  { value: "battery_regulation", label: "EU Battery Regulation" },
];

type SortableKeys = keyof DigitalProductPassport | 'metadata.status' | 'metadata.last_updated' | 'overallCompliance' | 'ebsiVerification.status';

interface SortConfig {
  key: SortableKeys | null;
  direction: 'ascending' | 'descending' | null;
}

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

export default function DPPLiveDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [dpps, setDpps] = useState<DigitalProductPassport[]>([]);
  const [filters, setFilters] = useState<DashboardFiltersState>({
    status: "all",
    regulation: "all",
    category: "all",
    searchQuery: "",
    blockchainAnchored: "all", 
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });
  const [manualProductId, setManualProductId] = useState("");
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  useEffect(() => {
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    const userAddedProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
    
    const combinedProducts = [
      ...MOCK_DPPS.filter(mockDpp => !userAddedProducts.find(userDpp => userDpp.id === mockDpp.id)),
      ...userAddedProducts
    ];
    setDpps(combinedProducts);
  }, []);

  const availableCategories = useMemo(() => {
    const categories = new Set(dpps.map(dpp => dpp.category));
    return Array.from(categories).sort();
  }, [dpps]);

  const sortedAndFilteredDPPs = useMemo(() => {
    let filtered = dpps.filter((dpp) => {
      if (filters.searchQuery && !dpp.productName.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.status !== "all" && dpp.metadata.status !== filters.status) {
        return false;
      }
      if (filters.regulation !== "all") {
        const complianceData = dpp.compliance[filters.regulation as keyof typeof dpp.compliance];
        if (!complianceData || (typeof complianceData === 'object' && 'status' in complianceData && complianceData.status !== 'compliant')) {
          return false;
        }
      }
      if (filters.category !== "all" && dpp.category !== filters.category) {
        return false;
      }
      if (filters.blockchainAnchored === 'anchored' && !dpp.blockchainIdentifiers?.anchorTransactionHash) {
        return false;
      }
      if (filters.blockchainAnchored === 'not_anchored' && dpp.blockchainIdentifiers?.anchorTransactionHash) {
        return false;
      }
      return true;
    });

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let valA: any, valB: any;

        if (sortConfig.key === 'metadata.status') {
          valA = a.metadata.status;
          valB = b.metadata.status;
        } else if (sortConfig.key === 'metadata.last_updated') {
          valA = new Date(a.metadata.last_updated).getTime();
          valB = new Date(b.metadata.last_updated).getTime();
        } else if (sortConfig.key === 'ebsiVerification.status') {
          valA = a.ebsiVerification?.status;
          valB = b.ebsiVerification?.status;
        } else if (sortConfig.key === 'id' || sortConfig.key === 'productName' || sortConfig.key === 'category') {
           valA = a[sortConfig.key as keyof DigitalProductPassport];
           valB = b[sortConfig.key as keyof DigitalProductPassport];
        } else {
            valA = a[sortConfig.key as keyof DigitalProductPassport];
            valB = b[sortConfig.key as keyof DigitalProductPassport];
        }


        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        
        // Consistent sorting for undefined/null values (e.g., sort them to the end)
        const valAExists = valA !== undefined && valA !== null && valA !== "";
        const valBExists = valB !== undefined && valB !== null && valB !== "";

        if (!valAExists && valBExists) return sortConfig.direction === 'ascending' ? 1 : -1;
        if (valAExists && !valBExists) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (!valAExists && !valBExists) return 0;


        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [dpps, filters, sortConfig]);

  const metrics = useMemo(() => {
    const totalDPPs = dpps.length;
    const fullyCompliantDPPsCount = dpps.filter(dpp => {
        const regulationChecks = Object.values(dpp.compliance).filter(Boolean);
        if (regulationChecks.length === 0 && Object.keys(dpp.compliance).length > 0) return false; 
        if (regulationChecks.length === 0 && Object.keys(dpp.compliance).length === 0) return true; 
        return regulationChecks.every(r => typeof r === 'object' && r !== null && 'status' in r && r.status === 'compliant');
    }).length;
    const compliantPercentage = totalDPPs > 0 ? ((fullyCompliantDPPsCount / totalDPPs) * 100).toFixed(1) + "%" : "0%";
    const pendingReviewDPPs = dpps.filter(d => d.metadata.status === 'pending_review').length;
    const totalConsumerScans = dpps.reduce((sum, dpp) => sum + (dpp.consumerScans || 0), 0);
    const averageConsumerScans = totalDPPs > 0 ? (totalConsumerScans / totalDPPs).toFixed(1) : "0";

    return {
      totalDPPs,
      compliantPercentage,
      pendingReviewDPPs,
      totalConsumerScans,
      averageConsumerScans,
    };
  }, [dpps]);

  const handleFiltersChange = (newFilters: Partial<DashboardFiltersState>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const handleSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFindProductFromScan = () => {
    if (manualProductId.trim()) {
      const productExists = MOCK_DPPS.some(p => p.id === manualProductId.trim()) || dpps.some(p => p.id === manualProductId.trim());
      if (productExists) {
        router.push(`/passport/${manualProductId.trim()}`); 
        setIsScanDialogOpen(false);
        setManualProductId("");
      } else {
        toast({
          variant: "destructive",
          title: "Product Not Found",
          description: `Product with ID "${manualProductId.trim()}" was not found.`,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter a Product ID to find.",
      });
    }
  };

  const handleDeleteRequest = (productId: string) => {
    setProductToDeleteId(productId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (!productToDeleteId) return;

    const productIsUserAdded = productToDeleteId.startsWith("USER_PROD");
    
    if (productIsUserAdded) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      let userProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      userProducts = userProducts.filter(p => p.id !== productToDeleteId);
      localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
    }

    setDpps(prevDpps => prevDpps.filter(p => p.id !== productToDeleteId));
    
    const productName = dpps.find(p=>p.id === productToDeleteId)?.productName || productToDeleteId;
    toast({
      title: "Product Deleted",
      description: `Product "${productName}" has been deleted.`,
    });

    setIsDeleteDialogOpen(false);
    setProductToDeleteId(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold text-primary">
          Live DPP Dashboard
        </h1>
        <div className="flex gap-2">
           <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <QrCode className="mr-2 h-5 w-5" />
                Scan Product QR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Scan Product QR Code</DialogTitle>
                <DialogDescription>
                  This is a mock scanner. In a real app, you could use your camera. For now, enter a Product ID manually to view its public passport.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4 h-48 bg-muted border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Camera feed would appear here.</p>
                <p className="text-xs text-muted-foreground">(Camera access not implemented)</p>
              </div>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="manual-product-id" className="text-right col-span-1">
                    Product ID
                  </Label>
                  <Input
                    id="manual-product-id"
                    value={manualProductId}
                    onChange={(e) => setManualProductId(e.target.value)}
                    placeholder="e.g., DPP001"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleFindProductFromScan}>Find Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link href="/products/new" passHref>
            <Button variant="secondary">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New DPP
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard title="Total DPPs" value={metrics.totalDPPs} trend="+2%" trendDirection="up" icon={BarChart3} />
        <MetricCard title="Fully Compliant" value={metrics.compliantPercentage} trend="+1.5%" trendDirection="up" icon={Percent} />
        <MetricCard title="Pending Review" value={metrics.pendingReviewDPPs} trend={metrics.pendingReviewDPPs > 0 ? `+${metrics.pendingReviewDPPs - (metrics.pendingReviewDPPs > 1 ? 1: 0) }` : "0"} trendDirection={metrics.pendingReviewDPPs > 1 ? "up" : (metrics.pendingReviewDPPs === 1 ? "up" : "neutral")} icon={Clock} />
        <MetricCard title="Total Consumer Scans" value={metrics.totalConsumerScans.toLocaleString()} trend="+8%" trendDirection="up" icon={ScanEye} />
        <MetricCard title="Avg. Scans / DPP" value={metrics.averageConsumerScans} trend="+0.5" trendDirection="up" icon={Users} />
      </div>
      
      <DashboardFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableRegulations={availableRegulations}
        availableCategories={availableCategories}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Digital Product Passports</CardTitle>
          <CardDescription>Overview of all managed DPPs. Click ID to view details. Click headers to sort.</CardDescription>
        </CardHeader>
        <CardContent>
          <DPPTable dpps={sortedAndFilteredDPPs} onSort={handleSort} sortConfig={sortConfig} onDeleteProduct={handleDeleteRequest} />
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{dpps.find(p=>p.id === productToDeleteId)?.productName || productToDeleteId}".
              {productToDeleteId && !productToDeleteId.startsWith("USER_PROD") && " (This is a system mock product; deletion will only remove it from view for this session.)"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}


// --- File: page.tsx (DPP Live Dashboard) ---
// Description: Main page component for the Digital Product Passport Live Dashboard.
"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 as DeleteIcon } from "lucide-react"; // Renamed Trash2 to avoid conflict
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
import { DashboardFiltersComponent } from "@/components/dpp-dashboard/DashboardFiltersComponent";
import { DPPTable } from "@/components/dpp-dashboard/DPPTable";
import { DashboardMetrics } from "@/components/dpp-live-dashboard/DashboardMetrics";
import { ScanProductDialog } from "@/components/dpp-live-dashboard/ScanProductDialog"; // Import new component
import { AiSummaryDialog } from "@/components/dpp-live-dashboard/AiSummaryDialog";
import { useDPPLiveData } from '@/hooks/useDPPLiveData';
import { generateProductSummary } from '@/ai/flows/generate-product-summary.ts';
import type { DigitalProductPassport } from "@/types/dpp";

const availableRegulations = [
  { value: "all", label: "All Regulations" },
  { value: "eu_espr", label: "EU ESPR" },
  { value: "us_scope3", label: "US Scope 3" },
  { value: "battery_regulation", label: "EU Battery Regulation" },
];

export default function DPPLiveDashboardPage() {
  const {
    dpps, // Full list of DPPs from the hook
    filters,
    sortConfig,
    productToDeleteId,
    isDeleteDialogOpen,
    availableCategories,
    sortedAndFilteredDPPs, // This is the list to render
    metrics,
    handleFiltersChange,
    handleSort,
    handleDeleteRequest,
    confirmDeleteProduct,
    setIsDeleteDialogOpen,
    toast
  } = useDPPLiveData();

  const [isAiSummaryModalOpen, setIsAiSummaryModalOpen] = useState(false);
  const [currentAiSummary, setCurrentAiSummary] = useState<string | null>(null);
  const [isLoadingAiSummary, setIsLoadingAiSummary] = useState(false);
  const [selectedProductForSummary, setSelectedProductForSummary] = useState<DigitalProductPassport | null>(null);

  const handleViewAISummary = useCallback(async (productId: string) => {
    const product = dpps.find(p => p.id === productId);
    if (!product) {
      toast({ title: "Error", description: "Product not found for AI summary.", variant: "destructive" });
      return;
    }
    setSelectedProductForSummary(product);
    setIsLoadingAiSummary(true);
    setIsAiSummaryModalOpen(true);
    setCurrentAiSummary(null);

    try {
      const sustainabilityInfoParts = [
        product.productDetails?.sustainabilityClaims?.map(c => c.claim).join(', '),
        product.productDetails?.materials?.map(m => `${m.name} (${m.isRecycled ? 'recycled' : 'virgin'})`).join(', '),
        product.productDetails?.energyLabel ? `Energy Label: ${product.productDetails.energyLabel}` : '',
        product.productDetails?.repairabilityScore ? `Repairability: ${product.productDetails.repairabilityScore.value}/${product.productDetails.repairabilityScore.scale}` : '',
      ].filter(Boolean).join(". ");

      const complianceInfoParts = [
        product.compliance.eprelId ? `EPREL ID: ${product.compliance.eprelId}` : '',
        product.compliance.esprConformity ? `ESPR Status: ${product.compliance.esprConformity.status}` : '',
        product.compliance.battery_regulation ? `Battery Reg. Status: ${product.compliance.battery_regulation.status}` : '',
        product.ebsiVerification?.status ? `EBSI Status: ${product.ebsiVerification.status}` : '',
      ].filter(Boolean).join(". ");

      const input = {
        productName: product.productName,
        productDescription: product.productDetails?.description || `A product in the ${product.category} category.`,
        sustainabilityInformation: sustainabilityInfoParts || "General sustainability information not detailed.",
        complianceInformation: complianceInfoParts || "General compliance information not detailed.",
      };
      const result = await generateProductSummary(input);
      setCurrentAiSummary(result.summary);
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
      toast({ title: "AI Summary Error", description: "Could not generate summary at this time.", variant: "destructive" });
      setCurrentAiSummary("Failed to load summary.");
    } finally {
      setIsLoadingAiSummary(false);
    }
  }, [dpps, toast]);


  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold text-primary">Live DPP Dashboard</h1>
        <div className="flex gap-2">
          <ScanProductDialog allDpps={dpps} /> {/* Use the dpps state from the hook */}
          <Link href="/products/new" passHref>
            <Button variant="secondary"><PlusCircle className="mr-2 h-5 w-5" />Create New DPP</Button>
          </Link>
        </div>
      </div>

      <DashboardMetrics metrics={metrics} />
      
      <DashboardFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableRegulations={availableRegulations}
        availableCategories={availableCategories}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Digital Product Passports</CardTitle>
          <CardDescription>Overview of all managed DPPs. Click ID for public view, or Actions for more options.</CardDescription>
        </CardHeader>
        <CardContent>
          <DPPTable 
            dpps={sortedAndFilteredDPPs} 
            onSort={handleSort} 
            sortConfig={sortConfig} 
            onDeleteProduct={handleDeleteRequest}
            onViewAiSummary={handleViewAISummary}
          />
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete product "{dpps.find(p=>p.id === productToDeleteId)?.productName || productToDeleteId}".
              {productToDeleteId && !productToDeleteId.startsWith("USER_PROD") && " (This is a system mock product; deletion is temporary for this session.)"}
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

      <AiSummaryDialog
        isOpen={isAiSummaryModalOpen}
        onOpenChange={setIsAiSummaryModalOpen}
        summary={currentAiSummary}
        isLoading={isLoadingAiSummary}
        product={selectedProductForSummary}
      />
    </div>
  );
}

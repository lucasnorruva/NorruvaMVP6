
// --- File: page.tsx (DPP Live Dashboard) ---
// Description: Main page component for the Digital Product Passport Live Dashboard.
"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react"; // Renamed Trash2 to avoid conflict
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
      const sustainabilityInfoParts = [];
      if (product.productDetails?.sustainabilityClaims && product.productDetails.sustainabilityClaims.length > 0) {
        sustainabilityInfoParts.push(product.productDetails.sustainabilityClaims.map(c => c.claim).join(', '));
      }
      if (product.productDetails?.materials && product.productDetails.materials.length > 0) {
        sustainabilityInfoParts.push("Materials: " + product.productDetails.materials.map(m => `${m.name}${m.isRecycled ? ' (recycled)' : ''}`).join(', '));
      }
      if (product.productDetails?.energyLabel) {
        sustainabilityInfoParts.push(`Energy Label: ${product.productDetails.energyLabel}`);
      }
      if (product.productDetails?.repairabilityScore) {
        sustainabilityInfoParts.push(`Repairability Score: ${product.productDetails.repairabilityScore.value}/${product.productDetails.repairabilityScore.scale}`);
      }
      const sustainabilityInformation = sustainabilityInfoParts.filter(Boolean).join(". ") || "General sustainability information not detailed.";

      const complianceInfoParts = [];
      if (product.compliance.eprel) {
        let eprelStr = "EPREL: ";
        if (product.compliance.eprel.id) eprelStr += `ID ${product.compliance.eprel.id}, `;
        eprelStr += `Status ${product.compliance.eprel.status}`;
        complianceInfoParts.push(eprelStr);
      }
      if (product.compliance.esprConformity) {
        complianceInfoParts.push(`ESPR Conformity: ${product.compliance.esprConformity.status}`);
      }
      if (product.compliance.battery_regulation) {
        complianceInfoParts.push(`Battery Regulation: ${product.compliance.battery_regulation.status}`);
      }
      if (product.ebsiVerification?.status) {
        const ebsiStatusText = product.ebsiVerification.status.replace(/_/g, ' ');
        complianceInfoParts.push(`EBSI Status: ${ebsiStatusText.charAt(0).toUpperCase() + ebsiStatusText.slice(1)}`);
      }
      const complianceInformation = complianceInfoParts.filter(Boolean).join(". ") || "General compliance information not detailed.";


      const input = {
        productName: product.productName,
        productDescription: product.productDetails?.description || `A product in the ${product.category} category. No detailed description available.`,
        sustainabilityInformation: sustainabilityInformation,
        complianceInformation: complianceInformation,
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


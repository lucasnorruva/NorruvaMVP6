// --- File: ComplianceTab.tsx ---
// Description: Displays compliance-related information for a product.
"use client";

import type { SimpleProductDetail, ComplianceDetailItem as SpecificComplianceDetailItemFromDPP } from "@/types/dpp";
import ProductComplianceHeader from "./ProductComplianceHeader";
import ComplianceDetailItemDisplay, { type ComplianceDetailItemProps } from "./ComplianceDetailItemDisplay"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ListChecks, RefreshCw, Loader2, Info as InfoIconFromLucide, FileText, Fingerprint, Database, Anchor, BatteryCharging, ShieldCheck, Bot, AlertTriangle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateComplianceSummaryForCategory } from "@/ai/flows/generate-compliance-summary-for-category"; 
import { useToast } from "@/hooks/use-toast"; 


interface ComplianceTabProps {
  product: SimpleProductDetail;
  onSyncEprel: () => Promise<void>;
  isSyncingEprel: boolean;
  canSyncEprel: boolean;
}

export default function ComplianceTab({ product, onSyncEprel, isSyncingEprel, canSyncEprel }: ComplianceTabProps) {
  const summary = product.complianceSummary;
  const { toast } = useToast(); 

  const [categoryComplianceSummaryForTab, setCategoryComplianceSummaryForTab] = useState<string | null>(null); 
  const [isLoadingCategoryComplianceForTab, setIsLoadingCategoryComplianceForTab] = useState(false); 
  const [categoryComplianceErrorForTab, setCategoryComplianceErrorForTab] = useState<string | null>(null); 

  if (!summary) {
    return <p className="text-muted-foreground p-4">Compliance summary not available for this product.</p>;
  }

  const allComplianceItems: ComplianceDetailItemProps[] = [];

  if (summary.eprel) {
    const eprelSyncButton = (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onSyncEprel}
              disabled={isSyncingEprel || !canSyncEprel}
              className="h-7 w-7"
            >
              {isSyncingEprel ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="sr-only">Sync with EPREL</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {canSyncEprel ? (
              <p>Sync with EPREL Database</p>
            ) : (
              <p className="flex items-center">
                <InfoIconFromLucide className="h-4 w-4 mr-2 text-info" />
                Model number required to sync.
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    allComplianceItems.push({
      title: "EPREL Energy Label",
      icon: FileText,
      status: summary.eprel.status,
      lastChecked: summary.eprel.lastChecked,
      id: summary.eprel.id,
      url: summary.eprel.url,
      actionButton: eprelSyncButton,
    });
  }

  if (summary.ebsi) {
    allComplianceItems.push({
      title: "EBSI Blockchain Verification",
      icon: Fingerprint,
      status: summary.ebsi.status,
      lastChecked: summary.ebsi.lastChecked,
      verificationId: summary.ebsi.verificationId,
      url: summary.ebsi.transactionUrl,
    });
  }
  
  if (summary.scip) {
    const scipNotesParts = [];
    if (summary.scip.articleName) scipNotesParts.push(`Article: ${summary.scip.articleName}`);
    if (summary.scip.svhcListVersion) scipNotesParts.push(`SVHC List Ver: ${summary.scip.svhcListVersion}`);
    if (summary.scip.submittingLegalEntity) scipNotesParts.push(`Submitter: ${summary.scip.submittingLegalEntity}`);

    allComplianceItems.push({
      title: "ECHA SCIP Notification",
      icon: Database,
      status: summary.scip.status || "N/A",
      lastChecked: summary.scip.lastChecked || product.lastUpdated || new Date().toISOString(),
      id: summary.scip.notificationId,
      notes: scipNotesParts.join(' | ') || undefined,
      url: summary.scip.safeUseInstructionsLink,
    });
  }

  if (summary.euCustomsData) {
    const customsNotesParts = [];
    if (summary.euCustomsData.hsCode) customsNotesParts.push(`HS Code: ${summary.euCustomsData.hsCode}`);
    if (summary.euCustomsData.countryOfOrigin) customsNotesParts.push(`Origin: ${summary.euCustomsData.countryOfOrigin}`);
    if (summary.euCustomsData.netWeightKg !== undefined && summary.euCustomsData.netWeightKg !== null) customsNotesParts.push(`Net Wt: ${summary.euCustomsData.netWeightKg}kg`);
    if (summary.euCustomsData.customsValuation?.value !== undefined && summary.euCustomsData.customsValuation.value !== null) {
        customsNotesParts.push(`Value: ${summary.euCustomsData.customsValuation.value} ${summary.euCustomsData.customsValuation.currency || ''}`);
    }
    if (summary.euCustomsData.cbamGoodsIdentifier) { // Display CBAM Goods Identifier
        customsNotesParts.push(`CBAM Goods ID: ${summary.euCustomsData.cbamGoodsIdentifier}`);
    }
    
    allComplianceItems.push({
      title: "EU Customs Data",
      icon: Anchor,
      status: summary.euCustomsData.status || "N/A",
      lastChecked: summary.euCustomsData.lastChecked || product.lastUpdated || new Date().toISOString(),
      id: summary.euCustomsData.declarationId,
      notes: customsNotesParts.join(' | ') || undefined,
    });
  }

  if (summary.battery) {
    const batteryNotesParts: string[] = [];
    if (summary.battery.batteryChemistry) batteryNotesParts.push(`Chemistry: ${summary.battery.batteryChemistry}`);
    if (summary.battery.carbonFootprint?.value !== undefined && summary.battery.carbonFootprint.value !== null) {
      batteryNotesParts.push(`CF: ${summary.battery.carbonFootprint.value} ${summary.battery.carbonFootprint.unit || ''}`);
    }
    if (summary.battery.stateOfHealth?.value !== undefined && summary.battery.stateOfHealth.value !== null) {
      batteryNotesParts.push(`SoH: ${summary.battery.stateOfHealth.value}${summary.battery.stateOfHealth.unit || '%'}`);
    }
    if (summary.battery.recycledContent && summary.battery.recycledContent.length > 0) {
      const mainRecycled = summary.battery.recycledContent.find(rc => rc.material && rc.percentage !== undefined && rc.percentage !== null);
      if (mainRecycled) {
        batteryNotesParts.push(`Recycled ${mainRecycled.material}: ${mainRecycled.percentage}%`);
      } else if (summary.battery.recycledContent.length > 0) {
        batteryNotesParts.push(`${summary.battery.recycledContent.length} recycled material(s) declared.`);
      }
    }
    if (summary.battery.vcId) batteryNotesParts.push(`Main VC: ${summary.battery.vcId.substring(0,15)}...`);


    allComplianceItems.push({
      title: "EU Battery Regulation",
      icon: BatteryCharging,
      status: summary.battery.status || "N/A",
      lastChecked: product.lastUpdated || new Date().toISOString(), 
      id: summary.battery.batteryPassportId,
      url: summary.battery.vcId ? `#vc-${summary.battery.vcId}` : undefined, 
      notes: batteryNotesParts.join(' | ') || "Detailed battery passport information available.",
    });
  }

  if (summary.specificRegulations) {
    summary.specificRegulations.forEach(reg => {
      allComplianceItems.push({
        title: reg.regulationName,
        icon: ShieldCheck, 
        status: reg.status,
        lastChecked: reg.lastChecked,
        id: reg.verificationId, 
        url: reg.detailsUrl,
        notes: reg.notes,
      });
    });
  }

  const handleFetchComplianceInsightsForTab = async () => {
    if (!product.category) {
      toast({ title: "Category Missing", description: "Product category is needed to fetch compliance insights.", variant: "destructive" });
      return;
    }
    setIsLoadingCategoryComplianceForTab(true);
    setCategoryComplianceErrorForTab(null);
    setCategoryComplianceSummaryForTab(null);
    try {
      const result = await generateComplianceSummaryForCategory({ productCategory: product.category });
      setCategoryComplianceSummaryForTab(result.categoryComplianceSummary);
      toast({
        title: `AI Insights for "${product.category}" Category`,
        description: "Compliance summary generated successfully.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch AI compliance insights.";
      setCategoryComplianceErrorForTab(msg);
      toast({ title: "AI Insight Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoadingCategoryComplianceForTab(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <ProductComplianceHeader
        overallStatusText={summary.overallStatus}
      />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" />
            AI Compliance Insights for Category: {product.category || "N/A"}
          </CardTitle>
          <CardDescription>Get AI-powered insights on key compliance considerations for this product's category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleFetchComplianceInsightsForTab} disabled={isLoadingCategoryComplianceForTab || !product.category}>
            {isLoadingCategoryComplianceForTab ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <InfoIconFromLucide className="mr-2 h-4 w-4" />}
            {isLoadingCategoryComplianceForTab ? "Loading Insights..." : "Get AI Insights"}
          </Button>
          {isLoadingCategoryComplianceForTab && (
            <div className="flex items-center text-sm text-muted-foreground p-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Fetching insights...
            </div>
          )}
          {categoryComplianceErrorForTab && !isLoadingCategoryComplianceForTab && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Insight Error</AlertTitle>
              <AlertDescription>{categoryComplianceErrorForTab}</AlertDescription>
            </Alert>
          )}
          {categoryComplianceSummaryForTab && !isLoadingCategoryComplianceForTab && (
            <Alert className="mt-2 bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300">
              <InfoIconFromLucide className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
              <AlertTitle className="font-semibold !text-blue-700 dark:!text-blue-300">AI Compliance Summary for "{product.category}"</AlertTitle>
              <AlertDescription className="whitespace-pre-line !text-blue-600/90 dark:!text-blue-300/90 text-xs">
                {categoryComplianceSummaryForTab}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {allComplianceItems.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              Detailed Compliance Checkpoints
            </CardTitle>
            <CardDescription>Status for specific regulations and verifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {allComplianceItems.map((item, index) => (
              <ComplianceDetailItemDisplay key={`${item.title}-${index}`} {...item} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
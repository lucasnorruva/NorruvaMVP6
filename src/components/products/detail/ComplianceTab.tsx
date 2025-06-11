
// --- File: ComplianceTab.tsx ---
// Description: Displays compliance-related information for a product.
"use client";

import type { SimpleProductDetail, ComplianceDetailItem as SpecificComplianceDetailItemFromDPP } from "@/types/dpp";
import ProductComplianceHeader from "./ProductComplianceHeader";
import ComplianceDetailItemDisplay, { type ComplianceDetailItemProps } from "./ComplianceDetailItemDisplay"; // Import the new component and its props type
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, RefreshCw, Loader2, Info as InfoIconFromLucide, FileText, Fingerprint, Database, Anchor } from "lucide-react"; // Added Database, Anchor
import Link from "next/link";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface ComplianceTabProps {
  product: SimpleProductDetail;
  onSyncEprel: () => Promise<void>;
  isSyncingEprel: boolean;
  canSyncEprel: boolean;
}

export default function ComplianceTab({ product, onSyncEprel, isSyncingEprel, canSyncEprel }: ComplianceTabProps) {
  const summary = product.complianceSummary;

  if (!summary) {
    return <p className="text-muted-foreground p-4">Compliance summary not available for this product.</p>;
  }

  const allComplianceItems: ComplianceDetailItemProps[] = [];

  // Handle EPREL explicitly
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

  // Handle EBSI explicitly
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
  
  // Handle SCIP explicitly
  if (summary.scip) {
    allComplianceItems.push({
      title: "ECHA SCIP Notification",
      icon: Database,
      status: summary.scip.status,
      lastChecked: summary.scip.lastChecked,
      id: summary.scip.notificationId, // Use notificationId as the primary ID for display
      notes: `Article: ${summary.scip.articleName || 'N/A'}. SVHC List Ver: ${summary.scip.svhcListVersion || 'N/A'}`,
      url: summary.scip.safeUseInstructionsLink,
    });
  }

  // Handle EU Customs Data explicitly
  if (summary.euCustomsData) {
    allComplianceItems.push({
      title: "EU Customs Data",
      icon: Anchor,
      status: summary.euCustomsData.status,
      lastChecked: summary.euCustomsData.lastChecked,
      id: summary.euCustomsData.declarationId, // Use declarationId as the primary ID
      notes: `HS Code: ${summary.euCustomsData.hsCode || 'N/A'}. Origin: ${summary.euCustomsData.countryOfOrigin || 'N/A'}. Net Wt: ${summary.euCustomsData.netWeightKg || 'N/A'}kg. Value: ${summary.euCustomsData.customsValuation?.value || 'N/A'} ${summary.euCustomsData.customsValuation?.currency || ''}`.trim(),
    });
  }

  // Handle other specific regulations
  if (summary.specificRegulations) {
    summary.specificRegulations.forEach(reg => {
      // Ensure these are regulations NOT already covered by explicit handling above
      // This logic assumes that specificRegulations in SimpleProductDetail 
      // is now populated by productDetailUtils.ts *only* with items
      // that are NOT eprel, ebsi, scip, or euCustomsData.
      allComplianceItems.push({
        title: reg.regulationName,
        icon: ListChecks, // Default icon for other regulations
        status: reg.status,
        lastChecked: reg.lastChecked,
        id: reg.verificationId, // Using id for consistency, was verificationId in ComplianceDetailItem
        url: reg.detailsUrl,
        notes: reg.notes,
      });
    });
  }
  
  return (
    <div className="space-y-6">
      <ProductComplianceHeader
        overallStatusText={summary.overallStatus}
        // notifications={product.notifications} // Assuming product.notifications exists
      />

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


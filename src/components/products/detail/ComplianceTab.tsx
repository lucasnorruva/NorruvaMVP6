
// --- File: ComplianceTab.tsx ---
// Description: Displays compliance-related information for a product.
"use client";

import type { SimpleProductDetail, ComplianceDetailItem as SpecificComplianceDetailItem } from "@/types/dpp"; // Renamed imported type
import ProductComplianceHeader from "./ProductComplianceHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ListChecks, RefreshCw, Loader2, Info as InfoIconFromLucide, FileText, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses } from "@/utils/dppDisplayUtils";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComplianceTabProps {
  product: SimpleProductDetail;
  onSyncEprel: () => Promise<void>;
  isSyncingEprel: boolean;
  canSyncEprel: boolean;
}

// Interface for the props of the sub-component that displays each individual item
interface IndividualComplianceItemProps {
  title: string;
  icon: React.ElementType;
  status: string;
  lastChecked: string;
  id?: string;
  verificationId?: string; // Specifically for EBSI if different from 'id'
  url?: string;
  notes?: string;
  actionButton?: React.ReactNode;
}

const IndividualComplianceItemDisplay: React.FC<IndividualComplianceItemProps> = ({
  title,
  icon: ItemIcon,
  status,
  lastChecked,
  id,
  verificationId,
  url,
  notes,
  actionButton,
}) => {
  const StatusIconComponent = getStatusIcon(status);
  const badgeVariant = getStatusBadgeVariant(status);
  const badgeClasses = getStatusBadgeClasses(status);
  let detailsText = `Last checked: ${new Date(lastChecked).toLocaleDateString()}`;

  const formattedStatus = status
    .replace(/_/g, ' ')
    .replace(/\b(eprel|in|id|url|co2e|kwh|mfg|svhc|sds|qa|gwp|voc|ebsi)\b/gi, match => match.toUpperCase())
    .replace(/\b\w/g, char => char.toUpperCase());

  if (title.includes("EBSI") && verificationId && status.toLowerCase() === 'verified') {
    detailsText = `Verified (ID: ${verificationId}) - ${detailsText}`;
  } else if (title.includes("EPREL") && id && (status.toLowerCase() === 'registered' || status.toLowerCase().includes('synced') || status.toLowerCase().includes('mismatch'))){
     detailsText = `Entry ID: ${id} - ${detailsText}`;
  } else if (title.includes("EBSI") && verificationId === "PENDING_EBSI_CHECK" && status.toLowerCase() === 'pending') {
     detailsText = `Verification Pending - ${detailsText}`;
  } else if (status.toLowerCase() === 'not applicable' || status.toLowerCase() === 'n/a') {
     detailsText = `Not applicable for this product. Last checked: ${new Date(lastChecked).toLocaleDateString()}`;
  } else if (id && !title.includes("EPREL") && !title.includes("EBSI")) { 
     detailsText = `ID: ${id} - ${detailsText}`;
  }

  return (
    <div className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-md text-foreground flex items-center">
          <ItemIcon className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
          {title}
        </h4>
        <div className="flex items-center gap-2">
          {actionButton}
          <Badge variant={badgeVariant} className={cn("text-xs", badgeClasses)}>
            {React.cloneElement(StatusIconComponent, { className: "mr-1.5 h-3.5 w-3.5"})}
            {formattedStatus}
          </Badge>
        </div>
      </div>
      <div className="text-xs space-y-1 text-muted-foreground pl-7"> {/* Indent details slightly */}
        <p>{detailsText}</p>
        {notes && <p><strong className="text-foreground/80">Notes:</strong> <span className="text-foreground/90">{notes}</span></p>}
        {url && (
          <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary mt-1.5">
            <Link href={url} target="_blank" rel="noopener noreferrer">
              View Details <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};


export default function ComplianceTab({ product, onSyncEprel, isSyncingEprel, canSyncEprel }: ComplianceTabProps) {
  const summary = product.complianceSummary;

  if (!summary) {
    return <p className="text-muted-foreground p-4">Compliance summary not available for this product.</p>;
  }

  const allComplianceItems: IndividualComplianceItemProps[] = [];

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

  if (summary.specificRegulations) {
    summary.specificRegulations.forEach(reg => {
      allComplianceItems.push({
        title: reg.regulationName,
        icon: ListChecks, 
        status: reg.status,
        lastChecked: reg.lastChecked,
        id: reg.verificationId, 
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
              <IndividualComplianceItemDisplay key={`${item.title}-${index}`} {...item} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

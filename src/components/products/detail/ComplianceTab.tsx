
// --- File: ComplianceTab.tsx ---
// Description: Displays compliance-related information for a product.
"use client";

import type { SimpleProductDetail, ProductComplianceSummary, ComplianceDetailItem } from "@/types/dpp"; // Added ComplianceDetailItem
import OverallProductComplianceComponent, { type ComplianceStatus } from "@/components/products/detail/OverallProductCompliance"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ListChecks } from "lucide-react"; // Removed unused ShieldCheck, Info, Fingerprint, LinkIcon, FileText
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses } from "@/utils/dppDisplayUtils"; 
import React from "react";

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
  
  const eprelDataForComponent: ComplianceStatus | undefined = summary.eprel 
    ? { 
        status: summary.eprel.status, 
        lastChecked: summary.eprel.lastChecked,
        id: summary.eprel.id,
        url: summary.eprel.url,
      } 
    : undefined;

  const ebsiDataForComponent: ComplianceStatus | undefined = summary.ebsi 
    ? { 
        status: summary.ebsi.status, 
        lastChecked: summary.ebsi.lastChecked,
        verificationId: summary.ebsi.verificationId,
        url: summary.ebsi.transactionUrl, // Map transactionUrl to url if needed by ComplianceItem
      } 
    : undefined;

  const formatStatusString = (status: string): string => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b(eprel|in|id|url|co2e|kwh|mfg|svhc|sds|qa|gwp|voc)\b/gi, match => match.toUpperCase())
      .replace(/\b\w/g, char => char.toUpperCase());
  };


  return (
    <div className="space-y-6">
      <OverallProductComplianceComponent 
        overallStatusText={summary.overallStatus} 
        eprelData={eprelDataForComponent}
        ebsiData={ebsiDataForComponent}
        onSyncEprel={onSyncEprel}
        isSyncingEprel={isSyncingEprel}
        canSyncEprel={canSyncEprel}
      />

      {summary.specificRegulations && summary.specificRegulations.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              Specific Regulations Adherence
            </CardTitle>
            <CardDescription>Details on compliance with various other regulations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.specificRegulations.map((reg: ComplianceDetailItem, index: number) => ( // Explicitly type reg and index
              <div key={index} className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-md text-foreground flex items-center">
                    {React.cloneElement(getStatusIcon(reg.status), {className: "mr-2 h-5 w-5"})}
                    {reg.regulationName}
                  </h4>
                  <Badge variant={getStatusBadgeVariant(reg.status)} className={cn("text-xs", getStatusBadgeClasses(reg.status))}>
                      {formatStatusString(reg.status)}
                  </Badge>
                </div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p><strong className="text-foreground/80">Last Checked:</strong> {new Date(reg.lastChecked).toLocaleDateString()}</p>
                  {reg.verificationId && <p className="truncate" title={reg.verificationId}><strong className="text-foreground/80">Verification ID:</strong> {reg.verificationId}</p>}
                  {reg.notes && <p><strong className="text-foreground/80">Notes:</strong> <span className="text-foreground/90">{reg.notes}</span></p>}
                  {reg.detailsUrl && (
                    <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary mt-1.5">
                      <Link href={reg.detailsUrl} target="_blank" rel="noopener noreferrer">
                        View Details <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
    


// --- File: ComplianceTab.tsx ---
// Description: Displays compliance-related information for a product.
"use client";

import type { SimpleProductDetail, ProductComplianceSummary } from "@/types/dpp";
import OverallProductComplianceComponent from "@/components/products/detail/OverallProductCompliance"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Info, Fingerprint, Link as LinkIcon, FileText, ExternalLink, ListChecks } from "lucide-react";
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

  // Ensure eprel and ebsi fields are always objects for OverallProductComplianceComponent
  const eprelData = summary.eprel || { status: 'N/A', lastChecked: new Date().toISOString() };
  const ebsiData = summary.ebsi || { status: 'N/A', lastChecked: new Date().toISOString() };
  
  const overallComplianceData = {
    gdpr: summary.specificRegulations?.find(r => r.regulationName.toLowerCase().includes('gdpr')) || { status: 'N/A', lastChecked: new Date().toISOString() },
    eprel: eprelData,
    ebsiVerified: ebsiData,
    scip: summary.specificRegulations?.find(r => r.regulationName.toLowerCase().includes('scip')) || { status: 'N/A', lastChecked: new Date().toISOString() },
    csrd: summary.specificRegulations?.find(r => r.regulationName.toLowerCase().includes('csrd')) || { status: 'N/A', lastChecked: new Date().toISOString() },
  };

  const formatStatusString = (status: string): string => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b(eprel|in|id|url|co2e|kwh|mfg|svhc|sds|qa|gwp|voc)\b/gi, match => match.toUpperCase())
      .replace(/\b\w/g, char => char.toUpperCase());
  };


  return (
    <div className="space-y-6">
      <OverallProductComplianceComponent 
        complianceData={overallComplianceData}
        overallStatusText={summary.overallStatus} 
        onSyncEprel={onSyncEprel}
        isSyncingEprel={isSyncingEprel}
        canSyncEprel={canSyncEprel}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {summary.eprel && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" /> EPREL (EU Product Database)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center">
                Status:
                {React.cloneElement(getStatusIcon(summary.eprel.status), { className: "mx-2 h-4 w-4" })}
                <Badge variant={getStatusBadgeVariant(summary.eprel.status)} className={cn("text-xs", getStatusBadgeClasses(summary.eprel.status))}>
                  {formatStatusString(summary.eprel.status)}
                </Badge>
              </p>
              {summary.eprel.id && <p>ID: <span className="font-medium">{summary.eprel.id}</span></p>}
              <p>Last Checked: <span className="font-medium">{new Date(summary.eprel.lastChecked).toLocaleDateString()}</span></p>
              {summary.eprel.url && (
                <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary">
                  <Link href={summary.eprel.url} target="_blank" rel="noopener noreferrer">
                    View on EPREL <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {summary.ebsi && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center">
                <Fingerprint className="mr-2 h-5 w-5 text-indigo-600" /> EBSI (Blockchain Verification)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center">
                Status:
                {React.cloneElement(getStatusIcon(summary.ebsi.status), { className: "mx-2 h-4 w-4" })}
                <Badge variant={getStatusBadgeVariant(summary.ebsi.status)} className={cn("text-xs", getStatusBadgeClasses(summary.ebsi.status))}>
                  {formatStatusString(summary.ebsi.status)}
                </Badge>
              </p>
              {summary.ebsi.verificationId && <p className="truncate">Verification ID: <span className="font-medium font-mono text-xs" title={summary.ebsi.verificationId}>{summary.ebsi.verificationId}</span></p>}
               <p>Last Checked: <span className="font-medium">{new Date(summary.ebsi.lastChecked).toLocaleDateString()}</span></p>
              {summary.ebsi.transactionUrl && (
                <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary">
                  <Link href={summary.ebsi.transactionUrl} target="_blank" rel="noopener noreferrer">
                    View Transaction <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {summary.specificRegulations && summary.specificRegulations.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              Specific Regulations Adherence
            </CardTitle>
            <CardDescription>Details on compliance with various regulations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.specificRegulations.map((reg, index) => (
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

    


// --- File: ComplianceTab.tsx ---
// Description: Displays compliance-related information for a product.
"use client";

import type { SimpleProductDetail, ComplianceDetailItem, ProductComplianceSummary } from "@/types/dpp";
import OverallProductCompliance from "@/components/products/detail/OverallProductCompliance"; // Corrected import path
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, Info, Fingerprint, Link as LinkIcon, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ComplianceTabProps {
  product: SimpleProductDetail;
  onSyncEprel: () => Promise<void>;
  isSyncingEprel: boolean;
  canSyncEprel: boolean;
}

const getStatusIcon = (status: ComplianceDetailItem['status'] | ProductComplianceSummary['overallStatus'] | ProductComplianceSummary['eprel']['status'] | ProductComplianceSummary['ebsi']['status'] | string) => {
  switch (status?.toLowerCase()) {
    case 'compliant':
    case 'registered':
    case 'verified':
    case 'synced successfully':
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case 'non-compliant':
    case 'error':
    case 'error during sync':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'pending':
    case 'pending review':
    case 'in progress':
    case 'data incomplete':
    case 'data mismatch':
    case 'product not found in eprel':
      return <Info className="h-5 w-5 text-yellow-500" />;
    case 'not applicable':
    case 'n/a':
    case 'not found':
    case 'not verified':
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusBadgeVariant = (status: ComplianceDetailItem['status'] | ProductComplianceSummary['overallStatus'] | ProductComplianceSummary['eprel']['status'] | ProductComplianceSummary['ebsi']['status'] | string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status?.toLowerCase()) {
    case 'compliant':
    case 'registered':
    case 'verified':
    case 'synced successfully':
      return "default";
    case 'non-compliant':
    case 'error':
    case 'error during sync':
      return "destructive";
    case 'pending':
    case 'pending review':
    case 'in progress':
    case 'data incomplete':
    case 'data mismatch':
    case 'product not found in eprel':
      return "outline";
    case 'not applicable':
    case 'n/a':
    case 'not found':
    case 'not verified':
    default:
      return "secondary";
  }
};

const getStatusBadgeClasses = (status: ComplianceDetailItem['status'] | ProductComplianceSummary['overallStatus'] | ProductComplianceSummary['eprel']['status'] | ProductComplianceSummary['ebsi']['status'] | string) => {
    switch (status?.toLowerCase()) {
        case 'compliant': case 'registered': case 'verified': case 'synced successfully': return "bg-green-100 text-green-700 border-green-300";
        case 'non-compliant': case 'error': case 'error during sync': return "bg-red-100 text-red-700 border-red-300";
        case 'pending': case 'pending review': case 'in progress': case 'data incomplete': case 'data mismatch': case 'product not found in eprel': return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case 'not applicable': case 'n/a': case 'not found': case 'not verified':
        default: return "bg-muted text-muted-foreground";
    }
};


export default function ComplianceTab({ product, onSyncEprel, isSyncingEprel, canSyncEprel }: ComplianceTabProps) {
  const summary = product.complianceSummary;

  if (!summary) {
    return <p className="text-muted-foreground p-4">Compliance summary not available for this product.</p>;
  }

  // Ensure all parts of complianceData for OverallProductCompliance are well-defined
  const overallComplianceData = {
    gdpr: summary.specificRegulations?.find(r => r.regulationName.toLowerCase().includes('gdpr')) || { status: 'N/A', lastChecked: new Date().toISOString() },
    eprel: summary.eprel || { status: 'N/A', lastChecked: new Date().toISOString() },
    ebsiVerified: summary.ebsi || { status: 'N/A', lastChecked: new Date().toISOString() },
    scip: summary.specificRegulations?.find(r => r.regulationName.toLowerCase().includes('scip')) || { status: 'N/A', lastChecked: new Date().toISOString() },
    csrd: summary.specificRegulations?.find(r => r.regulationName.toLowerCase().includes('csrd')) || { status: 'N/A', lastChecked: new Date().toISOString() },
  };


  return (
    <div className="space-y-6">
      <OverallProductCompliance 
        complianceData={overallComplianceData}
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
              <p className="flex items-center">Status: <Badge variant={getStatusBadgeVariant(summary.eprel.status)} className={cn("ml-2", getStatusBadgeClasses(summary.eprel.status))}>{summary.eprel.status}</Badge></p>
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
              <p className="flex items-center">Status: <Badge variant={getStatusBadgeVariant(summary.ebsi.status)} className={cn("ml-2", getStatusBadgeClasses(summary.ebsi.status))}>{summary.ebsi.status}</Badge></p>
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
            <CardTitle className="text-lg font-semibold">Specific Regulations Adherence</CardTitle>
            <CardDescription>Details on compliance with various regulations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.specificRegulations.map((reg, index) => (
              <div key={index} className="p-3 border rounded-md bg-muted/30">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-sm">{reg.regulationName}</h4>
                  <Badge variant={getStatusBadgeVariant(reg.status)} className={getStatusBadgeClasses(reg.status)}>{reg.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Last Checked: {new Date(reg.lastChecked).toLocaleDateString()}</p>
                {reg.verificationId && <p className="text-xs text-muted-foreground truncate" title={reg.verificationId}>Verification ID: {reg.verificationId}</p>}
                {reg.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {reg.notes}</p>}
                {reg.detailsUrl && (
                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary mt-1 text-xs">
                    <Link href={reg.detailsUrl} target="_blank" rel="noopener noreferrer">
                      View Details <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

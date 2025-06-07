// --- File: ComplianceTab.tsx ---
// Description: Displays compliance-related information for a product.
"use client";

import type { SimpleProductDetail, ComplianceDetailItem, ProductComplianceSummary } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, Info, Fingerprint, Link as LinkIcon, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ComplianceTabProps {
  product: SimpleProductDetail;
}

const getStatusIcon = (status: ComplianceDetailItem['status'] | ProductComplianceSummary['overallStatus'] | ProductComplianceSummary['eprel']['status'] | ProductComplianceSummary['ebsi']['status']) => {
  switch (status) {
    case 'Compliant':
    case 'Registered':
    case 'Verified':
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case 'Non-Compliant':
    case 'Error':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'Pending':
    case 'Pending Review':
    case 'In Progress':
    case 'Data Incomplete':
      return <Info className="h-5 w-5 text-yellow-500" />;
    case 'Not Applicable':
    case 'N/A':
    case 'Not Found':
    case 'Not Verified':
      return <Info className="h-5 w-5 text-muted-foreground" />; // Using Info for N/A states too for neutrality
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusBadgeVariant = (status: ComplianceDetailItem['status'] | ProductComplianceSummary['overallStatus'] | ProductComplianceSummary['eprel']['status'] | ProductComplianceSummary['ebsi']['status']): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case 'Compliant':
    case 'Registered':
    case 'Verified':
      return "default";
    case 'Non-Compliant':
    case 'Error':
      return "destructive";
    case 'Pending':
    case 'Pending Review':
    case 'In Progress':
    case 'Data Incomplete':
      return "outline";
    case 'Not Applicable':
    case 'N/A':
    case 'Not Found':
    case 'Not Verified':
    default:
      return "secondary";
  }
};

const getStatusBadgeClasses = (status: ComplianceDetailItem['status'] | ProductComplianceSummary['overallStatus'] | ProductComplianceSummary['eprel']['status'] | ProductComplianceSummary['ebsi']['status']) => {
    switch (status) {
        case 'Compliant': case 'Registered': case 'Verified': return "bg-green-100 text-green-700 border-green-300";
        case 'Non-Compliant': case 'Error': return "bg-red-100 text-red-700 border-red-300";
        case 'Pending': case 'Pending Review': case 'In Progress': case 'Data Incomplete': return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case 'Not Applicable': case 'N/A': case 'Not Found': case 'Not Verified':
        default: return "bg-muted text-muted-foreground";
    }
};


export default function ComplianceTab({ product }: ComplianceTabProps) {
  const summary = product.complianceSummary;

  if (!summary) {
    return <p className="text-muted-foreground p-4">Compliance summary not available for this product.</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            {getStatusIcon(summary.overallStatus)}
            <span className="ml-2">Overall Compliance Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={getStatusBadgeVariant(summary.overallStatus)} className={cn("text-sm", getStatusBadgeClasses(summary.overallStatus))}>
            {summary.overallStatus}
          </Badge>
          {product.keyCompliancePoints && product.keyCompliancePoints.length > 0 && (
            <ul className="mt-3 text-sm space-y-1 text-muted-foreground">
              {product.keyCompliancePoints.map((point, idx) => <li key={idx}>• {point}</li>)}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {summary.eprel && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" /> EPREL (EU Product Database)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Status: <Badge variant={getStatusBadgeVariant(summary.eprel.status)} className={getStatusBadgeClasses(summary.eprel.status)}>{summary.eprel.status}</Badge></p>
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
              <p>Status: <Badge variant={getStatusBadgeVariant(summary.ebsi.status)} className={getStatusBadgeClasses(summary.ebsi.status)}>{summary.ebsi.status}</Badge></p>
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

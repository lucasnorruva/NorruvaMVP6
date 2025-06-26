
// --- File: OverallProductCompliance.tsx ---
// Description: Component to display overall product compliance, including a prominent overall status badge.
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Loader2, Info as InfoIconFromLucide } from 'lucide-react'; // Renamed Info to InfoIconFromLucide
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses } from "@/utils/dppDisplayUtils"; // Import centralized utils
import type { ProductComplianceSummary } from '@/types/dpp';


export interface ComplianceStatus {
  status: string;
  lastChecked: string;
  id?: string; // Changed from entryId for EPREL
  verificationId?: string;
  declarationId?: string;
  url?: string;
}

export interface OverallComplianceData {
  gdpr: ComplianceStatus;
  eprel: ComplianceStatus;
  ebsiVerified: ComplianceStatus;
  scip: ComplianceStatus;
  csrd: ComplianceStatus;
}

export interface ProductNotification {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  date: string;
}


interface OverallProductComplianceProps {
  complianceData: OverallComplianceData;
  overallStatusText: ProductComplianceSummary['overallStatus']; // New prop for overall status
  notifications?: ProductNotification[];
  onSyncEprel?: () => Promise<void>;
  isSyncingEprel?: boolean;
  canSyncEprel?: boolean;
}

const ComplianceItem: React.FC<{ title: string; data: ComplianceStatus, actionButton?: React.ReactNode }> = ({ title, data, actionButton }) => {
  const IconComponent = getStatusIcon(data.status);
  const badgeVariant = getStatusBadgeVariant(data.status);
  const badgeClasses = getStatusBadgeClasses(data.status);
  const titleText = title;
  let detailsText = `Last checked: ${new Date(data.lastChecked).toLocaleDateString()}`;

  const formattedStatus = data.status
    .replace(/_/g, ' ')
    .replace(/\b(eprel|in|id|url|co2e|kwh|mfg|svhc|sds|qa|gwp|voc)\b/gi, match => match.toUpperCase()) // Uppercase specific acronyms
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word for statuses like "Product Not Found In EPREL"

  if (title.includes("EBSI") && data.verificationId && data.verificationId !== "PENDING_EBSI_CHECK" && data.status.toLowerCase() === 'verified') {
    detailsText = `Verified (ID: ${data.verificationId}) - ${detailsText}`;
  } else if (title.includes("EPREL") && data.id && (data.status.toLowerCase() === 'registered' || data.status.toLowerCase() === 'synced successfully' || data.status.toLowerCase() === 'data mismatch')){
     detailsText = `Entry ID: ${data.id} - ${detailsText}`;
  } else if (title.includes("EBSI") && data.verificationId === "PENDING_EBSI_CHECK" && data.status.toLowerCase() === 'pending') {
     detailsText = `Verification Pending - ${detailsText}`;
  } else if (data.status.toLowerCase() === 'not applicable' || data.status.toLowerCase() === 'n/a') {
     detailsText = `Not applicable for this product. Last checked: ${new Date(data.lastChecked).toLocaleDateString()}`;
  }


  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-md border hover:bg-muted/30 transition-colors">
      <div className="flex items-center">
        {IconComponent}
        <div className="ml-3">
          <span className="text-sm font-medium">{titleText}</span>
          {detailsText && <span className="block text-xs text-muted-foreground">{detailsText}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actionButton}
        <Badge variant={badgeVariant} className={cn("text-xs", badgeClasses)}>
          {formattedStatus}
        </Badge>
      </div>
    </div>
  );
};

const OverallProductCompliance: React.FC<OverallProductComplianceProps> = ({ complianceData, overallStatusText, notifications, onSyncEprel, isSyncingEprel, canSyncEprel }) => {
  if (!complianceData) {
    return <p className="text-muted-foreground">Overall compliance data not available.</p>;
  }

  const hasErrorNotifications = notifications?.some(n => n.type === 'error');
  
  const overallStatusIcon = getStatusIcon(overallStatusText);
  const overallStatusBadgeVariant = getStatusBadgeVariant(overallStatusText);
  const overallStatusBadgeClasses = getStatusBadgeClasses(overallStatusText);
  const formattedOverallStatusText = overallStatusText
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

  const eprelSyncButton = (onSyncEprel) ? (
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
  ) : null;

  return (
    <Card className={cn("shadow-md", hasErrorNotifications && "border-destructive border-2")}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className={cn("text-lg font-headline flex items-center", hasErrorNotifications && "text-destructive")}>
              {hasErrorNotifications && <AlertTriangle className="mr-2 h-5 w-5" />}
              Overall Product Compliance
            </CardTitle>
            <CardDescription className="mt-1">
              Summary of the product's adherence to key regulations.
              {hasErrorNotifications && <span className="block text-destructive font-medium mt-1">Attention: Critical alerts require review.</span>}
            </CardDescription>
          </div>
          {overallStatusText && overallStatusText.toLowerCase() !== 'n/a' && (
            <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
              <span className="text-xs text-muted-foreground mb-0.5">Overall Status</span>
              <Badge variant={overallStatusBadgeVariant} className={cn("text-sm px-3 py-1", overallStatusBadgeClasses)}>
                {React.cloneElement(overallStatusIcon, { className: cn(overallStatusIcon.props.className, "mr-2 h-4 w-4") })}
                {formattedOverallStatusText}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ComplianceItem title="GDPR Data Privacy" data={complianceData.gdpr} />
        <ComplianceItem title="EPREL Energy Label" data={complianceData.eprel} actionButton={eprelSyncButton} />
        <ComplianceItem title="EBSI/Blockchain Verification" data={complianceData.ebsiVerified} />
        <ComplianceItem title="SCIP Database (Substances of Concern)" data={complianceData.scip} />
        <ComplianceItem title="CSRD Reporting Alignment" data={complianceData.csrd} />
      </CardContent>
    </Card>
  );
};

export default OverallProductCompliance;
    

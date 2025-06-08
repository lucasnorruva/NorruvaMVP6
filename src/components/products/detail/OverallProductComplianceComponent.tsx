
// --- File: OverallProductComplianceComponent.tsx ---
// Description: Component to display overall product compliance status, EPREL and EBSI.
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Loader2, Info as InfoIconFromLucide, FileText, Fingerprint, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses } from "@/utils/dppDisplayUtils";
import type { ProductComplianceSummary } from '@/types/dpp';

// Local type for data structure expected for EPREL/EBSI by ComplianceItem
export interface ComplianceStatus {
  status: string;
  lastChecked: string;
  id?: string; // For EPREL ID
  verificationId?: string; // For EBSI verificationId
  url?: string; // For EPREL URL or EBSI transaction URL
}

interface OverallProductComplianceProps {
  overallStatusText: ProductComplianceSummary['overallStatus'];
  eprelData?: ComplianceStatus;
  ebsiData?: ComplianceStatus;
  notifications?: ProductNotification[]; // Kept for potential future use for top-level card styling
  onSyncEprel?: () => Promise<void>;
  isSyncingEprel?: boolean;
  canSyncEprel?: boolean;
}

interface ProductNotification { // Copied from old version for notifications prop
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  date: string;
}

const ComplianceItem: React.FC<{ title: string; icon: React.ElementType; data: ComplianceStatus, actionButton?: React.ReactNode }> = ({ title, icon: ItemIcon, data, actionButton }) => {
  const StatusIconComponent = getStatusIcon(data.status);
  const badgeVariant = getStatusBadgeVariant(data.status);
  const badgeClasses = getStatusBadgeClasses(data.status);
  let detailsText = `Last checked: ${new Date(data.lastChecked).toLocaleDateString()}`;

  const formattedStatus = data.status
    .replace(/_/g, ' ')
    .replace(/\b(eprel|in|id|url|co2e|kwh|mfg|svhc|sds|qa|gwp|voc|ebsi)\b/gi, match => match.toUpperCase())
    .replace(/\b\w/g, char => char.toUpperCase());

  if (title.includes("EBSI") && data.verificationId && data.status.toLowerCase() === 'verified') {
    detailsText = `Verified (ID: ${data.verificationId}) - ${detailsText}`;
  } else if (title.includes("EPREL") && data.id && (data.status.toLowerCase() === 'registered' || data.status.toLowerCase().includes('synced') || data.status.toLowerCase().includes('mismatch'))){
     detailsText = `Entry ID: ${data.id} - ${detailsText}`;
  } else if (title.includes("EBSI") && data.verificationId === "PENDING_EBSI_CHECK" && data.status.toLowerCase() === 'pending') {
     detailsText = `Verification Pending - ${detailsText}`;
  } else if (data.status.toLowerCase() === 'not applicable' || data.status.toLowerCase() === 'n/a') {
     detailsText = `Not applicable for this product. Last checked: ${new Date(data.lastChecked).toLocaleDateString()}`;
  }


  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-md border hover:bg-muted/30 transition-colors">
      <div className="flex items-center">
        <ItemIcon className={cn("h-5 w-5 mr-3 flex-shrink-0", 
          data.status === 'compliant' || data.status === 'verified' || data.status.includes('synced') ? 'text-green-600' :
          data.status === 'non_compliant' || data.status === 'not_verified' || data.status === 'error' ? 'text-red-600' :
          data.status.includes('pending') || data.status.includes('review') || data.status.includes('mismatch') ? 'text-yellow-600' :
          data.status === 'in_progress' ? 'text-blue-600' :
          data.status === 'not applicable' || data.status === 'n/a' ? 'text-gray-600' : 'text-muted-foreground'
        )} />
        <div>
          <span className="text-sm font-medium">{title}</span>
          {detailsText && <span className="block text-xs text-muted-foreground">{detailsText}</span>}
          {data.url && (
            <Button variant="link" size="xs" asChild className="p-0 h-auto text-primary mt-0.5">
              <Link href={data.url} target="_blank" rel="noopener noreferrer">
                View Details <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actionButton}
        <Badge variant={badgeVariant} className={cn("text-xs", badgeClasses)}>
          {React.cloneElement(StatusIconComponent, { className: "mr-1.5 h-3.5 w-3.5"})}
          {formattedStatus}
        </Badge>
      </div>
    </div>
  );
};

const OverallProductComplianceComponent: React.FC<OverallProductComplianceProps> = ({ 
  overallStatusText, 
  eprelData, 
  ebsiData, 
  notifications, 
  onSyncEprel, 
  isSyncingEprel, 
  canSyncEprel 
}) => {
  
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
              Product Compliance Status
            </CardTitle>
            <CardDescription className="mt-1">
              Overall status and key regulatory checkpoints.
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
        {eprelData && <ComplianceItem title="EPREL Energy Label" icon={FileText} data={eprelData} actionButton={eprelSyncButton} />}
        {ebsiData && <ComplianceItem title="EBSI Blockchain Verification" icon={Fingerprint} data={ebsiData} />}
        {!eprelData && !ebsiData && (
            <p className="text-sm text-muted-foreground p-3 text-center">No specific EPREL or EBSI data to display. See other regulations below.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OverallProductComplianceComponent;
    

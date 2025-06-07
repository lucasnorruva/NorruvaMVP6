
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info as InfoIcon, ShieldQuestion, ShieldCheck, AlertTriangle, ExternalLink, RefreshCw, Loader2 } from 'lucide-react'; // Added InfoIcon
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

export interface ComplianceStatus {
  status: string;
  lastChecked: string;
  entryId?: string;
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
  notifications?: ProductNotification[];
  onSyncEprel?: () => Promise<void>;
  isSyncingEprel?: boolean;
  canSyncEprel?: boolean;
}

const ComplianceItem: React.FC<{ title: string; data: ComplianceStatus, actionButton?: React.ReactNode }> = ({ title, data, actionButton }) => {
  let IconComponent = InfoIcon;
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let badgeClasses = "bg-muted text-muted-foreground";
  let titleText = title;
  let detailsText = `Last checked: ${new Date(data.lastChecked).toLocaleDateString()}`;
  const statusLower = data.status?.toLowerCase();

  switch (statusLower) {
    case 'compliant':
    case 'registered':
    case 'verified':
    case 'synced successfully':
      IconComponent = ShieldCheck;
      badgeVariant = "default";
      badgeClasses = "bg-green-500/20 text-green-700 border-green-500/30";
      if (title.includes("EBSI") && data.verificationId && data.verificationId !== "PENDING_EBSI_CHECK") {
        detailsText = `Verified (ID: ${data.verificationId}) - ${detailsText}`;
      } else if (title.includes("EPREL") && data.entryId){
         detailsText = `Entry ID: ${data.entryId} - ${detailsText}`;
      }
      break;
    case 'non_compliant':
    case 'error':
    case 'error during sync':
      IconComponent = AlertCircle;
      badgeVariant = "destructive";
      badgeClasses = "bg-red-500/20 text-red-700 border-red-500/30";
      break;
    case 'pending_review':
    case 'pending':
    case 'data mismatch':
      IconComponent = InfoIcon;
      badgeVariant = "outline";
      badgeClasses = "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
       if (title.includes("EBSI") && data.verificationId === "PENDING_EBSI_CHECK") {
         detailsText = `Verification Pending - ${detailsText}`;
      }
      break;
    case 'in_progress':
      IconComponent = InfoIcon;
      badgeVariant = "outline";
      badgeClasses = "bg-blue-500/20 text-blue-700 border-blue-500/30";
      break;
    case 'product not found in eprel':
      IconComponent = ShieldQuestion;
      badgeVariant = "outline";
      badgeClasses = "bg-purple-500/20 text-purple-700 border-purple-500/30"; // Changed to purple for distinction
      break;
    case 'not_applicable':
    case 'n/a':
      IconComponent = ShieldQuestion;
      badgeVariant = "secondary";
      badgeClasses = "bg-gray-500/20 text-gray-700 border-gray-500/30";
      detailsText = `Not applicable for this product. Last checked: ${new Date(data.lastChecked).toLocaleDateString()}`;
      break;
    default:
      IconComponent = InfoIcon; // Default for any other unhandled status
      badgeVariant = "outline"; // A neutral outline
      badgeClasses = "bg-blue-500/20 text-blue-700 border-blue-500/30"; // Default to info-like blue
      break;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-md border hover:bg-muted/30 transition-colors">
      <div className="flex items-center">
        <IconComponent className={cn("h-5 w-5 mr-3 flex-shrink-0",
          badgeClasses.split(' ')[1] // Use the text color from badgeClasses for the icon
        )} />
        <div>
          <span className="text-sm font-medium">{titleText}</span>
          {detailsText && <span className="block text-xs text-muted-foreground">{detailsText}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actionButton}
        <Badge variant={badgeVariant} className={cn("text-xs capitalize", badgeClasses)}>
          {data.status.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
};

const OverallProductCompliance: React.FC<OverallProductComplianceProps> = ({ complianceData, notifications, onSyncEprel, isSyncingEprel, canSyncEprel }) => {
  if (!complianceData) {
    return <p className="text-muted-foreground">Overall compliance data not available.</p>;
  }

  const hasErrorNotifications = notifications?.some(n => n.type === 'error');

  const eprelSyncButton = (onSyncEprel) ? (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
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
              <InfoIcon className="h-4 w-4 mr-2 text-info" />
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
        <CardTitle className={cn("text-lg font-headline flex items-center", hasErrorNotifications && "text-destructive")}>
          {hasErrorNotifications && <AlertTriangle className="mr-2 h-5 w-5" />}
          Overall Product Compliance
        </CardTitle>
        <CardDescription>
          Summary of the product's adherence to key regulations.
          {hasErrorNotifications && <span className="block text-destructive font-medium mt-1">Attention: Critical alerts require review.</span>}
        </CardDescription>
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

    
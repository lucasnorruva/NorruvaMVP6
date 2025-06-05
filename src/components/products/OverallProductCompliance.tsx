
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Info, ShieldQuestion, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '../ui/button';

export interface ComplianceStatus {
  status: 'compliant' | 'non_compliant' | 'pending_review' | 'not_applicable' | 'in_progress';
  lastChecked: string;
  entryId?: string;
  verificationId?: string;
  declarationId?: string;
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
}

const ComplianceItem: React.FC<{ title: string; data: ComplianceStatus }> = ({ title, data }) => {
  let IconComponent = Info;
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let badgeClasses = "bg-muted text-muted-foreground";
  let titleText = title;
  let detailsText = `Last checked: ${new Date(data.lastChecked).toLocaleDateString()}`;

  switch (data.status) {
    case 'compliant':
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
      IconComponent = AlertCircle;
      badgeVariant = "destructive";
      badgeClasses = "bg-red-500/20 text-red-700 border-red-500/30";
      break;
    case 'pending_review':
      IconComponent = Info;
      badgeVariant = "outline";
      badgeClasses = "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
       if (title.includes("EBSI") && data.verificationId === "PENDING_EBSI_CHECK") {
         detailsText = `Verification Pending - ${detailsText}`;
      }
      break;
    case 'in_progress':
      IconComponent = Info;
      badgeVariant = "outline";
      badgeClasses = "bg-blue-500/20 text-blue-700 border-blue-500/30";
      break;
    case 'not_applicable':
      IconComponent = ShieldQuestion;
      badgeVariant = "secondary";
      badgeClasses = "bg-gray-500/20 text-gray-700 border-gray-500/30";
      detailsText = `Not applicable for this product.`; // Overwrite lastChecked for N/A
      break;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-md border hover:bg-muted/30 transition-colors">
      <div className="flex items-center">
        <IconComponent className={cn("h-5 w-5 mr-3 flex-shrink-0", 
          data.status === 'compliant' && 'text-green-500',
          data.status === 'non_compliant' && 'text-red-500',
          data.status === 'pending_review' && 'text-yellow-500',
          data.status === 'in_progress' && 'text-blue-500',
          data.status === 'not_applicable' && 'text-gray-500'
        )} />
        <div>
          <span className="text-sm font-medium">{titleText}</span>
          {detailsText && <span className="block text-xs text-muted-foreground">{detailsText}</span>}
        </div>
      </div>
      <Badge variant={badgeVariant} className={cn("text-xs capitalize", badgeClasses)}>
        {data.status.replace('_', ' ')}
      </Badge>
    </div>
  );
};

const OverallProductCompliance: React.FC<OverallProductComplianceProps> = ({ complianceData, notifications }) => {
  if (!complianceData) {
    return <p className="text-muted-foreground">Overall compliance data not available.</p>;
  }

  const hasErrorNotifications = notifications?.some(n => n.type === 'error');

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
        <ComplianceItem title="EPREL Energy Label" data={complianceData.eprel} />
        <ComplianceItem title="EBSI/Blockchain Verification" data={complianceData.ebsiVerified} />
        <ComplianceItem title="SCIP Database (Substances of Concern)" data={complianceData.scip} />
        <ComplianceItem title="CSRD Reporting Alignment" data={complianceData.csrd} />
      </CardContent>
    </Card>
  );
};

export default OverallProductCompliance;

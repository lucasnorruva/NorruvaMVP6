
// --- File: dppDisplayUtils.ts ---
// Description: Utility functions for generating display details (text, icons, variants) for DPP compliance and EBSI status.

import type { DigitalProductPassport, EbsiVerificationDetails } from "@/types/dpp";
import { ShieldCheck, ShieldAlert, ShieldQuestion, Info as InfoIcon, AlertCircle, AlertTriangle } from 'lucide-react';
import React from "react"; // Import React for JSX elements

interface ComplianceDetails {
  text: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  icon: JSX.Element; // React.ElementType was too generic, JSX.Element is better for icons
  tooltipText: string;
}

interface EbsiStatusDisplayDetails extends ComplianceDetails {}

export const getOverallComplianceDetails = (dpp: DigitalProductPassport): ComplianceDetails => {
  let compliantCount = 0;
  let pendingCount = 0;
  let nonCompliantCount = 0;
  const regulationsChecked = Object.values(dpp.compliance).filter(
    (reg): reg is { status: string } => typeof reg === 'object' && reg !== null && 'status' in reg
  );

  if (regulationsChecked.length === 0) {
    if (Object.keys(dpp.compliance).length === 0) {
      return { text: "N/A", variant: "secondary", icon: <ShieldQuestion className="h-5 w-5 text-muted-foreground" />, tooltipText: "No regulations applicable or tracked." };
    }
    return { text: "No Data", variant: "outline", icon: <ShieldQuestion className="h-5 w-5 text-muted-foreground" />, tooltipText: "Compliance data not yet available." };
  }

  regulationsChecked.forEach(reg => {
    if (reg.status === 'compliant') compliantCount++;
    else if (reg.status === 'pending') pendingCount++;
    else if (reg.status === 'non_compliant') nonCompliantCount++;
  });

  if (nonCompliantCount > 0) {
    return { text: "Non-Compliant", variant: "destructive", icon: <ShieldAlert className="h-5 w-5 text-destructive" />, tooltipText: "One or more regulations are non-compliant." };
  }
  if (pendingCount > 0) {
    return { text: "Pending", variant: "outline", icon: <InfoIcon className="h-5 w-5 text-yellow-500" />, tooltipText: "One or more regulations are pending." };
  }
  if (compliantCount === regulationsChecked.length && regulationsChecked.length > 0) {
    return { text: "Fully Compliant", variant: "default", icon: <ShieldCheck className="h-5 w-5 text-green-500" />, tooltipText: "All tracked regulations compliant." };
  }
  return { text: "Review Needed", variant: "outline", icon: <ShieldQuestion className="h-5 w-5 text-muted-foreground" />, tooltipText: "Compliance status requires review." };
};

export const getEbsiStatusDetails = (status?: EbsiVerificationDetails['status']): EbsiStatusDisplayDetails => {
  if (!status) {
    return { text: "N/A", variant: "secondary", icon: <ShieldQuestion className="h-4 w-4 text-muted-foreground" />, tooltipText: "EBSI status unknown." };
  }
  switch (status) {
    case 'verified':
      return { text: "Verified", variant: "default", icon: <ShieldCheck className="h-4 w-4 text-green-500" />, tooltipText: "EBSI verification successful." };
    case 'pending_verification':
      return { text: "Pending", variant: "outline", icon: <InfoIcon className="h-4 w-4 text-yellow-500" />, tooltipText: "EBSI verification pending." };
    case 'not_verified':
      return { text: "Not Verified", variant: "destructive", icon: <AlertCircle className="h-4 w-4 text-red-500" />, tooltipText: "EBSI verification failed." };
    case 'error':
      return { text: "Error", variant: "destructive", icon: <AlertTriangle className="h-4 w-4 text-red-700" />, tooltipText: "Error during EBSI verification." };
    default:
      return { text: "Unknown", variant: "secondary", icon: <ShieldQuestion className="h-4 w-4 text-muted-foreground" />, tooltipText: "EBSI status is unknown." };
  }
};

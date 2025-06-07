
// --- File: dppDisplayUtils.ts ---
// Description: Utility functions for generating display details (text, icons, variants) for DPP compliance, EBSI status, and completeness.
"use client"; 

import React from "react"; 
import type { DigitalProductPassport, EbsiVerificationDetails, DisplayableProduct, ProductComplianceSummary, SimpleLifecycleEvent } from "@/types/dpp";
import { ShieldCheck, ShieldAlert, ShieldQuestion, Info as InfoIcon, AlertCircle, AlertTriangle, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ComplianceDetails {
  text: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  icon: JSX.Element;
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
      const iconElement = <ShieldQuestion className="h-5 w-5 text-muted-foreground" />;
      return { text: "N/A", variant: "secondary", icon: iconElement, tooltipText: "No regulations applicable or tracked." };
    }
    const iconElement = <ShieldQuestion className="h-5 w-5 text-muted-foreground" />;
    return { text: "No Data", variant: "outline", icon: iconElement, tooltipText: "Compliance data not yet available." };
  }

  regulationsChecked.forEach(reg => {
    const status = reg.status?.toLowerCase();
    if (status === 'compliant' || status === 'registered' || status === 'conformant' || status === 'synced successfully') compliantCount++;
    else if (status === 'pending' || status === 'pending_review' || status === 'pending_assessment' || status === 'pending_verification' || status === 'in progress' || status === 'data incomplete') pendingCount++;
    else if (status === 'non_compliant' || status === 'non_conformant' || status === 'error' || status === 'data mismatch' || status === 'product not found in eprel') nonCompliantCount++;
  });

  if (nonCompliantCount > 0) {
    const iconElement = <ShieldAlert className="h-5 w-5 text-destructive" />;
    return { text: "Non-Compliant", variant: "destructive", icon: iconElement, tooltipText: "One or more regulations are non-compliant." };
  }
  if (pendingCount > 0) {
    const iconElement = <InfoIcon className="h-5 w-5 text-yellow-500" />;
    return { text: "Pending", variant: "outline", icon: iconElement, tooltipText: "One or more regulations are pending." };
  }
  if (compliantCount === regulationsChecked.length && regulationsChecked.length > 0) {
    const iconElement = <ShieldCheck className="h-5 w-5 text-green-500" />;
    return { text: "Fully Compliant", variant: "default", icon: iconElement, tooltipText: "All tracked regulations compliant." };
  }
  const iconElementDefault = <ShieldQuestion className="h-5 w-5 text-muted-foreground" />;
  return { text: "Review Needed", variant: "outline", icon: iconElementDefault, tooltipText: "Compliance status requires review." };
};

export const getEbsiStatusDetails = (status?: EbsiVerificationDetails['status']): EbsiStatusDisplayDetails => {
  if (!status) {
    const iconElement = <ShieldQuestion className="h-4 w-4 text-muted-foreground" />;
    return { text: "N/A", variant: "secondary", icon: iconElement, tooltipText: "EBSI status unknown." };
  }
  switch (status) {
    case 'verified':
      const verifiedIcon = <ShieldCheck className="h-4 w-4 text-green-500" />;
      return { text: "Verified", variant: "default", icon: verifiedIcon, tooltipText: "EBSI verification successful." };
    case 'pending_verification':
      const pendingIcon = <InfoIcon className="h-4 w-4 text-yellow-500" />;
      return { text: "Pending", variant: "outline", icon: pendingIcon, tooltipText: "EBSI verification pending." };
    case 'not_verified':
      const notVerifiedIcon = <AlertCircle className="h-4 w-4 text-red-500" />;
      return { text: "Not Verified", variant: "destructive", icon: notVerifiedIcon, tooltipText: "EBSI verification failed." };
    case 'error':
      const errorIcon = <AlertTriangle className="h-4 w-4 text-red-700" />;
      return { text: "Error", variant: "destructive", icon: errorIcon, tooltipText: "Error during EBSI verification." };
    default:
      const unknownIcon = <ShieldQuestion className="h-4 w-4 text-muted-foreground" />;
      return { text: "Unknown", variant: "secondary", icon: unknownIcon, tooltipText: "EBSI status is unknown." };
  }
};

export const calculateDppCompletenessForList = (product: DisplayableProduct): { score: number; filledFields: number; totalFields: number; missingFields: string[] } => {
  const essentialFieldsConfig: Array<{ key: keyof DisplayableProduct | string; label: string; check?: (p: DisplayableProduct) => boolean; categoryScope?: string[] }> = [
    { key: 'productName', label: 'Product Name' },
    { key: 'gtin', label: 'GTIN' },
    { key: 'category', label: 'Category', check: p => !!(p.category || p.productCategory) },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'modelNumber', label: 'Model Number' },
    { key: 'description', label: 'Description', check: p => !!(p.description || p.productDescription) },
    { key: 'imageUrl', label: 'Image URL', check: (p) => !!p.imageUrl && !p.imageUrl.includes('placehold.co') && !p.imageUrl.includes('?text=') },
    { key: 'materials', label: 'Materials Info', check: p => !!p.materials && p.materials.trim() !== '' },
    { key: 'sustainabilityClaims', label: 'Sustainability Claims', check: p => !!p.sustainabilityClaims && p.sustainabilityClaims.trim() !== '' },
    { key: 'energyLabel', label: 'Energy Label', categoryScope: ['Appliances', 'Electronics'] },
    { key: 'specifications', label: 'Specifications', check: (p) => {
        if (typeof p.specifications === 'string') return !!p.specifications && p.specifications.trim() !== '' && p.specifications.trim() !== '{}';
        if (typeof p.specifications === 'object' && p.specifications !== null) return Object.keys(p.specifications).length > 0;
        return false;
      }
    },
    { key: 'lifecycleEvents', label: 'Lifecycle Events', check: (p) => (p.lifecycleEvents || []).length > 0 },
    { key: 'complianceSummary.overallStatus', label: 'Overall Compliance Status', check: (p) => p.complianceSummary?.overallStatus !== undefined && p.complianceSummary.overallStatus.toLowerCase() !== 'n/a' },
    { key: 'complianceSummary.eprel.status', label: 'EPREL Status', check: (p) => p.complianceSummary?.eprel?.status !== undefined && p.complianceSummary.eprel.status.toLowerCase() !== 'n/a' && !p.complianceSummary.eprel.status.toLowerCase().includes('not found') && !p.complianceSummary.eprel.status.toLowerCase().includes('not applicable')},
    { key: 'complianceSummary.ebsi.status', label: 'EBSI Status', check: (p) => p.complianceSummary?.ebsi?.status !== undefined && p.complianceSummary.ebsi.status.toLowerCase() !== 'n/a' && p.complianceSummary.ebsi.status.toLowerCase() !== 'not verified' && p.complianceSummary.ebsi.status.toLowerCase() !== 'error' },
    { key: 'complianceSummary.specificRegulations', label: 'Specific Regulations Count', check: (p) => (p.complianceSummary?.specificRegulations || []).length > 0 },
  ];

  const currentCategory = product.category || product.productCategory;
  const isBatteryRelevantCategory = currentCategory?.toLowerCase().includes('electronics') || currentCategory?.toLowerCase().includes('automotive') || currentCategory?.toLowerCase().includes('battery');

  if (isBatteryRelevantCategory || product.batteryChemistry) {
    essentialFieldsConfig.push({ key: 'batteryChemistry', label: 'Battery Chemistry' });
    essentialFieldsConfig.push({ key: 'stateOfHealth', label: 'Battery State of Health (SoH)', check: p => typeof p.stateOfHealth === 'number' && p.stateOfHealth !== null});
    essentialFieldsConfig.push({ key: 'carbonFootprintManufacturing', label: 'Battery Mfg. Carbon Footprint', check: p => typeof p.carbonFootprintManufacturing === 'number' && p.carbonFootprintManufacturing !== null });
    essentialFieldsConfig.push({ key: 'recycledContentPercentage', label: 'Battery Recycled Content', check: p => typeof p.recycledContentPercentage === 'number' && p.recycledContentPercentage !== null});
  }

  let filledCount = 0;
  const missingFields: string[] = [];
  let actualTotalFields = 0;

  essentialFieldsConfig.forEach(fieldConfig => {
    // Skip category-scoped fields if the category doesn't match
    if (fieldConfig.categoryScope) {
      const productCategoryLower = currentCategory?.toLowerCase();
      if (!productCategoryLower || !fieldConfig.categoryScope.some(scope => productCategoryLower.includes(scope.toLowerCase()))) { 
        return; // Skip this field, don't increment actualTotalFields
      }
    }
    actualTotalFields++; // Increment for fields that are applicable

    let isFieldFilled = false;
    if (fieldConfig.check) {
      isFieldFilled = fieldConfig.check(product);
    } else {
      const keys = (fieldConfig.key as string).split('.');
      let value: any = product;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }

      if (typeof value === 'object' && value !== null) {
        isFieldFilled = Object.keys(value).length > 0 || (Array.isArray(value) && value.length > 0);
      } else {
        isFieldFilled = value !== null && value !== undefined && String(value).trim() !== '' && String(value).toLowerCase().trim() !== 'n/a';
      }
    }

    if (isFieldFilled) {
      filledCount++;
    } else {
      missingFields.push(fieldConfig.label);
    }
  });

  const score = actualTotalFields > 0 ? Math.round((filledCount / actualTotalFields) * 100) : 0;
  return { score, filledFields: filledCount, totalFields: actualTotalFields, missingFields };
};


// Utility functions for status display (moved from ComplianceTab)
export const getStatusIcon = (status?: string): JSX.Element => {
  switch (status?.toLowerCase()) {
    case 'compliant':
    case 'registered':
    case 'verified':
    case 'synced successfully':
    case 'conformant': 
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case 'non-compliant':
    case 'non_conformant': 
    case 'error':
    case 'error during sync':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'pending':
    case 'pending review':
    case 'pending_review': 
    case 'pending_assessment': 
    case 'pending_verification': 
    case 'in progress':
    case 'data incomplete':
    case 'data mismatch':
    case 'product not found in eprel':
      return <InfoIcon className="h-5 w-5 text-yellow-500" />;
    case 'not applicable':
    case 'n/a':
    case 'not found':
    case 'not verified':
    default:
      return <InfoIcon className="h-5 w-5 text-muted-foreground" />;
  }
};

export const getStatusBadgeVariant = (status?: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status?.toLowerCase()) {
    case 'compliant':
    case 'registered':
    case 'verified':
    case 'synced successfully':
    case 'conformant':
      return "default";
    case 'non-compliant':
    case 'non_conformant':
    case 'error':
    case 'error during sync':
      return "destructive";
    case 'pending':
    case 'pending review':
    case 'pending_review':
    case 'pending_assessment':
    case 'pending_verification':
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

export const getStatusBadgeClasses = (status?: string): string => {
    switch (status?.toLowerCase()) {
        case 'compliant': case 'registered': case 'verified': case 'synced successfully': case 'conformant': return "bg-green-100 text-green-700 border-green-300";
        case 'non-compliant': case 'non_conformant': case 'error': case 'error during sync': return "bg-red-100 text-red-700 border-red-300";
        case 'pending': case 'pending review': case 'pending_review': case 'pending_assessment': case 'pending_verification': case 'in progress': case 'data incomplete': case 'data mismatch': case 'product not found in eprel': return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case 'not applicable': case 'n/a': case 'not found': case 'not verified':
        default: return "bg-muted text-muted-foreground";
    }
};


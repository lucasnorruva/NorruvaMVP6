// --- File: dppDisplayUtils.ts ---
// Description: Utility functions for generating display details (text, icons, variants) for DPP compliance, EBSI status, and completeness.

import type { DigitalProductPassport, EbsiVerificationDetails, DisplayableProduct } from "@/types/dpp";
import { ShieldCheck, ShieldAlert, ShieldQuestion, Info as InfoIcon, AlertCircle, AlertTriangle } from 'lucide-react';
import React from "react";

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

export const calculateDppCompletenessForList = (product: DisplayableProduct): { score: number; filledFields: number; totalFields: number; missingFields: string[] } => {
  const essentialFieldsConfig: Array<{ key: keyof DisplayableProduct; label: string; check?: (p: DisplayableProduct) => boolean; categoryScope?: string[] }> = [
    { key: 'productName', label: 'Product Name' },
    { key: 'gtin', label: 'GTIN' },
    { key: 'category', label: 'Category', check: p => !!(p.category || p.productCategory) },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'modelNumber', label: 'Model Number' },
    { key: 'description', label: 'Description', check: p => !!(p.description || p.productDescription) },
    { key: 'imageUrl', label: 'Image URL', check: (p) => !!p.imageUrl && !p.imageUrl.includes('placehold.co') && !p.imageUrl.includes('?text=') },
    { key: 'materials', label: 'Materials' },
    { key: 'sustainabilityClaims', label: 'Sustainability Claims' },
    { key: 'energyLabel', label: 'Energy Label', categoryScope: ['Appliances', 'Electronics'] },
    { key: 'specifications', label: 'Specifications', check: (p) => {
        if (typeof p.specifications === 'string') return !!p.specifications && p.specifications.trim() !== '' && p.specifications.trim() !== '{}';
        if (typeof p.specifications === 'object' && p.specifications !== null) return Object.keys(p.specifications).length > 0;
        return false;
      }
    },
    { key: 'lifecycleEvents', label: 'Lifecycle Events', check: (p) => (p.lifecycleEvents || []).length > 0 },
    { key: 'complianceSummary', label: 'Compliance Summary', check: (p) => p.complianceSummary && ( (p.complianceSummary.specificRegulations && p.complianceSummary.specificRegulations.length > 0) || !!p.complianceSummary.eprel || !!p.complianceSummary.ebsi ) },
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
    if (fieldConfig.categoryScope) {
      const productCategoryLower = currentCategory?.toLowerCase();
      if (!productCategoryLower || !fieldConfig.categoryScope.some(scope => productCategoryLower.includes(scope.toLowerCase()))) { return; } // Skip field if not in scope
    }
    actualTotalFields++;

    let isFieldFilled = false;
    if (fieldConfig.check) {
      isFieldFilled = fieldConfig.check(product);
    } else {
      const value = product[fieldConfig.key];
      if (typeof value === 'object' && value !== null) {
        isFieldFilled = Object.keys(value).length > 0 || (Array.isArray(value) && value.length > 0);
      } else {
        isFieldFilled = value !== null && value !== undefined && String(value).trim() !== '' && String(value).trim() !== 'N/A';
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

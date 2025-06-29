// --- File: dppDisplayUtils.tsx ---
// Description: Utility functions for generating display details (text, icons, variants) for DPP compliance, EBSI status, and completeness.

import React from "react";
import type {
  DigitalProductPassport,
  EbsiVerificationDetails,
  DisplayableProduct,
  ProductComplianceSummary,
  SimpleLifecycleEvent,
} from "@/types/dpp";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Info as InfoIcon,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceDetails {
  text: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  icon: JSX.Element;
  tooltipText: string;
}

interface EbsiStatusDisplayDetails extends ComplianceDetails {}

// Configuration for DPP completeness checks
const BASE_ESSENTIAL_FIELDS_CONFIG: Array<{
  key: keyof DisplayableProduct | string;
  label: string;
  check?: (p: DisplayableProduct) => boolean;
  categoryScope?: string[];
}> = [
  { key: "productName", label: "Product Name" },
  { key: "gtin", label: "GTIN" },
  {
    key: "category",
    label: "Category",
    check: (p) => !!(p.category || p.productCategory),
  },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "modelNumber", label: "Model Number" },
  {
    key: "description",
    label: "Description",
    check: (p) => !!(p.description || p.productDescription),
  },
  {
    key: "imageUrl",
    label: "Image URL",
    check: (p) =>
      !!p.imageUrl &&
      !p.imageUrl.includes("placehold.co") &&
      !p.imageUrl.includes("?text="),
  },
  {
    key: "materials",
    label: "Materials Info",
    check: (p) => !!p.materials && p.materials.trim() !== "",
  },
  {
    key: "sustainabilityClaims",
    label: "Sustainability Claims",
    check: (p) =>
      !!p.sustainabilityClaims && p.sustainabilityClaims.trim() !== "",
  },
  {
    key: "energyLabel",
    label: "Energy Label",
    categoryScope: ["Appliances", "Electronics"],
  },
  {
    key: "specifications",
    label: "Specifications",
    check: (p) => {
      if (typeof p.specifications === "string")
        return (
          !!p.specifications &&
          p.specifications.trim() !== "" &&
          p.specifications.trim() !== "{}"
        );
      if (typeof p.specifications === "object" && p.specifications !== null)
        return Object.keys(p.specifications).length > 0;
      return false;
    },
  },
  {
    key: "lifecycleEvents",
    label: "Lifecycle Events",
    check: (p) => (p.lifecycleEvents || []).length > 0,
  },
  {
    key: "complianceSummary.overallStatus",
    label: "Overall Compliance Status",
    check: (p) =>
      p.complianceSummary?.overallStatus !== undefined &&
      p.complianceSummary.overallStatus.toLowerCase() !== "n/a",
  },
  {
    key: "complianceSummary.eprel.status",
    label: "EPREL Status",
    check: (p) =>
      p.complianceSummary?.eprel?.status !== undefined &&
      p.complianceSummary.eprel.status.toLowerCase() !== "n/a" &&
      !p.complianceSummary.eprel.status.toLowerCase().includes("not found"),
  },
  {
    key: "complianceSummary.ebsi.status",
    label: "EBSI Status",
    check: (p) =>
      p.complianceSummary?.ebsi?.status !== undefined &&
      p.complianceSummary.ebsi.status.toLowerCase() !== "n/a" &&
      p.complianceSummary.ebsi.status.toLowerCase() !== "not verified" &&
      p.complianceSummary.ebsi.status.toLowerCase() !== "error",
  },
  {
    key: "complianceSummary.specificRegulations",
    label: "Specific Regulations Count",
    check: (p) => (p.complianceSummary?.specificRegulations || []).length > 0,
  },
];

const BATTERY_FIELDS_CONFIG: Array<{
  key: keyof DisplayableProduct | string;
  label: string;
  check?: (p: DisplayableProduct) => boolean;
}> = [
  { key: "batteryChemistry", label: "Battery Chemistry" },
  {
    key: "stateOfHealth",
    label: "Battery State of Health (SoH)",
    check: (p) =>
      typeof p.stateOfHealth === "number" && p.stateOfHealth !== null,
  },
  {
    key: "carbonFootprintManufacturing",
    label: "Battery Mfg. Carbon Footprint",
    check: (p) =>
      typeof p.carbonFootprintManufacturing === "number" &&
      p.carbonFootprintManufacturing !== null,
  },
  {
    key: "recycledContentPercentage",
    label: "Battery Recycled Content",
    check: (p) =>
      typeof p.recycledContentPercentage === "number" &&
      p.recycledContentPercentage !== null,
  },
];

export const getOverallComplianceDetails = (
  dpp: DigitalProductPassport,
): ComplianceDetails => {
  let compliantCount = 0;
  let pendingCount = 0;
  let nonCompliantCount = 0;
  const regulationsChecked = Object.values(dpp.compliance).filter(
    (reg): reg is { status: string } =>
      typeof reg === "object" &&
      reg !== null &&
      "status" in reg &&
      typeof reg.status === "string",
  );

  if (regulationsChecked.length === 0) {
    if (Object.keys(dpp.compliance).length === 0) {
      const iconElement = (
        <ShieldQuestion className="h-5 w-5 text-muted-foreground" />
      );
      return {
        text: "N/A",
        variant: "secondary",
        icon: iconElement,
        tooltipText: "No regulations applicable or tracked.",
      };
    }
    const iconElement = (
      <ShieldQuestion className="h-5 w-5 text-muted-foreground" />
    );
    return {
      text: "No Data",
      variant: "outline",
      icon: iconElement,
      tooltipText: "Compliance data not yet available.",
    };
  }

  regulationsChecked.forEach((reg) => {
    const status = reg.status?.toLowerCase();
    // Compliant statuses
    if (
      [
        "compliant",
        "registered",
        "conformant",
        "synced successfully",
        "verified",
        "cleared",
        "notified",
      ].includes(status)
    )
      compliantCount++;
    // Pending statuses
    else if (
      [
        "pending",
        "pending_review",
        "pending_assessment",
        "pending_verification",
        "in progress",
        "data incomplete",
        "pending notification",
        "pending documents",
      ].includes(status)
    )
      pendingCount++;
    // Non-compliant statuses
    else if (
      [
        "non_compliant",
        "non_conformant",
        "error",
        "data mismatch",
        "product not found in eprel",
        "mismatch",
      ].includes(status)
    )
      nonCompliantCount++;
    // Neutral statuses like 'N/A', 'Not Applicable', 'Not Required' are ignored for this calculation
  });

  if (nonCompliantCount > 0) {
    const iconElement = <ShieldAlert className="h-5 w-5 text-destructive" />;
    return {
      text: "Non-Compliant",
      variant: "destructive",
      icon: iconElement,
      tooltipText: "One or more regulations are non-compliant.",
    };
  }
  if (pendingCount > 0) {
    const iconElement = <InfoIcon className="h-5 w-5 text-warning" />;
    return {
      text: "Pending",
      variant: "outline",
      icon: iconElement,
      tooltipText: "One or more regulations are pending.",
    };
  }
  if (
    compliantCount ===
      regulationsChecked.filter(
        (r) =>
          !["n/a", "not applicable", "not required"].includes(
            r.status.toLowerCase(),
          ),
      ).length &&
    compliantCount > 0
  ) {
    const iconElement = <ShieldCheck className="h-5 w-5 text-success" />;
    return {
      text: "Fully Compliant",
      variant: "default",
      icon: iconElement,
      tooltipText: "All tracked regulations compliant.",
    };
  }
  if (compliantCount > 0 && (pendingCount > 0 || nonCompliantCount === 0)) {
    const iconElement = <ShieldCheck className="h-5 w-5 text-success" />; // Or InfoIcon if we want to be more conservative
    return {
      text: "Partially Compliant",
      variant: "default",
      icon: iconElement,
      tooltipText:
        "Some regulations are compliant, others may be pending or N/A.",
    };
  }
  const iconElementDefault = (
    <ShieldQuestion className="h-5 w-5 text-muted-foreground" />
  );
  return {
    text: "Review Needed",
    variant: "outline",
    icon: iconElementDefault,
    tooltipText: "Compliance status requires review.",
  };
};

export const getEbsiStatusDetails = (
  status?: EbsiVerificationDetails["status"],
): EbsiStatusDisplayDetails => {
  if (!status) {
    const iconElement = (
      <ShieldQuestion className="h-4 w-4 text-muted-foreground" />
    );
    return {
      text: "N/A",
      variant: "secondary",
      icon: iconElement,
      tooltipText: "EBSI status unknown.",
    };
  }
  switch (status) {
    case "verified":
      const verifiedIcon = <ShieldCheck className="h-4 w-4 text-success" />;
      return {
        text: "Verified",
        variant: "default",
        icon: verifiedIcon,
        tooltipText: "EBSI verification successful.",
      };
    case "pending_verification":
      const pendingIcon = <InfoIcon className="h-4 w-4 text-warning" />;
      return {
        text: "Pending",
        variant: "outline",
        icon: pendingIcon,
        tooltipText: "EBSI verification pending.",
      };
    case "not_verified":
      const notVerifiedIcon = <AlertCircle className="h-4 w-4 text-danger" />;
      return {
        text: "Not Verified",
        variant: "destructive",
        icon: notVerifiedIcon,
        tooltipText: "EBSI verification failed.",
      };
    case "error":
      const errorIcon = <AlertTriangle className="h-4 w-4 text-red-700" />;
      return {
        text: "Error",
        variant: "destructive",
        icon: errorIcon,
        tooltipText: "Error during EBSI verification.",
      };
    default:
      const unknownIcon = (
        <ShieldQuestion className="h-4 w-4 text-muted-foreground" />
      );
      return {
        text: "Unknown",
        variant: "secondary",
        icon: unknownIcon,
        tooltipText: "EBSI status is unknown.",
      };
  }
};

export const calculateDppCompletenessForList = (
  product: DisplayableProduct,
): {
  score: number;
  filledFields: number;
  totalFields: number;
  missingFields: string[];
} => {
  let essentialFieldsConfig = [...BASE_ESSENTIAL_FIELDS_CONFIG];

  const currentCategory = product.category || product.productCategory;
  const isBatteryRelevantCategory =
    currentCategory?.toLowerCase().includes("electronics") ||
    currentCategory?.toLowerCase().includes("automotive") ||
    currentCategory?.toLowerCase().includes("battery");

  if (isBatteryRelevantCategory || product.batteryChemistry) {
    essentialFieldsConfig = [
      ...essentialFieldsConfig,
      ...BATTERY_FIELDS_CONFIG,
    ];
  }

  let filledCount = 0;
  const missingFields: string[] = [];
  let actualTotalFields = 0;

  essentialFieldsConfig.forEach((fieldConfig) => {
    if (fieldConfig.categoryScope) {
      const productCategoryLower = currentCategory?.toLowerCase();
      if (
        !productCategoryLower ||
        !fieldConfig.categoryScope.some((scope) =>
          productCategoryLower.includes(scope.toLowerCase()),
        )
      ) {
        return;
      }
    }
    actualTotalFields++;

    let isFieldFilled = false;
    if (fieldConfig.check) {
      isFieldFilled = fieldConfig.check(product);
    } else {
      const keys = (fieldConfig.key as string).split(".");
      let value: any = product;
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }

      if (typeof value === "object" && value !== null) {
        isFieldFilled =
          Object.keys(value).length > 0 ||
          (Array.isArray(value) && value.length > 0);
      } else {
        isFieldFilled =
          value !== null &&
          value !== undefined &&
          String(value).trim() !== "" &&
          String(value).toLowerCase().trim() !== "n/a";
      }
    }

    if (isFieldFilled) {
      filledCount++;
    } else {
      missingFields.push(fieldConfig.label);
    }
  });

  const score =
    actualTotalFields > 0
      ? Math.round((filledCount / actualTotalFields) * 100)
      : 0;
  return {
    score,
    filledFields: filledCount,
    totalFields: actualTotalFields,
    missingFields,
  };
};

// Utility functions for status display (moved from ComplianceTab)

interface StatusDisplayConfig {
  icon: JSX.Element;
  variant: "default" | "destructive" | "outline" | "secondary";
  classes: string;
}

const successDisplay: StatusDisplayConfig = {
  icon: <ShieldCheck className="h-5 w-5 text-success" />,
  variant: "default",
  classes: "bg-green-100 text-green-700 border-green-300",
};

const errorDisplay: StatusDisplayConfig = {
  icon: <AlertTriangle className="h-5 w-5 text-danger" />,
  variant: "destructive",
  classes: "bg-red-100 text-red-700 border-red-300",
};

const pendingDisplay: StatusDisplayConfig = {
  icon: <InfoIcon className="h-5 w-5 text-warning" />,
  variant: "outline",
  classes: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const defaultDisplay: StatusDisplayConfig = {
  icon: <InfoIcon className="h-5 w-5 text-muted-foreground" />,
  variant: "secondary",
  classes: "bg-muted text-muted-foreground",
};

const STATUS_DISPLAY_MAP: Record<string, StatusDisplayConfig> = {
  compliant: successDisplay,
  registered: successDisplay,
  verified: successDisplay,
  "synced successfully": successDisplay,
  conformant: successDisplay,
  cleared: successDisplay,
  notified: successDisplay,

  "non-compliant": errorDisplay,
  non_conformant: errorDisplay,
  error: errorDisplay,
  "error during sync": errorDisplay,
  mismatch: errorDisplay,

  pending: pendingDisplay,
  "pending review": pendingDisplay,
  pending_review: pendingDisplay,
  pending_assessment: pendingDisplay,
  pending_verification: pendingDisplay,
  "in progress": pendingDisplay,
  "data incomplete": pendingDisplay,
  "data mismatch": pendingDisplay, // This was in errorDisplay, but can also mean pending action
  "product not found in eprel": pendingDisplay,
  "pending notification": pendingDisplay,
  "pending documents": pendingDisplay,

  "not applicable": defaultDisplay,
  "n/a": defaultDisplay,
  "not found": defaultDisplay,
  "not verified": defaultDisplay,
  "not required": defaultDisplay,
  default: defaultDisplay,
};

export const getStatusIcon = (status?: string): JSX.Element => {
  const key = status?.toLowerCase().trim() ?? "default";
  return STATUS_DISPLAY_MAP[key]?.icon ?? STATUS_DISPLAY_MAP.default.icon;
};

export const getStatusBadgeVariant = (
  status?: string,
): "default" | "destructive" | "outline" | "secondary" => {
  const key = status?.toLowerCase().trim() ?? "default";
  return STATUS_DISPLAY_MAP[key]?.variant ?? STATUS_DISPLAY_MAP.default.variant;
};

export const getStatusBadgeClasses = (status?: string): string => {
  const key = status?.toLowerCase().trim() ?? "default";
  return STATUS_DISPLAY_MAP[key]?.classes ?? STATUS_DISPLAY_MAP.default.classes;
};

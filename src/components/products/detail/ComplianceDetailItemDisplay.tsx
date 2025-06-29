// --- File: ComplianceDetailItemDisplay.tsx ---
// Description: Component to display a single compliance detail item.
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Info as InfoIconFromLucide } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getStatusIcon,
  getStatusBadgeVariant,
  getStatusBadgeClasses,
} from "@/utils/dppDisplayUtils";

export interface ComplianceDetailItemProps {
  title: string;
  icon: React.ElementType;
  status: string;
  lastChecked: string;
  id?: string;
  verificationId?: string;
  url?: string;
  notes?: string;
  actionButton?: React.ReactNode;
}

const ComplianceDetailItemDisplay: React.FC<ComplianceDetailItemProps> = ({
  title,
  icon: ItemIcon,
  status,
  lastChecked,
  id,
  verificationId,
  url,
  notes,
  actionButton,
}) => {
  const StatusIconComponent = getStatusIcon(status);
  const badgeVariant = getStatusBadgeVariant(status);
  const badgeClasses = getStatusBadgeClasses(status);
  let detailsText = `Last checked: ${new Date(lastChecked).toLocaleDateString()}`;

  const formattedStatus = status
    .replace(/_/g, " ")
    .replace(
      /\b(eprel|in|id|url|co2e|kwh|mfg|svhc|sds|qa|gwp|voc|ebsi)\b/gi,
      (match) => match.toUpperCase(),
    )
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (
    title.includes("EBSI") &&
    verificationId &&
    status.toLowerCase() === "verified"
  ) {
    detailsText = `Verified (ID: ${verificationId}) - ${detailsText}`;
  } else if (
    title.includes("EPREL") &&
    id &&
    (status.toLowerCase() === "registered" ||
      status.toLowerCase().includes("synced") ||
      status.toLowerCase().includes("mismatch"))
  ) {
    detailsText = `Entry ID: ${id} - ${detailsText}`;
  } else if (
    title.includes("EBSI") &&
    verificationId === "PENDING_EBSI_CHECK" &&
    status.toLowerCase() === "pending"
  ) {
    detailsText = `Verification Pending - ${detailsText}`;
  } else if (
    status.toLowerCase() === "not applicable" ||
    status.toLowerCase() === "n/a"
  ) {
    detailsText = `Not applicable for this product. Last checked: ${new Date(lastChecked).toLocaleDateString()}`;
  } else if (id && !title.includes("EPREL") && !title.includes("EBSI")) {
    detailsText = `ID: ${id} - ${detailsText}`;
  }

  return (
    <div className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-md text-foreground flex items-center">
          <ItemIcon className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
          {title}
        </h4>
        <div className="flex items-center gap-2">
          {actionButton}
          <Badge variant={badgeVariant} className={cn("text-xs", badgeClasses)}>
            {React.cloneElement(StatusIconComponent, {
              className: "mr-1.5 h-3.5 w-3.5",
            })}
            {formattedStatus}
          </Badge>
        </div>
      </div>
      <div className="text-xs space-y-1 text-muted-foreground pl-7">
        {" "}
        {/* Indent details slightly */}
        <p>{detailsText}</p>
        {notes && (
          <p>
            <strong className="text-foreground/80">Notes:</strong>{" "}
            <span className="text-foreground/90">{notes}</span>
          </p>
        )}
        {url && (
          <Button
            variant="link"
            size="sm"
            asChild
            className="p-0 h-auto text-primary mt-1.5"
          >
            <Link href={url} target="_blank" rel="noopener noreferrer">
              View Details <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ComplianceDetailItemDisplay;

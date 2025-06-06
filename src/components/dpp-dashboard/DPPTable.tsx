
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { DigitalProductPassport } from "@/types/dpp";
import { MoreHorizontal, Eye, Edit, Settings as SettingsIcon, ShieldCheck, ShieldAlert, ShieldQuestion, Info as InfoIcon, ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SortableKeys = keyof DigitalProductPassport | 'metadata.status' | 'metadata.last_updated' | 'overallCompliance';

interface DPPTableProps {
  dpps: DigitalProductPassport[];
  onSort: (key: SortableKeys) => void;
  sortConfig: { key: SortableKeys | null; direction: 'ascending' | 'descending' | null };
  onDeleteProduct?: (productId: string) => void; // Kept for internal product list page if needed, but not used for settings action here
}

interface ComplianceDetails {
  text: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  icon: JSX.Element;
  tooltipText: string;
}

const getOverallComplianceDetails = (dpp: DigitalProductPassport): ComplianceDetails => {
  let compliantCount = 0;
  let pendingCount = 0;
  let nonCompliantCount = 0;
  const regulationsChecked = Object.values(dpp.compliance).filter(
    (reg): reg is { status: string } => typeof reg === 'object' && reg !== null && 'status' in reg
  );

  if (regulationsChecked.length === 0) {
    if (Object.keys(dpp.compliance).length === 0) {
      return { text: "N/A", variant: "secondary", icon: <ShieldQuestion className="h-5 w-5 text-muted-foreground" />, tooltipText: "No regulations applicable or tracked for this product." };
    }
    return { text: "No Data", variant: "outline", icon: <ShieldQuestion className="h-5 w-5 text-muted-foreground" />, tooltipText: "Compliance data not yet available for defined regulations." };
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
    return { text: "Pending", variant: "outline", icon: <InfoIcon className="h-5 w-5 text-yellow-500" />, tooltipText: "One or more regulations are pending review or data submission." };
  }
  if (compliantCount === regulationsChecked.length && regulationsChecked.length > 0) {
    return { text: "Fully Compliant", variant: "default", icon: <ShieldCheck className="h-5 w-5 text-green-500" />, tooltipText: "All tracked regulations are compliant." };
  }
  return { text: "Review Needed", variant: "outline", icon: <ShieldQuestion className="h-5 w-5 text-muted-foreground" />, tooltipText: "Compliance status requires review." };
};

const SortableHeader: React.FC<{
  columnKey: SortableKeys;
  title: string;
  onSort: (key: SortableKeys) => void;
  sortConfig: DPPTableProps['sortConfig'];
  className?: string;
}> = ({ columnKey, title, onSort, sortConfig, className }) => {
  const isSorted = sortConfig.key === columnKey;
  const Icon = isSorted ? (sortConfig.direction === 'ascending' ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <TableHead className={cn("cursor-pointer hover:bg-muted/50 transition-colors", className)} onClick={() => onSort(columnKey)}>
      <div className="flex items-center gap-2">
        {title}
        <Icon className={cn("h-4 w-4", isSorted ? "text-primary" : "text-muted-foreground/50")} />
      </div>
    </TableHead>
  );
};

export const DPPTable: React.FC<DPPTableProps> = ({ dpps, onSort, sortConfig, onDeleteProduct }) => {
  const router = useRouter();

  const handleDPPSettings = (dppId: string) => {
    // For now, this is a mock action. Later, it could navigate to a specific settings page for the DPP.
    // e.g., router.push(`/products/${dppId}/settings`);
    alert(`Mock: Opening settings for DPP ${dppId}.`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader columnKey="id" title="ID" onSort={onSort} sortConfig={sortConfig} />
          <SortableHeader columnKey="productName" title="Product Name" onSort={onSort} sortConfig={sortConfig} />
          <SortableHeader columnKey="category" title="Category" onSort={onSort} sortConfig={sortConfig} />
          <SortableHeader columnKey="metadata.status" title="Status" onSort={onSort} sortConfig={sortConfig} />
          <TableHead>Overall Compliance</TableHead>
          <SortableHeader columnKey="metadata.last_updated" title="Last Updated" onSort={onSort} sortConfig={sortConfig} />
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dpps.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              No Digital Product Passports match your current filters.
            </TableCell>
          </TableRow>
        )}
        {dpps.map((dpp) => {
          const complianceDetails = getOverallComplianceDetails(dpp);
          return (
            <TableRow key={dpp.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">
                <Link href={`/products/${dpp.id}`} className="text-primary hover:underline">
                  {dpp.id}
                </Link>
              </TableCell>
              <TableCell>{dpp.productName}</TableCell>
              <TableCell>{dpp.category}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    dpp.metadata.status === "published" ? "default" :
                    dpp.metadata.status === "archived" ? "secondary" : "outline"
                  }
                  className={cn(
                    "capitalize",
                    dpp.metadata.status === "published" && "bg-green-500/20 text-green-700 border-green-500/30",
                    dpp.metadata.status === "draft" && "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
                    dpp.metadata.status === "pending_review" && "bg-orange-500/20 text-orange-600 border-orange-500/30",
                    dpp.metadata.status === "archived" && "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {dpp.metadata.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">{complianceDetails.icon}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{complianceDetails.tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Badge
                    variant={complianceDetails.variant}
                    className={cn(
                        complianceDetails.variant === "default" && "bg-green-500/20 text-green-700 border-green-500/30",
                        complianceDetails.variant === "destructive" && "bg-red-500/20 text-red-700 border-red-500/30",
                        complianceDetails.variant === "outline" && complianceDetails.text === "Pending" && "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
                        complianceDetails.variant === "outline" && complianceDetails.text === "No Data" && "bg-blue-500/20 text-blue-700 border-blue-500/30",
                        complianceDetails.variant === "secondary" && "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {complianceDetails.text}
                    </Badge>
                </div>
              </TableCell>
              <TableCell>{new Date(dpp.metadata.last_updated).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                      <span className="sr-only">DPP Actions for {dpp.productName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                       <Link href={`/products/${dpp.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/products/new?edit=${dpp.id}`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDPPSettings(dpp.id)}>
                      <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

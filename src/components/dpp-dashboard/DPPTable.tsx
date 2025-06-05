
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { DigitalProductPassport } from "@/types/dpp";
import { MoreHorizontal, Eye, Edit, Trash2, ShieldCheck, ShieldAlert, ShieldQuestion, Info as InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DPPTableProps {
  dpps: DigitalProductPassport[];
}

type ComplianceDetails = {
  text: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  icon: JSX.Element;
  tooltipText: string;
};

const getOverallComplianceDetails = (dpp: DigitalProductPassport): ComplianceDetails => {
  let compliantCount = 0;
  let pendingCount = 0;
  let nonCompliantCount = 0;
  // Ensure that we only count regulations that have a status object
  const regulationsChecked = Object.values(dpp.compliance).filter(
    (reg): reg is { status: string } => typeof reg === 'object' && reg !== null && 'status' in reg
  );


  if (regulationsChecked.length === 0) {
    if (Object.keys(dpp.compliance).length === 0) { // No regulations defined at all
      return { text: "N/A", variant: "secondary", icon: <ShieldQuestion className="h-5 w-5 text-muted-foreground" />, tooltipText: "No regulations applicable or tracked for this product." };
    }
    // Regulations might be defined as keys (e.g. eu_espr: undefined) but no actual status object
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
  // Fallback for mixed or unexpected states, though ideally covered by above.
  return { text: "Review Needed", variant: "outline", icon: <ShieldQuestion className="h-5 w-5 text-muted-foreground" />, tooltipText: "Compliance status requires review." };
};


export const DPPTable: React.FC<DPPTableProps> = ({ dpps }) => {
  const router = useRouter();

  const handleDPPDelete = (dppId: string) => {
    alert(`Mock: Deleting DPP ${dppId}`);
  };
  
  const handleDPPEdit = (dppId: string) => {
    alert(`Mock: Navigating to edit DPP ${dppId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Overall Compliance</TableHead>
          <TableHead>Last Updated</TableHead>
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
                        <span>{complianceDetails.icon}</span>
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
                      <span className="sr-only">DPP Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                       <Link href={`/products/${dpp.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDPPEdit(dpp.id)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit (Mock)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDPPDelete(dpp.id)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete (Mock)
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

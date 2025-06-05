
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { DigitalProductPassport } from "@/types/dpp";
import { MoreHorizontal, Eye, Edit, Trash2, ShieldCheck, ShieldAlert, ShieldQuestion, CheckCircle, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Using next/navigation for App Router

interface DPPTableProps {
  dpps: DigitalProductPassport[];
  // onDPPClick: (dppId: string) => void; // Replaced with Link
  // onDPPEdit: (dppId: string) => void;
  // onDPPDelete: (dppId: string) => void; // Mocked for now
}

export const DPPTable: React.FC<DPPTableProps> = ({ dpps }) => {
  const router = useRouter();

  const handleDPPDelete = (dppId: string) => {
    // In a real app, this would trigger a deletion flow
    alert(`Mock: Deleting DPP ${dppId}`);
  };
  
  const handleDPPEdit = (dppId: string) => {
     // In a real app, this would navigate to an edit page
    alert(`Mock: Navigating to edit DPP ${dppId}`);
    // router.push(`/products/${dppId}/edit`); // Example navigation
  };

  const getOverallComplianceIcon = (dpp: DigitalProductPassport) => {
    let compliantCount = 0;
    let pendingCount = 0;
    let nonCompliantCount = 0;
    const regulationsChecked = Object.values(dpp.compliance).filter(Boolean);

    if (regulationsChecked.length === 0) {
      return <ShieldQuestion className="h-5 w-5 text-muted-foreground" title="No compliance data" />;
    }

    regulationsChecked.forEach(reg => {
      if (reg.status === 'compliant') compliantCount++;
      else if (reg.status === 'pending') pendingCount++;
      else if (reg.status === 'non_compliant') nonCompliantCount++;
    });

    if (nonCompliantCount > 0) return <ShieldAlert className="h-5 w-5 text-destructive" title="Non-Compliant" />;
    if (pendingCount > 0) return <Info className="h-5 w-5 text-yellow-500" title="Pending Compliance" />;
    if (compliantCount === regulationsChecked.length && regulationsChecked.length > 0) {
      return <ShieldCheck className="h-5 w-5 text-green-500" title="Fully Compliant" />;
    }
    return <ShieldQuestion className="h-5 w-5 text-muted-foreground" title="Mixed Compliance Status" />;
  };


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Compliance</TableHead>
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
        {dpps.map((dpp) => (
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
                className={
                  dpp.metadata.status === "published" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                  dpp.metadata.status === "draft" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                  dpp.metadata.status === "pending_review" ? "bg-orange-500/20 text-orange-600 border-orange-500/30" :
                  "capitalize"
                }
              >
                {dpp.metadata.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell className="flex items-center justify-center">
                {getOverallComplianceIcon(dpp)}
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
        ))}
      </TableBody>
    </Table>
  );
};

// --- File: SupplyChainTab.tsx ---
// Description: Displays product supply chain information, including linked suppliers and allows linking new ones.
"use client";

import type { SimpleProductDetail, ProductSupplyChainLink, Supplier } from "@/types/dpp";
import { MOCK_SUPPLIERS, USER_SUPPLIERS_LOCAL_STORAGE_KEY } from "@/types/dpp";
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layers, Link2, Trash2, Edit3 as EditIcon, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";
import { cn } from "@/lib/utils";

interface SupplyChainTabProps {
  product: SimpleProductDetail;
  // Callback to inform parent about link changes for proper state/localStorage updates.
  // This will be implemented and used in a subsequent task to keep this component focused.
  // onSupplyChainLinksChange: (updatedLinks: ProductSupplyChainLink[]) => void; 
}

export default function SupplyChainTab({ product }: SupplyChainTabProps) {
  const { toast } = useToast();
  const { currentRole } = useRole();
  const [isClient, setIsClient] = useState(false);

  const [linkedSuppliers, setLinkedSuppliers] = useState<ProductSupplyChainLink[]>(product.supplyChainLinks || []);
  const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>([]);
  
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [suppliedItem, setSuppliedItem] = useState("");
  const [linkNotes, setLinkNotes] = useState("");

  // State for editing a link
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ProductSupplyChainLink | null>(null);
  const [editingSupplierName, setEditingSupplierName] = useState<string>(""); // To display in dialog
  const [editSuppliedItem, setEditSuppliedItem] = useState("");
  const [editLinkNotes, setEditLinkNotes] = useState("");


  useEffect(() => {
    setIsClient(true); // Component has mounted
    const storedSuppliersString = localStorage.getItem(USER_SUPPLIERS_LOCAL_STORAGE_KEY);
    const userAddedSuppliers: Supplier[] = storedSuppliersString ? JSON.parse(storedSuppliersString) : [];
    const combinedSuppliers = [
      ...MOCK_SUPPLIERS.filter(mockSup => !userAddedSuppliers.find(userSup => userSup.id === mockSup.id)),
      ...userAddedSuppliers
    ];
    setAvailableSuppliers(combinedSuppliers);
  }, []);

  useEffect(() => {
    // Update local state if product prop changes (e.g., due to parent state update)
    setLinkedSuppliers(product.supplyChainLinks || []);
  }, [product.supplyChainLinks]);

  const canManageLinks = useMemo(() => {
    return (currentRole === 'admin' || currentRole === 'manufacturer') && product.id.startsWith("USER_PROD");
  }, [currentRole, product.id]);

  const handleLinkSupplier = () => {
    if (!selectedSupplierId || !suppliedItem) {
      toast({ title: "Missing Information", description: "Please select a supplier and enter the supplied item.", variant: "destructive" });
      return;
    }
    const newLink: ProductSupplyChainLink = { supplierId: selectedSupplierId, suppliedItem, notes: linkNotes };
    const updatedLinks = [...linkedSuppliers, newLink];
    setLinkedSuppliers(updatedLinks);
    // onSupplyChainLinksChange(updatedLinks); // This will be enabled later
    toast({ title: "Supplier Linked (Locally)", description: "Link saved in this view. Main product save needed for persistence." });
    setIsLinkDialogOpen(false);
    setSelectedSupplierId("");
    setSuppliedItem("");
    setLinkNotes("");
  };

  const handleUnlinkSupplier = (supplierIdToUnlink: string, itemSupplied: string) => {
    const updatedLinks = linkedSuppliers.filter(link => !(link.supplierId === supplierIdToUnlink && link.suppliedItem === itemSupplied));
    setLinkedSuppliers(updatedLinks);
    // onSupplyChainLinksChange(updatedLinks); // This will be enabled later
    toast({ title: "Supplier Unlinked (Locally)", description: "Link removed in this view. Main product save needed for persistence." });
  };
  
  const handleOpenEditDialog = (link: ProductSupplyChainLink) => {
    setEditingLink(link);
    const supplier = availableSuppliers.find(s => s.id === link.supplierId);
    setEditingSupplierName(supplier?.name || "Unknown Supplier");
    setEditSuppliedItem(link.suppliedItem);
    setEditLinkNotes(link.notes || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateSupplierLink = () => {
    if (!editingLink) return;
    const updatedLinks = linkedSuppliers.map(link =>
      link.supplierId === editingLink.supplierId && link.suppliedItem === editingLink.suppliedItem // Simple match for mock
        ? { ...link, suppliedItem: editSuppliedItem, notes: editLinkNotes }
        : link
    );
    setLinkedSuppliers(updatedLinks);
    // onSupplyChainLinksChange(updatedLinks); // This will be enabled later
    toast({ title: "Link Updated (Locally)", description: "Link details updated in this view. Main product save needed." });
    setIsEditDialogOpen(false);
    setEditingLink(null);
  };


  if (!isClient) {
    return <p className="text-muted-foreground p-4">Loading supply chain information...</p>; // Or a skeleton loader
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Layers className="mr-2 h-5 w-5 text-primary" /> Product Supply Chain
          </CardTitle>
          <CardDescription>Overview of suppliers and components linked to this product.</CardDescription>
        </div>
        {canManageLinks && (
          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Link New Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link New Supplier</DialogTitle>
                <DialogDescription>Select a supplier and specify the item they provide for this product.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="supplier-select">Supplier</Label>
                  <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                    <SelectTrigger id="supplier-select">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supplied-item">Supplied Item/Component</Label>
                  <Input id="supplied-item" value={suppliedItem} onChange={(e) => setSuppliedItem(e.target.value)} placeholder="e.g., Battery Cells, Organic Cotton" />
                </div>
                <div>
                  <Label htmlFor="link-notes">Notes (Optional)</Label>
                  <Textarea id="link-notes" value={linkNotes} onChange={(e) => setLinkNotes(e.target.value)} placeholder="e.g., Primary source for EU market" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleLinkSupplier}>Save Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {linkedSuppliers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Supplied Item/Component</TableHead>
                <TableHead>Notes</TableHead>
                {canManageLinks && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedSuppliers.map((link, index) => {
                const supplier = availableSuppliers.find(s => s.id === link.supplierId);
                return (
                  <TableRow key={`${link.supplierId}-${index}`}>
                    <TableCell>{supplier?.name || link.supplierId}</TableCell>
                    <TableCell>{link.suppliedItem}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{link.notes || '-'}</TableCell>
                    {canManageLinks && (
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenEditDialog(link)} title="Edit Link">
                           <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleUnlinkSupplier(link.supplierId, link.suppliedItem)} title="Unlink Supplier">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            <Link2 className="mx-auto h-10 w-10 mb-2 opacity-50" />
            <p>No suppliers are currently linked to this product.</p>
          </div>
        )}
      </CardContent>
        {/* Edit Link Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Supplier Link: {editingSupplierName}</DialogTitle>
                <DialogDescription>Modify the details for this supplier link.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-supplied-item">Supplied Item/Component</Label>
                  <Input id="edit-supplied-item" value={editSuppliedItem} onChange={(e) => setEditSuppliedItem(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="edit-link-notes">Notes (Optional)</Label>
                  <Textarea id="edit-link-notes" value={editLinkNotes} onChange={(e) => setEditLinkNotes(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateSupplierLink}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
    </Card>
  );
}

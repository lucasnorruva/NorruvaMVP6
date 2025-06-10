
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

interface SupplyChainTabProps {
  product: SimpleProductDetail;
  onSupplyChainLinksChange: (updatedLinks: ProductSupplyChainLink[]) => void; 
}

export default function SupplyChainTab({ product, onSupplyChainLinksChange }: SupplyChainTabProps) {
  const { toast } = useToast();
  const { currentRole } = useRole();
  const [isClient, setIsClient] = useState(false);

  const currentLinkedSuppliers = useMemo(() => product.supplyChainLinks || [], [product.supplyChainLinks]);

  const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>([]);
  
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [suppliedItem, setSuppliedItem] = useState("");
  const [linkNotes, setLinkNotes] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ProductSupplyChainLink | null>(null);
  const [editingSupplierName, setEditingSupplierName] = useState<string>("");
  const [editSuppliedItem, setEditSuppliedItem] = useState("");
  const [editLinkNotes, setEditLinkNotes] = useState("");

  useEffect(() => {
    setIsClient(true);
    const storedSuppliersString = localStorage.getItem(USER_SUPPLIERS_LOCAL_STORAGE_KEY);
    const userAddedSuppliers: Supplier[] = storedSuppliersString ? JSON.parse(storedSuppliersString) : [];
    const combinedSuppliers = [
      ...MOCK_SUPPLIERS.filter(mockSup => !userAddedSuppliers.find(userSup => userSup.id === mockSup.id)),
      ...userAddedSuppliers
    ].sort((a,b) => a.name.localeCompare(b.name));
    setAvailableSuppliers(combinedSuppliers);
  }, []);

  const canManageLinks = useMemo(() => {
    return product.id.startsWith("USER_PROD") && (currentRole === 'admin' || currentRole === 'manufacturer');
  }, [currentRole, product.id]);

  const getDisabledTooltipText = () => {
    if (!product.id.startsWith("USER_PROD")) {
      return "Managing links is only enabled for user-created products.";
    }
    if (!(currentRole === 'admin' || currentRole === 'manufacturer')) {
      return "Your current role does not permit managing supplier links.";
    }
    return "";
  };

  const handleLinkSupplier = () => {
    if (!canManageLinks) {
      toast({ title: "Permission Denied", description: getDisabledTooltipText(), variant: "destructive" });
      return;
    }
    if (!selectedSupplierId || !suppliedItem.trim()) {
      toast({ title: "Missing Information", description: "Please select a supplier and enter the supplied item.", variant: "destructive" });
      return;
    }
    const newLink: ProductSupplyChainLink = { supplierId: selectedSupplierId, suppliedItem: suppliedItem.trim(), notes: linkNotes.trim() };
    const updatedLinks = [...currentLinkedSuppliers, newLink];
    onSupplyChainLinksChange(updatedLinks);
    toast({ title: "Supplier Link Added", description: "The new link has been added." });
    setIsLinkDialogOpen(false);
    setSelectedSupplierId("");
    setSuppliedItem("");
    setLinkNotes("");
  };

  const handleUnlinkSupplier = (supplierIdToUnlink: string, itemSupplied: string) => {
    if (!canManageLinks) {
      toast({ title: "Permission Denied", description: getDisabledTooltipText(), variant: "destructive" });
      return;
    }
    const updatedLinks = currentLinkedSuppliers.filter(link => !(link.supplierId === supplierIdToUnlink && link.suppliedItem === itemSupplied));
    onSupplyChainLinksChange(updatedLinks);
    toast({ title: "Supplier Link Removed", description: "The link has been removed." });
  };
  
  const handleOpenEditDialog = (link: ProductSupplyChainLink) => {
    if (!canManageLinks) {
       toast({ title: "Permission Denied", description: getDisabledTooltipText(), variant: "destructive" });
      return;
    }
    setEditingLink(link);
    const supplier = availableSuppliers.find(s => s.id === link.supplierId);
    setEditingSupplierName(supplier?.name || "Unknown Supplier");
    setEditSuppliedItem(link.suppliedItem);
    setEditLinkNotes(link.notes || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateSupplierLink = () => {
    if (!editingLink || !canManageLinks) {
      if (!canManageLinks) toast({ title: "Permission Denied", description: getDisabledTooltipText(), variant: "destructive" });
      return;
    }
    if (!editSuppliedItem.trim()) {
      toast({ title: "Missing Information", description: "Supplied item cannot be empty.", variant: "destructive" });
      return;
    }
    const updatedLinks = currentLinkedSuppliers.map(link =>
      // Compare based on original supplierId and originally suppliedItem to identify the link
      link.supplierId === editingLink.supplierId && link.suppliedItem === editingLink.suppliedItem
        ? { ...link, suppliedItem: editSuppliedItem.trim(), notes: editLinkNotes.trim() }
        : link
    );
    onSupplyChainLinksChange(updatedLinks);
    toast({ title: "Supplier Link Updated", description: "The link details have been updated." });
    setIsEditDialogOpen(false);
    setEditingLink(null);
  };

  if (!isClient) {
    return <p className="text-muted-foreground p-4">Loading supply chain information...</p>;
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
        
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="inline-block" tabIndex={!canManageLinks ? 0 : undefined}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm" disabled={!canManageLinks}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Link New Supplier
                                </Button>
                            </DialogTrigger>
                        </div>
                    </TooltipTrigger>
                    {!canManageLinks && (
                        <TooltipContent>
                            <p>{getDisabledTooltipText()}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link New Supplier</DialogTitle>
                <DialogDescription>Select a supplier and specify the item they provide for this product.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {availableSuppliers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No suppliers have been added to the system yet. You can add suppliers from the main{" "}
                    <Link href="/suppliers" className="underline text-primary hover:text-primary/80">
                      Supplier Management
                    </Link>{" "}
                    page.
                  </p>
                ) : (
                  <div>
                    <Label htmlFor="supplier-select">Supplier</Label>
                    <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                      <SelectTrigger id="supplier-select">
                        <SelectValue placeholder="Select a supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.materialsSupplied.substring(0,30)}...)</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="supplied-item">Supplied Item/Component</Label>
                  <Input id="supplied-item" value={suppliedItem} onChange={(e) => setSuppliedItem(e.target.value)} placeholder="e.g., Battery Cells, Organic Cotton"/>
                </div>
                <div>
                  <Label htmlFor="link-notes">Notes (Optional)</Label>
                  <Textarea id="link-notes" value={linkNotes} onChange={(e) => setLinkNotes(e.target.value)} placeholder="e.g., Primary source for EU market"/>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleLinkSupplier} disabled={availableSuppliers.length === 0}>Save Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

      </CardHeader>
      <CardContent>
        {currentLinkedSuppliers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Supplied Item/Component</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLinkedSuppliers.map((link, index) => {
                const supplier = availableSuppliers.find(s => s.id === link.supplierId);
                return (
                  <TableRow key={`${link.supplierId}-${link.suppliedItem}-${index}`}>
                    <TableCell>{supplier?.name || link.supplierId}</TableCell>
                    <TableCell>{link.suppliedItem}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{link.notes || '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="inline-block" tabIndex={!canManageLinks ? 0 : undefined}>
                                        <Button variant="ghost" size="icon" aria-label="Edit link" className="h-7 w-7" onClick={() => handleOpenEditDialog(link)} title="Edit Link" disabled={!canManageLinks}>
                                           <EditIcon className="h-4 w-4" />
                                           <span className="sr-only">Edit link</span>
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                {!canManageLinks && (
                                    <TooltipContent>
                                       <p>{getDisabledTooltipText()}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <div className="inline-block" tabIndex={!canManageLinks ? 0 : undefined}>
                                        <Button variant="ghost" size="icon" aria-label="Unlink supplier" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleUnlinkSupplier(link.supplierId, link.suppliedItem)} title="Unlink Supplier" disabled={!canManageLinks}>
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Unlink supplier</span>
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                {!canManageLinks && (
                                    <TooltipContent>
                                        <p>{getDisabledTooltipText()}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            <Link2 className="mx-auto h-10 w-10 mb-2 opacity-50" />
            <p>No suppliers are currently linked to this product.</p>
            {!canManageLinks && product.id.startsWith("USER_PROD") && <p className="text-sm mt-1">Your role does not permit linking suppliers.</p>}
            {!canManageLinks && !product.id.startsWith("USER_PROD") && <p className="text-sm mt-1">Linking suppliers is only enabled for user-created products.</p>}
            {canManageLinks && availableSuppliers.length === 0 && (
              <p className="text-sm mt-1">
                No suppliers available to link. Add suppliers in the{" "}
                <Link href="/suppliers" className="underline text-primary hover:text-primary/80">
                  Supplier Management
                </Link> page.
              </p>
            )}
            {canManageLinks && availableSuppliers.length > 0 && <p className="text-sm mt-1">Click "Link New Supplier" to add one.</p>}
          </div>
        )}
      </CardContent>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Supplier Link: {editingSupplierName}</DialogTitle>
                <DialogDescription>Modify the details for this supplier link.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-supplied-item">Supplied Item/Component</Label>
                  <Input id="edit-supplied-item" value={editSuppliedItem} onChange={(e) => setEditSuppliedItem(e.target.value)}/>
                </div>
                <div>
                  <Label htmlFor="edit-link-notes">Notes (Optional)</Label>
                  <Textarea id="edit-link-notes" value={editLinkNotes} onChange={(e) => setEditLinkNotes(e.target.value)}/>
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
    

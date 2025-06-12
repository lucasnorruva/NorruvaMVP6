
// --- File: SupplyChainTab.tsx ---
// Description: Displays product supply chain information, including linked suppliers and allows linking new ones.
"use client";

import type { SimpleProductDetail, ProductSupplyChainLink, Supplier } from "@/types/dpp";
import { USER_SUPPLIERS_LOCAL_STORAGE_KEY } from "@/types/dpp";
import { MOCK_SUPPLIERS } from "@/data";
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layers, Link2, Trash2, Edit3 as EditIcon, PlusCircle, Eye, VenetianMask, Loader2, AlertTriangle, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Conceptual type for mock attestation data from the private API
interface MockAttestation {
  attestationId: string;
  componentId: string;
  attestationType: string;
  attestationStatement: string;
  issuanceDate: string;
  expiryDate?: string;
  evidence?: Array<{ type: string; documentId?: string; vcId?: string }>;
}


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

  const [attestations, setAttestations] = useState<Record<string, MockAttestation[]>>({});
  const [loadingAttestations, setLoadingAttestations] = useState<Record<string, boolean>>({});
  const [errorAttestations, setErrorAttestations] = useState<Record<string, string | null>>({});


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
      link.supplierId === editingLink.supplierId && link.suppliedItem === editingLink.suppliedItem
        ? { ...link, suppliedItem: editSuppliedItem.trim(), notes: editLinkNotes.trim() }
        : link
    );
    onSupplyChainLinksChange(updatedLinks);
    toast({ title: "Supplier Link Updated", description: "The link details have been updated." });
    setIsEditDialogOpen(false);
    setEditingLink(null);
  };

  const handleFetchAttestations = async (supplierId: string) => {
    setLoadingAttestations(prev => ({ ...prev, [supplierId]: true }));
    setErrorAttestations(prev => ({ ...prev, [supplierId]: null }));
    try {
      // Use a mock API key; in a real app, this would be securely managed
      const MOCK_API_KEY = "SANDBOX_KEY_123"; 
      const response = await fetch(`/api/v1/private/dpp/${product.id}/supplier/${supplierId}/attestations`, {
        headers: {
          'Authorization': `Bearer ${MOCK_API_KEY}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "Failed to parse error."}}));
        throw new Error(errorData.error?.message || `Failed to fetch attestations: ${response.status}`);
      }
      const data: MockAttestation[] = await response.json();
      setAttestations(prev => ({ ...prev, [supplierId]: data }));
      toast({ title: "Attestations Loaded (Mock)", description: `Simulated private attestations for supplier ${supplierId} loaded.` });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error fetching attestations.";
      setErrorAttestations(prev => ({ ...prev, [supplierId]: message }));
      toast({ title: "Error Loading Attestations", description: message, variant: "destructive" });
    } finally {
      setLoadingAttestations(prev => ({ ...prev, [supplierId]: false }));
    }
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
          <CardDescription>Overview of suppliers and components linked to this product. Attestations are mock private data.</CardDescription>
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
          <div className="space-y-3">
            {currentLinkedSuppliers.map((link, index) => {
              const supplier = availableSuppliers.find(s => s.id === link.supplierId);
              const supplierAttestations = attestations[link.supplierId] || [];
              const isLoadingSupplierAttestations = loadingAttestations[link.supplierId];
              const errorSupplierAttestations = errorAttestations[link.supplierId];

              return (
                <Card key={`${link.supplierId}-${link.suppliedItem}-${index}`} className="bg-muted/30">
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-md">{supplier?.name || link.supplierId}</CardTitle>
                        <CardDescription className="text-xs">Supplies: {link.suppliedItem}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-xs">
                    {link.notes && <p className="text-muted-foreground mb-2">Notes: {link.notes}</p>}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleFetchAttestations(link.supplierId)}
                      disabled={isLoadingSupplierAttestations}
                    >
                      {isLoadingSupplierAttestations ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin"/> : <VenetianMask className="h-3 w-3 mr-1.5" />}
                      {isLoadingSupplierAttestations ? "Loading..." : "View Private Attestations (Mock)"}
                    </Button>

                    {errorSupplierAttestations && (
                        <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md text-xs flex items-center">
                           <AlertTriangle className="h-4 w-4 mr-2"/> {errorSupplierAttestations}
                        </div>
                    )}

                    {supplierAttestations.length > 0 && !errorSupplierAttestations && (
                      <Accordion type="single" collapsible className="w-full mt-2">
                        <AccordionItem value={`item-${link.supplierId}`} className="border-t">
                          <AccordionTrigger className="text-xs py-2 hover:no-underline text-primary">
                            Show/Hide {supplierAttestations.length} Private Attestation(s)
                          </AccordionTrigger>
                          <AccordionContent className="pt-1 pb-2">
                            <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-background rounded-md border">
                              {supplierAttestations.map(att => (
                                <div key={att.attestationId} className="p-1.5 border-b last:border-b-0">
                                  <p className="font-medium text-foreground/90">{att.attestationType} ({att.componentId})</p>
                                  <p className="text-muted-foreground text-[0.7rem]">{att.attestationStatement}</p>
                                  <p className="text-muted-foreground text-[0.7rem]">Issued: {new Date(att.issuanceDate).toLocaleDateString()} {att.expiryDate ? `- Expires: ${new Date(att.expiryDate).toLocaleDateString()}` : ''}</p>
                                  {att.evidence && att.evidence.map((ev, idx) => (
                                    <p key={idx} className="text-muted-foreground text-[0.7rem] pl-2">
                                      &bull; Evidence: {ev.type} {ev.documentId ? `(${ev.documentId})` : ''} {ev.vcId ? `(VC: ${ev.vcId.substring(0,15)}...)` : ''}
                                    </p>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
    

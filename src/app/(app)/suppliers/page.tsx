
// --- File: page.tsx (Supplier Management) ---
// Description: Main page for listing and managing suppliers.
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Users } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import type { Supplier } from "@/types/dpp";
import { USER_SUPPLIERS_LOCAL_STORAGE_KEY } from "@/types/dpp";
import { MOCK_SUPPLIERS } from "@/data";
import SupplierList from "@/components/suppliers/SupplierList";
import AddSupplierForm, { type SupplierFormData } from "@/components/suppliers/AddSupplierForm";

export default function SuppliersPage() {
  const { currentRole } = useRole();
  const { toast } = useToast();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedSuppliersString = localStorage.getItem(USER_SUPPLIERS_LOCAL_STORAGE_KEY);
    const userAddedSuppliers: Supplier[] = storedSuppliersString ? JSON.parse(storedSuppliersString) : [];
    
    const combinedSuppliers = [
      ...MOCK_SUPPLIERS.filter(mockSup => !userAddedSuppliers.find(userSup => userSup.id === mockSup.id)),
      ...userAddedSuppliers
    ].sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
    setSuppliers(combinedSuppliers);
  }, []);

  const canManageSuppliers = useMemo(() => currentRole === 'admin' || currentRole === 'manufacturer', [currentRole]);

  const saveSuppliersToLocalStorage = (updatedSuppliers: Supplier[]) => {
    const userAddedSuppliers = updatedSuppliers.filter(sup => sup.id.startsWith("USER_SUP"));
    localStorage.setItem(USER_SUPPLIERS_LOCAL_STORAGE_KEY, JSON.stringify(userAddedSuppliers));
  };

  const handleFormSubmit = (data: SupplierFormData) => {
    setIsSubmitting(true);
    let updatedSuppliers: Supplier[];
    const now = new Date().toISOString();

    if (editingSupplier) { // Update existing supplier
      updatedSuppliers = suppliers.map(s => 
        s.id === editingSupplier.id ? { ...s, ...data, id: s.id, lastUpdated: now } : s
      );
      toast({ title: "Supplier Updated", description: `Supplier "${data.name}" has been updated.` });
    } else { // Add new supplier
      const newSupplier: Supplier = {
        ...data,
        id: `USER_SUP_${Date.now().toString().slice(-6)}`, // Generate a unique ID for user-added suppliers
        lastUpdated: now,
      };
      updatedSuppliers = [...suppliers, newSupplier].sort((a, b) => a.name.localeCompare(b.name));
      toast({ title: "Supplier Added", description: `Supplier "${newSupplier.name}" has been added.` });
    }
    setSuppliers(updatedSuppliers);
    saveSuppliersToLocalStorage(updatedSuppliers);
    setIsModalOpen(false);
    setEditingSupplier(null);
    setIsSubmitting(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (!supplierId.startsWith("USER_SUP")) {
        toast({ title: "Deletion Restricted", description: "Mock suppliers cannot be deleted.", variant: "destructive" });
        return;
    }
    const supplierName = suppliers.find(s => s.id === supplierId)?.name || "Selected supplier";
    const updatedSuppliers = suppliers.filter(s => s.id !== supplierId);
    setSuppliers(updatedSuppliers);
    saveSuppliersToLocalStorage(updatedSuppliers);
    toast({ title: "Supplier Deleted", description: `Supplier "${supplierName}" has been deleted.` });
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Users className="mr-3 h-7 w-7 text-primary" /> Supplier Management
        </h1>
        {canManageSuppliers && (
          <Button onClick={openAddModal} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Supplier
          </Button>
        )}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Supplier Directory</CardTitle>
          <CardDescription>View, add, or manage suppliers in your network.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierList
            suppliers={suppliers}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            canManage={canManageSuppliers}
          />
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingSupplier(null); // Reset editing state when dialog closes
          }
          setIsModalOpen(isOpen);
        }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            <DialogDescription>
              {editingSupplier ? "Update the details for this supplier." : "Enter the details for the new supplier."}
            </DialogDescription>
          </DialogHeader>
          <AddSupplierForm
            onSubmit={handleFormSubmit}
            initialData={editingSupplier}
            onClose={() => { setIsModalOpen(false); setEditingSupplier(null); }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

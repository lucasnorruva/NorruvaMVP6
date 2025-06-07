
// --- File: ScanProductDialog.tsx ---
// Description: Dialog component for simulating a QR code scan or manual product ID entry.
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Camera } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import type { DigitalProductPassport } from '@/types/dpp'; // For checking existence

interface ScanProductDialogProps {
  allDpps: DigitalProductPassport[]; // Pass all DPPs to check against
}

export function ScanProductDialog({ allDpps }: ScanProductDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [manualProductId, setManualProductId] = useState("");
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  const handleFindProduct = () => {
    if (manualProductId.trim()) {
      const productExists = allDpps.some(p => p.id === manualProductId.trim());
      if (productExists) {
        router.push(`/passport/${manualProductId.trim()}`);
        setIsScanDialogOpen(false); // Close dialog on success
        setManualProductId(""); // Reset input
      } else {
        toast({
          variant: "destructive",
          title: "Product Not Found",
          description: `Product with ID "${manualProductId.trim()}" was not found. Please check the ID and try again.`,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter a Product ID to find.",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsScanDialogOpen(open);
    if (!open) {
      setManualProductId(""); // Clear input when dialog is closed
    }
  };

  return (
    <Dialog open={isScanDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="mr-2 h-5 w-5" />
          Scan Product QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Product QR Code</DialogTitle>
          <DialogDescription>
            This is a mock scanner. In a real app, you could use your camera. For now, enter a Product ID manually to view its public passport.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 h-48 bg-muted border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center">
          <Camera className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Camera feed would appear here.</p>
          <p className="text-xs text-muted-foreground">(Camera access not implemented)</p>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manual-product-id" className="text-right col-span-1">
              Product ID
            </Label>
            <Input
              id="manual-product-id"
              value={manualProductId}
              onChange={(e) => setManualProductId(e.target.value)}
              placeholder="e.g., DPP001"
              className="col-span-3"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleFindProduct();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleFindProduct}>Find Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

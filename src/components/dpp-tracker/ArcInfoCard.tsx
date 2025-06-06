
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, GitBranch, Ship, Plane, Truck, Train, QrCode } from "lucide-react"; // Added QrCode
import type { MockArc } from '@/app/(app)/dpp-global-tracker/page';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"; // Added useToast

interface ArcInfoCardProps {
  arcData: MockArc;
  onClose: () => void;
}

const getTransportIcon = (transportMode?: MockArc['transportMode']) => {
  switch (transportMode) {
    case 'sea': return <Ship className="h-4 w-4 mr-2" />;
    case 'air': return <Plane className="h-4 w-4 mr-2" />;
    case 'road': return <Truck className="h-4 w-4 mr-2" />;
    case 'rail': return <Train className="h-4 w-4 mr-2" />;
    default: return <GitBranch className="h-4 w-4 mr-2" />;
  }
};

export default function ArcInfoCard({ arcData, onClose }: ArcInfoCardProps) {
  const { toast } = useToast(); // Initialize toast

  const handleMockQrClick = () => {
    toast({
      title: "QR Code Access (Mock)",
      description: `Mock: QR code link for Product ID ${arcData.productId} associated with this arc would be presented here.`,
      duration: 5000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-90 duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-headline text-primary flex items-center">
              <GitBranch className="mr-2 h-5 w-5" />
              Supply Chain Link
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="h-8 w-8 -mt-1 -mr-1">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription className="text-sm pt-1">
            Details about this segment of the product journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><strong>Label:</strong> {arcData.label}</p>
          {arcData.transportMode && (
            <p className="flex items-center">
              <strong>Transport Mode:</strong> 
              <span className="ml-2 capitalize inline-flex items-center">
                 {getTransportIcon(arcData.transportMode)} {arcData.transportMode}
              </span>
            </p>
          )}
          <p><strong>Timestamp (Year):</strong> {arcData.timestamp}</p>
          
          <div className="pt-3 border-t border-border space-y-2">
            {arcData.productId && (
              <>
                <p>
                  <strong>Associated Product ID:</strong> 
                  <Link href={`/products/${arcData.productId}`} passHref>
                    <Button variant="link" className="p-0 h-auto ml-1 text-primary hover:underline">
                      {arcData.productId} <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </p>
                <Button className="w-full" variant="outline" onClick={handleMockQrClick}>
                  <QrCode className="mr-2 h-4 w-4" />
                  View Product DPP (QR Mock)
                </Button>
              </>
            )}
            <p className="text-xs text-muted-foreground">This card shows information about a specific connection or movement in the supply chain.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Package2, MapPin, Route, QrCode } from "lucide-react"; // Added QrCode
import type { MockShipmentPoint } from '@/app/(app)/dpp-global-tracker/page'; 
import { useToast } from "@/hooks/use-toast"; // Added useToast

interface ShipmentInfoCardProps {
  shipmentData: MockShipmentPoint;
  onClose: () => void;
}

const formatDirection = (direction: MockShipmentPoint['direction']) => {
  switch (direction) {
    case 'inbound_eu': return "Inbound to EU";
    case 'outbound_eu': return "Outbound from EU";
    case 'internal_eu': return "Internal EU Movement";
    default: return "Unknown Direction";
  }
};

export default function ShipmentInfoCard({ shipmentData, onClose }: ShipmentInfoCardProps) {
  const { toast } = useToast(); // Initialize toast

  const handleMockQrClick = () => {
    toast({
      title: "Shipment DPP (Mock)",
      description: `Mock: QR code link for Shipment ID ${shipmentData.id} would be presented here, linking to its detailed DPP.`,
      duration: 5000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-90 duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-headline text-primary flex items-center">
              <Package2 className="mr-2 h-5 w-5" />
              {shipmentData.name}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="h-8 w-8 -mt-1 -mr-1">
              <X className="h-5 w-5" />
            </Button>
          </div>
          {shipmentData.arcLabel && (
            <CardDescription className="text-sm pt-1">
              On route: {shipmentData.arcLabel}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <strong>Current Position (mock):</strong> Lat: {shipmentData.lat.toFixed(2)}, Lng: {shipmentData.lng.toFixed(2)}
          </p>
          <p className="flex items-center">
            <Route className="h-4 w-4 mr-2 text-muted-foreground" />
            <strong>Direction:</strong> {formatDirection(shipmentData.direction)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Shipment ID: {shipmentData.id}</p>
          <p className="text-xs text-muted-foreground">Associated Arc ID: {shipmentData.arcId}</p>
          
          <div className="pt-3 border-t border-border space-y-2">
            <Button className="w-full" variant="outline" onClick={handleMockQrClick}>
                <QrCode className="mr-2 h-4 w-4" />
                View Shipment DPP (QR Mock)
            </Button>
            <p className="text-xs text-muted-foreground">This card shows basic information for a shipment. More details (product info, compliance, QR) will be added in subsequent tasks.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

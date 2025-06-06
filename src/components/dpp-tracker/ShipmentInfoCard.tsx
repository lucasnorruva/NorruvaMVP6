
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Package2, MapPin, Route, QrCode, CalendarDays, ShieldCheck, ShieldAlert, Info, Image as ImageIcon } from "lucide-react";
import type { MockShipmentPoint } from '@/app/(app)/dpp-global-tracker/page'; 
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

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

const getComplianceIcon = (variant?: MockShipmentPoint['dppComplianceBadgeVariant']) => {
  switch (variant) {
    case 'default': return <ShieldCheck className="h-4 w-4 mr-1.5" />;
    case 'destructive': return <ShieldAlert className="h-4 w-4 mr-1.5" />;
    case 'outline':
    case 'secondary':
    default: return <Info className="h-4 w-4 mr-1.5" />;
  }
}

export default function ShipmentInfoCard({ shipmentData, onClose }: ShipmentInfoCardProps) {
  const { toast } = useToast(); 

  const handleMockQrClick = () => {
    toast({
      title: "Shipment DPP (Mock)",
      description: `Mock: QR code link for Shipment ID ${shipmentData.id} would be presented here, linking to its detailed DPP.`,
      duration: 5000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-2xl animate-in fade-in-50 zoom-in-90 duration-300">
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
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-4">
            {shipmentData.productIconUrl ? (
              <Image 
                src={shipmentData.productIconUrl} 
                alt="Product Icon" 
                width={60} 
                height={60} 
                className="rounded-md border object-cover" 
                data-ai-hint="product shipment"
              />
            ) : (
              <div className="w-[60px] h-[60px] bg-muted rounded-md flex items-center justify-center border">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-grow space-y-1">
              <p className="flex items-center">
                <Route className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                <strong>Direction:</strong> {formatDirection(shipmentData.direction)}
              </p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                <strong>Current Position (mock):</strong> Lat: {shipmentData.lat.toFixed(2)}, Lng: {shipmentData.lng.toFixed(2)}
              </p>
               {shipmentData.eta && (
                <p className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                  <strong>Est. Arrival:</strong> {new Date(shipmentData.eta).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {shipmentData.dppComplianceStatusText && (
            <div className="flex items-center">
              <strong className="mr-2">DPP Compliance:</strong>
              <Badge variant={shipmentData.dppComplianceBadgeVariant || 'secondary'} className="text-xs">
                {getComplianceIcon(shipmentData.dppComplianceBadgeVariant)}
                {shipmentData.dppComplianceStatusText}
              </Badge>
            </div>
          )}

          {shipmentData.progressPercentage !== undefined && (
            <div>
              <Label htmlFor={`shipment-progress-${shipmentData.id}`} className="text-xs font-medium text-muted-foreground">Shipment Progress</Label>
              <div className="flex items-center gap-2 mt-1">
                <Progress id={`shipment-progress-${shipmentData.id}`} value={shipmentData.progressPercentage} className="w-full h-2.5" />
                <span className="text-xs font-semibold">{shipmentData.progressPercentage}%</span>
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">Shipment ID: {shipmentData.id}</p>
          
          <div className="pt-3 border-t border-border space-y-2">
            <Button className="w-full" variant="outline" onClick={handleMockQrClick}>
                <QrCode className="mr-2 h-4 w-4" />
                View Shipment DPP (QR Mock)
            </Button>
            <p className="text-xs text-muted-foreground">This card shows mock shipment details including compliance and progress.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
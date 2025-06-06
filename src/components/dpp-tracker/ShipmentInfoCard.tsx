
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Package2, MapPin, Route, QrCode, CalendarDays, ShieldCheck, ShieldAlert, Info, Image as ImageIcon, FileText, AlertTriangle, Check, HelpCircle, TrafficCone, Edit3, Layers } from "lucide-react";
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
    case 'other': return "Other Route";
    default: return "Unknown Direction";
  }
};

const getComplianceIcon = (variant?: MockShipmentPoint['dppComplianceBadgeVariant']) => {
  switch (variant) {
    case 'default': return <ShieldCheck className="h-4 w-4 mr-1.5 text-green-500" />;
    case 'destructive': return <ShieldAlert className="h-4 w-4 mr-1.5 text-red-500" />;
    case 'outline': return <Info className="h-4 w-4 mr-1.5 text-yellow-600" />;
    case 'secondary':
    default: return <HelpCircle className="h-4 w-4 mr-1.5 text-muted-foreground" />;
  }
};

const getStatusIconAndText = (status: MockShipmentPoint['simulatedStatus']) => {
  switch (status) {
    case 'in_transit': return { Icon: Route, text: "In Transit", color: "text-blue-600", badgeVariant: "default" as const, badgeClasses: "bg-blue-100 text-blue-700 border-blue-300" };
    case 'at_customs': return { Icon: FileText, text: "At Customs", color: "text-orange-600", badgeVariant: "outline" as const, badgeClasses: "bg-yellow-100 text-yellow-700 border-yellow-300" };
    case 'customs_inspection': return { Icon: AlertTriangle, text: "Customs Inspection", color: "text-red-600", badgeVariant: "destructive" as const, badgeClasses: "bg-red-100 text-red-700 border-red-300" };
    case 'delayed': return { Icon: TrafficCone, text: "Delayed", color: "text-yellow-700", badgeVariant: "outline" as const, badgeClasses: "bg-amber-100 text-amber-700 border-amber-300" };
    case 'cleared': return { Icon: Check, text: "Cleared", color: "text-green-600", badgeVariant: "default" as const, badgeClasses: "bg-green-100 text-green-700 border-green-300" };
    case 'data_sync_delayed': return { Icon: HelpCircle, text: "Data Sync Delayed", color: "text-gray-600", badgeVariant: "secondary" as const, badgeClasses: "bg-gray-100 text-gray-700 border-gray-300" };
    default: return { Icon: HelpCircle, text: "Unknown Status", color: "text-gray-500", badgeVariant: "secondary" as const, badgeClasses: "bg-muted text-muted-foreground" };
  }
};

const getCEStatusBadge = (status: MockShipmentPoint['ceMarkingStatus']) => {
    switch(status){
        case 'valid': return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300"><ShieldCheck className="mr-1 h-3 w-3"/>Valid</Badge>;
        case 'missing': return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300"><ShieldAlert className="mr-1 h-3 w-3"/>Missing</Badge>;
        case 'pending_verification': return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300"><Info className="mr-1 h-3 w-3"/>Pending</Badge>;
        default: return <Badge variant="secondary">N/A</Badge>;
    }
};

const getCBAMStatusBadge = (status: MockShipmentPoint['cbamDeclarationStatus']) => {
     switch(status){
        case 'submitted': return <Badge variant="default" className="bg-blue-100 text-blue-700 border-blue-300"><FileText className="mr-1 h-3 w-3"/>Submitted</Badge>;
        case 'required': return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300"><Info className="mr-1 h-3 w-3"/>Required</Badge>;
        case 'cleared': return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300"><ShieldCheck className="mr-1 h-3 w-3"/>Cleared</Badge>;
        case 'not_applicable': return <Badge variant="secondary">Not Applicable</Badge>;
        default: return <Badge variant="secondary">N/A</Badge>;
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
  
  const { Icon: StatusIcon, text: statusText, badgeVariant: statusBadgeVariant, badgeClasses: statusBadgeClasses } = getStatusIconAndText(shipmentData.simulatedStatus);


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
        <CardContent className="space-y-3 text-sm max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4 mb-3">
            {shipmentData.productIconUrl ? (
              <Image 
                src={shipmentData.productIconUrl} 
                alt="Product Icon" 
                width={50} 
                height={50} 
                className="rounded-md border object-cover flex-shrink-0" 
                data-ai-hint="product shipment"
              />
            ) : (
              <div className="w-[50px] h-[50px] bg-muted rounded-md flex items-center justify-center border flex-shrink-0">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-grow space-y-1">
              <p className="flex items-center text-xs">
                <Route className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                <strong>Direction:</strong><span className="ml-1">{formatDirection(shipmentData.direction)}</span>
              </p>
              <p className="flex items-center text-xs">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                <strong>Position (mock):</strong><span className="ml-1">Lat: {shipmentData.lat.toFixed(2)}, Lng: {shipmentData.lng.toFixed(2)}</span>
              </p>
               {shipmentData.eta && (
                <p className="flex items-center text-xs">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                  <strong>Est. Arrival:</strong><span className="ml-1">{new Date(shipmentData.eta).toLocaleDateString()}</span>
                </p>
              )}
            </div>
          </div>
          
          <div className="p-2.5 bg-muted/50 rounded-md">
             <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-foreground/90 flex items-center"><StatusIcon className={cn("h-4 w-4 mr-2", statusBadgeClasses.split(' ')[1])} /> Current Status:</span>
                <Badge variant={statusBadgeVariant} className={cn("text-xs", statusBadgeClasses)}> {statusText} </Badge>
             </div>
             {shipmentData.progressPercentage !== undefined && (
                <div>
                    <label htmlFor={`shipment-progress-${shipmentData.id}`} className="text-xs font-medium text-muted-foreground">Shipment Progress</label>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Progress id={`shipment-progress-${shipmentData.id}`} value={shipmentData.progressPercentage} className="w-full h-2" />
                        <span className="text-xs font-semibold">{shipmentData.progressPercentage}%</span>
                    </div>
                </div>
            )}
          </div>


          {shipmentData.dppComplianceStatusText && (
            <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-md">
              <strong className="mr-2 font-medium text-foreground/90 flex items-center">{getComplianceIcon(shipmentData.dppComplianceBadgeVariant)}DPP Compliance:</strong>
              <Badge variant={shipmentData.dppComplianceBadgeVariant || 'secondary'} className="text-xs capitalize text-right">
                {shipmentData.dppComplianceStatusText}
              </Badge>
            </div>
          )}
          
          <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-md">
             <strong className="mr-2 font-medium text-foreground/90 flex items-center"><Edit3 className="h-4 w-4 mr-1.5 text-muted-foreground" />CE Marking:</strong>
             {getCEStatusBadge(shipmentData.ceMarkingStatus)}
          </div>
          <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-md">
             <strong className="mr-2 font-medium text-foreground/90 flex items-center"><Layers className="h-4 w-4 mr-1.5 text-muted-foreground" />CBAM Declaration:</strong>
             {getCBAMStatusBadge(shipmentData.cbamDeclarationStatus)}
          </div>

          {shipmentData.dppComplianceNotes && shipmentData.dppComplianceNotes.length > 0 && (
            <div className="p-2.5 bg-muted/50 rounded-md">
                <strong className="text-xs font-medium text-foreground/90 block mb-1">Compliance Notes:</strong>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {shipmentData.dppComplianceNotes.map((note, idx) => <li key={idx}>{note}</li>)}
                </ul>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">Shipment ID: {shipmentData.id}</p>
          
          <div className="pt-3 border-t border-border space-y-2">
            <Button className="w-full" variant="outline" onClick={handleMockQrClick}>
                <QrCode className="mr-2 h-4 w-4" />
                View Shipment DPP (QR Mock)
            </Button>
          </div>
          <div className="pt-3 mt-2 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center">
              <ShieldAlert className="h-3 w-3 mr-1.5 text-muted-foreground" />
              DPP data may contain sensitive information. Handle with care according to GDPR and privacy policies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Package2, MapPin, Route, QrCode, CalendarDays, ShieldCheck, ShieldAlert, Info, Image as ImageIcon, FileText, AlertTriangle, Check, HelpCircle } from "lucide-react"; // Added specific icons
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
};

const getStatusIconAndText = (status: MockShipmentPoint['simulatedStatus']) => {
  switch (status) {
    case 'in_transit': return { Icon: Route, text: "In Transit", color: "text-blue-500" };
    case 'at_customs': return { Icon: FileText, text: "At Customs", color: "text-orange-500" };
    case 'customs_inspection': return { Icon: AlertTriangle, text: "Customs Inspection", color: "text-red-500" };
    case 'delayed': return { Icon: Info, text: "Delayed", color: "text-yellow-600" };
    case 'cleared': return { Icon: Check, text: "Cleared", color: "text-green-500" };
    case 'data_sync_delayed': return { Icon: HelpCircle, text: "Data Sync Delayed", color: "text-gray-500" };
    default: return { Icon: HelpCircle, text: "Unknown Status", color: "text-gray-500" };
  }
};

const getCEStatusBadge = (status: MockShipmentPoint['ceMarkingStatus']) => {
    switch(status){
        case 'valid': return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300"><ShieldCheck className="mr-1 h-3 w-3"/>Valid</Badge>;
        case 'missing': return <Badge variant="destructive"><ShieldAlert className="mr-1 h-3 w-3"/>Missing</Badge>;
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
  
  const { Icon: StatusIcon, text: statusText, color: statusColor } = getStatusIconAndText(shipmentData.simulatedStatus);


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
          
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
             <span className="font-medium text-foreground/90 flex items-center"><StatusIcon className={cn("h-4 w-4 mr-2", statusColor)} /> Current Status:</span>
             <Badge variant={shipmentData.simulatedStatus === 'customs_inspection' || shipmentData.simulatedStatus === 'delayed' ? 'destructive' : shipmentData.simulatedStatus === 'at_customs' ? 'outline' : 'default'} 
                    className={cn(
                        shipmentData.simulatedStatus === 'cleared' ? 'bg-green-100 text-green-700 border-green-300' : '',
                        shipmentData.simulatedStatus === 'in_transit' ? 'bg-blue-100 text-blue-700 border-blue-300' : '',
                        shipmentData.simulatedStatus === 'at_customs' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : '',
                        shipmentData.simulatedStatus === 'data_sync_delayed' ? 'bg-gray-100 text-gray-700 border-gray-300' : ''
                    )}>
                 {statusText}
             </Badge>
          </div>


          {shipmentData.dppComplianceStatusText && (
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
              <strong className="mr-2 font-medium text-foreground/90 flex items-center">{getComplianceIcon(shipmentData.dppComplianceBadgeVariant)}DPP Compliance:</strong>
              <Badge variant={shipmentData.dppComplianceBadgeVariant || 'secondary'} className="text-xs">
                {shipmentData.dppComplianceStatusText}
              </Badge>
            </div>
          )}
          
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
             <strong className="mr-2 font-medium text-foreground/90">CE Marking:</strong>
             {getCEStatusBadge(shipmentData.ceMarkingStatus)}
          </div>
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
             <strong className="mr-2 font-medium text-foreground/90">CBAM Declaration:</strong>
             {getCBAMStatusBadge(shipmentData.cbamDeclarationStatus)}
          </div>

          {shipmentData.dppComplianceNotes && shipmentData.dppComplianceNotes.length > 0 && (
            <div className="p-2 bg-muted/50 rounded-md">
                <strong className="text-xs font-medium text-foreground/90 block mb-1">Compliance Notes:</strong>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {shipmentData.dppComplianceNotes.map((note, idx) => <li key={idx}>{note}</li>)}
                </ul>
            </div>
          )}


          {shipmentData.progressPercentage !== undefined && (
            <div>
              <label htmlFor={`shipment-progress-${shipmentData.id}`} className="text-xs font-medium text-muted-foreground">Shipment Progress</label>
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

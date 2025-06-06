
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin, Ship, Plane, Building2, Package, ShieldCheck, ShieldAlert, ShieldQuestion, Info, FileText } from "lucide-react";
import { type MockCustomsCheckpoint } from '@/app/(app)/dpp-global-tracker/page'; 
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CheckpointInfoCardProps {
  checkpointData: MockCustomsCheckpoint;
  onClose: () => void;
}

export default function CheckpointInfoCard({ checkpointData, onClose }: CheckpointInfoCardProps) {
  
  const getCheckpointIcon = (type: MockCustomsCheckpoint['type']) => {
    switch (type) {
      case 'port': return <Ship className="h-5 w-5 mr-2 text-blue-600" />;
      case 'airport': return <Plane className="h-5 w-5 mr-2 text-purple-600" />;
      case 'land_border': return <Building2 className="h-5 w-5 mr-2 text-orange-600" />;
      default: return <MapPin className="h-5 w-5 mr-2 text-gray-600" />;
    }
  };

  const getCustomsStatusBadge = (status: MockCustomsCheckpoint['overallCustomsStatus']) => {
    switch (status) {
      case 'cleared':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300"><ShieldCheck className="mr-1 h-3 w-3" /> Cleared</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300"><Info className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'inspection_required':
        return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300"><ShieldAlert className="mr-1 h-3 w-3" /> Inspection Required</Badge>;
      case 'operational':
      default:
        return <Badge variant="secondary">Operational</Badge>;
    }
  };
  
  const getDppHealthBadge = (health: MockCustomsCheckpoint['dppComplianceHealth']) => {
     switch (health) {
      case 'good':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">Good</Badge>;
      case 'fair':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">Fair</Badge>;
      case 'poor':
        return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300">Poor</Badge>;
      case 'unknown':
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-90 duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {getCheckpointIcon(checkpointData.type)}
              <CardTitle className="text-xl font-headline text-primary">{checkpointData.name}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="h-8 w-8 -mt-1 -mr-1">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription className="text-sm pt-1 capitalize">
            {checkpointData.type.replace('_', ' ')} Checkpoint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
            <span className="font-medium text-foreground/90 flex items-center"><Package className="h-4 w-4 mr-2 text-muted-foreground" /> Current Shipments:</span>
            <span className="text-foreground font-semibold">{checkpointData.currentShipmentCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
            <span className="font-medium text-foreground/90 flex items-center"><ShieldQuestion className="h-4 w-4 mr-2 text-muted-foreground" /> Customs Status:</span>
            {getCustomsStatusBadge(checkpointData.overallCustomsStatus)}
          </div>
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
            <span className="font-medium text-foreground/90 flex items-center"><FileText className="h-4 w-4 mr-2 text-muted-foreground" /> DPP Compliance Health:</span>
            {getDppHealthBadge(checkpointData.dppComplianceHealth)}
          </div>
          
          <div className="pt-3 mt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              This card shows operational and compliance overview for the selected customs checkpoint. 
              Detailed shipment data passing through would be available in a full system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


// --- File: src/components/dpp-tracker/SelectedProductCustomsInfoCard.tsx ---
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Package, Truck, Ship, Plane, AlertTriangle, CalendarDays, ExternalLink, Info as InfoIcon } from 'lucide-react';
import type { TransitProduct, CustomsAlert } from '@/types/dpp';
import { cn } from '@/lib/utils';
import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses } from "@/utils/dppDisplayUtils";

interface SelectedProductCustomsInfoCardProps {
  productTransitInfo: TransitProduct;
  alerts: CustomsAlert[];
  onDismiss: () => void;
}

export default function SelectedProductCustomsInfoCard({ productTransitInfo, alerts, onDismiss }: SelectedProductCustomsInfoCardProps) {
  const TransportIcon = 
    productTransitInfo.transport === 'Ship' ? Ship :
    productTransitInfo.transport === 'Truck' ? Truck :
    Plane;

  const etaDate = new Date(productTransitInfo.eta);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const isEtaPast = etaDate < today;
  const isEtaToday = etaDate.toDateString() === today.toDateString();

  // Use utility functions for DPP status badge
  const DppStatusIcon = getStatusIcon(productTransitInfo.dppStatus);
  const dppStatusBadgeVariant = getStatusBadgeVariant(productTransitInfo.dppStatus);
  const dppStatusClasses = getStatusBadgeClasses(productTransitInfo.dppStatus);
  const formattedDppStatus = productTransitInfo.dppStatus
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

  return (
    <Card className="absolute bottom-4 left-4 z-20 w-full max-w-md shadow-xl bg-card/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4">
        <div className="flex items-center">
          <Package className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-md font-semibold">{productTransitInfo.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDismiss}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 text-xs space-y-2">
        <p className="text-sm text-muted-foreground">ID: <span className="font-mono text-foreground">{productTransitInfo.id}</span></p>
        
        <div className="p-2 border rounded-md bg-muted/30 space-y-1.5">
            <h4 className="font-medium text-foreground">Transit Details:</h4>
            <p><strong className="text-muted-foreground">Stage:</strong> {productTransitInfo.stage}</p>
            <p className="flex items-center"><strong className="text-muted-foreground mr-1">Transport:</strong> <TransportIcon className="h-4 w-4 mr-1 text-primary" /> {productTransitInfo.transport}</p>
            <p><strong className="text-muted-foreground">Origin:</strong> {productTransitInfo.origin}</p>
            <p><strong className="text-muted-foreground">Destination:</strong> {productTransitInfo.destination}</p>
            <div className="flex items-center">
                <strong className="text-muted-foreground mr-1">ETA:</strong>
                {isEtaPast ? (
                    <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Overdue: {etaDate.toLocaleDateString()}
                    </Badge>
                ) : isEtaToday ? (
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        Due Today: {etaDate.toLocaleDateString()}
                    </Badge>
                ) : (
                    etaDate.toLocaleDateString()
                )}
            </div>
            <p className="flex items-center"><strong className="text-muted-foreground mr-1">DPP Status:</strong> 
                <Badge className={cn("text-xs capitalize", dppStatusClasses)} variant={dppStatusBadgeVariant}>
                    {React.cloneElement(DppStatusIcon, {className: "mr-1 h-3 w-3"})}
                    {formattedDppStatus}
                </Badge>
            </p>
        </div>

        {alerts.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <h4 className="font-medium text-destructive mb-1">Active Alerts ({alerts.length}):</h4>
            <ul className="space-y-1 max-h-24 overflow-y-auto">
              {alerts.map(alert => (
                <li key={alert.id} className="p-1.5 bg-destructive/10 rounded-sm border border-destructive/30">
                  <p className="font-semibold text-destructive text-[0.7rem] leading-tight">{alert.message}</p>
                  <p className="text-muted-foreground text-[0.65rem]">Severity: {alert.severity} - {alert.timestamp} {alert.regulation && `(Reg: ${alert.regulation})`}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {alerts.length === 0 && (
            <p className="text-xs text-green-600 mt-1.5">No active customs alerts for this product.</p>
        )}
         <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2 text-xs" asChild>
            <Link href={`/passport/${productTransitInfo.id}`} target="_blank" rel="noopener noreferrer">
              View Full DPP <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
      </CardContent>
    </Card>
  );
}

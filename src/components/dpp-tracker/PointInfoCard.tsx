
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, QrCode, ShieldAlert, ShieldCheck, Info as InfoIcon, Package as PackageIcon } from "lucide-react";
import type { MockDppPoint } from '@/app/(app)/dpp-global-tracker/page';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

interface PointInfoCardProps {
  pointData: MockDppPoint;
  onClose: () => void;
}

export default function PointInfoCard({ pointData, onClose }: PointInfoCardProps) {
  const { toast } = useToast();

  let StatusIcon = InfoIcon;
  let statusBadgeVariant: "default" | "outline" | "destructive" | "secondary" = "secondary";
  let statusClasses = "bg-muted text-muted-foreground";

  if (pointData.status === 'compliant') {
    StatusIcon = ShieldCheck;
    statusBadgeVariant = "default";
    statusClasses = "bg-green-100 text-green-700 border-green-300";
  } else if (pointData.status === 'pending') {
    StatusIcon = InfoIcon;
    statusBadgeVariant = "outline";
    statusClasses = "bg-yellow-100 text-yellow-700 border-yellow-300";
  } else if (pointData.status === 'issue') {
    StatusIcon = ShieldAlert;
    statusBadgeVariant = "destructive";
    statusClasses = "bg-red-100 text-red-700 border-red-300";
  }


  const handleMockQrClick = () => {
    toast({
      title: "QR Code Access (Mock)",
      description: `Mock: QR code link for Product ID ${pointData.id} would be presented here, linking to its detailed DPP.`,
      duration: 5000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-90 duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-headline text-primary flex items-center">
              <PackageIcon className="h-5 w-5 mr-2" /> {pointData.name}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="h-8 w-8 -mt-1 -mr-1">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription className="text-sm flex items-center pt-1">
            {pointData.category} - 
            <Badge variant={statusBadgeVariant} className={cn("ml-2 capitalize text-xs", statusClasses)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {pointData.status}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {pointData.manufacturer && <p><strong>Manufacturer:</strong> {pointData.manufacturer}</p>}
          {pointData.gtin && <p><strong>GTIN:</strong> {pointData.gtin}</p>}
          {pointData.complianceSummary && <p><strong>Compliance Note:</strong> {pointData.complianceSummary}</p>}
          {pointData.id && <p className="text-xs text-muted-foreground mt-2">Product System ID: {pointData.id}</p>}
          
          <div className="pt-3 border-t border-border space-y-2">
            <Link href={`/products/${pointData.id}`} passHref>
              <Button className="w-full" variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Full Passport Details
              </Button>
            </Link>
            <Button className="w-full" variant="outline" onClick={handleMockQrClick}>
              <QrCode className="mr-2 h-4 w-4" />
              View Product DPP (QR Mock)
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

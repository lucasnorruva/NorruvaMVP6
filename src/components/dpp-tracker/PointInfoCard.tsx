
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { type MockDppPoint } from '@/app/(app)/dpp-global-tracker/page'; // Import the type
import { cn } from '@/lib/utils';

interface PointInfoCardProps {
  pointData: MockDppPoint;
  onClose: () => void;
}

export default function PointInfoCard({ pointData, onClose }: PointInfoCardProps) {
  
  let statusColorClass = "text-muted-foreground";
  if (pointData.status === 'compliant') statusColorClass = "text-green-600";
  else if (pointData.status === 'pending') statusColorClass = "text-yellow-600";
  else if (pointData.status === 'issue') statusColorClass = "text-red-600";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-90 duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-headline text-primary">{pointData.name}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="h-8 w-8 -mt-1 -mr-1">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription className="text-sm">
            {pointData.category} - Status: <span className={cn("font-semibold capitalize", statusColorClass)}>{pointData.status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {pointData.manufacturer && <p><strong>Manufacturer:</strong> {pointData.manufacturer}</p>}
          {pointData.gtin && <p><strong>GTIN:</strong> {pointData.gtin}</p>}
          {pointData.complianceSummary && <p><strong>Compliance Note:</strong> {pointData.complianceSummary}</p>}
          {pointData.id && <p className="text-xs text-muted-foreground mt-2">Product System ID: {pointData.id}</p>}
        </CardContent>
      </Card>
    </div>
  );
}


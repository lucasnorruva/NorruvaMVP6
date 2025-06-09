
// --- File: src/components/developer/dashboard/ServiceStatusCard.tsx ---
// Description: Component for displaying system and service status.

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server as ServerIconShadcn, RefreshCw, CheckCircle, AlertTriangle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceStatus {
  name: string;
  status: string;
  icon: React.ElementType;
  color: string;
}

interface OverallStatus {
  text: string;
  icon: React.ElementType;
  color: string;
}

interface ServiceStatusCardProps {
  systemStatusData: ServiceStatus[];
  overallSystemStatus: OverallStatus;
  lastStatusCheckTime: string;
  onRefreshStatus: () => void;
}

export default function ServiceStatusCard({
  systemStatusData,
  overallSystemStatus,
  lastStatusCheckTime,
  onRefreshStatus,
}: ServiceStatusCardProps) {
  const OverallStatusIcon = overallSystemStatus.icon;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-lg flex items-center">
            <ServerIconShadcn className="mr-2 h-5 w-5 text-primary" /> System &amp; Service Status
          </CardTitle>
          <CardDescription>Current operational status of Norruva platform components.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onRefreshStatus}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={cn("p-3 rounded-md flex items-center text-sm font-medium",
          overallSystemStatus.color === "text-green-500" && "bg-green-500/10 border border-green-500/30",
          overallSystemStatus.color === "text-yellow-500" && "bg-yellow-500/10 border border-yellow-500/30",
          overallSystemStatus.color === "text-red-500" && "bg-red-500/10 border border-red-500/30"
        )}>
          <OverallStatusIcon className={cn("h-5 w-5 mr-2", overallSystemStatus.color)} />
          Overall: {overallSystemStatus.text}
        </div>
        {systemStatusData.map((service) => {
          const StatusIcon = service.icon;
          return (
            <div key={service.name} className="flex items-center justify-between p-2.5 border-b last:border-b-0 rounded-md hover:bg-muted/30">
              <div className="flex items-center">
                <StatusIcon className={cn("h-5 w-5 mr-3", service.color)} />
                <span className="text-sm font-medium text-foreground">{service.name}</span>
              </div>
              <Badge
                variant={service.status === "Operational" ? "default" : service.status.includes("Degraded") ? "outline" : "secondary"}
                className={cn("text-xs",
                  service.status === "Operational" && "bg-green-100 text-green-700 border-green-300",
                  service.status.includes("Degraded") && "bg-yellow-100 text-yellow-700 border-yellow-300",
                  service.status.includes("Maintenance") && "bg-blue-100 text-blue-700 border-blue-300"
                )}
              >
                {service.status}
              </Badge>
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground pt-2">
          Last checked: {lastStatusCheckTime}. For detailed incidents, visit status.norruva.com (conceptual).
        </p>
      </CardContent>
    </Card>
  );
}

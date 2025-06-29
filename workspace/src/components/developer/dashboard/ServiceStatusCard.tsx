// --- File: src/components/developer/dashboard/ServiceStatusCard.tsx ---
// Description: Component for displaying system and service status.

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Server as ServerIconShadcn,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceStatus {
  name: string;
  status: string;
  icon: React.ElementType;
  color: string; // This will now map to theme colors
}

interface OverallStatus {
  text: string;
  icon: React.ElementType;
  color: string; // This will now map to theme colors
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

  const getStatusColorClass = (statusText: string): string => {
    const lowerStatus = statusText.toLowerCase();
    if (lowerStatus === "operational") return "text-success";
    if (lowerStatus.includes("degraded")) return "text-warning";
    if (lowerStatus.includes("maintenance")) return "text-info";
    return "text-destructive"; // For "Outage" or other critical issues
  };

  const getStatusBadgeVariant = (
    statusText: string,
  ): "default" | "destructive" | "outline" | "secondary" => {
    const lowerStatus = statusText.toLowerCase();
    if (lowerStatus === "operational") return "default";
    if (lowerStatus.includes("degraded")) return "outline";
    if (lowerStatus.includes("maintenance")) return "outline";
    return "destructive";
  };

  const getStatusBadgeCustomClasses = (statusText: string): string => {
    const lowerStatus = statusText.toLowerCase();
    if (lowerStatus === "operational")
      return "bg-success/10 border-success/30 text-success";
    if (lowerStatus.includes("degraded"))
      return "bg-warning/10 border-warning/30 text-warning";
    if (lowerStatus.includes("maintenance"))
      return "bg-info/10 border-info/30 text-info";
    return "bg-destructive/10 border-destructive/30 text-destructive";
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-lg flex items-center">
            <ServerIconShadcn className="mr-2 h-5 w-5 text-primary" /> System
            &amp; Service Status
          </CardTitle>
          <CardDescription>
            Current operational status of Norruva platform components.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onRefreshStatus}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className={cn(
            "p-3 rounded-md flex items-center text-sm font-medium",
            overallSystemStatus.color === "text-success" &&
              "bg-success/10 border border-success/30",
            overallSystemStatus.color === "text-warning" &&
              "bg-warning/10 border border-warning/30",
            overallSystemStatus.color === "text-danger" &&
              "bg-destructive/10 border border-destructive/30",
          )}
        >
          <OverallStatusIcon
            className={cn("h-5 w-5 mr-2", overallSystemStatus.color)}
          />
          Overall: {overallSystemStatus.text}
        </div>
        {systemStatusData.map((service) => {
          const StatusIcon = service.icon;
          const serviceStatusColor = getStatusColorClass(service.status);
          const badgeVariant = getStatusBadgeVariant(service.status);
          const badgeCustomClasses = getStatusBadgeCustomClasses(
            service.status,
          );

          return (
            <div
              key={service.name}
              className="flex items-center justify-between p-2.5 border-b last:border-b-0 rounded-md hover:bg-muted/30"
            >
              <div className="flex items-center">
                <StatusIcon
                  className={cn("h-5 w-5 mr-3", serviceStatusColor)}
                />
                <span className="text-sm font-medium text-foreground">
                  {service.name}
                </span>
              </div>
              <Badge
                variant={badgeVariant}
                className={cn("text-xs", badgeCustomClasses)}
              >
                {service.status}
              </Badge>
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground pt-2">
          Last checked: {lastStatusCheckTime}. For detailed incidents, visit
          status.norruva.com (conceptual).
        </p>
      </CardContent>
    </Card>
  );
}

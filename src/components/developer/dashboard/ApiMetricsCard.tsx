// --- File: src/components/developer/dashboard/ApiMetricsCard.tsx ---
// Description: Component for displaying API metrics on the Developer Portal dashboard.

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChartBig, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ApiMetricsCardProps {
  currentEnvironment: string;
  getUsageMetric: (metricType: "calls" | "errorRate") => string;
  overallApiStatus: { text: string; icon: React.ElementType; color: string };
  onViewFullReportClick: () => void;
}

export default function ApiMetricsCard({
  currentEnvironment,
  getUsageMetric,
  overallApiStatus,
  onViewFullReportClick,
}: ApiMetricsCardProps) {
  const OverallStatusIcon = overallApiStatus.icon;
  return (
    <Card className="shadow-md lg:col-span-1">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <BarChartBig className="mr-2 h-5 w-5 text-primary" />
          Key API Metrics &amp; Health (
          <span className="capitalize">{currentEnvironment}</span>)
        </CardTitle>
        <CardDescription>
          Mock conceptual API metrics for the current environment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
          <span>API Calls (Last 24h):</span>
          <span className="font-semibold">{getUsageMetric("calls")}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
          <span>Error Rate (Last 24h):</span>
          <span className="font-semibold">{getUsageMetric("errorRate")}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
          <span>Avg. Latency:</span>
          <span className="font-semibold">
            {currentEnvironment === "sandbox" ? "120ms" : "85ms"}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
          <span>API Uptime (Last 7d):</span>
          <span className="font-semibold text-green-600">
            {currentEnvironment === "sandbox" ? "99.95%" : "99.99%"}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
          <span>Peak Requests/Sec:</span>
          <span className="font-semibold">
            {currentEnvironment === "sandbox" ? "15" : "250"}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
          <span>Overall API Status:</span>
          <span
            className={cn(
              "font-semibold flex items-center",
              overallApiStatus.color,
            )}
          >
            <OverallStatusIcon className="h-4 w-4 mr-1.5" />
            {overallApiStatus.text}
          </span>
        </div>
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto text-primary mt-2"
          onClick={onViewFullReportClick}
        >
          View Full Usage Report
        </Button>
      </CardContent>
    </Card>
  );
}

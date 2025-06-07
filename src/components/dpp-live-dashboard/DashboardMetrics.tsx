
// --- File: DashboardMetrics.tsx ---
// Description: Component to display a series of metric cards for the DPP Live Dashboard.
"use client";

import React from 'react';
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { BarChart3, Percent, Clock, ScanEye, Users } from "lucide-react";

interface DashboardMetricsProps {
  metrics: {
    totalDPPs: number;
    compliantPercentage: string;
    pendingReviewDPPs: number;
    totalConsumerScans: number;
    averageConsumerScans: string;
  };
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <MetricCard title="Total DPPs" value={metrics.totalDPPs} trend="+2%" trendDirection="up" icon={BarChart3} />
      <MetricCard title="Fully Compliant" value={metrics.compliantPercentage} trend="+1.5%" trendDirection="up" icon={Percent} />
      <MetricCard title="Pending Review" value={metrics.pendingReviewDPPs} trend={metrics.pendingReviewDPPs > 0 ? `+${metrics.pendingReviewDPPs - (metrics.pendingReviewDPPs > 1 ? 1: 0) }` : "0"} trendDirection={metrics.pendingReviewDPPs > 1 ? "up" : (metrics.pendingReviewDPPs === 1 ? "up" : "neutral")} icon={Clock} />
      <MetricCard title="Total Consumer Scans" value={metrics.totalConsumerScans.toLocaleString()} trend="+8%" trendDirection="up" icon={ScanEye} />
      <MetricCard title="Avg. Scans / DPP" value={metrics.averageConsumerScans} trend="+0.5" trendDirection="up" icon={Users} />
    </div>
  );
}

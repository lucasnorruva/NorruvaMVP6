// --- File: src/app/(app)/data-insights-dashboard/page.tsx ---
"use client";

import {
  BarChartBig,
  Package,
  CheckSquare,
  AlertTriangle as AlertTriangleIcon,
  Map,
  Users,
  Sigma,
} from "lucide-react";
import KpiSummaryCard from "@/components/dashboard/insights/KpiSummaryCard";
import DppsByCategoryChart from "@/components/dashboard/insights/DppsByCategoryChart";
import DppStatusDistributionChart from "@/components/dashboard/insights/DppStatusDistributionChart";
import ComplianceHotspotsTable from "@/components/dashboard/insights/ComplianceHotspotsTable";
import GeographicDistributionSummary from "@/components/dashboard/insights/GeographicDistributionSummary";
import { MOCK_DPPS } from "@/data"; // Used by child components

export default function DataInsightsDashboardPage() {
  const totalDpps = MOCK_DPPS.length;
  const averageCompliance = 78; // Mock data
  const productsNeedingReview = MOCK_DPPS.filter(
    (dpp) =>
      dpp.metadata.status === "pending_review" ||
      dpp.complianceSummary?.overallStatus === "Non-Compliant" ||
      dpp.complianceSummary?.overallStatus === "Pending Review",
  ).length;
  const activeUsers = 125; // Mock data

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BarChartBig className="mr-3 h-7 w-7 text-primary" /> Data Insights &
          Platform Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiSummaryCard
          title="Total Active DPPs"
          value={totalDpps.toLocaleString()}
          icon={Package}
          description="Across all categories"
        />
        <KpiSummaryCard
          title="Avg. Compliance Score"
          value={`${averageCompliance}%`}
          icon={CheckSquare}
          description="Mock platform average"
          trend="+2%"
          trendDirection="up"
        />
        <KpiSummaryCard
          title="Products for Review"
          value={productsNeedingReview.toLocaleString()}
          icon={AlertTriangleIcon}
          description="Pending or non-compliant"
          trend={productsNeedingReview > 5 ? "+3" : ""}
          trendDirection={productsNeedingReview > 5 ? "up" : "neutral"}
        />
        <KpiSummaryCard
          title="Active Platform Users"
          value={activeUsers.toLocaleString()}
          icon={Users}
          description="Across all roles (mock)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DppsByCategoryChart />
        <DppStatusDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ComplianceHotspotsTable />
        <GeographicDistributionSummary />
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          All data presented on this dashboard is illustrative and based on mock
          data for demonstration purposes.
        </p>
      </div>
    </div>
  );
}

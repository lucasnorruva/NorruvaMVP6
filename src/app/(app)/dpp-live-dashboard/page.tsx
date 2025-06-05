
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { DashboardFiltersComponent } from "@/components/dpp-dashboard/DashboardFiltersComponent";
import { DPPTable } from "@/components/dpp-dashboard/DPPTable";
import type { DigitalProductPassport, DashboardFiltersState } from "@/types/dpp";
import { MOCK_DPPS } from "@/types/dpp"; // Import mock data
import { BarChart3, CheckSquare, Clock, Eye, PlusCircle, ScanEye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


const availableRegulations = [
  { value: "all", label: "All Regulations" },
  { value: "eu_espr", label: "EU ESPR" },
  { value: "us_scope3", label: "US Scope 3" },
  { value: "battery_regulation", label: "EU Battery Regulation" },
];

export default function DPPLiveDashboardPage() {
  const router = useRouter();
  const [dpps, setDpps] = useState<DigitalProductPassport[]>([]);
  const [filters, setFilters] = useState<DashboardFiltersState>({
    status: "all",
    regulation: "all",
    // timeRange: '30d' // Future filter
  });

  // Simulate fetching data on mount (replace with real data fetching)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDpps(MOCK_DPPS);
    }, 500);
  }, []);

  const filteredDPPs = useMemo(() => {
    return dpps.filter((dpp) => {
      // Status filter
      if (filters.status !== "all" && dpp.metadata.status !== filters.status) {
        return false;
      }

      // Regulation filter (checks if compliant with the selected regulation)
      if (filters.regulation !== "all") {
        const complianceData = dpp.compliance[filters.regulation as keyof typeof dpp.compliance];
        if (!complianceData || complianceData.status !== "compliant") {
          return false;
        }
      }
      
      // Time range filter (can be added later)
      // if (filters.timeRange !== 'all') {
      //   const lastUpdated = new Date(dpp.metadata.last_updated).getTime();
      //   const now = new Date().getTime();
      //   let rangeInMs = 0;
      //   if (filters.timeRange === '7d') rangeInMs = 7 * 24 * 60 * 60 * 1000;
      //   if (filters.timeRange === '30d') rangeInMs = 30 * 24 * 60 * 60 * 1000;
      //   if (filters.timeRange === '90d') rangeInMs = 90 * 24 * 60 * 60 * 1000;
      //   if (now - lastUpdated > rangeInMs) {
      //       return false;
      //   }
      // }
      return true;
    });
  }, [dpps, filters]);

  const metrics = useMemo(() => {
    const totalDPPs = dpps.length;
    const compliantDPPs = dpps.filter(dpp => {
        // Consider compliant if at least one checked regulation is compliant and no non-compliant ones.
        // This logic might need refinement based on specific business rules.
        const regulationChecks = Object.values(dpp.compliance).filter(Boolean);
        if (regulationChecks.length === 0) return false; // No compliance data
        const nonCompliant = regulationChecks.some(r => r.status === 'non_compliant');
        const anyCompliant = regulationChecks.some(r => r.status === 'compliant');
        return anyCompliant && !nonCompliant;
    }).length;
    const pendingReviewDPPs = dpps.filter(d => d.metadata.status === 'pending_review').length;
    const totalConsumerScans = dpps.reduce((sum, dpp) => sum + (dpp.consumerScans || 0), 0);

    return {
      totalDPPs,
      compliantDPPs,
      pendingReviewDPPs,
      totalConsumerScans,
    };
  }, [dpps]);


  const handleFiltersChange = (newFilters: Partial<DashboardFiltersState>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold text-primary">
          Live DPP Dashboard
        </h1>
        <Link href="/products/new" passHref>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New DPP
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total DPPs"
          value={metrics.totalDPPs}
          // trend="+2%" // Placeholder trend
          // trendDirection="up"
          icon={BarChart3}
        />
        <MetricCard
          title="Overall Compliant"
          value={metrics.compliantDPPs}
          // trend="+1.5%"
          // trendDirection="up"
          icon={CheckSquare}
        />
        <MetricCard
          title="Pending Review"
          value={metrics.pendingReviewDPPs}
          // trend="-0.5%"
          // trendDirection={metrics.pendingReviewDPPs > 0 ? "up" : "neutral"}
          icon={Clock}
        />
        <MetricCard
          title="Consumer Scans (Total)"
          value={metrics.totalConsumerScans.toLocaleString()}
          // trend="+8%"
          // trendDirection="up"
          icon={ScanEye}
        />
      </div>
      
      <DashboardFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableRegulations={availableRegulations}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Digital Product Passports</CardTitle>
          <CardDescription>Overview of all managed DPPs. Click ID to view details.</CardDescription>
        </CardHeader>
        <CardContent>
          <DPPTable dpps={filteredDPPs} />
        </CardContent>
      </Card>
    </div>
  );
}

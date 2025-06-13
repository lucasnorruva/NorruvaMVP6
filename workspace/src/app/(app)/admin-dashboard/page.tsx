
// --- File: src/app/(app)/admin-dashboard/page.tsx ---
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import Link from "next/link";
import { RegulationUpdatesCard } from "@/components/dashboard/RegulationUpdatesCard";
import { AdminDashboardOverview } from "@/components/dashboard/AdminDashboardOverview";
import { AdminQuickActions } from "@/components/dashboard/AdminQuickActions";
import { PlatformHealthStatsCard } from "@/components/dashboard/PlatformHealthStatsCard";
import AdminProductsAttentionCard from "@/components/dashboard/AdminProductsAttentionCard";
import AdminDataManagementKpisCard from "@/components/dashboard/AdminDataManagementKpisCard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Admin Dashboard</h1>
        <Button asChild variant="default">
          <Link href="/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Platform Product Setup
          </Link>
        </Button>
      </div>
      <AdminDashboardOverview />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminQuickActions />
        <AdminProductsAttentionCard /> 
        <PlatformHealthStatsCard />
      </div>
      <div className="grid gap-6 md:grid-cols-1"> 
        <AdminDataManagementKpisCard />
      </div>
      <RegulationUpdatesCard />
    </div>
  );
}


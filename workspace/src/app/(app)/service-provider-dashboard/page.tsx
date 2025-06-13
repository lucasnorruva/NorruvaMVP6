
// --- File: src/app/(app)/service-provider-dashboard/page.tsx ---
"use client";

import { ServiceProviderDashboard as ServiceProviderDashboardContent } from "@/components/dashboard/ServiceProviderDashboard";

export default function ServiceProviderDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Service Provider Dashboard</h1>
      <ServiceProviderDashboardContent />
    </div>
  );
}


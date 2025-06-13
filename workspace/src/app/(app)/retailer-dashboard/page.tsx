
// --- File: src/app/(app)/retailer-dashboard/page.tsx ---
"use client";

import { RetailerDashboard as RetailerDashboardContent } from "@/components/dashboard/RetailerDashboard";

export default function RetailerDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Retailer Dashboard</h1>
      <RetailerDashboardContent />
    </div>
  );
}



// --- File: src/app/(app)/supplier-dashboard/page.tsx ---
"use client";

import { SupplierDashboard as SupplierDashboardContent } from "@/components/dashboard/SupplierDashboard";

export default function SupplierDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Supplier Dashboard</h1>
      <SupplierDashboardContent />
    </div>
  );
}

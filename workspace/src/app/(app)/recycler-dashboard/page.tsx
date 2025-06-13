
// --- File: src/app/(app)/recycler-dashboard/page.tsx ---
"use client";

import { RecyclerDashboard as RecyclerDashboardContent } from "@/components/dashboard/RecyclerDashboard"; // Ensure this is RecyclerDashboardContent

export default function RecyclerDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Recycler Dashboard</h1>
      <RecyclerDashboardContent />
    </div>
  );
}

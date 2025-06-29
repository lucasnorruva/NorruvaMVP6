// --- File: src/app/(app)/verifier-dashboard/page.tsx ---
"use client";

import { VerifierDashboard as VerifierDashboardContent } from "@/components/dashboard/VerifierDashboard";

export default function VerifierDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">
        Verifier Dashboard
      </h1>
      <VerifierDashboardContent />
    </div>
  );
}

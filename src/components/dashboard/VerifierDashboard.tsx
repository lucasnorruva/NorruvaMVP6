"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, BarChart2 } from "lucide-react";
import { VerifierQuickActionsCard } from "./VerifierQuickActionsCard";
import { RegulationUpdatesCard } from "./RegulationUpdatesCard";

export const VerifierDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><BadgeCheck className="mr-2 text-primary"/>Verification & Audit</CardTitle>
        <CardDescription>Verify product claims and audit Digital Product Passports.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Pending Verifications</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-orange-500">23</p></CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Completed Audits</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">157</p><p className="text-xs text-muted-foreground">This quarter</p></CardContent>
        </Card>
      </CardContent>
    </Card>
    <VerifierQuickActionsCard />
    <Card>
      <CardHeader><CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5"/>System Alerts</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">New regulation update requires re-verification for 'Textile' category. Multiple DPPs flagged for potential data mismatch.</p></CardContent>
    </Card>
    <RegulationUpdatesCard />
  </div>
);


"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Recycle as RecycleIcon, AlertTriangle } from "lucide-react";
import { RecyclerQuickActionsCard } from "./RecyclerQuickActionsCard";
import { RegulationUpdatesCard } from "./RegulationUpdatesCard";

export const RecyclerDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><RecycleIcon className="mr-2 text-primary"/>End-of-Life & Material Recovery</CardTitle>
        <CardDescription>Access DPP information for disassembly and material recovery.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Products Processed</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">450</p><p className="text-xs text-muted-foreground">This month</p></CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader><CardTitle className="text-lg">Material Recovery Rate</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-accent">85%</p></CardContent>
        </Card>
      </CardContent>
    </Card>
    <RecyclerQuickActionsCard />
    <Card>
      <CardHeader><CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5"/>Material Alerts</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">High volume of 'Recycled PET' available from recent batch. Low stock of 'Lithium Carbonate' for battery recycling.</p></CardContent>
    </Card>
    <RegulationUpdatesCard />
  </div>
);


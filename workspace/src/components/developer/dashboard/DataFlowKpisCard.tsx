
// --- File: src/components/developer/dashboard/DataFlowKpisCard.tsx ---
// Description: Component for displaying conceptual API Data Flow and KPIs.

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Share2, Laptop, Server as ServerIconShadcn, DatabaseZap, Users, Webhook, CheckCircle, Clock, Zap as ZapIcon, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Kpi {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string; // Expecting a Tailwind text color class like 'text-success', 'text-info' etc.
  description: string;
}

interface DataFlowKpisCardProps {
  kpis: Kpi[];
}

export default function DataFlowKpisCard({ kpis }: DataFlowKpisCardProps) {
  return (
    <Card className="shadow-lg bg-card border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <Share2 className="mr-2 h-5 w-5 text-primary" /> Conceptual API Data Flow &amp; KPIs
        </CardTitle>
        <CardDescription>Visualizing typical API interactions and target performance indicators.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-md text-foreground">Data Flow Example:</h4>
          <div className="p-4 border rounded-md bg-muted/50 space-y-3 text-sm">
            <div className="flex items-center gap-2"><Laptop className="h-5 w-5 text-info" /> Developer App <span className="text-muted-foreground mx-1">&rarr;</span> <ServerIconShadcn className="h-5 w-5 text-primary" /> Norruva API (DPP Create)</div>
            <div className="flex items-center gap-2 ml-4"><ServerIconShadcn className="h-5 w-5 text-primary" /> Norruva API <span className="text-muted-foreground mx-1">&rarr;</span> <DatabaseZap className="h-5 w-5 text-accent" /> DPP Storage/Blockchain</div>
            <div className="flex items-center gap-2 ml-4"><DatabaseZap className="h-5 w-5 text-accent" /> DPP Storage <span className="text-muted-foreground mx-1">&rarr;</span> <ServerIconShadcn className="h-5 w-5 text-primary" /> Norruva API (DPP Read)</div>
            <div className="flex items-center gap-2"><ServerIconShadcn className="h-5 w-5 text-primary" /> Norruva API <span className="text-muted-foreground mx-1">&rarr;</span> <Users className="h-5 w-5 text-info" /> Consumers/Verifiers</div>
            <div className="flex items-center gap-2 ml-4"><ServerIconShadcn className="h-5 w-5 text-primary" /> Norruva API <span className="text-muted-foreground mx-1">&rarr;</span> <Webhook className="h-5 w-5 text-info" /> Developer App (Events)</div>
          </div>
          <p className="text-xs text-muted-foreground">This is a simplified representation. Actual flows may involve more components like EBSI integration.</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-medium text-md text-foreground">Key Performance Indicators (Targets):</h4>
          {kpis.map(kpi => {
            const KpiIcon = kpi.icon;
            return (
              <div key={kpi.title} className="flex items-start p-2.5 border-b last:border-b-0 rounded-md hover:bg-muted/20">
                <KpiIcon className={cn("h-5 w-5 mr-3 mt-0.5 flex-shrink-0", kpi.color)} />
                <div>
                  <span className="font-semibold text-sm text-foreground">{kpi.title}: <span className={cn("font-bold", kpi.color)}>{kpi.value}</span></span>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


    
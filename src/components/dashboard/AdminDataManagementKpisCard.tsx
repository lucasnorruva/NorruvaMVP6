// --- File: src/components/dashboard/AdminDataManagementKpisCard.tsx ---
// Description: Card displaying conceptual Data Management KPIs for the Admin Dashboard.
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FilePlus2,
  CheckSquare,
  Cpu,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Kpi {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendDirection?: "up" | "down";
  color?: string;
}

const kpis: Kpi[] = [
  {
    title: "DPPs Created (Last 30d)",
    value: "187",
    icon: FilePlus2,
    trend: "+15%",
    trendDirection: "up",
    color: "text-primary",
  },
  {
    title: "Average DPP Completeness",
    value: "82%",
    icon: CheckSquare,
    trend: "+2%",
    trendDirection: "up",
    color: "text-green-600",
  },
  {
    title: "AI Extractions (Last 7d)",
    value: "450",
    icon: Cpu,
    trend: "+8%",
    trendDirection: "up",
    color: "text-info",
  },
  {
    title: "DPPs Verified (EBSI Mock)",
    value: "95",
    icon: ShieldCheck,
    trend: "+5",
    trendDirection: "up",
    color: "text-accent",
  },
];

export default function AdminDataManagementKpisCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <FilePlus2 className="mr-2 h-5 w-5 text-primary" />
          Data Management KPIs
        </CardTitle>
        <CardDescription>
          Key performance indicators related to DPP data on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {kpis.map((kpi) => {
          const TrendIcon =
            kpi.trendDirection === "up"
              ? TrendingUp
              : kpi.trendDirection === "down"
                ? TrendingDown
                : null;
          return (
            <div
              key={kpi.title}
              className="flex items-center justify-between p-2.5 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center">
                <kpi.icon
                  className={cn(
                    "h-5 w-5 mr-3",
                    kpi.color || "text-muted-foreground",
                  )}
                />
                <span className="text-sm font-medium text-foreground">
                  {kpi.title}
                </span>
              </div>
              <div className="flex items-center text-right">
                <span
                  className={cn(
                    "text-lg font-semibold",
                    kpi.color || "text-foreground",
                  )}
                >
                  {kpi.value}
                </span>
                {kpi.trend && TrendIcon && (
                  <span
                    className={cn(
                      "ml-2 text-xs flex items-center",
                      kpi.trendDirection === "up"
                        ? "text-success"
                        : "text-danger",
                    )}
                  >
                    <TrendIcon className="h-3.5 w-3.5 mr-0.5" />
                    {kpi.trend}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

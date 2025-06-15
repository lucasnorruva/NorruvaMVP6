
// --- File: src/components/dashboard/insights/KpiSummaryCard.tsx ---
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiSummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  color?: string;
}

export default function KpiSummaryCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendDirection = "neutral",
  color = "text-primary",
}: KpiSummaryCardProps) {
  let TrendIcon = Minus;
  let trendColorClass = "text-muted-foreground";

  if (trendDirection === "up") {
    TrendIcon = ArrowUp;
    trendColorClass = "text-green-600";
  } else if (trendDirection === "down") {
    TrendIcon = ArrowDown;
    trendColorClass = "text-red-600";
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", color)} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        {trend && (
          <p className={cn("text-xs mt-1 flex items-center", trendColorClass)}>
            <TrendIcon className="h-3.5 w-3.5 mr-1" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

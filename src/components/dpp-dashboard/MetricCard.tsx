
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: React.ElementType;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendDirection,
  icon: Icon,
  className,
}) => {
  let TrendIcon = MinusCircle;
  let trendColor = "text-muted-foreground";

  if (trendDirection === "up") {
    TrendIcon = ArrowUpCircle;
    trendColor = "text-green-500";
  } else if (trendDirection === "down") {
    TrendIcon = ArrowDownCircle;
    trendColor = "text-red-500";
  }

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-5 w-5 text-primary" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1 flex items-center", trendColor)}>
            <TrendIcon className="h-4 w-4 mr-1" />
            {trend} vs last period
          </p>
        )}
      </CardContent>
    </Card>
  );
};

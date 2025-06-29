// --- File: src/components/dashboard/insights/DppsByCategoryChart.tsx ---
"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { MOCK_DPPS } from "@/data";
import { Package } from "lucide-react";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

export default function DppsByCategoryChart() {
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_DPPS.forEach((dpp) => {
      const category = dpp.category || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value], index) => ({
        name,
        value,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <Package className="mr-2 h-5 w-5 text-primary" />
          DPPs by Product Category
        </CardTitle>
        <CardDescription>
          Distribution of Digital Product Passports across different categories.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                allowDecimals={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                width={100}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  borderRadius: "var(--radius)",
                  border: "1px solid hsl(var(--border))",
                }}
                labelStyle={{ color: "hsl(var(--popover-foreground))" }}
              />
              <Bar
                dataKey="value"
                name="DPP Count"
                radius={[0, 4, 4, 0]}
                barSize={18}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground pt-10">
            No category data available to display.
          </p>
        )}
      </CardContent>
    </Card>
  );
}


// --- File: src/components/dashboard/insights/DppStatusDistributionChart.tsx ---
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { MOCK_DPPS } from '@/data';
import { CheckSquare } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  published: "hsl(var(--chart-1))", // Primary Blue
  draft: "hsl(var(--chart-2))", // Accent Teal
  pending_review: "hsl(var(--chart-4))", // Warning Orange
  archived: "hsl(var(--muted-foreground))", // Muted Grey
  flagged: "hsl(var(--destructive))", // Destructive Red
  revoked: "hsl(var(--chart-6))", // Pinkish
  default: "hsl(var(--chart-5))", // Cyan
};

export default function DppStatusDistributionChart() {
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_DPPS.forEach(dpp => {
      const status = dpp.metadata.status || "unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
      fill: STATUS_COLORS[name.toLowerCase()] || STATUS_COLORS.default,
    }));
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <CheckSquare className="mr-2 h-5 w-5 text-primary" />
          DPP Status Distribution
        </CardTitle>
        <CardDescription>Breakdown of DPPs by their current operational status.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}>
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{backgroundColor: 'hsl(var(--popover))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))'}}
                labelStyle={{color: 'hsl(var(--popover-foreground))'}}
                formatter={(value, name) => [`${value} DPPs`, name]}
              />
              <Legend iconSize={10} wrapperStyle={{fontSize: "11px", paddingTop: "10px"}}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground pt-10">No status data available to display.</p>
        )}
      </CardContent>
    </Card>
  );
}

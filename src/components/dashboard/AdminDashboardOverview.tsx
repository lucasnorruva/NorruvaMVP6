"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Building, FileWarning, ScanLine } from "lucide-react";

export const AdminDashboardOverview = () => {
  const overviewStats = [
    { title: "Total Products Managed", value: "1,234", icon: Package, color: "text-primary" },
    { title: "Registered Companies", value: "78", icon: Building, color: "text-accent" },
    { title: "DPPs Awaiting Verification", value: "42", icon: FileWarning, color: "text-orange-500" },
    { title: "Active Data Extractions", value: "12", icon: ScanLine, color: "text-info" },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {overviewStats.map((stat) => (
        <Card key={stat.title} className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">Updated recently</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


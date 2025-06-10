"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Activity, Users, FileClock, Database, Cpu, HardDrive } from "lucide-react";

export const PlatformHealthStatsCard = () => {
  const healthStats = [
    { title: "API Call Volume (24h)", value: "1.2M", icon: Activity, trend: "+5%", trendDirection: "up" as const },
    { title: "Active User Sessions", value: "345", icon: Users, trend: "-2%", trendDirection: "down" as const },
    { title: "DPP Verification Queue", value: "17", icon: FileClock, trend: "+3", trendDirection: "up" as const },
    { title: "Database Performance", value: "Optimal", icon: Database, statusColor: "text-success" },
    { title: "AI Model Requests (24h)", value: "5,670", icon: Cpu, trend: "+10%", trendDirection: "up" as const },
    { title: "Storage Utilization", value: "65%", icon: HardDrive, trend: "+1%", trendDirection: "up" as const },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
          Platform Health & Stats
        </CardTitle>
        <CardDescription>Overview of key operational metrics for the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthStats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-2 border-b last:border-b-0">
            <div className="flex items-center">
              <stat.icon className={`h-5 w-5 mr-3 ${stat.statusColor || 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">{stat.title}</span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-semibold ${stat.statusColor || ''}`}>{stat.value}</span>
              {stat.trend && (
                <span className={`ml-2 text-xs ${stat.trendDirection === 'up' ? 'text-success' : 'text-danger'}`}>
                  ({stat.trend})
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


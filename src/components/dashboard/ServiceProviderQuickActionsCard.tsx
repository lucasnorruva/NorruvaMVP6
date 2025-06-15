
// --- File: src/components/dashboard/ServiceProviderQuickActionsCard.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Wrench, BookOpen, Tool, CalendarDays, Search } from "lucide-react"; // Updated Icons

export const ServiceProviderQuickActionsCard = () => {
  const actions = [
    { label: "Log New Service Call", href: "#", icon: Wrench, description: "Record a new service request or issue." },
    { label: "Access Technical Docs", href: "/developer/docs", icon: BookOpen, description: "Find product manuals & guides." },
    { label: "Order Spare Parts (Mock)", href: "#", icon: Tool, description: "Request parts needed for repairs." },
    { label: "View My Schedule", href: "#", icon: CalendarDays, description: "Check your upcoming service appointments." },
    { label: "Search Knowledge Base (Mock)", href: "#", icon: Search, description: "Find solutions to common issues." },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
        <CardDescription>Essential tools for service providers.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} passHref legacyBehavior>
            <a className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
                <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                <div>
                  <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </a>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

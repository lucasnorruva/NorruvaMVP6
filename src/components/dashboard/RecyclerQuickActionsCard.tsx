"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, ScanLine, Database, Recycle as RecycleIcon, ListChecks } from "lucide-react";

export const RecyclerQuickActionsCard = () => {
  const actions = [
    { label: "Scan for Disassembly Info", href: "#", icon: ScanLine, description: "Access EOL data via product scan (mock)." },
    { label: "View Material Composition DB", href: "#", icon: Database, description: "Check material details for recovery (mock)." },
    { label: "Report Recovered Materials", href: "#", icon: RecycleIcon, description: "Log recovered materials and quantities (mock)." },
    { label: "Check EOL Instructions", href: "/products/PROD001", icon: ListChecks, description: "Review end-of-life procedures." },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
        <CardDescription>Tools for efficient material recovery.</CardDescription>
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


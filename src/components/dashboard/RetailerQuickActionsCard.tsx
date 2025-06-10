"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, ScanLine, DownloadCloud, Users, ShoppingBag } from "lucide-react";

export const RetailerQuickActionsCard = () => {
  const actions = [
    { label: "Access Public DPPs", href: "/dpp-live-dashboard", icon: ScanLine, description: "View DPPs for products you sell." },
    { label: "Download Product Data", href: "#", icon: DownloadCloud, description: "Get data sheets for marketing (mock)." },
    { label: "View Consumer Insights", href: "#", icon: Users, description: "See consumer interaction data (mock)." },
    { label: "Manage Point-of-Sale Info", href: "#", icon: ShoppingBag, description: "Update POS display information (mock)." },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
        <CardDescription>Essential tools for retailers.</CardDescription>
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


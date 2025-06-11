
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Package, Settings, FileText, ShieldCheck, ListChecks, SlidersHorizontal } from "lucide-react";

export const AdminQuickActions = () => {
  const quickActions = [
    { label: "Manage Users", href: "/settings/users", icon: Users },
    { label: "View All Products", href: "/products", icon: Package },
    { label: "Platform Configuration", href: "/settings", icon: Settings },
    { label: "Compliance Copilot", href: "/copilot", icon: FileText },
    { label: "System Health", href: "#", icon: ShieldCheck }, // Mock link
    { label: "Audit Logs", href: "/audit-log", icon: ListChecks },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <SlidersHorizontal className="mr-2 h-5 w-5 text-primary" />
          Admin Quick Actions
        </CardTitle>
        <CardDescription>Access key administrative functions quickly.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Link key={action.label} href={action.href} asChild>
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
              <action.icon className={`mr-3 h-5 w-5 ${index === 0 ? 'text-info' : 'text-primary'} group-hover:text-accent transition-colors flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};


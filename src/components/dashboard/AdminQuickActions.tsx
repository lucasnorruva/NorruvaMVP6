
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Package, Settings, FileText, ShieldCheck, ListChecks, SlidersHorizontal } from "lucide-react";

export const AdminQuickActions = () => {
  const quickActions = [
    { label: "Manage Users", href: "/settings/users", icon: Users, description: "Add, edit, or remove platform users." },
    { label: "View All Products", href: "/products", icon: Package, description: "Oversee all product entries and DPPs." },
    { label: "Platform Configuration", href: "/settings", icon: Settings, description: "Adjust global platform settings and integrations." },
    { label: "Compliance Copilot", href: "/copilot", icon: FileText, description: "Access AI assistant for regulation queries." },
    { label: "System Health", href: "#", icon: ShieldCheck, description: "Monitor platform status and performance." },
    { label: "Audit Logs", href: "/audit-log", icon: ListChecks, description: "Review system and user activity logs." },
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
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href} passHref legacyBehavior>
            <a className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
                <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0"> {/* Added flex-1 and min-w-0 here */}
                  <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                  <p className="text-xs text-muted-foreground break-words">{action.description}</p> {/* Added break-words for good measure */}
                </div>
              </Button>
            </a>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};


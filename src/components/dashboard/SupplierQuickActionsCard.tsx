"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Activity,
  UploadCloud,
  Inbox,
  FileText,
  MessageSquare,
} from "lucide-react";

export const SupplierQuickActionsCard = () => {
  const actions = [
    {
      label: "Upload Compliance Document",
      href: "/products/new",
      icon: UploadCloud,
      description: "Submit new or updated documents.",
    },
    {
      label: "View Data Requests",
      href: "#",
      icon: Inbox,
      description: "Check requests from manufacturers (mock).",
    },
    {
      label: "Manage Material Specs",
      href: "#",
      icon: FileText,
      description: "Update your material specifications (mock).",
    },
    {
      label: "Respond to Queries",
      href: "#",
      icon: MessageSquare,
      description: "Answer manufacturer questions (mock).",
    },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>Key tasks for suppliers.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} passHref legacyBehavior>
            <a className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10"
              >
                <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                <div>
                  <p className="font-medium group-hover:text-accent transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Button>
            </a>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

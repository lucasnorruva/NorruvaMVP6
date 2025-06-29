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
  FileWarning,
  History,
  ClipboardCheck,
  SearchCheck,
} from "lucide-react";

export const VerifierQuickActionsCard = () => {
  const actions = [
    {
      label: "Review Pending Verifications",
      href: "/products",
      icon: FileWarning,
      description: "Access DPPs awaiting verification.",
    },
    {
      label: "Access Audit Trails",
      href: "#",
      icon: History,
      description: "Review historical verification data (mock).",
    },
    {
      label: "Submit Verification Report",
      href: "#",
      icon: ClipboardCheck,
      description: "File new verification outcomes (mock).",
    },
    {
      label: "Query Compliance Standards",
      href: "/copilot",
      icon: SearchCheck,
      description: "Use AI to check regulations.",
    },
  ];
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Key functions for verifiers and auditors.
        </CardDescription>
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


// --- File: src/components/developer/dashboard/QuickActionsCard.tsx ---
// Description: Component for displaying quick action buttons on the Developer Portal dashboard.

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap as ZapIcon } from "lucide-react"; // Assuming ZapIcon is used for quick actions

interface QuickAction {
  label: string;
  href: string;
  targetTab?: string; // For actions that switch tabs within the portal
  icon: React.ElementType;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
  onTabChange: (tabValue: string) => void;
}

export default function QuickActionsCard({ actions, onTabChange }: QuickActionsCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <ZapIcon className="mr-2 h-5 w-5 text-primary" /> Quick Actions
        </CardTitle>
        <CardDescription>Access common developer tasks and resources directly.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map(action => {
          const ActionIcon = action.icon;
          return action.targetTab ? (
            <Button
              key={action.label}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10"
              onClick={() => onTabChange(action.targetTab!)}
            >
              <ActionIcon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
              </div>
            </Button>
          ) : (
            <Link key={action.label} href={action.href} passHref legacyBehavior>
              <a className="block">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
                  <ActionIcon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                  <div>
                    <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                  </div>
                </Button>
              </a>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

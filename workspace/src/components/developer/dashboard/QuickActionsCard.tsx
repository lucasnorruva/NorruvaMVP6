// --- File: src/components/developer/dashboard/QuickActionsCard.tsx ---
// Description: Component for displaying quick action buttons on the Developer Portal dashboard.

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap as ZapIcon } from "lucide-react"; // Assuming ZapIcon is used for quick actions
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuickAction {
  label: string;
  href: string;
  targetTab?: string; // For actions that switch tabs within the portal
  icon: React.ElementType;
  tooltip?: string; // Added tooltip text
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
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"> {/* Adjusted grid cols for more items */}
        {actions.map((action, index) => {
          const ActionIcon = action.icon;
          let buttonVariant: "default" | "secondary" | "outline" = "outline";
          if (index === 0) buttonVariant = "default"; // First action as primary
          else if (index === 1) buttonVariant = "secondary"; // Second action as secondary

          const actionButton = (
            <Button
              variant={buttonVariant}
              className="w-full justify-start text-left h-auto py-3 group"
              onClick={action.targetTab ? () => onTabChange(action.targetTab!) : undefined}
            >
              <ActionIcon className="mr-3 h-5 w-5 text-current flex-shrink-0" /> {/* Use text-current for icon color from button */}
              <div>
                <p className="font-medium">{action.label}</p>
              </div>
            </Button>
          );

          return (
            <TooltipProvider key={action.label} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {action.targetTab ? (
                    actionButton
                  ) : (
                    <Link href={action.href} passHref legacyBehavior>
                      <a className="block">{actionButton}</a>
                    </Link>
                  )}
                </TooltipTrigger>
                {action.tooltip && (
                  <TooltipContent>
                    <p>{action.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </CardContent>
    </Card>
  );
}

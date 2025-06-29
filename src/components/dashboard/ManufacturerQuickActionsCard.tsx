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
import { Activity, PlusCircle, Eye, Layers, Leaf } from "lucide-react";

export const ManufacturerQuickActionsCard = () => {
  const actions = [
    {
      label: "Add New Product",
      href: "/products/new",
      icon: PlusCircle,
      description: "Create a new DPP for your product.",
    },
    {
      label: "View My Products",
      href: "/products",
      icon: Eye,
      description: "See all your managed products.",
    },
    {
      label: "Manage Supply Chain Data",
      href: "/suppliers",
      icon: Layers,
      description: "Input or update supplier information.",
    },
    {
      label: "Sustainability Insights",
      href: "/sustainability",
      icon: Leaf,
      description: "View your sustainability reports.",
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
          Key actions for managing your products and sustainability data.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} asChild>
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
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

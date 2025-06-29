"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { History, Package } from "lucide-react";
import { ManufacturerQuickActionsCard } from "./ManufacturerQuickActionsCard";
import { RegulationUpdatesCard } from "./RegulationUpdatesCard";

export const ManufacturerDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Package className="mr-2 text-primary" />
          My Products Overview
        </CardTitle>
        <CardDescription>
          Manage your product portfolio and Digital Product Passports.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">150</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Compliance Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">3</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Pending DPPs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">7</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
    <ManufacturerQuickActionsCard />
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Product 'EcoBoiler X1' updated. New batch data for 'SolarPanel ZP'
          added. Supplier 'GreenParts Co' confirmed new material specs.
        </p>
      </CardContent>
    </Card>
    <RegulationUpdatesCard />
  </div>
);

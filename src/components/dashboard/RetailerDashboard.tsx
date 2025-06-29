"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShoppingBag, MessageSquare } from "lucide-react";
import { RetailerQuickActionsCard } from "./RetailerQuickActionsCard";
import { RegulationUpdatesCard } from "./RegulationUpdatesCard";

export const RetailerDashboard = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ShoppingBag className="mr-2 text-primary" />
          Product Information Access
        </CardTitle>
        <CardDescription>
          Access DPPs for products you sell and manage consumer information.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Products in Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,200</p>
            <p className="text-xs text-muted-foreground">DPPs accessible</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Consumer Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">15</p>
            <p className="text-xs text-muted-foreground">
              Related to product sustainability
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
    <RetailerQuickActionsCard />
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Market Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          New sustainability claim verified for 'Eco T-Shirt'. Upcoming
          regulation update for 'Electronics' category.
        </p>
      </CardContent>
    </Card>
    <RegulationUpdatesCard />
  </div>
);

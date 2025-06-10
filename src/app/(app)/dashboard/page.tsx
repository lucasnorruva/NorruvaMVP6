"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRole } from "@/contexts/RoleContext";

import { RegulationUpdatesCard } from "@/components/dashboard/RegulationUpdatesCard";
import { AdminDashboardOverview } from "@/components/dashboard/AdminDashboardOverview";
import { AdminQuickActions } from "@/components/dashboard/AdminQuickActions";
import { PlatformHealthStatsCard } from "@/components/dashboard/PlatformHealthStatsCard";
import { ManufacturerDashboard } from "@/components/dashboard/ManufacturerDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { RetailerDashboard } from "@/components/dashboard/RetailerDashboard";
import { RecyclerDashboard } from "@/components/dashboard/RecyclerDashboard";
import { VerifierDashboard } from "@/components/dashboard/VerifierDashboard";

export default function DashboardPage() {
  const { currentRole } = useRole();

  const renderDashboardContent = () => {
    switch (currentRole) {
      case 'admin':
        return (
          <div className="space-y-8">
            <AdminDashboardOverview />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AdminQuickActions />
              <Card className="shadow-lg lg:col-span-1">
                <CardHeader>
                  <CardTitle className="font-headline">Recent Platform Activity</CardTitle>
                  <CardDescription>Overview of system-wide updates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      {text: "New Manufacturer 'EcoGoods Inc.' onboarded.", time: "1 hour ago"},
                      {text: "Regulation Module 'EU Battery Reg v1.1' deployed.", time: "3 hours ago"},
                      {text: "System maintenance scheduled for Sunday 2 AM.", time: "1 day ago"},
                      {text: "Product PROD002 updated with new battery data.", time: "2 days ago"},
                      {text: "Verifier 'CertifyAll' completed 5 audits.", time: "3 days ago"}
                    ].map(activity => (
                      <li key={activity.text} className="flex items-center justify-between text-sm">
                        <span>{activity.text}</span>
                        <span className="text-muted-foreground">{activity.time}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <PlatformHealthStatsCard />
            </div>
            <RegulationUpdatesCard />
          </div>
        );
      case 'manufacturer':
        return <ManufacturerDashboard />;
      case 'supplier':
        return <SupplierDashboard />;
      case 'retailer':
        return <RetailerDashboard />;
      case 'recycler':
        return <RecyclerDashboard />;
      case 'verifier':
        return <VerifierDashboard />;
      default:
        return <p>No specific dashboard for this role yet.</p>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard
        </h1>
        {currentRole === 'manufacturer' && (
           <Link href="/products/new" passHref legacyBehavior>
            <a>
             <Button variant="secondary">
               <PlusCircle className="mr-2 h-5 w-5" />
               Add New Product
             </Button>
            </a>
           </Link>
        )}
         {currentRole === 'admin' && (
           <Link href="/products/new" passHref legacyBehavior>
             <a>
             <Button variant="default">
               <PlusCircle className="mr-2 h-5 w-5" />
               Platform Product Setup
             </Button>
            </a>
           </Link>
        )}
      </div>
      {renderDashboardContent()}
    </div>
  );
}



"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Settings, Package, ShieldCheck, UserPlus, Edit3, Zap } from "lucide-react"; // Added more icons
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
import AdminProductsAttentionCard from "@/components/dashboard/AdminProductsAttentionCard";
import AdminDataManagementKpisCard from "@/components/dashboard/AdminDataManagementKpisCard"; // Import new card

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
                  <CardDescription>Conceptual overview of system-wide updates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm max-h-72 overflow-y-auto">
                    {[
                      {text: "New Manufacturer 'SolarSolutions GmbH' onboarded.", time: "15m ago", icon: UserPlus, color: "text-green-600"},
                      {text: "Product PROD005 status changed to 'Published'.", time: "45m ago", icon: Edit3, color: "text-blue-500"},
                      {text: "AI Model 'DataExtractor v2.1' training completed.", time: "1h ago", icon: Zap, color: "text-purple-500"},
                      {text: "Regulation Module 'EU Battery Reg v1.1.2' updated.", time: "3h ago", icon: FileText, color: "text-orange-500"},
                      {text: "System maintenance scheduled for Sunday 2 AM UTC.", time: "Yesterday", icon: Settings, color: "text-gray-500" },
                      {text: "Product 'PROD001' EBSI verification successful.", time: "Yesterday", icon: ShieldCheck, color: "text-green-600"},
                      {text: "Supplier 'ComponentPro' added new material specs.", time: "2 days ago", icon: Package, color: "text-teal-500"}
                    ].map(activity => (
                      <li key={activity.text} className="flex items-center justify-between p-2.5 rounded-md hover:bg-muted/30 transition-colors border-b last:border-b-0">
                        <div className="flex items-center">
                          <activity.icon className={`h-4 w-4 mr-2.5 flex-shrink-0 ${activity.color}`} />
                          <span className="text-foreground/90">{activity.text}</span>
                        </div>
                        <span className="text-muted-foreground text-xs whitespace-nowrap pl-2">{activity.time}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <PlatformHealthStatsCard />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <AdminProductsAttentionCard />
              <AdminDataManagementKpisCard />
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
          <Button asChild variant="secondary">
            <Link href="/products/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Product
            </Link>
          </Button>
        )}
        {currentRole === 'admin' && (
          <Button asChild variant="default">
            <Link href="/products/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Platform Product Setup
            </Link>
          </Button>
        )}
      </div>
      {renderDashboardContent()}
    </div>
  );
}

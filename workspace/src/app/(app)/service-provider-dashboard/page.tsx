
// --- File: src/app/(app)/service-provider-dashboard/page.tsx ---
"use client";

import { ServiceProviderDashboard as ServiceProviderDashboardContent } from "@/components/dashboard/ServiceProviderDashboard"; 
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react"; 
import Link from "next/link"; 

export default function ServiceProviderDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Service Provider Dashboard</h1>
        <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90"> 
          <Link href="#">
            <PlusCircle className="mr-2 h-5 w-5" />
            Log New Service Job (Mock)
          </Link>
        </Button>
      </div>
      <ServiceProviderDashboardContent /> 
    </div>
  );
}

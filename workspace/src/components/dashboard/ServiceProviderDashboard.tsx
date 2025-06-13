
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wrench, ShieldCheck, Search, ListChecks, Clock, History } from "lucide-react";

export const ServiceProviderDashboard = () => {
  const mockServiceJobs = [
    { id: "JOB001", productId: "PROD001", productName: "EcoFriendly Refrigerator X2000", issue: "Cooling unit malfunction", status: "Scheduled", scheduledDate: "2024-08-15" },
    { id: "JOB002", productId: "PROD005", productName: "High-Performance EV Battery", issue: "Diagnostic check required", status: "In Progress", scheduledDate: "2024-08-10" },
    { id: "JOB003", productId: "USER_PROD123456", productName: "Custom Craft Wooden Chair", issue: "Leg re-attachment", status: "Completed", scheduledDate: "2024-08-05" },
  ];

  const quickActions = [
    { label: "View Assigned Jobs", href: "#", icon: ListChecks, description: "See your current service tasks." },
    { label: "Search Product DPPs", href: "/dpp-live-dashboard", icon: Search, description: "Access technical info & repair guides." },
    { label: "Update Service Records", href: "#", icon: History, description: "Log completed maintenance & repairs." },
    { label: "Check Compliance Updates", href: "/compliance/pathways", icon: ShieldCheck, description: "Stay informed on product regulations." },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Wrench className="mr-2 text-primary"/>Service & Maintenance Hub</CardTitle>
          <CardDescription>Manage service jobs, access product information, and log maintenance activities.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/50">
            <CardHeader><CardTitle className="text-lg">Open Service Jobs</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-orange-500">{mockServiceJobs.filter(j => j.status !== 'Completed').length}</p></CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardHeader><CardTitle className="text-lg">Completed This Week</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-green-600">5</p></CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardHeader><CardTitle className="text-lg">Upcoming Critical Maintenance</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">2</p></CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Assigned Service Jobs</CardTitle>
          <CardDescription>Your current and upcoming service assignments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockServiceJobs.map(job => (
            <div key={job.id} className="p-3 border rounded-md bg-background hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/products/${job.productId}`} className="font-medium text-primary hover:underline">{job.productName} ({job.productId})</Link>
                  <p className="text-sm text-muted-foreground">{job.issue}</p>
                </div>
                <Badge variant={job.status === 'Completed' ? 'default' : job.status === 'In Progress' ? 'outline' : 'secondary'}
                  className={job.status === 'Completed' ? 'bg-green-100 text-green-700' : job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}
                >
                  {job.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}
              </p>
            </div>
          ))}
          {mockServiceJobs.length === 0 && <p className="text-muted-foreground">No service jobs currently assigned.</p>}
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} passHref legacyBehavior>
              <a className="block">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/10">
                  <action.icon className="mr-3 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                  <div>
                    <p className="font-medium group-hover:text-accent transition-colors">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              </a>
            </Link>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};

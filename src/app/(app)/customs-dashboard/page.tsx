
// --- File: page.tsx (Customs & Compliance Dashboard) ---
// Description: Dashboard for customs officers and compliance managers to track products and alerts.
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, AlertTriangle, ShieldCheck, Package, CheckCircle, Clock, Truck, Ship, Plane, ScanLine, FileText, CalendarDays } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const mockTransitProducts = [
  { id: "PROD789", name: "Smart Thermostat G3", stage: "Approaching EU Border (Hamburg)", eta: "2024-08-10", dppStatus: "Compliant", transport: "Ship" },
  { id: "PROD456", name: "Organic Cotton Sheets", stage: "At Customs (Rotterdam)", eta: "2024-08-05", dppStatus: "Pending Documentation", transport: "Ship" },
  { id: "PROD123", name: "EV Battery Module XM5", stage: "Cleared - Inland Transit", eta: "2024-08-02", dppStatus: "Compliant", transport: "Truck" },
  { id: "PROD101", name: "Luxury Handbags Batch B", stage: "Flagged for Inspection (CDG Airport)", eta: "2024-08-03", dppStatus: "Issue - Discrepancy", transport: "Plane"},
];

const mockCustomsAlerts = [
  { id: "ALERT001", productId: "PROD101", message: "Flagged at CDG Airport - Potential counterfeit. Physical inspection scheduled.", severity: "High", timestamp: "2 hours ago" },
  { id: "ALERT002", productId: "PROD456", message: "Awaiting CBAM declaration for steel components. Shipment delayed at Rotterdam.", severity: "Medium", timestamp: "1 day ago" },
  { id: "ALERT003", productId: "PROD999", message: "Random spot check selected for agricultural products. Expected delay: 48h.", severity: "Low", timestamp: "3 days ago" },
];

const mockInspectionTimeline = [
  { id: "event1", icon: Ship, title: "Arrival at EU Border (Hamburg Port)", timestamp: "Aug 10, 2024 - 07:30 CET", description: "Container #C789XYZ unloaded from vessel 'Sea Serpent'.", status: "Completed" },
  { id: "event2", icon: ScanLine, title: "Initial Customs Scan & DPP Check", timestamp: "Aug 10, 2024 - 08:15 CET", description: "Automated scan of container. DPP data for PROD789 retrieved and verified.", status: "Completed" },
  { id: "event3", icon: FileText, title: "Documentation Review", timestamp: "Aug 10, 2024 - 09:00 CET", description: "Import declarations and CBAM certificate cross-referenced with DPP.", status: "Completed" },
  { id: "event4", icon: AlertTriangle, title: "Random Physical Inspection Selected", timestamp: "Aug 10, 2024 - 10:30 CET", description: "Batch selected for routine physical check due to product category.", status: "Action Required", badgeVariant: "outline" as "outline" | "default" | "destructive" | "secondary" | null | undefined },
  { id: "event5", icon: CheckCircle, title: "Inspection Complete & Cleared", timestamp: "Aug 10, 2024 - 14:00 CET", description: "Physical inspection passed. Product cleared for entry into EU market.", status: "Completed", badgeVariant: "default" as "outline" | "default" | "destructive" | "secondary" | null | undefined },
  { id: "event6", icon: Truck, title: "Released for Inland Transit", timestamp: "Aug 10, 2024 - 15:30 CET", description: "Product released to logistics partner for final delivery.", status: "Upcoming" },
];

const MetricCardWidget: React.FC<{title: string, value: string | number, icon: React.ElementType, description?: string}> = ({ title, value, icon: Icon, description }) => (
    <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

export default function CustomsDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Customs & Compliance Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCardWidget title="Shipments in Transit (EU)" value="132" icon={Truck} description="+5 from last hour" />
        <MetricCardWidget title="Products at Customs (EU Ports/Airports)" value="27" icon={Ship} description="3 new arrivals" />
        <MetricCardWidget title="Overall DPP Compliance Rate" value="92%" icon={ShieldCheck} description="Target: 95%" />
        <MetricCardWidget title="Products Flagged for Inspection" value="5" icon={AlertTriangle} description="2 critical issues" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Products in Transit / At Customs</CardTitle>
          <CardDescription>Overview of products currently moving towards or within the EU customs territory.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Transport</TableHead>
                <TableHead>Est. Arrival / Clearance</TableHead>
                <TableHead>DPP Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransitProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.stage}</TableCell>
                  <TableCell className="capitalize flex items-center">
                    {product.transport === "Ship" && <Ship className="h-4 w-4 mr-1.5 text-blue-500" />}
                    {product.transport === "Truck" && <Truck className="h-4 w-4 mr-1.5 text-orange-500" />}
                    {product.transport === "Plane" && <Plane className="h-4 w-4 mr-1.5 text-purple-500" />}
                    {product.transport}
                  </TableCell>
                  <TableCell>{product.eta}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.dppStatus === "Compliant" ? "default" :
                        product.dppStatus === "Pending Documentation" ? "outline" :
                        "destructive"
                      }
                      className={cn(
                        product.dppStatus === "Compliant" ? "bg-green-100 text-green-700 border-green-300" :
                        product.dppStatus === "Pending Documentation" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                        "bg-red-100 text-red-700 border-red-300"
                      )}
                    >
                      {product.dppStatus === "Compliant" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {product.dppStatus === "Pending Documentation" && <Clock className="mr-1 h-3 w-3" />}
                      {product.dppStatus !== "Compliant" && product.dppStatus !== "Pending Documentation" && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {product.dppStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary"/>Customs Inspection Timeline (Example: PROD789)</CardTitle>
            <CardDescription>Chronological overview of a product's journey through customs.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mockInspectionTimeline.map((event) => {
                let badgeColorClass = "";
                if (event.status === "Completed" && event.badgeVariant === "default") badgeColorClass = "bg-green-100 text-green-700 border-green-300";
                else if (event.status === "Action Required") badgeColorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
                else if (event.status === "Upcoming") badgeColorClass = "bg-blue-100 text-blue-700 border-blue-300";

                return (
                  <li key={event.id} className="flex items-start space-x-3 p-3 border rounded-md bg-background hover:bg-muted/30">
                    <event.icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-foreground">{event.title}</p>
                        {event.status && (
                           <Badge variant={event.badgeVariant || "secondary"} className={cn(badgeColorClass, "text-xs")}>
                             {event.status}
                           </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                      <p className="text-sm text-foreground/80 mt-1">{event.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-1">
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary"/>DPP Compliance Overview</CardTitle>
                <CardDescription>Breakdown of products by their Digital Product Passport compliance status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span>Compliant</span>
                    <span>750 (85%)</span>
                </div>
                <Progress value={85} className="h-2.5 [&>div]:bg-green-500" />
                </div>
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span>Pending Review/Data</span>
                    <span>80 (9%)</span>
                </div>
                <Progress value={9} className="h-2.5 [&>div]:bg-yellow-500" />
                </div>
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span>Issues / Non-Compliant</span>
                    <span>50 (6%)</span>
                </div>
                <Progress value={6} className="h-2.5 [&>div]:bg-red-500" />
                </div>
                <p className="text-xs text-muted-foreground pt-2">Note: This is a static mock representation. A real chart would be interactive.</p>
            </CardContent>
            </Card>

            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Customs Inspection Alerts</CardTitle>
                <CardDescription>Products currently flagged or requiring attention at customs.</CardDescription>
            </CardHeader>
            <CardContent>
                {mockCustomsAlerts.length > 0 ? (
                <ul className="space-y-3">
                    {mockCustomsAlerts.map((alert) => (
                    <li key={alert.id} className="p-3 border rounded-md bg-background hover:bg-muted/30">
                        <div className="flex justify-between items-start">
                        <p className="font-medium text-sm text-foreground">{alert.productId}: {alert.message}</p>
                        <Badge variant={alert.severity === "High" ? "destructive" : alert.severity === "Medium" ? "outline" : "secondary"} className={cn(
                            alert.severity === "High" ? "bg-red-100 text-red-700 border-red-300" : "",
                            alert.severity === "Medium" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "",
                            alert.severity === "Low" ? "bg-blue-100 text-blue-700 border-blue-300" : ""
                        )}>
                            {alert.severity}
                        </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-sm text-muted-foreground">No active customs alerts.</p>
                )}
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    
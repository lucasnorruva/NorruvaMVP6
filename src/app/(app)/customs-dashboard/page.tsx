
// --- File: page.tsx (Customs & Compliance Dashboard) ---
// Description: Dashboard for customs officers and compliance managers to track products and alerts.
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, AlertTriangle, ShieldCheck, Package, CheckCircle, Clock, Truck, Ship, Plane, ScanLine, FileText, CalendarDays, Anchor, Warehouse, ArrowUp, ArrowDown, MinusCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const mockTransitProducts = [
  { id: "PROD789", name: "Smart Thermostat G3", stage: "Approaching EU Border (Hamburg)", eta: "2024-08-10", dppStatus: "Compliant", transport: "Ship", origin: "Shanghai, CN", destination: "Munich, DE" },
  { id: "PROD456", name: "Organic Cotton Sheets", stage: "At Customs (Rotterdam)", eta: "2024-08-05", dppStatus: "Pending Documentation", transport: "Ship", origin: "Mumbai, IN", destination: "Paris, FR" },
  { id: "PROD123", name: "EV Battery Module XM5", stage: "Cleared - Inland Transit", eta: "2024-08-02", dppStatus: "Compliant", transport: "Truck", origin: "Gdansk, PL", destination: "Berlin, DE" },
  { id: "PROD101", name: "Luxury Handbags Batch B", stage: "Flagged for Inspection (CDG Airport)", eta: "2024-08-03", dppStatus: "Issue - Discrepancy", transport: "Plane", origin: "Milan, IT", destination: "New York, US (Transit EU)"},
  { id: "PROD222", name: "Pharmaceutical Batch Z", stage: "Awaiting Final Clearance (FRA Airport)", eta: "2024-08-06", dppStatus: "Compliant", transport: "Plane", origin: "Zurich, CH", destination: "London, UK"},
  { id: "PROD333", name: "Industrial Machinery Parts", stage: "Customs Declaration Submitted", eta: "2024-08-12", dppStatus: "Pending Review", transport: "Truck", origin: "Prague, CZ", destination: "Madrid, ES"},
  // Example of an overdue ETA for testing
  { id: "PROD800", name: "Vintage Electronics Lot", stage: "Delayed at Customs (Antwerp)", eta: "2024-07-25", dppStatus: "Issue - Valuation Query", transport: "Ship", origin: "Hong Kong, HK", destination: "Brussels, BE" },
  // Example of an ETA for today for testing
  { id: "PROD801", name: "Fresh Flowers Batch", stage: "Arrived at Airport (AMS)", eta: new Date().toISOString().split('T')[0], dppStatus: "Pending Inspection", transport: "Plane", origin: "Nairobi, KE", destination: "Amsterdam, NL" },
];

const mockCustomsAlerts = [
  { id: "ALERT001", productId: "PROD101", message: "Flagged at CDG Airport - Potential counterfeit. Physical inspection scheduled.", severity: "High", timestamp: "2 hours ago", regulation: "Anti-Counterfeiting" },
  { id: "ALERT002", productId: "PROD456", message: "Awaiting CBAM declaration for steel components. Shipment delayed at Rotterdam.", severity: "Medium", timestamp: "1 day ago", regulation: "CBAM" },
  { id: "ALERT003", productId: "PROD999", message: "Random spot check selected for agricultural products (Batch AGR088). Expected delay: 48h.", severity: "Low", timestamp: "3 days ago", regulation: "SPS Measures" },
  { id: "ALERT004", productId: "PROD333", message: "Incomplete safety certification for machinery parts. Documentation required.", severity: "Medium", timestamp: "5 hours ago", regulation: "Machinery Directive"},
];

const mockInspectionTimeline = [
  { id: "event1", icon: Ship, title: "Arrival at EU Border (Hamburg Port)", timestamp: "Aug 10, 2024 - 07:30 CET", description: "Container #C789XYZ unloaded from vessel 'MS Sea Serpent'. Initial manifest check.", status: "Completed" },
  { id: "event2", icon: ScanLine, title: "Initial Customs Scan & DPP Check", timestamp: "Aug 10, 2024 - 08:15 CET", description: "Automated scan of container. DPP data for PROD789 retrieved and verified via Norruva API.", status: "Completed" },
  { id: "event3", icon: FileText, title: "Documentation Review (CBAM, Safety Certs)", timestamp: "Aug 10, 2024 - 09:00 CET", description: "Import declarations, CBAM certificate, and product safety certifications cross-referenced with DPP. All documents present.", status: "Completed" },
  { id: "event4", icon: AlertTriangle, title: "Random Physical Inspection Selected", timestamp: "Aug 10, 2024 - 10:30 CET", description: "Batch selected for routine physical check due to product category (Smart Home Electronics). Product integrity and markings to be verified.", status: "Action Required", badgeVariant: "outline" as "outline" | "default" | "destructive" | "secondary" | null | undefined },
  { id: "event5", icon: CheckCircle, title: "Inspection Complete & Cleared", timestamp: "Aug 10, 2024 - 14:00 CET", description: "Physical inspection passed. No discrepancies found. Product cleared for entry into EU market.", status: "Completed", badgeVariant: "default" as "outline" | "default" | "destructive" | "secondary" | null | undefined },
  { id: "event6", icon: Truck, title: "Released for Inland Transit", timestamp: "Aug 10, 2024 - 15:30 CET", description: "Product released to logistics partner 'EuroTrans GmbH' for final delivery to warehouse in Munich.", status: "Upcoming" },
  { id: "event7", icon: Warehouse, title: "Arrival at Destination Warehouse", timestamp: "Aug 11, 2024 - 09:00 CET (Est.)", description: "Expected arrival at the Munich distribution center.", status: "Upcoming"},
];

const MetricCardWidget: React.FC<{title: string, value: string | number, icon: React.ElementType, description?: string, trend?: string, trendDirection?: 'up' | 'down' | 'neutral'}> = ({ title, value, icon: Icon, description, trend, trendDirection }) => {
  let TrendIconComponent = MinusCircle;
  let trendColor = "text-muted-foreground";

  if (trendDirection === "up") {
    TrendIconComponent = ArrowUp;
    trendColor = "text-success";
  } else if (trendDirection === "down") {
    TrendIconComponent = ArrowDown;
    trendColor = "text-danger";
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {trend && (
              <p className={cn("text-xs mt-1 flex items-center", trendColor)}>
                <TrendIconComponent className="h-3.5 w-3.5 mr-1" />
                {trend}
              </p>
            )}
        </CardContent>
    </Card>
  );
};

export default function CustomsDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Customs & Compliance Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCardWidget title="Shipments in Transit (EU)" value="132" icon={Truck} description="Active customs entries" trend="+5 from last hour" trendDirection="up" />
        <MetricCardWidget title="Products at Customs Checkpoints" value="27" icon={Anchor} description="Ports, Airports, Land Borders" trend="+3 new arrivals" trendDirection="up" />
        <MetricCardWidget title="Overall DPP Compliance Rate" value="92%" icon={ShieldCheck} description="For incoming goods" trend="-1% vs last week" trendDirection="down" />
        <MetricCardWidget title="Products Flagged for Inspection" value="5" icon={AlertTriangle} description="2 critical issues pending" trend="No change" trendDirection="neutral" />
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
                <TableHead>Origin &rarr; Dest.</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>DPP Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransitProducts.map((product) => {
                const etaDate = new Date(product.eta);
                const today = new Date();
                today.setHours(0, 0, 0, 0); 
                const isEtaPast = etaDate < today;
                const isEtaToday = etaDate.toDateString() === today.toDateString();

                return (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.stage}</TableCell>
                    <TableCell className="capitalize flex items-center">
                      {product.transport === "Ship" && <Ship className="h-4 w-4 mr-1.5 text-blue-500" />}
                      {product.transport === "Truck" && <Truck className="h-4 w-4 mr-1.5 text-orange-500" />}
                      {product.transport === "Plane" && <Plane className="h-4 w-4 mr-1.5 text-purple-500" />}
                      {product.transport}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{product.origin} &rarr; {product.destination}</TableCell>
                    <TableCell>
                      {isEtaPast ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Overdue: {etaDate.toLocaleDateString()}
                        </Badge>
                      ) : isEtaToday ? (
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                          <Clock className="mr-1 h-3 w-3" />
                          Due Today: {etaDate.toLocaleDateString()}
                        </Badge>
                      ) : (
                        etaDate.toLocaleDateString()
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.dppStatus === "Compliant" ? "default" :
                          product.dppStatus === "Pending Documentation" || product.dppStatus === "Pending Review" ? "outline" :
                          "destructive"
                        }
                        className={cn(
                          "text-xs",
                          product.dppStatus === "Compliant" ? "bg-green-100 text-green-700 border-green-300" :
                          product.dppStatus === "Pending Documentation" || product.dppStatus === "Pending Review" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                          "bg-red-100 text-red-700 border-red-300" 
                        )}
                      >
                        {product.dppStatus === "Compliant" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {(product.dppStatus === "Pending Documentation" || product.dppStatus === "Pending Review") && <Clock className="mr-1 h-3 w-3" />}
                        {product.dppStatus.startsWith("Issue") && <AlertTriangle className="mr-1 h-3 w-3" />}
                        {product.dppStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary"/>Customs Inspection Timeline (Example: PROD789 - Smart Thermostat G3)</CardTitle>
            <CardDescription>Chronological overview of a product's conceptual journey through customs.</CardDescription>
          </CardHeader>
          <CardContent className="pr-2">
            <ul className="space-y-3 max-h-[450px] overflow-y-auto">
              {mockInspectionTimeline.map((event) => {
                let badgeColorClass = "bg-muted text-muted-foreground";
                if (event.status === "Completed" && event.badgeVariant === "default") badgeColorClass = "bg-green-100 text-green-700 border-green-300";
                else if (event.status === "Completed") badgeColorClass = "bg-green-100 text-green-700 border-green-300";
                else if (event.status === "Action Required") badgeColorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
                else if (event.status === "Upcoming") badgeColorClass = "bg-blue-100 text-blue-700 border-blue-300";
                
                return (
                  <li key={event.id} className="flex items-start space-x-3 p-3.5 border rounded-md bg-background hover:bg-muted/30 transition-colors shadow-sm">
                    <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", badgeColorClass.split(' ')[0])}>
                      <event.icon className={cn("h-4 w-4", badgeColorClass.split(' ')[1])} />
                    </div>
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
                <CardDescription>Breakdown of incoming products by DPP compliance status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-foreground">Compliant DPPs</span>
                    <span className="font-semibold text-green-600">750 (85%)</span>
                </div>
                <Progress value={85} className="h-2.5 [&>div]:bg-green-500" aria-label="85% Compliant DPPs"/>
                </div>
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-foreground">Pending Review/Data</span>
                    <span className="font-semibold text-yellow-600">80 (9%)</span>
                </div>
                <Progress value={9} className="h-2.5 [&>div]:bg-yellow-500" aria-label="9% Pending Review/Data"/>
                </div>
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-foreground">Issues / Non-Compliant</span>
                    <span className="font-semibold text-red-600">50 (6%)</span>
                </div>
                <Progress value={6} className="h-2.5 [&>div]:bg-red-500" aria-label="6% Issues/Non-Compliant"/>
                </div>
                <p className="text-xs text-muted-foreground pt-2">Note: This is a static mock representation.</p>
            </CardContent>
            </Card>

            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>
                    Customs Inspection Alerts
                    {mockCustomsAlerts.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                            {mockCustomsAlerts.length}
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>Products currently flagged or requiring attention at customs.</CardDescription>
            </CardHeader>
            <CardContent>
                {mockCustomsAlerts.length > 0 ? (
                <ul className="space-y-3 max-h-[200px] overflow-y-auto">
                    {mockCustomsAlerts.map((alert) => (
                    <li key={alert.id} className="p-3 border rounded-md bg-background hover:bg-muted/30">
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-sm text-foreground">Product ID: {alert.productId}</p>
                            <Badge variant={alert.severity === "High" ? "destructive" : alert.severity === "Medium" ? "outline" : "secondary"} className={cn(
                                "text-xs",
                                alert.severity === "High" ? "bg-red-100 text-red-700 border-red-300" : "",
                                alert.severity === "Medium" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "",
                                alert.severity === "Low" ? "bg-blue-100 text-blue-700 border-blue-300" : ""
                            )}>
                                {alert.severity}
                            </Badge>
                        </div>
                        <p className="text-sm text-foreground/90">{alert.message}</p>
                        <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                           <span>{alert.timestamp}</span>
                           <span>Regulation: {alert.regulation}</span>
                        </div>
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
    

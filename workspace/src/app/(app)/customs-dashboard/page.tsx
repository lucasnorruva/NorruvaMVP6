
// --- File: page.tsx (Customs & Compliance Dashboard) ---
// Description: Dashboard for customs officers and compliance managers to track products and alerts.
"use client";

import React from 'react'; // Added React import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, AlertTriangle, ShieldCheck, Package, CheckCircle, Clock, Truck, Ship, Plane, ScanLine, FileText, CalendarDays, Anchor, Warehouse, ArrowUp, ArrowDown, MinusCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSearchParams } from 'next/navigation';
import { MOCK_TRANSIT_PRODUCTS, MOCK_CUSTOMS_ALERTS } from '@/data';
import type { TransitProduct, CustomsAlert } from '@/types/dpp';
import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses } from "@/utils/dppDisplayUtils"; // Import utils

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
  const searchParams = useSearchParams();
  const countryParam = searchParams.get('country');
  const country = countryParam ? decodeURIComponent(countryParam) : null;

  const filteredProducts = country
    ? MOCK_TRANSIT_PRODUCTS.filter(p =>
        p.origin.toLowerCase().includes(country.toLowerCase()) ||
        p.destination.toLowerCase().includes(country.toLowerCase())
      )
    : MOCK_TRANSIT_PRODUCTS;

  const filteredAlerts = country
    ? MOCK_CUSTOMS_ALERTS.filter(alert => {
        const prod = MOCK_TRANSIT_PRODUCTS.find(p => p.id === alert.productId);
        return prod
          ? prod.origin.toLowerCase().includes(country.toLowerCase()) ||
              prod.destination.toLowerCase().includes(country.toLowerCase())
          : false;
      })
    : MOCK_CUSTOMS_ALERTS;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Customs & Compliance Dashboard</h1>
      {country && (
        <p className="text-sm text-muted-foreground">
          Filtered by country: <Badge className="ml-1" variant="outline">{country}</Badge>
        </p>
      )}

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
              {filteredProducts.map((product) => {
                const etaDate = new Date(product.eta);
                const today = new Date();
                today.setHours(0, 0, 0, 0); 
                const isEtaPast = etaDate < today;
                const isEtaToday = etaDate.toDateString() === today.toDateString();
                
                // Use dppDisplayUtils for status badge
                const DppStatusIcon = getStatusIcon(product.dppStatus);
                const dppStatusBadgeVariant = getStatusBadgeVariant(product.dppStatus);
                const dppStatusClasses = getStatusBadgeClasses(product.dppStatus);
                const formattedDppStatus = product.dppStatus
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, char => char.toUpperCase());


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
                        variant={dppStatusBadgeVariant}
                        className={cn("text-xs capitalize", dppStatusClasses)}
                      >
                        {React.cloneElement(DppStatusIcon, {className: "mr-1 h-3 w-3"})}
                        {formattedDppStatus}
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
            {/* MOCK_INSPECTION_TIMELINE related code was removed. If needed, re-add MOCK_INSPECTION_TIMELINE data and loop here. */}
             <p className="text-sm text-muted-foreground">Example inspection timeline would be displayed here.</p>
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
                    {filteredAlerts.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                            {filteredAlerts.length}
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>Products currently flagged or requiring attention at customs.</CardDescription>
            </CardHeader>
            <CardContent>
                {filteredAlerts.length > 0 ? (
                <ul className="space-y-3 max-h-[200px] overflow-y-auto">
                    {filteredAlerts.map((alert) => (
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
    

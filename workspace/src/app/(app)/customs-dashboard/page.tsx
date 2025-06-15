
// --- File: page.tsx (Customs & Compliance Dashboard) ---
// Description: Dashboard for customs officers and compliance managers to track products and alerts.
"use client";

import React, { useState, useEffect, useCallback } from 'react'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, AlertTriangle, ShieldCheck, Package, CheckCircle, Clock, Truck, Ship, Plane, ScanLine, FileText, CalendarDays, Anchor, Warehouse, ArrowUp, ArrowDown, MinusCircle, Eye, Globe } from "lucide-react"; // Added Globe
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSearchParams } from 'next/navigation';
import { MOCK_TRANSIT_PRODUCTS, MOCK_CUSTOMS_ALERTS, MOCK_DPPS } from '@/data'; // Import from central data index
import type { TransitProduct, CustomsAlert, InspectionEvent, DigitalProductPassport } from '@/types/dpp'; 
import SelectedProductCustomsInfoCard from '@/components/dpp-tracker/SelectedProductCustomsInfoCard'; 
import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses } from "@/utils/dppDisplayUtils"; 

const MetricCardWidget: React.FC<{title: string, value: string | number, icon: React.ElementType, description?: string, trend?: string, trendDirection?: 'up' | 'down' | 'neutral'}> = ({ title, value, icon: Icon, description, trend, trendDirection }) => {
  let TrendIconComponent = MinusCircle;
  let trendColor = "text-muted-foreground";

  if (trendDirection === "up") {
    TrendIconComponent = ArrowUp;
    trendColor = "text-green-600"; // Use Tailwind success color
  } else if (trendDirection === "down") {
    TrendIconComponent = ArrowDown;
    trendColor = "text-red-600"; // Use Tailwind danger color
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

const generateMockInspectionTimelineForProduct = (product: TransitProduct, dpp?: DigitalProductPassport): InspectionEvent[] => {
  const timeline: InspectionEvent[] = [];
  const etaDate = new Date(product.eta);

  const addEvent = (baseTimestamp: Date, offsetDays: number, title: string, description: string, icon: React.ElementType, status: InspectionEvent['status'], badgeVariant?: InspectionEvent['badgeVariant']) => {
    const eventDate = new Date(baseTimestamp);
    eventDate.setDate(baseTimestamp.getDate() + offsetDays);
    timeline.push({
      id: `evt-${product.id}-${title.replace(/\s+/g, '')}-${Math.random().toString(36).substring(7)}`,
      icon, title, timestamp: eventDate.toISOString(), description, status, badgeVariant
    });
  };
  
  addEvent(etaDate, -5, `Departure from ${product.origin.split(',')[1] || product.origin}`, `Shipment left origin. Transport: ${product.transport}`, product.transport === "Ship" ? Ship : product.transport === "Truck" ? Truck : Plane, "Completed");
  if(product.stage.toLowerCase().includes("approaching")) {
    addEvent(etaDate, -1, `Approaching EU Border (${product.stage.split('(')[1]?.split(')')[0] || 'Entry Port'})`, `Shipment nearing EU.`, product.transport === "Ship" ? Ship : product.transport === "Truck" ? Truck : Plane, "In Progress");
  }
  addEvent(etaDate, 0, `Arrival at EU Border (${product.stage.split('(')[1]?.split(')')[0] || 'Entry Port'})`, `Product arrived. Current Stage: ${product.stage}`, Anchor, product.stage.toLowerCase().includes("cleared") || product.stage.toLowerCase().includes("arrived") ? "Completed" : "In Progress");
  addEvent(etaDate, 0, "Initial Customs Scan & DPP Check", `Automated scan. DPP Status: ${product.dppStatus}.`, ScanLine, "Completed");
  addEvent(etaDate, 0, "Documentation Review", `Import declarations and compliance documents checked.`, FileText, "Completed");

  const isCbamRelevant = dpp?.compliance?.euCustomsData?.cbamGoodsIdentifier || ["Automotive Parts", "Construction Materials"].includes(product.category || dpp?.category || "");
  if (isCbamRelevant) {
    const cbamStatus = dpp?.compliance?.euCustomsData?.status?.toLowerCase().includes('cbam') ? dpp.compliance.euCustomsData.status : 'Pending CBAM Check';
    addEvent(etaDate, 1, "CBAM Declaration Verification", `Status: ${cbamStatus}. Identifier: ${dpp?.compliance?.euCustomsData?.cbamGoodsIdentifier || 'N/A'}`, Globe, cbamStatus.includes('Pending') ? "Action Required" : "Completed", cbamStatus.includes('Pending') ? "outline" : "default");
  }

  if (product.dppStatus === 'Pending Review' || product.dppStatus === 'Non-Compliant' || product.id === "PROD789") {
    addEvent(etaDate, isCbamRelevant ? 2 : 1, "Flagged for Physical Inspection", `Reason: ${product.dppStatus === 'Non-Compliant' ? 'DPP Discrepancy' : product.dppStatus === 'Pending Review' ? 'Incomplete Data' : 'Random Check'}.`, AlertTriangle, "Action Required", "outline");
    addEvent(etaDate, isCbamRelevant ? 3 : 2, "Physical Inspection Complete", `Results: ${product.dppStatus === 'Non-Compliant' ? 'Minor issues, report filed.' : 'Passed.'}`, CheckCircle, "Completed", product.dppStatus === 'Non-Compliant' ? "destructive" : "default");
  }

  const clearanceOffset = (product.dppStatus === 'Pending Review' || product.dppStatus === 'Non-Compliant' || product.id === "PROD789") ? (isCbamRelevant ? 4 : 3) : (isCbamRelevant ? 2 : 1);
  addEvent(etaDate, clearanceOffset, "Customs Clearance Granted", `Product cleared for entry into EU market.`, ShieldCheck, "Completed", "default");
  addEvent(etaDate, clearanceOffset, `Released for Inland Transit to ${product.destination.split(',')[0]}`, `Released to logistics partner.`, Truck, "In Progress");
  addEvent(etaDate, clearanceOffset + 2, `Arrival at Destination Warehouse (${product.destination.split(',')[0]})`, `Expected delivery.`, Warehouse, "Upcoming");
  
  timeline.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return timeline;
};

export default function CustomsDashboardPage() {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get('country');
  const country = countryParam ? decodeURIComponent(countryParam) : null;
  const [selectedProductForTimeline, setSelectedProductForTimeline] = useState<TransitProduct | null>(null);
  const [dynamicInspectionTimeline, setDynamicInspectionTimeline] = useState<InspectionEvent[]>([]);

  const filteredProducts = country
    ? MOCK_TRANSIT_PRODUCTS.filter(p =>
        (p.origin.toLowerCase().includes(country.toLowerCase()) ||
        p.destination.toLowerCase().includes(country.toLowerCase()))
      )
    : MOCK_TRANSIT_PRODUCTS;

  const filteredAlerts = country
    ? MOCK_CUSTOMS_ALERTS.filter(alert => {
        const prod = MOCK_TRANSIT_PRODUCTS.find(p => p.id === alert.productId);
        return prod
          ? (prod.origin.toLowerCase().includes(country.toLowerCase()) ||
              prod.destination.toLowerCase().includes(country.toLowerCase()))
          : false;
      })
    : MOCK_CUSTOMS_ALERTS;

  const handleViewTimeline = useCallback((product: TransitProduct) => {
    setSelectedProductForTimeline(product);
    const dpp = MOCK_DPPS.find(d => d.id === product.id);
    setDynamicInspectionTimeline(generateMockInspectionTimelineForProduct(product, dpp));
  }, []);

  useEffect(() => {
    if (!selectedProductForTimeline && filteredProducts.length > 0) {
      // Optionally auto-select first product
      // handleViewTimeline(filteredProducts[0]);
    } else if (selectedProductForTimeline && !filteredProducts.find(p => p.id === selectedProductForTimeline.id)) {
      setSelectedProductForTimeline(null);
      setDynamicInspectionTimeline([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Customs & Compliance Dashboard</h1>
      {country && (
        <p className="text-sm text-muted-foreground">
          Filtered by country: <Badge className="ml-1" variant="outline">{country}</Badge>
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5"> {/* Adjusted for 5 metrics */}
        <MetricCardWidget title="Shipments in Transit (EU)" value="132" icon={Truck} description="Active customs entries" trend="+5 from last hour" trendDirection="up" />
        <MetricCardWidget title="Products at Customs Checkpoints" value="27" icon={Anchor} description="Ports, Airports, Land Borders" trend="+3 new arrivals" trendDirection="up" />
        <MetricCardWidget title="Overall DPP Compliance Rate" value="92%" icon={ShieldCheck} description="For incoming goods" trend="-1% vs last week" trendDirection="down" />
        <MetricCardWidget title="Products Under CBAM Review" value="18" icon={Globe} description="Steel, Aluminium, Cement etc." trend="+2 new" trendDirection="up" />
        <MetricCardWidget title="Flagged for Inspection" value="5" icon={AlertTriangle} description="2 critical issues pending" trend="No change" trendDirection="neutral" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Products in Transit / At Customs</CardTitle>
          <CardDescription>Overview of products. Click "View Timeline" for details. CBAM relevant products are indicated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>CBAM Status / ID</TableHead> {/* New Column */}
                <TableHead>Current Stage</TableHead>
                <TableHead>Transport</TableHead>
                <TableHead>Origin &rarr; Dest.</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>DPP Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const etaDate = new Date(product.eta);
                const today = new Date();
                today.setHours(0, 0, 0, 0); 
                const isEtaPast = etaDate < today;
                const isEtaToday = etaDate.toDateString() === today.toDateString();
                
                const DppStatusIcon = getStatusIcon(product.dppStatus);
                const dppStatusBadgeVariant = getStatusBadgeVariant(product.dppStatus);
                const dppStatusClasses = getStatusBadgeClasses(product.dppStatus);
                const formattedDppStatus = product.dppStatus.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

                const dppEntry = MOCK_DPPS.find(d => d.id === product.id);
                const cbamIdentifier = dppEntry?.compliance?.euCustomsData?.cbamGoodsIdentifier;
                const isCbamCatRelevant = ["Automotive Parts", "Construction Materials"].includes(product.category || dppEntry?.category || "");
                const cbamStatusText = dppEntry?.compliance?.euCustomsData?.status;

                return (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-xs">
                      {cbamIdentifier ? (
                        <Badge variant="secondary" className="font-mono bg-blue-100 text-blue-700 border-blue-300">ID: {cbamIdentifier}</Badge>
                      ) : isCbamCatRelevant ? (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">Review for CBAM</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                      {cbamStatusText && cbamStatusText.toLowerCase().includes('cbam') && <Badge variant="outline" className="ml-1 mt-1">{cbamStatusText}</Badge>}
                    </TableCell>
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
                        <Badge variant="destructive" className="text-xs"><AlertTriangle className="mr-1 h-3 w-3" />Overdue: {etaDate.toLocaleDateString()}</Badge>
                      ) : isEtaToday ? (
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300"><Clock className="mr-1 h-3 w-3" />Due Today: {etaDate.toLocaleDateString()}</Badge>
                      ) : ( etaDate.toLocaleDateString() )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={dppStatusBadgeVariant} className={cn("text-xs capitalize", dppStatusClasses)}>
                        {React.cloneElement(DppStatusIcon, {className: "mr-1 h-3 w-3"})}
                        {formattedDppStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewTimeline(product)}><Eye className="mr-1 h-4 w-4" /> Timeline</Button>
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
            <CardTitle className="font-headline flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary"/>Customs Inspection Timeline {selectedProductForTimeline ? `for ${selectedProductForTimeline.name} (${selectedProductForTimeline.id})` : "(Select a Product)"}</CardTitle>
            <CardDescription>Chronological overview of a product's conceptual journey through customs.</CardDescription>
          </CardHeader>
          <CardContent className="pr-2">
            {selectedProductForTimeline ? (
              <ul className="space-y-3 max-h-[450px] overflow-y-auto">
                {dynamicInspectionTimeline.map((event) => {
                  let badgeColorClass = "bg-muted text-muted-foreground";
                  if (event.status === "Completed" && event.badgeVariant === "default") badgeColorClass = "bg-green-100 text-green-700 border-green-300";
                  else if (event.status === "Completed") badgeColorClass = "bg-green-100 text-green-700 border-green-300";
                  else if (event.status === "Action Required" || event.status === "Delayed") badgeColorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
                  else if (event.status === "In Progress") badgeColorClass = "bg-blue-100 text-blue-700 border-blue-300";
                  else if (event.status === "Upcoming") badgeColorClass = "bg-gray-100 text-gray-700 border-gray-300";
                  
                  return (
                    <li key={event.id} className="flex items-start space-x-3 p-3.5 border rounded-md bg-background hover:bg-muted/30 transition-colors shadow-sm">
                      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", badgeColorClass.split(' ')[0])}><event.icon className={cn("h-4 w-4", badgeColorClass.split(' ')[1])} /></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center"><p className="font-medium text-foreground">{event.title}</p>{event.status && (<Badge variant={event.badgeVariant || "secondary"} className={cn(badgeColorClass, "text-xs")}>{event.status}</Badge>)}</div>
                        <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                        <p className="text-sm text-foreground/80 mt-1">{event.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : ( <p className="text-sm text-muted-foreground text-center py-10">Select a product from the table above to view its detailed inspection timeline.</p> )}
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-1">
            <Card className="shadow-lg">
            <CardHeader><CardTitle className="font-headline flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary"/>DPP Compliance Overview</CardTitle><CardDescription>Breakdown of incoming products by DPP compliance status.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div><div className="flex justify-between mb-1 text-sm"><span className="text-foreground">Compliant DPPs</span><span className="font-semibold text-green-600">750 (85%)</span></div><Progress value={85} className="h-2.5 [&>div]:bg-green-500" aria-label="85% Compliant DPPs"/></div>
                <div><div className="flex justify-between mb-1 text-sm"><span className="text-foreground">Pending Review/Data</span><span className="font-semibold text-yellow-600">80 (9%)</span></div><Progress value={9} className="h-2.5 [&>div]:bg-yellow-500" aria-label="9% Pending Review/Data"/></div>
                <div><div className="flex justify-between mb-1 text-sm"><span className="text-foreground">Issues / Non-Compliant</span><span className="font-semibold text-red-600">50 (6%)</span></div><Progress value={6} className="h-2.5 [&>div]:bg-red-500" aria-label="6% Issues/Non-Compliant"/></div>
                <p className="text-xs text-muted-foreground pt-2">Note: This is a static mock representation.</p>
            </CardContent>
            </Card>
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Customs Inspection Alerts{filteredAlerts.length > 0 && (<Badge variant="destructive" className="ml-2">{filteredAlerts.length}</Badge>)}</CardTitle>
                <CardDescription>Products currently flagged or requiring attention at customs.</CardDescription>
            </CardHeader>
            <CardContent>
                {filteredAlerts.length > 0 ? (
                <ul className="space-y-3 max-h-[200px] overflow-y-auto">
                    {filteredAlerts.map((alert) => (<li key={alert.id} className="p-3 border rounded-md bg-background hover:bg-muted/30"><div className="flex justify-between items-start mb-1"><p className="font-medium text-sm text-foreground">Product ID: {alert.productId}</p><Badge variant={alert.severity === "High" ? "destructive" : alert.severity === "Medium" ? "outline" : "secondary"} className={cn("text-xs", alert.severity === "High" ? "bg-red-100 text-red-700 border-red-300" : "", alert.severity === "Medium" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "", alert.severity === "Low" ? "bg-blue-100 text-blue-700 border-blue-300" : "")}>{alert.severity}</Badge></div><p className="text-sm text-foreground/90">{alert.message}</p><div className="text-xs text-muted-foreground mt-1 flex justify-between"><span>{alert.timestamp}</span><span>Regulation: {alert.regulation}</span></div></li>))}
                </ul>
                ) : ( <p className="text-sm text-muted-foreground">No active customs alerts.</p> )}
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

```
- workspace/src/app/(app)/dpp-global-tracker-v2/page.tsx:
```tsx

"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import type { GlobeMethods } from 'react-globe.gl';
import type { Feature as GeoJsonFeature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { MeshPhongMaterial } from 'three';
import { Loader2, Info, X, Package, Truck, Ship, Plane, CalendarDays, AlertTriangle } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { MOCK_DPPS } from '@/data'; 
import { MOCK_TRANSIT_PRODUCTS, MOCK_CUSTOMS_ALERTS } from '@/data'; // Corrected import
import type { TransitProduct, CustomsAlert } from '@/types/dpp'; 
import SelectedProductCustomsInfoCard from '@/components/dpp-tracker/SelectedProductCustomsInfoCard'; 


const GlobeComponent = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-white">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg text-muted-foreground">Loading Globe...</p>
    </div>
  )
});

const EU_COUNTRY_CODES = new Set([
  'AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 
  'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 
  'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE'
]);

interface CountryProperties extends GeoJsonProperties {
  ADMIN: string; 
  ADM0_A3: string; 
  NAME_LONG?: string; 
  ISO_A3?: string; 
}

type CountryFeature = GeoJsonFeature<Geometry, CountryProperties>;

export default function GlobeV2Page() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [landPolygons, setLandPolygons] = useState<CountryFeature[]>([]);
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [arcsData, setArcsData] = useState<any[]>([]);
  
  const productIdFromQuery = searchParams.get('productId');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(productIdFromQuery); 

  const [selectedProductTransitInfo, setSelectedProductTransitInfo] = useState<TransitProduct | null>(null);
  const [selectedProductAlerts, setSelectedProductAlerts] = useState<CustomsAlert[]>([]);

  const [countryFilter, setCountryFilter] = useState<'all' | 'eu' | 'supplyChain'>('all');
  const [clickedCountryInfo, setClickedCountryInfo] = useState<CountryProperties | null>(null); 

  const HEADER_HEIGHT = 64; 

  useEffect(() => {
    if (productIdFromQuery) {
      setSelectedProduct(productIdFromQuery);
    }
  }, [productIdFromQuery]);

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth, 
          height: window.innerHeight - HEADER_HEIGHT, 
        });
      }
    };
    updateDimensions(); 
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handlePolygonClick = useCallback((feat: object) => { 
    setClickedCountryInfo((feat as CountryFeature).properties);
  }, []);

  const mockCountryCoordinates: { [key: string]: { lat: number; lng: number } } = useMemo(() => ({
    'Germany': { lat: 51.1657, lng: 10.4515 }, 'France': { lat: 46.6034, lng: 1.8883 },
    'Italy': { lat: 41.8719, lng: 12.5674 }, 'Spain': { lat: 40.4637, lng: -3.7492 },
    'Poland': { lat: 51.9194, lng: 19.1451 }, 'United States': { lat: 37.0902, lng: -95.7129 },
    'China': { lat: 35.8617, lng: 104.1954 }, 'Japan': { lat: 36.2048, lng: 138.2529 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 }, 'Canada': { lat: 56.1304, lng: -106.3468 },
    'India': { lat: 20.5937, lng: 78.9629 }, 'Netherlands': { lat: 52.1326, lng: 5.2913 },
    'Czechia': { lat: 49.8175, lng: 15.4730 }, 'Belgium': { lat: 50.5039, lng: 4.4699 },
    'Switzerland': { lat: 46.8182, lng: 8.2275}, 'Kenya': {lat: -0.0236, lng: 37.9062},
    'Vietnam': { lat: 14.0583, lng: 108.2772 }, 
    'Hong Kong': { lat: 22.3193, lng: 114.1694 }, 
    'Australia': { lat: -25.2744, lng: 133.7751 },
    'South Korea': { lat: 35.9078, lng: 127.7669 },
    'Shanghai': { lat: 31.2304, lng: 121.4737 }, // City as fallback
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Shenzhen': { lat: 22.5431, lng: 114.0579 },
    'Ho Chi Minh City': { lat: 10.8231, lng: 106.6297 },
    'Newark': { lat: 40.7357, lng: -74.1724 },
    'Gdansk': { lat: 54.372158, lng: 18.638306 },
    'Milan': { lat: 45.4642, lng: 9.1900 },
    'Zurich': { lat: 47.3769, lng: 8.5417 },
    'Prague': { lat: 50.0755, lng: 14.4378 },
    'Nairobi': { lat: -1.2921, lng: 36.8219 },
  }), []);

  const getCountryFromLocationString = (locationString: string): string | null => {
      if (!locationString) return null;
      const parts = locationString.split(',').map(p => p.trim());
      const country = parts.pop(); // Assume country is last
      // Basic check if it might be a country name or known code
      if (country && (country.length === 2 || country.length === 3 || mockCountryCoordinates[country] || EU_COUNTRY_CODES.has(country.toUpperCase()))) {
          return country;
      }
      // If it's a city name, check if we have coords for it
      if (parts.length > 0) {
          const city = parts.pop();
          if (city && mockCountryCoordinates[city]) return city; // Treat city as key if coords exist
      }
      return country || null; // Return last part as best guess if all else fails
  };

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
    )
      .then((res) => res.json())
      .then((geoJson: FeatureCollection<Geometry, CountryProperties>) => {
        setLandPolygons(geoJson.features);
      })
      .catch((err) => {
        console.error('Error fetching or processing country polygons:', err);
      })
      .finally(() => {
        setDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    setHighlightedCountries([]);
    setArcsData([]);
    setSelectedProductTransitInfo(null);
    setSelectedProductAlerts([]);
    setClickedCountryInfo(null);

    if (!selectedProduct) {
      if (globeEl.current) globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.5 }, 1000);
      return;
    }

    const transitInfo = MOCK_TRANSIT_PRODUCTS.find(p => p.id === selectedProduct);
    setSelectedProductTransitInfo(transitInfo || null);
    setSelectedProductAlerts(MOCK_CUSTOMS_ALERTS.filter(a => a.productId === selectedProduct));

    if (transitInfo) {
      const originCountry = getCountryFromLocationString(transitInfo.origin);
      const destinationCountry = getCountryFromLocationString(transitInfo.destination);
      const originCoords = originCountry ? mockCountryCoordinates[originCountry] : null;
      const destinationCoords = destinationCountry ? mockCountryCoordinates[destinationCountry] : null;

      const newHighlights: string[] = [];
      if (originCountry) newHighlights.push(originCountry);
      if (destinationCountry && destinationCountry !== originCountry) newHighlights.push(destinationCountry);
      setHighlightedCountries(newHighlights);
      
      if (originCoords && destinationCoords) {
        setArcsData([{
          startLat: originCoords.lat, startLng: originCoords.lng,
          endLat: destinationCoords.lat, endLng: destinationCoords.lng,
          color: '#3B82F6', // Blue for transit
          label: `${transitInfo.name} Transit`
        }]);
        if (globeEl.current) { // Focus view on transit arc
             const midLat = (originCoords.lat + destinationCoords.lat) / 2;
             const midLng = (originCoords.lng + destinationCoords.lng) / 2;
             globeEl.current.pointOfView({ lat: midLat, lng: midLng, altitude: 2.0 }, 1000);
        }
      } else {
        setArcsData([]);
        // If no transit arc, fall back to supply chain view or default Europe
        if (globeEl.current) globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
      }
    } else {
      // Fallback: If no transit info, fetch supply chain graph
      fetch(`/api/v1/dpp/graph/${selectedProduct}`)
        .then(res => res.ok ? res.json() : null)
        .then((graph) => {
          if (!graph || !graph.nodes) { return; }
          const countries = new Set<string>();
          let manufacturerCountry: string | null = null;
          graph.nodes.forEach((node: any) => {
            const loc: string | undefined = node.data?.location;
            if (loc) {
              const country = getCountryFromLocationString(loc);
              if (country) {
                countries.add(country);
                if (node.type === 'manufacturer') manufacturerCountry = country;
              }
            }
          });
          const supplyChainCountries = Array.from(countries);
          setHighlightedCountries(supplyChainCountries);
          
          const newSupplyArcs = [];
          if (manufacturerCountry && supplyChainCountries.length > 1) {
            const manufacturerCoords = mockCountryCoordinates[manufacturerCountry];
            if (manufacturerCoords) {
                supplyChainCountries.forEach(countryName => {
                    if (countryName !== manufacturerCountry) {
                        const supplierCoords = mockCountryCoordinates[countryName];
                        if (supplierCoords) {
                            newSupplyArcs.push({
                                startLat: manufacturerCoords.lat, startLng: manufacturerCoords.lng,
                                endLat: supplierCoords.lat, endLng: supplierCoords.lng,
                                color: '#F59E0B', // Orange for supply chain
                                label: `Supply: ${manufacturerCountry} to ${countryName}`
                            });
                        }
                    }
                });
            }
          }
          setArcsData(newSupplyArcs as any[]);
          if (globeEl.current) { // Focus view based on supply chain if any
            if (countries.has('China') || countries.has('Japan') || countries.has('India')) globeEl.current.pointOfView({ lat: 20, lng: 90, altitude: 2.5 }, 1000);
            else if (countries.has('United States') || countries.has('Canada')) globeEl.current.pointOfView({ lat: 45, lng: -90, altitude: 2.5 }, 1000);
            else globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
          }
        })
        .catch((err) => { console.error('Error fetching product graph:', err); setHighlightedCountries([]); setArcsData([]); });
    }
  }, [selectedProduct, mockCountryCoordinates]); 

  const isEU = useCallback((isoA3: string | undefined) => !!isoA3 && EU_COUNTRY_CODES.has(isoA3.toUpperCase()), []);
  
  useEffect(() => {
    if (!landPolygons.length) return;
    let filtered = landPolygons;
    if (countryFilter === 'eu') {
      filtered = landPolygons.filter(feat => isEU(feat.properties?.ADM0_A3 || feat.properties?.ISO_A3));
    } else if (countryFilter === 'supplyChain' && selectedProduct && highlightedCountries.length > 0) { 
      filtered = landPolygons.filter(feat => {
        const adminName = feat.properties?.ADMIN || feat.properties?.NAME_LONG || '';
        // Check against full country names in highlightedCountries, which now includes transit origin/dest
        return highlightedCountries.some(hc => adminName.toLowerCase().includes(hc.toLowerCase()));
      });
    }
    setFilteredLandPolygons(filtered);
  }, [countryFilter, landPolygons, highlightedCountries, isEU, selectedProduct]);

  const globeMaterial = useMemo(() => new MeshPhongMaterial({ color: '#a9d5e5', transparent: true, opacity: 1 }), []);

  useEffect(() => {
    if (globeEl.current && globeReady) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = isAutoRotating; controls.autoRotateSpeed = 0.3; 
        controls.enableZoom = true; controls.minDistance = 150; controls.maxDistance = 1000;  
      }
      if (!selectedProduct) globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
    }
  }, [globeReady, isAutoRotating, selectedProduct]);
  
  const getPolygonCapColor = useCallback((feat: object) => {
    const properties = (feat as CountryFeature).properties;
    const iso = properties?.ADM0_A3 || properties?.ISO_A3;
    const name = properties?.ADMIN || properties?.NAME_LONG || '';

    if (clickedCountryInfo && (clickedCountryInfo.ADM0_A3 === iso || clickedCountryInfo.ADMIN === name) ) return '#ff4500';
    if (hoverD && (hoverD.properties.ADM0_A3 === iso || hoverD.properties.ADMIN === name)) return '#ffa500';
    
    // highlightedCountries now contains either transit origin/dest or supply chain nodes
    if (highlightedCountries.some(hc => name.toLowerCase().includes(hc.toLowerCase()))) {
        return isEU(iso) ? '#FFBF00' : '#f97316'; // Amber for EU highlighted, Orange for Non-EU highlighted
    }
    return isEU(iso) ? '#002D62' : '#CCCCCC'; 
  }, [isEU, highlightedCountries, clickedCountryInfo, hoverD]);

  const handleDismissProductInfo = () => {
    setSelectedProduct(null);
    // URL update will trigger useEffect to clear dependent states
    router.push(`/dpp-global-tracker-v2`, { scroll: false });
  };

  if (dimensions.width === 0 || dimensions.height === 0 || !dataLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-var(--header-height,4rem))] w-full bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg text-muted-foreground">Preparing Global Tracker...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ width: '100%', height: `calc(100vh - ${HEADER_HEIGHT}px)`, position: 'relative', background: 'white' }}>
        {typeof window !== 'undefined' && dimensions.width > 0 && dimensions.height > 0 && (
          <GlobeComponent
            ref={globeEl} globeImageUrl={null} globeMaterial={globeMaterial} backgroundColor="rgba(255, 255, 255, 1)"
            arcsData={arcsData} arcColor={'color'} arcDashLength={0.4} arcDashGap={0.1} arcDashAnimateTime={2000} arcStroke={0.5}
            showAtmosphere={false} polygonsData={filteredLandPolygons} polygonCapColor={getPolygonCapColor}
            polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'} polygonStrokeColor={() => '#000000'} polygonAltitude={0.008}
            onPolygonHover={setHoverD as (feature: GeoJsonFeature | null) => void} onPolygonClick={handlePolygonClick} 
            polygonLabel={({ properties }: object) => {
              const p = properties as CountryProperties; const iso = p?.ADM0_A3 || p?.ISO_A3; const name = p?.ADMIN || p?.NAME_LONG || 'Country';
              const isEUCountry = isEU(iso); const isHighlighted = highlightedCountries.some(hc => name.toLowerCase().includes(hc.toLowerCase()));
              let roleInContext = "";
              if (isHighlighted) {
                  if (selectedProductTransitInfo?.origin && getCountryFromLocationString(selectedProductTransitInfo.origin) === name) roleInContext += "Transit Origin. ";
                  if (selectedProductTransitInfo?.destination && getCountryFromLocationString(selectedProductTransitInfo.destination) === name) roleInContext += "Transit Destination. ";
                  // Could add supply chain role if not transit origin/dest, but might get too busy.
                  if (!roleInContext) roleInContext = "Supply Chain Node."
              }
              return `<div style="background: rgba(40,40,40,0.8); color: white; padding: 5px 8px; border-radius: 4px; font-size: 12px;"><b>${name}</b>${iso ? ` (${iso})` : ''}<br/>${isEUCountry ? 'EU Member' : 'Non-EU Member'}<br/>${roleInContext.trim()}</div>`;
            }}
            polygonsTransitionDuration={100} width={dimensions.width} height={dimensions.height}
            onGlobeReady={() => setGlobeReady(true)} enablePointerInteraction={true}
          />
        )}

        {dimensions.width > 0 && dimensions.height > 0 && (
          <Button className="absolute top-4 right-[170px] z-10" size="sm" onClick={() => setIsAutoRotating(!isAutoRotating)}>
            {isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          </Button>
        )}

        <div className="absolute top-4 right-4 z-10">
         <Select onValueChange={(value) => setCountryFilter(value as 'all' | 'eu' | 'supplyChain') } value={countryFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter Countries" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem><SelectItem value="eu">EU Countries</SelectItem>
            <SelectItem value="supplyChain" disabled={!selectedProduct}>Product Focus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="absolute top-4 left-4 z-10">
       <Select
         onValueChange={(value) => {
            const newProductId = value === 'select-placeholder' ? null : value;
            setSelectedProduct(newProductId);
            if (newProductId) router.push(`/dpp-global-tracker-v2?productId=${newProductId}`, { scroll: false });
            else router.push(`/dpp-global-tracker-v2`, { scroll: false });
         }}
         value={selectedProduct || 'select-placeholder'}
       >
        <SelectTrigger className="w-[250px] sm:w-[300px]"><SelectValue placeholder="Select a Product" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="select-placeholder">Select a Product to Track</SelectItem>
          {MOCK_DPPS.map(dpp => ( 
            <SelectItem key={dpp.id} value={dpp.id}>{dpp.productName} ({dpp.id})</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
        
      {clickedCountryInfo && (
        <Card className="absolute top-16 right-4 z-20 w-72 shadow-xl bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-semibold">{clickedCountryInfo.ADMIN || 'Selected Country'}</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setClickedCountryInfo(null)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p><strong className="text-muted-foreground">ISO A3:</strong> {clickedCountryInfo.ADM0_A3 || clickedCountryInfo.ISO_A3 || 'N/A'}</p>
            <p><strong className="text-muted-foreground">DPPs Originating:</strong> {Math.floor(Math.random() * 50)} (Mock)</p>
            <p><strong className="text-muted-foreground">DPPs Transiting:</strong> {Math.floor(Math.random() * 20)} (Mock)</p>
            {isEU(clickedCountryInfo.ADM0_A3 || clickedCountryInfo.ISO_A3) && <p className="text-green-600 font-medium">EU Member State</p>}
            {highlightedCountries.includes(clickedCountryInfo.ADMIN || '') && <p className="text-orange-600 font-medium">Part of Focus Area</p>}
            <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2" disabled>View DPPs for {clickedCountryInfo.ADMIN?.substring(0,15) || 'Country'}... (Conceptual)</Button>
          </CardContent>
        </Card>
      )}

      {selectedProductTransitInfo && (
        <SelectedProductCustomsInfoCard 
            productTransitInfo={selectedProductTransitInfo}
            alerts={selectedProductAlerts}
            onDismiss={handleDismissProductInfo}
        />
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs p-2 rounded-md shadow-lg pointer-events-none">
        <Info className="inline h-3 w-3 mr-1" />
        {countryFilter === 'all' ? 'EU: Dark Blue | Non-EU: Grey.' : 
         countryFilter === 'eu' ? 'Displaying EU Countries.' : 
         countryFilter === 'supplyChain' && selectedProduct ? `Displaying Focus Area for ${selectedProduct}.` :
         'Select a product to view its focus area.'
        }
        {selectedProduct && highlightedCountries.length > 0 && ` Highlighted: Amber/Orange.`}
        {arcsData.length > 0 && (arcsData[0].color === '#3B82F6' ? ` Transit Arc: Blue.` : ` Supply Arc(s): Orange.`)}
      </div>
    </div>
  </>
  );
}

```
- workspace/src/data/mockCustomsAlerts.ts:
```ts

// --- File: src/data/mockCustomsAlerts.ts ---
import type { CustomsAlert } from '@/types/dpp'; // Import type

export const MOCK_CUSTOMS_ALERTS: CustomsAlert[] = [
  { id: "ALERT001", productId: "PROD101", message: "Flagged at CDG Airport - Potential counterfeit. Physical inspection scheduled.", severity: "High", timestamp: "2 hours ago", regulation: "Anti-Counterfeiting" },
  { id: "ALERT002", productId: "DPP002", message: "Awaiting CBAM declaration for textile import. Shipment delayed at Rotterdam.", severity: "Medium", timestamp: "1 day ago", regulation: "CBAM / Textile Import" },
  { id: "ALERT003", productId: "PROD999", message: "Random spot check selected for agricultural products (Batch AGR088). Expected delay: 48h.", severity: "Low", timestamp: "3 days ago", regulation: "SPS Measures" },
  { id: "ALERT004", productId: "PROD333", message: "Incomplete safety certification for machinery parts. Documentation required.", severity: "Medium", timestamp: "5 hours ago", regulation: "Machinery Directive"},
  { id: "ALERT005", productId: "DPP001", message: "EORI number mismatch for importer. Awaiting clarification. Shipment on hold.", severity: "Medium", timestamp: "1 hour ago", regulation: "Customs Union Tariff" },
  { id: "ALERT006", productId: "DPP005", message: "High-value battery shipment. Requires additional safety & transport documentation verification.", severity: "Medium", timestamp: "Pending Arrival", regulation: "ADR / Battery Safety" },
  { id: "ALERT007", productId: "DPP005", message: "Carbon Footprint declaration for EV Battery (DPP005) under review. CBAM ID: CBAM_BATTERY_EV_001.", severity: "Medium", timestamp: "4 hours ago", regulation: "CBAM" }
];

```
- workspace/src/data/index.ts:
```ts

export * from './mockDpps';
export * from './simpleMockProducts';
export * from './mockSuppliers';
export * from './mockPublicPassports';
export * from './mockImportJobs';
export * from './mockTransitProducts'; 
export * from './mockCustomsAlerts'; // Ensures this is present
export * from './mockServiceJobs'; // Added export for service jobs
export type { TransitProduct, CustomsAlert, InspectionEvent } from '@/types/dpp';

```
- workspace/src/types/dpp/Compliance.ts:
```ts

// --- File: Compliance.ts ---
// Description: Compliance related type definitions.
import type React from 'react'; // Ensure React is imported for React.ElementType

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string; // ISO Date string
  expiryDate?: string; // ISO Date string
  vcId?: string;
  documentUrl?: string;
  standard?: string;
  transactionHash?: string;
}

export interface EbsiVerificationDetails {
  status: 'verified' | 'pending_verification' | 'not_verified' | 'error' | 'N/A';
  verificationId?: string;
  issuerDid?: string;
  schema?: string;
  issuanceDate?: string; // ISO Date string
  lastChecked: string; // ISO Date string
  message?: string;
}

export interface ScipNotificationDetails {
  status?: 'Notified' | 'Pending Notification' | 'Not Required' | 'Error' | 'N/A' | string;
  notificationId?: string;
  svhcListVersion?: string;
  submittingLegalEntity?: string;
  articleName?: string;
  primaryArticleId?: string;
  safeUseInstructionsLink?: string; // Should be a URL
  lastChecked?: string;
}

export interface EuCustomsDataDetails {
  status?: 'Verified' | 'Pending Documents' | 'Mismatch' | 'Cleared' | 'N/A' | 'CBAM Relevant - Verified' | 'CBAM Relevant - Pending' | string; // Added CBAM status
  declarationId?: string;
  hsCode?: string;
  countryOfOrigin?: string; // ISO 3166-1 Alpha-2
  netWeightKg?: number | null;
  grossWeightKg?: number | null;
  customsValuation?: {
    value?: number | null;
    currency?: string; // ISO 4217
  };
  cbamGoodsIdentifier?: string;
  lastChecked?: string;
}

export interface CarbonFootprintData {
  value?: number | null;
  unit?: string;
  calculationMethod?: string;
  scope1Emissions?: number | null;
  scope2Emissions?: number | null;
  scope3Emissions?: number | null;
  dataSource?: string;
  vcId?: string;
}

export interface RecycledContentData {
  material?: string;
  percentage?: number | null;
  source?: 'Pre-consumer' | 'Post-consumer' | 'Mixed' | 'Unknown' | string;
  vcId?: string;
}

export interface StateOfHealthData {
  value?: number | null;
  unit?: string;
  measurementDate?: string;
  measurementMethod?: string;
  vcId?: string;
}

export interface BatteryRegulationDetails {
  status?: 'compliant' | 'non_compliant' | 'pending' | 'not_applicable' | string;
  batteryChemistry?: string;
  batteryPassportId?: string;
  ratedCapacityAh?: number | null;
  nominalVoltage?: number | null;
  expectedLifetimeCycles?: number | null;
  manufacturingDate?: string;
  manufacturerName?: string;
  carbonFootprint?: CarbonFootprintData;
  recycledContent?: RecycledContentData[];
  stateOfHealth?: StateOfHealthData;
  recyclingEfficiencyRate?: number | null;
  materialRecoveryRates?: {
    cobalt?: number | null;
    lead?: number | null;
    lithium?: number | null;
    nickel?: number | null;
  };
  dismantlingInformationUrl?: string;
  safetyInformationUrl?: string;
  vcId?: string;
}

export interface EsprSpecifics {
  durabilityInformation?: string;
  repairabilityInformation?: string;
  recycledContentSummary?: string;
  energyEfficiencySummary?: string;
  substanceOfConcernSummary?: string;
}


export interface ComplianceDetailItem {
  regulationName: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Not Applicable' | 'In Progress' | 'Data Incomplete' | 'Registered' | 'Verified' | 'Notified' | 'Pending Notification' | 'Not Required' | 'Pending Documents' | 'Mismatch' | 'Cleared' | 'Conformant' | 'Non-Conformant' | 'Pending Assessment' | 'Error' | 'Data Mismatch' | 'Product Not Found in EPREL' | 'Synced Successfully' | string;
  detailsUrl?: string;
  verificationId?: string;
  lastChecked: string; // ISO Date string
  notes?: string;
}

export interface ProductComplianceSummary {
  overallStatus: 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'N/A' | 'Data Incomplete' | 'Flagged' | string;
  eprel?: {
    id?: string;
    status: string;
    url?: string;
    lastChecked: string;
  };
  ebsi?: {
    status: 'Verified' | 'Pending' | 'Not Verified' | 'Error' | 'N/A' | string;
    verificationId?: string;
    transactionUrl?: string;
    lastChecked: string;
  };
  scip?: ScipNotificationDetails;
  euCustomsData?: EuCustomsDataDetails;
  battery?: BatteryRegulationDetails;
  specificRegulations?: ComplianceDetailItem[];
}

export interface SimpleCertification {
  id: string;
  name: string;
  authority: string;
  standard?: string;
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
  isVerified?: boolean;
  vcId?: string;
  transactionHash?: string;
}

export interface PublicCertification {
  name: string;
  authority: string;
  expiryDate?: string;
  isVerified?: boolean;
  link?: string;
  standard?: string;
  vcId?: string;
  transactionHash?: string;
}

export interface FiberCompositionEntry {
  fiberName: string;
  percentage: number | null;
}

export interface TextileInformation {
  fiberComposition?: FiberCompositionEntry[];
  countryOfOriginLabeling?: string;
  careInstructionsUrl?: string;
  isSecondHand?: boolean;
}

export interface EssentialCharacteristic {
  characteristicName: string;
  value: string;
  unit?: string;
  testMethod?: string;
}

export interface ConstructionProductInformation {
  declarationOfPerformanceId?: string;
  ceMarkingDetailsUrl?: string;
  intendedUseDescription?: string;
  essentialCharacteristics?: EssentialCharacteristic[];
}

export interface TransitProduct {
  id: string;
  name: string;
  category?: string; 
  stage: string;
  eta: string;
  dppStatus: ProductComplianceSummary['overallStatus'];
  transport: "Ship" | "Truck" | "Plane";
  origin: string;
  destination: string;
}

export interface CustomsAlert {
  id: string;
  productId: string;
  message: string;
  severity: "High" | "Medium" | "Low";
  timestamp: string;
  regulation?: string;
}

export interface InspectionEvent {
  id: string;
  icon: React.ElementType;
  title: string;
  timestamp: string;
  description: string;
  status: "Completed" | "Action Required" | "Upcoming" | "In Progress" | "Delayed" | "Cancelled";
  badgeVariant?: "outline" | "default" | "destructive" | "secondary" | null | undefined;
}
```
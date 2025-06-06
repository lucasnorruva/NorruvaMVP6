
"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
// import { feature as topojsonFeature } from 'topojson-client'; // Temporarily unused
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info, Settings2, Layers as LayersIcon, Filter, Palette, MapPin, TrendingUp, Link as LinkIcon, Route, Ship, Plane, Truck, Train, Package as PackageIcon, Zap, Building, Recycle as RecycleIcon, ShieldCheck, ShieldAlert, ShieldQuestion, Building2 as LandBorderIcon, RefreshCw, SearchCheck, BarChart3, BellRing, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard';
import CheckpointInfoCard from '@/components/dpp-tracker/CheckpointInfoCard';
import ShipmentInfoCard from '@/components/dpp-tracker/ShipmentInfoCard';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';


const GlobeVisualizationInternal = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));

const GlobeVisualization = React.memo(GlobeVisualizationInternal);


export interface MockDppPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  category: 'Electronics' | 'Appliances' | 'Textiles' | 'Raw Material Source' | 'Distribution Hub' | 'Recycling Facility';
  status: 'compliant' | 'pending' | 'issue' | 'unknown';
  timestamp: number;
  manufacturer?: string;
  gtin?: string;
  complianceSummary?: string;
  color?: string;
  icon?: React.ElementType;
}

export interface MockArc {
  id: string;
  shipmentId: string;
  direction: 'inbound_eu' | 'outbound_eu' | 'internal_eu' | 'other';
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  label?: string;
  stroke?: number;
  timestamp: number;
  transportMode?: 'sea' | 'air' | 'road' | 'rail';
  productId?: string;
}

export interface MockCustomsCheckpoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'port' | 'airport' | 'land_border';
  currentShipmentCount: number;
  overallCustomsStatus: 'cleared' | 'pending' | 'inspection_required' | 'operational';
  dppComplianceHealth: 'good' | 'fair' | 'poor' | 'unknown';
  icon?: React.ElementType;
  averageClearanceTime: string;
  issuesDetectedLast24h: number;
}

export interface MockShipmentPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  direction: 'inbound_eu' | 'outbound_eu' | 'internal_eu' | 'other';
  color?: string;
  arcId: string;
  arcLabel?: string;
  productIconUrl?: string;
  dppComplianceStatusText?: string;
  dppComplianceBadgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
  eta?: string;
  progressPercentage?: number;
  currentLat?: number;
  currentLng?: number;
  simulationProgress?: number;
  simulatedStatus: 'in_transit' | 'at_customs' | 'customs_inspection' | 'delayed' | 'cleared' | 'data_sync_delayed';
  ceMarkingStatus: 'valid' | 'missing' | 'pending_verification';
  cbamDeclarationStatus: 'submitted' | 'required' | 'cleared' | 'not_applicable';
  dppComplianceNotes: string[];
}

type NotificationType = 'compliance_alert' | 'delay_alert' | 'status_change';


// Simplified Colors - many are not used in the simplified globe
const SATURATED_BLUE = 'rgba(41, 171, 226, 0.9)';
const VIBRANT_TEAL = 'rgba(0, 128, 128, 0.9)';
const ACCENT_PURPLE = 'rgba(124, 58, 237, 0.9)';
const BROWN_COLOR = 'rgba(139, 69, 19, 0.9)';
const ORANGE_COLOR = 'rgba(255, 165, 0, 0.9)';
const DARK_GREEN_COLOR = 'rgba(0, 100, 0, 0.9)';
const CORNFLOWER_BLUE_COLOR = 'rgba(100, 149, 237, 0.7)';
const GREY_COLOR = 'rgba(128, 128, 128, 0.8)';

const EU_BLUE_COLOR = 'rgba(0, 80, 150, 0.95)';
const NON_EU_LAND_COLOR_LIGHT_BLUE = 'rgba(173, 216, 230, 0.95)';
const BORDER_COLOR_MEDIUM_BLUE = 'rgba(70, 130, 180, 0.7)';
const GLOBE_BACKGROUND_COLOR = '#000022'; // Dark Navy for explicit globe canvas background for testing

export const DPP_HEALTH_GOOD_COLOR = 'rgba(76, 175, 80, 0.9)';
export const DPP_HEALTH_FAIR_COLOR = 'rgba(255, 235, 59, 0.9)';
export const DPP_HEALTH_POOR_COLOR = 'rgba(244, 67, 54, 0.9)';
export const CHECKPOINT_PORT_COLOR = 'rgba(60, 70, 180, 0.9)';
export const CHECKPOINT_AIRPORT_COLOR = 'rgba(100, 60, 170, 0.9)';
export const CHECKPOINT_LAND_BORDER_COLOR = 'rgba(200, 100, 30, 0.9)';

const SHIPMENT_IN_TRANSIT_COLOR_GLOBE = 'rgba(0, 123, 255, 0.9)';
const SHIPMENT_AT_CUSTOMS_COLOR_GLOBE = 'rgba(255, 165, 0, 0.9)';
const SHIPMENT_INSPECTION_COLOR_GLOBE = 'rgba(220, 53, 69, 0.9)';
const SHIPMENT_DELAYED_COLOR_GLOBE = 'rgba(255, 193, 7, 0.9)';
const SHIPMENT_CLEARED_COLOR_GLOBE = 'rgba(40, 167, 69, 0.9)';
const SHIPMENT_DATA_SYNC_DELAYED_COLOR_GLOBE = 'rgba(108, 117, 125, 0.9)';

const ARC_INBOUND_EU_COLOR = 'rgba(50, 120, 220, 0.8)';
const ARC_OUTBOUND_EU_COLOR = 'rgba(30, 180, 100, 0.8)';
const ARC_INTERNAL_EU_COLOR = 'rgba(150, 100, 200, 0.8)';
const ARC_DEFAULT_COLOR = 'rgba(128, 128, 128, 0.7)';


const initialMockPointsData: MockDppPoint[] = [
  { id: 'eu_electronics_factory', lat: 50.8503, lng: 4.3517, name: 'EU Electronics Hub (Brussels)', size: 0.3, category: 'Electronics', status: 'compliant', timestamp: 2024, manufacturer: 'EuroChip', gtin: '111222333', icon: PackageIcon },
  { id: 'asia_textile_factory', lat: 22.3193, lng: 114.1694, name: 'Asia Textile Plant (Hong Kong)', size: 0.25, category: 'Textiles', status: 'pending', timestamp: 2023, manufacturer: 'SilkRoad Co.', gtin: '444555666', icon: Zap },
];

// Other initial data arrays remain but might be unused by the simplified GlobeVisualization
const initialMockArcsData: MockArc[] = [ /* ... existing data ... */ ];
const initialMockShipmentPointsData: MockShipmentPoint[] = [ /* ... existing data, ensure coordinates are valid ... */ ];
const initialMockCustomsCheckpointsData: MockCustomsCheckpoint[] = [ /* ... existing data ... */ ];


// const euMemberCountryCodes = [ ... ]; // Unused in simplified version

const Legend: React.FC<{ title: string; colorMap: Record<string, string>, className?: string }> = ({ title, colorMap, className }) => (
  <Card className={cn("shadow-md", className)}>
    <CardHeader className="pb-2 pt-3 px-3">
      <CardTitle className="text-sm font-semibold flex items-center">
        <Palette className="h-4 w-4 mr-2 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-3 pb-3 flex flex-wrap gap-x-4 gap-y-1">
      {Object.entries(colorMap).map(([name, color]) => (
        <div key={name} className="flex items-center text-xs min-w-[140px]">
          <span className="h-3 w-3 rounded-sm mr-2 border" style={{ backgroundColor: color.startsWith("rgba") || color.startsWith("#") ? color : undefined,
            backgroundImage: name.toLowerCase().includes("gradient") || name.toLowerCase().includes(" to ") ? `linear-gradient(to right, ${color.split(' to ')[0]}, ${color.split(' to ')[1] || color.split(' to ')[0]})` : undefined
          }} />
          <span>{name}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);


// const SHIPMENTS_TO_SIMULATE = ['SH001', 'SH004', 'SH006']; // Temporarily disable simulation
const SIMULATION_INTERVAL = 2000;
const SIMULATION_STEP = 0.02;

export default function DppGlobalTrackerPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<MockCustomsCheckpoint | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<MockShipmentPoint | null>(null);
  // const [countryPolygons, setCountryPolygons] = useState<any[]>([]); // Temporarily disable polygons
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(false); // Set to false as we are not loading geojson now
  const globeRefMain = useRef<any | undefined>();

  const [yearFilter, setYearFilter] = useState<number[]>([new Date().getFullYear()]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState<MockShipmentPoint['simulatedStatus'] | 'all'>('all');
  const { toast } = useToast();
  const { currentRole } = useRole();

  const [mockDppPointsData, setMockDppPointsData] = useState<MockDppPoint[]>(initialMockPointsData);
  // const [mockArcsDataState, setMockArcsDataState] = useState<MockArc[]>(initialMockArcsData); // Temporarily unused
  // const [mockShipmentPointsDataState, setMockShipmentPointsDataState] = useState<MockShipmentPoint[]>(initialMockShipmentPointsData); // Temporarily unused
  // const [mockCustomsCheckpointsDataState, setMockCustomsCheckpointsDataState] = useState<MockCustomsCheckpoint[]>(initialMockCustomsCheckpointsData); // Temporarily unused

  const [inspectingCheckpoint, setInspectingCheckpoint] = useState<MockCustomsCheckpoint | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

  const [notificationPrefs, setNotificationPrefs] = useState({
    complianceIssues: true,
    shipmentDelays: true,
    statusChanges: true,
  });

  const [lastToastForShipment, setLastToastForShipment] = useState<Record<string, { status: string; time: number }>>({});
  const [simulationActiveToastShown, setSimulationActiveToastShown] = useState(false);


  useEffect(() => {
    setIsClient(true);
    // Temporarily disable GeoJSON fetching
    // setIsLoadingGeoJson(true);
    // fetch('//unpkg.com/world-atlas/countries-110m.json')
    //   .then(res => res.json())
    //   .then(countries => {
    //     // const countryFeatures = countries.objects.countries.geometries.map((obj: any) => topojsonFeature(countries, obj));
    //     // setCountryPolygons(countryFeatures);
    //     setIsLoadingGeoJson(false);
    //   })
    //   .catch(err => {
    //     console.error("Error fetching GeoJSON data:", err);
    //     setIsLoadingGeoJson(false);
    //     toast({
    //       title: "Map Data Error",
    //       description: "Could not load geographic data for the globe.",
    //       variant: "destructive",
    //     });
    //   });
  }, [toast]);

//  useEffect(() => { // Temporarily disable simulation toast
//     if (isClient && SHIPMENTS_TO_SIMULATE.length > 0 && !simulationActiveToastShown) {
//       const timer = setTimeout(() => {
//         toast({
//           title: "Shipment Simulation Active",
//           description: "Mock shipments are now moving on the globe.",
//         });
//         setSimulationActiveToastShown(true);
//       }, 150);
//       return () => clearTimeout(timer);
//     }
//   }, [isClient, simulationActiveToastShown, toast]);


 const showShipmentToast = useCallback((shipmentId: string, status: string, message: string, variant: 'default' | 'destructive' = 'default', type: NotificationType) => {
    // Logic kept but will not be called if simulation is off
    let allowToast = false;
    switch (type) {
        case 'compliance_alert': allowToast = notificationPrefs.complianceIssues; break;
        case 'delay_alert': allowToast = notificationPrefs.shipmentDelays; break;
        case 'status_change': allowToast = notificationPrefs.statusChanges; break;
        default: allowToast = true;
    }
    if (!allowToast) return;

    const now = Date.now();
    setLastToastForShipment(prev => {
        const lastToastInfo = prev[shipmentId];
        if (!lastToastInfo || lastToastInfo.status !== status || (now - lastToastInfo.time > 5000)) {
            setTimeout(() => {
                toast({ title: "Shipment Update", description: message, variant: variant });
            }, 0);
            return { ...prev, [shipmentId]: { status, time: now } };
        }
        return prev;
    });
}, [toast, notificationPrefs.complianceIssues, notificationPrefs.shipmentDelays, notificationPrefs.statusChanges]);

//  useEffect(() => { // Temporarily disable shipment simulation
//     const intervalId = setInterval(() => {
//       // setMockShipmentPointsDataState(prevShipments => ... ); // Simulation logic commented out
//     }, SIMULATION_INTERVAL);
//     return () => clearInterval(intervalId);
//   }, [mockArcsDataState, showShipmentToast]);


  const filteredDppPoints = useMemo(() => {
    return mockDppPointsData.filter(point => {
      const yearMatch = point.timestamp <= yearFilter[0];
      const categoryMatch = categoryFilter === 'all' || point.category === categoryFilter;
      return yearMatch && categoryMatch;
    });
  }, [mockDppPointsData, yearFilter, categoryFilter]);

  // const filteredArcs = useMemo(() => { // Temporarily unused
  //   return mockArcsDataState.filter(arc => {
  //     const yearMatch = arc.timestamp <= yearFilter[0];
  //     return yearMatch;
  //   });
  // }, [mockArcsDataState, yearFilter]);

  // const combinedPointsForGlobe = useMemo(() => { // Temporarily simplify to only static points
  //   return [...filteredDppPoints];
  // }, [filteredDppPoints]);

  const shipmentStatusAnalyticsData = useMemo(() => { // Kept for UI, but data source is now static or needs adjustment
    const counts: Record<string, number> = { /* ... static mock counts or adjust ... */ };
    // mockShipmentPointsDataState.forEach(shipment => { // Logic depends on mockShipmentPointsDataState
    //   counts[shipment.simulatedStatus] = (counts[shipment.simulatedStatus] || 0) + 1;
    // });
    return Object.entries(counts).map(([status, count]) => ({
      status: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
    }));
  }, [/* mockShipmentPointsDataState - if re-enabled */]);

  const dppCategoryAnalyticsData = useMemo(() => {
    const counts: Record<string, number> = {};
    mockDppPointsData.forEach(point => {
      counts[point.category] = (counts[point.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [mockDppPointsData]);

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  } satisfies import("@/components/ui/chart").ChartConfig;


  // Accessor functions will be simplified or unused in the simplified GlobeVisualization
  const pointColorAccessor = useCallback((point: MockDppPoint | MockShipmentPoint) => { /* ... */ return GREY_COLOR; }, []);
  const arcColorAccessor = useCallback((arc: MockArc): string | string[] => { /* ... */ return ARC_DEFAULT_COLOR; }, []);
  const pointRadiusAccessor = useCallback((point: MockDppPoint | MockShipmentPoint) => { /* ... */ return 0.15; }, []);

  const handlePointClick = useCallback((point: MockDppPoint | MockShipmentPoint) => {
    if ('simulatedStatus' in point && point.simulatedStatus) {
      setSelectedShipment(point as MockShipmentPoint);
      setSelectedPoint(null);
      setSelectedArc(null);
      setSelectedCheckpoint(null);
    } else {
      setSelectedPoint(point as MockDppPoint);
      setSelectedShipment(null);
      setSelectedArc(null);
      setSelectedCheckpoint(null);
    }
  }, []);

  const handleArcClick = useCallback((arc: MockArc) => { setSelectedArc(arc); setSelectedPoint(null); setSelectedCheckpoint(null); setSelectedShipment(null); }, []);
  const handleCheckpointClick = useCallback((checkpoint: MockCustomsCheckpoint) => { setSelectedCheckpoint(checkpoint); setSelectedPoint(null); setSelectedArc(null); setSelectedShipment(null); }, []);
  const handleInspectProductsAtCheckpoint = useCallback((checkpoint: MockCustomsCheckpoint) => { setInspectingCheckpoint(checkpoint); setIsInspectionModalOpen(true); }, []);

  // Polygon accessors will be simplified in GlobeVisualization
  // const polygonCapColorAccessor = useCallback((feat: any) => { ... }, []);
  // const polygonSideColorAccessor = useCallback(() => 'rgba(0, 0, 0, 0)', []);
  // const polygonStrokeColorAccessor = useCallback(() => BORDER_COLOR_MEDIUM_BLUE, []);

  const uniqueCategories = useMemo(() => ['all', ...new Set(initialMockPointsData.map(p => p.category))], []);
  const shipmentStatusOptions: { value: MockShipmentPoint['simulatedStatus'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Shipment Statuses' }, /* ... other statuses ... */
  ];


  const globeLegendMap = { // Simplified legend for now
    "EU Member State": EU_BLUE_COLOR, // Placeholder, polygons are off
    "Non-EU Country": NON_EU_LAND_COLOR_LIGHT_BLUE, // Placeholder
    "DPP Location Point (Green)": DPP_HEALTH_GOOD_COLOR,
    "DPP Location Point (Orange)": DPP_HEALTH_FAIR_COLOR,
    // ... add more as features are re-enabled
  };

  const handleSimulateCheckpointUpdate = () => { /* ... existing logic ... */ };
  const handleResetGlobeView = () => { if (globeRefMain.current) { globeRefMain.current.pointOfView({ lat: 50, lng: 15, altitude: 2.2 }, 700); } };
  const handleNotificationPrefChange = (prefKey: keyof typeof notificationPrefs, checked: boolean) => { setNotificationPrefs(prev => ({ ...prev, [prefKey]: checked })); };


  return (
    <div className="space-y-8 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker
        </h1>
      </div>
      {(currentRole === 'auditor' || currentRole === 'admin') && ( /* ... Alert ... */ )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filters & Controls</CardTitle>
          <CardDescription>Adjust filters to refine the displayed data on the globe. Shipment simulation is temporarily disabled.</CardDescription>
        </CardHeader>
        <CardContent> {/* Filters UI remains */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6 items-end">
            <div title="Filter DPP location points by their assigned category.">
              <Label htmlFor="category-filter" className="text-sm font-medium">Filter by Category (Locations)</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="w-full mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-1" title="Filter data points and arcs up to the selected year.">
              <Label htmlFor="year-slider" className="text-sm font-medium">Filter by Year (Up to): {yearFilter[0]}</Label>
              <Slider
                id="year-slider"
                min={Math.min(...initialMockPointsData.map(p => p.timestamp), new Date().getFullYear() - 5)}
                max={new Date().getFullYear()}
                step={1}
                value={yearFilter}
                onValueChange={(value) => setYearFilter(value)}
                className="mt-3"
              />
            </div>
            {/* Shipment Status Filter can be hidden or disabled if no shipments shown */}
            <div title="Filter active shipments by their current simulated status. (Currently disabled)">
              <Label htmlFor="shipment-status-filter" className="text-sm font-medium">Filter by Shipment Status</Label>
              <Select value={shipmentStatusFilter} onValueChange={(value) => setShipmentStatusFilter(value as MockShipmentPoint['simulatedStatus'] | 'all')} disabled>
                 <SelectTrigger id="shipment-status-filter" className="w-full mt-1">
                   <SelectValue placeholder="Select shipment status" />
                 </SelectTrigger>
                 <SelectContent>
                   {shipmentStatusOptions.map(opt => (
                     <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-3 lg:justify-end mt-2 sm:mt-0">
                 <Button onClick={handleSimulateCheckpointUpdate} variant="outline" className="w-full sm:w-auto" title="Simulate random updates to customs checkpoint data." disabled>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Simulate Checkpoint Update (Disabled)
                 </Button>
                <Button onClick={handleResetGlobeView} variant="outline" className="w-full sm:w-auto" title="Reset the globe to its default position and zoom level.">
                    <GlobeIconLucide className="mr-2 h-4 w-4" /> Reset Globe View
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics and Notification Cards remain, but data might be static/limited */}
      <Card className="shadow-lg"> {/* ... Shipment Analytics Card ... */}
         <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Shipment Analytics (Mock - Limited Data)
          </CardTitle>
          <CardDescription>Summary of mock shipment data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Shipment simulation and detailed analytics are temporarily simplified for debugging.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg"> {/* ... Notification Preferences Card ... */}
         <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BellRing className="mr-2 h-5 w-5 text-primary" /> Notification Preferences (Mock)
          </CardTitle>
          <CardDescription>Control which simulated toast notifications you receive. (Currently limited due to simulation changes)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                <Label htmlFor="compliance-issues-pref" className="text-sm font-medium">Show Compliance Issue Toasts</Label>
                <Switch id="compliance-issues-pref" checked={notificationPrefs.complianceIssues} onCheckedChange={(checked) => handleNotificationPrefChange('complianceIssues', checked)} />
            </div>
            {/* Other switches remain */}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Global Product Passport Visualization</CardTitle>
          <CardDescription>Interact with the globe to explore product origins, supply chains, and compliance status across regions. (Currently showing simplified data for diagnosis)</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-[60vh] md:h-[600px] rounded-md overflow-hidden border relative bg-card"
          >
            {isLoadingGeoJson ? ( /* ... loading state ... */ '' ) : (
              <Suspense fallback={
                <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading 3D Globe Visualization...</span>
                </div>
              }>
                {isClient && (
                    <GlobeVisualization
                        globeRef={globeRefMain}
                        // Only pass minimal props required by the simplified GlobeVisualization component
                        // pointsData={combinedPointsForGlobe} // This will be handled by the simplified GlobeVisualization
                        // arcsData={[]} // Pass empty array
                        // polygonsData={[]} // Pass empty array
                        // customsCheckpointsData={[]} // Pass empty array
                    />
                )}
                </Suspense>
            )}
          </div>
          <div className="mt-6">
             <Legend title="Map Legend (Simplified)" colorMap={globeLegendMap} className="mt-2 mx-auto w-full sm:w-auto" />
          </div>
        </CardContent>
      </Card>

      {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={() => setSelectedPoint(null)} />}
      {/* Other info cards are conditionally rendered if their data exists */}
      {/* {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={() => setSelectedArc(null)} />} ... */}

      {inspectingCheckpoint && ( /* ... Inspection Modal ... */ '' )}
    </div>
  );
}


"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info, Settings2, Layers as LayersIcon, Filter, Palette, MapPin, TrendingUp, Link as LinkIcon, Route, Ship, Plane, Truck, Train, Package as PackageIcon, Zap, Building, Recycle as RecycleIcon, ShieldCheck, ShieldAlert, ShieldQuestion, Building2 as LandBorderIcon, RefreshCw, SearchCheck, BarChart3, BellRing, History as HistoryIcon, ChevronDown } from "lucide-react";
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
import { ChartContainer } from '@/components/ui/chart';
import { useRouter } from 'next/navigation';

import GlobeVisualization from '@/components/dpp-tracker/GlobeVisualization';


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


const EU_BLUE_COLOR = '#2563EB';
const NON_EU_LAND_COLOR_LIGHT_BLUE = '#64748B'; // Gray for Non-EU
const GLOBE_BACKGROUND_COLOR = '#0a0a0a'; // Dark space/night sky

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

export const ARC_INBOUND_EU_COLOR = 'rgba(22, 163, 74, 0.8)'; // Green for Inbound (Import) - #16A34A
export const ARC_OUTBOUND_EU_COLOR = 'rgba(245, 158, 11, 0.8)'; // Orange for Outbound (Export) - #F59E0B
export const ARC_INTERNAL_EU_COLOR = 'rgba(139, 92, 246, 0.8)'; // Purple for Intra-EU - #8B5CF6
export const ARC_DEFAULT_COLOR = 'rgba(128, 128, 128, 0.7)'; // Grey for other routes


const EU_MEMBER_STATES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", 
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", 
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", 
  "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", 
  "Spain", "Sweden"
];


const initialMockPointsData: MockDppPoint[] = [
  { id: 'eu_electronics_factory', lat: 50.8503, lng: 4.3517, name: 'EU Electronics Hub (Brussels)', size: 0.3, category: 'Electronics', status: 'compliant', timestamp: 2024, manufacturer: 'EuroChip', gtin: '111222333', icon: PackageIcon },
  { id: 'asia_textile_factory', lat: 22.3193, lng: 114.1694, name: 'Asia Textile Plant (Hong Kong)', size: 0.25, category: 'Textiles', status: 'pending', timestamp: 2023, manufacturer: 'SilkRoad Co.', gtin: '444555666', icon: Zap },
];

const initialMockArcsData: MockArc[] = [
  { id: 'arc1', shipmentId: 'SH001', direction: 'inbound_eu', startLat: 22.3193, startLng: 114.1694, endLat: 50.8503, endLng: 4.3517, label: 'Textiles to EU', stroke: 0.25, timestamp: 2023, transportMode: 'sea', productId: 'PROD_TEXTILE_A' },
  { id: 'arc2', shipmentId: 'SH002', direction: 'internal_eu', startLat: 50.8503, startLng: 4.3517, endLat: 48.8566, endLng: 2.3522, label: 'Electronics Brussels to Paris', stroke: 0.2, timestamp: 2024, transportMode: 'road', productId: 'PROD_ELECTRONIC_B' },
  { id: 'arc3', shipmentId: 'SH003', direction: 'outbound_eu', startLat: 48.8566, startLng: 2.3522, endLat: 40.7128, endLng: -74.0060, label: 'Luxury Goods EU to US', stroke: 0.2, timestamp: 2024, transportMode: 'air', productId: 'PROD_LUXURY_C' },
  { id: 'arc4', shipmentId: 'SH004', direction: 'other', startLat: -33.8688, startLng: 151.2093, endLat: 35.6895, endLng: 139.6917, label: 'Components AUS to JPN', stroke: 0.15, timestamp: 2023, transportMode: 'sea', productId: 'PROD_COMP_D' },
];

const initialMockShipmentPointsData: MockShipmentPoint[] = [
  { id: 'SH001', lat: 22.3193, lng: 114.1694, name: 'Textile Shipment Alpha', size: 0.15, direction: 'inbound_eu', arcId: 'arc1', productIconUrl: 'https://placehold.co/40x40.png?text=FAB', dppComplianceStatusText: 'Pending Customs Data', dppComplianceBadgeVariant: 'outline', simulatedStatus: 'in_transit', eta: '2024-08-15', progressPercentage: 10, ceMarkingStatus: 'not_applicable', cbamDeclarationStatus: 'required', dppComplianceNotes: ["Awaiting Bill of Lading verification."] },
  { id: 'SH002', lat: 50.8503, lng: 4.3517, name: 'Electronics Batch Beta', size: 0.15, direction: 'internal_eu', arcId: 'arc2', productIconUrl: 'https://placehold.co/40x40.png?text=CHIP', dppComplianceStatusText: 'DPP Verified', dppComplianceBadgeVariant: 'default', simulatedStatus: 'in_transit', eta: '2024-08-05', progressPercentage: 30, ceMarkingStatus: 'valid', cbamDeclarationStatus: 'not_applicable', dppComplianceNotes: ["All documents aligned."] },
  { id: 'SH003', lat: 48.8566, lng: 2.3522, name: 'Luxury Goods Gamma', size: 0.15, direction: 'outbound_eu', arcId: 'arc3', productIconUrl: 'https://placehold.co/40x40.png?text=BAG', dppComplianceStatusText: 'Awaiting Export Approval', dppComplianceBadgeVariant: 'outline', simulatedStatus: 'at_customs', eta: '2024-08-10', progressPercentage: 0, ceMarkingStatus: 'valid', cbamDeclarationStatus: 'not_applicable', dppComplianceNotes: ["Export license pending."] },
  { id: 'SH004', lat: -33.8688, startLng: 151.2093, name: 'Components Delta', size: 0.15, direction: 'other', arcId: 'arc4', productIconUrl: 'https://placehold.co/40x40.png?text=COMP', dppComplianceStatusText: 'Data Sync Delayed', dppComplianceBadgeVariant: 'secondary', simulatedStatus: 'data_sync_delayed', eta: '2024-08-20', progressPercentage: 5, ceMarkingStatus: 'not_applicable', cbamDeclarationStatus: 'not_applicable', dppComplianceNotes: ["Origin country data system offline."] },
];

const initialMockCustomsCheckpointsData: MockCustomsCheckpoint[] = [
  { id: 'cp_rotterdam', lat: 51.9225, lng: 4.47917, name: 'Port of Rotterdam', type: 'port', currentShipmentCount: 125, overallCustomsStatus: 'operational', dppComplianceHealth: 'good', averageClearanceTime: "24-48h", issuesDetectedLast24h: 2 },
  { id: 'cp_frankfurt_airport', lat: 50.0379, lng: 8.5622, name: 'Frankfurt Airport Cargo', type: 'airport', currentShipmentCount: 80, overallCustomsStatus: 'pending', dppComplianceHealth: 'fair', averageClearanceTime: "12-36h", issuesDetectedLast24h: 5 },
  { id: 'cp_dover_calais', lat: 51.1279, lng: 1.3536, name: 'Dover-Calais Crossing', type: 'land_border', currentShipmentCount: 210, overallCustomsStatus: 'inspection_required', dppComplianceHealth: 'poor', averageClearanceTime: "48-96h", issuesDetectedLast24h: 15 },
];

const SHIPMENTS_TO_SIMULATE = ['SH001', 'SH002', 'SH003', 'SH004'];
const SIMULATION_INTERVAL = 3000; 
const SIMULATION_STEP = 0.01; 

const Legend: React.FC<{ title: string; colorMap: Record<string, string>, className?: string, onToggleVisibility?: (key: string) => void, visibility?: Record<string, boolean> }> = ({ title, colorMap, className, onToggleVisibility, visibility }) => (
  <Card className={cn("shadow-md", className)}>
    <CardHeader className="pb-2 pt-3 px-3">
      <CardTitle className="text-sm font-semibold flex items-center">
        <Palette className="h-4 w-4 mr-2 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-3 pb-3 grid grid-cols-1 gap-y-1">
      {Object.entries(colorMap).map(([name, color]) => (
        <div key={name} className="flex items-center text-xs">
          {onToggleVisibility && visibility && (
             <Switch
              id={`legend-toggle-${name.replace(/\s+/g, '-')}`}
              checked={visibility[name]}
              onCheckedChange={() => onToggleVisibility(name)}
              className="mr-2 h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-3.5 [&>span[data-state=unchecked]]:translate-x-0.5"
            />
          )}
          <span className={`h-3 w-3 rounded-sm mr-2 border ${onToggleVisibility && visibility && !visibility[name] ? 'opacity-30' : ''}`} style={{ 
            backgroundColor: color.startsWith("rgba") || color.startsWith("#") ? color : undefined,
            backgroundImage: name.toLowerCase().includes("gradient") || name.toLowerCase().includes(" to ") ? `linear-gradient(to right, ${color.split(' to ')[0]}, ${color.split(' to ')[1] || color.split(' to ')[0]})` : undefined
          }} />
          <label htmlFor={`legend-toggle-${name.replace(/\s+/g, '-')}`} className={`flex-1 ${onToggleVisibility && visibility && !visibility[name] ? 'opacity-50' : ''}`}>
            {name}
          </label>
        </div>
      ))}
    </CardContent>
  </Card>
);

interface ControlPanelProps {
  onFocusEurope: () => void;
  onToggleRotation: () => void;
  isRotating: boolean;
  productCategories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onToggleTradeFlows: () => void;
  tradeFlowsVisible: boolean;
  onSimulateCheckpointUpdate: () => void;
  onResetGlobeView: () => void;
  notificationPrefs: { complianceIssues: boolean; shipmentDelays: boolean; statusChanges: boolean; };
  onNotificationPrefChange: (prefKey: keyof ControlPanelProps['notificationPrefs'], checked: boolean) => void;
  onViewNotificationHistory: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onFocusEurope, onToggleRotation, isRotating, 
  productCategories, selectedCategory, onCategoryChange,
  onToggleTradeFlows, tradeFlowsVisible,
  onSimulateCheckpointUpdate, onResetGlobeView,
  notificationPrefs, onNotificationPrefChange, onViewNotificationHistory
}) => (
  <Card className="shadow-lg">
    <CardHeader className="pb-3 pt-4 px-4">
      <CardTitle className="text-base font-semibold flex items-center">
        <Settings2 className="h-5 w-5 mr-2 text-primary" />
        Globe Controls & Filters
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 pb-4 space-y-3">
      <Button onClick={onFocusEurope} variant="outline" size="sm" className="w-full justify-start">
        <MapPin className="h-4 w-4 mr-2" /> Focus on Europe
      </Button>
      <Button onClick={onToggleRotation} variant="outline" size="sm" className="w-full justify-start">
        <RefreshCw className={`h-4 w-4 mr-2 ${isRotating ? 'animate-spin-slow' : ''}`} />
        {isRotating ? 'Stop Rotation' : 'Start Rotation'}
      </Button>
       <Button onClick={onResetGlobeView} variant="outline" size="sm" className="w-full justify-start">
        <SearchCheck className="h-4 w-4 mr-2" /> Reset View
      </Button>
      <Button onClick={onToggleTradeFlows} variant="outline" size="sm" className="w-full justify-start">
        <Route className="h-4 w-4 mr-2" />
        {tradeFlowsVisible ? 'Hide Trade Flows' : 'Show Trade Flows'}
      </Button>
      <div>
        <Label htmlFor="product-category-filter-control" className="text-xs font-medium">Filter Product Category (Trade Routes)</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger id="product-category-filter-control" className="w-full h-9 text-xs mt-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onSimulateCheckpointUpdate} variant="outline" size="sm" className="w-full justify-start">
        <Zap className="h-4 w-4 mr-2 text-orange-500" /> Simulate Checkpoint Update
      </Button>
       <Card className="mt-3 p-3 bg-muted/30">
         <h4 className="text-xs font-semibold mb-2 text-primary flex items-center">
           <BellRing className="h-4 w-4 mr-1.5"/>Mock Notification Prefs
         </h4>
         <div className="space-y-1.5">
           {(Object.keys(notificationPrefs) as Array<keyof typeof notificationPrefs>).map(key => (
             <div key={key} className="flex items-center justify-between">
               <Label htmlFor={`pref-${key}`} className="text-xs">
                 {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
               </Label>
               <Switch
                 id={`pref-${key}`}
                 checked={notificationPrefs[key]}
                 onCheckedChange={(checked) => onNotificationPrefChange(key, checked)}
                 className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-3.5 [&>span[data-state=unchecked]]:translate-x-0.5"
               />
             </div>
           ))}
           <Button onClick={onViewNotificationHistory} variant="link" size="sm" className="p-0 h-auto text-xs text-primary">
             <HistoryIcon className="h-3 w-3 mr-1"/> View History (Mock)
           </Button>
         </div>
       </Card>
    </CardContent>
  </Card>
);

const InfoPanel: React.FC = () => (
  <Card className="shadow-lg max-w-sm">
    <CardHeader className="pb-3 pt-4 px-4">
      <CardTitle className="text-base font-semibold flex items-center">
        <Info className="h-5 w-5 mr-2 text-primary" />
        DPP Global Tracker
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 pb-4 text-xs text-muted-foreground space-y-1">
      <p>Visualize Digital Product Passport compliance and trade flows.</p>
      <p>Interact: Drag to rotate, scroll to zoom. Click on points/arcs for details.</p>
      <p>Data is simulated for demonstration purposes.</p>
    </CardContent>
  </Card>
);


export default function DppGlobalTrackerPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<MockCustomsCheckpoint | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<MockShipmentPoint | null>(null);
  const [countryPolygons, setCountryPolygons] = useState<any[]>([]);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true); 
  const globeRefMain = useRef<any | undefined>();
  const router = useRouter();

  const [yearFilter, setYearFilter] = useState<number[]>([new Date().getFullYear()]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all'); 
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState<MockShipmentPoint['simulatedStatus'] | 'all'>('all');
  const { toast } = useToast();
  const { currentRole } = useRole();

  const [mockDppPointsDataState, setMockDppPointsDataState] = useState<MockDppPoint[]>(initialMockPointsData);
  const [mockArcsDataState, setMockArcsDataState] = useState<MockArc[]>(initialMockArcsData);
  const [mockShipmentPointsDataState, setMockShipmentPointsDataState] = useState<MockShipmentPoint[]>(initialMockShipmentPointsData);
  const [mockCustomsCheckpointsDataState, setMockCustomsCheckpointsDataState] = useState<MockCustomsCheckpoint[]>(initialMockCustomsCheckpointsData);

  const [inspectingCheckpoint, setInspectingCheckpoint] = useState<MockCustomsCheckpoint | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  
  const [simulationActiveToastShown, setSimulationActiveToastShown] = useState(false);
  const [lastToastForShipment, setLastToastForShipment] = useState<Record<string, {status: string, timestamp: number}>>({});

  const [notificationPrefs, setNotificationPrefs] = useState({
    complianceIssues: true,
    shipmentDelays: true,
    statusChanges: true,
  });

  const [isGlobeRotating, setIsGlobeRotating] = useState(false);
  const [tradeFlowsVisible, setTradeFlowsVisible] = useState(true);
  const [tradeRouteCategoryFilter, setTradeRouteCategoryFilter] = useState('all');

  const [legendVisibility, setLegendVisibility] = useState<Record<string, boolean>>({
    "Country Border": true,
    "Route (Import into EU)": true,
    "Route (Export from EU)": true,
    "Route (Internal EU)": true,
    "Route (Other)": true,
    "DPP Location (Good Compliance)": true,
    "DPP Location (Fair Compliance)": true,
    "DPP Location (Poor Compliance)": true,
    "Shipment (In Transit)": true,
    "Shipment (At Customs)": true,
    "Shipment (Inspection)": true,
    "Shipment (Cleared)": true,
    "Checkpoint (DPP Good/Green 'G')": true,
    "Checkpoint (DPP Fair/Yellow 'F')": true,
    "Checkpoint (DPP Poor/Red 'P')": true,
    "Port (Blue 'S')": true,
    "Airport (Purple 'A')": true,
    "Land Border (Orange 'L')": true,
  });

  useEffect(() => {
    setIsClient(true);
    fetch('/ne_110m_admin_0_countries.geojson') // Assumes file is in /public
      .then(res => {
        if (!res.ok) {
          console.error(`GeoJSON fetch error: ${res.status} ${res.statusText} for URL ${res.url}`);
          throw new Error(`Failed to fetch geojson: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCountryPolygons(data.features);
        setIsLoadingGeoJson(false);
      })
      .catch(error => {
        console.error("Error loading GeoJSON:", error);
        toast({
          title: "Error Loading Map Data",
          description: "Could not load country boundaries. Some map features may be unavailable. Check console for details.",
          variant: "destructive",
        });
        setIsLoadingGeoJson(false); 
      });
  }, [toast]);

  const showShipmentToast = useCallback((shipmentId: string, title: string, description: string, variant: 'default' | 'destructive' = 'default', toastType: NotificationType) => {
    if (!isClient) return; 

    let shouldShowToast = false;
    switch (toastType) {
      case 'compliance_alert': shouldShowToast = notificationPrefs.complianceIssues; break;
      case 'delay_alert': shouldShowToast = notificationPrefs.shipmentDelays; break;
      case 'status_change': shouldShowToast = notificationPrefs.statusChanges; break;
      default: shouldShowToast = true;
    }
    if (!shouldShowToast) return;

    const now = Date.now();
    setLastToastForShipment(prev => {
      if (!prev[shipmentId] || prev[shipmentId].status !== title || (now - (prev[shipmentId].timestamp || 0) > 10000)) { // Debounce same status toast for 10s
        setTimeout(() => { 
          toast({ title, description, variant });
        }, 0);
        return { ...prev, [shipmentId]: { status: title, timestamp: now } };
      }
      return prev;
    });
  }, [toast, notificationPrefs, isClient]);


   useEffect(() => {
    if (isClient && SHIPMENTS_TO_SIMULATE.length > 0 && !simulationActiveToastShown) {
      setTimeout(() => {
        toast({
          title: "Shipment Simulation Active",
          description: "Product shipment movements are being simulated on the globe.",
          duration: 5000,
        });
        setSimulationActiveToastShown(true);
      }, 100); 
    }
  }, [isClient, toast, simulationActiveToastShown]);

   useEffect(() => {
    if (!isClient || SHIPMENTS_TO_SIMULATE.length === 0) return;

    const intervalId = setInterval(() => {
      setMockShipmentPointsDataState(prevShipments =>
        prevShipments.map(shipment => {
          if (!SHIPMENTS_TO_SIMULATE.includes(shipment.id)) return shipment;

          const arc = mockArcsDataState.find(a => a.id === shipment.arcId);
          if (!arc) return shipment;

          let newProgress = (shipment.simulationProgress || 0) + SIMULATION_STEP;
          let newSimulatedStatus = shipment.simulatedStatus;
          let newDppComplianceStatusText = shipment.dppComplianceStatusText;
          let newDppComplianceBadgeVariant = shipment.dppComplianceBadgeVariant;
          let complianceIssueThisStep = false;
          let toastType: NotificationType = 'status_change';


          if (newProgress >= 1) {
            newProgress = 1;
            if (shipment.direction === 'inbound_eu' && shipment.simulatedStatus !== 'cleared' && shipment.simulatedStatus !== 'customs_inspection') {
              newSimulatedStatus = Math.random() < 0.3 ? 'customs_inspection' : 'at_customs';
            } else if (shipment.simulatedStatus !== 'cleared') {
              newSimulatedStatus = 'cleared';
            }
          } else {
            newSimulatedStatus = 'in_transit';
          }

          if (shipment.simulatedStatus === 'at_customs' && Math.random() < 0.05) {
              newSimulatedStatus = Math.random() < 0.4 ? 'customs_inspection' : 'cleared';
          } else if (shipment.simulatedStatus === 'customs_inspection' && Math.random() < 0.08) {
              newSimulatedStatus = Math.random() < 0.3 ? 'delayed' : 'cleared';
          } else if (shipment.simulatedStatus === 'delayed' && Math.random() < 0.1) {
              newSimulatedStatus = 'cleared';
          }
          
          if (newSimulatedStatus === 'in_transit' && Math.random() < 0.01) {
            newSimulatedStatus = 'data_sync_delayed';
          } else if (shipment.simulatedStatus === 'data_sync_delayed' && Math.random() < 0.2) {
            newSimulatedStatus = 'in_transit';
          }

          if (newSimulatedStatus === 'at_customs' || newSimulatedStatus === 'customs_inspection') {
            if (Math.random() < 0.02) {
              const issues = ["CBAM Declaration Missing", "Incorrect Tariff Code", "Safety Certificate Expired"];
              newDppComplianceStatusText = issues[Math.floor(Math.random() * issues.length)];
              newDppComplianceBadgeVariant = 'destructive';
              complianceIssueThisStep = true;
            }
          } else if (newSimulatedStatus === 'cleared') {
            newDppComplianceStatusText = "All DPP Data Verified";
            newDppComplianceBadgeVariant = 'default';
          }

          if (newSimulatedStatus !== shipment.simulatedStatus || complianceIssueThisStep) {
            let toastTitle = `${shipment.name}: Status Update`;
            let toastDescription = `Now: ${newSimulatedStatus.replace(/_/g, ' ')}.`;
            let toastVariant: 'default' | 'destructive' = 'default';

            if (complianceIssueThisStep) {
              toastTitle = `${shipment.name}: Compliance Alert!`;
              toastDescription = `${newDppComplianceStatusText}`;
              toastVariant = 'destructive';
              toastType = 'compliance_alert';
            } else if (newSimulatedStatus === 'delayed' || newSimulatedStatus === 'customs_inspection' || newSimulatedStatus === 'data_sync_delayed') {
              toastDescription = `Status changed to: ${newSimulatedStatus.replace(/_/g, ' ')}. This may cause delays.`;
              toastVariant = 'destructive';
              toastType = newSimulatedStatus === 'delayed' ? 'delay_alert' : 'status_change';
            } else {
              toastType = 'status_change';
            }
            showShipmentToast(shipment.id, toastTitle, toastDescription, toastVariant, toastType);
          }

          const currentLat = arc.startLat + (arc.endLat - arc.startLat) * newProgress;
          const currentLng = arc.startLng + (arc.endLng - arc.startLng) * newProgress;

          return {
            ...shipment,
            lat: currentLat,
            lng: currentLng,
            currentLat: currentLat,
            currentLng: currentLng,
            simulationProgress: newProgress,
            progressPercentage: Math.round(newProgress * 100),
            dppComplianceStatusText: newDppComplianceStatusText,
            dppComplianceBadgeVariant: newDppComplianceBadgeVariant,
            simulatedStatus: newSimulatedStatus,
          };
        })
      );
    }, SIMULATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isClient, mockArcsDataState, showShipmentToast]);


  const filteredDppPoints = useMemo(() => {
    return mockDppPointsDataState.filter(point => {
      const yearMatch = point.timestamp <= yearFilter[0];
      const categoryMatch = categoryFilter === 'all' || point.category === categoryFilter;
      return yearMatch && categoryMatch;
    });
  }, [mockDppPointsDataState, yearFilter, categoryFilter]);

  const filteredArcs = useMemo(() => {
    if (!tradeFlowsVisible) return [];
    return mockArcsDataState.filter(arc => {
      const yearMatch = arc.timestamp <= yearFilter[0];
      const arcProductCategory = initialMockPointsData.find(p => p.id === arc.productId)?.category || "Unknown";
      const categoryMatch = tradeRouteCategoryFilter === 'all' || arcProductCategory === tradeRouteCategoryFilter;
      return yearMatch && categoryMatch;
    });
  }, [mockArcsDataState, yearFilter, tradeFlowsVisible, tradeRouteCategoryFilter]);

  const filteredShipmentPoints = useMemo(() => {
    if (shipmentStatusFilter === 'all') return mockShipmentPointsDataState;
    return mockShipmentPointsDataState.filter(shipment => shipment.simulatedStatus === shipmentStatusFilter);
  }, [mockShipmentPointsDataState, shipmentStatusFilter]);

  const combinedPointsForGlobe = useMemo(() => {
    return [...filteredDppPoints, ...filteredShipmentPoints];
  }, [filteredDppPoints, filteredShipmentPoints]);

  const shipmentStatusAnalyticsData = useMemo(() => {
    const counts: Record<string, number> = {
      in_transit: 0, at_customs: 0, customs_inspection: 0, delayed: 0, cleared: 0, data_sync_delayed: 0,
    };
    mockShipmentPointsDataState.forEach(shipment => {
      counts[shipment.simulatedStatus] = (counts[shipment.simulatedStatus] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      status: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
    }));
  }, [mockShipmentPointsDataState]);

  const dppCategoryAnalyticsData = useMemo(() => {
    const counts: Record<string, number> = {};
    mockDppPointsDataState.forEach(point => {
      counts[point.category] = (counts[point.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [mockDppPointsDataState]);

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  } satisfies import("@/components/ui/chart").ChartConfig;

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


  const globeLegendMap = useMemo(() => ({
    "Country Border": 'rgba(200, 200, 200, 0.6)',
    "Route (Import into EU)": ARC_INBOUND_EU_COLOR,
    "Route (Export from EU)": ARC_OUTBOUND_EU_COLOR,
    "Route (Internal EU)": ARC_INTERNAL_EU_COLOR,
    "Route (Other)": ARC_DEFAULT_COLOR,
    "DPP Location (Good Compliance)": DPP_HEALTH_GOOD_COLOR,
    "DPP Location (Fair Compliance)": DPP_HEALTH_FAIR_COLOR,
    "DPP Location (Poor Compliance)": DPP_HEALTH_POOR_COLOR,
    "Shipment (In Transit)": SHIPMENT_IN_TRANSIT_COLOR_GLOBE,
    "Shipment (At Customs)": SHIPMENT_AT_CUSTOMS_COLOR_GLOBE,
    "Shipment (Inspection)": SHIPMENT_INSPECTION_COLOR_GLOBE,
    "Shipment (Cleared)": SHIPMENT_CLEARED_COLOR_GLOBE,
    "Checkpoint (DPP Good/Green 'G')": DPP_HEALTH_GOOD_COLOR,
    "Checkpoint (DPP Fair/Yellow 'F')": DPP_HEALTH_FAIR_COLOR,
    "Checkpoint (DPP Poor/Red 'P')": DPP_HEALTH_POOR_COLOR,
    "Port (Blue 'S')": CHECKPOINT_PORT_COLOR,
    "Airport (Purple 'A')": CHECKPOINT_AIRPORT_COLOR,
    "Land Border (Orange 'L')": CHECKPOINT_LAND_BORDER_COLOR,
  }), []);


  const handleSimulateCheckpointUpdate = useCallback(() => {
    setMockCustomsCheckpointsDataState(prevCheckpoints =>
      prevCheckpoints.map(cp => {
        const randomFactor = Math.random();
        let newStatus: MockCustomsCheckpoint['overallCustomsStatus'] = cp.overallCustomsStatus;
        let newHealth: MockCustomsCheckpoint['dppComplianceHealth'] = cp.dppComplianceHealth;

        if (randomFactor < 0.2) newStatus = 'cleared';
        else if (randomFactor < 0.4) newStatus = 'pending';
        else if (randomFactor < 0.6) newStatus = 'inspection_required';
        else newStatus = 'operational';

        if (randomFactor < 0.25) newHealth = 'good';
        else if (randomFactor < 0.5) newHealth = 'fair';
        else if (randomFactor < 0.75) newHealth = 'poor';
        else newHealth = 'unknown';

        return {
          ...cp,
          currentShipmentCount: Math.floor(Math.random() * 200) + 10,
          overallCustomsStatus: newStatus,
          dppComplianceHealth: newHealth,
          issuesDetectedLast24h: Math.floor(Math.random() * (newHealth === 'poor' ? 20 : 5)),
        };
      })
    );
    toast({
      title: "Checkpoints Updated",
      description: "Customs checkpoint data has been randomly updated (mock).",
    });
  }, [toast]);

  const handleResetGlobeView = useCallback(() => {
    if (globeRefMain.current && globeRefMain.current.pointOfView) {
      globeRefMain.current.pointOfView({ lat: 45, lng: 10, altitude: 2.5 }, 700);
    }
  }, []);

  const handleNotificationPrefChange = useCallback((prefKey: keyof typeof notificationPrefs, checked: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [prefKey]: checked }));
    toast({
      title: "Preference Updated",
      description: `${prefKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} notifications ${checked ? 'enabled' : 'disabled'}.`,
    });
  }, [toast]);

  const pointColorAccessor = useCallback((obj: MockDppPoint | MockShipmentPoint): string => {
    if ('simulatedStatus' in obj) { 
      switch (obj.simulatedStatus) {
        case 'in_transit': return SHIPMENT_IN_TRANSIT_COLOR_GLOBE;
        case 'at_customs': return SHIPMENT_AT_CUSTOMS_COLOR_GLOBE;
        case 'customs_inspection': return SHIPMENT_INSPECTION_COLOR_GLOBE;
        case 'delayed': return SHIPMENT_DELAYED_COLOR_GLOBE;
        case 'cleared': return SHIPMENT_CLEARED_COLOR_GLOBE;
        case 'data_sync_delayed': return SHIPMENT_DATA_SYNC_DELAYED_COLOR_GLOBE;
        default: return 'grey';
      }
    } else { 
      if (obj.status === 'compliant') return DPP_HEALTH_GOOD_COLOR;
      if (obj.status === 'pending') return DPP_HEALTH_FAIR_COLOR;
      if (obj.status === 'issue') return DPP_HEALTH_POOR_COLOR;
      if (obj.category === 'Electronics') return 'rgba(0, 0, 255, 0.75)';
      if (obj.category === 'Appliances') return 'rgba(128, 0, 128, 0.75)';
      if (obj.category === 'Textiles') return 'rgba(255, 192, 203, 0.75)';
      if (obj.icon) return 'rgba(255, 165, 0, 0.75)';
      return 'grey';
    }
  }, []);

  const pointRadiusAccessor = useCallback((obj: MockDppPoint | MockShipmentPoint): number => {
    if ('simulatedStatus' in obj) { 
      return 0.12; 
    }
    const baseSize = obj.size || 0.1;
    if (obj.category === 'Electronics') return baseSize * 1.2;
    if (obj.category === 'Distribution Hub') return baseSize * 1.5;
    return baseSize;
  }, []);

  const arcColorAccessor = useCallback((arc: MockArc): string | string[] => {
    if (arc.direction === 'inbound_eu') return ARC_INBOUND_EU_COLOR;
    if (arc.direction === 'outbound_eu') return ARC_OUTBOUND_EU_COLOR;
    if (arc.direction === 'internal_eu') return ARC_INTERNAL_EU_COLOR;
    return ARC_DEFAULT_COLOR;
  }, []);

  const arcStrokeAccessor = useCallback((arc: MockArc): number => arc.stroke || 0.2, []);
  
  const polygonCapColorAccessor = useCallback((feature: any) => 'rgba(0,0,0,0)', []); 
  const polygonSideColorAccessor = useCallback(() => 'rgba(0,0,0,0)', []); 
  const polygonStrokeColorAccessor = useCallback(() => 'rgba(200, 200, 200, 0.6)', []); 
  const polygonAltitudeAccessor = useCallback(() => 0.001, []); 

  const handleFocusEurope = useCallback(() => {
    if (globeRefMain.current) {
      globeRefMain.current.pointOfView({ lat: 50, lng: 15, altitude: 1.5 }, 1000);
    }
  }, []);

  const handleToggleRotation = useCallback(() => {
    if (globeRefMain.current && globeRefMain.current.controls()) {
      const newRotationState = !isGlobeRotating;
      globeRefMain.current.controls().autoRotate = newRotationState;
      globeRefMain.current.controls().autoRotateSpeed = newRotationState ? 0.3 : 0;
      setIsGlobeRotating(newRotationState);
    }
  }, [isGlobeRotating]);

  const handleToggleTradeFlows = useCallback(() => {
    setTradeFlowsVisible(prev => !prev);
  }, []);
  
  const availableTradeRouteCategories = useMemo(() => {
    const categories = new Set<string>();
    mockArcsDataState.forEach(arc => {
      const product = initialMockPointsData.find(p => p.id === arc.productId);
      if (product && product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories).sort();
  }, [mockArcsDataState]);
  
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [isControlPanelVisible, setIsControlPanelVisible] = useState(true);
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true);
  const [isAnalyticsPanelVisible, setIsAnalyticsPanelVisible] = useState(false);
  
  const handleToggleLegendVisibility = (key: string) => {
    setLegendVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const dynamicGlobeLegendMap = useMemo(() => {
    const map: Record<string, string> = {
      "Country Border": 'rgba(200, 200, 200, 0.6)',
    };
    
    if (tradeFlowsVisible) {
        map["Route (Import into EU)"] = ARC_INBOUND_EU_COLOR;
        map["Route (Export from EU)"] = ARC_OUTBOUND_EU_COLOR;
        map["Route (Internal EU)"] = ARC_INTERNAL_EU_COLOR;
        map["Route (Other)"] = ARC_DEFAULT_COLOR;
    }
    
    Object.assign(map, {
        "DPP Location (Good Compliance)": DPP_HEALTH_GOOD_COLOR,
        "DPP Location (Fair Compliance)": DPP_HEALTH_FAIR_COLOR,
        "DPP Location (Poor Compliance)": DPP_HEALTH_POOR_COLOR,
        "Shipment (In Transit)": SHIPMENT_IN_TRANSIT_COLOR_GLOBE,
        "Shipment (At Customs)": SHIPMENT_AT_CUSTOMS_COLOR_GLOBE,
        "Shipment (Inspection)": SHIPMENT_INSPECTION_COLOR_GLOBE,
        "Shipment (Cleared)": SHIPMENT_CLEARED_COLOR_GLOBE,
        "Checkpoint (DPP Good/Green 'G')": DPP_HEALTH_GOOD_COLOR,
        "Checkpoint (DPP Fair/Yellow 'F')": DPP_HEALTH_FAIR_COLOR,
        "Checkpoint (DPP Poor/Red 'P')": DPP_HEALTH_POOR_COLOR,
        "Port (Blue 'S')": CHECKPOINT_PORT_COLOR,
        "Airport (Purple 'A')": CHECKPOINT_AIRPORT_COLOR,
        "Land Border (Orange 'L')": CHECKPOINT_LAND_BORDER_COLOR,
    });
    return map;
  }, [tradeFlowsVisible]);

  const onViewNotificationHistory = useCallback(() => {
    toast({
      title: "Mock Action",
      description: "Notification history would be displayed here."
    });
  }, [toast]);


  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="p-3 border-b border-border shadow-sm bg-card flex items-center justify-between print:hidden">
        <div className="flex items-center">
           <GlobeIconLucide className="mr-2 h-6 w-6 text-primary" />
           <h1 className="text-xl font-headline font-semibold">
             DPP Global Tracker
           </h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>Back to Dashboard</Button>
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-0 relative">
        <aside className="h-full bg-card border-r border-border p-3 space-y-3 overflow-y-auto print:hidden flex flex-col">
          <div className="flex-shrink-0">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-3 cursor-pointer" onClick={() => setIsInfoPanelVisible(!isInfoPanelVisible)}>
                <CardTitle className="text-sm font-semibold flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" /> Info
                </CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${isInfoPanelVisible ? '' : '-rotate-90'}`} />
              </CardHeader>
              {isInfoPanelVisible && <InfoPanel />}
            </Card>
          </div>

          <div className="flex-shrink-0">
            <Card className="shadow-md">
               <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-3 cursor-pointer" onClick={() => setIsControlPanelVisible(!isControlPanelVisible)}>
                <CardTitle className="text-sm font-semibold flex items-center">
                    <Settings2 className="h-4 w-4 mr-2 text-primary" /> Controls
                </CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${isControlPanelVisible ? '' : '-rotate-90'}`} />
              </CardHeader>
              {isControlPanelVisible && (
                <ControlPanel 
                  onFocusEurope={handleFocusEurope}
                  onToggleRotation={handleToggleRotation}
                  isRotating={isGlobeRotating}
                  productCategories={availableTradeRouteCategories}
                  selectedCategory={tradeRouteCategoryFilter}
                  onCategoryChange={setTradeRouteCategoryFilter}
                  onToggleTradeFlows={handleToggleTradeFlows}
                  tradeFlowsVisible={tradeFlowsVisible}
                  onSimulateCheckpointUpdate={handleSimulateCheckpointUpdate}
                  onResetGlobeView={handleResetGlobeView}
                  notificationPrefs={notificationPrefs}
                  onNotificationPrefChange={handleNotificationPrefChange}
                  onViewNotificationHistory={onViewNotificationHistory}
                />
              )}
            </Card>
          </div>

          <div className="flex-grow min-h-0"> 
            <Card className="shadow-md h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-3 cursor-pointer flex-shrink-0" onClick={() => setIsLegendVisible(!isLegendVisible)}>
                  <CardTitle className="text-sm font-semibold flex items-center">
                      <Palette className="h-4 w-4 mr-2 text-primary" /> Legend
                  </CardTitle>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLegendVisible ? '' : '-rotate-90'}`} />
              </CardHeader>
              {isLegendVisible && (
                <div className="overflow-y-auto flex-grow">
                  <Legend 
                    title="" 
                    colorMap={dynamicGlobeLegendMap} 
                    className="shadow-none border-none"
                    onToggleVisibility={handleToggleLegendVisibility}
                    visibility={legendVisibility}
                  />
                </div>
              )}
            </Card>
          </div>

           <div className="flex-shrink-0 mt-auto pt-3">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-3 cursor-pointer" onClick={() => setIsAnalyticsPanelVisible(!isAnalyticsPanelVisible)}>
                <CardTitle className="text-sm font-semibold flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-primary" /> Analytics
                </CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${isAnalyticsPanelVisible ? '' : '-rotate-90'}`} />
              </CardHeader>
              {isAnalyticsPanelVisible && (
                <CardContent className="px-3 pb-3 text-xs">
                  <h4 className="font-medium mb-1">Shipments by Status:</h4>
                  <ul className="list-disc list-inside text-muted-foreground mb-2">
                    {shipmentStatusAnalyticsData.map(s => <li key={s.status}>{s.status}: {s.count}</li>)}
                  </ul>
                  <h4 className="font-medium mb-1">DPP Locations by Category:</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {dppCategoryAnalyticsData.map(c => <li key={c.category}>{c.category}: {c.count}</li>)}
                  </ul>
                  {/* Placeholder for a small chart */}
                  <div className="h-32 w-full bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground mt-2">
                    Chart Placeholder
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </aside>

        <main className="h-full w-full relative">
          {isLoadingGeoJson ? (
             <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading Geographic Data...</span>
              </div>
          ) : (
            <Suspense fallback={
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading 3D Globe Visualization...</span>
              </div>
            }>
              {isClient && (
                  <GlobeVisualization
                      globeRef={globeRefMain}
                      pointsData={combinedPointsForGlobe.filter(p => {
                        const pointCategory = 'category' in p ? p.category : 'Shipment';
                        let legendKey = "";
                        if ('simulatedStatus' in p) { 
                           legendKey = `Shipment (${p.simulatedStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())})`;
                        } else { 
                           legendKey = `DPP Location (${p.status.charAt(0).toUpperCase() + p.status.slice(1)} Compliance)`;
                        }
                        return legendVisibility[legendKey] !== false; 
                      })}
                      arcsData={filteredArcs.filter(() => {
                        const importVisible = legendVisibility["Route (Import into EU)"] !== false;
                        const exportVisible = legendVisibility["Route (Export from EU)"] !== false;
                        const internalVisible = legendVisibility["Route (Internal EU)"] !== false;
                        const otherVisible = legendVisibility["Route (Other)"] !== false;
                        return importVisible || exportVisible || internalVisible || otherVisible;
                      })}
                      polygonsData={legendVisibility["Country Border"] ? countryPolygons : []}
                      customsCheckpointsData={mockCustomsCheckpointsDataState.filter(cp => {
                        const healthKey = `Checkpoint (DPP ${cp.dppComplianceHealth.charAt(0).toUpperCase() + cp.dppComplianceHealth.slice(1)}/${cp.dppComplianceHealth.charAt(0).toUpperCase()})`;
                        const typeKey = `${cp.type.charAt(0).toUpperCase() + cp.type.slice(1).replace('_', ' ')} (${cp.type.charAt(0).toUpperCase()})`;
                        return legendVisibility[healthKey] !== false && legendVisibility[typeKey] !== false;
                      })}
                      onPointClick={handlePointClick}
                      onArcClick={handleArcClick}
                      onCheckpointClick={handleCheckpointClick}
                      pointColorAccessor={pointColorAccessor}
                      pointRadiusAccessor={pointRadiusAccessor}
                      arcColorAccessor={arcColorAccessor}
                      arcStrokeAccessor={arcStrokeAccessor}
                      polygonCapColorAccessor={polygonCapColorAccessor}
                      polygonSideColorAccessor={polygonSideColorAccessor}
                      polygonStrokeColorAccessor={polygonStrokeColorAccessor}
                      polygonAltitudeAccessor={polygonAltitudeAccessor}
                      globeBackgroundColor={GLOBE_BACKGROUND_COLOR}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                      atmosphereColor="#3a82f6"
                      atmosphereAltitude={0.25}
                  />
              )}
              </Suspense>
          )}
        </main>
      </div>
      
      {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={() => setSelectedPoint(null)} />}
      {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={() => setSelectedArc(null)} />}
      {selectedCheckpoint && <CheckpointInfoCard checkpointData={selectedCheckpoint} onClose={() => setSelectedCheckpoint(null)} onInspectProducts={handleInspectProductsAtCheckpoint} />}
      {selectedShipment && <ShipmentInfoCard shipmentData={selectedShipment} onClose={() => setSelectedShipment(null)} />}

      {inspectingCheckpoint && (
        <AlertDialog open={isInspectionModalOpen} onOpenChange={setIsInspectionModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Inspect Products at {inspectingCheckpoint.name}</AlertDialogTitle>
              <AlertDialogDescription>
                This is a mock inspection view. In a real system, you would see a list of products currently at this checkpoint ({inspectingCheckpoint.currentShipmentCount} shipments).
                <br /> For now, click "Simulate Inspection" to randomly change this checkpoint's status.
              </AlertDialogDescription>
            </AlertDialogHeader>
             <div className="my-4 p-4 bg-muted rounded-md text-sm">
                <p><strong>Checkpoint Type:</strong> {inspectingCheckpoint.type}</p>
                <p><strong>Current DPP Health:</strong> {inspectingCheckpoint.dppComplianceHealth}</p>
                <p><strong>Overall Status:</strong> {inspectingCheckpoint.overallCustomsStatus}</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setInspectingCheckpoint(null)}>Close</AlertDialogCancel>
              <Button onClick={() => {
                handleSimulateCheckpointUpdate(); 
                const updatedCp = mockCustomsCheckpointsDataState.find(cp => cp.id === inspectingCheckpoint.id);
                if(updatedCp) setInspectingCheckpoint(updatedCp); 
                toast({title: "Mock Inspection", description: `Simulated inspection process for ${inspectingCheckpoint.name}. Checkpoint data may have updated.`});
              }}>Simulate Inspection & Update Status</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="p-3 border-t border-border bg-card print:hidden">
          <Card className="shadow-md">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-base font-semibold flex items-center">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                Global Data Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 px-4 pb-4">
                <div>
                  <Label htmlFor="category-filter-main" className="text-xs font-medium">DPP Locations by Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category-filter-main" className="w-full h-9 text-xs mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div title="Filter data points and arcs up to the selected year.">
                  <Label htmlFor="year-slider-main" className="text-xs font-medium">Data Year (Up to): {yearFilter[0]}</Label>
                  <Slider
                    id="year-slider-main"
                    min={Math.min(...initialMockPointsData.map(p => p.timestamp), new Date().getFullYear() - 5)}
                    max={new Date().getFullYear()}
                    step={1}
                    value={yearFilter}
                    onValueChange={(value) => setYearFilter(value)}
                    className="mt-3"
                  />
                </div>
                <div>
                  <Label htmlFor="shipment-status-filter-main" className="text-xs font-medium">Shipment Status</Label>
                  <Select value={shipmentStatusFilter} onValueChange={(value) => setShipmentStatusFilter(value as MockShipmentPoint['simulatedStatus'] | 'all')}>
                     <SelectTrigger id="shipment-status-filter-main" className="w-full h-9 text-xs mt-1">
                       <SelectValue placeholder="Select shipment status" />
                     </SelectTrigger>
                     <SelectContent>
                       {shipmentStatusOptions.map(opt => (
                         <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                       ))}
                     </SelectContent>
                  </Select>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

const uniqueCategories = ['all', ...new Set(initialMockPointsData.map(p => p.category))];
const shipmentStatusOptions: { value: MockShipmentPoint['simulatedStatus'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All Shipment Statuses' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'at_customs', label: 'At Customs' },
  { value: 'customs_inspection', label: 'Customs Inspection' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'cleared', label: 'Cleared' },
  { value: 'data_sync_delayed', label: 'Data Sync Delayed' },
];


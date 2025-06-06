
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
import { ChartContainer } from '@/components/ui/chart';

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


const EU_BLUE_COLOR = 'rgba(0, 80, 150, 0.95)';
const NON_EU_LAND_COLOR_LIGHT_BLUE = 'rgba(173, 216, 230, 0.95)';
const BORDER_COLOR_MEDIUM_BLUE = 'rgba(70, 130, 180, 0.7)';
const GLOBE_BACKGROUND_COLOR = '#000033';

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

export const ARC_INBOUND_EU_COLOR = 'rgba(50, 120, 220, 0.8)';
export const ARC_OUTBOUND_EU_COLOR = 'rgba(30, 180, 100, 0.8)';
export const ARC_INTERNAL_EU_COLOR = 'rgba(150, 100, 200, 0.8)';
export const ARC_DEFAULT_COLOR = 'rgba(128, 128, 128, 0.7)';

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
  { id: 'SH004', lat: -33.8688, lng: 151.2093, name: 'Components Delta', size: 0.15, direction: 'other', arcId: 'arc4', productIconUrl: 'https://placehold.co/40x40.png?text=COMP', dppComplianceStatusText: 'Data Sync Delayed', dppComplianceBadgeVariant: 'secondary', simulatedStatus: 'data_sync_delayed', eta: '2024-08-20', progressPercentage: 5, ceMarkingStatus: 'not_applicable', cbamDeclarationStatus: 'not_applicable', dppComplianceNotes: ["Origin country data system offline."] },
];

const initialMockCustomsCheckpointsData: MockCustomsCheckpoint[] = [
  { id: 'cp_rotterdam', lat: 51.9225, lng: 4.47917, name: 'Port of Rotterdam', type: 'port', currentShipmentCount: 125, overallCustomsStatus: 'operational', dppComplianceHealth: 'good', averageClearanceTime: "24-48h", issuesDetectedLast24h: 2 },
  { id: 'cp_frankfurt_airport', lat: 50.0379, lng: 8.5622, name: 'Frankfurt Airport Cargo', type: 'airport', currentShipmentCount: 80, overallCustomsStatus: 'pending', dppComplianceHealth: 'fair', averageClearanceTime: "12-36h", issuesDetectedLast24h: 5 },
  { id: 'cp_dover_calais', lat: 51.1279, lng: 1.3536, name: 'Dover-Calais Crossing', type: 'land_border', currentShipmentCount: 210, overallCustomsStatus: 'inspection_required', dppComplianceHealth: 'poor', averageClearanceTime: "48-96h", issuesDetectedLast24h: 15 },
];

const SHIPMENTS_TO_SIMULATE = ['SH001', 'SH002', 'SH003', 'SH004'];
const SIMULATION_INTERVAL = 3000; 
const SIMULATION_STEP = 0.01; 

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


export default function DppGlobalTrackerPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<MockCustomsCheckpoint | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<MockShipmentPoint | null>(null);
  const [countryPolygons, setCountryPolygons] = useState<any[]>([]);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(false);
  const globeRefMain = useRef<any | undefined>();

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

  useEffect(() => {
    setIsClient(true);
    // GeoJSON fetching is currently disabled.
  }, []);

  const showShipmentToast = useCallback((shipmentId: string, title: string, description: string, variant: 'default' | 'destructive' = 'default', toastType: NotificationType) => {
    let shouldShowToast = false;
    switch (toastType) {
      case 'compliance_alert': shouldShowToast = notificationPrefs.complianceIssues; break;
      case 'delay_alert': shouldShowToast = notificationPrefs.shipmentDelays; break;
      case 'status_change': shouldShowToast = notificationPrefs.statusChanges; break;
      default: shouldShowToast = true;
    }
    if (!shouldShowToast) return;

    setLastToastForShipment(prev => {
      const now = Date.now();
      if (!prev[shipmentId] || prev[shipmentId].status !== title || (now - (prev[shipmentId].timestamp || 0) > 10000)) {
        setTimeout(() => {
          toast({ title, description, variant });
        }, 0);
        return { ...prev, [shipmentId]: { status: title, timestamp: now } };
      }
      return prev;
    });
  }, [toast, notificationPrefs]);

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
            simulatedStatus: newSimulatedStatus,
            progressPercentage: Math.round(newProgress * 100),
            dppComplianceStatusText: newDppComplianceStatusText,
            dppComplianceBadgeVariant: newDppComplianceBadgeVariant,
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
    return mockArcsDataState.filter(arc => arc.timestamp <= yearFilter[0]);
  }, [mockArcsDataState, yearFilter]);

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


  const globeLegendMap = {
    "EU Country": EU_BLUE_COLOR,
    "Non-EU Country": NON_EU_LAND_COLOR_LIGHT_BLUE,
    "Country Border": BORDER_COLOR_MEDIUM_BLUE,
    "Route (Inbound EU)": ARC_INBOUND_EU_COLOR,
    "Route (Outbound EU)": ARC_OUTBOUND_EU_COLOR,
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
  };

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
      globeRefMain.current.pointOfView({ lat: 50, lng: 15, altitude: 2.2 }, 700);
    }
  }, []);

  const handleNotificationPrefChange = useCallback((prefKey: keyof typeof notificationPrefs, checked: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [prefKey]: checked }));
    toast({
      title: "Preference Updated",
      description: `${prefKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} notifications ${checked ? 'enabled' : 'disabled'}.`,
    });
  }, [toast]);

  return (
    <div className="space-y-8 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker
        </h1>
      </div>
      {(currentRole === 'auditor' || currentRole === 'admin') && (
         <Alert variant="default" className="bg-info/10 border-info/50 text-info-foreground">
            <Info className="h-4 w-4 !text-info" />
            <AlertTitle className="!text-info">Auditor/Admin View</AlertTitle>
            <AlertDescription>
              You are viewing an enhanced version of the tracker with additional details.
            </AlertDescription>
          </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filters & Controls</CardTitle>
          <CardDescription>Adjust filters to refine data and control globe actions.</CardDescription>
        </CardHeader>
        <CardContent>
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
            <div title="Filter active shipments by their current simulated status.">
              <Label htmlFor="shipment-status-filter" className="text-sm font-medium">Filter by Shipment Status</Label>
              <Select value={shipmentStatusFilter} onValueChange={(value) => setShipmentStatusFilter(value as MockShipmentPoint['simulatedStatus'] | 'all')}>
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
                 <Button onClick={handleSimulateCheckpointUpdate} variant="outline" className="w-full sm:w-auto" title="Simulate random updates to customs checkpoint data.">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Simulate Checkpoint Update
                 </Button>
                <Button onClick={handleResetGlobeView} variant="outline" className="w-full sm:w-auto" title="Reset the globe to its default position and zoom level.">
                    <GlobeIconLucide className="mr-2 h-4 w-4" /> Reset Globe View
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Analytics Overview (Mock Data)
            </CardTitle>
            <CardDescription>Summary of mock shipment and DPP data.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Shipments by Status:</h4>
              <ul className="text-xs list-disc list-inside pl-2 text-muted-foreground">
                {shipmentStatusAnalyticsData.map(item => <li key={item.status}>{item.status}: {item.count}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">DPP Locations by Category:</h4>
              <ul className="text-xs list-disc list-inside pl-2 text-muted-foreground">
                {dppCategoryAnalyticsData.map(item => <li key={item.category}>{item.category}: {item.count}</li>)}
              </ul>
            </div>
            <div className="h-[200px] w-full mt-2 md:col-span-2">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={shipmentStatusAnalyticsData} layout="vertical" margin={{ left: 30, right:10 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="count" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis type="category" dataKey="status" stroke="hsl(var(--muted-foreground))" width={100} interval={0} fontSize={10}/>
                  <RechartsTooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                    labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={15}/>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <BellRing className="mr-2 h-5 w-5 text-primary" /> Notification Preferences (Mock)
            </CardTitle>
            <CardDescription>Control which simulated toast notifications you receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                  <Label htmlFor="compliance-issues-pref" className="text-sm font-medium">Show Compliance Issue Toasts</Label>
                  <Switch id="compliance-issues-pref" checked={notificationPrefs.complianceIssues} onCheckedChange={(checked) => handleNotificationPrefChange('complianceIssues', checked)} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                  <Label htmlFor="shipment-delays-pref" className="text-sm font-medium">Show Shipment Delay Toasts</Label>
                  <Switch id="shipment-delays-pref" checked={notificationPrefs.shipmentDelays} onCheckedChange={(checked) => handleNotificationPrefChange('shipmentDelays', checked)} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                  <Label htmlFor="status-changes-pref" className="text-sm font-medium">Show General Status Change Toasts</Label>
                  <Switch id="status-changes-pref" checked={notificationPrefs.statusChanges} onCheckedChange={(checked) => handleNotificationPrefChange('statusChanges', checked)} />
              </div>
              <Button variant="outline" size="sm" onClick={() => toast({title: "Mock Action", description:"Notification history would be displayed here."})}>
                <HistoryIcon className="mr-2 h-4 w-4" /> View Notification History (Mock)
              </Button>
          </CardContent>
        </Card>
      </div>


      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Global Product Passport Visualization</CardTitle>
          <CardDescription>Interact with the globe to explore product origins, supply chains, and compliance status across regions. (Diagnosis: Minimal hardcoded data being used)</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-[60vh] md:h-[600px] rounded-md overflow-hidden border relative bg-card"
            style={{ backgroundColor: GLOBE_BACKGROUND_COLOR }}
          >
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
                        // Temporarily removing data props for diagnosis
                        // pointsData={combinedPointsForGlobe}
                        // arcsData={filteredArcs}
                        // polygonsData={countryPolygons}
                        // customsCheckpointsData={mockCustomsCheckpointsDataState}
                        // onPointClick={handlePointClick}
                        // onArcClick={handleArcClick}
                        // onCheckpointClick={handleCheckpointClick}
                        // pointColorAccessor={pointColorAccessor}
                        // pointRadiusAccessor={pointRadiusAccessor}
                        // arcColorAccessor={arcColorAccessor}
                        // arcStrokeAccessor={arcStrokeAccessor}
                        // polygonCapColorAccessor={polygonCapColorAccessor}
                        // polygonSideColorAccessor={polygonSideColorAccessor}
                        // polygonStrokeColorAccessor={polygonStrokeColorAccessor}
                        // globeBackgroundColor={GLOBE_BACKGROUND_COLOR} // Passed from const
                        // globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" // Passed from const
                    />
                )}
                </Suspense>
            )}
          </div>
          <div className="mt-6">
             <Legend title="Map Legend" colorMap={globeLegendMap} className="mt-2 mx-auto w-full sm:w-auto" />
          </div>
        </CardContent>
      </Card>

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

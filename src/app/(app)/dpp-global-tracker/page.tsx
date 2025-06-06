
"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { feature as topojsonFeature } from 'topojson-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info, Settings2, Layers as LayersIcon, Filter, Palette, MapPin, TrendingUp, Link as LinkIcon, Route, Ship, Plane, Truck, Train, Package as PackageIcon, Zap, Building, Recycle as RecycleIcon, ShieldCheck, ShieldAlert, ShieldQuestion, Building2 as LandBorderIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard';
import CheckpointInfoCard from '@/components/dpp-tracker/CheckpointInfoCard';
import ShipmentInfoCard from '@/components/dpp-tracker/ShipmentInfoCard';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';

const GlobeVisualization = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));

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
  direction: 'inbound_eu' | 'outbound_eu' | 'internal_eu'; 
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string | string[]; 
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
}

export interface MockShipmentPoint {
  id: string; 
  lat: number;
  lng: number;
  name: string; 
  size: number;
  direction: 'inbound_eu' | 'outbound_eu' | 'internal_eu';
  color?: string; 
  arcId: string; 
  arcLabel?: string; 
  productIconUrl?: string;
  dppComplianceStatusText?: string;
  dppComplianceBadgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
  eta?: string; 
  progressPercentage?: number; 
  // For simulation
  currentLat?: number;
  currentLng?: number;
  simulationProgress?: number; // 0 to 1
}


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
const WHITE_BACKGROUND_COLOR = 'rgba(255, 255, 255, 1)';

export const DPP_HEALTH_GOOD_COLOR = 'rgba(76, 175, 80, 0.9)'; 
export const DPP_HEALTH_FAIR_COLOR = 'rgba(255, 235, 59, 0.9)'; 
export const DPP_HEALTH_POOR_COLOR = 'rgba(244, 67, 54, 0.9)'; 
export const CHECKPOINT_PORT_COLOR = 'rgba(60, 70, 180, 0.9)'; 
export const CHECKPOINT_AIRPORT_COLOR = 'rgba(100, 60, 170, 0.9)';
export const CHECKPOINT_LAND_BORDER_COLOR = 'rgba(200, 100, 30, 0.9)';

const SHIPMENT_INBOUND_EU_COLOR_GLOBE = 'rgba(0, 123, 255, 0.9)'; 
const SHIPMENT_OUTBOUND_EU_COLOR_GLOBE = 'rgba(40, 167, 69, 0.9)'; 
const SHIPMENT_INTERNAL_EU_COLOR_GLOBE = 'rgba(255, 193, 7, 0.9)'; 


const initialMockPointsData: MockDppPoint[] = [
  { id: 'eu_electronics_factory', lat: 50.8503, lng: 4.3517, name: 'EU Electronics Hub (Brussels)', size: 0.3, category: 'Electronics', status: 'compliant', timestamp: 2024, manufacturer: 'EuroChip', gtin: '111222333', icon: PackageIcon },
  { id: 'asia_textile_factory', lat: 22.3193, lng: 114.1694, name: 'Asia Textile Plant (Hong Kong)', size: 0.25, category: 'Textiles', status: 'pending', timestamp: 2023, manufacturer: 'SilkRoad Co.', gtin: '444555666', icon: Zap },
  { id: 'us_appliance_dist', lat: 34.0522, lng: -118.2437, name: 'US Appliance Distributor (LA)', size: 0.2, category: 'Appliances', status: 'compliant', timestamp: 2024, manufacturer: 'HomeGoods Inc.', gtin: '777888999', icon: Building },
  { id: 'sa_material_source', lat: -14.2350, lng: -51.9253, name: 'Brazil Raw Material Site', size: 0.15, category: 'Raw Material Source', status: 'unknown', timestamp: 2022, icon: LayersIcon },
  { id: 'africa_recycling_hub', lat: -1.2921, lng: 36.8219, name: 'Nairobi Recycling Center', size: 0.18, category: 'Recycling Facility', status: 'compliant', timestamp: 2023, icon: RecycleIcon },
  { id: 'eu_distribution_frankfurt', lat: 50.1109, lng: 8.6821, name: 'Frankfurt Distribution Center', size: 0.22, category: 'Distribution Hub', status: 'compliant', timestamp: 2024, icon: Truck },
  { id: 'china_manufacturing_shenzhen', lat: 22.5431, lng: 114.0579, name: 'Shenzhen Electronics Mfg.', size: 0.3, category: 'Electronics', status: 'pending', timestamp: 2023, manufacturer: 'GlobalElectro', gtin: '101010101', icon: PackageIcon },
  { id: 'india_appliances_bangalore', lat: 12.9716, lng: 77.5946, name: 'Bangalore Appliance Factory', size: 0.25, category: 'Appliances', status: 'compliant', timestamp: 2024, manufacturer: 'IndiaHome', gtin: '202020202', icon: Building },
];

const initialMockArcsData: MockArc[] = [
  { id: 'arc1', shipmentId: 'SH001', direction: 'inbound_eu', startLat: 22.3193, startLng: 114.1694, endLat: 50.8503, endLng: 4.3517, label: 'Textiles to EU', timestamp: 2023, transportMode: 'sea', productId: 'DPP002', color: VIBRANT_TEAL },
  { id: 'arc2', shipmentId: 'SH002', direction: 'outbound_eu', startLat: -14.2350, startLng: -51.9253, endLat: 22.3193, endLng: 114.1694, label: 'Materials to Asia', timestamp: 2022, transportMode: 'sea', color: SATURATED_BLUE },
  { id: 'arc3', shipmentId: 'SH003', direction: 'outbound_eu', startLat: 50.8503, startLng: 4.3517, endLat: 34.0522, endLng: -118.2437, label: 'Electronics to US', timestamp: 2024, transportMode: 'air', productId: 'DPP001', color: ACCENT_PURPLE },
  { id: 'arc4', shipmentId: 'SH004', direction: 'inbound_eu', startLat: 22.5431, startLng: 114.0579, endLat: 50.1109, endLng: 8.6821, label: 'Electronics to Frankfurt', timestamp: 2023, transportMode: 'rail', color: SATURATED_BLUE },
  { id: 'arc5', shipmentId: 'SH005', direction: 'internal_eu', startLat: 12.9716, startLng: 77.5946, endLat: -1.2921, endLng: 36.8219, label: 'Appliances EOL to Nairobi', timestamp: 2024, transportMode: 'road', productId: 'DPP005', color: VIBRANT_TEAL },
];

const initialMockShipmentPointsData: MockShipmentPoint[] = initialMockArcsData.map((arc, index) => {
    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + (index + 1) * 7); 
    return {
        id: arc.shipmentId,
        lat: arc.startLat, // Start at the arc's origin for simulation
        lng: arc.startLng, // Start at the arc's origin for simulation
        currentLat: arc.startLat,
        currentLng: arc.startLng,
        simulationProgress: 0,
        name: `Shipment ${arc.shipmentId}`,
        size: 0.15, 
        direction: arc.direction,
        arcId: arc.id,
        arcLabel: arc.label,
        productIconUrl: `https://placehold.co/50x50.png?text=${arc.productId ? arc.productId.slice(-3) : arc.shipmentId.slice(-3)}`,
        dppComplianceStatusText: index % 3 === 0 ? "All DPP Data Verified" : (index % 3 === 1 ? "Pending Battery Passport" : "CBAM Declaration Missing"),
        dppComplianceBadgeVariant: index % 3 === 0 ? "default" : (index % 3 === 1 ? "outline" : "destructive"),
        eta: etaDate.toISOString().split('T')[0],
        progressPercentage: 0, 
    };
});


const initialMockCustomsCheckpointsData: MockCustomsCheckpoint[] = [
  { id: 'port_rotterdam', lat: 51.9480, lng: 4.1437, name: 'Port of Rotterdam Customs', type: 'port', currentShipmentCount: 1250, overallCustomsStatus: 'cleared', dppComplianceHealth: 'good', icon: Ship },
  { id: 'port_hamburg', lat: 53.5465, lng: 9.9724, name: 'Port of Hamburg Customs', type: 'port', currentShipmentCount: 980, overallCustomsStatus: 'pending', dppComplianceHealth: 'fair', icon: Ship },
  { id: 'airport_frankfurt', lat: 50.0379, lng: 8.5622, name: 'Frankfurt Airport Customs', type: 'airport', currentShipmentCount: 750, overallCustomsStatus: 'inspection_required', dppComplianceHealth: 'poor', icon: Plane },
  { id: 'airport_cdg', lat: 49.0097, lng: 2.5479, name: 'Paris CDG Airport Customs', type: 'airport', currentShipmentCount: 620, overallCustomsStatus: 'operational', dppComplianceHealth: 'good', icon: Plane },
  { id: 'port_la', lat: 33.7292, lng: -118.2620, name: 'Port of Los Angeles Customs', type: 'port', currentShipmentCount: 1500, overallCustomsStatus: 'operational', dppComplianceHealth: 'unknown', icon: Ship },
  { id: 'port_shanghai', lat: 31.3925, lng: 121.5201, name: 'Port of Shanghai Customs', type: 'port', currentShipmentCount: 2100, overallCustomsStatus: 'cleared', dppComplianceHealth: 'good', icon: Ship },
  { id: 'border_pl_ua', lat: 50.0792, lng: 23.8607, name: 'PL-UA Land Border Crossing', type: 'land_border', currentShipmentCount: 350, overallCustomsStatus: 'pending', dppComplianceHealth: 'fair', icon: LandBorderIcon }
];


const euMemberCountryCodes = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

const Legend: React.FC<{ title: string; colorMap: Record<string, string>, className?: string }> = ({ title, colorMap, className }) => (
  <Card className={cn("shadow-md", className)}>
    <CardHeader className="pb-2 pt-3 px-3">
      <CardTitle className="text-sm font-semibold flex items-center">
        <Palette className="h-4 w-4 mr-2 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-3 pb-3 space-y-1">
      {Object.entries(colorMap).map(([name, color]) => (
        <div key={name} className="flex items-center text-xs">
          <span className="h-3 w-3 rounded-sm mr-2 border" style={{ backgroundColor: color.startsWith("rgba") || color.startsWith("#") ? color : undefined, 
            backgroundImage: name.toLowerCase().includes("gradient") || name.toLowerCase().includes(" to ") ? `linear-gradient(to right, ${color.split(' to ')[0]}, ${color.split(' to ')[1] || color.split(' to ')[0]})` : undefined
          }} />
          <span>{name}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const DppGlobalTrackerClientContainer: React.FC<any & {isClient: boolean}> = ({ isClient, ...globeProps }) => {
  if (!isClient) {
    return (
      <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Globe Context...</span>
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-card" style={{ position: 'relative', zIndex: 1 }}>
      <Suspense fallback={
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading 3D Globe Visualization...</span>
        </div>
      }>
        <GlobeVisualization {...globeProps} />
      </Suspense>
    </div>
  );
};

const SHIPMENTS_TO_SIMULATE = ['SH001', 'SH004']; // IDs of shipments to simulate movement for
const SIMULATION_INTERVAL = 2000; // milliseconds
const SIMULATION_STEP = 0.02; // progress per interval (e.g., 0.02 means 50 steps to complete)

export default function DppGlobalTrackerPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<MockCustomsCheckpoint | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<MockShipmentPoint | null>(null); 
  const [countryPolygons, setCountryPolygons] = useState<any[]>([]);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);
  
  const [yearFilter, setYearFilter] = useState<number[]>([new Date().getFullYear()]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  const [mockDppPointsData, setMockDppPointsData] = useState<MockDppPoint[]>(initialMockPointsData);
  const [mockArcsDataState, setMockArcsDataState] = useState<MockArc[]>(initialMockArcsData);
  const [mockShipmentPointsDataState, setMockShipmentPointsDataState] = useState<MockShipmentPoint[]>(initialMockShipmentPointsData);
  const [mockCustomsCheckpointsDataState, setMockCustomsCheckpointsDataState] = useState<MockCustomsCheckpoint[]>(initialMockCustomsCheckpointsData);


  useEffect(() => {
    setIsClient(true);
    setIsLoadingGeoJson(true);
    fetch('//unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then(countries => {
        const countryFeatures = countries.objects.countries.geometries.map((obj: any) => topojsonFeature(countries, obj));
        setCountryPolygons(countryFeatures);
        setIsLoadingGeoJson(false);
      })
      .catch(err => {
        console.error("Error fetching GeoJSON data:", err);
        setIsLoadingGeoJson(false);
      });
  }, []);

  // Shipment Movement Simulation Effect
  useEffect(() => {
    let simulationToastShown = false;
    const intervalId = setInterval(() => {
      if (!simulationToastShown && SHIPMENTS_TO_SIMULATE.length > 0) {
        toast({
          title: "Shipment Simulation Active",
          description: "Mock shipments are now moving on the globe.",
        });
        simulationToastShown = true;
      }

      setMockShipmentPointsDataState(prevShipments =>
        prevShipments.map(shipment => {
          if (SHIPMENTS_TO_SIMULATE.includes(shipment.id)) {
            const arc = mockArcsDataState.find(a => a.id === shipment.arcId);
            if (!arc) return shipment;

            let currentSimProgress = shipment.simulationProgress || 0;
            if (currentSimProgress >= 1) return { ...shipment, lat: arc.endLat, lng: arc.endLng, progressPercentage: 100 }; // Stop at end

            currentSimProgress += SIMULATION_STEP;
            if (currentSimProgress > 1) currentSimProgress = 1;

            const newLat = arc.startLat + (arc.endLat - arc.startLat) * currentSimProgress;
            const newLng = arc.startLng + (arc.endLng - arc.startLng) * currentSimProgress;
            
            return {
              ...shipment,
              lat: newLat,
              lng: newLng,
              currentLat: newLat, // Update currentLat/Lng if you use these specific fields
              currentLng: newLng,
              simulationProgress: currentSimProgress,
              progressPercentage: Math.round(currentSimProgress * 100),
            };
          }
          return shipment;
        })
      );
    }, SIMULATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, [mockArcsDataState, toast]); // Add toast to dependencies if used inside


  const filteredDppPoints = useMemo(() => {
    return mockDppPointsData.filter(point => {
      const yearMatch = point.timestamp <= yearFilter[0];
      const categoryMatch = categoryFilter === 'all' || point.category === categoryFilter;
      return yearMatch && categoryMatch;
    });
  }, [mockDppPointsData, yearFilter, categoryFilter]);

  const filteredArcs = useMemo(() => {
    return mockArcsDataState.filter(arc => {
      const yearMatch = arc.timestamp <= yearFilter[0];
      return yearMatch;
    });
  }, [mockArcsDataState, yearFilter]);

  // Shipment points are now directly taken from state, as their lat/lng will be updated by simulation
  const combinedPointsForGlobe = useMemo(() => {
    const visibleArcIds = new Set(filteredArcs.map(arc => arc.id));
    const currentShipments = mockShipmentPointsDataState.filter(sp => visibleArcIds.has(sp.arcId));
    return [...filteredDppPoints, ...currentShipments];
  }, [filteredDppPoints, mockShipmentPointsDataState, filteredArcs]);


  const pointColorAccessor = useCallback((point: MockDppPoint | MockShipmentPoint) => {
    if ('direction' in point && point.direction) { 
      const shipment = point as MockShipmentPoint;
      switch (shipment.direction) {
        case 'inbound_eu': return SHIPMENT_INBOUND_EU_COLOR_GLOBE;
        case 'outbound_eu': return SHIPMENT_OUTBOUND_EU_COLOR_GLOBE;
        case 'internal_eu': return SHIPMENT_INTERNAL_EU_COLOR_GLOBE;
        default: return GREY_COLOR;
      }
    } else { 
      const dppPoint = point as MockDppPoint;
      if (dppPoint.icon) return 'rgba(0,0,0,0)'; 
      switch (dppPoint.category) {
        case 'Electronics': return SATURATED_BLUE;
        case 'Appliances': return VIBRANT_TEAL;
        case 'Textiles': return ACCENT_PURPLE;
        case 'Raw Material Source': return BROWN_COLOR;
        case 'Distribution Hub': return ORANGE_COLOR;
        case 'Recycling Facility': return DARK_GREEN_COLOR;
        default: return GREY_COLOR;
      }
    }
  }, []);
  
  const pointRadiusAccessor = useCallback((point: MockDppPoint | MockShipmentPoint) => {
    if ('direction' in point && point.direction) { 
      return 0.12; 
    } else { 
       const dppPoint = point as MockDppPoint;
      return dppPoint.size * 0.8 + 0.1;
    }
  }, []);

  const handlePointClick = useCallback((point: MockDppPoint | MockShipmentPoint) => {
    if ('direction' in point && point.direction) { 
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

  const handleArcClick = useCallback((arc: MockArc) => {
    setSelectedArc(arc);
    setSelectedPoint(null);
    setSelectedCheckpoint(null);
    setSelectedShipment(null);
  }, []);

  const handleCheckpointClick = useCallback((checkpoint: MockCustomsCheckpoint) => {
    setSelectedCheckpoint(checkpoint);
    setSelectedPoint(null);
    setSelectedArc(null);
    setSelectedShipment(null);
  }, []);

  const polygonCapColorAccessor = useCallback((feat: any) => {
    const countryCode = feat.properties?.ISO_A2 || feat.properties?.iso_a2;
    return euMemberCountryCodes.includes(countryCode) ? EU_BLUE_COLOR : NON_EU_LAND_COLOR_LIGHT_BLUE;
  }, []);
  const polygonSideColorAccessor = useCallback(() => 'rgba(0, 0, 0, 0)', []);
  const polygonStrokeColorAccessor = useCallback(() => BORDER_COLOR_MEDIUM_BLUE, []);
  
  const uniqueCategories = useMemo(() => ['all', ...new Set(initialMockPointsData.map(p => p.category))], []);

  const globeLegendMap = {
    "EU Member State": EU_BLUE_COLOR,
    "Non-EU Country": NON_EU_LAND_COLOR_LIGHT_BLUE,
    "Country Borders": BORDER_COLOR_MEDIUM_BLUE,
    "Globe Background": WHITE_BACKGROUND_COLOR,
    "Checkpoint (DPP Good)": DPP_HEALTH_GOOD_COLOR,
    "Checkpoint (DPP Fair)": DPP_HEALTH_FAIR_COLOR,
    "Checkpoint (DPP Poor)": DPP_HEALTH_POOR_COLOR,
    "Port (DPP Unknown/Operational)": CHECKPOINT_PORT_COLOR,
    "Airport (DPP Unknown/Operational)": CHECKPOINT_AIRPORT_COLOR,
    "Land Border (DPP Unknown/Operational)": CHECKPOINT_LAND_BORDER_COLOR,
    "Electronics Point": SATURATED_BLUE,
    "Appliances Point": VIBRANT_TEAL,
    "Textiles Point": ACCENT_PURPLE,
    "Raw Material Site": BROWN_COLOR,
    "Distribution Hub": ORANGE_COLOR,
    "Recycling Facility": DARK_GREEN_COLOR,
    "Shipment (Inbound EU)": SHIPMENT_INBOUND_EU_COLOR_GLOBE,
    "Shipment (Outbound EU)": SHIPMENT_OUTBOUND_EU_COLOR_GLOBE,
    "Shipment (Internal EU)": SHIPMENT_INTERNAL_EU_COLOR_GLOBE,
    "Sea Route": `${SATURATED_BLUE} to ${VIBRANT_TEAL}`,
    "Air Route": ACCENT_PURPLE,
    "Road Route": ORANGE_COLOR,
    "Rail Route": CORNFLOWER_BLUE_COLOR,
    "Other Point/Route": GREY_COLOR,
  };

  const handleSimulateCheckpointUpdate = () => {
    if (mockCustomsCheckpointsDataState.length === 0) {
      toast({ title: "No Checkpoints", description: "No customs checkpoints available to update.", variant: "default" });
      return;
    }

    setMockCustomsCheckpointsDataState(prevCheckpoints => {
      const updatedCheckpoints = [...prevCheckpoints];
      const numToUpdate = Math.min(2, updatedCheckpoints.length);
      const updatedNames: string[] = [];

      for (let i = 0; i < numToUpdate; i++) {
        const randomIndex = Math.floor(Math.random() * updatedCheckpoints.length);
        const checkpointToUpdate = { ...updatedCheckpoints[randomIndex] };

        const overallStatuses = ['cleared', 'pending', 'inspection_required', 'operational'] as const;
        const dppHealths = ['good', 'fair', 'poor', 'unknown'] as const;
        
        checkpointToUpdate.overallCustomsStatus = overallStatuses[Math.floor(Math.random() * overallStatuses.length)];
        checkpointToUpdate.dppComplianceHealth = dppHealths[Math.floor(Math.random() * dppHealths.length)];
        
        updatedCheckpoints[randomIndex] = checkpointToUpdate;
        updatedNames.push(checkpointToUpdate.name);
      }
      
      if (selectedCheckpoint && updatedNames.some(name => name === selectedCheckpoint.name)) {
        const updatedSelected = updatedCheckpoints.find(cp => cp.id === selectedCheckpoint.id);
        if (updatedSelected) setSelectedCheckpoint(updatedSelected);
      }
      
      toast({
        title: "Mock Checkpoint Statuses Updated",
        description: `Updated: ${updatedNames.join(', ')}`,
      });
      return updatedCheckpoints;
    });
  };

  return (
    <div className="space-y-8 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Global Product Passport Visualization</CardTitle>
          <CardDescription>Interact with the globe to explore product origins, supply chains, and compliance status across regions. Shipment simulation is active.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
            <div>
              <Label htmlFor="category-filter" className="text-sm font-medium">Filter by Category (Locations)</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="year-slider" className="text-sm font-medium">Filter by Year (Up to): {yearFilter[0]}</Label>
              <Slider
                id="year-slider"
                min={Math.min(...initialMockPointsData.map(p => p.timestamp), ...initialMockArcsData.map(a => a.timestamp), new Date().getFullYear() - 5)}
                max={new Date().getFullYear()}
                step={1}
                value={yearFilter}
                onValueChange={(value) => setYearFilter(value)}
                className="mt-2"
              />
            </div>
            <div>
                 <Button onClick={handleSimulateCheckpointUpdate} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Simulate Checkpoint Update
                 </Button>
            </div>
          </div>

          <div
            className="w-full h-[600px] rounded-md overflow-hidden border relative bg-card"
          >
            {isLoadingGeoJson ? (
                 <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading Geographic Data...</span>
                </div>
            ) : (
                <DppGlobalTrackerClientContainer
                    isClient={isClient}
                    pointsData={combinedPointsForGlobe} 
                    arcsData={filteredArcs}
                    labelsData={[]} 
                    polygonsData={countryPolygons}
                    customsCheckpointsData={mockCustomsCheckpointsDataState}
                    polygonCapColorAccessor={polygonCapColorAccessor}
                    polygonSideColorAccessor={polygonSideColorAccessor}
                    polygonStrokeColorAccessor={polygonStrokeColorAccessor}
                    onPointClick={handlePointClick} 
                    onArcClick={handleArcClick}
                    onCheckpointClick={handleCheckpointClick}
                    pointColorAccessor={pointColorAccessor} 
                    pointRadiusAccessor={pointRadiusAccessor} 
                    arcColorAccessor={(arc: MockArc) => arc.color} 
                    arcStrokeAccessor={(arc: MockArc) => (arc.stroke || 0.2) + (arc.productId ? 0.1 : 0)}
                    globeBackgroundColor={WHITE_BACKGROUND_COLOR}
                />
            )}
          </div>

          <div className="mt-6">
             <Legend title="Map Legend" colorMap={globeLegendMap} className="mt-2 mx-auto w-fit sm:w-auto" />
          </div>
        </CardContent>
      </Card>

      {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={() => setSelectedPoint(null)} />}
      {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={() => setSelectedArc(null)} />}
      {selectedCheckpoint && <CheckpointInfoCard checkpointData={selectedCheckpoint} onClose={() => setSelectedCheckpoint(null)} />}
      {selectedShipment && <ShipmentInfoCard shipmentData={selectedShipment} onClose={() => setSelectedShipment(null)} />} 

    </div>
  );
}

    

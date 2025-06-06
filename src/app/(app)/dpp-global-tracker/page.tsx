
"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info, Settings2, Layers as LayersIcon, Filter, Palette, MapPin, TrendingUp, Link as LinkIcon, Route, Ship, Plane, Truck, Train, Package as PackageIcon, Zap, Building, Recycle as RecycleIcon, ShieldCheck, ShieldAlert, ShieldQuestion, Building2 as LandBorderIcon, RefreshCw, SearchCheck, BarChart3, BellRing, History as HistoryIcon, ChevronDown, AlertTriangle as AlertTriangleIcon, PaletteIcon, CheckSquare, Tag, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useRouter } from 'next/navigation';

// Dynamically import GlobeVisualization to ensure it's client-side only
const GlobeVisualization = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));


export interface MockDppPoint {
  id: string; lat: number; lng: number; name: string; size: number; category: 'Electronics' | 'Appliances' | 'Textiles' | 'Raw Material Source' | 'Distribution Hub' | 'Recycling Facility'; status: 'compliant' | 'pending' | 'issue' | 'unknown'; timestamp: number; manufacturer?: string; gtin?: string; complianceSummary?: string; color?: string; icon?: React.ElementType;
}
export interface MockArc {
  id: string; shipmentId: string; direction: 'inbound_eu' | 'outbound_eu' | 'internal_eu' | 'other'; startLat: number; startLng: number; endLat: number; endLng: number; label?: string; stroke?: number; timestamp: number; transportMode?: 'sea' | 'air' | 'road' | 'rail'; productId?: string; productCategory?: string; dppCompliant?: boolean; value?: number; 
}
export interface MockCustomsCheckpoint {
  id: string; lat: number; lng: number; name: string; type: 'port' | 'airport' | 'land_border'; currentShipmentCount: number; overallCustomsStatus: 'cleared' | 'pending' | 'inspection_required' | 'operational'; dppComplianceHealth: 'good' | 'fair' | 'poor' | 'unknown'; icon?: React.ElementType; averageClearanceTime: string; issuesDetectedLast24h: number;
}
export interface MockShipmentPoint {
  id: string; lat: number; lng: number; name: string; size: number; direction: 'inbound_eu' | 'outbound_eu' | 'internal_eu' | 'other'; color?: string; arcId: string; arcLabel?: string; productIconUrl?: string; dppComplianceStatusText?: string; dppComplianceBadgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive'; eta?: string; progressPercentage?: number; currentLat?: number; currentLng?: number; simulationProgress?: number; simulatedStatus: 'in_transit' | 'at_customs' | 'customs_inspection' | 'delayed' | 'cleared' | 'data_sync_delayed'; ceMarkingStatus: 'valid' | 'missing' | 'pending_verification'; cbamDeclarationStatus: 'submitted' | 'required' | 'cleared' | 'not_applicable'; dppComplianceNotes: string[];
}

const EU_BLUE_COLOR = '#00008B'; // Dark Blue for EU countries
const NON_EU_LAND_COLOR_LIGHT_BLUE = '#D1D5DB'; // Light Grey for Non-EU countries
const COUNTRY_BORDER_COLOR = '#000000'; // Black for borders
const GLOBE_BACKGROUND_COLOR = '#0a0a0a'; // Dark space/night sky

const EU_MEMBER_STATES = [ "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"];

const SHIPMENT_IN_TRANSIT_COLOR_GLOBE = 'rgba(59, 130, 246, 0.8)'; // Blue
const SHIPMENT_AT_CUSTOMS_COLOR_GLOBE = 'rgba(245, 158, 11, 0.8)'; // Amber
const SHIPMENT_CUSTOMS_INSPECTION_COLOR_GLOBE = 'rgba(239, 68, 68, 0.8)'; // Red
const SHIPMENT_DELAYED_COLOR_GLOBE = 'rgba(249, 115, 22, 0.8)'; // Orange
const SHIPMENT_CLEARED_COLOR_GLOBE = 'rgba(34, 197, 94, 0.8)'; // Green
const SHIPMENT_DATA_SYNC_DELAYED_COLOR_GLOBE = 'rgba(107, 114, 128, 0.7)'; // Gray

const DPP_COMPLIANT_COLOR = 'rgba(16, 185, 129, 0.7)'; // Emerald 500
const DPP_PENDING_COLOR = 'rgba(245, 158, 11, 0.7)'; // Amber 500
const DPP_ISSUE_COLOR = 'rgba(239, 68, 68, 0.7)'; // Red 500
const DPP_UNKNOWN_COLOR = 'rgba(156, 163, 175, 0.6)'; // Gray 400

const DPP_CATEGORY_COLORS: Record<string, string> = {
  'Electronics': 'rgba(99, 102, 241, 0.8)', // Indigo
  'Appliances': 'rgba(20, 184, 166, 0.8)', // Teal
  'Textiles': 'rgba(236, 72, 153, 0.8)', // Pink
  'Raw Material Source': 'rgba(139, 92, 246, 0.8)', // Violet
  'Distribution Hub': 'rgba(245, 158, 11, 0.8)', // Amber
  'Recycling Facility': 'rgba(16, 185, 129, 0.8)', // Emerald
};

const ARC_INBOUND_EU_COLOR = 'rgba(16, 185, 129, 0.7)'; // Emerald
const ARC_OUTBOUND_EU_COLOR = 'rgba(249, 115, 22, 0.7)'; // Orange
const ARC_INTERNAL_EU_COLOR = 'rgba(99, 102, 241, 0.7)'; // Indigo
const ARC_OTHER_COLOR = 'rgba(107, 114, 128, 0.6)'; // Gray

const DPP_HEALTH_GOOD_COLOR = 'rgba(52, 211, 153, 0.9)';
const DPP_HEALTH_FAIR_COLOR = 'rgba(251, 191, 36, 0.9)';
const DPP_HEALTH_POOR_COLOR = 'rgba(244, 67, 54, 0.9)';
const CHECKPOINT_PORT_COLOR = 'rgba(60, 70, 180, 0.9)';
const CHECKPOINT_AIRPORT_COLOR = 'rgba(100, 60, 170, 0.9)';
const CHECKPOINT_LAND_BORDER_COLOR = 'rgba(200, 100, 30, 0.9)';


export default function DppGlobalTrackerPage() {
  const [isClient, setIsClient] = useState(false);
  const globeRefMain = useRef<any | undefined>();
  const [countryPolygons, setCountryPolygons] = useState<any[]>([]);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);
  const [geoJsonError, setGeoJsonError] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<MockCustomsCheckpoint | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<MockShipmentPoint | null>(null);
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false); // Default to hidden
  const [showDPPPoints, setShowDPPPoints] = useState(true);
  const [showTradeArcs, setShowTradeArcs] = useState(true);
  const [showCustomsCheckpoints, setShowCustomsCheckpoints] = useState(true);
  const [showShipmentMarkers, setShowShipmentMarkers] = useState(true);
  const [arcAnimationSpeed, setArcAnimationSpeed] = useState(0.5);
  const [pointSizeMultiplier, setPointSizeMultiplier] = useState(1);
  const [hoveredPolygon, setHoveredPolygon] = useState<any | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { currentRole } = useRole();
  const [isInspectingCheckpoint, setIsInspectingCheckpoint] = useState(false);
  const [checkpointToInspect, setCheckpointToInspect] = useState<MockCustomsCheckpoint | null>(null);
  const [simulationActive, setSimulationActive] = useState(true);


  const initialMockPointsData: MockDppPoint[] = useMemo(() => [
    { id: "DPP_DE", lat: 51.1657, lng: 10.4515, name: "Germany Central Hub", size: 0.6, category: 'Distribution Hub', status: 'compliant', timestamp: 2023, manufacturer: "Global Distributors Inc." },
    { id: "DPP_FR", lat: 46.2276, lng: 2.2137, name: "France Electronics Plant", size: 0.5, category: 'Electronics', status: 'pending', timestamp: 2023, manufacturer: "TechFR Corp" },
    { id: "DPP_CN_MFG", lat: 31.2304, lng: 121.4737, name: "Shanghai Manufacturing Site", size: 0.4, category: 'Raw Material Source', status: 'issue', timestamp: 2023, manufacturer: "Overseas Parts Co." },
    { id: "DPP_US_RECYCLE", lat: 39.8283, lng: -98.5795, name: "US National Recycling Center", size: 0.3, category: 'Recycling Facility', status: 'unknown', timestamp: 2023, manufacturer: "RePlanet USA" },
    { id: "DPP_IT_TEXTILES", lat: 41.8719, lng: 12.5674, name: "Italian Fashion Textiles Hub", size: 0.4, category: 'Textiles', status: 'compliant', timestamp: 2023, manufacturer: "Moda Italiana Group" },
  ], []);

  const initialMockArcsData: MockArc[] = useMemo(() => [
    { id: "ARC_CN_DE", shipmentId: "SHP001", direction: 'inbound_eu', startLat: 31.2304, startLng: 121.4737, endLat: 51.1657, endLng: 10.4515, label: "CN-DE Electronics Supply", stroke: 0.2, timestamp: 2023, transportMode: 'sea', productId: 'DPP_FR', productCategory: 'Electronics', dppCompliant: true, value: 80 },
    { id: "ARC_DE_US", shipmentId: "SHP002", direction: 'outbound_eu', startLat: 51.1657, startLng: 10.4515, endLat: 39.8283, endLng: -98.5795, label: "DE-US Auto Parts", stroke: 0.15, timestamp: 2023, transportMode: 'sea', productId: 'DPP_US_RECYCLE', productCategory: 'Appliances', dppCompliant: false, value: 60 },
    { id: "ARC_FR_IT", shipmentId: "SHP003", direction: 'internal_eu', startLat: 46.2276, startLng: 2.2137, endLat: 41.8719, endLng: 12.5674, label: "FR-IT Textiles Transfer", stroke: 0.1, timestamp: 2023, transportMode: 'road', productId: 'DPP_IT_TEXTILES', productCategory: 'Textiles', dppCompliant: true, value: 40 },
    { id: "ARC_BR_NL", shipmentId: "SHP004", direction: 'inbound_eu', startLat: -14.2350, startLng: -51.9253, endLat: 52.1326, endLng: 5.2913, label: "BR-NL Agri Products", stroke: 0.25, timestamp: 2023, transportMode: 'sea', productCategory: 'Raw Material Source', dppCompliant: false, value: 70 },
  ], []);

 const initialMockCustomsCheckpointsData: MockCustomsCheckpoint[] = useMemo(() => [
    { id: "CP_ROTTERDAM", lat: 51.9225, lng: 4.47917, name: "Port of Rotterdam", type: 'port', currentShipmentCount: 125, overallCustomsStatus: 'operational', dppComplianceHealth: 'good', icon: Ship, averageClearanceTime: '6h', issuesDetectedLast24h: 2 },
    { id: "CP_FRANKFURT_AIR", lat: 50.0379, lng: 8.5622, name: "Frankfurt Airport", type: 'airport', currentShipmentCount: 78, overallCustomsStatus: 'pending', dppComplianceHealth: 'fair', icon: Plane, averageClearanceTime: '12h', issuesDetectedLast24h: 5 },
    { id: "CP_DOVER_LAND", lat: 51.1279, lng: 1.3134, name: "Dover Land Border", type: 'land_border', currentShipmentCount: 45, overallCustomsStatus: 'inspection_required', dppComplianceHealth: 'poor', icon: LandBorderIcon, averageClearanceTime: '24h', issuesDetectedLast24h: 10 },
  ], []);
  
  const [mockDppPointsData, setMockDppPointsData] = useState<MockDppPoint[]>(initialMockPointsData);
  const [mockArcsData, setMockArcsData] = useState<MockArc[]>(initialMockArcsData);
  const [mockCustomsCheckpointsData, setMockCustomsCheckpointsData] = useState<MockCustomsCheckpoint[]>(initialMockCustomsCheckpointsData);
  const [mockShipmentPointsDataState, setMockShipmentPointsDataState] = useState<MockShipmentPoint[]>([]);


  useEffect(() => {
    setIsClient(true);
    fetch('/ne_110m_admin_0_countries.geojson')
      .then(res => {
        if (!res.ok) {
          console.warn(`GeoJSON fetch error: ${res.status} ${res.statusText} for URL ${res.url}`);
          setGeoJsonError(true);
          toast({
            title: "Map Border Data Issue",
            description: `Could not load country boundaries (status: ${res.status}). Globe will be shown without borders. Ensure 'ne_110m_admin_0_countries.geojson' is in /public.`,
            variant: "destructive",
            duration: 10000,
          });
          return null; // Return null to handle it in the next .then()
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCountryPolygons(data.features);
          setGeoJsonError(false); // Reset error state if successful
        }
        // If data is null (fetch failed), geoJsonError is already true, countryPolygons remains empty.
      })
      .catch(error => {
        console.warn("Error processing GeoJSON or network issue:", error.message);
        toast({
          title: "Error Loading Map Data",
          description: "Could not load or process country boundaries. Globe will be shown without borders. Ensure 'ne_110m_admin_0_countries.geojson' is in /public.",
          variant: "destructive",
          duration: 10000,
        });
        setGeoJsonError(true);
      })
      .finally(() => {
          setIsLoadingGeoJson(false);
      });
  }, [toast]);

   useEffect(() => {
    if (!simulationActive) return;

    const initialShipments = mockArcsData.map(arc => ({
      id: `SHIP_${arc.shipmentId || arc.id}`,
      name: arc.label || `Shipment ${arc.shipmentId || arc.id}`,
      lat: arc.startLat,
      lng: arc.startLng,
      size: 0.08, // Smaller size for shipment markers
      direction: arc.direction,
      arcId: arc.id,
      arcLabel: arc.label,
      productIconUrl: 'https://placehold.co/40x40.png?text=P',
      dppComplianceStatusText: arc.dppCompliant ? 'Compliant' : 'Pending Review',
      dppComplianceBadgeVariant: arc.dppCompliant ? 'default' as const : 'outline' as const,
      currentLat: arc.startLat,
      currentLng: arc.startLng,
      simulationProgress: 0,
      simulatedStatus: 'in_transit' as MockShipmentPoint['simulatedStatus'],
      eta: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      progressPercentage: 0,
      ceMarkingStatus: Math.random() > 0.2 ? 'valid' : (Math.random() > 0.5 ? 'missing' : 'pending_verification'),
      cbamDeclarationStatus: Math.random() > 0.3 ? 'submitted' : (Math.random() > 0.6 ? 'required' : (Math.random() > 0.8 ? 'cleared' : 'not_applicable')),
      dppComplianceNotes: arc.dppCompliant ? ["All checks passed."] : ["Awaiting QMS certificate from supplier.", "Material composition data incomplete."]
    }));
    setMockShipmentPointsDataState(initialShipments);

    const interval = setInterval(() => {
      setMockShipmentPointsDataState(prevShipments =>
        prevShipments.map(shipment => {
          const arc = mockArcsData.find(a => a.id === shipment.arcId);
          if (!arc) return shipment;

          let newProgress = (shipment.simulationProgress || 0) + 0.01 * (arc.value ? (50 / arc.value) : 1) ; // Slower for higher value arcs
          
          let newStatus = shipment.simulatedStatus;
          const checkpointProximity = 0.05; // Distance threshold to consider "at checkpoint"
          
          const isAtDestinationCheckpoint = 
             Math.abs(shipment.currentLat - arc.endLat) < checkpointProximity && 
             Math.abs(shipment.currentLng - arc.endLng) < checkpointProximity;

          if (newProgress >= 0.95 && newProgress < 1 && isAtDestinationCheckpoint && shipment.simulatedStatus === 'in_transit') {
            // Approaching destination, trigger customs logic if applicable
            const randomOutcome = Math.random();
            if (randomOutcome < 0.4) newStatus = 'at_customs'; // 40% chance to go to customs
            else if (randomOutcome < 0.6) newStatus = 'customs_inspection'; // 20% chance for inspection
            else newStatus = 'cleared'; // 40% chance to clear directly
            
            if(newStatus !== 'cleared' && newStatus !== 'in_transit') {
                toast({
                    title: `Shipment Update: ${shipment.name}`,
                    description: `Status changed to ${newStatus.replace('_', ' ')}. Product: ${arc.productCategory || 'N/A'}. Route: ${arc.label || 'N/A'}`,
                    variant: newStatus === 'customs_inspection' ? "destructive" : "default",
                    duration: 7000,
                });
            }
          } else if (shipment.simulatedStatus === 'at_customs' || shipment.simulatedStatus === 'customs_inspection') {
             // If at customs or inspection, hold progress for a bit, then potentially clear or delay
            if (Math.random() < 0.05) { // Chance to clear or change status
                newStatus = Math.random() < 0.8 ? 'cleared' : 'delayed';
                if (newStatus === 'cleared' && shipment.simulatedStatus !== 'cleared') {
                     toast({ title: `Shipment Cleared: ${shipment.name}`, description: `Shipment has cleared customs.`, variant: "default", duration: 5000});
                } else if (newStatus === 'delayed' && shipment.simulatedStatus !== 'delayed') {
                     toast({ title: `Shipment Delayed: ${shipment.name}`, description: `Shipment has been delayed at customs.`, variant: "destructive", duration: 5000});
                }
            } else {
              newProgress = shipment.simulationProgress || 0; // Hold progress
            }
          } else if (shipment.simulatedStatus === 'delayed') {
              if (Math.random() < 0.03) { // Small chance to resolve delay
                  newStatus = 'cleared';
                  toast({ title: `Shipment Cleared: ${shipment.name}`, description: `Previously delayed shipment has now cleared customs.`, variant: "default", duration: 5000});
              } else {
                  newProgress = shipment.simulationProgress || 0; // Hold progress
              }
          }


          if (newProgress >= 1) {
            newProgress = 0; // Reset to loop or mark as arrived
            newStatus = 'cleared'; // Assume cleared upon reaching destination for this mock
          }

          const newLat = arc.startLat + (arc.endLat - arc.startLat) * newProgress;
          const newLng = arc.startLng + (arc.endLng - arc.startLng) * newProgress;

          return {
            ...shipment,
            lat: newLat,
            lng: newLng,
            currentLat: newLat,
            currentLng: newLng,
            simulationProgress: newProgress,
            progressPercentage: Math.round(newProgress * 100),
            simulatedStatus: newStatus,
          };
        })
      );
    }, 100); // Update interval

    return () => clearInterval(interval);
  }, [mockArcsData, simulationActive, toast]);


  const filteredDppPoints = useMemo(() => {
    if (!showDPPPoints) return [];
    return mockDppPointsData.filter(point => {
      // Add filtering logic based on future filter controls if needed
      return true;
    });
  }, [mockDppPointsData, showDPPPoints]);

  const filteredArcs = useMemo(() => {
    if (!showTradeArcs) return [];
    return mockArcsData.filter(arc => {
      // Add filtering logic here
      return true;
    });
  }, [mockArcsData, showTradeArcs]);

  const filteredCustomsCheckpoints = useMemo(() => {
    if (!showCustomsCheckpoints) return [];
    return mockCustomsCheckpointsData;
  }, [mockCustomsCheckpointsData, showCustomsCheckpoints]);

  const filteredShipmentMarkers = useMemo(() => {
    if (!showShipmentMarkers) return [];
    return mockShipmentPointsDataState;
  }, [mockShipmentPointsDataState, showShipmentMarkers]);


  const combinedPointsForGlobe = useMemo(() => {
    let points = [];
    if (showDPPPoints) points.push(...filteredDppPoints);
    if (showShipmentMarkers) points.push(...filteredShipmentMarkers);
    return points;
  }, [filteredDppPoints, filteredShipmentMarkers, showDPPPoints, showShipmentMarkers]);

  const polygonCapColorAccessor = useCallback((feat: any) => {
    const countryName = feat.properties.NAME || feat.properties.ADMIN;
    return EU_MEMBER_STATES.includes(countryName) ? EU_BLUE_COLOR : NON_EU_LAND_COLOR_LIGHT_BLUE;
  }, []);

  const polygonSideColorAccessor = useCallback((feat: any) => {
    // Match cap color for a solid, flat look
    const countryName = feat.properties.NAME || feat.properties.ADMIN;
    return EU_MEMBER_STATES.includes(countryName) ? EU_BLUE_COLOR : NON_EU_LAND_COLOR_LIGHT_BLUE;
  }, []);

  const polygonStrokeColorAccessor = useCallback(() => COUNTRY_BORDER_COLOR, []);
  const polygonAltitudeAccessor = useCallback(() => 0.005, []); // Flat countries


  const pointColorAccessor = useCallback((point: any) => {
     if ('simulatedStatus' in point) { // It's a MockShipmentPoint
      switch (point.simulatedStatus) {
        case 'in_transit': return SHIPMENT_IN_TRANSIT_COLOR_GLOBE;
        case 'at_customs': return SHIPMENT_AT_CUSTOMS_COLOR_GLOBE;
        case 'customs_inspection': return SHIPMENT_CUSTOMS_INSPECTION_COLOR_GLOBE;
        case 'delayed': return SHIPMENT_DELAYED_COLOR_GLOBE;
        case 'cleared': return SHIPMENT_CLEARED_COLOR_GLOBE;
        case 'data_sync_delayed': return SHIPMENT_DATA_SYNC_DELAYED_COLOR_GLOBE;
        default: return 'rgba(150, 150, 150, 0.7)';
      }
    } else { // It's a MockDppPoint
        if (point.category && DPP_CATEGORY_COLORS[point.category]) {
            return DPP_CATEGORY_COLORS[point.category];
        }
        switch (point.status) {
            case 'compliant': return DPP_COMPLIANT_COLOR;
            case 'pending': return DPP_PENDING_COLOR;
            case 'issue': return DPP_ISSUE_COLOR;
            case 'unknown':
            default: return DPP_UNKNOWN_COLOR;
        }
    }
  }, []);

  const pointRadiusAccessor = useCallback((point: any) => {
     if ('simulatedStatus' in point) { // It's a MockShipmentPoint
      return 0.1 * pointSizeMultiplier; // Consistent small size for shipments
    } else { // It's a MockDppPoint
        let baseSize = 0.2; 
        if (point.category === 'Distribution Hub') baseSize = 0.35;
        else if (point.category === 'Recycling Facility') baseSize = 0.25;
        else if (point.category === 'Electronics') baseSize = 0.3;
        return baseSize * pointSizeMultiplier;
    }
  }, [pointSizeMultiplier]);

  const arcColorAccessor = useCallback((arc: MockArc) => {
    switch (arc.direction) {
      case 'inbound_eu': return ARC_INBOUND_EU_COLOR;
      case 'outbound_eu': return ARC_OUTBOUND_EU_COLOR;
      case 'internal_eu': return ARC_INTERNAL_EU_COLOR;
      default: return ARC_OTHER_COLOR;
    }
  }, []);
  
  const arcStrokeAccessor = useCallback((arc: MockArc) => (arc.value || 20) / 200, []); // Stroke width based on trade value


  const handlePointClick = useCallback((point: any, event: MouseEvent) => {
    setSelectedArc(null);
    setSelectedCheckpoint(null);
    if ('simulatedStatus' in point) { // MockShipmentPoint
      setSelectedPoint(null);
      setSelectedShipment(point as MockShipmentPoint);
    } else { // MockDppPoint
      setSelectedShipment(null);
      setSelectedPoint(point as MockDppPoint);
    }
  }, []);

  const handleArcClick = useCallback((arc: any, event: MouseEvent) => {
    setSelectedPoint(null);
    setSelectedCheckpoint(null);
    setSelectedShipment(null);
    setSelectedArc(arc as MockArc);
  }, []);

  const handlePolygonClick = useCallback((polygon: any, event: MouseEvent) => {
    setSelectedPoint(null);
    setSelectedArc(null);
    setSelectedCheckpoint(null);
    setSelectedShipment(null);
    // Could set selected polygon info if needed, e.g., for an info card about the country
    // For now, clicking a polygon closes other cards.
    const countryName = polygon.properties.NAME || polygon.properties.ADMIN;
    toast({
        title: `Country Selected: ${countryName}`,
        description: `Displaying information for ${countryName}. (Feature WIP)`,
        duration: 3000,
    });
  }, [toast]);
  
  const handleCheckpointClick = useCallback((checkpoint: any, event: MouseEvent) => {
    setSelectedPoint(null);
    setSelectedArc(null);
    setSelectedShipment(null);
    setSelectedCheckpoint(checkpoint as MockCustomsCheckpoint);
  }, []);

  const handleInspectProductsAtCheckpoint = (checkpoint: MockCustomsCheckpoint) => {
    setCheckpointToInspect(checkpoint);
    setIsInspectingCheckpoint(true);
    // Potentially filter and show related shipments in a modal or new view
    toast({
      title: `Inspecting Products at ${checkpoint.name}`,
      description: `${checkpoint.currentShipmentCount} shipments. (Detailed view WIP)`,
      duration: 5000,
    });
  };

  const dynamicGlobeLegendMap: Record<string, string> = {
    "EU Member State (Dark Blue)": EU_BLUE_COLOR,
    "Non-EU Country (Light Grey)": NON_EU_LAND_COLOR_LIGHT_BLUE,
    "Country Border (Black)": COUNTRY_BORDER_COLOR,
    "Shipment (In Transit)": SHIPMENT_IN_TRANSIT_COLOR_GLOBE,
    "Shipment (At Customs)": SHIPMENT_AT_CUSTOMS_COLOR_GLOBE,
    "Shipment (Customs Inspection)": SHIPMENT_CUSTOMS_INSPECTION_COLOR_GLOBE,
    "Shipment (Cleared)": SHIPMENT_CLEARED_COLOR_GLOBE,
    "Trade Arc (Inbound EU)": ARC_INBOUND_EU_COLOR,
    "Trade Arc (Outbound EU)": ARC_OUTBOUND_EU_COLOR,
    "Trade Arc (Internal EU)": ARC_INTERNAL_EU_COLOR,
    "Checkpoint (Port)": CHECKPOINT_PORT_COLOR,
    "Checkpoint (Airport)": CHECKPOINT_AIRPORT_COLOR,
  };
  
  const [activeCheckpointAlerts, setActiveCheckpointAlerts] = useState<MockCustomsCheckpoint[]>([]);
  useEffect(() => {
    const newAlerts = mockCustomsCheckpointsData.filter(
      cp => cp.overallCustomsStatus === 'inspection_required' || cp.dppComplianceHealth === 'poor' || cp.issuesDetectedLast24h > 5
    );
    setActiveCheckpointAlerts(newAlerts);
  }, [mockCustomsCheckpointsData]);


  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="p-3 border-b border-border shadow-sm bg-card flex items-center justify-between print:hidden">
        <div className="flex items-center">
           <GlobeIconLucide className="mr-2 h-6 w-6 text-primary" />
           <h1 className="text-xl font-headline font-semibold">
             DPP Global Tracker
           </h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsLegendVisible(!isLegendVisible)} title="Toggle Legend" className="h-8 w-8">
                <Palette className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsFiltersVisible(!isFiltersVisible)} title="Toggle Filters" className="h-8 w-8">
                <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.back()}>Back to Dashboard</Button>
        </div>
      </header>
      
      {isClient && geoJsonError && !isLoadingGeoJson && (
        <div className="p-4 flex-shrink-0"> 
          <Alert variant="warning"> 
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Map Data Issue</AlertTitle>
            <AlertDescription>
              Could not load country border data. The globe will be displayed without detailed country outlines.
              Please ensure 'ne_110m_admin_0_countries.geojson' is correctly placed in the /public folder.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex-grow grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-0 relative min-h-0"> 
        <aside className="h-full bg-card border-r border-border p-3 space-y-3 overflow-y-auto print:hidden flex flex-col">
            <Card className="shadow-md">
                <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-semibold flex items-center">
                        <Info className="h-4 w-4 mr-2 text-primary" /> Quick Info & Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 text-xs text-muted-foreground space-y-1">
                    <p>Interactive globe visualizing mock DPP flows and compliance states.</p>
                    <p>Simulation Active: <Badge variant={simulationActive ? "default" : "secondary"} className={cn(simulationActive ? "bg-green-100 text-green-700" : "bg-muted")}>{simulationActive ? "Yes" : "Paused"}</Badge></p>
                    <p>Total Active Shipments: {mockShipmentPointsDataState.length}</p>
                    <p>EU Countries Highlighted: {EU_MEMBER_STATES.length > 0 ? "Yes" : "No"}</p>
                </CardContent>
            </Card>

            {isFiltersVisible && (
            <Card className="shadow-md animate-in fade-in-20 slide-in-from-top-2 duration-300">
                <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-semibold flex items-center"><Filter className="h-4 w-4 mr-2 text-primary" />Display Filters</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 space-y-3">
                    <div className="flex items-center justify-between"> <Label htmlFor="show-dpp-points" className="text-xs">DPP Locations</Label> <Switch id="show-dpp-points" checked={showDPPPoints} onCheckedChange={setShowDPPPoints} /> </div>
                    <div className="flex items-center justify-between"> <Label htmlFor="show-trade-arcs" className="text-xs">Trade Arcs</Label> <Switch id="show-trade-arcs" checked={showTradeArcs} onCheckedChange={setShowTradeArcs} /> </div>
                    <div className="flex items-center justify-between"> <Label htmlFor="show-customs-checkpoints" className="text-xs">Customs Checkpoints</Label> <Switch id="show-customs-checkpoints" checked={showCustomsCheckpoints} onCheckedChange={setShowCustomsCheckpoints} /> </div>
                    <div className="flex items-center justify-between"> <Label htmlFor="show-shipment-markers" className="text-xs">Shipment Markers</Label> <Switch id="show-shipment-markers" checked={showShipmentMarkers} onCheckedChange={setShowShipmentMarkers} /> </div>
                    <div className="flex items-center justify-between"> <Label htmlFor="simulation-active" className="text-xs">Activate Simulation</Label> <Switch id="simulation-active" checked={simulationActive} onCheckedChange={setSimulationActive} /> </div>
                    
                    <div>
                        <Label htmlFor="arc-animation-speed" className="text-xs">Arc Animation Speed ({arcAnimationSpeed.toFixed(1)})</Label>
                        <Slider id="arc-animation-speed" defaultValue={[arcAnimationSpeed]} min={0.1} max={2} step={0.1} onValueChange={(value) => setArcAnimationSpeed(value[0])} />
                    </div>
                    <div>
                        <Label htmlFor="point-size-multiplier" className="text-xs">Point Size Multiplier ({pointSizeMultiplier.toFixed(1)})</Label>
                        <Slider id="point-size-multiplier" defaultValue={[pointSizeMultiplier]} min={0.5} max={2} step={0.1} onValueChange={(value) => setPointSizeMultiplier(value[0])} />
                    </div>
                </CardContent>
            </Card>
            )}

            {isLegendVisible && (
            <Card className="shadow-md animate-in fade-in-20 slide-in-from-top-2 duration-300">
                <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-semibold flex items-center"><PaletteIcon className="h-4 w-4 mr-2 text-primary" />Legend</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 space-y-1.5 max-h-60 overflow-y-auto">
                {Object.entries(dynamicGlobeLegendMap).map(([name, color]) => (
                    <div key={name} className="flex items-center text-xs">
                    <span className="inline-block w-3 h-3 rounded-full mr-2 border border-black/20" style={{ backgroundColor: color }}></span>
                    <span className="text-muted-foreground">{name}</span>
                    </div>
                ))}
                </CardContent>
            </Card>
            )}

             {activeCheckpointAlerts.length > 0 && (
                 <Card className="shadow-md border-destructive animate-in fade-in-20 slide-in-from-top-2 duration-300">
                    <CardHeader className="pb-2 pt-3 px-3">
                        <CardTitle className="text-sm font-semibold flex items-center text-destructive"><BellRing className="h-4 w-4 mr-2" />Checkpoint Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3 space-y-1.5 max-h-40 overflow-y-auto">
                        {activeCheckpointAlerts.map(cp => (
                            <div key={cp.id} className="text-xs p-1.5 bg-destructive/10 rounded-md cursor-pointer hover:bg-destructive/20" onClick={() => {setSelectedCheckpoint(cp); globeRefMain.current?.pointOfView({lat: cp.lat, lng: cp.lng, altitude: 0.5}, 1000)}}>
                                <p className="font-medium">{cp.name}</p>
                                <p className="text-muted-foreground">Status: {cp.overallCustomsStatus}, DPP Health: {cp.dppComplianceHealth}, Issues: {cp.issuesDetectedLast24h}</p>
                            </div>
                        ))}
                    </CardContent>
                 </Card>
             )}
            <Card className="shadow-md flex-grow mt-auto bg-muted/30">
                 <CardContent className="p-3 text-center text-xs text-muted-foreground">
                    DPP Global Tracker v0.8 (Alpha). Data is illustrative.
                </CardContent>
            </Card>
        </aside>

        <main className={cn("h-full w-full relative", isLoadingGeoJson && "opacity-50 pointer-events-none")}>
          {isLoadingGeoJson && !geoJsonError && ( 
             <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading Geographic Data...</span>
              </div>
          )}
          
          {!isLoadingGeoJson && (
            <Suspense fallback={
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading 3D Globe Visualization...</span>
              </div>
            }>
              {isClient && (
                  <GlobeVisualization
                      globeRef={globeRefMain}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                      globeBackgroundColor={GLOBE_BACKGROUND_COLOR}
                      atmosphereColor="#3a82f6" 
                      atmosphereAltitude={0.25}
                      pointsData={combinedPointsForGlobe}
                      pointColor={pointColorAccessor}
                      pointRadius={pointRadiusAccessor}
                      pointAltitude={0.005} // Slight altitude for points
                      pointLabel="name"
                      onPointClick={handlePointClick}
                      arcsData={filteredArcs}
                      arcColor={arcColorAccessor}
                      arcDashLength={0.9}
                      arcDashGap={0.4}
                      arcDashAnimateTime={arcAnimationSpeed * 4000}
                      arcStroke={arcStrokeAccessor}
                      onArcClick={handleArcClick}
                      polygonsData={countryPolygons}
                      polygonCapColor={polygonCapColorAccessor}
                      polygonSideColor={polygonSideColorAccessor}
                      polygonStrokeColor={polygonStrokeColorAccessor}
                      polygonAltitude={polygonAltitudeAccessor}
                      onPolygonClick={handlePolygonClick}
                      onPolygonHover={setHoveredPolygon}
                      customLayerData={filteredCustomsCheckpoints}
                      customThreeObject={(d: any) => {
                          const group = new THREE.Group();
                          let color = CHECKPOINT_PORT_COLOR; // Default
                          if (d.type === 'airport') color = CHECKPOINT_AIRPORT_COLOR;
                          else if (d.type === 'land_border') color = CHECKPOINT_LAND_BORDER_COLOR;
                          
                          const material = new THREE.SpriteMaterial({
                            map: new THREE.TextureLoader().load(
                                d.type === 'port' ? '/icons/port-icon.png' :
                                d.type === 'airport' ? '/icons/airport-icon.png' :
                                '/icons/land-border-icon.png'
                            ),
                            color: d.dppComplianceHealth === 'poor' ? DPP_HEALTH_POOR_COLOR : 
                                   d.dppComplianceHealth === 'fair' ? DPP_HEALTH_FAIR_COLOR : 
                                   d.overallCustomsStatus === 'inspection_required' ? DPP_HEALTH_POOR_COLOR : DPP_HEALTH_GOOD_COLOR,
                            depthTest: false,
                            transparent: true,
                            opacity: 0.9
                          });
                          const sprite = new THREE.Sprite(material);
                          sprite.scale.set(8, 8, 1); 
                          group.add(sprite);
                          (group as any).__checkpointData = d; // Attach data for click handling
                          return group;
                        }}
                      customThreeObjectUpdate={(obj: any, d: any) => {
                        if (d && typeof d.lat === 'number' && typeof d.lng === 'number') {
                           Object.assign(obj.position, globeRefMain.current.getCoords(d.lat, d.lng, 0.035));
                        }
                      }}
                      onCustomLayerClick={handleCheckpointClick}
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
      
      <AlertDialog open={isInspectingCheckpoint} onOpenChange={setIsInspectingCheckpoint}>
        <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
                <AlertDialogTitle>Inspecting: {checkpointToInspect?.name}</AlertDialogTitle>
                <AlertDialogDescription>
                    Overview of shipments currently processed or pending at this checkpoint. (Mock Data)
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="max-h-[60vh] overflow-y-auto p-1">
                {/* Mock table for shipments at checkpoint */}
                <Table>
                    <TableHeader>
                        <TableRow><TableHead>Shipment ID</TableHead><TableHead>Product</TableHead><TableHead>Status</TableHead><TableHead>DPP Health</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockShipmentPointsDataState.filter(s => {
                            const arc = mockArcsData.find(a => a.id === s.arcId);
                            if (!arc) return false;
                            const atDestination = Math.abs(s.currentLat - arc.endLat) < 0.1 && Math.abs(s.currentLng - arc.endLng) < 0.1;
                            const atOrigin = Math.abs(s.currentLat - arc.startLat) < 0.1 && Math.abs(s.currentLng - arc.startLng) < 0.1;
                             // Approximate check if checkpoint is start or end of an arc segment involving this shipment
                            return (atDestination && checkpointToInspect && (Math.abs(arc.endLat - checkpointToInspect.lat) < 1 && Math.abs(arc.endLng - checkpointToInspect.lng) < 1)) ||
                                   (atOrigin && checkpointToInspect && (Math.abs(arc.startLat - checkpointToInspect.lat) < 1 && Math.abs(arc.startLng - checkpointToInspect.lng) < 1));
                        }).slice(0, 5).map(s => {
                             const arc = mockArcsData.find(a => a.id === s.arcId);
                             return (
                                <TableRow key={s.id}>
                                    <TableCell>{s.id}</TableCell>
                                    <TableCell>{arc?.productCategory || "N/A"}</TableCell>
                                    <TableCell><Badge variant={s.dppComplianceBadgeVariant}>{s.simulatedStatus.replace('_',' ')}</Badge></TableCell>
                                    <TableCell><Badge variant={arc?.dppCompliant ? 'default' : 'outline'}>{arc?.dppCompliant ? "Compliant" : "Pending"}</Badge></TableCell>
                                </TableRow>
                             );
                        })}
                        {mockShipmentPointsDataState.filter(s => {
                            const arc = mockArcsData.find(a => a.id === s.arcId);
                            if (!arc) return false;
                            const atDestination = Math.abs(s.currentLat - arc.endLat) < 0.1 && Math.abs(s.currentLng - arc.endLng) < 0.1;
                             const atOrigin = Math.abs(s.currentLat - arc.startLat) < 0.1 && Math.abs(s.currentLng - arc.startLng) < 0.1;
                            return (atDestination && checkpointToInspect && (Math.abs(arc.endLat - checkpointToInspect.lat) < 1 && Math.abs(arc.endLng - checkpointToInspect.lng) < 1)) ||
                                    (atOrigin && checkpointToInspect && (Math.abs(arc.startLat - checkpointToInspect.lat) < 1 && Math.abs(arc.startLng - checkpointToInspect.lng) < 1));
                        }).length === 0 && (
                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No active shipments at this checkpoint currently.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCheckpointToInspect(null)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <div className={cn("fixed bottom-0 left-0 right-0 p-3 bg-card/80 backdrop-blur-md border-t shadow-lg print:hidden transition-transform duration-300 ease-in-out z-40", isFiltersVisible ? "translate-y-0" : "translate-y-full md:translate-y-0 md:hidden")}>
        <Card className="shadow-none border-0 bg-transparent">
          <CardHeader className="p-0 mb-2 md:hidden">
            <div className="flex justify-between items-center">
                <CardTitle className="text-md font-semibold flex items-center"><Filter className="h-4 w-4 mr-2 text-primary" />Display Filters</CardTitle>
                <Button variant="ghost" size="icon" onClick={()=>setIsFiltersVisible(false)} className="md:hidden h-7 w-7"><ChevronDown className="h-5 w-5"/></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-2 items-end">
             <div className="flex items-center space-x-2"> <Switch id="panel-show-dpp-points" checked={showDPPPoints} onCheckedChange={setShowDPPPoints} size="sm" /> <Label htmlFor="panel-show-dpp-points" className="text-xs">DPP Locations</Label> </div>
             <div className="flex items-center space-x-2"> <Switch id="panel-show-trade-arcs" checked={showTradeArcs} onCheckedChange={setShowTradeArcs} size="sm" /> <Label htmlFor="panel-show-trade-arcs" className="text-xs">Trade Arcs</Label> </div>
             <div className="flex items-center space-x-2"> <Switch id="panel-show-customs-checkpoints" checked={showCustomsCheckpoints} onCheckedChange={setShowCustomsCheckpoints} size="sm" /> <Label htmlFor="panel-show-customs-checkpoints" className="text-xs">Checkpoints</Label> </div>
             <div className="flex items-center space-x-2"> <Switch id="panel-show-shipment-markers" checked={showShipmentMarkers} onCheckedChange={setShowShipmentMarkers} size="sm" /> <Label htmlFor="panel-show-shipment-markers" className="text-xs">Shipments</Label> </div>
             <div className="flex items-center space-x-2"> <Switch id="panel-simulation-active" checked={simulationActive} onCheckedChange={setSimulationActive} size="sm" /> <Label htmlFor="panel-simulation-active" className="text-xs">Simulation</Label> </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

// Helper to dynamically adjust switch size (example)
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    size?: 'sm' | 'default' | 'lg';
  }
}


    
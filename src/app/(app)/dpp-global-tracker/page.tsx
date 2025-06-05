
"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Globe as GlobeIconLucide, Info, ChevronDown, ChevronUp, Loader2, Circle, Layers, Filter as FilterIcon, Map as MapIcon, CalendarClock, Landmark, FileText } from "lucide-react";
import type { GlobeMethods, GlobeProps } from 'react-globe.gl';
import { cn } from '@/lib/utils';
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard';

console.log("DPPGlobalTrackerPage: Script start");

const Globe = React.lazy(() => {
  console.log("DPPGlobalTrackerPage: Attempting to lazy load react-globe.gl");
  return import('react-globe.gl');
});

export interface MockDppPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  category: string;
  status: 'compliant' | 'pending' | 'issue';
  manufacturer?: string;
  gtin?: string;
  complianceSummary?: string;
  timestamp: number; // Year
  originCountry?: string;
  destinationCountry?: string;
  currentCheckpoint?: string;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified' | 'unknown';
  customsStatus?: 'cleared' | 'flagged' | 'pending_inspection' | 'detained' | 'not_applicable';
}

export interface MockArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  label: string;
  timestamp: number; // Year
  arcDashLength?: number;
  arcDashGap?: number;
  arcStroke?: number;
  transportMode?: 'sea' | 'air' | 'road' | 'rail';
  productId?: string;
}

const mockDppsOnGlobe: MockDppPoint[] = [
  { id: "DPP_GLOBE_001", lat: 48.8566, lng: 2.3522, name: "French Eco-Appliance X10", size: 0.3, category: 'Appliances', status: 'compliant', manufacturer: 'GreenTech SAS', gtin: '3123456789012', complianceSummary: 'Fully compliant with EU Ecodesign.', timestamp: 2022, originCountry: 'Germany', destinationCountry: 'France', currentCheckpoint: 'Retail Warehouse, Paris', ebsiStatus: 'verified', customsStatus: 'cleared' },
  { id: "DPP_GLOBE_002", lat: 52.5200, lng: 13.4050, name: "German Eco-Laptop Z2", size: 0.3, category: 'Electronics', status: 'pending', manufacturer: 'EcoElektronik GmbH', gtin: '3987654321098', complianceSummary: 'Pending battery passport docs.', timestamp: 2023, originCountry: 'China', destinationCountry: 'Germany', currentCheckpoint: 'Berlin Logistics Hub', ebsiStatus: 'pending', customsStatus: 'pending_inspection'},
  { id: "DPP_GLOBE_003", lat: 41.9028, lng: 12.4964, name: "Italian Leather Goods Shipment", size: 0.25, category: 'Fashion', status: 'compliant', timestamp: 2023, originCountry: 'Italy', destinationCountry: 'USA', currentCheckpoint: 'Port of Genoa', ebsiStatus: 'verified', customsStatus: 'cleared' },
  { id: "DPP_GLOBE_004", lat: 35.6895, lng: 139.6917, name: "Japanese Coffee Machine Import", size: 0.28, category: 'Appliances', status: 'issue', timestamp: 2024, originCountry: 'Japan', destinationCountry: 'Netherlands', currentCheckpoint: 'Customs, Port of Rotterdam', ebsiStatus: 'not_verified', customsStatus: 'flagged' },
  { id: "DPP_GLOBE_005", lat: 34.0522, lng: -118.2437, name: "US Organic Textiles", size: 0.32, category: 'Textiles', status: 'compliant', timestamp: 2022, originCountry: 'USA', destinationCountry: 'Spain', currentCheckpoint: 'Barcelona Distribution Center', ebsiStatus: 'verified', customsStatus: 'cleared' },
  { id: "DPP_GLOBE_006", lat: -33.8688, lng: 151.2093, name: "Australian Wine Export", size: 0.2, category: 'Beverages', status: 'pending', timestamp: 2024, originCountry: 'Australia', destinationCountry: 'United Kingdom', currentCheckpoint: 'UK Customs Check', ebsiStatus: 'pending', customsStatus: 'pending_inspection' },
  { id: "DPP_GLOBE_007", lat: 39.9042, lng: 116.4074, name: "Chinese Solar Panels Batch", size: 0.35, category: 'Electronics', status: 'compliant', timestamp: 2023, originCountry: 'China', destinationCountry: 'Poland', currentCheckpoint: 'Warsaw Solar Farm Site', ebsiStatus: 'verified', customsStatus: 'cleared'},
  { id: "DPP_GLOBE_008", lat: 51.5074, lng: -0.1278, name: "UK Pharma Supplies", size: 0.22, category: 'Pharmaceuticals', status: 'compliant', timestamp: 2024, originCountry: 'United Kingdom', destinationCountry: 'Ireland', currentCheckpoint: 'Dublin Medical Storage', ebsiStatus: 'verified', customsStatus: 'cleared'}
];

const mockArcsData: MockArc[] = [
  { productId: "DPP_GLOBE_001", startLat: 52.5200, startLng: 13.4050, endLat: 48.8566, endLng: 2.3522, color: 'rgba(0, 255, 0, 0.5)', label: 'GER to FRA (Road)', timestamp: 2023, transportMode: 'road' },
  { productId: "DPP_GLOBE_002", startLat: 22.3193, startLng: 114.1694, endLat: 52.5200, endLng: 13.4050, color: 'rgba(255, 0, 0, 0.5)', label: 'CHN to GER (Sea/Rail)', timestamp: 2023, transportMode: 'sea' },
  { productId: "DPP_GLOBE_004", startLat: 35.6895, startLng: 139.6917, endLat: 51.9225, endLng: 4.47917, color: 'rgba(255,165,0,0.5)', label: 'JPN to NLD (Sea)', timestamp: 2024, transportMode: 'sea'},
  { productId: "DPP_GLOBE_007", startLat: 39.9042, startLng: 116.4074, endLat: 52.2297, endLng: 21.0122, color: 'rgba(0,0,255,0.5)', label: 'CHN to POL (Rail)', timestamp: 2023, transportMode: 'rail'}
];

const euMemberCountryCodes = [ // ISO A2 Codes
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];
const candidateCountryCodes = ['UA', 'MD', 'AL', 'BA', 'GE', 'ME', 'MK', 'RS', 'TR', 'XK']; // Conceptual examples, XK is Kosovo
const otherEuropeanCountryCodes = ['CH', 'NO', 'GB', 'IS', 'BY', 'AD', 'LI', 'MC', 'SM', 'VA']; // Non-EU European (Belarus, Microstates)


const GlobeVisualization = ({
  points,
  arcs,
  labels,
  polygonsData,
  onPointClick,
  onArcClick,
  pointColorAccessor,
  pointRadiusAccessor,
}: {
  points: MockDppPoint[];
  arcs: MockArc[];
  labels: any[]; 
  polygonsData: any[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  pointColorAccessor: (d: any) => string;
  pointRadiusAccessor: (d: any) => number;
}) => {
  const globeEl = useRef<GlobeMethods | undefined>();
  console.log("GlobeVisualization rendering/re-rendering. Polygons count:", polygonsData.length);

  useEffect(() => {
    console.log("GlobeVisualization: useEffect triggered.");
    if (globeEl.current) {
      console.log("GlobeVisualization: Globe instance available. Setting initial view and controls.");
      globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 1.5 }); // Centered more on Europe
      globeEl.current.controls().autoRotate = false;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 70; // Allow closer zoom
      globeEl.current.controls().maxDistance = 1000; 
      console.log("GlobeVisualization: Globe controls configured.");
    } else {
      console.warn("GlobeVisualization: Globe instance (globeEl.current) not available in useEffect.");
    }
  }, []);

  const globeProps: GlobeProps = {
    globeImageUrl: null, 
    backgroundColor: "rgba(222, 237, 250, 1)", // Very Light Blue for oceans

    // Points, Arcs, and Labels are temporarily disabled for base map styling focus
    // pointsData: points,
    // pointLabel: 'name',
    // pointColor: pointColorAccessor,
    // pointRadius: pointRadiusAccessor,
    // pointAltitude: 0.02,
    // onPointClick: (point: any) => {
    //   console.log("Globe point clicked:", point);
    //   onPointClick(point as MockDppPoint);
    // },

    // arcsData: arcs,
    // arcLabel: 'label',
    // arcColor: 'color',
    // arcDashLength: 0.4,
    // arcDashGap: 0.1,
    // arcStroke: 0.8,
    // onArcClick: (arc: any) => {
    //   console.log("Globe arc clicked: ", arc);
    //   onArcClick(arc as MockArc);
    // },

    labelsData: labels,
    labelText: (d:any) => d.name,
    labelSize: () => 0.20, // Slightly smaller city labels
    labelColor: () => 'rgba(255, 255, 255, 0.95)', // White city labels
    labelDotRadius: () => 0.15,
    labelAltitude: 0.015, // Keep labels close to surface

    polygonsData: polygonsData,
    polygonCapColor: (feat: any) => {
        const countryCode = feat.properties.ISO_A2_EH || feat.properties.ISO_A2 || feat.properties.ADM0_A3;
        if (euMemberCountryCodes.includes(countryCode)) {
            return 'rgba(0, 51, 153, 0.85)'; // EU Blue (Pantone 286C approximate)
        } else if (candidateCountryCodes.includes(countryCode)) {
            return 'rgba(173, 216, 230, 0.85)'; // Soft Blue/Green for candidates (was soft green)
        } else if (otherEuropeanCountryCodes.includes(countryCode)) {
             return 'rgba(225, 225, 210, 0.85)'; // Light Beige for other European non-EU
        }
        return 'rgba(200, 200, 200, 0.85)'; // Pale Gray for other non-EU countries
    },
    polygonSideColor: () => 'rgba(0, 0, 0, 0)', 
    polygonStrokeColor: () => 'rgba(30, 30, 30, 0.7)', // Darker gray for borders
    polygonAltitude: 0.008, 
  };
  console.log("GlobeVisualization: GlobeProps prepared:", globeProps);

  return (
    <div className="w-full h-full border-2 border-dashed border-red-500"> 
      <Globe ref={globeEl} {...globeProps} />
    </div>
  );
};


const DppGlobalTrackerClientContainer = ({
  points,
  arcs,
  labels,
  polygonsData,
  onPointClick,
  onArcClick,
  pointColorAccessor,
  pointRadiusAccessor,
}: {
  points: MockDppPoint[];
  arcs: MockArc[];
  labels: any[];
  polygonsData: any[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  pointColorAccessor: (d: any) => string;
  pointRadiusAccessor: (d: any) => number;
}) => {
  const [isClient, setIsClient] = useState(false);
  console.log("DppGlobalTrackerClientContainer rendering. isClient:", isClient);

  useEffect(() => {
    console.log("DppGlobalTrackerClientContainer: useEffect triggered. Setting isClient to true.");
    setIsClient(true);
  }, []);

  if (!isClient) {
    console.log("DppGlobalTrackerClientContainer: Not client yet, rendering loading message for context.");
    return (
      <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Globe Context...</span>
      </div>
    );
  }
  console.log("DppGlobalTrackerClientContainer: Client is true, preparing to render Suspense for GlobeVisualization.");
  return (
    <div className="w-full h-full border-2 border-dashed border-blue-500">
      <Suspense fallback={
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading 3D Globe Visualization...</span>
        </div>
      }>
        <GlobeVisualization
          points={points}
          arcs={arcs}
          labels={labels}
          polygonsData={polygonsData}
          onPointClick={onPointClick}
          onArcClick={onArcClick}
          pointColorAccessor={pointColorAccessor}
          pointRadiusAccessor={pointRadiusAccessor}
        />
      </Suspense>
    </div>
  );
};

const statusColors: Record<MockDppPoint['status'], string> = {
  compliant: 'rgba(74, 222, 128, 0.9)', 
  pending: 'rgba(250, 204, 21, 0.9)',  
  issue: 'rgba(239, 68, 68, 0.9)',    
};

const categoryColors: Record<string, string> = {
  Appliances: 'rgba(59, 130, 246, 0.9)', 
  Electronics: 'rgba(168, 85, 247, 0.9)',
  Textiles: 'rgba(236, 72, 153, 0.9)',
  Fashion: 'rgba(236, 72, 153, 0.9)',
  Automotive: 'rgba(245, 158, 11, 0.9)',
  Furniture: 'rgba(161, 98, 7, 0.9)',
  Beverages: 'rgba(34, 197, 94, 0.9)',
  Pharmaceuticals: 'rgba(14, 165, 233, 0.9)',
  Default: 'rgba(156, 163, 175, 0.9)',
};

const customsStatusColors: Record<NonNullable<MockDppPoint['customsStatus']>, string> = {
  cleared: 'rgba(74, 222, 128, 0.9)',
  flagged: 'rgba(245, 158, 11, 0.9)',
  pending_inspection: 'rgba(250, 204, 21, 0.9)',
  detained: 'rgba(239, 68, 68, 0.9)',
  not_applicable: 'rgba(156, 163, 175, 0.9)',
};

const ebsiStatusColors: Record<NonNullable<MockDppPoint['ebsiStatus']>, string> = {
  verified: 'rgba(74, 222, 128, 0.9)',
  pending: 'rgba(250, 204, 21, 0.9)',
  not_verified: 'rgba(239, 68, 68, 0.9)',
  unknown: 'rgba(156, 163, 175, 0.9)',
};

const Legend = ({ title, colorMap }: { title: string; colorMap: Record<string, string> }) => (
  <Card className="mt-6 shadow-md">
    <CardHeader className="pb-3">
      <CardTitle className="text-md font-headline">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {Object.entries(colorMap).map(([key, color]) => (
        <div key={key} className="flex items-center">
          <Circle className="h-3.5 w-3.5 mr-2" style={{ color: color, fill: color }} />
          <span className="capitalize text-foreground/90">{key.replace(/_/g, ' ')}</span>
        </div>
      ))}
       <div className="flex items-center">
        <Landmark className="h-3.5 w-3.5 mr-2 text-white" />
        <span className="text-foreground/90">Major Cities</span>
      </div>
    </CardContent>
  </Card>
);

type ActiveLayer = 'status' | 'category' | 'customs' | 'ebsi';
type StatusFilter = 'all' | MockDppPoint['status'];
type CategoryFilter = 'all' | string;
type CustomsStatusFilter = 'all' | NonNullable<MockDppPoint['customsStatus']>;
type EbsiStatusFilter = 'all' | NonNullable<MockDppPoint['ebsiStatus']>;

const availableStatuses: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All Product Statuses" },
  { value: "compliant", label: "Compliant" },
  { value: "pending", label: "Pending Review" },
  { value: "issue", label: "Issue Reported" },
];

const availableCustomsStatuses: Array<{ value: CustomsStatusFilter; label: string }> = [
  { value: "all", label: "All Customs Statuses" },
  { value: "cleared", label: "Cleared" },
  { value: "flagged", label: "Flagged" },
  { value: "pending_inspection", label: "Pending Inspection" },
  { value: "detained", label: "Detained" },
  { value: "not_applicable", label: "Not Applicable" },
];

const availableEbsiStatuses: Array<{ value: EbsiStatusFilter; label: string }> = [
  { value: "all", label: "All EBSI Statuses" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "not_verified", label: "Not Verified" },
  { value: "unknown", label: "Unknown" },
];


const majorEuropeanCities = [ 
  { lat: 48.8566, lng: 2.3522, name: "Paris", size: 0.3 }, { lat: 52.5200, lng: 13.4050, name: "Berlin", size: 0.3 },
  { lat: 41.9028, lng: 12.4964, name: "Rome", size: 0.3 }, { lat: 40.4168, lng: -3.7038, name: "Madrid", size: 0.3 },
  { lat: 51.5074, lng: -0.1278, name: "London", size: 0.3 }, { lat: 50.8503, lng: 4.3517, name: "Brussels", size: 0.25 },
  { lat: 52.3676, lng: 4.9041, name: "Amsterdam", size: 0.25 }, { lat: 53.3498, lng: -6.2603, name: "Dublin", size: 0.25 },
  { lat: 38.7223, lng: -9.1393, name: "Lisbon", size: 0.25 }, { lat: 48.2082, lng: 16.3738, name: "Vienna", size: 0.25 },
  { lat: 50.0755, lng: 14.4378, name: "Prague", size: 0.25 }, { lat: 52.2297, lng: 21.0122, name: "Warsaw", size: 0.25 },
  { lat: 47.4979, lng: 19.0402, name: "Budapest", size: 0.25 }, { lat: 55.6761, lng: 12.5683, name: "Copenhagen", size: 0.25 },
  { lat: 59.3293, lng: 18.0686, name: "Stockholm", size: 0.25 }, { lat: 60.1699, lng: 24.9384, name: "Helsinki", size: 0.25 },
  { lat: 37.9838, lng: 23.7275, name: "Athens", size: 0.25 },
];

export default function DppGlobalTrackerPage() {
  console.log("DppGlobalTrackerPage rendering/re-rendering.");
  const [isConceptVisible, setIsConceptVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('status');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [customsStatusFilter, setCustomsStatusFilter] = useState<CustomsStatusFilter>('all');
  const [ebsiStatusFilter, setEbsiStatusFilter] = useState<EbsiStatusFilter>('all');
  const [pointBaseSize, setPointBaseSize] = useState<number>(0.6); 

  const [minYear, setMinYear] = useState(2022);
  const [maxYear, setMaxYear] = useState(2024);
  const [currentTime, setCurrentTime] = useState(maxYear);
  const [countriesData, setCountriesData] = useState<any[]>([]);

  const conceptDescription = `
Core Idea:
The EU Digital Product Passport (DPP) visualization tool is a dynamic, real-time, global tracker that enables stakeholders to monitor and manage the compliance of products within the EU and from external regions. This tool is designed to track whether products meet EU regulatory standards, help customs officers identify flagged items, and support inventory and supply chain managers in managing compliant products efficiently.

Key Features:
Global Map Visualization: Interactive globe for visualizing global product movement and compliance.
Compliance Tracking: Real-time compliance status (compliant, non-compliant, under review).
Customizable Views: Role-based access with customized views for different stakeholders.
Detailed Product Information: Access product compliance documentation and data with a simple click.
Product Journey Tracking: Track a product's journey across the globe and its compliance status at each checkpoint.
Real-time Updates: Continuous tracking of new products, customs inspections, and regulatory changes.
(Further details from expanded concept omitted for brevity in this mock UI section)
`;

  useEffect(() => {
    console.log("DppGlobalTrackerPage: useEffect for timestamps and country data fetch triggered.");
    const allTimestamps = [
      ...mockDppsOnGlobe.map(p => p.timestamp),
      ...mockArcsData.map(a => a.timestamp)
    ].filter(ts => typeof ts === 'number');

    if (allTimestamps.length > 0) {
      const newMinYear = Math.min(...allTimestamps);
      const newMaxYear = Math.max(...allTimestamps);
      setMinYear(newMinYear);
      setMaxYear(newMaxYear);
      if (currentTime < newMinYear || currentTime > newMaxYear || currentTime === 0) {
          setCurrentTime(newMaxYear);
      }
      console.log("Timestamps processed: minYear, maxYear, currentTime", newMinYear, newMaxYear, currentTime);
    }

    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => {
        console.log("Countries GeoJSON response received.");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.features) {
          setCountriesData(data.features);
          console.log("Countries GeoJSON data.features processed and set to state. Count:", data.features.length);
        } else {
          console.error("Fetched countries data is not in expected GeoJSON format or has no features:", data);
          setCountriesData([]); 
        }
      })
      .catch(err => {
        console.error("Error fetching or processing countries GeoJSON data:", err);
        setCountriesData([]); 
      });
  }, []);


  const handlePointClick = useCallback((point: MockDppPoint) => {
    console.log("Point clicked in DppGlobalTrackerPage:", point);
    setSelectedPoint(point);
    setSelectedArc(null);
  }, []);

  const handleCloseInfoCard = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  const handleArcClick = useCallback((arc: any) => {
    console.log("Arc clicked in DppGlobalTrackerPage:", arc);
    setSelectedArc(arc as MockArc);
    setSelectedPoint(null);
  }, []);

  const handleCloseArcInfoCard = useCallback(() => {
    setSelectedArc(null);
  }, []);

  const availableCategories = useMemo(() => {
    const categories = new Set(mockDppsOnGlobe.map(p => p.category));
    return Array.from(categories).sort();
  }, []);

  const timeFilteredPoints = useMemo(() => {
    console.log("Filtering points by time. Current time:", currentTime);
    return mockDppsOnGlobe.filter(point => point.timestamp <= currentTime);
  }, [currentTime]);

  const filteredPoints = useMemo(() => {
    return timeFilteredPoints.filter(point => {
      if (statusFilter !== 'all' && point.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && point.category !== categoryFilter) return false;
      if (customsStatusFilter !== 'all' && point.customsStatus !== customsStatusFilter) return false;
      if (ebsiStatusFilter !== 'all' && point.ebsiStatus !== ebsiStatusFilter) return false;
      return true;
    });
  }, [timeFilteredPoints, statusFilter, categoryFilter, customsStatusFilter, ebsiStatusFilter]);

  const filteredArcs = useMemo(() => {
    console.log("Filtering arcs by time. Current time:", currentTime);
    return mockArcsData.filter(arc => arc.timestamp <= currentTime);
  }, [currentTime]);

  const pointColorAccessor = useCallback((d: any) => {
    const point = d as MockDppPoint;
    switch (activeLayer) {
      case 'category': return categoryColors[point.category] || categoryColors.Default;
      case 'customs': return point.customsStatus ? customsStatusColors[point.customsStatus] : categoryColors.Default;
      case 'ebsi': return point.ebsiStatus ? ebsiStatusColors[point.ebsiStatus] : categoryColors.Default;
      case 'status':
      default:
        return statusColors[point.status] || categoryColors.Default;
    }
  }, [activeLayer]);

  const pointRadiusAccessor = useCallback((d: any) => {
    return ((d as MockDppPoint).size || 0.5) * pointBaseSize;
  }, [pointBaseSize]);

  const currentMapColorScheme: Record<string, string> = {
    "EU Members": 'rgba(0, 51, 153, 0.85)', 
    "Candidate Countries": 'rgba(173, 216, 230, 0.85)',
    "Other European": 'rgba(225, 225, 210, 0.85)',
    "Other Landmass": 'rgba(200, 200, 200, 0.85)',
    "Oceans": 'rgba(222, 237, 250, 1)'
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker
        </h1>
      </div>

      <Alert variant="default" className="bg-info/10 border-info/50 text-info-foreground">
        <Info className="h-5 w-5 text-info" />
        <AlertTitle className="font-semibold text-info">Stylized Globe View</AlertTitle>
        <AlertDescription>
          Globe visualization styled to highlight EU and other regions. Points, arcs are temporarily disabled for map styling focus. City labels are active. Check browser console for logs.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>EU Digital Product Passport Visualization</CardTitle>
          <CardDescription>Interactive globe focused on European Union regions, candidate countries, and global context.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-[600px] rounded-md overflow-hidden border relative">
            <DppGlobalTrackerClientContainer
              points={filteredPoints}
              arcs={filteredArcs}
              labels={majorEuropeanCities}
              polygonsData={countriesData}
              onPointClick={handlePointClick}
              onArcClick={handleArcClick}
              pointColorAccessor={pointColorAccessor}
              pointRadiusAccessor={pointRadiusAccessor}
            />
            {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={handleCloseInfoCard} />}
            {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={handleCloseArcInfoCard} />}
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-headline flex items-center">
                  <Layers className="mr-2 h-4 w-4 text-primary" /> Data Layers & Filters
                </CardTitle>
                 <CardDescription className="text-xs">Points/Arcs disabled for map styling focus.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={activeLayer} onValueChange={(value) => setActiveLayer(value as ActiveLayer)} className="flex flex-col space-y-2" disabled>
                  <Label className="font-medium text-sm">Color Points By:</Label>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="status" id="layer-status" /><Label htmlFor="layer-status" className="text-xs">Product Status</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="category" id="layer-category" /><Label htmlFor="layer-category" className="text-xs">Category</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="customs" id="layer-customs" /><Label htmlFor="layer-customs" className="text-xs">Customs Status</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="ebsi" id="layer-ebsi" /><Label htmlFor="layer-ebsi" className="text-xs">EBSI Status</Label></div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-headline flex items-center">
                    <MapIcon className="mr-2 h-4 w-4 text-primary" />View Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="point-size-slider" className="text-xs">Point Size (Disabled): {pointBaseSize.toFixed(1)}x</Label>
                    <Slider id="point-size-slider" min={0.2} max={2} step={0.1} value={[pointBaseSize]} onValueChange={([v]) => setPointBaseSize(v)} className="mt-1" disabled />
                  </div>
                  <div>
                    <Label htmlFor="time-slider" className="text-xs flex items-center"><CalendarClock className="mr-1.5 h-3.5 w-3.5" />Timeline Year: {currentTime}</Label>
                    {(minYear < maxYear) && <Slider id="time-slider" min={minYear} max={maxYear} step={1} value={[currentTime]} onValueChange={([v]) => setCurrentTime(v)} className="mt-1" disabled />}
                    {minYear === maxYear && <p className="text-xs text-muted-foreground mt-1">Data for {minYear}.</p>}
                  </div>
                </CardContent>
              </Card>
              <Legend title="Region Color Key" colorMap={currentMapColorScheme} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center cursor-pointer" onClick={() => setIsConceptVisible(!isConceptVisible)}>
          <div><CardTitle className="font-headline">About This Concept</CardTitle><CardDescription>Vision for the DPP Global Tracker.</CardDescription></div>
          <Button variant="ghost" size="icon">{isConceptVisible ? <ChevronUp /> : <ChevronDown />}</Button>
        </CardHeader>
        {isConceptVisible && (
          <CardContent className="pt-0">
             <div className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto"><pre>{conceptDescription}</pre></div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}


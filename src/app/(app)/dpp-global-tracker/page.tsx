
"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Globe as GlobeIconLucide, Info, ChevronDown, ChevronUp, Loader2, Circle, Layers, Filter as FilterIcon, TrendingUp, Map, CalendarClock, CheckCircle, AlertCircle, ShieldQuestion, ShieldCheck, VenetianMask, GitBranch } from "lucide-react"; // Added GitBranch for ArcInfoCard
import type { GlobeMethods, GlobeProps } from 'react-globe.gl';
import { cn } from '@/lib/utils';
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard'; // Import ArcInfoCard

const Globe = React.lazy(() => import('react-globe.gl'));

const euPolygon = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "EU Approximation" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-10, 35], [30, 35], [30, 60], [15, 70], [-5, 60], [-10, 35]
          ]
        ]
      }
    }
  ]
};

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

export interface MockArc { // Made MockArc exportable
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
  { 
    id: "DPP_GLOBE_001", lat: 48.8566, lng: 2.3522, name: "Smart Refrigerator X1 (Paris)", size: 0.6, category: 'Appliances', status: 'compliant', 
    manufacturer: 'GreenTech SAS', gtin: '3123456789012', complianceSummary: 'Fully compliant with EU Ecodesign and Energy Labelling.', timestamp: 2022,
    originCountry: 'Germany', destinationCountry: 'France', currentCheckpoint: 'Retail Warehouse, Paris', ebsiStatus: 'verified', customsStatus: 'cleared'
  },
  { 
    id: "DPP_GLOBE_002", lat: 52.5200, lng: 13.4050, name: "Eco-Laptop Z2 (Berlin)", size: 0.7, category: 'Electronics', status: 'pending', 
    manufacturer: 'EcoElektronik GmbH', gtin: '3987654321098', complianceSummary: 'Pending battery passport documentation.', timestamp: 2023,
    originCountry: 'China', destinationCountry: 'Germany', currentCheckpoint: 'Berlin Logistics Hub', ebsiStatus: 'pending', customsStatus: 'pending_inspection'
  },
  { 
    id: "DPP_GLOBE_003", lat: 41.9028, lng: 12.4964, name: "Recycled Sneakers V1 (Rome)", size: 0.5, category: 'Apparel', status: 'compliant', 
    manufacturer: 'ModaVerde S.p.A.', gtin: '3456789012345', complianceSummary: 'Verified recycled content and ethical production.', timestamp: 2023,
    originCountry: 'Portugal', destinationCountry: 'Italy', currentCheckpoint: 'Rome Central Distribution', ebsiStatus: 'verified', customsStatus: 'cleared'
  },
  { 
    id: "DPP_GLOBE_004", lat: 51.5074, lng: 0.1278, name: "Sustainable Coffee Machine (London)", size: 0.65, category: 'Appliances', status: 'issue', 
    manufacturer: 'BrewRight Ltd.', gtin: '3567890123456', complianceSummary: 'Repairability score below EU target; awaiting updated schematics.', timestamp: 2024,
    originCountry: 'Italy', destinationCountry: 'UK', currentCheckpoint: 'Port of Felixstowe, UK', ebsiStatus: 'not_verified', customsStatus: 'flagged' 
  },
  { 
    id: "DPP_GLOBE_005", lat: 40.4168, lng: -3.7038, name: "Smart Thermostat G2 (Madrid)", size: 0.55, category: 'Electronics', status: 'compliant', 
    manufacturer: 'CasaInteligente S.L.', gtin: '3678901234567', complianceSummary: 'RoHS and REACH compliant.', timestamp: 2022,
    originCountry: 'Spain', destinationCountry: 'Spain', currentCheckpoint: 'Madrid Fulfillment Center', ebsiStatus: 'verified', customsStatus: 'not_applicable'
  },
  { 
    id: "DPP_GLOBE_006", lat: 59.3293, lng: 18.0686, name: "Wooden Chair Set (Stockholm)", size: 0.6, category: 'Furniture', status: 'pending', 
    manufacturer: 'NordicWood AB', gtin: '3789012345678', complianceSummary: 'FSC certification verification in progress.', timestamp: 2024,
    originCountry: 'Sweden', destinationCountry: 'Sweden', currentCheckpoint: 'Local Workshop, Stockholm', ebsiStatus: 'unknown', customsStatus: 'not_applicable' 
  },
  { 
    id: "DPP_GLOBE_007", lat: 34.0522, lng: -118.2437, name: "US Solar Panels (Los Angeles)", size: 0.8, category: 'Electronics', status: 'pending', 
    manufacturer: 'SunPower US', gtin: '3890123456789', complianceSummary: 'Awaiting EU compliance check for import.', timestamp: 2024,
    originCountry: 'USA', destinationCountry: 'EU (Expected)', currentCheckpoint: 'Port of Los Angeles', ebsiStatus: 'unknown', customsStatus: 'pending_inspection'
  },
   { 
    id: "DPP_GLOBE_008", lat: 31.2304, lng: 121.4737, name: "Textiles Batch (Shanghai)", size: 0.7, category: 'Apparel', status: 'compliant', 
    manufacturer: 'Global Textiles Co.', gtin: '3890123456999', complianceSummary: 'Pre-certified for EU import, REACH compliant.', timestamp: 2023,
    originCountry: 'China', destinationCountry: 'Germany (Expected)', currentCheckpoint: 'Shanghai Port', ebsiStatus: 'pending', customsStatus: 'cleared'
  },
];

const mockArcsData: MockArc[] = [
  { 
    productId: "DPP_GLOBE_008", startLat: 31.2304, startLng: 121.4737, endLat: 52.5200, endLng: 13.4050, color: 'rgba(255, 255, 0, 0.5)', 
    label: 'Textiles Shipment (SHA to BER) for DPP_GLOBE_008', timestamp: 2023, transportMode: 'sea', arcDashLength: 0.2, arcDashGap: 0.1 
  },
  { 
    productId: "DPP_GLOBE_003", startLat: 41.9028, startLng: 12.4964, endLat: 48.8566, endLng: 2.3522, color: 'rgba(255, 255, 255, 0.4)', 
    label: 'Finished Goods (Rome to Paris) for DPP_GLOBE_003', timestamp: 2023, transportMode: 'road' 
  },
  { 
    productId: "DPP_GLOBE_002", startLat: 52.5200, startLng: 13.4050, endLat: 51.5074, endLng: 0.1278, color: 'rgba(255,255,0,0.5)', 
    label: 'Electronics Sub-Assembly (BER to LON) for DPP_GLOBE_002', arcDashLength: 0.3, arcDashGap: 0.1, arcStroke:0.8, timestamp: 2024, 
    transportMode: 'road' 
  },
  {
    productId: "DPP_GLOBE_007", startLat: 34.0522, startLng: -118.2437, endLat: 48.8566, endLng: 2.3522, color: 'rgba(0, 255, 255, 0.5)',
    label: 'Solar Panels (LA to Paris) for DPP_GLOBE_007', timestamp: 2024, transportMode: 'sea', arcDashLength: 0.1, arcDashGap: 0.05, arcStroke: 0.7
  }
];

const statusColors: Record<MockDppPoint['status'], string> = {
  compliant: 'rgba(74, 222, 128, 0.9)', // Green
  pending: 'rgba(250, 204, 21, 0.9)',  // Yellow
  issue: 'rgba(239, 68, 68, 0.9)',     // Red
};

const categoryColors: Record<string, string> = {
  Appliances: 'rgba(59, 130, 246, 0.9)', // Blue
  Electronics: 'rgba(168, 85, 247, 0.9)', // Purple
  Apparel: 'rgba(236, 72, 153, 0.9)', // Pink
  Furniture: 'rgba(161, 98, 7, 0.9)', // Brown
  Outdoor: 'rgba(20, 184, 166, 0.9)', // Teal
  Default: 'rgba(156, 163, 175, 0.9)', 
};

const customsStatusColors: Record<NonNullable<MockDppPoint['customsStatus']>, string> = {
  cleared: 'rgba(74, 222, 128, 0.9)', // Green
  flagged: 'rgba(245, 158, 11, 0.9)', // Amber
  pending_inspection: 'rgba(250, 204, 21, 0.9)', // Yellow
  detained: 'rgba(239, 68, 68, 0.9)', // Red
  not_applicable: 'rgba(156, 163, 175, 0.9)', // Gray
};

const ebsiStatusColors: Record<NonNullable<MockDppPoint['ebsiStatus']>, string> = {
  verified: 'rgba(74, 222, 128, 0.9)', // Green
  pending: 'rgba(250, 204, 21, 0.9)', // Yellow
  not_verified: 'rgba(239, 68, 68, 0.9)', // Red
  unknown: 'rgba(156, 163, 175, 0.9)', // Gray
};


type ActiveLayer = 'status' | 'category' | 'customs' | 'ebsi';
type StatusFilter = 'all' | MockDppPoint['status'];
type CategoryFilter = 'all' | string;
type CustomsStatusFilter = 'all' | NonNullable<MockDppPoint['customsStatus']>;
type EbsiStatusFilter = 'all' | NonNullable<MockDppPoint['ebsiStatus']>;

const GlobeVisualization = ({ 
  points,
  arcs,
  onPointClick, 
  onArcClick, // Added onArcClick prop
  pointColorAccessor,
  pointRadiusAccessor,
}: { 
  points: MockDppPoint[];
  arcs: MockArc[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick?: (arc: any, event: MouseEvent) => void; // Updated prop type
  pointColorAccessor: (point: MockDppPoint) => string;
  pointRadiusAccessor: (point: MockDppPoint) => number;
}) => {
  const globeEl = useRef<GlobeMethods | undefined>();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 50, lng: 10, altitude: 1.8 });
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 100;
      globeEl.current.controls().maxDistance = 800;
    }
  }, []);

  const globeProps: GlobeProps = {
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-dark.jpg",
    bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
    backgroundColor: "rgba(0,0,0,0)",
    width: undefined, 
    height: 450, 
    polygonsData: euPolygon.features,
    polygonCapColor: () => 'rgba(0, 100, 255, 0.2)',
    polygonSideColor: () => 'rgba(0, 0, 0, 0.05)',
    polygonStrokeColor: () => 'rgba(0, 50, 150, 0.8)',
    polygonAltitude: 0.01,
    pointsData: points,
    pointLabel: 'name',
    pointColor: d => pointColorAccessor(d as MockDppPoint),
    pointRadius: d => pointRadiusAccessor(d as MockDppPoint),
    pointAltitude: 0.02,
    onPointClick: (point: any) => { 
      onPointClick(point as MockDppPoint);
    },
    arcsData: arcs,
    arcLabel: 'label',
    arcColor: 'color',
    arcDashLength: d => (d as MockArc).arcDashLength || 0.1, 
    arcDashGap: d => (d as MockArc).arcDashGap || 0.05, 
    arcStroke: d => (d as MockArc).arcStroke || 0.5, 
    arcAltitudeAutoScale: 0.5,
    onArcClick: onArcClick, // Passed to Globe
  };

  return <Globe ref={globeEl} {...globeProps} />;
};

const DppGlobalTrackerClientContainer = ({ 
  points,
  arcs,
  onPointClick,
  onArcClick, // Added onArcClick prop
  pointColorAccessor,
  pointRadiusAccessor,
}: { 
  points: MockDppPoint[];
  arcs: MockArc[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick?: (arc: any, event: MouseEvent) => void; // Updated prop type
  pointColorAccessor: (point: MockDppPoint) => string;
  pointRadiusAccessor: (point: MockDppPoint) => number;
}) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[450px] bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading 3D Globe...</span>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="w-full h-[450px] bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading 3D Globe...</span>
      </div>
    }>
      <GlobeVisualization 
        points={points} 
        arcs={arcs}
        onPointClick={onPointClick} 
        onArcClick={onArcClick} // Passed to GlobeVisualization
        pointColorAccessor={pointColorAccessor} 
        pointRadiusAccessor={pointRadiusAccessor} 
      />
    </Suspense>
  );
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
        <GlobeIconLucide className="h-3.5 w-3.5 mr-2 text-blue-400" />
        <span className="text-foreground/90">EU Region Outline</span>
      </div>
    </CardContent>
  </Card>
);

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


export default function DppGlobalTrackerPage() {
  const [isConceptVisible, setIsConceptVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null); // State for selected arc
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('status');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [customsStatusFilter, setCustomsStatusFilter] = useState<CustomsStatusFilter>('all');
  const [ebsiStatusFilter, setEbsiStatusFilter] = useState<EbsiStatusFilter>('all');
  const [pointBaseSize, setPointBaseSize] = useState<number>(1.0);

  const [minYear, setMinYear] = useState(2022);
  const [maxYear, setMaxYear] = useState(2024);
  const [currentTime, setCurrentTime] = useState(maxYear);

  const conceptDescription = `
Core Idea:
The EU Digital Product Passport (DPP) visualization tool is a dynamic, real-time, global tracker. It enables stakeholders to monitor and manage product compliance within the EU and from external regions. The tool tracks whether products meet EU regulatory standards, helps customs officers identify flagged items, and supports inventory and supply chain managers in efficiently managing compliant products.

Key Features of the DPP Global Tracker:
1. Global Map Visualization: Interactive globe for visualizing global product movement and compliance status.
2. Compliance Tracking: Real-time display of compliance status (e.g., compliant, non-compliant, under review).
3. Customizable Views: Future potential for role-based access with customized views.
4. Detailed Product Information: Access to key product compliance data via interactive elements.
5. Product Journey Tracking: Visualize a product's journey across the globe and its compliance status at checkpoints.
6. Real-time Updates (Simulated): Simulate continuous tracking of new products, customs inspections, and regulatory changes.

User Personas & Their Needs (Conceptual):
- Customs Officers: Track incoming products, verify EU regulation compliance, flag non-compliant items, quickly access compliance data.
- Inventory Managers: Manage compliant products in warehouses, track stock, ensure EU standards are met before distribution.
- Compliance Officers: Oversee compliance across regions, audit certifications, ensure proper documentation for EU market entry.
- Supply Chain Managers: Monitor supply chain compliance from production to delivery.
- End-Consumers (Indirectly): Scan QR codes to view product passports, verify compliance, trace origin, and check safety.

System Architecture & Data Flow (Conceptual High-Level):
- Backend System: Product database (details, certifications, compliance status like EPREL, EBSI), tracking system (product journey via unique IDs), customs integration (simulated for now), real-time compliance checks (mock APIs).
- Data Layer: Geospatial data for tracking, product lifecycle data, QR code/blockchain linkage (conceptual).
- Frontend System (This Visualization Tool): Interactive globe, data overlays (compliance status, flags), real-time data streaming simulation.

Key Visualization Features:
- Global Map with Dynamic Data Layers: Toggle layers for compliance status, product categories, etc.
- Product Flow Animation: Show product movement along trade routes with compliance status changes (conceptual).
- Zoom and Drill-Down: Explore specific regions for detailed compliance data.
- Product Journey Visualization: Track a product from manufacturer to retail, showing compliance at each stage.
- Interactive Product Information: Click on products/routes for details (certifications, customs data - simulated).
- Real-Time Alerts (Simulated): Flag non-compliant products with recommendations.
- Analytics and Reporting (Future): Trends in compliance, supply chain visibility.
  `;


  useEffect(() => {
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
    }
  }, []); 


  const handlePointClick = (point: MockDppPoint) => {
    setSelectedPoint(point);
    setSelectedArc(null); // Close arc info if a point is clicked
  };

  const handleCloseInfoCard = () => {
    setSelectedPoint(null);
  };

  const handleArcClick = (arc: any) => { // arc type is 'any' from react-globe.gl
    setSelectedArc(arc as MockArc);
    setSelectedPoint(null); // Close point info if an arc is clicked
  };

  const handleCloseArcInfoCard = () => {
    setSelectedArc(null);
  };
  
  const availableCategories = useMemo(() => {
    const categories = new Set(mockDppsOnGlobe.map(p => p.category));
    return Array.from(categories).sort();
  }, []);

  const timeFilteredPoints = useMemo(() => {
    return mockDppsOnGlobe.filter(point => point.timestamp <= currentTime);
  }, [currentTime]);

  const filteredPoints = useMemo(() => {
    return timeFilteredPoints.filter(point => {
      const statusMatch = statusFilter === 'all' || point.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || point.category === categoryFilter;
      const customsMatch = customsStatusFilter === 'all' || point.customsStatus === customsStatusFilter;
      const ebsiMatch = ebsiStatusFilter === 'all' || point.ebsiStatus === ebsiStatusFilter;
      return statusMatch && categoryMatch && customsMatch && ebsiMatch;
    });
  }, [timeFilteredPoints, statusFilter, categoryFilter, customsStatusFilter, ebsiStatusFilter]);
  
  const filteredArcs = useMemo(() => {
    return mockArcsData.filter(arc => arc.timestamp <= currentTime);
  }, [currentTime]);

  const pointColorAccessor = useMemo(() => {
    return (point: MockDppPoint): string => {
      switch (activeLayer) {
        case 'status':
          return statusColors[point.status] || 'rgba(255, 255, 255, 0.7)';
        case 'category':
          return categoryColors[point.category] || categoryColors.Default;
        case 'customs':
          return point.customsStatus ? customsStatusColors[point.customsStatus] : categoryColors.Default;
        case 'ebsi':
          return point.ebsiStatus ? ebsiStatusColors[point.ebsiStatus] : categoryColors.Default;
        default:
          return 'rgba(255, 255, 255, 0.7)';
      }
    };
  }, [activeLayer]);

  const pointRadiusAccessor = useMemo(() => {
    return (point: MockDppPoint): number => {
      return (point.size || 0.5) * pointBaseSize;
    };
  }, [pointBaseSize]);

  const activeLegendMap = useMemo(() => {
    switch (activeLayer) {
        case 'status': return statusColors;
        case 'category':
            const presentCategories = new Set(mockDppsOnGlobe.map(p => p.category));
            const relevantCategoryColors: Record<string, string> = {};
            presentCategories.forEach(cat => {
                relevantCategoryColors[cat] = categoryColors[cat] || categoryColors.Default;
            });
            return relevantCategoryColors;
        case 'customs': return customsStatusColors;
        case 'ebsi': return ebsiStatusColors;
        default: return {};
    }
  }, [activeLayer]);

  const activeLegendTitle = useMemo(() => {
    switch (activeLayer) {
        case 'status': return "Product Status Legend";
        case 'category': return "Product Category Legend";
        case 'customs': return "Customs Status Legend";
        case 'ebsi': return "EBSI Status Legend";
        default: return "Legend";
    }
  }, [activeLayer]);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker – "The EU Digital Pulse"
        </h1>
      </div>

      <Alert variant="default" className="bg-info/10 border-info/50 text-info-foreground">
        <Info className="h-5 w-5 text-info" />
        <AlertTitle className="font-semibold text-info">Interactive Prototype</AlertTitle>
        <AlertDescription>
          This is an early prototype. Rotate the globe. Click points or arcs for info. Change data layers and apply filters using the controls below.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>EU Digital Product Passport Visualization</CardTitle>
          <CardDescription>An interactive globe displaying mock DPP data points and flows across Europe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-[450px] bg-muted/30 rounded-md overflow-hidden border relative">
            <DppGlobalTrackerClientContainer 
              points={filteredPoints} 
              arcs={filteredArcs}
              onPointClick={handlePointClick} 
              onArcClick={handleArcClick} // Pass arc click handler
              pointColorAccessor={pointColorAccessor}
              pointRadiusAccessor={pointRadiusAccessor}
            />
            {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={handleCloseInfoCard} />}
            {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={handleCloseArcInfoCard} />} {/* Render ArcInfoCard */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-headline flex items-center">
                  <Layers className="mr-2 h-4 w-4 text-primary" />
                  Data Layers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={activeLayer} onValueChange={(value) => setActiveLayer(value as ActiveLayer)} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="status" id="layer-status" />
                    <Label htmlFor="layer-status" className="cursor-pointer hover:text-primary">Product Status</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="category" id="layer-category" />
                    <Label htmlFor="layer-category" className="cursor-pointer hover:text-primary">Category</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customs" id="layer-customs" />
                    <Label htmlFor="layer-customs" className="cursor-pointer hover:text-primary">Customs Status</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ebsi" id="layer-ebsi" />
                    <Label htmlFor="layer-ebsi" className="cursor-pointer hover:text-primary">EBSI Status</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-headline flex items-center">
                  <FilterIcon className="mr-2 h-4 w-4 text-primary" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4"> {/* Changed to md:grid-cols-2 for filters */}
                <div>
                  <Label htmlFor="status-filter" className="text-xs">Product Status</Label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                    <SelectTrigger id="status-filter" className="w-full h-9">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStatuses.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category-filter" className="text-xs">Category</Label>
                  <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
                    <SelectTrigger id="category-filter" className="w-full h-9">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {availableCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label htmlFor="customs-filter" className="text-xs">Customs Status</Label>
                  <Select value={customsStatusFilter} onValueChange={(value) => setCustomsStatusFilter(value as CustomsStatusFilter)}>
                    <SelectTrigger id="customs-filter" className="w-full h-9">
                      <SelectValue placeholder="Select customs status" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCustomsStatuses.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ebsi-filter" className="text-xs">EBSI Status</Label>
                  <Select value={ebsiStatusFilter} onValueChange={(value) => setEbsiStatusFilter(value as EbsiStatusFilter)}>
                    <SelectTrigger id="ebsi-filter" className="w-full h-9">
                      <SelectValue placeholder="Select EBSI status" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEbsiStatuses.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6"> {/* This grid wrapper for View Options and Legend */}
            <Card className="lg:col-span-1"> {/* View Options takes 1/3rd on large screens */}
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-headline flex items-center">
                    <Map className="mr-2 h-4 w-4 text-primary" />
                    View Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="point-size-slider" className="text-xs">Point Size Multiplier: {pointBaseSize.toFixed(1)}x</Label>
                    <Slider
                      id="point-size-slider"
                      min={0.2}
                      max={2}
                      step={0.1}
                      value={[pointBaseSize]}
                      onValueChange={([value]) => setPointBaseSize(value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time-slider" className="text-xs flex items-center">
                      <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
                      Timeline Year: {currentTime}
                    </Label>
                    {(minYear < maxYear) && (
                      <Slider
                        id="time-slider"
                        min={minYear}
                        max={maxYear}
                        step={1}
                        value={[currentTime]}
                        onValueChange={([value]) => setCurrentTime(value)}
                        className="mt-1"
                      />
                    )}
                    {minYear === maxYear && <p className="text-xs text-muted-foreground mt-1">All data is for {minYear}.</p>}
                  </div>
                </CardContent>
              </Card>
              <div className="lg:col-span-2"> {/* Legend takes 2/3rd on large screens */}
                <Legend title={activeLegendTitle} colorMap={activeLegendMap} />
              </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center cursor-pointer" onClick={() => setIsConceptVisible(!isConceptVisible)}>
          <div>
            <CardTitle className="font-headline">About This Concept</CardTitle>
            <CardDescription>Details of the vision for the DPP Global Tracker.</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            {isConceptVisible ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CardHeader>
        {isConceptVisible && (
          <CardContent className="pt-0">
             <div className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto">
                {conceptDescription.trim().split('\n\n').map((paragraphBlock, index) => {
                  const lines = paragraphBlock.split('\n');
                  const firstLine = lines[0].trim();
                  const mainHeaders = ["Core Idea:", "Key Features of the DPP Global Tracker:", "Technical Implementation Ideas:", "Conclusion:", "User Personas & Their Needs (Conceptual):", "System Architecture & Data Flow (Conceptual High-Level):", "Key Visualization Features:"];
                  const isMainHeader = mainHeaders.some(header => firstLine.startsWith(header));

                  if (isMainHeader) {
                    return (
                      <div key={index} className="pt-2">
                        <h2 className="text-lg font-semibold text-primary mt-4 mb-2 !no-underline">{firstLine}</h2>
                        {lines.slice(1).map((line, lineIdx) => <p key={lineIdx} className="my-1 text-sm">{line.replace(/^- /, '• ')}</p>)}
                      </div>
                    );
                  } else if (firstLine.match(/^(\d+)\.\s+.+/) || firstLine.startsWith('- ') || firstLine.startsWith('• ')) {
                     return (
                      <div key={index} className="mt-1">
                        <h3 className="text-md font-medium text-foreground/90 mt-3 mb-1 !no-underline">{firstLine.replace(/^- /, '• ').replace(/^(\d+)\.\s*/, '$1. ')}</h3>
                        {lines.slice(1).map((line, lineIdx) => {
                          const trimmedLine = line.trim();
                           if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                            return <p key={lineIdx} className="my-0.5 ml-4 text-sm before:content-['•_'] before:mr-1.5">{trimmedLine.substring(2)}</p>;
                          }
                          if (trimmedLine.match(/^(\s{2,}-\s|\s{2,}\u2022\s)/)) {
                            return <p key={lineIdx} className="my-0.5 ml-8 text-sm before:content-['\25E6_'] before:mr-1.5">{trimmedLine.replace(/^(\s{2,}[-\u2022]\s)/, '')}</p>;
                          }
                          if (trimmedLine) {
                            return <p key={lineIdx} className="my-0.5 text-sm">{trimmedLine}</p>;
                          }
                          return null;
                        })}
                      </div>
                    );
                  }
                  if (paragraphBlock.trim()) { return <p key={index} className="my-1.5 text-sm">{paragraphBlock}</p>; }
                  return null;
                })}
             </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

    

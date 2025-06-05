
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
  { id: "DPP_GLOBE_001", lat: 48.8566, lng: 2.3522, name: "Test Point Paris", size: 0.3, category: 'Appliances', status: 'compliant', manufacturer: 'GreenTech SAS', gtin: '3123456789012', complianceSummary: 'Fully compliant.', timestamp: 2022, originCountry: 'Germany', destinationCountry: 'France', currentCheckpoint: 'Retail Warehouse, Paris', ebsiStatus: 'verified', customsStatus: 'cleared' },
  { id: "DPP_GLOBE_002", lat: 52.5200, lng: 13.4050, name: "Test Point Berlin", size: 0.3, category: 'Electronics', status: 'pending', manufacturer: 'EcoElektronik GmbH', gtin: '3987654321098', complianceSummary: 'Pending docs.', timestamp: 2023, originCountry: 'China', destinationCountry: 'Germany', currentCheckpoint: 'Berlin Hub', ebsiStatus: 'pending', customsStatus: 'pending_inspection'},
];

const mockArcsData: MockArc[] = [
  { productId: "DPP_GLOBE_001", startLat: 52.5200, startLng: 13.4050, endLat: 48.8566, endLng: 2.3522, color: 'rgba(0, 255, 0, 0.5)', label: 'GER to FRA (Road)', timestamp: 2023, transportMode: 'road' },
];

const euMemberCountryCodes = [ // ISO A2 Codes
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

// For non-EU European countries often shown distinctly (Switzerland, Norway, UK)
const otherEuropeanCountryCodes = ['CH', 'NO', 'GB'];


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
  labels: any[]; // Simplified for now
  polygonsData: any[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  pointColorAccessor: (d: any) => string;
  pointRadiusAccessor: (d: any) => number;
}) => {
  const globeEl = useRef<GlobeMethods | undefined>();
  console.log("GlobeVisualization rendering/re-rendering. Points count:", points.length, "Polygons count:", polygonsData.length);

  useEffect(() => {
    console.log("GlobeVisualization: useEffect triggered.");
    if (globeEl.current) {
      console.log("GlobeVisualization: Globe instance available. Setting initial view and controls.");
      globeEl.current.pointOfView({ lat: 48, lng: 15, altitude: 1.7 }); // Centered more on Europe, slightly closer
      globeEl.current.controls().autoRotate = false;
      // globeEl.current.controls().autoRotateSpeed = 0.3; // Kept commented
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 50; 
      globeEl.current.controls().maxDistance = 800; // Allow further zoom out
      console.log("GlobeVisualization: Globe controls configured.");
    } else {
      console.warn("GlobeVisualization: Globe instance (globeEl.current) not available in useEffect.");
    }
  }, []);

  const globeProps: GlobeProps = {
    // globeImageUrl: "//unpkg.com/three-globe/example/img/earth-political.jpg", // Keep for fallback if new styling fails
    // globeImageUrl: undefined, // To use flat colors primarily
    globeImageUrl: null, // Explicitly no texture for base sphere
    // bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png", // Commented out for flatter look
    backgroundColor: "rgba(173, 216, 230, 1)", // Light blue for oceans (similar to #ADD8E6)
    
    // Temporarily disabling points, arcs, labels to focus on country styling
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

    // labelsData: labels,
    // labelText: (d:any) => d.name,
    // labelSize: () => 0.25,
    // labelColor: () => 'rgba(255, 255, 255, 0.9)',
    // labelDotRadius: () => 0.2,
    // labelAltitude: 0.03,

    polygonsData: polygonsData,
    polygonCapColor: (feat: any) => {
        const countryCode = feat.properties.ISO_A2_EH || feat.properties.ISO_A2 || feat.properties.ADM0_A3; // Try different properties for ISO code
        if (euMemberCountryCodes.includes(countryCode)) {
            return 'rgba(0, 51, 153, 0.9)'; // EU Blue (e.g. #003399)
        }
        if (otherEuropeanCountryCodes.includes(countryCode)) {
             return 'rgba(245, 245, 220, 0.9)'; // Light Cream/Beige (e.g. #F5F5DC) for non-EU European
        }
        // Default landmass color for other continents
        return 'rgba(222, 184, 135, 0.9)'; // Light Tan/Beige (e.g. #DEB887)
    },
    polygonSideColor: () => 'rgba(0, 0, 0, 0)', // Transparent sides
    polygonStrokeColor: () => 'rgba(50, 50, 50, 0.7)', // Darker, distinct borders
    polygonAltitude: 0.005, // Keep polygons very close to the surface for a flatter look
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
  compliant: 'rgba(74, 222, 128, 0.9)', // Green
  pending: 'rgba(250, 204, 21, 0.9)',  // Yellow
  issue: 'rgba(239, 68, 68, 0.9)',     // Red
};

const categoryColors: Record<string, string> = {
  Appliances: 'rgba(59, 130, 246, 0.9)', 
  Electronics: 'rgba(168, 85, 247, 0.9)',
  Textiles: 'rgba(236, 72, 153, 0.9)',
  Automotive: 'rgba(245, 158, 11, 0.9)',
  Furniture: 'rgba(161, 98, 7, 0.9)',
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
        <Landmark className="h-3.5 w-3.5 mr-2 text-gray-300" />
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


const majorEuropeanCities = [ // For label rendering
  { lat: 48.8566, lng: 2.3522, name: "Paris", size: 0.3 },
  { lat: 52.5200, lng: 13.4050, name: "Berlin", size: 0.3 },
  { lat: 41.9028, lng: 12.4964, name: "Rome", size: 0.3 },
  { lat: 40.4168, lng: -3.7038, name: "Madrid", size: 0.3 },
  { lat: 51.5074, lng: -0.1278, name: "London", size: 0.3 },
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
  const [pointBaseSize, setPointBaseSize] = useState<number>(0.6); // Adjusted default size

  const [minYear, setMinYear] = useState(2022);
  const [maxYear, setMaxYear] = useState(2024);
  const [currentTime, setCurrentTime] = useState(maxYear);
  const [countriesData, setCountriesData] = useState<any[]>([]);

  const conceptDescription = `
Core Idea:
The EU Digital Product Passport (DPP) visualization tool is a dynamic, real-time, global tracker...
(Full description omitted for brevity during this specific change)
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

  const activeLegendMap = useMemo(() => {
    switch (activeLayer) {
      case 'category': return categoryColors;
      case 'customs': return customsStatusColors;
      case 'ebsi': return ebsiStatusColors;
      case 'status':
      default: return statusColors;
    }
  }, [activeLayer]);

  const activeLegendTitle = useMemo(() => {
    switch (activeLayer) {
      case 'category': return "Category Legend";
      case 'customs': return "Customs Status Legend";
      case 'ebsi': return "EBSI Status Legend";
      case 'status':
      default: return "Product Status Legend";
    }
  }, [activeLayer]);

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
          Globe visualization is styled to highlight EU member states. Points, arcs, and city labels are temporarily disabled for focus. Check browser console for logs.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>EU Digital Product Passport Visualization</CardTitle>
          <CardDescription>Stylized interactive globe focusing on European regions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-[600px] bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden border relative">
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
                  <Layers className="mr-2 h-4 w-4 text-primary" /> Data Layers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={activeLayer} onValueChange={(value) => setActiveLayer(value as ActiveLayer)} className="flex flex-col space-y-2">
                  {/* Data Layers options kept for when points are re-enabled */}
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-2">Point/Arc/Label layers temporarily hidden for globe style focus.</p>
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
                    <Label htmlFor="point-size-slider" className="text-xs">Point Size: {pointBaseSize.toFixed(1)}x</Label>
                    <Slider id="point-size-slider" min={0.2} max={2} step={0.1} value={[pointBaseSize]} onValueChange={([v]) => setPointBaseSize(v)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="time-slider" className="text-xs flex items-center"><CalendarClock className="mr-1.5 h-3.5 w-3.5" />Timeline Year: {currentTime}</Label>
                    {(minYear < maxYear) && <Slider id="time-slider" min={minYear} max={maxYear} step={1} value={[currentTime]} onValueChange={([v]) => setCurrentTime(v)} className="mt-1" />}
                    {minYear === maxYear && <p className="text-xs text-muted-foreground mt-1">Data for {minYear}.</p>}
                  </div>
                </CardContent>
              </Card>
               {/* Legend still relevant for country colors if we add one */}
              <Legend title="Region Color Legend" colorMap={{
                "EU Members": 'rgba(0, 51, 153, 0.9)', // EU Blue
                "Other European": 'rgba(245, 245, 220, 0.9)', // Light Cream
                "Other Landmass": 'rgba(222, 184, 135, 0.9)', // Light Tan
                "Oceans": 'rgba(173, 216, 230, 1)' // Light Blue
              }} />
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

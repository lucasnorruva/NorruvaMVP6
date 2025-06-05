
"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Globe as GlobeIconLucide, Info, ChevronDown, ChevronUp, Loader2, Circle, Layers, Filter as FilterIcon, Map, CalendarClock, Landmark, FileText } from "lucide-react";
import type { GlobeMethods, GlobeProps } from 'react-globe.gl';
import { cn } from '@/lib/utils';
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard';

// Ensure Globe is dynamically imported
const Globe = React.lazy(() => {
  console.log("Attempting to lazy load react-globe.gl");
  return import('react-globe.gl');
});

const majorEuropeanCities = [
  // Keeping a few for initial testing if labels are re-enabled
  { lat: 48.8566, lng: 2.3522, name: "Paris", size: 0.3 },
  { lat: 52.5200, lng: 13.4050, name: "Berlin", size: 0.3 },
  { lat: 41.9028, lng: 12.4964, name: "Rome", size: 0.3 },
];

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
  {
    id: "DPP_GLOBE_001", lat: 48.8566, lng: 2.3522, name: "Test Point Paris", size: 0.6, category: 'Appliances', status: 'compliant',
    manufacturer: 'GreenTech SAS', gtin: '3123456789012', complianceSummary: 'Fully compliant.', timestamp: 2022,
    originCountry: 'Germany', destinationCountry: 'France', currentCheckpoint: 'Retail Warehouse, Paris', ebsiStatus: 'verified', customsStatus: 'cleared'
  },
  {
    id: "DPP_GLOBE_002", lat: 52.5200, lng: 13.4050, name: "Test Point Berlin", size: 0.7, category: 'Electronics', status: 'pending',
    manufacturer: 'EcoElektronik GmbH', gtin: '3987654321098', complianceSummary: 'Pending docs.', timestamp: 2023,
    originCountry: 'China', destinationCountry: 'Germany', currentCheckpoint: 'Berlin Hub', ebsiStatus: 'pending', customsStatus: 'pending_inspection'
  },
];

// Simplified mock arcs for initial testing if re-enabled
const mockArcsData: MockArc[] = [
  {
    productId: "DPP_GLOBE_001", startLat: 52.5200, startLng: 13.4050, endLat: 48.8566, endLng: 2.3522, color: 'rgba(255, 0, 0, 0.5)',
    label: 'Test Arc (BER to PAR)', timestamp: 2023, transportMode: 'road'
  }
];


const statusColors: Record<MockDppPoint['status'], string> = {
  compliant: 'rgba(74, 222, 128, 0.9)', // Green
  pending: 'rgba(250, 204, 21, 0.9)',  // Yellow
  issue: 'rgba(239, 68, 68, 0.9)',     // Red
};

const categoryColors: Record<string, string> = {
  Appliances: 'rgba(59, 130, 246, 0.9)', 
  Electronics: 'rgba(168, 85, 247, 0.9)',
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

const continentColors: Record<string, string> = {
  "Europe": "rgba(59, 130, 246, 0.05)",
  "Asia": "rgba(239, 68, 68, 0.05)",
  "Africa": "rgba(250, 204, 21, 0.05)",
  "North America": "rgba(74, 222, 128, 0.05)",
  "South America": "rgba(168, 85, 247, 0.05)",
  "Oceania": "rgba(245, 158, 11, 0.05)",
  "Antarctica": "rgba(200, 200, 200, 0.05)",
  "Default": "rgba(100, 100, 100, 0.02)"
};

const getColorByContinent = (continentName: string | undefined) => {
  return continentName ? (continentColors[continentName] || continentColors.Default) : continentColors.Default;
};

// Minimal GlobeVisualization for initial diagnosis
const GlobeVisualization = ({
  points,
  onPointClick,
}: {
  points: MockDppPoint[];
  onPointClick: (point: MockDppPoint) => void;
}) => {
  const globeEl = useRef<GlobeMethods | undefined>();
  console.log("GlobeVisualization rendering/re-rendering. Points count:", points.length);

  useEffect(() => {
    if (globeEl.current) {
      console.log("Globe instance available (globeEl.current is set). Setting initial view.");
      globeEl.current.pointOfView({ lat: 50, lng: 10, altitude: 3.0 }); // Adjusted altitude for wider view
      globeEl.current.controls().autoRotate = false;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 50; // Allow closer zoom
      globeEl.current.controls().maxDistance = 1500;
      console.log("Globe controls configured.");
    } else {
      console.warn("Globe instance (globeEl.current) not available in useEffect.");
    }
  }, []);

  const globeProps: GlobeProps = {
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-night.jpg", // Simplest texture
    // bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png", // Keep bump for some 3D effect
    backgroundColor: "rgba(10,10,25,1)", // Dark background to see globe
    
    pointsData: points,
    pointLabel: 'name',
    pointColor: () => 'rgba(255, 100, 100, 0.75)', // Simple red for all points
    pointRadius: () => 0.5, // Fixed small radius
    pointAltitude: 0.02,
    onPointClick: (point: any) => {
      console.log("Globe point clicked:", point);
      onPointClick(point as MockDppPoint);
    },

    // Temporarily disable polygons, arcs, labels for diagnosis
    // polygonsData: polygonsData,
    // polygonCapColor: (feat: any) => getColorByContinent(feat.properties.CONTINENT),
    // polygonSideColor: () => 'rgba(0, 0, 0, 0)',
    // polygonStrokeColor: () => 'rgba(50, 50, 50, 0.6)',
    // polygonAltitude: 0.01,

    // arcsData: arcs,
    // arcLabel: 'label',
    // arcColor: 'color',
    // onArcClick: onArcClick,

    // labelsData: labels,
    // labelText: d => (d as any).name,
    // labelSize: () => 0.3,
  };
  console.log("GlobeProps prepared:", globeProps);

  return (
    // Added explicit width and height to ensure the div itself is sized.
    <div className="w-full h-full border-2 border-dashed border-red-500"> 
      <Globe ref={globeEl} {...globeProps} />
    </div>
  );
};


const DppGlobalTrackerClientContainer = ({
  points, // Only points for now
  onPointClick,
}: {
  points: MockDppPoint[];
  onPointClick: (point: MockDppPoint) => void;
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
          onPointClick={onPointClick}
          // Pass other simplified/commented props if re-enabling step-by-step
        />
      </Suspense>
    </div>
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


export default function DppGlobalTrackerPage() {
  console.log("DppGlobalTrackerPage rendering/re-rendering.");
  const [isConceptVisible, setIsConceptVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  
  // Defaulting to 'status' but pointColorAccessor is simplified for now.
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('status');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [customsStatusFilter, setCustomsStatusFilter] = useState<CustomsStatusFilter>('all');
  const [ebsiStatusFilter, setEbsiStatusFilter] = useState<EbsiStatusFilter>('all');
  const [pointBaseSize, setPointBaseSize] = useState<number>(1.0);

  const [minYear, setMinYear] = useState(2022);
  const [maxYear, setMaxYear] = useState(2024);
  const [currentTime, setCurrentTime] = useState(maxYear);
  const [countriesData, setCountriesData] = useState<any[]>([]);

  const conceptDescription = `
Core Idea:
The EU Digital Product Passport (DPP) visualization tool is a dynamic, real-time, global tracker...
`; // Keeping description truncated for brevity here as it's not the focus of the fix

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

    // Temporarily disable fetching country data to simplify
    /*
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
          setCountriesData([]); // Set to empty array if data is invalid
        }
      })
      .catch(err => {
        console.error("Error fetching or processing countries GeoJSON data:", err);
        setCountriesData([]); // Set to empty array on error
      });
    */
     console.log("Skipping country data fetch for diagnostic purposes.");
     setCountriesData([]); // Keep it empty for now


  }, []); // Note: currentTime removed from dependency array to avoid re-fetching on slider change.


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

  // Simplified filteredPoints for diagnosis
  const filteredPoints = useMemo(() => {
    console.log("Filtering points. Current time:", currentTime);
    return mockDppsOnGlobe.filter(point => point.timestamp <= currentTime);
  }, [currentTime]);

  // Simplified filteredArcs for diagnosis
  const filteredArcs = useMemo(() => {
     console.log("Filtering arcs. Current time:", currentTime);
    return mockArcsData.filter(arc => arc.timestamp <= currentTime);
  }, [currentTime]);

  // Point color accessor and radius accessor are now simplified within GlobeVisualization directly for testing

  const activeLegendMap = useMemo(() => {
    // Simplified for now
    return statusColors;
  }, []);

  const activeLegendTitle = useMemo(() => {
    // Simplified for now
    return "Product Status Legend";
  }, []);

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
        <AlertTitle className="font-semibold text-info">Diagnostic Mode</AlertTitle>
        <AlertDescription>
          Globe features are currently simplified for troubleshooting. Check browser console for logs.
          If you see a red dashed border, the globe component is rendering. Blue dashed border means the client container is active.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>EU Digital Product Passport Visualization</CardTitle>
          <CardDescription>Interactive globe (currently simplified for diagnosis).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Added temporary background to check if the div is sized and placed correctly */}
          <div className="w-full h-[500px] bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden border relative">
            <DppGlobalTrackerClientContainer
              points={filteredPoints}
              onPointClick={handlePointClick}
              // arcs={filteredArcs} // Disabled for simplification
              // labels={majorEuropeanCities} // Disabled for simplification
              // polygonsData={countriesData} // Disabled for simplification
              // onArcClick={handleArcClick} // Disabled for simplification
              // pointColorAccessor={pointColorAccessor} // Handled internally for simplification
              // pointRadiusAccessor={pointRadiusAccessor} // Handled internally for simplification
            />
            {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={handleCloseInfoCard} />}
            {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={handleCloseArcInfoCard} />}
          </div>

          {/* Control panels - kept for structure, but their effect on the globe is simplified */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-headline flex items-center">
                  <Layers className="mr-2 h-4 w-4 text-primary" /> Data Layers (Simplified)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={activeLayer} onValueChange={(value) => setActiveLayer(value as ActiveLayer)} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="status" id="layer-status" /><Label htmlFor="layer-status">Product Status</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="category" id="layer-category" /><Label htmlFor="layer-category">Category</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="customs" id="layer-customs" /><Label htmlFor="layer-customs">Customs Status</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="ebsi" id="layer-ebsi" /><Label htmlFor="layer-ebsi">EBSI Status</Label></div>
                </RadioGroup>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-headline flex items-center">
                  <FilterIcon className="mr-2 h-4 w-4 text-primary" /> Filters (Simplified)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status-filter" className="text-xs">Product Status</Label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                    <SelectTrigger id="status-filter" className="w-full h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{availableStatuses.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category-filter" className="text-xs">Category</Label>
                  <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
                    <SelectTrigger id="category-filter" className="w-full h-9"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All</SelectItem>{availableCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="customs-filter" className="text-xs">Customs Status</Label>
                  <Select value={customsStatusFilter} onValueChange={(value) => setCustomsStatusFilter(value as CustomsStatusFilter)}>
                    <SelectTrigger id="customs-filter" className="w-full h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{availableCustomsStatuses.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ebsi-filter" className="text-xs">EBSI Status</Label>
                  <Select value={ebsiStatusFilter} onValueChange={(value) => setEbsiStatusFilter(value as EbsiStatusFilter)}>
                    <SelectTrigger id="ebsi-filter" className="w-full h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{availableEbsiStatuses.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-headline flex items-center"><Map className="mr-2 h-4 w-4 text-primary" />View Options</CardTitle>
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
            <div className="lg:col-span-2"><Legend title={activeLegendTitle} colorMap={activeLegendMap} /></div>
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

    

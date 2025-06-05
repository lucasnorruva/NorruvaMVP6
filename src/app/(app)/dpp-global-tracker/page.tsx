
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
  return import('react-globe.gl').then(module => {
    console.log("DPPGlobalTrackerPage: react-globe.gl module loaded successfully.");
    return module;
  }).catch(err => {
    console.error("DPPGlobalTrackerPage: Error lazy loading react-globe.gl", err);
    return { default: () => <div>Error loading globe.</div> }; // Fallback component
  });
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
  timestamp: number; 
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
  timestamp: number; 
  arcDashLength?: number;
  arcDashGap?: number;
  arcStroke?: number;
  transportMode?: 'sea' | 'air' | 'road' | 'rail';
  productId?: string;
}

// DRASTICALLY SIMPLIFIED MOCK DATA FOR DIAGNOSIS
const diagnosticPoints: MockDppPoint[] = [
  { id: "DIAG_001", lat: 48.8566, lng: 2.3522, name: "Test Point Paris", size: 0.5, category: 'Test', status: 'compliant', timestamp: 2023 },
  { id: "DIAG_002", lat: 52.5200, lng: 13.4050, name: "Test Point Berlin", size: 0.5, category: 'Test', status: 'compliant', timestamp: 2023 },
];
const diagnosticArcs: MockArc[] = []; // No arcs for now
const diagnosticLabels: any[] = []; // No labels for now
const diagnosticPolygons: any[] = []; // No polygons for now


const GlobeVisualization = ({
  points,
  // arcs, // Temporarily disabled
  // labels, // Temporarily disabled
  // polygonsData, // Temporarily disabled
  onPointClick,
  onArcClick,
  pointColorAccessor,
  pointRadiusAccessor,
}: {
  points: MockDppPoint[];
  // arcs: MockArc[]; // Temporarily disabled
  // labels: any[]; // Temporarily disabled
  // polygonsData: any[]; // Temporarily disabled
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  pointColorAccessor: (d: any) => string;
  pointRadiusAccessor: (d: any) => number;
}) => {
  const globeEl = useRef<GlobeMethods | undefined>();
  console.log("GlobeVisualization: Rendering. Points count:", points.length);

  useEffect(() => {
    console.log("GlobeVisualization: useEffect triggered.");
    if (globeEl.current) {
      console.log("GlobeVisualization: Globe instance (globeEl.current) IS available.");
      try {
        globeEl.current.pointOfView({ lat: 40, lng: 0, altitude: 4.5 }); // Zoomed out further, looking at Europe/Africa
        console.log("GlobeVisualization: pointOfView set successfully.");
        globeEl.current.controls().autoRotate = false;
        console.log("GlobeVisualization: autoRotate set to false.");
        globeEl.current.controls().enableZoom = true;
        console.log("GlobeVisualization: enableZoom set to true.");
        globeEl.current.controls().minDistance = 50; 
        globeEl.current.controls().maxDistance = 1500;
        console.log("GlobeVisualization: Globe controls configured.");
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    } else {
      console.warn("GlobeVisualization: Globe instance (globeEl.current) NOT available in useEffect.");
    }
  }, []);

  const globeProps: GlobeProps = {
    // globeImageUrl: '//unpkg.com/three-globe/example/img/earth-night.jpg', // Temporarily disabled for plain sphere
    // bumpImageUrl: '//unpkg.com/three-globe/example/img/earth-topology.png', // Temporarily disabled
    backgroundColor: "rgba(10, 10, 30, 1)", // Very dark ocean for contrast

    pointsData: points,
    pointLabel: 'name',
    pointColor: pointColorAccessor, // Will be bright red
    pointRadius: pointRadiusAccessor, // Will be fixed small size
    pointAltitude: 0.02,
    onPointClick: (point: any) => {
      console.log("GlobeVisualization: Globe point clicked:", point);
      onPointClick(point as MockDppPoint);
    },

    // arcsData: arcs, // Temporarily disabled
    // arcLabel: 'label',
    // arcColor: 'color',
    // arcDashLength: 0.4,
    // arcDashGap: 0.1,
    // arcStroke: 0.8,
    // onArcClick: (arc: any) => {
    //   console.log("GlobeVisualization: Globe arc clicked: ", arc);
    //   onArcClick(arc as MockArc);
    // },

    // labelsData: labels, // Temporarily disabled
    // labelText: (d: any) => d.name,
    // labelSize: () => 0.20,
    // labelColor: () => 'rgba(255, 255, 255, 0.95)',
    // labelDotRadius: () => 0.15,
    // labelAltitude: 0.015,

    // polygonsData: polygonsData, // Temporarily disabled
    // polygonCapColor: () => 'rgba(0,0,0,0)', // Fully transparent fill
    // polygonSideColor: () => 'rgba(0, 0, 0, 0)', 
    // polygonStrokeColor: () => 'rgba(200, 200, 200, 0.5)', // Light stroke for borders
    // polygonAltitude: 0.01,
  };
  console.log("GlobeVisualization: GlobeProps prepared for rendering:", globeProps);

  return (
    <div className="w-full h-full border-4 border-dashed border-red-700" style={{ position: 'relative', zIndex: 20 }}>
      <Globe ref={globeEl} {...globeProps} />
    </div>
  );
};


const DppGlobalTrackerClientContainer = ({
  points,
  // arcs, // Temporarily disabled
  // labels, // Temporarily disabled
  // polygonsData, // Temporarily disabled
  onPointClick,
  onArcClick,
  pointColorAccessor,
  pointRadiusAccessor,
}: {
  points: MockDppPoint[];
  // arcs: MockArc[]; // Temporarily disabled
  // labels: any[]; // Temporarily disabled
  // polygonsData: any[]; // Temporarily disabled
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  pointColorAccessor: (d: any) => string;
  pointRadiusAccessor: (d: any) => number;
}) => {
  const [isClient, setIsClient] = useState(false);
  console.log("DppGlobalTrackerClientContainer: Rendering. isClient:", isClient);

  useEffect(() => {
    console.log("DppGlobalTrackerClientContainer: useEffect triggered. Setting isClient to true.");
    setIsClient(true);
  }, []);

  if (!isClient) {
    console.log("DppGlobalTrackerClientContainer: Not client yet, rendering loading message for context.");
    return (
      <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Globe Context (Client Check)...</span>
      </div>
    );
  }
  console.log("DppGlobalTrackerClientContainer: Client is true, preparing to render Suspense for GlobeVisualization.");
  return (
    <div className="w-full h-full border-4 border-dashed border-blue-700" style={{ position: 'relative', zIndex: 10 }}>
      <Suspense fallback={
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading 3D Globe Visualization (Suspense)...</span>
        </div>
      }>
        <GlobeVisualization
          points={points}
          // arcs={arcs} // Temporarily disabled
          // labels={labels} // Temporarily disabled
          // polygonsData={polygonsData} // Temporarily disabled
          onPointClick={onPointClick}
          onArcClick={onArcClick}
          pointColorAccessor={pointColorAccessor}
          pointRadiusAccessor={pointRadiusAccessor}
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
        <Landmark className="h-3.5 w-3.5 mr-2 text-gray-700 dark:text-gray-300" />
        <span className="text-foreground/90">Major Cities</span>
      </div>
    </CardContent>
  </Card>
);

// Not used in diagnostic mode
const euMemberCountryCodes: string[] = [];
const candidateCountryCodes: string[] = [];
const otherEuropeanCountryCodes: string[] = [];

export default function DppGlobalTrackerPage() {
  console.log("DppGlobalTrackerPage: Rendering/re-rendering.");
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  const [countriesData, setCountriesData] = useState<any[]>([]); // Keep for eventual re-enablement

  useEffect(() => {
    console.log("DppGlobalTrackerPage: Main useEffect for data fetching triggered.");
    // GeoJSON fetching is disabled for diagnostic mode.
    // fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
    //   .then(res => { /* ... */ })
    //   .catch(err => { /* ... */ });
    console.log("DppGlobalTrackerPage: GeoJSON fetching SKIPPED for diagnostic mode.");
    setCountriesData(diagnosticPolygons); // Use empty diagnostic polygons
  }, []);


  const handlePointClick = useCallback((point: MockDppPoint) => {
    console.log("DppGlobalTrackerPage: Point clicked:", point);
    setSelectedPoint(point);
    setSelectedArc(null);
  }, []);

  const handleCloseInfoCard = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  const handleArcClick = useCallback((arc: any) => {
    console.log("DppGlobalTrackerPage: Arc clicked:", arc);
    setSelectedArc(arc as MockArc);
    setSelectedPoint(null);
  }, []);

  const handleCloseArcInfoCard = useCallback(() => {
    setSelectedArc(null);
  }, []);

  const pointColorAccessor = useCallback(() => 'rgba(255, 0, 0, 1)', []); // All points bright red
  const pointRadiusAccessor = useCallback(() => 0.3, []); // Fixed small size for all points

  // Controls and complex filters are disabled for diagnostic mode
  const [activeLayer, setActiveLayer] = useState<'status' | 'category' | 'customs' | 'ebsi'>('status');
  const [statusFilter, setStatusFilter] = useState<'all' | MockDppPoint['status']>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [customsStatusFilter, setCustomsStatusFilter] = useState<'all' | NonNullable<MockDppPoint['customsStatus']>>('all');
  const [ebsiStatusFilter, setEbsiStatusFilter] = useState<'all' | NonNullable<MockDppPoint['ebsiStatus']>>('all');
  const [pointBaseSize, setPointBaseSize] = useState<number>(0.6);
  const [minYear, setMinYear] = useState(2022);
  const [maxYear, setMaxYear] = useState(2024);
  const [currentTime, setCurrentTime] = useState(maxYear);

  const diagnosticLegendMap: Record<string,string> = { "Test Point": "rgba(255,0,0,1)"};

  return (
    <div className="space-y-8 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker (Diagnostic Mode)
        </h1>
      </div>

      <Alert variant="destructive" className="border-red-500/50 text-red-700">
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Diagnostic Mode Active</AlertTitle>
        <AlertDescription>
          Globe visualization is highly simplified to diagnose rendering issues. Textures, country polygons, arcs, and labels are disabled. Points are bright red. Ocean is dark. Container backgrounds/borders are prominent. Check browser console for logs.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Globe Visualization Container</CardTitle>
          <CardDescription>The globe should appear within the blue dashed border below. The globe itself will have a red dashed border.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="w-full h-[600px] rounded-md overflow-hidden border relative bg-lime-300 dark:bg-lime-700" 
            style={{ position: 'relative', zIndex: 1 }}
          > {/* Bright background for the globe's parent */}
            <DppGlobalTrackerClientContainer
              points={diagnosticPoints} // Use simplified diagnostic points
              // arcs={diagnosticArcs} // Temporarily disabled
              // labels={diagnosticLabels} // Temporarily disabled
              // polygonsData={countriesData} // Temporarily disabled for diagnostics
              onPointClick={handlePointClick}
              onArcClick={handleArcClick}
              pointColorAccessor={pointColorAccessor}
              pointRadiusAccessor={pointRadiusAccessor}
            />
            {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={handleCloseInfoCard} />}
            {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={handleCloseArcInfoCard} />}
          </div>
          
          {/* Controls are disabled for diagnostic mode to simplify rendering */}
          <div className="opacity-50 pointer-events-none">
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-headline flex items-center">
                    <Layers className="mr-2 h-4 w-4 text-primary" /> Data Layers (Disabled)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={activeLayer} disabled><Label className="text-xs">Color Points By: ...</Label></RadioGroup>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-headline flex items-center">
                      <FilterIcon className="mr-2 h-4 w-4 text-primary" /> Filters (Disabled)
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="status-filter" className="text-xs">Product Status</Label><Select disabled><SelectTrigger><SelectValue/></SelectTrigger></Select></div>
                  <div><Label htmlFor="category-filter" className="text-xs">Product Category</Label><Select disabled><SelectTrigger><SelectValue/></SelectTrigger></Select></div>
                </CardContent>
              </Card>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-headline flex items-center">
                      <MapIcon className="mr-2 h-4 w-4 text-primary" />View Options (Disabled)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><Label className="text-xs">Point Size: ...</Label><Slider disabled /></div>
                    <div><Label className="text-xs flex items-center"><CalendarClock className="mr-1.5 h-3.5 w-3.5" />Timeline Year: ...</Label><Slider disabled /></div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                  <Legend title="Diagnostic Legend" colorMap={diagnosticLegendMap} />
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}


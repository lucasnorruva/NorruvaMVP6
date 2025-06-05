
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

// Lazy load react-globe.gl
const Globe = React.lazy(() => {
  console.log("DPPGlobalTrackerPage: Attempting to lazy load react-globe.gl");
  return import('react-globe.gl').then(module => {
    console.log("DPPGlobalTrackerPage: react-globe.gl module loaded successfully.");
    return module;
  }).catch(err => {
    console.error("DPPGlobalTrackerPage: Error lazy loading react-globe.gl module:", err);
    // Provide a fallback component for error display
    return { default: () => <div style={{width: '100%', height: '100%', backgroundColor: 'magenta', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '2px solid yellow'}}>Error loading globe component. Module load failed.</div> };
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

// Minimal diagnostic data to ensure something is passed
const diagnosticPoints: MockDppPoint[] = [
  { id: "DIAG_001", lat: 48.8566, lng: 2.3522, name: "Test Point Paris", size: 0.5, category: 'Test', status: 'compliant', timestamp: 2023 },
  { id: "DIAG_002", lat: 52.5200, lng: 13.4050, name: "Test Point Berlin", size: 0.5, category: 'Test', status: 'compliant', timestamp: 2023 },
];
const diagnosticArcs: MockArc[] = [];
const diagnosticLabels: any[] = [];
const diagnosticPolygons: any[] = [];


const GlobeVisualization = ({
  points,
  onPointClick,
  onArcClick,
  pointColorAccessor,
  pointRadiusAccessor,
}: {
  points: MockDppPoint[];
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
        // Set a very zoomed-out view to ensure the globe is visible
        globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 3.5 }); 
        console.log("GlobeVisualization: pointOfView set to altitude 3.5.");
        
        // Basic controls
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
    // High-contrast ocean color
    backgroundColor: "rgba(220, 240, 255, 1)", // Light sky blue ocean
    
    // No image, should default to grey sphere
    globeImageUrl: undefined, 
    bumpImageUrl: undefined,

    pointsData: points,
    pointLabel: 'name',
    pointColor: pointColorAccessor, // Bright red
    pointRadius: pointRadiusAccessor, // Fixed small size
    pointAltitude: 0.02,
    onPointClick: (point: any) => {
      console.log("GlobeVisualization: Globe point clicked:", point);
      onPointClick(point as MockDppPoint);
    },
    
    // All other features disabled for diagnostic focus
    arcsData: diagnosticArcs,
    // onArcClick: (arc: any) => {
    //   console.log("GlobeVisualization: Globe arc clicked:", arc);
    //   onArcClick(arc as MockArc);
    // },
    labelsData: diagnosticLabels,
    polygonsData: diagnosticPolygons,
  };
  console.log("GlobeVisualization: GlobeProps prepared for rendering:", globeProps);

  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 20 }}>
      {/* Adding a key to Globe might help in some re-rendering scenarios, but not critical for parsing */}
      <Globe ref={globeEl} {...globeProps} />
    </div>
  );
};


const DppGlobalTrackerClientContainer = ({
  points,
  onPointClick,
  onArcClick,
  pointColorAccessor,
  pointRadiusAccessor,
}: {
  points: MockDppPoint[];
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
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 1 }}>
      <Suspense fallback={
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading 3D Globe Visualization (Suspense)...</span>
        </div>
      }>
        <GlobeVisualization
          points={points}
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
        <span className="text-foreground/90">Major Cities (if enabled)</span>
      </div>
    </CardContent>
  </Card>
);

export default function DppGlobalTrackerPage() {
  console.log("DppGlobalTrackerPage: Rendering/re-rendering page component.");
  // Minimal state for basic interaction
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  // const countriesData: any[] = []; // GeoJSON fetching still SKIPPED for diagnostic mode.

  // useEffect(() => {
  //   console.log("DppGlobalTrackerPage: Main useEffect for data fetching triggered.");
  //   console.log("DppGlobalTrackerPage: GeoJSON fetching SKIPPED for diagnostic mode.");
  // }, []);


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

  // Simplified accessors for diagnostic points
  const pointColorAccessor = useCallback(() => 'rgba(255, 0, 0, 1)', []); // All points bright red
  const pointRadiusAccessor = useCallback(() => 0.3, []); // Fixed small size

  // Simplified legend for diagnostic mode
  const simpleDiagnosticLegendMap: Record<string,string> = { 
    "Diagnostic Point": "rgba(255,0,0,1)", // Red
    "Default Globe Sphere": "rgba(128,128,128,1)", // Grey (expected default)
    "Ocean": "rgba(220,240,255,1)" // Light Blue
  };

  // All filter-related state and logic removed for this diagnostic step.

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
        <AlertTitle className="font-semibold">Diagnostic Mode Active - Parsing Test</AlertTitle>
        <AlertDescription>
          Globe visualization is highly simplified to test parsing and basic rendering.
          Expect a default grey sphere on a light blue ocean with a few red test points.
          Check browser console for logs. Country polygons, arcs, and labels are disabled. UI controls are non-functional.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Globe Visualization Container</CardTitle>
          <CardDescription>The globe should appear within the area below. Default grey sphere against light blue ocean. Red test points should be visible.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="w-full h-[600px] rounded-md overflow-hidden border relative bg-card" 
            style={{ position: 'relative', zIndex: 0 }}
          >
            <DppGlobalTrackerClientContainer
              points={diagnosticPoints} 
              onPointClick={handlePointClick}
              onArcClick={handleArcClick} 
              pointColorAccessor={pointColorAccessor}
              pointRadiusAccessor={pointRadiusAccessor}
            />
            {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={handleCloseInfoCard} />}
            {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={handleCloseArcInfoCard} />}
          </div>
          
          {/* UI Controls - kept visually but marked as disabled */}
          <div className="opacity-50 pointer-events-none">
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-headline flex items-center">
                    <Layers className="mr-2 h-4 w-4 text-primary" /> Data Layers (Disabled)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup defaultValue={'status'} disabled><Label className="text-xs">Color Points By: (Disabled)</Label></RadioGroup>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-headline flex items-center">
                      <FilterIcon className="mr-2 h-4 w-4 text-primary" /> Filters (Disabled)
                  </CardTitle>
                </Header>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="status-filter" className="text-xs">Product Status (Disabled)</Label><Select disabled><SelectTrigger><SelectValue/></SelectTrigger></Select></div>
                  <div><Label htmlFor="category-filter" className="text-xs">Product Category (Disabled)</Label><Select disabled><SelectTrigger><SelectValue/></SelectTrigger></Select></div>
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
                    <div><Label className="text-xs">Point Size: (Disabled)</Label><Slider disabled defaultValue={[0.6]} max={2} step={0.1} /></div>
                    <div><Label className="text-xs flex items-center"><CalendarClock className="mr-1.5 h-3.5 w-3.5" />Timeline Year: (Disabled)</Label><Slider disabled defaultValue={[2024]} min={2022} max={2024} step={1} /></div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                  <Legend title="Diagnostic Legend" colorMap={simpleDiagnosticLegendMap} />
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

    
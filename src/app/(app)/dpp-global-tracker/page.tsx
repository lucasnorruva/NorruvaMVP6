
"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info, Settings2, Layers as LayersIcon, Filter, Palette, MapPin, TrendingUp, Link as LinkIcon, Route, Ship, Plane, Truck, Train } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard';
import { cn } from "@/lib/utils";

// Dynamically import GlobeVisualization
const GlobeVisualization = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));

console.log("DPPGlobalTrackerPage: Script start - PARSING TEST - Dynamic Import for GlobeVisualization.");

export interface MockDppPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  category: 'Manufacturing Site' | 'Distribution Hub' | 'Retail Outlet' | 'Recycling Facility' | 'Raw Material Source';
  status: 'compliant' | 'pending' | 'issue' | 'unknown';
  timestamp: number; // Year for simplicity
  manufacturer?: string;
  gtin?: string;
  complianceSummary?: string;
  color?: string; // Added for direct color control if needed by globe
}

export interface MockArc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string | string[];
  label?: string;
  stroke?: number;
  timestamp: number; // Year
  transportMode?: 'sea' | 'air' | 'road' | 'rail';
  productId?: string;
}

const diagnosticPointsMinimal: MockDppPoint[] = [
  { id: "DIAG_001", lat: 48.8566, lng: 2.3522, name: "Paris Test Point", size: 0.3, category: 'Retail Outlet', status: 'compliant', timestamp: 2023, color: 'rgba(255,0,0,1)' },
  { id: "DIAG_002", lat: 51.5074, lng: 0.1278, name: "London Test Point", size: 0.3, category: 'Distribution Hub', status: 'pending', timestamp: 2023, color: 'rgba(255,0,0,1)' },
];
const diagnosticArcsMinimal: MockArc[] = [];
const diagnosticLabelsMinimal: any[] = [];
const diagnosticPolygonsMinimal: any[] = [];


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
          <span className="h-3 w-3 rounded-sm mr-2" style={{ backgroundColor: color }} />
          <span>{name}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

// This component will contain the Globe and be dynamically imported
// For this iteration, it's defined inline for simplicity of fixing the current error source.
// Normally, this would be in its own file like '@/components/dpp-tracker/GlobeVisualization.tsx'
// but the error is in this file, so keeping it here to ensure the fix is applied to current code.

interface GlobeVisualizationProps {
  pointsData: MockDppPoint[];
  arcsData: MockArc[];
  labelsData: any[];
  polygonsData: any[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  pointColorAccessor: (point: MockDppPoint) => string;
  pointRadiusAccessor: (point: MockDppPoint) => number;
  arcColorAccessor: (arc: MockArc) => string | string[];
  arcStrokeAccessor: (arc: MockArc) => number;
}

// Create the GlobeVisualization component (can be moved to its own file later)
const InternalGlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  pointsData,
  arcsData,
  labelsData,
  polygonsData,
  onPointClick,
  onArcClick,
  pointColorAccessor,
  pointRadiusAccessor,
  arcColorAccessor,
  arcStrokeAccessor
}) => {
  const globeEl = useRef<any | undefined>();
  const Globe = require('react-globe.gl').default; // Require inside component for client-side

  console.log("GlobeVisualization: Rendering. Minimal props for parsing test.");

  useEffect(() => {
    console.log("GlobeVisualization: useEffect triggered.");
    if (globeEl.current) {
      console.log("GlobeVisualization: Globe instance (globeEl.current) IS available.");
      try {
        // Settings from when the black globe was visible
        globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 3.5 }); 
        console.log("GlobeVisualization: pointOfView set.");
        
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false;
            controls.enableZoom = true;
            controls.minDistance = 50;
            controls.maxDistance = 1500;
            console.log("GlobeVisualization: Globe controls configured.");
        } else {
            console.warn("GlobeVisualization: globeEl.current.controls() is null or undefined.");
        }
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    } else {
      console.warn("GlobeVisualization: Globe instance (globeEl.current) NOT available in useEffect.");
    }
  }, []);

  const globeProps = {
    backgroundColor: "rgba(10, 10, 30, 1)", // Dark ocean
    // globeImageUrl: undefined, // Default grey sphere
    // bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png", 

    pointsData: pointsData,
    pointLabel: 'name',
    pointColor: pointColorAccessor,
    pointRadius: pointRadiusAccessor,
    pointAltitude: 0.02,
    onPointClick: onPointClick,
    
    arcsData: arcsData,
    arcLabel: 'label',
    arcColor: arcColorAccessor,
    arcStroke: arcStrokeAccessor,
    arcDashLength: 0.4,
    arcDashGap: 0.2,
    arcDashAnimateTime: 2000,
    arcAltitudeAutoScale: 0.3,
    onArcClick: onArcClick,

    labelsData: labelsData,
    labelLat: (d: any) => d.lat,
    labelLng: (d: any) => d.lng,
    labelText: (d: any) => d.name,
    labelSize: 0.22, // Adjusted
    labelDotRadius: 0.18, // Adjusted
    labelColor: () => 'rgba(255, 255, 255, 0.95)',
    labelResolution: 2,
    labelAltitude: 0.018, // Adjusted

    polygonsData: polygonsData,
    polygonCapColor: () => 'rgba(200, 200, 200, 0.7)', // Default grey for polygons for this test
    polygonSideColor: () => 'rgba(0,0,0,0)',
    polygonStrokeColor: () => 'rgba(50,50,50,0.7)',
    polygonAltitude: 0.01,
  };
  console.log("GlobeVisualization: Minimal GlobeProps prepared for parsing test.");

  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 20, border: '2px dashed red' }}>
      { Globe && <Globe ref={globeEl} {...globeProps} /> }
    </div>
  );
};
// Define InternalGlobeVisualization as the default export for the dynamic import path
// This helps React.lazy find it correctly.
// (This is a bit of a workaround if it were in a separate file, but fine here)
const components = { default: InternalGlobeVisualization };


const DppGlobalTrackerClientContainer: React.FC<GlobeVisualizationProps & {isClient: boolean}> = ({ isClient, ...globeProps }) => {
  console.log("DppGlobalTrackerClientContainer: Rendering. isClient:", isClient);

  if (!isClient) {
    console.log("DppGlobalTrackerClientContainer: Not client yet, rendering loading message for GlobeVisualization context.");
    return (
      <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Globe Context...</span>
      </div>
    );
  }
  console.log("DppGlobalTrackerClientContainer: Client is true, attempting to render Suspense + GlobeVisualization.");
  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 1, border: '2px dashed blue' }}>
      <Suspense fallback={
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading 3D Globe Visualization...</span>
        </div>
      }>
        {/* Use the dynamically imported component here */}
        <GlobeVisualization {...globeProps} />
      </Suspense>
    </div>
  );
};

export default function DppGlobalTrackerPage() {
  console.log("DppGlobalTrackerPage: Rendering component - AGGRESSIVE PARSING TEST. Dynamic import, simplified page logic.");
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);

  useEffect(() => {
    console.log("DppGlobalTrackerPage: useEffect triggered. Setting isClient to true.");
    setIsClient(true);
  }, []);

  const handlePointClick = useCallback((point: MockDppPoint) => {
    console.log("Point clicked:", point);
    setSelectedPoint(point);
    setSelectedArc(null);
  }, []);

  const handleArcClick = useCallback((arc: MockArc) => {
    console.log("Arc clicked:", arc);
    setSelectedArc(arc);
    setSelectedPoint(null);
  }, []);

  const pointColorAccessor = useCallback((p: MockDppPoint) => p.color || 'rgba(255,0,0,1)', []);
  const pointRadiusAccessor = useCallback(() => 0.3, []);
  const arcColorAccessor = useCallback((a: MockArc) => a.color, []);
  const arcStrokeAccessor = useCallback(() => 0.3, []);

  const simpleDiagnosticLegendMap = {
    "Test Point": "red",
    "Ocean": "rgba(10, 10, 30, 1)", // Updated ocean color to dark
    "Land (default)": "grey (default sphere)",
  };
  
  // All complex state and callbacks that were previously here are removed for this test.
  // If this parses, the issue was in the removed JavaScript.

  return (
    <div className="space-y-8 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker (Diagnostic - Window Error Fix)
        </h1>
      </div>

      <Alert variant="destructive" className="border-red-500/50 text-red-700">
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Diagnostic Mode Active - Window Error Fix Attempt</AlertTitle>
        <AlertDescription>
          Attempting to fix 'window is not defined' by dynamically loading the globe.
          Globe should be default grey on a DARK background, with red test points.
          All filters, legends, and complex globe features are disabled.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Globe Visualization Container</CardTitle>
          <CardDescription>The globe should appear within the area below. If this page loads without a Next.js parsing error or 'window' error, the basic structure is correct.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="w-full h-[600px] rounded-md overflow-hidden border relative bg-card"
            style={{ position: 'relative', zIndex: 0 }}
          >
            <DppGlobalTrackerClientContainer 
              isClient={isClient}
              pointsData={diagnosticPointsMinimal}
              arcsData={diagnosticArcsMinimal}
              labelsData={diagnosticLabelsMinimal}
              polygonsData={diagnosticPolygonsMinimal}
              onPointClick={handlePointClick}
              onArcClick={handleArcClick}
              pointColorAccessor={pointColorAccessor}
              pointRadiusAccessor={pointRadiusAccessor}
              arcColorAccessor={arcColorAccessor}
              arcStrokeAccessor={arcStrokeAccessor}
            />
          </div>
          
          <div className="opacity-30 pointer-events-none mt-6">
            <CardDescription className="text-center">
                (UI Controls, Filters, and complex Globe features are temporarily removed for this diagnostic test)
            </CardDescription>
            <Legend title="Diagnostic Legend" colorMap={simpleDiagnosticLegendMap} className="mt-2 mx-auto w-fit" />
          </div>
        </CardContent>
      </Card>

      {/* Info Cards - keep these simple for now */}
      {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={() => setSelectedPoint(null)} />}
      {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={() => setSelectedArc(null)} />}

    </div>
  );
}

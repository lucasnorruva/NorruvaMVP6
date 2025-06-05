
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Globe from 'react-globe.gl'; // DIRECT IMPORT
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info } from "lucide-react";

console.log("DPPGlobalTrackerPage: Script start - PARSING TEST - Direct Import, Minimal JS.");

// Minimal diagnostic data for the globe itself
const diagnosticPointsMinimal = [
  { id: "DIAG_001", lat: 48.8566, lng: 2.3522, name: "Paris Test Point", size: 0.5, category: 'Test', status: 'compliant', timestamp: 2023 },
];

const GlobeVisualization = () => {
  const globeEl = useRef<any | undefined>();
  console.log("GlobeVisualization: Rendering. Minimal props.");

  useEffect(() => {
    console.log("GlobeVisualization: useEffect triggered.");
    if (globeEl.current) {
      console.log("GlobeVisualization: Globe instance (globeEl.current) IS available.");
      try {
        globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 3.5 });
        console.log("GlobeVisualization: pointOfView set to altitude 3.5.");
        
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
    backgroundColor: "rgba(144, 238, 144, 1)", // Light green for high contrast ocean
    // globeImageUrl: undefined, // Default grey sphere

    pointsData: diagnosticPointsMinimal,
    pointLabel: 'name',
    pointColor: () => 'rgba(255, 0, 0, 1)', // Bright red
    pointRadius: () => 0.4, // Visible size
    pointAltitude: 0.02,
    onPointClick: (point: any) => {
      console.log("GlobeVisualization: Globe point clicked (minimal):", point);
    },
    
    arcsData: [],
    labelsData: [],
    polygonsData: [],
  };
  console.log("GlobeVisualization: Minimal GlobeProps prepared:", globeProps);

  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 20 }}>
      <Globe ref={globeEl} {...globeProps} />
    </div>
  );
};

const DppGlobalTrackerClientContainer = () => {
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
        <span className="ml-2">Loading Client Context...</span>
      </div>
    );
  }
  console.log("DppGlobalTrackerClientContainer: Client is true, rendering GlobeVisualization directly.");
  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 1 }}>
      <GlobeVisualization />
    </div>
  );
};

export default function DppGlobalTrackerPage() {
  console.log("DppGlobalTrackerPage: Rendering component - AGGRESSIVE PARSING TEST.");

  // All complex state and callbacks that were previously here are removed for this test.
  // If this parses, the issue was in the removed JavaScript.

  return (
    <div className="space-y-8 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker (Aggressive Parsing Test)
        </h1>
      </div>

      <Alert variant="destructive" className="border-red-500/50 text-red-700">
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Diagnostic Mode Active - Parsing Test</AlertTitle>
        <AlertDescription>
          This is a highly simplified version to fix a parsing error. 
          Globe should be default grey on a light GREEN background, with one red test point.
          All filters, legends, and complex globe features are disabled.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Globe Visualization Container</CardTitle>
          <CardDescription>The globe should appear within the area below. If this page loads without a Next.js parsing error, the basic structure is correct.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="w-full h-[600px] rounded-md overflow-hidden border relative bg-card" // bg-card for the immediate container
            style={{ position: 'relative', zIndex: 0 }}
          >
            <DppGlobalTrackerClientContainer />
          </div>
          
          <div className="opacity-30 pointer-events-none mt-6">
            <CardDescription className="text-center">
                (UI Controls, Filters, Legend, and complex Globe features are temporarily removed for this parsing test)
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

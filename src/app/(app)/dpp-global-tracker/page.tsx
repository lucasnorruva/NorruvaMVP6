
"use client";

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe as GlobeIconLucide, Loader2, Palette, Info, MapPin, ChevronRight } from "lucide-react";
import type { GlobeMethods } from 'react-globe.gl';

// Dynamically import GlobeVisualization to ensure it's client-side only
const GlobeVisualization = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));

// --- Color & Style Constants ---
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a'; // Dark background for the page/globe area
const ATMOSPHERE_COLOR = '#3a82f6'; // Blueish atmosphere

export default function DppGlobalTrackerPage() {
  const globeRefMain = useRef<GlobeMethods | undefined>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading DPP Global Tracker...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem))] bg-background">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline font-semibold text-primary flex items-center">
          <GlobeIconLucide className="mr-3 h-7 w-7" />
          DPP Global Tracker
        </h1>
      </header>

      <main className="flex-grow relative grid grid-cols-[280px_1fr] grid-rows-1 gap-0">
        <aside className="row-span-1 col-start-1 bg-card border-r border-border overflow-y-auto p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary"/> Globe Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Displaying a global map with country boundaries. 
                Interaction with specific countries is disabled in this view.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                 <Palette className="mr-2 h-5 w-5 text-primary"/> Globe Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <div className="flex items-center text-xs">
                  <span style={{ backgroundColor: '#003399' }} className="h-3 w-3 rounded-sm mr-2 border border-black/20"></span>
                  <span>Countries (colors vary by texture)</span>
                </div>
                <div className="flex items-center text-xs">
                  <span style={{ backgroundColor: '#ADD8E6' }} className="h-3 w-3 rounded-sm mr-2 border border-black/20"></span>
                  <span>Oceans (Light Blue)</span>
                </div>
                 <p className="text-xs text-muted-foreground mt-2">Country borders are part of the map texture.</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => globeRefMain.current?.pointOfView({ lat: 50, lng: 10, altitude: 1.5 }, 1000)}>
                    <MapPin className="mr-2 h-4 w-4"/> Focus Europe
                </Button>
                 <Button variant="outline" size="sm" className="w-full" onClick={() => {
                     const controls = globeRefMain.current?.controls() as any;
                     if (controls) controls.autoRotate = !controls.autoRotate;
                 }}>
                    <ChevronRight className="mr-2 h-4 w-4"/> Toggle Rotation
                </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="row-span-1 col-start-2 relative" style={{ backgroundColor: GLOBE_PAGE_BACKGROUND_COLOR }}>
            <Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-primary-foreground">Initializing 3D Globe...</p>
              </div>
            }>
              <GlobeVisualization
                globeRef={globeRefMain}
                // Using earth-political.jpg which includes country borders in the texture
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-political.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png" // Can still use bump for texture
                globeBackgroundColor={GLOBE_PAGE_BACKGROUND_COLOR}
                atmosphereColor={ATMOSPHERE_COLOR}
                atmosphereAltitude={0.25}
                // No polygon data or accessors needed for this workaround
              />
            </Suspense>
        </div>
      </main>
      <footer className="p-2 border-t text-center text-xs text-muted-foreground">
        DPP Global Tracker - Displaying global map. Map data: Natural Earth (via unpkg).
      </footer>
    </div>
  );
}

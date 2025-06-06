
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe as GlobeIconLucide, Info, MapPin, Palette, ZoomIn, ZoomOut, Maximize, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';

// Dynamically import the globe visualization component to ensure it's client-side only
const ClientOnlyGlobe = dynamic(
  () => import('@/components/dpp-tracker/GlobeVisualization').then(mod => mod.GlobeVisualization),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-foreground">Loading 3D Globe...</p>
      </div>
    ),
  }
);

// --- Color & Style Constants ---
const GLOBE_TEXTURE_URL = '//unpkg.com/three-globe/example/img/earth-political.jpg'; // Texture with pre-rendered borders and colors
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a'; // Dark background for the page/globe area
const ATMOSPHERE_COLOR = '#4682B4'; // Steel Blue for atmosphere

export default function DppGlobalTrackerPage() {
  const globeEl = useRef<any>(); // Ref for globe controls

  const handleZoomIn = () => globeEl.current?.pointOfView({ altitude: globeEl.current.pointOfView().altitude / 1.5 }, 500);
  const handleZoomOut = () => globeEl.current?.pointOfView({ altitude: globeEl.current.pointOfView().altitude * 1.5 }, 500);
  const handleResetView = () => globeEl.current?.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)] bg-background">
      <header className="p-4 border-b sticky top-0 bg-background z-20">
        <h1 className="text-2xl font-headline font-semibold text-primary flex items-center">
          <GlobeIconLucide className="mr-3 h-7 w-7" />
          DPP Global Tracker (3D Globe)
        </h1>
      </header>

      <main className="flex-grow relative grid grid-cols-[320px_1fr] grid-rows-1 gap-0 overflow-hidden">
        <aside className="row-span-1 col-start-1 bg-card border-r border-border overflow-y-auto p-4 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary"/> Globe Information
              </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use mouse/touch to rotate and zoom the globe. Country details are based on the selected map texture.
                </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                 <Palette className="mr-2 h-5 w-5 text-primary"/> Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
               <div className="flex items-center">
                  <span style={{ backgroundImage: `url(${GLOBE_TEXTURE_URL})`, backgroundSize: 'cover' }} className="h-3 w-3 rounded-full mr-2 border border-black/30 opacity-70"></span>
                  <span>Country Colors & Borders (from texture)</span>
                </div>
                <div className="flex items-center">
                  <span style={{ backgroundColor: '#77b5fe' }} className="h-3 w-3 rounded-full mr-2 border border-black/30 opacity-50"></span>
                  <span>Oceans (from Texture)</span>
                </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In" disabled={!globeEl.current}>
                    <ZoomIn className="h-4 w-4"/>
                </Button>
                 <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out" disabled={!globeEl.current}>
                    <ZoomOut className="h-4 w-4"/>
                </Button>
                 <Button variant="outline" size="icon" onClick={handleResetView} title="Reset View" disabled={!globeEl.current}>
                    <Maximize className="h-4 w-4"/>
                </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="row-span-1 col-start-2 relative overflow-hidden" style={{ backgroundColor: GLOBE_PAGE_BACKGROUND_COLOR }}>
            <ClientOnlyGlobe
              globeRef={globeEl}
              globeImageUrl={GLOBE_TEXTURE_URL}
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundColor={GLOBE_PAGE_BACKGROUND_COLOR} // Ensure globe component uses this for its canvas clear color
              atmosphereColor={ATMOSPHERE_COLOR}
              atmosphereAltitude={0.25}
              // Polygon related props are removed
            />
        </div>
      </main>
      <footer className="p-2 border-t text-center text-xs text-muted-foreground sticky bottom-0 bg-background z-20">
        DPP Global Tracker - 3D Interactive Globe. Country borders and colors are rendered from the globe texture.
      </footer>
    </div>
  );
}

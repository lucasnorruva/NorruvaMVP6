
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Construction, Globe as GlobeIcon, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dynamically import GlobeVisualization to ensure it's client-side only
const GlobeVisualization = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));


// --- Color & Style Constants ---
const EU_BLUE_COLOR = '#00008B'; // Dark Blue for EU countries
const NON_EU_GREY_COLOR = '#D1D5DB'; // Light Grey for non-EU countries
const COUNTRY_BORDER_COLOR = '#000000'; // Black for borders
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a'; // Dark background for the page/globe area
const ATMOSPHERE_COLOR = '#3a82f6'; // Blueish atmosphere
const DEFAULT_OCEAN_TEXTURE = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"; // Light blue oceans

const EU_MEMBER_STATES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia",
  "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia",
  "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania",
  "Slovakia", "Slovenia", "Spain", "Sweden"
];

export default function DppGlobalTrackerPage() {
  const globeRefMain = useRef<GlobeMethods | undefined>();
  const [countryPolygons, setCountryPolygons] = useState<any[]>([]);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true); // Component has mounted, so it's client-side

    // Fetch country polygons
    fetch('/ne_110m_admin_0_countries.geojson')
      .then(res => {
        if (!res.ok) {
          const errorMsg = `GeoJSON fetch error: ${res.status} ${res.statusText} for URL ${res.url}`;
          console.warn(errorMsg); // Changed to warn
          setGeoJsonError(errorMsg);
          toast({
            variant: "destructive",
            title: "Map Data Error",
            description: "Could not load country border data. Some map features may be unavailable.",
          });
          return null; // Indicate failure
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCountryPolygons(data.features);
          setGeoJsonError(null); // Clear any previous error
        }
        // If data is null (fetch failed), geoJsonError is already set
      })
      .catch(err => {
        console.error("Failed to process GeoJSON:", err);
        const errorMsg = err instanceof Error ? err.message : "An unknown error occurred while loading map data.";
        setGeoJsonError(errorMsg);
        toast({
          variant: "destructive",
          title: "Map Data Load Failed",
          description: errorMsg,
        });
      })
      .finally(() => {
        setIsLoadingGeoJson(false);
      });
  }, [toast]);

  // Polygon styling accessors
  const polygonCapColorAccessor = useMemo(() => (feat: any) => {
    const countryName = feat.properties.NAME || feat.properties.ADMIN;
    return EU_MEMBER_STATES.includes(countryName) ? EU_BLUE_COLOR : NON_EU_GREY_COLOR;
  }, []);

  const polygonSideColorAccessor = useMemo(() => (feat: any) => {
     // Match cap color or make transparent for flatter look
    const countryName = feat.properties.NAME || feat.properties.ADMIN;
    return EU_MEMBER_STATES.includes(countryName) ? EU_BLUE_COLOR : NON_EU_GREY_COLOR;
    // return 'rgba(0,0,0,0)'; // Transparent sides for flatter polygons
  }, []);

  const polygonStrokeColorAccessor = useMemo(() => () => COUNTRY_BORDER_COLOR, []);
  const polygonAltitudeAccessor = useMemo(() => () => 0.005, []); // Subtle uniform altitude

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading DPP Global Tracker...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem))] bg-background"> {/* Use CSS var for header height */}
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline font-semibold text-primary flex items-center">
          <GlobeIcon className="mr-3 h-7 w-7" />
          DPP Global Tracker
        </h1>
      </header>

      {geoJsonError && !isLoadingGeoJson && (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Map Data Error</AlertTitle>
          <AlertDescription>
            Failed to load country border data: {geoJsonError}. The globe may not display country outlines correctly. Please ensure 'ne_110m_admin_0_countries.geojson' is in the /public folder.
          </AlertDescription>
        </Alert>
      )}

      <main className="flex-grow relative" style={{ backgroundColor: GLOBE_PAGE_BACKGROUND_COLOR }}>
        {isLoadingGeoJson && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-primary-foreground">Loading map data...</p>
          </div>
        )}
        {!isLoadingGeoJson && (
          <React.Suspense fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-primary-foreground">Initializing Globe...</p>
            </div>
          }>
            <GlobeVisualization
              globeRef={globeRefMain}
              globeImageUrl={DEFAULT_OCEAN_TEXTURE}
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              globeBackgroundColor={GLOBE_PAGE_BACKGROUND_COLOR}
              atmosphereColor={ATMOSPHERE_COLOR}
              atmosphereAltitude={0.25}
              polygonsData={countryPolygons}
              polygonCapColor={polygonCapColorAccessor}
              polygonSideColor={polygonSideColorAccessor}
              polygonStrokeColor={polygonStrokeColorAccessor}
              polygonAltitude={polygonAltitudeAccessor}
              polygonsTransitionDuration={300}
              // Temporarily remove complex layers for this step
              pointsData={[]}
              arcsData={[]}
              customLayerData={[]}
              hexBinPointsData={undefined}
              hexPolygonsData={undefined}
              labelsData={[]}
              htmlElementsData={[]}
            />
          </React.Suspense>
        )}
        
        {/* Placeholder for future UI panels */}
        {/* <div className="absolute top-4 left-4 z-10">
          <Card className="w-80 bg-card/80 backdrop-blur-sm">
            <CardHeader><CardTitle>Info Panel</CardTitle></CardHeader>
            <CardContent><p>Globe controls and data will appear here.</p></CardContent>
          </Card>
        </div> */}

      </main>
      <footer className="p-2 border-t text-center text-xs text-muted-foreground">
        DPP Global Tracker - Data is illustrative.
      </footer>
    </div>
  );
}

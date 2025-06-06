
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Construction, Globe as GlobeIcon, AlertTriangle, Loader2, Palette, Info, MapPin, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GlobeMethods } from 'react-globe.gl';

// Dynamically import GlobeVisualization to ensure it's client-side only
const GlobeVisualization = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));

// --- Color & Style Constants ---
const EU_BLUE_COLOR = '#00008B'; // Dark Blue for EU countries
const NON_EU_GREY_COLOR = '#D1D5DB'; // Light Grey for non-EU countries
const COUNTRY_BORDER_COLOR = '#000000'; // Black for borders
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a'; // Dark background for the page/globe area
const ATMOSPHERE_COLOR = '#3a82f6'; // Blueish atmosphere

const EU_MEMBER_STATES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia",
  "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia",
  "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania",
  "Slovakia", "Slovenia", "Spain", "Sweden"
];

interface GeoJsonFeatureProperties {
  NAME?: string;
  ADMIN?: string; // Often used for country name
  ISO_A2?: string;
  POP_EST?: number;
  [key: string]: any; // Allow other properties
}

interface GeoJsonFeature {
  type: string;
  properties: GeoJsonFeatureProperties;
  geometry: any; 
}

export default function DppGlobalTrackerPage() {
  const globeRefMain = useRef<GlobeMethods | undefined>();
  const [countryPolygons, setCountryPolygons] = useState<GeoJsonFeature[]>([]);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [selectedCountryInfo, setSelectedCountryInfo] = useState<GeoJsonFeatureProperties | null>(null);

  useEffect(() => {
    setIsClient(true); // Component has mounted, so it's client-side

    fetch('/ne_110m_admin_0_countries.geojson')
      .then(res => {
        if (!res.ok) {
          const errorMsg = `GeoJSON fetch error: ${res.status} ${res.statusText} for URL ${res.url}`;
          console.warn(errorMsg); 
          setGeoJsonError(errorMsg);
          toast({
            variant: "destructive",
            title: "Map Data Error",
            description: "Could not load country border data. Some map features may be unavailable.",
          });
          return null; 
        }
        return res.json();
      })
      .then(data => {
        if (data && data.features) {
          setCountryPolygons(data.features);
          setGeoJsonError(null); 
        } else if (data === null) {
          // Error already handled
        } else {
          console.warn("GeoJSON data is not in the expected format or is empty:", data);
          setGeoJsonError("GeoJSON data is not in the expected format.");
          toast({ variant: "destructive", title: "Map Data Format Error", description: "Country data could not be processed." });
        }
      })
      .catch(err => {
        console.error("Failed to process GeoJSON:", err);
        const errorMsg = err instanceof Error ? err.message : "An unknown error occurred while loading map data.";
        setGeoJsonError(errorMsg);
        toast({ variant: "destructive", title: "Map Data Load Failed", description: errorMsg });
      })
      .finally(() => {
        setIsLoadingGeoJson(false);
      });
  }, [toast]);

  const polygonCapColorAccessor = useMemo(() => (feat: GeoJsonFeature) => {
    const countryName = feat.properties.NAME || feat.properties.ADMIN;
    return EU_MEMBER_STATES.includes(countryName || "") ? EU_BLUE_COLOR : NON_EU_GREY_COLOR;
  }, []);

  const polygonSideColorAccessor = useMemo(() => (feat: GeoJsonFeature) => {
    const countryName = feat.properties.NAME || feat.properties.ADMIN;
    return EU_MEMBER_STATES.includes(countryName || "") ? EU_BLUE_COLOR : NON_EU_GREY_COLOR;
  }, []);

  const polygonStrokeColorAccessor = useMemo(() => () => COUNTRY_BORDER_COLOR, []);
  const polygonAltitudeAccessor = useMemo(() => () => 0.005, []); 

  const handlePolygonClick = (polygon: object, event: MouseEvent) => {
    const feature = polygon as GeoJsonFeature; // Type assertion
    if (feature && feature.properties) {
      setSelectedCountryInfo(feature.properties);
      // Fly to country (optional, can be refined)
      if (globeRefMain.current && feature.geometry && feature.geometry.coordinates) {
        // This part is tricky as GeoJSON coordinates can be complex (MultiPolygon)
        // For simplicity, we might need a pre-calculated centroid or use a library
        // For now, just log it
        console.log("Clicked country:", feature.properties.NAME || feature.properties.ADMIN);
      }
    }
  };


  const dynamicGlobeLegendMap = {
    "EU Member State": EU_BLUE_COLOR,
    "Non-EU Country": NON_EU_GREY_COLOR,
    "Country Border": COUNTRY_BORDER_COLOR,
  };

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

      <main className="flex-grow relative grid grid-cols-[280px_1fr] grid-rows-1 gap-0">
        <aside className="row-span-1 col-start-1 bg-card border-r border-border overflow-y-auto p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary"/> Selection Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCountryInfo ? (
                <div>
                  <h3 className="font-medium text-base text-primary mb-1">
                    {selectedCountryInfo.NAME || selectedCountryInfo.ADMIN || "Unknown Country"}
                  </h3>
                  {selectedCountryInfo.ISO_A2 && <p className="text-xs text-muted-foreground">Code: {selectedCountryInfo.ISO_A2}</p>}
                  {typeof selectedCountryInfo.POP_EST === 'number' && <p className="text-xs text-muted-foreground">Est. Population: {selectedCountryInfo.POP_EST.toLocaleString()}</p>}
                  {/* Add more details as needed */}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Click on a country on the globe to see its details here.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                 <Palette className="mr-2 h-5 w-5 text-primary"/> Globe Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(dynamicGlobeLegendMap).map(([name, color]) => (
                <div key={name} className="flex items-center text-xs">
                  <span style={{ backgroundColor: color }} className="h-3 w-3 rounded-sm mr-2 border border-black/20"></span>
                  <span>{name}</span>
                </div>
              ))}
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
                     const controls = globeRefMain.current?.controls();
                     if (controls) controls.autoRotate = !controls.autoRotate;
                 }}>
                    <ChevronRight className="mr-2 h-4 w-4"/> Toggle Rotation
                </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="row-span-1 col-start-2 relative" style={{ backgroundColor: GLOBE_PAGE_BACKGROUND_COLOR }}>
          {(isLoadingGeoJson || countryPolygons.length === 0 && !geoJsonError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-primary-foreground">Loading map data...</p>
            </div>
          )}
          {!isLoadingGeoJson && (
            <React.Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-primary-foreground">Initializing 3D Globe...</p>
              </div>
            }>
              <GlobeVisualization
                globeRef={globeRefMain}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                globeBackgroundColor={GLOBE_PAGE_BACKGROUND_COLOR}
                atmosphereColor={ATMOSPHERE_COLOR}
                atmosphereAltitude={0.25}
                polygonsData={countryPolygons}
                polygonCapColor={polygonCapColorAccessor}
                polygonSideColor={polygonSideColorAccessor}
                polygonStrokeColor={polygonStrokeColorAccessor}
                polygonAltitude={polygonAltitudeAccessor}
                onPolygonClick={handlePolygonClick}
                polygonsTransitionDuration={300}
                pointsData={[]}
                arcsData={[]}
                customLayerData={[]}
                labelsData={[]}
                htmlElementsData={[]}
              />
            </React.Suspense>
          )}
        </div>
      </main>
      <footer className="p-2 border-t text-center text-xs text-muted-foreground">
        DPP Global Tracker - Data is illustrative. Click on countries for basic info.
      </footer>
    </div>
  );
}


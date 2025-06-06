
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe as GlobeIconLucide, Info, MapPin, ZoomIn, ZoomOut, Maximize, AlertTriangle, Loader2, Palette } from "lucide-react";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { GlobeMethods } from 'react-globe.gl';

// Dynamically import the GlobeVisualization component
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
const EU_BLUE_COLOR = '#003399';
const NON_EU_GREY_COLOR = '#D1D5DB';
const COUNTRY_BORDER_COLOR = '#000000';
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a';
const ATMOSPHERE_COLOR = '#4682B4';
const OCEAN_TEXTURE_URL = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

const EU_MEMBER_STATES_ISO_A2 = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE'
];

const getCountryISO_A2 = (feature: any): string | undefined => {
  // world-atlas@2.0.2/countries-110m.json specific properties
  if (feature?.properties?. sovereignt && feature.properties. sovereignt === "Somaliland") return "SO"; // Special case for Somaliland if needed
  if (feature?.properties?. sovereignt && feature.properties. sovereignt === "N. Cyprus") return "CY"; // Special case for Northern Cyprus if needed

  // Common properties from world-atlas or similar Natural Earth derived GeoJSONs
  return feature?.properties?.iso_a2 || feature?.properties?.ISO_A2 || feature?.properties?.ISO_A2_EH;
};

const getCountryName = (feature: any): string | undefined => {
  return feature?.properties?.name || feature?.properties?.NAME || feature?.properties?.NAME_EN || feature?.properties?.ADMIN || feature?.properties?. sovereignt || 'Unknown Country';
};

interface SelectedCountryProperties {
  name?: string;
  iso_a2?: string;
  continent?: string;
  subregion?: string;
  pop_est?: number;
  [key: string]: any;
}

export default function DppGlobalTrackerPage() {
  const globeEl = useRef<GlobeMethods | undefined>();
  const { toast } = useToast();

  const [countryPolygons, setCountryPolygons] = useState<any[]>([]);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);
  const [selectedCountryInfo, setSelectedCountryInfo] = useState<SelectedCountryProperties | null>(null);

  useEffect(() => {
    const fetchGeoJson = async () => {
      setIsLoadingGeoJson(true);
      setGeoJsonError(null);
      try {
        const response = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch GeoJSON: ${response.status} ${response.statusText}. Server said: ${errorText.substring(0,100)}. URL: ${response.url}`);
        }
        const world = await response.json();
        const topojson = await import('topojson-client');
        if (world.objects && world.objects.countries) {
          const geoJsonFeatures = topojson.feature(world, world.objects.countries).features;
          setCountryPolygons(geoJsonFeatures);
        } else {
           throw new Error("GeoJSON structure from unpkg.com/world-atlas is not as expected. Missing 'objects.countries'.");
        }
      } catch (error: any) {
        console.warn("Error loading GeoJSON data from unpkg.com:", error.message, error);
        setGeoJsonError(error.message || "Could not load country boundary data from CDN. Please ensure you are online.");
        toast({
          variant: "destructive",
          title: "Map Data Error (CDN)",
          description: `Could not load country data from CDN: ${error.message}. The globe may not display country-specific details or colors correctly.`,
          duration: 10000,
        });
      } finally {
        setIsLoadingGeoJson(false);
      }
    };
    fetchGeoJson();
  }, [toast]);

  const polygonCapColorAccessor = useCallback((feat: any) => {
    const isoA2 = getCountryISO_A2(feat);
    if (isoA2 && EU_MEMBER_STATES_ISO_A2.includes(isoA2.toUpperCase())) {
      return EU_BLUE_COLOR;
    }
    return NON_EU_GREY_COLOR;
  }, []);

  const polygonSideColorAccessor = useCallback(() => 'rgba(0, 0, 0, 0.05)', []);
  const polygonStrokeColorAccessor = useCallback(() => COUNTRY_BORDER_COLOR, []);
  const polygonAltitudeAccessor = useCallback(() => 0.01, []);

  const handlePolygonClick = useCallback((polygon: any, event: MouseEvent) => {
    if (polygon && polygon.properties) {
      setSelectedCountryInfo({
        name: getCountryName(polygon),
        iso_a2: getCountryISO_A2(polygon),
        continent: polygon.properties.CONTINENT || polygon.properties.continent,
        subregion: polygon.properties.SUBREGION || polygon.properties.subregion,
        pop_est: polygon.properties.POP_EST || polygon.properties.pop_est,
      });
    } else {
      setSelectedCountryInfo(null);
    }
  }, []);

  const handleZoomIn = () => globeEl.current?.pointOfView({ altitude: (globeEl.current.pointOfView().altitude || 2.5) / 1.5 }, 500);
  const handleZoomOut = () => globeEl.current?.pointOfView({ altitude: (globeEl.current.pointOfView().altitude || 2.5) * 1.5 }, 500);
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
              {selectedCountryInfo ? (
                <div className="text-sm space-y-1">
                  <h3 className="font-semibold text-base text-primary">{selectedCountryInfo.name || "Unknown Country"}</h3>
                  {selectedCountryInfo.iso_a2 && <p><strong>Code:</strong> {selectedCountryInfo.iso_a2}</p>}
                  {selectedCountryInfo.continent && <p><strong>Continent:</strong> {selectedCountryInfo.continent}</p>}
                  {selectedCountryInfo.subregion && <p><strong>Region:</strong> {selectedCountryInfo.subregion}</p>}
                  {selectedCountryInfo.pop_est && <p><strong>Population:</strong> {Number(selectedCountryInfo.pop_est).toLocaleString()}</p>}
                   <p className="mt-2 text-xs text-muted-foreground">DPP Compliance: Pending (Mock)</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click on a country to view its details. Rotate and zoom the globe.
                </p>
              )}
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
                  <span style={{ backgroundColor: EU_BLUE_COLOR }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span>
                  <span>EU Member States</span>
                </div>
                <div className="flex items-center">
                  <span style={{ backgroundColor: NON_EU_GREY_COLOR }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span>
                  <span>Non-EU Countries</span>
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full mr-2 border-2 border-black bg-transparent"></span>
                  <span>Country Borders</span>
                </div>
                 <div className="flex items-center">
                  <span style={{ backgroundImage: `url(${OCEAN_TEXTURE_URL})`, backgroundSize: 'cover' }} className="h-3 w-3 rounded-full mr-2 border border-black/30 opacity-70"></span>
                  <span>Oceans (texture)</span>
                </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In" disabled={!globeEl.current || isLoadingGeoJson}>
                    <ZoomIn className="h-4 w-4"/>
                </Button>
                 <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out" disabled={!globeEl.current || isLoadingGeoJson}>
                    <ZoomOut className="h-4 w-4"/>
                </Button>
                 <Button variant="outline" size="icon" onClick={handleResetView} title="Reset View" disabled={!globeEl.current || isLoadingGeoJson}>
                    <Maximize className="h-4 w-4"/>
                </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="row-span-1 col-start-2 relative overflow-hidden" style={{ backgroundColor: GLOBE_PAGE_BACKGROUND_COLOR }}>
            {isLoadingGeoJson && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                <p className="text-primary-foreground">Loading map data from CDN...</p>
              </div>
            )}
            {geoJsonError && !isLoadingGeoJson && (
              <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
                <Alert variant="destructive" className="max-w-md bg-destructive/90 text-destructive-foreground">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle>Map Data Error (CDN)</AlertTitle>
                  <AlertDescription>
                    Could not load country boundary data from CDN: <br /> {geoJsonError}
                    <br /><br />The globe might not display countries correctly. Please check your internet connection or try refreshing.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {!isLoadingGeoJson && !geoJsonError && countryPolygons.length > 0 && (
              <ClientOnlyGlobe
                globeRef={globeEl}
                globeImageUrl={OCEAN_TEXTURE_URL}
                backgroundColor="rgba(0,0,0,0)"
                atmosphereColor={ATMOSPHERE_COLOR}
                atmosphereAltitude={0.25}
                polygonsData={countryPolygons}
                polygonCapColor={polygonCapColorAccessor}
                polygonSideColor={polygonSideColorAccessor}
                polygonStrokeColor={polygonStrokeColorAccessor}
                polygonAltitude={polygonAltitudeAccessor}
                onPolygonClick={handlePolygonClick}
                polygonsTransitionDuration={300}
              />
            )}
            {!isLoadingGeoJson && !geoJsonError && countryPolygons.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
                     <Alert variant="default" className="max-w-md bg-muted">
                         <Info className="h-5 w-5" />
                         <AlertTitle>Map Data Not Displayed</AlertTitle>
                         <AlertDescription>
                             Country boundaries could not be rendered. The GeoJSON from CDN might be empty or in an unexpected format after processing.
                         </AlertDescription>
                     </Alert>
                 </div>
            )}
        </div>
      </main>
      <footer className="p-2 border-t text-center text-xs text-muted-foreground sticky bottom-0 bg-background z-20">
        DPP Global Tracker - 3D Interactive Globe. Country data from unpkg.com (world-atlas).
      </footer>
    </div>
  );
}

    
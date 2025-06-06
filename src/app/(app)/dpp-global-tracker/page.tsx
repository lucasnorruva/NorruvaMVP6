
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
  () => import('@/components/dpp-tracker/GlobeVisualization'),
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
const EU_BLUE_COLOR = '#003399'; // Darker blue for EU
const NON_EU_GREY_COLOR = '#D1D5DB'; // Light grey for non-EU
const COUNTRY_BORDER_COLOR = '#000000'; // Black for borders
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a'; // Dark background for the page/globe area
const ATMOSPHERE_COLOR = '#4682B4'; // Steel blue for atmosphere
const OCEAN_TEXTURE_URL = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'; // Light blue oceans

const EU_MEMBER_STATES_ISO_A2 = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE'
];

// Helper to get ISO A2 code, robustly checking common property names
const getCountryISO_A2 = (feature: any): string | undefined => {
  if (!feature || !feature.properties) return undefined;
  const props = feature.properties;
  // Fixes for specific entities in world-atlas
  if (props.sovereignt === "Somaliland") return "SO"; // Somaliland is de facto independent, often coded as part of Somalia (SO) or separately (not official ISO)
  if (props.sovereignt === "N. Cyprus") return "CY"; // Northern Cyprus, recognized only by Turkey, use Cyprus (CY)
  return props.iso_a2 || props.ISO_A2 || props.ISO_A2_EH || props.ADM0_A3; // ADM0_A3 as a fallback
};

// Helper to get country name, robustly checking common property names
const getCountryName = (feature: any): string => {
  if (!feature || !feature.properties) return 'Unknown Territory';
  const props = feature.properties;
  return props.name || props.NAME || props.NAME_EN || props.ADMIN || props.sovereignt || 'Unknown Country';
};

interface SelectedCountryProperties {
  name?: string;
  iso_a2?: string;
  continent?: string;
  subregion?: string;
  pop_est?: number | string;
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
        // Using 50m resolution for more detail
        const response = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch GeoJSON: ${response.status} ${response.statusText}. Server said: ${errorText.substring(0,100)}. URL: ${response.url}`);
        }
        const world = await response.json();
        const topojson = await import('topojson-client');
        
        if (world.objects && world.objects.countries) {
          const geoJsonFeatures = topojson.feature(world, world.objects.countries).features;
          
          // --- GeoJSON Data Validation ---
          let missingNameCount = 0;
          let missingIsoA2Count = 0;
          geoJsonFeatures.forEach(feature => {
            if (!feature.properties) {
              missingNameCount++;
              missingIsoA2Count++;
              return;
            }
            const name = feature.properties.sovereignt || feature.properties.name || feature.properties.NAME || feature.properties.NAME_EN || feature.properties.ADMIN;
            const iso_a2 = feature.properties.iso_a2 || feature.properties.ISO_A2 || feature.properties.ISO_A2_EH;
            
            if (!name) missingNameCount++;
            if (!iso_a2 && feature.properties.sovereignt !== "Somaliland" && feature.properties.sovereignt !== "N. Cyprus") { 
              // Special cases for Somaliland and N. Cyprus are handled in getCountryISO_A2,
              // so don't count them as missing iso_a2 if sovereignt is present.
              // We also check if ADM0_A3 is present as a fallback, if not, count as missing.
              if (!feature.properties.ADM0_A3) missingIsoA2Count++;
            }
          });

          if (missingNameCount > 0 || missingIsoA2Count > 0) {
            const message = `GeoJSON Validation: ${missingNameCount} countries missing name. ${missingIsoA2Count} countries missing ISO A2 code. Some map features or info might be incomplete.`;
            console.warn(message);
            if (missingNameCount > geoJsonFeatures.length * 0.1 || missingIsoA2Count > geoJsonFeatures.length * 0.1) { // If more than 10% issues
              toast({
                variant: "default", // Use default or a custom 'warning' variant if available
                title: "Map Data Inconsistencies",
                description: `Found ${missingNameCount} countries missing names and ${missingIsoA2Count} missing ISO codes. Some map details might be affected.`,
                duration: 8000,
              });
            }
          }
          // --- End GeoJSON Data Validation ---

          setCountryPolygons(geoJsonFeatures);
        } else {
           throw new Error("GeoJSON structure from unpkg.com/world-atlas (50m) is not as expected. Missing 'objects.countries'.");
        }
      } catch (error: any) {
        console.error("Error loading 50m GeoJSON data from unpkg.com:", error.message, error);
        setGeoJsonError(error.message || "Could not load detailed country boundary data from CDN. Please ensure you are online.");
        toast({
          variant: "destructive",
          title: "Map Data Error (CDN)",
          description: `Could not load detailed country data: ${error.message}. The globe may not display country-specific details correctly.`,
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
      const props = polygon.properties;
      setSelectedCountryInfo({
        name: getCountryName(polygon),
        iso_a2: getCountryISO_A2(polygon),
        continent: props.CONTINENT || props.continent || props.REGION_UN || "N/A",
        subregion: props.SUBREGION || props.subregion || props.REGION_WB || "N/A",
        pop_est: props.POP_EST || props.pop_est || props.POP_MAX || "N/A",
      });
       if (globeEl.current) {
        globeEl.current.pointOfView({ lat: polygon.properties.latitude || 0, lng: polygon.properties.longitude || 0, altitude: 1 }, 750);
      }
    } else {
      setSelectedCountryInfo(null);
    }
  }, []);

  const handleZoomIn = () => globeEl.current?.pointOfView({ altitude: Math.max(0.1, (globeEl.current.pointOfView().altitude || 2.5) / 1.5) }, 500);
  const handleZoomOut = () => globeEl.current?.pointOfView({ altitude: Math.min(5, (globeEl.current.pointOfView().altitude || 2.5) * 1.5) }, 500);
  const handleResetView = () => globeEl.current?.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)] bg-background">
      <header className="p-4 border-b sticky top-0 bg-background z-20">
        <h1 className="text-2xl font-headline font-semibold text-primary flex items-center">
          <GlobeIconLucide className="mr-3 h-7 w-7" />
          DPP Global Tracker (3D Globe - 50m Detail)
        </h1>
      </header>

      <main className="flex-grow relative grid grid-cols-[320px_1fr] grid-rows-1 gap-0 overflow-hidden">
        <aside className="row-span-1 col-start-1 bg-card border-r border-border overflow-y-auto p-4 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary"/> Selected Region Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCountryInfo ? (
                <div className="text-sm space-y-1">
                  <h3 className="font-semibold text-base text-primary">{selectedCountryInfo.name || "Unknown Country"}</h3>
                  {selectedCountryInfo.iso_a2 && <p><strong>Code:</strong> {selectedCountryInfo.iso_a2}</p>}
                  {selectedCountryInfo.continent && <p><strong>Continent:</strong> {selectedCountryInfo.continent}</p>}
                  {selectedCountryInfo.subregion && <p><strong>Region:</strong> {selectedCountryInfo.subregion}</p>}
                  {selectedCountryInfo.pop_est && typeof selectedCountryInfo.pop_est === 'number' && <p><strong>Population:</strong> {selectedCountryInfo.pop_est.toLocaleString()}</p>}
                  {selectedCountryInfo.pop_est && typeof selectedCountryInfo.pop_est === 'string' && <p><strong>Population:</strong> {selectedCountryInfo.pop_est}</p>}
                   <p className="mt-2 text-xs text-muted-foreground">Shipment/Compliance Data: (Mock - To be implemented)</p>
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
                  <span className="h-3 w-3 rounded-full mr-2 border-2 border-black bg-transparent opacity-70"></span>
                  <span>Country Borders (Black)</span>
                </div>
                 <div className="flex items-center">
                  <span style={{ backgroundImage: `url(${OCEAN_TEXTURE_URL})`, backgroundSize: 'cover' }} className="h-3 w-3 rounded-full mr-2 border border-black/30 opacity-70"></span>
                  <span>Oceans (Light Blue Texture)</span>
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
                <p className="text-primary-foreground">Loading detailed map data...</p>
              </div>
            )}
            {geoJsonError && !isLoadingGeoJson && (
              <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
                <Alert variant="destructive" className="max-w-md bg-destructive/90 text-destructive-foreground">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle>Map Data Error (CDN)</AlertTitle>
                  <AlertDescription>
                    Could not load country boundary data: <br /> {geoJsonError}
                    <br /><br />Please check your internet connection or try refreshing.
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
                polygonsTransitionDuration={0}
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
        DPP Global Tracker - 3D Interactive Globe. Country data from unpkg.com (world-atlas, 50m resolution).
      </footer>
    </div>
  );
}


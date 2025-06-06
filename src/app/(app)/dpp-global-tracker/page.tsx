
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe as GlobeIconLucide, Info, MapPin, Palette, ZoomIn, ZoomOut, Maximize, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
const EU_BLUE_COLOR = '#00008B';         // Dark Blue for EU countries
const NON_EU_GREY_COLOR = '#D1D5DB';     // Light Grey for non-EU countries
const COUNTRY_BORDER_COLOR = '#000000';  // Black for country borders
const OCEAN_TEXTURE_URL = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'; // Light blue oceans
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a'; // Dark background for the page/globe area
const ATMOSPHERE_COLOR = '#4682B4'; // Steel Blue for atmosphere

// List of EU Member States (ISO A2 Codes) - common source of truth
const EU_MEMBER_STATES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

interface GeoJsonFeatureProperties {
  ADMIN: string; // Country name
  ISO_A2: string; // ISO A2 Code
  POP_EST?: number; // Estimated Population
  [key: string]: any; // Allow other properties
}

interface GeoJsonFeature {
  type: string;
  properties: GeoJsonFeatureProperties;
  geometry: any;
}

interface SelectedCountryInfo {
  name: string;
  iso_a2: string;
  population?: string;
  [key: string]: any;
}

export default function DppGlobalTrackerPage() {
  const { toast } = useToast();
  const [countryPolygons, setCountryPolygons] = useState<GeoJsonFeature[]>([]);
  const [selectedCountryInfo, setSelectedCountryInfo] = useState<SelectedCountryInfo | null>(null);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [globeKey, setGlobeKey] = useState(Date.now()); // Used to force re-mount of globe if needed

  // Refs for globe controls
  const globeEl = React.useRef<any>();

  useEffect(() => {
    setIsLoadingGeoJson(true);
    setGeoJsonError(null);
    fetch('/ne_110m_admin_0_countries.geojson')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${res.status} ${res.statusText}. Expected URL: ${res.url}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.features) {
          setCountryPolygons(data.features);
        } else {
          throw new Error("GeoJSON data is not in the expected FeatureCollection format or is empty.");
        }
        setIsLoadingGeoJson(false);
      })
      .catch(error => {
        console.warn("Error loading GeoJSON data:", error.message);
        setGeoJsonError(error.message || "Could not load country outline data. Please ensure 'ne_110m_admin_0_countries.geojson' is in the /public folder and the server is running.");
        toast({
          variant: "destructive",
          title: "Map Data Error",
          description: `Could not load country data. ${error.message}. Check console & file location.`,
          duration: 10000,
        });
        setIsLoadingGeoJson(false);
      });
  }, []);

  const polygonCapColorAccessor = useMemo(() => (feat: GeoJsonFeature) =>
    EU_MEMBER_STATES.includes(feat.properties.ISO_A2) ? EU_BLUE_COLOR : NON_EU_GREY_COLOR,
    []
  );

  const polygonSideColorAccessor = useMemo(() => () => 'rgba(0, 0, 0, 0.05)', []); // Subtle side color
  const polygonStrokeColorAccessor = useMemo(() => () => COUNTRY_BORDER_COLOR, []);
  const polygonAltitudeAccessor = useMemo(() => () => 0.01, []); // Slight uniform altitude for better visibility

  const handlePolygonClick = (polygon: GeoJsonFeature) => {
    const props = polygon.properties;
    setSelectedCountryInfo({
      name: props.ADMIN || 'N/A',
      iso_a2: props.ISO_A2 || 'N/A',
      population: props.POP_EST ? props.POP_EST.toLocaleString() : 'N/A',
      continent: props.CONTINENT || 'N/A',
      region: props.REGION_WB || 'N/A',
    });
  };

  const handleZoomIn = () => globeEl.current?.pointOfView({ altitude: globeEl.current.pointOfView().altitude / 1.5 }, 500);
  const handleZoomOut = () => globeEl.current?.pointOfView({ altitude: globeEl.current.pointOfView().altitude * 1.5 }, 500);
  const handleResetView = () => globeEl.current?.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);


  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)] bg-background"> {/* Adjust height based on your header */}
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
                <div className="space-y-1 text-sm">
                  <h3 className="font-semibold text-primary mb-1">{selectedCountryInfo.name}</h3>
                  <p><strong className="text-muted-foreground">ISO A2:</strong> {selectedCountryInfo.iso_a2}</p>
                  <p><strong className="text-muted-foreground">Population (Est.):</strong> {selectedCountryInfo.population}</p>
                  <p><strong className="text-muted-foreground">Continent:</strong> {selectedCountryInfo.continent}</p>
                  <p><strong className="text-muted-foreground">Region:</strong> {selectedCountryInfo.region}</p>
                  <p className="mt-2 pt-2 border-t text-xs text-muted-foreground">DPP Compliance: Pending (Mock)</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click on a country to view details. Use mouse/touch to rotate and zoom the globe.
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
                  <span>EU Member State</span>
                </div>
                <div className="flex items-center">
                  <span style={{ backgroundColor: NON_EU_GREY_COLOR }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span>
                  <span>Non-EU Country</span>
                </div>
                 <div className="flex items-center">
                  <span style={{ backgroundColor: COUNTRY_BORDER_COLOR }} className="h-3 w-0.5 mr-2"></span>
                  <span className="border-t border-black inline-block h-0 w-2.5 align-middle mr-1"></span>
                  <span>Country Borders</span>
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
          {geoJsonError && !isLoadingGeoJson && (
            <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
              <Alert variant="destructive" className="max-w-md">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Map Data Error</AlertTitle>
                <AlertDescription>
                  {geoJsonError} Please verify the file `ne_110m_admin_0_countries.geojson` is in the `/public` directory of your project, the filename is exact (case-sensitive), and restart the development server.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {!geoJsonError && (
            <ClientOnlyGlobe
              key={globeKey} // Force re-mount if key changes (e.g., on error then fix)
              globeRef={globeEl}
              globeImageUrl={OCEAN_TEXTURE_URL}
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundColor={GLOBE_PAGE_BACKGROUND_COLOR}
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
        </div>
      </main>
      <footer className="p-2 border-t text-center text-xs text-muted-foreground sticky bottom-0 bg-background z-20">
        DPP Global Tracker - 3D Interactive Globe. Click countries for mock data.
      </footer>
    </div>
  );
}

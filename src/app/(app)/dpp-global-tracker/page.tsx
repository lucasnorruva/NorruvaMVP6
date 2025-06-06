
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
import * as topojson from 'topojson-client';

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

const EU_BLUE_COLOR = 'rgba(0, 0, 139, 0.7)'; // Dark blue with some transparency
const NON_EU_GREY_COLOR = 'rgba(209, 213, 219, 0.6)'; // Light grey with some transparency
const COUNTRY_BORDER_COLOR = 'rgba(0, 0, 0, 0.5)'; // Black for borders
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a'; // Dark background for the page/globe area
const ATMOSPHERE_COLOR = '#4682B4'; // Steel blue for atmosphere
const OCEAN_TEXTURE_URL = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

const EU_MEMBER_STATES_ISO_A2 = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE'
];

// Helper to get ISO A2 code
const getCountryISO_A2 = (feature: any): string | undefined => {
  if (!feature || !feature.properties) return undefined;
  const props = feature.properties;
  if (props.sovereignt === "Somaliland") return "SO";
  if (props.sovereignt === "N. Cyprus") return "CY";
  return props.iso_a2 || props.ISO_A2 || props.ISO_A2_EH || props.ADM0_A3;
};

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

interface ShipmentPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  status: 'In Transit' | 'Customs Review' | 'Cleared' | 'Delayed';
}

const MOCK_SHIPMENT_POINTS: ShipmentPoint[] = [
  { id: 'ship001', name: 'Shipment Alpha', lat: 34.0522, lng: -118.2437, size: 0.5, color: 'rgba(0, 255, 0, 0.75)', status: 'In Transit' }, // Los Angeles
  { id: 'ship002', name: 'Shipment Bravo', lat: 51.5074, lng: -0.1278, size: 0.6, color: 'rgba(255, 165, 0, 0.75)', status: 'Customs Review' }, // London
  { id: 'ship003', name: 'Shipment Charlie', lat: 35.6895, lng: 139.6917, size: 0.4, color: 'rgba(0, 0, 255, 0.75)', status: 'Cleared' }, // Tokyo
  { id: 'ship004', name: 'Shipment Delta (EU)', lat: 48.8566, lng: 2.3522, size: 0.55, color: 'rgba(255,0,0,0.75)', status: 'Delayed' }, // Paris (EU)
];


export default function DppGlobalTrackerPage() {
  const globeEl = useRef<GlobeMethods | undefined>();
  const { toast } = useToast();

  const [countryPolygons, setCountryPolygons] = useState<any[]>([]);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);
  const [selectedCountryInfo, setSelectedCountryInfo] = useState<SelectedCountryProperties | null>(null);
  const [shipmentPoints, setShipmentPoints] = useState<ShipmentPoint[]>(MOCK_SHIPMENT_POINTS);

  useEffect(() => {
    const fetchGeoJson = async () => {
      setIsLoadingGeoJson(true);
      setGeoJsonError(null);
      try {
        const response = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch GeoJSON: ${response.status} ${response.statusText}. Server said: ${errorText.substring(0,100)}. URL: ${response.url}`);
        }
        const world = await response.json();

        if (world.objects && world.objects.countries) {
          const geoJsonFeatures = (topojson.feature(world, world.objects.countries) as any).features;

          let missingNameCount = 0;
          let missingIsoA2Count = 0;

          geoJsonFeatures.forEach((feature: any) => {
            const name = getCountryName(feature);
            const iso_a2 = getCountryISO_A2(feature);
            if (!name || name === 'Unknown Country' || name === 'Unknown Territory') missingNameCount++;
            if (!iso_a2) missingIsoA2Count++;
          });

          if (missingNameCount > 0 || missingIsoA2Count > 0) {
            const message = `GeoJSON Validation: ${missingNameCount} countries missing name. ${missingIsoA2Count} countries missing ISO A2 code. Some map features or info might be incomplete.`;
            console.warn(message);
            if (missingNameCount > geoJsonFeatures.length * 0.1 || missingIsoA2Count > geoJsonFeatures.length * 0.1) {
              toast({
                variant: "default",
                title: "Map Data Inconsistencies",
                description: `Found ${missingNameCount} countries missing names and ${missingIsoA2Count} missing ISO codes. Some map details might be affected.`,
                duration: 8000,
              });
            }
          }
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

  const polygonSideColorAccessor = useCallback(() => 'rgba(0,0,0,0.05)', []);
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
        const centroid = (polygon.geometry && (polygon.geometry.type === 'Polygon' || polygon.geometry.type === 'MultiPolygon')) ?
             (topojson.feature(polygon, polygon.geometry) as any).properties.centroid || [0,0] : // This part might be tricky without a proper centroid function
             { lat: 0, lng: 0};
        let targetLat = centroid.lat || (polygon.properties.latitude);
        let targetLng = centroid.lng || (polygon.properties.longitude);
        
        if (!targetLat && polygon.bbox) { // Fallback to bounding box center
            targetLat = (polygon.bbox[1] + polygon.bbox[3]) / 2;
            targetLng = (polygon.bbox[0] + polygon.bbox[2]) / 2;
        }
        targetLat = targetLat || 0;
        targetLng = targetLng || 0;

        globeEl.current.pointOfView({ lat: targetLat, lng: targetLng, altitude: 1.5 }, 750);
      }
    } else {
      setSelectedCountryInfo(null);
    }
  }, []);

  const handleZoomIn = () => globeEl.current?.pointOfView({ altitude: Math.max(0.1, (globeEl.current.pointOfView().altitude || 2.5) / 1.5) }, 500);
  const handleZoomOut = () => globeEl.current?.pointOfView({ altitude: Math.min(5, (globeEl.current.pointOfView().altitude || 2.5) * 1.5) }, 500);
  const handleResetView = () => globeEl.current?.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);

  // Accessors for shipment points
  const pointLatAccessor = useCallback((p: ShipmentPoint) => p.lat, []);
  const pointLngAccessor = useCallback((p: ShipmentPoint) => p.lng, []);
  const pointColorAccessor = useCallback((p: ShipmentPoint) => p.color, []);
  const pointAltitudeAccessor = useCallback(() => 0.02, []); // Slightly above surface
  const pointRadiusAccessor = useCallback((p: ShipmentPoint) => p.size, []);


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
                  {selectedCountryInfo.pop_est && <p><strong>Population Est.:</strong> {Number(selectedCountryInfo.pop_est).toLocaleString()}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">Shipment/Compliance Data: (Mock - To be implemented)</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click on a country to view its details. Rotate and zoom the globe. Shipment markers show current mock activities.
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
                  <span>Oceans (Blue Marble Texture)</span>
                </div>
                <div className="mt-2 pt-2 border-t">
                    <p className="font-medium mb-1">Shipment Markers:</p>
                    <div className="flex items-center"><span style={{ backgroundColor: 'rgba(0, 255, 0, 0.75)' }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span><span>In Transit</span></div>
                    <div className="flex items-center"><span style={{ backgroundColor: 'rgba(255, 165, 0, 0.75)' }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span><span>Customs Review</span></div>
                    <div className="flex items-center"><span style={{ backgroundColor: 'rgba(0, 0, 255, 0.75)' }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span><span>Cleared</span></div>
                    <div className="flex items-center"><span style={{ backgroundColor: 'rgba(255,0,0,0.75)' }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span><span>Delayed</span></div>
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
                pointsData={shipmentPoints}
                pointLat={pointLatAccessor}
                pointLng={pointLngAccessor}
                pointAltitude={pointAltitudeAccessor}
                pointRadius={pointRadiusAccessor}
                pointColor={pointColorAccessor}
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


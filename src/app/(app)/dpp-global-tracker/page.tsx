
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe as GlobeIconLucide, Info, MapPin, ZoomIn, ZoomOut, Maximize, AlertTriangle, Loader2, Palette, Ship, Truck, Plane, Layers as LayersIcon, Route, Paintbrush, Building } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { GlobeMethods } from 'react-globe.gl';
import * as topojson from 'topojson-client';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

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

const COMPLIANCE_STATUS_COLORS: Record<string, string> = {
  fully_compliant: 'rgba(0, 128, 0, 0.85)', // Green
  lacking_compliance: 'rgba(255, 0, 0, 0.85)', // Red
  partial_compliance: 'rgba(255, 165, 0, 0.85)', // Orange
  unknown_compliance: 'rgba(200, 200, 200, 0.7)', // Light Grey for unknown
};
const LIGHT_GREY_UNIFORM_LAND_COLOR = 'rgba(200, 200, 200, 0.85)';
const BLACK_BORDER_COLOR = 'rgba(0, 0, 0, 1)';
const GLOBE_PAGE_BACKGROUND_COLOR = '#0a0a0a';
const VIBRANT_LIGHT_BLUE_OCEAN_TEXTURE_URL = '//unpkg.com/three-globe/example/img/earth-day.jpg';
const ATMOSPHERE_COLOR = '#4682B4';

const MOCK_COUNTRY_COMPLIANCE: Record<string, keyof typeof COMPLIANCE_STATUS_COLORS> = {
  'DE': 'fully_compliant', 'FR': 'fully_compliant', 'IT': 'partial_compliance',
  'ES': 'partial_compliance', 'PL': 'fully_compliant', 'US': 'partial_compliance',
  'CN': 'lacking_compliance', 'IN': 'lacking_compliance', 'BR': 'partial_compliance',
  'GB': 'fully_compliant', 'AU': 'fully_compliant', 'CA': 'partial_compliance',
  'JP': 'fully_compliant', 'ZA': 'lacking_compliance',
};

const getCountryISO_A2 = (feature: Feature<Geometry, any>): string | undefined => {
  if (!feature || !feature.properties) return undefined;
  const props = feature.properties;
  if (props.ISO_A2 && props.ISO_A2 !== "-99") return props.ISO_A2.trim().toUpperCase();
  if (props.iso_a2 && props.iso_a2 !== "-99") return props.iso_a2.trim().toUpperCase();
  if (props.ADM0_A3 === "Somaliland") return "SO";
  if (props.ADMIN && props.ADMIN === "Kosovo") return "XK";
  if (props.NAME && props.NAME === "N. Cyprus") return "CY";
  const potentialCodes = [props.WB_A2, props.GU_A2, props.ADM0_A2, props.POSTAL];
  for (const code of potentialCodes) {
    if (code && typeof code === 'string' && code.length === 2 && code !== "-99" && /^[A-Za-z]{2}$/.test(code)) return code.trim().toUpperCase();
  }
  if (props.ADM0_A3 && props.ADM0_A3 !== "-99" && /^[A-Za-z]{3}$/.test(props.ADM0_A3)) return props.ADM0_A3.trim().toUpperCase();
  return undefined;
};

const getCountryName = (feature: Feature<Geometry, any>): string => {
  if (!feature || !feature.properties) return 'Unknown Territory';
  const props = feature.properties;
  return props.NAME_EN || props.NAME || props.ADMIN || props.SOVEREIGNT || props.FORMAL_EN || 'Unknown Country';
};

interface SelectedCountryProperties {
  name?: string;
  iso_a2?: string;
  continent?: string;
  subregion?: string;
  pop_est?: number | string;
  capital?: string;
  mockCustomsStatus?: string;
  mockShipmentProgress?: string;
  mockComplianceStatus?: string;
  [key: string]: any;
}

interface ShipmentPoint {
  id: string; name: string; lat: number; lng: number; size: number; color: string; status: string; transport: string;
}
const MOCK_SHIPMENT_POINTS: ShipmentPoint[] = [
  { id: 'ship001', name: 'Shipment Alpha (Electronics to EU)', lat: 34.0522, lng: -118.2437, size: 0.3, color: 'rgba(0, 255, 0, 0.85)', status: 'In Transit', transport: 'Ship' },
  { id: 'ship002', name: 'Shipment Bravo (Textiles to US)', lat: 51.5074, lng: -0.1278, size: 0.35, color: 'rgba(255, 165, 0, 0.85)', status: 'Customs Review', transport: 'Plane' },
  { id: 'ship003', name: 'Shipment Charlie (Auto Parts from ASIA)', lat: 35.6895, lng: 139.6917, size: 0.25, color: 'rgba(0, 0, 255, 0.85)', status: 'Cleared', transport: 'Ship' },
  { id: 'ship004', name: 'Shipment Delta (Pharma within EU)', lat: 48.8566, lng: 2.3522, size: 0.3, color: 'rgba(255,0,0,0.85)', status: 'Delayed', transport: 'Truck' },
];

interface TradeArc {
  id: string; startLat: number; startLng: number; endLat: number; endLng: number; color: string; stroke?: number; label?: string; dashLength?: number; dashGap?: number; dashAnimateTime?: number;
}
const MOCK_TRADE_ARCS: TradeArc[] = [
  { id: 'arc001', startLat: MOCK_SHIPMENT_POINTS[0].lat, startLng: MOCK_SHIPMENT_POINTS[0].lng, endLat: MOCK_SHIPMENT_POINTS[3].lat, endLng: MOCK_SHIPMENT_POINTS[3].lng, color: 'rgba(0, 255, 0, 0.6)', stroke: 0.2, label: 'Route LA-Paris', dashLength: 0.3, dashGap: 0.1, dashAnimateTime: 3000 },
  { id: 'arc002', startLat: MOCK_SHIPMENT_POINTS[2].lat, startLng: MOCK_SHIPMENT_POINTS[2].lng, endLat: MOCK_SHIPMENT_POINTS[1].lat, endLng: MOCK_SHIPMENT_POINTS[1].lng, color: 'rgba(0, 0, 255, 0.6)', stroke: 0.2, label: 'Route Tokyo-London', dashLength: 0.2, dashGap: 0.2, dashAnimateTime: 4000 },
];

const mockCountryDataCycle = [
  { capital: "N/A", customsStatus: "All Clear", shipmentProgress: "On Track" },
  { capital: "N/A", customsStatus: "Under Review", shipmentProgress: "Minor Delays" },
  { capital: "N/A", customsStatus: "Awaiting Documentation", shipmentProgress: "Customs Hold" },
  { capital: "N/A", customsStatus: "Cleared", shipmentProgress: "Departed Port" },
];
let countryDataCycleIndex = 0;

export default function DppGlobalTrackerPage() {
  const globeEl = useRef<GlobeMethods | undefined>();
  const { toast } = useToast();

  const [countryPolygons, setCountryPolygons] = useState<Feature<Geometry, any>[]>([]);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);
  const [selectedCountryInfo, setSelectedCountryInfo] = useState<SelectedCountryProperties | null>(null);
  const [shipmentPointsData] = useState<ShipmentPoint[]>(MOCK_SHIPMENT_POINTS);
  const [tradeArcsData] = useState<TradeArc[]>(MOCK_TRADE_ARCS);

  const [showDynamicCountryColors, setShowDynamicCountryColors] = useState(true);
  const [showShipmentMarkers, setShowShipmentMarkers] = useState(true);
  const [showTradeArcs, setShowTradeArcs] = useState(true);
  const [hoveredPolygon, setHoveredPolygon] = useState<Feature<Geometry, any> | null>(null);


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
          const geoJsonFeatures = (topojson.feature(world, world.objects.countries as any) as FeatureCollection<Geometry, any>).features;
          let missingNameCount = 0;
          let missingIsoA2Count = 0;
          geoJsonFeatures.forEach((feature: Feature<Geometry, any>) => {
            if (!getCountryName(feature) || getCountryName(feature) === 'Unknown Country' || getCountryName(feature) === 'Unknown Territory') missingNameCount++;
            if (!getCountryISO_A2(feature)) missingIsoA2Count++;
          });
          if (missingNameCount > 0 || missingIsoA2Count > 0) {
            const message = `GeoJSON Validation: ${missingNameCount} features missing identifiable name. ${missingIsoA2Count} features missing identifiable ISO A2/A3 code. Some map features or info might be incomplete.`;
            console.warn(message);
            if (missingNameCount > geoJsonFeatures.length * 0.1 || missingIsoA2Count > geoJsonFeatures.length * 0.1) {
              toast({ variant: "default", title: "Map Data Inconsistencies", description: `Found ${missingNameCount} countries missing names and ${missingIsoA2Count} missing ISO codes. Some map details might be affected. Data source: world-atlas@2.0.2/countries-50m.json`, duration: 8000 });
            }
          }
          setCountryPolygons(geoJsonFeatures);
        } else {
           throw new Error("GeoJSON structure from unpkg.com/world-atlas (50m) is not as expected. Missing 'objects.countries'.");
        }
      } catch (error: any) {
        console.error("Error loading 50m GeoJSON data from unpkg.com:", error.message, error);
        setGeoJsonError(error.message || "Could not load detailed country boundary data from CDN. Please ensure you are online.");
        toast({ variant: "destructive", title: "Map Data Error (CDN)", description: `Could not load detailed country data: ${error.message}. The globe may not display country-specific details correctly.`, duration: 10000 });
      } finally {
        setIsLoadingGeoJson(false);
      }
    };
    fetchGeoJson();
  }, [toast]);

  const polygonCapColorAccessor = useCallback((feature: Feature<Geometry, any>) => {
    let baseColor;
    if (!showDynamicCountryColors) {
      baseColor = LIGHT_GREY_UNIFORM_LAND_COLOR;
    } else {
      const isoA2 = getCountryISO_A2(feature);
      const complianceStatus = isoA2 ? MOCK_COUNTRY_COMPLIANCE[isoA2] : 'unknown_compliance';
      baseColor = COMPLIANCE_STATUS_COLORS[complianceStatus] || COMPLIANCE_STATUS_COLORS.unknown_compliance;
    }

    if (feature === hoveredPolygon) {
        const parts = baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (parts) {
            const r = Math.min(255, parseInt(parts[1]) + 40);
            const g = Math.min(255, parseInt(parts[2]) + 40);
            const b = Math.min(255, parseInt(parts[3]) + 40);
            const a = parts[4] ? Math.min(1, parseFloat(parts[4]) + 0.15) : 0.95;
            return `rgba(${r},${g},${b},${a})`;
        }
    }
    return baseColor;
  }, [showDynamicCountryColors, hoveredPolygon]);


  const polygonSideColorAccessor = useCallback(() => 'rgba(0,0,0,0.05)', []);
  const polygonStrokeColorAccessor = useCallback(() => BLACK_BORDER_COLOR, []);
  const polygonAltitudeAccessor = useCallback(() => 0.01, []);
  const polygonLabelAccessor = useCallback((feature: Feature<Geometry, any>) => getCountryName(feature), []);

  const handlePolygonClick = useCallback((polygon: Feature<Geometry, any>, event: MouseEvent) => {
    if (polygon && polygon.properties) {
      const props = polygon.properties;
      const currentMockData = mockCountryDataCycle[countryDataCycleIndex];
      countryDataCycleIndex = (countryDataCycleIndex + 1) % mockCountryDataCycle.length;
      const isoA2 = getCountryISO_A2(polygon);
      let complianceStatusText = "Unknown/Not Specified";
      if (isoA2 && MOCK_COUNTRY_COMPLIANCE[isoA2]) {
        complianceStatusText = MOCK_COUNTRY_COMPLIANCE[isoA2].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      setSelectedCountryInfo({
        name: getCountryName(polygon), iso_a2: isoA2,
        continent: props.CONTINENT || props.continent || props.REGION_UN || "N/A",
        subregion: props.SUBREGION || props.subregion || props.REGION_WB || "N/A",
        pop_est: props.POP_EST || props.pop_est || props.POP_MAX || "N/A",
        capital: props.CAPITAL || props.capital || currentMockData.capital || "N/A",
        mockCustomsStatus: currentMockData.customsStatus,
        mockShipmentProgress: currentMockData.shipmentProgress,
        mockComplianceStatus: complianceStatusText, ...props
      });
      if (globeEl.current) {
        const centroid = (polygon.geometry as any).type === 'Point' ? (polygon.geometry as any).coordinates :
                         (polygon.geometry as any).type === 'Polygon' ? (polygon.geometry as any).coordinates[0][0] :
                         (polygon.geometry as any).type === 'MultiPolygon' ? (polygon.geometry as any).coordinates[0][0][0] : [0,0];
        let targetLat = centroid[1]; let targetLng = centroid[0];
        if (targetLat === undefined || targetLng === undefined || isNaN(targetLat) || isNaN(targetLng)) {
          if (polygon.bbox) { targetLng = (polygon.bbox[0] + polygon.bbox[2]) / 2; targetLat = (polygon.bbox[1] + polygon.bbox[3]) / 2; }
          else { targetLat = 0; targetLng = 0; }
        }
        globeEl.current.pointOfView({ lat: targetLat, lng: targetLng, altitude: 1.5 }, 750);
      }
    } else {
      setSelectedCountryInfo(null);
    }
  }, []);
  
  const handlePolygonHover = useCallback((polygon: Feature<Geometry, any> | null) => {
    setHoveredPolygon(polygon);
  }, []);


  const handleZoomIn = () => globeEl.current?.pointOfView({ altitude: Math.max(0.1, (globeEl.current.pointOfView().altitude || 2.5) / 1.5) }, 500);
  const handleZoomOut = () => globeEl.current?.pointOfView({ altitude: Math.min(5, (globeEl.current.pointOfView().altitude || 2.5) * 1.5) }, 500);
  const handleResetView = () => globeEl.current?.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);

  const pointLatAccessor = useCallback((p: ShipmentPoint) => p.lat, []);
  const pointLngAccessor = useCallback((p: ShipmentPoint) => p.lng, []);
  const pointColorAccessor = useCallback((p: ShipmentPoint) => p.color, []);
  const pointAltitudeAccessor = useCallback(() => 0.02, []);
  const pointRadiusAccessor = useCallback((p: ShipmentPoint) => p.size, []);

  const arcStartLatAccessor = useCallback((arc: TradeArc) => arc.startLat, []);
  const arcStartLngAccessor = useCallback((arc: TradeArc) => arc.startLng, []);
  const arcEndLatAccessor = useCallback((arc: TradeArc) => arc.endLat, []);
  const arcEndLngAccessor = useCallback((arc: TradeArc) => arc.endLng, []);
  const arcColorAccessor = useCallback((arc: TradeArc) => arc.color, []);
  const arcStrokeAccessor = useCallback((arc: TradeArc) => arc.stroke, []);
  const arcLabelAccessor = useCallback((arc: TradeArc) => arc.label, []);
  const arcDashLengthAccessor = useCallback((arc: TradeArc) => arc.dashLength, []);
  const arcDashGapAccessor = useCallback((arc: TradeArc) => arc.dashGap, []);
  const arcDashAnimateTimeAccessor = useCallback((arc: TradeArc) => arc.dashAnimateTime, []);

  const displayedShipmentPoints = useMemo(() => showShipmentMarkers ? shipmentPointsData : [], [showShipmentMarkers, shipmentPointsData]);
  const displayedTradeArcs = useMemo(() => showTradeArcs ? tradeArcsData : [], [showTradeArcs, tradeArcsData]);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)] bg-background">
      <header className="p-4 border-b sticky top-0 bg-background z-20">
        <h1 className="text-2xl font-headline font-semibold text-primary flex items-center">
          <GlobeIconLucide className="mr-3 h-7 w-7" />
          Global DPP Compliance & Operations Visualizer
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
                <div className="text-sm space-y-1.5">
                  <h3 className="font-semibold text-base text-primary">{selectedCountryInfo.name || "Unknown Country"}</h3>
                  {selectedCountryInfo.iso_a2 && <p><strong>ISO A2/A3:</strong> {selectedCountryInfo.iso_a2}</p>}
                  {selectedCountryInfo.capital && <p><strong>Capital:</strong> {selectedCountryInfo.capital}</p>}
                  {selectedCountryInfo.mockComplianceStatus && <p><strong>Compliance:</strong> <span className="font-medium">{selectedCountryInfo.mockComplianceStatus}</span></p>}
                  {selectedCountryInfo.continent && <p><strong>Continent:</strong> {selectedCountryInfo.continent}</p>}
                  {selectedCountryInfo.subregion && <p><strong>Region:</strong> {selectedCountryInfo.subregion}</p>}
                  {selectedCountryInfo.pop_est && <p><strong>Population Est.:</strong> {Number(selectedCountryInfo.pop_est).toLocaleString()}</p>}
                  <div className="pt-2 mt-2 border-t">
                    {selectedCountryInfo.mockCustomsStatus && <p><strong>Mock Customs:</strong> <span className="font-medium">{selectedCountryInfo.mockCustomsStatus}</span></p>}
                    {selectedCountryInfo.mockShipmentProgress && <p><strong>Mock Shipments:</strong> <span className="font-medium">{selectedCountryInfo.mockShipmentProgress}</span></p>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click on a country to view its details. Hover for name. Colors indicate DPP compliance status (mock data).
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2"> <CardTitle className="text-lg font-semibold flex items-center"> <LayersIcon className="mr-2 h-5 w-5 text-primary"/> Layer Controls </CardTitle> </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="toggle-country-colors" className="text-sm flex items-center"> <Paintbrush className="h-4 w-4 mr-2 text-muted-foreground" /> Compliance Colors </Label>
                <Switch id="toggle-country-colors" checked={showDynamicCountryColors} onCheckedChange={setShowDynamicCountryColors} aria-label="Toggle compliance-based country colors" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="toggle-shipment-markers" className="text-sm flex items-center"> <MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> Shipment Markers </Label>
                <Switch id="toggle-shipment-markers" checked={showShipmentMarkers} onCheckedChange={setShowShipmentMarkers} aria-label="Toggle shipment markers" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="toggle-trade-arcs" className="text-sm flex items-center"> <Route className="h-4 w-4 mr-2 text-muted-foreground" /> Trade Routes </Label>
                <Switch id="toggle-trade-arcs" checked={showTradeArcs} onCheckedChange={setShowTradeArcs} aria-label="Toggle trade routes" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2"> <CardTitle className="text-lg font-semibold flex items-center"> <Palette className="mr-2 h-5 w-5 text-primary"/> Legend </CardTitle> </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="font-medium mb-1">Country Compliance Status:</div>
              {Object.entries(COMPLIANCE_STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center">
                  <span style={{ backgroundColor: color }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span>
                  <span>{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
              ))}
              {!showDynamicCountryColors && ( <div className="flex items-center mt-1"><span style={{ backgroundColor: LIGHT_GREY_UNIFORM_LAND_COLOR }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span><span>Countries (Uniform Color)</span></div> )}
              <div className="mt-2 pt-2 border-t">
                <p className="font-medium mb-1">Shipment Markers:</p>
                {MOCK_SHIPMENT_POINTS.map(p => (<div key={p.id} className="flex items-center"><span style={{ backgroundColor: p.color }} className="h-3 w-3 rounded-full mr-2 border border-black/30"></span><span>{p.status}</span></div>))}
              </div>
              <div className="mt-2 pt-2 border-t">
                <p className="font-medium mb-1">Trade Routes (Example):</p>
                {MOCK_TRADE_ARCS.map(a => (<div key={a.id} className="flex items-center"><span style={{ backgroundColor: a.color }} className="h-1 w-3 rounded-sm mr-2 border border-black/30"></span><span>{a.label}</span></div>))}
              </div>
              <div className="mt-2 pt-2 border-t">
                <div className="flex items-center"><span style={{ backgroundColor: BLACK_BORDER_COLOR }} className="h-0.5 w-3 rounded-sm mr-2"></span><span>Country Borders</span></div>
                <div className="flex items-center"><span style={{ backgroundImage: `url(${VIBRANT_LIGHT_BLUE_OCEAN_TEXTURE_URL})`, backgroundSize: 'cover' }} className="h-3 w-3 rounded-full mr-2 border border-black/30 opacity-70"></span><span>Oceans (Light Blue Texture)</span></div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2"> <CardTitle className="text-lg font-semibold">Map Controls</CardTitle> </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In" disabled={!globeEl.current || isLoadingGeoJson}> <ZoomIn className="h-4 w-4"/> </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out" disabled={!globeEl.current || isLoadingGeoJson}> <ZoomOut className="h-4 w-4"/> </Button>
              <Button variant="outline" size="icon" onClick={handleResetView} title="Reset View" disabled={!globeEl.current || isLoadingGeoJson}> <Maximize className="h-4 w-4"/> </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="row-span-1 col-start-2 relative overflow-hidden" style={{ backgroundColor: GLOBE_PAGE_BACKGROUND_COLOR }}>
            {isLoadingGeoJson && ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20"> <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" /> <p className="text-primary-foreground">Loading detailed map data...</p> </div> )}
            {geoJsonError && !isLoadingGeoJson && ( <div className="absolute inset-0 flex items-center justify-center p-4 z-20"> <Alert variant="destructive" className="max-w-md bg-destructive/90 text-destructive-foreground"> <AlertTriangle className="h-5 w-5" /> <AlertTitle>Map Data Error (CDN)</AlertTitle> <AlertDescription> Could not load country boundary data: <br /> {geoJsonError} <br /><br />Please check your internet connection or try refreshing. </AlertDescription> </Alert> </div> )}
            {!isLoadingGeoJson && !geoJsonError && countryPolygons.length > 0 && (
              <ClientOnlyGlobe
                globeRef={globeEl}
                globeImageUrl={VIBRANT_LIGHT_BLUE_OCEAN_TEXTURE_URL}
                backgroundColor="rgba(0,0,0,0)"
                atmosphereColor={ATMOSPHERE_COLOR}
                atmosphereAltitude={0.25}
                polygonsData={countryPolygons}
                polygonCapColor={polygonCapColorAccessor}
                polygonSideColor={polygonSideColorAccessor}
                polygonStrokeColor={polygonStrokeColorAccessor}
                polygonAltitude={polygonAltitudeAccessor}
                onPolygonClick={handlePolygonClick}
                onPolygonHover={handlePolygonHover}
                polygonLabel={polygonLabelAccessor}
                polygonsTransitionDuration={0}
                pointsData={displayedShipmentPoints}
                pointLat={pointLatAccessor} pointLng={pointLngAccessor}
                pointAltitude={pointAltitudeAccessor} pointRadius={pointRadiusAccessor}
                pointColor={pointColorAccessor}
                onPointClick={(point: any) => alert(`Clicked on shipment: ${point.name}`)}
                arcsData={displayedTradeArcs}
                arcStartLat={arcStartLatAccessor} arcStartLng={arcStartLngAccessor}
                arcEndLat={arcEndLatAccessor} arcEndLng={arcEndLngAccessor}
                arcColor={arcColorAccessor} arcStroke={arcStrokeAccessor}
                arcLabel={arcLabelAccessor} arcDashLength={arcDashLengthAccessor}
                arcDashGap={arcDashGapAccessor} arcDashAnimateTime={arcDashAnimateTimeAccessor}
                onArcClick={(arc: any) => alert(`Clicked on trade route: ${arc.label}`)}
              />
            )}
            {!isLoadingGeoJson && !geoJsonError && countryPolygons.length === 0 && ( <div className="absolute inset-0 flex items-center justify-center p-4 z-20"> <Alert variant="default" className="max-w-md bg-muted"> <Info className="h-5 w-5" /> <AlertTitle>Map Data Not Displayed</AlertTitle> <AlertDescription> Country boundaries could not be rendered. The GeoJSON from CDN might be empty or in an unexpected format after processing. </AlertDescription> </Alert> </div> )}
        </div>
      </main>
      <footer className="p-2 border-t text-center text-xs text-muted-foreground sticky bottom-0 bg-background z-20">
        DPP Global Compliance & Operations Tracker. Country data from unpkg.com (world-atlas). Compliance, shipment, and trade route data is mock.
      </footer>
    </div>
  );
}


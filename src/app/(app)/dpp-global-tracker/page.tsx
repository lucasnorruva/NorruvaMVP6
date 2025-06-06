
"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info, Settings2, Layers as LayersIcon, Filter, Palette, MapPin, TrendingUp, Link as LinkIcon, Route, Ship, Plane, Truck, Train } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard';
import { cn } from "@/lib/utils";
import { feature as topojsonFeature } from 'topojson-client';

// Dynamically import GlobeVisualization
const GlobeVisualization = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));

export interface MockDppPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  category: 'Manufacturing Site' | 'Distribution Hub' | 'Retail Outlet' | 'Recycling Facility' | 'Raw Material Source';
  status: 'compliant' | 'pending' | 'issue' | 'unknown';
  timestamp: number; // Year for simplicity
  manufacturer?: string;
  gtin?: string;
  complianceSummary?: string;
  color?: string;
}

export interface MockArc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string | string[];
  label?: string;
  stroke?: number;
  timestamp: number; // Year
  transportMode?: 'sea' | 'air' | 'road' | 'rail';
  productId?: string;
}

const diagnosticPointsMinimal: MockDppPoint[] = [
  // { id: 'brussels', lat: 50.8503, lng: 4.3517, name: 'Brussels (EU HQ)', size: 0.5, category: 'Distribution Hub', status: 'compliant', timestamp: 2024, color: 'red' },
  // { id: 'beijing', lat: 39.9042, lng: 116.4074, name: 'Beijing Factory', size: 0.5, category: 'Manufacturing Site', status: 'pending', timestamp: 2024, color: 'red' },
];
const diagnosticArcsMinimal: MockArc[] = [
  // { id: 'arc1', startLat: 39.9042, startLng: 116.4074, endLat: 50.8503, endLng: 4.3517, color: 'rgba(0, 255, 0, 0.6)', label: 'Shipment Route 1', stroke: 0.3, timestamp: 2024, transportMode: 'sea' }
];
const diagnosticLabelsMinimal: any[] = [];

const euMemberCountryCodes = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

const EU_BLUE_COLOR = 'rgba(25, 118, 210, 0.95)'; // Norruva Primary Blue for EU countries
const NON_EU_LAND_COLOR = 'rgba(224, 224, 224, 1)'; // A slightly darker neutral grey for non-EU land
const BORDER_COLOR = 'rgba(100, 100, 100, 0.7)'; // Darker grey for borders for better contrast
const LIGHT_BLUE_OCEAN_COLOR = 'rgba(210, 230, 255, 1)'; // Light blue for the ocean


const Legend: React.FC<{ title: string; colorMap: Record<string, string>, className?: string }> = ({ title, colorMap, className }) => (
  <Card className={cn("shadow-md", className)}>
    <CardHeader className="pb-2 pt-3 px-3">
      <CardTitle className="text-sm font-semibold flex items-center">
        <Palette className="h-4 w-4 mr-2 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-3 pb-3 space-y-1">
      {Object.entries(colorMap).map(([name, color]) => (
        <div key={name} className="flex items-center text-xs">
          <span className="h-3 w-3 rounded-sm mr-2" style={{ backgroundColor: color }} />
          <span>{name}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

// This component is used for client-side rendering logic
const DppGlobalTrackerClientContainer: React.FC<any & {isClient: boolean}> = ({ isClient, ...globeProps }) => {
  if (!isClient) {
    return (
      <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Globe Context...</span>
      </div>
    );
  }
  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 1 }}>
      <Suspense fallback={
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading 3D Globe Visualization...</span>
        </div>
      }>
        <GlobeVisualization {...globeProps} />
      </Suspense>
    </div>
  );
};

export default function DppGlobalTrackerPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [selectedArc, setSelectedArc] = useState<MockArc | null>(null);
  const [countryPolygons, setCountryPolygons] = useState<any[]>([]);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetch('//unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then(countries => {
        // @ts-ignore
        const countryFeatures = countries.objects.countries.geometries.map(obj => topojsonFeature(countries, obj));
        setCountryPolygons(countryFeatures);
        setIsLoadingGeoJson(false);
      })
      .catch(err => {
        console.error("Error fetching GeoJSON data:", err);
        setIsLoadingGeoJson(false);
      });
  }, []);

  const handlePointClick = useCallback((point: MockDppPoint) => {
    setSelectedPoint(point);
    setSelectedArc(null);
  }, []);

  const handleArcClick = useCallback((arc: MockArc) => {
    setSelectedArc(arc);
    setSelectedPoint(null);
  }, []);

  const pointColorAccessor = useCallback(() => 'rgba(255, 0, 0, 0.7)', []);
  const pointRadiusAccessor = useCallback(() => 0.25, []);
  const arcColorAccessor = useCallback(() => 'rgba(0, 255, 0, 0.5)', []);
  const arcStrokeAccessor = useCallback(() => 0.3, []);

  const polygonCapColorAccessor = useCallback((feat: any) => {
    const countryCode = feat.properties?.ISO_A2 || feat.properties?.iso_a2;
    return euMemberCountryCodes.includes(countryCode) ? EU_BLUE_COLOR : NON_EU_LAND_COLOR;
  }, []);

  const polygonSideColorAccessor = useCallback(() => 'rgba(0, 0, 0, 0)', []);
  const polygonStrokeColorAccessor = useCallback(() => BORDER_COLOR, []);


  const globeLegendMap = {
    "EU Member State": EU_BLUE_COLOR,
    "Non-EU Country": NON_EU_LAND_COLOR,
    "Ocean / Background": LIGHT_BLUE_OCEAN_COLOR,
    "Country Borders": BORDER_COLOR,
  };

  const [activeDataLayer, setActiveDataLayer] = useState('overview');
  const [yearFilter, setYearFilter] = useState<number[]>([2024]);

  return (
    <div className="space-y-8 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Global Product Passport Visualization</CardTitle>
          <CardDescription>Interact with the globe to explore product origins, supply chains, and compliance status across regions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-1">
              <Label htmlFor="data-layer-select" className="text-sm font-medium">Data Layer</Label>
              <Select value={activeDataLayer} onValueChange={setActiveDataLayer}>
                <SelectTrigger id="data-layer-select">
                  <SelectValue placeholder="Select data layer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview"><LayersIcon className="h-4 w-4 mr-2 inline-block" />Geopolitical Overview</SelectItem>
                  <SelectItem value="supply_chain" disabled><Route className="h-4 w-4 mr-2 inline-block" />Supply Chain Routes (Soon)</SelectItem>
                  <SelectItem value="compliance_hotspots" disabled><Filter className="h-4 w-4 mr-2 inline-block" />Compliance Hotspots (Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="year-slider" className="text-sm font-medium">Year Filter: {yearFilter[0]}</Label>
              <Slider
                id="year-slider"
                min={2020}
                max={2025}
                step={1}
                value={yearFilter}
                onValueChange={(value) => setYearFilter(value)}
                className="mt-2"
                disabled
              />
            </div>
          </div>

          <div
            className="w-full h-[600px] rounded-md overflow-hidden border relative bg-card"
          >
            {isLoadingGeoJson ? (
                 <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading Geographic Data...</span>
                </div>
            ) : (
                <DppGlobalTrackerClientContainer
                    isClient={isClient}
                    pointsData={diagnosticPointsMinimal}
                    arcsData={diagnosticArcsMinimal}
                    labelsData={diagnosticLabelsMinimal}
                    polygonsData={countryPolygons}
                    polygonCapColorAccessor={polygonCapColorAccessor}
                    polygonSideColorAccessor={polygonSideColorAccessor}
                    polygonStrokeColorAccessor={polygonStrokeColorAccessor}
                    onPointClick={handlePointClick}
                    onArcClick={handleArcClick}
                    pointColorAccessor={pointColorAccessor}
                    pointRadiusAccessor={pointRadiusAccessor}
                    arcColorAccessor={arcColorAccessor}
                    arcStrokeAccessor={arcStrokeAccessor}
                    globeBackgroundColor={LIGHT_BLUE_OCEAN_COLOR}
                />
            )}
          </div>

          <div className="mt-6">
             <Legend title="Map Legend" colorMap={globeLegendMap} className="mt-2 mx-auto w-fit sm:w-auto" />
          </div>
        </CardContent>
      </Card>

      {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={() => setSelectedPoint(null)} />}
      {selectedArc && <ArcInfoCard arcData={selectedArc} onClose={() => setSelectedArc(null)} />}

    </div>
  );
}

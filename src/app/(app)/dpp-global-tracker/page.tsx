
"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { feature as topojsonFeature } from 'topojson-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info, Settings2, Layers as LayersIcon, Filter, Palette, MapPin, TrendingUp, Link as LinkIcon, Route, Ship, Plane, Truck, Train, Package as PackageIcon, Zap, Building, Recycle as RecycleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard';
import { cn } from "@/lib/utils";

// Dynamically import GlobeVisualization as it's client-side only
const GlobeVisualization = React.lazy(() => import('@/components/dpp-tracker/GlobeVisualization'));

export interface MockDppPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  category: 'Electronics' | 'Appliances' | 'Textiles' | 'Raw Material Source' | 'Distribution Hub' | 'Recycling Facility';
  status: 'compliant' | 'pending' | 'issue' | 'unknown';
  timestamp: number; // Year for simplicity
  manufacturer?: string;
  gtin?: string;
  complianceSummary?: string;
  color?: string; 
  icon?: React.ElementType;
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

// PRD Colors & Theme Colors
const SATURATED_BLUE = 'rgba(41, 171, 226, 0.9)'; // #29ABE2 from --primary
const VIBRANT_TEAL = 'rgba(0, 128, 128, 0.9)';   // #008080 from --accent
const ACCENT_PURPLE = 'rgba(124, 58, 237, 0.9)'; // from --info
const BROWN_COLOR = 'rgba(139, 69, 19, 0.9)'; // For Raw Material
const ORANGE_COLOR = 'rgba(255, 165, 0, 0.9)'; // For Distribution/Warning-like
const DARK_GREEN_COLOR = 'rgba(0, 100, 0, 0.9)'; // For Recycling
const CORNFLOWER_BLUE_COLOR = 'rgba(100, 149, 237, 0.7)'; // For Rail

// Base Map Colors
const EU_BLUE_COLOR = 'rgba(0, 80, 150, 0.95)';
const NON_EU_LAND_COLOR_LIGHT_BLUE = 'rgba(173, 216, 230, 0.95)';
const BORDER_COLOR_MEDIUM_BLUE = 'rgba(70, 130, 180, 0.7)';
const WHITE_BACKGROUND_COLOR = 'rgba(255, 255, 255, 1)';
const GREY_COLOR = 'rgba(128, 128, 128, 0.8)';


const mockPointsData: MockDppPoint[] = [
  { id: 'eu_electronics_factory', lat: 50.8503, lng: 4.3517, name: 'EU Electronics Hub (Brussels)', size: 0.3, category: 'Electronics', status: 'compliant', timestamp: 2024, manufacturer: 'EuroChip', gtin: '111222333', icon: PackageIcon },
  { id: 'asia_textile_factory', lat: 22.3193, lng: 114.1694, name: 'Asia Textile Plant (Hong Kong)', size: 0.25, category: 'Textiles', status: 'pending', timestamp: 2023, manufacturer: 'SilkRoad Co.', gtin: '444555666', icon: Zap },
  { id: 'us_appliance_dist', lat: 34.0522, lng: -118.2437, name: 'US Appliance Distributor (LA)', size: 0.2, category: 'Appliances', status: 'compliant', timestamp: 2024, manufacturer: 'HomeGoods Inc.', gtin: '777888999', icon: Building },
  { id: 'sa_material_source', lat: -14.2350, lng: -51.9253, name: 'Brazil Raw Material Site', size: 0.15, category: 'Raw Material Source', status: 'unknown', timestamp: 2022, icon: LayersIcon },
  { id: 'africa_recycling_hub', lat: -1.2921, lng: 36.8219, name: 'Nairobi Recycling Center', size: 0.18, category: 'Recycling Facility', status: 'compliant', timestamp: 2023, icon: RecycleIcon },
  { id: 'eu_distribution_frankfurt', lat: 50.1109, lng: 8.6821, name: 'Frankfurt Distribution Center', size: 0.22, category: 'Distribution Hub', status: 'compliant', timestamp: 2024, icon: Truck },
  { id: 'china_manufacturing_shenzhen', lat: 22.5431, lng: 114.0579, name: 'Shenzhen Electronics Mfg.', size: 0.3, category: 'Electronics', status: 'pending', timestamp: 2023, manufacturer: 'GlobalElectro', gtin: '101010101', icon: PackageIcon },
  { id: 'india_appliances_bangalore', lat: 12.9716, lng: 77.5946, name: 'Bangalore Appliance Factory', size: 0.25, category: 'Appliances', status: 'compliant', timestamp: 2024, manufacturer: 'IndiaHome', gtin: '202020202', icon: Building },
];

const mockArcsData: MockArc[] = [
  { id: 'arc1', startLat: 22.3193, startLng: 114.1694, endLat: 50.8503, endLng: 4.3517, label: 'Textiles to EU', timestamp: 2023, transportMode: 'sea', productId: 'DPP002', color: VIBRANT_TEAL },
  { id: 'arc2', startLat: -14.2350, startLng: -51.9253, endLat: 22.3193, endLng: 114.1694, label: 'Materials to Asia', timestamp: 2022, transportMode: 'sea', color: SATURATED_BLUE },
  { id: 'arc3', startLat: 50.8503, startLng: 4.3517, endLat: 34.0522, endLng: -118.2437, label: 'Electronics to US', timestamp: 2024, transportMode: 'air', productId: 'DPP001', color: ACCENT_PURPLE },
  { id: 'arc4', startLat: 22.5431, startLng: 114.0579, endLat: 50.1109, endLng: 8.6821, label: 'Electronics to Frankfurt', timestamp: 2023, transportMode: 'rail', color: SATURATED_BLUE },
  { id: 'arc5', startLat: 12.9716, startLng: 77.5946, endLat: -1.2921, endLng: 36.8219, label: 'Appliances EOL to Nairobi', timestamp: 2024, transportMode: 'road', productId: 'DPP005', color: VIBRANT_TEAL },
];

const euMemberCountryCodes = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

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
          <span className="h-3 w-3 rounded-sm mr-2 border" style={{ backgroundColor: color.startsWith("rgba") || color.startsWith("#") ? color : undefined, 
            backgroundImage: name.toLowerCase().includes("gradient") || name.toLowerCase().includes(" to ") ? `linear-gradient(to right, ${color.split(' to ')[0]}, ${color.split(' to ')[1] || color.split(' to ')[0]})` : undefined
          }} />
          <span>{name}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

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
    <div className="w-full h-full bg-card" style={{ position: 'relative', zIndex: 1 }}>
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
  
  const [yearFilter, setYearFilter] = useState<number[]>([new Date().getFullYear()]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    setIsClient(true);
    setIsLoadingGeoJson(true);
    fetch('//unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then(countries => {
        const countryFeatures = countries.objects.countries.geometries.map((obj: any) => topojsonFeature(countries, obj));
        setCountryPolygons(countryFeatures);
        setIsLoadingGeoJson(false);
      })
      .catch(err => {
        console.error("Error fetching GeoJSON data:", err);
        setIsLoadingGeoJson(false);
      });
  }, []);

  const filteredPoints = useMemo(() => {
    return mockPointsData.filter(point => {
      const yearMatch = point.timestamp <= yearFilter[0];
      const categoryMatch = categoryFilter === 'all' || point.category === categoryFilter;
      return yearMatch && categoryMatch;
    });
  }, [yearFilter, categoryFilter]);

  const filteredArcs = useMemo(() => {
    return mockArcsData.filter(arc => {
      const yearMatch = arc.timestamp <= yearFilter[0];
      return yearMatch;
    });
  }, [yearFilter]);

  const pointColorAccessor = useCallback((point: MockDppPoint) => {
    switch (point.category) {
      case 'Electronics': return SATURATED_BLUE;
      case 'Appliances': return VIBRANT_TEAL;
      case 'Textiles': return ACCENT_PURPLE;
      case 'Raw Material Source': return BROWN_COLOR;
      case 'Distribution Hub': return ORANGE_COLOR;
      case 'Recycling Facility': return DARK_GREEN_COLOR;
      default: return GREY_COLOR;
    }
  }, []);
  
  const pointRadiusAccessor = useCallback((point: MockDppPoint) => point.size * 0.8 + 0.1, []); 

  const arcColorAccessor = useCallback((arc: MockArc) => {
     switch (arc.transportMode) {
      case 'sea': return [SATURATED_BLUE, VIBRANT_TEAL]; 
      case 'air': return ACCENT_PURPLE;
      case 'road': return ORANGE_COLOR; 
      case 'rail': return CORNFLOWER_BLUE_COLOR; 
      default: return GREY_COLOR; 
    }
  }, []);
  
  const arcStrokeAccessor = useCallback((arc: MockArc) => (arc.stroke || 0.2) + (arc.productId ? 0.1 : 0), []);

  const handlePointClick = useCallback((point: MockDppPoint) => {
    setSelectedPoint(point);
    setSelectedArc(null);
  }, []);

  const handleArcClick = useCallback((arc: MockArc) => {
    setSelectedArc(arc);
    setSelectedPoint(null);
  }, []);

  const polygonCapColorAccessor = useCallback((feat: any) => {
    const countryCode = feat.properties?.ISO_A2 || feat.properties?.iso_a2;
    return euMemberCountryCodes.includes(countryCode) ? EU_BLUE_COLOR : NON_EU_LAND_COLOR_LIGHT_BLUE;
  }, []);
  const polygonSideColorAccessor = useCallback(() => 'rgba(0, 0, 0, 0)', []);
  const polygonStrokeColorAccessor = useCallback(() => BORDER_COLOR_MEDIUM_BLUE, []);
  
  const uniqueCategories = useMemo(() => ['all', ...new Set(mockPointsData.map(p => p.category))], []);

  const globeLegendMap = {
    "EU Member State": EU_BLUE_COLOR,
    "Non-EU Country": NON_EU_LAND_COLOR_LIGHT_BLUE,
    "Country Borders": BORDER_COLOR_MEDIUM_BLUE,
    "Globe Background": WHITE_BACKGROUND_COLOR,
    "Electronics Point": SATURATED_BLUE,
    "Appliances Point": VIBRANT_TEAL,
    "Textiles Point": ACCENT_PURPLE,
    "Raw Material Site": BROWN_COLOR,
    "Distribution Hub": ORANGE_COLOR,
    "Recycling Facility": DARK_GREEN_COLOR,
    "Sea Route": `${SATURATED_BLUE} to ${VIBRANT_TEAL}`,
    "Air Route": ACCENT_PURPLE,
    "Road Route": ORANGE_COLOR,
    "Rail Route": CORNFLOWER_BLUE_COLOR,
    "Other Point/Route": GREY_COLOR,
  };

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
            <div>
              <Label htmlFor="category-filter" className="text-sm font-medium">Filter by Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="year-slider" className="text-sm font-medium">Filter by Year (Up to): {yearFilter[0]}</Label>
              <Slider
                id="year-slider"
                min={Math.min(...mockPointsData.map(p => p.timestamp), ...mockArcsData.map(a => a.timestamp), new Date().getFullYear() - 5)}
                max={new Date().getFullYear()}
                step={1}
                value={yearFilter}
                onValueChange={(value) => setYearFilter(value)}
                className="mt-2"
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
                    pointsData={filteredPoints}
                    arcsData={filteredArcs}
                    labelsData={[]} 
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
                    globeBackgroundColor={WHITE_BACKGROUND_COLOR}
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

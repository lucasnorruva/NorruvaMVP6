
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Zap, MapPin, Anchor, Store, Factory, Ship, Plane, Truck, Info, Loader2, CheckCircle as CheckCircleIcon, Clock as ClockIcon } from 'lucide-react';
import { feature } from 'topojson-client';
import type { Objects, Topology } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';
import { cn } from '@/lib/utils';

interface PointData {
  id: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  name: string;
  type: 'port' | 'factory' | 'market' | 'dpp_registration';
  details: string;
  country?: string;
}

interface ArcData {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  stroke?: number;
  name: string;
  product?: string;
  status?: 'in_transit' | 'delivered' | 'delayed';
}

interface SelectedInfo {
  type: 'point' | 'arc' | null;
  data: PointData | ArcData | null;
}

const mockPoints: PointData[] = [
  { id: 'pt1', lat: 34.0522, lng: -118.2437, size: 0.1, color: 'rgba(60, 120, 216, 0.85)', name: 'Los Angeles Port', type: 'port', details: 'Major US West Coast port, key entry for Asian goods.', country: 'USA' },
  { id: 'pt2', lat: 51.5074, lng: -0.1278, size: 0.15, color: 'rgba(34, 139, 34, 0.85)', name: 'London Market Hub', type: 'market', details: 'Central European distribution center for consumer electronics.', country: 'UK' },
  { id: 'pt3', lat: 31.2304, lng: 121.4737, size: 0.12, color: 'rgba(255, 140, 0, 0.85)', name: 'Shanghai Factory Complex', type: 'factory', details: 'Large-scale manufacturing of electronics and textiles.', country: 'China' },
  { id: 'pt4', lat: 40.7128, lng: -74.0060, size: 0.08, color: 'rgba(128, 0, 128, 0.85)', name: 'New York DPP Registrations', type: 'dpp_registration', details: 'High volume of DPPs registered for fashion & apparel.', country: 'USA' },
  { id: 'pt5', lat: 52.3676, lng: 4.9041, size: 0.1, color: 'rgba(60, 120, 216, 0.85)', name: 'Amsterdam Port (AMS)', type: 'port', details: 'Key EU entry point for various goods, strong agri-food presence.', country: 'Netherlands' },
  { id: 'pt6', lat: -33.8688, lng: 151.2093, size: 0.09, color: 'rgba(34, 139, 34, 0.85)', name: 'Sydney Market', type: 'market', details: 'Primary market hub for Oceania region, diverse product categories.', country: 'Australia' },
  { id: 'pt7', lat: 48.8566, lng: 2.3522, size: 0.13, color: 'rgba(128, 0, 128, 0.85)', name: 'Paris Fashion Hub', type: 'dpp_registration', details: 'Significant DPP activity for luxury goods and apparel.', country: 'France' },
];

const mockArcs: ArcData[] = [
  { id: 'arc1', startLat: 31.2304, startLng: 121.4737, endLat: 34.0522, endLng: -118.2437, color: 'rgba(255,165,0,0.7)', stroke: 0.3, name: 'SHG-LAX-001', product: 'EcoSmart Refrigerator Batch #5', status: 'in_transit' },
  { id: 'arc2', startLat: 34.0522, startLng: -118.2437, endLat: 51.5074, endLng: -0.1278, color: 'rgba(128,0,128,0.7)', stroke: 0.3, name: 'LAX-LHR-002', product: 'Smart LED Bulbs Shipment', status: 'delivered' },
  { id: 'arc3', startLat: 52.3676, startLng: 4.9041, endLat: 40.7128, endLng: -74.0060, color: 'rgba(0,128,0,0.7)', stroke: 0.3, name: 'AMS-NYC-DPPFlow', product: 'Digital Product Passport Data Flow', status: 'in_transit' },
  { id: 'arc4', startLat: 31.2304, startLng: 121.4737, endLat: -33.8688, endLng: 151.2093, color: 'rgba(255,105,180,0.7)', stroke: 0.3, name: 'SHG-SYD-007', product: 'Organic Cotton T-Shirt Batch C', status: 'delayed' },
  { id: 'arc5', startLat: 48.8566, startLng: 2.3522, endLat: 51.5074, endLng: -0.1278, color: 'rgba(75,0,130,0.7)', stroke: 0.3, name: 'PAR-LON-LUX01', product: 'Luxury Handbags - DPP Transfer', status: 'in_transit'}
];


const PointIcon = ({ type }: { type: PointData['type'] }) => {
  switch (type) {
    case 'port': return <Anchor className="h-4 w-4 mr-2 text-blue-500" />;
    case 'factory': return <Factory className="h-4 w-4 mr-2 text-orange-500" />;
    case 'market': return <Store className="h-4 w-4 mr-2 text-green-500" />;
    case 'dpp_registration': return <Zap className="h-4 w-4 mr-2 text-purple-500" />;
    default: return <MapPin className="h-4 w-4 mr-2 text-gray-500" />;
  }
};

const ArcIcon = ({ status }: { status?: ArcData['status'] }) => {
    if (status === 'in_transit') return <Truck className="h-4 w-4 mr-2 text-blue-500" />;
    if (status === 'delivered') return <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />;
    if (status === 'delayed') return <ClockIcon className="h-4 w-4 mr-2 text-orange-500" />;
    return <Plane className="h-4 w-4 mr-2 text-gray-500" />;
};


export default function DppGlobalTrackerPage() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState<Objects<Topology>>({ objects: {} });
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>({ type: null, data: null });
  const [globeReady, setGlobeReady] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);


  useEffect(() => {
    fetch('https://unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then((atlas: Topology) => {
        setCountries(atlas);
        setInitialLoadComplete(true); // Set to true after data is fetched
      })
      .catch(err => {
        console.error("Error fetching country polygons:", err);
        setInitialLoadComplete(true); // Also set to true on error to stop loading state
      });
  }, []);

  useEffect(() => {
    if (globeEl.current && globeReady) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.2;
      // Start with a more zoomed-out global view
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 3.0 }, 1500);
    }
  }, [globeReady]);

  const handlePointClick = useCallback((point: object) => {
    const p = point as PointData;
    setSelectedInfo({ type: 'point', data: p });
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1.5 }, 1000);
      globeEl.current.controls().autoRotate = false;
    }
  }, []);

  const handleArcClick = useCallback((arc: object) => {
    const a = arc as ArcData;
    setSelectedInfo({ type: 'arc', data: a });
     if (globeEl.current) {
      const midLat = (a.startLat + a.endLat) / 2;
      const midLng = (a.startLng + a.endLng) / 2;
      globeEl.current.pointOfView({ lat: midLat, lng: midLng, altitude: 1.7 }, 1000);
      globeEl.current.controls().autoRotate = false;
    }
  }, []);

  const countryPolygons = countries.objects.countries
    ? (feature(countries, countries.objects.countries) as unknown as FeatureCollection<Geometry>)
    : { type: 'FeatureCollection', features: [] };

  if (!initialLoadComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-medium text-muted-foreground">Loading Global Tracker...</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Fetching map data and initializing globe.</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <Globe
        ref={globeEl}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        
        pointsData={mockPoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.01}
        pointRadius="size"
        pointColor="color"
        onPointClick={handlePointClick}
        pointLabel={p => `<b>${(p as PointData).name}</b><br/><i>${(p as PointData).type.replace('_', ' ')}</i><br/>Click for details.`}

        arcsData={mockArcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke="stroke"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1800}
        onArcClick={handleArcClick}
        arcLabel={a => `<b>${(a as ArcData).name}</b><br/><i>${(a as ArcData).product || 'Data Flow'}</i><br/>Status: ${(a as ArcData).status || 'N/A'}. Click for details.`}

        polygonsData={countryPolygons.features}
        polygonCapColor={() => 'rgba(100, 100, 200, 0.1)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.02)'}
        polygonStrokeColor={() => 'rgba(120,120,120,0.2)'}
        
        onGlobeReady={() => setTimeout(() => setGlobeReady(true), 200)} // Slight delay for full init
        width={typeof window !== 'undefined' ? window.innerWidth : 600}
        height={typeof window !== 'undefined' ? window.innerHeight - 64 : 400} // Adjust height if needed
      />

      {selectedInfo.data && (
        <Card className="absolute top-4 right-4 w-80 max-w-sm z-10 shadow-2xl bg-card/80 backdrop-blur-lg rounded-lg">
          <CardHeader className="flex flex-row items-start justify-between pb-2 pt-3 px-4">
            <div className="flex items-center">
              {selectedInfo.type === 'point' ?
                  <PointIcon type={(selectedInfo.data as PointData).type} /> :
                  <ArcIcon status={(selectedInfo.data as ArcData).status} />
              }
              <CardTitle className="text-md font-semibold text-primary">
                {(selectedInfo.data as PointData | ArcData).name}
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={() => {
              setSelectedInfo({type: null, data: null});
              if (globeEl.current) globeEl.current.controls().autoRotate = true;
            }}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close details</span>
            </Button>
          </CardHeader>
          <CardContent className="text-sm space-y-2 px-4 pb-3">
            {selectedInfo.type === 'point' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-muted-foreground text-xs">Type:</strong>
                  <Badge variant="secondary" className="capitalize text-xs py-0.5 px-1.5">
                    {(selectedInfo.data as PointData).type.replace('_', ' ')}
                  </Badge>
                </div>
                <p><strong className="text-muted-foreground text-xs">Location:</strong> Lat: {(selectedInfo.data as PointData).lat.toFixed(2)}, Lng: {(selectedInfo.data as PointData).lng.toFixed(2)}</p>
                {(selectedInfo.data as PointData).country && <p><strong className="text-muted-foreground text-xs">Country:</strong> {(selectedInfo.data as PointData).country}</p>}
                <p className="mt-1 text-xs"><strong className="text-muted-foreground text-xs">Details:</strong> {(selectedInfo.data as PointData).details}</p>
                {(selectedInfo.data as PointData).type === 'dpp_registration' && <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Mock: 250 DPPs registered in last 24h.</p>}
              </>
            )}
            {selectedInfo.type === 'arc' && (
              <>
                <p><strong className="text-muted-foreground text-xs">Product/Data:</strong> {(selectedInfo.data as ArcData).product || 'N/A'}</p>
                <p className="capitalize"><strong className="text-muted-foreground text-xs">Status:</strong> {(selectedInfo.data as ArcData).status?.replace('_', ' ') || 'N/A'}</p>
                <p className="text-xs"><strong className="text-muted-foreground text-xs">Route:</strong> {(mockPoints.find(p => p.lat === (selectedInfo.data as ArcData).startLat && p.lng === (selectedInfo.data as ArcData).startLng)?.name || 'Unknown Origin')} &rarr; {(mockPoints.find(p => p.lat === (selectedInfo.data as ArcData).endLat && p.lng === (selectedInfo.data as ArcData).endLng)?.name || 'Unknown Destination')}</p>
                {(selectedInfo.data as ArcData).status === 'in_transit' && <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">ETA: 3 days</p>}
                {(selectedInfo.data as ArcData).status === 'delivered' && <p className="text-xs text-green-500 dark:text-green-400 mt-1">Delivered on Schedule.</p>}
                {(selectedInfo.data as ArcData).status === 'delayed' && <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">Delayed by 24h due to customs.</p>}
              </>
            )}
          </CardContent>
        </Card>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-background/70 text-foreground dark:bg-foreground/10 dark:text-background rounded-lg backdrop-blur-md shadow-lg max-w-lg text-center">
        <Info className="inline h-4 w-4 mr-1.5 align-middle text-primary" />
        Conceptual DPP Global Tracker. Click points or arcs for details.
        <div className="mt-2 opacity-90 text-xs leading-tight flex justify-center items-center gap-x-3 gap-y-1 flex-wrap">
            <span className="inline-flex items-center"><Anchor className="h-3 w-3 mr-1 text-blue-500"/>Ports</span>
            <span className="inline-flex items-center"><Factory className="h-3 w-3 mr-1 text-orange-500"/>Factories</span>
            <span className="inline-flex items-center"><Store className="h-3 w-3 mr-1 text-green-500"/>Markets</span>
            <span className="inline-flex items-center"><Zap className="h-3 w-3 mr-1 text-purple-500"/>DPP Hotspots</span>
        </div>
      </div>
    </div>
  );
}


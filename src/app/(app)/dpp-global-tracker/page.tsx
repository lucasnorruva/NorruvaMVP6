
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Zap, MapPin, Anchor, Store, Factory, Ship, Plane, Truck, Info } from 'lucide-react';
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
  { id: 'pt1', lat: 34.0522, lng: -118.2437, size: 0.1, color: 'rgba(255, 0, 0, 0.7)', name: 'Los Angeles Port', type: 'port', details: 'Major US West Coast port.', country: 'USA' },
  { id: 'pt2', lat: 51.5074, lng: -0.1278, size: 0.15, color: 'rgba(0, 255, 0, 0.7)', name: 'London Market Hub', type: 'market', details: 'Key European distribution center.', country: 'UK' },
  { id: 'pt3', lat: 31.2304, lng: 121.4737, size: 0.12, color: 'rgba(0, 0, 255, 0.7)', name: 'Shanghai Factory Complex', type: 'factory', details: 'Large-scale electronics manufacturing.', country: 'China' },
  { id: 'pt4', lat: 40.7128, lng: -74.0060, size: 0.08, color: 'rgba(255, 255, 0, 0.7)', name: 'New York DPP Registrations', type: 'dpp_registration', details: 'High volume of DPPs registered for electronics.', country: 'USA' },
  { id: 'pt5', lat: 52.3676, lng: 4.9041, size: 0.1, color: 'rgba(255, 0, 255, 0.7)', name: 'Amsterdam Port', type: 'port', details: 'Key EU entry point.', country: 'Netherlands' },
  { id: 'pt6', lat: -33.8688, lng: 151.2093, size: 0.09, color: 'rgba(0, 255, 255, 0.7)', name: 'Sydney Market', type: 'market', details: 'Oceania regional hub.', country: 'Australia' },
];

const mockArcs: ArcData[] = [
  { id: 'arc1', startLat: 31.2304, startLng: 121.4737, endLat: 34.0522, endLng: -118.2437, color: 'rgba(255,165,0,0.6)', stroke: 0.3, name: 'SHG-LAX-001', product: 'EcoSmart Refrigerator Batch #5', status: 'in_transit' },
  { id: 'arc2', startLat: 34.0522, startLng: -118.2437, endLat: 51.5074, endLng: -0.1278, color: 'rgba(128,0,128,0.6)', stroke: 0.3, name: 'LAX-LHR-002', product: 'Smart LED Bulbs Shipment', status: 'delivered' },
  { id: 'arc3', startLat: 52.3676, startLng: 4.9041, endLat: 40.7128, endLng: -74.0060, color: 'rgba(0,128,0,0.6)', stroke: 0.3, name: 'AMS-NYC-DPPFlow', product: 'Digital Product Passport Data Flow', status: 'in_transit' },
  { id: 'arc4', startLat: 31.2304, startLng: 121.4737, endLat: -33.8688, endLng: 151.2093, color: 'rgba(255,192,203,0.6)', stroke: 0.3, name: 'SHG-SYD-007', product: 'Organic Cotton T-Shirt Batch C', status: 'delayed' },
];


const PointIcon = ({ type }: { type: PointData['type'] }) => {
  switch (type) {
    case 'port': return <Anchor className="h-4 w-4 mr-2" />;
    case 'factory': return <Factory className="h-4 w-4 mr-2" />;
    case 'market': return <Store className="h-4 w-4 mr-2" />;
    case 'dpp_registration': return <Zap className="h-4 w-4 mr-2" />;
    default: return <MapPin className="h-4 w-4 mr-2" />;
  }
};

const ArcIcon = ({ status }: { status?: ArcData['status'] }) => {
    if (status === 'in_transit') return <Truck className="h-4 w-4 mr-2 text-blue-500" />;
    if (status === 'delivered') return <Ship className="h-4 w-4 mr-2 text-green-500" />;
    if (status === 'delayed') return <Plane className="h-4 w-4 mr-2 text-orange-500" />;
    return <Plane className="h-4 w-4 mr-2" />;
};


export default function DppGlobalTrackerPage() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState<Objects<Topology>>({ objects: {} });
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>({ type: null, data: null });
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    // Load country polygons
    fetch('//unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then((atlas: Topology) => {
        setCountries(atlas);
      })
      .catch(err => console.error("Error fetching country polygons:", err));
  }, []);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current && globeReady) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000); // Initial FOV
    }
  }, [globeReady]);

  const handlePointClick = useCallback((point: object) => { // Globe.gl uses generic object for point
    const p = point as PointData;
    setSelectedInfo({ type: 'point', data: p });
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1 }, 750);
    }
  }, []);

  const handleArcClick = useCallback((arc: object) => { // Globe.gl uses generic object for arc
    const a = arc as ArcData;
    setSelectedInfo({ type: 'arc', data: a });
     if (globeEl.current) {
      // Navigate to a point between start and end of the arc
      const midLat = (a.startLat + a.endLat) / 2;
      const midLng = (a.startLng + a.endLng) / 2;
      globeEl.current.pointOfView({ lat: midLat, lng: midLng, altitude: 1.2 }, 750);
    }
  }, []);
  
  const countryPolygons = countries.objects.countries
    ? (feature(countries, countries.objects.countries) as unknown as FeatureCollection<Geometry>)
    : { type: 'FeatureCollection', features: [] };


  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      {!globeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
          <p className="text-lg text-muted-foreground">Loading Globe Data...</p>
        </div>
      )}
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        pointsData={mockPoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.01}
        pointRadius="size"
        pointColor="color"
        onPointClick={handlePointClick}
        pointLabel={p => `<b>${(p as PointData).name}</b><br/><i>${(p as PointData).type}</i>`}

        arcsData={mockArcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke="stroke"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        onArcClick={handleArcClick}
        arcLabel={a => `<b>${(a as ArcData).name}</b><br/><i>${(a as ArcData).product || 'Data Flow'}</i>`}

        polygonsData={countryPolygons.features}
        polygonCapColor={() => 'rgba(100, 100, 200, 0.2)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'}
        polygonStrokeColor={() => 'rgba(120,120,120,0.5)'}
        
        onGlobeReady={() => setGlobeReady(true)}
        width={typeof window !== 'undefined' ? window.innerWidth : 600} // Adjust for SSR if needed
        height={typeof window !== 'undefined' ? window.innerHeight - 64 : 400} // 64px is approx header height
      />

      {selectedInfo.data && (
        <Card className="absolute top-4 right-4 w-80 max-w-sm z-10 shadow-2xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-headline flex items-center">
                {selectedInfo.type === 'point' ? 
                    <PointIcon type={(selectedInfo.data as PointData).type} /> :
                    <ArcIcon status={(selectedInfo.data as ArcData).status} />
                }
                {(selectedInfo.data as PointData | ArcData).name}
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedInfo({type: null, data: null})}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="text-sm space-y-1.5">
            {selectedInfo.type === 'point' && (
              <>
                <p><strong className="text-muted-foreground">Type:</strong> <span className="capitalize">{(selectedInfo.data as PointData).type}</span></p>
                <p><strong className="text-muted-foreground">Location:</strong> Lat: {(selectedInfo.data as PointData).lat.toFixed(2)}, Lng: {(selectedInfo.data as PointData).lng.toFixed(2)}</p>
                {(selectedInfo.data as PointData).country && <p><strong className="text-muted-foreground">Country:</strong> {(selectedInfo.data as PointData).country}</p>}
                <p><strong className="text-muted-foreground">Details:</strong> {(selectedInfo.data as PointData).details}</p>
                {(selectedInfo.data as PointData).type === 'dpp_registration' && <p className="text-xs text-primary">Mock: 250 DPPs registered in last 24h.</p>}
              </>
            )}
            {selectedInfo.type === 'arc' && (
              <>
                <p><strong className="text-muted-foreground">Product/Data:</strong> {(selectedInfo.data as ArcData).product || 'N/A'}</p>
                <p><strong className="text-muted-foreground">Status:</strong> <span className="capitalize">{(selectedInfo.data as ArcData).status || 'N/A'}</span></p>
                <p><strong className="text-muted-foreground">Route:</strong> {(mockPoints.find(p => p.lat === (selectedInfo.data as ArcData).startLat && p.lng === (selectedInfo.data as ArcData).startLng)?.name || 'Unknown Origin')} to {(mockPoints.find(p => p.lat === (selectedInfo.data as ArcData).endLat && p.lng === (selectedInfo.data as ArcData).endLng)?.name || 'Unknown Destination')}</p>
                {(selectedInfo.data as ArcData).status === 'in_transit' && <p className="text-xs text-blue-400">ETA: 3 days</p>}
                {(selectedInfo.data as ArcData).status === 'delayed' && <p className="text-xs text-orange-400">Delayed by 24h due to customs.</p>}
              </>
            )}
          </CardContent>
        </Card>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-black/30 text-white text-xs rounded-md backdrop-blur-sm">
        <Info className="inline h-3 w-3 mr-1" /> Conceptual DPP Global Tracker. Click points or arcs. Globe is auto-rotating.
      </div>
    </div>
  );
}


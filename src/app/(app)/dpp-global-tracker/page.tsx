
"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe as GlobeIconLucide, Info, Settings2, Layers as LayersIcon, Filter, Palette, MapPin, TrendingUp, Link as LinkIcon, Route, Ship, Plane, Truck, Train, Package as PackageIcon, Zap, Building, Recycle as RecycleIcon, ShieldCheck, ShieldAlert, ShieldQuestion, Building2 as LandBorderIcon, RefreshCw, SearchCheck, BarChart3, BellRing, History as HistoryIcon, ChevronDown, AlertTriangle as AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// Select, Slider, Label, Switch imports removed as controls are temporarily disabled
// import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';
// import ArcInfoCard from '@/components/dpp-tracker/ArcInfoCard';
// import CheckpointInfoCard from '@/components/dpp-tracker/CheckpointInfoCard';
// import ShipmentInfoCard from '@/components/dpp-tracker/ShipmentInfoCard';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
// import { useRole } from '@/contexts/RoleContext';
// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Badge } from '@/components/ui/badge';
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
// import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useRouter } from 'next/navigation';

import GlobeVisualization from '@/components/dpp-tracker/GlobeVisualization';

// Data type interfaces (MockDppPoint, MockArc, etc.) are kept for eventual re-integration, but not used in this simplified version.
export interface MockDppPoint {
  id: string; lat: number; lng: number; name: string; size: number; category: 'Electronics' | 'Appliances' | 'Textiles' | 'Raw Material Source' | 'Distribution Hub' | 'Recycling Facility'; status: 'compliant' | 'pending' | 'issue' | 'unknown'; timestamp: number; manufacturer?: string; gtin?: string; complianceSummary?: string; color?: string; icon?: React.ElementType;
}
export interface MockArc {
  id: string; shipmentId: string; direction: 'inbound_eu' | 'outbound_eu' | 'internal_eu' | 'other'; startLat: number; startLng: number; endLat: number; endLng: number; label?: string; stroke?: number; timestamp: number; transportMode?: 'sea' | 'air' | 'road' | 'rail'; productId?: string; productCategory?: string; dppCompliant?: boolean; value?: number; 
}
export interface MockCustomsCheckpoint {
  id: string; lat: number; lng: number; name: string; type: 'port' | 'airport' | 'land_border'; currentShipmentCount: number; overallCustomsStatus: 'cleared' | 'pending' | 'inspection_required' | 'operational'; dppComplianceHealth: 'good' | 'fair' | 'poor' | 'unknown'; icon?: React.ElementType; averageClearanceTime: string; issuesDetectedLast24h: number;
}
export interface MockShipmentPoint {
  id: string; lat: number; lng: number; name: string; size: number; direction: 'inbound_eu' | 'outbound_eu' | 'internal_eu' | 'other'; color?: string; arcId: string; arcLabel?: string; productIconUrl?: string; dppComplianceStatusText?: string; dppComplianceBadgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive'; eta?: string; progressPercentage?: number; currentLat?: number; currentLng?: number; simulationProgress?: number; simulatedStatus: 'in_transit' | 'at_customs' | 'customs_inspection' | 'delayed' | 'cleared' | 'data_sync_delayed'; ceMarkingStatus: 'valid' | 'missing' | 'pending_verification'; cbamDeclarationStatus: 'submitted' | 'required' | 'cleared' | 'not_applicable'; dppComplianceNotes: string[];
}

const GLOBE_BACKGROUND_COLOR = '#0a0a0a'; 
// Other color constants temporarily not used for polygons layer

export default function DppGlobalTrackerPage() {
  const [isClient, setIsClient] = useState(false);
  const globeRefMain = useRef<any | undefined>();
  const router = useRouter();
  const { toast } = useToast(); // Kept for GeoJSON error reporting

  // State for GeoJSON loading (will be re-enabled later)
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(true); // Default to true, becomes false after attempted fetch
  const [geoJsonError, setGeoJsonError] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    // Temporarily disable GeoJSON fetching to focus on base globe
    // This will be re-enabled in a later step.
    // console.log("GeoJSON fetching temporarily disabled for base globe diagnostics.");
    // setIsLoadingGeoJson(false); // Assume no GeoJSON for now

    // Minimal GeoJSON fetch attempt to see if the file exists at all
    fetch('/ne_110m_admin_0_countries.geojson')
      .then(res => {
        if (!res.ok) {
          console.warn(`GeoJSON fetch error: ${res.status} ${res.statusText} for URL ${res.url}`);
          setGeoJsonError(true);
          toast({
            title: "Map Border Data Issue",
            description: `Could not load country boundaries (status: ${res.status}). Globe will be shown without borders. Ensure 'ne_110m_admin_0_countries.geojson' is in /public.`,
            variant: "destructive",
            duration: 10000,
          });
          return null; 
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          // setCountryPolygons(data.features); // Will use this later
          console.log("GeoJSON loaded successfully (polygons not rendered in this diagnostic step).");
          setGeoJsonError(false);
        }
      })
      .catch(error => {
        console.warn("Error processing GeoJSON or network issue:", error.message);
        toast({
          title: "Error Loading Map Data",
          description: "Could not load or process country boundaries. Globe will be shown without borders. Ensure 'ne_110m_admin_0_countries.geojson' is in /public.",
          variant: "destructive",
          duration: 10000,
        });
        setGeoJsonError(true);
      })
      .finally(() => {
          setIsLoadingGeoJson(false);
      });
  }, [toast]);

  // All other useEffects, useMemos, state related to data points, arcs, simulation, filtering, info cards are temporarily removed/commented out
  // to focus on base globe rendering.

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="p-3 border-b border-border shadow-sm bg-card flex items-center justify-between print:hidden">
        <div className="flex items-center">
           <GlobeIconLucide className="mr-2 h-6 w-6 text-primary" />
           <h1 className="text-xl font-headline font-semibold">
             DPP Global Tracker (Basic Render Test)
           </h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>Back to Dashboard</Button>
      </header>
      
      {isClient && geoJsonError && !isLoadingGeoJson && (
        <div className="p-4 flex-shrink-0"> 
          <Alert variant="destructive"> 
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Map Data Issue</AlertTitle>
            <AlertDescription>
              Could not load country border data. The globe will be displayed without detailed country outlines.
              Please ensure 'ne_110m_admin_0_countries.geojson' is in the /public folder.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex-grow grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-0 relative min-h-0"> 
        {/* Simplified Aside: Temporarily hide controls and legend for clarity */}
        <aside className="h-full bg-card border-r border-border p-3 space-y-3 overflow-y-auto print:hidden flex flex-col">
            <Card className="shadow-md">
                <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-semibold flex items-center">
                        <Info className="h-4 w-4 mr-2 text-primary" /> Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 text-xs text-muted-foreground space-y-1">
                    <p>Diagnostic Mode: Basic globe rendering test.</p>
                    <p>Expecting a dark globe with night texture and atmosphere.</p>
                    <p>Data layers (countries, points, arcs) are temporarily disabled.</p>
                </CardContent>
            </Card>
        </aside>

        <main className={cn("h-full w-full relative")}>
          {isLoadingGeoJson && !geoJsonError ? ( 
             <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Checking Geographic Data...</span>
              </div>
          ) : (
            <Suspense fallback={
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading 3D Globe Visualization...</span>
              </div>
            }>
              {isClient && (
                  <GlobeVisualization
                      globeRef={globeRefMain}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                      globeBackgroundColor={GLOBE_BACKGROUND_COLOR} // From constant at top of this file
                      atmosphereColor="#3a82f6" 
                      atmosphereAltitude={0.25}
                      // No data props passed in this diagnostic step
                  />
              )}
              </Suspense>
          )}
        </main>
      </div>
      
      {/* InfoCards are temporarily removed */}
      {/* AlertDialog for checkpoint inspection is temporarily removed */}
      {/* Bottom filter card is temporarily removed */}
    </div>
  );
}

// uniqueCategories and shipmentStatusOptions are temporarily removed as filters are disabled.


"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Globe as GlobeIconLucide, Info, ChevronDown, ChevronUp, Loader2, Circle, Layers } from "lucide-react";
import type { GlobeMethods, GlobeProps } from 'react-globe.gl';
import { cn } from '@/lib/utils';
import PointInfoCard from '@/components/dpp-tracker/PointInfoCard';

const Globe = React.lazy(() => import('react-globe.gl'));

const euPolygon = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "EU Approximation" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-10, 35], [30, 35], [30, 60], [15, 70], [-5, 60], [-10, 35]
          ]
        ]
      }
    }
  ]
};

export interface MockDppPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  category: string;
  status: 'compliant' | 'pending' | 'issue';
  manufacturer?: string;
  gtin?: string;
  complianceSummary?: string;
}

const mockDppsOnGlobe: MockDppPoint[] = [
  { id: "DPP_GLOBE_001", lat: 48.8566, lng: 2.3522, name: "Smart Refrigerator X1 (Paris)", size: 0.6, category: 'Appliances', status: 'compliant', manufacturer: 'GreenTech SAS', gtin: '3123456789012', complianceSummary: 'Fully compliant with EU Ecodesign and Energy Labelling.' },
  { id: "DPP_GLOBE_002", lat: 52.5200, lng: 13.4050, name: "Eco-Laptop Z2 (Berlin)", size: 0.7, category: 'Electronics', status: 'pending', manufacturer: 'EcoElektronik GmbH', gtin: '3987654321098', complianceSummary: 'Pending battery passport documentation.' },
  { id: "DPP_GLOBE_003", lat: 41.9028, lng: 12.4964, name: "Recycled Sneakers V1 (Rome)", size: 0.5, category: 'Apparel', status: 'compliant', manufacturer: 'ModaVerde S.p.A.', gtin: '3456789012345', complianceSummary: 'Verified recycled content and ethical production.' },
  { id: "DPP_GLOBE_004", lat: 51.5074, lng: 0.1278, name: "Sustainable Coffee Machine (London)", size: 0.65, category: 'Appliances', status: 'issue', manufacturer: 'BrewRight Ltd.', gtin: '3567890123456', complianceSummary: 'Repairability score below EU target; awaiting updated schematics.' },
  { id: "DPP_GLOBE_005", lat: 40.4168, lng: -3.7038, name: "Smart Thermostat G2 (Madrid)", size: 0.55, category: 'Electronics', status: 'compliant', manufacturer: 'CasaInteligente S.L.', gtin: '3678901234567', complianceSummary: 'RoHS and REACH compliant.' },
  { id: "DPP_GLOBE_006", lat: 59.3293, lng: 18.0686, name: "Wooden Chair Set (Stockholm)", size: 0.6, category: 'Furniture', status: 'pending', manufacturer: 'NordicWood AB', gtin: '3789012345678', complianceSummary: 'FSC certification verification in progress.' },
  { id: "DPP_GLOBE_007", lat: 53.3498, lng: -6.2603, name: "Outdoor Solar Lamp (Dublin)", size: 0.5, category: 'Outdoor', status: 'compliant', manufacturer: 'SunBright Ltd.', gtin: '3890123456789', complianceSummary: 'IP65 rated, 3-year warranty.' },
];

const statusColors: Record<MockDppPoint['status'], string> = {
  compliant: 'rgba(74, 222, 128, 0.9)', // Green
  pending: 'rgba(250, 204, 21, 0.9)',  // Yellow
  issue: 'rgba(239, 68, 68, 0.9)',     // Red
};

const categoryColors: Record<string, string> = {
  Appliances: 'rgba(59, 130, 246, 0.9)', // Blue
  Electronics: 'rgba(168, 85, 247, 0.9)', // Purple
  Apparel: 'rgba(236, 72, 153, 0.9)', // Pink
  Furniture: 'rgba(161, 98, 7, 0.9)', // Brown (Adjusted from original list)
  Outdoor: 'rgba(20, 184, 166, 0.9)', // Teal
  Default: 'rgba(156, 163, 175, 0.9)', // Gray for unknown categories
};

type ActiveLayer = 'status' | 'category';

const GlobeVisualization = ({ 
  onPointClick, 
  pointColorAccessor 
}: { 
  onPointClick: (point: MockDppPoint) => void;
  pointColorAccessor: (point: MockDppPoint) => string;
}) => {
  const globeEl = useRef<GlobeMethods | undefined>();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 50, lng: 10, altitude: 1.8 });
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 100;
      globeEl.current.controls().maxDistance = 800;
    }
  }, []);

  const globeProps: GlobeProps = {
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-dark.jpg",
    bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
    backgroundColor: "rgba(0,0,0,0)",
    width: undefined, // Takes parent width
    height: 450, // Fixed height for consistency
    polygonsData: euPolygon.features,
    polygonCapColor: () => 'rgba(0, 100, 255, 0.2)',
    polygonSideColor: () => 'rgba(0, 0, 0, 0.05)',
    polygonStrokeColor: () => 'rgba(0, 50, 150, 0.8)',
    polygonAltitude: 0.01,
    pointsData: mockDppsOnGlobe,
    pointLabel: 'name',
    pointColor: d => pointColorAccessor(d as MockDppPoint),
    pointRadius: 'size',
    pointAltitude: 0.02,
    onPointClick: (point: any) => {
      onPointClick(point as MockDppPoint);
    },
  };

  return <Globe ref={globeEl} {...globeProps} />;
};

const DppGlobalTrackerClientContainer = ({ 
  onPointClick,
  pointColorAccessor
}: { 
  onPointClick: (point: MockDppPoint) => void;
  pointColorAccessor: (point: MockDppPoint) => string;
}) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[450px] bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading 3D Globe...</span>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="w-full h-[450px] bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading 3D Globe...</span>
      </div>
    }>
      <GlobeVisualization onPointClick={onPointClick} pointColorAccessor={pointColorAccessor} />
    </Suspense>
  );
};

const Legend = ({ title, colorMap }: { title: string; colorMap: Record<string, string> }) => (
  <Card className="mt-6 shadow-md">
    <CardHeader className="pb-3">
      <CardTitle className="text-md font-headline">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {Object.entries(colorMap).map(([key, color]) => (
        <div key={key} className="flex items-center">
          <Circle className="h-3.5 w-3.5 mr-2" style={{ color: color, fill: color }} />
          <span className="capitalize text-foreground/90">{key.replace(/_/g, ' ')}</span>
        </div>
      ))}
      <div className="flex items-center">
        <GlobeIconLucide className="h-3.5 w-3.5 mr-2 text-blue-400" />
        <span className="text-foreground/90">EU Region Outline</span>
      </div>
    </CardContent>
  </Card>
);

export default function DppGlobalTrackerPage() {
  const [isConceptVisible, setIsConceptVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MockDppPoint | null>(null);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('status');

  const conceptDescription = `...`; // Kept for brevity, same as before

  const handlePointClick = (point: MockDppPoint) => {
    setSelectedPoint(point);
  };

  const handleCloseInfoCard = () => {
    setSelectedPoint(null);
  };

  const pointColorAccessor = useMemo(() => {
    return (point: MockDppPoint): string => {
      if (activeLayer === 'status') {
        return statusColors[point.status] || 'rgba(255, 255, 255, 0.7)';
      } else if (activeLayer === 'category') {
        return categoryColors[point.category] || categoryColors.Default;
      }
      return 'rgba(255, 255, 255, 0.7)'; // Default fallback
    };
  }, [activeLayer]);

  const activeLegendMap = useMemo(() => {
    if (activeLayer === 'status') return statusColors;
    if (activeLayer === 'category') {
        // Create a map only for categories present in the mock data for a cleaner legend
        const presentCategories = new Set(mockDppsOnGlobe.map(p => p.category));
        const relevantCategoryColors: Record<string, string> = {};
        presentCategories.forEach(cat => {
            relevantCategoryColors[cat] = categoryColors[cat] || categoryColors.Default;
        });
        return relevantCategoryColors;
    }
    return {};
  }, [activeLayer]);

  const activeLegendTitle = activeLayer === 'status' ? "Status Legend" : "Category Legend";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <GlobeIconLucide className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker – "The EU Digital Pulse"
        </h1>
      </div>

      <Alert variant="default" className="bg-info/10 border-info/50 text-info-foreground">
        <Info className="h-5 w-5 text-info" />
        <AlertTitle className="font-semibold text-info">Interactive Prototype</AlertTitle>
        <AlertDescription>
          This is an early prototype. Rotate the globe with your mouse. Click points for info. Change data layers using the controls below.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>EU Digital Product Passport Visualization</CardTitle>
          <CardDescription>An interactive globe displaying mock DPP data points and flows across Europe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-[450px] bg-muted/30 rounded-md overflow-hidden border relative">
            <DppGlobalTrackerClientContainer onPointClick={handlePointClick} pointColorAccessor={pointColorAccessor} />
            {selectedPoint && <PointInfoCard pointData={selectedPoint} onClose={handleCloseInfoCard} />}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md font-headline flex items-center">
                <Layers className="mr-2 h-4 w-4 text-primary" />
                Data Layers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={activeLayer} onValueChange={(value) => setActiveLayer(value as ActiveLayer)} className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="status" id="layer-status" />
                  <Label htmlFor="layer-status" className="cursor-pointer hover:text-primary">Color by Status</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="category" id="layer-category" />
                  <Label htmlFor="layer-category" className="cursor-pointer hover:text-primary">Color by Category</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Legend title={activeLegendTitle} colorMap={activeLegendMap} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center cursor-pointer" onClick={() => setIsConceptVisible(!isConceptVisible)}>
          <div>
            <CardTitle className="font-headline">About This Concept</CardTitle>
            <CardDescription>Details of the vision for the DPP Global Tracker.</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            {isConceptVisible ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CardHeader>
        {isConceptVisible && (
          <CardContent className="pt-0">
             <div className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto">
                {conceptDescription.trim().split('\n\n').map((paragraphBlock, index) => {
                  const lines = paragraphBlock.split('\n');
                  const firstLine = lines[0].trim();
                  const mainHeaders = ["Core Idea:", "Key Features of the DPP Global Tracker:", "Technical Implementation Ideas:", "Conclusion:"];
                  const isMainHeader = mainHeaders.some(header => firstLine.startsWith(header));

                  if (isMainHeader) {
                    return (
                      <div key={index} className="pt-2">
                        <h2 className="text-lg font-semibold text-primary mt-4 mb-2 !no-underline">{firstLine}</h2>
                        {lines.slice(1).map((line, lineIdx) => <p key={lineIdx} className="my-1 text-sm">{line}</p>)}
                      </div>
                    );
                  } else if (firstLine.match(/^(\d+)\.\s+.+/)) {
                     return (
                      <div key={index} className="mt-1">
                        <h3 className="text-md font-medium text-foreground/90 mt-3 mb-1 !no-underline">{firstLine}</h3>
                        {lines.slice(1).map((line, lineIdx) => {
                          const trimmedLine = line.trim();
                           if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                            return <p key={lineIdx} className="my-0.5 ml-4 text-sm before:content-['•_'] before:mr-1.5">{trimmedLine.substring(2)}</p>;
                          }
                          if (trimmedLine.match(/^(\s{2,}-\s|\s{2,}\u2022\s)/)) {
                            return <p key={lineIdx} className="my-0.5 ml-8 text-sm before:content-['\25E6_'] before:mr-1.5">{trimmedLine.replace(/^(\s{2,}[-\u2022]\s)/, '')}</p>;
                          }
                          if (trimmedLine) {
                            return <p key={lineIdx} className="my-0.5 text-sm">{trimmedLine}</p>;
                          }
                          return null;
                        })}
                      </div>
                    );
                  }
                  if (paragraphBlock.trim()) { return <p key={index} className="my-1.5 text-sm">{paragraphBlock}</p>; }
                  return null;
                })}
             </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

    

    
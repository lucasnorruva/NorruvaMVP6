"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe as GlobeIconLucide, Info, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { GlobeMethods, GlobeProps } from 'react-globe.gl';

// Lazy load the Globe component
const Globe = React.lazy(() => import('react-globe.gl'));

// Define a simple GeoJSON-like structure for the EU area polygon
const euPolygon = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "EU Approximation" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [ // A very rough polygon covering parts of Western/Central Europe
            [-10, 35], [30, 35], [30, 60], [15, 70], [-5, 60], [-10, 35]
          ]
        ]
      }
    }
  ]
};

// Mock DPP data points for the globe
const mockDppsOnGlobe = [
  { lat: 48.8566, lng: 2.3522, name: "Smart Refrigerator X1 (Paris)", color: 'rgba(255, 100, 100, 0.85)', size: 0.6, category: 'Appliances' },
  { lat: 52.5200, lng: 13.4050, name: "Eco-Friendly Laptop Z2 (Berlin)", color: 'rgba(100, 255, 100, 0.85)', size: 0.7, category: 'Electronics' },
  { lat: 41.9028, lng: 12.4964, name: "Recycled Material Sneakers (Rome)", color: 'rgba(100, 100, 255, 0.85)', size: 0.5, category: 'Apparel' },
  { lat: 51.5074, lng: 0.1278, name: "Sustainable Coffee Maker (London)", color: 'rgba(255, 255, 100, 0.85)', size: 0.65, category: 'Appliances' }
];


const GlobeVisualization = () => {
  const globeEl = useRef<GlobeMethods | undefined>();

  useEffect(() => {
    // Auto-rotate and zoom
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 50, lng: 10, altitude: 1.8 }); // Adjusted altitude
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
    width: undefined, 
    height: 450,
    polygonsData: euPolygon.features,
    polygonCapColor: () => 'rgba(0, 100, 255, 0.2)', // Semi-transparent blue for EU
    polygonSideColor: () => 'rgba(0, 0, 0, 0.05)',
    polygonStrokeColor: () => 'rgba(0, 50, 150, 0.8)',
    polygonAltitude: 0.01,
    pointsData: mockDppsOnGlobe,
    pointLabel: 'name',
    pointColor: 'color', // Use color from data
    pointRadius: 'size', // Use size from data
    pointAltitude: 0.02, // Slightly elevate points
    onPointClick: (point: any) => { // Type 'any' for simplicity with mock data
      alert(`Clicked on: ${point.name}\nCategory: ${point.category}`);
    },
  };

  return <Globe ref={globeEl} {...globeProps} />;
};


const DppGlobalTrackerClientContainer = () => {
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
      <GlobeVisualization />
    </Suspense>
  );
};


export default function DppGlobalTrackerPage() {
  const [isConceptVisible, setIsConceptVisible] = useState(false);
  const conceptDescription = `
Core Idea:
Create an interactive 3D globe centered around the European Union that dynamically displays data from the Digital Product Passports (DPPs) across different regions. This globe could act as a “Digital Pulse” of product movement, ownership, lifecycle, certifications, and compliance in real-time.

Key Features of the DPP Global Tracker:
1. 3D EU Globe Visualization:
   - The globe would have a rotating, interactive European Union at its center.
   - As the user interacts with the globe (using the mouse, touchpad, or via VR/AR devices), they can spin, zoom in, and out, and hover over countries or specific regions within the EU.

2. Dynamic Product Data Points:
   - Instead of just numbers or linear graphs, each product tracked via the DPP can have its own floating 3D icon (e.g., a small spinning product, a digital passport icon, or a product box).
   - These product icons would move around the globe based on factors like product lifecycle stages (e.g., “created”, “shipped”, “sold”, “recycled”).
   - Products that are part of the same supply chain or from the same manufacturer could be grouped together with a glowing, colorful halo around them, indicating relationships or certifications.

3. Color-Coded Regions and Data Layers:
   - The globe could be color-coded to show different compliance statuses or certifications (e.g., eco-friendly, sustainability, safety).
   - Green for fully compliant products, yellow for pending or under review, and red for products with issues or flagged for non-compliance.
   - Users can toggle between layers of data such as:
     - Environmental impact: Show carbon footprint of products in each country with animated heatmaps.
     - Product lifecycle stage: Show the percentage of products in the creation phase, transportation, or end of life.
     - Compliance with EU regulations: Show certification statuses and compliance metrics like ESPR, EPREL, or EBSI.

4. Interactive Data Pop-ups & Info Cards:
   - When a user hovers over a country or clicks on a specific product, an info card would pop up, showing detailed product passport data such as:
     - Product origin, lifecycle, certifications, and product category.
     - Blockchain verification status, linking back to the specific product’s blockchain record and providing a direct link to the product’s digital passport.
     - Traceability information, showing product movement history, ownership, and compliance with EU regulations.

5. Tracking Product Movement in Real-Time:
   - Animated lines or beams could dynamically represent product flows across Europe, showing products being shipped, transferred, or tracked in real-time.
   - This could look like a flowing pulse of energy, lighting up the path the product is taking from one region to another, representing its movement throughout its lifecycle.
   - The speed and brightness of the pulse could be adjusted based on factors like product urgency, shipment speed, or market demand.

6. Dynamic Data Animation:
   - Instead of just showing static data, each product's data point could have movement that represents the product’s life cycle.
   - For example, when a product is in transit, a moving dashed line or animated path could show its movement across the globe.
   - As a product goes from “manufactured” to “shipped” to “sold,” it could transition through animated visual stages (e.g., product icons turning from grey to color, growing larger as it reaches its final destination).

7. Country/Region-Specific Hotspots:
   - Hotspot Indicators could highlight regions where a significant amount of DPP data is being generated or tracked.
   - For example, countries with heavy product movement or large manufacturing centers (e.g., Germany, France, or Italy) could pulse or glow, drawing attention to areas with high activity.
   - Clicking on these hotspots could give insights into the most popular products, certification compliance rates, or blockchain activity in that region.

8. User Interaction & Personalization:
   - Users can filter by product type, regulatory compliance, or certification to see the flow and status of specific kinds of products.
   - Allow users to set alerts or notifications for specific products or regions (e.g., "Notify me when a product reaches EBSI compliance" or "Track product lifecycle for sustainable goods").
   - The globe could have an augmented reality (AR) mode where users could scan QR codes on physical products and see the global tracker for that specific item, visually represented on the globe.

9. Real-Time Data Updates:
   - The tracker could be connected to real-time data feeds for updated product movements, new certifications, and compliance statuses, ensuring that the system stays accurate and dynamic.
   - This would allow users to watch live changes on the globe (e.g., products being certified, moving across borders, entering markets).

10. Geographical & Blockchain Layers Toggle:
    - Users can toggle between geographical data layers (e.g., EU-wide product flows, country-by-country data) and blockchain-related data (e.g., smart contract status, verification results).
    - Visual transitions between these data sets can include zooming in/out on the globe or transforming the globe’s surface to display the appropriate data dynamically.

Technical Implementation Ideas:
- 3D Globe Technology: Use technologies like WebGL, Three.js, or Babylon.js to build the interactive globe. These technologies support 3D rendering and complex animations, which are essential for a smooth user experience.
- Data Visualization: Implement D3.js for creating dynamic and interactive visualizations (e.g., product movement paths, heatmaps) overlaid on the globe.
- Real-time Data Integration: Use APIs to pull live data from the blockchain and EBSI systems, updating the visualizations in real-time.
- User Interface: Create an intuitive, interactive dashboard where users can filter by product type, compliance status, and lifecycle stage. The dashboard should be embedded alongside the globe or act as an overlay.

Conclusion:
The DPP Global Tracker with an interactive 3D EU globe would be a visually engaging and immersive tool for tracking digital product passports, lifecycle data, and compliance across Europe. This concept moves beyond traditional numbers and tables, leveraging dynamic visuals and real-time interactivity to create a compelling and user-friendly experience. By combining real-time data, geographical visualization, and blockchain integration, you’ll have an engaging tool that shows the full scope of product movements and compliance statuses in a highly dynamic, intuitive way.
  `;

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
          This is an early prototype of the DPP Global Tracker. Features are being added incrementally. Rotate the globe with your mouse. Click on data points for more info (mock).
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>EU Digital Product Passport Visualization</CardTitle>
          <CardDescription>An interactive globe displaying mock DPP data points and flows across Europe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-[450px] bg-muted/30 rounded-md overflow-hidden border">
            <DppGlobalTrackerClientContainer />
          </div>
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

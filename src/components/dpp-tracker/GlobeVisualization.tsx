
// This file is created to house the GlobeVisualization component.
// It will be dynamically imported into dpp-global-tracker/page.tsx

"use client";

import React, { useEffect, useRef } from 'react';
// Note: 'react-globe.gl' will be required inside the component to ensure client-side only.

// Import types from the page, or define them here if preferred
// For now, assuming types are implicitly handled by props from the page
interface MockDppPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  category: 'Manufacturing Site' | 'Distribution Hub' | 'Retail Outlet' | 'Recycling Facility' | 'Raw Material Source';
  status: 'compliant' | 'pending' | 'issue' | 'unknown';
  timestamp: number;
  manufacturer?: string;
  gtin?: string;
  complianceSummary?: string;
  color?: string;
}

interface MockArc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string | string[];
  label?: string;
  stroke?: number;
  timestamp: number;
  transportMode?: 'sea' | 'air' | 'road' | 'rail';
  productId?: string;
}


interface GlobeVisualizationProps {
  pointsData: MockDppPoint[];
  arcsData: MockArc[];
  labelsData: any[]; // Keeping these simple for now
  polygonsData: any[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  pointColorAccessor: (point: MockDppPoint) => string;
  pointRadiusAccessor: (point: MockDppPoint) => number;
  arcColorAccessor: (arc: MockArc) => string | string[];
  arcStrokeAccessor: (arc: MockArc) => number;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  pointsData,
  arcsData,
  labelsData,
  polygonsData,
  onPointClick,
  onArcClick,
  pointColorAccessor,
  pointRadiusAccessor,
  arcColorAccessor,
  arcStrokeAccessor
}) => {
  const globeEl = useRef<any | undefined>();
  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Dynamically import react-globe.gl only on the client-side
    import('react-globe.gl').then(module => {
      setGlobeComponent(() => module.default);
    });
  }, []);
  
  console.log("GlobeVisualization (dynamic component): Rendering. Minimal props for parsing test.");

  useEffect(() => {
    console.log("GlobeVisualization (dynamic component): useEffect triggered.");
    if (globeEl.current && GlobeComponent) { // Ensure GlobeComponent is loaded
      console.log("GlobeVisualization (dynamic component): Globe instance (globeEl.current) IS available.");
      try {
        globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 3.5 }); 
        console.log("GlobeVisualization (dynamic component): pointOfView set.");
        
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false;
            controls.enableZoom = true;
            controls.minDistance = 50;
            controls.maxDistance = 1500;
            console.log("GlobeVisualization (dynamic component): Globe controls configured.");
        } else {
            console.warn("GlobeVisualization (dynamic component): globeEl.current.controls() is null or undefined.");
        }
      } catch (e) {
        console.error("GlobeVisualization (dynamic component): Error configuring globe controls or POV", e);
      }
    } else {
      console.warn("GlobeVisualization (dynamic component): Globe instance (globeEl.current) or GlobeComponent NOT available in useEffect.", { hasGlobeEl: !!globeEl.current, hasGlobeComponent: !!GlobeComponent });
    }
  }, [GlobeComponent]); // Re-run if GlobeComponent changes (i.e., loads)

  const globeProps = {
    backgroundColor: "rgba(10, 10, 30, 1)", // Dark ocean
    // globeImageUrl: undefined, // Default grey sphere

    pointsData: pointsData,
    pointLabel: 'name',
    pointColor: pointColorAccessor,
    pointRadius: pointRadiusAccessor,
    pointAltitude: 0.02,
    onPointClick: onPointClick,
    
    arcsData: arcsData,
    arcLabel: 'label',
    arcColor: arcColorAccessor,
    arcStroke: arcStrokeAccessor,
    arcDashLength: 0.4,
    arcDashGap: 0.2,
    arcDashAnimateTime: 2000,
    arcAltitudeAutoScale: 0.3,
    onArcClick: onArcClick,

    labelsData: labelsData,
    labelLat: (d: any) => d.lat,
    labelLng: (d: any) => d.lng,
    labelText: (d: any) => d.name,
    labelSize: 0.22,
    labelDotRadius: 0.18,
    labelColor: () => 'rgba(255, 255, 255, 0.95)',
    labelResolution: 2,
    labelAltitude: 0.018,

    polygonsData: polygonsData,
    polygonCapColor: () => 'rgba(200, 200, 200, 0.7)', // Default grey for polygons for this test
    polygonSideColor: () => 'rgba(0,0,0,0)',
    polygonStrokeColor: () => 'rgba(50,50,50,0.7)',
    polygonAltitude: 0.01,
  };
  
  if (!GlobeComponent) {
    // You can return a loader here if needed, or null
    return <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">Loading Globe Library...</div>;
  }

  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 20, border: '2px dashed green' }}>
      <GlobeComponent ref={globeEl} {...globeProps} />
    </div>
  );
};

export default GlobeVisualization;

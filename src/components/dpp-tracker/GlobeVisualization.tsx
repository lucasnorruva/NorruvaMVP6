
"use client";

import React, { useEffect, useRef, useState } from 'react';

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
  labelsData: any[]; 
  polygonsData: any[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  pointColorAccessor: (point: MockDppPoint) => string;
  pointRadiusAccessor: (point: MockDppPoint) => number;
  arcColorAccessor: (arc: MockArc) => string | string[];
  arcStrokeAccessor: (arc: MockArc) => number;
  polygonCapColorAccessor: (feature: any) => string;
  polygonSideColorAccessor: (feature: any) => string;
  polygonStrokeColorAccessor: (feature: any) => string;
  globeBackgroundColor: string; 
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
  arcStrokeAccessor,
  polygonCapColorAccessor,
  polygonSideColorAccessor,
  polygonStrokeColorAccessor,
  globeBackgroundColor
}) => {
  const globeEl = useRef<any | undefined>();
  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('react-globe.gl').then(module => {
      setGlobeComponent(() => module.default);
    }).catch(error => {
      console.error("Failed to load react-globe.gl:", error);
    });
  }, []);
  

  useEffect(() => {
    if (globeEl.current && GlobeComponent) { 
      try {
        // Europe-centric view
        globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.2 }); 
        
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false;
            controls.enableZoom = true;
            controls.minDistance = 50; 
            controls.maxDistance = 1500;
        }
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    }
  }, [GlobeComponent]); 

  if (!GlobeComponent) {
    return <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">Loading Globe Library...</div>;
  }

  const globeProps = {
    backgroundColor: globeBackgroundColor, // Use prop for ocean color
    globeImageUrl: undefined, // No texture, rely on polygon colors

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
    // arcDashLength: 0.4,
    // arcDashGap: 0.2,
    // arcDashAnimateTime: 2000,
    // arcAltitudeAutoScale: 0.3,
    onArcClick: onArcClick,

    labelsData: labelsData,
    // labelLat: (d: any) => d.lat,
    // labelLng: (d: any) => d.lng,
    // labelText: (d: any) => d.name,
    // labelSize: 0.20, 
    // labelDotRadius: 0.15, 
    // labelColor: () => 'rgba(255, 255, 255, 0.95)',
    // labelResolution: 2,
    // labelAltitude: 0.015,

    polygonsData: polygonsData,
    polygonCapColor: polygonCapColorAccessor,
    polygonSideColor: polygonSideColorAccessor, // For flat look
    polygonStrokeColor: polygonStrokeColorAccessor,
    polygonAltitude: 0.005, // Slightly raised to prevent z-fighting
    polygonsTransitionDuration: 0, // No transition for color changes
  };
  
  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 20 }}>
      <GlobeComponent ref={globeEl} {...globeProps} />
    </div>
  );
};

export default GlobeVisualization;

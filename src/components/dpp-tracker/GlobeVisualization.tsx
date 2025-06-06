
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
// Removed Lucide icon imports as they are not used in this simplified version
// import { MapPin, Ship, Plane, Building2 as LandBorderIcon } from 'lucide-react';

// Removed color constants as they are hardcoded or simplified below
// import {
//     DPP_HEALTH_GOOD_COLOR,
//     DPP_HEALTH_FAIR_COLOR,
//     DPP_HEALTH_POOR_COLOR,
//     CHECKPOINT_PORT_COLOR,
//     CHECKPOINT_AIRPORT_COLOR,
//     CHECKPOINT_LAND_BORDER_COLOR
// } from '@/app/(app)/dpp-global-tracker/page';
import type { MockDppPoint, MockArc, MockCustomsCheckpoint, MockShipmentPoint } from '@/app/(app)/dpp-global-tracker/page';

// Simplified getIconCanvas - not used in this version as checkpoints are removed
// const getIconCanvas = (IconComponent: React.ElementType, color: THREE.Color, size = 64): HTMLCanvasElement => { ... };


interface GlobeVisualizationProps {
  globeRef?: React.MutableRefObject<any | undefined>;
  // Temporarily remove complex props for diagnosis
  // pointsData: Array<MockDppPoint | MockShipmentPoint>;
  // arcsData: MockArc[];
  // polygonsData: any[];
  // customsCheckpointsData: MockCustomsCheckpoint[];
  // onPointClick: (point: MockDppPoint | MockShipmentPoint) => void;
  // onArcClick: (arc: MockArc) => void;
  // onCheckpointClick: (checkpoint: MockCustomsCheckpoint) => void;
  // pointColorAccessor: (point: MockDppPoint | MockShipmentPoint) => string;
  // pointRadiusAccessor: (point: MockDppPoint | MockShipmentPoint) => number;
  // arcColorAccessor: (arc: MockArc) => string | string[];
  // arcStrokeAccessor: (arc: MockArc) => number;
  // polygonCapColorAccessor: (feature: any) => string;
  // polygonSideColorAccessor: (feature: any) => string;
  // polygonStrokeColorAccessor: (feature: any) => string;
  // globeBackgroundColor: string; // Will be hardcoded
  // globeImageUrl?: string; // Will be hardcoded
}

// Minimal hardcoded points for testing
const minimalPointsData: MockDppPoint[] = [
  { id: 'test_point_1', lat: 50, lng: 0, name: 'Test Point 1 (London)', size: 0.2, category: 'Electronics', status: 'compliant', timestamp: 2024 },
  { id: 'test_point_2', lat: 40, lng: -100, name: 'Test Point 2 (USA)', size: 0.2, category: 'Appliances', status: 'pending', timestamp: 2024 },
];


const GlobeVisualizationInternal: React.FC<GlobeVisualizationProps> = ({
  globeRef: externalGlobeRef,
  // Other props are removed for simplification
}) => {
  const internalGlobeRef = useRef<any | undefined>();
  const globeEl = externalGlobeRef || internalGlobeRef;

  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType<any> | null>(null);
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    import('react-globe.gl').then(module => {
      setGlobeComponent(() => module.default);
    }).catch(error => {
      console.error("Failed to load react-globe.gl:", error);
    });
  }, []);


  useEffect(() => {
    if (globeEl.current && GlobeComponent && !globeReady) {
      try {
        globeEl.current.pointOfView({ lat: 45, lng: 10, altitude: 2.5 });
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false; // Keep autoRotate off for debugging
            controls.enableZoom = true;
            controls.zoomSpeed = 0.7;
            controls.rotateSpeed = 0.4;
            controls.minDistance = 120;
            controls.maxDistance = 1000;
        }
        setGlobeReady(true); // Mark globe as ready
        console.log("Globe component ready and configured.");
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    }
  }, [GlobeComponent, globeEl, globeReady]);


  if (!GlobeComponent) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">Loading Globe Library... If this persists, check console for errors.</div>;
  }
  
  console.log("Rendering GlobeComponent with hardcoded props...");

  const globeProps = {
    // Hardcode background and image directly here
    backgroundColor: '#000011', // Very dark navy blue, almost black
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-night.jpg", // Using a different, clearer texture for test

    pointsData: minimalPointsData,
    pointLabel: (d: MockDppPoint) => d.name,
    pointColor: (d: MockDppPoint) => d.status === 'compliant' ? 'rgba(0, 255, 0, 0.75)' : 'rgba(255, 165, 0, 0.75)', // Green for compliant, Orange for pending
    pointRadius: (d: MockDppPoint) => d.size * 0.5 + 0.1,
    pointAltitude: 0.02,
    onPointClick: (point: any) => console.log("Clicked point:", point),

    // Temporarily disable other layers
    arcsData: [],
    polygonsData: [],
    customLayerData: [],
    
    // Ensure these are simple or default if they cause issues
    polygonCapColor: () => 'rgba(0,0,0,0)', // Transparent
    polygonSideColor: () => 'rgba(0,0,0,0)',
    polygonStrokeColor: () => 'rgba(0,0,0,0)',
  };

  return (
    <div className="w-full h-full" style={{ position: 'relative', backgroundColor: '#000011' }}>
      { GlobeComponent && <GlobeComponent ref={globeEl} {...globeProps} /> }
      {!globeReady && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white"><p>Initializing Globe...</p></div>}
    </div>
  );
};

export default React.memo(GlobeVisualizationInternal);

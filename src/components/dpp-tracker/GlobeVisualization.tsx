
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// Removed data type imports as data layers are temporarily disabled
// import type { MockDppPoint, MockArc, MockCustomsCheckpoint, MockShipmentPoint } from '@/app/(app)/dpp-global-tracker/page';

interface GlobeVisualizationProps {
  globeRef?: React.MutableRefObject<any | undefined>;
  globeImageUrl?: string;
  globeBackgroundColor?: string;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  // Data related props are removed for this diagnostic step
}

const GlobeVisualizationInternal: React.FC<GlobeVisualizationProps> = ({
  globeRef: externalGlobeRef,
  globeImageUrl = "//unpkg.com/three-globe/example/img/earth-night.jpg", // Default to night texture
  globeBackgroundColor = "#0a0a0a", // Default to dark background
  atmosphereColor = "#3a82f6",
  atmosphereAltitude = 0.25,
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
        console.log("Attempting to set globe PoV and controls. BackgroundColor prop:", globeBackgroundColor);
        
        // Explicitly set renderer clear color
        const renderer = globeEl.current.renderer();
        if (renderer) {
          renderer.setClearColor(new THREE.Color(globeBackgroundColor), 1); // Use prop or default dark
          console.log("Renderer clear color set to:", globeBackgroundColor);
        } else {
          console.warn("Renderer not available to set clear color.");
        }
        
        globeEl.current.pointOfView({ lat: 45, lng: 10, altitude: 2.5 });
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false;
            controls.enableZoom = true;
            controls.zoomSpeed = 0.5;
            controls.rotateSpeed = 0.4;
            controls.minDistance = 150;
            controls.maxDistance = 500;
            console.log("Globe controls configured.");
        } else {
            console.warn("Globe controls not available for configuration.");
        }
        setGlobeReady(true);
        console.log("Globe component ready.");
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    }
  }, [GlobeComponent, globeEl, globeReady, globeBackgroundColor]);


  if (!GlobeComponent) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">Loading 3D Globe Library...</div>;
  }
  
  // Props for the GlobeComponent, drastically simplified
  const globeProps = {
    globeImageUrl: globeImageUrl,
    backgroundColor: 'rgba(0,0,0,0)', // Make the component's own canvas transparent, rely on renderer clearColor
    atmosphereColor: atmosphereColor,
    atmosphereAltitude: atmosphereAltitude,
    // All data layers (points, arcs, polygons, custom) are removed for now
    pointsData: [],
    arcsData: [],
    polygonsData: [],
    customLayerData: [], 
    // Removed accessor functions and click handlers
  };

  return (
    <div className="w-full h-full" style={{ position: 'relative', backgroundColor: globeBackgroundColor /* This style is for the div wrapper */ }}>
      { GlobeComponent && <GlobeComponent ref={globeEl} {...globeProps} /> }
      {!globeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
          <p>Initializing 3D Globe...</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(GlobeVisualizationInternal);

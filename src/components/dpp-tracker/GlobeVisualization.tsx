
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Globe, { type GlobeMethods, type GlobeProps } from 'react-globe.gl';
import * as THREE from 'three';

interface GlobeVisualizationProps extends Omit<GlobeProps, 'ref'> {
  globeRef: React.RefObject<GlobeMethods>;
  globeImageUrl?: string;
  bumpImageUrl?: string;
  backgroundImageUrl?: string | null; // Keep for consistency, though we use renderer clear color
  globeBackgroundColor?: string; // For the renderer clear color
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  initialZoom?: number;
  initialLat?: number;
  initialLng?: number;
}

const GlobeVisualizationInternal: React.FC<GlobeVisualizationProps> = ({
  globeRef,
  globeImageUrl = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg", // Light blue oceans
  bumpImageUrl,
  backgroundImageUrl, // Not directly used for scene background if renderer.setClearColor is used
  globeBackgroundColor = '#0a0a0a', // Dark background
  atmosphereColor = '#3a82f6', // Default blue atmosphere
  atmosphereAltitude = 0.25,
  initialZoom = 2.5, // Default zoom level
  initialLat = 50,   // Centered more on Europe
  initialLng = 10,
  ...globeProps
}) => {
  const [globeReady, setGlobeReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      
      // Set initial Point of View (PoV)
      globe.pointOfView({ lat: initialLat, lng: initialLng, altitude: initialZoom }, 1000);

      // Setup controls
      const controls = globe.controls();
      if (controls) {
        controls.enableZoom = true;
        controls.zoomSpeed = 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.minDistance = 150; // Zoom in limit
        controls.maxDistance = 500; // Zoom out limit
      }

      // Attempt to set renderer clear color for background
      try {
        const renderer = globe.renderer();
        if (renderer) {
          renderer.setClearColor(new THREE.Color(globeBackgroundColor), 1);
          console.log(`GlobeVisualization: Renderer clear color set to: ${globeBackgroundColor}`);
        } else {
          console.warn("GlobeVisualization: Renderer not available to set clear color.");
        }
      } catch (e) {
        console.error("GlobeVisualization: Error setting renderer clear color:", e);
        setError("Failed to set globe background color.");
      }
      
      setGlobeReady(true);
      console.log("GlobeVisualization: Globe component ready and configured.");
    }
  }, [globeRef, globeBackgroundColor, initialLat, initialLng, initialZoom]);

  if (error) {
    return <div className="text-destructive text-center p-4">{error}</div>;
  }

  return (
    <Globe
      ref={globeRef}
      globeImageUrl={globeImageUrl}
      bumpImageUrl={bumpImageUrl}
      backgroundImageUrl={backgroundImageUrl} // Can be null or a space image
      atmosphereColor={atmosphereColor}
      atmosphereAltitude={atmosphereAltitude}
      onGlobeReady={() => {
        console.log("GlobeVisualization: onGlobeReady triggered");
        // Additional setup after globe is fully ready, if needed
      }}
      {...globeProps}
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
const GlobeVisualization = React.memo(GlobeVisualizationInternal);
GlobeVisualization.displayName = 'GlobeVisualization';

export default GlobeVisualization;

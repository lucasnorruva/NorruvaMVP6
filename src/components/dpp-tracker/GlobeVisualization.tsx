
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Globe, { type GlobeMethods, type GlobeProps } from 'react-globe.gl';
import * as THREE from 'three';

interface GlobeVisualizationProps extends Omit<GlobeProps, 'ref'> {
  globeRef: React.RefObject<GlobeMethods | undefined>; // Allow undefined for initial ref state
  globeImageUrl?: string;
  bumpImageUrl?: string;
  globeBackgroundColor?: string; 
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  initialZoom?: number;
  initialLat?: number;
  initialLng?: number;
}

const GlobeVisualizationInternal: React.FC<GlobeVisualizationProps> = ({
  globeRef,
  globeImageUrl = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  bumpImageUrl = "//unpkg.com/three-globe/example/img/earth-topology.png",
  globeBackgroundColor = '#0a0a0a', 
  atmosphereColor = '#3a82f6', 
  atmosphereAltitude = 0.25,
  initialZoom = 1.5, 
  initialLat = 20,   
  initialLng = 0,
  ...globeProps
}) => {
  const [globeReady, setGlobeReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      
      globe.pointOfView({ lat: initialLat, lng: initialLng, altitude: initialZoom }, 1000);

      const controls = globe.controls();
      if (controls) {
        controls.enableZoom = true;
        controls.zoomSpeed = 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.minDistance = 1; 
        controls.maxDistance = 3.5;
      }

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

  if (!globeReady && typeof window === 'undefined') { // Avoid rendering Globe on server if not ready
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-primary-foreground">Preparing Globe...</p>
        </div>
    );
  }

  return (
    <Globe
      ref={globeRef}
      globeImageUrl={globeImageUrl}
      bumpImageUrl={bumpImageUrl}
      backgroundColor={globeBackgroundColor} // Important for react-globe.gl to not use its default white
      atmosphereColor={atmosphereColor}
      atmosphereAltitude={atmosphereAltitude}
      onGlobeReady={() => {
        console.log("GlobeVisualization: onGlobeReady triggered from react-globe.gl");
        setGlobeReady(true);
      }}
      // Pass through all other polygon-related props
      polygonsData={globeProps.polygonsData || []}
      polygonCapColor={globeProps.polygonCapColor}
      polygonSideColor={globeProps.polygonSideColor}
      polygonStrokeColor={globeProps.polygonStrokeColor}
      polygonAltitude={globeProps.polygonAltitude}
      onPolygonClick={globeProps.onPolygonClick}
      polygonsTransitionDuration={globeProps.polygonsTransitionDuration || 0}
      {...globeProps} // Spread remaining props
    />
  );
};

const GlobeVisualization = React.memo(GlobeVisualizationInternal);
GlobeVisualization.displayName = 'GlobeVisualization';

// This wrapper ensures GlobeVisualization is only rendered on the client
const ClientOnlyGlobe: React.FC<GlobeVisualizationProps> = (props) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-primary-foreground">Loading 3D Globe...</p>
        </div>
    );
  }
  return <GlobeVisualization {...props} />;
};

export default ClientOnlyGlobe;

    
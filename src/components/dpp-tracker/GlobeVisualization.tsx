
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Globe, { type GlobeMethods, type GlobeProps } from 'react-globe.gl';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react'; // Added Loader2 import

interface GlobeVisualizationProps extends Omit<GlobeProps, 'ref'> {
  globeRef: React.RefObject<GlobeMethods | undefined>;
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
  globeImageUrl = "//unpkg.com/three-globe/example/img/earth-night.jpg",
  bumpImageUrl = "//unpkg.com/three-globe/example/img/earth-topology.png",
  globeBackgroundColor = '#0a0a0a',
  atmosphereColor = '#3a82f6',
  atmosphereAltitude = 0.25,
  initialZoom = 2.5, 
  initialLat = 20,
  initialLng = 0,
  ...globeProps
}) => {
  const [globeReady, setGlobeReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentGlobeRef = globeRef.current;
    if (currentGlobeRef) {
      console.log("GlobeVisualization: Globe ref found. Initializing...");
      currentGlobeRef.pointOfView({ lat: initialLat, lng: initialLng, altitude: initialZoom }, 1000);

      const controls = currentGlobeRef.controls();
      if (controls) {
        controls.enableZoom = true;
        controls.zoomSpeed = 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.minDistance = 1.5; // Allow closer zoom
        controls.maxDistance = 5;   // Restrict zooming too far out
        console.log("GlobeVisualization: Controls configured.");
      } else {
        console.warn("GlobeVisualization: Globe controls not available.");
      }

      try {
        const renderer = currentGlobeRef.renderer();
        if (renderer) {
          renderer.setClearColor(new THREE.Color(globeBackgroundColor || '#0a0a0a'), 1);
          console.log(`GlobeVisualization: Renderer clear color set to: ${globeBackgroundColor}`);
        } else {
          console.warn("GlobeVisualization: Renderer not available to set clear color.");
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("GlobeVisualization: Error setting renderer clear color:", errorMessage);
        setError(`Failed to set globe background color: ${errorMessage}`);
      }
      setGlobeReady(true);
    } else {
      console.warn("GlobeVisualization: Globe ref is null during useEffect.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeRef, globeBackgroundColor, initialLat, initialLng, initialZoom]); // Removed atmosphereColor, atmosphereAltitude, bumpImageUrl, globeImageUrl if they don't change after initial setup

  if (error) {
    return <div className="text-destructive text-center p-4">{error}</div>;
  }

  if (!globeReady && typeof window === 'undefined') {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-primary-foreground">Preparing Globe...</p>
        </div>
    );
  }
  
  return (
    <Globe
      ref={globeRef as React.MutableRefObject<GlobeMethods>}
      globeImageUrl={globeImageUrl}
      bumpImageUrl={bumpImageUrl}
      backgroundColor={globeBackgroundColor}
      atmosphereColor={atmosphereColor}
      atmosphereAltitude={atmosphereAltitude}
      onGlobeReady={() => {
        console.log("GlobeVisualization: onGlobeReady triggered from react-globe.gl");
        setGlobeReady(true);
         // Attempt to set renderer color again once globe is ready, as a fallback
        if (globeRef.current) {
          try {
            const renderer = globeRef.current.renderer();
            if (renderer) {
              renderer.setClearColor(new THREE.Color(globeBackgroundColor || '#0a0a0a'), 1);
              console.log(`GlobeVisualization (onGlobeReady): Renderer clear color set to: ${globeBackgroundColor}`);
            }
          } catch (e) {
             console.error("GlobeVisualization (onGlobeReady): Error setting renderer clear color:", e);
          }
        }
      }}
      polygonsData={globeProps.polygonsData || []}
      polygonCapColor={globeProps.polygonCapColor}
      polygonSideColor={globeProps.polygonSideColor}
      polygonStrokeColor={globeProps.polygonStrokeColor}
      polygonAltitude={globeProps.polygonAltitude}
      onPolygonClick={globeProps.onPolygonClick}
      polygonsTransitionDuration={globeProps.polygonsTransitionDuration || 0}
      {...globeProps}
    />
  );
};

const MemoizedGlobeVisualizationInternal = React.memo(GlobeVisualizationInternal);
MemoizedGlobeVisualizationInternal.displayName = 'MemoizedGlobeVisualizationInternal';

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
  return <MemoizedGlobeVisualizationInternal {...props} />;
};

export default ClientOnlyGlobe;

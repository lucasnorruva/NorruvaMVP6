
"use client";

import React, { useEffect, useState } from 'react';
import Globe, { type GlobeMethods, type GlobeProps as ReactGlobeProps } from 'react-globe.gl';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';

// Extended GlobeProps to ensure all used props are defined
interface ExtendedGlobeProps extends Omit<ReactGlobeProps, 'ref'> {
  // Add any custom props if necessary, or ensure all used react-globe.gl props are covered
  // For this version, we are removing polygon-specific props
  onPolygonClick?: (polygon: any, event: MouseEvent) => void; // Keep for potential future use with other layers
}


interface GlobeVisualizationProps extends Omit<ExtendedGlobeProps, 'globeImageUrl' | 'bumpImageUrl' | 'backgroundColor' | 'atmosphereColor' | 'atmosphereAltitude'> {
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
  globeImageUrl = "//unpkg.com/three-globe/example/img/earth-political.jpg", // Texture with political boundaries
  bumpImageUrl = "//unpkg.com/three-globe/example/img/earth-topology.png",
  globeBackgroundColor = '#0a0a0a',
  atmosphereColor = '#3a82f6',
  atmosphereAltitude = 0.25,
  initialZoom = 2.5,
  initialLat = 20,
  initialLng = 0,
  ...globeProps // Pass remaining props like onPolygonClick if needed for other layers
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
        controls.minDistance = 1.1; // Allow a bit closer zoom
        controls.maxDistance = 5;
        console.log("GlobeVisualization: Controls configured.");
      } else {
        console.warn("GlobeVisualization: Globe controls not available.");
      }

      try {
        const renderer = currentGlobeRef.renderer();
        if (renderer) {
          renderer.setClearColor(new THREE.Color(globeBackgroundColor), 1);
          console.log(`GlobeVisualization: Renderer clear color set to: ${globeBackgroundColor}`);
        } else {
          console.warn("GlobeVisualization: Renderer not available to set clear color.");
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("GlobeVisualization: Error setting renderer clear color:", errorMessage);
        setError(`Failed to set globe background color: ${errorMessage}`);
      }
      // No setGlobeReady(true) here, rely on onGlobeReady callback
    } else {
      console.warn("GlobeVisualization: Globe ref is null during useEffect.");
    }
  }, [globeRef, globeBackgroundColor, initialLat, initialLng, initialZoom]);

  if (error) {
    return <div className="text-destructive text-center p-4">{error}</div>;
  }

  // This loading state might show if the component itself is slow to mount or if onGlobeReady is delayed.
  if (!globeReady && typeof window === 'undefined') { // Keep SSR guard
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
      backgroundColor={globeBackgroundColor} // This prop sets the canvas background
      atmosphereColor={atmosphereColor}
      atmosphereAltitude={atmosphereAltitude}
      onGlobeReady={() => {
        console.log("GlobeVisualization: onGlobeReady triggered from react-globe.gl");
        setGlobeReady(true);
        // Ensure renderer color is set again, as Globe.js might override it initially
        if (globeRef.current) {
          try {
            const renderer = globeRef.current.renderer();
            if (renderer) {
              renderer.setClearColor(new THREE.Color(globeBackgroundColor), 1);
              console.log(`GlobeVisualization (onGlobeReady): Renderer clear color re-set to: ${globeBackgroundColor}`);
            }
          } catch (e) {
             console.error("GlobeVisualization (onGlobeReady): Error re-setting renderer clear color:", e);
          }
        }
      }}
      // Removed polygon-specific props:
      // polygonsData, polygonCapColor, polygonSideColor, polygonStrokeColor, polygonAltitude
      {...globeProps} // Pass through other general props
    />
  );
};

const MemoizedGlobeVisualizationInternal = React.memo(GlobeVisualizationInternal);
MemoizedGlobeVisualizationInternal.displayName = 'MemoizedGlobeVisualizationInternal';

// ClientOnlyGlobe wrapper to ensure this component only renders on the client
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

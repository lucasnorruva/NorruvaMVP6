
"use client"; // This component must be client-side

import React, { useEffect, useRef, forwardRef } from 'react';
import Globe, { type GlobeMethods, type GlobeProps as ReactGlobeProps } from 'react-globe.gl';
import { Color } from 'three'; // Import Color from three

// Define the props for our GlobeVisualization component
// Removed polygon-related props
export interface GlobeVisualizationProps extends Omit<ReactGlobeProps, 
  'ref' | 
  'polygonsData' | 
  'polygonCapColor' | 
  'polygonSideColor' | 
  'polygonStrokeColor' | 
  'polygonAltitude' | 
  'onPolygonClick' |
  'onPolygonHover'
> {
  globeRef?: React.Ref<GlobeMethods>;
  backgroundColor?: string; // Allow passing background color for the globe canvas
}

export const GlobeVisualization = forwardRef<GlobeMethods, GlobeVisualizationProps>(
  ({ backgroundColor = '#00000000', ...globeProps }, ref) => {
    const globeEl = useRef<GlobeMethods | undefined>();

    useEffect(() => {
      if (globeEl.current) {
        const globeInstance = globeEl.current;
        // Setup controls
        globeInstance.controls().autoRotate = true;
        globeInstance.controls().autoRotateSpeed = 0.2;
        globeInstance.controls().enableZoom = true;
        globeInstance.controls().minDistance = 150; // Min zoom distance
        globeInstance.controls().maxDistance = 800; // Max zoom distance

        // Explicitly set the renderer's clear color and alpha
        const renderer = globeInstance.renderer();
        if (renderer) {
           // If backgroundColor is 'transparent' or an RGBA with 0 alpha, set clearAlpha to 0. Otherwise, 1.
          const isTransparent = backgroundColor === 'transparent' || backgroundColor === '#00000000' || (backgroundColor.startsWith('rgba') && backgroundColor.endsWith('0)'));
          renderer.setClearColor(new Color(backgroundColor), isTransparent ? 0 : 1);
        }
      }
    }, [backgroundColor]);

    // Combine internal ref with forwarded ref if provided
    useEffect(() => {
        if (typeof ref === 'function') {
          ref(globeEl.current || null);
        } else if (ref) {
          (ref as React.MutableRefObject<GlobeMethods | null>).current = globeEl.current || null;
        }
      }, [ref]);


    // Default Globe settings can be part of globeProps or overridden here
    const defaultGlobeProps: Partial<ReactGlobeProps> = {
      // globeImageUrl is now expected to be passed via globeProps, e.g., earth-political.jpg
      bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
      showAtmosphere: true,
      atmosphereColor: '#4682B4', // A nice steel blue
      atmosphereAltitude: 0.25,
      enablePointerInteraction: true, // Still allow general globe interaction
      animateIn: true,
    };

    return (
      <Globe
        ref={globeEl}
        {...defaultGlobeProps}
        {...globeProps} // User-provided props will override defaults
        // Polygon props are no longer passed here
      />
    );
  }
);

GlobeVisualization.displayName = 'GlobeVisualization';

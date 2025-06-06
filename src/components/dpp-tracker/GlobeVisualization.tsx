
"use client"; // This component must be client-side

import React, { useEffect, useRef, forwardRef } from 'react';
import Globe, { type GlobeMethods, type GlobeProps as ReactGlobeProps } from 'react-globe.gl';
import { Color } from 'three'; // Import Color from three

// Define the props for our GlobeVisualization component
export interface GlobeVisualizationProps extends Omit<ReactGlobeProps, 'ref'> {
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
        // This is important if the parent div has a background color and you want the globe canvas itself to be transparent
        // or a specific color.
        const renderer = globeInstance.renderer();
        if (renderer) {
          renderer.setClearColor(new Color(backgroundColor), backgroundColor === '#00000000' || backgroundColor === 'transparent' ? 0 : 1);
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
      globeImageUrl: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      bumpImageUrl: '//unpkg.com/three-globe/example/img/earth-topology.png',
      showAtmosphere: true,
      atmosphereColor: '#4682B4', // A nice steel blue
      atmosphereAltitude: 0.25,
      enablePointerInteraction: true,
      animateIn: true,
    };

    return (
      <Globe
        ref={globeEl}
        {...defaultGlobeProps}
        {...globeProps} // User-provided props will override defaults
      />
    );
  }
);

GlobeVisualization.displayName = 'GlobeVisualization';

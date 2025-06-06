
"use client"; // This component must be client-side

import React, { useEffect, useRef, forwardRef } from 'react';
import Globe, { type GlobeMethods, type GlobeProps as ReactGlobeProps } from 'react-globe.gl';
import { Color } from 'three';

// Define the props for our GlobeVisualization component
export interface GlobeVisualizationProps extends ReactGlobeProps {
  globeRef?: React.Ref<GlobeMethods>;
  backgroundColor?: string; 
}

export const GlobeVisualization = forwardRef<GlobeMethods, GlobeVisualizationProps>(
  ({ backgroundColor = 'rgba(0,0,0,0)', ...globeProps }, ref) => {
    const globeEl = useRef<GlobeMethods | undefined>();

    useEffect(() => {
      if (globeEl.current) {
        const globeInstance = globeEl.current;
        
        globeInstance.controls().autoRotate = true;
        globeInstance.controls().autoRotateSpeed = 0.15; // Slightly slower for better viewing
        globeInstance.controls().enableZoom = true;
        globeInstance.controls().minDistance = 150; 
        globeInstance.controls().maxDistance = 800; 

        const renderer = globeInstance.renderer();
        if (renderer) {
          const isTransparent = backgroundColor === 'transparent' || backgroundColor === 'rgba(0,0,0,0)' || (backgroundColor.startsWith('rgba') && backgroundColor.endsWith(',0)'));
          renderer.setClearColor(new Color(backgroundColor), isTransparent ? 0 : 1);
        }
      }
    }, [backgroundColor]);

    useEffect(() => {
        if (typeof ref === 'function') {
          ref(globeEl.current || null);
        } else if (ref) {
          (ref as React.MutableRefObject<GlobeMethods | null>).current = globeEl.current || null;
        }
      }, [ref]);

    const defaultGlobeProps: Partial<ReactGlobeProps> = {
      globeImageUrl: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg", // Default texture
      bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
      showAtmosphere: true,
      atmosphereColor: '#4682B4', 
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
```
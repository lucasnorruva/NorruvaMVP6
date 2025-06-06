
"use client"; // This component must be client-side

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Globe, { type GlobeMethods, type GlobeProps as ReactGlobeProps } from 'react-globe.gl';
import { Color } from 'three';

// Define the props for our GlobeVisualization component
export interface GlobeVisualizationProps extends Omit<ReactGlobeProps, 'ref'> {
  globeRef?: React.Ref<GlobeMethods>;
  backgroundColor?: string; 
}

export const GlobeVisualization = forwardRef<GlobeMethods, GlobeVisualizationProps>(
  ({ backgroundColor = 'rgba(0,0,0,0)', globeImageUrl, ...globeProps }, ref) => {
    const internalGlobeEl = useRef<GlobeMethods | undefined>();

    // Expose necessary methods via the ref passed from the parent
    useImperativeHandle(ref, () => internalGlobeEl.current as GlobeMethods, []);

    useEffect(() => {
      if (internalGlobeEl.current) {
        const globeInstance = internalGlobeEl.current;
        
        globeInstance.controls().autoRotate = true;
        globeInstance.controls().autoRotateSpeed = 0.15;
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

    // Handle external ref attachment
     useEffect(() => {
      if (typeof globeProps.globeRef === 'function') {
        (globeProps.globeRef as (instance: GlobeMethods | null) => void)(internalGlobeEl.current || null);
      } else if (globeProps.globeRef) {
        (globeProps.globeRef as React.MutableRefObject<GlobeMethods | null>).current = internalGlobeEl.current || null;
      }
    }, [globeProps.globeRef]);


    const defaultGlobeProps: Partial<ReactGlobeProps> = {
      globeImageUrl: globeImageUrl || "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg", // Default texture
      bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
      showAtmosphere: true,
      atmosphereColor: '#4682B4', 
      atmosphereAltitude: 0.25,
      enablePointerInteraction: true,
      animateIn: true,
    };

    return (
      <Globe
        ref={internalGlobeEl}
        {...defaultGlobeProps}
        {...globeProps} // User-provided props will override defaults
      />
    );
  }
);

GlobeVisualization.displayName = 'GlobeVisualization';

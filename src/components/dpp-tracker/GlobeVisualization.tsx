
"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Globe, { type GlobeMethods, type GlobeProps as ReactGlobeProps } from 'react-globe.gl';
import { Color } from 'three';

// Define the props for our GlobeVisualization component
export interface GlobeVisualizationProps extends Omit<ReactGlobeProps, 'ref'> {
  globeRef?: React.Ref<GlobeMethods>;
  backgroundColor?: string;
  // Add point-related props if they are not already in ReactGlobeProps or need specific typing
  pointsData?: object[];
  pointLat?: string | ((d: any) => number);
  pointLng?: string | ((d: any) => number);
  pointColor?: string | ((d: any) => string);
  pointAltitude?: number | string | ((d: any) => number);
  pointRadius?: number | string | ((d: any) => number);
  onPointClick?: (point: any, event: MouseEvent) => void;
  onPointHover?: (point: any | null, prevPoint: any | null) => void;
}

export const GlobeVisualization = forwardRef<GlobeMethods, GlobeVisualizationProps>(
  ({ backgroundColor = 'rgba(0,0,0,0)', globeImageUrl, ...globeProps }, ref) => {
    const internalGlobeEl = useRef<GlobeMethods | undefined>();

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

    useEffect(() => {
      if (typeof globeProps.globeRef === 'function') {
        (globeProps.globeRef as (instance: GlobeMethods | null) => void)(internalGlobeEl.current || null);
      } else if (globeProps.globeRef) {
        (globeProps.globeRef as React.MutableRefObject<GlobeMethods | null>).current = internalGlobeEl.current || null;
      }
    }, [globeProps.globeRef]);

    const defaultGlobeProps: Partial<ReactGlobeProps> = {
      globeImageUrl: globeImageUrl || "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
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

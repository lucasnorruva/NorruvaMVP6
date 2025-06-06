
"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Globe, { type GlobeMethods, type GlobeProps as ReactGlobeProps } from 'react-globe.gl';
import { Color } from 'three';

// Define the props for our GlobeVisualization component
export interface GlobeVisualizationProps extends Omit<ReactGlobeProps, 'ref'> {
  globeRef?: React.Ref<GlobeMethods>;
  backgroundColor?: string;
  
  // Point-related props
  pointsData?: object[];
  pointLat?: string | ((d: any) => number);
  pointLng?: string | ((d: any) => number);
  pointColor?: string | ((d: any) => string);
  pointAltitude?: number | string | ((d: any) => number);
  pointRadius?: number | string | ((d: any) => number);
  onPointClick?: (point: any, event: MouseEvent) => void;
  onPointHover?: (point: any | null, prevPoint: any | null) => void;

  // Arc-related props
  arcsData?: object[];
  arcStartLat?: string | ((d: any) => number);
  arcStartLng?: string | ((d: any) => number);
  arcEndLat?: string | ((d: any) => number);
  arcEndLng?: string | ((d: any) => number);
  arcColor?: string | ((d: any) => string | string[]);
  arcAltitude?: number | string | ((d: any) => number | null) | null;
  arcAltitudeAutoScale?: number | string | ((d: any) => number);
  arcStroke?: number | string | ((d: any) => number | null) | null;
  arcCurveResolution?: number | string | ((d: any) => number);
  arcCircularResolution?: number | string | ((d: any) => number);
  arcDashLength?: number | string | ((d: any) => number);
  arcDashGap?: number | string | ((d: any) => number);
  arcDashInitialGap?: number | string | ((d: any) => number);
  arcDashAnimateTime?: number | string | ((d: any) => number);
  arcsTransitionDuration?: number;
  arcLabel?: string | ((d: any) => string | null) | null;
  onArcClick?: (arc: any, event: MouseEvent) => void;
  onArcHover?: (arc: any | null, prevArc: any | null) => void;

  // Polygon-related props (re-added from previous versions if needed)
  polygonsData?: object[];
  polygonCapColor?: string | ((d: any) => string);
  polygonSideColor?: string | ((d: any) => string);
  polygonStrokeColor?: string | ((d: any) => string | null) | null;
  polygonAltitude?: number | string | ((d: any) => number);
  onPolygonClick?: (polygon: any, event: MouseEvent) => void;
  polygonsTransitionDuration?: number;
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
        globeInstance.controls().minDistance = 150; // Prevent zooming too close
        globeInstance.controls().maxDistance = 800; // Prevent zooming too far

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
      atmosphereColor: '#4682B4', // Default atmosphere color
      atmosphereAltitude: 0.25,   // Default atmosphere altitude
      enablePointerInteraction: true, // Enable interactions
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

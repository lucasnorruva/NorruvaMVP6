
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import type { GlobeMethods } from 'react-globe.gl'; // Import GlobeMethods type

// Data type interfaces (can be expanded as needed)
export interface PointData { lat: number; lng: number; [key: string]: any; }
export interface ArcData { startLat: number; startLng: number; endLat: number; endLng: number; [key: string]: any; }
export interface PolygonData { features: any[]; [key: string]: any; } // GeoJSON features
export interface CustomLayerData { lat: number; lng: number; [key: string]: any; }


interface GlobeVisualizationProps {
  globeRef?: React.MutableRefObject<GlobeMethods | undefined>; // Use GlobeMethods type
  globeImageUrl?: string;
  globeBackgroundColor?: string;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  
  pointsData?: PointData[];
  pointColor?: string | ((point: PointData) => string);
  pointRadius?: number | ((point: PointData) => number);
  pointAltitude?: number | ((point: PointData) => number);
  pointLabel?: string | ((point: PointData) => string);
  onPointClick?: (point: PointData, event: MouseEvent) => void;
  onPointHover?: (point: PointData | null, prevPoint: PointData | null) => void;

  arcsData?: ArcData[];
  arcColor?: string | ((arc: ArcData) => string);
  arcDashLength?: number | ((arc: ArcData) => number);
  arcDashGap?: number | ((arc: ArcData) => number);
  arcDashAnimateTime?: number | ((arc: ArcData) => number);
  arcStroke?: number | ((arc: ArcData) => number);
  onArcClick?: (arc: ArcData, event: MouseEvent) => void;
  onArcHover?: (arc: ArcData | null, prevArc: ArcData | null) => void;

  polygonsData?: any[]; // GeoJSON features array
  polygonCapColor?: string | ((polygon: any) => string);
  polygonSideColor?: string | ((polygon: any) => string);
  polygonStrokeColor?: string | ((polygon: any) => string);
  polygonAltitude?: number | ((polygon: any) => number);
  onPolygonClick?: (polygon: any, event: MouseEvent) => void;
  onPolygonHover?: (polygon: any | null, prevPolygon: any | null) => void;

  customLayerData?: CustomLayerData[];
  customThreeObject?: (data: CustomLayerData) => THREE.Object3D;
  customThreeObjectUpdate?: (obj: THREE.Object3D, data: CustomLayerData) => void;
  onCustomLayerClick?: (data: CustomLayerData, event: MouseEvent) => void;
  onCustomLayerHover?: (data: CustomLayerData | null, prevData: CustomLayerData | null) => void;
}

const GlobeVisualizationInternal: React.FC<GlobeVisualizationProps> = ({
  globeRef: externalGlobeRef,
  globeImageUrl = "//unpkg.com/three-globe/example/img/earth-night.jpg",
  globeBackgroundColor = "#0a0a0a",
  atmosphereColor = "#3a82f6",
  atmosphereAltitude = 0.25,
  pointsData = [],
  pointColor = 'rgba(255,255,255,0.75)',
  pointRadius = 0.25,
  pointAltitude = 0.01,
  pointLabel = 'name',
  onPointClick,
  onPointHover,
  arcsData = [],
  arcColor = 'rgba(255,255,255,0.5)',
  arcDashLength = 0.9,
  arcDashGap = 0.4,
  arcDashAnimateTime = 2000,
  arcStroke = 0.2,
  onArcClick,
  onArcHover,
  polygonsData = [],
  polygonCapColor = 'rgba(0,0,0,0)',
  polygonSideColor = 'rgba(0,0,0,0)',
  polygonStrokeColor = '#ffffff',
  polygonAltitude = 0.005,
  onPolygonClick,
  onPolygonHover,
  customLayerData = [],
  customThreeObject,
  customThreeObjectUpdate,
  onCustomLayerClick,
  onCustomLayerHover,
}) => {
  const internalGlobeRef = useRef<GlobeMethods | undefined>();
  const globeEl = externalGlobeRef || internalGlobeRef;

  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType<any> | null>(null);
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    import('react-globe.gl').then(module => {
      setGlobeComponent(() => module.default);
    }).catch(error => {
      console.error("Failed to load react-globe.gl:", error);
    });
  }, []);

  useEffect(() => {
    if (globeEl.current && GlobeComponent && !globeReady) {
      try {
        console.log("Globe component loaded. Attempting to set globe PoV, controls, and renderer background. BackgroundColor prop:", globeBackgroundColor);
        
        // Explicitly set renderer clear color
        const renderer = globeEl.current.renderer();
        if (renderer) {
          renderer.setClearColor(new THREE.Color(globeBackgroundColor || '#0a0a0a'), 1); 
          console.log("Renderer clear color set to:", globeBackgroundColor || '#0a0a0a');
        } else {
          console.warn("Renderer not available to set clear color.");
        }
        
        globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }); // Initial PoV
        
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false; 
            controls.enableZoom = true;
            controls.zoomSpeed = 0.5;
            controls.rotateSpeed = 0.4;
            controls.minDistance = 150; 
            controls.maxDistance = 500; 
            console.log("Globe controls configured.");
        } else {
            console.warn("Globe controls not available for configuration.");
        }
        setGlobeReady(true);
        console.log("Globe component ready.");
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    }
  }, [GlobeComponent, globeEl, globeReady, globeBackgroundColor]);


  if (!GlobeComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading 3D Globe Library...
      </div>
    );
  }
  
  const globeProps = {
    globeImageUrl: globeImageUrl,
    backgroundColor: 'rgba(0,0,0,0)', // Make the component's own canvas transparent
    atmosphereColor: atmosphereColor,
    atmosphereAltitude: atmosphereAltitude,
    
    pointsData: pointsData,
    pointColor: pointColor,
    pointRadius: pointRadius,
    pointAltitude: pointAltitude,
    pointLabel: pointLabel,
    onPointClick: onPointClick,
    onPointHover: onPointHover,

    arcsData: arcsData,
    arcColor: arcColor,
    arcDashLength: arcDashLength,
    arcDashGap: arcDashGap,
    arcDashAnimateTime: arcDashAnimateTime,
    arcStroke: arcStroke,
    onArcClick: onArcClick,
    onArcHover: onArcHover,

    polygonsData: polygonsData,
    polygonCapColor: polygonCapColor,
    polygonSideColor: polygonSideColor,
    polygonStrokeColor: polygonStrokeColor,
    polygonAltitude: polygonAltitude,
    onPolygonClick: onPolygonClick,
    onPolygonHover: onPolygonHover,

    customLayerData: customLayerData,
    customThreeObject: customThreeObject,
    customThreeObjectUpdate: customThreeObjectUpdate,
    onCustomLayerClick: onCustomLayerClick,
    onCustomLayerHover: onCustomLayerHover,
  };

  return (
    <div className="w-full h-full" style={{ position: 'relative', backgroundColor: globeBackgroundColor /* For the wrapper div */ }}>
      { !globeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-10">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <p>Initializing 3D Globe...</p>
        </div>
      )}
      { GlobeComponent && <GlobeComponent ref={globeEl} {...globeProps} /> }
    </div>
  );
};

export default React.memo(GlobeVisualizationInternal);

    
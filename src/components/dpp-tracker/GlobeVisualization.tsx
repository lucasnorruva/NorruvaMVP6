
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

import type { MockDppPoint, MockArc, MockCustomsCheckpoint, MockShipmentPoint } from '@/app/(app)/dpp-global-tracker/page';


interface GlobeVisualizationProps {
  globeRef?: React.MutableRefObject<any | undefined>;
  pointsData: Array<MockDppPoint | MockShipmentPoint>;
  arcsData: MockArc[];
  polygonsData: any[];
  customsCheckpointsData: MockCustomsCheckpoint[];
  onPointClick: (point: MockDppPoint | MockShipmentPoint) => void;
  onArcClick: (arc: MockArc) => void;
  onCheckpointClick: (checkpoint: MockCustomsCheckpoint) => void;
  pointColorAccessor: (point: MockDppPoint | MockShipmentPoint) => string;
  pointRadiusAccessor: (point: MockDppPoint | MockShipmentPoint) => number;
  arcColorAccessor: (arc: MockArc) => string | string[];
  arcStrokeAccessor: (arc: MockArc) => number;
  polygonCapColorAccessor: (feature: any) => string;
  polygonSideColorAccessor: (feature: any) => string;
  polygonStrokeColorAccessor: (feature: any) => string;
  polygonAltitudeAccessor: (feature: any) => number; 
  globeBackgroundColor: string; 
  atmosphereColor: string;
  atmosphereAltitude: number;
}

const GlobeVisualizationInternal: React.FC<GlobeVisualizationProps> = ({
  globeRef: externalGlobeRef,
  pointsData,
  arcsData,
  polygonsData,
  customsCheckpointsData,
  onPointClick,
  onArcClick,
  onCheckpointClick,
  pointColorAccessor,
  pointRadiusAccessor,
  arcColorAccessor,
  arcStrokeAccessor,
  polygonCapColorAccessor,
  polygonSideColorAccessor,
  polygonStrokeColorAccessor,
  polygonAltitudeAccessor,
  globeBackgroundColor, // This prop is passed but its direct effect might be overridden by renderer clearColor below
  atmosphereColor,
  atmosphereAltitude,
}) => {
  const internalGlobeRef = useRef<any | undefined>();
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
        // Force a dark background for the renderer if the yellow persists
        const renderer = globeEl.current.renderer(); // Access the Three.js renderer
        if (renderer) {
          renderer.setClearColor(new THREE.Color(globeBackgroundColor || '#0a0a0a'), 1); // Use prop or default dark
        }
        
        globeEl.current.pointOfView({ lat: 45, lng: 10, altitude: 2.5 }); 
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false; 
            controls.enableZoom = true;
            controls.zoomSpeed = 0.5; // Adjusted from master prompt (0.7 was a bit fast)
            controls.rotateSpeed = 0.4;
            controls.minDistance = 150; 
            controls.maxDistance = 500; // Max zoom out
        }
        setGlobeReady(true); 
        console.log("Globe component ready and configured with explicit dark background for renderer.");
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    }
  }, [GlobeComponent, globeEl, globeReady, globeBackgroundColor]);

  const checkpointColorLogic = (cp: MockCustomsCheckpoint) => {
    if (cp.dppComplianceHealth === 'good') return 'rgba(76, 175, 80, 0.9)';
    if (cp.dppComplianceHealth === 'fair') return 'rgba(255, 235, 59, 0.9)';
    if (cp.dppComplianceHealth === 'poor') return 'rgba(244, 67, 54, 0.9)';
    if (cp.type === 'port') return 'rgba(60, 70, 180, 0.9)';
    if (cp.type === 'airport') return 'rgba(100, 60, 170, 0.9)';
    if (cp.type === 'land_border') return 'rgba(200, 100, 30, 0.9)';
    return 'rgba(128, 128, 128, 0.7)';
  };

  const checkpointThreeObjects = useMemo(() => {
    return customsCheckpointsData.map(cp => {
        const spriteMaterial = new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(
            getIconCanvas(
                cp.type === 'port' ? 'S' : cp.type === 'airport' ? 'A' : 'L', 
                new THREE.Color(checkpointColorLogic(cp))
            )
          ),
          depthWrite: false,
          depthTest: false,
          transparent: true,
          sizeAttenuation: false, 
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(10, 10, 1); 
        (sprite as any).checkpointData = cp; 
        return sprite;
    });
  }, [customsCheckpointsData]);


  if (!GlobeComponent) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">Loading Globe Library...</div>;
  }
  
  const globeProps = {
    backgroundColor: globeBackgroundColor, // Passed for canvas element style
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg", // For blue oceans and base texture
    atmosphereColor: atmosphereColor,
    atmosphereAltitude: atmosphereAltitude,

    pointsData: pointsData,
    pointLabel: (d: any) => d.name,
    pointColor: pointColorAccessor,
    pointRadius: pointRadiusAccessor,
    pointAltitude: (d: MockDppPoint | MockShipmentPoint) => ('simulatedStatus' in d ? 0.03 : 0.02),
    onPointClick: onPointClick,

    arcsData: arcsData,
    arcLabel: (d: MockArc) => d.label,
    arcColor: arcColorAccessor,
    arcDashLength: 0.9,
    arcDashGap: 0.4,
    arcDashAnimateTime: (d: MockArc) => (d.value ? 20000 / d.value + 500 : 5000),
    arcStroke: arcStrokeAccessor,
    onArcClick: onArcClick,
    
    polygonsData: polygonsData,
    polygonCapColor: polygonCapColorAccessor,
    polygonSideColor: polygonSideColorAccessor,
    polygonStrokeColor: polygonStrokeColorAccessor,
    polygonAltitude: polygonAltitudeAccessor,
    
    customLayerData: checkpointThreeObjects,
    customThreeObject: (obj: any) => obj, 
    customThreeObjectUpdate: (obj: THREE.Sprite, d: any, globeRadius: number) => {
        const alt = 0.035; 
        const R = globeRadius;
        // Check if checkpointData exists and has lat/lng
        if (!obj || !(obj as any).checkpointData || typeof (obj as any).checkpointData.lat !== 'number' || typeof (obj as any).checkpointData.lng !== 'number') {
             // console.warn("Skipping sprite update due to missing data:", obj);
             return false; // Skip update if data is missing
        }
        const { lat, lng } = (obj as any).checkpointData;
        
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (180 - lng) * Math.PI / 180;
        
        obj.position.set(
            R * Math.sin(phi) * Math.cos(theta) * (1 + alt),
            R * Math.cos(phi) * (1 + alt),
            R * Math.sin(phi) * Math.sin(theta) * (1 + alt)
        );
        return true;
    },
    onCustomLayerClick: (obj: any) => {
        if (obj && (obj as any).checkpointData) {
            onCheckpointClick((obj as any).checkpointData);
        }
    },
  };

  return (
    <div className="w-full h-full" style={{ position: 'relative', backgroundColor: globeBackgroundColor }}>
      { GlobeComponent && <GlobeComponent ref={globeEl} {...globeProps} /> }
      {!globeReady && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white"><p>Initializing Globe...</p></div>}
    </div>
  );
};


// Helper function to create canvas for icon sprite
const getIconCanvas = (char: string, color: THREE.Color, size = 64): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) {
    console.error("Failed to get 2D context for icon canvas");
    return canvas; 
  }

  context.beginPath();
  context.arc(size / 2, size / 2, size / 2.2, 0, 2 * Math.PI, false);
  context.fillStyle = color.getStyle(); 
  context.fill();
  context.lineWidth = size / 16;
  context.strokeStyle = 'rgba(255, 255, 255, 0.8)'; 
  context.stroke();

  context.font = `bold ${size / 1.8}px Arial`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#FFFFFF'; 
  context.fillText(char, size / 2, size / 2 + size / 20); 

  return canvas;
};

export default React.memo(GlobeVisualizationInternal);

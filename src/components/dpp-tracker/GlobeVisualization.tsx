
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
  polygonAltitudeAccessor: (feature: any) => number; // Added altitude accessor for polygons
  globeBackgroundColor: string; 
  atmosphereColor: string;
  atmosphereAltitude: number;
  // globeImageUrl is now hardcoded as per the prompt for blue marble.
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
  globeBackgroundColor,
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
        globeEl.current.pointOfView({ lat: 45, lng: 10, altitude: 2.5 }); // Initial broader view
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false; 
            controls.enableZoom = true;
            controls.zoomSpeed = 0.7;
            controls.rotateSpeed = 0.4;
            controls.minDistance = 120; // Allows closer zoom
            controls.maxDistance = 1000; // Prevents zooming out too far
        }
        setGlobeReady(true); 
        console.log("Globe component ready and configured.");
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    }
  }, [GlobeComponent, globeEl, globeReady]);

  const checkpointColorLogic = (cp: MockCustomsCheckpoint) => {
    if (cp.dppComplianceHealth === 'good') return 'rgba(76, 175, 80, 0.9)'; // DPP_HEALTH_GOOD_COLOR
    if (cp.dppComplianceHealth === 'fair') return 'rgba(255, 235, 59, 0.9)'; // DPP_HEALTH_FAIR_COLOR
    if (cp.dppComplianceHealth === 'poor') return 'rgba(244, 67, 54, 0.9)'; // DPP_HEALTH_POOR_COLOR
    // Fallback to type color if health is unknown
    if (cp.type === 'port') return 'rgba(60, 70, 180, 0.9)'; // CHECKPOINT_PORT_COLOR
    if (cp.type === 'airport') return 'rgba(100, 60, 170, 0.9)'; // CHECKPOINT_AIRPORT_COLOR
    if (cp.type === 'land_border') return 'rgba(200, 100, 30, 0.9)'; // CHECKPOINT_LAND_BORDER_COLOR
    return 'rgba(128, 128, 128, 0.7)'; // Default grey
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
        sprite.scale.set(10, 10, 1); // Adjust scale as needed
        (sprite as any).checkpointData = cp; // Attach data for click handling
        return sprite;
    });
  }, [customsCheckpointsData]);


  if (!GlobeComponent) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">Loading Globe Library...</div>;
  }
  
  const globeProps = {
    backgroundColor: globeBackgroundColor,
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
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
    arcDashAnimateTime: (d: MockArc) => (d.value ? 20000 / d.value + 500 : 5000), // Slower for higher value (more volume)
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
        // This function is a bit of a guess for Sprite positioning based on lat/lng
        // three-globe typically handles the projection for its own layers.
        // For custom objects, you might need more direct projection logic or use a helper.
        // For now, let's assume it might need an update or check if it's doing what is expected.
        // If sprites are not appearing, this is a key area to debug.
        // It's possible that without explicit position updates here for sprites,
        // they might not render correctly or stay at the origin.
        
        // This is a simplified approach; actual projection is more complex.
        // `three-globe` provides `getCoords` for this but it's internal.
        // We might need to rely on the default behavior if we pass lat/lng in the data `d`
        // and if `customLayerData` items are expected to have lat/lng for automatic positioning.
        // For sprites, often their position is set directly on the sprite object.
        // Since `customLayerData` is just an array of `THREE.Sprite` objects,
        // their initial positions would need to be set when they are created,
        // potentially using a method to convert lat/lng to 3D coordinates on the sphere.

        // The example from three-globe with custom objects usually does something like:
        // const [x, y, z] = globe.getCoords(d.lat, d.lng, d.alt * globe.getGlobeRadius());
        // obj.position.set(x, y, z);
        // But `getCoords` is not directly exposed on the react-globe.gl ref.
        
        // Let's assume for now that if a sprite is in customLayerData and its data object
        // (attached as checkpointData) has lat/lng, react-globe.gl MIGHT handle it.
        // If not, this needs to be revisited with a proper projection method.
        // Setting altitude if available in the data.
        const alt = 0.035; // Checkpoints slightly above shipments
        const R = globeRadius;
        const { lat, lng } = (obj as any).checkpointData; // Assuming data is attached
        
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
    return canvas; // Return empty canvas on error
  }

  // Draw circle
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2.2, 0, 2 * Math.PI, false);
  context.fillStyle = color.getStyle(); // Use THREE.Color's getStyle()
  context.fill();
  context.lineWidth = size / 16;
  context.strokeStyle = 'rgba(255, 255, 255, 0.8)'; // Whiteish border for circle
  context.stroke();

  // Draw character
  context.font = `bold ${size / 1.8}px Arial`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#FFFFFF'; // White character
  context.fillText(char, size / 2, size / 2 + size / 20); // Slight offset for better centering

  return canvas;
};

export default React.memo(GlobeVisualizationInternal);


    
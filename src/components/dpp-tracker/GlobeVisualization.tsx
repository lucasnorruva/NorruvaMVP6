
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { MapPin, Ship, Plane, Building2 as LandBorderIcon } from 'lucide-react';
import {
    DPP_HEALTH_GOOD_COLOR,
    DPP_HEALTH_FAIR_COLOR,
    DPP_HEALTH_POOR_COLOR,
    CHECKPOINT_PORT_COLOR,
    CHECKPOINT_AIRPORT_COLOR,
    CHECKPOINT_LAND_BORDER_COLOR
} from '@/app/(app)/dpp-global-tracker/page';
import type { MockDppPoint, MockArc, MockCustomsCheckpoint, MockShipmentPoint } from '@/app/(app)/dpp-global-tracker/page';


// Convert RGBA strings to THREE.Color instances
const DPP_HEALTH_GOOD_THREE_COLOR = new THREE.Color(DPP_HEALTH_GOOD_COLOR.replace('rgba(', 'rgb(').slice(0, -4) + ')');
const DPP_HEALTH_FAIR_THREE_COLOR = new THREE.Color(DPP_HEALTH_FAIR_COLOR.replace('rgba(', 'rgb(').slice(0, -4) + ')');
const DPP_HEALTH_POOR_THREE_COLOR = new THREE.Color(DPP_HEALTH_POOR_COLOR.replace('rgba(', 'rgb(').slice(0, -4) + ')');
const CHECKPOINT_PORT_THREE_COLOR = new THREE.Color(CHECKPOINT_PORT_COLOR.replace('rgba(', 'rgb(').slice(0, -4) + ')');
const CHECKPOINT_AIRPORT_THREE_COLOR = new THREE.Color(CHECKPOINT_AIRPORT_COLOR.replace('rgba(', 'rgb(').slice(0, -4) + ')');
const CHECKPOINT_LAND_BORDER_THREE_COLOR = new THREE.Color(CHECKPOINT_LAND_BORDER_COLOR.replace('rgba(', 'rgb(').slice(0, -4) + ')');
const GREY_THREE_COLOR = new THREE.Color('grey');


const getIconCanvas = (IconComponent: React.ElementType, color: THREE.Color, size = 64): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2.5, 0, 2 * Math.PI, false); 
    ctx.fillStyle = `#${color.getHexString()}`; 
    ctx.fill();
    
    ctx.font = `${size / 2.2}px sans-serif`; 
    ctx.fillStyle = 'white'; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let char = '?';
    if (IconComponent === Ship) char = 'S';
    else if (IconComponent === Plane) char = 'A';
    else if (IconComponent === LandBorderIcon) char = 'L'; 
    else if (IconComponent === MapPin) char = 'M'; 

    ctx.fillText(char, size / 2, size / 2 + 2); 
  }
  return canvas;
};


interface GlobeVisualizationProps {
  pointsData: Array<MockDppPoint | MockShipmentPoint>; // Updated to accept union type
  arcsData: MockArc[];
  labelsData: any[]; 
  polygonsData: any[];
  customsCheckpointsData: MockCustomsCheckpoint[];
  onPointClick: (point: MockDppPoint | MockShipmentPoint) => void; // Updated
  onArcClick: (arc: MockArc) => void;
  onCheckpointClick: (checkpoint: MockCustomsCheckpoint) => void;
  pointColorAccessor: (point: MockDppPoint | MockShipmentPoint) => string; // Updated
  pointRadiusAccessor: (point: MockDppPoint | MockShipmentPoint) => number; // Updated
  arcColorAccessor: (arc: MockArc) => string | string[];
  arcStrokeAccessor: (arc: MockArc) => number;
  polygonCapColorAccessor: (feature: any) => string;
  polygonSideColorAccessor: (feature: any) => string;
  polygonStrokeColorAccessor: (feature: any) => string;
  globeBackgroundColor: string; 
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  pointsData,
  arcsData,
  labelsData,
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
  globeBackgroundColor
}) => {
  const globeEl = useRef<any | undefined>();
  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('react-globe.gl').then(module => {
      setGlobeComponent(() => module.default);
    }).catch(error => {
      console.error("Failed to load react-globe.gl:", error);
    });
  }, []);
  

  useEffect(() => {
    if (globeEl.current && GlobeComponent) { 
      try {
        globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.2 }); 
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false;
            controls.enableZoom = true;
            controls.minDistance = 50; 
            controls.maxDistance = 1500;
        }
      } catch (e) {
        console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    }
  }, [GlobeComponent]); 

  const checkpointPrimaryColorLogic = (checkpoint: MockCustomsCheckpoint): THREE.Color => {
    switch (checkpoint.dppComplianceHealth) {
      case 'good': return DPP_HEALTH_GOOD_THREE_COLOR;
      case 'fair': return DPP_HEALTH_FAIR_THREE_COLOR;
      case 'poor': return DPP_HEALTH_POOR_THREE_COLOR;
      case 'unknown':
      default: 
        if (checkpoint.type === 'port') return CHECKPOINT_PORT_THREE_COLOR;
        if (checkpoint.type === 'airport') return CHECKPOINT_AIRPORT_THREE_COLOR;
        if (checkpoint.type === 'land_border') return CHECKPOINT_LAND_BORDER_THREE_COLOR;
        return GREY_THREE_COLOR; 
    }
  };

  const checkpointSprites = useMemo(() => {
    return customsCheckpointsData.map(cp => {
      const color = checkpointPrimaryColorLogic(cp);
      let IconComp = MapPin; 
      if (cp.type === 'port') IconComp = Ship;
      else if (cp.type === 'airport') IconComp = Plane;
      else if (cp.type === 'land_border') IconComp = LandBorderIcon; 
      
      const canvas = getIconCanvas(IconComp, color, 32); 
      const map = new THREE.CanvasTexture(canvas);
      map.needsUpdate = true; 
      const material = new THREE.SpriteMaterial({ map: map, depthTest: false, transparent: true, sizeAttenuation: false });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(8, 8, 1);
      
      (sprite as any).checkpointData = cp; 
      return sprite;
    });
  }, [customsCheckpointsData]);


  if (!GlobeComponent) {
    return <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">Loading Globe Library...</div>;
  }

  const globeProps = {
    backgroundColor: globeBackgroundColor, 
    globeImageUrl: undefined, 

    pointsData: pointsData, // This now includes product locations and shipment dots
    pointLabel: 'name',
    pointColor: pointColorAccessor,
    pointRadius: pointRadiusAccessor,
    pointAltitude: (d: MockDppPoint | MockShipmentPoint) => ('direction' in d && d.direction) ? 0.025 : 0.02, // Slightly different altitude for shipments
    onPointClick: onPointClick, // Parent handles differentiation
    
    arcsData: arcsData,
    arcLabel: 'label',
    arcColor: arcColorAccessor,
    arcStroke: arcStrokeAccessor,
    onArcClick: onArcClick,

    polygonsData: polygonsData,
    polygonCapColor: polygonCapColorAccessor,
    polygonSideColor: polygonSideColorAccessor, 
    polygonStrokeColor: polygonStrokeColorAccessor,
    polygonAltitude: 0.005, 
    polygonsTransitionDuration: 0, 

    customLayerData: customsCheckpointsData,
    customThreeObject: (cpData: any) => {
        const cp = cpData as MockCustomsCheckpoint;
        const index = customsCheckpointsData.findIndex(item => item.id === cp.id);
        if (index !== -1 && checkpointSprites[index]) {
          return checkpointSprites[index];
        }
        const fallbackMaterial = new THREE.SpriteMaterial({ color: 'purple' });
        const sprite = new THREE.Sprite(fallbackMaterial);
        sprite.scale.set(5, 5, 1); 
        (sprite as any).checkpointData = cp; 
        return sprite;
    },
    customThreeObjectUpdate: (obj: any, cpData: any) => {
        if(globeEl.current){
            Object.assign(obj.position, globeEl.current.getCoords(cpData.lat, cpData.lng, 0.03));
        }
    },
    onCustomLayerClick: (obj: any, event: MouseEvent, { lat, lng, altitude }: { lat: number; lng: number; altitude: number; }) => {
        if (obj && (obj as any).checkpointData) {
          onCheckpointClick((obj as any).checkpointData);
        }
    },
  };
  
  return (
    <div className="w-full h-full" style={{ position: 'relative', zIndex: 20 }}>
      <GlobeComponent ref={globeEl} {...globeProps} />
    </div>
  );
};

export default GlobeVisualization;

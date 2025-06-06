
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

const convertRgbaToRgbForThree = (rgbaString: string): string => {
  if (typeof rgbaString !== 'string' || !rgbaString.startsWith('rgba(')) {
    return 'rgb(128,128,128)'; 
  }
  const firstParen = rgbaString.indexOf('(');
  const lastComma = rgbaString.lastIndexOf(',');
  if (firstParen === -1 || lastComma === -1 || lastComma < firstParen) {
    return 'rgb(128,128,128)'; 
  }
  const rgbValues = rgbaString.substring(firstParen + 1, lastComma);
  return `rgb(${rgbValues})`;
};

const DPP_HEALTH_GOOD_THREE_COLOR = new THREE.Color(convertRgbaToRgbForThree(DPP_HEALTH_GOOD_COLOR));
const DPP_HEALTH_FAIR_THREE_COLOR = new THREE.Color(convertRgbaToRgbForThree(DPP_HEALTH_FAIR_COLOR));
const DPP_HEALTH_POOR_THREE_COLOR = new THREE.Color(convertRgbaToRgbForThree(DPP_HEALTH_POOR_COLOR));
const CHECKPOINT_PORT_THREE_COLOR = new THREE.Color(convertRgbaToRgbForThree(CHECKPOINT_PORT_COLOR));
const CHECKPOINT_AIRPORT_THREE_COLOR = new THREE.Color(convertRgbaToRgbForThree(CHECKPOINT_AIRPORT_COLOR));
const CHECKPOINT_LAND_BORDER_THREE_COLOR = new THREE.Color(convertRgbaToRgbForThree(CHECKPOINT_LAND_BORDER_COLOR));
const GREY_THREE_COLOR = new THREE.Color('rgb(128,128,128)');


const getIconCanvas = (IconComponent: React.ElementType, color: THREE.Color, size = 64): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2.5, 0, 2 * Math.PI, false);
    
    if (color && typeof color.getHexString === 'function') {
      ctx.fillStyle = `#${color.getHexString()}`;
    } else {
      ctx.fillStyle = '#808080'; 
    }
    ctx.fill();

    ctx.font = `bold ${size / 2.2}px sans-serif`; 
    ctx.fillStyle = 'white'; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let char = '?'; 
    if (IconComponent === Ship) char = 'S';
    else if (IconComponent === Plane) char = 'A';
    else if (IconComponent === LandBorderIcon) char = 'L';
    else if (IconComponent === MapPin) char = 'M'; 

    ctx.fillText(char, size / 2, size / 2 + (size/32)); 
  }
  return canvas;
};


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
  globeBackgroundColor: string;
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
  globeBackgroundColor
}) => {
  const internalGlobeRef = useRef<any | undefined>(); 
  const globeEl = externalGlobeRef || internalGlobeRef; 

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
        // Setting initial PoV slightly higher to see more of the globe
        globeEl.current.pointOfView({ lat: 45, lng: 10, altitude: 2.5 }); 
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = false;
            controls.enableZoom = true;
            controls.minDistance = 50; 
            controls.maxDistance = 1500; 
        }
      } catch (e) {
        // console.error("GlobeVisualization: Error configuring globe controls or POV", e);
      }
    }
  }, [GlobeComponent, globeEl]);

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
    if (!customsCheckpointsData) return [];
    return customsCheckpointsData.map(cp => {
      const color = checkpointPrimaryColorLogic(cp);
      let IconComp = MapPin; 
      if (cp.icon) { 
        IconComp = cp.icon;
      } else if (cp.type === 'port') IconComp = Ship;
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

    pointsData: pointsData,
    pointLabel: (d: MockDppPoint | MockShipmentPoint) => d.name, // Ensure label uses 'name'
    pointColor: pointColorAccessor,
    pointRadius: pointRadiusAccessor,
    pointAltitude: (d: MockDppPoint | MockShipmentPoint) => ('simulatedStatus' in d) ? 0.03 : 0.02, // Slightly higher altitude for shipment points
    onPointClick: onPointClick,

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
            Object.assign(obj.position, globeEl.current.getCoords(cpData.lat, cpData.lng, 0.035)); // Slightly higher altitude for checkpoint sprites
        }
    },
    onCustomLayerClick: (obj: any, event: MouseEvent) => { 
        if (obj && (obj as any).checkpointData) {
          onCheckpointClick((obj as any).checkpointData);
        }
    },
  };

  return (
    <div className="w-full h-full" style={{ position: 'relative' }}>
      { GlobeComponent && <GlobeComponent ref={globeEl} {...globeProps} /> }
    </div>
  );
};

export default GlobeVisualizationInternal;

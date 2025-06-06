
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { MapPin, Ship, Plane, Building2 } from 'lucide-react'; // Using Building2 for land border

interface MockDppPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  size: number;
  category: 'Manufacturing Site' | 'Distribution Hub' | 'Retail Outlet' | 'Recycling Facility' | 'Raw Material Source' | 'Electronics' | 'Appliances' | 'Textiles';
  status: 'compliant' | 'pending' | 'issue' | 'unknown';
  timestamp: number;
  manufacturer?: string;
  gtin?: string;
  complianceSummary?: string;
  color?: string;
  icon?: React.ElementType;
}

interface MockArc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string | string[];
  label?: string;
  stroke?: number;
  timestamp: number;
  transportMode?: 'sea' | 'air' | 'road' | 'rail';
  productId?: string;
}

interface MockCustomsCheckpoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'port' | 'airport' | 'land_border';
  currentShipmentCount: number;
  overallCustomsStatus: 'cleared' | 'pending' | 'inspection_required' | 'operational';
  dppComplianceHealth: 'good' | 'fair' | 'poor' | 'unknown';
  icon?: React.ElementType;
}

// Define colors for customs statuses
const CHECKPOINT_CLEARED_COLOR_THREE = new THREE.Color(0x4caf50); // Green
const CHECKPOINT_PENDING_COLOR_THREE = new THREE.Color(0xffeb3b); // Yellow
const CHECKPOINT_INSPECTION_COLOR_THREE = new THREE.Color(0xf44336); // Red
const CHECKPOINT_PORT_COLOR_THREE = new THREE.Color(0x3c46b4); // Blueish (from CHECKPOINT_PORT_COLOR)
const CHECKPOINT_AIRPORT_COLOR_THREE = new THREE.Color(0x643caA); // Purplish (from CHECKPOINT_AIRPORT_COLOR)


const getIconCanvas = (IconComponent: React.ElementType, color: THREE.Color, size = 64): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // For lucide icons, they are typically rendered as SVG strings.
    // This is a simplified way to draw; a proper SVG renderer might be needed for complex icons.
    // Or, if lucide-react gives direct access to SVG paths, one could use those.
    // For simplicity, we'll just draw a colored circle as a placeholder if direct SVG rendering is complex.
    
    // Fallback to a colored circle if direct SVG path rendering is too complex here
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2.5, 0, 2 * Math.PI, false);
    ctx.fillStyle = `#${color.getHexString()}`;
    ctx.fill();
    
    // Text as a placeholder for the icon itself, if direct SVG rendering isn't straightforward.
    ctx.font = `${size / 2}px sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // This part is tricky, as IconComponent is a React component.
    // A more robust solution would involve rendering the React component to an SVG string, then to canvas.
    // For now, we'll use a simple initial from the icon name or a placeholder.
    const iconName = IconComponent.displayName || IconComponent.name || "CP";
    ctx.fillText(iconName.substring(0,1) || "?", size / 2, size / 2);
  }
  return canvas;
};

const createTextSprite = (text: string, color = 'white', fontSize = 10, background = 'rgba(0,0,0,0.25)') => {
  const textMesh = new Text();
  textMesh.text = text;
  textMesh.fontSize = fontSize;
  textMesh.color = new THREE.Color(color);
  textMesh.anchorX = 'center';
  textMesh.anchorY = 'middle';
  // Add a simple background plane for better readability
  // This is a more advanced troika-three-text feature, or you can create a separate plane
  textMesh.sync(); // Important to get dimensions
  return textMesh;
};


interface GlobeVisualizationProps {
  pointsData: MockDppPoint[];
  arcsData: MockArc[];
  labelsData: any[]; 
  polygonsData: any[];
  customsCheckpointsData: MockCustomsCheckpoint[];
  onPointClick: (point: MockDppPoint) => void;
  onArcClick: (arc: MockArc) => void;
  onCheckpointClick: (checkpoint: MockCustomsCheckpoint) => void;
  pointColorAccessor: (point: MockDppPoint) => string;
  pointRadiusAccessor: (point: MockDppPoint) => number;
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

  const checkpointColorLogic = (checkpoint: MockCustomsCheckpoint): THREE.Color => {
    switch (checkpoint.overallCustomsStatus) {
      case 'cleared': return CHECKPOINT_CLEARED_COLOR_THREE;
      case 'pending': return CHECKPOINT_PENDING_COLOR_THREE;
      case 'inspection_required': return CHECKPOINT_INSPECTION_COLOR_THREE;
      case 'operational':
      default:
        return checkpoint.type === 'port' ? CHECKPOINT_PORT_COLOR_THREE : CHECKPOINT_AIRPORT_COLOR_THREE;
    }
  };

  // Memoize sprite creation logic
  const checkpointSprites = useMemo(() => {
    return customsCheckpointsData.map(cp => {
      const color = checkpointColorLogic(cp);
      let IconComp = MapPin; // Default
      if (cp.type === 'port') IconComp = Ship;
      else if (cp.type === 'airport') IconComp = Plane;
      else if (cp.type === 'land_border') IconComp = Building2;
      
      const canvas = getIconCanvas(IconComp, color, 32); // Smaller icon size
      const map = new THREE.CanvasTexture(canvas);
      map.needsUpdate = true; 
      const material = new THREE.SpriteMaterial({ map: map, depthTest: false, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(6, 6, 1); // Adjust scale as needed
      
      // Attach data to sprite for click handling
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
    pointLabel: 'name',
    pointColor: pointColorAccessor,
    pointRadius: pointRadiusAccessor,
    pointAltitude: 0.02,
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
    customThreeObject: (cpData: any, globeRadius: number) => {
        const cp = cpData as MockCustomsCheckpoint;
        const index = customsCheckpointsData.findIndex(item => item.id === cp.id);
        if (index !== -1 && checkpointSprites[index]) {
          return checkpointSprites[index];
        }
        // Fallback if sprite not found (should not happen if memoized correctly)
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: 'purple' }));
        sprite.scale.set(5, 5, 1);
        return sprite;
    },
    customThreeObjectUpdate: (obj: any, cpData: any, globeRadius: number) => {
        Object.assign(obj.position, globeEl.current.getCoords(cpData.lat, cpData.lng, 0.025 * globeRadius));
    },
    onCustomLayerClick: (obj: any, event: MouseEvent, { lat, lng, altitude }: any) => {
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


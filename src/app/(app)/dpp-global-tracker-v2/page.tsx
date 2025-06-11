
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { GlobeMethods } from 'react-globe.gl';
import type { Feature as GeoJsonFeature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { MeshPhongMaterial } from 'three';
import { Loader2, Info } from 'lucide-react';

// Dynamically import Globe for client-side rendering
const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg text-muted-foreground">Loading Globe...</p>
    </div>
  )
});

// Accurate list of EU member state ISO A3 codes
const EU_COUNTRY_CODES = new Set([
  'AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 
  'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 
  'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE'
]);

// Define properties expected from the TopoJSON file for each country feature
interface CountryProperties extends GeoJsonProperties {
  ADMIN: string; // country name
  ADM0_A3: string; // ISO A3 code
  NAME_LONG?: string; // optional long name
  ISO_A3?: string; // optional ISO code variant
}

// Type for a GeoJSON feature with our custom properties
type CountryFeature = GeoJsonFeature<Geometry, CountryProperties>; // Use aliased GeoJsonFeature

export default function GlobeV2Page() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [landPolygons, setLandPolygons] = useState<CountryFeature[]>([]);
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null); // State for hovered country data
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [countryStats, setCountryStats] = useState<Record<string, number>>({});
  const [maxCount, setMaxCount] = useState(0);

  // Approximate header height (adjust if your header height is different or dynamic)
  const HEADER_HEIGHT = 64; // Example: 4rem = 64px

  // Effect to set initial dimensions and handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth, 
          height: window.innerHeight - HEADER_HEIGHT, 
        });
      }
    };

    updateDimensions(); 
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Effect to fetch country polygon data
  useEffect(() => {
    fetch('/data/ne_110m_admin_0_countries.geojson')
      .then((res) => res.json())
      .then((geoJson: FeatureCollection<Geometry, CountryProperties>) => {
        setLandPolygons(geoJson.features);
      })
      .catch((err) => {
        console.error('Error fetching or processing country polygons:', err);
        setLandPolygons([]);
      })
      .finally(() => {
        setDataLoaded(true);
      });
  }, []);

  // Fetch statistics for DPP counts by country
  useEffect(() => {
    fetch('/api/v1/dpp/country-stats')
      .then((res) => res.json())
      .then((data: Record<string, number>) => {
        setCountryStats(data);
        const counts = Object.values(data);
        setMaxCount(counts.length > 0 ? Math.max(...counts) : 0);
      })
      .catch((err) => {
        console.error('Error fetching country stats:', err);
        setCountryStats({});
        setMaxCount(0);
      });
  }, []);

  // Function to determine if a country is in the EU based on its ISO A3 code
  const isEU = useCallback((isoA3: string | undefined) => {
    return !!isoA3 && EU_COUNTRY_CODES.has(isoA3.toUpperCase());
  }, []);

  const LIGHT_BLUE = '#bfdbff';
  const DARK_BLUE = '#002D62';

  const hexToRgb = (hex: string) => {
    const m = hex.replace('#', '').match(/.{1,2}/g);
    return m ? m.map((x) => parseInt(x, 16)) : [0, 0, 0];
  };

  const rgbToHex = (rgb: number[]) =>
    '#' + rgb.map((x) => x.toString(16).padStart(2, '0')).join('');

  const interpolateColor = (c1: string, c2: string, factor: number) => {
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    const result = rgb1.map((c, i) =>
      Math.round(c + (rgb2[i] - c) * Math.min(Math.max(factor, 0), 1))
    );
    return rgbToHex(result as number[]);
  };

  // Globe material for oceans (light blue)
  const globeMaterial = useMemo(() => new MeshPhongMaterial({
    color: '#a9d5e5', // Light blue for oceans
    transparent: true,
    opacity: 1,
  }), []);

  // Initial globe setup (camera, controls) once the globe is ready
  useEffect(() => {
    if (globeEl.current && globeReady) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3; // Slow rotation
        controls.enableZoom = true;    
        controls.minDistance = 150;   
        controls.maxDistance = 1000;  
      }
      // Adjusted initial camera position to better focus on Europe, slightly more zoomed in
      globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
    }
  }, [globeReady]);
  
  // Memoized polygon cap color logic for performance
  const getPolygonCapColor = useCallback(
    (feat: object) => {
      const properties = (feat as CountryFeature).properties;
      const iso = properties?.ADM0_A3 || properties?.ISO_A3;
      if (isEU(iso)) {
        const count = countryStats[iso ?? ''] ?? 0;
        const intensity = maxCount > 0 ? count / maxCount : 0;
        return interpolateColor(LIGHT_BLUE, DARK_BLUE, intensity);
      }
      return '#CCCCCC';
    },
    [isEU, countryStats, maxCount]
  );

  // Show loader if dimensions are not set or data is not loaded yet
  if (dimensions.width === 0 || dimensions.height === 0 || !dataLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-var(--header-height,4rem))] w-full bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Preparing Global Tracker...</p>
      </div>
    );
  }

  return (
    <div
      style={{ width: '100%', height: `calc(100vh - ${HEADER_HEIGHT}px)`, position: 'relative', background: 'white' }}
      onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setHoverD(null)}
    >
      {typeof window !== 'undefined' && dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeEl}
          globeImageUrl={null}
          globeMaterial={globeMaterial}
          backgroundColor="rgba(255, 255, 255, 1)" 
          showAtmosphere={false} 
          polygonsData={landPolygons}
          polygonCapColor={getPolygonCapColor} 
          polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'} 
          polygonStrokeColor={() => '#000000'} // Black borders
          polygonAltitude={0.008}
          onPolygonHover={setHoverD as (feature: object | null) => void}
          polygonsTransitionDuration={100}
          width={dimensions.width}
          height={dimensions.height}
          onGlobeReady={() => setGlobeReady(true)}
          enablePointerInteraction={true}
        />
      )}
      {hoverD && (
        <div
          className="fixed z-20 pointer-events-none bg-black/70 text-white text-xs px-2 py-1 rounded"
          style={{ top: tooltipPos.y + 10, left: tooltipPos.x + 10 }}
        >
          {hoverD.properties.ADMIN}
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-black/60 text-white rounded-lg backdrop-blur-sm shadow-lg text-center text-xs md:text-sm max-w-[90%] md:max-w-md">
        <Info className="inline h-4 w-4 mr-1.5 align-middle text-blue-300" />
        DPP Global Tracker v2. EU countries in dark blue. Hover for country names.
      </div>
      <div className="absolute bottom-4 right-4 p-2 bg-black/60 text-white rounded-lg backdrop-blur-sm shadow-lg flex items-center text-xs">
        <span className="mr-2">Fewer</span>
        <div className="h-2 w-16 bg-gradient-to-r from-[#bfdbff] to-[#002D62] mx-1 rounded-sm" />
        <span className="ml-2">More</span>
      </div>
    </div>
  );
}

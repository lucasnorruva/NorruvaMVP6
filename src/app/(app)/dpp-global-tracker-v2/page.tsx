
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { GlobeMethods } from 'react-globe.gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For potential future info display
import { feature } from 'topojson-client';
import type { Objects, Topology } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { MeshPhongMaterial } from 'three'; // Import for custom globe material
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

// List of EU country ISO A3 codes (adjust as needed for accuracy)
// This list represents EU member states as of a certain point in time.
const EU_COUNTRY_CODES = new Set([
  'AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 
  'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 
  'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE'
]);

// Define properties expected from the TopoJSON file for each country feature
interface CountryProperties extends GeoJsonProperties {
  NAME: string; 
  NAME_LONG: string; 
  ISO_A3: string; 
  // Add other properties if your TopoJSON file has more that you might use
}

// Type for a GeoJSON feature with our custom properties
type CountryFeature = Feature<Geometry, CountryProperties>;

export default function GlobeV2Page() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [landPolygons, setLandPolygons] = useState<CountryFeature[]>([]);
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Approximate header height (adjust if your header height is different or dynamic)
  const HEADER_HEIGHT = 64; // 4rem = 64px

  // Effect to set initial dimensions and handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth, // Globe will be inside a padded main, so this will be effectively content width
          height: window.innerHeight - HEADER_HEIGHT, 
        });
      }
    };

    updateDimensions(); // Set initial dimensions
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Effect to fetch country polygon data
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then((atlas: Topology) => {
        const countries = atlas.objects.countries;
        if (countries) {
          // Convert TopoJSON to GeoJSON features
          const geoJsonCountries = feature(atlas, countries) as FeatureCollection<Geometry, CountryProperties>;
          setLandPolygons(geoJsonCountries.features);
        } else {
          console.error("Countries object not found in topology data.");
          setLandPolygons([]);
        }
      })
      .catch(err => {
        console.error("Error fetching or processing country polygons:", err);
        setLandPolygons([]);
      })
      .finally(() => {
        setDataLoaded(true);
      });
  }, []);

  // Function to determine if a country is in the EU based on its ISO A3 code
  const isEU = useCallback((isoA3: string | undefined) => {
    return !!isoA3 && EU_COUNTRY_CODES.has(isoA3.toUpperCase());
  }, []);

  // Globe material for oceans (light blue)
  const globeMaterial = useMemo(() => new MeshPhongMaterial({
    color: '#a9d5e5', // Light blue for oceans, as per user guidance image
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
        controls.enableZoom = true;    // Allow zooming
        controls.minDistance = 150;   // Prevent zooming too close
        controls.maxDistance = 1000;   // Prevent zooming too far out
      }
      // Set initial camera position (latitude, longitude, altitude)
      // Altitude 2.5 for a reasonably zoomed-out view
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
    }
  }, [globeReady]);
  
  // Memoized polygon cap color logic for performance
  const getPolygonCapColor = useCallback((feat: object) => {
    const properties = (feat as CountryFeature).properties;
    // EU countries: dark blue, others: light grey
    return isEU(properties?.ISO_A3) ? '#002D62' : '#CCCCCC'; 
  }, [isEU]);

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
    // The parent div for the globe, styled to fill the available content area
    // The page's root div should be styled to take up viewport height minus header
    <div style={{ width: '100%', height: `calc(100vh - ${HEADER_HEIGHT}px)`, position: 'relative', background: 'white' }}>
      {/* Conditionally render Globe only when window is defined and dimensions are set */}
      {typeof window !== 'undefined' && dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeEl}
          // Globe appearance
          globeImageUrl={null} // No texture for the globe itself; using material color for oceans
          globeMaterial={globeMaterial} // Custom material for ocean color
          
          // Scene background and atmosphere
          backgroundColor="rgba(255, 255, 255, 1)" // White background for the scene
          showAtmosphere={false} // Atmosphere disabled as requested
          
          // Country polygon data and styling
          polygonsData={landPolygons}
          polygonCapColor={getPolygonCapColor} // Dynamic color for EU vs non-EU countries
          polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'} // Subtle side color for depth
          polygonStrokeColor={() => '#000000'} // Black borders between countries
          polygonAltitude={0.008} // Slight altitude to make borders pop and prevent z-fighting
          
          // Interactivity
          onPolygonHover={setHoverD as (feature: object | null) => void} // Update hover state
          polygonLabel={({ properties }: object) => { // Tooltip label on hover
            const p = properties as CountryProperties;
            return `<div style="background: rgba(40,40,40,0.8); color: white; padding: 5px 8px; border-radius: 4px; font-size: 12px;"><b>${p?.NAME_LONG || p?.NAME || 'Country'}</b></div>`;
          }}
          polygonsTransitionDuration={100} // Smooth transition for hover effects

          // Dimensions and readiness callback
          width={dimensions.width}
          height={dimensions.height}
          onGlobeReady={() => setGlobeReady(true)} // Signal that the globe instance is ready

          // Pointer interactions (zoom, pan)
          enablePointerInteraction={true} // Allow user interaction with the globe
        />
      )}
      {/* Informational overlay at the bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-black/60 text-white rounded-lg backdrop-blur-sm shadow-lg text-center text-xs md:text-sm max-w-[90%] md:max-w-md">
        <Info className="inline h-4 w-4 mr-1.5 align-middle text-blue-300" />
        DPP Global Tracker v2. EU countries in dark blue. Hover for country names.
      </div>
    </div>
  );
}


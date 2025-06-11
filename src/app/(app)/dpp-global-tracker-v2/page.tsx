
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
const EU_COUNTRY_CODES = new Set([
  'AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 
  'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 
  'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE'
]);

interface CountryProperties extends GeoJsonProperties {
  NAME: string; // Official name
  NAME_LONG: string; // Long name
  ISO_A3: string; // ISO Alpha-3 code
  // Add other properties from your topojson file if needed
}

type CountryFeature = Feature<Geometry, CountryProperties>;

export default function GlobeV2Page() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [landPolygons, setLandPolygons] = useState<CountryFeature[]>([]);
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);

  // Effect to set initial dimensions and handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      // Adjust height calculation based on your app's header/footer height if any
      // Assuming a header height of roughly 64px (4rem)
      const headerHeight = document.querySelector('header')?.offsetHeight || 64;
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - headerHeight, 
      });
    };

    if (typeof window !== 'undefined') {
      updateDimensions(); // Set initial dimensions
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Effect to fetch country polygon data
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then((atlas: Topology) => {
        const countries = atlas.objects.countries;
        if (countries) {
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
      });
  }, []);

  // Function to determine if a country is in the EU
  const isEU = useCallback((isoA3: string | undefined) => {
    return !!isoA3 && EU_COUNTRY_CODES.has(isoA3);
  }, []);

  // Globe material for oceans
  const globeMaterial = useMemo(() => new MeshPhongMaterial({
    color: '#a9d5e5', // Light blue for oceans (e.g., #ADD8E6, #B0E0E6) closer to #a9d5e5 from image
    transparent: true,
    opacity: 1,
  }), []);

  // Initial globe setup
  useEffect(() => {
    if (globeEl.current && globeReady) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.enableZoom = true; // Allow zooming
        controls.minDistance = 200; // Prevent zooming too close
        controls.maxDistance = 800; // Prevent zooming too far
      }
      // Set initial camera position (latitude, longitude, altitude)
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
    }
  }, [globeReady]);
  
  // Performance optimization: memoize polygon colors
  const getPolygonCapColor = useCallback((feat: object) => {
    const properties = (feat as CountryFeature).properties;
    return isEU(properties?.ISO_A3) ? '#002D62' : '#CCCCCC'; // Dark blue for EU, Light grey for others
  }, [isEU]);


  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white' }}>
      {typeof window !== 'undefined' && dimensions.width > 0 && dimensions.height > 0 && landPolygons.length > 0 && (
        <Globe
          ref={globeEl}
          // Globe imagery and material
          globeImageUrl={null} // No texture for the globe itself if using material color
          globeMaterial={globeMaterial} // Custom material for ocean color
          
          // Background and atmosphere
          backgroundColor="rgba(255, 255, 255, 1)" // White background for the scene
          showAtmosphere={false} // Disable atmosphere
          
          // Polygon data for countries
          polygonsData={landPolygons}
          polygonCapColor={getPolygonCapColor}
          polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'} // Subtle side color for depth
          polygonStrokeColor={() => '#000000'} // Black borders between countries
          polygonAltitude={0.008} // Slight altitude to prevent z-fighting with globe surface and make borders visible
          
          // Interactivity
          onPolygonHover={setHoverD as (feature: object | null) => void}
          polygonLabel={({ properties }: object) => {
            const p = properties as CountryProperties;
            return `<div style="background: rgba(40,40,40,0.8); color: white; padding: 5px 8px; border-radius: 4px; font-size: 12px;"><b>${p?.NAME_LONG || p?.NAME || 'Country'}</b></div>`;
          }}
          polygonsTransitionDuration={100} // Smooth transition for hover effects

          // Dimensions and readiness
          width={dimensions.width}
          height={dimensions.height}
          onGlobeReady={() => setGlobeReady(true)}

          // Controls configuration (can be further customized in useEffect)
          enablePointerInteraction={true}
        />
      )}
      {/* Info overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-black/60 text-white rounded-lg backdrop-blur-sm shadow-lg text-center text-xs md:text-sm max-w-[90%] md:max-w-md">
        <Info className="inline h-4 w-4 mr-1.5 align-middle text-blue-300" />
        DPP Global Tracker v2. EU countries in dark blue, others in light grey. Hover for country names.
      </div>
    </div>
  );
}

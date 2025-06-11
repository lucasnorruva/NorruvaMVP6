
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { GlobeMethods } from 'react-globe.gl';
import type { Feature as GeoJsonFeature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { MeshPhongMaterial } from 'three';
import { Loader2, Info } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

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
  const router = useRouter();
  const [landPolygons, setLandPolygons] = useState<CountryFeature[]>([]);
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null); // State for hovered country data
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [arcsData, setArcsData] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null); // State for selected product

  const [countryFilter, setCountryFilter] = useState<'all' | 'eu' | 'supplyChain'>('all'); // Task 7: Country filter state
  // Task 6: Add state for clicked country details
  const [clickedCountryData, setClickedCountryData] = useState<CountryFeature | null>(null);


  // Task 6: Modified handlePolygonClick
  // Approximate header height (adjust if your header height is different or dynamic)
  const HEADER_HEIGHT = 64; // Example: 4rem = 64px

  const [filteredLandPolygons, setFilteredLandPolygons] = useState<CountryFeature[]>([]); // Task 7: Filtered polygons state

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

    // Task 6: Modified handlePolygonClick
    const handlePolygonClick = useCallback((feat: object) => { setClickedCountryData(feat as CountryFeature); }, [setClickedCountryData]);

    updateDimensions(); 
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Mock country coordinates for arcs (replace with real geocoding later)
  const mockCountryCoordinates: { [key: string]: { lat: number; lng: number } } = useMemo(() => ({
    'Germany': { lat: 51.1657, lng: 10.4515 }, // Example
    'France': { lat: 46.6034, lng: 1.8883 }, // Example
    'Italy': { lat: 41.8719, lng: 12.5674 }, // Example
    'Spain': { lat: 40.4637, lng: -3.7492 }, // Example
    'Poland': { lat: 51.9194, lng: 19.1451 }, // Example
    'United States': { lat: 37.0902, lng: -95.7129 }, // Example
    'China': { lat: 35.8617, lng: 104.1954 }, // Example
    'Japan': { lat: 36.2048, lng: 138.2529 }, // Example
    'United Kingdom': { lat: 55.3781, lng: -3.4360 }, // Example
    'Canada': { lat: 56.1304, lng: -106.3468 }, // Example
    // Add more mock coordinates as needed
  }), []);

  // Effect to generate arc data when highlightedCountries changes
  useEffect(() => {
    const arcs = highlightedCountries.map((countryName, index) => {
      if (index === 0 || !mockCountryCoordinates[countryName] || !mockCountryCoordinates[highlightedCountries[index - 1]]) return null; // Ensure both start and end countries have mock coordinates
      const startCountry = highlightedCountries[index - 1];
      const endCountry = countryName;

      // Simple arc between sequential highlighted countries
    return {
        startLat: mockCountryCoordinates[startCountry].lat,
        startLng: mockCountryCoordinates[startCountry].lng,
        endLat: mockCountryCoordinates[endCountry].lat,
        endLng: mockCountryCoordinates[endCountry].lng,
        color: '#FFFF00' // Yellow arcs for now
      };
    }).filter(arc => arc !== null); // Remove null entries

    setArcsData(arcs);
  }, [highlightedCountries, mockCountryCoordinates]);

  // Effect to fetch country polygon data
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
    )
      .then((res) => res.json())
      .then((geoJson: FeatureCollection<Geometry, CountryProperties>) => {
        setLandPolygons(geoJson.features);
      })
      .catch((err) => {
        console.error('Error fetching or processing country polygons:', err);
      })
      .finally(() => {
        setDataLoaded(true);
      });
  }, []);

  // Fetch supply chain graph data when a productId is provided
  // Modified to depend on selectedProduct state
  useEffect(() => {
    if (!selectedProduct || selectedProduct === 'select-placeholder') return; // Only fetch if a product is selected and not the placeholder
    fetch(`/api/v1/dpp/graph/${productId}`)
      .then(res => res.json())
      .then((graph) => {
        const countries = new Set<string>();
        if (graph?.nodes) {
          graph.nodes.forEach((node: any) => {
            if (node.type === 'supplier' || node.type === 'manufacturer') {
              const loc: string | undefined = node.data?.location;
              if (loc) {
                const country = loc.split(',').pop()?.trim();
                if (country) countries.add(country);
              }
            }
          });
        }
        setHighlightedCountries(Array.from(countries));
      })
      .catch((err) => {
        console.error('Error fetching product graph:', err);
      });
  }, [selectedProduct]); // Dependency updated to selectedProduct, not productId

  // Task 7: Effect to filter land polygons based on selected filter and data
 useEffect(() => {
    if (!landPolygons.length) return;

    let filtered = landPolygons;
    if (countryFilter === 'eu') {
      filtered = landPolygons.filter(feat => isEU(feat.properties?.ADM0_A3 || feat.properties?.ISO_A3));
    } else if (countryFilter === 'supplyChain') {
      filtered = landPolygons.filter(feat =>
        highlightedCountries.includes(feat.properties?.ADMIN || feat.properties?.NAME_LONG || '')
      );
    }

    setFilteredLandPolygons(filtered);
  }, [countryFilter, landPolygons, highlightedCountries, isEU]);


  // Function to determine if a country is in the EU based on its ISO A3 code
  const isEU = useCallback((isoA3: string | undefined) => {
    return !!isoA3 && EU_COUNTRY_CODES.has(isoA3.toUpperCase());
  }, []);

  // Globe material for oceans (light blue)
  const globeMaterial = useMemo(() => new MeshPhongMaterial({
    color: '#a9d5e5', // Light blue for oceans
    transparent: true,
    opacity: 1,
  }), []);

  // Effect to set initial globe setup (camera, controls) once the globe is ready
  useEffect(() => {
    if (globeEl.current && globeReady) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = isAutoRotating; // Set initial auto-rotate based on state
        controls.autoRotateSpeed = 0.3; // Slow rotation
        controls.enableZoom = true;    
        controls.minDistance = 150;   
        controls.maxDistance = 1000;  
      }
      // Initial camera position (adjust if needed)
      globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
    }
  }, [globeReady]);
  
  // Memoized polygon cap color logic for performance
  const getPolygonCapColor = useCallback((feat: object) => {
    const properties = (feat as CountryFeature).properties;
    const iso = properties?.ADM0_A3 || properties?.ISO_A3;
    const name = properties?.ADMIN;
    if (highlightedCountries.includes(name)) {
      return '#f97316'; // orange highlight for supply chain countries
    }
    return isEU(iso) ? '#002D62' : '#CCCCCC'; // Dark blue for EU, light grey for others
  }, [isEU, highlightedCountries]);

  // Effect to control auto-rotation
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      if (controls) controls.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

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
    <>
      <div
        style={{
          width: '100%',
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          position: 'relative',
          background: 'white',
        }}
      >
        {typeof window !== 'undefined' && dimensions.width > 0 && dimensions.height > 0 && (
          <Globe
            ref={globeEl}
            globeImageUrl={null}
            globeMaterial={globeMaterial}
            backgroundColor="rgba(255, 255, 255, 1)"
            arcsData={arcsData}
            showAtmosphere={false}
            polygonsData={filteredLandPolygons}
            polygonCapColor={getPolygonCapColor}
            polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'}
            polygonStrokeColor={() => '#000000'} // Black borders
            polygonAltitude={0.008}
            onPolygonHover={setHoverD as (feature: GeoJsonFeature | null) => void}
            onPolygonClick={handlePolygonClick} // Use the modified handler
            polygonLabel={({ properties }: object) => {
              const p = properties as CountryProperties;
              const iso = p?.ADM0_A3 || p?.ISO_A3;
              const name = p?.ADMIN || p?.NAME_LONG || 'Country';
              const isEUCountry = isEU(iso);
              const isInSupplyChain = highlightedCountries.includes(name);
              return `<div style="background: rgba(40,40,40,0.8); color: white; padding: 5px 8px; border-radius: 4px; font-size: 12px;">
                <b>${name}</b>${iso ? ` (${iso})` : ''}<br/>
                ${isEUCountry ? 'EU Member' : 'Non-EU Member'}<br/>
                ${isInSupplyChain ? 'In Supply Chain' : ''}
              </div>`;
            }}
            polygonsTransitionDuration={100}
            width={dimensions.width}
            height={dimensions.height}
            onGlobeReady={() => setGlobeReady(true)}
            enablePointerInteraction={true}
          />
        )}

        {/* Task 3: Auto-Rotate Toggle Button */}
        {dimensions.width > 0 && dimensions.height > 0 && (
          <Button
            className="absolute top-4 right-[170px] z-10"
            size="sm"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
          >
            {isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          </Button>
        )}

        {/* UI Controls and Info */}
        {/* Task 7: Country Filter Select */}
        <div className="absolute top-4 right-4 z-10">
 <Select
 onValueChange={(value) =>
 setCountryFilter(value as 'all' | 'eu' | 'supplyChain')
 }
 value={countryFilter}
 >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="eu">EU Countries</SelectItem>
            <SelectItem value="supplyChain">Supply Chain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Selection Placeholder */}
      <div className="absolute top-4 left-4 z-10">
 <Select
 onValueChange={(value) => setSelectedProduct(value)}
 value={selectedProduct || 'select-placeholder'} // Use a placeholder value when no product is selected
 >
 <SelectItem value="select-placeholder" disabled>Select a Product</SelectItem> {/* Add a disabled placeholder item */}
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a Product" />
          </SelectTrigger>
          <SelectContent>
            {/* Placeholder product items */}
            <SelectItem value="product-a">Product A (Mock)</SelectItem>
            <SelectItem value="product-b">Product B (Mock)</SelectItem>
            <SelectItem value="product-c">Product C (Mock)</SelectItem>
          </SelectContent>
        </Select>
      </div>
        
        {/* Task 6: Placeholder Modal/Side Panel for Country Details */}
        {clickedCountryData && (

        <div className="absolute top-4 right-4 z-10 w-80 bg-white p-4 rounded-md shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Details for {clickedCountryData.properties?.ADMIN || 'Selected Country'}</h3>
            <Button variant="ghost" size="icon" onClick={() => setClickedCountryData(null)}>
              X
            </Button>
          </div>
          <div>
            {/* Add more detailed information here based on available data */}
            <p className="text-sm text-muted-foreground">ISO A3: {clickedCountryData.properties?.ADM0_A3 || clickedCountryData.properties?.ISO_A3}</p>
            {/* You can add more details about supply chain involvement, etc. */}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs p-2 rounded-md shadow-lg pointer-events-none">
        <Info className="inline h-3 w-3 mr-1" />
        EU Countries: Dark Blue | Other Countries: Light Grey. Globe auto-rotates.
      </div>
    </div>
  );


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
  const searchParams = useSearchParams();
  const [landPolygons, setLandPolygons] = useState<CountryFeature[]>([]);
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null); // State for hovered country data
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [arcsData, setArcsData] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null); 

  const [countryFilter, setCountryFilter] = useState<'all' | 'eu' | 'supplyChain'>('all');
  const [clickedCountryData, setClickedCountryData] = useState<CountryFeature | null>(null);
  const [filteredLandPolygons, setFilteredLandPolygons] = useState<CountryFeature[]>([]);

  const HEADER_HEIGHT = 64; 

  const productIdFromQuery = searchParams.get('productId');

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

  const handlePolygonClick = useCallback((feat: object) => { setClickedCountryData(feat as CountryFeature); }, [setClickedCountryData]);

  // Mock country coordinates for arcs
  const mockCountryCoordinates: { [key: string]: { lat: number; lng: number } } = useMemo(() => ({
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'France': { lat: 46.6034, lng: 1.8883 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Poland': { lat: 51.9194, lng: 19.1451 },
    'United States': { lat: 37.0902, lng: -95.7129 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'India': { lat: 20.5937, lng: 78.9629 }, // Added India for PROD002
    'Netherlands': { lat: 52.1326, lng: 5.2913 }, // Added Netherlands for PROD002
  }), []);

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

  // Fetch supply chain graph data when productIdFromQuery changes
  useEffect(() => {
    if (!productIdFromQuery) {
        setHighlightedCountries([]);
        setArcsData([]);
        return;
    }

    fetch(`/api/v1/dpp/graph/${productIdFromQuery}`)
      .then(res => {
          if (!res.ok) {
              console.error(`Failed to fetch graph data for ${productIdFromQuery}: ${res.status}`);
              // Potentially show a toast message to the user here
              return null; // Or throw new Error to be caught by .catch
          }
          return res.json();
      })
      .then((graph) => {
        if (!graph || !graph.nodes) {
            setHighlightedCountries([]);
            return;
        }
        const countries = new Set<string>();
        graph.nodes.forEach((node: any) => {
          if (node.type === 'supplier' || node.type === 'manufacturer') {
            const loc: string | undefined = node.data?.location;
            if (loc) {
              const country = loc.split(',').pop()?.trim();
              if (country) countries.add(country);
            }
          }
        });
        setHighlightedCountries(Array.from(countries));
      })
      .catch((err) => {
        console.error('Error fetching product graph:', err);
        setHighlightedCountries([]);
        setArcsData([]);
      });
  }, [productIdFromQuery]);

  // Effect to generate arc data when highlightedCountries changes
  useEffect(() => {
    const arcs = highlightedCountries.map((countryName, index) => {
      if (index === 0) return null; 
      const startCountryCoords = mockCountryCoordinates[highlightedCountries[index - 1]];
      const endCountryCoords = mockCountryCoordinates[countryName];

      if (!startCountryCoords || !endCountryCoords) {
        console.warn(`Missing coordinates for arc between ${highlightedCountries[index-1]} and ${countryName}`);
        return null; // Skip arc if coordinates are missing
      }

      return {
        startLat: startCountryCoords.lat,
        startLng: startCountryCoords.lng,
        endLat: endCountryCoords.lat,
        endLng: endCountryCoords.lng,
        color: '#FFFF00' // Yellow arcs for now
      };
    }).filter(arc => arc !== null); 
    setArcsData(arcs as any[]); // Cast as any[] as filter(Boolean) typing can be tricky
  }, [highlightedCountries, mockCountryCoordinates]);


  // Function to determine if a country is in the EU based on its ISO A3 code
  const isEU = useCallback((isoA3: string | undefined) => {
    return !!isoA3 && EU_COUNTRY_CODES.has(isoA3.toUpperCase());
  }, []);
  
  // Effect to filter land polygons based on selected filter and data
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


  // Globe material for oceans (light blue)
  const globeMaterial = useMemo(() => new MeshPhongMaterial({
    color: '#a9d5e5', 
    transparent: true,
    opacity: 1,
  }), []);

  // Effect to set initial globe setup (camera, controls) once the globe is ready
  useEffect(() => {
    if (globeEl.current && globeReady) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = isAutoRotating; 
        controls.autoRotateSpeed = 0.3; 
        controls.enableZoom = true;    
        controls.minDistance = 150;   
        controls.maxDistance = 1000;  
      }
      globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
    }
  }, [globeReady, isAutoRotating]); // Added isAutoRotating dependency
  
  // Memoized polygon cap color logic for performance
  const getPolygonCapColor = useCallback((feat: object) => {
    const properties = (feat as CountryFeature).properties;
    const iso = properties?.ADM0_A3 || properties?.ISO_A3;
    const name = properties?.ADMIN;
    if (name && highlightedCountries.includes(name)) {
      return '#f97316'; // orange highlight for supply chain countries
    }
    return isEU(iso) ? '#002D62' : '#CCCCCC'; 
  }, [isEU, highlightedCountries]);


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
            arcColor={'color'}
            arcDashLength={0.4}
            arcDashGap={0.1}
            arcDashAnimateTime={1000}
            arcStroke={0.5}
            showAtmosphere={false}
            polygonsData={filteredLandPolygons}
            polygonCapColor={getPolygonCapColor}
            polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'}
            polygonStrokeColor={() => '#000000'} // Black borders
            polygonAltitude={0.008}
            onPolygonHover={setHoverD as (feature: GeoJsonFeature | null) => void}
            onPolygonClick={handlePolygonClick} 
            polygonLabel={({ properties }: object) => {
              const p = properties as CountryProperties;
              const iso = p?.ADM0_A3 || p?.ISO_A3;
              const name = p?.ADMIN || p?.NAME_LONG || 'Country';
              const isEUCountry = isEU(iso);
              const isInSupplyChain = name && highlightedCountries.includes(name);
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

        {dimensions.width > 0 && dimensions.height > 0 && (
          <Button
            className="absolute top-4 right-[170px] z-10"
            size="sm"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
          >
            {isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          </Button>
        )}

        <div className="absolute top-4 right-4 z-10">
         <Select
           onValueChange={(value) => setCountryFilter(value as 'all' | 'eu' | 'supplyChain') }
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

      <div className="absolute top-4 left-4 z-10">
       <Select
         onValueChange={(value) => {
            setSelectedProduct(value);
            // When selection changes, update the URL to reflect the new productId for graph data
            if (value && value !== 'select-placeholder') {
                 router.push(`/dpp-global-tracker-v2?productId=${value}`);
            } else {
                 router.push(`/dpp-global-tracker-v2`); // Clear productId if placeholder selected
            }
         }}
         value={productIdFromQuery || selectedProduct || 'select-placeholder'}
       >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a Product" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="select-placeholder" disabled>Select a Product</SelectItem>
          <SelectItem value="PROD001">EcoFriendly Refrigerator X2000</SelectItem>
          <SelectItem value="PROD002">Smart LED Bulb (4-Pack)</SelectItem>
        </SelectContent>
      </Select>
    </div>
        
        {clickedCountryData && (
        <div className="absolute top-4 right-4 z-10 w-80 bg-white p-4 rounded-md shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Details for {clickedCountryData.properties?.ADMIN || 'Selected Country'}</h3>
            <Button variant="ghost" size="icon" onClick={() => setClickedCountryData(null)}>
              X
            </Button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ISO A3: {clickedCountryData.properties?.ADM0_A3 || clickedCountryData.properties?.ISO_A3}</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs p-2 rounded-md shadow-lg pointer-events-none">
        <Info className="inline h-3 w-3 mr-1" />
        EU Countries: Dark Blue | Other Countries: Light Grey. Globe auto-rotates.
      </div>
    </div>
  </>
  );
}

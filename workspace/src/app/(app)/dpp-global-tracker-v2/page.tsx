
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import type { GlobeMethods } from 'react-globe.gl';
import type { Feature as GeoJsonFeature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { MeshPhongMaterial } from 'three';
import { Loader2, Info, X, Package, Truck, Ship, Plane, CalendarDays, AlertTriangle } from 'lucide-react'; // Added X icon and transport icons
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { MOCK_DPPS } from '@/data'; // Import MOCK_DPPS to get product names for dropdown
import { MOCK_TRANSIT_PRODUCTS, MOCK_CUSTOMS_ALERTS, type TransitProduct, type CustomsAlert } from '@/data'; // Import new data
import SelectedProductCustomsInfoCard from '@/components/dpp-tracker/SelectedProductCustomsInfoCard'; // Import new component


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
type CountryFeature = GeoJsonFeature<Geometry, CountryProperties>;

export default function GlobeV2Page() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [landPolygons, setLandPolygons] = useState<CountryFeature[]>([]);
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [arcsData, setArcsData] = useState<any[]>([]);
  
  const productIdFromQuery = searchParams.get('productId');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(productIdFromQuery); 

  const [selectedProductTransitInfo, setSelectedProductTransitInfo] = useState<TransitProduct | null>(null);
  const [selectedProductAlerts, setSelectedProductAlerts] = useState<CustomsAlert[]>([]);

  const [countryFilter, setCountryFilter] = useState<'all' | 'eu' | 'supplyChain'>('all');
  const [clickedCountryInfo, setClickedCountryInfo] = useState<CountryProperties | null>(null); 

  const HEADER_HEIGHT = 64; 

  useEffect(() => {
    if (productIdFromQuery) {
      setSelectedProduct(productIdFromQuery);
    }
  }, [productIdFromQuery]);

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

  const handlePolygonClick = useCallback((feat: object) => { 
    setClickedCountryInfo((feat as CountryFeature).properties);
  }, []);

  const mockCountryCoordinates: { [key: string]: { lat: number; lng: number } } = useMemo(() => ({
    'Germany': { lat: 51.1657, lng: 10.4515 }, 'France': { lat: 46.6034, lng: 1.8883 },
    'Italy': { lat: 41.8719, lng: 12.5674 }, 'Spain': { lat: 40.4637, lng: -3.7492 },
    'Poland': { lat: 51.9194, lng: 19.1451 }, 'United States': { lat: 37.0902, lng: -95.7129 },
    'China': { lat: 35.8617, lng: 104.1954 }, 'Japan': { lat: 36.2048, lng: 138.2529 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 }, 'Canada': { lat: 56.1304, lng: -106.3468 },
    'India': { lat: 20.5937, lng: 78.9629 }, 'Netherlands': { lat: 52.1326, lng: 5.2913 },
    'Czechia': { lat: 49.8175, lng: 15.4730 }, 'Belgium': { lat: 50.5039, lng: 4.4699 },
    'Switzerland': { lat: 46.8182, lng: 8.2275}, 'Kenya': {lat: -0.0236, lng: 37.9062},
    'Vietnam': { lat: 14.0583, lng: 108.2772 }, // Added Vietnam for Modular Sofa
    'Hong Kong': { lat: 22.3193, lng: 114.1694 }, // Added Hong Kong
  }), []);

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

  useEffect(() => {
    if (!selectedProduct) {
        setHighlightedCountries([]);
        setArcsData([]);
        setSelectedProductTransitInfo(null);
        setSelectedProductAlerts([]);
        setClickedCountryInfo(null); 
        return;
    }

    // Fetch supply chain graph
    fetch(`/api/v1/dpp/graph/${selectedProduct}`)
      .then(res => res.ok ? res.json() : null)
      .then((graph) => {
        if (!graph || !graph.nodes) {
            setHighlightedCountries([]); setArcsData([]); return;
        }
        const countries = new Set<string>();
        graph.nodes.forEach((node: any) => {
          if (node.type === 'supplier' || node.type === 'manufacturer') {
            const loc: string | undefined = node.data?.location;
            if (loc) {
              const country = loc.split(',').pop()?.trim();
              if (country && mockCountryCoordinates[country]) countries.add(country); // Only add if coords exist
            }
          }
        });
        setHighlightedCountries(Array.from(countries));
        
        if (globeEl.current) {
          if (countries.has('China') || countries.has('Japan') || countries.has('India')) globeEl.current.pointOfView({ lat: 20, lng: 90, altitude: 2.5 }, 1000);
          else if (countries.has('United States') || countries.has('Canada')) globeEl.current.pointOfView({ lat: 45, lng: -90, altitude: 2.5 }, 1000);
          else globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
        }
      })
      .catch((err) => { console.error('Error fetching product graph:', err); setHighlightedCountries([]); setArcsData([]); });

    // Fetch/Filter Transit Info & Alerts
    const transitInfo = MOCK_TRANSIT_PRODUCTS.find(p => p.id === selectedProduct);
    setSelectedProductTransitInfo(transitInfo || null);
    const alerts = MOCK_CUSTOMS_ALERTS.filter(a => a.productId === selectedProduct);
    setSelectedProductAlerts(alerts);

    setClickedCountryInfo(null); // Clear country info when product changes

  }, [selectedProduct, mockCountryCoordinates]); 

  useEffect(() => {
    const arcs = highlightedCountries.map((countryName, index) => {
      if (index === 0 || highlightedCountries.length < 2) return null; 
      const startCountryCoords = mockCountryCoordinates[highlightedCountries[index - 1]];
      const endCountryCoords = mockCountryCoordinates[countryName];
      if (!startCountryCoords || !endCountryCoords) { console.warn(`Missing coords for arc: ${highlightedCountries[index-1]} to ${countryName}`); return null; }
      return { startLat: startCountryCoords.lat, startLng: startCountryCoords.lng, endLat: endCountryCoords.lat, endLng: endCountryCoords.lng, color: '#FFFF00' };
    }).filter(arc => arc !== null); 
    setArcsData(arcs as any[]);
  }, [highlightedCountries, mockCountryCoordinates]);

  const isEU = useCallback((isoA3: string | undefined) => !!isoA3 && EU_COUNTRY_CODES.has(isoA3.toUpperCase()), []);
  
  useEffect(() => {
    if (!landPolygons.length) return;
    let filtered = landPolygons;
    if (countryFilter === 'eu') {
      filtered = landPolygons.filter(feat => isEU(feat.properties?.ADM0_A3 || feat.properties?.ISO_A3));
    } else if (countryFilter === 'supplyChain' && selectedProduct) { 
      filtered = landPolygons.filter(feat =>
        highlightedCountries.includes(feat.properties?.ADMIN || feat.properties?.NAME_LONG || '')
      );
    }
    setFilteredLandPolygons(filtered);
  }, [countryFilter, landPolygons, highlightedCountries, isEU, selectedProduct]);

  const globeMaterial = useMemo(() => new MeshPhongMaterial({ color: '#a9d5e5', transparent: true, opacity: 1 }), []);

  useEffect(() => {
    if (globeEl.current && globeReady) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = isAutoRotating; controls.autoRotateSpeed = 0.3; 
        controls.enableZoom = true; controls.minDistance = 150; controls.maxDistance = 1000;  
      }
      if (!selectedProduct) globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
    }
  }, [globeReady, isAutoRotating, selectedProduct]);
  
  const getPolygonCapColor = useCallback((feat: object) => {
    const properties = (feat as CountryFeature).properties;
    const iso = properties?.ADM0_A3 || properties?.ISO_A3;
    const name = properties?.ADMIN;
    if (clickedCountryInfo && (clickedCountryInfo.ADM0_A3 === iso || clickedCountryInfo.ADMIN === name) ) return '#ff4500';
    if (hoverD && (hoverD.properties.ADM0_A3 === iso || hoverD.properties.ADMIN === name)) return '#ffa500';
    if (name && highlightedCountries.includes(name)) return '#f97316';
    return isEU(iso) ? '#002D62' : '#CCCCCC'; 
  }, [isEU, highlightedCountries, clickedCountryInfo, hoverD]);

  if (dimensions.width === 0 || dimensions.height === 0 || !dataLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-var(--header-height,4rem))] w-full bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg text-muted-foreground">Preparing Global Tracker...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ width: '100%', height: `calc(100vh - ${HEADER_HEIGHT}px)`, position: 'relative', background: 'white' }}>
        {typeof window !== 'undefined' && dimensions.width > 0 && dimensions.height > 0 && (
          <Globe
            ref={globeEl} globeImageUrl={null} globeMaterial={globeMaterial} backgroundColor="rgba(255, 255, 255, 1)"
            arcsData={arcsData} arcColor={'color'} arcDashLength={0.4} arcDashGap={0.1} arcDashAnimateTime={1000} arcStroke={0.5}
            showAtmosphere={false} polygonsData={filteredLandPolygons} polygonCapColor={getPolygonCapColor}
            polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'} polygonStrokeColor={() => '#000000'} polygonAltitude={0.008}
            onPolygonHover={setHoverD as (feature: GeoJsonFeature | null) => void} onPolygonClick={handlePolygonClick} 
            polygonLabel={({ properties }: object) => {
              const p = properties as CountryProperties; const iso = p?.ADM0_A3 || p?.ISO_A3; const name = p?.ADMIN || p?.NAME_LONG || 'Country';
              const isEUCountry = isEU(iso); const isInSupplyChain = name && highlightedCountries.includes(name);
              return `<div style="background: rgba(40,40,40,0.8); color: white; padding: 5px 8px; border-radius: 4px; font-size: 12px;"><b>${name}</b>${iso ? ` (${iso})` : ''}<br/>${isEUCountry ? 'EU Member' : 'Non-EU Member'}<br/>${isInSupplyChain ? 'In Supply Chain' : ''}</div>`;
            }}
            polygonsTransitionDuration={100} width={dimensions.width} height={dimensions.height}
            onGlobeReady={() => setGlobeReady(true)} enablePointerInteraction={true}
          />
        )}

        {dimensions.width > 0 && dimensions.height > 0 && (
          <Button className="absolute top-4 right-[170px] z-10" size="sm" onClick={() => setIsAutoRotating(!isAutoRotating)}>
            {isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          </Button>
        )}

        <div className="absolute top-4 right-4 z-10">
         <Select onValueChange={(value) => setCountryFilter(value as 'all' | 'eu' | 'supplyChain') } value={countryFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter Countries" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem><SelectItem value="eu">EU Countries</SelectItem>
            <SelectItem value="supplyChain" disabled={!selectedProduct}>Supply Chain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="absolute top-4 left-4 z-10">
       <Select
         onValueChange={(value) => {
            const newProductId = value === 'select-placeholder' ? null : value;
            setSelectedProduct(newProductId);
            if (newProductId) router.push(`/dpp-global-tracker-v2?productId=${newProductId}`, { scroll: false });
            else router.push(`/dpp-global-tracker-v2`, { scroll: false });
         }}
         value={selectedProduct || 'select-placeholder'}
       >
        <SelectTrigger className="w-[250px] sm:w-[300px]"><SelectValue placeholder="Select a Product" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="select-placeholder">Select a Product to Track</SelectItem>
          {MOCK_DPPS.map(dpp => ( 
            <SelectItem key={dpp.id} value={dpp.id}>{dpp.productName} ({dpp.id})</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
        
      {clickedCountryInfo && (
        <Card className="absolute top-16 right-4 z-20 w-72 shadow-xl bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-semibold">{clickedCountryInfo.ADMIN || 'Selected Country'}</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setClickedCountryInfo(null)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p><strong className="text-muted-foreground">ISO A3:</strong> {clickedCountryInfo.ADM0_A3 || clickedCountryInfo.ISO_A3 || 'N/A'}</p>
            <p><strong className="text-muted-foreground">DPPs Originating:</strong> {Math.floor(Math.random() * 50)} (Mock)</p>
            <p><strong className="text-muted-foreground">DPPs Transiting:</strong> {Math.floor(Math.random() * 20)} (Mock)</p>
            {isEU(clickedCountryInfo.ADM0_A3 || clickedCountryInfo.ISO_A3) && <p className="text-green-600 font-medium">EU Member State</p>}
            {highlightedCountries.includes(clickedCountryInfo.ADMIN || '') && <p className="text-orange-600 font-medium">Part of Current Supply Chain</p>}
            <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2" disabled>View DPPs for {clickedCountryInfo.ADMIN?.substring(0,15) || 'Country'}... (Conceptual)</Button>
          </CardContent>
        </Card>
      )}

      {selectedProductTransitInfo && (
        <SelectedProductCustomsInfoCard 
            productTransitInfo={selectedProductTransitInfo}
            alerts={selectedProductAlerts}
            onDismiss={() => {
                setSelectedProduct(null);
                setSelectedProductTransitInfo(null);
                setSelectedProductAlerts([]);
                router.push(`/dpp-global-tracker-v2`, { scroll: false }); 
            }}
        />
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs p-2 rounded-md shadow-lg pointer-events-none">
        <Info className="inline h-3 w-3 mr-1" />
        {countryFilter === 'all' ? 'EU: Dark Blue | Non-EU: Grey.' : 
         countryFilter === 'eu' ? 'Displaying EU Countries.' : 
         countryFilter === 'supplyChain' && selectedProduct ? `Displaying Supply Chain for ${selectedProduct}.` :
         'Select a product to view its supply chain.'
        }
        {selectedProduct && highlightedCountries.length > 0 && ` Supply Chain: Orange.`}
      </div>
    </div>
  </>
  );
}


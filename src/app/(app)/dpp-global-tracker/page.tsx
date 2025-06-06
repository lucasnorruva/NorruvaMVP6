
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe as GlobeIconLucide, Info, MapPin, Palette, Plus, Minus,Maximize } from "lucide-react";
import { cn } from '@/lib/utils';

// --- Color & Style Constants for the 2D Map ---
const MAP_BACKGROUND_COLOR = '#e0e5ec'; // A light greyish-blue, similar to the image
const LAND_COLOR_PLACEHOLDER = '#f0f0f0'; // Light grey for landmasses (if not in image)
const OCEAN_COLOR_PLACEHOLDER = '#d0d8e0'; // Light blue-grey for oceans (if not in image)

interface RegionalHighlightProps {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
}

const regionalHighlights: RegionalHighlightProps[] = [
  {
    id: 'americas',
    name: 'Americas',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    position: { top: '45%', left: '20%' }, // Approximate
    size: { width: '150px', height: '150px' }, // Approximate
  },
  {
    id: 'emea',
    name: 'EMEA',
    bgColor: 'bg-purple-600',
    textColor: 'text-white',
    position: { top: '30%', left: '48%' }, // Approximate
    size: { width: '120px', height: '120px' }, // Approximate
  },
  {
    id: 'apac',
    name: 'APAC',
    bgColor: 'bg-teal-700', // Using teal as a close match to the dark cyan/teal in image
    textColor: 'text-white',
    position: { top: '40%', left: '75%' }, // Approximate
    size: { width: '110px', height: '110px' }, // Approximate
  },
];

export default function DppGlobalTrackerPage() {
  const [selectedRegion, setSelectedRegion] = useState<RegionalHighlightProps | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Basic zoom state

  const handleRegionClick = (region: RegionalHighlightProps) => {
    setSelectedRegion(region);
    // In a real app, you might fetch/display data for this region
    alert(`Displaying information for ${region.name} (mock).`);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  const handleResetView = () => setZoomLevel(1);


  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem))] bg-background">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline font-semibold text-primary flex items-center">
          <GlobeIconLucide className="mr-3 h-7 w-7" />
          DPP Global Tracker (2D Map)
        </h1>
      </header>

      <main className="flex-grow relative grid grid-cols-[280px_1fr] grid-rows-1 gap-0">
        <aside className="row-span-1 col-start-1 bg-card border-r border-border overflow-y-auto p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary"/> Map Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRegion ? (
                <div>
                  <h3 className={cn("text-md font-semibold mb-2", selectedRegion.textColor, selectedRegion.bgColor, "p-2 rounded-md")}>{selectedRegion.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed information for the {selectedRegion.name} region would appear here. (Mock data)
                  </p>
                  <ul className="mt-2 text-xs space-y-1">
                    <li>DPPs Active: {(Math.random() * 1000).toFixed(0)}</li>
                    <li>Compliance Rate: {(Math.random() * 30 + 70).toFixed(1)}%</li>
                    <li>Key Regulations: ESPR, Battery Regulation</li>
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This is a 2D world map displaying regional highlights. Click on a colored region to see mock details.
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                 <Palette className="mr-2 h-5 w-5 text-primary"/> Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               {regionalHighlights.map(region => (
                 <div key={region.id} className="flex items-center text-xs">
                    <span className={cn("h-3 w-3 rounded-full mr-2 border border-black/20", region.bgColor)}></span>
                    <span>{region.name} Region</span>
                  </div>
               ))}
                <div className="flex items-center text-xs">
                  <span style={{ backgroundColor: LAND_COLOR_PLACEHOLDER }} className="h-3 w-3 rounded-sm mr-2 border border-black/20"></span>
                  <span>Landmasses</span>
                </div>
                <div className="flex items-center text-xs">
                  <span style={{ backgroundColor: OCEAN_COLOR_PLACEHOLDER }} className="h-3 w-3 rounded-sm mr-2 border border-black/20"></span>
                  <span>Oceans</span>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
                    <Plus className="h-4 w-4"/>
                </Button>
                 <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
                    <Minus className="h-4 w-4"/>
                </Button>
                 <Button variant="outline" size="icon" onClick={handleResetView} title="Reset View">
                    <Maximize className="h-4 w-4"/>
                </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="row-span-1 col-start-2 relative overflow-hidden" style={{ backgroundColor: MAP_BACKGROUND_COLOR }}>
          <div 
            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image
              src="https://placehold.co/1920x1080.png/e0e5ec/d0d8e0?text=World+Map" // Placeholder simulating light land/ocean
              alt="World Map with Regional Highlights"
              layout="fill"
              objectFit="contain" // Use contain to see the whole map, or cover to fill
              priority
              data-ai-hint="world map regions"
            />
            {regionalHighlights.map((region) => (
              <button
                key={region.id}
                className={cn(
                  'absolute rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-lg hover:scale-105 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75',
                  region.bgColor,
                  region.textColor
                )}
                style={{
                  top: region.position.top,
                  left: region.position.left,
                  width: region.size.width,
                  height: region.size.height,
                }}
                onClick={() => handleRegionClick(region)}
                aria-label={`Show information for ${region.name}`}
              >
                <span className="font-semibold text-sm sm:text-md p-2">{region.name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
      <footer className="p-2 border-t text-center text-xs text-muted-foreground">
        DPP Global Tracker - 2D Regional Overview. Map image is a placeholder.
      </footer>
    </div>
  );
}

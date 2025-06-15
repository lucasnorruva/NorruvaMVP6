
// --- File: src/components/dashboard/insights/GeographicDistributionSummary.tsx ---
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Map, Globe2 } from "lucide-react";
import { MOCK_DPPS } from '@/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface GeoDistribution {
  countryCode: string;
  countryName?: string; // Added for display
  count: number;
}

// Simple mapping for demonstration
const countryCodeToName: Record<string, string> = {
  DE: "Germany", CN: "China", US: "United States",
  IN: "India", SE: "Sweden", PL: "Poland", BE: "Belgium",
  unknown: "Unknown/Not Specified"
};

export default function GeographicDistributionSummary() {
  const geoData = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_DPPS.forEach(dpp => {
      const country = dpp.traceability?.originCountry || 'unknown';
      counts[country] = (counts[country] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([countryCode, count]) => ({
        countryCode,
        countryName: countryCodeToName[countryCode.toUpperCase()] || countryCode,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 countries
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <Map className="mr-2 h-5 w-5 text-primary" />
          DPP Geographic Origin Summary
        </CardTitle>
        <CardDescription>Top 5 countries by number of DPPs originating from them.</CardDescription>
      </CardHeader>
      <CardContent>
        {geoData.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {geoData.map(item => (
              <li key={item.countryCode} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                <span className="font-medium text-foreground">{item.countryName} ({item.countryCode})</span>
                <span className="font-semibold text-primary">{item.count.toLocaleString()} DPPs</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-6">No geographic origin data available.</p>
        )}
        <Button variant="link" asChild className="p-0 h-auto text-sm mt-4 text-primary">
            <Link href="/dpp-global-tracker-v2">
                <Globe2 className="mr-1.5 h-4 w-4"/> View Global Tracker
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

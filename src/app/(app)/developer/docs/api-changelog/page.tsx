
// --- File: page.tsx (API Changelog Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DocsPageLayout from '@/components/developer/DocsPageLayout'; // Import the new layout

const mockChangelogEntries = [
  {
    version: "v1.1.0",
    date: "2024-08-15",
    type: "Feature",
    summary: "Added new endpoints for managing supplier-specific data sections within a DPP. Enhanced filtering options for the `/dpp` list endpoint.",
    details: [
      "POST `/dpp/{dppId}/supplier-data/{supplierId}`",
      "GET `/dpp` now supports filtering by `manufacturerDid`."
    ]
  },
  {
    version: "v1.0.5",
    date: "2024-07-20",
    type: "Improvement",
    summary: "Improved performance for QR code validation endpoint. Updated EBSI integration mock responses for better testing.",
    details: [
      "Optimized `/qr/validate` response times by 15%.",
      "Added more realistic EBSI status codes to mock product data."
    ]
  },
  {
    version: "v1.0.0",
    date: "2024-07-01",
    type: "Initial Release",
    summary: "Initial public release of the Norruva DPP API. Core endpoints for DPP management and retrieval available.",
    details: [
      "GET `/dpp/{dppId}`",
      "POST `/dpp`",
      "GET `/qr/validate`"
    ]
  },
  {
    version: "v0.9.0 (Beta)",
    date: "2024-06-01",
    type: "Beta",
    summary: "Internal beta release with focus on EU Battery Regulation data points and basic DPP structure.",
    details: [
      "Added specific fields for battery chemistry, carbon footprint, and recycled content."
    ]
  }
];


export default function ApiChangelogPage() {
  const getBadgeVariant = (type: string) => {
    if (type.toLowerCase() === "feature" || type.toLowerCase() === "initial release") return "default";
    if (type.toLowerCase() === "improvement") return "outline";
    if (type.toLowerCase() === "fix" || type.toLowerCase() === "security") return "destructive";
    return "secondary";
  }
  const getBadgeClass = (type: string) => {
    if (type.toLowerCase() === "feature" || type.toLowerCase() === "initial release") return "bg-green-100 text-green-700 border-green-300";
    if (type.toLowerCase() === "improvement") return "bg-blue-100 text-blue-700 border-blue-300";
    if (type.toLowerCase() === "fix" || type.toLowerCase() === "security") return "bg-red-100 text-red-700 border-red-300";
    return "bg-muted text-muted-foreground";
  }


  return (
    <DocsPageLayout
      pageTitle="API Changelog"
      pageIcon="History"
      alertTitle="Stay Updated"
      alertDescription="This page lists updates, new features, improvements, and important changes to the Norruva Digital Product Passport API. Subscribe to our developer newsletter for major announcements."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Version History</CardTitle>
          <CardDescription>
            Track changes and new capabilities as the API evolves.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockChangelogEntries.map((entry) => (
            <div key={entry.version} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <h3 className="text-xl font-semibold text-primary font-headline">
                  Version {entry.version}
                </h3>
                <div className="flex items-center gap-3 mt-1 sm:mt-0">
                  <Badge variant={getBadgeVariant(entry.type)} className={getBadgeClass(entry.type)}>
                    {entry.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <CalendarDays className="mr-1.5 h-4 w-4"/>{entry.date}
                  </span>
                </div>
              </div>
              <p className="text-sm text-foreground/90 mb-2">{entry.summary}</p>
              {entry.details && entry.details.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Key Changes:</h4>
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground pl-2">
                    {entry.details.map((detail, index) => (
                      <li key={index} className="font-mono">{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {mockChangelogEntries.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No changelog entries available yet. Check back soon for updates!</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Understanding Versioning</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Our API follows semantic versioning principles (Major.Minor.Patch). Breaking changes will result in a new Major version. Minor versions introduce new features in a backward-compatible manner. Patch versions are for backward-compatible bug fixes.
            </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

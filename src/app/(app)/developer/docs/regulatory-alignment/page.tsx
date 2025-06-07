
// --- File: page.tsx (Regulatory Alignment Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Scale } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegulatoryAlignmentPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Scale className="mr-3 h-7 w-7 text-primary" />
          Regulatory Alignment (ESPR, EPREL, etc.)
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer">Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Content Coming Soon</AlertTitle>
        <AlertDescription>
          This page will provide detailed guides on how the Norruva DPP platform helps you align with key EU regulations like ESPR and EPREL.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Overview of Regulatory Support</CardTitle>
          <CardDescription>
            The Norruva platform is designed to facilitate compliance with evolving product regulations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Digital Product Passports are central to many new EU regulations. Our platform aims to provide the tools and data structures necessary to meet these requirements efficiently.
          </p>
          <p>
            This section will include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Specific guidance for Ecodesign for Sustainable Products Regulation (ESPR).</li>
            <li>How DPP data can be structured for EPREL database submissions.</li>
            <li>Alignment with the EU Battery Regulation and Battery Passport requirements.</li>
            <li>Integration points with other relevant directives (e.g., CSRD, SCIP).</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Detailed guides, data mapping examples, and API integration patterns for regulatory reporting will be provided here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


// --- File: src/app/(app)/developer/docs/cbam-concepts/page.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Globe, Info, FileText, BarChart3, ListChecks } from "lucide-react";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function CbamConceptsPage() {
  const keyDataPoints = [
    "Product Identification (CN code)",
    "Embedded Emissions (Direct & Indirect, methodology)",
    "Country of Origin for Emissions",
    "Carbon Price Paid in Origin Country (if any)",
    "CBAM Declarant Information (EORI)",
    "Verification Reports for Emissions Data"
  ];

  const platformSupportPoints = [
    "Data Collection: DPPs centralize manufacturer emissions data. Norruva platform fields include `productDetails.carbonFootprint` for overall product emissions and `compliance.euCustomsData.cbamGoodsIdentifier` for specific CBAM tracking.",
    "Supply Chain Transparency: Tracing emissions through component DPPs (conceptual).",
    "Verification & Auditability: VCs can attest to emissions data.",
    "Standardized Reporting: Promoting CBAM-aligned data formats.",
    "API Access: Enabling programmatic access for declarants."
  ];

  return (
    <DocsPageLayout
      pageTitle="CBAM Pathway Concepts"
      pageIcon="Globe"
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Framework"
      alertDescription="This page provides an overview of how Digital Product Passports (DPPs) and the Norruva platform conceptually align with the EU Carbon Border Adjustment Mechanism (CBAM)."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Understanding CBAM</CardTitle>
          <CardDescription>
            The EU's Carbon Border Adjustment Mechanism (CBAM) aims to price carbon on certain imported goods to prevent carbon leakage and encourage global decarbonization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Initially, CBAM covers imports in sectors like cement, iron/steel, aluminium, fertilisers, electricity, and hydrogen. This list may expand.
          </p>
          <p className="text-sm text-muted-foreground">
            The full conceptual details, including specific data points and workflows, are outlined in the <code className="bg-muted px-1 py-0.5 rounded-sm">docs/cbam-pathway-concepts.md</code> file within this project's repository.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Key DPP Data for CBAM</CardTitle>
          <CardDescription>DPPs can be vital for managing CBAM-related data. Key elements include:</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1.5 text-sm">
            {keyDataPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>How Norruva Platform Supports CBAM (Conceptual)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            {platformSupportPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            By structuring data relevant to CBAM within the DPP, the Norruva platform aims to simplify compliance for businesses involved in international trade with the EU.
          </p>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary"/>Further Information</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground">
            For detailed information on CBAM, refer to official EU Commission resources. The integration points and data fields mentioned here are conceptual and aim to align with anticipated CBAM reporting needs. The actual fields required for CBAM declarations will be defined by specific EU implementing acts.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

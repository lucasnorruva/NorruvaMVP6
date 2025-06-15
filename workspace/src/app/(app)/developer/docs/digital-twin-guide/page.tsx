
// --- File: src/app/(app)/developer/docs/digital-twin-guide/page.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Cpu, Info, FileText, Layers3, Settings2, Activity } from "lucide-react";
import DocsPageLayout from '@/components/developer/DocsPageLayout';

export default function DigitalTwinGuidePage() {
  return (
    <DocsPageLayout
      pageTitle="Digital Twin Guide (Conceptual)"
      pageIcon="Cpu"
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Framework & Future Vision"
      alertDescription="This page provides an overview of how Digital Twins can conceptually integrate with Digital Product Passports on the Norruva platform. The platform currently supports storing basic Digital Twin metadata."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>What is a Digital Twin?</CardTitle>
          <CardDescription>
            A Digital Twin is a dynamic, virtual representation of a physical product, system, or process. It's updated with real-time data from its physical counterpart, enabling advanced monitoring, analysis, and simulation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In the context of DPPs, Digital Twins can significantly enhance the value and utility of product passports by providing live insights into a product's condition, performance, and operational history.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Layers3 className="mr-2 h-5 w-5 text-primary"/>Conceptual Integration with Norruva DPPs</CardTitle>
          <CardDescription>
            The Norruva platform allows you to conceptually link a Digital Twin to a product's DPP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold text-md mb-1">DPP Data Points:</h4>
            <p className="text-sm text-muted-foreground">
              The product form includes a "Digital Twin (Conceptual)" section where you can store:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm pl-4 mt-1">
              <li><strong>Digital Twin URI:</strong> A link to the primary interface or data source of the Digital Twin.</li>
              <li><strong>Sensor Data Endpoint:</strong> A conceptual API endpoint for fetching sensor data.</li>
              <li><strong>Real-Time Status Description:</strong> A textual summary of the twin's current state.</li>
              <li><strong>Predictive Maintenance Alerts:</strong> A list of current maintenance advisories from the twin.</li>
            </ul>
          </section>
           <section className="mt-3">
            <h4 className="font-semibold text-md mb-1">API & Display:</h4>
            <p className="text-sm text-muted-foreground">
              This information is part of the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productDetails.digitalTwin</code> object in the DPP data model retrieved via API. It's also displayed in a dedicated "Digital Twin" tab on the product detail page.
            </p>
          </section>
          <p className="text-xs text-muted-foreground pt-2 border-t">
            Note: Currently, these fields are for informational and conceptual purposes. The platform does not yet perform live data ingestion or interaction with external Digital Twin systems.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Detailed Concepts & Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For a more in-depth discussion on the potential benefits, use cases (like predictive maintenance, lifecycle simulation), and architectural considerations for Digital Twins in DPPs, please refer to the:
          </p>
          <p className="mt-2 font-medium">
            <code className="bg-muted px-1 py-0.5 rounded-sm">docs/digital-twin-concepts.md</code>
          </p>
          <p className="text-xs text-muted-foreground">(This markdown file is located in the project's root <code className="bg-muted px-1 py-0.5 rounded-sm">/docs</code> directory.)</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings2 className="mr-2 h-5 w-5 text-primary"/>Future Vision</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Future development may include direct integrations with IoT platforms, standardized Digital Twin data exchange protocols, and AI-driven analytics based on live twin data to further enrich DPPs and enable advanced circular economy and product-as-a-service models.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

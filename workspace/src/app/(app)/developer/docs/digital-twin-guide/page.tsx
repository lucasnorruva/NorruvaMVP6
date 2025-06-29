// --- File: src/app/(app)/developer/docs/digital-twin-guide/page.tsx ---
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import {
  Cpu,
  Info,
  FileText,
  Layers3,
  Settings2,
  Activity,
  Link as LinkIcon,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import DocsPageLayout from "@/components/developer/DocsPageLayout";

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
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-primary" />
            What is a Digital Twin?
          </CardTitle>
          <CardDescription>
            A Digital Twin is a dynamic, virtual representation of a physical
            product, system, or process. It's updated with real-time data from
            its physical counterpart, enabling advanced monitoring, analysis,
            and simulation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In the context of DPPs, Digital Twins can significantly enhance the
            value and utility of product passports by providing live insights
            into a product's condition, performance, and operational history.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers3 className="mr-2 h-5 w-5 text-primary" />
            Conceptual Integration with Norruva DPPs
          </CardTitle>
          <CardDescription>
            The Norruva platform allows you to conceptually link a Digital Twin
            to a product's DPP. Key aspects include:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold text-md mb-1 flex items-center">
              <LinkIcon className="mr-1.5 h-4 w-4 text-accent" />
              DPP as a Pointer & Data Hub:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm pl-4">
              <li>
                <strong>Digital Twin URI:</strong> The DPP stores a URI
                (`productDetails.digitalTwin.uri`) pointing to the Digital Twin
                instance.
              </li>
              <li>
                <strong>Sensor Data Endpoint:</strong> A conceptual API endpoint
                (`productDetails.digitalTwin.sensorDataEndpoint`) for authorized
                parties to fetch live/recent sensor data.
              </li>
              <li>
                <strong>Real-Time Status Summary:</strong> A descriptive field
                (`productDetails.digitalTwin.realTimeStatus`) in the DPP
                provides a summarized status from the twin.
              </li>
            </ul>
          </section>
          <section className="mt-3">
            <h4 className="font-semibold text-md mb-1 flex items-center">
              <RefreshCcw className="mr-1.5 h-4 w-4 text-accent" />
              Informing Lifecycle Management:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm pl-4">
              <li>
                Digital Twin data (e.g., usage hours, stress cycles) can trigger
                or inform DPP lifecycle events like "Maintenance Required" or
                "EOL Recommended."
              </li>
              <li>
                This enhances the accuracy of EOL predictions and supports
                circular economy processes.
              </li>
              <li>
                The DPP can display predictive maintenance alerts
                (`productDetails.digitalTwin.predictiveMaintenanceAlerts`)
                derived from the twin.
              </li>
            </ul>
          </section>
          <section className="mt-3">
            <h4 className="font-semibold text-md mb-1 flex items-center">
              <ShieldCheck className="mr-1.5 h-4 w-4 text-accent" />
              Digital Twins and Blockchain Integration (Conceptual):
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm pl-4">
              <li>
                Critical data points or state changes from the Digital Twin
                (e.g., major faults, completion of significant operational
                cycles) could be periodically hashed and anchored on a
                blockchain via the DPP system.
              </li>
              <li>
                This creates a tamper-proof, verifiable audit trail of the
                product's operational history, enhancing trust.
              </li>
              <li>
                This involves anchoring significant, verified snapshots or
                proofs, not all real-time twin data.
              </li>
            </ul>
          </section>
          <p className="text-xs text-muted-foreground pt-2 border-t">
            Note: Currently, these fields are for informational and conceptual
            purposes. The platform does not yet perform live data ingestion or
            interaction with external Digital Twin systems.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Detailed Concepts & Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For a more in-depth discussion on the potential benefits, use cases
            (like predictive maintenance, lifecycle simulation, enhanced
            circularity), and architectural considerations for Digital Twins in
            DPPs, including blockchain integration, please refer to the:
          </p>
          <p className="mt-2 font-medium">
            <code className="bg-muted px-1 py-0.5 rounded-sm">
              docs/digital-twin-concepts.md
            </code>
          </p>
          <p className="text-xs text-muted-foreground">
            (This markdown file is located in the project's root{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm">/docs</code>{" "}
            directory and provides a fuller conceptual treatment.)
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings2 className="mr-2 h-5 w-5 text-primary" />
            Future Vision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Future development may include direct integrations with IoT
            platforms, standardized Digital Twin data exchange protocols (e.g.,
            based on Asset Administration Shell - AAS), and AI-driven analytics
            based on live twin data to further enrich DPPs and enable advanced
            circular economy and product-as-a-service models.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

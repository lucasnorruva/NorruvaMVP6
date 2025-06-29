// --- File: DigitalTwinTab.tsx ---
// Description: Displays conceptual Digital Twin information for a product.
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Cpu,
  Link as LinkIcon,
  AlertTriangle,
  Activity,
  Settings2,
} from "lucide-react";
import Link from "next/link";

interface DigitalTwinTabProps {
  product: SimpleProductDetail;
}

export default function DigitalTwinTab({ product }: DigitalTwinTabProps) {
  const digitalTwinData = product.productDetails?.digitalTwin;

  if (
    !digitalTwinData ||
    (!digitalTwinData.uri &&
      !digitalTwinData.sensorDataEndpoint &&
      !digitalTwinData.realTimeStatus &&
      !digitalTwinData.predictiveMaintenanceAlerts)
  ) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-primary" /> Digital Twin
            Information (Conceptual)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No Digital Twin information provided for this product.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This feature is conceptual and for demonstration purposes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-primary" /> Digital Twin Information
          (Conceptual)
        </CardTitle>
        <CardDescription>
          Conceptual details related to the product's Digital Twin. Actual
          integration would involve live data feeds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {digitalTwinData.uri && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1">
              <LinkIcon className="mr-1.5 h-4 w-4" /> Digital Twin URI
            </h4>
            <Link
              href={digitalTwinData.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all text-sm"
            >
              {digitalTwinData.uri}
            </Link>
          </div>
        )}

        {digitalTwinData.sensorDataEndpoint && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1">
              <Settings2 className="mr-1.5 h-4 w-4" /> Sensor Data Endpoint
            </h4>
            <Link
              href={digitalTwinData.sensorDataEndpoint}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all text-sm"
            >
              {digitalTwinData.sensorDataEndpoint}
            </Link>
          </div>
        )}

        {digitalTwinData.realTimeStatus && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1">
              <Activity className="mr-1.5 h-4 w-4" /> Real-Time Status
            </h4>
            <p className="text-sm text-foreground/90 p-2 bg-muted/30 rounded-md whitespace-pre-line">
              {digitalTwinData.realTimeStatus}
            </p>
          </div>
        )}

        {digitalTwinData.predictiveMaintenanceAlerts && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-1">
              <AlertTriangle className="mr-1.5 h-4 w-4 text-orange-500" />{" "}
              Predictive Maintenance Alerts
            </h4>
            <div className="text-sm text-foreground/90 p-2 bg-orange-500/10 border border-orange-500/30 rounded-md whitespace-pre-line">
              {digitalTwinData.predictiveMaintenanceAlerts
                .split("\n")
                .map((alert, index) => (
                  <p key={index} className="mb-0.5 last:mb-0">
                    {alert.startsWith("-") ? alert : `- ${alert}`}
                  </p>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

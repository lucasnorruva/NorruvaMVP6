// --- File: DigitalTwinFormSection.tsx ---
// Description: Form section component for conceptual Digital Twin information.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormData } from "@/types/productFormTypes";
import { AiIndicator } from "@/components/products/form";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";

interface DigitalTwinFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>; // For AI origin tracking
}

export default function DigitalTwinFormSection({
  form,
  initialData,
}: DigitalTwinFormSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Provide conceptual information about any associated Digital Twin for
        this product. This section is for illustrative purposes as actual
        Digital Twin integration is not yet implemented.
      </FormDescription>

      <FormField
        control={form.control}
        name="productDetails.digitalTwin.uri"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Digital Twin URI (Conceptual)
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.digitalTwinOrigin
                    ?.uriOrigin
                }
                fieldName="Digital Twin URI"
              />
            </FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://example.com/digital-twin/product-xyz"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.digitalTwinOrigin.uriOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              A URL pointing to the Digital Twin platform or specific instance.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.digitalTwin.sensorDataEndpoint"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Sensor Data Endpoint (Conceptual)
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.digitalTwinOrigin
                    ?.sensorDataEndpointOrigin
                }
                fieldName="Sensor Data Endpoint"
              />
            </FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://api.example.com/digital-twin/product-xyz/sensors"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.digitalTwinOrigin.sensorDataEndpointOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              An API endpoint to fetch live or recent sensor data from the twin.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.digitalTwin.realTimeStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Real-Time Status Description (Conceptual)
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.digitalTwinOrigin
                    ?.realTimeStatusOrigin
                }
                fieldName="Real-Time Status"
              />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the current operational status as reported by the twin, e.g., 'Operational - Optimal performance', 'Warning - Filter Clogged', 'Offline - Scheduled Maintenance'."
                className="min-h-[80px]"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.digitalTwinOrigin.realTimeStatusOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              A textual summary of the twin's current status.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="productDetails.digitalTwin.predictiveMaintenanceAlerts"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Predictive Maintenance Alerts (Conceptual)
              <AiIndicator
                fieldOrigin={
                  initialData?.productDetailsOrigin?.digitalTwinOrigin
                    ?.predictiveMaintenanceAlertsOrigin
                }
                fieldName="Maintenance Alerts"
              />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="List current predictive maintenance alerts, one per line. E.g., '- Bearing A wear approaching limit (Est. failure in 500hrs)\n- Coolant level low (20%)'"
                className="min-h-[100px]"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue(
                    "productDetailsOrigin.digitalTwinOrigin.predictiveMaintenanceAlertsOrigin" as any,
                    "manual",
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              Current alerts or warnings from the Digital Twin regarding
              upcoming maintenance.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

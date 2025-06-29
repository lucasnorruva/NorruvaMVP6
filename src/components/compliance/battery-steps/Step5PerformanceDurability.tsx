"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step5PerformanceDurability({
  step,
  formData,
  onInputChange,
  onAskCopilot,
}: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="step5_ratedCapacity">Rated Capacity</Label>
            <Input
              id="step5_ratedCapacity"
              value={formData.step5_ratedCapacity || ""}
              onChange={(e) =>
                onInputChange("step5", "ratedCapacity", e.target.value)
              }
              placeholder="e.g., 100 Ah or 5 kWh"
            />
          </div>
          <div>
            <Label htmlFor="step5_nominalVoltage">Nominal Voltage</Label>
            <Input
              id="step5_nominalVoltage"
              value={formData.step5_nominalVoltage || ""}
              onChange={(e) =>
                onInputChange("step5", "nominalVoltage", e.target.value)
              }
              placeholder="e.g., 48V"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="step5_expectedLifetimeCycles">
            Expected Lifetime /Cycle Life
          </Label>
          <Input
            id="step5_expectedLifetimeCycles"
            value={formData.step5_expectedLifetimeCycles || ""}
            onChange={(e) =>
              onInputChange("step5", "expectedLifetimeCycles", e.target.value)
            }
            placeholder="e.g., 2000 cycles @ 80% DoD"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="step5_operatingTemperatureRange">
              Operating Temperature Range
            </Label>
            <Input
              id="step5_operatingTemperatureRange"
              value={formData.step5_operatingTemperatureRange || ""}
              onChange={(e) =>
                onInputChange(
                  "step5",
                  "operatingTemperatureRange",
                  e.target.value,
                )
              }
              placeholder="e.g., -20°C to 60°C"
            />
          </div>
          <div>
            <Label htmlFor="step5_internalResistance">
              Internal Resistance
            </Label>
            <Input
              id="step5_internalResistance"
              value={formData.step5_internalResistance || ""}
              onChange={(e) =>
                onInputChange("step5", "internalResistance", e.target.value)
              }
              placeholder="e.g., <50 mOhms at 25°C"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="step5_powerCapability">Power Capability</Label>
          <Input
            id="step5_powerCapability"
            value={formData.step5_powerCapability || ""}
            onChange={(e) =>
              onInputChange("step5", "powerCapability", e.target.value)
            }
            placeholder="e.g., 5 kW continuous, 10 kW peak (10s)"
          />
        </div>
        <div>
          <Label htmlFor="step5_safetyTestCompliance">
            Safety Test Compliance
          </Label>
          <Textarea
            id="step5_safetyTestCompliance"
            value={formData.step5_safetyTestCompliance || ""}
            onChange={(e) =>
              onInputChange("step5", "safetyTestCompliance", e.target.value)
            }
            placeholder="List key safety standards complied with, e.g., IEC62133, UN 38.3, IEC 62619."
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAskCopilot(step.title)}
        >
          <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
          Ask Co-Pilot about this step
        </Button>
      </CardContent>
    </Card>
  );
}

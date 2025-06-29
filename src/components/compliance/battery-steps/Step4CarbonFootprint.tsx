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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step4CarbonFootprint({
  step,
  formData,
  onInputChange,
  onSelectChange,
  onAskCopilot,
}: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="step4_mfgCarbonFootprint">
              Total Manufacturing Carbon Footprint
            </Label>
            <Input
              id="step4_mfgCarbonFootprint"
              type="number"
              value={formData.step4_mfgCarbonFootprint || ""}
              onChange={(e) =>
                onInputChange(
                  "step4",
                  "mfgCarbonFootprint",
                  e.target.valueAsNumber,
                )
              }
              placeholder="e.g., 1500"
            />
          </div>
          <div>
            <Label htmlFor="step4_mfgCFUnit">Unit</Label>
            <Select
              value={formData.step4_mfgCFUnit}
              onValueChange={(value) =>
                onSelectChange("step4", "mfgCFUnit", value)
              }
            >
              <SelectTrigger id="step4_mfgCFUnit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg_co2e_kwh_total_life">
                  kg CO₂e / kWh of total energy over service life
                </SelectItem>
                <SelectItem value="kg_co2e_per_battery">
                  kg CO₂e / per battery unit
                </SelectItem>
                <SelectItem value="g_co2e_per_cell">
                  g CO₂e / per cell
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground -mt-4">
          Provide the total cradle-to-gate carbon footprint for the
          battery&apos;s manufacturing phase.
        </p>
        <div>
          <Label htmlFor="step4_mfgCFDataSource">
            Data Source & Methodology
          </Label>
          <Textarea
            id="step4_mfgCFDataSource"
            value={formData.step4_mfgCFDataSource || ""}
            onChange={(e) =>
              onInputChange("step4", "mfgCFDataSource", e.target.value)
            }
            placeholder="e.g., PEFCR for Batteries v1.2, Internal LCA study (2023), ISO 14067"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Specify the Product Environmental Footprint Category Rules (PEFCR),
            relevant ISO standard (e.g., ISO 14067), or other LCA methodology
            used.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="step4_recycledContentCFReduction">
              Reduction from Recycled Content (Optional)
            </Label>
            <Input
              id="step4_recycledContentCFReduction"
              type="number"
              value={formData.step4_recycledContentCFReduction || ""}
              onChange={(e) =>
                onInputChange(
                  "step4",
                  "recycledContentCFReduction",
                  e.target.valueAsNumber,
                )
              }
              placeholder="e.g., 50 (kg CO₂e/kWh)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Estimated carbon footprint reduction attributable to recycled
              content.
            </p>
          </div>
          <div>
            <Label htmlFor="step4_transportCF">
              Transport Carbon Footprint (Optional)
            </Label>
            <Input
              id="step4_transportCF"
              type="number"
              value={formData.step4_transportCF || ""}
              onChange={(e) =>
                onInputChange("step4", "transportCF", e.target.valueAsNumber)
              }
              placeholder="e.g., 25.5 (kg CO₂e/kWh)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              CF of transporting battery to first point of sale/use in EU.
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="step4_eolCF">
            End-of-Life Carbon Footprint/Credit (Optional)
          </Label>
          <Input
            id="step4_eolCF"
            type="number"
            value={formData.step4_eolCF || ""}
            onChange={(e) =>
              onInputChange("step4", "eolCF", e.target.valueAsNumber)
            }
            placeholder="e.g., -10 (kg CO₂e/kWh for credit)"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Estimated CF or credit associated with the battery's end-of-life
            phase.
          </p>
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

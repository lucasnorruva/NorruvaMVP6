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
import { Lightbulb, Recycle } from "lucide-react";
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step6RecycledContent({
  step,
  formData,
  onInputChange,
  onAskCopilot,
}: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Recycle className="mr-2 h-5 w-5 text-green-600" />
          {step.title}
        </CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Declare the minimum percentage by weight of recovered cobalt, lead,
          lithium, and nickel present in active materials in the battery, reused
          from manufacturing waste or post-consumer waste.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="step6_recycledCobaltPercentage">
              Recycled Cobalt (%)
            </Label>
            <Input
              id="step6_recycledCobaltPercentage"
              type="number"
              value={formData.step6_recycledCobaltPercentage || ""}
              onChange={(e) =>
                onInputChange(
                  "step6",
                  "recycledCobaltPercentage",
                  e.target.valueAsNumber,
                )
              }
              placeholder="e.g., 16"
            />
          </div>
          <div>
            <Label htmlFor="step6_recycledLeadPercentage">
              Recycled Lead (%)
            </Label>
            <Input
              id="step6_recycledLeadPercentage"
              type="number"
              value={formData.step6_recycledLeadPercentage || ""}
              onChange={(e) =>
                onInputChange(
                  "step6",
                  "recycledLeadPercentage",
                  e.target.valueAsNumber,
                )
              }
              placeholder="e.g., 85"
            />
          </div>
          <div>
            <Label htmlFor="step6_recycledLithiumPercentage">
              Recycled Lithium (%)
            </Label>
            <Input
              id="step6_recycledLithiumPercentage"
              type="number"
              value={formData.step6_recycledLithiumPercentage || ""}
              onChange={(e) =>
                onInputChange(
                  "step6",
                  "recycledLithiumPercentage",
                  e.target.valueAsNumber,
                )
              }
              placeholder="e.g., 6"
            />
          </div>
          <div>
            <Label htmlFor="step6_recycledNickelPercentage">
              Recycled Nickel (%)
            </Label>
            <Input
              id="step6_recycledNickelPercentage"
              type="number"
              value={formData.step6_recycledNickelPercentage || ""}
              onChange={(e) =>
                onInputChange(
                  "step6",
                  "recycledNickelPercentage",
                  e.target.valueAsNumber,
                )
              }
              placeholder="e.g., 6"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="step6_recycledContentDataSource">
            Data Source & Methodology
          </Label>
          <Textarea
            id="step6_recycledContentDataSource"
            value={formData.step6_recycledContentDataSource || ""}
            onChange={(e) =>
              onInputChange(
                "step6",
                "recycledContentDataSource",
                e.target.value,
              )
            }
            placeholder="e.g., Internal mass balance calculation, Supplier declarations verified by XYZ Standard."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Specify how the recycled content percentages were determined.
          </p>
        </div>
        <div>
          <Label htmlFor="step6_recycledContentVerificationUrl">
            Verification Document URL (Optional)
          </Label>
          <Input
            id="step6_recycledContentVerificationUrl"
            value={formData.step6_recycledContentVerificationUrl || ""}
            onChange={(e) =>
              onInputChange(
                "step6",
                "recycledContentVerificationUrl",
                e.target.value,
              )
            }
            placeholder="https://example.com/docs/recycled_content_verification.pdf"
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

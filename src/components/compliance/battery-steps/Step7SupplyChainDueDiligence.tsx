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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Lightbulb, Handshake } from "lucide-react";
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step7SupplyChainDueDiligence({
  step,
  formData,
  onInputChange,
  onRadioChange,
  onAskCopilot,
}: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Handshake className="mr-2 h-5 w-5 text-primary" />
          {step.title}
        </CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="step7_dueDiligencePolicies">
            Description of Due Diligence Policies
          </Label>
          <Textarea
            id="step7_dueDiligencePolicies"
            value={formData.step7_dueDiligencePolicies || ""}
            onChange={(e) =>
              onInputChange("step7", "dueDiligencePolicies", e.target.value)
            }
            placeholder="Describe your company's due diligence policies for responsible sourcing of Cobalt, Lithium, Natural Graphite, and Nickel. Refer to OECD guidance."
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Include information on risk assessment, mitigation measures, and
            supplier engagement related to human rights, labor, environmental,
            and ethical issues.
          </p>
        </div>
        <div>
          <Label className="mb-1 block">
            Is a Due Diligence Report Publicly Available?
          </Label>
          <RadioGroup
            value={formData.step7_isReportPublic || "no"}
            onValueChange={(value) =>
              onRadioChange("step7", "isReportPublic", value)
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="report_public_yes" />
              <Label htmlFor="report_public_yes" className="font-normal">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="report_public_no" />
              <Label htmlFor="report_public_no" className="font-normal">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>
        {formData.step7_isReportPublic === "yes" && (
          <div>
            <Label htmlFor="step7_publicReportUrl">
              URL to Public Due Diligence Report
            </Label>
            <Input
              id="step7_publicReportUrl"
              value={formData.step7_publicReportUrl || ""}
              onChange={(e) =>
                onInputChange("step7", "publicReportUrl", e.target.value)
              }
              placeholder="https://example.com/sustainability/due_diligence_report_2023.pdf"
            />
          </div>
        )}
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

"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Lightbulb, PackageCheck } from 'lucide-react';
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step8CollectionRecycling({ step, formData, onInputChange, onRadioChange, onAskCopilot }: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PackageCheck className="mr-2 h-5 w-5 text-primary" />
          {step.title}
        </CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="step8_producerResponsibilityStatement">Producer Responsibility Statement</Label>
          <Textarea
            id="step8_producerResponsibilityStatement"
            value={formData.step8_producerResponsibilityStatement || ""}
            onChange={(e) => onInputChange("step8", "producerResponsibilityStatement", e.target.value)}
            placeholder="Describe how producer responsibility obligations are met (e.g., financing of collection and recycling, participation in EPR schemes)."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="step8_collectionRecyclingInfoUrl">URL to Collection & Recycling Information</Label>
          <Input
            id="step8_collectionRecyclingInfoUrl"
            type="url"
            value={formData.step8_collectionRecyclingInfoUrl || ""}
            onChange={(e) => onInputChange("step8", "collectionRecyclingInfoUrl", e.target.value)}
            placeholder="https://example.com/battery-recycling-info"
          />
          <p className="text-xs text-muted-foreground mt-1">Link to publicly available information on collection, take-back, and recycling schemes.</p>
        </div>
        <div>
          <Label htmlFor="step8_takeBackSchemesDescription">Description of Take-back & Collection Schemes</Label>
          <Textarea
            id="step8_takeBackSchemesDescription"
            value={formData.step8_takeBackSchemesDescription || ""}
            onChange={(e) => onInputChange("step8", "takeBackSchemesDescription", e.target.value)}
            placeholder="Detail the schemes in place for battery collection and take-back."
            rows={3}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Recycling Efficiency Targets Met?</Label>
            <RadioGroup
              value={formData.step8_recyclingEfficiencyTargetMet || "not_yet_assessed"}
              onValueChange={(value) => onRadioChange("step8", "recyclingEfficiencyTargetMet", value)}
              className="space-y-1.5"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ret_yes" />
                <Label htmlFor="ret_yes" className="font-normal">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ret_no" />
                <Label htmlFor="ret_no" className="font-normal">
                  No
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partially" id="ret_partially" />
                <Label htmlFor="ret_partially" className="font-normal">
                  Partially
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_applicable" id="ret_na" />
                <Label htmlFor="ret_na" className="font-normal">
                  Not Applicable
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_yet_assessed" id="ret_nya" />
                <Label htmlFor="ret_nya" className="font-normal">
                  Not Yet Assessed
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-1">As per Annex XII, Part B.</p>
          </div>
          <div>
            <Label className="mb-2 block">Material Recovery Targets Met?</Label>
            <RadioGroup
              value={formData.step8_materialRecoveryTargetsMet || "not_yet_assessed"}
              onValueChange={(value) => onRadioChange("step8", "materialRecoveryTargetsMet", value)}
              className="space-y-1.5"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="mrt_yes" />
                <Label htmlFor="mrt_yes" className="font-normal">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="mrt_no" />
                <Label htmlFor="mrt_no" className="font-normal">
                  No
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partially" id="mrt_partially" />
                <Label htmlFor="mrt_partially" className="font-normal">
                  Partially
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_applicable" id="mrt_na" />
                <Label htmlFor="mrt_na" className="font-normal">
                  Not Applicable
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_yet_assessed" id="mrt_nya" />
                <Label htmlFor="mrt_nya" className="font-normal">
                  Not Yet Assessed
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-1">For Cobalt, Copper, Lead, Lithium, Nickel (Annex XII, Part B).</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
          <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
          Ask Co-Pilot about this step
        </Button>
      </CardContent>
    </Card>
  );
}


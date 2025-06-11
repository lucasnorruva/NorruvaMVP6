"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step3MaterialComposition({ step, formData, onInputChange, onRadioChange, onAskCopilot }: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-md bg-muted/30">
          <h4 className="font-medium text-md text-primary">Critical Raw Materials (CRM) Content (%)</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="step3_cobaltPercentage">Cobalt (Co)</Label>
              <Input
                id="step3_cobaltPercentage"
                type="number"
                value={formData.step3_cobaltPercentage || ""}
                onChange={(e) => onInputChange("step3", "cobaltPercentage", e.target.valueAsNumber)}
                placeholder="e.g., 15"
              />
            </div>
            <div>
              <Label htmlFor="step3_lithiumPercentage">Lithium (Li)</Label>
              <Input
                id="step3_lithiumPercentage"
                type="number"
                value={formData.step3_lithiumPercentage || ""}
                onChange={(e) => onInputChange("step3", "lithiumPercentage", e.target.valueAsNumber)}
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <Label htmlFor="step3_naturalGraphitePercentage">Natural Graphite</Label>
              <Input
                id="step3_naturalGraphitePercentage"
                type="number"
                value={formData.step3_naturalGraphitePercentage || ""}
                onChange={(e) => onInputChange("step3", "naturalGraphitePercentage", e.target.valueAsNumber)}
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <Label htmlFor="step3_nickelPercentage">Nickel (Ni)</Label>
              <Input
                id="step3_nickelPercentage"
                type="number"
                value={formData.step3_nickelPercentage || ""}
                onChange={(e) => onInputChange("step3", "nickelPercentage", e.target.valueAsNumber)}
                placeholder="e.g., 20"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Declare the percentage by weight of these CRMs if present in the battery. Omit or use '0' if not present.
          </p>
        </div>
        <div className="space-y-4 p-4 border rounded-md bg-muted/30">
          <h4 className="font-medium text-md text-primary">Restricted Substances</h4>
          <div>
            <Label htmlFor="step3_leadContent">Lead (Pb) Content (%)</Label>
            <Input
              id="step3_leadContent"
              type="number"
              value={formData.step3_leadContent || ""}
              onChange={(e) => onInputChange("step3", "leadContent", e.target.valueAsNumber)}
              placeholder="e.g., 0.005 (Max 0.01%)"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label className="mb-1 block">Mercury (Hg) Present?</Label>
              <RadioGroup
                value={formData.step3_mercuryPresent || "no"}
                onValueChange={(value) => onRadioChange("step3", "mercuryPresent", value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hg_yes" />
                  <Label htmlFor="hg_yes" className="font-normal">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="hg_no" />
                  <Label htmlFor="hg_no" className="font-normal">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="mb-1 block">Cadmium (Cd) Present?</Label>
              <RadioGroup
                value={formData.step3_cadmiumPresent || "no"}
                onValueChange={(value) => onRadioChange("step3", "cadmiumPresent", value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="cd_yes" />
                  <Label htmlFor="cd_yes" className="font-normal">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="cd_no" />
                  <Label htmlFor="cd_no" className="font-normal">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Batteries shall not contain mercury &gt;0.0005% or cadmium &gt;0.002% by weight, or lead &gt;0.01% by weight (unless specific exemptions apply).
          </p>
        </div>
        <div>
          <Label htmlFor="step3_otherSVHCs">Other SVHCs (Substances of Very High Concern)</Label>
          <Textarea
            id="step3_otherSVHCs"
            value={formData.step3_otherSVHCs || ""}
            onChange={(e) => onInputChange("step3", "otherSVHCs", e.target.value)}
            placeholder="List any other SVHCs present above 0.1% w/w, their CAS numbers, and concentrations. E.g., Substance X (CAS: 123-45-6) - 0.15%"
          />
          <p className="text-xs text-muted-foreground mt-1">Refer to the ECHA Candidate List for SVHCs.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
          <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
          Ask Co-Pilot about this step
        </Button>
      </CardContent>
    </Card>
  );
}


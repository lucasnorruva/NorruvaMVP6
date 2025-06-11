"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step1GeneralInfo({ step, formData, onInputChange, onAskCopilot }: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="step1_batteryModel">Battery Model Name / Identifier</Label>
          <Input
            id="step1_batteryModel"
            value={formData.step1_batteryModel || ""}
            onChange={(e) => onInputChange("step1", "batteryModel", e.target.value)}
            placeholder="e.g., PowerCell Max 5000, LFP-Module-48V"
          />
        </div>
        <div>
          <Label htmlFor="step1_intendedApplication">Intended Application(s)</Label>
          <Textarea
            id="step1_intendedApplication"
            value={formData.step1_intendedApplication || ""}
            onChange={(e) => onInputChange("step1", "intendedApplication", e.target.value)}
            placeholder="e.g., Electric vehicles, Portable electronics, Grid storage, Industrial equipment"
          />
        </div>
        <div>
          <Label htmlFor="step1_safetySheetUrl">Safety Data Sheet URL (Optional)</Label>
          <Input
            id="step1_safetySheetUrl"
            value={formData.step1_safetySheetUrl || ""}
            onChange={(e) => onInputChange("step1", "safetySheetUrl", e.target.value)}
            placeholder="https://example.com/sds/powercell_max_5000.pdf"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
          <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
          Ask Co-Pilot about this step
        </Button>
      </CardContent>
    </Card>
  );
}


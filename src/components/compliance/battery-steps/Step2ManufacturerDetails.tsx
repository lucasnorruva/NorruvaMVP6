"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step2ManufacturerDetails({ step, formData, onInputChange, onAskCopilot }: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="step2_manufacturerName">Manufacturer Name</Label>
          <Input
            id="step2_manufacturerName"
            value={formData.step2_manufacturerName || ""}
            onChange={(e) => onInputChange("step2", "manufacturerName", e.target.value)}
            placeholder="e.g., ACME Batteries Corp."
          />
        </div>
        <div>
          <Label htmlFor="step2_manufacturerAddress">Manufacturer Registered Address</Label>
          <Textarea
            id="step2_manufacturerAddress"
            value={formData.step2_manufacturerAddress || ""}
            onChange={(e) => onInputChange("step2", "manufacturerAddress", e.target.value)}
            placeholder="e.g., 123 Battery Lane, Tech City, TC 54321, Country"
          />
        </div>
        <div>
          <Label htmlFor="step2_manufacturerContact">Responsible Contact Person (Name / Email)</Label>
          <Input
            id="step2_manufacturerContact"
            value={formData.step2_manufacturerContact || ""}
            onChange={(e) => onInputChange("step2", "manufacturerContact", e.target.value)}
            placeholder="e.g., Jane Doe / compliance@acmebatteries.com"
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


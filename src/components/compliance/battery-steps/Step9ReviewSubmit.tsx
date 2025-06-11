"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, SearchCheck } from 'lucide-react';
import type { BatteryRegulationStepProps } from "../BatteryRegulationStep";

export default function Step9ReviewSubmit({ step, onAskCopilot }: BatteryRegulationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {step.icon && <step.icon className="mr-2 h-5 w-5 text-primary" />}
          {step.title}
        </CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">
          You have reached the final step. Please review all the information entered in the previous steps for accuracy and completeness. Ensure all data aligns with the EU Battery Regulation requirements.
        </p>
        <div className="p-4 border rounded-md bg-muted/50">
          <h4 className="font-semibold mb-2 text-primary">Key Review Points:</h4>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Verify all mandatory fields across all steps are filled.</li>
            <li>Double-check numerical values, units, and percentages.</li>
            <li>Ensure any linked documents or URLs are correct and accessible.</li>
            <li>Confirm consistency of information across different sections.</li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          Once you are satisfied, you can proceed to mock submit this pathway. In a real scenario, this would trigger formal data submission processes.
        </p>
        <Button variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
          <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
          Ask Co-Pilot about Final Review
        </Button>
      </CardContent>
    </Card>
  );
}


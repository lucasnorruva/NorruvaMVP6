"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';

import Step1GeneralInfo from "./battery-steps/Step1GeneralInfo";
import Step2ManufacturerDetails from "./battery-steps/Step2ManufacturerDetails";
import Step3MaterialComposition from "./battery-steps/Step3MaterialComposition";
import Step4CarbonFootprint from "./battery-steps/Step4CarbonFootprint";
import Step5PerformanceDurability from "./battery-steps/Step5PerformanceDurability";
import Step6RecycledContent from "./battery-steps/Step6RecycledContent";
import Step7SupplyChainDueDiligence from "./battery-steps/Step7SupplyChainDueDiligence";
import Step8CollectionRecycling from "./battery-steps/Step8CollectionRecycling";
import Step9ReviewSubmit from "./battery-steps/Step9ReviewSubmit";

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon?: React.ElementType;
}

export interface BatteryRegulationStepProps {
  step: WizardStep;
  formData: Record<string, any>;
  onInputChange: (step: string, field: string, value: string | number) => void;
  onRadioChange: (step: string, field: string, value: string) => void;
  onSelectChange: (step: string, field: string, value: string) => void;
  onAskCopilot: (context: string) => void;
}

const stepMap: Record<string, React.ComponentType<BatteryRegulationStepProps>> = {
  step1: Step1GeneralInfo,
  step2: Step2ManufacturerDetails,
  step3: Step3MaterialComposition,
  step4: Step4CarbonFootprint,
  step5: Step5PerformanceDurability,
  step6: Step6RecycledContent,
  step7: Step7SupplyChainDueDiligence,
  step8: Step8CollectionRecycling,
  step9: Step9ReviewSubmit,
};

function renderStep(id: string, props: BatteryRegulationStepProps) {
  const Component = stepMap[id];
  if (Component) {
    return <Component {...props} />;
  }
  const { step, onAskCopilot } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Content for {step.title} will be available soon.</p>
        <Button className="mt-4" variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
          <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
          Ask Co-Pilot about this step
        </Button>
      </CardContent>
    </Card>
  );
}

export default function BatteryRegulationStep(props: BatteryRegulationStepProps) {
  return renderStep(props.step.id, props);
}


"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Recycle,
  Handshake,
  PackageCheck,
  SearchCheck,
} from "lucide-react";
import BatteryRegulationStep, {
  WizardStep,
} from "@/components/compliance/BatteryRegulationStep";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const euBatteryRegulationSteps: WizardStep[] = [
  {
    id: "step1",
    title: "General Information",
    description: "Provide basic details about the battery product.",
  },
  {
    id: "step2",
    title: "Manufacturer Details",
    description: "Specify manufacturer and responsible parties.",
  },
  {
    id: "step3",
    title: "Material Composition",
    description:
      "Declare critical raw materials (CRM) and restricted substances.",
  },
  {
    id: "step4",
    title: "Carbon Footprint",
    description: "Provide manufacturing carbon footprint data.",
  },
  {
    id: "step5",
    title: "Performance & Durability",
    description: "Detail battery performance characteristics.",
  },
  {
    id: "step6",
    title: "Recycled Content",
    description:
      "Declare the percentage of recycled content for key materials.",
    icon: Recycle,
  },
  {
    id: "step7",
    title: "Supply Chain Due Diligence",
    description:
      "Outline due diligence policies for responsible sourcing of raw materials.",
    icon: Handshake,
  },
  {
    id: "step8",
    title: "Collection & Recycling",
    description:
      "Information on EOL management, producer responsibility, and recycling/recovery targets.",
    icon: PackageCheck,
  },
  {
    id: "step9",
    title: "Review & Submit",
    description: "Verify all information and prepare for submission.",
    icon: SearchCheck,
  },
];

export default function BatteryRegulationPathwayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");
  const country = countryParam ? decodeURIComponent(countryParam) : null;
  const [activeStep, setActiveStep] = useState<string>(
    euBatteryRegulationSteps[0].id,
  );
  const [formData, setFormData] = useState<Record<string, any>>({
    step1_batteryModel: "",
    step1_intendedApplication: "",
    step1_safetySheetUrl: "",
    step2_manufacturerName: "",
    step2_manufacturerAddress: "",
    step2_manufacturerContact: "",
    step3_cobaltPercentage: "",
    step3_lithiumPercentage: "",
    step3_naturalGraphitePercentage: "",
    step3_nickelPercentage: "",
    step3_leadContent: "",
    step3_mercuryPresent: "no",
    step3_cadmiumPresent: "no",
    step3_otherSVHCs: "",
    step4_mfgCarbonFootprint: "",
    step4_mfgCFUnit: "kg_co2e_kwh_total_life",
    step4_mfgCFDataSource: "",
    step4_recycledContentCFReduction: "",
    step4_transportCF: "",
    step4_eolCF: "",
    step5_ratedCapacity: "",
    step5_nominalVoltage: "",
    step5_expectedLifetimeCycles: "",
    step5_operatingTemperatureRange: "",
    step5_internalResistance: "",
    step5_powerCapability: "",
    step5_safetyTestCompliance: "",
    step6_recycledCobaltPercentage: "",
    step6_recycledLeadPercentage: "",
    step6_recycledLithiumPercentage: "",
    step6_recycledNickelPercentage: "",
    step6_recycledContentDataSource: "",
    step6_recycledContentVerificationUrl: "",
    step7_dueDiligencePolicies: "",
    step7_isReportPublic: "no",
    step7_publicReportUrl: "",
    step8_producerResponsibilityStatement: "",
    step8_collectionRecyclingInfoUrl: "",
    step8_takeBackSchemesDescription: "",
    step8_recyclingEfficiencyTargetMet: "not_yet_assessed",
    step8_materialRecoveryTargetsMet: "not_yet_assessed",
  });

  const { toast } = useToast();

  const handleInputChange = (
    step: string,
    field: string,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [`${step}_${field}`]: value }));
  };

  const handleRadioChange = (step: string, field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [`${step}_${field}`]: value }));
  };

  const handleSelectChange = (step: string, field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [`${step}_${field}`]: value }));
  };

  const handleAskCopilot = async (stepContext: string) => {
    const query = `What are the key considerations for the '${stepContext}' step of the EU Battery Regulation?`;
    router.push(`/copilot?contextQuery=${encodeURIComponent(query)}`);
  };

  const currentStepIndex = euBatteryRegulationSteps.findIndex(
    (s) => s.id === activeStep,
  );
  const canGoNext = currentStepIndex < euBatteryRegulationSteps.length - 1;
  const canGoPrev = currentStepIndex > 0;

  const goToNextStep = () => {
    if (canGoNext) {
      setActiveStep(euBatteryRegulationSteps[currentStepIndex + 1].id);
    }
  };

  const goToPrevStep = () => {
    if (canGoPrev) {
      setActiveStep(euBatteryRegulationSteps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">
            EU Battery Regulation Compliance Pathway
          </CardTitle>
          <CardDescription>
            Follow these steps to prepare your Digital Battery Passport
            information.
          </CardDescription>
          {country && (
            <p className="mt-2 text-sm">
              <Badge variant="outline">Guidance for {country}</Badge>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Current Step: {euBatteryRegulationSteps[currentStepIndex].title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {euBatteryRegulationSteps[currentStepIndex].description}
            </p>
            <div className="mt-3 flex items-center space-x-2">
              {euBatteryRegulationSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${index <= currentStepIndex ? "bg-primary" : "bg-muted-foreground/30"}`}
                  title={step.title}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              Step {currentStepIndex + 1} of {euBatteryRegulationSteps.length}
            </p>
          </div>

          {euBatteryRegulationSteps.map(
            (step) =>
              step.id === activeStep && (
                <BatteryRegulationStep
                  key={step.id}
                  step={step}
                  formData={formData}
                  onInputChange={handleInputChange}
                  onRadioChange={handleRadioChange}
                  onSelectChange={handleSelectChange}
                  onAskCopilot={handleAskCopilot}
                />
              ),
          )}

          <div className="mt-6 flex justify-between items-center">
            <Button
              onClick={goToPrevStep}
              disabled={!canGoPrev}
              variant="outline"
            >
              Previous Step
            </Button>
            {currentStepIndex === euBatteryRegulationSteps.length - 1 ? (
              <Button
                onClick={() => {
                  toast({
                    title: "Mock Submission Successful!",
                    description:
                      "Your EU Battery Regulation Pathway data has been conceptually submitted. The wizard will now reset.",
                    duration: 7000,
                    action: <CheckCircle className="text-success" />,
                  });
                  setActiveStep(euBatteryRegulationSteps[0].id);
                }}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Final Review &amp; Submit (Mock)
              </Button>
            ) : (
              <Button onClick={goToNextStep} disabled={!canGoNext}>
                Next Step
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

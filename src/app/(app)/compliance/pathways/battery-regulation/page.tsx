
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, HelpCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { queryComplianceCopilot } from '@/ai/flows/compliance-copilot-flow'; // For future integration

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

const euBatteryRegulationSteps: WizardStep[] = [
  { id: "step1", title: "General Information", description: "Provide basic details about the battery product." },
  { id: "step2", title: "Manufacturer Details", description: "Specify manufacturer and responsible parties." },
  { id: "step3", title: "Material Composition", description: "Declare critical raw materials and substances." },
  { id: "step4", title: "Carbon Footprint", description: "Provide manufacturing carbon footprint data." },
  { id: "step5", title: "Performance & Durability", description: "Detail battery performance characteristics." },
  { id: "step6", title: "Recycled Content", description: "Declare the percentage of recycled content." },
  { id: "step7", title: "Supply Chain Due Diligence", description: "Outline due diligence policies." },
  { id: "step8", title: "Collection & Recycling", description: "Information on EOL management." },
  { id: "step9", title: "Review & Submit", description: "Verify all information and prepare for submission." },
];

export default function BatteryRegulationPathwayPage() {
  const [activeStep, setActiveStep] = useState<string>(euBatteryRegulationSteps[0].id);
  const [formData, setFormData] = useState<Record<string, any>>({
    step1_batteryModel: "",
    step1_intendedApplication: "",
    step1_safetySheetUrl: "",
    step2_manufacturerName: "",
    step2_manufacturerAddress: "",
    step2_manufacturerContact: "",
  });
  const [isLoadingCopilot, setIsLoadingCopilot] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (step: string, field: string, value: string) => {
    setFormData(prev => ({ ...prev, [`${step}_${field}`]: value }));
  };

  const handleAskCopilot = async (stepContext: string) => {
    setIsLoadingCopilot(true);
    toast({
      title: "Asking AI Co-Pilot...",
      description: `Getting information related to: ${stepContext}`,
    });
    // In a real implementation, you would call queryComplianceCopilot here
    // For example:
    // try {
    //   const response = await queryComplianceCopilot({ query: `What are the key requirements for ${stepContext} in the EU Battery Regulation?` });
    //   toast({
    //     title: "Co-Pilot Response",
    //     description: response.answer,
    //     duration: 9000,
    //   });
    // } catch (error) {
    //   toast({ variant: "destructive", title: "Co-Pilot Error", description: "Could not get a response."});
    // }
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    let mockResponseDescription = `For ${stepContext}, ensure all data is accurate and verifiable according to the EU Battery Regulation. Specific guidance can be found in the relevant annexes of the regulation.`;
    if (stepContext === euBatteryRegulationSteps[0].title) {
        mockResponseDescription = `For General Information, ensure you provide accurate battery model identifiers and clearly define all typical intended uses. If a safety data sheet (SDS) is available, linking its URL strengthens your compliance position. Refer to Annex VI of the EU Battery Regulation for specific data elements required under this section.`;
    } else if (stepContext === euBatteryRegulationSteps[1].title) {
        mockResponseDescription = `For Manufacturer Details, clearly identify the legal manufacturer, including their registered trade name and postal address. The contact person (name, email, phone) should be easily reachable for compliance inquiries. Ensure this information precisely matches official business registries.`;
    }
     toast({
        title: "AI Co-Pilot (Mock Response)",
        description: mockResponseDescription,
        duration: 10000,
      });
    setIsLoadingCopilot(false);
  };

  const currentStepIndex = euBatteryRegulationSteps.findIndex(s => s.id === activeStep);
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
  
  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case "step1":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{euBatteryRegulationSteps[0].title}</CardTitle>
              <CardDescription>{euBatteryRegulationSteps[0].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batteryModel">Battery Model Name / Identifier</Label>
                <Input id="batteryModel" value={formData.step1_batteryModel || ""} onChange={(e) => handleInputChange("step1", "batteryModel", e.target.value)} placeholder="e.g., PowerCell Max 5000" />
              </div>
              <div>
                <Label htmlFor="intendedApplication">Intended Application(s)</Label>
                <Textarea id="intendedApplication" value={formData.step1_intendedApplication || ""} onChange={(e) => handleInputChange("step1", "intendedApplication", e.target.value)} placeholder="e.g., Electric vehicles, Portable electronics, Grid storage" />
              </div>
              <div>
                <Label htmlFor="safetySheetUrl">Safety Data Sheet URL (Optional)</Label>
                <Input id="safetySheetUrl" value={formData.step1_safetySheetUrl || ""} onChange={(e) => handleInputChange("step1", "safetySheetUrl", e.target.value)} placeholder="https://example.com/sds/powercell_max_5000.pdf" />
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[0].title)} disabled={isLoadingCopilot}>
                {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                Ask Co-Pilot about this step
              </Button>
            </CardContent>
          </Card>
        );
      case "step2":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{euBatteryRegulationSteps[1].title}</CardTitle>
              <CardDescription>{euBatteryRegulationSteps[1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="manufacturerName">Manufacturer Name</Label>
                <Input id="manufacturerName" value={formData.step2_manufacturerName || ""} onChange={(e) => handleInputChange("step2", "manufacturerName", e.target.value)} placeholder="e.g., ACME Batteries Corp." />
              </div>
              <div>
                <Label htmlFor="manufacturerAddress">Manufacturer Registered Address</Label>
                <Textarea id="manufacturerAddress" value={formData.step2_manufacturerAddress || ""} onChange={(e) => handleInputChange("step2", "manufacturerAddress", e.target.value)} placeholder="e.g., 123 Battery Lane, Tech City, TC 54321, Country" />
              </div>
              <div>
                <Label htmlFor="manufacturerContact">Responsible Contact Person (Name / Email)</Label>
                <Input id="manufacturerContact" value={formData.step2_manufacturerContact || ""} onChange={(e) => handleInputChange("step2", "manufacturerContact", e.target.value)} placeholder="e.g., Jane Doe / compliance@acmebatteries.com" />
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[1].title)} disabled={isLoadingCopilot}>
                {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                Ask Co-Pilot about this step
              </Button>
            </CardContent>
          </Card>
        );
      // Add cases for other steps here as they are developed
      default:
        const currentStepDetails = euBatteryRegulationSteps.find(s => s.id === stepId);
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{currentStepDetails?.title || "Step Details"}</CardTitle>
                    <CardDescription>{currentStepDetails?.description || "Information for this step."}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Content for {currentStepDetails?.title || "this step"} will be available soon.</p>
                     <Button className="mt-4" variant="outline" size="sm" onClick={() => handleAskCopilot(currentStepDetails?.title || "this step")} disabled={isLoadingCopilot}>
                        {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                        Ask Co-Pilot about this step
                    </Button>
                </CardContent>
            </Card>
        );
    }
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">EU Battery Regulation Compliance Pathway</CardTitle>
          <CardDescription>Follow these steps to prepare your Digital Battery Passport information.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-lg mb-2 text-primary">Current Step: {euBatteryRegulationSteps[currentStepIndex].title}</h3>
                <p className="text-sm text-muted-foreground">{euBatteryRegulationSteps[currentStepIndex].description}</p>
                <div className="mt-3 flex items-center space-x-2">
                    {euBatteryRegulationSteps.map((step, index) => (
                        <div 
                          key={step.id} 
                          className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${index <= currentStepIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`} 
                          title={step.title}>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">Step {currentStepIndex + 1} of {euBatteryRegulationSteps.length}</p>
            </div>

            {renderStepContent(activeStep)}

            <div className="mt-6 flex justify-between items-center">
                <Button onClick={goToPrevStep} disabled={!canGoPrev} variant="outline">
                    Previous Step
                </Button>
                {currentStepIndex === euBatteryRegulationSteps.length -1 ? (
                    <Button onClick={() => alert("Mock: Final Review & Submission")} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <CheckCircle className="mr-2 h-4 w-4"/>
                        Final Review & Submit
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

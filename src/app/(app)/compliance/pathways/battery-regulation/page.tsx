
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, HelpCircle, CheckCircle, Loader2, Info, Recycle, Handshake, PackageCheck, AlertTriangle } from 'lucide-react';
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
  { id: "step3", title: "Material Composition", description: "Declare critical raw materials (CRM) and restricted substances." },
  { id: "step4", title: "Carbon Footprint", description: "Provide manufacturing carbon footprint data." },
  { id: "step5", title: "Performance & Durability", description: "Detail battery performance characteristics." },
  { id: "step6", title: "Recycled Content", description: "Declare the percentage of recycled content for key materials." },
  { id: "step7", title: "Supply Chain Due Diligence", description: "Outline due diligence policies for responsible sourcing of raw materials." },
  { id: "step8", title: "Collection & Recycling", description: "Information on EOL management, producer responsibility, and recycling/recovery targets." },
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
  const [isLoadingCopilot, setIsLoadingCopilot] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (step: string, field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [`${step}_${field}`]: value }));
  };

  const handleRadioChange = (step: string, field: string, value: string) => {
    setFormData(prev => ({ ...prev, [`${step}_${field}`]: value }));
  };
  
  const handleSelectChange = (step: string, field: string, value: string) => {
    setFormData(prev => ({ ...prev, [`${step}_${field}`]: value }));
  };


  const handleAskCopilot = async (stepContext: string) => {
    setIsLoadingCopilot(true);
    toast({
      title: "Asking AI Co-Pilot...",
      description: `Getting information related to: ${stepContext}`,
    });

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    let mockResponseDescription = `For ${stepContext}, ensure all data is accurate and verifiable according to the EU Battery Regulation. Specific guidance can be found in the relevant annexes of the regulation.`;

    if (stepContext === euBatteryRegulationSteps[0].title) { // General Information
        mockResponseDescription = `For General Information, ensure you provide accurate battery model identifiers and clearly define all typical intended uses. If a safety data sheet (SDS) is available, linking its URL strengthens your compliance position. Refer to Annex VI of the EU Battery Regulation for specific data elements required under this section.`;
    } else if (stepContext === euBatteryRegulationSteps[1].title) { // Manufacturer Details
        mockResponseDescription = `For Manufacturer Details, clearly identify the legal manufacturer, including their registered trade name and postal address. The contact person (name, email, phone) should be easily reachable for compliance inquiries. Ensure this information precisely matches official business registries.`;
    } else if (stepContext === euBatteryRegulationSteps[2].title) { // Material Composition
        mockResponseDescription = `For Material Composition, accurately declare percentages of Cobalt, Lithium, Natural Graphite, and Nickel if present. Specify presence and/or concentration of restricted substances like Lead, Mercury, and Cadmium. List any other SVHCs present above 0.1% w/w. Refer to Annex I of the EU Battery Regulation for detailed requirements and thresholds.`;
    } else if (stepContext === euBatteryRegulationSteps[3].title) { // Carbon Footprint
        mockResponseDescription = `For Carbon Footprint, provide the total cradle-to-gate carbon footprint for the battery's manufacturing. Specify the unit (e.g., kg CO₂e/kWh of total energy over service life) and data source (e.g., PEFCR for Batteries, internal LCA study). Optionally, detail reductions from recycled content, or specific footprints for transport and end-of-life. Refer to Annex II of the EU Battery Regulation for detailed requirements.`;
    } else if (stepContext === euBatteryRegulationSteps[4].title) { // Performance & Durability
        mockResponseDescription = `For Performance & Durability, provide rated capacity (e.g., '100 Ah'), nominal voltage (e.g., '48V'), expected lifetime (e.g., '2000 cycles at 80% DoD'), operating temperature range (e.g., '-20°C to 60°C'), internal resistance (e.g., '<50 mOhms'), and power capability (e.g., '5 kW continuous'). State compliance with key safety tests like IEC 62133, UN 38.3, or IEC 62619. Refer to Annex IV of the EU Battery Regulation.`;
    } else if (stepContext === euBatteryRegulationSteps[5].title) { // Recycled Content
        mockResponseDescription = `For Recycled Content, accurately declare the percentage by weight of recovered cobalt, lead, lithium, and nickel used in active materials of the battery. This information is crucial for demonstrating circularity. Specify the data source and methodology for these declarations. Refer to Annex VII of the EU Battery Regulation for minimum thresholds and calculation methodologies. Providing a URL to verification documents is recommended.`;
    } else if (stepContext === euBatteryRegulationSteps[6].title) { // Supply Chain Due Diligence
        mockResponseDescription = `For Supply Chain Due Diligence, describe your policies for responsible sourcing of raw materials, especially Cobalt, Lithium, Natural Graphite, and Nickel. Align with OECD Due Diligence Guidance. If you have a public report on your due diligence activities, provide a link. This is crucial for demonstrating ethical and sustainable sourcing practices as required by Annex X of the EU Battery Regulation.`;
    } else if (stepContext === euBatteryRegulationSteps[7].title) { // Collection & Recycling
        mockResponseDescription = `For Collection & Recycling, detail how producer responsibility obligations are met. Provide a URL to information on collection and recycling schemes. Describe take-back systems and report on achievement of recycling efficiency and material recovery targets as per Annex XII of the EU Battery Regulation. This includes targets for Cobalt, Copper, Lead, Lithium, and Nickel recovery.`;
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
    const currentStepDetails = euBatteryRegulationSteps.find(s => s.id === stepId);
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
                <Label htmlFor="step1_batteryModel">Battery Model Name / Identifier</Label>
                <Input id="step1_batteryModel" value={formData.step1_batteryModel || ""} onChange={(e) => handleInputChange("step1", "batteryModel", e.target.value)} placeholder="e.g., PowerCell Max 5000, LFP-Module-48V" />
              </div>
              <div>
                <Label htmlFor="step1_intendedApplication">Intended Application(s)</Label>
                <Textarea id="step1_intendedApplication" value={formData.step1_intendedApplication || ""} onChange={(e) => handleInputChange("step1", "intendedApplication", e.target.value)} placeholder="e.g., Electric vehicles, Portable electronics, Grid storage, Industrial equipment" />
              </div>
              <div>
                <Label htmlFor="step1_safetySheetUrl">Safety Data Sheet URL (Optional)</Label>
                <Input id="step1_safetySheetUrl" value={formData.step1_safetySheetUrl || ""} onChange={(e) => handleInputChange("step1", "safetySheetUrl", e.target.value)} placeholder="https://example.com/sds/powercell_max_5000.pdf" />
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
                <Label htmlFor="step2_manufacturerName">Manufacturer Name</Label>
                <Input id="step2_manufacturerName" value={formData.step2_manufacturerName || ""} onChange={(e) => handleInputChange("step2", "manufacturerName", e.target.value)} placeholder="e.g., ACME Batteries Corp." />
              </div>
              <div>
                <Label htmlFor="step2_manufacturerAddress">Manufacturer Registered Address</Label>
                <Textarea id="step2_manufacturerAddress" value={formData.step2_manufacturerAddress || ""} onChange={(e) => handleInputChange("step2", "manufacturerAddress", e.target.value)} placeholder="e.g., 123 Battery Lane, Tech City, TC 54321, Country" />
              </div>
              <div>
                <Label htmlFor="step2_manufacturerContact">Responsible Contact Person (Name / Email)</Label>
                <Input id="step2_manufacturerContact" value={formData.step2_manufacturerContact || ""} onChange={(e) => handleInputChange("step2", "manufacturerContact", e.target.value)} placeholder="e.g., Jane Doe / compliance@acmebatteries.com" />
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[1].title)} disabled={isLoadingCopilot}>
                {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                Ask Co-Pilot about this step
              </Button>
            </CardContent>
          </Card>
        );
      case "step3":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{euBatteryRegulationSteps[2].title}</CardTitle>
              <CardDescription>{euBatteryRegulationSteps[2].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <h4 className="font-medium text-md text-primary">Critical Raw Materials (CRM) Content (%)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="step3_cobaltPercentage">Cobalt (Co)</Label>
                    <Input id="step3_cobaltPercentage" type="number" value={formData.step3_cobaltPercentage || ""} onChange={(e) => handleInputChange("step3", "cobaltPercentage", e.target.valueAsNumber)} placeholder="e.g., 15" />
                  </div>
                  <div>
                    <Label htmlFor="step3_lithiumPercentage">Lithium (Li)</Label>
                    <Input id="step3_lithiumPercentage" type="number" value={formData.step3_lithiumPercentage || ""} onChange={(e) => handleInputChange("step3", "lithiumPercentage", e.target.valueAsNumber)} placeholder="e.g., 5" />
                  </div>
                  <div>
                    <Label htmlFor="step3_naturalGraphitePercentage">Natural Graphite</Label>
                    <Input id="step3_naturalGraphitePercentage" type="number" value={formData.step3_naturalGraphitePercentage || ""} onChange={(e) => handleInputChange("step3", "naturalGraphitePercentage", e.target.valueAsNumber)} placeholder="e.g., 10" />
                  </div>
                  <div>
                    <Label htmlFor="step3_nickelPercentage">Nickel (Ni)</Label>
                    <Input id="step3_nickelPercentage" type="number" value={formData.step3_nickelPercentage || ""} onChange={(e) => handleInputChange("step3", "nickelPercentage", e.target.valueAsNumber)} placeholder="e.g., 20" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Declare the percentage by weight of these CRMs if present in the battery. Omit or use '0' if not present.</p>
              </div>

              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <h4 className="font-medium text-md text-primary">Restricted Substances</h4>
                <div>
                  <Label htmlFor="step3_leadContent">Lead (Pb) Content (%)</Label>
                  <Input id="step3_leadContent" type="number" value={formData.step3_leadContent || ""} onChange={(e) => handleInputChange("step3", "leadContent", e.target.valueAsNumber)} placeholder="e.g., 0.005 (Max 0.01%)" />
                </div>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <Label className="mb-1 block">Mercury (Hg) Present?</Label>
                    <RadioGroup value={formData.step3_mercuryPresent || "no"} onValueChange={(value) => handleRadioChange("step3", "mercuryPresent", value)} className="flex gap-4">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="hg_yes" /><Label htmlFor="hg_yes" className="font-normal">Yes</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="hg_no" /><Label htmlFor="hg_no" className="font-normal">No</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-1 block">Cadmium (Cd) Present?</Label>
                    <RadioGroup value={formData.step3_cadmiumPresent || "no"} onValueChange={(value) => handleRadioChange("step3", "cadmiumPresent", value)} className="flex gap-4">
                       <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="cd_yes" /><Label htmlFor="cd_yes" className="font-normal">Yes</Label></div>
                       <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="cd_no" /><Label htmlFor="cd_no" className="font-normal">No</Label></div>
                    </RadioGroup>
                  </div>
                </div>
                 <p className="text-xs text-muted-foreground mt-1">Batteries shall not contain mercury >0.0005% or cadmium >0.002% by weight, or lead >0.01% by weight (unless specific exemptions apply).</p>
              </div>
              
              <div>
                <Label htmlFor="step3_otherSVHCs">Other SVHCs (Substances of Very High Concern)</Label>
                <Textarea id="step3_otherSVHCs" value={formData.step3_otherSVHCs || ""} onChange={(e) => handleInputChange("step3", "otherSVHCs", e.target.value)} placeholder="List any other SVHCs present above 0.1% w/w, their CAS numbers, and concentrations. E.g., Substance X (CAS: 123-45-6) - 0.15%" />
                <p className="text-xs text-muted-foreground mt-1">Refer to the ECHA Candidate List for SVHCs.</p>
              </div>

              <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[2].title)} disabled={isLoadingCopilot}>
                {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                Ask Co-Pilot about this step
              </Button>
            </CardContent>
          </Card>
        );
      case "step4":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{euBatteryRegulationSteps[3].title}</CardTitle>
              <CardDescription>{euBatteryRegulationSteps[3].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="step4_mfgCarbonFootprint">Total Manufacturing Carbon Footprint</Label>
                  <Input id="step4_mfgCarbonFootprint" type="number" value={formData.step4_mfgCarbonFootprint || ""} onChange={(e) => handleInputChange("step4", "mfgCarbonFootprint", e.target.valueAsNumber)} placeholder="e.g., 1500" />
                </div>
                <div>
                  <Label htmlFor="step4_mfgCFUnit">Unit</Label>
                  <Select value={formData.step4_mfgCFUnit} onValueChange={(value) => handleSelectChange("step4", "mfgCFUnit", value)}>
                    <SelectTrigger id="step4_mfgCFUnit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg_co2e_kwh_total_life">kg CO₂e / kWh of total energy over service life</SelectItem>
                      <SelectItem value="kg_co2e_per_battery">kg CO₂e / per battery unit</SelectItem>
                      <SelectItem value="g_co2e_per_cell">g CO₂e / per cell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground -mt-4">Provide the total cradle-to-gate carbon footprint for the battery's manufacturing phase.</p>
              <div>
                <Label htmlFor="step4_mfgCFDataSource">Data Source & Methodology</Label>
                <Textarea id="step4_mfgCFDataSource" value={formData.step4_mfgCFDataSource || ""} onChange={(e) => handleInputChange("step4", "mfgCFDataSource", e.target.value)} placeholder="e.g., PEFCR for Batteries v1.2, Internal LCA study (2023), ISO 14067" />
                <p className="text-xs text-muted-foreground mt-1">Specify the Product Environmental Footprint Category Rules (PEFCR), relevant ISO standard (e.g., ISO 14067), or other LCA methodology used.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="step4_recycledContentCFReduction">Reduction from Recycled Content (Optional)</Label>
                  <Input id="step4_recycledContentCFReduction" type="number" value={formData.step4_recycledContentCFReduction || ""} onChange={(e) => handleInputChange("step4", "recycledContentCFReduction", e.target.valueAsNumber)} placeholder="e.g., 50 (kg CO₂e/kWh)" />
                  <p className="text-xs text-muted-foreground mt-1">Estimated carbon footprint reduction attributable to recycled content.</p>
                </div>
                 <div>
                  <Label htmlFor="step4_transportCF">Transport Carbon Footprint (Optional)</Label>
                  <Input id="step4_transportCF" type="number" value={formData.step4_transportCF || ""} onChange={(e) => handleInputChange("step4", "transportCF", e.target.valueAsNumber)} placeholder="e.g., 25.5 (kg CO₂e/kWh)" />
                  <p className="text-xs text-muted-foreground mt-1">CF of transporting battery to first point of sale/use in EU.</p>
                </div>
              </div>
              <div>
                <Label htmlFor="step4_eolCF">End-of-Life Carbon Footprint/Credit (Optional)</Label>
                <Input id="step4_eolCF" type="number" value={formData.step4_eolCF || ""} onChange={(e) => handleInputChange("step4", "eolCF", e.target.valueAsNumber)} placeholder="e.g., -10 (kg CO₂e/kWh for credit)" />
                <p className="text-xs text-muted-foreground mt-1">Estimated CF or credit associated with the battery's end-of-life phase.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[3].title)} disabled={isLoadingCopilot}>
                {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                Ask Co-Pilot about this step
              </Button>
            </CardContent>
          </Card>
        );
      case "step5":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{euBatteryRegulationSteps[4].title}</CardTitle>
              <CardDescription>{euBatteryRegulationSteps[4].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="step5_ratedCapacity">Rated Capacity</Label>
                  <Input id="step5_ratedCapacity" value={formData.step5_ratedCapacity || ""} onChange={(e) => handleInputChange("step5", "ratedCapacity", e.target.value)} placeholder="e.g., 100 Ah or 5 kWh" />
                </div>
                <div>
                  <Label htmlFor="step5_nominalVoltage">Nominal Voltage</Label>
                  <Input id="step5_nominalVoltage" value={formData.step5_nominalVoltage || ""} onChange={(e) => handleInputChange("step5", "nominalVoltage", e.target.value)} placeholder="e.g., 48V" />
                </div>
              </div>
              <div>
                <Label htmlFor="step5_expectedLifetimeCycles">Expected Lifetime / Cycle Life</Label>
                <Input id="step5_expectedLifetimeCycles" value={formData.step5_expectedLifetimeCycles || ""} onChange={(e) => handleInputChange("step5", "expectedLifetimeCycles", e.target.value)} placeholder="e.g., 2000 cycles @ 80% DoD" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="step5_operatingTemperatureRange">Operating Temperature Range</Label>
                  <Input id="step5_operatingTemperatureRange" value={formData.step5_operatingTemperatureRange || ""} onChange={(e) => handleInputChange("step5", "operatingTemperatureRange", e.target.value)} placeholder="e.g., -20°C to 60°C" />
                </div>
                <div>
                  <Label htmlFor="step5_internalResistance">Internal Resistance</Label>
                  <Input id="step5_internalResistance" value={formData.step5_internalResistance || ""} onChange={(e) => handleInputChange("step5", "internalResistance", e.target.value)} placeholder="e.g., <50 mOhms at 25°C" />
                </div>
              </div>
              <div>
                <Label htmlFor="step5_powerCapability">Power Capability</Label>
                <Input id="step5_powerCapability" value={formData.step5_powerCapability || ""} onChange={(e) => handleInputChange("step5", "powerCapability", e.target.value)} placeholder="e.g., 5 kW continuous, 10 kW peak (10s)" />
              </div>
              <div>
                <Label htmlFor="step5_safetyTestCompliance">Safety Test Compliance</Label>
                <Textarea id="step5_safetyTestCompliance" value={formData.step5_safetyTestCompliance || ""} onChange={(e) => handleInputChange("step5", "safetyTestCompliance", e.target.value)} placeholder="List key safety standards complied with, e.g., IEC 62133, UN 38.3, IEC 62619." />
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[4].title)} disabled={isLoadingCopilot}>
                {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                Ask Co-Pilot about this step
              </Button>
            </CardContent>
          </Card>
        );
      case "step6":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Recycle className="mr-2 h-5 w-5 text-green-600" />{euBatteryRegulationSteps[5].title}</CardTitle>
              <CardDescription>{euBatteryRegulationSteps[5].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">Declare the minimum percentage by weight of recovered cobalt, lead, lithium, and nickel present in active materials in the battery, reused from manufacturing waste or post-consumer waste.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="step6_recycledCobaltPercentage">Recycled Cobalt (%)</Label>
                  <Input id="step6_recycledCobaltPercentage" type="number" value={formData.step6_recycledCobaltPercentage || ""} onChange={(e) => handleInputChange("step6", "recycledCobaltPercentage", e.target.valueAsNumber)} placeholder="e.g., 16" />
                </div>
                <div>
                  <Label htmlFor="step6_recycledLeadPercentage">Recycled Lead (%)</Label>
                  <Input id="step6_recycledLeadPercentage" type="number" value={formData.step6_recycledLeadPercentage || ""} onChange={(e) => handleInputChange("step6", "recycledLeadPercentage", e.target.valueAsNumber)} placeholder="e.g., 85" />
                </div>
                <div>
                  <Label htmlFor="step6_recycledLithiumPercentage">Recycled Lithium (%)</Label>
                  <Input id="step6_recycledLithiumPercentage" type="number" value={formData.step6_recycledLithiumPercentage || ""} onChange={(e) => handleInputChange("step6", "recycledLithiumPercentage", e.target.valueAsNumber)} placeholder="e.g., 6" />
                </div>
                <div>
                  <Label htmlFor="step6_recycledNickelPercentage">Recycled Nickel (%)</Label>
                  <Input id="step6_recycledNickelPercentage" type="number" value={formData.step6_recycledNickelPercentage || ""} onChange={(e) => handleInputChange("step6", "recycledNickelPercentage", e.target.valueAsNumber)} placeholder="e.g., 6" />
                </div>
              </div>
               <div>
                <Label htmlFor="step6_recycledContentDataSource">Data Source & Methodology</Label>
                <Textarea id="step6_recycledContentDataSource" value={formData.step6_recycledContentDataSource || ""} onChange={(e) => handleInputChange("step6", "recycledContentDataSource", e.target.value)} placeholder="e.g., Internal mass balance calculation, Supplier declarations verified by XYZ Standard." />
                <p className="text-xs text-muted-foreground mt-1">Specify how the recycled content percentages were determined.</p>
              </div>
              <div>
                <Label htmlFor="step6_recycledContentVerificationUrl">Verification Document URL (Optional)</Label>
                <Input id="step6_recycledContentVerificationUrl" value={formData.step6_recycledContentVerificationUrl || ""} onChange={(e) => handleInputChange("step6", "recycledContentVerificationUrl", e.target.value)} placeholder="https://example.com/docs/recycled_content_verification.pdf" />
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[5].title)} disabled={isLoadingCopilot}>
                {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                Ask Co-Pilot about this step
              </Button>
            </CardContent>
          </Card>
        );
      case "step7":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Handshake className="mr-2 h-5 w-5 text-primary" />{euBatteryRegulationSteps[6].title}</CardTitle>
              <CardDescription>{euBatteryRegulationSteps[6].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="step7_dueDiligencePolicies">Description of Due Diligence Policies</Label>
                <Textarea id="step7_dueDiligencePolicies" value={formData.step7_dueDiligencePolicies || ""} onChange={(e) => handleInputChange("step7", "dueDiligencePolicies", e.target.value)} placeholder="Describe your company's due diligence policies for responsible sourcing of Cobalt, Lithium, Natural Graphite, and Nickel. Refer to OECD guidance." rows={5}/>
                <p className="text-xs text-muted-foreground mt-1">Include information on risk assessment, mitigation measures, and supplier engagement related to human rights, labor, environmental, and ethical issues.</p>
              </div>
              <div>
                <Label className="mb-1 block">Is a Due Diligence Report Publicly Available?</Label>
                <RadioGroup value={formData.step7_isReportPublic || "no"} onValueChange={(value) => handleRadioChange("step7", "isReportPublic", value)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="report_public_yes" /><Label htmlFor="report_public_yes" className="font-normal">Yes</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="report_public_no" /><Label htmlFor="report_public_no" className="font-normal">No</Label></div>
                </RadioGroup>
              </div>
              {formData.step7_isReportPublic === "yes" && (
                 <div>
                    <Label htmlFor="step7_publicReportUrl">URL to Public Due Diligence Report</Label>
                    <Input id="step7_publicReportUrl" value={formData.step7_publicReportUrl || ""} onChange={(e) => handleInputChange("step7", "publicReportUrl", e.target.value)} placeholder="https://example.com/sustainability/due_diligence_report_2023.pdf" />
                </div>
              )}
               <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[6].title)} disabled={isLoadingCopilot}>
                {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                Ask Co-Pilot about this step
              </Button>
            </CardContent>
          </Card>
        );
    case "step8":
        return (
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><PackageCheck className="mr-2 h-5 w-5 text-primary" />{euBatteryRegulationSteps[7].title}</CardTitle>
                <CardDescription>{euBatteryRegulationSteps[7].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="step8_producerResponsibilityStatement">Producer Responsibility Statement</Label>
                    <Textarea id="step8_producerResponsibilityStatement" value={formData.step8_producerResponsibilityStatement || ""} onChange={(e) => handleInputChange("step8", "producerResponsibilityStatement", e.target.value)} placeholder="Describe how producer responsibility obligations are met (e.g., financing of collection and recycling, participation in EPR schemes)." rows={4}/>
                </div>
                <div>
                    <Label htmlFor="step8_collectionRecyclingInfoUrl">URL to Collection & Recycling Information</Label>
                    <Input id="step8_collectionRecyclingInfoUrl" type="url" value={formData.step8_collectionRecyclingInfoUrl || ""} onChange={(e) => handleInputChange("step8", "collectionRecyclingInfoUrl", e.target.value)} placeholder="https://example.com/battery-recycling-info" />
                    <p className="text-xs text-muted-foreground mt-1">Link to publicly available information on collection, take-back, and recycling schemes.</p>
                </div>
                <div>
                    <Label htmlFor="step8_takeBackSchemesDescription">Description of Take-back & Collection Schemes</Label>
                    <Textarea id="step8_takeBackSchemesDescription" value={formData.step8_takeBackSchemesDescription || ""} onChange={(e) => handleInputChange("step8", "takeBackSchemesDescription", e.target.value)} placeholder="Detail the schemes in place for battery collection and take-back." rows={3}/>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Label className="mb-2 block">Recycling Efficiency Targets Met?</Label>
                        <RadioGroup value={formData.step8_recyclingEfficiencyTargetMet || "not_yet_assessed"} onValueChange={(value) => handleRadioChange("step8", "recyclingEfficiencyTargetMet", value)} className="space-y-1.5">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="ret_yes" /><Label htmlFor="ret_yes" className="font-normal">Yes</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="ret_no" /><Label htmlFor="ret_no" className="font-normal">No</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="partially" id="ret_partially" /><Label htmlFor="ret_partially" className="font-normal">Partially</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="not_applicable" id="ret_na" /><Label htmlFor="ret_na" className="font-normal">Not Applicable</Label></div>
                             <div className="flex items-center space-x-2"><RadioGroupItem value="not_yet_assessed" id="ret_nya" /><Label htmlFor="ret_nya" className="font-normal">Not Yet Assessed</Label></div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground mt-1">As per Annex XII, Part B.</p>
                    </div>
                    <div>
                        <Label className="mb-2 block">Material Recovery Targets Met?</Label>
                        <RadioGroup value={formData.step8_materialRecoveryTargetsMet || "not_yet_assessed"} onValueChange={(value) => handleRadioChange("step8", "materialRecoveryTargetsMet", value)} className="space-y-1.5">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="mrt_yes" /><Label htmlFor="mrt_yes" className="font-normal">Yes</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="mrt_no" /><Label htmlFor="mrt_no" className="font-normal">No</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="partially" id="mrt_partially" /><Label htmlFor="mrt_partially" className="font-normal">Partially</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="not_applicable" id="mrt_na" /><Label htmlFor="mrt_na" className="font-normal">Not Applicable</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="not_yet_assessed" id="mrt_nya" /><Label htmlFor="mrt_nya" className="font-normal">Not Yet Assessed</Label></div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground mt-1">For Cobalt, Copper, Lead, Lithium, Nickel (Annex XII, Part B).</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleAskCopilot(euBatteryRegulationSteps[7].title)} disabled={isLoadingCopilot}>
                    {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                    Ask Co-Pilot about this step
                </Button>
            </CardContent>
            </Card>
        );
      default:
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{currentStepDetails?.title || "Step Details"}</CardTitle>
                    <CardDescription>{currentStepDetails?.description || "Information for this step."}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Content for {currentStepDetails?.title || "this step"} will be available soon.</p>
                     <Button className="mt-4" variant="outline" size="sm" onClick={() => handleAskCopilot(currentStepDetails?.title || "this step context")} disabled={isLoadingCopilot}>
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
                    <Button onClick={() => {
                        toast({
                            title: "Mock Submission",
                            description: "This is a conceptual final submission. All data would be validated and sent to relevant authorities.",
                            duration: 5000,
                            action: <AlertTriangle className="text-white" />
                        });
                        setActiveStep(euBatteryRegulationSteps[0].id); // Reset to first step
                    }} 
                    className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <CheckCircle className="mr-2 h-4 w-4"/>
                        Final Review & Submit (Mock)
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


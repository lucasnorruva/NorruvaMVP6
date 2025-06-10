"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Lightbulb, Recycle, Handshake, PackageCheck, SearchCheck } from 'lucide-react';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon?: React.ElementType;
}

interface BatteryRegulationStepProps {
  step: WizardStep;
  formData: Record<string, any>;
  onInputChange: (step: string, field: string, value: string | number) => void;
  onRadioChange: (step: string, field: string, value: string) => void;
  onSelectChange: (step: string, field: string, value: string) => void;
  onAskCopilot: (context: string) => void;
}

export default function BatteryRegulationStep({
  step,
  formData,
  onInputChange,
  onRadioChange,
  onSelectChange,
  onAskCopilot,
}: BatteryRegulationStepProps) {
  const { id } = step;
  switch (id) {
    case "step1":
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
    case "step2":
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
    case "step3":
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
    case "step4":
      return (
        <Card>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="step4_mfgCarbonFootprint">Total Manufacturing Carbon Footprint</Label>
                <Input
                  id="step4_mfgCarbonFootprint"
                  type="number"
                  value={formData.step4_mfgCarbonFootprint || ""}
                  onChange={(e) => onInputChange("step4", "mfgCarbonFootprint", e.target.valueAsNumber)}
                  placeholder="e.g., 1500"
                />
              </div>
              <div>
                <Label htmlFor="step4_mfgCFUnit">Unit</Label>
                <Select value={formData.step4_mfgCFUnit} onValueChange={(value) => onSelectChange("step4", "mfgCFUnit", value)}>
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
              <Textarea
                id="step4_mfgCFDataSource"
                value={formData.step4_mfgCFDataSource || ""}
                onChange={(e) => onInputChange("step4", "mfgCFDataSource", e.target.value)}
                placeholder="e.g., PEFCR for Batteries v1.2, Internal LCA study (2023), ISO 14067"
              />
              <p className="text-xs text-muted-foreground mt-1">Specify the Product Environmental Footprint Category Rules (PEFCR), relevant ISO standard (e.g., ISO 14067), or other LCA methodology used.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="step4_recycledContentCFReduction">Reduction from Recycled Content (Optional)</Label>
                <Input
                  id="step4_recycledContentCFReduction"
                  type="number"
                  value={formData.step4_recycledContentCFReduction || ""}
                  onChange={(e) => onInputChange("step4", "recycledContentCFReduction", e.target.valueAsNumber)}
                  placeholder="e.g., 50 (kg CO₂e/kWh)"
                />
                <p className="text-xs text-muted-foreground mt-1">Estimated carbon footprint reduction attributable to recycled content.</p>
              </div>
              <div>
                <Label htmlFor="step4_transportCF">Transport Carbon Footprint (Optional)</Label>
                <Input
                  id="step4_transportCF"
                  type="number"
                  value={formData.step4_transportCF || ""}
                  onChange={(e) => onInputChange("step4", "transportCF", e.target.valueAsNumber)}
                  placeholder="e.g., 25.5 (kg CO₂e/kWh)"
                />
                <p className="text-xs text-muted-foreground mt-1">CF of transporting battery to first point of sale/use in EU.</p>
              </div>
            </div>
            <div>
              <Label htmlFor="step4_eolCF">End-of-Life Carbon Footprint/Credit (Optional)</Label>
              <Input
                id="step4_eolCF"
                type="number"
                value={formData.step4_eolCF || ""}
                onChange={(e) => onInputChange("step4", "eolCF", e.target.valueAsNumber)}
                placeholder="e.g., -10 (kg CO₂e/kWh for credit)"
              />
              <p className="text-xs text-muted-foreground mt-1">Estimated CF or credit associated with the battery's end-of-life phase.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
              <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
              Ask Co-Pilot about this step
            </Button>
          </CardContent>
        </Card>
      );
    case "step5":
      return (
        <Card>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="step5_ratedCapacity">Rated Capacity</Label>
                <Input
                  id="step5_ratedCapacity"
                  value={formData.step5_ratedCapacity || ""}
                  onChange={(e) => onInputChange("step5", "ratedCapacity", e.target.value)}
                  placeholder="e.g., 100 Ah or 5 kWh"
                />
              </div>
              <div>
                <Label htmlFor="step5_nominalVoltage">Nominal Voltage</Label>
                <Input
                  id="step5_nominalVoltage"
                  value={formData.step5_nominalVoltage || ""}
                  onChange={(e) => onInputChange("step5", "nominalVoltage", e.target.value)}
                  placeholder="e.g., 48V"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="step5_expectedLifetimeCycles">Expected Lifetime / Cycle Life</Label>
              <Input
                id="step5_expectedLifetimeCycles"
                value={formData.step5_expectedLifetimeCycles || ""}
                onChange={(e) => onInputChange("step5", "expectedLifetimeCycles", e.target.value)}
                placeholder="e.g., 2000 cycles @ 80% DoD"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="step5_operatingTemperatureRange">Operating Temperature Range</Label>
                <Input
                  id="step5_operatingTemperatureRange"
                  value={formData.step5_operatingTemperatureRange || ""}
                  onChange={(e) => onInputChange("step5", "operatingTemperatureRange", e.target.value)}
                  placeholder="e.g., -20°C to 60°C"
                />
              </div>
              <div>
                <Label htmlFor="step5_internalResistance">Internal Resistance</Label>
                <Input
                  id="step5_internalResistance"
                  value={formData.step5_internalResistance || ""}
                  onChange={(e) => onInputChange("step5", "internalResistance", e.target.value)}
                  placeholder="e.g., <50 mOhms at 25°C"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="step5_powerCapability">Power Capability</Label>
              <Input
                id="step5_powerCapability"
                value={formData.step5_powerCapability || ""}
                onChange={(e) => onInputChange("step5", "powerCapability", e.target.value)}
                placeholder="e.g., 5 kW continuous, 10 kW peak (10s)"
              />
            </div>
            <div>
              <Label htmlFor="step5_safetyTestCompliance">Safety Test Compliance</Label>
              <Textarea
                id="step5_safetyTestCompliance"
                value={formData.step5_safetyTestCompliance || ""}
                onChange={(e) => onInputChange("step5", "safetyTestCompliance", e.target.value)}
                placeholder="List key safety standards complied with, e.g., IEC 62133, UN 38.3, IEC 62619."
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
              <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
              Ask Co-Pilot about this step
            </Button>
          </CardContent>
        </Card>
      );
    case "step6":
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Recycle className="mr-2 h-5 w-5 text-green-600" />
              {step.title}
            </CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Declare the minimum percentage by weight of recovered cobalt, lead, lithium, and nickel present in active materials in the battery, reused from manufacturing waste or post-consumer waste.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="step6_recycledCobaltPercentage">Recycled Cobalt (%)</Label>
                <Input
                  id="step6_recycledCobaltPercentage"
                  type="number"
                  value={formData.step6_recycledCobaltPercentage || ""}
                  onChange={(e) => onInputChange("step6", "recycledCobaltPercentage", e.target.valueAsNumber)}
                  placeholder="e.g., 16"
                />
              </div>
              <div>
                <Label htmlFor="step6_recycledLeadPercentage">Recycled Lead (%)</Label>
                <Input
                  id="step6_recycledLeadPercentage"
                  type="number"
                  value={formData.step6_recycledLeadPercentage || ""}
                  onChange={(e) => onInputChange("step6", "recycledLeadPercentage", e.target.valueAsNumber)}
                  placeholder="e.g., 85"
                />
              </div>
              <div>
                <Label htmlFor="step6_recycledLithiumPercentage">Recycled Lithium (%)</Label>
                <Input
                  id="step6_recycledLithiumPercentage"
                  type="number"
                  value={formData.step6_recycledLithiumPercentage || ""}
                  onChange={(e) => onInputChange("step6", "recycledLithiumPercentage", e.target.valueAsNumber)}
                  placeholder="e.g., 6"
                />
              </div>
              <div>
                <Label htmlFor="step6_recycledNickelPercentage">Recycled Nickel (%)</Label>
                <Input
                  id="step6_recycledNickelPercentage"
                  type="number"
                  value={formData.step6_recycledNickelPercentage || ""}
                  onChange={(e) => onInputChange("step6", "recycledNickelPercentage", e.target.valueAsNumber)}
                  placeholder="e.g., 6"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="step6_recycledContentDataSource">Data Source & Methodology</Label>
              <Textarea
                id="step6_recycledContentDataSource"
                value={formData.step6_recycledContentDataSource || ""}
                onChange={(e) => onInputChange("step6", "recycledContentDataSource", e.target.value)}
                placeholder="e.g., Internal mass balance calculation, Supplier declarations verified by XYZ Standard."
              />
              <p className="text-xs text-muted-foreground mt-1">Specify how the recycled content percentages were determined.</p>
            </div>
            <div>
              <Label htmlFor="step6_recycledContentVerificationUrl">Verification Document URL (Optional)</Label>
              <Input
                id="step6_recycledContentVerificationUrl"
                value={formData.step6_recycledContentVerificationUrl || ""}
                onChange={(e) => onInputChange("step6", "recycledContentVerificationUrl", e.target.value)}
                placeholder="https://example.com/docs/recycled_content_verification.pdf"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
              <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
              Ask Co-Pilot about this step
            </Button>
          </CardContent>
        </Card>
      );
    case "step7":
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
              <Label htmlFor="step7_dueDiligencePolicies">Description of Due Diligence Policies</Label>
              <Textarea
                id="step7_dueDiligencePolicies"
                value={formData.step7_dueDiligencePolicies || ""}
                onChange={(e) => onInputChange("step7", "dueDiligencePolicies", e.target.value)}
                placeholder="Describe your company's due diligence policies for responsible sourcing of Cobalt, Lithium, Natural Graphite, and Nickel. Refer to OECD guidance."
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-1">Include information on risk assessment, mitigation measures, and supplier engagement related to human rights, labor, environmental, and ethical issues.</p>
            </div>
            <div>
              <Label className="mb-1 block">Is a Due Diligence Report Publicly Available?</Label>
              <RadioGroup
                value={formData.step7_isReportPublic || "no"}
                onValueChange={(value) => onRadioChange("step7", "isReportPublic", value)}
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
                <Label htmlFor="step7_publicReportUrl">URL to Public Due Diligence Report</Label>
                <Input
                  id="step7_publicReportUrl"
                  value={formData.step7_publicReportUrl || ""}
                  onChange={(e) => onInputChange("step7", "publicReportUrl", e.target.value)}
                  placeholder="https://example.com/sustainability/due_diligence_report_2023.pdf"
                />
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => onAskCopilot(step.title)}>
              <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
              Ask Co-Pilot about this step
            </Button>
          </CardContent>
        </Card>
      );
    case "step8":
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
    case "step9":
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
    default:
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
}

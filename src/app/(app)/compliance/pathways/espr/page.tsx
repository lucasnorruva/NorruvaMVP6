
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Lightbulb, CheckCircle, Loader2, Info, Recycle, Package, Wrench, FileText as FileTextIcon, SearchCheck, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon?: React.ElementType;
}

const esprPathwaySteps: WizardStep[] = [
  { id: "step1", title: "Product Categorization & Scope", description: "Identify if your product falls under ESPR and relevant product group requirements.", icon: Package },
  { id: "step2", title: "Ecodesign Parameters", description: "Address key ecodesign aspects like durability, repairability, and recycled content.", icon: Recycle },
  { id: "step3", title: "Information Requirements & DPP Data", description: "List key data elements for the DPP as per ESPR.", icon: FileTextIcon },
  { id: "step4", title: "DPP Linkage & Accessibility", description: "Ensure the product has a DPP and it's correctly linked and accessible.", icon: ExternalLink },
  { id: "step5", title: "Conformity Assessment", description: "Detail the conformity assessment procedure and Declaration of Conformity.", icon: Wrench },
  { id: "step6", title: "Market Surveillance Data", description: "Provide information for market surveillance authorities.", icon: SearchCheck },
  { id: "step7", title: "Review & Submit", description: "Verify all ESPR information and prepare for conceptual submission.", icon: CheckCircle },
];

export default function EsprPathwayPage() {
  const [activeStep, setActiveStep] = useState<string>(esprPathwaySteps[0].id);
  const [formData, setFormData] = useState<Record<string, any>>({
    step1_productCategory: "",
    step1_esprProductGroup: "",
    step1_applicableAnnexes: "",
    step2_durabilityInfo: "",
    step2_repairabilityInfo: "",
    step2_recycledContentInfo: "",
    step2_energyEfficiencyInfo: "",
    step2_substanceRestrictionsInfo: "",
    step3_dppDataPoints: "",
    step3_dataVerificationProcess: "",
    step4_dppId: "",
    step4_dppPublicUrl: "",
    step4_qrCodeStrategy: "",
    step5_conformityProcedure: "module_a",
    step5_declarationOfConformityUrl: "",
    step5_notifiedBodyId: "",
    step6_marketSurveillanceContact: "",
    step6_batchTraceabilityInfo: "",
    step7_finalReviewCheck: false,
  });
  const [isLoadingCopilot, setIsLoadingCopilot] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (step: string, field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [`${step}_${field}`]: value }));
  };

  const handleSelectChange = (step: string, field: string, value: string) => {
    setFormData(prev => ({ ...prev, [`${step}_${field}`]: value }));
  };

  const handleAskCopilot = async (stepContext: string) => {
    setIsLoadingCopilot(true);
    toast({
      title: "Asking AI Co-Pilot...",
      description: `Getting information related to ESPR: ${stepContext}`,
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    let mockResponseDescription = `For ESPR step '${stepContext}', it's crucial to consult the specific product group delegated acts. Ensure all data is documented and verifiable. The DPP will be key for transparency.`;

    // Custom mock responses per step (conceptual)
    if (stepContext === esprPathwaySteps[0].title) {
        mockResponseDescription = `For '${stepContext}', accurately determine your product's category under ESPR. Check the European Commission's website for latest product group lists and specific delegated acts. This determines which specific ecodesign and information requirements apply.`;
    } else if (stepContext === esprPathwaySteps[1].title) {
        mockResponseDescription = `For '${stepContext}', detail how your product addresses durability (e.g., expected lifetime, resistance to wear), repairability (e.g., availability of spare parts, ease of disassembly), recycled content (percentage and type), energy efficiency (relevant metrics), and any restricted substances. Refer to the specific ecodesign requirements for your product group.`;
    } else if (stepContext === esprPathwaySteps[2].title) {
        mockResponseDescription = `For '${stepContext}', compile all data points mandated by ESPR for your product's DPP. This includes material composition, environmental impact data, circularity information, and instructions for use/repair/disposal. Ensure data is accurate and verifiable.`;
    } else if (stepContext === esprPathwaySteps[3].title) {
        mockResponseDescription = `For '${stepContext}', ensure each product unit has a clear link to its DPP, typically via a QR code or other data carrier. The DPP must be publicly accessible or accessible according to ESPR rules. Specify your strategy for data carrier placement and DPP accessibility.`;
    } else if (stepContext === esprPathwaySteps[4].title) {
        mockResponseDescription = `For '${stepContext}', select the appropriate conformity assessment procedure (e.g., Module A - Internal Production Control, or modules involving a notified body). Provide a link to the EU Declaration of Conformity. If a notified body was involved, include their ID.`;
    } else if (stepContext === esprPathwaySteps[5].title) {
        mockResponseDescription = `For '${stepContext}', ensure you can provide necessary information to market surveillance authorities upon request. This includes technical documentation, DPP access, and traceability information (e.g., batch/serial numbers).`;
    } else if (stepContext === esprPathwaySteps[6].title) {
        mockResponseDescription = `For '${stepContext}', perform a final comprehensive review of all ESPR-related information. Confirm all ecodesign parameters are addressed, DPP data is complete, conformity assessment is documented, and market surveillance information is ready.`;
    }


     toast({
        title: "AI Co-Pilot (Mock ESPR Response)",
        description: mockResponseDescription,
        duration: 12000,
      });
    setIsLoadingCopilot(false);
  };

  const currentStepIndex = esprPathwaySteps.findIndex(s => s.id === activeStep);
  const canGoNext = currentStepIndex < esprPathwaySteps.length - 1;
  const canGoPrev = currentStepIndex > 0;

  const goToNextStep = () => {
    if (canGoNext) {
      setActiveStep(esprPathwaySteps[currentStepIndex + 1].id);
    }
  };

  const goToPrevStep = () => {
    if (canGoPrev) {
      setActiveStep(esprPathwaySteps[currentStepIndex - 1].id);
    }
  };

  const renderStepContent = (stepId: string) => {
    const currentStepDetails = esprPathwaySteps.find(s => s.id === stepId);
    const stepIndex = esprPathwaySteps.findIndex(s => s.id === stepId);

    switch (stepId) {
      case "step1": // Product Categorization & Scope
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><currentStepDetails!.icon className="mr-2 h-5 w-5 text-primary" />{currentStepDetails!.title}</CardTitle>
              <CardDescription>{currentStepDetails!.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="step1_productCategory">Product Category (as per ESPR)</Label>
                <Input id="step1_productCategory" value={formData.step1_productCategory || ""} onChange={(e) => handleInputChange("step1", "productCategory", e.target.value)} placeholder="e.g., Textiles, Electronics, Furniture" />
              </div>
              <div>
                <Label htmlFor="step1_esprProductGroup">Specific ESPR Product Group (if applicable)</Label>
                <Input id="step1_esprProductGroup" value={formData.step1_esprProductGroup || ""} onChange={(e) => handleInputChange("step1", "esprProductGroup", e.target.value)} placeholder="e.g., Smartphones, Washing Machines" />
              </div>
              <div>
                <Label htmlFor="step1_applicableAnnexes">Relevant ESPR Regulation Annexes/Articles</Label>
                <Textarea id="step1_applicableAnnexes" value={formData.step1_applicableAnnexes || ""} onChange={(e) => handleInputChange("step1", "applicableAnnexes", e.target.value)} placeholder="List specific annexes or articles relevant to your product group." />
              </div>
            </CardContent>
          </Card>
        );
      case "step2": // Ecodesign Parameters
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><currentStepDetails!.icon className="mr-2 h-5 w-5 text-primary" />{currentStepDetails!.title}</CardTitle>
              <CardDescription>{currentStepDetails!.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="step2_durabilityInfo">Durability & Reliability Measures</Label>
                <Textarea id="step2_durabilityInfo" value={formData.step2_durabilityInfo || ""} onChange={(e) => handleInputChange("step2", "durabilityInfo", e.target.value)} placeholder="Describe expected lifespan, resistance to wear, testing methods, etc." />
              </div>
              <div>
                <Label htmlFor="step2_repairabilityInfo">Repairability & Maintainability</Label>
                <Textarea id="step2_repairabilityInfo" value={formData.step2_repairabilityInfo || ""} onChange={(e) => handleInputChange("step2", "repairabilityInfo", e.target.value)} placeholder="Describe availability of spare parts, ease of disassembly, repair manuals, repair score (if any)." />
              </div>
              <div>
                <Label htmlFor="step2_recycledContentInfo">Recycled Content & Material Efficiency</Label>
                <Textarea id="step2_recycledContentInfo" value={formData.step2_recycledContentInfo || ""} onChange={(e) => handleInputChange("step2", "recycledContentInfo", e.target.value)} placeholder="Specify percentage of recycled content, types of materials, efforts to reduce material use." />
              </div>
              <div>
                <Label htmlFor="step2_energyEfficiencyInfo">Energy & Resource Efficiency</Label>
                <Textarea id="step2_energyEfficiencyInfo" value={formData.step2_energyEfficiencyInfo || ""} onChange={(e) => handleInputChange("step2", "energyEfficiencyInfo", e.target.value)} placeholder="Detail energy consumption in use phase, water usage, etc. Refer to specific metrics if applicable." />
              </div>
              <div>
                <Label htmlFor="step2_substanceRestrictionsInfo">Presence of Substances of Concern</Label>
                <Textarea id="step2_substanceRestrictionsInfo" value={formData.step2_substanceRestrictionsInfo || ""} onChange={(e) => handleInputChange("step2", "substanceRestrictionsInfo", e.target.value)} placeholder="Declare any substances of concern and measures to restrict them, link to SCIP database if relevant." />
              </div>
            </CardContent>
          </Card>
        );
    case "step3": // Information Requirements & DPP Data
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><currentStepDetails!.icon className="mr-2 h-5 w-5 text-primary" />{currentStepDetails!.title}</CardTitle>
              <CardDescription>{currentStepDetails!.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="step3_dppDataPoints">Key DPP Data Points for ESPR</Label>
                <Textarea id="step3_dppDataPoints" value={formData.step3_dppDataPoints || ""} onChange={(e) => handleInputChange("step3", "dppDataPoints", e.target.value)} placeholder="List specific data elements required in the DPP for your product group under ESPR (e.g., material composition, carbon footprint, repair score, supplier DIDs)." rows={6}/>
              </div>
              <div>
                <Label htmlFor="step3_dataVerificationProcess">Data Source & Verification Process</Label>
                <Textarea id="step3_dataVerificationProcess" value={formData.step3_dataVerificationProcess || ""} onChange={(e) => handleInputChange("step3", "dataVerificationProcess", e.target.value)} placeholder="Describe how the data for the DPP is collected, verified, and kept up-to-date." />
              </div>
            </CardContent>
          </Card>
        );
    case "step4": // DPP Linkage & Accessibility
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><currentStepDetails!.icon className="mr-2 h-5 w-5 text-primary" />{currentStepDetails!.title}</CardTitle>
              <CardDescription>{currentStepDetails!.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="step4_dppId">Digital Product Passport ID</Label>
                <Input id="step4_dppId" value={formData.step4_dppId || ""} onChange={(e) => handleInputChange("step4", "dppId", e.target.value)} placeholder="Enter the unique ID of the product's DPP." />
              </div>
              <div>
                <Label htmlFor="step4_dppPublicUrl">DPP Public Access URL (if applicable)</Label>
                <Input id="step4_dppPublicUrl" type="url" value={formData.step4_dppPublicUrl || ""} onChange={(e) => handleInputChange("step4", "dppPublicUrl", e.target.value)} placeholder="https://your-dpp-platform.com/passport/..." />
              </div>
              <div>
                <Label htmlFor="step4_qrCodeStrategy">Data Carrier Strategy (QR Code, NFC, etc.)</Label>
                <Textarea id="step4_qrCodeStrategy" value={formData.step4_qrCodeStrategy || ""} onChange={(e) => handleInputChange("step4", "qrCodeStrategy", e.target.value)} placeholder="Describe how the DPP link will be provided on the product, packaging, or accompanying documents." />
              </div>
            </CardContent>
          </Card>
        );
    case "step5": // Conformity Assessment
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><currentStepDetails!.icon className="mr-2 h-5 w-5 text-primary" />{currentStepDetails!.title}</CardTitle>
              <CardDescription>{currentStepDetails!.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="step5_conformityProcedure">Conformity Assessment Procedure Followed</Label>
                <Select value={formData.step5_conformityProcedure || "module_a"} onValueChange={(value) => handleSelectChange("step5", "conformityProcedure", value)}>
                    <SelectTrigger id="step5_conformityProcedure"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="module_a">Module A - Internal Production Control</SelectItem>
                        <SelectItem value="module_b_c">Module B+C - EU-Type Examination + Conformity to Type</SelectItem>
                        <SelectItem value="module_d">Module D - Conformity to Type based on QA of Production</SelectItem>
                        <SelectItem value="module_h">Module H - Conformity based on Full QA</SelectItem>
                        <SelectItem value="other">Other (Specify in technical documentation)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="step5_declarationOfConformityUrl">EU Declaration of Conformity URL</Label>
                <Input id="step5_declarationOfConformityUrl" type="url" value={formData.step5_declarationOfConformityUrl || ""} onChange={(e) => handleInputChange("step5", "declarationOfConformityUrl", e.target.value)} placeholder="Link to the DoC PDF or webpage." />
              </div>
              <div>
                <Label htmlFor="step5_notifiedBodyId">Notified Body ID (if applicable)</Label>
                <Input id="step5_notifiedBodyId" value={formData.step5_notifiedBodyId || ""} onChange={(e) => handleInputChange("step5", "notifiedBodyId", e.target.value)} placeholder="Enter 4-digit Notified Body number if involved." />
              </div>
            </CardContent>
          </Card>
        );
    case "step6": // Market Surveillance Data
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><currentStepDetails!.icon className="mr-2 h-5 w-5 text-primary" />{currentStepDetails!.title}</CardTitle>
              <CardDescription>{currentStepDetails!.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="step6_marketSurveillanceContact">Contact Point for Market Surveillance Authorities</Label>
                <Input id="step6_marketSurveillanceContact" value={formData.step6_marketSurveillanceContact || ""} onChange={(e) => handleInputChange("step6", "marketSurveillanceContact", e.target.value)} placeholder="Email or phone for MSA inquiries." />
              </div>
              <div>
                <Label htmlFor="step6_batchTraceabilityInfo">Batch/Serial Number Information for Traceability</Label>
                <Textarea id="step6_batchTraceabilityInfo" value={formData.step6_batchTraceabilityInfo || ""} onChange={(e) => handleInputChange("step6", "batchTraceabilityInfo", e.target.value)} placeholder="Describe how batch/serial information is managed and can be provided for traceability." />
              </div>
            </CardContent>
          </Card>
        );
      case "step7": // Review & Submit
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><currentStepDetails!.icon className="mr-2 h-5 w-5 text-primary" />{currentStepDetails!.title}</CardTitle>
              <CardDescription>{currentStepDetails!.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground">
                You've reached the final conceptual step for ESPR compliance. Please thoroughly review all information entered in the previous steps. Ensure accuracy, completeness, and alignment with specific ESPR requirements for your product.
              </p>
              <div className="p-4 border rounded-md bg-muted/50">
                <h4 className="font-semibold mb-2 text-primary">Key Review Checklist:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Product categorization and scope correctly identified?</li>
                  <li>All relevant ecodesign parameters addressed with sufficient detail?</li>
                  <li>DPP data points complete and data sources clear?</li>
                  <li>DPP linkage strategy defined and accessible?</li>
                  <li>Conformity assessment procedure documented and DoC available?</li>
                  <li>Market surveillance contact and traceability info prepared?</li>
                </ul>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="step7_finalReviewCheck" checked={formData.step7_finalReviewCheck || false} onCheckedChange={(checked) => handleInputChange("step7", "finalReviewCheck", !!checked)} />
                <Label htmlFor="step7_finalReviewCheck" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I confirm all ESPR-related information has been reviewed and is ready for conceptual submission.
                </Label>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardHeader><CardTitle>Step Not Implemented</CardTitle></CardHeader>
            <CardContent><p>This step's content is not yet defined.</p></CardContent>
          </Card>
        );
    }
  };

  const currentStepInfo = esprPathwaySteps[currentStepIndex];

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">EU ESPR Compliance Pathway</CardTitle>
          <CardDescription>Navigate the Ecodesign for Sustainable Products Regulation requirements step-by-step.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-lg mb-2 text-primary flex items-center">
                    {currentStepInfo.icon && <currentStepInfo.icon className="mr-2 h-5 w-5" />}
                    Current Step: {currentStepInfo.title}
                </h3>
                <p className="text-sm text-muted-foreground">{currentStepInfo.description}</p>
                <div className="mt-3 flex items-center space-x-2">
                    {esprPathwaySteps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${index <= currentStepIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                          title={step.title}>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">Step {currentStepIndex + 1} of {esprPathwaySteps.length}</p>
            </div>

            <div className="mb-4">
                {renderStepContent(activeStep)}
                 <Button variant="outline" size="sm" onClick={() => handleAskCopilot(currentStepInfo.title)} disabled={isLoadingCopilot} className="mt-4 w-full md:w-auto">
                    {isLoadingCopilot ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />}
                    Ask Co-Pilot about "{currentStepInfo.title}"
                </Button>
            </div>


            <div className="mt-6 flex justify-between items-center">
                <Button onClick={goToPrevStep} disabled={!canGoPrev} variant="outline">
                    Previous Step
                </Button>
                {currentStepIndex === esprPathwaySteps.length -1 ? (
                    <Button onClick={() => {
                        toast({
                            title: "Mock ESPR Submission Successful!",
                            description: "Your ESPR Pathway data has been conceptually submitted. The wizard will now reset.",
                            duration: 7000,
                            action: <CheckCircle className="text-green-500" />
                        });
                        setActiveStep(esprPathwaySteps[0].id);
                        // Reset form data if needed
                        // setFormData(initialEsprFormData);
                    }}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={!formData.step7_finalReviewCheck}
                    >
                        <CheckCircle className="mr-2 h-4 w-4"/>
                        Final Review & Submit ESPR Data (Mock)
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


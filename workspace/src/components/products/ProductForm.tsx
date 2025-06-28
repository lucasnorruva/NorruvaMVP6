
"use client";
// --- File: ProductForm.tsx ---
// Description: Main form component for creating or editing product DPPs.
// Imports all section components from the barrel file.

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import { Cpu, BatteryCharging, Loader2, Sparkles, PlusCircle, Info, Trash2, XCircle, ImageIcon as ImageIconLucide, FileText, Leaf, Settings2, Tag, Anchor, Database, Shirt, Construction as ConstructionIcon, Handshake, Cloud, Link as LinkIconPath, CheckSquare, Layers, ShieldCheck, Fingerprint, KeyRound, ExternalLink, LucideIcon, History, CalendarDays, MapPin, ListChecks, User, Factory, Truck, ShoppingCart, Recycle, Wrench, Package, Bot, AlertTriangle as AlertTriangleIcon, Globe, BarChartBig, Megaphone, Zap as ZapIconLucide, ServerCrash, Laptop, DatabaseZap, Building, SlidersHorizontal, MoreHorizontal, Eye, MessageSquare as MessageSquareIcon } from "lucide-react";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import types and schema from the centralized types file
import type { ProductFormData } from "@/types/productFormTypes";
import { formSchema } from "@/types/productFormTypes";

// Import all form section components from the barrel file
import {
  AiIndicator,
  BasicInfoFormSection,
  ProductImageFormSection,
  BatteryDetailsFormSection,
  SustainabilityComplianceFormSection,
  TechnicalSpecificationsFormSection,
  CustomAttributesFormSection,
  ScipNotificationFormSection,
  EuCustomsDataFormSection,
  TextileInformationFormSection,
  ConstructionProductInformationFormSection,
  EthicalSourcingFormSection,
  EsprSpecificsFormSection,
  CarbonFootprintFormSection,
  DigitalTwinFormSection,
} from "@/components/products/form";

import { handleGenerateImageAI } from "@/utils/aiFormHelpers";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomAttribute } from "@/types/dpp";


interface ProductFormProps {
  id?: string;
  initialData?: Partial<InitialProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
  isStandalonePage?: boolean;
  categoryComplianceSummary?: string | null;
  isLoadingCategoryCompliance?: boolean;
  onFetchCategoryComplianceSummary?: (category: string, focusedRegulations?: string) => void;
}

export default function ProductForm({ id, initialData, onSubmit, isSubmitting, isStandalonePage = true, categoryComplianceSummary, isLoadingCategoryCompliance, onFetchCategoryComplianceSummary }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: initialData?.productName || "",
      gtin: initialData?.gtin || "",
      productDetails: {
        description: initialData?.productDetails?.description || "",
        materials: initialData?.productDetails?.materials || "",
        sustainabilityClaims: initialData?.productDetails?.sustainabilityClaims || "",
        keyCompliancePoints: initialData?.productDetails?.keyCompliancePoints || "",
        specifications: initialData?.productDetails?.specifications ? (typeof initialData.productDetails.specifications === 'string' ? initialData.productDetails.specifications : JSON.stringify(initialData.productDetails.specifications, null, 2)) : "",
        energyLabel: initialData?.productDetails?.energyLabel || "",
        imageUrl: initialData?.productDetails?.imageUrl || "",
        imageHint: initialData?.productDetails?.imageHint || "",
        customAttributesJsonString: initialData?.productDetails?.customAttributesJsonString || "",
        esprSpecifics: initialData?.productDetails?.esprSpecifics,
        carbonFootprint: initialData?.productDetails?.carbonFootprint,
        digitalTwin: initialData?.productDetails?.digitalTwin,
        conflictMineralsReportUrl: initialData?.productDetails?.conflictMineralsReportUrl,
        fairTradeCertificationId: initialData?.productDetails?.fairTradeCertificationId,
        ethicalSourcingPolicyUrl: initialData?.productDetails?.ethicalSourcingPolicyUrl,
      },
      manufacturer: initialData?.manufacturer || "",
      modelNumber: initialData?.modelNumber || "",
      sku: initialData?.sku || "",
      nfcTagId: initialData?.nfcTagId || "",
      rfidTagId: initialData?.rfidTagId || "",
      productCategory: initialData?.productCategory || "",
      onChainStatus: initialData?.onChainStatus || "Unknown",
      onChainLifecycleStage: initialData?.onChainLifecycleStage || "Unknown",
      batteryRegulation: initialData?.batteryRegulation,
      compliance: initialData?.compliance,
      textileInformation: initialData?.textileInformation,
      constructionProductInformation: initialData?.constructionProductInformation,
      productNameOrigin: initialData?.productNameOrigin,
      manufacturerOrigin: initialData?.manufacturerOrigin,
      modelNumberOrigin: initialData?.modelNumberOrigin,
      productDetailsOrigin: initialData?.productDetailsOrigin,
      batteryRegulationOrigin: initialData?.batteryRegulationOrigin,
    },
  });

  const { toast } = useToast();
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([]);
  const [suggestedKeyCompliancePoints, setSuggestedKeyCompliancePoints] = useState<string[]>([]);
  const [suggestedCustomAttributes, setSuggestedCustomAttributes] = useState<CustomAttribute[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([]);
  const [currentCustomKey, setCurrentCustomKey] = useState("");
  const [currentCustomValue, setCurrentCustomValue] = useState("");

  useEffect(() => {
    if (initialData?.productDetails?.customAttributesJsonString) {
      try {
        const parsedAttributes = JSON.parse(initialData.productDetails.customAttributesJsonString);
        if (Array.isArray(parsedAttributes)) {
          setCustomAttributes(parsedAttributes);
        }
      } catch (e) {
        console.error("Failed to parse custom attributes JSON:", e);
        setCustomAttributes([]);
      }
    } else if (initialData && !initialData.productDetails?.customAttributesJsonString) {
        setCustomAttributes([]);
    }
  }, [initialData?.productDetails?.customAttributesJsonString]);

  useEffect(() => {
    form.setValue("productDetails.customAttributesJsonString", JSON.stringify(customAttributes), { shouldValidate: true });
  }, [customAttributes, form]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...form.getValues(),
        ...initialData,
        productDetails: {
            ...form.getValues().productDetails,
            ...initialData.productDetails,
        },
        compliance: {
            ...form.getValues().compliance,
            ...initialData.compliance,
        },
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (data: ProductFormData) => {
    const transformedData = { ...data };
    if (transformedData.batteryRegulation) {
        const br = transformedData.batteryRegulation;
        if (br.carbonFootprint) {
            if (br.carbonFootprint.value === undefined || String(br.carbonFootprint.value).trim() === "") br.carbonFootprint.value = null;
            if (br.carbonFootprint.scope1Emissions === undefined || String(br.carbonFootprint.scope1Emissions).trim() === "") br.carbonFootprint.scope1Emissions = null;
            if (br.carbonFootprint.scope2Emissions === undefined || String(br.carbonFootprint.scope2Emissions).trim() === "") br.carbonFootprint.scope2Emissions = null;
            if (br.carbonFootprint.scope3Emissions === undefined || String(br.carbonFootprint.scope3Emissions).trim() === "") br.carbonFootprint.scope3Emissions = null;
        }
        if (br.stateOfHealth) {
            if (br.stateOfHealth.value === undefined || String(br.stateOfHealth.value).trim() === "") br.stateOfHealth.value = null;
        }
        if (br.recycledContent) {
            br.recycledContent = br.recycledContent.map(item => ({ ...item, percentage: (item.percentage === undefined || String(item.percentage).trim() === "") ? null : item.percentage }));
        }
        if (br.ratedCapacityAh === undefined || String(br.ratedCapacityAh).trim() === "") br.ratedCapacityAh = null;
        if (br.nominalVoltage === undefined || String(br.nominalVoltage).trim() === "") br.nominalVoltage = null;
        if (br.expectedLifetimeCycles === undefined || String(br.expectedLifetimeCycles).trim() === "") br.expectedLifetimeCycles = null;
        if (br.recyclingEfficiencyRate === undefined || String(br.recyclingEfficiencyRate).trim() === "") br.recyclingEfficiencyRate = null;
        if (br.materialRecoveryRates) {
            if (br.materialRecoveryRates.cobalt === undefined || String(br.materialRecoveryRates.cobalt).trim() === "") br.materialRecoveryRates.cobalt = null;
            if (br.materialRecoveryRates.lead === undefined || String(br.materialRecoveryRates.lead).trim() === "") br.materialRecoveryRates.lead = null;
            if (br.materialRecoveryRates.lithium === undefined || String(br.materialRecoveryRates.lithium).trim() === "") br.materialRecoveryRates.lithium = null;
            if (br.materialRecoveryRates.nickel === undefined || String(br.materialRecoveryRates.nickel).trim() === "") br.materialRecoveryRates.nickel = null;
        }
    }
    if (transformedData.productDetails?.carbonFootprint) {
        const pcf = transformedData.productDetails.carbonFootprint;
        if (pcf.value === undefined || String(pcf.value).trim() === "") pcf.value = null;
        if (pcf.scope1Emissions === undefined || String(pcf.scope1Emissions).trim() === "") pcf.scope1Emissions = null;
        if (pcf.scope2Emissions === undefined || String(pcf.scope2Emissions).trim() === "") pcf.scope2Emissions = null;
        if (pcf.scope3Emissions === undefined || String(pcf.scope3Emissions).trim() === "") pcf.scope3Emissions = null;
    }
    if (transformedData.compliance?.euCustomsData) {
        const cd = transformedData.compliance.euCustomsData;
        if(cd.netWeightKg === undefined || String(cd.netWeightKg).trim() === "") cd.netWeightKg = null;
        if(cd.grossWeightKg === undefined || String(cd.grossWeightKg).trim() === "") cd.grossWeightKg = null;
        if(cd.customsValuation && (cd.customsValuation.value === undefined || String(cd.customsValuation.value).trim() === "")) {
            cd.customsValuation.value = null;
        }
    }
    if (transformedData.textileInformation?.fiberComposition) {
      transformedData.textileInformation.fiberComposition = transformedData.textileInformation.fiberComposition.map(fc => ({
        ...fc,
        percentage: (fc.percentage === undefined || String(fc.percentage).trim() === "") ? null : fc.percentage,
      }));
    }

    const dataToSubmit = {
      ...transformedData,
      productDetails: {
        ...transformedData.productDetails,
        customAttributesJsonString: JSON.stringify(customAttributes)
      }
    };
    onSubmit(dataToSubmit);
  };

  const handleClaimClick = (claim: string) => {
    const currentClaimsValue = form.getValues("productDetails.sustainabilityClaims") || "";
    const newClaimsValue = currentClaimsValue ? `${currentClaimsValue}\n- ${claim}` : `- ${claim}`;
    form.setValue("productDetails.sustainabilityClaims", newClaimsValue, { shouldValidate: true });
  };

  const handleAddCustomAttribute = () => {
    if (currentCustomKey.trim() && currentCustomValue.trim()) {
      if (customAttributes.some(attr => attr.key.toLowerCase() === currentCustomKey.trim().toLowerCase())) {
        toast({
          title: "Duplicate Key",
          description: "An attribute with this key already exists. Please use a unique key.",
          variant: "destructive",
        });
        return;
      }
      setCustomAttributes([...customAttributes, { key: currentCustomKey.trim(), value: currentCustomValue.trim() }]);
      setCurrentCustomKey("");
      setCurrentCustomValue("");
    } else {
      toast({
        title: "Missing Input",
        description: "Please provide both a key and a value for the custom attribute.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCustomAttribute = (keyToRemove: string) => {
    setCustomAttributes(customAttributes.filter(attr => attr.key !== keyToRemove));
  };


  const formContent = (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-12', 'item-13', 'item-4', 'item-14', 'item-15', 'item-5', 'item-6', 'item-7', 'item-8', 'item-9', 'item-10', 'item-11']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Basic Information</AccordionTrigger>
        <AccordionContent>
          <BasicInfoFormSection
            form={form}
            initialData={initialData}
            isSubmittingForm={!!isSubmitting}
            toast={toast}
            categoryComplianceSummary={categoryComplianceSummary}
            isLoadingCategoryCompliance={isLoadingCategoryCompliance}
            onFetchCategoryComplianceSummary={onFetchCategoryComplianceSummary}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><ImageIconLucide className="mr-2 h-5 w-5 text-primary" />Product Image</AccordionTrigger>
        <AccordionContent>
          <ProductImageFormSection form={form} aiImageHelper={handleGenerateImageAI} initialImageUrlOrigin={initialData?.productDetailsOrigin?.imageUrlOrigin} toast={toast} isGeneratingImageState={isGeneratingImage} setIsGeneratingImageState={setIsGeneratingImage} initialImageUrl={initialData?.productDetails?.imageUrl} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-primary" />Sustainability & Compliance Points</AccordionTrigger>
        <AccordionContent>
          <SustainabilityComplianceFormSection form={form} initialData={initialData} suggestedClaims={suggestedClaims} setSuggestedClaims={setSuggestedClaims} handleClaimClick={handleClaimClick} suggestedKeyCompliancePoints={suggestedKeyCompliancePoints} setSuggestedKeyCompliancePoints={setSuggestedKeyCompliancePoints} isSubmittingForm={!!isSubmitting} toast={toast} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-14"><AccordionTrigger className="text-lg font-semibold flex items-center"><Cloud className="mr-2 h-5 w-5 text-primary" />Product Carbon Footprint</AccordionTrigger><AccordionContent><CarbonFootprintFormSection form={form} initialData={initialData} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-13"><AccordionTrigger className="text-lg font-semibold flex items-center"><Handshake className="mr-2 h-5 w-5 text-primary" />Ethical Sourcing</AccordionTrigger><AccordionContent><EthicalSourcingFormSection form={form} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-12"><AccordionTrigger className="text-lg font-semibold flex items-center"><Leaf className="mr-2 h-5 w-5 text-green-600" />ESPR Specifics (Ecodesign)</AccordionTrigger><AccordionContent><EsprSpecificsFormSection form={form} initialData={initialData} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-15"><AccordionTrigger className="text-lg font-semibold flex items-center"><Cpu className="mr-2 h-5 w-5 text-primary" /> Digital Twin (Conceptual)</AccordionTrigger><AccordionContent><DigitalTwinFormSection form={form} initialData={initialData} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-4"><AccordionTrigger className="text-lg font-semibold flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" />Technical Specifications</AccordionTrigger><AccordionContent><TechnicalSpecificationsFormSection form={form} initialData={initialData} isSubmittingForm={!!isSubmitting} toast={toast} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-5"><AccordionTrigger className="text-lg font-semibold flex items-center"><BatteryCharging className="mr-2 h-5 w-5 text-primary" /> Battery Details (if applicable)</AccordionTrigger><AccordionContent><BatteryDetailsFormSection form={form} initialData={initialData} isSubmittingForm={!!isSubmitting} toast={toast} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-6"><AccordionTrigger className="text-lg font-semibold flex items-center"><Settings2 className="mr-2 h-5 w-5 text-primary" />Custom Attributes</AccordionTrigger><AccordionContent><CustomAttributesFormSection customAttributes={customAttributes} setCustomAttributes={setCustomAttributes} currentCustomKey={currentCustomKey} setCurrentCustomKey={setCurrentCustomKey} currentCustomValue={currentCustomValue} setCurrentCustomValue={setCurrentCustomValue} handleAddCustomAttribute={handleAddCustomAttribute} handleRemoveCustomAttribute={handleRemoveCustomAttribute} form={form} suggestedCustomAttributes={suggestedCustomAttributes} setSuggestedCustomAttributes={setSuggestedCustomAttributes} isSubmittingForm={!!isSubmitting} toast={toast} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-7"><AccordionTrigger className="text-lg font-semibold flex items-center"><Database className="mr-2 h-5 w-5 text-primary" />SCIP Notification (if applicable)</AccordionTrigger><AccordionContent><ScipNotificationFormSection form={form} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-8"><AccordionTrigger className="text-lg font-semibold flex items-center"><Anchor className="mr-2 h-5 w-5 text-primary" />EU Customs Data (if applicable)</AccordionTrigger><AccordionContent><EuCustomsDataFormSection form={form} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-9"><AccordionTrigger className="text-lg font-semibold flex items-center"><Shirt className="mr-2 h-5 w-5 text-primary" />Textile Product Information (if applicable)</AccordionTrigger><AccordionContent><TextileInformationFormSection form={form} /></AccordionContent></AccordionItem>
      <AccordionItem value="item-10"><AccordionTrigger className="text-lg font-semibold flex items-center"><ConstructionIcon className="mr-2 h-5 w-5 text-primary" />Construction Product Information (if applicable)</AccordionTrigger><AccordionContent><ConstructionProductInformationFormSection form={form} /></AccordionContent></AccordionItem>
       <AccordionItem value="item-11">
        <AccordionTrigger className="text-lg font-semibold flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-primary" /> Conceptual On-Chain State
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
            <FormField
            control={form.control}
            name="onChainStatus"
            render={({ field }) => (
                <FormItem>
                <FormLabel>On-Chain Status:</FormLabel>
                <FormControl><Input placeholder="e.g., Active, Recalled" {...field} /></FormControl>
                <FormDescription>Conceptual on-chain status of the DPP.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="onChainLifecycleStage"
            render={({ field }) => (
                <FormItem>
                <FormLabel>On-Chain Lifecycle Stage:</FormLabel>
                <FormControl><Input placeholder="e.g., Manufacturing, InUse" {...field} /></FormControl>
                <FormDescription>Conceptual on-chain lifecycle stage of the DPP.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {isStandalonePage ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{id ? "Edit Product DPP" : "Create New DPP"}</CardTitle>
              <CardDescription>{id ? "Update the details below." : "Fill in the details to create a new Digital Product Passport."}</CardDescription>
            </CardHeader>
            <CardContent>{formContent}</CardContent>
          </Card>
        ) : (
          formContent
        )}
        <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
                <XCircle className="mr-2 h-4 w-4" /> Reset Form
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> ) : ( <>Save Product</> )}
            </Button>
        </div>
      </form>
    </Form>
  );
}

```
- workspace/src/components/products/ui/ProductComplianceBadge.tsx:
```tsx
// src/components/products/ui/ProductComplianceBadge.tsx
/**
 * Memoized compliance status badge component
 */
"use client";

import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import type { ComplianceStatus } from '@/types/products';
import { cn } from '@/lib/utils';

interface ProductComplianceBadgeProps {
  status: ComplianceStatus;
  size?: 'sm' | 'default' | 'lg';
}

const COMPLIANCE_CONFIG = {
  [ComplianceStatus.COMPLIANT]: {
    icon: ShieldCheck,
    variant: 'default' as const,
    className: 'bg-green-100 text-green-700 border-green-300',
  },
  [ComplianceStatus.PENDING]: {
    icon: ShieldQuestion,
    variant: 'outline' as const,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  [ComplianceStatus.NON_COMPLIANT]: {
    icon: ShieldAlert,
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-700 border-red-300',
  },
  [ComplianceStatus.NOT_APPLICABLE]: {
    icon: ShieldQuestion,
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
} as const;

const ProductComplianceBadge = memo<ProductComplianceBadgeProps>(({ status, size = 'sm' }) => {
  const config = COMPLIANCE_CONFIG[status] || COMPLIANCE_CONFIG[ComplianceStatus.NOT_APPLICABLE];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, sizeClasses[size], 'flex items-center gap-1 capitalize')}
    >
      <IconComponent className="h-3 w-3" />
      {status.replace('_', ' ')}
    </Badge>
  );
});

ProductComplianceBadge.displayName = 'ProductComplianceBadge';

export { ProductComplianceBadge };

```
- workspace/src/components/products/ui/ProductStatusBadge.tsx:
```tsx
// src/components/products/ui/ProductStatusBadge.tsx
/**
 * Memoized status badge component
 */
"use client";

import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, Archive, FileEdit } from 'lucide-react';
import type { ProductStatus } from '@/types/products';
import { cn } from '@/lib/utils';

interface ProductStatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'default' | 'lg';
}

const STATUS_CONFIG = {
  [ProductStatus.ACTIVE]: {
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-green-100 text-green-700 border-green-300',
  },
  [ProductStatus.PENDING]: {
    icon: Clock,
    variant: 'outline' as const,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  [ProductStatus.DRAFT]: {
    icon: FileEdit, // Changed from AlertTriangle to FileEdit
    variant: 'secondary' as const,
    className: 'bg-blue-100 text-blue-700 border-blue-300', // Changed for visibility
  },
  [ProductStatus.ARCHIVED]: {
    icon: Archive,
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  [ProductStatus.RECALLED]: {
    icon: AlertTriangle,
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-700 border-red-300',
  },
} as const;

const ProductStatusBadge = memo<ProductStatusBadgeProps>(({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || { icon: AlertTriangle, variant: 'secondary', className: 'bg-muted' };
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, sizeClasses[size], 'flex items-center gap-1 capitalize')}
    >
      <IconComponent className="h-3 w-3" />
      {status}
    </Badge>
  );
});

ProductStatusBadge.displayName = 'ProductStatusBadge';

export { ProductStatusBadge };

```
- workspace/src/services/products/productService.ts:
```ts
// src/services/products/productService.ts
/**
 * Product service layer with comprehensive error handling and caching
 * This service currently uses mock data and simulates API calls.
 */

import type {
  Product,
  ProductFormData,
  ProductListItem,
  ProductSearchParams,
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from '@/types/products';
import { MOCK_DPPS as mockDppData } from '@/data/mockDpps';
import { ValidationService } from '@/services/shared/validationService';
import { DataOrigin } from '@/types/products';

// A simple mock API delay
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const mapDppToProduct = (dpp: any): Product => {
  return {
    id: dpp.id,
    createdAt: dpp.createdAt || new Date().toISOString(),
    updatedAt: dpp.updatedAt || new Date().toISOString(),
    version: dpp.version || 1,
    productName: dpp.productName || { value: "N/A", origin: DataOrigin.MANUAL, lastModified: new Date().toISOString() },
    manufacturer: dpp.manufacturer || { value: "N/A", origin: DataOrigin.MANUAL, lastModified: new Date().toISOString() },
    category: dpp.category || { value: "N/A", origin: DataOrigin.MANUAL, lastModified: new Date().toISOString() },
    status: dpp.status,
    complianceStatus: dpp.complianceStatus,
    lifecycleStage: dpp.lifecycleStage,
    details: dpp.details,
    tags: dpp.tags || [],
    metadata: dpp.metadata || {},
    gtin: dpp.gtin,
    modelNumber: dpp.modelNumber,
  };
};

export class ProductService {
  private validator: ValidationService;
  
  constructor() {
    this.validator = new ValidationService();
  }
  
  async getProducts(params: ProductSearchParams): Promise<PaginatedResponse<ProductListItem>> {
    await apiDelay(500);
    let products = mockDppData.map(dpp => ({
      id: dpp.id,
      productName: dpp.productName.value,
      manufacturer: dpp.manufacturer.value,
      category: dpp.category.value,
      status: dpp.status,
      complianceStatus: dpp.complianceStatus,
      lastUpdated: dpp.updatedAt,
      imageUrl: dpp.details.imageUrl?.value,
      completenessScore: Math.floor(Math.random() * 50) + 50, // Mock score
    }));
    
    // Simulate filtering
    if (params.query) {
        const query = params.query.toLowerCase();
        products = products.filter(p => p.productName.toLowerCase().includes(query) || p.manufacturer.toLowerCase().includes(query));
    }
    if (params.category) {
        products = products.filter(p => p.category === params.category);
    }
    if (params.status && params.status.length > 0) {
        products = products.filter(p => params.status!.includes(p.status));
    }

    const total = products.length;
    const paginatedData = products.slice((params.page - 1) * params.limit, params.page * params.limit);

    return {
      data: paginatedData,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: total,
        totalPages: Math.ceil(total / params.limit),
      },
      status: 'success',
      message: 'Products fetched successfully',
      timestamp: new Date().toISOString(),
      requestId: `req_${Math.random()}`
    };
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    await apiDelay(300);
    const productData = mockDppData.find(p => p.id === id);
    if (!productData) {
      throw { code: '404', message: 'Product not found' };
    }
    return { 
        data: mapDppToProduct(productData),
        status: 'success',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  }
  
  async createProduct(data: ProductFormData): Promise<ApiResponse<Product>> {
    await apiDelay(700);
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: `PROD_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
      productName: { value: data.productName, origin: DataOrigin.MANUAL, lastModified: now },
      manufacturer: { value: data.manufacturer, origin: DataOrigin.MANUAL, lastModified: now },
      category: { value: data.category, origin: DataOrigin.MANUAL, lastModified: now },
      status: 'draft' as any,
      complianceStatus: 'pending' as any,
      lifecycleStage: 'design' as any,
      details: {
          description: { value: data.description, origin: DataOrigin.MANUAL, lastModified: now },
          materials: { value: [], origin: DataOrigin.MANUAL, lastModified: now }, // Simplified
          sustainabilityClaims: { value: data.sustainabilityClaims.split('\n'), origin: DataOrigin.MANUAL, lastModified: now },
          keyCompliancePoints: { value: data.keyCompliancePoints.split('\n'), origin: DataOrigin.MANUAL, lastModified: now },
          specifications: { value: JSON.parse(data.specifications || '{}'), origin: DataOrigin.MANUAL, lastModified: now },
          energyLabel: { value: data.energyLabel || 'N/A', origin: DataOrigin.MANUAL, lastModified: now },
          imageUrl: { value: data.imageUrl || '', origin: DataOrigin.MANUAL, lastModified: now },
          customAttributes: { value: data.customAttributes, origin: DataOrigin.MANUAL, lastModified: now },
      },
      tags: [],
      metadata: {},
    };
    console.log("Mock creating product:", newProduct);
    return {
        data: newProduct,
        status: 'success',
        message: 'Product created successfully',
        timestamp: now,
        requestId: `req_${Math.random()}`
    };
  }

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
    await apiDelay(600);
    const index = mockDppData.findIndex(p => p.id === id);
    if (index === -1) {
      throw { code: '404', message: 'Product not found' };
    }
    const existing = mockDppData[index];
    const updatedProduct = { ...existing, ...data };
    console.log("Mock updating product:", id, "with", data);
    return {
        data: mapDppToProduct(updatedProduct),
        status: 'success',
        message: 'Product updated successfully',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    await apiDelay(400);
    console.log("Mock deleting product:", id);
    return {
        data: undefined,
        status: 'success',
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random()}`
    };
  }
}

export const productService = new ProductService();

```
- workspace/src/services/shared/apiClient.ts:
```ts
// src/services/shared/apiClient.ts
/**
 * Generic API client with interceptors and error handling
 */
import type { ApiResponse, ApiError } from '@/types/products';
import { MOCK_DPPS as mockDppData } from '@/data/mockDpps'; // For mock responses

// A simple mock API delay
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: { baseURL: string; timeout?: number }) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
  }
  
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async get<T>(url: string, config?: { params?: Record<string, any> }): Promise<ApiResponse<T>> {
    await apiDelay(300);
    console.log(`Mock GET request to: ${this.baseURL}${url}`, { params: config?.params });
    
    // Mock getProducts response
    if (url === '/products') {
      const page = config?.params?.page || 1;
      const limit = config?.params?.limit || 20;
      const total = mockDppData.length;
      const paginatedData = mockDppData.slice((page - 1) * limit, page * limit);

      const response = {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
      
      return {
        data: response as any,
        status: 'success',
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
      };
    }
    
    // Mock getProduct response
    if (url.startsWith('/products/')) {
      const id = url.split('/').pop();
      const product = mockDppData.find(p => p.id === id);
      if (product) {
        return {
          data: product as any,
          status: 'success',
          timestamp: new Date().toISOString(),
          requestId: this.generateRequestId(),
        };
      }
      throw { code: '404', message: 'Product not found' };
    }
    
    throw { code: '500', message: 'Mock API route not implemented' };
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    await apiDelay(500);
    console.log(`Mock POST request to: ${this.baseURL}${url}`, { data });
    
    if (url === '/products') {
      const newProduct = { ...data, id: `PROD_${Date.now()}` };
      return {
        data: newProduct as any,
        status: 'success',
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
      };
    }

    throw { code: '500', message: 'Mock API route not implemented' };
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    await apiDelay(400);
    console.log(`Mock PATCH request to: ${this.baseURL}${url}`, { data });
    
    if (url.startsWith('/products/')) {
        const id = url.split('/').pop();
        const existing = mockDppData.find(p => p.id === id);
        if (existing) {
            const updated = { ...existing, ...data };
            return {
                data: updated as any,
                status: 'success',
                timestamp: new Date().toISOString(),
                requestId: this.generateRequestId(),
            };
        }
    }
    
    throw { code: '500', message: 'Mock API route not implemented' };
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    await apiDelay(200);
    console.log(`Mock DELETE request to: ${this.baseURL}${url}`);
    
    if (url.startsWith('/products/')) {
      return {
        data: undefined as any,
        status: 'success',
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
      };
    }
    
    throw { code: '500', message: 'Mock API route not implemented' };
  }
}

```
- workspace/src/types/products/api.ts:
```ts
// src/types/products/api.ts
/**
 * API-specific types
 */
import type { Product, ProductStatus, ComplianceStatus } from './base';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error' | 'warning';
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductListItem {
  id: string;
  productName: string;
  manufacturer: string;
  category: string;
  status: ProductStatus;
  complianceStatus: ComplianceStatus;
  lastUpdated: string;
  imageUrl?: string;
  completenessScore: number;
}

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  manufacturer?: string;
  status?: ProductStatus[];
  complianceStatus?: ComplianceStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface ProductSearchParams extends ProductSearchFilters {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

```
- workspace/src/types/products/base.ts:
```ts
// src/types/products/base.ts
/**
 * Base product types with comprehensive type safety
 */

// Base utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Status enums for better type safety
export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PENDING = 'pending',
  ARCHIVED = 'archived',
  RECALLED = 'recalled',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING = 'pending',
  NOT_APPLICABLE = 'not_applicable',
}

export enum LifecycleStage {
  DESIGN = 'design',
  MANUFACTURING = 'manufacturing',
  DISTRIBUTION = 'distribution',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  END_OF_LIFE = 'end_of_life',
}

// Data origin tracking
export enum DataOrigin {
  AI_EXTRACTED = 'ai_extracted',
  MANUAL = 'manual',
  IMPORTED = 'imported',
  SYSTEM_GENERATED = 'system_generated',
}

// Base interfaces
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
}

export interface AuditableField<T = string> {
  value: T;
  origin: DataOrigin;
  lastModified: string;
  modifiedBy?: string;
}

// Product identification
export interface ProductIdentifiers {
  readonly id: string;
  gtin?: string;
  sku?: string;
  modelNumber?: string;
  nfcTagId?: string;
  rfidTagId?: string;
}

// Carbon footprint data
export interface CarbonFootprintData {
  value: number | null;
  unit: string;
  calculationMethod?: string;
  scope1Emissions?: number | null;
  scope2Emissions?: number | null;
  scope3Emissions?: number | null;
  dataSource?: string;
  vcId?: string;
  certificationId?: string;
  measurementDate?: string;
}

// Digital Twin information
export interface DigitalTwinData {
  uri?: string;
  sensorDataEndpoint?: string;
  realTimeStatus?: string;
  predictiveMaintenanceAlerts?: string;
  lastSyncDate?: string;
  healthScore?: number;
}

// Ethical sourcing
export interface EthicalSourcingData {
  conflictMineralsReportUrl?: string;
  fairTradeCertificationId?: string;
  ethicalSourcingPolicyUrl?: string;
  supplierCodeOfConductUrl?: string;
  auditReportUrl?: string;
}

// ESPR specific data
export interface EsprSpecifics {
  durabilityInformation?: string;
  repairabilityInformation?: string;
  recycledContentSummary?: string;
  energyEfficiencySummary?: string;
  substanceOfConcernSummary?: string;
  circularityScore?: number;
}

// Material information
export interface MaterialInfo {
  name: string;
  percentage?: number;
  source?: string;
  isRecycled?: boolean;
  sustainabilityCertification?: string;
  origin?: string;
  suppliers?: string[];
}

// Custom attributes
export interface CustomAttribute {
  key: string;
  value: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'url';
  isRequired?: boolean;
  category?: string;
}

// Product details with comprehensive tracking
export interface ProductDetails {
  description: AuditableField<string>;
  materials: AuditableField<MaterialInfo[]>;
  sustainabilityClaims: AuditableField<string[]>;
  keyCompliancePoints: AuditableField<string[]>;
  specifications: AuditableField<Record<string, any>>;
  energyLabel: AuditableField<string>;
  imageUrl: AuditableField<string>;
  imageHint?: AuditableField<string>;
  customAttributes: AuditableField<CustomAttribute[]>;
  carbonFootprint?: CarbonFootprintData;
  digitalTwin?: DigitalTwinData;
  ethicalSourcing?: EthicalSourcingData;
  esprSpecifics?: EsprSpecifics;
}

// Main product interface
export interface Product extends BaseEntity, ProductIdentifiers {
  productName: AuditableField<string>;
  manufacturer: AuditableField<string>;
  category: AuditableField<string>;
  status: ProductStatus;
  complianceStatus: ComplianceStatus;
  lifecycleStage: LifecycleStage;
  details: ProductDetails;
  tags: string[];
  metadata: Record<string, any>;
}

```
- workspace/src/types/products/components.ts:
```ts
// src/types/products/components.ts
/**
 * Component-specific types
 */
import type { Product, ProductListItem, ProductSearchFilters, ProductFormData } from './';
import type { ApiError } from './api';
import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form'; // Added

export interface ComponentProps {
  className?: string;
  testId?: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error | ApiError;
  errorBoundary?: boolean;
}

export interface ProductComponentState extends LoadingState, ErrorState {
  product?: Product;
  isDirty?: boolean;
}

export interface ProductFormProps extends ComponentProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  validationSchema?: any;
}

export interface ProductFormSectionProps { // Added new generic form section props
  form: UseFormReturn<ProductFormData>;
  isSubmitting: boolean;
}

export interface ProductListProps extends ComponentProps {
  onProductSelect?: (productId: string) => void;
  onProductEdit?: (productId: string) => void;
  onProductDelete?: (productId: string, productName?: string) => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
  showExportButton?: boolean;
  viewMode?: 'grid' | 'list';
  pageSize?: number;
}


export interface ProductDetailProps extends ComponentProps {
  productId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

// Utility types for hooks
export type UseProductQuery = {
  productId: string;
  options?: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
  };
};

export type UseProductMutation = {
  onSuccess?: (data: Product | string) => void; // string for delete
  onError?: (error: ApiError) => void;
};

```
- workspace/src/types/products/forms.ts:
```ts
// src/types/products/forms.ts
/**
 * Form-specific types with validation
 */
import type { DataOrigin, CustomAttribute, CarbonFootprintData, DigitalTwinData, EthicalSourcingData, EsprSpecifics } from './base';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  touchedFields: Set<keyof T>;
}

export interface ProductFormData {
  // Basic info
  productName: string;
  manufacturer: string;
  category: string;
  modelNumber?: string;
  
  // Identifiers
  gtin?: string;
  sku?: string;
  nfcTagId?: string;
  rfidTagId?: string;
  
  // Product details
  description: string;
  materials: string; // Simplified for form input
  sustainabilityClaims: string; // Simplified for form input
  keyCompliancePoints: string; // Simplified for form input
  specifications: string; // JSON string
  energyLabel?: string;
  imageUrl?: string;
  imageHint?: string;
  
  // Custom attributes (handled as separate state, stored as JSON string)
  customAttributes: CustomAttribute[];
  customAttributesJsonString?: string;
  
  // Carbon footprint
  carbonFootprint?: Partial<CarbonFootprintData>;
  
  // Digital twin
  digitalTwin?: Partial<DigitalTwinData>;
  
  // Ethical sourcing
  ethicalSourcing?: Partial<EthicalSourcingData>;
  
  // ESPR
  esprSpecifics?: Partial<EsprSpecifics>;
  
  // Battery regulation (if applicable)
  batteryRegulation?: {
    status: string;
    batteryChemistry?: string;
    batteryPassportId?: string;
    // ... other battery fields
  };
  
  // Compliance data
  compliance?: {
    eprel?: { status: string; id?: string; url?: string };
    esprConformity?: { status: string };
    scipNotification?: {
      status: string;
      notificationId?: string;
      // ... other SCIP fields
    };
    euCustomsData?: {
      status: string;
      declarationId?: string;
      // ... other customs fields
    };
  };
  
  // Textile information
  textileInformation?: {
    fiberComposition: Array<{
      fiberName: string;
      percentage: number | null;
    }>;
    isSecondHand: boolean;
    countryOfOriginLabeling?: string;
    careInstructionsUrl?: string;
  };
  
  // Construction product information
  constructionProductInformation?: {
    essentialCharacteristics: Array<{
      characteristicName: string;
      value: string;
      unit?: string;
      testMethod?: string;
    }>;
    declarationOfPerformanceId?: string;
    ceMarkingDetailsUrl?: string;
    intendedUseDescription?: string;
  };
  
  // Origin tracking
  originTracking?: Record<string, DataOrigin>;
}

```
- workspace/src/types/products/index.ts:
```ts
// src/types/products/index.ts

// Export all from base types
export * from './base';

// Export all from form types
export * from './forms';

// Export all from API types
export * from './api';

// Export all from component types
export * from './components';

```
- workspace/src/utils/products/validation.ts:
```ts
// src/utils/products/validation.ts
import { z } from 'zod';

export const productFormSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters long." }),
  manufacturer: z.string().min(2, { message: "Manufacturer name is required." }),
  category: z.string().min(2, { message: "Category is required." }),
  modelNumber: z.string().optional(),
  gtin: z.string().optional(),
  sku: z.string().optional(),
  nfcTagId: z.string().optional(),
  rfidTagId: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }).optional().or(z.literal("")),
  materials: z.string().optional(),
  sustainabilityClaims: z.string().optional(),
  keyCompliancePoints: z.string().optional(),
  specifications: z.string().optional(),
  energyLabel: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  imageHint: z.string().optional(),
  customAttributes: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  customAttributesJsonString: z.string().optional(),
  // Add more complex validations for other fields if needed
});

```
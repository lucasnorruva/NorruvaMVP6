
// --- File: src/types/productFormTypes.ts ---
// Description: Type definitions and Zod schemas for the product form.
"use client";

import { z } from "zod";
import type { EsprSpecifics, CarbonFootprintData, BatteryRegulationDetails, TextileInformation, ConstructionProductInformation, ScipNotificationDetails, EuCustomsDataDetails } from './dpp'; // Ensure EsprSpecifics and CarbonFootprintData are imported

export const carbonFootprintSchema: z.ZodType<Partial<CarbonFootprintData>> = z.object({
  value: z.coerce.number().nullable().optional(),
  unit: z.string().optional(),
  calculationMethod: z.string().optional(),
  scope1Emissions: z.coerce.number().nullable().optional(),
  scope2Emissions: z.coerce.number().nullable().optional(),
  scope3Emissions: z.coerce.number().nullable().optional(),
  dataSource: z.string().optional(),
  vcId: z.string().optional(),
});

export const recycledContentSchema = z.object({
  material: z.string().optional(),
  percentage: z.coerce.number().nullable().optional(),
  source: z.string().optional(), // Could be enum: z.enum(['Pre-consumer', 'Post-consumer', 'Mixed', 'Unknown']).optional(),
  vcId: z.string().optional(),
});

export const stateOfHealthSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  unit: z.string().optional(),
  measurementDate: z.string().optional(),
  measurementMethod: z.string().optional(),
  vcId: z.string().optional(),
});

export const batteryRegulationDetailsSchema: z.ZodType<Partial<BatteryRegulationDetails>> = z.object({
  status: z.string().optional(),
  batteryChemistry: z.string().optional(),
  batteryPassportId: z.string().optional(),
  ratedCapacityAh: z.coerce.number().nullable().optional(),
  nominalVoltage: z.coerce.number().nullable().optional(),
  expectedLifetimeCycles: z.coerce.number().nullable().optional(),
  manufacturingDate: z.string().optional(),
  manufacturerName: z.string().optional(),
  carbonFootprint: carbonFootprintSchema.optional(),
  recycledContent: z.array(recycledContentSchema).optional(),
  stateOfHealth: stateOfHealthSchema.optional(),
  recyclingEfficiencyRate: z.coerce.number().nullable().optional(),
  materialRecoveryRates: z.object({
    cobalt: z.coerce.number().nullable().optional(),
    lead: z.coerce.number().nullable().optional(),
    lithium: z.coerce.number().nullable().optional(),
    nickel: z.coerce.number().nullable().optional(),
  }).optional(),
  dismantlingInformationUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  safetyInformationUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  vcId: z.string().optional(),
});

export const scipNotificationFormSchema: z.ZodType<Partial<ScipNotificationDetails>> = z.object({
  status: z.string().optional(),
  notificationId: z.string().optional(),
  svhcListVersion: z.string().optional(),
  submittingLegalEntity: z.string().optional(),
  articleName: z.string().optional(),
  primaryArticleId: z.string().optional(),
  safeUseInstructionsLink: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
});

export const customsValuationSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  currency: z.string().optional(),
});

export const euCustomsDataFormSchema: z.ZodType<Partial<EuCustomsDataDetails>> = z.object({
  status: z.string().optional(),
  declarationId: z.string().optional(),
  hsCode: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  netWeightKg: z.coerce.number().nullable().optional(),
  grossWeightKg: z.coerce.number().nullable().optional(),
  customsValuation: customsValuationSchema.optional(),
  cbamGoodsIdentifier: z.string().optional(),
});

export const fiberCompositionEntrySchema = z.object({
  fiberName: z.string().min(1, "Fiber name is required."),
  percentage: z.coerce.number().min(0,"Percentage cannot be negative").max(100, "Percentage cannot exceed 100").nullable(),
});

export const textileInformationSchema: z.ZodType<Partial<TextileInformation>> = z.object({
  fiberComposition: z.array(fiberCompositionEntrySchema).optional(),
  countryOfOriginLabeling: z.string().optional(),
  careInstructionsUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  isSecondHand: z.boolean().optional(),
});

export const essentialCharacteristicSchema = z.object({
  characteristicName: z.string().min(1, "Characteristic name is required."),
  value: z.string().min(1, "Value is required."),
  unit: z.string().optional(),
  testMethod: z.string().optional(),
});

export const constructionProductInformationSchema: z.ZodType<Partial<ConstructionProductInformation>> = z.object({
  declarationOfPerformanceId: z.string().optional(),
  ceMarkingDetailsUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  intendedUseDescription: z.string().optional(),
  essentialCharacteristics: z.array(essentialCharacteristicSchema).optional(),
});

export const esprSpecificsSchema: z.ZodType<Partial<EsprSpecifics>> = z.object({
  durabilityInformation: z.string().optional(),
  repairabilityInformation: z.string().optional(),
  recycledContentSummary: z.string().optional(),
  energyEfficiencySummary: z.string().optional(),
  substanceOfConcernSummary: z.string().optional(),
});

export const productDetailsSchema = z.object({
    description: z.string().optional(),
    imageUrl: z.string().url("Must be a valid URL or Data URI, or empty").or(z.literal("")).optional(),
    imageHint: z.string().max(60, "Hint should be concise, max 2-3 keywords or 60 chars.").optional(),
    materials: z.string().optional(),
    sustainabilityClaims: z.string().optional(),
    energyLabel: z.string().optional(),
    specifications: z.string().optional(),
    customAttributesJsonString: z.string().optional(),
    keyCompliancePoints: z.string().optional(),
    esprSpecifics: esprSpecificsSchema.optional(),
    conflictMineralsReportUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
    fairTradeCertificationId: z.string().optional(),
    ethicalSourcingPolicyUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
    carbonFootprint: carbonFootprintSchema.optional(), // Added for Task 3
});

export const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters.").optional(),
  gtin: z.string().optional().describe("Global Trade Item Number"),
  productDescription: z.string().optional(), // Moved from productDetails for consistency
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  sku: z.string().optional(),
  nfcTagId: z.string().optional(),
  rfidTagId: z.string().optional(),
  materials: z.string().optional().describe("Key materials used in the product, e.g., Cotton, Recycled Polyester, Aluminum."), // Moved from productDetails
  sustainabilityClaims: z.string().optional().describe("Brief sustainability claims, e.g., 'Made with 50% recycled content', 'Carbon neutral production'."), // Moved from productDetails
  keyCompliancePoints: z.string().optional().describe("Key compliance points summary."), // Moved from productDetails
  specifications: z.string().optional(), // Moved from productDetails
  energyLabel: z.string().optional(), // Moved from productDetails
  productCategory: z.string().optional().describe("Category of the product, e.g., Electronics, Apparel."),
  imageUrl: z.string().url("Must be a valid URL or Data URI, or empty").or(z.literal("")).optional(), // Moved from productDetails
  imageHint: z.string().max(60, "Hint should be concise, max 2-3 keywords or 60 chars.").optional(), // Moved from productDetails
  customAttributesJsonString: z.string().optional(), // Moved from productDetails
  
  productDetails: productDetailsSchema.optional(),

  batteryRegulation: batteryRegulationDetailsSchema.optional(),
  
  compliance: z.object({
    eprel: z.object({
        id: z.string().optional(),
        status: z.string().optional(),
        url: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
        lastChecked: z.string().optional(), 
    }).optional(),
    esprConformity: z.object({
        assessmentId: z.string().optional(),
        status: z.string().optional(), 
        assessmentDate: z.string().optional(), 
        vcId: z.string().optional(),
    }).optional(),
    scipNotification: scipNotificationFormSchema.optional(),
    euCustomsData: euCustomsDataSchema.optional(),
    battery_regulation: batteryRegulationDetailsSchema.optional(), // Mirrored for consistent handling
  }).optional(),
  
  textileInformation: textileInformationSchema.optional(), 
  constructionProductInformation: constructionProductInformationSchema.optional(), 
  onChainStatus: z.string().optional(), 
  onChainLifecycleStage: z.string().optional(), 

  conflictMineralsReportUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  fairTradeCertificationId: z.string().optional(),
  ethicalSourcingPolicyUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),

  // AI Origin tracking fields
  productNameOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  productDescriptionOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  manufacturerOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  modelNumberOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  materialsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  sustainabilityClaimsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  keyCompliancePointsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  specificationsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  energyLabelOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  imageUrlOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  batteryRegulationOrigin: z.any().optional(), 
  productDetailsOrigin: z.object({ // Added for origin tracking of ProductDetails sub-fields
    descriptionOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    materialsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    sustainabilityClaimsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    keyCompliancePointsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    specificationsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    energyLabelOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    imageUrlOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    esprSpecificsOrigin: z.object({
      durabilityInformationOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
      repairabilityInformationOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
      recycledContentSummaryOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
      energyEfficiencySummaryOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
      substanceOfConcernSummaryOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    }).optional(),
    carbonFootprintOrigin: z.object({ // Added for Task 3 origin tracking
        valueOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        unitOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        calculationMethodOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        scope1EmissionsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        scope2EmissionsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        scope3EmissionsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        dataSourceOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        vcIdOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    }).optional(),
  }).optional(),
});

export type ProductFormData = z.infer<typeof formSchema>;

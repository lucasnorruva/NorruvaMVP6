
// 'use server';
/**
 * @fileOverview Extracts and categorizes product information from supplier documents using AI.
 *
 * - extractProductData - A function to extract product data from documents.
 * - ExtractProductDataInput - The input type for the extractProductData function.
 * - ExtractProductDataOutput - The return type for the extractProductData function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { CarbonFootprintData, RecycledContentData, StateOfHealthData } from '@/types/dpp'; // Import specific types


const ExtractProductDataInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A supplier document (invoice, specification, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentType: z
    .string()
    .describe("The type of document being uploaded (e.g., 'invoice', 'specification', 'battery_spec_sheet', 'commercial_invoice', 'packing_list', 'material_safety_data_sheet')."),
});
export type ExtractProductDataInput = z.infer<typeof ExtractProductDataInputSchema>;

const CarbonFootprintSchemaForAI = z.object({
  value: z.coerce.number().nullable().optional().describe("The carbon footprint value."),
  unit: z.string().optional().describe("Unit of the carbon footprint (e.g., kg CO2e/kWh)."),
  calculationMethod: z.string().optional().describe("Methodology used (e.g., PEFCR, ISO 14067)."),
  scope1Emissions: z.coerce.number().nullable().optional().describe("Scope 1 emissions value."),
  scope2Emissions: z.coerce.number().nullable().optional().describe("Scope 2 emissions value."),
  scope3Emissions: z.coerce.number().nullable().optional().describe("Scope 3 emissions value."),
  dataSource: z.string().optional().describe("Primary data source for CF calculation."),
  vcId: z.string().optional().describe("Verifiable Credential ID for the CF data."),
}).optional();

const RecycledContentSchemaForAI = z.object({
  material: z.string().optional().describe("Specific material (e.g., Cobalt, Lithium, Overall Battery)."),
  percentage: z.coerce.number().nullable().optional().describe("Percentage of recycled content."),
  source: z.enum(['Pre-consumer', 'Post-consumer', 'Mixed', 'Unknown']).optional().describe("Source of recycled material."),
  vcId: z.string().optional().describe("Verifiable Credential ID for this claim."),
}).optional();

const StateOfHealthSchemaForAI = z.object({
  value: z.coerce.number().nullable().optional().describe("State of Health value (e.g., percentage)."),
  unit: z.string().optional().describe("Unit for State of Health (e.g., '%')."),
  measurementDate: z.string().optional().describe("Date of SoH measurement (YYYY-MM-DD)."),
  measurementMethod: z.string().optional().describe("Method used for SoH measurement."),
  vcId: z.string().optional().describe("Verifiable Credential ID for SoH data."),
}).optional();

const BatteryRegulationDetailsSchemaForAI = z.object({
  batteryChemistry: z.string().optional(),
  batteryPassportId: z.string().optional(),
  ratedCapacityAh: z.coerce.number().nullable().optional(),
  nominalVoltage: z.coerce.number().nullable().optional(),
  expectedLifetimeCycles: z.coerce.number().nullable().optional(),
  manufacturingDate: z.string().optional().describe("YYYY-MM-DD"),
  manufacturerName: z.string().optional().describe("Battery Manufacturer Name"),
  carbonFootprint: CarbonFootprintSchemaForAI,
  recycledContent: z.array(RecycledContentSchemaForAI).optional(),
  stateOfHealth: StateOfHealthSchemaForAI,
  recyclingEfficiencyRate: z.coerce.number().nullable().optional(),
  materialRecoveryRates: z.object({
    cobalt: z.coerce.number().nullable().optional(),
    lead: z.coerce.number().nullable().optional(),
    lithium: z.coerce.number().nullable().optional(),
    nickel: z.coerce.number().nullable().optional(),
  }).optional(),
  dismantlingInformationUrl: z.string().url().optional(),
  safetyInformationUrl: z.string().url().optional(),
  vcId: z.string().optional().describe("Overall VC ID for battery regulation compliance."),
}).optional();

const ScipDataSchemaForAI = z.object({
  articleName: z.string().optional().describe("Name of the article as notified to SCIP."),
  primaryArticleId: z.string().optional().describe("Primary identifier of the article (e.g., EAN, Part Number)."),
  svhcListVersion: z.string().optional().describe("Version of the ECHA Candidate List used for assessment."),
  submittingLegalEntity: z.string().optional().describe("Name or identifier of the legal entity that submitted the notification."),
  safeUseInstructionsLink: z.string().url().optional().describe("Link to safe use instructions, if SVHCs are present."),
}).optional();

const CustomsDataSchemaForAI = z.object({
  hsCode: z.string().optional().describe("Harmonized System (HS) code for customs classification."),
  countryOfOrigin: z.string().optional().describe("ISO 3166-1 alpha-2 code for the country of origin."),
}).optional();


const ExtractProductDataOutputSchema = z.object({
  productName: z.string().describe("The name of the product.").optional(),
  productDescription: z.string().describe("A detailed description of the product.").optional(),
  manufacturer: z.string().describe("The manufacturer of the product.").optional(),
  modelNumber: z.string().describe("The model number of the product.").optional(),
  specifications: z.record(z.string(), z.string()).describe("A key-value pair of product specifications.").optional(),
  energyLabel: z.string().describe("The energy label of the product, if available.").optional(),
  
  batteryRegulation: BatteryRegulationDetailsSchemaForAI.describe("Comprehensive battery regulation details."),
  
  scipData: ScipDataSchemaForAI.describe("SCIP database related information if relevant and found.").optional(),
  customsData: CustomsDataSchemaForAI.describe("Basic customs data if relevant and found.").optional(),
});
export type ExtractProductDataOutput = z.infer<typeof ExtractProductDataOutputSchema>;

export async function extractProductData(input: ExtractProductDataInput): Promise<ExtractProductDataOutput> {
  return extractProductDataFlow(input);
}

const extractProductDataPrompt = ai.definePrompt({
  name: 'extractProductDataPrompt',
  input: {schema: ExtractProductDataInputSchema},
  output: {schema: ExtractProductDataOutputSchema},
  prompt: `You are an AI assistant tasked with extracting product information from supplier documents.

You will be provided with a document and its type. Your goal is to extract relevant product information and categorize it into the general fields:
- productName, productDescription, manufacturer, modelNumber, specifications, energyLabel.

Document Type: {{{documentType}}}
Document Content: {{media url=documentDataUri}}

**Prioritization based on Document Type:**

*   **If documentType is 'battery_spec_sheet' or clearly indicates detailed battery information:**
    *   **Strongly prioritize** extracting ALL of the following battery-specific details into the 'batteryRegulation' object:
        *   batteryChemistry: (e.g., Li-ion NMC, LFP)
        *   batteryPassportId: Unique ID for the battery passport.
        *   ratedCapacityAh: (number)
        *   nominalVoltage: (number)
        *   expectedLifetimeCycles: (number)
        *   manufacturingDate: (YYYY-MM-DD)
        *   manufacturerName: (Battery specific manufacturer if different from product)
        *   carbonFootprint: Object with 'value' (number), 'unit', 'calculationMethod', 'scope1Emissions' (number), 'scope2Emissions' (number), 'scope3Emissions' (number), 'dataSource', 'vcId' (optional).
        *   recycledContent: Array of objects, each with 'material', 'percentage' (number), 'source' ('Pre-consumer', 'Post-consumer', 'Mixed', 'Unknown'), 'vcId' (optional). Extract up to 2-3 key materials.
        *   stateOfHealth: Object with 'value' (number), 'unit', 'measurementDate' (YYYY-MM-DD), 'measurementMethod', 'vcId' (optional).
        *   recyclingEfficiencyRate: (number, percentage)
        *   materialRecoveryRates: Object with 'cobalt', 'lead', 'lithium', 'nickel' (numbers, percentages).
        *   dismantlingInformationUrl: (URL)
        *   safetyInformationUrl: (URL)
        *   vcId: Overall Verifiable Credential ID for battery regulation compliance.
    *   Also extract general product information (productName, manufacturer, modelNumber) if present.

*   **If documentType is 'commercial_invoice' or 'packing_list':**
    *   **Prioritize** extracting customs-related data into a 'customsData' object:
        *   hsCode: Harmonized System (HS) code.
        *   countryOfOrigin: ISO 3166-1 alpha-2 code for the country of origin.
    *   Also extract general product information like productName, modelNumber if clearly identifiable. Other fields like productDescription or detailed specifications may be less relevant from these document types.

*   **If documentType is 'material_safety_data_sheet' (MSDS), 'specification_sheet' that clearly discusses chemical composition or substances of concern:**
    *   **Prioritize** extracting SCIP-related data into a 'scipData' object:
        *   articleName: Name of the article containing the SVHC.
        *   primaryArticleId: Identifier for the article (e.g., part number).
        *   svhcListVersion: Version of the ECHA Candidate List used (if mentioned).
        *   submittingLegalEntity: The entity name responsible for submission (if mentioned).
        *   safeUseInstructionsLink: URL for safe use instructions (if provided).
    *   Also extract general product information, especially 'productName' and 'materials' if specified.

*   **For other documentTypes (e.g., 'invoice', 'general_specification', 'bill_of_materials', 'technical_drawing'):**
    *   Extract as much of the general product information as possible: productName, productDescription, manufacturer, modelNumber, specifications, energyLabel.
    *   If battery, SCIP, or customs details are incidentally present and clearly identifiable, extract them into their respective objects.

Extract the product information and return it in JSON format. If a numeric field cannot be found, omit it or return null where appropriate within nested objects. For arrays like 'recycledContent', if no information is found, return an empty array or omit the field. Only include the 'scipData' or 'customsData' objects if relevant information is found and prioritized by document type. Ensure the 'batteryRegulation' object is always present, even if empty or partially filled, if the document type is battery-related.
`,
});

const extractProductDataFlow = ai.defineFlow(
  {
    name: 'extractProductDataFlow',
    inputSchema: ExtractProductDataInputSchema,
    outputSchema: ExtractProductDataOutputSchema,
  },
  async input => {
    const {output} = await extractProductDataPrompt(input);
    // Ensure batteryRegulation object is present if not returned by AI, especially for battery-related docs
    if (input.documentType.includes('battery') && (!output || !output.batteryRegulation)) {
      return { ...output, batteryRegulation: {} };
    }
    return output!;
  }
);


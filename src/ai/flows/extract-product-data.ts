
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
    .describe("The type of document being uploaded (e.g., 'invoice', 'specification', 'battery_spec_sheet')."),
});
export type ExtractProductDataInput = z.infer<typeof ExtractProductDataInputSchema>;

const CarbonFootprintSchemaForAI = z.object({
  value: z.number().optional().describe("The carbon footprint value."),
  unit: z.string().optional().describe("Unit of the carbon footprint (e.g., kg CO2e/kWh)."),
  calculationMethod: z.string().optional().describe("Methodology used (e.g., PEFCR, ISO 14067)."),
  vcId: z.string().optional().describe("Verifiable Credential ID for the CF data."),
}).optional();

const RecycledContentSchemaForAI = z.object({
  material: z.string().optional().describe("Specific material (e.g., Cobalt, Lithium)."),
  percentage: z.number().optional().describe("Percentage of recycled content."),
  vcId: z.string().optional().describe("Verifiable Credential ID for this claim."),
}).optional();

const StateOfHealthSchemaForAI = z.object({
  value: z.number().optional().describe("State of Health value (e.g., percentage)."),
  unit: z.string().optional().describe("Unit for State of Health (e.g., '%')."),
  measurementDate: z.string().optional().describe("Date of SoH measurement (YYYY-MM-DD)."),
  vcId: z.string().optional().describe("Verifiable Credential ID for SoH data."),
}).optional();


const ExtractProductDataOutputSchema = z.object({
  productName: z.string().describe("The name of the product.").optional(),
  productDescription: z.string().describe("A detailed description of the product.").optional(),
  manufacturer: z.string().describe("The manufacturer of the product.").optional(),
  modelNumber: z.string().describe("The model number of the product.").optional(),
  specifications: z.record(z.string(), z.string()).describe("A key-value pair of product specifications.").optional(),
  energyLabel: z.string().describe("The energy label of the product, if available.").optional(),
  
  // Updated Battery Regulation Fields
  batteryChemistry: z.string().describe("The chemical composition of the battery (e.g., Li-ion NMC, LFP).").optional(),
  batteryPassportId: z.string().describe("Unique identifier for the battery passport itself.").optional(),
  carbonFootprint: CarbonFootprintSchemaForAI.describe("Carbon footprint details of the battery."),
  recycledContent: z.array(RecycledContentSchemaForAI).optional().describe("Recycled content details for key materials in the battery."),
  stateOfHealth: StateOfHealthSchemaForAI.describe("State of Health details of the battery."),
  batteryRegulationVcId: z.string().describe("Overall Verifiable Credential ID for battery regulation compliance.").optional(),
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

You will be provided with a document and its type. Your goal is to extract relevant product information and categorize it into the following fields:

- productName: The name of the product.
- productDescription: A detailed description of the product.
- manufacturer: The manufacturer of the product.
- modelNumber: The model number of the product.
- specifications: A key-value pair of product specifications (e.g., {"color": "blue", "weight": "10kg"}).
- energyLabel: The energy label of the product, if available (e.g., A++, B).

If the document appears to be related to a battery (e.g., documentType is 'battery_spec_sheet' or content suggests it), also extract the following battery-specific details:
- batteryChemistry: The chemical composition of the battery (e.g., Li-ion NMC, LFP).
- batteryPassportId: The unique ID of the battery passport itself, if mentioned.
- carbonFootprint: An object with 'value' (number), 'unit' (e.g., "kg CO2e/kWh"), 'calculationMethod' (e.g., "PEFCR for Batteries v1.2"), and 'vcId' (optional string).
- recycledContent: An array of objects. Each object should have 'material' (e.g., "Cobalt"), 'percentage' (number), and 'vcId' (optional string). Extract up to 2-3 key materials if specified.
- stateOfHealth: An object with 'value' (number, e.g., 98 for 98%), 'unit' (e.g., "%"), 'measurementDate' (string, e.g., "YYYY-MM-DD"), and 'vcId' (optional string).
- batteryRegulationVcId: An overall Verifiable Credential ID for the battery regulation compliance, if mentioned separately.

Document Type: {{{documentType}}}
Document Content: {{media url=documentDataUri}}

Extract the product information and return it in JSON format. If a numeric field cannot be found, omit it or return null where appropriate within nested objects. For arrays like 'recycledContent', if no information is found, return an empty array or omit the field.
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
    return output!;
  }
);


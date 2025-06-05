
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

const ExtractProductDataOutputSchema = z.object({
  productName: z.string().describe("The name of the product.").optional(),
  productDescription: z.string().describe("A detailed description of the product.").optional(),
  manufacturer: z.string().describe("The manufacturer of the product.").optional(),
  modelNumber: z.string().describe("The model number of the product.").optional(),
  specifications: z.record(z.string(), z.string()).describe("A key-value pair of product specifications.").optional(),
  energyLabel: z.string().describe("The energy label of the product, if available.").optional(),
  // Battery Regulation Fields
  batteryChemistry: z.string().describe("The chemical composition of the battery (e.g., Li-ion NMC, LFP).").optional(),
  stateOfHealth: z.number().describe("The state of health of the battery as a percentage (e.g., 98 for 98%).").optional(),
  carbonFootprintManufacturing: z.number().describe("The carbon footprint of the battery manufacturing process in kg CO2e.").optional(),
  recycledContentPercentage: z.number().describe("The percentage of recycled content in the battery (e.g., 15 for 15%).").optional(),
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

If the document appears to be related to a battery (e.g., documentType is 'battery_spec_sheet' or content suggests it), also extract the following:
- batteryChemistry: The chemical composition of the battery (e.g., Li-ion NMC, LFP).
- stateOfHealth: The state of health of the battery as a percentage (e.g., 98 for 98%). Extract only the number.
- carbonFootprintManufacturing: The carbon footprint of the battery manufacturing process in kg CO2e. Extract only the number.
- recycledContentPercentage: The percentage of recycled content in the battery (e.g., 15 for 15%). Extract only the number.


Document Type: {{{documentType}}}
Document Content: {{media url=documentDataUri}}

Extract the product information and return it in JSON format. If a numeric field cannot be found, omit it or return null.
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

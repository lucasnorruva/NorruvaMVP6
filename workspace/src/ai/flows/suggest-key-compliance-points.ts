
'use server';
/**
 * @fileOverview An AI agent to suggest key compliance points for a product.
 *
 * - suggestKeyCompliancePoints - A function to get compliance point suggestions.
 * - SuggestKeyCompliancePointsInput - The input type for the function.
 * - SuggestKeyCompliancePointsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SuggestKeyCompliancePointsInputSchema = z.object({
  productName: z.string().optional().describe('The name of the product.'),
  productCategory: z.string().describe('The category of the product (e.g., Electronics, Apparel, Battery).'),
  regulationsApplicable: z.string().optional().describe('A brief comma-separated list of key regulations applicable or focused on (e.g., "ESPR, RoHS", "EU Battery Regulation").'),
});
export type SuggestKeyCompliancePointsInput = z.infer<typeof SuggestKeyCompliancePointsInputSchema>;

export const SuggestKeyCompliancePointsOutputSchema = z.object({
  compliancePoints: z.array(z.string()).describe('An array of 3-5 concise key compliance points relevant to the product and its regulations.'),
});
export type SuggestKeyCompliancePointsOutput = z.infer<typeof SuggestKeyCompliancePointsOutputSchema>;

export async function suggestKeyCompliancePoints(
  input: SuggestKeyCompliancePointsInput
): Promise<SuggestKeyCompliancePointsOutput> {
  return suggestKeyCompliancePointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKeyCompliancePointsPrompt',
  input: {schema: SuggestKeyCompliancePointsInputSchema},
  output: {schema: SuggestKeyCompliancePointsOutputSchema},
  prompt: `You are a product compliance expert. Based on the product's name (if available), category, and a list of applicable regulations, suggest 3-5 concise key compliance points.
These points should highlight important aspects of compliance for the given product type and regulations.
Each point should be a short phrase.

Product Name: {{{productName}}}
Product Category: {{{productCategory}}}
{{#if regulationsApplicable}}Applicable Regulations Focus: {{{regulationsApplicable}}}{{#endif}}

Return ONLY the suggested compliance points in the 'compliancePoints' field of the JSON output, which should be an array of strings.
Example for an EV Battery with "EU Battery Regulation": { "compliancePoints": ["Battery Passport Ready", "Carbon Footprint Declared", "Recycled Content Meets Targets", "Due Diligence for Raw Materials Implemented", "QR Code for Public Access"] }
Example for Apparel with "ESPR, Textile Labeling": { "compliancePoints": ["ESPR Durability Compliant", "Fiber Composition Clearly Labeled", "Care Instructions Available", "Substance of Concern (SVHC) Free", "Traceable Supply Chain Information (Conceptual)"] }
Example for Electronics with "RoHS, WEEE, ESPR": { "compliancePoints": ["RoHS Compliant (Hazardous Substances Restricted)", "WEEE Collection & Recycling Scheme Participant", "ESPR Energy Efficiency Met", "Repairability Information Available", "CE Marked for EU Market"] }
`,
});

const suggestKeyCompliancePointsFlow = ai.defineFlow(
  {
    name: 'suggestKeyCompliancePointsFlow',
    inputSchema: SuggestKeyCompliancePointsInputSchema,
    outputSchema: SuggestKeyCompliancePointsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output || { compliancePoints: [] };
  }
);


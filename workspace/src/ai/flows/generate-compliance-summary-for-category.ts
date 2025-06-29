
'use server';
/**
 * @fileOverview An AI agent to generate a summary of key compliance considerations for a given product category.
 *
 * - generateComplianceSummaryForCategory - A function to get the compliance summary.
 * - GenerateComplianceSummaryForCategoryInput - The input type for the function.
 * - GenerateComplianceSummaryForCategoryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateComplianceSummaryForCategoryInputSchema = z.object({
  productCategory: z.string().describe('The category of the product (e.g., Electronics, Apparel, Batteries, Construction Materials).'),
  focusedRegulations: z.string().optional().describe('A brief comma-separated list of key regulations to specifically focus on (e.g., "ESPR, RoHS", "EU Battery Regulation", "CPR").'),
});
export type GenerateComplianceSummaryForCategoryInput = z.infer<typeof GenerateComplianceSummaryForCategoryInputSchema>;

export const GenerateComplianceSummaryForCategoryOutputSchema = z.object({
  categoryComplianceSummary: z.string().describe('A concise summary (2-4 bullet points or a short paragraph) of the most critical compliance considerations for the product category, potentially emphasizing focused regulations if provided.'),
});
export type GenerateComplianceSummaryForCategoryOutput = z.infer<typeof GenerateComplianceSummaryForCategoryOutputSchema>;

export async function generateComplianceSummaryForCategory(
  input: GenerateComplianceSummaryForCategoryInput
): Promise<GenerateComplianceSummaryForCategoryOutput> {
  return generateComplianceSummaryForCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateComplianceSummaryForCategoryPrompt',
  input: {schema: GenerateComplianceSummaryForCategoryInputSchema},
  output: {schema: GenerateComplianceSummaryForCategoryOutputSchema},
  prompt: `You are a product compliance expert. Given a product category and optionally a few key regulations to focus on, generate a concise summary (2-4 bullet points or a short paragraph) of the MOST CRITICAL compliance considerations or regulations typically applicable to that product category.
If focused regulations are provided, prioritize those in your summary. Keep the summary brief and high-level.

Product Category: {{{productCategory}}}
{{#if focusedRegulations}}Focused Regulations: {{{focusedRegulations}}}{{/if}}

Example for Category "Electronics", Focused Regulations "RoHS, WEEE":
- Ensure restriction of hazardous substances (RoHS) like lead, mercury, cadmium.
- Comply with WEEE directive for collection, treatment, and recycling of electronic waste.
- Verify CE marking requirements are met for EU market access.
- Consider EMC (Electromagnetic Compatibility) directive compliance.

Example for Category "Batteries", Focused Regulations "EU Battery Regulation":
- Adhere to EU Battery Regulation (2023/1542) requirements.
- Provide a Digital Battery Passport with details on carbon footprint, recycled content, SoH.
- Ensure compliance with collection, treatment, and recycling targets.
- Implement due diligence for raw material sourcing (e.g., cobalt, lithium).

Example for Category "Textiles", Focused Regulations "ESPR, Textile Labeling Regulation":
- Address ESPR requirements for durability, repairability, and recyclability.
- Ensure accurate fiber composition labeling as per EU Textile Labeling Regulation.
- Declare any SVHCs used in dyes or treatments (REACH).
- Consider eco-labeling (e.g., EU Ecolabel for textiles) if applicable.

Example for Category "Construction Materials", Focused Regulations "CPR":
- Comply with Construction Products Regulation (CPR) for CE marking and Declaration of Performance (DoP).
- Ensure product characteristics meet harmonized European standards (hENs).
- Address safety requirements, including reaction to fire and structural integrity.
- Consider environmental performance (EPD) and substance declarations.

Return ONLY the summary in the 'categoryComplianceSummary' field. The summary should be a single string, potentially with newline characters for bullet points.
`,
});

const generateComplianceSummaryForCategoryFlow = ai.defineFlow(
  {
    name: 'generateComplianceSummaryForCategoryFlow',
    inputSchema: GenerateComplianceSummaryForCategoryInputSchema,
    outputSchema: GenerateComplianceSummaryForCategoryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output?.categoryComplianceSummary) {
        // Fallback or error if AI doesn't return expected format
        return { categoryComplianceSummary: "Could not generate compliance summary for this category. Please check inputs or try again." };
    }
    return output;
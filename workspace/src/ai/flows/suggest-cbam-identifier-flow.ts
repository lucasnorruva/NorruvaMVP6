
'use server';
/**
 * @fileOverview An AI agent to suggest a CBAM Goods Identifier (conceptual CN code) for a product.
 *
 * - suggestCbamIdentifier - A function to get CBAM identifier suggestions.
 * - SuggestCbamIdentifierInputSchema - The input type for the function.
 * - SuggestCbamIdentifierOutputSchema - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SuggestCbamIdentifierInputSchema = z.object({
  productCategory: z.string().describe('The category of the product (e.g., Construction Materials, Electronics, Automotive Parts).'),
  productDescription: z.string().optional().describe('A brief description of the product.'),
});
export type SuggestCbamIdentifierInput = z.infer<typeof SuggestCbamIdentifierInputSchema>;

export const SuggestCbamIdentifierOutputSchema = z.object({
  suggestedIdentifier: z.string().describe('A suggested Combined Nomenclature (CN) code (e.g., "72081000" for certain iron/steel) or a textual indication like "Potentially CBAM relevant" or "Likely not CBAM relevant".'),
  reasoning: z.string().describe('A brief explanation for the suggestion, including which CBAM sector might be relevant.'),
});
export type SuggestCbamIdentifierOutput = z.infer<typeof SuggestCbamIdentifierOutputSchema>;

export async function suggestCbamIdentifier(
  input: SuggestCbamIdentifierInput
): Promise<SuggestCbamIdentifierOutput> {
  return suggestCbamIdentifierFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCbamIdentifierPrompt',
  input: {schema: SuggestCbamIdentifierInputSchema},
  output: {schema: SuggestCbamIdentifierOutputSchema},
  prompt: `You are a customs classification assistant specializing in the EU Carbon Border Adjustment Mechanism (CBAM).
The initial CBAM scope covers: Cement, Iron and Steel, Aluminium, Fertilisers, Electricity, and Hydrogen.

Given the product category and description, analyze if the product likely falls under one of these CBAM sectors.
- If it strongly matches a CBAM sector, suggest a plausible 8-digit Combined Nomenclature (CN) code relevant to that sector (e.g., Cement clinker: 25231000, certain Iron/Steel flat-rolled products: 7208xxxx, Aluminium structures: 76109090, Ammonia (fertiliser): 28141000). Provide a brief reasoning.
- If it's borderline or could be CBAM relevant based on more specific details not provided, state "Potentially CBAM relevant" and explain why (e.g., "Category 'Industrial Machinery' might contain significant steel components").
- If it's clearly not in the initial CBAM scope (e.g., "Apparel", "Software"), state "Likely not CBAM relevant (initial scope)" and briefly explain.

Product Category: {{{productCategory}}}
{{#if productDescription}}Product Description: {{{productDescription}}}{{/if}}

Return ONLY the 'suggestedIdentifier' and 'reasoning' in the specified JSON format.
Example output for "Steel Beams": { "suggestedIdentifier": "72163310", "reasoning": "Product falls under Iron and Steel. Suggested CN code is for U, I or H sections of iron or non-alloy steel." }
Example output for "Leather Handbag": { "suggestedIdentifier": "Likely not CBAM relevant (initial scope)", "reasoning": "Apparel and accessories are not in the initial CBAM scope." }
Example output for "Electric Bicycle": { "suggestedIdentifier": "Potentially CBAM relevant", "reasoning": "May contain significant aluminium or steel in the frame, and the battery might have separate considerations if imported as such." }
`,
});

const suggestCbamIdentifierFlow = ai.defineFlow(
  {
    name: 'suggestCbamIdentifierFlow',
    inputSchema: SuggestCbamIdentifierInputSchema,
    outputSchema: SuggestCbamIdentifierOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      return {
        suggestedIdentifier: "Could not determine CBAM relevance",
        reasoning: "AI flow did not return a valid response."
      };
    }
    return output;
  }
);

    

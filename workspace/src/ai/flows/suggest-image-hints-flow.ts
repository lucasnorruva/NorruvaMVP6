
'use server';
/**
 * @fileOverview An AI agent to suggest image hints for product photography.
 *
 * - suggestImageHints - A function to get image hint suggestions.
 * - SuggestImageHintsInputSchema - The input type for the function.
 * - SuggestImageHintsOutputSchema - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SuggestImageHintsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productCategory: z.string().optional().describe('The category of the product (e.g., Electronics, Apparel).'),
});
export type SuggestImageHintsInput = z.infer<typeof SuggestImageHintsInputSchema>;

export const SuggestImageHintsOutputSchema = z.object({
  imageHints: z.array(z.string()).describe('An array of 2-3 concise keywords or short phrases to guide image generation.'),
});
export type SuggestImageHintsOutput = z.infer<typeof SuggestImageHintsOutputSchema>;

export async function suggestImageHints(
  input: SuggestImageHintsInput
): Promise<SuggestImageHintsOutput> {
  return suggestImageHintsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImageHintsPrompt',
  input: {schema: SuggestImageHintsInputSchema},
  output: {schema: SuggestImageHintsOutputSchema},
  prompt: `You are a product photography art director.
Given the product name and category, suggest 2-3 concise keywords or short phrases (max 2 words each) that would be effective as hints for an AI image generation model.
These hints should guide the model to create a suitable, professional product photo. Consider common product photography styles.

Product Name: {{{productName}}}
{{#if productCategory}}Product Category: {{{productCategory}}}{{/if}}

Examples:
- For "EcoSmart Refrigerator X500" (Appliances): ["kitchen scene", "stainless steel", "modern interior"]
- For "Sustainable Cotton T-Shirt" (Apparel): ["lifestyle model", "neutral background", "close-up fabric"]
- For "High-Performance EV Battery" (Automotive Parts): ["clean studio", "product isolated", "tech detail"]
- For "Recycled Polymer Phone Case" (Accessories): ["hand holding", "device mockup", "sleek design"]

Return ONLY the suggested hints in the 'imageHints' field of the JSON output, which should be an array of strings.
Each hint in the array should be a maximum of two words.
`,
});

const suggestImageHintsFlow = ai.defineFlow(
  {
    name: 'suggestImageHintsFlow',
    inputSchema: SuggestImageHintsInputSchema,
    outputSchema: SuggestImageHintsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Ensure hints are max 2 words
    const processedHints = output?.imageHints.map(hint => 
        hint.split(" ").slice(0, 2).join(" ")
    ) || [];
    return { imageHints: processedHints };
  }
);


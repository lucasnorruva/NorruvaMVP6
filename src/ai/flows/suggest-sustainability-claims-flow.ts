
'use server';
/**
 * @fileOverview An AI agent to suggest sustainability claims for products.
 *
 * - suggestSustainabilityClaims - A function to get claim suggestions.
 * - SuggestSustainabilityClaimsInput - The input type for the function.
 * - SuggestSustainabilityClaimsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSustainabilityClaimsInputSchema = z.object({
  productCategory: z.string().describe('The category of the product (e.g., Electronics, Apparel, Appliances).'),
  productName: z.string().describe('The name of the product.').optional(),
  productDescription: z.string().describe('A brief description of the product.').optional(),
  materials: z.string().describe('Key materials used in the product (comma-separated if multiple, e.g., "Organic Cotton, Recycled Polyester").').optional(),
});
export type SuggestSustainabilityClaimsInput = z.infer<typeof SuggestSustainabilityClaimsInputSchema>;

const SuggestSustainabilityClaimsOutputSchema = z.object({
  claims: z.array(z.string()).describe('An array of 3-5 suggested sustainability claims, each as a short phrase.'),
});
export type SuggestSustainabilityClaimsOutput = z.infer<typeof SuggestSustainabilityClaimsOutputSchema>;

export async function suggestSustainabilityClaims(
  input: SuggestSustainabilityClaimsInput
): Promise<SuggestSustainabilityClaimsOutput> {
  return suggestSustainabilityClaimsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSustainabilityClaimsPrompt',
  input: {schema: SuggestSustainabilityClaimsInputSchema},
  output: {schema: SuggestSustainabilityClaimsOutputSchema},
  prompt: `You are a product sustainability expert. Based on the provided product information, suggest 3-5 concise and relevant sustainability claims.
Focus on common and impactful claims related to materials, energy efficiency, recyclability, ethical sourcing, etc.
Each claim should be a short, marketable phrase.

Product Category: {{{productCategory}}}
{{#if productName}}Product Name: {{{productName}}}{{/if}}
{{#if productDescription}}Product Description: {{{productDescription}}}{{/if}}
{{#if materials}}Key Materials: {{{materials}}}{{/if}}

Return ONLY the suggested claims in the specified JSON array format. Ensure claims are distinct.
Example claim: "Made with 70% recycled materials"
Example claim: "Energy Star Certified"
Example claim: "Packaging is 100% recyclable"
Example claim: "Ethically sourced cotton"
`,
});

const suggestSustainabilityClaimsFlow = ai.defineFlow(
  {
    name: 'suggestSustainabilityClaimsFlow',
    inputSchema: SuggestSustainabilityClaimsInputSchema,
    outputSchema: SuggestSustainabilityClaimsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output || { claims: [] }; // Ensure an empty array if output is null/undefined
  }
);

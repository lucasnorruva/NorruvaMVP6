"use server";
/**
 * @fileOverview An AI agent to suggest key sustainability points/claims for a product.
 *
 * - suggestKeySustainabilityPoints - A function to get sustainability point suggestions.
 * - SuggestKeySustainabilityPointsInput - The input type for the function.
 * - SuggestKeySustainabilityPointsOutput - The return type for the function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

export const SuggestKeySustainabilityPointsInputSchema = z.object({
  productName: z.string().optional().describe("The name of the product."),
  productCategory: z
    .string()
    .optional()
    .describe("The category of the product (e.g., Electronics, Apparel)."),
  productDescription: z
    .string()
    .optional()
    .describe("A detailed description of the product."),
  materials: z
    .string()
    .optional()
    .describe("Key materials used in the product (comma-separated)."),
});
export type SuggestKeySustainabilityPointsInput = z.infer<
  typeof SuggestKeySustainabilityPointsInputSchema
>;

export const SuggestKeySustainabilityPointsOutputSchema = z.object({
  sustainabilityPoints: z
    .array(z.string())
    .describe(
      "An array of 3-5 concise, marketable sustainability points/claims.",
    ),
});
export type SuggestKeySustainabilityPointsOutput = z.infer<
  typeof SuggestKeySustainabilityPointsOutputSchema
>;

export async function suggestKeySustainabilityPoints(
  input: SuggestKeySustainabilityPointsInput,
): Promise<SuggestKeySustainabilityPointsOutput> {
  return suggestKeySustainabilityPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: "suggestKeySustainabilityPointsPrompt",
  input: { schema: SuggestKeySustainabilityPointsInputSchema },
  output: { schema: SuggestKeySustainabilityPointsOutputSchema },
  prompt: `You are a product sustainability expert. Based on the provided product information (name, category, description, materials), suggest 3-5 concise and marketable sustainability points or claims.
Focus on common and impactful claims related to materials, energy efficiency, recyclability, ethical sourcing, carbon footprint, etc.
Each point should be a short phrase suitable for a product page or label.

Product Name: {{{productName}}}
{{#if productCategory}}Product Category: {{{productCategory}}}{{#endif}}
{{#if productDescription}}Product Description: {{{productDescription}}}{{#endif}}
{{#if materials}}Key Materials: {{{materials}}}{{#endif}}

Return ONLY the suggested sustainability points in the 'sustainabilityPoints' field of the JSON output, which should be an array of strings.
Example Output: { "sustainabilityPoints": ["Made with 70% recycled ocean-bound plastic", "Energy Star Certified for efficiency", "Packaging is 100% recyclable and compostable", "Ethically sourced organic cotton", "Carbon-neutral manufacturing process"] }
`,
});

const suggestKeySustainabilityPointsFlow = ai.defineFlow(
  {
    name: "suggestKeySustainabilityPointsFlow",
    inputSchema: SuggestKeySustainabilityPointsInputSchema,
    outputSchema: SuggestKeySustainabilityPointsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || { sustainabilityPoints: [] }; // Ensure an empty array if output is null/undefined
  },
);

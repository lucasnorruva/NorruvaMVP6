"use server";
/**
 * @fileOverview An AI agent to suggest a product name based on its description and category.
 *
 * - generateProductName - A function to get a product name suggestion.
 * - GenerateProductNameInput - The input type for the function.
 * - GenerateProductNameOutput - The return type for the function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateProductNameInputSchema = z.object({
  productDescription: z
    .string()
    .describe("A detailed description of the product."),
  productCategory: z
    .string()
    .describe("The category of the product (e.g., Electronics, Apparel).")
    .optional(),
});
export type GenerateProductNameInput = z.infer<
  typeof GenerateProductNameInputSchema
>;

const GenerateProductNameOutputSchema = z.object({
  productName: z
    .string()
    .describe("A concise and marketable product name suggested by the AI."),
});
export type GenerateProductNameOutput = z.infer<
  typeof GenerateProductNameOutputSchema
>;

export async function generateProductName(
  input: GenerateProductNameInput,
): Promise<GenerateProductNameOutput> {
  return generateProductNameFlow(input);
}

const prompt = ai.definePrompt({
  name: "generateProductNamePrompt",
  input: { schema: GenerateProductNameInputSchema },
  output: { schema: GenerateProductNameOutputSchema },
  prompt: `You are an expert product marketing assistant.
Given the product category and description below, generate one concise and marketable product name.
The name should be catchy, relevant, and ideally unique. Avoid overly generic names.

Product Category: {{{productCategory}}}
Product Description: {{{productDescription}}}

Return ONLY the suggested product name in the 'productName' field of the JSON output.
Example output: { "productName": "EcoSpark Smart Bulb" }
`,
});

const generateProductNameFlow = ai.defineFlow(
  {
    name: "generateProductNameFlow",
    inputSchema: GenerateProductNameInputSchema,
    outputSchema: GenerateProductNameOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output?.productName) {
      // Fallback or error if AI doesn't return expected format
      throw new Error(
        "AI failed to generate a product name in the expected format.",
      );
    }
    return output;
  },
);

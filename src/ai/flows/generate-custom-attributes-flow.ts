"use server";
/**
 * @fileOverview An AI agent to suggest custom attributes for a product.
 *
 * - generateCustomAttributes - A function to get custom attribute suggestions.
 * - GenerateCustomAttributesInput - The input type for the function.
 * - GenerateCustomAttributesOutput - The return type for the function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateCustomAttributesInputSchema = z.object({
  productName: z.string().describe("The name of the product."),
  productCategory: z
    .string()
    .optional()
    .describe("The category of the product (e.g., Electronics, Apparel)."),
  productDescription: z
    .string()
    .optional()
    .describe("A detailed description of the product."),
});
export type GenerateCustomAttributesInput = z.infer<
  typeof GenerateCustomAttributesInputSchema
>;

const CustomAttributeSchema = z.object({
  key: z
    .string()
    .describe(
      "The key of the custom attribute (e.g., 'Capacity (ml)', 'Compatible Laptop Size').",
    ),
  value: z
    .string()
    .describe("The value of the custom attribute (e.g., '350', '13-inch')."),
});

const GenerateCustomAttributesOutputSchema = z.object({
  customAttributes: z
    .array(CustomAttributeSchema)
    .describe(
      "An array of 2-3 suggested custom attributes, each with a key and value.",
    ),
});
export type GenerateCustomAttributesOutput = z.infer<
  typeof GenerateCustomAttributesOutputSchema
>;

export async function generateCustomAttributes(
  input: GenerateCustomAttributesInput,
): Promise<GenerateCustomAttributesOutput> {
  return generateCustomAttributesFlow(input);
}

const prompt = ai.definePrompt({
  name: "generateCustomAttributesPrompt",
  input: { schema: GenerateCustomAttributesInputSchema },
  output: { schema: GenerateCustomAttributesOutputSchema },
  prompt: `You are a product data specialist. Based on the product's name, category, and description, suggest 2-3 relevant custom attributes (key-value pairs) that would be useful for further describing this product.
These attributes should be specific and not typically covered by standard fields like GTIN, manufacturer, or primary materials (which are handled elsewhere).
Focus on unique characteristics or common secondary specifications.
Return ONLY an array of objects, where each object has a "key" and a "value" string field, in the 'customAttributes' field of the JSON output.

Product Name: {{{productName}}}
{{#if productCategory}}Product Category: {{{productCategory}}}{{/if}}
{{#if productDescription}}Product Description: {{{productDescription}}}{{/if}}

Example for a "Smart Coffee Mug":
{ "customAttributes": [{ "key": "Capacity (ml)", "value": "350" }, { "key": "Temperature Control Range", "value": "50-65°C" }, { "key": "App Connected", "value": "Yes" }] }

Example for a "Leather Laptop Sleeve":
{ "customAttributes": [{ "key": "Compatible Laptop Size", "value": "13-inch" }, { "key": "Lining Material", "value": "Soft Microfiber" }, { "key": "Closure Type", "value": "Magnetic Flap" }] }

Example for a "Recycled PET Water Bottle":
{ "customAttributes": [{ "key": "Volume (L)", "value": "0.75" }, { "key": "Lid Type", "value": "Screw-on, Leak-proof" }, { "key": "BPA-Free", "value": "Yes" }] }
`,
});

const generateCustomAttributesFlow = ai.defineFlow(
  {
    name: "generateCustomAttributesFlow",
    inputSchema: GenerateCustomAttributesInputSchema,
    outputSchema: GenerateCustomAttributesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || { customAttributes: [] }; // Ensure an empty array if output is null/undefined
  },
);

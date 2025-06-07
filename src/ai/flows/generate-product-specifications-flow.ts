'use server';
/**
 * @fileOverview An AI agent to generate plausible technical specifications for a product.
 *
 * - generateProductSpecifications - A function to get a JSON string of specifications.
 * - GenerateProductSpecificationsInput - The input type for the function.
 * - GenerateProductSpecificationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductSpecificationsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().optional().describe('A detailed description of the product.'),
  productCategory: z.string().optional().describe('The category of the product (e.g., Electronics, Apparel).'),
});
export type GenerateProductSpecificationsInput = z.infer<typeof GenerateProductSpecificationsInputSchema>;

const GenerateProductSpecificationsOutputSchema = z.object({
  specificationsJsonString: z.string().describe('A JSON string representing key-value pairs of plausible technical specifications for the product. Example: {"color": "blue", "weight": "250g", "material": "Recycled ABS Plastic"}'),
});
export type GenerateProductSpecificationsOutput = z.infer<typeof GenerateProductSpecificationsOutputSchema>;

export async function generateProductSpecifications(
  input: GenerateProductSpecificationsInput
): Promise<GenerateProductSpecificationsOutput> {
  return generateProductSpecificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductSpecificationsPrompt',
  input: {schema: GenerateProductSpecificationsInputSchema},
  output: {schema: GenerateProductSpecificationsOutputSchema},
  prompt: `You are an expert product data specialist.
Given the product name, description, and category below, generate a plausible JSON object string of 3-5 key-value technical specifications.
The keys should be descriptive (e.g., "material", "dimensions", "power_source", "connectivity") and values appropriate for the product.
Ensure the output is a valid JSON string.

Product Name: {{{productName}}}
{{#if productDescription}}Product Description: {{{productDescription}}}{{/if}}
{{#if productCategory}}Product Category: {{{productCategory}}}{{/if}}

Return ONLY the generated JSON string in the 'specificationsJsonString' field of the JSON output.
Example for an "EcoSpark Smart Bulb" in "Electronics":
{ "specificationsJsonString": "{\\"lumens\\": 800, \\"color_temperature\\": \\"2700K-6500K\\", \\"connectivity\\": \\"Wi-Fi, Bluetooth\\", \\"wattage_equivalent\\": \\"60W\\", \\"lifespan_hours\\": 25000}" }
Example for a "TrailBlazer Hiking Boot" in "Apparel":
{ "specificationsJsonString": "{\\"material\\": \\"Gore-Tex, Vibram Sole\\", \\"weight_grams\\": 450, \\"waterproof_rating\\": \\"IPX7\\", \\"recommended_use\\": \\"Trail Hiking, Backpacking\\"}" }
Example for a "Stainless Steel Water Bottle" in "Homeware":
{ "specificationsJsonString": "{\\"capacity_ml\\": 750, \\"material\\": \\"18/8 Stainless Steel\\", \\"insulation_hours_cold\\": 24, \\"insulation_hours_hot\\": 12, \\"bpa_free\\": true}" }

`,
});

const generateProductSpecificationsFlow = ai.defineFlow(
  {
    name: 'generateProductSpecificationsFlow',
    inputSchema: GenerateProductSpecificationsInputSchema,
    outputSchema: GenerateProductSpecificationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output?.specificationsJsonString) {
      throw new Error("AI failed to generate product specifications in the expected format.");
    }
    // Attempt to parse and re-stringify to ensure it's valid JSON and nicely formatted
    try {
        const parsed = JSON.parse(output.specificationsJsonString);
        return { specificationsJsonString: JSON.stringify(parsed, null, 2) };
    } catch (e) {
        // If parsing fails, return the original string; the user might fix it manually.
        // It might be an LLM formatting issue like forgetting to escape quotes in the string value of the JSON.
        console.warn("AI generated specifications string was not valid JSON, returning as is.", e);
        return { specificationsJsonString: output.specificationsJsonString };
    }
  }
);

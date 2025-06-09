
'use server';
/**
 * @fileOverview An AI agent to suggest plausible battery details for a product.
 *
 * - suggestBatteryDetails - A function to get battery detail suggestions.
 * - SuggestBatteryDetailsInput - The input type for the function.
 * - SuggestBatteryDetailsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBatteryDetailsInputSchema = z.object({
  productName: z.string().optional().describe('The name of the product.'),
  productCategory: z.string().optional().describe('The category of the product (e.g., Electronics, EV, Power Tool).'),
  productDescription: z.string().optional().describe('A detailed description of the product.'),
});
export type SuggestBatteryDetailsInput = z.infer<typeof SuggestBatteryDetailsInputSchema>;

const SuggestBatteryDetailsOutputSchema = z.object({
  suggestedBatteryChemistry: z.string().optional().describe("A common battery chemistry (e.g., 'Li-ion NMC', 'LFP', 'Lead-Acid')."),
  suggestedStateOfHealth: z.number().optional().describe("A typical state of health percentage (e.g., 98 for 98%)."),
  suggestedCarbonFootprintManufacturing: z.number().optional().describe("A plausible manufacturing carbon footprint in kg CO2e per kWh (e.g., 75.5)."),
  suggestedRecycledContentPercentage: z.number().optional().describe("A common recycled content percentage for batteries (e.g., 15 for 15%)."),
});
export type SuggestBatteryDetailsOutput = z.infer<typeof SuggestBatteryDetailsOutputSchema>;

export async function suggestBatteryDetails(
  input: SuggestBatteryDetailsInput
): Promise<SuggestBatteryDetailsOutput> {
  return suggestBatteryDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBatteryDetailsPrompt',
  input: {schema: SuggestBatteryDetailsInputSchema},
  output: {schema: SuggestBatteryDetailsOutputSchema},
  prompt: `You are a product data specialist focusing on battery technologies.
Based on the provided product name, category, and description, determine if this product is likely a battery or contains a significant battery.
If it is, suggest plausible values for the following battery details:
- Battery Chemistry: (e.g., "Li-ion NMC", "LFP", "Lithium Polymer", "NiMH", "Lead-Acid")
- State of Health (%): (e.g., for a new product, typically 100; for a refurbished one, maybe 90-98)
- Manufacturing Carbon Footprint (kg CO2e/kWh): (e.g., Li-ion NMC ranges 60-150 kg CO2e/kWh. Suggest a value within a reasonable range if applicable, like 75.5 or 110.2)
- Recycled Content (%): (e.g., common targets are 6-16% for cobalt, lithium, nickel. Suggest a general recycled content percentage for the battery pack if applicable, like 10 or 15)

If the product is clearly not battery-related (e.g., a t-shirt, a wooden chair), return null or omit fields for all suggestions. Focus on providing realistic and common values.

Product Name: {{{productName}}}
{{#if productCategory}}Product Category: {{{productCategory}}}{{/if}}
{{#if productDescription}}Product Description: {{{productDescription}}}{{/if}}

Return ONLY the suggested values in the output JSON object.
Example output for an "EV Battery Module":
{ "suggestedBatteryChemistry": "Li-ion NMC", "suggestedStateOfHealth": 100, "suggestedCarbonFootprintManufacturing": 85.0, "suggestedRecycledContentPercentage": 12 }
Example for "Cotton T-Shirt":
{}
`,
});

const suggestBatteryDetailsFlow = ai.defineFlow(
  {
    name: 'suggestBatteryDetailsFlow',
    inputSchema: SuggestBatteryDetailsInputSchema,
    outputSchema: SuggestBatteryDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output || {}; // Ensure an empty object if output is null/undefined
  }
);

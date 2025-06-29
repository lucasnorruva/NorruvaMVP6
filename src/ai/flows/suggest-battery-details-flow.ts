"use server";
/**
 * @fileOverview An AI agent to suggest plausible battery details for a product.
 *
 * - suggestBatteryDetails - A function to get battery detail suggestions.
 * - SuggestBatteryDetailsInput - The input type for the function.
 * - SuggestBatteryDetailsOutput - The return type for the function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const SuggestBatteryDetailsInputSchema = z.object({
  productName: z.string().optional().describe("The name of the product."),
  productCategory: z
    .string()
    .optional()
    .describe(
      "The category of the product (e.g., Electronics, EV, Power Tool).",
    ),
  productDescription: z
    .string()
    .optional()
    .describe("A detailed description of the product."),
});
export type SuggestBatteryDetailsInput = z.infer<
  typeof SuggestBatteryDetailsInputSchema
>;

const SuggestedCarbonFootprintSchema = z
  .object({
    value: z
      .number()
      .optional()
      .describe(
        "A plausible manufacturing carbon footprint value (e.g., 75.5).",
      ),
    unit: z
      .string()
      .optional()
      .describe("Unit, typically 'kg CO2e/kWh' or similar."),
    calculationMethod: z
      .string()
      .optional()
      .describe(
        "A common calculation method, e.g., 'PEFCR for Batteries v1.2' or 'ISO 14067'.",
      ),
  })
  .optional();

const SuggestedRecycledContentSchema = z
  .object({
    material: z
      .string()
      .optional()
      .describe(
        "Name of the material, e.g., 'Cobalt', 'Lithium', 'Nickel', 'Overall Battery'.",
      ),
    percentage: z
      .number()
      .optional()
      .describe(
        "A common recycled content percentage for this material (e.g., 10 for 10%).",
      ),
  })
  .optional();

const SuggestedStateOfHealthSchema = z
  .object({
    value: z
      .number()
      .optional()
      .describe(
        "A typical state of health percentage (e.g., 100 for new, 95 for refurbished).",
      ),
    unit: z.string().optional().describe("Unit, typically '%'."),
    measurementDate: z
      .string()
      .optional()
      .describe(
        "A plausible measurement date, e.g., today's date in YYYY-MM-DD format.",
      ),
  })
  .optional();

const SuggestBatteryDetailsOutputSchema = z.object({
  suggestedBatteryChemistry: z
    .string()
    .optional()
    .describe(
      "A common battery chemistry (e.g., 'Li-ion NMC', 'LFP', 'Lead-Acid').",
    ),
  suggestedBatteryPassportId: z
    .string()
    .optional()
    .describe(
      "A plausible format for a battery passport ID, e.g., BATT-ID-PRODUCTNAME-SERIAL.",
    ),
  suggestedCarbonFootprint: SuggestedCarbonFootprintSchema,
  suggestedRecycledContent: z
    .array(SuggestedRecycledContentSchema)
    .optional()
    .describe(
      "An array with 1-2 suggestions for recycled content (e.g., one for Cobalt, one for Lithium, or one for 'Overall Battery').",
    ),
  suggestedStateOfHealth: SuggestedStateOfHealthSchema,
  suggestedBatteryRegulationVcId: z
    .string()
    .optional()
    .describe(
      "A plausible format for an overall VC ID, e.g., vc:battery:example-org:PRODUCTID.",
    ),
});
export type SuggestBatteryDetailsOutput = z.infer<
  typeof SuggestBatteryDetailsOutputSchema
>;

export async function suggestBatteryDetails(
  input: SuggestBatteryDetailsInput,
): Promise<SuggestBatteryDetailsOutput> {
  return suggestBatteryDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: "suggestBatteryDetailsPrompt",
  input: { schema: SuggestBatteryDetailsInputSchema },
  output: { schema: SuggestBatteryDetailsOutputSchema },
  prompt: `You are a product data specialist focusing on battery technologies.
Based on the provided product name, category, and description, determine if this product is likely a battery or contains a significant battery.
If it is, suggest plausible values for the following battery details in the specified JSON structure:

- suggestedBatteryChemistry: (e.g., "Li-ion NMC", "LFP", "Lithium Polymer", "NiMH", "Lead-Acid")
- suggestedBatteryPassportId: (e.g., a plausible ID like "BATT-ID-EVMODULE-XYZ123")
- suggestedCarbonFootprint: An object with 'value' (e.g., Li-ion NMC ranges 60-150 kg CO2e/kWh, suggest a value like 85.0), 'unit' (e.g., "kg CO2e/kWh"), and 'calculationMethod' (e.g., "PEFCR for Batteries v1.2").
- suggestedRecycledContent: An array of 1-2 objects. Each object should have 'material' (e.g., "Cobalt", "Lithium", or "Overall Battery Pack") and 'percentage' (e.g., 12 for Cobalt, 5 for Lithium, or 10 for Overall).
- suggestedStateOfHealth: An object with 'value' (e.g., for a new product, 100; for refurbished, 95), 'unit' (typically "%"), and 'measurementDate' (e.g., current date "YYYY-MM-DD").
- suggestedBatteryRegulationVcId: (e.g., a plausible ID like "vc:battery:acme:evmodule123")

If the product is clearly not battery-related (e.g., a t-shirt, a wooden chair), return an empty JSON object or omit all suggestion fields. Focus on providing realistic and common values for battery-related products.

Product Name: {{{productName}}}
{{#if productCategory}}Product Category: {{{productCategory}}}{{/if}}
{{#if productDescription}}Product Description: {{{productDescription}}}{{/if}}

Return ONLY the suggested values in the output JSON object.
Example for an "EV Battery Module":
{ 
  "suggestedBatteryChemistry": "Li-ion NMC", 
  "suggestedBatteryPassportId": "BATT-ID-EVMODULE-XYZ789",
  "suggestedCarbonFootprint": { "value": 85.0, "unit": "kg CO2e/kWh", "calculationMethod": "PEFCR for Batteries v1.2" },
  "suggestedRecycledContent": [
    { "material": "Cobalt", "percentage": 12 },
    { "material": "Nickel", "percentage": 10 }
  ],
  "suggestedStateOfHealth": { "value": 100, "unit": "%", "measurementDate": "2024-07-30" },
  "suggestedBatteryRegulationVcId": "vc:battery:evcorp:module789"
}
Example for "Cotton T-Shirt":
{}
`,
});

const suggestBatteryDetailsFlow = ai.defineFlow(
  {
    name: "suggestBatteryDetailsFlow",
    inputSchema: SuggestBatteryDetailsInputSchema,
    outputSchema: SuggestBatteryDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || {}; // Ensure an empty object if output is null/undefined
  },
);

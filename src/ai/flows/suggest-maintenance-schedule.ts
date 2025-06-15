
'use server';
/**
 * @fileOverview An AI agent to suggest a predictive maintenance schedule for a product.
 *
 * - suggestMaintenanceSchedule - A function to get maintenance suggestions.
 * - SuggestMaintenanceInput - The input type for the function.
 * - MaintenanceSuggestion - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMaintenanceInputSchema = z.object({
  productId: z.string().describe("The ID of the product."),
  productName: z.string().optional().describe("The name of the product."),
  productCategory: z.string().describe("The category of the product (e.g., Appliances, Electronics, Apparel, Automotive Parts)."),
  usageData: z.string().describe("A description of the product's usage, age, or last service date. E.g., 'Moderate usage, approx. 2 years old. Last service: Not specified.'"),
});
export type SuggestMaintenanceInput = z.infer<typeof SuggestMaintenanceInputSchema>;

const MaintenanceSuggestionSchema = z.object({
  nextCheckupDate: z.string().describe('The suggested date or timeframe for the next checkup (e.g., "2025-01-15", "in 6 months", "after 500 hours of use").'),
  suggestedActions: z.array(z.string()).describe('A list of 2-3 specific, actionable maintenance tasks relevant to the product category.'),
  reasoning: z.string().describe('A brief rationale for the suggestions, linking them to the product type and usage context.'),
});
export type MaintenanceSuggestion = z.infer<typeof MaintenanceSuggestionSchema>;

export async function suggestMaintenanceSchedule(
  input: SuggestMaintenanceInput
): Promise<MaintenanceSuggestion> {
  return suggestMaintenanceScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMaintenanceSchedulePrompt',
  input: {schema: SuggestMaintenanceInputSchema},
  output: {schema: MaintenanceSuggestionSchema},
  prompt: `You are an AI Maintenance Expert specializing in product upkeep across various categories.
Given the product's name (if available), category, and current usage/age data, suggest a plausible next preventive maintenance checkup date and 2-3 specific, actionable maintenance tasks.
Also, provide a brief reasoning for your suggestions.

Be realistic for the product category.
- For 'Appliances' like a Refrigerator: e.g., "Clean condenser coils", "Check door seals", "Defrost freezer if not frost-free". Next checkup: "in 6 months" or "annually".
- For 'Electronics' like a Laptop: e.g., "Clean keyboard and vents", "Check battery health via software", "Update drivers and OS". Next checkup: "annually" or "if performance degrades".
- For 'Apparel' like a T-Shirt: e.g., "Inspect seams for wear", "Check for color fading if heavily used outdoors", "Consider professional cleaning for delicate items (if applicable)". Next checkup: "seasonally" or "as needed based on wear".
- For 'Automotive Parts' like an EV Battery: e.g., "Perform SoH diagnostic check", "Inspect connectors for corrosion", "Verify cooling system functionality". Next checkup: "annually" or "per manufacturer guidance (e.g., 20,000 km)".

Product ID: {{{productId}}}
{{#if productName}}Product Name: {{{productName}}}{{/if}}
Product Category: {{{productCategory}}}
Usage/Age Data: {{{usageData}}}

Return ONLY the nextCheckupDate, suggestedActions (as an array of strings), and reasoning in the specified JSON format.
The nextCheckupDate should be a specific date (YYYY-MM-DD) or a relative timeframe (e.g., "in 6 months", "annually").
Reasoning should be concise and explain why these actions and timeframe are suggested.
`,
});

const suggestMaintenanceScheduleFlow = ai.defineFlow(
  {
    name: 'suggestMaintenanceScheduleFlow',
    inputSchema: SuggestMaintenanceInputSchema,
    outputSchema: MaintenanceSuggestionSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a maintenance suggestion.");
    }
    return output;
  }
);

    
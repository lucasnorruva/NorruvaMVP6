
'use server';
/**
 * @fileOverview Generates a mock CSRD-style executive summary.
 *
 * - generateCsrdSummary - A function to generate the summary.
 * - GenerateCsrdSummaryInput - The input type for the function.
 * - GenerateCsrdSummaryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCsrdSummaryInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  reportingPeriod: z.string().describe('The reporting period, e.g., "Q2 2024", "Annual 2023".'),
  totalEmissions: z.number().describe('The total greenhouse gas emissions.'),
  emissionUnit: z.string().describe('The unit for emissions, e.g., "tCO₂e".'),
  keySustainabilityInitiatives: z.array(z.string()).describe('A list of key sustainability initiatives undertaken during the period.'),
});
export type GenerateCsrdSummaryInput = z.infer<typeof GenerateCsrdSummaryInputSchema>;

const GenerateCsrdSummaryOutputSchema = z.object({
  summaryText: z.string().describe('A brief, professionally toned, CSRD-style executive summary.'),
});
export type GenerateCsrdSummaryOutput = z.infer<typeof GenerateCsrdSummaryOutputSchema>;

export async function generateCsrdSummary(
  input: GenerateCsrdSummaryInput
): Promise<GenerateCsrdSummaryOutput> {
  return generateCsrdSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCsrdSummaryPrompt',
  input: {schema: GenerateCsrdSummaryInputSchema},
  output: {schema: GenerateCsrdSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with generating a concise, professional, CSRD-style executive summary for a company's sustainability report.

Company Name: {{{companyName}}}
Reporting Period: {{{reportingPeriod}}}
Total Emissions: {{{totalEmissions}}} {{{emissionUnit}}}
Key Sustainability Initiatives:
{{#each keySustainabilityInitiatives}}
- {{{this}}}
{{/each}}

Based on the information above, generate a brief (2-3 paragraphs) executive summary. The tone should be formal and aligned with typical Corporate Sustainability Reporting Directive (CSRD) disclosures. Highlight key achievements and commitments if discernible from the initiatives.
Focus on summarizing the provided data points clearly.

Return ONLY the summaryText.
`,
});

const generateCsrdSummaryFlow = ai.defineFlow(
  {
    name: 'generateCsrdSummaryFlow',
    inputSchema: GenerateCsrdSummaryInputSchema,
    outputSchema: GenerateCsrdSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

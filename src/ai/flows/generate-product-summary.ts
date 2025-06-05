'use server';

/**
 * @fileOverview Summarizes product data for consumers, focusing on sustainability and compliance.
 *
 * - generateProductSummary - A function that generates a product summary.
 * - GenerateProductSummaryInput - The input type for the generateProductSummary function.
 * - GenerateProductSummaryOutput - The return type for the generateProductSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductSummaryInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  sustainabilityInformation: z.string().describe('Information about the product\'s sustainability aspects.'),
  complianceInformation: z.string().describe('Information about the product\'s compliance with regulations.'),
});
export type GenerateProductSummaryInput = z.infer<typeof GenerateProductSummaryInputSchema>;

const GenerateProductSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the product, including its sustainability and compliance aspects.'),
});
export type GenerateProductSummaryOutput = z.infer<typeof GenerateProductSummaryOutputSchema>;

export async function generateProductSummary(input: GenerateProductSummaryInput): Promise<GenerateProductSummaryOutput> {
  return generateProductSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductSummaryPrompt',
  input: {schema: GenerateProductSummaryInputSchema},
  output: {schema: GenerateProductSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes product information for consumers.

  Given the following information about a product, create a concise and easy-to-understand summary that highlights its key sustainability and compliance aspects.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Sustainability Information: {{{sustainabilityInformation}}}
  Compliance Information: {{{complianceInformation}}}

  Summary:`, // Ensure the LLM returns only the summary
});

const generateProductSummaryFlow = ai.defineFlow(
  {
    name: 'generateProductSummaryFlow',
    inputSchema: GenerateProductSummaryInputSchema,
    outputSchema: GenerateProductSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

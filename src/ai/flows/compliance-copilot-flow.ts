"use server";
/**
 * @fileOverview An AI co-pilot to answer questions about EU Digital Product Passport regulations.
 *
 * - queryComplianceCopilot - A function to get answers from the AI co-pilot.
 * - ComplianceCopilotInput - The input type for the queryComplianceCopilot function.
 * - ComplianceCopilotOutput - The return type for the queryComplianceCopilot function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const ComplianceCopilotInputSchema = z.object({
  query: z.string().describe("The user_s question about EU DPP regulations."),
});
export type ComplianceCopilotInput = z.infer<
  typeof ComplianceCopilotInputSchema
>;

const ComplianceCopilotOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the user_s query."),
});
export type ComplianceCopilotOutput = z.infer<
  typeof ComplianceCopilotOutputSchema
>;

export async function queryComplianceCopilot(
  input: ComplianceCopilotInput,
): Promise<ComplianceCopilotOutput> {
  return complianceCopilotFlow(input);
}

const prompt = ai.definePrompt({
  name: "complianceCopilotPrompt",
  input: { schema: ComplianceCopilotInputSchema },
  output: { schema: ComplianceCopilotOutputSchema },
  prompt: `You are an AI Co-Pilot specializing in EU Digital Product Passport (DPP) regulations and related compliance topics (ESPR, GDPR, REACH, SCIP, Battery Regulation, CSRD, etc.).
Your role is to provide informative and helpful answers to user questions based on your general knowledge of these regulations.
Do not provide legal advice. You are an assistant to help users understand concepts and find information.
If a question is outside your scope of EU DPP regulations, politely state that.

User's question: {{{query}}}

Provide a clear and concise answer:
`,
});

const complianceCopilotFlow = ai.defineFlow(
  {
    name: "complianceCopilotFlow",
    inputSchema: ComplianceCopilotInputSchema,
    outputSchema: ComplianceCopilotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);

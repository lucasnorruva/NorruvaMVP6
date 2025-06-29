"use server";
/**
 * @fileOverview Simulates a product compliance check when a product moves to a new lifecycle stage.
 *
 * - checkProductCompliance - A function to simulate compliance re-evaluation.
 * - CheckProductComplianceInput - The input type for the checkProductCompliance function.
 * - CheckProductComplianceOutput - The return type for the checkProductCompliance function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const CheckProductComplianceInputSchema = z.object({
  productId: z.string().describe("The ID of the product being checked."),
  currentLifecycleStageName: z
    .string()
    .describe("The current lifecycle stage name of the product."),
  newLifecycleStageName: z
    .string()
    .describe("The new lifecycle stage the product is moving to."),
  productCategory: z
    .string()
    .describe("The category of the product, e.g., Electronics, Appliances."),
});
export type CheckProductComplianceInput = z.infer<
  typeof CheckProductComplianceInputSchema
>;

const CheckProductComplianceOutputSchema = z.object({
  productId: z.string(),
  newLifecycleStageName: z.string(),
  simulatedOverallStatus: z
    .string()
    .describe(
      "The plausible new overall compliance status after moving to the new stage, e.g., Compliant, Non-Compliant, Pending Review.",
    ),
  simulatedReport: z
    .string()
    .describe(
      "A short textual report of what was checked and what might have changed. E.g., 'Upon moving to Distribution, EU ESPR packaging requirements were verified as Compliant. Material declarations for REACH remain up-to-date.'",
    ),
});
export type CheckProductComplianceOutput = z.infer<
  typeof CheckProductComplianceOutputSchema
>;

export async function checkProductCompliance(
  input: CheckProductComplianceInput,
): Promise<CheckProductComplianceOutput> {
  return checkProductComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: "checkProductCompliancePrompt",
  input: { schema: CheckProductComplianceInputSchema },
  output: { schema: CheckProductComplianceOutputSchema },
  prompt: `You are an AI assistant simulating a product compliance re-assessment due to a lifecycle stage change.

Product ID: {{{productId}}}
Product Category: {{{productCategory}}}
Current Lifecycle Stage: {{{currentLifecycleStageName}}}
New Lifecycle Stage: {{{newLifecycleStageName}}}

Based on the product moving from the current to the new lifecycle stage, determine a plausible NEW overall compliance status for this product category (e.g., Compliant, Non-Compliant, Pending Review, Partially Compliant).
Also, provide a brief, plausible textual report summarizing what specific regulatory aspects might have been checked and how their status might have changed due to this new lifecycle stage.
Be creative but relevant to common product regulations (e.g., ESPR, RoHS, REACH, WEEE, Battery Regulation, SCIP, CE Marking).
The report should clearly state what happened because of the move to '{{{newLifecycleStageName}}}'.

Example simulatedReport for 'Distribution' stage for an 'Electronics' product: "Upon moving to Distribution, packaging compliance for EU ESPR was verified as Compliant. Material declarations for REACH remain up-to-date. CE marking conformity confirmed for market placement."
Example simulatedReport for 'Manufacturing' stage of a 'Battery' product: "During Manufacturing, initial battery performance tests for EU Battery Regulation are now Pending Data Submission. RoHS compliance for components confirmed. SCIP database notification for hazardous substances prepared."
Example simulatedReport for 'End-of-Life' stage for an 'Appliances' product: "At End-of-Life, WEEE directive compliance confirmed for proper disposal instructions. Recyclability information verified."

Return ONLY the productId, newLifecycleStageName, simulatedOverallStatus, and simulatedReport fields in the specified JSON format.
`,
});

const checkProductComplianceFlow = ai.defineFlow(
  {
    name: "checkProductComplianceFlow",
    inputSchema: CheckProductComplianceInputSchema,
    outputSchema: CheckProductComplianceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // Ensure the output contains all required fields, even if the LLM omits some.
    // The schema definition in the prompt should guide the LLM, but this is a fallback.
    return {
      productId: input.productId,
      newLifecycleStageName: input.newLifecycleStageName,
      simulatedOverallStatus:
        output?.simulatedOverallStatus || "Pending Review",
      simulatedReport:
        output?.simulatedReport ||
        "Compliance re-check simulation complete. Detailed changes would be listed here.",
    };
  },
);

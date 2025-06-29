"use server";
/**
 * @fileOverview Simulates syncing product data with the EPREL database.
 *
 * - syncEprelData - A function to simulate EPREL sync.
 * - SyncEprelInput - The input type for the function.
 * - SyncEprelOutput - The return type for the function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const SyncEprelInputSchema = z.object({
  productId: z.string().describe("The ID of the product being synced."),
  productName: z.string().describe("The name of the product."),
  modelNumber: z.string().describe("The model number of the product."),
});
export type SyncEprelInput = z.infer<typeof SyncEprelInputSchema>;

const SyncEprelOutputSchema = z.object({
  syncStatus: z
    .string()
    .describe(
      "The outcome of the sync attempt, e.g., 'Synced Successfully', 'Data Mismatch', 'Product Not Found in EPREL', 'Error During Sync'",
    ),
  eprelId: z
    .string()
    .optional()
    .describe("The EPREL registration ID, if successfully synced/found."),
  message: z.string().describe("A descriptive message about the sync attempt."),
  lastChecked: z
    .string()
    .describe("ISO string timestamp of this sync attempt."),
});
export type SyncEprelOutput = z.infer<typeof SyncEprelOutputSchema>;

export async function syncEprelData(
  input: SyncEprelInput,
): Promise<SyncEprelOutput> {
  return syncEprelDataFlow(input);
}

const syncEprelDataFlow = ai.defineFlow(
  {
    name: "syncEprelDataFlow",
    inputSchema: SyncEprelInputSchema,
    outputSchema: SyncEprelOutputSchema,
  },
  async (input) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lastChecked = new Date().toISOString();

    if (input.productId === "PROD001") {
      return {
        syncStatus: "Synced Successfully",
        eprelId: `EPREL_SYNCED_${input.modelNumber}_${Date.now().toString().slice(-4)}`,
        message: `Product '${input.productName}' data successfully synced/verified with EPREL.`,
        lastChecked,
      };
    } else if (input.productId === "PROD002") {
      return {
        syncStatus: "Data Mismatch",
        eprelId: input.modelNumber
          ? `EPREL_EXISTING_${input.modelNumber}`
          : undefined,
        message: `Data for product '${input.productName}' mismatches EPREL record. Manual review required.`,
        lastChecked,
      };
    } else if (input.productId.startsWith("USER_PROD")) {
      return {
        syncStatus: "Product Not Found in EPREL",
        message: `User-added product '${input.productName}' not found in EPREL. Consider registering.`,
        lastChecked,
      };
    }

    // Default for other mock products or unexpected cases
    const randomOutcome = Math.random();
    if (randomOutcome < 0.6) {
      return {
        syncStatus: "Product Not Found in EPREL",
        message: `Product '${input.productName}' (Model: ${input.modelNumber}) could not be found in the EPREL database.`,
        lastChecked,
      };
    } else if (randomOutcome < 0.9) {
      return {
        syncStatus: "Error During Sync",
        message: `A simulated error occurred while trying to sync '${input.productName}' with EPREL. Please try again.`,
        lastChecked,
      };
    } else {
      return {
        syncStatus: "Synced Successfully",
        eprelId: `EPREL_SYNCED_${input.modelNumber}_${Date.now().toString().slice(-4)}`,
        message: `Product '${input.productName}' data successfully synced/verified with EPREL.`,
        lastChecked,
      };
    }
  },
);

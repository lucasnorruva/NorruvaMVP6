"use server";
/**
 * @fileOverview Generates a product image using AI.
 *
 * - generateProductImage - A function that generates a product image.
 * - GenerateProductImageInput - The input type for the generateProductImage function.
 * - GenerateProductImageOutput - The return type for the generateProductImage function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateProductImageInputSchema = z.object({
  productName: z.string().describe("The name of the product."),
  productCategory: z
    .string()
    .optional()
    .describe("The category of the product (e.g., Electronics, Apparel)."),
  imageHint: z
    .string()
    .optional()
    .describe(
      'Optional keywords to guide image style, e.g., "minimalist, studio shot", "on a wooden table".',
    ),
});
export type GenerateProductImageInput = z.infer<
  typeof GenerateProductImageInputSchema
>;

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI (e.g., 'data:image/png;base64,...').",
    ),
});
export type GenerateProductImageOutput = z.infer<
  typeof GenerateProductImageOutputSchema
>;

export async function generateProductImage(
  input: GenerateProductImageInput,
): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}

const generateProductImageFlow = ai.defineFlow(
  {
    name: "generateProductImageFlow",
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    const promptParts = [
      `Generate a professional, clear product photograph suitable for e-commerce. The product is a '${input.productName}'.`,
    ];
    if (input.productCategory) {
      promptParts.push(`Category: '${input.productCategory}'.`);
    }
    if (input.imageHint) {
      promptParts.push(
        `Visual style or key elements to include based on this hint: '${input.imageHint}'.`,
      );
    }
    promptParts.push(
      `Focus on a clean, professional product shot on a simple background. Avoid text, logos, or human elements unless part of the product itself.`,
    );

    const generationPrompt = promptParts.join(" ");

    const { media } = await ai.generate({
      model: "googleai/gemini-2.0-flash-exp",
      prompt: generationPrompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"], // Must provide both
      },
    });

    if (!media || !media.url) {
      throw new Error("Image generation failed or returned no media URL.");
    }

    return { imageUrl: media.url };
  },
);

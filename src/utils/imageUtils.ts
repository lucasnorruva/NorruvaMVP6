
// --- File: src/utils/imageUtils.ts ---
// Description: Utility functions related to image handling and generation.
"use client";

interface ProductImageHintInfo {
  productName?: string | null;
  category?: string | null;
  imageHint?: string | null;
}

/**
 * Generates a concise AI hint for image search based on product information.
 * Prioritizes imageHint, then productName, then category.
 * Returns a maximum of two keywords.
 * @param product - Object containing productName, category, and imageHint.
 * @returns A string to be used as data-ai-hint for images.
 */
export function getAiHintForImage(product: ProductImageHintInfo): string {
  if (product.imageHint && product.imageHint.trim()) {
    return product.imageHint.trim().split(" ").slice(0, 2).join(" ");
  }
  if (product.productName && product.productName.trim()) {
    const nameWords = product.productName.trim().toLowerCase().split(" ");
    if (nameWords.length === 1) return nameWords[0];
    return nameWords.slice(0, 2).join(" ");
  }
  if (product.category && product.category.trim()) {
    return product.category.trim().toLowerCase().split(" ")[0];
  }
  return "product photo"; // Default fallback
}


// --- File: src/utils/imageUtils.ts ---
// Description: Utility functions related to image handling and generation.


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
    // Return only the first two words of the user-provided hint
    return product.imageHint.trim().split(/\s+/).slice(0, 2).join(" ");
  }
  if (product.productName && product.productName.trim()) {
    const nameWords = product.productName.trim().toLowerCase().split(/\s+/);
    if (nameWords.length === 1) return nameWords[0];
    // Try to pick relevant words if category is also present
    if (product.category && product.category.trim()) {
        const catWords = product.category.trim().toLowerCase().split(/\s+/);
        if (catWords.length > 0 && nameWords.some(nw => catWords.includes(nw))) {
            // If product name contains category, just use product name (first two words)
             return nameWords.slice(0, 2).join(" ");
        }
        // Otherwise, combine one word from name and one from category if possible
        const firstWordName = nameWords[0];
        const firstWordCat = catWords[0];
        if (firstWordName !== firstWordCat) { // Avoid "phone phone"
            return `${firstWordName} ${firstWordCat}`;
        }
        return firstWordName; // Fallback if they are the same
    }
    return nameWords.slice(0, 2).join(" ");
  }
  if (product.category && product.category.trim()) {
    return product.category.trim().toLowerCase().split(/\s+/)[0];
  }
  return "product photo"; // Default fallback
}


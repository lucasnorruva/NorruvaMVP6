
// --- File: src/app/api/v1/dpp/batch-update/route.ts ---
// Description: Conceptual API endpoint to simulate batch updates of DPPs.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport } from '@/types/dpp';

interface BatchUpdateItem {
  id: string;
  metadata?: Partial<DigitalProductPassport['metadata']>;
  compliance?: Partial<DigitalProductPassport['compliance']>;
  productDetails?: Partial<DigitalProductPassport['productDetails']>;
  // Add other top-level updatable fields as needed
}

interface BatchUpdateRequestBody {
  updates: BatchUpdateItem[];
}

interface BatchUpdateResultItem {
  id: string;
  status: 'success' | 'failed';
  error?: string;
}

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: BatchUpdateRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  if (!requestBody.updates || !Array.isArray(requestBody.updates) || requestBody.updates.length === 0) {
    return NextResponse.json({ error: { code: 400, message: "Field 'updates' must be a non-empty array." } }, { status: 400 });
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + requestBody.updates.length * 50)); // Longer delay for more items

  const results: BatchUpdateResultItem[] = [];
  let successfullyUpdated = 0;
  let failedUpdates = 0;

  for (const updateItem of requestBody.updates) {
    if (!updateItem.id) {
      results.push({ id: "UNKNOWN_ID", status: "failed", error: "Missing 'id' in update item." });
      failedUpdates++;
      continue;
    }

    const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === updateItem.id);
    if (productIndex === -1) {
      results.push({ id: updateItem.id, status: "failed", error: `Product with ID ${updateItem.id} not found.` });
      failedUpdates++;
      continue;
    }

    try {
      const existingProduct = MOCK_DPPS[productIndex];
      const updatedProduct: DigitalProductPassport = {
        ...existingProduct,
        ...(updateItem.productDetails && { productDetails: { ...existingProduct.productDetails, ...updateItem.productDetails } }),
        ...(updateItem.compliance && { compliance: { ...existingProduct.compliance, ...updateItem.compliance } }),
        metadata: {
          ...existingProduct.metadata,
          ...(updateItem.metadata || {}),
          last_updated: new Date().toISOString(),
        },
        // Add other top-level field updates here if supported by BatchUpdateItem
      };
      MOCK_DPPS[productIndex] = updatedProduct;
      results.push({ id: updateItem.id, status: "success" });
      successfullyUpdated++;
    } catch (e) {
      results.push({ id: updateItem.id, status: "failed", error: "Error during update process." });
      failedUpdates++;
    }
  }

  return NextResponse.json({
    message: "Batch update processed.",
    results,
    summary: {
      totalProcessed: requestBody.updates.length,
      successfullyUpdated,
      failedUpdates,
    }
  });
}

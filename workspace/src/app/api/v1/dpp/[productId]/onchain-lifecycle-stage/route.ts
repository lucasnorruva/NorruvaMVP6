
// --- File: src/app/api/v1/dpp/[productId]/onchain-lifecycle-stage/route.ts ---
// Description: API endpoint to conceptually update a DPP's on-chain lifecycle stage.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, LifecycleEvent } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface UpdateOnChainLifecycleStageRequestBody {
  lifecycleStage: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  let requestBody: UpdateOnChainLifecycleStageRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { lifecycleStage: newLifecycleStage } = requestBody;

  if (!newLifecycleStage || typeof newLifecycleStage !== 'string' || newLifecycleStage.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'lifecycleStage' is required and must be a non-empty string." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const product = MOCK_DPPS[productIndex];
  const now = new Date().toISOString();
  const mockTxHash = `0xlifecycle_update_${Date.now().toString(16).slice(-8)}`;
  const previousStage = product.metadata.onChainLifecycleStage || "Unknown";

  // Update the conceptual on-chain lifecycle stage
  if (!product.metadata) { // Ensure metadata object exists
    product.metadata = { status: 'draft', last_updated: now };
  }
  product.metadata.onChainLifecycleStage = newLifecycleStage;
  product.metadata.last_updated = now;

  // Add a lifecycle event for this conceptual on-chain update
  const lifecycleEvent: LifecycleEvent = {
    id: `evt_onchain_lc_${Date.now().toString(36).slice(-6)}`,
    type: "OnChainLifecycleStageUpdate",
    timestamp: now,
    responsibleParty: "System/Admin Action (Blockchain Mgmt)",
    data: {
      previousStage: previousStage,
      newStage: newLifecycleStage,
      reason: "Admin action via Blockchain Management page.",
      mockTransactionHash: mockTxHash,
    },
    transactionHash: mockTxHash, 
  };

  if (!product.lifecycleEvents) {
    product.lifecycleEvents = [];
  }
  product.lifecycleEvents.push(lifecycleEvent);

  MOCK_DPPS[productIndex] = product;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `Conceptual on-chain lifecycle stage for product ${productId} updated to '${newLifecycleStage}'. Mock Tx: ${mockTxHash}`,
    updatedProduct: product,
  }, { status: 200 });
}

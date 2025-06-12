
// --- File: src/app/api/v1/dpp/[productId]/onchain-status/route.ts ---
// Description: API endpoint to conceptually update a DPP's on-chain status.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, LifecycleEvent } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface UpdateOnChainStatusRequestBody {
  status: 'active' | 'recalled' | 'flagged_for_review' | 'archived' | string; // Allow string for flexibility
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  let requestBody: UpdateOnChainStatusRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { status: newOnChainStatus } = requestBody;

  if (!newOnChainStatus || typeof newOnChainStatus !== 'string' || newOnChainStatus.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'status' is required and must be a non-empty string." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const product = MOCK_DPPS[productIndex];
  const now = new Date().toISOString();
  const mockTxHash = `0xmock_onchain_status_update_${Date.now().toString(16).slice(-8)}`;

  // Update the conceptual on-chain status
  product.metadata.onChainStatus = newOnChainStatus;
  product.metadata.last_updated = now;

  // Add a lifecycle event for this conceptual on-chain update
  const lifecycleEvent: LifecycleEvent = {
    id: `evt_onchain_${Date.now().toString(36).slice(-6)}`,
    type: "OnChainStatusUpdate",
    timestamp: now,
    responsibleParty: "System/Admin Action (Blockchain Mgmt)",
    data: {
      previousStatus: product.metadata.onChainStatus || "Unknown", // Or however you track previous
      newStatus: newOnChainStatus,
      reason: "Admin action via Blockchain Management page.",
      mockTransactionHash: mockTxHash,
    },
    transactionHash: mockTxHash, // Store mock tx hash here too
  };

  if (!product.lifecycleEvents) {
    product.lifecycleEvents = [];
  }
  product.lifecycleEvents.push(lifecycleEvent);

  MOCK_DPPS[productIndex] = product;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `Conceptual on-chain status for product ${productId} updated to '${newOnChainStatus}'. Mock Tx: ${mockTxHash}`,
    updatedProduct: product,
  }, { status: 200 });
}


// --- File: src/app/api/v1/dpp/[productId]/onchain-status/route.ts ---
// Description: Mock API endpoint to simulate updating a DPP's on-chain status.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface UpdateOnChainStatusRequestBody {
  status: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: UpdateOnChainStatusRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { status } = requestBody;

  if (!status || typeof status !== 'string' || status.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'status' is required." } }, { status: 400 });
  }
  // Optionally add validation for allowed status values
  const allowedStatuses = ["active", "recalled", "flagged_for_review", "archived"];
  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: { code: 400, message: `Invalid 'status' value. Must be one of: ${allowedStatuses.join(', ')}.` } }, { status: 400 });
  }


  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const existingProduct = MOCK_DPPS[productIndex];
  const now = new Date().toISOString();
  const mockTxHash = `0xmock_status_tx_${Date.now().toString(36).slice(-6)}`;

  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    metadata: {
      ...existingProduct.metadata,
      onChainStatus: status,
      last_updated: now,
    },
    lifecycleEvents: [ // Add a lifecycle event for this change
        ...(existingProduct.lifecycleEvents || []),
        { 
            id: `status_evt_${Date.now().toString(36).slice(-5)}`, 
            type: "OnChainStatusUpdate", 
            timestamp: now, 
            data: { previousStatus: existingProduct.metadata.onChainStatus, newStatus: status, mockTxHash: mockTxHash },
            responsibleParty: "System/Blockchain"
        }
    ]
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `Conceptual on-chain status for product ${productId} updated to '${status}'. Mock Tx: ${mockTxHash}`,
    updatedProduct: updatedProduct,
  }, { status: 200 });
}



// --- File: src/app/api/v1/dpp/[productId]/onchain-lifecycle-stage/route.ts ---
// Description: Mock API endpoint to simulate updating a DPP's on-chain lifecycle stage.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface UpdateOnChainLifecycleStageRequestBody {
  lifecycleStage: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: UpdateOnChainLifecycleStageRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { lifecycleStage } = requestBody;

  if (!lifecycleStage || typeof lifecycleStage !== 'string' || lifecycleStage.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'lifecycleStage' is required." } }, { status: 400 });
  }
  // Optionally add validation for allowed lifecycle stages
  const allowedStages = ["Design", "Manufacturing", "QualityAssurance", "Distribution", "InUse", "Maintenance", "EndOfLife"];
  if (!allowedStages.includes(lifecycleStage)) {
    return NextResponse.json({ error: { code: 400, message: `Invalid 'lifecycleStage' value. Must be one of: ${allowedStages.join(', ')}.` } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const existingProduct = MOCK_DPPS[productIndex];
  const now = new Date().toISOString();
  const mockTxHash = `0xlifecycle_update_tx_${Date.now().toString(36).slice(-6)}`;

  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    metadata: {
      ...existingProduct.metadata,
      onChainLifecycleStage: lifecycleStage,
      last_updated: now,
    },
    lifecycleEvents: [ // Add a lifecycle event for this change
        ...(existingProduct.lifecycleEvents || []),
        { 
            id: `lc_stage_evt_${Date.now().toString(36).slice(-5)}`, 
            type: "OnChainLifecycleUpdate", 
            timestamp: now, 
            data: { previousStage: existingProduct.metadata.onChainLifecycleStage, newStage: lifecycleStage, mockTxHash: mockTxHash },
            responsibleParty: "System/Blockchain"
        }
    ]
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `Conceptual on-chain lifecycle stage for product ${productId} updated to '${lifecycleStage}'. Mock Tx: ${mockTxHash}`,
    updatedProduct: updatedProduct,
  }, { status: 200 });
}


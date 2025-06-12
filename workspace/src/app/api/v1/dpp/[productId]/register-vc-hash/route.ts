
// --- File: src/app/api/v1/dpp/[productId]/register-vc-hash/route.ts ---
// Description: API endpoint to conceptually register a VC hash for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, LifecycleEvent } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface RegisterVcHashRequestBody {
  vcId: string;
  vcHash: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  let requestBody: RegisterVcHashRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { vcId, vcHash } = requestBody;

  if (!vcId || typeof vcId !== 'string' || vcId.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'vcId' is required and must be a non-empty string." } }, { status: 400 });
  }
  if (!vcHash || typeof vcHash !== 'string' || vcHash.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'vcHash' is required and must be a non-empty string." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const product = MOCK_DPPS[productIndex];
  const now = new Date().toISOString();
  const mockTransactionHashForEvent = `0xvc_hash_reg_tx_${Date.now().toString(16).slice(-8)}`;

  const vcHashRegisteredEvent: LifecycleEvent = {
    id: `evt_vc_hash_${Date.now().toString(36).slice(-6)}`,
    type: "VCHashRegistered",
    timestamp: now,
    responsibleParty: "System/Admin Action (Blockchain Mgmt)",
    data: {
      vcId: vcId,
      vcHash: vcHash,
      registrationMethod: "On-chain (Conceptual)",
      mockTransactionHash: mockTransactionHashForEvent,
    },
    transactionHash: mockTransactionHashForEvent,
  };

  if (!product.lifecycleEvents) {
    product.lifecycleEvents = [];
  }
  product.lifecycleEvents.push(vcHashRegisteredEvent);
  
  if (!product.metadata) { 
    product.metadata = { status: 'draft', last_updated: now };
  }
  product.metadata.last_updated = now;

  MOCK_DPPS[productIndex] = product;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `VC Hash for ID '${vcId}' conceptually registered on-chain for product ${productId}. Hash: ${vcHash.substring(0,10)}... Mock Tx: ${mockTransactionHashForEvent}`,
    updatedProduct: product,
  }, { status: 200 });
}


// --- File: src/app/api/v1/dpp/[productId]/register-vc-hash/route.ts ---
// Description: Mock API endpoint to simulate registering a Verifiable Credential's hash on-chain for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, VerifiableCredentialReference } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface RegisterVcHashRequestBody {
  vcId: string;
  vcHash: string; // Cryptographic hash, e.g., SHA-256
  vcType?: string; // Optional: type of VC for context
  issuerDid?: string; // Optional: DID of the VC issuer
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: RegisterVcHashRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { vcId, vcHash, vcType, issuerDid } = requestBody;

  if (!vcId || typeof vcId !== 'string' || vcId.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'vcId' is required." } }, { status: 400 });
  }
  if (!vcHash || typeof vcHash !== 'string' || vcHash.trim() === '' || vcHash.length < 32) { // Basic hash length check
    return NextResponse.json({ error: { code: 400, message: "Field 'vcHash' is required and should be a valid hash." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const existingProduct = MOCK_DPPS[productIndex];
  const now = new Date().toISOString();
  const mockTxHash = `0xvc_hash_tx_${Date.now().toString(36).slice(-6)}`;

  // Add to a conceptual list of on-chain registered VC hashes (this field doesn't exist on DigitalProductPassport yet,
  // but we can add it conceptually or just log it for the mock)
  // For now, we'll just log it and add a generic lifecycle event.
  console.log(`[On-Chain Mock] Registered VC Hash for DPP ${productId}: VC ID=${vcId}, Hash=${vcHash}, Mock Tx=${mockTxHash}`);

  const newEvent = {
    id: `vc_reg_evt_${Date.now().toString(36).slice(-5)}`,
    type: "VC Hash Registered",
    timestamp: now,
    data: { vcId, vcHash, vcType, issuerDid, mockTxHash },
    responsibleParty: "System/Blockchain"
  };

  const updatedLifecycleEvents = [...(existingProduct.lifecycleEvents || []), newEvent];


  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    lifecycleEvents: updatedLifecycleEvents,
    // Potentially add a new field like 'onChainVcRegistry' if needed
    metadata: {
      ...existingProduct.metadata,
      last_updated: now,
    },
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `VC Hash for ID '${vcId}' conceptually registered on-chain for product ${productId}. Mock Tx: ${mockTxHash}`,
    updatedProduct: updatedProduct,
  }, { status: 200 });
}


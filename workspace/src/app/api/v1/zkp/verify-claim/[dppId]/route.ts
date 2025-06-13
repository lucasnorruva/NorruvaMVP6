
// --- File: src/app/api/v1/zkp/verify-claim/[dppId]/route.ts ---
// Description: Mock API endpoint to simulate verifying a ZKP claim for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data'; // To check if DPP ID exists
import { validateApiKey } from '@/middleware/apiKeyAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: { dppId: string } }
) {
  const { dppId } = params;
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const claimType = searchParams.get('claimType');

  if (!claimType || typeof claimType !== 'string' || claimType.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Query parameter 'claimType' is required." } }, { status: 400 });
  }

  const productExists = MOCK_DPPS.some(dpp => dpp.id === dppId);
  if (!productExists) {
    return NextResponse.json({ error: { code: 404, message: `DPP with ID ${dppId} not found.` } }, { status: 404 });
  }

  // Simulate API delay & ZKP verification
  await new Promise(resolve => setTimeout(resolve, 200));

  const now = new Date().toISOString();
  const isMockVerified = Math.random() > 0.3; // ~70% chance of being verified for mock
  const mockProofId = isMockVerified ? `zkp_proof_mock_${Date.now().toString(36).slice(-8)}` : null;

  const responsePayload = {
    dppId: dppId,
    claimType: claimType,
    isVerified: isMockVerified,
    proofId: mockProofId,
    verifiedAt: isMockVerified ? now : null,
    message: isMockVerified
      ? `Mock ZKP for claim '${claimType}' on DPP '${dppId}' is considered valid.`
      : `Mock ZKP for claim '${claimType}' on DPP '${dppId}' could not be verified or was found invalid.`,
  };

  // In a real system, this would involve looking up the submitted proofId (if provided or linked)
  // and running a ZKP verification algorithm.
  // For this mock, we simply return a random-ish result.

  return NextResponse.json(responsePayload, { status: 200 });
}


// src/app/api/v1/token/metadata/[tokenId]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface UpdateTokenMetadataRequestBody {
  metadataUri: string;
  contractAddress?: string; // Optional, if different from a default
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { tokenId } = params;
  let body: UpdateTokenMetadataRequestBody;

  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload" } }, { status: 400 });
  }

  const { metadataUri, contractAddress } = body;

  if (!metadataUri) {
    return NextResponse.json({ error: { code: 400, message: "Missing required field: metadataUri" } }, { status: 400 });
  }

  // Simulate update
  await new Promise(resolve => setTimeout(resolve, 250));
  const mockTransactionHash = `0xmeta_update_tx_mock_${Date.now().toString(16)}`;

  return NextResponse.json({
    tokenId: tokenId,
    contractAddress: contractAddress || "DEFAULT_DPP_TOKEN_CONTRACT", // Use a default if not provided
    transactionHash: mockTransactionHash,
    message: `Mock metadata for token ${tokenId} updated to ${metadataUri}.`,
  }, { status: 200 });
}

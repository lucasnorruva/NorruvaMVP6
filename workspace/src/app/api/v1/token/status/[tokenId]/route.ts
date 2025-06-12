
// src/app/api/v1/token/status/[tokenId]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS } from '@/data'; // To find associated product for metadataUri

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { tokenId } = params;

  // Simulate fetching status
  await new Promise(resolve => setTimeout(resolve, 200));

  // For mock purposes, let's find if this token ID exists in our MOCK_DPPS
  const productWithToken = MOCK_DPPS.find(dpp => dpp.blockchainIdentifiers?.tokenId === tokenId);

  if (!productWithToken) {
    return NextResponse.json({ error: { code: 404, message: `Token with ID ${tokenId} not found or not associated with a DPP.` } }, { status: 404 });
  }

  const statuses = ["minted", "transferred", "active", "locked"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return NextResponse.json({
    tokenId: tokenId,
    contractAddress: productWithToken.blockchainIdentifiers?.contractAddress || "DEFAULT_DPP_TOKEN_CONTRACT",
    ownerAddress: `0xmock_owner_${tokenId.slice(-4)}...${tokenId.slice(0,2)}`, // Conceptual owner
    mintedAt: productWithToken.metadata.created_at || new Date(Date.now() - Math.random() * 1000000000).toISOString(), // Use product creation if available
    metadataUri: `ipfs://dpp_metadata_for_${productWithToken.id}`, // Use the product's ID for a conceptual metadata URI
    lastTransactionHash: `0xlast_tx_mock_${Date.now().toString(16).slice(0, 10)}`,
    status: randomStatus,
  }, { status: 200 });
}

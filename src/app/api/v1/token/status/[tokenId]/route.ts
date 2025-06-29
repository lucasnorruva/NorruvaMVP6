// src/app/api/v1/token/status/[tokenId]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateApiKey } from "@/middleware/apiKeyAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } },
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { tokenId } = params;

  // Simulate fetching status
  await new Promise((resolve) => setTimeout(resolve, 200));

  // For mock purposes, let's assume any numeric token ID exists
  if (isNaN(parseInt(tokenId))) {
    return NextResponse.json(
      { error: { code: 404, message: `Token with ID ${tokenId} not found.` } },
      { status: 404 },
    );
  }

  const statuses = ["minted", "transferred", "burned", "active", "locked"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return NextResponse.json(
    {
      tokenId: tokenId,
      contractAddress: "DEFAULT_DPP_TOKEN_CONTRACT", // Example contract address
      ownerAddress: `0xmock_owner_${tokenId.slice(-4)}...${tokenId.slice(0, 2)}`,
      mintedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(), // Random date in past
      metadataUri: `ipfs://mock_metadata_for_token_${tokenId}`,
      lastTransactionHash: `0xlast_tx_mock_${Date.now().toString(16).slice(0, 10)}`,
      status: randomStatus,
    },
    { status: 200 },
  );
}

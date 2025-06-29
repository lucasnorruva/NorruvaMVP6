// src/app/api/v1/token/status/[tokenId]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateApiKey } from "@/middleware/apiKeyAuth";
import { MOCK_DPPS } from "@/data"; // To find associated product for metadataUri

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } },
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { tokenId } = params;

  // Simulate fetching status
  await new Promise((resolve) => setTimeout(resolve, 200));

  const productWithToken = MOCK_DPPS.find(
    (dpp) => dpp.blockchainIdentifiers?.tokenId === tokenId,
  );

  const statuses = ["minted", "transferred", "active", "locked"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  if (productWithToken) {
    return NextResponse.json(
      {
        tokenId: tokenId,
        contractAddress:
          productWithToken.blockchainIdentifiers?.contractAddress ||
          "DEFAULT_DPP_TOKEN_CONTRACT",
        ownerAddress: `0xmock_owner_${tokenId.slice(-4)}...${tokenId.slice(0, 2)}`, // Conceptual owner
        mintedAt:
          productWithToken.metadata.created_at ||
          productWithToken.metadata.last_updated ||
          new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        metadataUri: `ipfs://dpp_metadata_for_${productWithToken.id}`, // Use product ID for a relevant mock URI
        lastTransactionHash: `0xlast_tx_mock_${Date.now().toString(16).slice(0, 10)}`,
        status: randomStatus,
        message: `Status for token associated with product ${productWithToken.productName}.`,
      },
      { status: 200 },
    );
  } else {
    // If token not found in any DPP, return a generic mock as before, or indicate it's unlinked
    if (isNaN(parseInt(tokenId))) {
      // Original check for non-numeric token IDs
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Token with ID ${tokenId} not found or invalid format.`,
          },
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        tokenId: tokenId,
        contractAddress: "DEFAULT_DPP_TOKEN_CONTRACT",
        ownerAddress: `0xmock_owner_unlinked_${tokenId.slice(-4)}`,
        mintedAt: new Date(
          Date.now() - Math.random() * 1000000000,
        ).toISOString(),
        metadataUri: `ipfs://mock_metadata_for_unlinked_token_${tokenId}`,
        lastTransactionHash: `0xlast_tx_mock_unlinked_${Date.now().toString(16).slice(0, 10)}`,
        status: randomStatus,
        message: `Status for token ID ${tokenId} (not linked to a known DPP in mock data).`,
      },
      { status: 200 },
    );
  }
}

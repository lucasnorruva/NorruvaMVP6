// src/app/api/v1/token/mint/[productId]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import { validateApiKey } from "@/middleware/apiKeyAuth";

interface MintTokenRequestBody {
  contractAddress: string;
  recipientAddress: string;
  metadataUri?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { productId } = params;
  let body: MintTokenRequestBody;

  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json(
      { error: { code: 400, message: "Invalid JSON payload" } },
      { status: 400 },
    );
  }

  const { contractAddress, recipientAddress, metadataUri } = body;

  if (!contractAddress || !recipientAddress) {
    return NextResponse.json(
      {
        error: {
          code: 400,
          message: "Missing required fields: contractAddress, recipientAddress",
        },
      },
      { status: 400 },
    );
  }

  const product = MOCK_DPPS.find((dpp) => dpp.id === productId);
  if (!product) {
    return NextResponse.json(
      {
        error: {
          code: 404,
          message: `Product with ID ${productId} not found.`,
        },
      },
      { status: 404 },
    );
  }

  // Simulate minting
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockTokenId = Math.floor(Math.random() * 100000).toString();
  const mockTransactionHash = `0xmint_tx_mock_${Date.now().toString(16)}`;

  return NextResponse.json(
    {
      tokenId: mockTokenId,
      contractAddress: contractAddress,
      transactionHash: mockTransactionHash,
      message: `Mock token ${mockTokenId} minted for product ${productId} to ${recipientAddress}. Metadata: ${metadataUri || "N/A"}`,
    },
    { status: 201 },
  );
}

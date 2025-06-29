import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import type { DigitalProductPassport } from "@/types/dpp";
import { validateApiKey } from "@/middleware/apiKeyAuth";

interface AnchorDppRequestBody {
  platform: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: AnchorDppRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: { code: 400, message: "Invalid JSON payload." } },
      { status: 400 },
    );
  }

  if (
    !requestBody.platform ||
    typeof requestBody.platform !== "string" ||
    requestBody.platform.trim() === ""
  ) {
    return NextResponse.json(
      {
        error: {
          code: 400,
          message:
            "Field 'platform' is required and must be a non-empty string.",
        },
      },
      { status: 400 },
    );
  }

  const index = MOCK_DPPS.findIndex((dpp) => dpp.id === productId);

  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 100 + 100),
  );

  if (index === -1) {
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

  const anchorHash = `0xmockAnchor${Date.now().toString(16)}`;
  const mockContractAddress = `0xMOCK_CONTRACT_FOR_${productId}`;
  const mockTokenId = `MOCK_TID_${productId}_${Date.now().toString(36).slice(-4).toUpperCase()}`;

  const updatedProduct: DigitalProductPassport = {
    ...MOCK_DPPS[index],
    blockchainIdentifiers: {
      ...(MOCK_DPPS[index].blockchainIdentifiers || {}),
      platform: requestBody.platform,
      anchorTransactionHash: anchorHash,
      contractAddress: mockContractAddress,
      tokenId: mockTokenId,
    },
    metadata: {
      ...MOCK_DPPS[index].metadata,
      last_updated: new Date().toISOString(),
    },
  };

  MOCK_DPPS[index] = updatedProduct;

  return NextResponse.json(updatedProduct);
}

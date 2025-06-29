// --- File: src/app/api/v1/dpp/transfer-ownership/[productId]/route.ts ---
// Description: Conceptual API endpoint to transfer ownership of a DPP.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import type { DigitalProductPassport } from "@/types/dpp";
import { validateApiKey } from "@/middleware/apiKeyAuth"; // Import API key validation

interface TransferOwnershipRequestBody {
  newOwner?: {
    name?: string;
    did?: string;
  };
  transferTimestamp?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const productId = params.productId;
  const authError = validateApiKey(request); // Add API key validation
  if (authError) return authError;

  let requestBody: TransferOwnershipRequestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: { code: 400, message: "Invalid JSON payload." } },
      { status: 400 },
    );
  }

  const { newOwner, transferTimestamp } = requestBody;

  if (!newOwner?.name || !transferTimestamp) {
    return NextResponse.json(
      {
        error: {
          code: 400,
          message:
            "Fields 'newOwner.name' and 'transferTimestamp' are required.",
        },
      },
      { status: 400 },
    );
  }

  const productIndex = MOCK_DPPS.findIndex((dpp) => dpp.id === productId);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (productIndex === -1) {
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

  const product: DigitalProductPassport = { ...MOCK_DPPS[productIndex] };

  product.manufacturer = {
    ...(product.manufacturer || {}),
    name: newOwner.name,
    ...(newOwner.did ? { did: newOwner.did } : {}),
  };

  if (!product.traceability) {
    product.traceability = { supplyChainSteps: [] };
  }
  if (!product.traceability.supplyChainSteps) {
    product.traceability.supplyChainSteps = [];
  }
  product.traceability.supplyChainSteps.push({
    stepName: "Ownership Transfer",
    actorDid: newOwner.did,
    timestamp: transferTimestamp,
  });

  product.metadata.last_updated = new Date().toISOString();

  MOCK_DPPS[productIndex] = product;

  return NextResponse.json(product);
}

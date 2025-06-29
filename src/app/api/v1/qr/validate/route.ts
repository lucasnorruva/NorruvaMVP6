// --- File: src/app/api/v1/qr/validate/route.ts ---
// Description: Conceptual API endpoint for validating a QR identifier and retrieving product summary.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import type { DigitalProductPassport } from "@/types/dpp";
import { validateApiKey } from "@/middleware/apiKeyAuth";

interface QrValidateRequestBody {
  qrIdentifier?: string;
}

export async function POST(request: NextRequest) {
  const auth = validateApiKey(request);
  if (auth) return auth;
  let requestBody: QrValidateRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: { code: 400, message: "Invalid JSON payload." } },
      { status: 400 },
    );
  }

  const { qrIdentifier } = requestBody;

  if (
    !qrIdentifier ||
    typeof qrIdentifier !== "string" ||
    qrIdentifier.trim() === ""
  ) {
    return NextResponse.json(
      {
        error: {
          code: 400,
          message: "Invalid request body. 'qrIdentifier' (string) is required.",
        },
      },
      { status: 400 },
    );
  }

  // Conceptually, API key authentication would happen here.
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const product = MOCK_DPPS.find((dpp) => dpp.id === qrIdentifier);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (product) {
    const responsePayload = {
      productId: product.id,
      productName: product.productName,
      category: product.category,
      manufacturer: product.manufacturer?.name || "N/A",
      verificationStatus: "valid_dpp_found", // Mock status
      dppUrl: `/passport/${product.id}`, // Conceptual public URL path
      ebsiCompliance: {
        status: product.ebsiVerification?.status || "unknown",
        verificationId: product.ebsiVerification?.verificationId,
      },
      blockchainAnchor: {
        transactionHash: product.blockchainIdentifiers?.anchorTransactionHash,
        platform: product.blockchainIdentifiers?.platform,
      },
    };
    return NextResponse.json(responsePayload);
  } else {
    return NextResponse.json(
      {
        error: {
          code: 404,
          message: `Product not found for QR identifier ${qrIdentifier}.`,
        },
      },
      { status: 404 },
    );
  }
}

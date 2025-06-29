// --- File: src/app/api/v1/dpp/[productId]/route.ts ---
// Description: Conceptual API endpoint to retrieve and update a Digital Product Passport by ID.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import type { DigitalProductPassport, CustomAttribute } from "@/types/dpp";
import { validateApiKey } from "@/middleware/apiKeyAuth";

interface UpdateDppRequestBody {
  productName?: string;
  category?: string;
  gtin?: string;
  manufacturerName?: string;
  modelNumber?: string;
  metadata?: Partial<DigitalProductPassport["metadata"]>;
  productDetails?: Partial<DigitalProductPassport["productDetails"]>;
  compliance?: Partial<DigitalProductPassport["compliance"]>;
  ebsiVerification?: Partial<DigitalProductPassport["ebsiVerification"]>;
  // Add other fields as needed for updates
}

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  const product = MOCK_DPPS.find((dpp) => dpp.id === productId);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 50)); // Random delay

  if (product) {
    return NextResponse.json(product);
  } else {
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
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;
  let requestBody: UpdateDppRequestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: { code: 400, message: "Invalid JSON payload." } },
      { status: 400 },
    );
  }

  const productIndex = MOCK_DPPS.findIndex((dpp) => dpp.id === productId);

  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 200 + 100),
  );

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

  const existingProduct = MOCK_DPPS[productIndex];

  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    ...(requestBody.productName && { productName: requestBody.productName }),
    ...(requestBody.category && { category: requestBody.category }),
    ...(requestBody.gtin && { gtin: requestBody.gtin }),
    ...(requestBody.manufacturerName && {
      manufacturer: {
        ...existingProduct.manufacturer,
        name: requestBody.manufacturerName,
      },
    }),
    ...(requestBody.modelNumber && { modelNumber: requestBody.modelNumber }),
    metadata: {
      ...existingProduct.metadata,
      ...(requestBody.metadata || {}),
      last_updated: new Date().toISOString(),
    },
    productDetails: {
      ...existingProduct.productDetails,
      ...(requestBody.productDetails || {}),
      customAttributes:
        requestBody.productDetails?.customAttributes ||
        existingProduct.productDetails?.customAttributes ||
        [],
    },
    compliance: {
      ...existingProduct.compliance,
      ...(requestBody.compliance || {}),
    },
    ebsiVerification: {
      ...existingProduct.ebsiVerification,
      ...(requestBody.ebsiVerification || {}),
      lastChecked: requestBody.ebsiVerification?.status
        ? new Date().toISOString()
        : existingProduct.ebsiVerification?.lastChecked ||
          new Date().toISOString(),
    },
    // Add other top-level updatable fields similarly
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  return NextResponse.json(updatedProduct);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  const productIndex = MOCK_DPPS.findIndex((dpp) => dpp.id === productId);

  await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 50));

  if (productIndex === -1) {
    return NextResponse.json(
      {
        error: {
          code: 404,
          message: `Product with ID ${productId} not found for deletion.`,
        },
      },
      { status: 404 },
    );
  }

  MOCK_DPPS[productIndex].metadata.status = "archived";
  MOCK_DPPS[productIndex].metadata.last_updated = new Date().toISOString();

  return NextResponse.json({
    message: `Product with ID ${productId} has been archived successfully.`,
    status: "Archived",
  });
}

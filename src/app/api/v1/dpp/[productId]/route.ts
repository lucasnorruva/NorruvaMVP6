
// --- File: src/app/api/v1/dpp/[productId]/route.ts ---
// Description: Conceptual API endpoint to retrieve and update a Digital Product Passport by ID.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/types/dpp';
import type { DigitalProductPassport, CustomAttribute } from '@/types/dpp';

interface UpdateDppRequestBody {
  productName?: string;
  category?: string;
  gtin?: string;
  manufacturerName?: string;
  modelNumber?: string;
  metadata?: Partial<DigitalProductPassport['metadata']>;
  productDetails?: Partial<DigitalProductPassport['productDetails']>;
  compliance?: Partial<DigitalProductPassport['compliance']>;
  ebsiVerification?: Partial<DigitalProductPassport['ebsiVerification']>;
  // Add other fields as needed for updates
}


export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;

  // Conceptually, API key authentication would happen here.
  // For this mock, we'll skip actual validation.
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const product = MOCK_DPPS.find(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  let requestBody: UpdateDppRequestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  // Conceptual API key authentication
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const existingProduct = MOCK_DPPS[productIndex];
  
  // Create an updated product object by merging fields
  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    ...(requestBody.productName && { productName: requestBody.productName }),
    ...(requestBody.category && { category: requestBody.category }),
    ...(requestBody.gtin && { gtin: requestBody.gtin }),
    ...(requestBody.manufacturerName && { manufacturer: { ...existingProduct.manufacturer, name: requestBody.manufacturerName } }),
    ...(requestBody.modelNumber && { modelNumber: requestBody.modelNumber }),
    metadata: {
      ...existingProduct.metadata,
      ...(requestBody.metadata || {}), // Merge metadata fields
      last_updated: new Date().toISOString(), // Always update last_updated
    },
    productDetails: {
      ...existingProduct.productDetails,
      ...(requestBody.productDetails || {}), // Merge productDetails fields
      // Ensure customAttributes are handled correctly if present
      customAttributes: requestBody.productDetails?.customAttributes || existingProduct.productDetails?.customAttributes || [],
    },
    compliance: {
      ...existingProduct.compliance,
      ...(requestBody.compliance || {}), // Merge compliance fields
    },
    ebsiVerification: {
      ...existingProduct.ebsiVerification,
      ...(requestBody.ebsiVerification || {}), // Merge EBSI verification fields
      // Ensure lastChecked is updated if status is touched, or provide a way for client to set it
      lastChecked: requestBody.ebsiVerification?.status ? new Date().toISOString() : existingProduct.ebsiVerification?.lastChecked || new Date().toISOString(),
    },
    // Add other top-level updatable fields similarly
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  return NextResponse.json(updatedProduct);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;

  // Conceptual API key authentication
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found for deletion.` } }, { status: 404 });
  }

  MOCK_DPPS[productIndex].metadata.status = 'archived';
  MOCK_DPPS[productIndex].metadata.last_updated = new Date().toISOString();

  return NextResponse.json({ message: `Product with ID ${productId} has been archived successfully.`, status: "Archived" });
}

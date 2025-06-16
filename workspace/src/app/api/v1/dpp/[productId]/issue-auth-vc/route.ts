
// --- File: src/app/api/v1/dpp/[productId]/issue-auth-vc/route.ts ---
// Description: Mock API endpoint to simulate issuing an authentication VC for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const existingProduct = MOCK_DPPS[productIndex];
  const newVcId = `vc_auth_${productId}_${Date.now().toString(36).slice(-6)}`;

  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    authenticationVcId: newVcId,
    metadata: {
      ...existingProduct.metadata,
      last_updated: new Date().toISOString(),
    },
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `Authentication VC conceptually issued for product ${productId}.`,
    productId: productId,
    authenticationVcId: newVcId,
    updatedProduct: updatedProduct,
  }, { status: 200 });
}


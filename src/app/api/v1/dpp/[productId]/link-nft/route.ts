// --- File: src/app/api/v1/dpp/[productId]/link-nft/route.ts ---
// Description: Mock API endpoint to simulate linking an ownership NFT to a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport } from '@/types/dpp'; // Import the full type
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface LinkNftRequestBody {
  registryUrl?: string;
  contractAddress: string;
  tokenId: string;
  chainName?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: LinkNftRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { registryUrl, contractAddress, tokenId, chainName } = requestBody;

  if (!contractAddress || !tokenId) {
    return NextResponse.json({ error: { code: 400, message: "Fields 'contractAddress' and 'tokenId' are required." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const existingProduct = MOCK_DPPS[productIndex];

  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    ownershipNftLink: {
      registryUrl: registryUrl || undefined,
      contractAddress,
      tokenId,
      chainName: chainName || undefined,
    },
    metadata: {
      ...existingProduct.metadata,
      last_updated: new Date().toISOString(),
    },
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `Ownership NFT conceptually linked for product ${productId}.`,
    productId: productId,
    ownershipNftLink: updatedProduct.ownershipNftLink,
    updatedProduct: updatedProduct, // Returning the full updated product
  }, { status: 200 });
}

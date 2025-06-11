// --- File: src/app/api/v1/dpp/custody/[productId]/route.ts ---
// Description: Endpoint to update chain of custody information for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { SupplyChainStep, DigitalProductPassport } from '@/types/dpp';

interface CustodyUpdateRequestBody {
  did: string;
  timestamp: string;
  location?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  let requestBody: CustodyUpdateRequestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: 'Invalid JSON payload.' } }, { status: 400 });
  }

  const { did, timestamp, location } = requestBody;
  if (!did || !timestamp) {
    return NextResponse.json({ error: { code: 400, message: "Fields 'did' and 'timestamp' are required." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  await new Promise(resolve => setTimeout(resolve, 150));

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const product = MOCK_DPPS[productIndex];
  if (!product.traceability) {
    product.traceability = {};
  }
  if (!product.traceability.supplyChainSteps) {
    product.traceability.supplyChainSteps = [];
  }

  const newStep: SupplyChainStep = {
    stepName: 'Custody Update',
    actorDid: did,
    timestamp,
    ...(location && { location }),
  };

  product.traceability.supplyChainSteps.push(newStep);
  product.metadata.last_updated = new Date().toISOString();

  MOCK_DPPS[productIndex] = product as DigitalProductPassport;

  return NextResponse.json(product);
}

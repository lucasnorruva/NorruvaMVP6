
// --- File: src/app/api/v1/private/dpp/[productId]/component-transfer/route.ts ---
// Description: Mock API endpoint to simulate recording a private B2B component transfer.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import { validateApiKey } from '@/middleware/apiKeyAuth';

// Based on #/components/schemas/B2BComponentTransferRecord from openapi.yaml
interface B2BComponentTransferRecordRequestBody {
  componentId: string;
  batchOrSerialNumbers?: string[];
  quantity: number;
  unit?: string;
  transferDate: string; // ISO date-time
  fromParty: {
    participantId?: string;
    participantDid?: string;
    role?: string;
  };
  toParty: {
    participantId?: string;
    participantDid?: string;
    role?: string;
  };
  transactionDetails?: {
    type?: string;
    referenceId?: string;
    privateLedgerTxHash?: string;
  };
  accompanyingDocuments?: Array<{
    type?: string;
    documentId?: string;
    documentHash?: string;
  }>;
  notes?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: B2BComponentTransferRecordRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const {
    componentId,
    quantity,
    transferDate,
    fromParty,
    toParty,
  } = requestBody;

  if (!componentId || typeof quantity !== 'number' || !transferDate || !fromParty || !toParty) {
    return NextResponse.json({
      error: {
        code: 400,
        message: "Missing required fields: componentId, quantity, transferDate, fromParty, toParty are required.",
      },
    }, { status: 400 });
  }

  const product = MOCK_DPPS.find(dpp => dpp.id === productId);

  if (!product) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  // Simulate API delay & private layer recording
  await new Promise(resolve => setTimeout(resolve, 200));

  const generatedTransferId = `transfer_${componentId.replace(/\s+/g, '_')}_${Date.now().toString(36).slice(-6)}`;
  const recordedTransferData = {
    transferId: generatedTransferId,
    ...requestBody,
    productId: productId, // Add productId to the response for context
  };

  // Log the conceptual recording to the private layer
  console.log(`[Private Layer Mock] Component transfer recorded for product ${productId}:`, JSON.stringify(recordedTransferData, null, 2));
  
  // This mock does not modify MOCK_DPPS as there's no direct field for B2B transfers on the public DPP.
  // It just acknowledges the recording.

  return NextResponse.json(recordedTransferData, { status: 201 });
}


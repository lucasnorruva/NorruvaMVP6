
// --- File: src/app/api/v1/dpp/extend/[productId]/route.ts ---
// Description: Conceptual API endpoint to extend a DPP by adding document references.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, DocumentReference, SupplyChainStep } from '@/types/dpp';

interface ExtendDppRequestBody {
  documentReference?: {
    documentName: string;
    documentUrl: string;
    documentType: string;
  };
  chainOfCustodyUpdate?: {
    newOwnerDid: string;
    transferTimestamp: string;
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;
  let requestBody: ExtendDppRequestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const productToUpdate = MOCK_DPPS[productIndex];

  if (requestBody.documentReference) {
    const { documentName, documentUrl, documentType } = requestBody.documentReference;
    if (!documentName || !documentUrl || !documentType) {
      return NextResponse.json({ error: { code: 400, message: "Fields 'documentName', 'documentUrl', and 'documentType' are required for documentReference." } }, { status: 400 });
    }

    const newDocument: DocumentReference = {
      name: documentName,
      url: documentUrl,
      type: documentType,
      addedTimestamp: new Date().toISOString(),
    };

    if (!productToUpdate.documents) {
      productToUpdate.documents = [];
    }
    productToUpdate.documents.push(newDocument);
    productToUpdate.metadata.last_updated = new Date().toISOString();
    
    // Update the product in the mock array
    MOCK_DPPS[productIndex] = productToUpdate;
    
    return NextResponse.json(productToUpdate);
  }

  // Append custody information if provided
  if (requestBody.chainOfCustodyUpdate) {
    const { newOwnerDid, transferTimestamp } = requestBody.chainOfCustodyUpdate;
    if (!newOwnerDid || !transferTimestamp) {
      return NextResponse.json(
        { error: { code: 400, message: "Fields 'newOwnerDid' and 'transferTimestamp' are required." } },
        { status: 400 },
      );
    }

    if (!productToUpdate.traceability) {
      productToUpdate.traceability = {};
    }
    if (!productToUpdate.traceability.supplyChainSteps) {
      productToUpdate.traceability.supplyChainSteps = [];
    }

    const newStep: SupplyChainStep = {
      stepName: 'Ownership Transfer',
      actorDid: newOwnerDid,
      timestamp: transferTimestamp,
    };

    productToUpdate.traceability.supplyChainSteps.push(newStep);
    productToUpdate.metadata.last_updated = new Date().toISOString();

    MOCK_DPPS[productIndex] = productToUpdate;

    return NextResponse.json(productToUpdate);
  }

  return NextResponse.json({ error: { code: 400, message: "No valid extension data provided (e.g., documentReference)." } }, { status: 400 });
}

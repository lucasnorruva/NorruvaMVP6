
// --- File: src/app/api/v1/dpp/[productId]/lifecycle-events/route.ts ---
// Description: Conceptual API endpoint to add a lifecycle event to a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/types/dpp';
import type { LifecycleEvent } from '@/types/dpp';

interface AddLifecycleEventRequestBody {
  eventType?: string; // Matches 'type' in LifecycleEvent but using a clearer name for request
  location?: string;
  details?: Record<string, any>; // Matches 'data' in LifecycleEvent
  responsibleParty?: string;
  // vcId and transactionHash would typically be assigned by the system or a subsequent process
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  let requestBody: AddLifecycleEventRequestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { eventType, location, details, responsibleParty } = requestBody;

  if (!eventType || typeof eventType !== 'string' || eventType.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'eventType' is required and must be a non-empty string." } }, { status: 400 });
  }

  // Conceptual API key authentication - skipped for mock
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const newEventId = `evt_mock_${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();

  const newLifecycleEvent: LifecycleEvent = {
    id: newEventId,
    type: eventType,
    timestamp: now,
    ...(location && { location }),
    ...(details && { data: details }),
    ...(responsibleParty && { responsibleParty }),
    // vcId and transactionHash would be added by backend processes in a real system
  };

  // Add the new event to the product's lifecycleEvents array in MOCK_DPPS
  const product = MOCK_DPPS[productIndex];
  if (!product.lifecycleEvents) {
    product.lifecycleEvents = [];
  }
  product.lifecycleEvents.push(newLifecycleEvent);
  product.metadata.last_updated = now; // Update the product's last_updated timestamp


  return NextResponse.json(newLifecycleEvent, { status: 201 });
}


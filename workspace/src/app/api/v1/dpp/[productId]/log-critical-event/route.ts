
// --- File: src/app/api/v1/dpp/[productId]/log-critical-event/route.ts ---
// Description: API endpoint to conceptually log a critical event for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, LifecycleEvent } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface LogCriticalEventRequestBody {
  eventDescription: string;
  severity?: "High" | "Medium" | "Low"; // Optional for now, API can default
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  let requestBody: LogCriticalEventRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const { eventDescription, severity = "High" } = requestBody; // Default severity if not provided

  if (!eventDescription || typeof eventDescription !== 'string' || eventDescription.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'eventDescription' is required and must be a non-empty string." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const product = MOCK_DPPS[productIndex];
  const now = new Date().toISOString();
  const mockTxHash = `0xcritical_event_tx_${Date.now().toString(16).slice(-8)}`;

  const criticalEvent: LifecycleEvent = {
    id: `evt_crit_${Date.now().toString(36).slice(-6)}`,
    type: "CriticalEventLogged",
    timestamp: now,
    responsibleParty: "System/Admin Action (Blockchain Mgmt)",
    data: {
      description: eventDescription,
      severity: severity,
      source: "BlockchainMgmtUI",
      mockTransactionHash: mockTxHash,
    },
    transactionHash: mockTxHash,
  };

  if (!product.lifecycleEvents) {
    product.lifecycleEvents = [];
  }
  product.lifecycleEvents.push(criticalEvent);
  product.metadata.last_updated = now;

  MOCK_DPPS[productIndex] = product;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return NextResponse.json({
    message: `Critical event logged for product ${productId}. Mock Tx: ${mockTxHash}`,
    updatedProduct: product,
  }, { status: 200 });
}

// --- File: src/app/api/v1/dpp/[productId]/log-critical-event/route.ts ---
// Description: Mock API endpoint to simulate logging a critical event on-chain for a DPP.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import type { DigitalProductPassport, LifecycleEvent } from "@/types/dpp";
import { validateApiKey } from "@/middleware/apiKeyAuth";

interface LogCriticalEventRequestBody {
  eventDescription: string;
  severity?: "High" | "Medium" | "Low";
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const productId = params.productId;
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: LogCriticalEventRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: { code: 400, message: "Invalid JSON payload." } },
      { status: 400 },
    );
  }

  const { eventDescription, severity = "High" } = requestBody;

  if (
    !eventDescription ||
    typeof eventDescription !== "string" ||
    eventDescription.trim() === ""
  ) {
    return NextResponse.json(
      {
        error: { code: 400, message: "Field 'eventDescription' is required." },
      },
      { status: 400 },
    );
  }
  if (severity && !["High", "Medium", "Low"].includes(severity)) {
    return NextResponse.json(
      {
        error: {
          code: 400,
          message:
            "Invalid 'severity' value. Must be one of: High, Medium, Low.",
        },
      },
      { status: 400 },
    );
  }

  const productIndex = MOCK_DPPS.findIndex((dpp) => dpp.id === productId);

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
  const now = new Date().toISOString();
  const mockTxHash = `0xmock_critical_tx_${Date.now().toString(36).slice(-6)}`;

  const newEvent: LifecycleEvent = {
    id: `crit_evt_${Date.now().toString(36).slice(-5)}`,
    type: "CriticalOnChainEvent",
    timestamp: now,
    data: {
      description: eventDescription,
      severity: severity,
      mockTxHash: mockTxHash,
    },
    responsibleParty: "System/BlockchainLog",
    transactionHash: mockTxHash,
  };

  const updatedLifecycleEvents = [
    ...(existingProduct.lifecycleEvents || []),
    newEvent,
  ];

  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    lifecycleEvents: updatedLifecycleEvents,
    metadata: {
      ...existingProduct.metadata,
      last_updated: now,
    },
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json(
    {
      message: `Critical event '${eventDescription.substring(0, 30)}...' conceptually logged for product ${productId}. Mock Tx: ${mockTxHash}`,
      updatedProduct: updatedProduct,
    },
    { status: 200 },
  );
}

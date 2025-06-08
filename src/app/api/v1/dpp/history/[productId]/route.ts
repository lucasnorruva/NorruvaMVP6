
// --- File: src/app/api/v1/dpp/history/[productId]/route.ts ---
// Description: Conceptual API endpoint to retrieve a history/audit trail for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/types/dpp';
import type { DigitalProductPassport, LifecycleEvent } from '@/types/dpp';

interface HistoryEntry {
  timestamp: string;
  actionType: string;
  details?: string;
  changedBy: string;
  version?: number; // Conceptual version number
}

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;

  // Conceptual API key authentication - skipped for mock
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const product = MOCK_DPPS.find(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  if (!product) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const history: HistoryEntry[] = [];
  let versionCounter = 1;

  // Initial creation
  const creationTimestamp = product.metadata.created_at || product.metadata.last_updated;
  history.push({
    timestamp: creationTimestamp,
    actionType: "DPP Created",
    details: `Initial version of DPP for ${product.productName}.`,
    changedBy: "System/Initial Importer",
    version: versionCounter++,
  });

  // Lifecycle events
  if (product.lifecycleEvents && product.lifecycleEvents.length > 0) {
    product.lifecycleEvents.forEach((event: LifecycleEvent) => {
      history.push({
        timestamp: event.timestamp,
        actionType: `Lifecycle Event: ${event.type}`,
        details: event.location ? `Location: ${event.location}. Data: ${JSON.stringify(event.data || {})}` : `Data: ${JSON.stringify(event.data || {})}`,
        changedBy: event.responsibleParty || "System Update",
        version: versionCounter++,
      });
    });
  }
  
  // Certifications as history events (conceptual)
  if (product.certifications && product.certifications.length > 0) {
    product.certifications.forEach(cert => {
      history.push({
        timestamp: cert.issueDate, // Use issue date as timestamp
        actionType: "Certification Added",
        details: `Certification '${cert.name}' by ${cert.issuer} added. Standard: ${cert.standard || 'N/A'}.`,
        changedBy: "Compliance Team (Mock)",
        version: versionCounter++,
      });
    });
  }


  // General updates based on last_updated (if significantly different from creation/last event)
  const lastEventTimestamp = history.length > 0 ? history[history.length - 1].timestamp : creationTimestamp;
  if (new Date(product.metadata.last_updated) > new Date(lastEventTimestamp)) {
     const timeDifference = new Date(product.metadata.last_updated).getTime() - new Date(lastEventTimestamp).getTime();
     // Only add if there's a significant difference (e.g., more than 1 minute, to avoid noise)
     if (timeDifference > 60000) {
        history.push({
            timestamp: product.metadata.last_updated,
            actionType: "DPP General Update",
            details: "Product information was updated.",
            changedBy: "Manufacturer (Mock)",
            version: versionCounter++,
        });
     }
  }
  
  // Sort history by timestamp descending (most recent first)
  history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


  return NextResponse.json(history);
}

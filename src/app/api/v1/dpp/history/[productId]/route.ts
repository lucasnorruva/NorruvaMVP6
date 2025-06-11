
// --- File: src/app/api/v1/dpp/history/[productId]/route.ts ---
// Description: Conceptual API endpoint to retrieve a history/audit trail for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, LifecycleEvent, Certification, EbsiVerificationDetails, HistoryEntry } from '@/types/dpp';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;

  const product = MOCK_DPPS.find(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  if (!product) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const potentialHistory: Array<Omit<HistoryEntry, 'version'>> = [];
  let maxEventTimestamp = 0;

  // Initial creation
  const creationTimestamp = product.metadata.created_at || product.metadata.last_updated; // Fallback if created_at is missing
  potentialHistory.push({
    timestamp: creationTimestamp,
    actionType: "DPP Created",
    details: `Initial version of DPP for ${product.productName}.`,
    changedBy: "System/Initial Importer",
  });
  maxEventTimestamp = Math.max(maxEventTimestamp, new Date(creationTimestamp).getTime());

  // Lifecycle events
  if (product.lifecycleEvents && product.lifecycleEvents.length > 0) {
    product.lifecycleEvents.forEach((event: LifecycleEvent) => {
      potentialHistory.push({
        timestamp: event.timestamp,
        actionType: `Lifecycle Event: ${event.type}`,
        details: event.location ? `Location: ${event.location}. Data: ${JSON.stringify(event.data || {})}` : `Data: ${JSON.stringify(event.data || {})}`,
        changedBy: event.responsibleParty || "System Update",
      });
      maxEventTimestamp = Math.max(maxEventTimestamp, new Date(event.timestamp).getTime());
    });
  }
  
  // Certifications as history events
  if (product.certifications && product.certifications.length > 0) {
    product.certifications.forEach((cert: Certification) => {
      potentialHistory.push({
        timestamp: cert.issueDate, 
        actionType: "Certification Added",
        details: `Certification '${cert.name}' by ${cert.issuer} added. Standard: ${cert.standard || 'N/A'}.`,
        changedBy: "Compliance Team (Mock)",
      });
      maxEventTimestamp = Math.max(maxEventTimestamp, new Date(cert.issueDate).getTime());
    });
  }

  // EBSI Verification Status Update
  if (product.ebsiVerification) {
    const ebsi = product.ebsiVerification;
    potentialHistory.push({
      timestamp: ebsi.lastChecked,
      actionType: "EBSI Verification Status Update",
      details: `EBSI status changed to ${ebsi.status}.${ebsi.verificationId ? ` Verification ID: ${ebsi.verificationId}` : ''}${ebsi.message ? ` Message: ${ebsi.message}` : ''}`,
      changedBy: "System/EBSI Interface",
    });
    maxEventTimestamp = Math.max(maxEventTimestamp, new Date(ebsi.lastChecked).getTime());
  }
  
  // General updates based on last_updated (if significantly different from creation/last event)
  const productLastUpdatedTime = new Date(product.metadata.last_updated).getTime();
  if (productLastUpdatedTime > maxEventTimestamp) {
     if (productLastUpdatedTime - maxEventTimestamp > 60000) {
        potentialHistory.push({
            timestamp: product.metadata.last_updated,
            actionType: "DPP Data Updated", 
            details: "Product information was updated via platform.",
            changedBy: "Manufacturer Portal Update (Mock)",
        });
     }
  }
  
  potentialHistory.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const versionedHistory: HistoryEntry[] = potentialHistory.map((entry, index) => ({
    ...entry,
    version: index + 1,
  }));
  
  versionedHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json(versionedHistory);
}


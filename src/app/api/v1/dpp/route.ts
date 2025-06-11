
// --- File: src/app/api/v1/dpp/route.ts ---
// Description: Conceptual API endpoint to create a new Digital Product Passport and list DPPs with filters.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, CustomAttribute, DashboardFiltersState } from '@/types/dpp';

interface CreateDppRequestBody {
  productName: string;
  category: string;
  gtin?: string;
  manufacturerName?: string;
  modelNumber?: string;
  productDetails?: {
    description?: string;
    materials?: Array<{ name: string; percentage?: number; isRecycled?: boolean }>;
    energyLabel?: string;
    customAttributes?: CustomAttribute[];
    imageUrl?: string;
    imageHint?: string;
  };
}

export async function POST(request: NextRequest) {
  let requestBody: CreateDppRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const {
    productName,
    category,
    gtin,
    manufacturerName,
    modelNumber,
    productDetails,
  } = requestBody;

  if (!productName || typeof productName !== 'string' || productName.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'productName' is required and must be a non-empty string." } }, { status: 400 });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'category' is required and must be a non-empty string." } }, { status: 400 });
  }

  // Simulate API key authentication (conceptual)
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const newProductId = `DPP_API_${Date.now().toString().slice(-5)}`;
  const now = new Date().toISOString();

  const newDpp: DigitalProductPassport = {
    id: newProductId,
    productName,
    category,
    gtin: gtin || undefined,
    manufacturer: manufacturerName ? { name: manufacturerName } : undefined,
    modelNumber: modelNumber || undefined,
    metadata: {
      created_at: now,
      last_updated: now,
      status: 'draft', // Default status for new DPPs
      dppStandardVersion: "CIRPASS v1.0 Draft", // Default version
    },
    productDetails: {
      description: productDetails?.description || undefined,
      materials: productDetails?.materials || [],
      energyLabel: productDetails?.energyLabel || undefined,
      customAttributes: productDetails?.customAttributes || [],
      imageUrl: productDetails?.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(productName.substring(0,15))}`,
      imageHint: productDetails?.imageHint || productName.toLowerCase().split(" ").slice(0,2).join(" "),
    },
    compliance: {
      eprel: { status: 'N/A', lastChecked: now },
      esprConformity: { status: 'pending_assessment', assessmentDate: now },
      battery_regulation: { status: 'not_applicable' },
    },
    ebsiVerification: {
      status: 'pending_verification',
      lastChecked: now,
    },
    lifecycleEvents: [],
    certifications: [],
    supplyChainLinks: [],
    consumerScans: 0,
  };

  // Actually add the new DPP to the in-memory array
  MOCK_DPPS.push(newDpp);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));

  return NextResponse.json(newDpp, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get('status') as DashboardFiltersState['status'] | null;
  const category = searchParams.get('category') as DashboardFiltersState['category'] | null;
  const searchQuery = searchParams.get('searchQuery') as DashboardFiltersState['searchQuery'] | null;
  const blockchainAnchored = searchParams.get('blockchainAnchored') as DashboardFiltersState['blockchainAnchored'] | null;
  // Add limit and offset for conceptual pagination if needed later
  // const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
  // const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined;


  let filteredDPPs: DigitalProductPassport[] = [...MOCK_DPPS];

  if (searchQuery) {
    const lowerSearchQuery = searchQuery.toLowerCase();
    filteredDPPs = filteredDPPs.filter(dpp =>
      dpp.productName.toLowerCase().includes(lowerSearchQuery) ||
      dpp.id.toLowerCase().includes(lowerSearchQuery) ||
      (dpp.gtin && dpp.gtin.toLowerCase().includes(lowerSearchQuery)) ||
      (dpp.manufacturer?.name && dpp.manufacturer.name.toLowerCase().includes(lowerSearchQuery))
    );
  }

  if (status && status !== 'all') {
    filteredDPPs = filteredDPPs.filter(dpp => dpp.metadata.status === status);
  }

  if (category && category !== 'all') {
    filteredDPPs = filteredDPPs.filter(dpp => dpp.category === category);
  }
  
  if (blockchainAnchored) {
    if (blockchainAnchored === 'anchored') {
        filteredDPPs = filteredDPPs.filter(dpp => !!dpp.blockchainIdentifiers?.anchorTransactionHash);
    } else if (blockchainAnchored === 'not_anchored') {
        filteredDPPs = filteredDPPs.filter(dpp => !dpp.blockchainIdentifiers?.anchorTransactionHash);
    }
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json({
    data: filteredDPPs,
    filtersApplied: {
      status,
      category,
      searchQuery,
      blockchainAnchored,
    },
    totalCount: filteredDPPs.length,
  });
}



// --- File: src/app/api/v1/dpp/route.ts ---
// This file is being deprecated and its functionality is conceptually replaced by the new architecture.
// The new system will use client-side hooks (`useProductList`, `useCreateProduct`) that call a mock service layer (`productService`).
// This mock service layer simulates API calls without needing actual HTTP fetch requests in the prototype.
// This route is kept for reference but will no longer be actively used by the refactored product pages.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS } from '@/data/mockDpps'; // Corrected import
import type { DigitalProductPassport, DashboardFiltersState } from '@/types/dpp'; // Corrected import

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
    customAttributes?: any[]; // Keep as any[] for simplicity with old types
    imageUrl?: string;
    imageHint?: string;
  };
}

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

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
    return NextResponse.json({ error: { code: 400, message: "Field 'productName' is required." } }, { status: 400 });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'category' is required." } }, { status: 400 });
  }

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
      status: 'draft',
      dppStandardVersion: "CIRPASS v1.0 Draft",
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

  MOCK_DPPS.push(newDpp);
  await new Promise(resolve => setTimeout(resolve, 250));
  return NextResponse.json(newDpp, { status: 201 });
}

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as DashboardFiltersState['status'] | null;
  const categoryParam = searchParams.get('category') as DashboardFiltersState['category'] | null;
  const searchQuery = searchParams.get('searchQuery') as DashboardFiltersState['searchQuery'] | null;
  const blockchainAnchored = searchParams.get('blockchainAnchored') as DashboardFiltersState['blockchainAnchored'] | null;

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

  if (categoryParam && categoryParam !== 'all') {
    filteredDPPs = filteredDPPs.filter(dpp => dpp.category === categoryParam);
  }
  
  if (blockchainAnchored) {
    if (blockchainAnchored === 'anchored') {
        filteredDPPs = filteredDPPs.filter(dpp => !!dpp.blockchainIdentifiers?.anchorTransactionHash);
    } else if (blockchainAnchored === 'not_anchored') {
        filteredDPPs = filteredDPPs.filter(dpp => !dpp.blockchainIdentifiers?.anchorTransactionHash);
    }
  }

  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));

  return NextResponse.json({
    data: filteredDPPs,
    filtersApplied: {
      status,
      category: categoryParam,
      searchQuery,
      blockchainAnchored,
    },
    totalCount: filteredDPPs.length,
  });
}

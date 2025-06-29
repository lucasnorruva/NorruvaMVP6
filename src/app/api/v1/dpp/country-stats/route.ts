import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import { validateApiKey } from "@/middleware/apiKeyAuth";

export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (auth) return auth;

  const counts: Record<string, number> = {};
  for (const dpp of MOCK_DPPS) {
    const country = dpp.traceability?.originCountry || "unknown";
    counts[country] = (counts[country] || 0) + 1;
  }

  const result = Object.entries(counts).map(([countryCode, count]) => ({
    countryCode,
    count,
  }));
  return NextResponse.json(result);
}

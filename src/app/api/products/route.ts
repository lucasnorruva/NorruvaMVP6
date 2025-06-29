import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import type {
  DigitalProductPassport,
  DashboardFiltersState,
} from "@/types/dpp";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") as
    | DashboardFiltersState["status"]
    | null;
  const category = searchParams.get("category") as
    | DashboardFiltersState["category"]
    | null;
  const searchQuery = searchParams.get("searchQuery") as
    | DashboardFiltersState["searchQuery"]
    | null;

  let filteredDPPs: DigitalProductPassport[] = [...MOCK_DPPS];

  if (searchQuery) {
    filteredDPPs = filteredDPPs.filter((dpp) =>
      dpp.productName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (status && status !== "all") {
    filteredDPPs = filteredDPPs.filter((dpp) => dpp.metadata.status === status);
  }

  if (category && category !== "all") {
    filteredDPPs = filteredDPPs.filter((dpp) => dpp.category === category);
  }

  // Simulate a short delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: filteredDPPs,
    filtersApplied: {
      status,
      category,
      searchQuery,
    },
    totalCount: filteredDPPs.length,
  });
}

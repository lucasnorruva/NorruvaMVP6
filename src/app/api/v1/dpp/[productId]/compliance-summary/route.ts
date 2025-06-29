// --- File: src/app/api/v1/dpp/[productId]/compliance-summary/route.ts ---
// Description: Conceptual API endpoint to retrieve a compliance summary for a DPP.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MOCK_DPPS } from "@/data";
import type { DigitalProductPassport } from "@/types/dpp";
import { validateApiKey } from "@/middleware/apiKeyAuth";

// Simplified function to determine overall status, similar to getOverallComplianceDetails
const calculateOverallStatus = (dpp: DigitalProductPassport): string => {
  let compliantCount = 0;
  let pendingCount = 0;
  let nonCompliantCount = 0;
  const regulationsChecked = Object.values(dpp.compliance).filter(
    (reg): reg is { status: string } =>
      typeof reg === "object" && reg !== null && "status" in reg,
  );

  if (regulationsChecked.length === 0) {
    return "N/A";
  }

  regulationsChecked.forEach((reg) => {
    const status = reg.status?.toLowerCase();
    if (
      status === "compliant" ||
      status === "registered" ||
      status === "conformant" ||
      status === "synced successfully"
    )
      compliantCount++;
    else if (
      status === "pending" ||
      status === "pending_review" ||
      status === "pending_assessment" ||
      status === "pending_verification" ||
      status === "in progress" ||
      status === "data incomplete"
    )
      pendingCount++;
    else if (
      status === "non_compliant" ||
      status === "non_conformant" ||
      status === "error" ||
      status === "data mismatch" ||
      status === "product not found in eprel"
    )
      nonCompliantCount++;
  });

  if (nonCompliantCount > 0) return "Non-Compliant";
  if (pendingCount > 0) return "Pending Review";
  if (
    compliantCount === regulationsChecked.length &&
    regulationsChecked.length > 0
  )
    return "Fully Compliant";
  return "Review Needed";
};

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  // Conceptual API key authentication - skipped for mock
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  // }

  const product = MOCK_DPPS.find((dpp) => dpp.id === productId);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (product) {
    const complianceSummary = {
      productId: product.id,
      productName: product.productName,
      overallStatus: calculateOverallStatus(product),
      eprelStatus: product.compliance.eprel?.status || "N/A",
      ebsiVerificationStatus: product.ebsiVerification?.status || "N/A",
      batteryRegulationStatus:
        product.compliance.battery_regulation?.status || "N/A",
      esprStatus:
        product.compliance.eu_espr?.status ||
        (product.compliance.esprConformity?.status
          ? `${product.compliance.esprConformity.status} (Conformity)`
          : "N/A"),
      lastChecked: product.metadata.last_updated,
      details: {
        eprel: product.compliance.eprel,
        ebsi: product.ebsiVerification,
        batteryRegulation: product.compliance.battery_regulation,
        esprConformity: product.compliance.esprConformity,
        euEspr: product.compliance.eu_espr,
        usScope3: product.compliance.us_scope3,
      },
    };
    return NextResponse.json(complianceSummary);
  } else {
    return NextResponse.json(
      {
        error: {
          code: 404,
          message: `Compliance summary for product ID ${productId} not found.`,
        },
      },
      { status: 404 },
    );
  }
}

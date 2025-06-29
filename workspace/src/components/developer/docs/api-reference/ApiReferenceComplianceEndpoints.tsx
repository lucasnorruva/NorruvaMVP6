// --- File: src/components/developer/docs/api-reference/ApiReferenceComplianceEndpoints.tsx ---
"use client";

import { ShieldCheck } from "lucide-react";
import {
  EndpointDetailCard,
  type EndpointDefinition,
} from "./EndpointDetailCard";

interface ApiReferenceComplianceEndpointsProps {
  conceptualComplianceSummaryResponse: string;
  conceptualVerifyDppResponse: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ApiReferenceComplianceEndpoints({
  conceptualComplianceSummaryResponse,
  conceptualVerifyDppResponse,
  error401,
  error404,
  error500,
}: ApiReferenceComplianceEndpointsProps) {
  const errorExamples = { "401": error401, "404": error404, "500": error500 };

  const complianceEndpoints: EndpointDefinition[] = [
    {
      title: "Retrieve Compliance Summary",
      method: "GET",
      path: "/api/v1/dpp/{productId}/compliance-summary",
      description:
        "Fetches a summary of the compliance status for a specific product.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "The unique identifier of the product.",
        },
      ],
      responseExample: conceptualComplianceSummaryResponse,
      responseSchema: "ComplianceSummaryResponse", // Assuming a schema name
      commonErrors: ["401", "404", "500"],
      errorExamples,
    },
    {
      title: "Verify Digital Product Passport",
      method: "POST",
      path: "/api/v1/dpp/verify/{productId}",
      description:
        "Performs compliance and authenticity checks on a specific DPP (conceptual EBSI-linked verification).",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "The unique identifier of the product to verify.",
        },
      ],
      responseExample: conceptualVerifyDppResponse,
      responseSchema: "VerificationResponse", // Assuming a schema name
      commonErrors: ["401", "404", "500"],
      errorExamples,
    },
  ];

  return (
    <section id="compliance-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <ShieldCheck className="mr-3 h-6 w-6 text-primary" /> Compliance &
        Verification Endpoints
      </h2>
      {complianceEndpoints.map((endpoint, index) => (
        <EndpointDetailCard key={index} {...endpoint} />
      ))}
    </section>
  );
}

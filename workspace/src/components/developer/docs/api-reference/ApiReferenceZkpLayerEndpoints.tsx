// --- File: src/components/developer/docs/api-reference/ApiReferenceZkpLayerEndpoints.tsx ---
"use client";

import { Zap } from "lucide-react";
import EndpointDetailCard, {
  type EndpointDefinition,
} from "./EndpointDetailCard";

interface ApiReferenceZkpLayerEndpointsProps {
  exampleZkpSubmitRequestBody: string;
  exampleZkpSubmitResponseBody: string;
  exampleZkpVerifyResponseBody: string;
  error400General: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ApiReferenceZkpLayerEndpoints({
  exampleZkpSubmitRequestBody,
  exampleZkpSubmitResponseBody,
  exampleZkpVerifyResponseBody,
  error400General,
  error401,
  error404,
  error500,
}: ApiReferenceZkpLayerEndpointsProps) {
  const errorExamples = {
    "400": error400General,
    "401": error401,
    "404": error404,
    "500": error500,
  };

  const zkpEndpoints: EndpointDefinition[] = [
    {
      id: "submitZkp",
      title: "Submit Zero-Knowledge Proof for a DPP",
      method: "POST",
      path: "/api/v1/zkp/submit-proof/{dppId}",
      description:
        "[ZKP Layer - Highly Conceptual] Allows a prover to submit a ZKP related to a specific DPP.",
      pathParams: [
        {
          name: "dppId",
          type: "string",
          required: true,
          description: "DPP ID.",
        },
      ],
      requestBodySchema: "ZkpSubmissionRequest",
      requestBodyExample: exampleZkpSubmitRequestBody,
      responseSchema: "ZkpSubmissionResponse",
      responseExample: exampleZkpSubmitResponseBody,
      commonErrors: ["400", "401", "404", "500"],
      errorExamples,
    },
    {
      id: "verifyZkpClaim",
      title: "Verify Claim with ZKP for a DPP",
      method: "GET",
      path: "/api/v1/zkp/verify-claim/{dppId}",
      description:
        "[ZKP Layer - Highly Conceptual] Allows a verifier to check if a claim for a DPP has a valid ZKP.",
      pathParams: [
        {
          name: "dppId",
          type: "string",
          required: true,
          description: "DPP ID.",
        },
      ],
      queryParams: [
        {
          name: "claimType",
          type: "string",
          required: true,
          description: "Type of claim to verify.",
          example: "material_compliance_svhc_x",
        },
      ],
      responseSchema: "ZkpVerificationResponse",
      responseExample: exampleZkpVerifyResponseBody,
      commonErrors: ["400", "401", "404", "500"],
      errorExamples,
    },
  ];

  return (
    <section id="zkp-layer-endpoints" className="mt-8">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Zap className="mr-3 h-6 w-6 text-primary" /> Zero-Knowledge Proof Layer
        Endpoints (Conceptual)
      </h2>
      {zkpEndpoints.map((endpoint, index) => (
        <EndpointDetailCard key={index} {...endpoint} />
      ))}
    </section>
  );
}

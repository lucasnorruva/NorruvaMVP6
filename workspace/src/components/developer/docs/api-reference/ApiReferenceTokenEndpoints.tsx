
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, KeyRound } from "lucide-react";
import type { FC } from 'react';
import EndpointDetailCard, { type EndpointDefinition } from './EndpointDetailCard';

interface ApiReferenceTokenEndpointsProps {
  mintRequest: string;
  mintResponse: string;
  updateRequest: string;
  updateResponse: string;
  statusResponse: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ApiReferenceTokenEndpoints({
  mintRequest,
  mintResponse,
  updateRequest,
  updateResponse,
  statusResponse,
  error401,
  error404,
  error500,
}: ApiReferenceTokenEndpointsProps) {
  const tokenEndpoints: EndpointDefinition[] = [
    { 
      id: "mintDppToken", 
      title: "Mint DPP Token", 
      method: "POST", 
      path: "/api/v1/token/mint/{productId}", 
      description: "Mints a blockchain token representing the specified product passport.", 
      pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], 
      requestBodySchema: "MintTokenRequest", 
      requestBodyExample: mintRequest, 
      responseSchema: "MintTokenResponse", 
      responseExample: mintResponse, 
      commonErrors: ["401", "404", "500"] 
    },
    { 
      id: "updateTokenMetadata", 
      title: "Update Token Metadata", 
      method: "PATCH", 
      path: "/api/v1/token/metadata/{tokenId}", 
      description: "Updates the on-chain metadata URI for a minted DPP token.", 
      pathParams: [{ name: "tokenId", type: "string", required: true, description: "Blockchain token ID." }], 
      requestBodySchema: "UpdateTokenMetadataRequest", 
      requestBodyExample: updateRequest, 
      responseSchema: "UpdateTokenMetadataResponse", 
      responseExample: updateResponse, 
      commonErrors: ["401", "404", "500"] 
    },
    { 
      id: "getTokenStatus", 
      title: "Retrieve Token On-Chain Status", 
      method: "GET", 
      path: "/api/v1/token/status/{tokenId}", 
      description: "Retrieves on-chain information for a DPP token.", 
      pathParams: [{ name: "tokenId", type: "string", required: true, description: "Blockchain token ID." }], 
      responseSchema: "TokenStatusResponse", 
      responseExample: statusResponse, 
      commonErrors: ["401", "404", "500"] 
    }
  ];
  
  const errorExamples: Record<string, string> = { "401": error401, "404": error404, "500": error500 };

  return (
    <section id="token-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <KeyRound className="mr-3 h-6 w-6 text-primary" /> DPP Token Endpoints (Conceptual)
      </h2>
      {tokenEndpoints.map((endpoint, index) => (
        <EndpointDetailCard key={index} {...endpoint} errorExamples={errorExamples} />
      ))}
    </section>
  );
}


// --- File: src/components/developer/docs/api-reference/ApiReferencePrivateLayerEndpoints.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server, Layers3 } from "lucide-react";

interface EndpointDefinition {
  id: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  pathParams?: Array<{ name: string; type: string; required: boolean; description: string }>;
  queryParams?: Array<{ name: string; type: string; required: boolean; description: string; example?: string }>;
  requestBodySchema?: string;
  requestBodyExample?: string;
  responseSchema?: string;
  responseExample: string;
  commonErrors: Array<"400" | "401" | "404" | "500" | string>; 
}

interface ApiReferencePrivateLayerEndpointsProps {
  exampleB2BComponentTransferRequestBody: string;
  exampleB2BComponentTransferResponseBody: string;
  exampleGetSupplierAttestationsResponseBody: string; 
  exampleGetConfidentialMaterialsResponseBody: string; 
  error400General: string;
  error401: string;
  error404: string;
  error500: string;
}

const EndpointDetailCard: React.FC<EndpointDefinition & { errorExamples: Record<string, string> }> = ({
  title, method, path, description, pathParams, queryParams, requestBodySchema, requestBodyExample, responseSchema, responseExample, commonErrors, errorExamples
}) => {
  const getBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-sky-100 text-sky-700 border-sky-300";
      case "POST": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className={`${getBadgeClass(method)} mr-2 font-semibold`}>{method}</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">{path}</code>
          </span>
          <br />
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(pathParams && pathParams.length > 0) && (
          <section><h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {pathParams.map(p => <li key={p.name}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{p.name}</code> ({p.type}, {p.required ? 'required' : 'optional'}): {p.description}</li>)}
            </ul>
          </section>
        )}
        {requestBodyExample && (
          <section><h4 className="font-semibold mb-1">Request Body {requestBodySchema && `(${requestBodySchema})`}</h4>
            <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{requestBodyExample}</code></pre></details>
          </section>
        )}
        <section><h4 className="font-semibold mb-1">Example Response (Success) {responseSchema && `(${responseSchema})`}</h4>
          <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
          <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{responseExample}</code></pre></details>
        </section>
        {(commonErrors && commonErrors.length > 0) && (
          <section><h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              {commonErrors.map(errCode => (
                <li key={errCode}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{errCode.split('_')[0]} {errCode.includes('_') ? errCode.split('_')[1].toUpperCase() : 'Bad Request'}</code>
                  {errorExamples[errCode] && (
                    <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{errorExamples[errCode]}</code></pre></details>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
};


export default function ApiReferencePrivateLayerEndpoints({
  exampleB2BComponentTransferRequestBody,
  exampleB2BComponentTransferResponseBody,
  exampleGetSupplierAttestationsResponseBody,
  exampleGetConfidentialMaterialsResponseBody,
  error400General,
  error401,
  error404,
  error500,
}: ApiReferencePrivateLayerEndpointsProps) {

  const privateEndpoints: EndpointDefinition[] = [
    { id: "getSupplierAttestations", title: "Retrieve Private Supplier Attestations", method: "GET", path: "/api/v1/private/dpp/{productId}/supplier/{supplierId}/attestations", description: "Fetches detailed, potentially sensitive attestations from a specific supplier for a given product.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }, { name: "supplierId", type: "string", required: true, description: "Supplier ID." }], responseSchema: "DetailedSupplierAttestation[]", responseExample: exampleGetSupplierAttestationsResponseBody, commonErrors: ["401", "404", "500"] },
    { id: "recordComponentTransfer", title: "Record Private B2B Component Transfer", method: "POST", path: "/api/v1/private/dpp/{productId}/component-transfer", description: "Records the transfer of a component between verified entities.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], requestBodySchema: "B2BComponentTransferRecord", requestBodyExample: exampleB2BComponentTransferRequestBody, responseSchema: "B2BComponentTransferRecord", responseExample: exampleB2BComponentTransferResponseBody, commonErrors: ["400", "401", "404", "500"] },
    { id: "getConfidentialMaterials", title: "Retrieve Private Confidential Material Details", method: "GET", path: "/api/v1/private/dpp/{productId}/confidential-materials", description: "Fetches highly detailed or proprietary material composition information.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], responseSchema: "ConfidentialMaterialComposition", responseExample: exampleGetConfidentialMaterialsResponseBody, commonErrors: ["401", "404", "500"] },
  ];
  
  const errorExamples: Record<string, string> = { "400": error400General, "401": error401, "404": error404, "500": error500 };

  return (
    <section id="private-layer-endpoints" className="mt-8">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Layers3 className="mr-3 h-6 w-6 text-primary" /> Private Layer Endpoints (Conceptual)
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Endpoints for managing sensitive, permissioned B2B data not suitable for the public DPP. Access to these endpoints would conceptually require enhanced authentication beyond standard API keys.
      </p>
      {privateEndpoints.map(endpoint => (
        <EndpointDetailCard key={endpoint.id} {...endpoint} errorExamples={errorExamples} />
      ))}
    </section>
  );
}


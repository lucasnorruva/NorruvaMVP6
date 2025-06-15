
// --- File: src/components/developer/docs/api-reference/ApiReferencePrivateLayerEndpoints.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server, Layers3 } from "lucide-react";

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

  return (
    <section id="private-layer-endpoints" className="mt-8">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Layers3 className="mr-3 h-6 w-6 text-primary" /> Private Layer Endpoints (Conceptual)
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Endpoints for managing sensitive, permissioned B2B data not suitable for the public DPP. Access to these endpoints would conceptually require enhanced authentication beyond standard API keys.
      </p>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Retrieve Private Supplier Attestations</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/private/dpp/{"{productId}"}/supplier/{"{supplierId}"}/attestations</code>
            </span>
            <br />
            Fetches detailed, potentially sensitive attestations from a specific supplier for a given product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">supplierId</code> (string, required): The unique identifier of the supplier.</li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
            <p className="text-sm mb-1">Returns an array of DetailedSupplierAttestation objects.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleGetSupplierAttestationsResponseBody}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Record Private B2B Component Transfer</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/private/dpp/{"{productId}"}/component-transfer</code>
            </span>
            <br />
            Records the transfer of a component or sub-assembly between two verified entities within a private supply chain network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product the component is associated with.</li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON) - B2BComponentTransferRecord</h4>
            <p className="text-sm mb-1">Details of the component transfer. Refer to OpenAPI spec for full schema.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleB2BComponentTransferRequestBody}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 201 Created)</h4>
            <p className="text-sm mb-1">Returns the created B2BComponentTransferRecord with a generated transferId.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleB2BComponentTransferResponseBody}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
            </ul>
          </section>
        </CardContent>
      </Card>

       <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Retrieve Private Confidential Material Details</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/private/dpp/{"{productId}"}/confidential-materials</code>
            </span>
            <br />
            Fetches highly detailed or proprietary material composition information that is not suitable for the public DPP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
            <p className="text-sm mb-1">Returns a ConfidentialMaterialComposition object.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleGetConfidentialMaterialsResponseBody}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </section>
  );
}

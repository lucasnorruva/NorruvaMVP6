
// --- File: src/components/developer/docs/api-reference/ApiReferencePrivateLayerEndpoints.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server, Layers3 } from "lucide-react"; // Using Layers3 for private layer

interface ApiReferencePrivateLayerEndpointsProps {
  exampleB2BComponentTransferRequestBody: string;
  exampleB2BComponentTransferResponseBody: string;
  error400General: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ApiReferencePrivateLayerEndpoints({
  exampleB2BComponentTransferRequestBody,
  exampleB2BComponentTransferResponseBody,
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
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Record Private B2B Component Transfer</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/private/dpp/{"{productId}"}/component-transfer</code>
            </span>
            <br />
            [Private Layer - Conceptual] Records the transfer of a component or sub-assembly between two verified entities within a private supply chain network. Access would typically require enhanced B2B authentication.
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
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code> (e.g., missing required fields like componentId, quantity). (Example in GET /dpp)</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code> (Authentication failed or insufficient permissions for private data). (Example in GET /dpp/{"{id}"})</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code> (Product not found). (Example in GET /dpp/{"{id}"})</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>. (Example in GET /dpp/{"{id}"})</li>
            </ul>
          </section>
        </CardContent>
      </Card>
      {/* Future: Add documentation for GET /private/dpp/{productId}/supplier/{supplierId}/attestations */}
      {/* Future: Add documentation for GET /private/dpp/{productId}/confidential-materials */}
    </section>
  );
}


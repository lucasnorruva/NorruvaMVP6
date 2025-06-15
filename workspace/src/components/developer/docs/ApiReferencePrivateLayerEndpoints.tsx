
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

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
  error500
}: ApiReferencePrivateLayerEndpointsProps) {

  return (
    <>
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Record Private B2B Component Transfer</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/private/dpp/&#123;productId&#125;/component-transfer</code>
            </span>
            <br />
            [Private Layer - Conceptual] Records the transfer of a component or sub-assembly between two verified entities within a private supply chain network. Access to this endpoint would conceptually require robust B2B authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product the component is associated with.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
            <p className="text-sm mb-1">A JSON object containing details of the component transfer.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request Body
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleB2BComponentTransferRequestBody}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 201 Created)</h4>
            <p className="text-sm mb-1">Returns a JSON object representing the recorded component transfer.</p>
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
               <li>
                  <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid input data.
                  <details className="border rounded-md mt-1">
                      <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                      <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400General}</code></pre>
                  </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>: Authentication failed or insufficient permissions for private data.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                </details>
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Retrieve Private Supplier Attestations</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/private/dpp/&#123;productId&#125;/supplier/&#123;supplierId&#125;/attestations</code>
            </span>
            <br />
            [Private Layer - Conceptual] Fetches detailed, potentially sensitive attestations from a specific supplier for a given product. Access to this endpoint would conceptually require a higher level of authentication and specific permissions beyond standard API key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product.
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;supplierId&#125;</code> (path, required): The unique identifier of the supplier.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
            <p className="text-sm mb-1">Returns a JSON array containing supplier attestations.</p>
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
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>: API key missing or invalid / Insufficient permissions for private data.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: Product or Supplier not found, or no attestations available.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                </details>
              </li>
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
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/private/dpp/&#123;productId&#125;/confidential-materials</code>
            </span>
            <br />
            [Private Layer - Conceptual] Fetches highly detailed or proprietary material composition information that is not suitable for the public DPP. Access to this endpoint would require strict, permissioned access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
            <p className="text-sm mb-1">Returns a JSON object representing confidential material composition details.</p>
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
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>: API key missing or invalid / Insufficient permissions for confidential data.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: Product not found or no confidential material data available.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                </details>
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </>
  );
}

    
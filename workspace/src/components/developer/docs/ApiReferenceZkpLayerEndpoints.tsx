
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

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
  error500
}: ApiReferenceZkpLayerEndpointsProps) {

  return (
    <>
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Submit Zero-Knowledge Proof for a DPP</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/zkp/submit-proof/&#123;dppId&#125;</code>
            </span>
            <br />
            [ZKP Layer - Highly Conceptual] Allows a prover (e.g., manufacturer, supplier) to submit a Zero-Knowledge Proof (ZKP) related to a specific DPP. This endpoint is a placeholder for a complex ZKP system interaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;dppId&#125;</code> (path, required): The unique identifier of the Digital Product Passport this proof relates to.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
            <p className="text-sm mb-1">A JSON object containing the claim type, proof data, and any public inputs.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request Body
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleZkpSubmitRequestBody}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 202 Accepted)</h4>
            <p className="text-sm mb-1">Returns a JSON object acknowledging the ZKP submission.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleZkpSubmitResponseBody}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body (e.g., missing claimType or proofData).
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400General}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: DPP with the given dppId not found.
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
          <CardTitle className="text-lg">Verify Claim with ZKP for a DPP</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/zkp/verify-claim/&#123;dppId&#125;?claimType=&#123;claimType&#125;</code>
            </span>
            <br />
            [ZKP Layer - Highly Conceptual] Allows a verifier to check if a specific claim for a DPP has a valid (mock) Zero-Knowledge Proof associated with it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;dppId&#125;</code> (path, required): The unique identifier of the Digital Product Passport.
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;claimType&#125;</code> (query, required): The type of claim to verify (e.g., "material_compliance_svhc_x", "ethical_sourcing_region_y").
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
            <p className="text-sm mb-1">Returns a JSON object indicating the verification status of the claim.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleZkpVerifyResponseBody}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid query parameters (e.g., missing claimType).
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400General}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: DPP or specified claim proof not found.
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

    
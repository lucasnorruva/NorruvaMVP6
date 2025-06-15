
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface ApiReferenceQrEndpointsProps {
  exampleQrValidationResponse: string;
  error400_qr: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ApiReferenceQrEndpoints({
  exampleQrValidationResponse,
  error400_qr,
  error401,
  error404,
  error500
}: ApiReferenceQrEndpointsProps) {

  return (
    <>
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Validate QR Code & Retrieve DPP Summary</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/qr/validate</code>
            </span>
            <br />
            Validates a unique identifier (typically from a QR code) and retrieves a summary of the product passport.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
            <p className="text-sm mb-1">A JSON object containing the unique identifier extracted from the QR code.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request Body
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{`{"qrIdentifier": "DPP001"}`}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
            <p className="text-sm mb-1">Returns a JSON object containing a summary of the product passport, including verification statuses and relevant URLs.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleQrValidationResponse}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body. 'qrIdentifier' is required.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_qr}</code></pre>
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
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: QR identifier invalid or product not found.
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

    
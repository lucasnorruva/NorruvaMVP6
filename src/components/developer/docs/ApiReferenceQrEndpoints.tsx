import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

interface QrEndpointsProps {
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
  error500,
}: QrEndpointsProps) {
  return (
    <section id="qr-endpoints" className="mt-8">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> QR Code & Validation
        Endpoints
      </h2>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">
            Validate QR Code & Retrieve DPP Summary
          </CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold"
              >
                POST
              </Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">
                /qr/validate
              </code>
            </span>
            <br />
            Validates a unique identifier (typically from a QR code) and
            retrieves a summary of the product passport.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
              <code>{`{\n  "qrIdentifier": "DPP001"\n}`}</code>
            </pre>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  qrIdentifier
                </code>{" "}
                (string, required): The unique identifier extracted from the QR
                code, often a product ID or a specific DPP instance ID.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">
              Example Response (Success 200 OK for DPP001)
            </h4>
            <p className="text-sm mb-1">
              Returns a product summary, its public DPP URL, verification
              status, and key compliance details.
            </p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Click to view example JSON response
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
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  400 Bad Request
                </code>
                : Invalid request body or missing{" "}
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  qrIdentifier
                </code>
                .
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                    Example JSON
                  </summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                    <code>{error400_qr}</code>
                  </pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  401 Unauthorized
                </code>
                .
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                    Example JSON
                  </summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                    <code>{error401}</code>
                  </pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  404 Not Found
                </code>
                : QR identifier invalid or product not found.
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                    Example JSON
                  </summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                    <code>{error404}</code>
                  </pre>
                </details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  500 Internal Server Error
                </code>
                .
                <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                    Example JSON
                  </summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                    <code>{error500}</code>
                  </pre>
                </details>
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </section>
  );
}

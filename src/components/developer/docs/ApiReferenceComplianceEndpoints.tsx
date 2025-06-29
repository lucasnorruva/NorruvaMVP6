import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

interface ComplianceEndpointsProps {
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
}: ComplianceEndpointsProps) {
  return (
    <section id="compliance-endpoints" className="mt-8">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> Compliance &
        Verification Endpoints
      </h2>
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Retrieve Compliance Summary</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge
                variant="outline"
                className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold"
              >
                GET
              </Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">
                /dpp/{"{productId}"}/compliance-summary
              </code>
            </span>
            <br />
            Fetches a summary of the compliance status for a specific product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  productId
                </code>{" "}
                (string, required): The unique identifier of the product.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">
              Example Response (Success 200 OK)
            </h4>
            <p className="text-sm mb-1">
              Returns a compliance summary object. See OpenAPI spec for full
              details.
            </p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{conceptualComplianceSummaryResponse}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  401 Unauthorized
                </code>
                . (Example in GET /dpp/{"{id}"})
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  404 Not Found
                </code>
                . (Example in GET /dpp/{"{id}"})
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  500 Internal Server Error
                </code>
                . (Example in GET /dpp/{"{id}"})
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Verify Digital Product Passport
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
                /dpp/verify/{"{productId}"}
              </code>
            </span>
            <br />
            Performs compliance and authenticity checks on a specific DPP
            (conceptual EBSI-linked verification).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  productId
                </code>{" "}
                (string, required): The unique identifier of the product to
                verify.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Request Body</h4>
            <p className="text-sm mb-1">
              This endpoint does not require a request body for the mock
              implementation.
            </p>
          </section>
          <section>
            <h4 className="font-semibold mb-1">
              Example Response (Success 200 OK)
            </h4>
            <p className="text-sm mb-1">
              Returns a verification result object.
            </p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{conceptualVerifyDppResponse}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  401 Unauthorized
                </code>
                . (Example in GET /dpp/{"{id}"})
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  404 Not Found
                </code>
                . (Example in GET /dpp/{"{id}"})
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  500 Internal Server Error
                </code>
                . (Example in GET /dpp/{"{id}"})
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </section>
  );
}

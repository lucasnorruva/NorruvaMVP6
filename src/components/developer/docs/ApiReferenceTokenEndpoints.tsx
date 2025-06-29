import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

interface TokenEndpointsProps {
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
}: TokenEndpointsProps) {
  return (
    <section id="token-endpoints" className="mt-8">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> DPP Token Endpoints
      </h2>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Mint DPP Token</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold"
              >
                POST
              </Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">
                /token/mint/{{ productId }}
              </code>
            </span>
            <br />
            Mints a blockchain token representing the specified product
            passport.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
              <code>{mintRequest}</code>
            </pre>
          </section>
          <section>
            <h4 className="font-semibold mb-1">
              Example Response (201 Created)
            </h4>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{mintResponse}</code>
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

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Update Token Metadata</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-700 border-yellow-300 mr-2 font-semibold"
              >
                PATCH
              </Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">
                /token/metadata/{{ tokenId }}
              </code>
            </span>
            <br />
            Updates the metadata URI stored on chain for a token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
              <code>{updateRequest}</code>
            </pre>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (200 OK)</h4>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{updateResponse}</code>
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
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  404 Not Found
                </code>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  500 Internal Server Error
                </code>
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Get Token On-Chain Status</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge
                variant="outline"
                className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold"
              >
                GET
              </Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">
                /token/status/{{ tokenId }}
              </code>
            </span>
            <br />
            Retrieves blockchain status information for a token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Example Response (200 OK)</h4>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{statusResponse}</code>
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
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  404 Not Found
                </code>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  500 Internal Server Error
                </code>
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </section>
  );
}

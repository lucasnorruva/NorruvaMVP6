import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

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
  return (
    <section id="token-endpoints">
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
                /api/v1/token/mint/{{ productId }}
              </code>
            </span>
            <br />
            Mints a blockchain token representing the specified product
            passport.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  {{ productId }}
                </code>{" "}
                (path, required): The unique identifier of the product.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
            <p className="text-sm mb-1">
              A JSON object containing the contract address and recipient
              address for the token.
            </p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Request Body
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{mintRequest}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1">
              Example Response (Success 201 Created)
            </h4>
            <p className="text-sm mb-1">
              Returns a JSON object containing the token ID, contract address,
              and transaction hash.
            </p>
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
                .
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
                /api/v1/token/metadata/{{ tokenId }}
              </code>
            </span>
            <br />
            Updates the metadata URI stored on chain for a token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  {{ tokenId }}
                </code>{" "}
                (path, required): The blockchain token ID.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
            <p className="text-sm mb-1">
              A JSON object containing the new metadata URI for the token.
            </p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Request Body
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{updateRequest}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1">
              Example Response (Success 200 OK)
            </h4>
            <p className="text-sm mb-1">
              Returns a JSON object containing the token ID, contract address,
              and transaction hash.
            </p>
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
                .
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
                /api/v1/token/status/&#123;tokenId&#125;
              </code>
            </span>
            <br />
            Retrieves on-chain information for a DPP token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  &#123;tokenId&#125;
                </code>{" "}
                (path, required): The blockchain token ID.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">
              Example Response (Success 200 OK)
            </h4>
            <p className="text-sm mb-1">
              Returns a JSON object containing on-chain status information for
              the DPP token.
            </p>
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
                .
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

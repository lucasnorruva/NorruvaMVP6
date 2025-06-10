import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface ListDigitalProductPassportsProps {
  exampleListDppsResponse: string;
  error401: string;
  error500: string;
}

export default function ListDigitalProductPassports({
  exampleListDppsResponse,
  error401,
  error500,
}: ListDigitalProductPassportsProps) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">
          List Digital Product Passports
        </CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge
              variant="outline"
              className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold"
            >
              GET
            </Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/dpp</code>
          </span>
          <br />
          Retrieves a list of Digital Product Passports, with optional
          filtering.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Query Parameters (Optional)</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                status
              </code>{" "}
              (string): Filter by DPP status (e.g., "draft", "published",
              "archived", "pending_review", "revoked", "flagged", "all").
              Defaults to "all".
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                category
              </code>{" "}
              (string): Filter by product category (e.g., "Electronics").
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                searchQuery
              </code>{" "}
              (string): Search term for product name, ID, GTIN, or manufacturer.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                blockchainAnchored
              </code>{" "}
              (string): Filter by blockchain anchoring status ("all",
              "anchored", "not_anchored"). Defaults to "all".
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                limit
              </code>{" "}
              (integer, conceptual): Number of items to return per page.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                offset
              </code>{" "}
              (integer, conceptual): Number of items to skip for pagination.
            </li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">
            Example Response (Success 200 OK)
          </h4>
          <p className="text-sm mb-1">
            Returns a list of DPP objects, applied filters, and total count.
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Response
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{exampleListDppsResponse}</code>
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
              : API key missing or invalid.
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
                500 Internal Server Error
              </code>
              : Server-side error.
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
  );
}

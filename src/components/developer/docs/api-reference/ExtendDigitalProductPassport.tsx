import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface ExtendDigitalProductPassportProps {
  conceptualPatchDppExtendRequestBody: string;
  conceptualPatchDppExtendResponseBody: string;
  error400_patch_dpp: string;
}

export default function ExtendDigitalProductPassport({
  conceptualPatchDppExtendRequestBody,
  conceptualPatchDppExtendResponseBody,
  error400_patch_dpp,
}: ExtendDigitalProductPassportProps) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Extend a Digital Product Passport
        </CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-700 border-orange-300 mr-2 font-semibold"
            >
              PATCH
            </Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">
              /dpp/extend/{"{productId}"}
            </code>
          </span>
          <br />
          Allows for extending a DPP by adding document references or other
          modular data.
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
              (string, required): The unique identifier of the DPP to extend.
            </li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
          <p className="text-sm mb-1">
            Example: Adding a document reference. See OpenAPI spec for other
            extendable modules (e.g., conceptual chainOfCustodyUpdate).
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Request Body (Add Document)
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{conceptualPatchDppExtendRequestBody}</code>
            </pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">
            Example Response (Success 200 OK)
          </h4>
          <p className="text-sm mb-1">
            Returns the complete, updated DPP object with the new data added.
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Response (Document Added)
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{conceptualPatchDppExtendResponseBody}</code>
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
              : Invalid input data (e.g., missing fields for documentReference).
              <details className="border rounded-md mt-1">
                <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                  Example JSON
                </summary>
                <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                  <code>{error400_patch_dpp}</code>
                </pre>
              </details>
            </li>
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
  );
}

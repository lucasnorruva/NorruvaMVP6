import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface UpdateDigitalProductPassportProps {
  conceptualUpdateDppRequestBody: string;
  conceptualUpdateDppResponseBody: string;
  error400_update_dpp: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function UpdateDigitalProductPassport({
  conceptualUpdateDppRequestBody,
  conceptualUpdateDppResponseBody,
  error400_update_dpp,
  error401,
  error404,
  error500,
}: UpdateDigitalProductPassportProps) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Update a Digital Product Passport
        </CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge
              variant="outline"
              className="bg-purple-100 text-purple-700 border-purple-300 mr-2 font-semibold"
            >
              PUT
            </Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">
              /dpp/{"{productId}"}
            </code>
          </span>
          <br />
          Updates an existing Digital Product Passport. You can send partial or
          full updates. Unspecified fields will remain unchanged.
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
              (string, required): The unique identifier of the DPP to update.
            </li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
          <p className="text-sm mb-1">
            Provide the fields you want to update. Refer to{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              UpdateDppRequestBody
            </code>{" "}
            schema in OpenAPI.
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Request Body (Partial Update)
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{conceptualUpdateDppRequestBody}</code>
            </pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">
            Example Response (Success 200 OK)
          </h4>
          <p className="text-sm mb-1">
            Returns the complete, updated DPP object.
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Response
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{conceptualUpdateDppResponseBody}</code>
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
              : Invalid input data (e.g., invalid field values).
              <details className="border rounded-md mt-1">
                <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                  Example JSON
                </summary>
                <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                  <code>{error400_update_dpp}</code>
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
              : DPP with the given ID does not exist.
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
  );
}

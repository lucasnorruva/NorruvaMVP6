// --- File: src/components/developer/docs/api-reference/BatchUpdateDpps.tsx ---
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

interface BatchUpdateDppsProps {
  error400: string;
  error401: string;
  error500: string;
}

export default function BatchUpdateDpps({
  error400,
  error401,
  error500,
}: BatchUpdateDppsProps) {
  const exampleRequestBody = JSON.stringify(
    {
      updates: [
        { id: "DPP001", metadata: { status: "archived" } },
        {
          id: "DPP002",
          compliance: {
            eprel: { status: "Registered", id: "EPREL_NEW_ID_002" },
          },
          productDetails: { energyLabel: "A+" },
        },
        { id: "DPP003", productName: "Updated Polymer Phone Case v2" },
      ],
    },
    null,
    2,
  );

  const exampleResponseBody = JSON.stringify(
    {
      message: "Batch update processed.",
      results: [
        { id: "DPP001", status: "success" },
        { id: "DPP002", status: "success" },
        { id: "DPP003", status: "success" },
      ],
      summary: {
        totalProcessed: 3,
        successfullyUpdated: 3,
        failedUpdates: 0,
      },
    },
    null,
    2,
  );

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Batch Update Digital Product Passports
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
              /api/v1/dpp/batch-update
            </code>
          </span>
          <br />
          Allows for updating multiple DPPs in a single request. This is a
          conceptual endpoint.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
          <p className="text-sm mb-1">
            An object containing an 'updates' array. Each item in the array
            specifies the 'id' of the DPP and the fields to update.
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Request Body
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{exampleRequestBody}</code>
            </pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">
            Example Response (Success 200 OK)
          </h4>
          <p className="text-sm mb-1">
            Returns a summary of the batch operation, including results for each
            DPP update attempt.
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Response
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{exampleResponseBody}</code>
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
              : Invalid request body or data within the batch items.
              <details className="border rounded-md mt-1">
                <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                  Example JSON
                </summary>
                <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                  <code>{error400}</code>
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

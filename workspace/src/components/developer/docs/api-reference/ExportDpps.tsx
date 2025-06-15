
// --- File: src/components/developer/docs/api-reference/ExportDpps.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

interface ExportDppsProps {
  error400: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ExportDpps({
  error400,
  error401,
  error404,
  error500,
}: ExportDppsProps) {
  const exampleJsonResponse = JSON.stringify([
    {
      id: "DPP001",
      productName: "EcoSmart Refrigerator X500",
      category: "Appliances",
      gtin: "01234567890123",
      metadata: { status: "published" }
    },
    {
      id: "DPP002",
      productName: "Sustainable Cotton T-Shirt",
      category: "Apparel",
      gtin: "09876543210987",
      metadata: { status: "draft" }
    }
  ], null, 2);

  const exampleCsvResponse = `"id","productName","category","gtin","metadata.status"\n"DPP001","EcoSmart Refrigerator X500","Appliances","01234567890123","published"\n"DPP002","Sustainable Cotton T-Shirt","Apparel","09876543210987","draft"`;

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Export Digital Product Passports</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/export</code>
          </span>
          <br />
          Allows for exporting DPP data in various formats. This is a conceptual endpoint.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Query Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">ids</code> (string, optional): Comma-separated list of product IDs to export (e.g., "DPP001,DPP002").</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">format</code> (string, optional, enum: "json", "csv", "xml", default: "json"): Desired export format.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">fields</code> (string, optional): Comma-separated list of specific fields to include (e.g., "id,productName,category").</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
          
          <p className="text-sm mb-1">Content-Type will vary based on the 'format' parameter. For <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">format=json</code>:</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response (<code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">application/json</code>)
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{exampleJsonResponse}</code>
            </pre>
          </details>

          <p className="text-sm mb-1 mt-3">For <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">format=csv</code>:</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example CSV Response (<code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">text/csv</code>)
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{exampleCsvResponse}</code>
            </pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid parameters (e.g., unsupported format).
              <details className="border rounded-md mt-1">
                  <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                  <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400}</code></pre>
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
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: No products found matching criteria or specified IDs.
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
  );
}

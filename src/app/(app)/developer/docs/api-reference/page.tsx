
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Server, FileJson, KeyRound, Info, BookText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MOCK_DPPS } from "@/types/dpp"; // Import for example response

export default function ApiReferencePage() {
  const exampleDppResponse = JSON.stringify(MOCK_DPPS[0], null, 2); // Using the first mock DPP as an example

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BookText className="mr-3 h-7 w-7 text-primary" />
          API Reference (Conceptual)
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer">Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual Documentation</AlertTitle>
        <AlertDescription>
          This API reference is conceptual and outlines how API endpoints for the Norruva DPP platform might be structured. Actual implementation details may vary.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>
            The Norruva DPP API provides programmatic access to Digital Product Passport data. All API access is over HTTPS and uses standard HTTP features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Base URL:</strong> <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">/api/v1</code>
          </p>
          <p>
            All API responses are in JSON format.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/>Authentication</CardTitle>
          <CardDescription>
            API requests are authenticated using API Keys. Refer to the <Link href="/developer/docs/authentication" className="text-primary hover:underline">Authentication Guide</Link> for details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Include your API key in the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">Authorization</code> header as a Bearer token:
          </p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
            <code>
              Authorization: Bearer YOUR_API_KEY
            </code>
          </pre>
        </CardContent>
      </Card>

      <section id="dpp-endpoints">
        <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
          <Server className="mr-3 h-6 w-6 text-primary" /> Digital Product Passport (DPP) Endpoints
        </h2>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Retrieve a Digital Product Passport</CardTitle>
            <CardDescription>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm mr-1">GET /dpp/{'{productId}'}</code>
              Fetches the complete Digital Product Passport for a specific product.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h4 className="font-semibold mb-1">Path Parameters</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold mb-1">Example Response (Success 200)</h4>
              <p className="text-sm mb-1">Returns a DPP object based on the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">DigitalProductPassport</code> type definition.</p>
              <details className="border rounded-md">
                <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                  Click to view example JSON response
                </summary>
                <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                  <code>
                    {exampleDppResponse}
                  </code>
                </pre>
              </details>
            </section>
             <section>
              <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                    <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>: API key missing or invalid.</li>
                    <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: Product with the given ID does not exist.</li>
                    <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>: Server-side error.</li>
                </ul>
            </section>
          </CardContent>
        </Card>
        
        {/* Add more conceptual endpoints here as needed */}
        {/* Example:
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-lg">List Products</CardTitle>
            <CardDescription>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm mr-1">GET /products</code>
              Retrieves a paginated list of products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Further details (query parameters, pagination, example response) would be documented here.</p>
          </CardContent>
        </Card>
        */}
      </section>
    </div>
  );
}

    

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge"; 
import { Server, FileJson, KeyRound, Info, BookText, ArrowLeft } from "lucide-react"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MOCK_DPPS } from "@/types/dpp"; 
import { cn } from "@/lib/utils";

export default function ApiReferencePage() {
  const exampleDppResponse = JSON.stringify(MOCK_DPPS[0], null, 2); 

  const qrValidationResponseExample = {
    productId: MOCK_DPPS[0].id,
    productName: MOCK_DPPS[0].productName,
    category: MOCK_DPPS[0].category,
    manufacturer: MOCK_DPPS[0].manufacturer?.name || "N/A",
    verificationStatus: "valid_dpp_found", // Example status
    dppUrl: `/passport/${MOCK_DPPS[0].id}`, 
    ebsiCompliance: {
      status: MOCK_DPPS[0].ebsiVerification?.status || "unknown",
      verificationId: MOCK_DPPS[0].ebsiVerification?.verificationId
    },
    blockchainAnchor: {
      transactionHash: MOCK_DPPS[0].blockchainIdentifiers?.anchorTransactionHash,
      platform: MOCK_DPPS[0].blockchainIdentifiers?.platform
    }
  };
  const exampleQrValidationResponse = JSON.stringify(qrValidationResponseExample, null, 2);

  const error401 = JSON.stringify({ error: { code: 401, message: "API key missing or invalid." } }, null, 2);
  const error404 = JSON.stringify({ error: { code: 404, message: "Resource not found." } }, null, 2);
  const error400_qr = JSON.stringify({ error: { code: 400, message: "Invalid request body. 'qrIdentifier' is required." } }, null, 2);
  const error500 = JSON.stringify({ error: { code: 500, message: "An unexpected error occurred on the server." } }, null, 2);

  const conceptualCreateDppRequestBody = JSON.stringify({
    productName: "Sustainable Smart Watch Series 5",
    category: "Wearable Technology",
    gtin: "09876543210123",
    manufacturerName: "FutureGadgets Inc.",
    modelNumber: "SW-S5-ECO",
    productDetails: {
      description: "The latest smart watch with a focus on sustainability, featuring a recycled aluminum case and energy-efficient display.",
      materials: [
        { name: "Recycled Aluminum (Case)", percentage: 80, isRecycled: true },
        { name: "Organic Polymer (Strap)", percentage: 20 }
      ],
      energyLabel: "A",
      customAttributes: [
        { "key": "Display Type", "value": "AMOLED" },
        { "key": "OS", "value": "WearOS" }
      ]
    }
  }, null, 2);

  const conceptualCreateDppResponseBody = JSON.stringify({
    // ...MOCK_DPPS[0], // Use a base structure, but specific fields will be overridden for clarity
    id: "DPP_API_12345", // Newly generated ID
    version: 1,
    productName: "Sustainable Smart Watch Series 5",
    category: "Wearable Technology",
    gtin: "09876543210123",
    manufacturer: { name: "FutureGadgets Inc." },
    modelNumber: "SW-S5-ECO",
    metadata: {
      created_at: new Date().toISOString(), // Current timestamp
      last_updated: new Date().toISOString(),
      status: "draft", // Initial status
      dppStandardVersion: MOCK_DPPS[0]?.metadata?.dppStandardVersion || "CIRPASS v1.0 Draft"
    },
    productDetails: {
      description: "The latest smart watch with a focus on sustainability, featuring a recycled aluminum case and energy-efficient display.",
      materials: [
        { name: "Recycled Aluminum (Case)", percentage: 80, isRecycled: true },
        { name: "Organic Polymer (Strap)", percentage: 20 }
      ],
      energyLabel: "A",
      imageUrl: "https://placehold.co/600x400.png", 
      imageHint: "smart watch wearable",
      customAttributes: [
        { "key": "Display Type", "value": "AMOLED" },
        { "key": "OS", "value": "WearOS" }
      ]
    },
    compliance: { battery_regulation: { status: "not_applicable", lastChecked: new Date().toISOString() } }, 
    ebsiVerification: { status: "pending_verification", lastChecked: new Date().toISOString() },
    lifecycleEvents: [],
    certifications: [],
    supplyChainLinks: []
  }, null, 2);

  const conceptualUpdateDppRequestBody = JSON.stringify({
    productDetails: {
      description: "The latest smart watch with a focus on sustainability, featuring a recycled aluminum case, energy-efficient display, and enhanced battery life.",
      sustainabilityClaims: [
        { claim: "Made with 80% recycled aluminum", verificationDetails: "Verified by GreenCert" }
      ],
      customAttributes: [
        { "key": "Display Type", "value": "AMOLED" },
        { "key": "OS", "value": "WearOS Pro" },
        { "key": "Water Resistance", "value": "5 ATM" }
      ]
    },
    metadata: {
      status: "pending_review"
    }
  }, null, 2);
  
  const conceptualUpdateDppResponseBody = JSON.stringify({
    ...(MOCK_DPPS[0] || {}), // Assume it's an update to PROD001 for example
    id: MOCK_DPPS[0]?.id || "DPP001_MOCK",
    productName: MOCK_DPPS[0]?.productName || "EcoSmart Refrigerator X500", // Keep original if not updated
    productDetails: {
        ...(MOCK_DPPS[0]?.productDetails || {}),
        description: "The latest smart watch with a focus on sustainability, featuring a recycled aluminum case, energy-efficient display, and enhanced battery life.", // Description updated
        sustainabilityClaims: [ // Sustainability claims updated
          { claim: "Made with 80% recycled aluminum", verificationDetails: "Verified by GreenCert" }
        ],
        customAttributes: [ // Custom attributes updated
            { "key": "Display Type", "value": "AMOLED" },
            { "key": "OS", "value": "WearOS Pro" },
            { "key": "Water Resistance", "value": "5 ATM" }
        ]
    },
    metadata: {
        ...(MOCK_DPPS[0]?.metadata || {}),
        status: "pending_review", // Status updated
        last_updated: new Date().toISOString() // Last updated timestamp refreshed
    }
  }, null, 2);


  const error400_create_dpp = JSON.stringify({
    error: {
      code: 400,
      message: "Invalid request body. 'productName' and 'category' are required for creation.",
      details: [
        { field: "productName", issue: "cannot be empty" },
        { field: "category", issue: "cannot be empty" }
      ]
    }
  }, null, 2);

  const error400_update_dpp = JSON.stringify({
    error: {
      code: 400,
      message: "Invalid request body for update. Field 'metadata.status' has an invalid value 'incorrect_status'.",
      details: [
         { field: "metadata.status", issue: "value must be one of: draft, published, archived, pending_review, revoked" }
      ]
    }
  }, null, 2);

  const conceptualDeleteDppResponseBody = JSON.stringify({
    message: "Product with ID DPP001 has been archived successfully.",
    status: "Archived"
  }, null, 2);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BookText className="mr-3 h-7 w-7 text-primary" />
          API Reference (Conceptual)
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer"><ArrowLeft className="mr-2 h-4 w-4" />Back to Developer Portal</Link>
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
              <span className="inline-flex items-center font-mono text-sm">
                <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
                <code className="bg-muted px-1 py-0.5 rounded-sm">/dpp/{'{productId}'}</code>
              </span>
              <br/>
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
              <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
              <p className="text-sm mb-1">Returns a DPP object based on the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">DigitalProductPassport</code> type definition.</p>
              <details className="border rounded-md">
                <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                  <FileJson className="inline h-4 w-4 mr-1 align-middle"/>Click to view example JSON response for DPP001
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
                <ul className="list-disc list-inside text-sm space-y-2">
                    <li>
                        <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>: API key missing or invalid.
                        <details className="border rounded-md mt-1">
                            <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                            <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                        </details>
                    </li>
                    <li>
                        <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: Product with the given ID does not exist.
                         <details className="border rounded-md mt-1">
                            <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                            <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                        </details>
                    </li>
                    <li>
                        <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>: Server-side error.
                        <details className="border rounded-md mt-1">
                            <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                            <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                        </details>
                    </li>
                </ul>
            </section>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Validate QR Code & Retrieve DPP Summary</CardTitle>
            <CardDescription>
              <span className="inline-flex items-center font-mono text-sm">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge> 
                <code className="bg-muted px-1 py-0.5 rounded-sm">/qr/validate</code>
              </span>
              <br/>
              Validates a unique identifier (typically from a QR code) and retrieves a summary of the product passport.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
                <code>
                  {`{
  "qrIdentifier": "DPP001"
}`}
                </code>
              </pre>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">qrIdentifier</code> (string, required): The unique identifier extracted from the QR code, often a product ID or a specific DPP instance ID.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold mb-1">Example Response (Success 200 OK for DPP001)</h4>
              <p className="text-sm mb-1">Returns a product summary, its public DPP URL, verification status, and key compliance details.</p>
              <details className="border rounded-md">
                <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                  <FileJson className="inline h-4 w-4 mr-1 align-middle"/>Click to view example JSON response
                </summary>
                <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                  <code>
                    {exampleQrValidationResponse}
                  </code>
                </pre>
              </details>
            </section>
             <section>
              <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                     <li>
                        <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body or missing <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">qrIdentifier</code>.
                        <details className="border rounded-md mt-1">
                            <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                            <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_qr}</code></pre>
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
                        <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: QR identifier invalid or product not found.
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

        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Create a Digital Product Passport</CardTitle>
            <CardDescription>
              <span className="inline-flex items-center font-mono text-sm">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
                <code className="bg-muted px-1 py-0.5 rounded-sm">/dpp</code>
              </span>
              <br/>
              Creates a new Digital Product Passport with the provided initial data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
              <p className="text-sm mb-1">Provide initial product information. Required fields typically include <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productName</code> and <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">category</code>.</p>
              <details className="border rounded-md">
                <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                  <FileJson className="inline h-4 w-4 mr-1 align-middle"/>Example JSON Request Body
                </summary>
                <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                  <code>{conceptualCreateDppRequestBody}</code>
                </pre>
              </details>
            </section>
            <section>
              <h4 className="font-semibold mb-1">Example Response (Success 201 Created)</h4>
              <p className="text-sm mb-1">Returns the newly created DPP object, including its server-generated ID and default metadata.</p>
              <details className="border rounded-md">
                <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                  <FileJson className="inline h-4 w-4 mr-1 align-middle"/>Example JSON Response
                </summary>
                <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                  <code>{conceptualCreateDppResponseBody}</code>
                </pre>
              </details>
            </section>
            <section>
              <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid input data (e.g., missing required fields).
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_create_dpp}</code></pre>
                  </details>
                </li>
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                  </details>
                </li>
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                  </details>
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Update a Digital Product Passport</CardTitle>
            <CardDescription>
              <span className="inline-flex items-center font-mono text-sm">
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 mr-2 font-semibold">PUT</Badge>
                <code className="bg-muted px-1 py-0.5 rounded-sm">/dpp/{'{productId}'}</code>
              </span>
              <br/>
              Updates an existing Digital Product Passport. You can send partial or full updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <section>
              <h4 className="font-semibold mb-1">Path Parameters</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the DPP to update.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
              <p className="text-sm mb-1">Provide the fields you want to update. Unspecified fields will remain unchanged.</p>
              <details className="border rounded-md">
                <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                  <FileJson className="inline h-4 w-4 mr-1 align-middle"/>Example JSON Request Body (Partial Update)
                </summary>
                <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                  <code>{conceptualUpdateDppRequestBody}</code>
                </pre>
              </details>
            </section>
            <section>
              <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
              <p className="text-sm mb-1">Returns the complete, updated DPP object.</p>
              <details className="border rounded-md">
                <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                  <FileJson className="inline h-4 w-4 mr-1 align-middle"/>Example JSON Response
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
                  <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid input data (e.g., invalid field values).
                   <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_update_dpp}</code></pre>
                  </details>
                </li>
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                  </details>
                </li>
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: DPP with the given ID does not exist.
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                  </details>
                </li>
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                  </details>
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Archive a Digital Product Passport</CardTitle>
            <CardDescription>
              <span className="inline-flex items-center font-mono text-sm">
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 mr-2 font-semibold">DELETE</Badge>
                <code className="bg-muted px-1 py-0.5 rounded-sm">/dpp/{'{productId}'}</code>
              </span>
              <br/>
              Archives an existing Digital Product Passport by setting its status to 'archived'.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h4 className="font-semibold mb-1">Path Parameters</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the DPP to archive.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
               <details className="border rounded-md">
                <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                  <FileJson className="inline h-4 w-4 mr-1 align-middle"/>Example JSON Response
                </summary>
                <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                  <code>{conceptualDeleteDppResponseBody}</code>
                </pre>
              </details>
            </section>
            <section>
              <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                  </details>
                </li>
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>: DPP with the given ID does not exist.
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                  </details>
                </li>
                <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                  <details className="border rounded-md mt-1">
                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                  </details>
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>
        
      </section>
    </div>
  );
}
    
    
    

    

    


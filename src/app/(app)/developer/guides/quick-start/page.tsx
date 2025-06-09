
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, KeyRound, Send, Package, Info, Terminal, FileJson, ChevronRightCircle, Workflow } from "lucide-react";
import Link from "next/link";
import DocsPageLayout from '@/components/developer/DocsPageLayout'; // Import the layout

export default function QuickStartGuidePage() {
  const curlExample = `
curl -X GET \\
  'http://localhost:9002/api/v1/dpp/DPP001' \\ # Using DPP001 which exists in MOCK_DPPS
  -H 'Authorization: Bearer YOUR_SANDBOX_API_KEY'
  `;

  return (
    <DocsPageLayout
      pageTitle="Quick Start Guide"
      pageIcon={Rocket}
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Welcome Developer!"
      alertDescription="This guide will walk you through the essential steps to start understanding and conceptually integrating with the Norruva Digital Product Passport (DPP) API."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>1. Understanding the Basics</CardTitle>
          <CardDescription>
            The Norruva DPP platform enables the creation, management, and verification of Digital Product Passports. These passports provide comprehensive, verifiable information about a product's lifecycle, sustainability, and compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Our API is designed to be RESTful, uses standard HTTP features (GET, POST, PUT, DELETE), and all API responses are in JSON format.
          </p>
          <p className="text-sm text-muted-foreground">
            For development and testing, you'll primarily use the <strong>Sandbox Environment</strong>. This allows you to experiment with mock data and API calls without affecting any live data or incurring actual costs. The Developer Portal allows you to switch between Sandbox and (conceptual) Production environments.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-green-600"/>2. Setting Up: Obtaining API Keys</CardTitle>
          <CardDescription>
            To interact with the Norruva API, you'll need an API key for authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            1. Navigate to the <Link href="/developer#api_keys" className="text-primary hover:underline font-medium">API Keys tab</Link> in the Developer Portal.
          </p>
          <p className="text-sm">
            2. For testing and development, click the "Generate New Sandbox Key" button. A mock Sandbox API key will be generated and displayed in the table.
          </p>
          <p className="text-sm">
            3. Copy your API key using the copy icon and store it securely. You'll use this key in the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">Authorization</code> header for your API requests.
          </p>
          <p className="text-sm font-medium mt-2">Example Authorization Header:</p>
          <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
            <code>
              Authorization: Bearer YOUR_SANDBOX_API_KEY
            </code>
          </pre>
          <p className="text-sm text-muted-foreground">
            Replace <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">YOUR_SANDBOX_API_KEY</code> with the actual Sandbox key from the API Keys tab. For more detailed information on authentication, refer to our <Link href="/developer/docs/authentication" className="text-primary hover:underline">Authentication Guide</Link>.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>3. Key Concepts</CardTitle>
          <CardDescription>Understand these fundamental concepts before diving deeper.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div>
                <h4 className="font-semibold text-foreground mb-1 flex items-center"><FileJson className="mr-1.5 h-4 w-4 text-accent"/>Digital Product Passport (DPP) Structure</h4>
                <p className="text-muted-foreground">A DPP is a structured JSON object containing various details about a product. Key sections typically include product identifiers, manufacturer information, materials, sustainability claims, compliance data, lifecycle events, and more. Refer to the <Link href="/developer/docs/api-reference" className="text-primary hover:underline">API Reference</Link> for schema details.</p>
            </div>
            <div>
                <h4 className="font-semibold text-foreground mb-1 flex items-center"><Terminal className="mr-1.5 h-4 w-4 text-accent"/>API Endpoints</h4>
                <p className="text-muted-foreground">Our API provides endpoints for CRUD operations on DPPs (Create, Read, Update, Archive), QR code validation, and more. Common base path: <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">/api/v1/</code>.</p>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-1 flex items-center"><Workflow className="mr-1.5 h-4 w-4 text-accent"/>Environments: Sandbox & Production (Conceptual)</h4>
                <p className="text-muted-foreground">
                    <strong>Sandbox:</strong> For testing and development. Uses mock data, no real-world impact. API keys are prefixed (e.g., <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">sand_sk_...</code>).
                    <br/>
                    <strong>Production:</strong> For live applications. Interacts with real data. API keys would be different (e.g., <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">prod_sk_...</code>). (Conceptual for this demo)
                </p>
            </div>
        </CardContent>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Send className="mr-2 h-5 w-5 text-blue-600"/>4. Making Your First API Call</CardTitle>
          <CardDescription>
            Let's try retrieving a mock Digital Product Passport using a cURL command or the API Playground.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            You can use a tool like cURL, Postman, or integrate directly into your application code. Remember to replace <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">YOUR_SANDBOX_API_KEY</code> with the key you generated.
          </p>
          <p className="text-sm font-medium">Example cURL Request (GET DPP):</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code className="text-pink-600 dark:text-pink-400">
              {curlExample}
            </code>
          </pre>
          <p className="text-sm">
            A successful request will return a JSON object containing the DPP data for product <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">DPP001</code>.
          </p>
          <div className="pt-3 border-t">
             <p className="text-sm font-medium mb-2">Recommended: Use the API Playground</p>
             <p className="text-sm text-muted-foreground">
              For an easier, no-code way to make test calls, navigate to the <Link href="/developer#playground" className="text-primary hover:underline font-medium">Interactive API Playground tab</Link> in the Developer Portal. You can select endpoints, fill parameters, and see live mock responses.
            </p>
          </div>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ChevronRightCircle className="mr-2 h-5 w-5 text-purple-600"/>5. Next Steps</CardTitle>
          <CardDescription>
            Continue exploring the Developer Portal for more resources to build robust integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
            <li>Dive deeper into the <Link href="/developer/docs/api-reference" className="text-primary hover:underline font-medium">API Reference</Link> for detailed information on all endpoints and data schemas.</li>
            <li>Learn about real-time event notifications with our <Link href="/developer/docs/webhooks-guide" className="text-primary hover:underline font-medium">Webhooks Guide</Link>.</li>
            <li>Understand how to test your integration and validate DPP data using the <Link href="/developer/docs/testing-validation" className="text-primary hover:underline font-medium">Testing & Validation Guide</Link>.</li>
            <li>Explore <Link href="/developer#resources" className="text-primary hover:underline font-medium">SDKs and Code Samples</Link> (conceptual, under the "Resources" tab) to accelerate your integration.</li>
            <li>Check out the <Link href="/developer#resources" className="text-primary hover:underline font-medium">Tutorials</Link> (conceptual, under the "Resources" tab) for common use cases.</li>
            <li>Review <Link href="/developer/docs/rate-limiting" className="text-primary hover:underline font-medium">API Rate Limiting</Link> and <Link href="/developer/docs/error-codes" className="text-primary hover:underline font-medium">Error Handling</Link> best practices.</li>
          </ul>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}



"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, KeyRound, Send, BookOpen, Info, ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function QuickStartGuidePage() {
  const curlExample = `
curl -X GET \\
  'http://localhost:9002/api/v1/dpp/DPP001' \\ # Using DPP001 which exists in MOCK_DPPS
  -H 'Authorization: Bearer YOUR_SANDBOX_API_KEY'
  `;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Rocket className="mr-3 h-7 w-7 text-primary" />
          Quick Start Guide
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer"><ArrowLeft className="mr-2 h-4 w-4" />Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Welcome Developer!</AlertTitle>
        <AlertDescription>
          This guide will walk you through the essential steps to start integrating with the Norruva Digital Product Passport (DPP) API.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>1. Understanding the Basics</CardTitle>
          <CardDescription>
            The Norruva DPP platform enables the creation, management, and verification of Digital Product Passports. These passports provide comprehensive, verifiable information about a product's lifecycle, sustainability, and compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Our API is designed to be RESTful and uses standard HTTP features. All responses are in JSON format.
          </p>
          <p className="text-sm text-muted-foreground">
            For development and testing, you'll primarily use the <strong>Sandbox Environment</strong>. This allows you to experiment without affecting live data.
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
          <p>
            1. Navigate to the <Link href="/developer#api-keys" className="text-primary hover:underline">API Keys section</Link> in the Developer Portal (select the "API Keys" tab).
          </p>
          <p>
            2. For testing and development, generate a <strong>Sandbox API Key</strong> by clicking "Generate New Sandbox Key".
          </p>
          <p>
            3. Copy your API key and store it securely. You'll use this key in the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">Authorization</code> header for your API requests.
          </p>
          <p className="text-sm">
            Example Authorization Header:
          </p>
          <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
            <code>
              Authorization: Bearer YOUR_SANDBOX_API_KEY
            </code>
          </pre>
          <p className="text-sm text-muted-foreground">
            For more detailed information on authentication, refer to our <Link href="/developer/docs/authentication" className="text-primary hover:underline">Authentication Guide</Link>.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Send className="mr-2 h-5 w-5 text-blue-600"/>3. Making Your First API Call (Conceptual)</CardTitle>
          <CardDescription>
            Let's try retrieving a mock Digital Product Passport using a cURL command.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You can use a tool like cURL or Postman, or integrate directly into your application code. Replace <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">YOUR_SANDBOX_API_KEY</code> with the key you generated.
          </p>
          <p className="text-sm font-medium">Example cURL Request:</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code className="text-pink-600 dark:text-pink-400">
              {curlExample}
            </code>
          </pre>
          <p>
            A successful request will return a JSON object containing the DPP data for product <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">DPP001</code>.
          </p>
          <p className="text-sm text-muted-foreground">
            You can also use the <Link href="/developer#playground" className="text-primary hover:underline">Interactive API Playground</Link> on the Developer Portal (select the "Playground" tab) to send test requests without writing code.
          </p>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-purple-600"/>4. Exploring Further</CardTitle>
          <CardDescription>
            Continue exploring the Developer Portal for more resources to build robust integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="list-disc list-inside text-sm space-y-1.5">
            <li>Dive deeper into the <Link href="/developer/docs/api-reference" className="text-primary hover:underline">API Reference</Link> for detailed information on all endpoints and data schemas.</li>
            <li>Learn about real-time event notifications with our <Link href="/developer/docs/webhooks-guide" className="text-primary hover:underline">Webhooks Guide</Link>.</li>
            <li>Understand how to test your integration and validate DPP data using the <Link href="/developer/docs/testing-validation" className="text-primary hover:underline">Testing & Validation Guide</Link>.</li>
            <li>Explore <Link href="/developer#resources" className="text-primary hover:underline">SDKs and Code Samples</Link> (when available under the "Resources" tab) to accelerate your integration.</li>
            <li>Check out the <Link href="/developer#resources" className="text-primary hover:underline">Tutorials</Link> (under the "Resources" tab) for common use cases.</li>
            <li>Review <Link href="/developer/docs/rate-limiting" className="text-primary hover:underline">API Rate Limiting</Link> and <Link href="/developer/docs/error-codes" className="text-primary hover:underline">Error Handling</Link> best practices.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

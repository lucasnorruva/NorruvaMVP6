
// --- File: page.tsx (Conceptual JavaScript SDK Guide) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileCode, Info, Download, Terminal, Settings, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function JavaScriptSdkPage() {
  const installationCommand = "npm install @norruva/dpp-sdk";
  const initializationCode = `
import { NorruvaSDK } from '@norruva/dpp-sdk';

// Initialize with your Sandbox or Production API Key
const norruva = new NorruvaSDK({ 
  apiKey: 'YOUR_API_KEY',
  environment: 'sandbox' // or 'production'
});
  `;
  const fetchDppCode = `
async function getProductPassport(productId) {
  try {
    const dpp = await norruva.dpps.get(productId);
    console.log("Fetched DPP:", dpp);
    return dpp;
  } catch (error) {
    console.error("Error fetching DPP:", error);
    throw error;
  }
}

// Example usage:
// getProductPassport('DPP001');
  `;
  const createDppCode = `
async function createNewDpp(productData) {
  try {
    const newDpp = await norruva.dpps.create(productData);
    console.log("Created DPP:", newDpp);
    return newDpp;
  } catch (error) {
    console.error("Error creating DPP:", error);
    throw error;
  }
}

// Example usage:
/*
createNewDpp({
  productName: "My New Smart Device",
  category: "Electronics",
  manufacturerName: "My Company LLC",
  // ... other required fields
});
*/
  `;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <FileCode className="mr-3 h-7 w-7 text-primary" />
          JavaScript SDK (Conceptual)
        </h1>
        <Button variant="outline" asChild>
          <Link href="/developer#resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Developer Resources
          </Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conceptual SDK Documentation</AlertTitle>
        <AlertDescription>
          This page describes a conceptual JavaScript SDK for interacting with the Norruva DPP API. The SDK <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">@norruva/dpp-sdk</code> is not yet published. All examples are for illustrative purposes.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>
            The Norruva JavaScript SDK provides a convenient way to integrate your Node.js or browser-based applications with the Norruva Digital Product Passport API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            It simplifies authentication, request formation, and response handling, allowing you to focus on building your application's features.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Download className="mr-2 h-5 w-5 text-primary"/>Installation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Install the SDK using npm or yarn:</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code className="text-pink-600 dark:text-pink-400">{installationCommand}</code>
          </pre>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5 text-primary"/>Initialization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Import the SDK and initialize it with your API key and environment (sandbox or production):</p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code className="language-javascript">{initializationCode}</code>
          </pre>
          <p className="text-sm text-muted-foreground">
            You can obtain your API keys from the <Link href="/developer#api_keys" className="text-primary hover:underline">API Keys section</Link> of the Developer Portal.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Workflow className="mr-2 h-5 w-5 text-primary"/>Example Usage</CardTitle>
          <CardDescription>Conceptual examples of common operations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h4 className="font-semibold text-md mb-1">Fetching a Digital Product Passport</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
              <code className="language-javascript">{fetchDppCode}</code>
            </pre>
          </section>
          <section>
            <h4 className="font-semibold text-md mb-1">Creating a New Digital Product Passport</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
              <code className="language-javascript">{createDppCode}</code>
            </pre>
            <p className="text-sm text-muted-foreground mt-1">
              Refer to the <Link href="/developer/docs/api-reference" className="text-primary hover:underline">API Reference</Link> for the full list of required and optional fields for creating a DPP.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Further Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Once published, the full SDK documentation, including all available methods, parameters, and error handling, would be available on our GitHub repository (conceptual link).
          </p>
          <Button variant="link" className="p-0 h-auto mt-2" disabled>
            View SDK on GitHub (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

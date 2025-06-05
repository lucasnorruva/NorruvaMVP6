
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, KeyRound, Send, BookOpen, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function QuickStartGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Rocket className="mr-3 h-7 w-7 text-primary" />
          Quick Start Guide
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer">Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Work in Progress</AlertTitle>
        <AlertDescription>
          This guide is currently a placeholder. Detailed information and code examples will be added soon.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction to Norruva DPP API</CardTitle>
          <CardDescription>
            Welcome to the Norruva Digital Product Passport (DPP) platform! Our API empowers you to create, manage, and access DPPs in compliance with EU regulations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This guide will walk you through the essential steps to get started with our API, including setting up your environment, authenticating your requests, and making your first API call.
          </p>
          <p>
            DPPs are crucial for product transparency, sustainability, and regulatory compliance. Our platform aims to simplify this process for developers.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-green-600"/>1. Setting Up: Obtaining API Keys</CardTitle>
          <CardDescription>
            To interact with the Norruva API, you'll need an API key for authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            1. Navigate to the <Link href="/developer#api-keys" className="text-primary hover:underline">API Keys section</Link> in the Developer Portal.
          </p>
          <p>
            2. For testing and development, you can generate a <strong>Sandbox API Key</strong>. Click on "Generate New Sandbox Key (Mock)".
          </p>
          <p>
            3. Once generated, copy your API key and store it securely. You'll use this key in the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">Authorization</code> header for your API requests.
          </p>
          <p className="text-sm text-muted-foreground">
            For more detailed information on authentication, refer to our <Link href="/developer/docs/authentication" className="text-primary hover:underline">Authentication Guide</Link>.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Send className="mr-2 h-5 w-5 text-blue-600"/>2. Making Your First API Call</CardTitle>
          <CardDescription>
            Let's use the Interactive API Playground to make a sample request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            1. Go to the <Link href="/developer#api-playground" className="text-primary hover:underline">Interactive API Playground</Link> on the Developer Portal.
          </p>
          <p>
            2. Find the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">GET /api/v1/products/{'{productId}'}</code> endpoint.
          </p>
          <p>
            3. Enter a sample Product ID, for example, <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">PROD001</code>, into the "Product ID" input field.
          </p>
          <p>
            4. Click the "Send Request" button.
          </p>
          <p>
            You should see a mock JSON response in the "Mock Response" section, simulating the data for that product.
          </p>
          <p className="text-sm text-muted-foreground">
            In a real application, you would construct this HTTP request in your code using your preferred programming language and HTTP client, including your API key in the <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">Authorization: Bearer YOUR_API_KEY</code> header.
          </p>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-purple-600"/>Next Steps</CardTitle>
          <CardDescription>
            Continue exploring the Developer Portal for more resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside text-sm">
            <li>Dive deeper into the <Link href="/developer#api-docs" className="text-primary hover:underline">API Documentation</Link> for detailed information on all endpoints.</li>
            <li>Explore <Link href="/developer#developer-resources" className="text-primary hover:underline">SDKs and Code Samples</Link> (when available) to accelerate your integration.</li>
            <li>Check out the <Link href="/developer#tutorials" className="text-primary hover:underline">Tutorials</Link> for common use cases.</li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}

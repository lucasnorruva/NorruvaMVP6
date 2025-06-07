
// --- File: page.tsx (Rate Limiting Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RateLimitingPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Clock className="mr-3 h-7 w-7 text-primary" />
          API Rate Limiting & Usage
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer">Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Content Coming Soon</AlertTitle>
        <AlertDescription>
          This page will provide detailed information about API rate limits, usage quotas, and best practices for handling them.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Understanding Rate Limits</CardTitle>
          <CardDescription>
            To ensure fair usage and stability of the Norruva DPP API, rate limits are applied to API requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This section will cover:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Default rate limits for different API key types (Sandbox, Production).</li>
            <li>How to check your current usage and remaining quota via API headers or a dedicated endpoint.</li>
            <li>Strategies for handling rate limit errors (e.g., exponential backoff).</li>
            <li>Information on requesting higher rate limits for specific use cases.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Detailed specifications and examples will be provided here shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

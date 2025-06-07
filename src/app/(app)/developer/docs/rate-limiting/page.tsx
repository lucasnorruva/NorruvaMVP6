
// --- File: page.tsx (Rate Limiting Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RateLimitingPage() {
  const http429Response = `{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "httpStatus": 429,
    "message": "Too many requests. Please try again after some time. Limit: 100 requests per minute.",
    "retryAfterSeconds": 60 
  }
}`;

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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Understanding Rate Limits</CardTitle>
          <CardDescription>
            To ensure fair usage, stability, and security of the Norruva DPP API, rate limits are applied to API requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Rate limiting helps prevent abuse and ensures that the API remains responsive for all users. Exceeding these limits will result in a <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">429 Too Many Requests</code> error response.
          </p>
          
          <section>
            <h3 className="font-semibold text-lg mb-2">Conceptual Rate Limits</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The following are example rate limits and may vary based on your API key type and subscription plan. Always check the API response headers for specific rate limit information.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Sandbox Keys:</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>10 requests per second</li>
                  <li>100 requests per minute</li>
                </ul>
              </li>
              <li>
                <strong>Production Keys (Standard Tier):</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>50 requests per second</li>
                  <li>1000 requests per minute</li>
                </ul>
              </li>
              <li>
                <strong>Production Keys (Enterprise Tier):</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>Custom limits based on agreement.</li>
                </ul>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Note: These are conceptual limits for demonstration. Specific endpoints might have different individual rate limits.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-orange-500"/>Handling Rate Limit Errors (HTTP 429)</CardTitle>
          <CardDescription>
            When you exceed a rate limit, the API will return an HTTP 429 status code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            It's crucial to handle these responses gracefully in your application. We recommend implementing an exponential backoff strategy.
          </p>
          <p className="text-sm">
            The API response for a 429 error may include a <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">Retry-After</code> header indicating how many seconds to wait before retrying, or custom fields in the JSON body:
          </p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
            <code>
              {http429Response}
            </code>
          </pre>
          <h4 className="font-semibold mt-3">Best Practices:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Implement retry logic with exponential backoff and jitter.</li>
            <li>Check for a <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">Retry-After</code> header or <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">retryAfterSeconds</code> in the JSON body to guide your retry attempts.</li>
            <li>Avoid immediate, continuous retries, as this can worsen the situation.</li>
            <li>Log rate limit errors to monitor your application's API usage patterns.</li>
            <li>Optimize your API calls to reduce frequency (e.g., batch operations if available, caching responses where appropriate).</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Checking Your Usage & Limits</CardTitle>
          <CardDescription>
            Conceptual ways to monitor your API consumption.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            In a live environment, the API might return the following headers with each response to help you track your current rate limit status:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 font-mono bg-muted p-3 rounded-md">
            <li><code className="text-xs">X-RateLimit-Limit</code>: The total number of requests allowed in the current window.</li>
            <li><code className="text-xs">X-RateLimit-Remaining</code>: The number of requests remaining in the current window.</li>
            <li><code className="text-xs">X-RateLimit-Reset</code>: The time (in UTC epoch seconds) when the current window resets.</li>
          </ul>
          <p className="text-sm mt-2">
            Additionally, the <Link href="/developer#api-usage" className="text-primary hover:underline">API Usage & Reporting section (mock)</Link> of the Developer Portal would provide a dashboard to visualize your usage over time.
          </p>
        </CardContent>
      </Card>
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Requesting Higher Limits</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm">
            If your application requires higher rate limits, please contact our support team or your account manager to discuss your use case and options for increased quotas, especially for Production environments.
          </p>
          <Button variant="link" className="p-0 h-auto mt-2" asChild>
            <Link href="#">Contact Support (Mock)</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


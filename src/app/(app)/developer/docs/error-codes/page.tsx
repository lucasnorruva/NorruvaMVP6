
// --- File: page.tsx (Error Codes Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorCodesPage() {
  const commonErrors = [
    { code: "400 Bad Request", description: "The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)." },
    { code: "401 Unauthorized", description: "The client must authenticate itself to get the requested response. API key may be missing, invalid, or expired." },
    { code: "403 Forbidden", description: "The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401, the client's identity is known to the server." },
    { code: "404 Not Found", description: "The server cannot find the requested resource. In the API, this can also mean that the resource is not available for the authenticated user." },
    { code: "429 Too Many Requests", description: "The user has sent too many requests in a given amount of time ('rate limiting')." },
    { code: "500 Internal Server Error", description: "The server has encountered a situation it doesn't know how to handle. This indicates an issue with our servers, please try again later or contact support if the issue persists." },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <AlertTriangle className="mr-3 h-7 w-7 text-primary" />
          Error Codes & Handling
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer">Back to Developer Portal</Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Content Coming Soon</AlertTitle>
        <AlertDescription>
          This page will provide a comprehensive list of API error codes, their meanings, and guidance on how to handle them.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>General Error Response Structure</CardTitle>
          <CardDescription>
            API errors are generally returned in a consistent JSON format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            A typical error response might look like this:
          </p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code>
{`{
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "A human-readable description of the error.",
    "details": [ /* Optional array of specific field errors or additional info */ ]
  }
}`}
            </code>
          </pre>
          <p className="font-semibold mt-3">Common HTTP Status Codes:</p>
           <ul className="list-disc list-inside space-y-2 text-sm">
            {commonErrors.map(err => (
              <li key={err.code}>
                <strong className="font-mono">{err.code}:</strong> {err.description}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            More specific error codes and detailed handling strategies will be documented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

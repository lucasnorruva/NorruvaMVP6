
// --- File: page.tsx (Error Codes Docs) ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorCodesPage() {
  const commonErrors = [
    { 
      code: "400 Bad Request", 
      description: "The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing). Ensure your request body matches the API schema and all required parameters are included." 
    },
    { 
      code: "401 Unauthorized", 
      description: "The client must authenticate itself to get the requested response. Your API key may be missing, invalid, or expired. Please check your Authorization header." 
    },
    { 
      code: "403 Forbidden", 
      description: "The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. This differs from 401 in that the client's identity is known to the server but lacks permission." 
    },
    { 
      code: "404 Not Found", 
      description: "The server cannot find the requested resource. This could mean the endpoint path is incorrect or the specific resource (e.g., a product ID) does not exist." 
    },
    { 
      code: "429 Too Many Requests", 
      description: "The user has sent too many requests in a given amount of time ('rate limiting'). Please refer to our rate limiting documentation and consider optimizing your requests or implementing backoff strategies." 
    },
    { 
      code: "500 Internal Server Error", 
      description: "The server has encountered a situation it doesn't know how to handle. This indicates an issue with our servers. Please try again later or contact support if the issue persists." 
    },
     { 
      code: "503 Service Unavailable", 
      description: "The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Please try again later." 
    }
  ];

  const errorResponseStructure = `{
  "error": {
    "code": "SPECIFIC_ERROR_CODE_STRING", // e.g., "INVALID_INPUT", "AUTHENTICATION_FAILED"
    "httpStatus": 400, // Standard HTTP status code
    "message": "A human-readable description of the error.",
    "details": [ 
      { 
        "field": "fieldName", 
        "issue": "Description of the issue with this specific field." 
      } 
    ], // Optional array for field-specific errors or additional info
    "requestId": "unique-request-id" // Helps in debugging
  }
}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <AlertTriangle className="mr-3 h-7 w-7 text-primary" />
          API Error Codes & Handling
        </h1>
        <Button variant="outline" asChild>
            <Link href="/developer"><ArrowLeft className="mr-2 h-4 w-4" />Back to Developer Portal</Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>General Error Response Structure</CardTitle>
          <CardDescription>
            API errors are generally returned in a consistent JSON format to help you diagnose and handle issues programmatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            A typical error response will follow this structure:
          </p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code>
              {errorResponseStructure}
            </code>
          </pre>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">error.code</code>: A Norruva-specific error code string.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">error.httpStatus</code>: The standard HTTP status code.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">error.message</code>: A developer-friendly message explaining the error.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">error.details</code> (Optional): An array of objects providing more specific information, often useful for validation errors on input fields.</li>
             <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">error.requestId</code> (Optional): A unique ID for the request, useful when contacting support.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Common HTTP Status Codes</CardTitle>
          <CardDescription>
            Below are common HTTP status codes you might encounter, along with their typical meanings in the context of the Norruva API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
           {commonErrors.map(err => (
              <div key={err.code} className="p-3 border rounded-md bg-background">
                <h4 className="font-semibold font-mono text-md text-primary">{err.code}</h4>
                <p className="text-sm text-muted-foreground mt-1">{err.description}</p>
              </div>
            ))}
          <p className="text-sm text-muted-foreground pt-2">
            This list is not exhaustive. Always check the specific error <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">code</code> and <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">message</code> in the JSON response for detailed information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

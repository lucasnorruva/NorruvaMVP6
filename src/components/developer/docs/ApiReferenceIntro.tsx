import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import Link from "next/link";

export default function ApiReferenceIntro() {
  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>
            The Norruva DPP API provides programmatic access to Digital Product Passport data. All API access is over HTTPS and uses standard HTTP features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Base URL:</strong>{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">/api/v1</code>
          </p>
          <p>All API responses are in JSON format.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyRound className="mr-2 h-5 w-5 text-primary" />Authentication
          </CardTitle>
          <CardDescription>
            API requests are authenticated using API Keys. Refer to the{" "}
            <Link href="/developer/docs/authentication" className="text-primary hover:underline">
              Authentication Guide
            </Link>{" "}
            for details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Include your API key in the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">Authorization</code> header as a Bearer token:
          </p>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
        </CardContent>
      </Card>
    </>
  );
}

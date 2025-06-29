import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";
import DocsPageLayout from "@/components/developer/DocsPageLayout";

export default function AuthenticationPage() {
  return (
    <DocsPageLayout
      pageTitle="API Authentication"
      pageIcon="KeyRound" // Ensure this is a string
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Accessing the Norruva DPP API requires proper authentication to
            ensure secure and authorized interactions with product data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our platform primarily uses API keys for server-to-server
            communication. For future client-side applications or third-party
            integrations, OAuth 2.0 may be introduced.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-green-600" />
            API Key Authentication
          </CardTitle>
          <CardDescription>
            Using API keys is the standard method for authenticating your
            backend services with the Norruva API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">Obtaining API Keys</h3>
            <p>
              API keys can be generated and managed through the{" "}
              <Link
                href="/developer#api_keys"
                className="text-primary hover:underline"
              >
                API Keys section
              </Link>{" "}
              of the Developer Portal. You will typically have access to Sandbox
              keys for testing and Production keys for live applications.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">
              Using API Keys in Requests
            </h3>
            <p>
              API keys should be included in the{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">
                Authorization
              </code>{" "}
              header of your HTTP requests, using the{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">
                Bearer
              </code>{" "}
              scheme.
            </p>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
              <code>Authorization: Bearer YOUR_API_KEY</code>
            </pre>
            <p className="mt-2 text-sm text-muted-foreground">
              Replace{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                YOUR_API_KEY
              </code>{" "}
              with your actual API key.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2">
              Security Best Practices
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                Keep your API keys confidential and store them securely. Do not
                embed them directly in client-side code.
              </li>
              <li>
                Use separate API keys for different environments (e.g.,
                development, staging, production).
              </li>
              <li>
                Regenerate API keys if you suspect they have been compromised.
              </li>
              <li>
                Restrict API key permissions if granular control becomes
                available.
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>OAuth 2.0 (Future)</CardTitle>
          <CardDescription>
            OAuth 2.0 will be considered for scenarios requiring user-delegated
            access or third-party application authorization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            When implemented, this section will detail the OAuth 2.0 flows
            supported (e.g., Authorization Code Grant), how to register your
            application, obtain client credentials, and manage access tokens.
          </p>
          <p className="text-sm text-muted-foreground">
            Stay tuned for updates on OAuth 2.0 availability.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

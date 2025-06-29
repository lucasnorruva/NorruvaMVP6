// --- File: src/app/(app)/developer/docs/pwa-guide/page.tsx ---
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import {
  AppWindow,
  Settings,
  Info,
  DownloadCloud,
  FileJson,
  Smartphone,
  Activity,
} from "lucide-react";
import DocsPageLayout from "@/components/developer/DocsPageLayout";

export default function PwaGuidePage() {
  return (
    <DocsPageLayout
      pageTitle="PWA & Service Worker Guide"
      pageIcon="AppWindow"
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Progressive Web App Capabilities"
      alertDescription="This guide explains how the Norruva application functions as a Progressive Web App (PWA), including installation and the role of the service worker."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-primary" />
            What is a PWA?
          </CardTitle>
          <CardDescription>
            A Progressive Web App (PWA) is a type of application software
            delivered through the web, built using common web technologies
            including HTML, CSS, JavaScript, and WebAssembly. It is intended to
            work on any platform that uses a standards-compliant browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            PWAs provide an app-like experience to users, including the ability
            to be installed on their device's home screen, offline access to
            cached content, and potentially push notifications (though push
            notifications are not yet implemented in this conceptual
            application).
          </p>
          <p>
            The Norruva DPP platform is configured as a PWA to enhance user
            experience and accessibility.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DownloadCloud className="mr-2 h-5 w-5 text-primary" />
            Installing the Norruva PWA
          </CardTitle>
          <CardDescription>
            You can install the Norruva application on your desktop or mobile
            device for a more integrated experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            On compatible browsers (like Google Chrome, Microsoft Edge, Safari
            on iOS/macOS):
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <strong>Desktop:</strong> Look for an "Install" icon (often a
              computer with a downward arrow) in the address bar. Click it and
              follow the prompts.
            </li>
            <li>
              <strong>Mobile (Android):</strong> You may see a prompt to "Add
              Norruva to Home screen" or find this option in the browser's menu.
            </li>
            <li>
              <strong>Mobile (iOS):</strong> Use the "Share" button in Safari,
              then select "Add to Home Screen".
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            This installation works in both development (`npm run dev`) and
            production environments. Once installed, the app can be launched
            directly from its icon like a native application.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            The Service Worker (`public/sw.js`)
          </CardTitle>
          <CardDescription>
            The service worker is a script that your browser runs in the
            background, separate from a web page, opening the door to features
            that don't need a web page or user interaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In the Norruva application, the service worker (`public/sw.js`)
            primarily enables the PWA installation capability. It includes a
            basic caching strategy for static assets (like CSS, JavaScript
            bundles, and images loaded during its installation) and provides a
            simple offline fallback page if the network is unavailable.
          </p>
          <p className="text-sm">
            The registration of this service worker is handled by the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              ServiceWorkerRegister.tsx
            </code>{" "}
            component, which calls the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              registerServiceWorker
            </code>{" "}
            utility function from{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              src/utils/registerServiceWorker.ts
            </code>
            . This script runs on page load.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileJson className="mr-2 h-5 w-5 text-primary" />
            Web App Manifest (`public/manifest.json`)
          </CardTitle>
          <CardDescription>
            The{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              manifest.json
            </code>{" "}
            file provides information about the application in a JSON text file,
            necessary for the PWA to be downloaded and installed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Our manifest defines:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                name
              </code>{" "}
              &{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                short_name
              </code>
              : The display names for the application.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                icons
              </code>
              : App icons for different sizes and purposes.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                start_url
              </code>
              : The page that loads when the PWA is launched.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                display
              </code>
              : How the PWA should be displayed (e.g., "standalone").
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                background_color
              </code>{" "}
              &{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                theme_color
              </code>
              : Colors for the PWA's splash screen and browser UI.
            </li>
          </ul>
          <p className="text-sm">
            This file is linked in the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              &lt;head&gt;
            </code>{" "}
            of our{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              RootLayout.tsx
            </code>
            .
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Current PWA Capabilities & Future
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Currently, the PWA features focus on:</p>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>Installability on desktop and mobile devices.</li>
            <li>
              A basic offline fallback page indicating no network connection.
            </li>
            <li>
              App-like user experience when launched from the home screen.
            </li>
          </ul>
          <p className="text-sm mt-3 text-muted-foreground">
            Future enhancements could include more advanced offline caching
            strategies for specific data (e.g., recently viewed DPPs),
            background synchronization, and (if applicable) push notifications
            for important updates.
          </p>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

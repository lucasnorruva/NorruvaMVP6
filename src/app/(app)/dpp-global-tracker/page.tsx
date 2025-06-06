
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function DppGlobalTrackerPagePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline flex items-center justify-center">
            <Construction className="mr-3 h-7 w-7 text-primary" />
            DPP Global Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg text-muted-foreground">
            This page has been reset and is currently under construction.
          </CardDescription>
          <p className="mt-4 text-sm">
            You can now rebuild the DPP Global Tracker feature here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

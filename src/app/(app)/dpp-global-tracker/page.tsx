
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe as GlobeIconLucide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function DppGlobalTrackerPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="p-3 border-b border-border shadow-sm bg-card flex items-center justify-between print:hidden">
        <div className="flex items-center">
           <GlobeIconLucide className="mr-2 h-6 w-6 text-primary" />
           <h1 className="text-xl font-headline font-semibold">
             DPP Global Tracker
           </h1>
        </div>
        <div className="flex items-center gap-2">
            {/* Placeholder for future controls like legend/filter toggles */}
            <Button variant="outline" size="sm" onClick={() => router.back()}>Back to Dashboard</Button>
        </div>
      </header>
      
      <main className="flex-grow p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">DPP Global Tracker</CardTitle>
            <CardDescription>
              This feature is currently under reconstruction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GlobeIconLucide className="mx-auto h-24 w-24 text-primary/30 mb-6" />
            <p className="text-muted-foreground">
              The interactive globe visualization and tracking capabilities will be rebuilt here.
              Please check back later for updates.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

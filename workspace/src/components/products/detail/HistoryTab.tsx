// --- File: HistoryTab.tsx ---
// Description: Displays product-specific history/audit trail.
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, History as HistoryIconLucide, User, Edit, CalendarDays, Info as InfoIcon } from 'lucide-react'; // Renamed History to HistoryIconLucide
import type { HistoryEntry } from '@/types/dpp';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryTabProps {
  productId: string;
}

export default function HistoryTab({ productId }: HistoryTabProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/dpp/history/${productId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `Failed to fetch history: ${response.status}`);
        }
        const data: HistoryEntry[] = await response.json();
        setHistory(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        console.error("Error fetching product history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading product history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading History</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <HistoryIconLucide className="mr-2 h-5 w-5 text-primary" /> Product History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical events recorded for this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <HistoryIconLucide className="mr-2 h-5 w-5 text-primary" /> Product DPP History
        </CardTitle>
        <CardDescription>Conceptual audit trail of changes and significant events for this product passport.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-3"> {/* Added ScrollArea for long lists */}
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={`${entry.timestamp}-${index}`} className="p-3 border rounded-lg bg-background hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1.5">
                  <h4 className="font-medium text-md text-foreground flex items-center">
                    <Edit className="mr-2 h-4 w-4 text-primary flex-shrink-0"/>
                    {entry.actionType}
                  </h4>
                  <Badge variant="outline" className="mt-1 sm:mt-0 text-xs">Version: {entry.version || 'N/A'}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2 flex flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center">
                    <CalendarDays className="h-3.5 w-3.5 mr-1 text-muted-foreground/80"/>
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <User className="h-3.5 w-3.5 mr-1 text-muted-foreground/80"/>
                    Changed by: {entry.changedBy}
                  </span>
                </div>
                {entry.details && (
                    <p className="text-sm text-foreground/80 p-2 bg-muted/30 rounded-md whitespace-pre-line">
                        <InfoIcon className="inline h-4 w-4 mr-1.5 text-info align-text-bottom"/>
                        {entry.details}
                    </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// --- File: HistoryTab.tsx ---
// Description: Displays product-specific history/audit trail.
"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  AlertTriangle,
  History as HistoryIconLucide,
  User,
  Edit,
  CalendarDays,
  Info as InfoIcon,
  FilePlus2,
  ShieldCheck,
  Award,
  ListChecks,
  Truck,
  Factory,
  Search,
} from "lucide-react";
import type { HistoryEntry } from "@/types/dpp";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface HistoryTabProps {
  productId: string;
}

const getActionIcon = (actionType: string): React.ElementType => {
  const lowerAction = actionType.toLowerCase();
  if (lowerAction.includes("created")) return FilePlus2;
  if (lowerAction.includes("updated") || lowerAction.includes("modified"))
    return Edit;
  if (lowerAction.includes("lifecycle event: manufactured")) return Factory;
  if (lowerAction.includes("lifecycle event: shipped")) return Truck;
  if (lowerAction.includes("lifecycle event:")) return ListChecks;
  if (lowerAction.includes("certification added")) return Award;
  if (
    lowerAction.includes("ebsi verification") ||
    lowerAction.includes("blockchain")
  )
    return ShieldCheck;
  return HistoryIconLucide;
};

export default function HistoryTab({ productId }: HistoryTabProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");
  const debouncedFilterText = useDebounce(filterText, 300);

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/dpp/history/${productId}`); // Using API key implicitly via middleware if needed
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message ||
              `Failed to fetch history: ${response.status}`,
          );
        }
        const data: HistoryEntry[] = await response.json();
        setHistory(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        console.error("Error fetching product history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, [productId]);

  const filteredHistory = useMemo(() => {
    if (!debouncedFilterText.trim()) {
      return history;
    }
    const lowerFilter = debouncedFilterText.toLowerCase();
    return history.filter(
      (entry) =>
        entry.actionType.toLowerCase().includes(lowerFilter) ||
        (entry.details && entry.details.toLowerCase().includes(lowerFilter)) ||
        entry.changedBy.toLowerCase().includes(lowerFilter),
    );
  }, [history, debouncedFilterText]);

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
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading History</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <HistoryIconLucide className="mr-2 h-5 w-5 text-primary" /> Product
          DPP History
        </CardTitle>
        <CardDescription>
          Conceptual audit trail of changes and significant events for this
          product passport.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter history entries..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-8 w-full sm:w-72"
          />
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            {debouncedFilterText.trim()
              ? "No history entries match your filter."
              : "No historical events recorded for this product."}
          </p>
        ) : (
          <ScrollArea className="h-[500px] pr-3">
            <div className="space-y-4">
              {filteredHistory.map((entry, index) => {
                const ActionIcon = getActionIcon(entry.actionType);
                return (
                  <div
                    key={`${entry.timestamp}-${index}`}
                    className="p-3 border rounded-lg bg-background hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1.5">
                      <h4 className="font-medium text-md text-foreground flex items-center">
                        <ActionIcon className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                        {entry.actionType}
                      </h4>
                      <Badge variant="outline" className="mt-1 sm:mt-0 text-xs">
                        Version: {entry.version || "N/A"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2 flex flex-wrap gap-x-3 gap-y-1">
                      <span className="flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1 text-muted-foreground/80" />
                        {new Date(entry.timestamp).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <span className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-muted-foreground/80" />
                        Changed by: {entry.changedBy}
                      </span>
                    </div>
                    {entry.details && (
                      <p className="text-sm text-foreground/80 p-2 bg-muted/30 rounded-md whitespace-pre-line">
                        <InfoIcon className="inline h-4 w-4 mr-1.5 text-info align-text-bottom" />
                        {entry.details}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

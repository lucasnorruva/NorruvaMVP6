// --- File: AiSuggestionDisplay.tsx ---
// Description: Component for displaying a list of AI-generated string suggestions.
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Info, PlusCircle } from "lucide-react";

interface AiSuggestionDisplayProps {
  suggestions: string[];
  onAddSuggestion: (suggestion: string) => void;
  title: string;
  itemNoun?: string; // e.g., "claim", "keyword"
}

export default function AiSuggestionDisplay({
  suggestions,
  onAddSuggestion,
  title,
  itemNoun = "item",
}: AiSuggestionDisplayProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 pt-2 border border-dashed p-3 rounded-md bg-muted/30">
      <FormLabel className="text-sm font-medium text-muted-foreground flex items-center">
        <Info className="h-4 w-4 mr-2 text-info" /> {title}
      </FormLabel>
      <p className="text-xs text-muted-foreground mb-2">
        Click a suggestion to add it.
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={`${suggestion}-${index}`}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddSuggestion(suggestion)}
            className="bg-background hover:bg-accent/10 text-xs h-auto py-1.5 px-2.5 group"
            title={`Add this ${itemNoun}: ${suggestion}`}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5 text-green-600 group-hover:text-green-700 transition-colors" />
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}

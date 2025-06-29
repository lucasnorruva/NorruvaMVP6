// --- File: src/components/developer/ApiPlaygroundEndpointCard.tsx ---
// Description: Reusable component to display an individual API endpoint card in the Developer Portal's API Playground.
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileJson,
  Loader2,
  Send,
  ServerIcon as ServerLucideIcon,
} from "lucide-react";

interface ApiPlaygroundEndpointCardProps {
  title: string; // Should include HTTP method and path, e.g., "GET /api/v1/dpp/{productId}"
  description: string;
  children: React.ReactNode; // For parameter inputs, body textarea, etc.
  onSendRequest: () => void;
  isLoading: boolean;
  response: string | null;
  codeSnippet: string;
  snippetLanguage: string;
  onSnippetLanguageChange: (lang: string) => void;
  codeSampleLanguages: string[];
}

export default function ApiPlaygroundEndpointCard({
  title,
  description,
  children,
  onSendRequest,
  isLoading,
  response,
  codeSnippet,
  snippetLanguage,
  onSnippetLanguageChange,
  codeSampleLanguages,
}: ApiPlaygroundEndpointCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <ServerLucideIcon className="mr-2 h-5 w-5 text-info" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children} {/* Input fields for params/body will be passed here */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button
            onClick={onSendRequest}
            disabled={isLoading}
            variant="secondary"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
          <Select
            value={snippetLanguage}
            onValueChange={onSnippetLanguageChange}
          >
            <SelectTrigger className="w-full sm:w-[150px] text-xs h-9">
              <SelectValue placeholder="Code Sample" />
            </SelectTrigger>
            <SelectContent>
              {codeSampleLanguages.map((lang) => (
                <SelectItem
                  key={`${title.replace(/[^a-zA-Z0-9]/g, "-")}-${lang}`}
                  value={lang}
                >
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {codeSnippet && (
          <div className="mt-2">
            <Label className="text-xs text-muted-foreground">
              Code Snippet ({snippetLanguage}):
            </Label>
            <pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}
        {response && (
          <div className="mt-4">
            <Label className="flex items-center text-xs text-muted-foreground">
              <FileJson className="mr-2 h-4 w-4 text-accent" />
              Response:
            </Label>
            <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto max-h-96">
              <code>{response}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

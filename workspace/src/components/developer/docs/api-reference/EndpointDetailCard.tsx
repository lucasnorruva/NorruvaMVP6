// --- File: src/components/developer/docs/api-reference/EndpointDetailCard.tsx ---
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

export interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
  enum?: string[];
  default?: string;
}

export interface EndpointDefinition {
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  pathParams?: EndpointParam[];
  queryParams?: EndpointParam[];
  requestBodySchema?: string;
  requestBodyExample?: string;
  responseSchema?: string;
  responseExample: string;
  responseContentType?: string;
  commonErrors: Array<string>;
  errorExamples: Record<string, string>;
}

export const EndpointDetailCard: React.FC<EndpointDefinition> = ({
  title,
  method,
  path,
  description,
  pathParams,
  queryParams,
  requestBodySchema,
  requestBodyExample,
  responseSchema,
  responseExample,
  responseContentType,
  commonErrors,
  errorExamples,
}) => {
  const getBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-sky-100 text-sky-700 border-sky-300";
      case "POST":
        return "bg-green-100 text-green-700 border-green-300";
      case "PUT":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "PATCH":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "DELETE":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge
              variant="outline"
              className={`${getBadgeClass(method)} mr-2 font-semibold`}
            >
              {method}
            </Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">{path}</code>
          </span>
          <br />
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pathParams?.length ? (
          <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {pathParams.map((p) => (
                <li key={p.name}>
                  <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                    {p.name}
                  </code>{" "}
                  ({p.type}, {p.required ? "required" : "optional"}):{" "}
                  {p.description}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {queryParams?.length ? (
          <section>
            <h4 className="font-semibold mb-1">Query Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {queryParams.map((p) => (
                <li key={p.name}>
                  <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                    {p.name}
                  </code>{" "}
                  ({p.type}, {p.required ? "required" : "optional"}):{" "}
                  {p.description} {p.example && `e.g., ${p.example}`}{" "}
                  {p.default && `(Default: ${p.default})`}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {requestBodyExample && (
          <section>
            <h4 className="font-semibold mb-1">
              Request Body {requestBodySchema && `(${requestBodySchema})`}
            </h4>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Request
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{requestBodyExample}</code>
              </pre>
            </details>
          </section>
        )}
        <section>
          <h4 className="font-semibold mb-1">
            Example Response (Success) {responseSchema && `(${responseSchema})`}
          </h4>
          {responseContentType && (
            <p className="text-sm mb-1">
              Content-Type:{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                {responseContentType}
              </code>
            </p>
          )}
          {responseContentType === "image/png" ? (
            <p className="text-sm mb-1">Returns the QR code image directly.</p>
          ) : (
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />
                Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{responseExample}</code>
              </pre>
            </details>
          )}
        </section>
        {commonErrors?.length ? (
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              {commonErrors.map((errCode) => (
                <li key={errCode}>
                  <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                    {errCode.split("_")[0]}{" "}
                    {errCode.includes("_")
                      ? errCode.split("_")[1].toUpperCase()
                      : "Bad Request"}
                  </code>
                  {errorExamples[errCode] && (
                    <details className="border rounded-md mt-1">
                      <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                        Example JSON
                      </summary>
                      <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                        <code>{errorExamples[errCode]}</code>
                      </pre>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </CardContent>
    </Card>
  );
};

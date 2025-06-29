// --- File: src/components/developer/docs/api-reference/ApiReferenceDppEndpoints.tsx ---
"use client";

import { Server } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface EndpointDefinition {
  id: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  pathParams?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  queryParams?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
    enum?: string[];
    default?: string;
  }>;
  requestBodySchema?: string;
  requestBodyExample?: string;
  responseSchema?: string;
  responseExample: string;
  commonErrors: Array<"400" | "401" | "404" | "500" | string>; // String for specific 400s
}

interface ApiReferenceDppEndpointsProps {
  exampleListDppsResponse: string;
  exampleDppResponse: string;
  conceptualCreateDppRequestBody: string;
  conceptualCreateDppResponseBody: string;
  conceptualUpdateDppRequestBody: string;
  conceptualUpdateDppResponseBody: string;
  conceptualDeleteDppResponseBody: string;
  conceptualPatchDppExtendRequestBody: string;
  conceptualPatchDppExtendResponseBody: string;
  addLifecycleEventRequestBodyExample: string;
  addLifecycleEventResponseExample: string;
  // Props for new conceptual on-chain operations
  exampleUpdateOnChainStatusRequestBody: string;
  exampleUpdateOnChainLifecycleStageRequestBody: string;
  exampleLogCriticalEventRequestBody: string;
  exampleRegisterVcHashRequestBody: string;
  exampleUpdatedDppResponse: string;
  // Error responses
  error401: string;
  error404: string;
  error500: string;
  error400_create_dpp: string;
  error400_update_dpp: string;
  error400_patch_dpp: string;
  error400_lifecycle_event: string;
  error400_general: string;
}

const EndpointDetailCard: React.FC<
  EndpointDefinition & { errorExamples: Record<string, string> }
> = ({
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
        {pathParams && pathParams.length > 0 && (
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
        )}
        {queryParams && queryParams.length > 0 && (
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
        )}
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
            Example Response (Success 200 OK / 201 Created){" "}
            {responseSchema && `(${responseSchema})`}
          </h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Response
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{responseExample}</code>
            </pre>
          </details>
        </section>
        {commonErrors && commonErrors.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default function ApiReferenceDppEndpoints(
  props: ApiReferenceDppEndpointsProps,
) {
  const dppEndpoints: EndpointDefinition[] = [
    {
      id: "listDpps",
      title: "List Digital Product Passports",
      method: "GET",
      path: "/api/v1/dpp",
      description: "Retrieves a list of DPPs, with optional filtering.",
      queryParams: [
        {
          name: "status",
          type: "string",
          required: false,
          description: "Filter by DPP status.",
          enum: ["draft", "published", "archived", "all"],
          default: "all",
        },
        {
          name: "category",
          type: "string",
          required: false,
          description: "Filter by product category.",
        },
        {
          name: "searchQuery",
          type: "string",
          required: false,
          description: "Search term for product name, ID, etc.",
        },
        {
          name: "blockchainAnchored",
          type: "string",
          required: false,
          description: "Filter by blockchain anchoring status.",
          enum: ["all", "anchored", "not_anchored"],
          default: "all",
        },
      ],
      responseExample: props.exampleListDppsResponse,
      commonErrors: ["401", "500"],
    },
    {
      id: "retrieveDpp",
      title: "Retrieve a Digital Product Passport",
      method: "GET",
      path: "/api/v1/dpp/{productId}",
      description: "Fetches the complete DPP for a specific product.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "The unique identifier of the product.",
        },
      ],
      responseExample: props.exampleDppResponse,
      responseSchema: "DigitalProductPassport",
      commonErrors: ["401", "404", "500"],
    },
    {
      id: "createDpp",
      title: "Create Digital Product Passport",
      method: "POST",
      path: "/api/v1/dpp",
      description: "Creates a new DPP.",
      requestBodySchema: "CreateDppRequestBody",
      requestBodyExample: props.conceptualCreateDppRequestBody,
      responseExample: props.conceptualCreateDppResponseBody,
      responseSchema: "DigitalProductPassport",
      commonErrors: ["400_create_dpp", "401", "500"],
    },
    {
      id: "updateDpp",
      title: "Update Digital Product Passport",
      method: "PUT",
      path: "/api/v1/dpp/{productId}",
      description: "Updates an existing DPP.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "The ID of the DPP to update.",
        },
      ],
      requestBodySchema: "UpdateDppRequestBody",
      requestBodyExample: props.conceptualUpdateDppRequestBody,
      responseExample: props.conceptualUpdateDppResponseBody,
      responseSchema: "DigitalProductPassport",
      commonErrors: ["400_update_dpp", "401", "404", "500"],
    },
    {
      id: "extendDpp",
      title: "Extend Digital Product Passport",
      method: "PATCH",
      path: "/api/v1/dpp/extend/{productId}",
      description: "Adds document references or other modular data.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "The ID of the DPP to extend.",
        },
      ],
      requestBodyExample: props.conceptualPatchDppExtendRequestBody,
      responseExample: props.conceptualPatchDppExtendResponseBody,
      responseSchema: "DigitalProductPassport",
      commonErrors: ["400_patch_dpp", "401", "404", "500"],
    },
    {
      id: "addLifecycleEvent",
      title: "Add Lifecycle Event to DPP",
      method: "POST",
      path: "/api/v1/dpp/{productId}/lifecycle-events",
      description: "Adds a new lifecycle event.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "The ID of the product.",
        },
      ],
      requestBodyExample: props.addLifecycleEventRequestBodyExample,
      responseExample: props.addLifecycleEventResponseExample,
      responseSchema: "LifecycleEvent",
      commonErrors: ["400_lifecycle_event", "401", "404", "500"],
    },
    {
      id: "archiveDpp",
      title: "Archive Digital Product Passport",
      method: "DELETE",
      path: "/api/v1/dpp/{productId}",
      description: "Archives a DPP (soft delete).",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "The ID of the DPP to archive.",
        },
      ],
      responseExample: props.conceptualDeleteDppResponseBody,
      commonErrors: ["401", "404", "500"],
    },
    {
      id: "issueAuthVc",
      title: "Issue Authentication VC",
      method: "POST",
      path: "/api/v1/dpp/{productId}/issue-auth-vc",
      description: "Conceptually issues an authentication VC.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "Product ID.",
        },
      ],
      responseExample: props.exampleUpdatedDppResponse,
      commonErrors: ["401", "404", "500"],
    },
    {
      id: "linkNft",
      title: "Link Ownership NFT",
      method: "POST",
      path: "/api/v1/dpp/{productId}/link-nft",
      description: "Conceptually links an ownership NFT.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "Product ID.",
        },
      ],
      requestBodyExample: JSON.stringify({
        contractAddress: "0x...",
        tokenId: "123",
      }),
      requestBodySchema: "OwnershipNftLinkRequestBody",
      responseExample: props.exampleUpdatedDppResponse,
      commonErrors: ["400", "401", "404", "500"],
    },
    {
      id: "updateOnChainStatus",
      title: "Update DPP On-Chain Status",
      method: "POST",
      path: "/api/v1/dpp/{productId}/onchain-status",
      description: "Conceptually updates on-chain status.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "Product ID.",
        },
      ],
      requestBodySchema: "UpdateOnChainStatusRequest",
      requestBodyExample: props.exampleUpdateOnChainStatusRequestBody,
      responseExample: props.exampleUpdatedDppResponse,
      commonErrors: ["400", "401", "404", "500"],
    },
    {
      id: "updateOnChainLifecycle",
      title: "Update DPP On-Chain Lifecycle Stage",
      method: "POST",
      path: "/api/v1/dpp/{productId}/onchain-lifecycle-stage",
      description: "Conceptually updates on-chain lifecycle stage.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "Product ID.",
        },
      ],
      requestBodySchema: "UpdateOnChainLifecycleStageRequest",
      requestBodyExample: props.exampleUpdateOnChainLifecycleStageRequestBody,
      responseExample: props.exampleUpdatedDppResponse,
      commonErrors: ["400", "401", "404", "500"],
    },
    {
      id: "logCriticalEvent",
      title: "Log Critical Event for DPP",
      method: "POST",
      path: "/api/v1/dpp/{productId}/log-critical-event",
      description: "Conceptually logs a critical event on-chain.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "Product ID.",
        },
      ],
      requestBodySchema: "LogCriticalEventRequest",
      requestBodyExample: props.exampleLogCriticalEventRequestBody,
      responseExample: props.exampleUpdatedDppResponse,
      commonErrors: ["400", "401", "404", "500"],
    },
    {
      id: "registerVcHash",
      title: "Register Verifiable Credential Hash",
      method: "POST",
      path: "/api/v1/dpp/{productId}/register-vc-hash",
      description: "Conceptually registers a VC hash on-chain.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "Product ID.",
        },
      ],
      requestBodySchema: "RegisterVcHashRequest",
      requestBodyExample: props.exampleRegisterVcHashRequestBody,
      responseExample: props.exampleUpdatedDppResponse,
      commonErrors: ["400", "401", "404", "500"],
    },
  ];

  const errorExamples: Record<string, string> = {
    "400": props.error400_general,
    "400_create_dpp": props.error400_create_dpp,
    "400_update_dpp": props.error400_update_dpp,
    "400_patch_dpp": props.error400_patch_dpp,
    "400_lifecycle_event": props.error400_lifecycle_event,
    "401": props.error401,
    "404": props.error404,
    "500": props.error500,
  };

  return (
    <section id="dpp-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> Digital Product
        Passport (DPP) Endpoints
      </h2>
      {dppEndpoints.map((endpoint) => (
        <EndpointDetailCard
          key={endpoint.id}
          {...endpoint}
          errorExamples={errorExamples}
        />
      ))}
    </section>
  );
}

ApiReferenceDppEndpoints.defaultProps = {
  error400_general: JSON.stringify(
    { error: { code: 400, message: "Invalid request body or parameters." } },
    null,
    2,
  ),
};


// --- File: page.tsx (API Reference Main Page) ---
"use client";

import { MOCK_DPPS } from "@/data";
import DocsPageLayout from '@/components/developer/DocsPageLayout';
import ApiReferenceIntro from '@/components/developer/docs/ApiReferenceIntro';
import ApiReferenceDppEndpoints from '@/components/developer/docs/api-reference/ApiReferenceDppEndpoints';
import ApiReferenceQrEndpoints from '@/components/developer/docs/api-reference/ApiReferenceQrEndpoints';
import ApiReferenceComplianceEndpoints from '@/components/developer/docs/api-reference/ApiReferenceComplianceEndpoints';
import ApiReferenceTokenEndpoints from '@/components/developer/docs/api-reference/ApiReferenceTokenEndpoints';
import ApiReferencePrivateLayerEndpoints from '@/components/developer/docs/api-reference/ApiReferencePrivateLayerEndpoints';
import ApiReferenceZkpLayerEndpoints from '@/components/developer/docs/api-reference/ApiReferenceZkpLayerEndpoints';
import { BatchUpdateDpps, ExportDpps } from '@/components/developer/docs/api-reference';
import type { DigitalProductPassport } from "@/types/dpp";

export default function ApiReferencePage() {
  const exampleDppForResponse = MOCK_DPPS.find(dpp => dpp.id === "DPP005") || MOCK_DPPS[0]; // DPP005 has battery data
  const exampleDppResponseString = JSON.stringify(exampleDppForResponse, null, 2);
  const exampleListDppsResponseString = JSON.stringify({ data: [MOCK_DPPS.find(dpp => dpp.id === "DPP001") || MOCK_DPPS[0]], filtersApplied: { status: "published", category: "Electronics", blockchainAnchored: "all", searchQuery: "EcoSmart" }, totalCount: 1 }, null, 2);
  const qrValidationResponseExampleString = JSON.stringify({ productId: MOCK_DPPS[0].id, productName: MOCK_DPPS[0].productName, category: MOCK_DPPS[0].category, manufacturer: MOCK_DPPS[0].manufacturer?.name || "N/A", verificationStatus: "valid_dpp_found", dppUrl: `/passport/${MOCK_DPPS[0].id}`, ebsiCompliance: { status: MOCK_DPPS[0].ebsiVerification?.status || "unknown", verificationId: MOCK_DPPS[0].ebsiVerification?.verificationId }, blockchainAnchor: { transactionHash: MOCK_DPPS[0].blockchainIdentifiers?.anchorTransactionHash, platform: MOCK_DPPS[0].blockchainIdentifiers?.platform }}, null, 2);
  const mintTokenRequestBodyString = JSON.stringify({ contractAddress: "0xMOCK_DPP_TOKEN_CONTRACT", recipientAddress: "0xRECIPIENT_MOCK_ADDRESS", metadataUri: "ipfs://example_metadata_cid" }, null, 2);
  const mintTokenResponseBodyString = JSON.stringify({ tokenId: "101", contractAddress: "0xMOCK_DPP_TOKEN_CONTRACT", transactionHash: "0xmint_tx_mock_abcdef123456" }, null, 2);
  const updateTokenMetaRequestBodyString = JSON.stringify({ metadataUri: "ipfs://new_example_metadata_cid" }, null, 2);
  const updateTokenMetaResponseBodyString = JSON.stringify({ tokenId: "101", contractAddress: "0xMOCK_DPP_TOKEN_CONTRACT", transactionHash: "0xmeta_update_tx_mock_654321fedcba" }, null, 2);
  const getTokenStatusResponseBodyString = JSON.stringify({ tokenId: "101", contractAddress: "0xMOCK_DPP_TOKEN_CONTRACT", ownerAddress: "0xRECIPIENT_MOCK_ADDRESS", mintedAt: new Date().toISOString(), metadataUri: `ipfs://dpp_metadata_for_DPP001`, lastTransactionHash: "0xlast_tx_mock_randomhash", status: "active" }, null, 2);
  const conceptualCreateDppRequestBodyString = JSON.stringify({ productName: "Sustainable Smart Watch Series 5", category: "Wearable Technology", gtin: "09876543210123", manufacturerName: "FutureGadgets Inc.", modelNumber: "SW-S5-ECO", productDetails: { description: "The latest smart watch with a focus on sustainability...", materials: [{ name: "Recycled Aluminum (Case)", percentage: 80 }], energyLabel: "A" }}, null, 2);
  const conceptualCreateDppResponseBodyString = JSON.stringify({ id: "DPP_API_12345", productName: "Sustainable Smart Watch Series 5", category: "Wearable Technology", metadata: { status: "draft", last_updated: new Date().toISOString() } }, null, 2);
  const conceptualUpdateDppRequestBodyString = JSON.stringify({ productDetails: { description: "Updated description." }, metadata: { status: "pending_review" }}, null, 2);
  const conceptualUpdateDppResponseBodyString = JSON.stringify({ ...MOCK_DPPS[0], productDetails: { ...MOCK_DPPS[0].productDetails, description: "Updated description." }, metadata: { ...MOCK_DPPS[0].metadata, status: "pending_review", last_updated: new Date().toISOString() }}, null, 2);
  const conceptualDeleteDppResponseBodyString = JSON.stringify({ message: "Product with ID DPP001 has been archived successfully.", status: "Archived" }, null, 2);
  const conceptualPatchDppExtendRequestBodyString = JSON.stringify({ documentReference: { documentName: "Compliance Cert 2024", documentUrl: "https://example.com/cert.pdf", documentType: "Certificate" }}, null, 2);
  const conceptualPatchDppExtendResponseBodyString = JSON.stringify({ ...MOCK_DPPS[0], documents: [...(MOCK_DPPS[0].documents || []), { name: "Compliance Cert 2024", url: "https://example.com/cert.pdf", type: "Certificate", addedTimestamp: new Date().toISOString() }] }, null, 2);
  const addLifecycleEventRequestBodyExampleString = JSON.stringify({ eventType: "Shipped", location: "Warehouse B", details: { carrier: "GlobalTrans" }}, null, 2);
  const addLifecycleEventResponseExampleString = JSON.stringify({ id: "evt_mock_123", type: "Shipped", timestamp: new Date().toISOString(), location: "Warehouse B", data: { carrier: "GlobalTrans" }}, null, 2);
  const conceptualComplianceSummaryResponseString = JSON.stringify({ productId: "DPP005", productName: MOCK_DPPS.find(d=>d.id==="DPP005")?.productName, overallStatus: "Fully Compliant", details: { batteryRegulation: { status: "compliant" } } }, null, 2);
  const conceptualVerifyDppResponseString = JSON.stringify({ productId: "DPP001", verificationStatus: "Verified", message: "DPP verified.", timestamp: new Date().toISOString(), checksPerformed: ["Integrity Check", "EBSI Anchor Check"] }, null, 2);
  const exampleUpdateOnChainStatusRequestBodyString = JSON.stringify({ status: "recalled" }, null, 2);
  const exampleUpdateOnChainLifecycleStageRequestBodyString = JSON.stringify({ lifecycleStage: "Distribution" }, null, 2);
  const exampleLogCriticalEventRequestBodyString = JSON.stringify({ eventDescription: "Major defect discovered.", severity: "High" }, null, 2);
  const exampleRegisterVcHashRequestBodyString = JSON.stringify({ vcId: "urn:uuid:vc-id-123", vcHash: "sha256_mockhash..." }, null, 2);
  const exampleUpdatedDppResponseString = JSON.stringify({ ...MOCK_DPPS[0], metadata: { ...MOCK_DPPS[0].metadata, onChainStatus: "recalled", last_updated: new Date().toISOString() }}, null, 2);
  const exampleB2BComponentTransferRequestBodyString = JSON.stringify({ productId: "DPP001", componentId: "COMP_XYZ_123", quantity: 100, transferDate: new Date().toISOString(), fromParty: { participantId: "SUP001" }, toParty: { participantId: "MFG001" } }, null, 2);
  const exampleB2BComponentTransferResponseBodyString = JSON.stringify({ transferId: "transfer_comp_xyz_mock123", productId: "DPP001", componentId: "COMP_XYZ_123", quantity: 100 }, null, 2);
  const exampleGetSupplierAttestationsResponseBodyString = JSON.stringify([{ attestationId: "attest_sup001_compA_mock1", componentId: "COMP_A", attestationType: "EthicalSourcing", issuanceDate: new Date().toISOString() }], null, 2);
  const exampleGetConfidentialMaterialsResponseBodyString = JSON.stringify({ confidentialMaterialId: "cm_dpp001_alloy_X1", materialName: "Proprietary Alloy X1" }, null, 2);
  const exampleZkpSubmitRequestBodyString = JSON.stringify({ claimType: "material_compliance_svhc_lead_less_0.1", proofData: "0xMockProofData...", publicInputs: { productBatchId: "BATCH123" }}, null, 2);
  const exampleZkpSubmitResponseBodyString = JSON.stringify({ dppId: "DPP001", proofId: "zkp_proof_mock_abc", status: "acknowledged" }, null, 2);
  const exampleZkpVerifyResponseBodyString = JSON.stringify({ dppId: "DPP001", claimType: "material_compliance_svhc_lead_less_0.1", isVerified: true, proofId: "zkp_proof_mock_abc" }, null, 2);
  
  const error400String = JSON.stringify({ error: { code: 400, message: "Invalid request payload or parameters." } }, null, 2);
  const error401String = JSON.stringify({ error: { code: 401, message: "API key missing or invalid." } }, null, 2);
  const error404String = JSON.stringify({ error: { code: 404, message: "Resource not found." } }, null, 2);
  const error500String = JSON.stringify({ error: { code: 500, message: "An unexpected error occurred on the server." } }, null, 2);

  return (
    <DocsPageLayout
      pageTitle="API Reference (Conceptual)"
      pageIcon="BookText"
      alertTitle="Conceptual Documentation"
      alertDescription="This API reference is conceptual and outlines how API endpoints for the Norruva DPP platform might be structured. Actual implementation details may vary."
    >
      <ApiReferenceIntro />
      <ApiReferenceDppEndpoints
        exampleListDppsResponse={exampleListDppsResponseString}
        exampleDppResponse={exampleDppResponseString}
        conceptualCreateDppRequestBody={conceptualCreateDppRequestBodyString}
        conceptualCreateDppResponseBody={conceptualCreateDppResponseBodyString}
        conceptualUpdateDppRequestBody={conceptualUpdateDppRequestBodyString}
        conceptualUpdateDppResponseBody={conceptualUpdateDppResponseBodyString}
        conceptualDeleteDppResponseBody={conceptualDeleteDppResponseBodyString}
        conceptualPatchDppExtendRequestBody={conceptualPatchDppExtendRequestBodyString}
        conceptualPatchDppExtendResponseBody={conceptualPatchDppExtendResponseBodyString}
        addLifecycleEventRequestBodyExample={addLifecycleEventRequestBodyExampleString}
        addLifecycleEventResponseExample={addLifecycleEventResponseExampleString}
        exampleUpdateOnChainStatusRequestBody={exampleUpdateOnChainStatusRequestBodyString}
        exampleUpdateOnChainLifecycleStageRequestBody={exampleUpdateOnChainLifecycleStageRequestBodyString}
        exampleLogCriticalEventRequestBody={exampleLogCriticalEventRequestBodyString}
        exampleRegisterVcHashRequestBody={exampleRegisterVcHashRequestBodyString}
        exampleUpdatedDppResponse={exampleUpdatedDppResponseString}
        error401={error401String}
        error404={error404String}
        error500={error500String}
        error400_create_dpp={JSON.stringify({ error: { code: 400, message: "Invalid request body. 'productName' and 'category' are required for creation." }}, null, 2)}
        error400_update_dpp={JSON.stringify({ error: { code: 400, message: "Invalid request body for update. Field 'metadata.status' has an invalid value." }}, null, 2)}
        error400_patch_dpp={JSON.stringify({ error: { code: 400, message: "Invalid input data. 'documentName', 'documentUrl', and 'documentType' are required." }}, null, 2)}
        error400_lifecycle_event={JSON.stringify({ error: { code: 400, message: "Field 'eventType' is required." }}, null, 2)}
        error400_general={error400String}
      />
      <BatchUpdateDpps 
        error400={error400String} 
        error401={error401String} 
        error500={error500String} 
      />
      <ExportDpps
        error400={error400String} 
        error401={error401String} 
        error404={error404String} 
        error500={error500String} 
      />
      <ApiReferenceTokenEndpoints
        mintRequest={mintTokenRequestBodyString}
        mintResponse={mintTokenResponseBodyString}
        updateRequest={updateTokenMetaRequestBodyString}
        updateResponse={updateTokenMetaResponseBodyString}
        statusResponse={getTokenStatusResponseBodyString}
        error401={error401String}
        error404={error404String}
        error500={error500String}
      />
      <ApiReferenceQrEndpoints
        exampleQrValidationResponse={qrValidationResponseExampleString}
        error400_qr={JSON.stringify({ error: { code: 400, message: "Invalid request body. 'qrIdentifier' is required." }}, null, 2)}
        error401={error401String}
        error404={error404String}
        error500={error500String}
      />
      <ApiReferenceComplianceEndpoints
        conceptualComplianceSummaryResponse={conceptualComplianceSummaryResponseString}
        conceptualVerifyDppResponse={conceptualVerifyDppResponseString}
        error401={error401String}
        error404={error404String}
        error500={error500String}
      />
      <ApiReferencePrivateLayerEndpoints
        exampleB2BComponentTransferRequestBody={exampleB2BComponentTransferRequestBodyString}
        exampleB2BComponentTransferResponseBody={exampleB2BComponentTransferResponseBodyString}
        exampleGetSupplierAttestationsResponseBody={exampleGetSupplierAttestationsResponseBodyString}
        exampleGetConfidentialMaterialsResponseBody={exampleGetConfidentialMaterialsResponseBodyString}
        error400General={error400String}
        error401={error401String}
        error404={error404String}
        error500={error500String}
      />
      <ApiReferenceZkpLayerEndpoints
        exampleZkpSubmitRequestBody={exampleZkpSubmitRequestBodyString}
        exampleZkpSubmitResponseBody={exampleZkpSubmitResponseBodyString}
        exampleZkpVerifyResponseBody={exampleZkpVerifyResponseBodyString}
        error400General={error400String}
        error401={error401String}
        error404={error404String}
        error500={error500String}
      />
    </DocsPageLayout>
  );
}

```
- workspace/src/components/developer/docs/ApiReferenceDppEndpoints.tsx:
```tsx
// --- File: src/components/developer/docs/api-reference/ApiReferenceDppEndpoints.tsx ---
"use client";

import { Server } from "lucide-react";
import {
  ListDigitalProductPassports,
  RetrieveDigitalProductPassport,
  CreateDigitalProductPassport,
  UpdateDigitalProductPassport,
  ExtendDigitalProductPassport,
  AddLifecycleEventToDpp,
  ArchiveDigitalProductPassport,
} from "./index"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

// This component itself is being refactored to no longer be a direct consumer of all these props.
// It will instead map over an array of endpoint definitions.
// The old props are kept here for reference during the transition.

interface EndpointDefinition {
  id: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  pathParams?: Array<{ name: string; type: string; required: boolean; description: string }>;
  queryParams?: Array<{ name: string; type: string; required: boolean; description: string; example?: string; enum?: string[]; default?: string }>;
  requestBodySchema?: string; // Name of the schema in OpenAPI
  requestBodyExample?: string;
  responseSchema?: string; // Name of the schema in OpenAPI
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
  exampleUpdateOnChainStatusRequestBody: string;
  exampleUpdateOnChainLifecycleStageRequestBody: string;
  exampleLogCriticalEventRequestBody: string;
  exampleRegisterVcHashRequestBody: string;
  exampleUpdatedDppResponse: string; 
  error401: string;
  error404: string;
  error500: string;
  error400_create_dpp: string;
  error400_update_dpp: string;
  error400_patch_dpp: string;
  error400_lifecycle_event: string;
  error400_general: string;
}

const EndpointDetailCard: React.FC<EndpointDefinition & { errorExamples: Record<string, string> }> = ({
  title, method, path, description, pathParams, queryParams, requestBodySchema, requestBodyExample, responseSchema, responseExample, commonErrors, errorExamples
}) => {
  const getBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-sky-100 text-sky-700 border-sky-300";
      case "POST": return "bg-green-100 text-green-700 border-green-300";
      case "PUT": return "bg-purple-100 text-purple-700 border-purple-300";
      case "PATCH": return "bg-orange-100 text-orange-700 border-orange-300";
      case "DELETE": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className={`${getBadgeClass(method)} mr-2 font-semibold`}>{method}</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">{path}</code>
          </span>
          <br />
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(pathParams && pathParams.length > 0) && (
          <section><h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {pathParams.map(p => <li key={p.name}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{p.name}</code> ({p.type}, {p.required ? 'required' : 'optional'}): {p.description}</li>)}
            </ul>
          </section>
        )}
        {(queryParams && queryParams.length > 0) && (
          <section><h4 className="font-semibold mb-1">Query Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {queryParams.map(p => <li key={p.name}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{p.name}</code> ({p.type}, {p.required ? 'required' : 'optional'}): {p.description} {p.example && `e.g., ${p.example}`} {p.default && `(Default: ${p.default})`}</li>)}
            </ul>
          </section>
        )}
        {requestBodyExample && (
          <section><h4 className="font-semibold mb-1">Request Body {requestBodySchema && `(${requestBodySchema})`}</h4>
            <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{requestBodyExample}</code></pre></details>
          </section>
        )}
        <section><h4 className="font-semibold mb-1">Example Response (Success 200 OK / 201 Created) {responseSchema && `(${responseSchema})`}</h4>
          <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
          <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{responseExample}</code></pre></details>
        </section>
        {(commonErrors && commonErrors.length > 0) && (
          <section><h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              {commonErrors.map(errCode => (
                <li key={errCode}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{errCode}</code>
                  {errorExamples[errCode] && (
                    <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{errorExamples[errCode]}</code></pre></details>
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


export default function ApiReferenceDppEndpoints(props: ApiReferenceDppEndpointsProps) {
  const dppEndpoints: EndpointDefinition[] = [
    { id: "listDpps", title: "List Digital Product Passports", method: "GET", path: "/api/v1/dpp", description: "Retrieves a list of DPPs, with optional filtering.", queryParams: [{ name: "status", type: "string", required: false, description: "Filter by DPP status.", enum: ["draft", "published", "archived", "all"], default: "all" }, { name: "category", type: "string", required: false, description: "Filter by product category." }, { name: "searchQuery", type: "string", required: false, description: "Search term for product name, ID, etc." }, { name: "blockchainAnchored", type: "string", required: false, description: "Filter by blockchain anchoring status.", enum: ["all", "anchored", "not_anchored"], default: "all" }], responseExample: props.exampleListDppsResponse, commonErrors: ["401", "500"] },
    { id: "retrieveDpp", title: "Retrieve a Digital Product Passport", method: "GET", path: "/api/v1/dpp/{productId}", description: "Fetches the complete DPP for a specific product.", pathParams: [{ name: "productId", type: "string", required: true, description: "The unique identifier of the product." }], responseExample: props.exampleDppResponse, responseSchema: "DigitalProductPassport", commonErrors: ["401", "404", "500"] },
    { id: "createDpp", title: "Create Digital Product Passport", method: "POST", path: "/api/v1/dpp", description: "Creates a new DPP.", requestBodySchema: "CreateDppRequestBody", requestBodyExample: props.conceptualCreateDppRequestBody, responseExample: props.conceptualCreateDppResponseBody, responseSchema: "DigitalProductPassport", commonErrors: ["400_create_dpp", "401", "500"] },
    { id: "updateDpp", title: "Update Digital Product Passport", method: "PUT", path: "/api/v1/dpp/{productId}", description: "Updates an existing DPP.", pathParams: [{ name: "productId", type: "string", required: true, description: "The ID of the DPP to update." }], requestBodySchema: "UpdateDppRequestBody", requestBodyExample: props.conceptualUpdateDppRequestBody, responseExample: props.conceptualUpdateDppResponseBody, responseSchema: "DigitalProductPassport", commonErrors: ["400_update_dpp", "401", "404", "500"] },
    { id: "extendDpp", title: "Extend Digital Product Passport", method: "PATCH", path: "/api/v1/dpp/extend/{productId}", description: "Adds document references or other modular data.", pathParams: [{ name: "productId", type: "string", required: true, description: "The ID of the DPP to extend." }], requestBodyExample: props.conceptualPatchDppExtendRequestBody, responseExample: props.conceptualPatchDppExtendResponseBody, responseSchema: "DigitalProductPassport", commonErrors: ["400_patch_dpp", "401", "404", "500"] },
    { id: "addLifecycleEvent", title: "Add Lifecycle Event to DPP", method: "POST", path: "/api/v1/dpp/{productId}/lifecycle-events", description: "Adds a new lifecycle event.", pathParams: [{ name: "productId", type: "string", required: true, description: "The ID of the product." }], requestBodyExample: props.addLifecycleEventRequestBodyExample, responseExample: props.addLifecycleEventResponseExample, responseSchema: "LifecycleEvent", commonErrors: ["400_lifecycle_event", "401", "404", "500"] },
    { id: "archiveDpp", title: "Archive Digital Product Passport", method: "DELETE", path: "/api/v1/dpp/{productId}", description: "Archives a DPP (soft delete).", pathParams: [{ name: "productId", type: "string", required: true, description: "The ID of the DPP to archive." }], responseExample: props.conceptualDeleteDppResponseBody, commonErrors: ["401", "404", "500"] },
    { id: "issueAuthVc", title: "Issue Authentication VC", method: "POST", path: "/api/v1/dpp/{productId}/issue-auth-vc", description: "Conceptually issues an authentication VC.", pathParams: [{name: "productId", type: "string", required: true, description: "Product ID."}], responseExample: props.exampleUpdatedDppResponse, commonErrors: ["401", "404", "500"] },
    { id: "linkNft", title: "Link Ownership NFT", method: "POST", path: "/api/v1/dpp/{productId}/link-nft", description: "Conceptually links an ownership NFT.", pathParams: [{name: "productId", type: "string", required: true, description: "Product ID."}], requestBodyExample: JSON.stringify({ contractAddress: "0x...", tokenId: "123"}), requestBodySchema: "OwnershipNftLinkRequestBody", responseExample: props.exampleUpdatedDppResponse, commonErrors: ["400", "401", "404", "500"] },
    { id: "updateOnChainStatus", title: "Update DPP On-Chain Status", method: "POST", path: "/api/v1/dpp/{productId}/onchain-status", description: "Conceptually updates on-chain status.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], requestBodySchema: "UpdateOnChainStatusRequest", requestBodyExample: props.exampleUpdateOnChainStatusRequestBody, responseExample: props.exampleUpdatedDppResponse, commonErrors: ["400", "401", "404", "500"] },
    { id: "updateOnChainLifecycle", title: "Update DPP On-Chain Lifecycle Stage", method: "POST", path: "/api/v1/dpp/{productId}/onchain-lifecycle-stage", description: "Conceptually updates on-chain lifecycle stage.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], requestBodySchema: "UpdateOnChainLifecycleStageRequest", requestBodyExample: props.exampleUpdateOnChainLifecycleStageRequestBody, responseExample: props.exampleUpdatedDppResponse, commonErrors: ["400", "401", "404", "500"] },
    { id: "logCriticalEvent", title: "Log Critical Event for DPP", method: "POST", path: "/api/v1/dpp/{productId}/log-critical-event", description: "Conceptually logs a critical event on-chain.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], requestBodySchema: "LogCriticalEventRequest", requestBodyExample: props.exampleLogCriticalEventRequestBody, responseExample: props.exampleUpdatedDppResponse, commonErrors: ["400", "401", "404", "500"] },
    { id: "registerVcHash", title: "Register Verifiable Credential Hash", method: "POST", path: "/api/v1/dpp/{productId}/register-vc-hash", description: "Conceptually registers a VC hash on-chain.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], requestBodySchema: "RegisterVcHashRequest", requestBodyExample: props.exampleRegisterVcHashRequestBody, responseExample: props.exampleUpdatedDppResponse, commonErrors: ["400", "401", "404", "500"] },
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
      {dppEndpoints.map(endpoint => (
        <EndpointDetailCard key={endpoint.id} {...endpoint} errorExamples={errorExamples} />
      ))}
    </section>
  );
}

ApiReferenceDppEndpoints.defaultProps = {
  error400_general: JSON.stringify({ error: { code: 400, message: "Invalid request body or parameters." } }, null, 2)
};

```
- workspace/src/components/developer/docs/api-reference/ApiReferenceQrEndpoints.tsx:
```tsx

// --- File: src/components/developer/docs/api-reference/ApiReferenceQrEndpoints.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server, QrCode } from "lucide-react"; // Added QrCode

interface EndpointDefinition {
  id: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  pathParams?: Array<{ name: string; type: string; required: boolean; description: string }>;
  requestBodySchema?: string;
  requestBodyExample?: string;
  responseSchema?: string;
  responseExample: string;
  responseContentType?: string; // For image/png
  commonErrors: Array<"400_qr" | "401" | "404" | "500" | string>;
}

interface ApiReferenceQrEndpointsProps {
  exampleQrValidationResponse: string;
  error400_qr: string;
  error401: string;
  error404: string;
  error500: string;
}

const EndpointDetailCard: React.FC<EndpointDefinition & { errorExamples: Record<string, string> }> = ({
  title, method, path, description, pathParams, requestBodySchema, requestBodyExample, responseSchema, responseExample, responseContentType, commonErrors, errorExamples
}) => {
  const getBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-sky-100 text-sky-700 border-sky-300";
      case "POST": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className={`${getBadgeClass(method)} mr-2 font-semibold`}>{method}</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">{path}</code>
          </span>
          <br />
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(pathParams && pathParams.length > 0) && (
          <section><h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {pathParams.map(p => <li key={p.name}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{p.name}</code> ({p.type}, {p.required ? 'required' : 'optional'}): {p.description}</li>)}
            </ul>
          </section>
        )}
        {requestBodyExample && (
          <section><h4 className="font-semibold mb-1">Request Body {requestBodySchema && `(${requestBodySchema})`}</h4>
            <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{requestBodyExample}</code></pre></details>
          </section>
        )}
        <section><h4 className="font-semibold mb-1">Example Response (Success 200 OK) {responseSchema && `(${responseSchema})`}</h4>
          {responseContentType && <p className="text-sm mb-1">Content-Type: <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{responseContentType}</code></p>}
          {responseContentType === 'image/png' ? (
            <p className="text-sm mb-1">Returns the QR code image directly.</p>
          ) : (
            <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{responseExample}</code></pre></details>
          )}
        </section>
        {(commonErrors && commonErrors.length > 0) && (
          <section><h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              {commonErrors.map(errCode => (
                <li key={errCode}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{errCode.split('_')[0]} {errCode.includes('_') ? errCode.split('_')[1].toUpperCase() : 'Bad Request'}</code>
                  {errorExamples[errCode] && (
                    <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{errorExamples[errCode]}</code></pre></details>
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


export default function ApiReferenceQrEndpoints({
  exampleQrValidationResponse,
  error400_qr,
  error401,
  error404,
  error500,
}: ApiReferenceQrEndpointsProps) {
  const qrEndpoints: EndpointDefinition[] = [
    { id: "validateQr", title: "Validate QR Code & Retrieve DPP Summary", method: "POST", path: "/api/v1/qr/validate", description: "Validates a unique identifier (typically from a QR code) and retrieves a summary of the product passport.", requestBodySchema: "QrValidateRequestBody", requestBodyExample: JSON.stringify({ qrIdentifier: "DPP001" }, null, 2), responseExample: exampleQrValidationResponse, commonErrors: ["400_qr", "401", "404", "500"] },
    { id: "generateQrJson", title: "Generate QR Code (JSON Response)", method: "GET", path: "/api/v1/qr/generate/{productId}", description: "Returns JSON containing a data URL for a PNG QR code image that links to the product's public passport.", pathParams: [{name: "productId", type: "string", required: true, description: "Unique product ID."}], responseExample: JSON.stringify({ qrCode: "data:image/png;base64,...", productId: "DPP001", linksTo: "/passport/DPP001" }, null, 2), responseSchema: "QrGenerateResponse", commonErrors: ["401", "404", "500"] },
    { id: "getQrImage", title: "Get QR Code Image", method: "GET", path: "/api/v1/qr/{productId}", description: "Returns a QR code image directly, linking to the public passport.", pathParams: [{name: "productId", type: "string", required: true, description: "Unique product ID."}], responseExample: "(Binary image data)", responseContentType: "image/png", commonErrors: ["404", "500"] }
  ];
  
  const errorExamples: Record<string, string> = {
    "400_qr": error400_qr,
    "401": error401,
    "404": error404,
    "500": error500,
  };

  return (
    <section id="qr-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <QrCode className="mr-3 h-6 w-6 text-primary" /> QR Code & Validation Endpoints
      </h2>
      {qrEndpoints.map(endpoint => (
        <EndpointDetailCard key={endpoint.id} {...endpoint} errorExamples={errorExamples} />
      ))}
    </section>
  );
}


```
- workspace/src/components/developer/docs/api-reference/ApiReferenceTokenEndpoints.tsx:
```tsx

// --- File: src/components/developer/docs/api-reference/ApiReferenceTokenEndpoints.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server, KeyRound } from "lucide-react"; // Changed icon to KeyRound

interface EndpointDefinition {
  id: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  pathParams?: Array<{ name: string; type: string; required: boolean; description: string }>;
  requestBodySchema?: string;
  requestBodyExample?: string;
  responseSchema?: string;
  responseExample: string;
  commonErrors: Array<"401" | "404" | "500" | string>;
}

interface ApiReferenceTokenEndpointsProps {
  mintRequest: string;
  mintResponse: string;
  updateRequest: string;
  updateResponse: string;
  statusResponse: string;
  error401: string;
  error404: string;
  error500: string;
}

const EndpointDetailCard: React.FC<EndpointDefinition & { errorExamples: Record<string, string> }> = ({
  title, method, path, description, pathParams, requestBodySchema, requestBodyExample, responseSchema, responseExample, commonErrors, errorExamples
}) => {
  const getBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-sky-100 text-sky-700 border-sky-300";
      case "POST": return "bg-green-100 text-green-700 border-green-300";
      case "PATCH": return "bg-orange-100 text-orange-700 border-orange-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className={`${getBadgeClass(method)} mr-2 font-semibold`}>{method}</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">{path}</code>
          </span>
          <br />
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(pathParams && pathParams.length > 0) && (
          <section><h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {pathParams.map(p => <li key={p.name}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{p.name}</code> ({p.type}, {p.required ? 'required' : 'optional'}): {p.description}</li>)}
            </ul>
          </section>
        )}
        {requestBodyExample && (
          <section><h4 className="font-semibold mb-1">Request Body {requestBodySchema && `(${requestBodySchema})`}</h4>
            <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{requestBodyExample}</code></pre></details>
          </section>
        )}
        <section><h4 className="font-semibold mb-1">Example Response (Success) {responseSchema && `(${responseSchema})`}</h4>
          <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
          <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{responseExample}</code></pre></details>
        </section>
        {(commonErrors && commonErrors.length > 0) && (
          <section><h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              {commonErrors.map(errCode => (
                <li key={errCode}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{errCode.split('_')[0]} {errCode.includes('_') ? errCode.split('_')[1].toUpperCase() : 'Bad Request'}</code>
                  {errorExamples[errCode] && (
                    <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{errorExamples[errCode]}</code></pre></details>
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


export default function ApiReferenceTokenEndpoints({
  mintRequest,
  mintResponse,
  updateRequest,
  updateResponse,
  statusResponse,
  error401,
  error404,
  error500,
}: ApiReferenceTokenEndpointsProps) {
  const tokenEndpoints: EndpointDefinition[] = [
    { id: "mintDppToken", title: "Mint DPP Token", method: "POST", path: "/api/v1/token/mint/{productId}", description: "Mints a blockchain token representing the specified DPP.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], requestBodySchema: "MintTokenRequest", requestBodyExample: mintRequest, responseSchema: "MintTokenResponse", responseExample: mintResponse, commonErrors: ["401", "404", "500"] },
    { id: "updateTokenMetadata", title: "Update Token Metadata", method: "PATCH", path: "/api/v1/token/metadata/{tokenId}", description: "Updates the on-chain metadata URI for a minted DPP token.", pathParams: [{ name: "tokenId", type: "string", required: true, description: "Blockchain token ID." }], requestBodySchema: "UpdateTokenMetadataRequest", requestBodyExample: updateRequest, responseSchema: "UpdateTokenMetadataResponse", responseExample: updateResponse, commonErrors: ["401", "404", "500"] },
    { id: "getTokenStatus", title: "Retrieve Token On-Chain Status", method: "GET", path: "/api/v1/token/status/{tokenId}", description: "Retrieves on-chain information for a DPP token.", pathParams: [{ name: "tokenId", type: "string", required: true, description: "Blockchain token ID." }], responseSchema: "TokenStatusResponse", responseExample: statusResponse, commonErrors: ["401", "404", "500"] }
  ];
  
  const errorExamples: Record<string, string> = { "401": error401, "404": error404, "500": error500 };

  return (
    <section id="token-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <KeyRound className="mr-3 h-6 w-6 text-primary" /> DPP Token Endpoints (Conceptual)
      </h2>
      {tokenEndpoints.map(endpoint => (
        <EndpointDetailCard key={endpoint.id} {...endpoint} errorExamples={errorExamples} />
      ))}
    </section>
  );
}

```
- workspace/src/components/developer/docs/api-reference/ApiReferenceZkpLayerEndpoints.tsx:
```tsx

// --- File: src/components/developer/docs/api-reference/ApiReferenceZkpLayerEndpoints.tsx ---
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Zap, Layers3, KeyRound } from "lucide-react"; // Replaced Server with Zap for this section

interface EndpointDefinition {
  id: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  pathParams?: Array<{ name: string; type: string; required: boolean; description: string }>;
  queryParams?: Array<{ name: string; type: string; required: boolean; description: string; example?: string }>;
  requestBodySchema?: string;
  requestBodyExample?: string;
  responseSchema?: string;
  responseExample: string;
  commonErrors: Array<"400" | "401" | "404" | "500" | string>; // Added "400"
}

interface ApiReferenceZkpLayerEndpointsProps {
  exampleZkpSubmitRequestBody: string;
  exampleZkpSubmitResponseBody: string;
  exampleZkpVerifyResponseBody: string;
  error400General: string;
  error401: string;
  error404: string;
  error500: string;
}

const EndpointDetailCard: React.FC<EndpointDefinition & { errorExamples: Record<string, string> }> = ({
  title, method, path, description, pathParams, queryParams, requestBodySchema, requestBodyExample, responseSchema, responseExample, commonErrors, errorExamples
}) => {
  const getBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-sky-100 text-sky-700 border-sky-300";
      case "POST": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className={`${getBadgeClass(method)} mr-2 font-semibold`}>{method}</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">{path}</code>
          </span>
          <br />
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(pathParams && pathParams.length > 0) && (
          <section><h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {pathParams.map(p => <li key={p.name}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{p.name}</code> ({p.type}, {p.required ? 'required' : 'optional'}): {p.description}</li>)}
            </ul>
          </section>
        )}
        {(queryParams && queryParams.length > 0) && (
          <section><h4 className="font-semibold mb-1">Query Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {queryParams.map(p => <li key={p.name}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{p.name}</code> ({p.type}, {p.required ? 'required' : 'optional'}): {p.description} {p.example && `(e.g., ${p.example})`}</li>)}
            </ul>
          </section>
        )}
        {requestBodyExample && (
          <section><h4 className="font-semibold mb-1">Request Body {requestBodySchema && `(${requestBodySchema})`}</h4>
            <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{requestBodyExample}</code></pre></details>
          </section>
        )}
        <section><h4 className="font-semibold mb-1">Example Response (Success) {responseSchema && `(${responseSchema})`}</h4>
          <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
          <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{responseExample}</code></pre></details>
        </section>
        {(commonErrors && commonErrors.length > 0) && (
          <section><h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              {commonErrors.map(errCode => (
                <li key={errCode}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{errCode.split('_')[0]} {errCode.includes('_') ? errCode.split('_')[1].toUpperCase() : 'Bad Request'}</code>
                  {errorExamples[errCode] && (
                    <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{errorExamples[errCode]}</code></pre></details>
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


export default function ApiReferenceZkpLayerEndpoints({
  exampleZkpSubmitRequestBody,
  exampleZkpSubmitResponseBody,
  exampleZkpVerifyResponseBody,
  error400General,
  error401,
  error404,
  error500,
}: ApiReferenceZkpLayerEndpointsProps) {

  const zkpEndpoints: EndpointDefinition[] = [
    { id: "submitZkp", title: "Submit Zero-Knowledge Proof for a DPP", method: "POST", path: "/api/v1/zkp/submit-proof/{dppId}", description: "[ZKP Layer - Highly Conceptual] Allows a prover to submit a ZKP related to a specific DPP.", pathParams: [{ name: "dppId", type: "string", required: true, description: "DPP ID." }], requestBodySchema: "ZkpSubmissionRequest", requestBodyExample: exampleZkpSubmitRequestBody, responseSchema: "ZkpSubmissionResponse", responseExample: exampleZkpSubmitResponseBody, commonErrors: ["400", "401", "404", "500"] },
    { id: "verifyZkpClaim", title: "Verify Claim with ZKP for a DPP", method: "GET", path: "/api/v1/zkp/verify-claim/{dppId}", description: "[ZKP Layer - Highly Conceptual] Allows a verifier to check if a claim for a DPP has a valid ZKP.", pathParams: [{ name: "dppId", type: "string", required: true, description: "DPP ID." }], queryParams: [{ name: "claimType", type: "string", required: true, description: "Type of claim to verify.", example: "material_compliance_svhc_x" }], responseSchema: "ZkpVerificationResponse", responseExample: exampleZkpVerifyResponseBody, commonErrors: ["400", "401", "404", "500"] },
  ];
  
  const errorExamples: Record<string, string> = { "400": error400General, "401": error401, "404": error404, "500": error500 };

  return (
    <section id="zkp-layer-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Zap className="mr-3 h-6 w-6 text-primary" /> Zero-Knowledge Proof Layer Endpoints (Conceptual)
      </h2>
      {zkpEndpoints.map(endpoint => (
        <EndpointDetailCard key={endpoint.id} {...endpoint} errorExamples={errorExamples} />
      ))}
    </section>
  );
}

```
- workspace/src/components/developer/docs/api-reference/index.ts:
```tsx

// --- File: src/components/developer/docs/api-reference/index.ts ---
// This file serves as a barrel for exporting API reference components.
// Individual endpoint detail components will be defined within their group components (e.g., ApiReferenceDppEndpoints.tsx)
// or a new generic EndpointDetailCard component if the refactor leads to that.

// For now, ensure existing exports are maintained if they are still directly used.
// If refactoring consolidates them, this file might become simpler or export only the group components.

export { default as ListDigitalProductPassports } from './ListDigitalProductPassports';
export { default as RetrieveDigitalProductPassport } from './RetrieveDigitalProductPassport';
export { default as CreateDigitalProductPassport } from './CreateDigitalProductPassport';
export { default as UpdateDigitalProductPassport } from './UpdateDigitalProductPassport';
export { default as ExtendDigitalProductPassport } from './ExtendDigitalProductPassport';
export { default as AddLifecycleEventToDpp } from './AddLifecycleEventToDpp';
export { default as ArchiveDigitalProductPassport } from './ArchiveDigitalProductPassport';

// Export new conceptual batch operation components
export { default as BatchUpdateDpps } from './BatchUpdateDpps';
export { default as ExportDpps } from './ExportDpps';


```
- workspace/src/utils/imageUtils.ts:
```ts

// --- File: src/utils/imageUtils.ts ---
// Description: Utility functions related to image handling and generation.


interface ProductImageHintInfo {
  productName?: string | null;
  category?: string | null;
  imageHint?: string | null;
}

/**
 * Generates a concise AI hint for image search based on product information.
 * Prioritizes imageHint, then productName, then category.
 * Returns a maximum of two keywords.
 * @param product - Object containing productName, category, and imageHint.
 * @returns A string to be used as data-ai-hint for images.
 */
export function getAiHintForImage(product: ProductImageHintInfo): string {
  if (product.imageHint && product.imageHint.trim()) {
    // Return only the first two words of the user-provided hint
    return product.imageHint.trim().split(/\s+/).slice(0, 2).join(" ");
  }
  if (product.productName && product.productName.trim()) {
    const nameWords = product.productName.trim().toLowerCase().split(/\s+/);
    if (nameWords.length === 1) return nameWords[0];
    // Try to pick relevant words if category is also present
    if (product.category && product.category.trim()) {
        const catWords = product.category.trim().toLowerCase().split(/\s+/);
        if (catWords.length > 0 && nameWords.some(nw => catWords.includes(nw))) {
            // If product name contains category, just use product name (first two words)
             return nameWords.slice(0, 2).join(" ");
        }
        // Otherwise, combine one word from name and one from category if possible
        const firstWordName = nameWords[0];
        const firstWordCat = catWords[0];
        if (firstWordName !== firstWordCat) { // Avoid "phone phone"
            return `${firstWordName} ${firstWordCat}`;
        }
        return firstWordName; // Fallback if they are the same
    }
    return nameWords.slice(0, 2).join(" ");
  }
  if (product.category && product.category.trim()) {
    return product.category.trim().toLowerCase().split(/\s+/)[0];
  }
  return "product photo"; // Default fallback
}

```
- workspace/src/utils/productDetailUtils.ts:
```ts

// --- File: src/utils/productDetailUtils.ts ---
// Description: Utilities for fetching and preparing product details for display.


import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, StoredUserProduct, SimpleProductDetail, ComplianceDetailItem, EbsiVerificationDetails, CustomAttribute, SimpleCertification, Certification, ScipNotificationDetails, EuCustomsDataDetails, BatteryRegulationDetails, EsprSpecifics, DigitalTwinData } from '@/types/dpp';
import { getOverallComplianceDetails } from '@/utils/dppDisplayUtils';

// Helper function to map DigitalProductPassport to SimpleProductDetail
function mapDppToSimpleProductDetail(dpp: DigitalProductPassport): SimpleProductDetail {
    const mapStatus = (status: DigitalProductPassport['metadata']['status']): SimpleProductDetail['status'] => {
        switch (status) {
            case 'published': return 'Active';
            case 'archived': return 'Archived';
            case 'pending_review': return 'Pending';
            case 'draft': return 'Draft';
            case 'revoked': return 'Archived'; // Consider revoked as archived for simple view
            case 'flagged': return 'Flagged'; // Added Flagged status
            default: return 'Draft';
        }
    };

    const specificRegulations: ComplianceDetailItem[] = [];
    
    if (dpp.compliance.eu_espr) {
        specificRegulations.push({
            regulationName: "EU ESPR",
            status: dpp.compliance.eu_espr.status as ComplianceDetailItem['status'],
            detailsUrl: dpp.compliance.eu_espr.reportUrl,
            verificationId: dpp.compliance.eu_espr.vcId,
            lastChecked: dpp.metadata.last_updated, 
        });
    }
    if (dpp.compliance.esprConformity) {
         specificRegulations.push({
            regulationName: "ESPR Conformity Assessment",
            status: dpp.compliance.esprConformity.status as ComplianceDetailItem['status'],
            verificationId: dpp.compliance.esprConformity.assessmentId || dpp.compliance.esprConformity.vcId,
            lastChecked: dpp.compliance.esprConformity.assessmentDate || dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.us_scope3) {
        specificRegulations.push({
            regulationName: "US Scope 3 Emissions",
            status: dpp.compliance.us_scope3.status as ComplianceDetailItem['status'],
            detailsUrl: dpp.compliance.us_scope3.reportUrl,
            verificationId: dpp.compliance.us_scope3.vcId,
            lastChecked: dpp.metadata.last_updated, 
        });
    }

    const complianceOverallStatusDetails = getOverallComplianceDetails(dpp);
    
    const customAttributes = dpp.productDetails?.customAttributes || [];
    const mappedCertifications: SimpleCertification[] = dpp.certifications?.map(cert => ({
        id: cert.id, 
        name: cert.name,
        authority: cert.issuer,
        standard: cert.standard,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        documentUrl: cert.documentUrl,
        isVerified: !!(cert.vcId || cert.transactionHash),
        vcId: cert.vcId,
        transactionHash: cert.transactionHash,
    })) || [];

    return {
        id: dpp.id,
        productName: dpp.productName,
        category: dpp.category,
        status: mapStatus(dpp.metadata.status),
        manufacturer: dpp.manufacturer?.name,
        gtin: dpp.gtin,
        modelNumber: dpp.modelNumber,
        sku: dpp.sku,
        nfcTagId: dpp.nfcTagId,
        rfidTagId: dpp.rfidTagId,
        description: dpp.productDetails?.description,
        imageUrl: dpp.productDetails?.imageUrl,
        imageHint: dpp.productDetails?.imageHint,
        keySustainabilityPoints: dpp.productDetails?.sustainabilityClaims?.map(c => c.claim).filter(Boolean) || [],
        keyCompliancePoints: dpp.productDetails?.keyCompliancePoints, 
        specifications: dpp.productDetails?.specifications,
        customAttributes: customAttributes,
        productDetails: { 
            esprSpecifics: dpp.productDetails?.esprSpecifics,
            carbonFootprint: dpp.productDetails?.carbonFootprint,
            digitalTwin: dpp.productDetails?.digitalTwin,
            conflictMineralsReportUrl: dpp.productDetails?.conflictMineralsReportUrl,
            fairTradeCertificationId: dpp.productDetails?.fairTradeCertificationId,
            ethicalSourcingPolicyUrl: dpp.productDetails?.ethicalSourcingPolicyUrl,
        },
        complianceSummary: {
            overallStatus: complianceOverallStatusDetails.text,
            eprel: dpp.compliance.eprel ? {
                id: dpp.compliance.eprel.id,
                status: dpp.compliance.eprel.status,
                url: dpp.compliance.eprel.url,
                lastChecked: dpp.compliance.eprel.lastChecked,
            } : { status: 'N/A', lastChecked: new Date().toISOString() },
            ebsi: dpp.ebsiVerification ? {
                status: dpp.ebsiVerification.status,
                verificationId: dpp.ebsiVerification.verificationId,
                lastChecked: dpp.ebsiVerification.lastChecked,
            } : { status: 'N/A', lastChecked: new Date().toISOString() },
            scip: dpp.compliance.scipNotification, 
            euCustomsData: dpp.compliance.euCustomsData, 
            battery: dpp.compliance.battery_regulation,
            specificRegulations: specificRegulations,
        },
        lifecycleEvents: dpp.lifecycleEvents?.map(event => ({
            id: event.id,
            eventName: event.type,
            date: event.timestamp,
            location: event.location,
            notes: event.data ? `Data: ${JSON.stringify(event.data)}` : (event.responsibleParty ? `Responsible: ${event.responsibleParty}` : undefined),
            status: event.transactionHash ? 'Completed' : (event.type.toLowerCase().includes('schedul') || event.type.toLowerCase().includes('upcoming') ? 'Upcoming' : 'In Progress'),
            iconName: event.type.toLowerCase().includes('manufactur') ? 'Factory' :
                      event.type.toLowerCase().includes('ship') ? 'Truck' :
                      event.type.toLowerCase().includes('quality') || event.type.toLowerCase().includes('certif') ? 'ShieldCheck' :
                      event.type.toLowerCase().includes('sale') || event.type.toLowerCase().includes('sold') ? 'ShoppingCart' :
                      'Info',
        })) || [],
        materialsUsed: dpp.productDetails?.materials?.map(m => ({ name: m.name, percentage: m.percentage, source: m.origin, isRecycled: m.isRecycled })),
        energyLabelRating: dpp.productDetails?.energyLabel,
        repairability: dpp.productDetails?.repairabilityScore ? { score: dpp.productDetails.repairabilityScore.value, scale: dpp.productDetails.repairabilityScore.scale, detailsUrl: dpp.productDetails.repairabilityScore.reportUrl } : undefined,
        recyclabilityInfo: dpp.productDetails?.recyclabilityInformation ? { percentage: dpp.productDetails.recyclabilityInformation.recycledContentPercentage, instructionsUrl: dpp.productDetails.recyclabilityInformation.instructionsUrl } : undefined,
        supplyChainLinks: dpp.supplyChainLinks || [],
        certifications: mappedCertifications,
        authenticationVcId: dpp.authenticationVcId,
        ownershipNftLink: dpp.ownershipNftLink,
        blockchainPlatform: dpp.blockchainIdentifiers?.platform,
        contractAddress: dpp.blockchainIdentifiers?.contractAddress,
        tokenId: dpp.blockchainIdentifiers?.tokenId,
        anchorTransactionHash: dpp.blockchainIdentifiers?.anchorTransactionHash,
        ebsiStatus: dpp.ebsiVerification?.status, 
        ebsiVerificationId: dpp.ebsiVerification?.verificationId, 
        onChainStatus: dpp.metadata.onChainStatus,
        onChainLifecycleStage: dpp.metadata.onChainLifecycleStage,
        textileInformation: dpp.textileInformation, 
        constructionProductInformation: dpp.constructionProductInformation, 
        batteryRegulation: dpp.compliance.battery_regulation, 
        lastUpdated: dpp.metadata.last_updated,
        conflictMineralsReportUrl: dpp.productDetails?.conflictMineralsReportUrl, 
        fairTradeCertificationId: dpp.productDetails?.fairTradeCertificationId, 
        ethicalSourcingPolicyUrl: dpp.productDetails?.ethicalSourcingPolicyUrl, 
    };
}


export async function fetchProductDetails(productId: string): Promise<SimpleProductDetail | null> {
  await new Promise(resolve => setTimeout(resolve, 0)); 

  const storedProductsString = typeof window !== 'undefined' ? localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY) : null;
  if (storedProductsString) {
    const userProducts: StoredUserProduct[] = JSON.parse(storedProductsString);
    const userProductData = userProducts.find(p => p.id === productId);
    if (userProductData) {
      let parsedCustomAttributes: CustomAttribute[] = [];
      if (userProductData.productDetails?.customAttributesJsonString) { 
          try {
              const parsed = JSON.parse(userProductData.productDetails.customAttributesJsonString);
              if (Array.isArray(parsed)) parsedCustomAttributes = parsed;
          } catch (e) { console.error("Failed to parse customAttributesJsonString from localStorage for USER_PROD:", e); }
      }
      const certificationsForUserProd: Certification[] = userProductData.certifications?.map(sc => ({
          id: sc.id || `cert_user_${sc.name.replace(/\s+/g, '_')}_${Math.random().toString(36).slice(2, 7)}`,
          name: sc.name,
          issuer: sc.authority,
          issueDate: sc.issueDate,
          expiryDate: sc.expiryDate,
          documentUrl: sc.documentUrl,
          standard: sc.standard,
          vcId: sc.vcId,
          transactionHash: sc.transactionHash,
      })) || [];
      
      const complianceSummaryFromStorage = userProductData.complianceSummary || { overallStatus: 'N/A' as SimpleProductDetail['complianceSummary']['overallStatus'] };
      const ebsiFromStorage = complianceSummaryFromStorage.ebsi;

      const dppEquivalent: DigitalProductPassport = {
        id: userProductData.id,
        productName: userProductData.productName || "N/A",
        category: userProductData.productCategory || "N/A",
        manufacturer: userProductData.manufacturer ? { name: userProductData.manufacturer } : undefined,
        modelNumber: userProductData.modelNumber,
        sku: userProductData.sku,
        nfcTagId: userProductData.nfcTagId,
        rfidTagId: userProductData.rfidTagId,
        gtin: userProductData.gtin,
        metadata: {
          status: (userProductData.status?.toLowerCase() as DigitalProductPassport['metadata']['status']) || 'draft',
          last_updated: userProductData.lastUpdated || new Date().toISOString(),
          created_at: userProductData.metadata?.created_at || userProductData.lastUpdated || new Date().toISOString(),
          onChainStatus: userProductData.metadata?.onChainStatus,
          onChainLifecycleStage: userProductData.metadata?.onChainLifecycleStage,
          dppStandardVersion: userProductData.metadata?.dppStandardVersion,
        },
        productDetails: {
          description: userProductData.productDetails?.description, 
          imageUrl: userProductData.productDetails?.imageUrl,
          imageHint: userProductData.productDetails?.imageHint,
          sustainabilityClaims: userProductData.productDetails?.sustainabilityClaims?.split('\n').map(s => ({ claim: s.trim() })).filter(c => c.claim) || [],
          keyCompliancePoints: userProductData.productDetails?.keyCompliancePoints, 
          materials: userProductData.productDetails?.materials?.split(',').map(m => ({ name: m.trim() })) || [],
          energyLabel: userProductData.productDetails?.energyLabel,
          specifications: userProductData.productDetails?.specifications,
          customAttributes: parsedCustomAttributes,
          conflictMineralsReportUrl: userProductData.productDetails?.conflictMineralsReportUrl, 
          fairTradeCertificationId: userProductData.productDetails?.fairTradeCertificationId, 
          ethicalSourcingPolicyUrl: userProductData.productDetails?.ethicalSourcingPolicyUrl, 
          esprSpecifics: userProductData.productDetails?.esprSpecifics,
          carbonFootprint: userProductData.productDetails?.carbonFootprint,
          digitalTwin: userProductData.productDetails?.digitalTwin, 
        },
        compliance: { 
          eprel: userProductData.complianceData?.eprel || complianceSummaryFromStorage.eprel,
          scipNotification: userProductData.complianceData?.scipNotification || complianceSummaryFromStorage.scip,
          euCustomsData: userProductData.complianceData?.euCustomsData || complianceSummaryFromStorage.euCustomsData,
          battery_regulation: userProductData.complianceData?.battery_regulation || userProductData.batteryRegulation || complianceSummaryFromStorage.battery,
          esprConformity: userProductData.complianceData?.esprConformity,
        },
        ebsiVerification: ebsiFromStorage ? {
          status: ebsiFromStorage.status as EbsiVerificationDetails['status'],
          verificationId: ebsiFromStorage.verificationId,
          lastChecked: ebsiFromStorage.lastChecked,
        } : undefined,
        lifecycleEvents: userProductData.lifecycleEvents?.map(e => ({
          id: e.id,
          type: e.eventName,
          timestamp: e.date,
          location: e.location,
          data: e.notes ? { notes: e.notes } : undefined,
        })),
        certifications: certificationsForUserProd,
        supplyChainLinks: userProductData.supplyChainLinks || [],
        authenticationVcId: userProductData.authenticationVcId, 
        ownershipNftLink: userProductData.ownershipNftLink, 
        blockchainIdentifiers: userProductData.blockchainIdentifiers,
        textileInformation: userProductData.textileInformation,
        constructionProductInformation: userProductData.constructionProductInformation,
      };
      return mapDppToSimpleProductDetail(dppEquivalent);
    }
  }

  let canonicalLookupId = productId;
  if (productId.startsWith("PROD") && !productId.startsWith("USER_PROD")) {
    canonicalLookupId = productId.replace("PROD", "DPP");
  }
  
  const foundMockDpp = MOCK_DPPS.find(dpp => dpp.id === canonicalLookupId);
  if (foundMockDpp) {
    return mapDppToSimpleProductDetail(foundMockDpp);
  }
  
  if (productId !== canonicalLookupId) {
    const foundMockDppOriginalId = MOCK_DPPS.find(dpp => dpp.id === productId);
    if (foundMockDppOriginalId) {
      return mapDppToSimpleProductDetail(foundMockDppOriginalId);
    }
  }

  return null;
}
```
- workspace/src/utils/registerServiceWorker.ts:
```ts

// --- File: src/utils/registerServiceWorker.ts ---
// Description: Utility function to register the service worker.

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('[Norruva PWA] Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('[Norruva PWA] Service Worker registration failed:', error);
        });
    });
  } else if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV !== 'production') {
    // In development, unregister any existing service workers to avoid caching issues
    // that might interfere with HMR or displaying the latest changes.
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
        console.log('[Norruva PWA Dev] Unregistered existing service worker.', registration);
      }
    });
  }
}
```
```
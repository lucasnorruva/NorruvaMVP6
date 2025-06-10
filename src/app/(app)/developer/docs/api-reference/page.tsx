
import { BookText } from "lucide-react";
import { MOCK_DPPS } from "@/types/dpp";
import DocsPageLayout from '@/components/developer/DocsPageLayout';
import ApiReferenceIntro from '@/components/developer/docs/ApiReferenceIntro';
import ApiReferenceDppEndpoints from '@/components/developer/docs/ApiReferenceDppEndpoints';
import ApiReferenceQrEndpoints from '@/components/developer/docs/ApiReferenceQrEndpoints';
import ApiReferenceComplianceEndpoints from '@/components/developer/docs/ApiReferenceComplianceEndpoints';

export default function ApiReferencePage() {
  const exampleDppResponse = JSON.stringify(MOCK_DPPS[0], null, 2);

  const exampleListDppsResponse = JSON.stringify({
    data: [
      MOCK_DPPS.find(dpp => dpp.id === "DPP001") || MOCK_DPPS[0],
    ],
    filtersApplied: {
      status: "published",
      category: "Electronics",
      blockchainAnchored: "all",
      searchQuery: "EcoSmart"
    },
    totalCount: 1
  }, null, 2);


  const qrValidationResponseExample = {
    productId: MOCK_DPPS[0].id,
    productName: MOCK_DPPS[0].productName,
    category: MOCK_DPPS[0].category,
    manufacturer: MOCK_DPPS[0].manufacturer?.name || "N/A",
    verificationStatus: "valid_dpp_found", 
    dppUrl: `/passport/${MOCK_DPPS[0].id}`,
    ebsiCompliance: {
      status: MOCK_DPPS[0].ebsiVerification?.status || "unknown",
      verificationId: MOCK_DPPS[0].ebsiVerification?.verificationId
    },
    blockchainAnchor: {
      transactionHash: MOCK_DPPS[0].blockchainIdentifiers?.anchorTransactionHash,
      platform: MOCK_DPPS[0].blockchainIdentifiers?.platform
    }
  };
  const exampleQrValidationResponse = JSON.stringify(qrValidationResponseExample, null, 2);

  const error401 = JSON.stringify({ error: { code: 401, message: "API key missing or invalid." } }, null, 2);
  const error404 = JSON.stringify({ error: { code: 404, message: "Resource not found." } }, { status: 404 }); 
  const error400_general = JSON.stringify({ error: { code: 400, message: "Invalid request payload or parameters." } }, null, 2);
  const error400_qr = JSON.stringify({ error: { code: 400, message: "Invalid request body. 'qrIdentifier' is required." } }, null, 2);
  const error500 = JSON.stringify({ error: { code: 500, message: "An unexpected error occurred on the server." } }, null, 2);

  const conceptualCreateDppRequestBody = JSON.stringify({
    productName: "Sustainable Smart Watch Series 5",
    category: "Wearable Technology",
    gtin: "09876543210123",
    manufacturerName: "FutureGadgets Inc.",
    modelNumber: "SW-S5-ECO",
    productDetails: {
      description: "The latest smart watch with a focus on sustainability, featuring a recycled aluminum case and energy-efficient display.",
      materials: [
        { name: "Recycled Aluminum (Case)", percentage: 80, isRecycled: true },
        { name: "Organic Polymer (Strap)", percentage: 20 }
      ],
      energyLabel: "A",
      customAttributes: [
        { "key": "Display Type", "value": "AMOLED" },
        { "key": "OS", "value": "WearOS" }
      ]
    }
  }, null, 2);

  const conceptualCreateDppResponseBody = JSON.stringify({
    id: "DPP_API_12345", 
    version: 1,
    productName: "Sustainable Smart Watch Series 5",
    category: "Wearable Technology",
    gtin: "09876543210123",
    manufacturer: { name: "FutureGadgets Inc." },
    modelNumber: "SW-S5-ECO",
    metadata: {
      created_at: new Date().toISOString(), 
      last_updated: new Date().toISOString(),
      status: "draft", 
      dppStandardVersion: MOCK_DPPS[0]?.metadata?.dppStandardVersion || "CIRPASS v1.0 Draft"
    },
    productDetails: {
      description: "The latest smart watch with a focus on sustainability, featuring a recycled aluminum case and energy-efficient display.",
      materials: [
        { name: "Recycled Aluminum (Case)", percentage: 80, isRecycled: true },
        { name: "Organic Polymer (Strap)", percentage: 20 }
      ],
      energyLabel: "A",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "smart watch wearable",
      customAttributes: [
        { "key": "Display Type", "value": "AMOLED" },
        { "key": "OS", "value": "WearOS" }
      ]
    },
    compliance: { battery_regulation: { status: "not_applicable" } },
    ebsiVerification: { status: "pending_verification", lastChecked: new Date().toISOString() },
    lifecycleEvents: [],
    certifications: [],
    supplyChainLinks: []
  }, null, 2);

  const conceptualUpdateDppRequestBody = JSON.stringify({
    productDetails: {
      description: "The latest smart watch with a focus on sustainability, featuring a recycled aluminum case, energy-efficient display, and enhanced battery life.",
      sustainabilityClaims: [
        { claim: "Made with 80% recycled aluminum", verificationDetails: "Verified by GreenCert" }
      ],
      customAttributes: [
        { "key": "Display Type", "value": "AMOLED" },
        { "key": "OS", "value": "WearOS Pro" },
        { "key": "Water Resistance", "value": "5 ATM" }
      ]
    },
    metadata: {
      status: "pending_review"
    }
  }, null, 2);

  const conceptualUpdateDppResponseBody = JSON.stringify({
    ...(MOCK_DPPS[0] || {}), 
    id: MOCK_DPPS[0]?.id || "DPP001_MOCK",
    productName: MOCK_DPPS[0]?.productName || "EcoSmart Refrigerator X500", 
    productDetails: {
        ...(MOCK_DPPS[0]?.productDetails || {}),
        description: "The latest smart watch with a focus on sustainability, featuring a recycled aluminum case, energy-efficient display, and enhanced battery life.", 
        sustainabilityClaims: [ 
          { claim: "Made with 80% recycled aluminum", verificationDetails: "Verified by GreenCert" }
        ],
        customAttributes: [ 
            { "key": "Display Type", "value": "AMOLED" },
            { "key": "OS", "value": "WearOS Pro" },
            { "key": "Water Resistance", "value": "5 ATM" }
        ]
    },
    metadata: {
        ...(MOCK_DPPS[0]?.metadata || {}),
        status: "pending_review", 
        last_updated: new Date().toISOString() 
    }
  }, null, 2);


  const error400_create_dpp = JSON.stringify({
    error: {
      code: 400,
      message: "Invalid request body. 'productName' and 'category' are required for creation.",
      details: [
        { field: "productName", issue: "cannot be empty" },
        { field: "category", issue: "cannot be empty" }
      ]
    }
  }, null, 2);

  const error400_update_dpp = JSON.stringify({
    error: {
      code: 400,
      message: "Invalid request body for update. Field 'metadata.status' has an invalid value 'incorrect_status'.",
      details: [
         { field: "metadata.status", issue: "value must be one of: draft, published, archived, pending_review, revoked, flagged" }
      ]
    }
  }, null, 2);

  const conceptualDeleteDppResponseBody = JSON.stringify({
    message: "Product with ID DPP001 has been archived successfully.",
    status: "Archived"
  }, null, 2);

  const conceptualPatchDppExtendRequestBody = JSON.stringify({
    documentReference: {
      documentName: "Compliance Certificate 2024",
      documentUrl: "https://example.com/certs/compliance_2024.pdf",
      documentType: "Compliance Certificate"
    }
  }, null, 2);

  const conceptualPatchDppExtendResponseBody = JSON.stringify({
    ...(MOCK_DPPS.find(dpp => dpp.id === "DPP001") || MOCK_DPPS[0]),
    documents: [
      ...(MOCK_DPPS.find(dpp => dpp.id === "DPP001")?.documents || []),
      {
        name: "Compliance Certificate 2024",
        url: "https://example.com/certs/compliance_2024.pdf",
        type: "Compliance Certificate",
        addedTimestamp: new Date().toISOString()
      }
    ],
    metadata: {
      ...(MOCK_DPPS.find(dpp => dpp.id === "DPP001")?.metadata || MOCK_DPPS[0].metadata),
      last_updated: new Date().toISOString()
    }
  }, null, 2);

  const error400_patch_dpp = JSON.stringify({
    error: {
      code: 400,
      message: "Invalid input data. 'documentName', 'documentUrl', and 'documentType' are required for documentReference.",
    }
  }, null, 2);

  const addLifecycleEventRequestBodyExample = JSON.stringify({
    eventType: "Shipped",
    location: "Warehouse B, Hamburg",
    details: { "carrier": "GlobalTrans", "trackingNumber": "GT123456789DE" },
    responsibleParty: "Logistics Inc."
  }, null, 2);

  const addLifecycleEventResponseExample = JSON.stringify({
    id: "evt_mock_123456",
    type: "Shipped",
    timestamp: new Date().toISOString(),
    location: "Warehouse B, Hamburg",
    data: { "carrier": "GlobalTrans", "trackingNumber": "GT123456789DE" },
    responsibleParty: "Logistics Inc."
  }, null, 2);

  const error400_lifecycle_event = JSON.stringify({ error: { code: 400, message: "Field 'eventType' is required and must be a non-empty string." } }, null, 2);

  const conceptualComplianceSummaryResponse = JSON.stringify({
    productId: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    overallStatus: "Fully Compliant",
    eprelStatus: "Registered",
    ebsiVerificationStatus: "verified",
    batteryRegulationStatus: "not_applicable",
    esprStatus: "conformant",
    lastChecked: new Date().toISOString(),
    details: {
      eprel: { id: "EPREL_REG_12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-01-18T00:00:00Z" },
      ebsi: { status: "verified", verificationId: "EBSI_TX_ABC123", lastChecked: "2024-07-25T00:00:00Z" },
    }
  }, null, 2);

  const conceptualVerifyDppResponse = JSON.stringify({
    productId: "DPP001",
    verificationStatus: "Verified",
    message: "Product DPP for ID DPP001 integrity and key compliance points (mock) verified successfully.",
    timestamp: new Date().toISOString(),
    checksPerformed: ["Mock Data Integrity Check", "Mock EBSI Anchor Verification"]
  }, null, 2);


  return (
    <DocsPageLayout
      pageTitle="API Reference (Conceptual)"
      pageIcon="BookText"
      alertTitle="Conceptual Documentation"
      alertDescription="This API reference is conceptual and outlines how API endpoints for the Norruva DPP platform might be structured. Actual implementation details may vary."
    >
      <ApiReferenceIntro />
      <ApiReferenceDppEndpoints
        exampleListDppsResponse={exampleListDppsResponse}
        exampleDppResponse={exampleDppResponse}
        conceptualCreateDppRequestBody={conceptualCreateDppRequestBody}
        conceptualCreateDppResponseBody={conceptualCreateDppResponseBody}
        conceptualUpdateDppRequestBody={conceptualUpdateDppRequestBody}
        conceptualUpdateDppResponseBody={conceptualUpdateDppResponseBody}
        conceptualDeleteDppResponseBody={conceptualDeleteDppResponseBody}
        conceptualPatchDppExtendRequestBody={conceptualPatchDppExtendRequestBody}
        conceptualPatchDppExtendResponseBody={conceptualPatchDppExtendResponseBody}
        addLifecycleEventRequestBodyExample={addLifecycleEventRequestBodyExample}
        addLifecycleEventResponseExample={addLifecycleEventResponseExample}
        error401={error401}
        error404={error404}
        error500={error500}
        error400_create_dpp={error400_create_dpp}
        error400_update_dpp={error400_update_dpp}
        error400_patch_dpp={error400_patch_dpp}
        error400_lifecycle_event={error400_lifecycle_event}
      />
      <ApiReferenceQrEndpoints
        exampleQrValidationResponse={exampleQrValidationResponse}
        error400_qr={error400_qr}
        error401={error401}
        error404={error404}
        error500={error500}
      />
      <ApiReferenceComplianceEndpoints
        conceptualComplianceSummaryResponse={conceptualComplianceSummaryResponse}
        conceptualVerifyDppResponse={conceptualVerifyDppResponse}
        error401={error401}
        error404={error404}
        error500={error500}
      />
    </DocsPageLayout>
  );
}









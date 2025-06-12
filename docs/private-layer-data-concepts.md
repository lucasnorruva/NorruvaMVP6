
# Conceptual Data Models for Private Layer

This document outlines conceptual data models for information that might reside on a private layer within the Norruva Digital Product Passport (DPP) platform. This private layer is envisioned for sensitive supply chain data and detailed B2B transaction records not suitable for the public DPP, but which may be summarized or proven on the public layer via Verifiable Credentials (VCs) or Zero-Knowledge Proofs (ZKPs).

## 1. Detailed Supplier Attestations

This model represents specific, verifiable claims made by a supplier regarding a component or material they provide for a product.

**Use Case:** A manufacturer needs detailed proof of ethical sourcing or specific environmental metrics for a component from a key supplier, beyond what is publicly declared.

**Conceptual Data Structure:**

```json
{
  "attestationId": "attest_sup001_compA_batchXYZ_20240815",
  "productId": "DPP001", // DPP ID the component is for
  "componentId": "COMP_A_BATTERY_CELL", // Internal or standardized component ID
  "supplierId": "SUP001", // Norruva Supplier ID
  "supplierDid": "did:example:supplier:greenpartsinc", // Supplier's Decentralized Identifier
  "attestationType": "EthicalSourcingCompliance", // e.g., ConflictMinerals, FairLabor, AnimalWelfare
  "attestationStatement": "Component COMP_A_BATTERY_CELL (Batch XYZ-789) sourced and processed in compliance with OECD Due Diligence Guidance for Responsible Supply Chains of Minerals from Conflict-Affected and High-Risk Areas.",
  "evidence": [
    {
      "type": "AuditReport",
      "documentId": "audit_report_123.pdf",
      "documentHash": "sha256-abc123...", // Hash of the audit report
      "vcId": "vc:ebsi:監査報告書の検証:xyz789" // VC proving the audit report's authenticity
    },
    {
      "type": "ChainOfCustodyRecord",
      "recordId": "coc_batch_xyz789",
      "recordHash": "sha256-def456...",
      "description": "Internal CoC record for batch XYZ-789."
    }
  ],
  "issuanceDate": "2024-08-15T10:00:00Z",
  "expiryDate": "2025-08-14T23:59:59Z",
  "specificMetrics": [ // Optional detailed metrics related to the attestation
    {
      "metricName": "CobaltSourceVerified",
      "value": "DRC_Artisanal_ConflictFree",
      "verificationMethod": "ThirdPartyAudit_CertChain"
    },
    {
      "metricName": "CO2ePerUnit_ComponentA",
      "value": 0.45,
      "unit": "kg CO2e",
      "calculationMethodology": "ISO 14064-1, Supplier Specific LCA"
    }
  ],
  "confidentialNotes": "For internal verification purposes only. Not for public disclosure."
}
```

**Key Considerations:**
*   **Granularity:** Attestations can be for specific batches, production runs, or time periods.
*   **Verifiability:** Linking to VCs or hashed documents allows for independent verification.
*   **Confidentiality:** Some details might be highly sensitive and only accessible to permissioned parties.

## 2. Internal B2B Component Transfer Records

This model captures the transfer of a component or sub-assembly between two verified entities within a private supply chain network.

**Use Case:** Tracking the movement of a critical component (e.g., a battery module) from a cell manufacturer to a pack assembler, before it's integrated into the final product by the OEM.

**Conceptual Data Structure:**

```json
{
  "transferId": "transfer_compA_sup001_to_mfg002_20240820",
  "componentId": "COMP_A_BATTERY_CELL_PACK",
  "batchOrSerialNumbers": ["batch_xyz789-001", "batch_xyz789-002"],
  "quantity": 200,
  "unit": "units",
  "transferDate": "2024-08-20T14:30:00Z",
  "fromParty": {
    "participantId": "SUP001", // Norruva Supplier ID
    "participantDid": "did:example:supplier:greenpartsinc",
    "role": "Component Supplier"
  },
  "toParty": {
    "participantId": "MFG002_ASSEMBLY", // Norruva Manufacturer/Assembler ID
    "participantDid": "did:example:manufacturer:acmeassembly",
    "role": "Pack Assembler"
  },
  "transactionDetails": { // Could be linked to an ERP or blockchain transaction
    "type": "InternalStockTransfer",
    "referenceId": "ERP_PO_67890",
    "privateLedgerTxHash": "0xprivatetxhashabc..." // Optional hash on a private/consortium chain
  },
  "accompanyingDocuments": [
    {
      "type": "QualityCertificate_BatchXYZ",
      "documentId": "qc_batch_xyz.pdf",
      "documentHash": "sha256-ghi789..."
    }
  ],
  "notes": "Transfer of fully tested battery cell packs for final assembly into EV battery modules."
}
```

**Key Considerations:**
*   **Permissioned Access:** This data would typically only be visible to the involved parties and potentially the OEM or auditors under specific conditions.
*   **Link to Public DPP:** The component itself might eventually be part of a product with a public DPP. A ZKP or a summarized VC could attest to the valid, compliant transfer of this component without revealing all private details.

## 3. Confidential Material Composition Details

This model allows for storing highly detailed or proprietary material composition information that is not suitable for the public DPP.

**Use Case:** A manufacturer needs to store the exact chemical breakdown of a proprietary alloy or coating for internal R&D, regulatory submission to a specific trusted authority, or for highly detailed EOL processing by a specialized recycler, without making this IP public.

**Conceptual Data Structure:**

```json
{
  "confidentialMaterialId": "cm_dpp001_proprietary_alloy_X1",
  "productId": "DPP001", // Links to the public DPP
  "componentName": "ProtectiveCoating_LayerA",
  "materialName": "Proprietary Alloy X1-Alpha",
  "materialDescription": "High-performance, corrosion-resistant alloy for sensitive electronics.",
  "composition": [ // Detailed breakdown
    {
      "substanceName": "Titanium",
      "casNumber": "7440-32-6",
      "percentageByWeight": "75.5 - 78.2 %", // Can be a range for IP protection
      "role": "Base Metal"
    },
    {
      "substanceName": "Vanadium (Proprietary Chelated Form)",
      "casNumber": "CONFIDENTIAL_TRADE_SECRET", // CAS might be hidden
      "percentageByWeight": "5.0 - 6.5 %",
      "role": "Strengthening Agent, Corrosion Inhibitor",
      "notes": "Specific form and concentration are trade secrets."
    },
    {
      "substanceName": "SVHC_Example_Substance (e.g., Cadmium)",
      "casNumber": "7440-43-9",
      "percentageByWeight": "0.005 %", // Below 0.1% threshold for SCIP but tracked internally
      "role": "Impurity/Trace Element"
    }
    // ... more substances
  ],
  "supplierInformation": { // Optional, if specific to a supplied material
    "supplierId": "SUP_ADV_CHEM_007",
    "materialBatchId": "AC_XYZ_BATCH_001"
  },
  "accessControlList": [ // Who can access this confidential data
    "did:example:manufacturer:greentech#internal_rd",
    "did:example:regulator:echa#secure_submission_portal",
    "did:example:recycler:specialized_metals_recovery#authorized_eol_processor"
  ],
  "lastUpdated": "2024-07-15T09:00:00Z",
  "version": 3
}
```

**Key Considerations:**
*   **Access Control:** Crucial for protecting intellectual property. Access should be strictly controlled via DIDs, VCs, or other robust authentication/authorization mechanisms.
*   **Selective Disclosure:** ZKPs could be used to prove certain properties (e.g., "Does not contain substance Y above 0.01%") without revealing the full composition.
*   **Linkage to Public DPP:** The public DPP might state "Contains proprietary alloy" with a reference that only authorized parties can resolve to this detailed private data.

---

These models are conceptual starting points. The actual implementation of a private layer would require careful consideration of security, access control, data governance, and interoperability with public layer systems like EBSI.
      
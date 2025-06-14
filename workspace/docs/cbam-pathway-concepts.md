
# CBAM (Carbon Border Adjustment Mechanism) Pathway Concepts for DPP

This document outlines conceptual considerations for integrating Carbon Border Adjustment Mechanism (CBAM) related data within a Digital Product Passport (DPP) system like Norruva.

## Understanding CBAM

The EU's Carbon Border Adjustment Mechanism (CBAM) is a climate measure that aims to prevent "carbon leakage" and encourage global decarbonisation. It puts a carbon price on certain goods imported into the EU, reflecting the carbon price they would have paid if produced under EU carbon pricing rules.

**Key Objectives of CBAM:**
- Ensure a level playing field for EU industries.
- Encourage non-EU countries to adopt similar carbon pricing mechanisms.
- Reduce global carbon emissions.

**Affected Goods (Initial Scope):**
CBAM initially covers imports in the following sectors, deemed at high risk of carbon leakage:
- Cement
- Iron and Steel
- Aluminium
- Fertilisers
- Electricity
- Hydrogen

This list may expand in the future.

## DPP Data Points Relevant to CBAM

Digital Product Passports can be a crucial tool for collecting, managing, and verifying data required by CBAM declarants. Key data points that a DPP could hold or link to include:

1.  **Product Identification:**
    *   Unique Product Identifier (from DPP)
    *   CN (Combined Nomenclature) code for the imported goods.

2.  **Embedded Emissions:**
    *   **Direct Emissions:** Greenhouse gas (GHG) emissions from the production processes of the goods.
    *   **Indirect Emissions:** GHG emissions from the production of electricity consumed during the production processes.
    *   Quantities of specific embedded emissions (e.g., tonnes of CO2e per tonne of product).
    *   Methodology used for calculating embedded emissions (must align with EU CBAM rules).

3.  **Country of Origin for Emissions:**
    *   The country where the embedded emissions occurred. This is crucial as it affects any carbon price adjustments.

4.  **Carbon Price Paid:**
    *   Proof of any carbon price effectively paid in the country of origin for the declared embedded emissions.
    *   This is used to reduce the number of CBAM certificates the declarant needs to surrender.
    *   Evidence might include official tax documents, emissions trading system records, etc.

5.  **CBAM Declarant Information:**
    *   EORI number of the authorized CBAM declarant.
    *   Authorization status.

6.  **CBAM Certificates:**
    *   (Conceptual) Links or references to surrendered CBAM certificates corresponding to the imported batch.

7.  **Verification Reports:**
    *   Links to reports from accredited verifiers who have confirmed the embedded emissions data.

## How DPPs Support CBAM Compliance

- **Data Collection:** DPPs can act as a central repository for manufacturers to input and update emissions data throughout the product lifecycle, especially at the manufacturing gate.
- **Supply Chain Transparency:** For complex products, DPPs can help trace embedded emissions through the supply chain by linking component DPPs.
- **Verification & Auditability:** Verifiable Credentials (VCs) within or linked to the DPP can provide trusted attestations for emissions data and carbon prices paid, potentially simplifying verification for CBAM declarants and authorities.
- **Standardization:** DPPs can promote standardized reporting formats for emissions data, aligning with CBAM requirements.
- **API Access:** The Norruva platform's API could allow CBAM declarants or their representatives to programmatically access relevant, verified emissions data from DPPs, facilitating their reporting obligations.

## Conceptual Workflow with Norruva & DPPs

1.  **Manufacturer (Exporter to EU):**
    *   Calculates embedded emissions for their product according to CBAM rules.
    *   Records this data (direct, indirect emissions, methodology, origin) in the product's DPP within the Norruva platform, potentially under a dedicated CBAM section or within customs/sustainability data.
    *   Obtains verification of this emissions data from an accredited verifier. A VC attesting to this verification could be linked to the DPP.
    *   If applicable, records proof of carbon price paid in the country of origin within the DPP.

2.  **Importer (Authorized CBAM Declarant in EU):**
    *   Accesses the DPP for the imported goods via the Norruva platform (using appropriate permissions).
    *   Retrieves the verified embedded emissions data and proof of carbon price paid.
    *   Uses this information to fill their annual CBAM declaration.
    *   Surrenders the corresponding number of CBAM certificates.

3.  **Customs Authorities / CBAM Competent Authorities:**
    *   May (conceptually) use DPP data or linked VCs as part of their verification and audit processes for CBAM compliance.

## Challenges & Considerations

-   **Methodology Alignment:** Ensuring emissions calculation methodologies used by manufacturers align strictly with EU CBAM implementing acts.
-   **Data Verification:** Establishing robust verification mechanisms for emissions data, especially for complex global supply chains. EBSI and VCs can play a key role here.
-   **Global Interoperability:** CBAM data needs to be shareable and verifiable across different systems and jurisdictions.
-   **Data Security & Confidentiality:** Protecting sensitive emissions and production data while enabling necessary reporting.

The Norruva DPP platform aims to evolve to support these CBAM requirements by providing the necessary data fields, API capabilities, and conceptual integration points for verifiable data.

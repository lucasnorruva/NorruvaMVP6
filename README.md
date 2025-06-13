
# Norruva Digital Product Passport (DPP) - Concept Application

Welcome to the Norruva Digital Product Passport (DPP) concept application! This project is a Next.js-based platform designed to explore and prototype features for managing Digital Product Passports, aligning with EU regulations and leveraging AI for enhanced functionality.

## Table of Contents

- [Project Overview](#project-overview)
- [Core System Framework & Compliance](#core-system-framework--compliance)
- [Tech Stack](#tech-stack)
- [Core Features (Conceptual)](#core-features-conceptual)
- [Current Implemented Features](#current-implemented-features)
- [Product Detail Page](#product-detail-page)
- [Blockchain Anchoring & Ownership](#blockchain-anchoring--ownership)
- [Advanced Blockchain Architecture](#advanced-blockchain-architecture)
- [Smart Contract Development](#smart-contract-development)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Running Tests](#running-tests)
  - [Authentication](#authentication)
  - [Troubleshooting](#troubleshooting)
- [Key Directory Structure](#key-directory-structure)
- [Firebase Studio Context](#firebase-studio-context)

## Project Overview

The Norruva DPP platform aims to provide a comprehensive solution for:

- Securely storing and managing product data.
- Facilitating compliance with EU regulations (e.g., ESPR, Battery Regulation, CSRD).
- Integrating with infrastructures like EBSI (European Blockchain Services Infrastructure) for transparency.
- Utilizing AI for tasks like data extraction and summary generation.

This application serves as a prototype to demonstrate these capabilities.

## Core System Framework & Compliance

The overall design, features, and compliance approach for the Norruva DPP system are detailed in the [Comprehensive Digital Product Passport (DPP) Compliance Framework](docs/comprehensive-dpp-compliance-framework.md). This document covers a wide array of requirements including regulatory compliance, sustainability goals, lifecycle tracking, data integration strategies, and the incorporation of emerging technologies like AI, Blockchain, and IoT.

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React
- **Component Library:** ShadCN UI
- **Styling:** Tailwind CSS
- **Generative AI:** Google Genkit
- **Language:** TypeScript

## Core Features (Conceptual)

The platform is designed around the following core feature pillars (refer to the comprehensive framework for full details):

- **Regulatory Compliance**: Adherence to ESPR, REACH, RoHS, Battery Regulation, GDPR, etc.
- **Sustainability & Circular Economy**: Carbon footprint tracking, circularity metrics, end-of-life management.
- **Product Lifecycle Tracking & Data Integration**: Real-time IoT data, AI-powered analytics, smart contracts.
- **Blockchain & Digital Twin Integration**: Immutable records, provenance, real-time monitoring.
- **AI & Machine Learning Integration**: Design optimization, performance insights.
- **Consumer & Business Interaction**: User-friendly interfaces, engagement platforms.
- **Emerging Technologies**: Quantum-readiness, smart packaging, smart city integration.
- **Ethical Sourcing & Fair Trade**: Supply chain transparency.
- **Decentralized Governance**: Conceptual DAO integration.
- **Global Trade Compliance**: Cross-border taxation and regulations.

## Current Implemented Features

As of the current version, the following key areas and features have been prototyped:

- **Role-Based Dashboard:** Different views and actions based on user roles (Admin, Manufacturer, Supplier, Retailer, Recycler, Verifier, Service Provider).
- **DPP Live Dashboard:** A view for public-facing DPPs, with filtering and AI summary generation.
- **Product Management:**
    - Listing existing products with advanced filtering and sorting.
    - Adding new products via manual entry or AI-assisted document extraction, including category-specific fields (Textiles, Construction) and on-chain state management.
    - Viewing detailed product information on the individual product detail page, including a new "History" tab.
    - Debounced search filtering for smoother performance on large datasets.
- **AI Compliance Co-Pilot:** An AI assistant to answer questions about EU DPP regulations.
- **Compliance Pathways:** Step-by-step guidance for specific regulations (e.g., EU Battery Regulation, ESPR, CSRD, SCIP).
- **GDPR Management Page:** Mock interface for consent and data subject rights.
- **Sustainability Reporting:** Mock CSRD summary generation and emissions overview.
- **Customs & Compliance Dashboard:** A specialized view for customs-related product tracking and compliance alerts.
- **Service Provider Dashboard:** A conceptual dashboard for service technicians to manage service jobs and access product technical data.
- **Supply Chain Management:**
    - Managing a list of suppliers.
    - Linking suppliers to products (viewable on the product detail page's "Supply Chain" tab), with conceptual private attestation viewing.
- **Developer Portal:** Mock portal with API key management, interactive playground, and conceptual documentation. The canonical OpenAPI specification lives in `openapi.yaml` and is served at `/openapi.yaml` after being copied to `public/openapi.yaml` during the build process.
- **Settings Page:** Basic user profile, notifications, and organization settings.

## Performance Considerations

Search filtering inputs now use a debounced update to avoid unnecessary renders.
For very large DPP lists, implementing server-side pagination is recommended and
profiling should be done with realistic datasets.

## Product Detail Page

The individual **Product Detail Page** (accessed via `/products/[productId]`) has been refactored and is now significantly more comprehensive. It provides an enhanced tabbed view of product information, including a detailed overview with consolidated identifiers and blockchain state, sustainability metrics, full compliance status, product history, certifications, lifecycle events, and supply chain details. It also supports category-specific information for textiles and construction products.

Links from other parts of the application, such as the "Products" listing page (`/products`) and the "DPP Live Dashboard" (`/dpp-live-dashboard`), that lead to this internal detail view are active and direct users to the relevant product's detailed information. The "Products" listing page (`/products`) and the "Add New Product" page (`/products/new`) are also fully functional for managing the product list and creating/editing entries.

## Blockchain Anchoring & Ownership

These conceptual features outline how a Digital Product Passport can be anchored on-chain, transferred to a new owner, and retrieved as a verifiable credential for wallet applications.

### Anchoring a DPP to a Blockchain

Send a `PUT` request to update the DPP with blockchain identifiers and the transaction hash used to anchor the data:

```bash
curl -X PUT https://api.example.com/api/v1/dpp/{productId} \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
        "blockchainIdentifiers": {
          "platform": "EBSI",
          "contractAddress": "0x123...",
          "tokenId": "1"
        },
        "anchorTransactionHash": "0xabc..."
      }'
```

### Transferring Ownership

Use the `POST /api/v1/dpp/transfer-ownership/{productId}` endpoint:

```bash
curl -X POST https://api.example.com/api/v1/dpp/transfer-ownership/{productId} \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
        "newOwner": {
          "name": "New Owner Inc.",
          "did": "did:example:new-owner"
        },
        "transferTimestamp": "2024-01-01T12:00:00Z"
      }'
```

### Updating Chain of Custody

Append a new supply chain step using `PATCH /api/v1/dpp/custody/{productId}`:

```bash
curl -X PATCH https://api.example.com/api/v1/dpp/custody/{productId} \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
        "stepName": "Handed to Distributor",
        "actorDid": "did:example:distributor",
        "timestamp": "2024-08-01T12:00:00Z",
        "location": "Warehouse Z",
        "transactionHash": "0xabc123"
      }'
```

### Retrieving a Verifiable Credential

Fetch the DPP to obtain associated verifiable credentials that can be imported into digital wallets:

```bash
curl -H 'Authorization: Bearer <API_KEY>' \
  https://api.example.com/api/v1/dpp/{productId}
```

The `verifiableCredentials` array in the response contains credential objects that wallets can verify. These calls can also be executed via the in-app API playground under **Developer Portal → API Reference**.

### Fetching the Credential Directly

Use the dedicated endpoint to retrieve a single verifiable credential JSON:

```bash
curl -H 'Authorization: Bearer <API_KEY>' \
  https://api.example.com/api/v1/dpp/{productId}/credential
```

### Checking Batch Import Job Status

After submitting a batch import using `POST /api/v1/dpp/import` the response includes a `jobId` that can be polled for progress:

```bash
curl -H 'Authorization: Bearer <API_KEY>' \
  https://api.example.com/api/v1/dpp/import/jobs/{jobId}
```

Example successful response:

```json
{
  "jobId": "mock_import_job_123456",
  "status": "PendingProcessing",
  "message": "Job is queued."
}
```

If the job ID is unknown a 404 error is returned:

```json
{
  "error": { "code": 404, "message": "Job with ID UNKNOWN not found." }
}
```

## Getting Started

### Prerequisites

- Node.js (version 18.x or later recommended)
- npm or yarn

### Installation

1.  Clone the repository (if applicable).
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Copy the example environment file and configure the values:
    ```bash
    cp .env.example .env
    # then edit .env and add your API keys and other settings
    ```
4.  Copy the canonical API specification (`openapi.yaml`) into the `public` folder (required for the Developer Portal). This runs automatically before `npm run dev` or `npm run build` but can be invoked manually:
    ```bash
    npm run copy:openapi
    ```

### Running the Development Server

1.  **Start the Genkit development server (for AI features):**
    Open a terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This typically starts on `http://localhost:4000`.

2.  **Start the Next.js development server:**
    Open another terminal and run:
    ```bash
    npm run dev
    ```
This will start the Next.js application, usually on `http://localhost:9002` (as configured in `package.json`).

Open `http://localhost:9002` in your browser to view the application.

### Installing as a PWA

The application includes a service worker and web app manifest. When running in
development (`npm run dev`) or production, you can install it like a native app:

1. Open the site in Chrome or another PWA-compatible browser.
2. Click the browser's **Install** icon or choose **Add to Home Screen**.
3. Launch the app from your home screen to use it in standalone mode.

### Running Tests

Run the unit tests with:

```bash
npm test
```

The suite now includes API route tests located in `src/app/api/__tests__`. These
cover common success and failure cases for several endpoints including DPP
creation, QR validation, anchoring, and ownership transfer.


Use `npm run test:watch` during development to re-run tests on file changes.

### Authentication

All `/api/v1/*` endpoints expect an API key using the `Authorization` header with the `Bearer` scheme. Example:

```bash
curl -H 'Authorization: Bearer SANDBOX_KEY_123' http://localhost:9002/api/v1/dpp
```

Valid keys are configured via the `VALID_API_KEYS` environment variable. This should be a comma-separated list of keys. The values are loaded at runtime by `src/config/auth.ts` as the `API_KEYS` array. The `.env.example` file defines two sample keys:

```bash
VALID_API_KEYS=SANDBOX_KEY_123,PROD_KEY_456
```

### Troubleshooting

**401: The Workstation does not exist or your currently signed in account does not have access to it**

This error may appear when using the "View Public Passport" link in a Cloud Workstations environment. Verify that:

1. The workstation `firebase-studio-1749131649534` (cluster `workstation-cluster-9`) exists and is running in project `510861787045`.
2. Your Google account has the `workstations.workstations.use` IAM permission (e.g., via the *Workstations User* role) on that workstation.

Without this permission Google Cloud cannot generate the access token required to open the application.

## Key Directory Structure

- `src/app/`: Contains the Next.js App Router pages and layouts.
  - `src/app/(app)/`: Authenticated/main application routes.
  - `src/app/api/`: API routes.
- `src/components/`: Reusable UI components.
  - `src/components/ui/`: ShadCN UI components.
- `src/ai/`: Genkit related code.
  - `src/ai/flows/`: Genkit AI flows.
- `src/lib/`: Utility functions.
- `src/contexts/`: React context providers.
- `src/types/`: TypeScript type definitions.
- `openapi.yaml`: Canonical API specification. The build process copies this file to `public/openapi.yaml` so it is served at `/openapi.yaml`.
- `docs/`: Contains high-level design and architecture documents, including the [Comprehensive DPP Compliance Framework](docs/comprehensive-dpp-compliance-framework.md).

## Advanced Blockchain Architecture

While the [Comprehensive DPP Compliance Framework](docs/comprehensive-dpp-compliance-framework.md) covers broader system design, specific smart contract design and DAO governance specifications are documented in `workspace/docs/blockchain-architecture.md`.
The smart contract code itself resides in `workspace/contracts/`.

## Smart Contract Development

Solidity smart contracts for the Norruva platform are located in the `workspace/contracts/` directory. The project is configured for Hardhat development, focusing on UUPS upgradeable contracts for flexibility.

### Core Contracts

1.  **`DPPToken.sol`**: An ERC-721 compliant token representing each Digital Product Passport as an NFT. It is UUPS upgradeable and manages minting and metadata URI updates through role-based access control. Transfers are restricted by default and can be enabled via DAO-controlled functions.
2.  **`NORUToken.sol`**: An ERC-20 compliant governance token (`NORU`) for the conceptual Norruva DAO. It is UUPS upgradeable, with a capped supply and role-based minting.
3.  **`TimelockControllerUpgradeable.sol` (OpenZeppelin)**: A standard Timelock contract to enforce a delay on DAO proposals before execution. Deployed via `workspace/scripts/deploy_timelock_controller.ts`.
4.  **`DPPGovernor.sol`**: A `GovernorUpgradeable` contract for on-chain governance, using `NORUToken` for voting and interacting with the `TimelockController`. It is UUPS upgradeable and deployed via `workspace/scripts/deploy_governor.ts`.

### Common Hardhat Commands

The Hardhat project is configured at the root of the `workspace/` directory. To run Hardhat commands, first `cd workspace`.

```bash
cd workspace

# Compile the contracts
npm run compile:contracts

# Execute the Hardhat test suite for the contracts
npm run test:contracts

# Deploy the DPPToken proxy to a network (e.g., sepolia)
# Requires ALCHEMY_API_KEY and PRIVATE_KEY in .env at the root of the workspace
npm run deploy:contracts
```

### Deploying DAO Components (Conceptual Order)

The `npm run deploy:contracts` command specifically deploys the `DPPToken`. To deploy the other core contracts for a complete conceptual DAO setup, follow this order. Ensure you are in the `workspace/` directory for all commands.

1.  **Deploy NORUToken:**
    ```bash
    # Ensure ALCHEMY_API_KEY and PRIVATE_KEY are set in workspace/.env for your chosen network
    npx hardhat run scripts/deploy_noru_token.ts --network <your_network_name>
    ```
    (Replace `<your_network_name>` with, e.g., `sepolia` or `localhost`. This will be read from `workspace/hardhat.config.ts`).
    Note the deployed `NORUToken` address from the console output. You **must** set this in your `workspace/.env` file as `NORU_TOKEN_ADDRESS` for subsequent steps.

2.  **Deploy TimelockController:**
    ```bash
    # Ensure ALCHEMY_API_KEY and PRIVATE_KEY are set
    npx hardhat run scripts/deploy_timelock_controller.ts --network <your_network_name>
    ```
    Note the deployed `TimelockController` address from the console output. You **must** set this in your `workspace/.env` file as `TIMELOCK_CONTROLLER_ADDRESS` for the next step.

3.  **Deploy DPPGovernor:**
    Before running, you **must** ensure that the `NORU_TOKEN_ADDRESS` and `TIMELOCK_CONTROLLER_ADDRESS` environment variables are set correctly in your `workspace/.env` file (or directly in the shell) to the addresses obtained from the previous deployment steps.
    ```env
    # Example content for workspace/.env:
    # ALCHEMY_API_KEY=your_alchemy_key
    # PRIVATE_KEY=your_private_key
    # NORU_TOKEN_ADDRESS=0xAddressOfDeployedNoruToken
    # TIMELOCK_CONTROLLER_ADDRESS=0xAddressOfDeployedTimelock
    ```
    Then, deploy the Governor:
    ```bash
    # Ensure ALCHEMY_API_KEY and PRIVATE_KEY are set
    npx hardhat run scripts/deploy_governor.ts --network <your_network_name>
    ```
    This script will deploy the `DPPGovernor` and also attempt to configure the necessary roles on the `TimelockController` (PROPOSER_ROLE, CANCELLER_ROLE, EXECUTOR_ROLE, TIMELOCK_ADMIN_ROLE) to grant the Governor operational control and make the Governor the sole admin of the Timelock.

### Upgrading Contracts

To upgrade an existing UUPS proxy (e.g., `DPPToken`, `NORUToken`, `DPPGovernor`):
1.  Create a new version of the contract (e.g., `DPPTokenV2.sol`).
2.  Set the `PROXY_ADDRESS` environment variable in your `workspace/.env` file to the address of the deployed proxy you want to upgrade.
3.  Set the `UPGRADE_CONTRACT_NAME` environment variable to the base name of the contract being upgraded (e.g., `DPPToken`). The script will look for `<UPGRADE_CONTRACT_NAME>V2`.
4.  Run the upgrade script:
    ```bash
    # Ensure you are in the workspace/ directory
    # Ensure .env contains PROXY_ADDRESS and UPGRADE_CONTRACT_NAME
    # Ensure ALCHEMY_API_KEY and PRIVATE_KEY are set for the target network
    npm run upgrade:contracts 
    ```
    (This command runs `workspace/scripts/upgrade.ts` by default, configured for the specified network).

### Foundry (Alternative)

If Foundry is installed, you can also use its tools for building and testing (from the `workspace/` directory):
```bash
forge build
forge test
```

## Firebase Studio Context

This application is being developed within the Firebase Studio environment, an AI-assisted coding platform. Changes are often applied conversationally.

---

This README will be updated as the project evolves.


    
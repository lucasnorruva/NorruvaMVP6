// --- File: page.tsx (Smart Contract Interactions Docs) ---
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import {
  Zap,
  Info,
  FileText,
  ArrowRight,
  Users,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import DocsPageLayout from "@/components/developer/DocsPageLayout";

export default function SmartContractInteractionsPage() {
  return (
    <DocsPageLayout
      pageTitle="Smart Contract Interactions (Conceptual)"
      pageIcon="Zap"
      backLink="/developer/docs"
      backLinkText="Back to Docs Hub"
      alertTitle="Conceptual Overview"
      alertDescription="This document explains how the Norruva API conceptually interacts with the underlying smart contracts for on-chain operations. The actual smart contracts and their full logic are detailed in the project's blockchain architecture documentation."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Introduction: API as an Abstraction Layer</CardTitle>
          <CardDescription>
            The Norruva DPP API provides a simplified way to interact with
            blockchain functionalities without requiring direct smart contract
            programming from your end. Our backend services manage the
            complexities of contract calls, gas fees, and transaction
            monitoring.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Understanding these conceptual interactions can be beneficial for
            advanced integrations or for grasping the on-chain implications of
            certain API calls.
          </p>
          <p className="text-sm text-muted-foreground">
            For the detailed Solidity code and architecture of our conceptual
            smart contracts (DPPToken, NORUToken, DPPGovernor,
            TimelockController), please refer to the
            <code className="bg-muted px-1 py-0.5 rounded-sm mx-1">
              workspace/docs/blockchain-architecture.md
            </code>{" "}
            file in the project repository.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            DPPToken.sol Interactions
          </CardTitle>
          <CardDescription>
            This ERC-721 (conceptual) contract represents each Digital Product
            Passport as a unique token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h4 className="font-semibold text-md mb-1">Minting a DPP Token</h4>
            <p className="text-sm text-muted-foreground">
              When you use the{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                POST /api/v1/token/mint/{"{productId}"}
              </code>{" "}
              endpoint:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 pl-4">
              <li>
                The Norruva backend validates the request and prepares the
                metadata hash.
              </li>
              <li>
                A backend wallet (with `MINTER_ROLE`) conceptually calls{" "}
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  DPPToken.mint(recipientAddress, tokenId, metadataHash)
                </code>
                .
              </li>
              <li>
                The API response includes the `tokenId` and `transactionHash`.
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold text-md mb-1">
              Updating Token Metadata
            </h4>
            <p className="text-sm text-muted-foreground">
              When you use{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                PATCH /api/v1/token/metadata/{"{tokenId}"}
              </code>
              :
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 pl-4">
              <li>
                The backend derives the new `metadataHash` from the provided
                URI.
              </li>
              <li>
                A backend wallet (with `UPDATER_ROLE` or as the token owner)
                conceptually calls{" "}
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  DPPToken.updateMetadataHash(tokenId, newMetadataHash)
                </code>
                .
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold text-md mb-1">
              Retrieving Token Status
            </h4>
            <p className="text-sm text-muted-foreground">
              The{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                GET /api/v1/token/status/{"{tokenId}"}
              </code>{" "}
              endpoint conceptually:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 pl-4">
              <li>
                Calls view functions like{" "}
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  DPPToken.ownerOf(tokenId)
                </code>{" "}
                and{" "}
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  DPPToken.tokenURI(tokenId)
                </code>
                .
              </li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold text-md mb-1">
              DAO-Governed Transfers
            </h4>
            <p className="text-sm text-muted-foreground">
              The{" "}
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                DPPToken.daoTransfer(from, to, tokenId)
              </code>{" "}
              function is designed to be called by the DAO (via Timelock), not
              directly via a simple API for individual user transfers, due to
              the soulbound nature of the tokens by default.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            NORUToken.sol & DAO Governance Interactions
          </CardTitle>
          <CardDescription>
            NORUToken (ERC-20) is the conceptual governance token.
            DPPGovernor.sol manages proposals and voting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold text-md mb-1">NORUToken Role</h4>
            <p className="text-sm text-muted-foreground">
              Primarily used for voting power in the DAO. Direct API interaction
              for staking or token management would typically be through
              specialized UIs or specific governance platform interfaces, not
              general DPP APIs.
            </p>
          </section>
          <section>
            <h4 className="font-semibold text-md mb-1">
              Proposal Lifecycle (Conceptual)
            </h4>
            <p className="text-sm text-muted-foreground">
              As simulated on the{" "}
              <Link
                href="/blockchain#dao-governance"
                className="text-primary hover:underline"
              >
                Blockchain Management page
              </Link>
              :
            </p>
            <ol className="list-decimal list-inside text-sm space-y-1 pl-4">
              <li>
                A user (with sufficient NORU tokens for proposal threshold)
                creates a proposal via a DAO interface (mocked on our platform).
                This conceptually calls{" "}
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  DPPGovernor.propose(...)
                </code>
                .
              </li>
              <li>
                The proposal enters a voting period where NORU token holders
                vote.
              </li>
              <li>
                If successful, the proposal is queued in the{" "}
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                  TimelockController
                </code>
                .
              </li>
              <li>
                After a predefined delay, the proposal can be executed. The
                Timelock contract, which holds necessary roles (e.g.,
                `TRANSFER_ROLE` on DPPToken), executes the proposed transaction
                (e.g., calling `DPPToken.daoTransfer(...)`).
              </li>
            </ol>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
            General On-Chain State Updates via API
          </CardTitle>
          <CardDescription>
            APIs for updating conceptual on-chain status or logging events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Endpoints like{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              POST /api/v1/dpp/{"{productId}"}/onchain-status
            </code>{" "}
            or{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              POST /api/v1/dpp/{"{productId}"}/log-critical-event
            </code>{" "}
            simulate the Norruva backend interacting with a smart contract
            (potentially DPPToken or a dedicated registry contract) to:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 pl-4">
            <li>
              Update a status field on-chain (e.g., from 'Active' to
              'Recalled').
            </li>
            <li>
              Log a new event with a description and severity, potentially
              emitting a smart contract event.
            </li>
            <li>
              Register the hash of a Verifiable Credential on-chain for
              integrity proof.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            These mock API endpoints update the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              metadata.onChainStatus
            </code>
            ,{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              metadata.onChainLifecycleStage
            </code>
            , or add to{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              lifecycleEvents
            </code>{" "}
            within the `MOCK_DPPS` data and return a mock transaction hash.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>The Norruva API simplifies complex blockchain operations.</li>
            <li>
              The backend manages secure key storage, transaction signing, gas
              fees, and nonce management for conceptual on-chain interactions.
            </li>
            <li>
              The smart contract architecture (DPPToken, NORUToken, DPPGovernor,
              Timelock) provides the foundation for tokenization, governance,
              and verifiable data management, though interactions are simulated
              in this prototype.
            </li>
            <li>
              Developers integrating with the API generally do not need to
              interact with smart contracts directly unless building very
              advanced, custom on-chain solutions.
            </li>
          </ul>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}

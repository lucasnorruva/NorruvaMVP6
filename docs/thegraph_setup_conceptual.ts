// docs/thegraph_setup_conceptual.ts

/**
 * Conceptual Guide for Setting up a TheGraph Subgraph for the DPPToken Contract
 * 
 * This file outlines the conceptual steps and configuration required to set up a
 * TheGraph subgraph to index events from the DPPToken smart contract.
 *
 * Note: This is a conceptual guide and does not provide a fully executable setup.
 * A real implementation requires installing TheGraph CLI, running a Graph Node
 * (or using a hosted service), and writing detailed mapping logic.
 */

// 1. Install TheGraph CLI
// You would typically install TheGraph CLI globally:
// npm install -g @graphprotocol/graph-cli

// 2. Initialize a new Subgraph (Conceptual Command)
// Navigate to your project directory in the terminal and run:
// graph init --from-contract <YOUR_DPP_TOKEN_CONTRACT_ADDRESS> -- ஒப்பந்தத்தில் இருந்து எடுக்கப்படும் <YOUR_BLOCKCHAIN_NETWORK> <YOUR_SUBGRAPH_NAME>

// This command will guide you through setting up the basic subgraph structure,
// including the subgraph.yaml, schema.graphql, and mapping files.

// 3. Conceptual subgraph.yaml configuration
// This is a simplified representation of the necessary configuration in subgraph.yaml.
// Replace placeholders with your actual values.
/*
specVersion: 0.0.7
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: DPPToken
    network: {{ YOUR_BLOCKCHAIN_NETWORK }}
    source:
      address: "{{ YOUR_DPP_TOKEN_CONTRACT_ADDRESS }}" // Replace with deployed DPPToken proxy address
      abi: DPPToken
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - PassportMinted
        - StatusUpdated
        - CustodyTransferred
        - MetadataUpdated
      abis:
        - name: DPPToken
          file: ./abis/DPPToken.json // Path to your DPPToken ABI file
      eventHandlers:
        - event: PassportMinted(indexed uint256,indexed address,string)
          handler: handlePassportMinted
        - event: StatusUpdated(indexed uint256,Status,Status)
          handler: handleStatusUpdated
        - event: CustodyTransferred(indexed uint256,indexed address,indexed address)
          handler: handleCustodyTransferred
        - event: MetadataUpdated(indexed uint256,string,string)
          handler: handleMetadataUpdated
      file: ./src/mapping.ts // Path to your mapping file
*/

// 4. Conceptual schema.graphql
// Define the entities you want to index based on your contract events and data.
/*
type PassportMinted @entity { 
  id: Bytes! # Transaction hash + log index
  tokenId: BigInt!
  holder: Bytes!
  metadataHash: String!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type StatusUpdated @entity { 
  id: Bytes! # Transaction hash + log index
  tokenId: BigInt!
  oldStatus: Int! # Representing the enum value
  newStatus: Int! # Representing the enum value
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type CustodyTransferred @entity { 
  id: Bytes! # Transaction hash + log index
  tokenId: BigInt!
  from: Bytes!
  to: Bytes!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type MetadataUpdated @entity { 
  id: Bytes! # Transaction hash + log index
  tokenId: BigInt!
  oldMetadataHash: String!
  newMetadataHash: String!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

// You might also want to create an entity to represent the Passport itself
// and update its fields based on events.
// type Passport @entity {
//   id: BigInt! # tokenId 
//   metadataHash: String!
//   status: Int!
//   currentHolder: Bytes!
//   issuedAt: BigInt!
// }
*/

// 5. Conceptual mapping.ts
// This file contains the AssemblyScript code to handle the events.
/*
import { 
  PassportMinted as PassportMintedEvent,
  StatusUpdated as StatusUpdatedEvent,
  CustodyTransferred as CustodyTransferredEvent,
  MetadataUpdated as MetadataUpdatedEvent,
} from "../generated/DPPToken/DPPToken"; // Generated based on subgraph.yaml and ABI
import {
  PassportMinted,
  StatusUpdated, 
  CustodyTransferred,
  MetadataUpdated,
  // Passport // If you created a Passport entity
} from "../generated/schema"; // Generated based on schema.graphql

export function handlePassportMinted(event: PassportMintedEvent): void {
  let entity = new PassportMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.tokenId = event.params.tokenId;
  entity.holder = event.params.holder;
  entity.metadataHash = event.params.metadataHash;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Example of updating a Passport entity (if created)
  // let passport = Passport.load(event.params.tokenId.toString());
  // if (!passport) {
  //   passport = new Passport(event.params.tokenId.toString());
  //   passport.issuedAt = event.block.timestamp;
  // }
  // passport.metadataHash = event.params.metadataHash;
  // passport.currentHolder = event.params.holder;
  // passport.status = 1; // Assuming Status.Issued is 1
  // passport.save();
}

export function handleStatusUpdated(event: StatusUpdatedEvent): void {
  let entity = new StatusUpdated( 
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.tokenId = event.params.tokenId;
  entity.oldStatus = event.params.oldStatus;
  entity.newStatus = event.params.newStatus;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Example of updating a Passport entity (if created)
  // let passport = Passport.load(event.params.tokenId.toString());
  // if (passport) {
  //   passport.status = event.params.newStatus;
  //   passport.save();
  // }
}

export function handleCustodyTransferred(event: CustodyTransferredEvent): void {
  let entity = new CustodyTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.tokenId = event.params.tokenId;
  entity.from = event.params.from;
  entity.to = event.params.to;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Example of updating a Passport entity (if created)
  // let passport = Passport.load(event.params.tokenId.toString());
  // if (passport) {
  //   passport.currentHolder = event.params.to;
  //   passport.save();
  // }
}

export function handleMetadataUpdated(event: MetadataUpdatedEvent): void {
  let entity = new MetadataUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.tokenId = event.params.tokenId;
  entity.oldMetadataHash = event.params.oldMetadataHash;
  entity.newMetadataHash = event.params.newMetadataHash;
  entity.save();
}

// Implement similar handlers for handleCustodyTransferred and handleMetadataUpdated
*/

// 6. Build and Deploy the Subgraph
// graph codegen    // Generates AssemblyScript types from schema and ABI
// graph build      // Compiles the subgraph to WebAssembly
// graph deploy --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ <YOUR_SUBGRAPH_NAME>
// (Or deploy to your local Graph Node)

// 7. Querying the Subgraph
// You can query the indexed data using GraphQL endpoints provided by TheGraph.
// Example query (conceptual):
/*
{
  passportMinteds {
    id
    tokenId
    holder
    metadataHash
    blockTimestamp
  }
  statusUpdateds {
    id
    tokenId
    oldStatus
    newStatus
    blockTimestamp
  }
  // Query other entities as needed
}
*/

/**
 * This conceptual guide provides the foundational understanding for setting up a
 * TheGraph subgraph to index DPPToken events, enabling efficient querying
 * of historical data for traceability and audit trail purposes.
 */
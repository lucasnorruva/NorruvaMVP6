# Advanced Blockchain Architecture for Digital Product Passport (DPP)

This document outlines the proposed smart contract and governance architecture for the Norruva Digital Product Passport system. The design leverages an ERC-721 token to represent each passport and an ERC-20 governance token for the DAO.

## Smart Contracts

### DPP Token (ERC-721)
- Implemented in Solidity using the OpenZeppelin library.
- Upgradeable via the UUPS proxy pattern with rollback safety checks.
- Each token is bound to a `productId` and is non‑transferable by default (soulbound).
- Transfers can be enabled for specific tokens through a DAO vote.
- Token metadata is stored off-chain. The `tokenURI` points to a hashed IPFS or Arweave CID.

```solidity
struct Passport {
  string metadataHash;
  Status status;
  address currentHolder;
  uint256 issuedAt;
}
```

Lifecycle states: `Draft → Issued → InTransit → Verified → Flagged → Expired`.

Events:
- `PassportMinted`
- `StatusUpdated`
- `CustodyTransferred`
- `MetadataUpdated`

Role management uses `AccessControl` with roles for `MANUFACTURER`, `AUDITOR`, `CUSTOMS`, `CONSUMER`, and `DEFAULT_ADMIN_ROLE` controlled by the DAO.

Authorized delegate management is handled via a `delegateFor(address tokenId)` function.

### NORU Token (ERC-20)
- Used for governance, validator staking, and compliance fees.
- Fixed initial supply with capped emissions controlled by the DAO.
- Optional staking module for auditors and verifiers.
- Manufacturers are rewarded with NORU for submitting compliant passports.
- Small NORU amounts are burned on metadata updates or lifecycle changes.

## DAO Governance

- `GovernorBravo` pattern with NORU as the voting token.
- Proposals can approve auditors, penalize bad actors, or enable token transfers.
- On-chain voting is complemented by Snapshot for low-cost off-chain polls.
- A multisig (e.g., Gnosis Safe) executes upgrades and other high-value actions.

## Wallet Integration

- Supports MetaMask and WalletConnect using `ethers.js` or `viem`.
- Implements EIP-1271 for contract-based wallets.
- Custodial options include services like Privy or Web3Auth.
- Sign-In With Ethereum (EIP-4361) is exchanged for Firebase JWTs on the backend.

## Off-chain Metadata Storage

- Metadata is stored in JSON-LD or W3C VC format on IPFS or Arweave.
- The smart contract records a `bytes32` hash and the corresponding CID.
- Backend services sign the metadata and publish it when passports are created or updated.

## Backend APIs

Next.js API routes act as middleware between the frontend and the blockchain.
Important routes include:
- `/api/mint`
- `/api/updateStatus`
- `/api/transferOwnership`

Each route validates nonces and signatures to prevent replay attacks.

## Traceability

Every status or custody change emits an event, which can be indexed by TheGraph or other services. The frontend displays a timeline based on these events to provide an audit trail.

## Future Enhancements

- Verifiable Credentials that conform to EBSI standards.
- Zero-knowledge proofs for origin verification and confidential supplier data.
- NFC or QR codes that resolve to the `tokenURI` for physical product tags.


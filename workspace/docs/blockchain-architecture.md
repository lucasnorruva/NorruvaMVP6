# Advanced Blockchain Architecture for Digital Product Passport (DPP)

This document outlines the proposed smart contract and governance architecture for the Norruva Digital Product Passport system. The design leverages an ERC-721 token to represent each passport and an ERC-20 governance token for the DAO.

## Smart Contracts

### DPP Token (ERC-721)
- Implemented in Solidity using OpenZeppelin contracts (`ERC721Upgradeable`, `ERC721URIStorageUpgradeable`, `AccessControlEnumerableUpgradeable`, `UUPSUpgradeable`).
- Upgradeable via the UUPS proxy pattern, with upgrades authorized by the `DEFAULT_ADMIN_ROLE`.
- Each token ID (`tokenId`) represents a unique Digital Product Passport.
- Minting of new tokens is restricted to accounts with the `MINTER_ROLE`.
- Metadata hash updates for a token are restricted to the token owner or accounts with the `UPDATER_ROLE`.
- By default, tokens are "soulbound" (non-transferable by the owner). Transfers can only be initiated by an account holding the `TRANSFER_ROLE` (e.g., the DAO's Timelock contract after a successful governance vote) via the `daoTransfer` function.
- The `tokenURI` function constructs the metadata URI using a prefix (e.g., `"mock-uri-prefix:"`) and the stored `metadataHash` for the token.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol"; // For _setTokenURI
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract DPPToken is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, AccessControlEnumerableUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE"); // Added for DAO-controlled transfers

    // Mapping from token ID to its metadata hash (e.g., IPFS CID)
    mapping(uint256 => string) private _metadataHashes;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol, address defaultAdmin) public initializer {
        __ERC721_init(name, symbol);
        __ERC721URIStorage_init(); // Initialize ERC721URIStorage
        __AccessControlEnumerable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin); // Admin can mint by default
        _grantRole(UPDATER_ROLE, defaultAdmin); // Admin can update metadata by default
        _grantRole(TRANSFER_ROLE, defaultAdmin); // Admin can enable transfers by default
    }

    function mint(address to, uint256 tokenId, string memory metadataHash) public virtual onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
        _setTokenMetadataHash(tokenId, metadataHash);
    }

    function updateMetadataHash(uint256 tokenId, string memory newMetadataHash) public virtual {
        require(_exists(tokenId), "DPPToken: URI update for nonexistent token");
        require(hasRole(UPDATER_ROLE, _msgSender()) || _isApprovedOrOwner(_msgSender(), tokenId), "DPPToken: caller is not owner nor approved updater");
        
        string memory oldMetadataHash = _metadataHashes[tokenId]; // Store old hash for event
        _setTokenMetadataHash(tokenId, newMetadataHash);
        emit MetadataUpdate(tokenId, oldMetadataHash, newMetadataHash);
    }

    function _setTokenMetadataHash(uint256 tokenId, string memory metadataHash) internal virtual {
        _metadataHashes[tokenId] = metadataHash;
        // Note: ERC721URIStorage's _setTokenURI expects a full URI, not just a hash.
        // For this conceptual contract, we're managing the hash directly and constructing the URI in tokenURI.
        // If you were to store the full URI, you would use _setTokenURI(tokenId, constructedURI);
    }

    // Override tokenURI to construct it from the metadata hash
    function tokenURI(uint256 tokenId) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        require(_exists(tokenId), "DPPToken: URI query for nonexistent token");
        string memory metadataHash = _metadataHashes[tokenId];
        // Example: "ipfs://<metadataHash>" or "https://api.norruva.com/metadata/<tokenid>"
        // For this mock, we use a simple prefix.
        return string(abi.encodePacked("mock-uri-prefix:", metadataHash));
    }
    
    // --- Soulbound & DAO Transfer Logic ---
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        virtual
        override(ERC721Upgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (from != address(0) && to != address(0)) { // Not minting or burning
             // By default, transfers are restricted unless TRANSFER_ROLE holder initiates
            require(hasRole(TRANSFER_ROLE, _msgSender()), "Transfer restricted: Requires TRANSFER_ROLE or DAO approval.");
        }
    }

    // Allow DAO (or admin with TRANSFER_ROLE) to execute a transfer
    // This function is callable by someone with TRANSFER_ROLE (e.g., the Governor contract via Timelock)
    function daoTransfer(address from, address to, uint256 tokenId) public virtual onlyRole(TRANSFER_ROLE) {
        _transfer(from, to, tokenId);
    }

    // Override to prevent standard approvals, enforcing soulbound nature except via daoTransfer
    function approve(address, uint256) public virtual override {
        revert("Soulbound token: approval not allowed");
    }
    function setApprovalForAll(address, bool) public virtual override {
        revert("Soulbound token: approval not allowed");
    }
    // getApproved and isApprovedForAll will consequently always return address(0) and false respectively

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, AccessControlEnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(DEFAULT_ADMIN_ROLE) {}
    
    // Required by ERC721URIStorageUpgradeable if overriding tokenURI
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    // Custom event for metadata hash updates
    event MetadataUpdate(uint256 indexed _tokenId, string _oldMetadataHash, string _newMetadataHash);
}
```

**Events Emitted by `DPPToken.sol`:**
Standard ERC721 events:
- `Transfer(address indexed from, address indexed to, uint256 indexed tokenId)`
- `Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)` (Note: `approve` is reverted, so this event will not be emitted for direct approvals)
- `ApprovalForAll(address indexed owner, address indexed operator, bool approved)` (Note: `setApprovalForAll` is reverted, so this event will not be emitted)

AccessControl events:
- `RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)`
- `RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)`
- `RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)`

Custom events:
- `MetadataUpdate(uint256 indexed _tokenId, string _oldMetadataHash, string _newMetadataHash)`

**Roles:**
- `DEFAULT_ADMIN_ROLE`: Can grant/revoke roles and authorize contract upgrades.
- `MINTER_ROLE`: Can mint new DPP tokens.
- `UPDATER_ROLE`: Can update the metadata hash of any token. Token owners can also update their own token's metadata.
- `TRANSFER_ROLE`: Can initiate token transfers via the `daoTransfer` function, bypassing the default soulbound restriction. This role is typically granted to the DAO's Timelock contract.

Conceptual lifecycle states for a DPP (e.g., `Draft`, `Issued`, `Verified`, `Expired`) are managed off-chain within the Norruva platform and reflected in the DPP data, rather than being direct states within this `DPPToken` contract.

### NORU Token (ERC-20)
- Used for governance, validator staking, and compliance fees.
- Fixed initial supply with capped emissions controlled by the DAO.
- Optional staking module for auditors and verifiers.
- Manufacturers are rewarded with NORU for submitting compliant passports.
- Small NORU amounts are burned on metadata updates or lifecycle changes.

## DAO Governance

- `GovernorBravo` pattern with NORU as the voting token.
- Proposals can approve auditors, penalize bad actors, or enable token transfers (by calling `daoTransfer` on `DPPToken` via the Timelock).
- On-chain voting is complemented by Snapshot for low-cost off-chain polls.
- A multisig (e.g., Gnosis Safe) executes upgrades and other high-value actions.

## Wallet Integration

- Supports MetaMask and WalletConnect using `ethers.js` or `viem`.
- Implements EIP-1271 for contract-based wallets.
- Custodial options include services like Privy or Web3Auth.
- Sign-In With Ethereum (EIP-4361) is exchanged for Firebase JWTs on the backend.

## Off-chain Metadata Storage

- Metadata is stored in JSON-LD or W3C VC format on IPFS or Arweave.
- The smart contract records a `metadataHash` which conceptually would be the CID.
- Backend services sign the metadata and publish it when passports are created or updated.

## Backend APIs

Next.js API routes act as middleware between the frontend and the blockchain.
Important routes include:
- `/api/v1/token/mint/{productId}` (to trigger the `mint` function on `DPPToken.sol`)
- `/api/v1/token/metadata/{tokenId}` (to trigger `updateMetadataHash` on `DPPToken.sol`)
- Conceptual endpoint to trigger `daoTransfer` after a DAO vote.

Each route validates nonces and signatures to prevent replay attacks.

## Traceability

Every significant action (minting, metadata update, transfer) emits an event on the `DPPToken` contract, which can be indexed by TheGraph or other services. The frontend displays a timeline based on these events to provide an audit trail.

## Future Enhancements

- Verifiable Credentials that conform to EBSI standards for richer on-chain/off-chain claims.
- Zero-knowledge proofs for origin verification and confidential supplier data.
- NFC or QR codes that resolve to the `tokenURI` for physical product tags.

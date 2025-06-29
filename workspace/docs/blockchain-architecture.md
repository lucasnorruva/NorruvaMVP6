# Advanced Blockchain Architecture for Digital Product Passport (DPP)

This document outlines the proposed smart contract and governance architecture for the Norruva Digital Product Passport system. The design leverages an ERC-721 token to represent each passport and an ERC-20 governance token for the DAO.

## Smart Contracts

### DPP Token (ERC-721)

- Implemented in Solidity using OpenZeppelin contracts (`ERC721Upgradeable`, `ERC721URIStorageUpgradeable`, `AccessControlEnumerableUpgradeable`, `UUPSUpgradeable`).
- Upgradeable via the UUPS proxy pattern, with upgrades authorized by the `DEFAULT_ADMIN_ROLE`.
- Each token ID (`tokenId`) represents a unique Digital Product Passport.
- Minting of new tokens is restricted to accounts with the `MINTER_ROLE`.
- Metadata hash updates for a token are restricted to the token owner or accounts with the `UPDATER_ROLE`.
- By default, tokens are "soulbound" (non-transferable by the owner via standard ERC721 `transferFrom`, `safeTransferFrom`). Transfers can only be initiated by an account holding the `TRANSFER_ROLE` (e.g., the DAO's Timelock contract after a successful governance vote) via the dedicated `daoTransfer` function.
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
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE"); // For DAO-controlled transfers

    // Mapping from token ID to its metadata hash (e.g., IPFS CID)
    mapping(uint256 => string) private _metadataHashes;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol, address defaultAdmin) public initializer {
        __ERC721_init(name, symbol);
        __ERC721URIStorage_init();
        __AccessControlEnumerable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin); // Admin can mint by default
        _grantRole(UPDATER_ROLE, defaultAdmin); // Admin can update metadata by default
        _grantRole(TRANSFER_ROLE, defaultAdmin); // Admin can execute DAO transfers by default
    }

    function mint(address to, uint256 tokenId, string memory metadataHash) public virtual onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
        _setTokenMetadataHash(tokenId, metadataHash);
        // ERC721URIStorage requires _setTokenURI to be called if its tokenURI is not overridden to use the hash directly.
        // Since we construct it dynamically in tokenURI, this direct call to _setTokenURI might not be strictly needed
        // IF tokenURI is overridden to use _metadataHashes. If ERC721URIStorage's tokenURI is used, then:
        // _setTokenURI(tokenId, string(abi.encodePacked("mock-uri-prefix:", metadataHash)));
        emit MetadataUpdate(tokenId, "", metadataHash); // Emit custom event
    }

    function updateMetadataHash(uint256 tokenId, string memory newMetadataHash) public virtual {
        require(_exists(tokenId), "DPPToken: URI update for nonexistent token");
        require(hasRole(UPDATER_ROLE, _msgSender()) || _isApprovedOrOwner(_msgSender(), tokenId), "DPPToken: caller is not owner nor approved updater");

        string memory oldMetadataHash = _metadataHashes[tokenId];
        _setTokenMetadataHash(tokenId, newMetadataHash);
        // Similar to mint, if using ERC721URIStorage's tokenURI:
        // _setTokenURI(tokenId, string(abi.encodePacked("mock-uri-prefix:", newMetadataHash)));
        emit MetadataUpdate(tokenId, oldMetadataHash, newMetadataHash);
    }

    function _setTokenMetadataHash(uint256 tokenId, string memory metadataHash) internal virtual {
        _metadataHashes[tokenId] = metadataHash;
    }

    // Override tokenURI to construct it from the metadata hash
    function tokenURI(uint256 tokenId) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        require(_exists(tokenId), "DPPToken: URI query for nonexistent token");
        string memory metadataHash = _metadataHashes[tokenId];
        require(bytes(metadataHash).length > 0, "DPPToken: metadata hash not set");
        // Example: "ipfs://<metadataHash>" or "https://api.norruva.com/metadata/<tokenid>"
        return string(abi.encodePacked("mock-uri-prefix:", metadataHash));
    }

    // --- Soulbound & DAO Transfer Logic ---
    // This hook restricts standard transfers. Only accounts with TRANSFER_ROLE can bypass this via daoTransfer.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        virtual
        override(ERC721Upgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (from != address(0) && to != address(0)) { // Not minting or burning
            // Standard transfers are restricted.
            // The _msgSender() here would be the one initiating transferFrom/safeTransferFrom.
            // If daoTransfer is called, _msgSender() inside _transfer (called by daoTransfer) would be this contract.
            // The hasRole check in daoTransfer itself protects it.
            // This hook effectively makes standard transfers fail unless initiated by an account with TRANSFER_ROLE.
            if (!hasRole(TRANSFER_ROLE, _msgSender())) {
                 revert("Transfer restricted: Requires TRANSFER_ROLE or DAO approval.");
            }
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

- `DEFAULT_ADMIN_ROLE`: Can grant/revoke roles and authorize contract upgrades. Typically the deployer or a governance contract.
- `MINTER_ROLE`: Can mint new DPP tokens by calling the `mint` function.
- `UPDATER_ROLE`: Can update the metadata hash of any token by calling `updateMetadataHash`. Token owners can also update their own token's metadata.
- `TRANSFER_ROLE`: Can initiate token transfers via the `daoTransfer` function, bypassing the default soulbound restriction. This role is typically granted to the DAO's Timelock contract, allowing governance-approved transfers.

Conceptual lifecycle states for a DPP (e.g., `Draft`, `Issued`, `Verified`, `Expired`) are managed off-chain within the Norruva platform and reflected in the DPP data, rather than being direct states within this `DPPToken` contract.

### NORU Token (ERC-20)

- Implemented in Solidity using OpenZeppelin contracts (`ERC20Upgradeable`, `ERC20BurnableUpgradeable`, `ERC20CappedUpgradeable`, `AccessControlEnumerableUpgradeable`, `UUPSUpgradeable`).
- Used for governance (voting on DAO proposals), potentially for staking by verifiers/auditors, and for platform-related fees (e.g., premium features, high-volume API access).
- Capped total supply, with an initial supply minted to a treasury or deployer address.
- Further minting is restricted to accounts with the `MINTER_ROLE` on the `NORUToken` contract, up to the defined cap.
- Supports standard ERC-20 operations (`transfer`, `approve`, `transferFrom`) and burning (`burn`, `burnFrom`).
- Upgradeable via the UUPS proxy pattern, with upgrades authorized by the `DEFAULT_ADMIN_ROLE` on the `NORUToken` contract.

## DAO Governance

- Based on OpenZeppelin's `GovernorUpgradeable` and `TimelockControllerUpgradeable` contracts.
- The `DPPGovernor.sol` contract uses `NORUToken` for voting power (via `ERC20VotesUpgradeable` standard, which `NORUToken` would need to implement or be compatible with).
- Proposals can target any contract, enabling governance over:
  - `DPPToken.sol`: e.g., granting/revoking roles, or initiating DAO-controlled transfers via the `daoTransfer` function (the proposal's action would be a call to `timelock.schedule(...)` which in turn calls `dppToken.daoTransfer(...)`).
  - `NORUToken.sol`: e.g., minting new tokens (if below cap and authorized), adjusting token parameters (if any are made configurable).
  - `DPPGovernor.sol` itself: e.g., adjusting voting parameters like quorum, voting period, or proposal threshold.
  - `TimelockControllerUpgradeable.sol`: e.g., adjusting the minimum delay.
- On-chain voting process typically involves: proposal creation, voting period, succeeded/defeated state, queuing in Timelock, delay period, execution.
- A multisig wallet (e.g., Gnosis Safe) could initially hold the `DEFAULT_ADMIN_ROLE` for critical contracts and the Timelock, potentially transitioning full control to the DAO over time.

## Wallet Integration

- Supports MetaMask and WalletConnect using `ethers.js` or `viem`.
- Implements EIP-1271 for contract-based wallets.
- Custodial options include services like Privy or Web3Auth.
- Sign-In With Ethereum (EIP-4361) is exchanged for Firebase JWTs on the backend.

## Off-chain Metadata Storage

- Metadata is stored in JSON-LD or W3C VC format on IPFS or Arweave.
- The smart contract records a `metadataHash` which conceptually would be the IPFS CID or a similar content-addressable identifier.
- Backend services sign the metadata and publish it when passports are created or updated. The `tokenURI` on `DPPToken.sol` then constructs a full URI using this hash (e.g., `ipfs://{metadataHash}`).

## Backend API and Smart Contract Interaction

Next.js API routes act as middleware between the frontend/clients and the blockchain. These APIs abstract the complexities of smart contract interactions.

- **`POST /api/v1/token/mint/{productId}`**:
  - **Conceptual Backend Action**: Validates product and user, prepares metadata (calculating its hash), generates a unique `tokenId` for the DPP, and then instructs a backend wallet (holding `MINTER_ROLE` on `DPPToken.sol`) to call `DPPToken.mint(recipientAddress, tokenId, metadataHash)`.
  - The `recipientAddress` and `contractAddress` are provided in the API request body.
  - Returns the `tokenId` and `transactionHash`.

- **`PATCH /api/v1/token/metadata/{tokenId}`**:
  - **Conceptual Backend Action**: Validates the `tokenId` and new `metadataUri`. The backend calculates the `newMetadataHash` from the URI. It then instructs a backend wallet (holding `UPDATER_ROLE` or if the wallet is the token owner) to call `DPPToken.updateMetadataHash(tokenId, newMetadataHash)`.
  - Returns the `transactionHash`.

- **`GET /api/v1/token/status/{tokenId}`**:
  - **Conceptual Backend Action**: Connects to a blockchain node, instantiates `DPPToken.sol`, and calls view functions like `ownerOf(tokenId)` and `tokenURI(tokenId)` (which returns the URI containing the metadata hash).
  - May also query past `Transfer` events to determine a conceptual "on-chain status" (e.g., 'minted', 'transferred').

- **DAO-Controlled Transfers (e.g., `DPPToken.daoTransfer`)**:
  - These are not typically triggered directly by a simple user-facing API like the above.
  - **Conceptual Workflow**:
    1.  A governance proposal is created on `DPPGovernor.sol` to call `DPPToken.daoTransfer(from, to, tokenId)`.
    2.  The proposal passes the voting phase.
    3.  The proposal is queued in `TimelockControllerUpgradeable.sol`.
    4.  After the `minDelay`, the proposal is executed from the Timelock. The Timelock contract, which must hold the `TRANSFER_ROLE` on `DPPToken.sol`, calls `DPPToken.daoTransfer(...)`.
  - The application's UI might display the status of such proposals or allow users with appropriate voting power (NORU tokens) to vote on them.

Each API route that initiates a state-changing transaction (mint, update metadata) must securely manage private keys for the backend wallet and handle transaction signing, broadcasting, and confirmation. Nonce management and gas fee estimation are also critical.

## Traceability

Every significant action (minting, metadata update, DAO-controlled transfer) emits an event on the `DPPToken` contract, which can be indexed by TheGraph or other services. The frontend displays a timeline based on these events to provide an audit trail.

## Future Enhancements

- Verifiable Credentials that conform to EBSI standards for richer on-chain/off-chain claims.
- Zero-knowledge proofs for origin verification and confidential supplier data.
- NFC or QR codes that resolve to the `tokenURI` for physical product tags.

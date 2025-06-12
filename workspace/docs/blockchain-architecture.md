# Advanced Blockchain Architecture for Digital Product Passport (DPP)

This document outlines the proposed smart contract and governance architecture for the Norruva Digital Product Passport system. The design leverages an ERC-721 token to represent each passport and an ERC-20 governance token for the DAO.

## Smart Contracts

### DPP Token (ERC-721)
- Implemented in Solidity using the OpenZeppelin library (`ERC721Upgradeable`, `ERC721URIStorageUpgradeable`, `AccessControlEnumerableUpgradeable`, `UUPSUpgradeable`).
- Upgradeable via the UUPS proxy pattern with `_authorizeUpgrade` controlled by `DEFAULT_ADMIN_ROLE`.
- Each token is bound to a `productId` (represented by `tokenId`).
- Minting is controlled by a `MINTER_ROLE`.
- Metadata hash updates are controlled by the token owner or an `UPDATER_ROLE`.
- `tokenURI` returns a conceptual URI constructed from a stored metadata hash (e.g., `mock-uri-prefix:<metadataHash>`).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract DPPToken is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, AccessControlEnumerableUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

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
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(UPDATER_ROLE, defaultAdmin);
    }

    function mint(address to, uint256 tokenId, string memory metadataHash) public virtual onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
        _setTokenMetadataHash(tokenId, metadataHash);
    }

    function updateMetadataHash(uint256 tokenId, string memory newMetadataHash) public virtual {
        require(_exists(tokenId), "DPPToken: URI update for nonexistent token");
        require(hasRole(UPDATER_ROLE, _msgSender()) || _isApprovedOrOwner(_msgSender(), tokenId), "DPPToken: caller is not owner nor approved updater");
        _setTokenMetadataHash(tokenId, newMetadataHash);
    }

    function _setTokenMetadataHash(uint256 tokenId, string memory metadataHash) internal virtual {
        _metadataHashes[tokenId] = metadataHash;
        emit MetadataUpdate(tokenId, "", metadataHash); // Placeholder old hash
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        require(_exists(tokenId), "DPPToken: URI query for nonexistent token");
        string memory metadataHash = _metadataHashes[tokenId];
        return string(abi.encodePacked("mock-uri-prefix:", metadataHash));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, AccessControlEnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(DEFAULT_ADMIN_ROLE) {}
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    event MetadataUpdate(uint256 indexed _tokenId, string _oldMetadataHash, string _newMetadataHash);
}

```
Conceptual lifecycle states handled off-chain or by a different contract: `Draft → Issued → InTransit → Verified → Flagged → Expired`.

Events:
- `Transfer` (ERC721 standard)
- `Approval` (ERC721 standard)
- `ApprovalForAll` (ERC721 standard)
- `RoleAdminChanged` (AccessControl standard)
- `RoleGranted` (AccessControl standard)
- `RoleRevoked` (AccessControl standard)
- `MetadataUpdate` (Custom, for metadata hash changes)

Role management uses `AccessControlEnumerableUpgradeable` with roles for `MINTER_ROLE`, `UPDATER_ROLE`, and `DEFAULT_ADMIN_ROLE`.

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
- The smart contract records a `metadataHash` which conceptually would be the CID.
- Backend services sign the metadata and publish it when passports are created or updated.

## Backend APIs

Next.js API routes act as middleware between the frontend and the blockchain.
Important routes include:
- `/api/v1/token/mint/{productId}`
- `/api/v1/token/metadata/{tokenId}` (to update URI on-chain)

Each route validates nonces and signatures to prevent replay attacks.

## Traceability

Every status or custody change emits an event, which can be indexed by TheGraph or other services. The frontend displays a timeline based on these events to provide an audit trail.

## Future Enhancements

- Verifiable Credentials that conform to EBSI standards.
- Zero-knowledge proofs for origin verification and confidential supplier data.
- NFC or QR codes that resolve to the `tokenURI` for physical product tags.

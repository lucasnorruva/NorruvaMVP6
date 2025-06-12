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
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");

    // Mapping from token ID to its metadata hash (e.g., IPFS CID)
    mapping(uint256 => string) private _metadataHashes;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol, address defaultAdmin) public virtual initializer {
        __ERC721_init(name, symbol);
        __ERC721URIStorage_init(); // Initialize ERC721URIStorage
        __AccessControlEnumerable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin); 
        _grantRole(UPDATER_ROLE, defaultAdmin); 
        _grantRole(TRANSFER_ROLE, defaultAdmin); 
    }

    function mint(address to, uint256 tokenId, string memory metadataHash) public virtual onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
        _setTokenMetadataHash(tokenId, metadataHash); // Set initial hash via internal function
    }

    function updateMetadataHash(uint256 tokenId, string memory newMetadataHash) public virtual {
        require(_exists(tokenId), "DPPToken: URI update for nonexistent token");
        require(hasRole(UPDATER_ROLE, _msgSender()) || _isApprovedOrOwner(_msgSender(), tokenId), "DPPToken: caller is not owner nor approved updater");
        
        string memory oldMetadataHash = _metadataHashes[tokenId];
        _setTokenMetadataHash(tokenId, newMetadataHash);
        emit MetadataUpdate(tokenId, oldMetadataHash, newMetadataHash);
    }

    function _setTokenMetadataHash(uint256 tokenId, string memory metadataHash) internal virtual {
        _metadataHashes[tokenId] = metadataHash;
        // Note: We are not calling _setTokenURI here to align with the spec's approach
        // of constructing the full URI dynamically in tokenURI().
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        require(_exists(tokenId), "DPPToken: URI query for nonexistent token");
        string memory metadataHash = _metadataHashes[tokenId];
        // Construct URI using a prefix as specified in workspace/docs/blockchain-architecture.md
        return string(abi.encodePacked("mock-uri-prefix:", metadataHash));
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        virtual
        override(ERC721Upgradeable) 
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (from != address(0) && to != address(0)) { // Not minting or burning
            require(hasRole(TRANSFER_ROLE, _msgSender()), "Transfer restricted: Requires TRANSFER_ROLE or DAO approval.");
        }
    }

    function daoTransfer(address from, address to, uint256 tokenId) public virtual onlyRole(TRANSFER_ROLE) {
        _transfer(from, to, tokenId);
    }

    function approve(address, uint256) public virtual override {
        revert("Soulbound token: approval not allowed");
    }

    function setApprovalForAll(address, bool) public virtual override {
        revert("Soulbound token: approval not allowed");
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, AccessControlEnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(DEFAULT_ADMIN_ROLE) {}
    
    // Required by ERC721URIStorageUpgradeable if overriding tokenURI and not _setTokenURI directly
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

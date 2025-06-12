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
    // DEFAULT_ADMIN_ROLE is already defined in AccessControlUpgradeable

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
        _grantRole(MINTER_ROLE, defaultAdmin); // Grant MINTER_ROLE to admin
        _grantRole(UPDATER_ROLE, defaultAdmin); // Grant UPDATER_ROLE to admin
    }

    function mint(address to, uint256 tokenId, string memory metadataHash) public virtual onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
        _setTokenMetadataHash(tokenId, metadataHash);
    }

    function updateMetadataHash(uint256 tokenId, string memory newMetadataHash) public virtual {
        require(_exists(tokenId), "DPPToken: URI update for nonexistent token");
        require(hasRole(UPDATER_ROLE, _msgSender()) || _isApprovedOrOwner(_msgSender(), tokenId), "DPPToken: caller is not owner nor approved updater");
        
        string memory oldMetadataHash = _metadataHashes[tokenId]; // Get old hash before setting new one
        _setTokenMetadataHash(tokenId, newMetadataHash);
        emit MetadataUpdate(tokenId, oldMetadataHash, newMetadataHash);
    }

    function _setTokenMetadataHash(uint256 tokenId, string memory metadataHash) internal virtual {
        _metadataHashes[tokenId] = metadataHash;
        // Note: The tokenURI function constructs the full URI, so we only store the hash.
        // The MetadataUpdate event is now emitted in updateMetadataHash after getting the old hash.
        // If minting, the old hash would conceptually be empty.
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        require(_exists(tokenId), "DPPToken: URI query for nonexistent token");
        string memory metadataHash = _metadataHashes[tokenId];
        // For mock purposes, we'll just return the hash, or a prefixed version.
        // In a real scenario, this would be an IPFS URI like "ipfs://<metadataHash>"
        return string(abi.encodePacked("mock-uri-prefix:", metadataHash));
    }
    
    // @notice This function is required by ERC721URIStorageUpgradeable.
    // It's called internally when a token is burned to clear its URI storage.
    function _burn(uint256 tokenId, bool approvalCheck) internal virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId, approvalCheck);
        // ERC721URIStorageUpgradeable's _burn already clears the token URI by calling _setTokenURI(tokenId, "")
        // which in our case means it would try to set the hash to empty.
        // We can explicitly clear our hash mapping too if needed, though super._burn should handle it via _setTokenURI.
        if (bytes(_metadataHashes[tokenId]).length != 0) {
            delete _metadataHashes[tokenId];
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, AccessControlEnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(DEFAULT_ADMIN_ROLE) {}
    
    // Required by OpenZeppelin when overriding _update from multiple parents
    // This _update function is from ERC721Upgradeable and ERC721URIStorageUpgradeable calls ERC721Upgradeable's version.
    // We don't need to explicitly call ERC721URIStorageUpgradeable's _update here.
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

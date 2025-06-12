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
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE; // Re-export for clarity

    // Mapping from token ID to metadata hash (replacing direct URI storage for simplicity)
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
        _grantRole(MINTER_ROLE, defaultAdmin); // Admin can also mint initially
        _grantRole(UPDATER_ROLE, defaultAdmin); // Admin can also update initially
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
        // ERC721URIStorageUpgradeable's _setTokenURI is for full URIs.
        // We are storing just the hash here and constructing the URI in tokenURI.
        // If you wanted to store the full IPFS URI directly, you'd use _setTokenURI.
        emit MetadataUpdate(tokenId, "", metadataHash); // Custom event if needed, or rely on ERC721URIStorage event if using _setTokenURI
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        require(_exists(tokenId), "DPPToken: URI query for nonexistent token");
        string memory metadataHash = _metadataHashes[tokenId];
        // In a real scenario, this would be something like:
        // return string(abi.encodePacked("ipfs://", metadataHash));
        // For mock purposes, just returning the hash or a prefixed hash:
        return string(abi.encodePacked("mock-uri-prefix:", metadataHash));
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, AccessControlEnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(DEFAULT_ADMIN_ROLE) {}

    // Override _update to ensure ERC721URIStorage's version is called if it has logic for URI clearing on transfer/burn.
    // This is important if the base _update from ERC721URIStorageUpgradeable has specific logic related to URIs.
    // For this basic hash storage, direct override might not be strictly needed but good practice.
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    // Custom event, if ERC721URIStorage's events are not sufficient
    event MetadataUpdate(uint256 indexed _tokenId, string _oldMetadataHash, string _newMetadataHash);
}

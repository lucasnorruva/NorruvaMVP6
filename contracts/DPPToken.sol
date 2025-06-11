// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

contract DPPToken is Initializable, ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using StringsUpgradeable for uint256;

    // --- Roles ---
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant CUSTOMS_ROLE = keccak256("CUSTOMS_ROLE");
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // --- Structs ---
    enum Status {
        Draft,
        Issued,
        InTransit,
        Verified,
        Flagged,
        Expired
    }

    struct Passport {
        string metadataHash;
        Status status;
        address currentHolder;
        uint256 issuedAt;
    }

    // --- State Variables ---
    CountersUpgradeable.Counter private _tokenIdCounter;
    mapping(uint256 => Passport) private _passports;
    mapping(uint256 => address) private _delegates; // For delegateFor mechanism

    function initialize(address admin) public initializer { // Renamed to initialize
        __ERC721_init("Digital Product Passport Token", "DPP");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        // Grant initial roles as needed
    }

    function approve(address, uint256) public pure override {
        revert("Soulbound");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound");
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override
    {
         super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // Transfers are only allowed if the 'from' or 'to' address is the designated delegate
        // The DAO override mechanism will bypass this check in the `daoTransfer` function.
        require(from == address(0) || to == address(0) || from == _delegates[tokenId] || to == _delegates[tokenId], "DPP token is soulbound and can only be transferred by a delegate or the DAO");

    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    // --- Minting ---
    function mint(address to, string calldata metadataHash)
        external
        onlyRole(MINTER_ROLE) // Restrict to MINTER_ROLE
    {   
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();

        _safeMint(to, newItemId);

        _passports[newItemId] = Passport({
            metadataHash: metadataHash,
            status: Status.Issued, // Initial status is Issued
            currentHolder: to,
            issuedAt: block.timestamp
        });

        emit PassportMinted(newItemId, to, metadataHash);
    }

    // --- DAO Override Transfer ---
    /// @notice Allows the DAO to transfer a soulbound token, bypassing the regular transfer restrictions.
    /// This function should only be callable by the governance contract or an address with a specific DAO role.
    function daoTransfer(address from, address to, uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // We don't call _beforeTokenTransfer here to bypass the soulbound check
        // The actual transfer is done using _transfer
        _transfer(from, to, tokenId);

        // Update passport holder and emit CustodyTransferred event
        require(_exists(tokenId), "DPPToken: DAO transfer of nonexistent token");
        _passports[tokenId].currentHolder = to;
        emit CustodyTransferred(tokenId, from, to);
    }



    // --- Metadata ---
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Implementation will be in Task 6
        return string(abi.encodePacked("ipfs://", _passports[tokenId].metadataHash));
    }

    function updateMetadata(uint256 tokenId, string calldata newMetadataHash) external {
        // Implementation will be in Task 6 with access control
        onlyRole(MANUFACTURER_ROLE); // Restrict to MANUFACTURER_ROLE
 require(_exists(tokenId), \"DPPToken: Metadata update for nonexistent token\");
 string memory oldMetadataHash = _passports[tokenId].metadataHash;
        _passports[tokenId].metadataHash = newMetadataHash;
        emit MetadataUpdated(tokenId, oldMetadataHash, newMetadataHash);
    }

    // --- Status Updates ---
    function updateStatus(uint256 tokenId, Status newStatus) external {
        onlyRole(DEFAULT_ADMIN_ROLE); // Restrict to DEFAULT_ADMIN_ROLE initially
        require(_exists(tokenId), "DPPToken: Status update for nonexistent token");
        Status oldStatus = _passports[tokenId].status;
        _passports[tokenId].status = newStatus;
        emit StatusUpdated(tokenId, oldStatus, newStatus);
    }

    // --- Delegate Mechanism ---
    function delegateFor(uint256 tokenId, address delegate) external {
        onlyRole(DEFAULT_ADMIN_ROLE); // Restrict to DEFAULT_ADMIN_ROLE initially
        require(_exists(tokenId), "DPPToken: Cannot delegate for nonexistent token");
        _delegates[tokenId] = delegate;
    }

    function getDelegate(uint256 tokenId) external view returns (address) {
        require(_exists(tokenId), "DPPToken: Cannot get delegate for nonexistent token");

        return _delegates[tokenId];
    }

    // --- Get Passport Details ---
    function getPassport(uint256 tokenId) external view returns (Passport memory) {
        // Implementation will be in Task 10
         require(bytes(_passports[tokenId].metadataHash).length > 0, "Passport not minted"); // Ensure passport exists
         return _passports[tokenId];
    }
}


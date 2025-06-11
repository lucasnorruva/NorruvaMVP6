// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DPPToken is Initializable, ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    function initialize(address admin) public initializer {
        __ERC721_init("Digital Product Passport Token", "DPP");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(TRANSFER_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mint(address to, uint256 tokenId) external onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
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
        if (from != address(0) && to != address(0)) {
            require(hasRole(TRANSFER_ROLE, _msgSender()), "Transfer restricted");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
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
}


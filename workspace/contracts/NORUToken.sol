// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract NORUToken is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20VotesUpgradeable, AccessControlEnumerableUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _cap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol, address initialAdmin, uint256 initialSupply, uint256 cap_) public virtual initializer {
        __ERC20_init(name, symbol);
        __ERC20Burnable_init();
        __AccessControlEnumerable_init();
        __UUPSUpgradeable_init();
        __ERC20Votes_init(); // Initialize ERC20Votes

        require(initialSupply <= cap_, "NORUToken: initial supply exceeds cap");
        _cap = cap_;

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin); // Grant MINTER_ROLE to the initial admin

        if (initialSupply > 0) {
            _mint(initialAdmin, initialSupply);
        }
    }

    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    function mint(address to, uint256 amount) public virtual onlyRole(MINTER_ROLE) {
        require(ERC20Upgradeable.totalSupply() + amount <= _cap, "NORUToken: cap exceeded");
        _mint(to, amount);
    }

    // _afterTokenTransfer is required for ERC20VotesUpgradeable
    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._afterTokenTransfer(from, to, amount);
    }

    // _mint is required for ERC20VotesUpgradeable
    function _mint(address to, uint256 amount) internal virtual override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._mint(to, amount);
    }

    // _burn is required for ERC20VotesUpgradeable
    function _burn(address account, uint256 amount) internal virtual override(ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20VotesUpgradeable) {
        super._burn(account, amount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlEnumerableUpgradeable, ERC20Upgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(DEFAULT_ADMIN_ROLE) {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NORUToken.sol"; // Assuming NORUToken.sol is in the same directory or path is correct

contract NORUTokenV2 is NORUToken {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // Required for UUPS
    }

    // If V1 (NORUToken) has an initializer like:
    // initialize(string memory name, string memory symbol, address initialAdmin, uint256 initialSupply)
    // And V2 adds no new state variables that need initializing beyond what V1 did,
    // then V2 might not need its own explicit initializeV2 function.
    // However, if V2 adds new state or changes initialization logic, it would need one.
    // For this example, we assume V2 just adds a version function and is compatible.

    function version() public pure virtual returns (string memory) {
        return "V2";
    }

    // _authorizeUpgrade is inherited from NORUToken (which should inherit from UUPSUpgradeable)
    // and should already be restricted (e.g., to DEFAULT_ADMIN_ROLE).
    // If NORUToken itself doesn't directly include it, and UUPSUpgradeable is its parent,
    // this function is implicitly handled by UUPSUpgradeable's _authorizeUpgrade logic
    // which typically calls _checkRole(DEFAULT_ADMIN_ROLE).
    // Explicitly overriding it like below is good practice if you want to be certain
    // or if the base contract (NORUToken) did not already define it.
    // function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}

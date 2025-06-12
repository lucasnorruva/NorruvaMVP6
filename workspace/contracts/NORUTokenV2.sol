
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NORUToken.sol"; // Import the base contract

// A simple V2 contract for testing upgradeability.
contract NORUTokenV2 is NORUToken {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // Required for UUPS upgradeable contracts
    }

    // This function is added in V2 to demonstrate a successful upgrade.
    function version() public pure returns (string memory) {
        return "V2";
    }

    // If NORUTokenV2 had its own initializer that needed to be called upon upgrade,
    // it would be defined here and called via the 'call' option in upgrades.upgradeProxy.
    // For example:
    // function initializeV2(string memory newParameter) public reinitializer(2) {
    //     // Additional V2 initialization logic here
    // }
    // And in the test:
    // await upgrades.upgradeProxy(noruTokenAddress, NORUTokenV2Factory, { call: { func: "initializeV2", args: ["testParam"] } });
    // For this basic version check, re-initialization is not strictly needed if state layout is compatible.
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DPPToken.sol";

contract DPPTokenV2 is DPPToken {
    function version() external pure returns (uint256) {
        return 2;
    }
}

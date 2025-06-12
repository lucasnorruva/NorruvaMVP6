// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleTarget is Ownable {
    uint256 public value;
    string public lastAction;

    event ValueSet(uint256 newValue, address indexed caller);
    event ActionCalled(string actionName, address indexed caller);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setValue(uint256 _newValue) public {
        value = _newValue;
        lastAction = "setValue";
        emit ValueSet(_newValue, msg.sender);
    }

    function performAction(string memory _actionName) public {
        lastAction = _actionName;
        emit ActionCalled(_actionName, msg.sender);
    }

    // Function to allow DAO to call and transfer ownership to itself (the Timelock/Governor)
    // This is useful if the contract needs to be managed by the DAO after initial setup
    function transferContractOwnership(address newOwner) public onlyOwner {
        transferOwnership(newOwner);
    }
}

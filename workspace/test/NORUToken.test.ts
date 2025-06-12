
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// Adjust the import path if your typechain output directory is different
import type { NORUToken, NORUTokenV2 } from "../typechain-types";

describe("NORUToken", function () {
  let noruToken: NORUToken;
  let owner: SignerWithAddress; // Will be the initialAdmin and receive initialSupply
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const TOKEN_NAME = "Norruva Governance Token";
  const TOKEN_SYMBOL = "NORU";
  const INITIAL_SUPPLY_UNITS = "1000000"; // 1 million
  const INITIAL_SUPPLY = ethers.parseUnits(INITIAL_SUPPLY_UNITS, 18);

  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
  // MINTER_ROLE might not be used if minting is restricted after initialization for a fixed supply token
  // const MINTER_ROLE = ethers.id("MINTER_ROLE"); 

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const NORUTokenFactory = await ethers.getContractFactory("NORUToken");
    noruToken = (await upgrades.deployProxy(
      NORUTokenFactory,
      [TOKEN_NAME, TOKEN_SYMBOL, owner.address, INITIAL_SUPPLY],
      {
        initializer: "initialize",
        kind: "uups",
      }
    )) as unknown as NORUToken;
    await noruToken.waitForDeployment();
  });

  describe("Deployment & Initialization", function () {
    it("Should have the correct name and symbol", async function () {
      expect(await noruToken.name()).to.equal(TOKEN_NAME);
      expect(await noruToken.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should have 18 decimals", async function () {
      expect(await noruToken.decimals()).to.equal(18);
    });

    it("Should mint the initial supply to the initialAdmin (owner)", async function () {
      expect(await noruToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
      expect(await noruToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should grant DEFAULT_ADMIN_ROLE to the initialAdmin (owner)", async function () {
      expect(await noruToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });
  });

  describe("ERC-20 Functionality", function () {
    it("Should allow transfer of tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 18);
      await expect(noruToken.connect(owner).transfer(user1.address, transferAmount))
        .to.emit(noruToken, "Transfer")
        .withArgs(owner.address, user1.address, transferAmount);

      expect(await noruToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - transferAmount);
      expect(await noruToken.balanceOf(user1.address)).to.equal(transferAmount);
    });

    it("Should not allow transfer more than balance", async function () {
      const tooLargeAmount = ethers.parseUnits("2000000", 18); // More than initial supply
      await expect(
        noruToken.connect(owner).transfer(user1.address, tooLargeAmount)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should allow approval and transferFrom", async function () {
      const approveAmount = ethers.parseUnits("50", 18);
      const transferAmount = ethers.parseUnits("30", 18);

      await expect(noruToken.connect(owner).approve(user1.address, approveAmount))
        .to.emit(noruToken, "Approval")
        .withArgs(owner.address, user1.address, approveAmount);
      expect(await noruToken.allowance(owner.address, user1.address)).to.equal(approveAmount);

      await expect(noruToken.connect(user1).transferFrom(owner.address, user2.address, transferAmount))
        .to.emit(noruToken, "Transfer")
        .withArgs(owner.address, user2.address, transferAmount);

      expect(await noruToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - transferAmount);
      expect(await noruToken.balanceOf(user2.address)).to.equal(transferAmount);
      expect(await noruToken.allowance(owner.address, user1.address)).to.equal(approveAmount - transferAmount);
    });

    it("Should not allow transferFrom more than approved amount", async function () {
      const approveAmount = ethers.parseUnits("50", 18);
      const transferAmount = ethers.parseUnits("60", 18); // More than approved
      await noruToken.connect(owner).approve(user1.address, approveAmount);
      await expect(
        noruToken.connect(user1).transferFrom(owner.address, user2.address, transferAmount)
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });
  });

  describe("Role Management & Minting (if applicable)", function () {
    // If NORUToken is designed with a fixed supply (only minted in initializer),
    // then additional minting tests might not be relevant unless a MINTER_ROLE is used
    // for future controlled inflation. The current NORUToken.sol does not expose a public mint function
    // beyond the initializer for the initial supply.

    it("Only DEFAULT_ADMIN_ROLE should be able to grant roles (example: hypothetical MINTER_ROLE)", async function () {
      const HYPOTHETICAL_MINTER_ROLE = ethers.id("HYPOTHETICAL_MINTER_ROLE");
      await expect(noruToken.connect(user1).grantRole(HYPOTHETICAL_MINTER_ROLE, user2.address))
        .to.be.revertedWithCustomError(noruToken, "AccessControlUnauthorizedAccount")
        .withArgs(user1.address, DEFAULT_ADMIN_ROLE);

      await expect(noruToken.connect(owner).grantRole(HYPOTHETICAL_MINTER_ROLE, user2.address))
        .to.emit(noruToken, "RoleGranted")
        .withArgs(HYPOTHETICAL_MINTER_ROLE, user2.address, owner.address);
      expect(await noruToken.hasRole(HYPOTHETICAL_MINTER_ROLE, user2.address)).to.be.true;
    });
  });

  describe("Upgradeability (UUPS)", function () {
    it("Should be upgradeable by an admin", async function () {
      const NORUTokenV2Factory = await ethers.getContractFactory("NORUTokenV2"); // Assuming a V2 contract exists
      const noruTokenAddress = await noruToken.getAddress();
      
      const upgradedToken = (await upgrades.upgradeProxy(
        noruTokenAddress,
        NORUTokenV2Factory,
        // No explicit call options needed if V2's initialize is compatible or not called
      )) as unknown as NORUTokenV2;
      await upgradedToken.waitForDeployment();

      expect(await upgradedToken.getAddress()).to.equal(noruTokenAddress);
      // Assuming NORUTokenV2 has a version() function returning "V2"
      expect(await upgradedToken.version()).to.equal("V2"); 
    });

    it("Should not be upgradeable by a non-admin", async function () {
      const NORUTokenV2Factory = await ethers.getContractFactory("NORUTokenV2");
      const noruTokenV2Impl = await NORUTokenV2Factory.deploy();
      await noruTokenV2Impl.waitForDeployment();
      
      await expect(
        noruToken.connect(user1).upgradeToAndCall(await noruTokenV2Impl.getAddress(), "0x")
      ).to.be.revertedWithCustomError(noruToken, "AccessControlUnauthorizedAccount")
       .withArgs(user1.address, DEFAULT_ADMIN_ROLE);
    });
  });
});

// Create a dummy NORUTokenV2.sol for upgradeability testing
// You would create this file in contracts/NORUTokenV2.sol if it doesn't exist
/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NORUToken.sol"; // Import the base contract

contract NORUTokenV2 is NORUToken {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // We need to re-declare initialize to make it callable for V2 if needed,
    // or ensure it's not called if state should be preserved.
    // For simple version check, we might not need to call initialize again
    // if V2's state is compatible with V1's.

    function version() public pure returns (string memory) {
        return "V2";
    }

    // If V2 has a new initializer or needs to re-initialize, define it here.
    // For example, if it adds new state variables:
    // function initializeV2(string memory newParameter) public reinitializer(2) {
    //     // set newParameter
    // }
    // And in the test, when upgrading:
    // await upgrades.upgradeProxy(noruTokenAddress, NORUTokenV2Factory, { call: { func: "initializeV2", args: ["testParam"] } });
}
*/

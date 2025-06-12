
import { expect } from "chai";
import { ethers, upgrades, network } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// Adjust import paths if your typechain output directory is different
import type {
  NORUToken,
  TimelockControllerUpgradeable,
  DPPGovernor,
  DPPGovernorV2, // Assuming a V2 for upgrade testing
  SimpleTarget,
} from "../typechain-types";

describe("DPPGovernor", function () {
  let noruToken: NORUToken;
  let timelock: TimelockControllerUpgradeable;
  let governor: DPPGovernor;
  let targetContract: SimpleTarget;

  let owner: SignerWithAddress;
  let proposer: SignerWithAddress;
  let voter1: SignerWithAddress;
  let voter2: SignerWithAddress;
  let voter3: SignerWithAddress;
  let otherUser: SignerWithAddress;

  const TOKEN_NAME = "Norruva Governance Token";
  const TOKEN_SYMBOL = "NORU";
  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18); // 1 million NORU

  const TIMELOCK_MIN_DELAY = 3600; // 1 hour (for testing, can be shorter in local dev)
  const GOVERNOR_NAME = "Norruva DPP DAO Governor";

  const PROPOSER_ROLE = ethers.id("PROPOSER_ROLE");
  const EXECUTOR_ROLE = ethers.id("EXECUTOR_ROLE");
  const CANCELLER_ROLE = ethers.id("CANCELLER_ROLE");
  const TIMELOCK_ADMIN_ROLE = ethers.id("TIMELOCK_ADMIN_ROLE");

  beforeEach(async function () {
    [owner, proposer, voter1, voter2, voter3, otherUser] = await ethers.getSigners();

    // Deploy NORUToken
    const NORUTokenFactory = await ethers.getContractFactory("NORUToken");
    noruToken = (await upgrades.deployProxy(
      NORUTokenFactory,
      [TOKEN_NAME, TOKEN_SYMBOL, owner.address, INITIAL_SUPPLY],
      { initializer: "initialize", kind: "uups" }
    )) as unknown as NORUToken;
    await noruToken.waitForDeployment();

    // Distribute tokens and delegate votes
    const voteAmount = ethers.parseUnits("100", 18); // 100 NORU
    await noruToken.connect(owner).transfer(proposer.address, voteAmount);
    await noruToken.connect(owner).transfer(voter1.address, voteAmount);
    await noruToken.connect(owner).transfer(voter2.address, voteAmount);
    await noruToken.connect(owner).transfer(voter3.address, voteAmount);

    await noruToken.connect(proposer).delegate(proposer.address);
    await noruToken.connect(voter1).delegate(voter1.address);
    await noruToken.connect(voter2).delegate(voter2.address);
    await noruToken.connect(voter3).delegate(voter3.address);

    // Deploy TimelockController
    const TimelockFactory = await ethers.getContractFactory("TimelockControllerUpgradeable");
    timelock = (await upgrades.deployProxy(
      TimelockFactory,
      [TIMELOCK_MIN_DELAY, [], [], owner.address], // proposers, executors, admin
      { kind: "uups" }
    )) as unknown as TimelockControllerUpgradeable;
    await timelock.waitForDeployment();

    // Deploy DPPGovernor
    const GovernorFactory = await ethers.getContractFactory("DPPGovernor");
    governor = (await upgrades.deployProxy(
      GovernorFactory,
      [await noruToken.getAddress(), await timelock.getAddress(), GOVERNOR_NAME],
      { initializer: "initialize", kind: "uups" }
    )) as unknown as DPPGovernor;
    await governor.waitForDeployment();

    // Configure Timelock roles
    // Governor is PROPOSER and CANCELLER
    // EXECUTOR_ROLE for address(0) means anyone can execute a passed proposal
    await timelock.connect(owner).grantRole(PROPOSER_ROLE, await governor.getAddress());
    await timelock.connect(owner).grantRole(CANCELLER_ROLE, await governor.getAddress());
    await timelock.connect(owner).grantRole(EXECUTOR_ROLE, ethers.ZeroAddress);
    // Grant TIMELOCK_ADMIN_ROLE to Governor, then owner renounces it.
    await timelock.connect(owner).grantRole(TIMELOCK_ADMIN_ROLE, await governor.getAddress());
    await timelock.connect(owner).renounceRole(TIMELOCK_ADMIN_ROLE, owner.address);


    // Deploy SimpleTarget contract and transfer ownership to Timelock
    const SimpleTargetFactory = await ethers.getContractFactory("SimpleTarget");
    targetContract = await SimpleTargetFactory.deploy(owner.address); // Deployer is initial owner
    await targetContract.waitForDeployment();
    await targetContract.connect(owner).transferOwnership(await timelock.getAddress()); // Transfer to Timelock
  });

  describe("Deployment & Configuration", function () {
    it("Should have correct token, timelock, and name", async function () {
      expect(await governor.token()).to.equal(await noruToken.getAddress());
      expect(await governor.timelock()).to.equal(await timelock.getAddress());
      expect(await governor.name()).to.equal(GOVERNOR_NAME);
    });

    it("TimelockController should have Governor as Proposer and Canceller", async function () {
      expect(await timelock.hasRole(PROPOSER_ROLE, await governor.getAddress())).to.be.true;
      expect(await timelock.hasRole(CANCELLER_ROLE, await governor.getAddress())).to.be.true;
      expect(await timelock.hasRole(EXECUTOR_ROLE, ethers.ZeroAddress)).to.be.true;
      expect(await timelock.hasRole(TIMELOCK_ADMIN_ROLE, await governor.getAddress())).to.be.true;
      expect(await timelock.hasRole(TIMELOCK_ADMIN_ROLE, owner.address)).to.be.false; // Owner renounced
    });

    it("TargetContract should be owned by Timelock", async function () {
        expect(await targetContract.owner()).to.equal(await timelock.getAddress());
    });
  });

  describe("Proposal Lifecycle", function () {
    it("Should allow proposal creation, voting, queuing, and execution", async function () {
      const newValue = 777;
      const proposalDescription = "Proposal #1: Set SimpleTarget value to 777";
      const proposalDescriptionHash = ethers.id(proposalDescription); // For event checking

      // Encode the function call to targetContract.setValue(newValue)
      const calldata = targetContract.interface.encodeFunctionData("setValue", [newValue]);
      
      // 1. Create Proposal
      const proposeTx = await governor
        .connect(proposer)
        .propose([await targetContract.getAddress()], [0], [calldata], proposalDescription);
      const receipt = await proposeTx.wait();
      
      let proposalId: any;
      if (receipt && receipt.logs) {
         const event = governor.interface.parseLog(receipt.logs.find(log => log.address === await governor.getAddress() && governor.interface.parseLog(log as any)?.name === "ProposalCreated") as any);
         if (event) proposalId = event.args.proposalId;
      }
      expect(proposalId).to.not.be.undefined;

      // Wait for voting delay (1 block in default Governor settings)
      await network.provider.send("evm_mine"); 
      expect(await governor.state(proposalId)).to.equal(1); // Active

      // 2. Vote
      await governor.connect(voter1).castVote(proposalId, 1); // For
      await governor.connect(voter2).castVote(proposalId, 1); // For
      await governor.connect(voter3).castVote(proposalId, 0); // Against
      await governor.connect(proposer).castVote(proposalId, 1); // For

      for (let i = 0; i < (Number(await governor.votingPeriod()) + 1); i++) {
        await network.provider.send("evm_mine");
      }
      expect(await governor.state(proposalId)).to.equal(4); // Succeeded

      // 3. Queue Proposal
      const queueTx = await governor.connect(proposer).queue([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash);
      await queueTx.wait();
      expect(await governor.state(proposalId)).to.equal(5); // Queued

      // Fast-forward past timelock delay
      await network.provider.send("evm_increaseTime", [TIMELOCK_MIN_DELAY + 1]);
      await network.provider.send("evm_mine");

      // 4. Execute Proposal
      const executeTx = await governor.connect(proposer).execute([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash);
      await executeTx.wait();
      expect(await governor.state(proposalId)).to.equal(7); // Executed

      // Verify the action on SimpleTarget
      expect(await targetContract.value()).to.equal(newValue);
      expect(await targetContract.lastAction()).to.equal("setValue");
    });

    it("Should handle a proposal that fails due to insufficient 'For' votes", async function () {
      const proposalDescription = "Proposal #Fail: This proposal should be defeated";
      const proposalDescriptionHash = ethers.id(proposalDescription);
      const calldata = targetContract.interface.encodeFunctionData("setValue", [100]); // Arbitrary action

      // 1. Create Proposal
      const proposeTx = await governor
        .connect(proposer)
        .propose([await targetContract.getAddress()], [0], [calldata], proposalDescription);
      const receipt = await proposeTx.wait();
      let proposalId: any;
      if (receipt && receipt.logs) {
        const event = governor.interface.parseLog(receipt.logs.find(log => log.address === await governor.getAddress() && governor.interface.parseLog(log as any)?.name === "ProposalCreated") as any);
        if (event) proposalId = event.args.proposalId;
      }
      expect(proposalId).to.not.be.undefined;

      // Wait for voting delay
      await network.provider.send("evm_mine");
      expect(await governor.state(proposalId)).to.equal(1); // Active

      // 2. Vote such that it fails (e.g., 1 For, 2 Against)
      await governor.connect(voter1).castVote(proposalId, 1); // For
      await governor.connect(voter2).castVote(proposalId, 0); // Against
      await governor.connect(voter3).castVote(proposalId, 0); // Against
      // Proposer votes for (optional, could be against or abstain)
      await governor.connect(proposer).castVote(proposalId, 1); // For
      // Total: 2 For (proposer, voter1), 2 Against (voter2, voter3). If threshold is >0, this might pass depending on tie-breaking.
      // Let's make it definitively fail: 1 For, 3 Against
      // Re-vote proposer to make it simple:
      // await governor.connect(proposer).castVote(proposalId, 0); // Proposer votes against. Now 1 For, 3 Against.

      // Fast-forward past voting period
      for (let i = 0; i < (Number(await governor.votingPeriod()) + 1); i++) {
        await network.provider.send("evm_mine");
      }
      
      // State 3 is "Defeated"
      expect(await governor.state(proposalId)).to.equal(3);

      // 3. Attempt to Queue (should fail)
      await expect(
        governor.connect(proposer).queue([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash)
      ).to.be.revertedWith("Governor: proposal not successful");

      // 4. Attempt to Execute (should fail)
      await expect(
        governor.connect(proposer).execute([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash)
      ).to.be.revertedWith("Governor: proposal not successful");
    });

    it("Should allow admin to cancel a proposal before it's executed", async function () {
      const proposalDescription = "Proposal #2: Test cancellation";
      const calldata = targetContract.interface.encodeFunctionData("performAction", ["TestCancel"]);
      
      const proposeTx = await governor.connect(proposer).propose([await targetContract.getAddress()], [0], [calldata], proposalDescription);
      const receipt = await proposeTx.wait();
      let proposalId: any;
      if (receipt && receipt.logs) {
         const event = governor.interface.parseLog(receipt.logs.find(log => log.address === await governor.getAddress() && governor.interface.parseLog(log as any)?.name === "ProposalCreated") as any);
         if (event) proposalId = event.args.proposalId;
      }
      expect(proposalId).to.not.be.undefined;

      const proposalDescriptionHash = ethers.id(proposalDescription);
      await expect(governor.connect(owner).cancel([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash))
        .to.emit(governor, "ProposalCanceled").withArgs(proposalId);

      expect(await governor.state(proposalId)).to.equal(2); // Canceled
    });
  });

  describe("Upgradeability", function () {
    it("Should be upgradeable by an admin", async function () {
      const DPPGovernorV2Factory = await ethers.getContractFactory("DPPGovernorV2"); 
      const governorAddress = await governor.getAddress();
      
      const upgradedGovernor = (await upgrades.upgradeProxy(
        governorAddress,
        DPPGovernorV2Factory,
      )) as unknown as DPPGovernorV2;
      await upgradedGovernor.waitForDeployment();

      expect(await upgradedGovernor.getAddress()).to.equal(governorAddress);
      expect(await upgradedGovernor.version()).to.equal("V2");
    });
  });
});


// Dummy DPPGovernorV2.sol for upgradeability testing
/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DPPGovernor.sol";

contract DPPGovernorV2 is DPPGovernor {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // V2 Initializer if needed for new state variables, called via upgradeToAndCall
    // function initializeV2() public reinitializer(2) {
    //     // V2 specific initialization
    // }

    function version() public pure returns (string memory) {
        return "V2";
    }
}
*/

